// ABC-121 lane re-hop: where the "unattributed ~1 s" goes. In a copy of arm A (outside the
// repository), search.pvs-lmr.test.ts gets a beforeAll/afterAll pair that reads process.cpuUsage()
// (PROCESS-wide: every thread, JIT and GC helpers included) and the wall clock around ALL of the
// file's test bodies, and a beforeEach/afterEach pair that sums the per-test wall time vitest would
// report. The file runs alone, ROUNDS times, one fresh process each. Prints CPU-during-bodies vs
// wall-of-bodies, and the ratio.
import { spawnSync } from "node:child_process";
import { cpSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";

const S = "/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/cc8144c4-cb23-42b5-90b8-44bcbd8a2345/scratchpad/sw121lane";
const F = "src/search.pvs-lmr.test.ts";
const ROUNDS = Number(process.env.ROUNDS ?? 5);
const P = `${S}/P`;
rmSync(P, { recursive: true, force: true });
mkdirSync(P);
for (const f of ["src", "package.json", "tsconfig.json", "vitest.config.ts"]) cpSync(`${S}/${process.env.ARM ?? "A"}/${f}`, `${P}/${f}`, { recursive: true });
symlinkSync(`${S}/A/node_modules`, `${P}/node_modules`);
const src = readFileSync(`${P}/${F}`, "utf8");
const hook = `
import { afterAll as __aa, afterEach as __ae, beforeAll as __ba, beforeEach as __be } from "vitest";
let __c0: NodeJS.CpuUsage; let __w0 = 0n; let __t0 = 0n; let __tests = 0n;
__ba(() => { __c0 = process.cpuUsage(); __w0 = process.hrtime.bigint(); });
__be(() => { __t0 = process.hrtime.bigint(); });
__ae(() => { __tests += process.hrtime.bigint() - __t0; });
__aa(() => {
  const c = process.cpuUsage(__c0);
  const w = Number(process.hrtime.bigint() - __w0) / 1e6;
  process.stderr.write(\`CPUPROBE cpu_ms=\${((c.user + c.system) / 1000).toFixed(0)} wall_ms=\${w.toFixed(0)} tests_ms=\${(Number(__tests) / 1e6).toFixed(0)}\\n\`);
});
`;
writeFileSync(`${P}/${F}`, src + hook);
const rows = [];
for (let i = 0; i < ROUNDS; i++) {
  const r = spawnSync("npx", ["vitest", "run", F], { cwd: P, encoding: "utf8" });
  const m = (r.stderr + r.stdout).match(/CPUPROBE cpu_ms=(\d+) wall_ms=(\d+) tests_ms=(\d+)/);
  if (!m || r.status !== 0) throw new Error(`run ${i} failed: ${(r.stderr + r.stdout).slice(-1500)}`);
  rows.push([+m[1], +m[2], +m[3]]);
  console.log(`run ${i}: cpu during bodies ${m[1]} ms, wall of bodies ${m[2]} ms, sum of per-test wall ${m[3]} ms, ratio ${(m[1] / m[2]).toFixed(2)}`);
}
const med = (xs) => { const s = [...xs].sort((a, b) => a - b); const k = s.length >> 1; return s.length % 2 ? s[k] : (s[k - 1] + s[k]) / 2; };
console.log(`median: cpu ${med(rows.map((r) => r[0]))} ms, wall ${med(rows.map((r) => r[1]))} ms, per-test sum ${med(rows.map((r) => r[2]))} ms, cpu/wall ${med(rows.map((r) => r[0] / r[1])).toFixed(2)}`);
