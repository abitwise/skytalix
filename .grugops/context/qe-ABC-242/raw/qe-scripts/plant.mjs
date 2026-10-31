// qe-ABC-242 PLANTS: QE's own mutant list (frozen in PREREG.txt before any head run), each ONE exact string edit of
// src/levels.ts asserted to occur exactly once, applied to a SCRATCH copy P of the head tree (never the worktree).
// Each plant runs the WHOLE default lane plus QE's extra file (qe-extra.test.ts copied into P/src), vitest via node
// (never npx), json reporter, NODE_OPTIONS=--max-old-space-size=128. Restores levels.ts after every plant.
// usage: node plant.mjs <H> <B> <P scratch dir> <outDir> [ids=all]
import { execFileSync, spawnSync } from "node:child_process";
import { copyFileSync, cpSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const [H, B, P, out, idsArg] = process.argv.slice(2);
const here = dirname(fileURLToPath(import.meta.url));
rmSync(P, { recursive: true, force: true });
// Post-PREREG harness fix (no plant or expectation changed): the scratch quota cannot hold a full copy of H (.grugops is
// 146 MB), so P is a HARD-LINK tree of H with src/ replaced by a REAL copy (the only directory a plant writes). H's
// integrity is re-checked against `git archive 6884d61a` after the run (tar --compare), so a test that wrote in place
// through a link would show.
execFileSync("cp", ["-al", H, P]);
rmSync(join(P, "src"), { recursive: true, force: true });
cpSync(join(H, "src"), join(P, "src"), { recursive: true });
void symlinkSync;
copyFileSync(join(here, "qe-extra.test.ts"), join(P, "src/qe-extra.test.ts"));
// Post-PREREG extension (POST-HOC, informative; default behaviour unchanged): QE_STEP=<n> rewrites `const STEP_MS = 10;`
// in the three ABC-242 blocks of P's test files, and QE_FILTER=<t> runs only the three files with `-t <t>`.
const QE_STEP = process.env.QE_STEP, QE_FILTER = process.env.QE_FILTER;
if (QE_STEP !== undefined) {
  for (const f of ["src/levels.test.ts", "src/cli.test.ts", "src/uci-session.test.ts"]) {
    const t = readFileSync(join(P, f), "utf8");
    const re = /(ABC-242[\s\S]*?const STEP_MS = )10;/;
    if (!re.test(t)) throw new Error(`no ABC-242 STEP_MS in ${f}`);
    writeFileSync(join(P, f), t.replace(re, `$1${QE_STEP};`));
  }
}
const prodPath = join(P, "src/levels.ts");
const orig = readFileSync(prodPath, "utf8");
const BASE_LEVELS = readFileSync(join(B, "src/levels.ts"), "utf8");
const PUSH0 = "scored.push({ move, score: 0 });\n        return;";
const one = (from, to) => (s) => {
  const parts = s.split(from);
  if (parts.length !== 2) throw new Error(`plant string occurs ${parts.length - 1} times: ${JSON.stringify(from)}`);
  return parts.join(to);
};
const PLANTS = {
  none: (s) => s,
  Q1: one("++matches === 2", "++matches === 1"), // one match scores 0 (ADR-0054 d4, probe H2)
  Q2: one("-Math.min(child.halfmoveClock, keys.length, PRIOR_KEYS_WINDOW)", "-Math.min(keys.length, PRIOR_KEYS_WINDOW)"), // clock bound dropped
  Q3: one(PUSH0, "chooseMove(position, { budgetMs: start + (budgetMs * (i + 1)) / moves.length - now(), now, priorKeys });\n        " + PUSH0), // the skip becomes a search (then 0)
  Q4: one("if (priorKeys !== undefined && standsTwiceBefore(position, priorKeys)) {", "if (false) {"), // the check never fires
  QB: () => BASE_LEVELS, // B's real src/levels.ts under H's tests
  Q5: one("const PRIOR_KEYS_WINDOW = 100;", "const PRIOR_KEYS_WINDOW = 6;"), // cap below the fixtures' -8
  Q6: one("const PRIOR_KEYS_WINDOW = 100;", "const PRIOR_KEYS_WINDOW = 8;"), // cap at the fixtures' -8
  Q7: one("const PRIOR_KEYS_WINDOW = 100;", "const PRIOR_KEYS_WINDOW = Number.POSITIVE_INFINITY;"), // cap removed
  Q8: one("const PRIOR_KEYS_WINDOW = 100;", "const PRIOR_KEYS_WINDOW = 50;"), // cap halved
  Q9: one("-Math.min(child.halfmoveClock, keys.length", "-Math.min(child.halfmoveClock - 1, keys.length"), // the root's clock, not the child's
  Q10: one("++matches === 2", "++matches === 3"), // three earlier occurrences needed
  Q11: one("let earlier = -4", "let earlier = -2"), // walk from -2 (SE M7)
  Q12: one("const key = repetitionKey(child, zobristKey(child));", "const key = zobristKey(child);"), // raw key (SE M8)
  Q13: one("keys[keys.length + earlier]", "keys[keys.length + earlier + 1]"), // index off by one (odd offsets)
  Q14: one(PUSH0, "scored.push({ move, score: 1 });\n        return;"), // 1, not 0
  Q15: one("earlier >= oldest", "earlier > oldest"), // the oldest in-window key is not read (SE M6)
  Q16a: one("if (oldest > -4) return false;", "if (oldest > -8) return false;"), // early exit widened to -8
  Q16b: one("if (oldest > -4) return false;", "if (oldest > -9) return false;"), // early exit past -8
  Q18: one(PUSH0, "now();\n        " + PUSH0), // the check spends a clock read (ADR A3: it reads no clock)
};
const ids = idsArg ? idsArg.split(",") : Object.keys(PLANTS);
const summary = [];
try {
  for (const id of ids) {
    const mutated = PLANTS[id](orig);
    if (id !== "none" && mutated === orig) throw new Error(`${id} did not change levels.ts`);
    writeFileSync(prodPath, mutated);
    const json = join(out, `plant-${id}.json`);
    const t0 = Date.now();
    const scope = QE_FILTER === undefined ? [] : ["src/levels.test.ts", "src/cli.test.ts", "src/uci-session.test.ts", "src/qe-extra.test.ts", "-t", QE_FILTER];
    const r = spawnSync(process.execPath, [join(P, "node_modules/vitest/vitest.mjs"), "run", ...scope, "--reporter=json", `--outputFile.json=${json}`], {
      cwd: P, encoding: "utf8", maxBuffer: 64 * 1024 * 1024, env: { ...process.env, NODE_OPTIONS: "--max-old-space-size=128" },
    });
    const j = JSON.parse(readFileSync(json, "utf8"));
    const red = [];
    for (const f of j.testResults) for (const a of f.assertionResults) if (a.status === "failed") red.push(`${f.name.split("/src/")[1] ?? f.name} :: ${a.fullName}`);
    const line = `${id} rc=${r.status} total=${j.numTotalTests} passed=${j.numPassedTests} failed=${j.numFailedTests} skipped=${j.numPendingTests + j.numTodoTests} wall=${((Date.now() - t0) / 1000).toFixed(1)}s`;
    writeFileSync(join(out, `plant-${id}.red.txt`), `${line}\n${red.map((x) => `  RED ${x}`).join("\n")}\n`);
    summary.push(`${line}\n${red.map((x) => `  RED ${x}`).join("\n")}`);
    console.log(summary.at(-1));
  }
} finally {
  writeFileSync(prodPath, orig);
}
writeFileSync(join(out, `plants-summary-${ids.length === Object.keys(PLANTS).length ? "all" : ids.join("_")}.txt`), summary.join("\n") + "\n");
