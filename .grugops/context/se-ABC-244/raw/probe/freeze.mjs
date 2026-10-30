import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { MUTANTS } from "./mutants.mjs";
const [base, out] = process.argv.slice(2);
const rows = [];
for (const [id, [file, from, to]] of Object.entries(MUTANTS)) {
  const text = readFileSync(join(base, file), "utf8");
  const n = text.split(from).length - 1;
  rows.push({ id, file, applies: n === 1, occurrences: n, from, to });
}
const body = JSON.stringify({ frozenAt: new Date().toISOString(), base: "d59e3194", mutants: rows }, null, 2);
writeFileSync(out, body + "\n");
console.log(createHash("sha256").update(body + "\n").digest("hex"), out);
for (const r of rows) console.log(r.id, r.file, r.applies ? "applies" : `NOT APPLICABLE (${r.occurrences})`);
