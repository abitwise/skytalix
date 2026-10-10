// QE mutant runner, generalised from the Engineer's m2.mjs: pin src/turn-loop.ts by md5 (throw on
// mismatch), insert one line before a UNIQUE anchor, run the named vitest files with the json
// reporter, print every failing assertion, restore from a pristine copy in `finally`, re-check md5.
// usage: node mut.mjs <worktree> <pinnedMd5> <pristineCopy> <mutantId> <file...>
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { copyFileSync, readFileSync, writeFileSync } from "node:fs";

const MUTANTS = {
  // ticket's M2: a second O(plies) replay on EVERY advancing ply
  M2: ["    status = gameStatusOf(history);\n  }\n}", "    keyHistory(history);\n"],
  // keyHistory on every non-mutating prompt outcome (transitions 7/8/9)
  M3: ["          messages = outcome.messages;\n          continue;", "          keyHistory(history);\n"],
  // keyHistory once per game, at transition 1 -> 2
  M4: ["  let status = gameStatusOf(history);", "  keyHistory(history);\n"],
  // keyHistory on engine plies only
  M5: ["      playMove(history, move);\n    }", "      keyHistory(history);\n"],
  // CONTROL: a second gameStatusOf per ply. Red expected on gameStatus, NOT on keyHistory.
  M6: ["    status = gameStatusOf(history);\n  }\n}", "    gameStatusOf(history);\n"],
  // CONTROL: a second replay on the REFUSED claim (per command). Not the per-ply bar's; A8's.
  M7: ["  const keys = keyHistory(history);", "  keyHistory(history);\n"],
  // PROBE: a second O(plies) replay per ply that does not go through keyHistory/repetitionCounts.
  M8: ["    status = gameStatusOf(history);\n  }\n}", "    takeBack(history, 0);\n"],
  // PROBE: keyHistory on the take-back edge (transition 18), per take-back, not per ply.
  M9: ["        takeBack(history, outcome.plies);", "        keyHistory(history);\n"],
};

const [wt, pinnedMd5, pristine, id, ...files] = process.argv.slice(2);
const target = `${wt}/src/turn-loop.ts`;
const md5 = (p) => createHash("md5").update(readFileSync(p)).digest("hex");
if (md5(target) !== pinnedMd5) throw new Error(`refusing: ${target} md5 ${md5(target)} != pinned ${pinnedMd5}`);
const [anchor, insert] = MUTANTS[id] ?? [];
if (!anchor) throw new Error(`unknown mutant ${id}`);
copyFileSync(target, pristine);
const src = readFileSync(target, "utf8");
if (src.split(anchor).length !== 2) throw new Error(`${id}: anchor not unique`);
try {
  writeFileSync(target, src.replace(anchor, insert + anchor));
  console.log(`${id} mutant md5 ${md5(target)}`);
  const r = spawnSync("npx", ["vitest", "run", "--reporter=json", ...files], {
    cwd: wt,
    encoding: "utf8",
    maxBuffer: 256 * 1024 * 1024,
  });
  const json = JSON.parse(r.stdout.slice(r.stdout.indexOf("{")));
  console.log(`${id} exit ${r.status} — tests ${json.numTotalTests}, failed ${json.numFailedTests}`);
  for (const f of json.testResults)
    for (const a of f.assertionResults)
      if (a.status === "failed")
        console.log(
          `  FAIL ${f.name.replace(`${wt}/`, "")} :: ${a.title}\n       ${(a.failureMessages[0] ?? "").split("\n")[0]}`,
        );
} finally {
  copyFileSync(pristine, target);
  if (md5(target) !== pinnedMd5) throw new Error("RESTORE FAILED");
  console.log(`${id} restored, md5 ${md5(target)}`);
}
