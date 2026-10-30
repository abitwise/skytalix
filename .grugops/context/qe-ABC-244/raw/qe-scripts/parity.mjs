// qe-ABC-244 A6 parity: per row, the killed mutant ids at base vs head. usage: node parity.mjs <outDir> <baseLabel> <headLabel>
import { readFileSync } from "node:fs";
import { join } from "node:path";
const [dir, bl, hl] = process.argv.slice(2);
const CHANGED = [ // U1: the four rows whose step moved (ticket § Scope)
  "A1: with keyHistory injected the default level plays the third occurrence, at 0",
  "the injected keyHistory is read once per engine move, on the game the loop hands in",
  "A3: a game started from a FEN has no earlier positions: the move is base's",
  "A2: bestmove is byte-equal to the CLI level seam's move on the same game and clock",
];
const U2 = [
  "A4: with repetitionKeyHistory injected the default level plays d8e8 at exactly 0; base does not",
  "A4: with a legal ep capture available the same line is not a draw",
  "A7: the move the search scores 0 is the move after which gameStatusOf reports the claim",
  "A5: the CLI level seam's injected list equals UCI's, key for key, and both play d8e8",
];
const load = (l) => readFileSync(join(dir, `kill-${l}.jsonl`), "utf8").trim().split("\n").map((x) => JSON.parse(x));
const [b, h] = [load(bl), load(hl)];
const ctl = (rs) => rs.find((r) => r.id === "CONTROL");
console.log(`controls: base ran ${ctl(b)?.ran} failed ${ctl(b)?.failed.length} suiteErrors ${ctl(b)?.suiteErrors} | head ran ${ctl(h)?.ran} failed ${ctl(h)?.failed.length} suiteErrors ${ctl(h)?.suiteErrors}`);
const idsB = b.filter((r) => r.id !== "CONTROL").map((r) => r.id), idsH = h.filter((r) => r.id !== "CONTROL").map((r) => r.id);
console.log(`mutants: base ${idsB.length}, head ${idsH.length}, same ids in same order: ${idsB.join() === idsH.join()}`);
const allRows = new Set([...b, ...h].flatMap((r) => r.failed));
const names = new Set([...allRows]);
for (const r of [...b, ...h]) if (r.id === "CONTROL") for (const k of r.failed) names.add(k);
const kills = (rs, full) => rs.filter((r) => r.id !== "CONTROL" && r.failed.includes(full)).map((r) => r.id).join(",");
const fullOf = (title) => [...names].find((n) => n.endsWith(`> ${title}`)) ?? `(never red) ${title}`;
let diff = 0;
for (const [tag, list] of [["U1 (changed)", CHANGED], ["U2 (unchanged step 100)", U2]]) {
  console.log(`## ${tag}`);
  for (const t of list) {
    const f = fullOf(t);
    const x = kills(b, f) || "-", y = kills(h, f) || "-";
    if (tag.startsWith("U1") && x !== y) diff++;
    console.log(`${x === y ? "SAME" : "DIFF"} | base {${x}} | head {${y}} | ${f}`);
  }
}
console.log("## other rows of the four blocks that went red under any mutant");
for (const n of [...names].filter((n) => ![...CHANGED, ...U2].some((t) => n.endsWith(`> ${t}`)))) {
  const x = kills(b, n) || "-", y = kills(h, n) || "-";
  console.log(`${x === y ? "SAME" : "DIFF"} | base {${x}} | head {${y}} | ${n}`);
}
const survB = b.filter((r) => r.id !== "CONTROL" && r.failed.length === 0 && r.suiteErrors === 0).map((r) => r.id);
const survH = h.filter((r) => r.id !== "CONTROL" && r.failed.length === 0 && r.suiteErrors === 0).map((r) => r.id);
console.log(`survivors (kill no row of the 18): base {${survB.join(",")}} head {${survH.join(",")}}`);
console.log(`suite errors: base ${b.reduce((s, r) => s + r.suiteErrors, 0)} head ${h.reduce((s, r) => s + r.suiteErrors, 0)}`);
console.log(`U1 changed rows with a different kill set: ${diff}`);
