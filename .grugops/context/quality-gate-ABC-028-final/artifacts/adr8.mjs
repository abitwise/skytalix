// ADR-0008's two RATIFIED clauses on the tip, and A5's content cost by the runner's own per-test
// timer (a DIFFERENT instrument from the bar's user+sys, reported as such and not dressed up).
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
const HERE = dirname(new URL(import.meta.url).pathname);
const ROOT = join(HERE, "n8/with");
const median = (v) => { const s=[...v].sort((a,b)=>a-b); const m=s.length>>1; return s.length%2?s[m]:(s[m-1]+s[m])/2; };
const wall = [], cpu = [], a5 = [];
for (let run = 0; run < 7; run++) {
  const report = join(ROOT, "__d.json");
  const out = execFileSync("/bin/sh", ["-c",
    `cd ${ROOT} && /usr/bin/time -p npx vitest run --reporter=json --outputFile=${report} >/dev/null 2>__t.txt; cat __t.txt`],
    { encoding: "utf8" });
  wall.push(Number(/real\s+([0-9.]+)/.exec(out)[1]));
  cpu.push(Number(/user\s+([0-9.]+)/.exec(out)[1]) + Number(/sys\s+([0-9.]+)/.exec(out)[1]));
  const json = JSON.parse(readFileSync(report, "utf8"));
  const rows = json.testResults.flatMap((f) => f.assertionResults)
    .filter((t) => t.ancestorTitles[0] === "ABC-028 acceptance" && t.title.startsWith("A5 —"));
  a5.push(rows.reduce((sum, t) => sum + t.duration, 0));
  process.stdout.write(`run ${run + 1}: wall ${wall.at(-1)}s cpu ${cpu.at(-1).toFixed(2)}s  A5 rows ${rows.length} total ${a5.at(-1).toFixed(2)}ms\n`);
}
console.log(`\nPERFT_DEEP unset, n=7, on this tip:`);
console.log(`  wall  median ${median(wall).toFixed(2)} s   range ${Math.min(...wall)}..${Math.max(...wall)}   bar <= 3 s`);
console.log(`  CPU   median ${median(cpu).toFixed(2)} s   range ${Math.min(...cpu).toFixed(2)}..${Math.max(...cpu).toFixed(2)}   bar <= 13 s`);
console.log(`  A5 both rows, runner per-test WALL (not user+sys): median ${median(a5).toFixed(2)} ms  range ${Math.min(...a5).toFixed(2)}..${Math.max(...a5).toFixed(2)}`);
