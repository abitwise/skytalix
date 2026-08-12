// WHICH WALL CLOCK DOES ADR-0008's "<= 3 s wall" CLAUSE NAME? Three instruments, same tree, same
// session, n=5 each. A bar quoted without its instrument has already produced a defect on this lane.
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
const ROOT = join(dirname(new URL(import.meta.url).pathname), "n8/with");
const median = (v) => { const s=[...v].sort((a,b)=>a-b); const m=s.length>>1; return s.length%2?s[m]:(s[m-1]+s[m])/2; };
const shells = [
  ["npm test              (the command ADR-0008 names)", "npm test"],
  ["node_modules/.bin/vitest run (no npm, no npx)", "./node_modules/.bin/vitest run"],
];
for (const [label, command] of shells) {
  const wall = [], cpu = [], self = [];
  for (let run = 0; run < 5; run++) {
    const out = execFileSync("/bin/sh", ["-c",
      `cd ${ROOT} && /usr/bin/time -p ${command} >__o.txt 2>__t.txt; cat __t.txt __o.txt`], { encoding: "utf8" });
    wall.push(Number(/real\s+([0-9.]+)/.exec(out)[1]));
    cpu.push(Number(/user\s+([0-9.]+)/.exec(out)[1]) + Number(/sys\s+([0-9.]+)/.exec(out)[1]));
    const reported = /Duration\s+([0-9.]+)s/.exec(out);
    self.push(reported ? Number(reported[1]) : Number.NaN);
  }
  console.log(`${label}`);
  console.log(`   process wall   median ${median(wall).toFixed(2)} s   ${Math.min(...wall)}..${Math.max(...wall)}`);
  console.log(`   process CPU    median ${median(cpu).toFixed(2)} s   ${Math.min(...cpu).toFixed(2)}..${Math.max(...cpu).toFixed(2)}`);
  console.log(`   vitest's own "Duration"  median ${median(self).toFixed(2)} s   ${Math.min(...self)}..${Math.max(...self)}`);
}
