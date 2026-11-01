// qe-ABC-259: copied verbatim from qe-ABC-249 g8.mjs; the only edits are in host.mjs (QE-259).
// qe-ABC-249: copied from qe-ABC-248 g8.mjs; QE-249 edit: per-run alone flag from waitClear; a not-alone run makes the window inadmissible.
// qe-ABC-246 G8 (copied verbatim from qe-ABC-245 g8.mjs, which was copied from qe-ABC-242 g8.mjs; edits marked QE-245: tctl after each run, a top-CPU snapshot of other
// processes before each run, the thermal-stop median). Was: qe-ABC-243 / qe-ABC-244 / qe-ABC-229 g8.mjs.
// `npm test` wall, base and head interleaved b h h b b h, wait-clear (host.mjs) before every run.
// usage: node g8.mjs <headDir> <baseDir> <outDir> [order, default b h h b b h; W1 window: "head,head,head"]
import { execFileSync, spawnSync } from "node:child_process";
import { appendFileSync, copyFileSync, existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { loadavg } from "node:os";
import { join } from "node:path";
import { tctl, vitestPids, waitClear } from "./host.mjs";
const [head, base, out, orderArg] = process.argv.slice(2);
const ORDER = orderArg ? orderArg.split(",") : ["base", "head", "head", "base", "base", "head"]; // QE-246: optional order (W1 window)
const res = { base: [], head: [] }, cpus = { base: [], head: [] }, files = { base: [], head: [] };
const temps = []; // QE-245
const ts = () => new Date().toISOString();
const log = (s) => appendFileSync(join(out, "g8-wait.log"), `${ts()} ${s}\n`);
const childCpu = () => { const f = readFileSync("/proc/self/stat", "utf8").split(") ")[1].split(" "); return (Number(f[13]) + Number(f[14])) / 100; };
// QE-245: the busiest other processes (QE-221-c saw a foreign orphan at 100 % core during its ALONE window).
const topCpu = () => { try { return execFileSync("ps", ["-eo", "pid,pcpu,etime,comm", "--sort=-pcpu"], { encoding: "utf8" }).split("\n").slice(1, 5).map((s) => s.trim().replace(/\s+/g, " ")).join(" | "); } catch { return "?"; } };
let admissible = true;
ORDER.forEach((tree, i) => {
  const cwd = tree === "head" ? head : base;
  rmSync(join(cwd, ".test-results/last-run.json"), { force: true });
  const pre = waitClear(`run ${i + 1} ${tree}`, log);
  log(`run ${i + 1} ${tree} top-cpu before: ${topCpu()}`); // QE-245
  const l0 = loadavg()[0], c0 = childCpu(), t0 = performance.now();
  const r = spawnSync("npm", ["test"], { cwd, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  const wall = (performance.now() - t0) / 1000, cpu = childCpu() - c0, l1 = loadavg()[0];
  const tAfter = tctl(); temps.push(pre.t, tAfter); // QE-245
  const text = `${r.stdout}${r.stderr}`;
  writeFileSync(join(out, `g8-${i + 1}-${tree}.txt`), text);
  if (existsSync(join(cwd, ".test-results/last-run.json"))) copyFileSync(join(cwd, ".test-results/last-run.json"), join(out, `g8-${i + 1}-${tree}.last-run.json`));
  const tests = /^\s+Tests\s+(.*)$/m.exec(text)?.[1] ?? "?";
  const dur = /^\s+Duration\s+(.*)$/m.exec(text)?.[1] ?? "?";
  const per = {};
  for (const m of text.matchAll(/^\s+[✓❯×]\s+(src\/\S+)\s+\((\d+) tests?[^)]*\)\s+(\d+)ms/gm)) per[m[1]] = Number(m[3]);
  files[tree].push(per); res[tree].push(wall); cpus[tree].push(cpu);
  if (r.status !== 0 || l0 > 8 || l1 > 8 || !pre.alone) admissible = false; // QE-249: alone
  const fgn = vitestPids(); // QE-249: foreign vitest seen right after the run
  const line = `run ${i + 1} ${tree} rc=${r.status} wall=${wall.toFixed(2)}s cpu=${cpu.toFixed(2)}s vitest_duration=${dur} load1_before=${l0.toFixed(2)} load1_after=${l1.toFixed(2)} tctl_before=${pre.t.toFixed(1)} tctl_after=${tAfter.toFixed(1)} alone_before=${pre.alone} waited_s=${(pre.waited/1000).toFixed(0)} foreign_vitest_after=${fgn.join(",") || "none"} :: ${tests}`;
  appendFileSync(join(out, "g8.log"), `${ts()} ${line}\n`);
  console.log(line);
});
const med = (a) => (a.length === 0 ? Number.NaN : [...a].sort((x, y) => x - y)[(a.length - 1) >> 1]); // QE-246: n = 3 -> [1], as before; empty arm -> NaN
const tmed = [...temps].sort((x, y) => x - y); const tctlMedian = (tmed[(tmed.length >> 1) - 1] + tmed[tmed.length >> 1]) / 2; // QE-246: 2 readings per run (12 at n = 6)
const summary = `median wall: base ${med(res.base).toFixed(2)} s, head ${med(res.head).toFixed(2)} s, delta ${(med(res.head) - med(res.base)).toFixed(2)} s; median cpu: base ${med(cpus.base).toFixed(2)} s, head ${med(cpus.head).toFixed(2)} s; admissible (rc 0, load1 <= 8 before and after every run, alone before every run): ${admissible}; tctl median ${tctlMedian.toFixed(1)} C (max ${tmed.at(-1).toFixed(1)}), thermal stop (> 85 C): ${tctlMedian > 85}`;
appendFileSync(join(out, "g8.log"), `${ts()} ${summary}\n`);
console.log(summary);
const names = new Set([...files.base, ...files.head].flatMap((p) => Object.keys(p)));
const rows = [...names].map((n) => { const b = med(files.base.map((p) => p[n] ?? 0)), h = med(files.head.map((p) => p[n] ?? 0)); return { n, b, h, d: h - b }; }).sort((x, y) => x.d - y.d);
writeFileSync(join(out, "g8-perfile.txt"), rows.map((r) => `${r.d >= 0 ? "+" : ""}${r.d}\t${r.b}\t${r.h}\t${r.n}`).join("\n") + "\n");
