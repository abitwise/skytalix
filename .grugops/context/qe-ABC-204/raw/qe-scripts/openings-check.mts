import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
const wt = process.argv[2], tsv = process.argv[3];
const { drawOpenings, OPENINGS_SHA256 } = await import(join(wt, "tools/rating/openings.ts"));
const { SOURCE_FILES, SOURCE_SHA256 } = await import(join(wt, "tools/opening-book/compile.ts"));
const h = (b: string | Buffer) => createHash("sha256").update(b).digest("hex");
for (const f of SOURCE_FILES) console.log(f, h(readFileSync(join(tsv, f))) === SOURCE_SHA256[f] ? "= SOURCE_SHA256" : "DIFFERS");
const text = drawOpenings(SOURCE_FILES.map((f: string) => readFileSync(join(tsv, f), "utf8")));
const committed = readFileSync(join(wt, "tools/rating/openings.epd"), "utf8");
console.log("regenerated sha", h(text), "pin", OPENINGS_SHA256, "equal committed bytes", text === committed);
// QE's own property checks on the committed file
const lines = committed.split("\n").filter(Boolean);
let ok = lines.length === 100 && new Set(lines).size === 100;
for (let b = 0; b < 5; b++) {
  const ply = 4 + b, blk = lines.slice(20 * b, 20 * b + 20);
  const ranks = blk.map((e) => h("ABC-204/openings/v1\n" + e));
  const asc = ranks.every((r, i) => i === 0 || ranks[i - 1] < r);
  const stm = blk.every((e) => e.split(" ")[1] === (ply % 2 === 0 ? "w" : "b"));
  const four = blk.every((e) => e.split(" ").length === 4);
  console.log(`ply ${ply}: ranks ascending ${asc}, side-to-move parity ${stm}, four fields ${four}`);
  ok &&= asc && stm && four;
}
console.log("committed-file properties", ok, "LF-terminated", committed.endsWith("\n") && !committed.includes("\r"));
