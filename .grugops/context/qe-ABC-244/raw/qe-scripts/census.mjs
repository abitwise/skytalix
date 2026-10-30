// qe-ABC-244 A7 node census (from ticket-to-pr-ABC-177 probe/census.mjs): instrument deepen's return and add per-test
// hooks in a SCRATCH copy of a tree; nodes only, no timing. usage: QE244_NM=<node_modules> node census.mjs <tree> <label> <outDir>
import { cpSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
const [tree, label, outDir] = process.argv.slice(2);
const dir = join(outDir, `census-tree-${label}`);
rmSync(dir, { recursive: true, force: true });
mkdirSync(dir, { recursive: true });
cpSync(tree, dir, { recursive: true, filter: (s) => !s.endsWith("/node_modules") });
symlinkSync(process.env.QE244_NM, join(dir, "node_modules"));
const edit = (file, from, to) => {
  const p = join(dir, file), t = readFileSync(p, "utf8");
  if (t.split(from).length !== 2) throw new Error(`anchor ${file}`);
  writeFileSync(p, t.replace(from, to));
};
const anchor = "  return {\n    move: best.move,\n    score: best.score,\n    depth: reached,\n    nodes: budget.nodes,";
edit("src/engine.ts", anchor, "  (globalThis as any).__n244 = ((globalThis as any).__n244 ?? 0) + budget.nodes;\n  (globalThis as any).__s244 = ((globalThis as any).__s244 ?? 0) + 1;\n" + anchor);
const out = join(outDir, `census-${label}.tsv`);
rmSync(out, { force: true });
const hooks = `
import { afterEach as __ae, beforeEach as __be } from "vitest";
import { appendFileSync as __a } from "node:fs";
let __c = 0, __k = 0;
__be(() => { __c = (globalThis as any).__n244 ?? 0; __k = (globalThis as any).__s244 ?? 0; });
__ae(() => { __a(${JSON.stringify(out)}, \`\${expect.getState().currentTestName}\\t\${((globalThis as any).__n244 ?? 0) - __c}\\t\${((globalThis as any).__s244 ?? 0) - __k}\\n\`); });
`;
edit("src/cli.test.ts", 'import { afterAll, describe, expect, inject, it, vi } from "vitest";\n', 'import { afterAll, describe, expect, inject, it, vi } from "vitest";\n' + hooks);
edit("src/uci-session.test.ts", 'import { afterEach, describe, expect, it, vi } from "vitest";\n', 'import { afterEach, describe, expect, it, vi } from "vitest";\n' + hooks);
const PATTERN = "ABC-230 A1, A3|ABC-241 A4, A7|ABC-230 A2, A3, A5|ABC-241 A4, A5";
const r = spawnSync("node_modules/.bin/vitest", ["run", "src/cli.test.ts", "src/uci-session.test.ts", "-t", PATTERN, "--testTimeout=120000"], {
  cwd: dir, encoding: "utf8", maxBuffer: 256 * 1024 * 1024, env: { ...process.env, NODE_OPTIONS: "--max-old-space-size=128" },
});
console.log(label, "exit", r.status, (r.stdout.match(/Tests .*/) ?? [""])[0]);
rmSync(dir, { recursive: true, force: true });
