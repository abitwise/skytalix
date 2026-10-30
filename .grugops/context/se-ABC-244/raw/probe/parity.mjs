// per-row killed ids at base vs tip; the 8 changed rows marked *
import { readFileSync } from "node:fs";
const here = new URL(".", import.meta.url).pathname;
const CHANGED = [
  "A1: with keyHistory injected the default level plays the third occurrence, at 0",
  "the injected keyHistory is read once per engine move, on the game the loop hands in",
  "A3: a game started from a FEN has no earlier positions: the move is base's",
  "A4: with repetitionKeyHistory injected the default level plays d8e8 at exactly 0; base does not",
  "A4: with a legal ep capture available the same line is not a draw",
  "A7: the move the search scores 0 is the move after which gameStatusOf reports the claim",
  "A2: bestmove is byte-equal to the CLI level seam's move on the same game and clock",
  "A5: the CLI level seam's injected list equals UCI's, key for key, and both play d8e8",
];
const load = (l) => readFileSync(`${here}kill-${l}.jsonl`, "utf8").trim().split("\n").map((x) => JSON.parse(x));
const kills = (rows) => {
  const m = new Map();
  for (const r of rows) {
    if (r.id === "CONTROL") continue;
    for (const f of r.failed) m.set(f, [...(m.get(f) ?? []), r.id]);
  }
  return m;
};
const [b, t] = [load("base"), load("tip")];
const ctl = t.find((r) => r.id === "CONTROL");
console.log("controls: base", b.find((r) => r.id === "CONTROL")?.failed.length ?? "(run separately: 0 failed, 18 ran)", "tip", ctl?.failed.length, "ran", ctl?.ran);
console.log("ids base", b.filter((r) => r.id !== "CONTROL").map((r) => r.id).join(","), "| tip", t.filter((r) => r.id !== "CONTROL").map((r) => r.id).join(","));
const [kb, kt] = [kills(b), kills(t)];
const names = [...new Set([...kb.keys(), ...kt.keys(), ...CHANGED.map((c) => c)])];
let diff = 0;
const all = new Set();
for (const r of b) for (const f of r.failed) all.add(f);
for (const r of t) for (const f of r.failed) all.add(f);
const rowsSeen = new Set([...all]);
for (const title of CHANGED) {
  const full = [...rowsSeen].find((n) => n.endsWith(`> ${title}`)) ?? title;
  const x = (kb.get(full) ?? []).join(",") || "-";
  const y = (kt.get(full) ?? []).join(",") || "-";
  if (x !== y) diff++;
  console.log(`* ${x === y ? "SAME" : "DIFF"} | base {${x}} | tip {${y}} | ${full}`);
}
for (const n of [...rowsSeen].filter((n) => !CHANGED.some((c) => n.endsWith(`> ${c}`)))) {
  console.log(`  ${(kb.get(n) ?? []).join(",") === (kt.get(n) ?? []).join(",") ? "SAME" : "DIFF"} | base {${(kb.get(n) ?? []).join(",")}} | tip {${(kt.get(n) ?? []).join(",")}} | ${n}`);
}
console.log("changed rows with a different kill set:", diff);
