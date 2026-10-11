// design-ABC-152 F3: POST-HOC EXPLORATION, NOT PRE-REGISTERED, RULES NOTHING (as F2).
// R5 (post-hoc): a factory whose body is only `...actual` plus `name: vi.fn(actual.name)` call-through
//   spies -> `vi.mock(p, { spy: true })`. Applied only to files still red after F2. Refuses any factory
//   with another shape (a stub), so nothing that changes behaviour is converted.
// Usage: node f3-explore.mjs <scratch tree that already has F2's rewrites> <file>...
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [TREE, ...files] = process.argv.slice(2);
const block = /^vi\.mock\(("[^"]+"), async \(importOriginal\) => \{\n([\s\S]*?)\n\}\);\n/gm;
for (const file of files) {
  const path = join(TREE, file);
  let n = 0;
  const out = readFileSync(path, "utf8").replace(block, (m, spec, body) => {
    const lines = body.split("\n").map((l) => l.trim()).filter(Boolean);
    const ok = lines.every((l) =>
      /^const actual = await importOriginal<typeof import\("[^"]+"\)>\(\);$/.test(l) ||
      /^return \{$|^\};$|^\.\.\.actual,$/.test(l) ||
      /^(return \{ \.\.\.actual, )?(\w+): vi\.fn\(actual\.\2\),?( \};)?$/.test(l),
    );
    if (!ok) throw new Error(`${file}: factory for ${spec} is not call-through only:\n${body}`);
    n++;
    return `vi.mock(${spec}, { spy: true });\n`;
  });
  writeFileSync(path, out);
  console.log(`${file}: ${n} call-through factories -> { spy: true }`);
}
