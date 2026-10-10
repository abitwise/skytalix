// ABC-127 N8-LANE probe, in the shape of secnfr-ABC-084's harness (raw-harness-lane.mjs.txt):
// out-of-tree arms (git archive, node_modules symlinked): A = build tip, N = a second copy of A
// (null control), B = base. One fresh process per run, order rotated per round, round 0 discarded,
// file/test counts asserted per run, load gate before each round. CPU = user + sys (/usr/bin/time -p).
// Usage: ARMS=<dir with A,N,B> TAG=<name> ROUNDS=9 CMD=lane|file node n8-lane.mjs
import { execSync, spawnSync } from "node:child_process";
import { appendFileSync, writeFileSync, readFileSync } from "node:fs";
const S = process.env.ARMS, TAG = process.env.TAG ?? "run", ROUNDS = Number(process.env.ROUNDS ?? 9);
const LMAX = Number(process.env.LMAX ?? 6), WAITMAX = Number(process.env.WAITMAX ?? 120);
const CMD = process.env.CMD ?? "lane";
const CONDS = (process.env.CONDS ?? "A,N,B").split(",");
const OUT = `${S}/${TAG}.tsv`;
const load1 = () => Number(execSync("sysctl -n vm.loadavg").toString().trim().split(/\s+/)[1]);
const args = CMD === "lane" ? ["vitest", "run", "--dir", "src"] : ["vitest", "run", "src/puzzle-suite.test.ts"];
writeFileSync(OUT, "round\tcond\twall\tuser\tsys\tcpu\tfiles\ttests\tload1_before\tload1_after\twaited_s\tutc\tstatus\n");
const expect = {};
for (let round = 0; round < ROUNDS; round++) {
  let waited = 0;
  while (load1() >= LMAX && waited < WAITMAX) { execSync("sleep 10"); waited += 10; }
  const k = round % CONDS.length;
  for (const c of [...CONDS.slice(k), ...CONDS.slice(0, k)]) {
    const lb = load1(), utc = new Date().toISOString();
    const env = { ...process.env }; delete env.PUZZLE_DEEP;
    const r = spawnSync("/usr/bin/time", ["-p", "npx", ...args], { cwd: `${S}/${c}`, encoding: "utf8", env, maxBuffer: 64 << 20 });
    const out = r.stdout || "", err = r.stderr || "";
    const pick = (key) => { const m = err.match(new RegExp(`^${key}\\s+([0-9.]+)`, "m")); return m ? Number(m[1]) : NaN; };
    const files = Number(out.match(/Test Files\s+(\d+) passed/)?.[1] ?? NaN);
    const tests = Number(out.match(/^\s*Tests\s+(\d+) passed/m)?.[1] ?? NaN);
    if (round === 0) expect[c] = { files, tests };
    const ok = r.status === 0 && files === expect[c].files && tests === expect[c].tests ? "ok" : "HARNESS_ERROR";
    const cpu = +(pick("user") + pick("sys")).toFixed(2);
    appendFileSync(OUT, [round, c, pick("real"), pick("user"), pick("sys"), cpu, files, tests, lb, load1(), waited, utc, ok].join("\t") + "\n");
    console.log(round, c, cpu, pick("real"), files, tests, lb, waited, ok);
    waited = 0;
  }
}
const rows = readFileSync(OUT, "utf8").trim().split("\n").slice(1).map((l) => l.split("\t")).map(([round, cond, wall, , , cpu, files, tests, lb, , , , ok]) => ({ round: +round, cond, wall: +wall, cpu: +cpu, files: +files, tests: +tests, lb: +lb, ok })).filter((r) => r.round >= 1);
const med = (xs) => { const s = [...xs].sort((a, b) => a - b), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const by = (c, round) => rows.find((r) => r.cond === c && r.round === round);
const rounds = [...new Set(rows.map((r) => r.round))];
const pair = (x, y) => { const d = rounds.map((r) => by(x, r).cpu - by(y, r).cpu); return { med: +(med(d) * 1000).toFixed(0), pos: d.filter((v) => v > 0).length, n: d.length }; };
const out = [];
for (const c of CONDS) out.push(`${c}: files ${expect[c].files} tests ${expect[c].tests} median cpu ${med(rows.filter((r) => r.cond === c).map((r) => r.cpu))} s wall ${med(rows.filter((r) => r.cond === c).map((r) => r.wall))} s`);
if (CONDS.includes("N")) { const n = rounds.map((r) => (by("N", r).cpu - by("A", r).cpu) / by("A", r).cpu); out.push(`null N-A median ${(med(n) * 100).toFixed(2)} %`); }
if (CONDS.includes("B")) { const p = pair("A", "B"); out.push(`A-B gross median ${p.med} ms, sign ${p.pos}/${p.n}`); }
out.push(`load1 before runs: min ${Math.min(...rows.map((r) => r.lb))} median ${med(rows.map((r) => r.lb))} max ${Math.max(...rows.map((r) => r.lb))}; harness errors ${rows.filter((r) => r.ok !== "ok").length}`);
console.log(out.join("\n"));
writeFileSync(`${S}/${TAG}.summary.txt`, `${out.join("\n")}\n`);
