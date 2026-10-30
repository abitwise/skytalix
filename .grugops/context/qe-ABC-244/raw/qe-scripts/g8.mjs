// qe-ABC-244 G8 (qe-ABC-229 g8.mjs + CPU from /proc/self/stat cutime+cstime, load1 after, last-run.json kept per run):
// `npm test` wall, base and head interleaved b h h b b h, wait-clear (host.mjs) before every run.
// usage: node g8.mjs <headDir> <baseDir> <outDir>
import { spawnSync } from "node:child_process";
import { appendFileSync, copyFileSync, existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { loadavg } from "node:os";
import { join } from "node:path";
import { waitClear } from "./host.mjs";
const [head, base, out] = process.argv.slice(2);
const ORDER = ["base", "head", "head", "base", "base", "head"];
const res = { base: [], head: [] }, cpus = { base: [], head: [] }, files = { base: [], head: [] };
const ts = () => new Date().toISOString();
const log = (s) => appendFileSync(join(out, "g8-wait.log"), `${ts()} ${s}\n`);
const childCpu = () => { const f = readFileSync("/proc/self/stat", "utf8").split(") ")[1].split(" "); return (Number(f[13]) + Number(f[14])) / 100; };
let admissible = true;
ORDER.forEach((tree, i) => {
  const cwd = tree === "head" ? head : base;
  rmSync(join(cwd, ".test-results/last-run.json"), { force: true });
  const pre = waitClear(`run ${i + 1} ${tree}`, log);
  const l0 = loadavg()[0], c0 = childCpu(), t0 = performance.now();
  const r = spawnSync("npm", ["test"], { cwd, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  const wall = (performance.now() - t0) / 1000, cpu = childCpu() - c0, l1 = loadavg()[0];
  const text = `${r.stdout}${r.stderr}`;
  writeFileSync(join(out, `g8-${i + 1}-${tree}.txt`), text);
  if (existsSync(join(cwd, ".test-results/last-run.json"))) copyFileSync(join(cwd, ".test-results/last-run.json"), join(out, `g8-${i + 1}-${tree}.last-run.json`));
  const tests = /^\s+Tests\s+(.*)$/m.exec(text)?.[1] ?? "?";
  const dur = /^\s+Duration\s+(.*)$/m.exec(text)?.[1] ?? "?";
  const per = {};
  for (const m of text.matchAll(/^\s+[✓❯×]\s+(src\/\S+)\s+\((\d+) tests?[^)]*\)\s+(\d+)ms/gm)) per[m[1]] = Number(m[3]);
  files[tree].push(per); res[tree].push(wall); cpus[tree].push(cpu);
  if (r.status !== 0 || l0 > 8 || l1 > 8) admissible = false;
  const line = `run ${i + 1} ${tree} rc=${r.status} wall=${wall.toFixed(2)}s cpu=${cpu.toFixed(2)}s vitest_duration=${dur} load1_before=${l0.toFixed(2)} load1_after=${l1.toFixed(2)} tctl_before=${pre.t.toFixed(1)} :: ${tests}`;
  appendFileSync(join(out, "g8.log"), `${ts()} ${line}\n`);
  console.log(line);
});
const med = (a) => [...a].sort((x, y) => x - y)[1];
const summary = `median wall: base ${med(res.base).toFixed(2)} s, head ${med(res.head).toFixed(2)} s, delta ${(med(res.head) - med(res.base)).toFixed(2)} s; median cpu: base ${med(cpus.base).toFixed(2)} s, head ${med(cpus.head).toFixed(2)} s; admissible (rc 0, load1 <= 8 before and after every run): ${admissible}`;
appendFileSync(join(out, "g8.log"), `${ts()} ${summary}\n`);
console.log(summary);
const names = new Set([...files.base, ...files.head].flatMap((p) => Object.keys(p)));
const rows = [...names].map((n) => { const b = med(files.base.map((p) => p[n] ?? 0)), h = med(files.head.map((p) => p[n] ?? 0)); return { n, b, h, d: h - b }; }).sort((x, y) => x.d - y.d);
writeFileSync(join(out, "g8-perfile.txt"), rows.map((r) => `${r.d >= 0 ? "+" : ""}${r.d}\t${r.b}\t${r.h}\t${r.n}`).join("\n") + "\n");
