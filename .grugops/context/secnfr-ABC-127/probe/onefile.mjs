// secnfr-ABC-127 supplement: CPU of src/puzzle-suite.test.ts run ALONE (`npx vitest run <file>`) in three
// out-of-tree arms: A = tip 1087a42, N = byte-identical copy of A (null), B = base 4a64dd9. One fresh
// process per run, order rotated every round, round 0 discarded, test count asserted per arm.
// A-B = the content ABC-127 adds to the default lane (no new file, so no floor). Not the N8-LANE instrument.
import { execSync, spawnSync } from "node:child_process";
import { appendFileSync, writeFileSync } from "node:fs";

const ARMS = process.env.ARMS;
const OUT = process.env.OUT;
const ROUNDS = Number(process.env.ROUNDS ?? 13);
const FILE = "src/puzzle-suite.test.ts";
const C = ["A", "N", "B"];
const load1 = () => Number(execSync("sysctl -n vm.loadavg").toString().replace(/[{}]/g, "").trim().split(/\s+/)[0]);
const rows = [];
const expected = {};
writeFileSync(OUT, "round\tcond\twall\tcpu\ttests\tload1\tutc\tstatus\n");
for (let round = 0; round < ROUNDS; round++) {
  const k = round % C.length;
  const order = [...C.slice(k), ...C.slice(0, k)];
  for (const c of order) {
    const lb = load1();
    const utc = new Date().toISOString();
    const r = spawnSync("/usr/bin/time", ["-p", "npx", "vitest", "run", FILE], { cwd: `${ARMS}/${c}`, encoding: "utf8" });
    const pick = (key) => Number((r.stderr.match(new RegExp(`^${key}\\s+([0-9.]+)`, "m")) ?? [])[1]);
    const t = Number(((r.stdout ?? "").match(/^\s*Tests\s+(\d+) passed/m) ?? [])[1]);
    if (round === 0) expected[c] = t;
    const ok = r.status === 0 && t === expected[c] ? "ok" : "HARNESS_ERROR";
    const cpu = +(pick("user") + pick("sys")).toFixed(2);
    rows.push({ round, c, cpu, wall: pick("real"), t, lb, ok });
    appendFileSync(OUT, `${[round, c, pick("real"), cpu, t, lb, utc, ok].join("\t")}\n`);
  }
}
const med = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const use = rows.filter((r) => r.round > 0);
for (const c of C) {
  const x = use.filter((r) => r.c === c);
  console.log(`${c}: tests=${x[0].t} medianCPU=${med(x.map((r) => r.cpu))} range=${Math.min(...x.map((r) => r.cpu))}-${Math.max(...x.map((r) => r.cpu))} medianWALL=${med(x.map((r) => r.wall))}`);
}
for (const [x, y, label] of [["A", "N", "NULL N-A"], ["B", "A", "CONTENT A-B"]]) {
  const d = [];
  for (let round = 1; round < ROUNDS; round++)
    d.push(+(use.find((r) => r.round === round && r.c === y).cpu - use.find((r) => r.round === round && r.c === x).cpu).toFixed(2));
  console.log(`${label} CPU per round: ${d.join(" ")} median=${med(d).toFixed(3)} sign+ ${d.filter((v) => v > 0).length}/${d.length}`);
}
console.log(`load1: min=${Math.min(...rows.map((r) => r.lb))} median=${med(rows.map((r) => r.lb))} max=${Math.max(...rows.map((r) => r.lb))}; harness errors=${rows.filter((r) => r.ok !== "ok").length} of ${rows.length}`);
