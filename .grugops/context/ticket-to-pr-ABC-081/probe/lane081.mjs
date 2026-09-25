// ABC-081 build hop, re-using secnfr-ABC-079's NFR-008 / N8-LANE harness under NFR-008's own protocol (ADR-0019 decision 3
// shape): contained lane `npx vitest run --dir src`, one fresh OS process per run, condition
// order rotated every round, ROUNDS rounds with round 0 discarded, counts asserted per run
// (round 0 fixes each arm's expected counts), identity null control N vs A.
// Arms: A = 0076e6a (ABC-081); N = byte-identical copy; B = 6033d05 (base, pre-table).
// Lives outside the repository; no git anywhere in it.
import { execSync, spawnSync } from "node:child_process";
import { appendFileSync, readFileSync, writeFileSync } from "node:fs";

const S = "/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/cc8144c4-cb23-42b5-90b8-44bcbd8a2345/scratchpad/lane081";
const ROUNDS = Number(process.env.ROUNDS ?? 9);
const CONDS = ["A", "N", "B"];
const OUT = `${S}/raw.tsv`;
const loadavg = () => execSync("sysctl -n vm.loadavg").toString().trim();
const load1 = () => Number(loadavg().split(/\s+/)[1]);

writeFileSync(OUT, "round\tcond\twall\tuser\tsys\tcpu\tfiles\ttests\tload1_before\tload1_after\tstatus\n");
writeFileSync(`${S}/load.txt`, "");
const expect = {};
for (let round = 0; round < ROUNDS; round++) {
  const k = round % CONDS.length;
  const order = [...CONDS.slice(k), ...CONDS.slice(0, k)];
  appendFileSync(`${S}/load.txt`, `ROUND ${round} start ${loadavg()} order ${order.join("")}\n`);
  for (const c of order) {
    const lb = load1();
    const r = spawnSync("/usr/bin/time", ["-p", "npx", "vitest", "run", "--dir", "src"], { cwd: `${S}/${c}`, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
    const la = load1();
    const out = r.stdout || "";
    const err = r.stderr || "";
    const pick = (key) => { const m = err.match(new RegExp(`^${key}\\s+([0-9.]+)`, "m")); return m ? Number(m[1]) : Number.NaN; };
    const fm = out.match(/Test Files\s+(\d+) passed/);
    const tm = out.match(/^\s*Tests\s+(\d+) passed/m);
    const files = fm ? Number(fm[1]) : Number.NaN;
    const tests = tm ? Number(tm[1]) : Number.NaN;
    if (round === 0) expect[c] = { files, tests };
    const ok = r.status === 0 && files === expect[c].files && tests === expect[c].tests && !/failed/.test(out.split("Test Files")[1] ?? "") ? "ok" : "HARNESS_ERROR";
    const cpu = +(pick("user") + pick("sys")).toFixed(2);
    appendFileSync(OUT, [round, c, pick("real"), pick("user"), pick("sys"), cpu, files, tests, lb, la, ok].join("\t") + "\n");
    console.log(round, c, cpu, pick("real"), files, tests, lb, ok);
  }
}

const rows = readFileSync(OUT, "utf8").trim().split("\n").slice(1).map((l) => {
  const [round, cond, wall, user, sys, cpu, files, tests, lb, la, ok] = l.split("\t");
  return { round: +round, cond, wall: +wall, cpu: +cpu, files: +files, tests: +tests, lb: +lb, la: +la, ok };
});
const med = (xs) => { const s = [...xs].sort((a, b) => a - b); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const use = rows.filter((r) => r.round >= 1);
const lines = [];
for (const c of CONDS) {
  const rs = use.filter((r) => r.cond === c);
  lines.push(`${c}: n=${rs.length} files/tests=${rs[0].files}/${rs[0].tests} medianCPU=${med(rs.map((r) => r.cpu)).toFixed(3)} rangeCPU=${Math.min(...rs.map((r) => r.cpu))}-${Math.max(...rs.map((r) => r.cpu))} medianWALL=${med(rs.map((r) => r.wall)).toFixed(3)} rangeWALL=${Math.min(...rs.map((r) => r.wall))}-${Math.max(...rs.map((r) => r.wall))}`);
}
const paired = (x, y) => {
  const d = [];
  for (let round = 1; round < ROUNDS; round++) {
    const a = use.find((r) => r.round === round && r.cond === x);
    const b = use.find((r) => r.round === round && r.cond === y);
    d.push({ dcpu: +(b.cpu - a.cpu).toFixed(2), dwall: +(b.wall - a.wall).toFixed(2) });
  }
  return d;
};
const mA = med(use.filter((r) => r.cond === "A").map((r) => r.cpu));
for (const [x, y, label] of [["A", "N", "NULL CONTROL N-A"], ["B", "A", "CHARGE A-B (ABC-081)"]]) {
  const d = paired(x, y);
  const dm = med(d.map((v) => v.dcpu));
  lines.push(`${label} CPU per round: ${d.map((v) => v.dcpu).join(" ")} median=${dm.toFixed(3)} (${((100 * dm) / mA).toFixed(2)}% of A) sign+ ${d.filter((v) => v.dcpu > 0).length}/${d.length}`);
  lines.push(`${label} WALL per round: ${d.map((v) => v.dwall).join(" ")} median=${med(d.map((v) => v.dwall)).toFixed(3)}`);
}
lines.push(`load1 before each run: min=${Math.min(...rows.map((r) => r.lb))} median=${med(rows.map((r) => r.lb)).toFixed(2)} max=${Math.max(...rows.map((r) => r.lb))}`);
lines.push(`harness errors: ${rows.filter((r) => r.ok !== "ok").length} of ${rows.length}`);
writeFileSync(`${S}/summary.txt`, lines.join("\n") + "\n");
console.log(lines.join("\n"));
