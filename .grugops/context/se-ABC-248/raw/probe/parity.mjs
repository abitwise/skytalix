// se-ABC-248 parity. Usage: node parity.mjs <base.jsonl> <tip.jsonl> [rowSubstring=tipRowSubstring ...]
// File level: every id killed at base is killed at tip (ids killed at tip only are listed too).
// Row level: for each "base=tip" pair of row-name substrings, the ids that row kills at base and at tip.
import { readFileSync } from "node:fs";

const [bp, tp, ...pairs] = process.argv.slice(2);
const load = (p) => readFileSync(p, "utf8").trim().split("\n").map((l) => JSON.parse(l));
const [b, t] = [load(bp), load(tp)];
const ctl = (x) => x.find((r) => r.id === "CONTROL");
console.log(`CONTROL base ran ${ctl(b).ran} failed ${ctl(b).failed.length} | tip ran ${ctl(t).ran} failed ${ctl(t).failed.length}`);
const killed = (x) => new Set(x.filter((r) => r.id !== "CONTROL" && r.failed.length > 0).map((r) => r.id));
const [kb, kt] = [killed(b), killed(t)];
const idsB = b.filter((r) => r.id !== "CONTROL").map((r) => r.id).join(",");
const idsT = t.filter((r) => r.id !== "CONTROL").map((r) => r.id).join(",");
console.log(`same id list run: ${idsB === idsT} (${b.length - 1} mutants)`);
const lost = [...kb].filter((id) => !kt.has(id));
const gained = [...kt].filter((id) => !kb.has(id));
console.log(`killed base ${kb.size} tip ${kt.size}; LOST at tip: {${lost.join(",") || "-"}}; gained: {${gained.join(",") || "-"}}`);
for (const pair of pairs) {
  const [x, y] = pair.split("=");
  const rowKills = (rows, s) => rows.filter((r) => r.id !== "CONTROL" && r.failed.some((f) => f.includes(s))).map((r) => r.id).join(",");
  const [rb, rt] = [rowKills(b, x), rowKills(t, y ?? x)];
  console.log(`${rb === rt ? "SAME" : "DIFF"} row "${x}"${y && y !== x ? ` -> "${y}"` : ""}: base {${rb || "-"}} tip {${rt || "-"}}`);
}
console.log(lost.length === 0 ? "PARITY HOLDS (file level)" : "PARITY FAILS (file level)");
