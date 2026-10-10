// node plant.mjs <dir> <file> <json [[old,new],...]>  exact, single-occurrence replacements; refuses otherwise.
import { readFileSync, writeFileSync } from "node:fs";
const [dir, file, json] = process.argv.slice(2);
const p = `${dir}/${file}`;
let s = readFileSync(p, "utf8");
for (const [a, b] of JSON.parse(json)) {
  const n = s.split(a).length - 1;
  if (n !== 1) { console.error(`PLANT REFUSED: ${n} occurrences of ${a}`); process.exit(2); }
  s = s.replace(a, b);
}
writeFileSync(p, s);
console.log(`planted ${file}`);
