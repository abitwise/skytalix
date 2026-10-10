// Security/NFR ABC-058: the CONTENT the S5 change adds to one run of src/cli.test.ts is one extra
// `executableCodeOf("cli.test.ts")` (two regex replaces) in place of `sourceOf`. Time exactly that,
// in-process, CPU (process.cpuUsage user+sys), per call. The S4 change adds two argv bytes to an
// existing child: no separate work to time. Usage: node content-cost.mjs <tree-root> <rounds>
import { readFileSync } from "node:fs";
import { loadavg } from "node:os";
const [root, roundsArg] = process.argv.slice(2);
const rounds = Number(roundsArg ?? 9);
const source = readFileSync(`${root}/src/cli.test.ts`, "utf8");
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
const perRound = [];
for (let r = 0; r < rounds; r++) {
  const before = process.cpuUsage();
  const calls = 50;
  let sink = 0;
  for (let i = 0; i < calls; i++) sink += strip(source).length;
  const used = process.cpuUsage(before);
  perRound.push((used.user + used.system) / 1000 / calls);
  if (sink === 0) throw new Error("vacuous");
}
const scored = perRound.slice(1).sort((a, b) => a - b);
console.log(`file ${source.length} chars, stripped ${strip(source).length}; load1 ${loadavg()[0].toFixed(2)}`);
console.log(`per call CPU ms, round 0 discarded, sorted: ${scored.map((x) => x.toFixed(3)).join(" ")}`);
console.log(`median ${scored[Math.floor(scored.length / 2)].toFixed(3)} ms, max ${scored.at(-1).toFixed(3)} ms; bound N8-LANE 650 ms`);
