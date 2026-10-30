// usage: node analyse.mjs <sessionDir>  -> per reading: per-board nps and depth medians, ratio (second / first tree),
// load1, Tctl and wall ranges, voided pairs.
import { existsSync, readFileSync } from "node:fs";
const d = process.argv[2];
const rd = (f) =>
  existsSync(`${d}/${f}`)
    ? readFileSync(`${d}/${f}`, "utf8").trim().split("\n").filter(Boolean).map((l) => JSON.parse(l))
    : [];
const med = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  const n = s.length;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
};
const rng = (xs) => `${Math.min(...xs)}-${Math.max(...xs)}`;
for (const reading of ["g6", "a3", "item1", "item2"]) {
  const rows = rd(`${reading}.jsonl`);
  if (!rows.length) continue;
  const A = rows.find((r) => r.round === 1).tree;
  const B = [...new Set(rows.map((r) => r.tree))].find((t) => t !== A);
  const tc = rows.flatMap((r) => [Number(r.tctl0), Number(r.tctl1)]).filter((x) => !Number.isNaN(x));
  console.log(
    `== ${reading}: ${A} vs ${B}, runs ${rows.length}, load1 ${rng(rows.map((r) => r.load1))}, Tctl ${rng(tc)} C, wall ${rng(rows.map((r) => r.wallMs))} ms, elapsedMs max ${Math.max(...rows.map((r) => r.elapsedMs))}`,
  );
  for (const board of [...new Set(rows.map((r) => r.board))]) {
    const g = (t) => rows.filter((r) => r.board === board && r.tree === t).sort((x, y) => x.round - y.round);
    const a = g(A);
    const b = g(B);
    const ma = med(a.map((r) => r.nps));
    const mb = med(b.map((r) => r.nps));
    console.log(
      `  ${board}: ${A} nps ${a.map((r) => r.nps).join(" ")} med ${ma} | ${B} nps ${b.map((r) => r.nps).join(" ")} med ${mb} | ratio ${(mb / ma).toFixed(4)}`,
    );
    console.log(
      `  ${board}: depth ${A} ${a.map((r) => r.depth).join(" ")} med ${med(a.map((r) => r.depth))} | ${B} ${b.map((r) => r.depth).join(" ")} med ${med(b.map((r) => r.depth))} | min ${B} ${Math.min(...b.map((r) => r.depth))} | moves ${A} ${[...new Set(a.map((r) => r.move))].join(",")} ${B} ${[...new Set(b.map((r) => r.move))].join(",")}`,
    );
  }
}
const v = rd("voided.jsonl");
console.log(`voided rows ${v.length}`);
if (existsSync(`${d}/session.log`)) console.log(readFileSync(`${d}/session.log`, "utf8").trim());
