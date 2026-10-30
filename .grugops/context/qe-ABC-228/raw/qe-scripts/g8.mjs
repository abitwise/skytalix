// qe-ABC-228 G8: `npm test` wall, base and head in the same session, interleaved b h h b b h.
// usage: node g8.mjs <headDir> <baseDir> <outDir>
import { spawnSync } from "node:child_process";
import { appendFileSync, writeFileSync } from "node:fs";
import { loadavg } from "node:os";
import { join } from "node:path";

const [head, base, out] = process.argv.slice(2);
const ORDER = ["base", "head", "head", "base", "base", "head"];
const res = { base: [], head: [] };
ORDER.forEach((tree, i) => {
  const cwd = tree === "head" ? head : base;
  const l0 = loadavg()[0];
  const t0 = performance.now();
  const r = spawnSync("npm", ["test"], { cwd, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  const wall = (performance.now() - t0) / 1000;
  const text = `${r.stdout}${r.stderr}`;
  writeFileSync(join(out, `g8-${i + 1}-${tree}.txt`), text);
  const tests = /^\s+Tests\s+(.*)$/m.exec(text)?.[1] ?? "?";
  const dur = /^\s+Duration\s+(\S+)/m.exec(text)?.[1] ?? "?";
  res[tree].push(wall);
  const line = `run ${i + 1} ${tree} rc=${r.status} wall=${wall.toFixed(2)}s vitest_duration=${dur} load1_before=${l0.toFixed(2)} :: ${tests}`;
  appendFileSync(join(out, "g8.log"), `${new Date().toISOString()} ${line}\n`);
  console.log(line);
});
const med = (a) => [...a].sort((x, y) => x - y)[1];
console.log(`median wall: base ${med(res.base).toFixed(2)} s, head ${med(res.head).toFixed(2)} s, delta ${(med(res.head) - med(res.base)).toFixed(2)} s`);
