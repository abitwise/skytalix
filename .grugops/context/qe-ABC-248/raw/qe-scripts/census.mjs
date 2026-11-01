// qe-ABC-248 A7 node census + T2c non-vacuity + A4-a2 info line, in a SCRATCH copy (cp -al; edited files rm'd first).
// Production: deepen's return adds budget.nodes to a global (as qe-ABC-244 census.mjs). Tests: per-test hooks write
// "<name>\t<nodes>\t<searches>" to census-<label>.tsv; QE-208-b's search() row adds search()'s own SearchResult.nodes;
// QE-208-a / QE-208-b / A4-a2 append their insideNull+mutated / underNull+stale / info lines to probe-<label>.txt.
// The two files run in the default lane (ENGINE_DEEP / SEARCH_DEEP unset), heap 128 (two files).
// usage: node census.mjs <tree> <label> <outDir>
import { execFileSync, spawnSync } from "node:child_process";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [tree, label, outDir] = process.argv.slice(2);
const dir = join(outDir, `census-tree-${label}`);
rmSync(dir, { recursive: true, force: true });
execFileSync("cp", ["-al", tree, dir]);
const tsv = join(outDir, `census-${label}.tsv`);
const probe = join(outDir, `probe-${label}.txt`);
rmSync(tsv, { force: true });
rmSync(probe, { force: true });
const edit = (file, from, to, all = false) => {
  const p = join(dir, file);
  const t = readFileSync(p, "utf8");
  const n = t.split(from).length - 1;
  if (all ? n < 1 : n !== 1) throw new Error(`anchor ${file}: ${n} x ${from.slice(0, 60)}`);
  rmSync(p);
  writeFileSync(p, all ? t.split(from).join(to) : t.replace(from, to));
  return n;
};
const G = "(globalThis as any)";
const anchor = "  return {\n    move: best.move,\n    score: best.score,\n    depth: reached,\n    nodes: budget.nodes,";
edit("src/engine.ts", anchor, `  ${G}.__n248 = (${G}.__n248 ?? 0) + budget.nodes;\n  ${G}.__s248 = (${G}.__s248 ?? 0) + 1;\n${anchor}`);
const hooks = `
import { afterEach as __ae, beforeEach as __be } from "vitest";
import { appendFileSync as __a } from "node:fs";
let __c = 0, __k = 0;
__be(() => { __c = ${G}.__n248 ?? 0; __k = ${G}.__s248 ?? 0; });
__ae(() => { __a(${JSON.stringify(tsv)}, \`\${expect.getState().currentTestName}\\t\${(${G}.__n248 ?? 0) - __c}\\t\${(${G}.__s248 ?? 0) - __k}\\n\`); });
const __p = (s: string) => __a(${JSON.stringify(probe)}, \`\${expect.getState().currentTestName}\\t\${s}\\n\`);
`;
const imp = 'import { afterEach, describe, expect, it, vi } from "vitest";\n';
edit("src/uci-session.test.ts", imp, imp + hooks);
edit("src/search.null-move.test.ts", imp, imp + hooks);
edit(
  "src/search.null-move.test.ts",
  "watch(position, () => search(position, 6))",
  `watch(position, () => { const __r = search(position, 6); ${G}.__n248 = (${G}.__n248 ?? 0) + __r.nodes; ${G}.__s248 = (${G}.__s248 ?? 0) + 1; return __r; })`,
);
edit("src/search.null-move.test.ts", "    expect(mutated).toEqual([]);\n", "    __p(JSON.stringify({ insideNull, mutated }));\n    expect(mutated).toEqual([]);\n");
const nStale = edit("src/search.null-move.test.ts", "    expect(stale).toEqual([]);\n", "    __p(JSON.stringify({ underNull, stale }));\n    expect(stale).toEqual([]);\n", true);
edit("src/uci-session.test.ts", "    const lines = perLine[1] as string[];\n    expect(lines).toHaveLength(3);\n    expect(lines[0]).toMatch(/^info string /);", "    const lines = perLine[1] as string[];\n    __p(JSON.stringify(lines));\n    expect(lines).toHaveLength(3);\n    expect(lines[0]).toMatch(/^info string /);");
const env = { ...process.env, NODE_OPTIONS: "--max-old-space-size=128" };
for (const k of ["ENGINE_DEEP", "SEARCH_DEEP", "VITEST_MAX_WORKERS"]) delete env[k];
const r = spawnSync("node_modules/.bin/vitest", ["run", "src/search.null-move.test.ts", "src/uci-session.test.ts"], {
  cwd: dir, encoding: "utf8", maxBuffer: 256 * 1024 * 1024, env, timeout: 600_000, killSignal: "SIGTERM",
});
console.log(label, "exit", r.status, "stale-anchors", nStale, (r.stdout.match(/Tests .*/) ?? [""])[0]);
rmSync(dir, { recursive: true, force: true });
