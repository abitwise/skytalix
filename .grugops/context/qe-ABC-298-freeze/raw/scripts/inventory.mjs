// qe-ABC-298-freeze: the row inventory from the collected lists (list.sh). One row per test, by lane, file and
// title, the title with its interpolated figures; no host path, no duration. A row is "deep" when the file's
// default-lane collection does not hold the same title. "door" marks a title that names a door (a `…Without…`
// entry or the word door), INFO only: SG1 (c) covers every row whatever its tag. A lane that collects 0 rows FAILS.
//   node inventory.mjs <listDir> <worktree>  > rows.jsonl   (the lane table goes to stderr)
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
const [dir, worktree] = process.argv.slice(2);
const read = (f) => JSON.parse(readFileSync(join(dir, f), "utf8")).map((r) => ({ file: relative(worktree, r.file), title: r.name }));
const def = read("default.json");
const defKey = new Set(def.map((r) => `${r.file}\u0000${r.title}`));
const door = (t) => /door|Without[A-Z]/i.test(t);
const lanes = ["default.json", ...readdirSync(dir).filter((f) => f.endsWith(".json") && f !== "default.json").sort()];
let bad = 0;
const deepTotal = { rows: 0, door: 0 };
for (const f of lanes) {
  const lane = f.replace(/\.json$/, "");
  const rows = read(f);
  let deep = 0;
  let doors = 0;
  for (const r of rows) {
    const isDeep = lane !== "default" && !defKey.has(`${r.file}\u0000${r.title}`);
    if (lane !== "default" && !isDeep) continue; // a deep lane's default rows are listed once, under "default"
    if (isDeep) deep++;
    if (door(r.title)) doors++;
    process.stdout.write(`${JSON.stringify({ lane, file: r.file, title: r.title, deep: isDeep, door: door(r.title) })}\n`);
  }
  if (lane !== "default") {
    deepTotal.rows += deep;
    deepTotal.door += doors;
  }
  const ok = rows.length > 0 && (lane === "default" || deep > 0);
  if (!ok) bad++;
  process.stderr.write(`${ok ? "PASS" : "FAIL"} ${lane} collected ${rows.length} ${lane === "default" ? `door-titled ${doors}` : `deep ${deep} door-titled ${doors}`}\n`);
}
process.stderr.write(`lanes ${lanes.length} deep rows ${deepTotal.rows} (door-titled ${deepTotal.door}) fail ${bad}\n`);
process.exit(bad === 0 ? 0 : 1);
