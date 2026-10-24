// QE plants for ABC-213: apply each to a scratch copy's src/pgn-file.ts, run src/pgn.test.ts, restore.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
const [root] = process.argv.slice(2);
const file = `${root}/src/pgn-file.ts`;
const head = readFileSync(file, "utf8");
const GUARD = `    try {
      unlinkSync(path);
    } catch (error) {
      errnoOf(error); // Removal is best-effort; the first failure's code is reported (\`ABC-213\`).
    }
`;
const plants = {
  HEAD: [],
  X1_drop_unlink: [[GUARD, ""]],
  X3_unguarded_unlink: [[GUARD, "    unlinkSync(path);\n"]],
  X4_guard_reports_U: [[GUARD, "    try {\n      unlinkSync(path);\n    } catch (error) {\n      return { ok: false, code: errnoOf(error) };\n    }\n"]],
  X5_catch_all: [[GUARD, "    try {\n      unlinkSync(path);\n    } catch {}\n"]],
  Q6_close_overwrites_first: [["      failure ??= error;", "      failure = error;"]],
  Q7_unlink_wrong_candidate: [[GUARD, GUARD.replace("unlinkSync(path)", "unlinkSync(`games/${stem}.pgn`)")]],
  Q8_codeless_first_swallowed: [["    return { ok: false, code: errnoOf(failure) };", "    return { ok: false, code: (failure as { code?: string }).code ?? \"EIO\" };"]],

};
const out = {};
for (const [name, edits] of Object.entries(plants)) {
  let src = head;
  for (const [a, b] of edits) {
    if (!src.includes(a)) throw new Error(`${name}: anchor missing`);
    src = src.replace(a, b);
  }
  if (name !== "HEAD" && src === head) throw new Error(`${name}: no change`);
  writeFileSync(file, src);
  const r = spawnSync("npx", ["vitest", "run", "src/pgn.test.ts", "--reporter=json"], {
    cwd: root, encoding: "utf8", env: { ...process.env, NODE_OPTIONS: "--max-old-space-size=400" },
  });
  writeFileSync(file, head);
  let j;
  try { j = JSON.parse(r.stdout); } catch { out[name] = { exit: r.status, parse: "failed", stderr: r.stderr.slice(-600) }; continue; }
  const red = j.testResults.flatMap((f) => f.assertionResults.filter((a) => a.status !== "passed").map((a) => a.title));
  out[name] = { exit: r.status, passed: j.numPassedTests, failed: j.numFailedTests, total: j.numTotalTests, red };
}
if (readFileSync(file, "utf8") !== head) throw new Error("restore failed");
out.gamesInCopyRoot = existsSync(`${root}/games`);
console.log(JSON.stringify(out, null, 2));
