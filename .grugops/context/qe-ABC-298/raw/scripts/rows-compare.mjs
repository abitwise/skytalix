// qe-ABC-298 stage A, SG1 (c): the freeze's row list (qe-ABC-298-freeze raw/out/rows.jsonl.gz: every default-lane row,
// and every deep lane's DEEP rows, i.e. titles that file's default run does not hold) against the head's runs. For every
// lane this hop ran: each frozen row must be collected at the head and passed; every row the head adds (default lane:
// any title not frozen; deep lane: any deep title not frozen) is listed by file with its status. Every run row must pass.
// A title is the describe chain and the test title joined by " > ", as the freeze's `vitest list` rows hold it.
// Reads vitest JSON only; prints no duration and no host path.
// usage: node rows-compare.mjs <frozen rows.jsonl.gz> <head default.json> <worktree> <vitest dir>...
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { gunzipSync } from "node:zlib";
const [frozenGz, defaultJson, worktree, ...dirs] = process.argv.slice(2);
const frozen = gunzipSync(readFileSync(frozenGz)).toString("utf8").trim().split("\n").map((l) => JSON.parse(l));
const rowsOf = (j) => j.testResults.flatMap((t) => t.assertionResults.map((a) => ({ file: relative(worktree, t.name), title: [...a.ancestorTitles, a.title].join(" > "), status: a.status })));
const fk = (r) => `${r.file}\u0000${r.title}`;
const headDefault = new Set(rowsOf(JSON.parse(readFileSync(defaultJson, "utf8"))).map(fk));
let bad = 0;
for (const dir of dirs) {
  for (const f of readdirSync(dir).filter((x) => x.endsWith(".json")).sort()) {
    const lane = f.replace(/\.json$/, "");
    const rows = rowsOf(JSON.parse(readFileSync(join(dir, f), "utf8")));
    const status = new Map(rows.map((r) => [fk(r), r.status]));
    const isDefault = lane === "default" || lane === "default-perft";
    const frozenLane = frozen.filter((r) => r.lane === lane || (lane === "default-perft" && r.lane === "default" && r.file === "src/perft.test.ts"));
    const fset = new Set(frozenLane.map(fk));
    const missing = frozenLane.filter((r) => !status.has(fk(r)));
    const notPassed = frozenLane.filter((r) => status.has(fk(r)) && status.get(fk(r)) !== "passed");
    const added = rows.filter((r) => !fset.has(fk(r)) && (isDefault || !headDefault.has(fk(r))));
    const addedBy = {};
    for (const r of added) { addedBy[r.file] ??= { passed: 0, other: 0 }; addedBy[r.file][r.status === "passed" ? "passed" : "other"]++; }
    const failedAll = rows.filter((r) => r.status !== "passed");
    console.log(`${lane}: run ${rows.length} rows (${rows.length - failedAll.length} passed); frozen ${isDefault ? "rows" : "deep rows"} ${frozenLane.length}, missing ${missing.length}, not passed ${notPassed.length}; added ${isDefault ? "rows" : "deep rows"} ${added.length} ${JSON.stringify(addedBy)}`);
    for (const r of [...missing, ...notPassed]) console.log(`  ${status.get(fk(r)) ?? "MISSING"}: ${r.file} :: ${r.title}`);
    for (const r of failedAll) console.log(`  run row ${r.status}: ${r.file} :: ${r.title}`);
    bad += missing.length + notPassed.length + failedAll.length;
  }
}
console.log(bad === 0 ? "SG1 (c) rows: every frozen row in these lanes collected and passed; every row run passed" : `SG1 (c) rows: ${bad} PROBLEM(S)`);
process.exit(bad === 0 ? 0 : 1);
