// usage: node freeze.mjs <baseTree> <headTree> <out.json>  -- records every mutant text and asserts uniqueness at both trees.
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { MUTANTS } from "./mutants.mjs";
import { MUTANTS as SE } from "../../../se-ABC-244/raw/probe/mutants.mjs";
const [base, head, out] = process.argv.slice(2);
for (const [id, e] of Object.entries(SE)) if (JSON.stringify(MUTANTS[id]) !== JSON.stringify([e])) throw new Error(`SE text drift ${id}`);
const rows = [];
for (const [id, edits] of Object.entries(MUTANTS)) {
  const occ = (tree) => edits.map(([file, from]) => readFileSync(join(tree, file), "utf8").split(from).length - 1);
  const ob = occ(base), oh = occ(head);
  rows.push({ id, edits: edits.map(([file, from, to]) => ({ file, from, to })), occurrencesBase: ob, occurrencesHead: oh, applies: [...ob, ...oh].every((n) => n === 1) });
}
const body = JSON.stringify({ task: "qe-ABC-244", frozenAt: new Date().toISOString(), base: "d59e3194", head: "25282ad4", count: rows.length, mutants: rows }, null, 2) + "\n";
writeFileSync(out, body);
console.log(createHash("sha256").update(body).digest("hex"), rows.length, "mutants");
for (const r of rows) console.log(r.id, r.applies ? "applies" : `NOT APPLICABLE b${r.occurrencesBase} h${r.occurrencesHead}`);
