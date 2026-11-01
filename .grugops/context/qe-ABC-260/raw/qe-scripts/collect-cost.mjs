// qe-ABC-260: collect-time cost of reading + stripping the six files, old strip vs new; cold first call and median of 50.
import { readFileSync } from "node:fs";
const root = process.argv[2];
const files = ["engine", "search", "quiescence", "evaluate", "transposition", "levels"].map((f) => `${root}/src/${f}.ts`);
const oldS = (s) => s.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");
const newS = (s) => s.replace(/"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\[\s\S])*`|\/\*[\s\S]*?\*\/|\/\/.*$/gm, (t) => (t.startsWith("/") ? "" : t));
const run = (f) => { const t0 = performance.now(); for (const p of files) f(readFileSync(p, "utf8")); return performance.now() - t0; };
for (const [n, f] of [["new", newS], ["old", oldS]]) { const cold = run(f); const xs = Array.from({ length: 50 }, () => run(f)).sort((a, b) => a - b); console.log(`${n}: cold ${cold.toFixed(3)} ms, median ${xs[25].toFixed(3)} ms, max ${xs.at(-1).toFixed(3)} ms (6 reads + strip)`); }
