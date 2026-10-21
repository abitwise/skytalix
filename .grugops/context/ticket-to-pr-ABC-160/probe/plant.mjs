// Usage: node plant.mjs <pristine compile.ts> <out compile.ts> <mutant id>
import { readFileSync, writeFileSync } from "node:fs";

const [src, out, id] = process.argv.slice(2);
let text = readFileSync(src, "utf8");
const CMP = "if (actual !== expected[file]) {";
const LOOP = "  for (const file of SOURCE_FILES) {\n    const actual";
const MSG = "throw new Error(`${file}: sha256 is ${actual}, expected ${expected[file]}`);";
const once = (from, to) => {
  const n = text.split(from).length - 1;
  if (n !== 1) throw new Error(`${id}: anchor found ${n} times`);
  text = text.replace(from, to);
};
switch (id) {
  case "NONE":
    break;
  case "Q-SUFFIX8":
    once(CMP, "if (actual.slice(-8) !== expected[file].slice(-8)) {");
    break;
  case "Q-SKIP8":
    once(CMP, "if (actual.slice(8) !== expected[file].slice(8)) {");
    break;
  case "Q-PREFIX":
    once(CMP, "if (actual.slice(0, 8) !== expected[file].slice(0, 8)) {");
    break;
  case "Q-CASE":
    once(CMP, "if (actual.toLowerCase() !== expected[file].toLowerCase()) {");
    break;
  case "M05":
    once(LOOP, "  for (const file of SOURCE_FILES.slice(0, 1)) {\n    const actual");
    break;
  case "M06":
    once(LOOP, "  for (const file of SOURCE_FILES.slice(1)) {\n    const actual");
    break;
  case "M-SWAP":
    once(
      CMP,
      'const want = expected[file === "b.tsv" ? "c.tsv" : file === "c.tsv" ? "b.tsv" : file];\n    if (actual !== want) {',
    );
    once(MSG, "throw new Error(`${file}: sha256 is ${actual}, expected ${want}`);");
    break;
  default:
    throw new Error(`unknown mutant ${id}`);
}
writeFileSync(out, text);
