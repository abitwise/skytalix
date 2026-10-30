// qe-ABC-229 G8 (from qe-ABC-228-ii g8.mjs; wait-clear moved to host.mjs; per-file durations extracted): `npm test`
// wall, base and head in the same session, interleaved b h h b b h, wait-clear before every run.
// usage: node g8.mjs <headDir> <baseDir> <outDir>
import { spawnSync } from "node:child_process";
import { appendFileSync, writeFileSync } from "node:fs";
import { loadavg } from "node:os";
import { join } from "node:path";
import { waitClear } from "./host.mjs";

const [head, base, out] = process.argv.slice(2);
const ORDER = ["base", "head", "head", "base", "base", "head"];
const res = { base: [], head: [] };
const files = { base: [], head: [] };
const ts = () => new Date().toISOString();
const log = (s) => appendFileSync(join(out, "g8-wait.log"), `${ts()} ${s}\n`);
ORDER.forEach((tree, i) => {
  const cwd = tree === "head" ? head : base;
  const pre = waitClear(`run ${i + 1} ${tree}`, log);
  const l0 = loadavg()[0];
  const t0 = performance.now();
  const r = spawnSync("npm", ["test"], { cwd, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  const wall = (performance.now() - t0) / 1000;
  const text = `${r.stdout}${r.stderr}`;
  writeFileSync(join(out, `g8-${i + 1}-${tree}.txt`), text);
  const tests = /^\s+Tests\s+(.*)$/m.exec(text)?.[1] ?? "?";
  const dur = /^\s+Duration\s+(.*)$/m.exec(text)?.[1] ?? "?";
  const per = {};
  for (const m of text.matchAll(/^\s+[✓❯×]\s+(src\/\S+)\s+\((\d+) tests?[^)]*\)\s+(\d+)ms/gm)) per[m[1]] = Number(m[3]);
  files[tree].push(per);
  res[tree].push(wall);
  const line = `run ${i + 1} ${tree} rc=${r.status} wall=${wall.toFixed(2)}s vitest_duration=${dur} load1_before=${l0.toFixed(2)} tctl_before=${pre.t.toFixed(1)} :: ${tests}`;
  appendFileSync(join(out, "g8.log"), `${ts()} ${line}\n`);
  console.log(line);
});
const med = (a) => [...a].sort((x, y) => x - y)[1];
const summary = `median wall: base ${med(res.base).toFixed(2)} s, head ${med(res.head).toFixed(2)} s, delta ${(med(res.head) - med(res.base)).toFixed(2)} s`;
appendFileSync(join(out, "g8.log"), `${ts()} ${summary}\n`);
console.log(summary);
// Per-file median test time (ms, vitest's per-file figure), head - base, largest deltas first.
const names = new Set([...files.base, ...files.head].flatMap((p) => Object.keys(p)));
const rows = [...names].map((n) => {
  const b = med(files.base.map((p) => p[n] ?? 0)), h = med(files.head.map((p) => p[n] ?? 0));
  return { n, b, h, d: h - b };
}).sort((x, y) => y.d - x.d);
writeFileSync(join(out, "g8-perfile.txt"), rows.map((r) => `${r.d >= 0 ? "+" : ""}${r.d}\t${r.b}\t${r.h}\t${r.n}`).join("\n") + "\n");
