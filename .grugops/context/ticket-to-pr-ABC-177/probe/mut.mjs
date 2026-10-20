// ABC-177 parity harness. Usage: node mut.mjs <tree> <label> [ids]. One mutant at a time, restored and cmp-checked.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
const [tree, label, ids] = process.argv.slice(2);
const only = ids?.split(",");
const ROWS = "go infinite holds the bestmove|A6-e1:|A6-j1:|A6-e4:|A6-e5:|A7-i5:|A7-i6:|the token dropped, one bestmove|two sessions on the same seededRandom";
const list = JSON.parse(readFileSync(new URL("./frozen-mutants.json", import.meta.url), "utf8")).filter((m) => m.baseMatch === "OK");
const out = `${process.cwd()}/kill-${label}.jsonl`;
function run(id) {
  const json = `${process.cwd()}/tmp-${label}.json`;
  const r = spawnSync(process.execPath, ["node_modules/vitest/vitest.mjs", "run", "src/uci-session.test.ts", "-t", ROWS, "--testTimeout=120000", "--reporter=json", `--outputFile=${json}`],
    { cwd: tree, encoding: "utf8", env: { ...process.env, NODE_OPTIONS: "--max-old-space-size=400" } });
  let rows = {}, note = "";
  try {
    const j = JSON.parse(readFileSync(json, "utf8"));
    for (const f of j.testResults) {
      for (const a of f.assertionResults) if (a.status !== "skipped" && a.status !== "pending") rows[a.fullName] = a.status;
      if (f.assertionResults.length === 0) note = "SUITE:" + (f.message ?? "").slice(0, 160);
    }
  } catch (e) { note = "NO-JSON " + (r.stderr ?? "").slice(0, 200); }
  return { id, exit: r.status, ran: Object.keys(rows).length, failed: Object.entries(rows).filter(([, s]) => s !== "passed").map(([n]) => n).sort(), note };
}
const ctrl = run("CONTROL");
writeFileSync(out, JSON.stringify(ctrl) + "\n", { flag: "a" });
console.log(`CONTROL exit=${ctrl.exit} ran=${ctrl.ran} failed=${ctrl.failed.length} ${ctrl.note}`);
if (ctrl.exit !== 0 || ctrl.ran !== 15) process.exit(2);
for (const m of list) {
  if (only && !only.includes(m.id)) continue;
  const path = `${tree}/${m.file}`;
  const pristine = readFileSync(path, "utf8");
  let mutated = pristine.replace(m.from, () => m.to);
  if (m.companion) mutated = mutated.replace(m.companion.from, () => m.companion.to);
  writeFileSync(path, mutated);
  let res;
  try { res = run(m.id); } finally { writeFileSync(path, pristine); }
  if (readFileSync(path, "utf8") !== pristine) { console.log("RESTORE FAILED", m.id); process.exit(3); }
  writeFileSync(out, JSON.stringify(res) + "\n", { flag: "a" });
  console.log(`${m.id} exit=${res.exit} ran=${res.ran} failed=${res.failed.length} ${res.note}`);
}
