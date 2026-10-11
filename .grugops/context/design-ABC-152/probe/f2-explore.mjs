// design-ABC-152 F2: POST-HOC EXPLORATION, NOT PRE-REGISTERED, RULES NOTHING. Run after F1 showed the
// split fires. It sizes what a runner-off route would need beyond R1-R3, for the owner's information only.
// R4 (post-hoc): a top-level `const { a, b } = await import("p");` that follows a `vi.mock` ->
//   `import { a, b } from "p";` (a static import, which the native loader's hoisting does order after the mocks).
// Usage: node f2-explore.mjs <scratch tree that already has F1's rewrites>
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const TREE = process.argv[2];
const files = [
  "gameend.nfr", "history-pane.nfr", "glyph-mode.nfr", "san.nfr", "turn-loop.nfr",
  "status-panel.nfr", "zobrist.nfr", "turn-loop",
].map((f) => `src/${f}.test.ts`);
const re = /^const (\{[^}]*\}) = await import\(\s*("[^"]+")\s*\);\n/gm;
for (const file of files) {
  const path = join(TREE, file);
  const s = readFileSync(path, "utf8");
  let n = 0;
  const out = s.replace(re, (_m, names, spec) => {
    n++;
    return `import ${names.replace(/\s+/g, " ")} from ${spec};\n`;
  });
  writeFileSync(path, out);
  console.log(`${file}: ${n} dynamic imports -> static`);
}
