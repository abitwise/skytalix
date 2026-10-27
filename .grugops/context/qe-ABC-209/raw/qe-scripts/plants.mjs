// QE qe-ABC-209 plants (qe-ABC-208 plants.mjs mechanism; ABC-209's own plant set). Each plant edits a scratch copy of
// head, runs a lane, records the red rows, and restores the six files (cmp-verified against the pristine copies).
// Usage: node plants.mjs <plantTree> <pristineDir> <outDir> <lane:default|deepall> <plant...|all>
import { execFileSync, spawnSync } from "node:child_process";
import { copyFileSync, readFileSync, writeFileSync } from "node:fs";

const [tree, pristine, out, lane, ...wanted] = process.argv.slice(2);
const sub = (file, find, repl, anchor) => ({ file, find, repl, anchor });

const PLANTS = {
  none: [],
  // ---- the SE's five (ticket-to-pr-ABC-209 …3e3d0c55) ----
  "se:ucinewgame-keeps-tracker": [sub("uci-session.ts", "          track = createGameTracker();\n", "")],
  "se:tracker-never-clears": [sub("transposition.ts", "    if (!continues) token = {};\n", "")],
  "se:seam-per-instance-token": [
    sub("level-seam.ts", "  const track = createGameTracker();\n", "  const token = {};\n"),
    sub("level-seam.ts", "track(history.initialFen, moves)", "(moves, token)"),
  ],
  "se:new-token-keeps-table": [sub("transposition.ts", "if (game !== undefined && game === holder) return;", "if (game !== undefined && holder !== null) return;")],
  "se:no-token-keeps-table": [sub("transposition.ts", "if (game !== undefined && game === holder) return;", "if ((game === undefined && keys !== null) || (game !== undefined && game === holder)) return;")],
  // ---- QE's own: the rule's edges ----
  "qe:prefix-not-strict": [sub("transposition.ts", "moves.length > lastMoves.length &&", "moves.length >= lastMoves.length &&")],
  "qe:start-ignored": [sub("transposition.ts", "      start === lastStart &&\n", "")],
  "qe:search-keeps-holder": [sub("transposition.ts", "export function clearTable(): void {\n  holder = null;\n", "export function clearTable(): void {\n")],
  "qe:engine-never-prepares": [sub("engine.ts", "prepareTable(options.game);", "prepareTable(undefined);")],
  // ---- QE's own: the entry paths lose (or misuse) the token ----
  "qe:uci-chooseMove-no-token": [sub("uci-session.ts", "        game: track(gameLine.start, gameLine.moves),\n", "")],
  "qe:uci-level-no-token": [sub("uci-session.ts", "        position,\n        track(gameLine.start, gameLine.moves),\n", "        position,\n        undefined,\n")],
  "qe:uci-gameLine-never-set": [sub("uci-session.ts", "            gameLine = {\n              start:", "            void {\n              start:")],
  "qe:seam-no-token": [sub("level-seam.ts", "track(history.initialFen, moves)", "undefined")],
  "qe:createLevel-drops-game": [sub("levels.ts", "        ...(game === undefined ? {} : { game }),\n", "")],
  "qe:blunder-children-carry-token": [
    sub("levels.ts", "return blunder(position, Math.min(level.budgetMs, HARD_CEILING_MS), now);", "return blunder(position, Math.min(level.budgetMs, HARD_CEILING_MS), now, game);"),
    sub("levels.ts", "function blunder(position: Position, budgetMs: number, now: Clock): LevelChoice | null {", "function blunder(position: Position, budgetMs: number, now: Clock, game?: object): LevelChoice | null {"),
    sub("levels.ts", "chooseMove(position, { budgetMs: deadline - now(), now })", "chooseMove(position, { budgetMs: deadline - now(), now, ...(game === undefined ? {} : { game }) })"),
  ],
  "qe:createLevel-always-spreads": [sub("levels.ts", "        ...(game === undefined ? {} : { game }),\n", "        game,\n")],
  // ---- QE's own: the one-launch inventory (src/cli.test.ts ABC-173 A6 static) still guards the shared helper ----
  "qe:inventory-heap-flag-in-helper": [sub("transposition.test.ts", '["--expose-gc", "--input-type=module", "-e", script]', '["--expose-gc", "--max-old-space-size=512", "--input-type=module", "-e", script]')],
  "qe:inventory-env-in-helper": [sub("transposition.test.ts", "  spawnSync(process.execPath, [\"--expose-gc\", \"--input-type=module\", \"-e\", script], {\n    encoding: \"utf8\",\n  });", "  spawnSync(process.execPath, [\"--expose-gc\", \"--input-type=module\", \"-e\", script], {\n    encoding: \"utf8\",\n    env: { ...process.env },\n  });")],
  "qe:inventory-second-site": [sub("transposition.test.ts", "      const run = gcChild(script);\n      expect(run.status, run.stderr).toBe(0);\n      const { a, b, table }", "      const run = spawnSync(process.execPath, [\"--expose-gc\", \"--input-type=module\", \"-e\", script], { encoding: \"utf8\" });\n      expect(run.status, run.stderr).toBe(0);\n      const { a, b, table }")],
};

const FILES = ["transposition.ts", "engine.ts", "levels.ts", "level-seam.ts", "uci-session.ts", "transposition.test.ts"];
const restore = () => {
  for (const f of FILES) copyFileSync(`${pristine}/${f}`, `${tree}/src/${f}`);
  for (const f of FILES) execFileSync("cmp", [`${pristine}/${f}`, `${tree}/src/${f}`]);
};
function apply(edits) {
  for (const { file, find, repl } of edits) {
    const path = `${tree}/src/${file}`;
    const text = readFileSync(path, "utf8");
    const i = text.indexOf(find);
    if (i < 0) throw new Error(`plant text not found in ${file}: ${String(find).slice(0, 70)}`);
    if (text.indexOf(find, i + 1) >= 0) throw new Error(`plant text not unique in ${file}: ${String(find).slice(0, 70)}`);
    writeFileSync(path, text.slice(0, i) + repl + text.slice(i + find.length));
  }
}

const F = "^(?!.*(real clock|REAL clock|wall clock|real-clock|NFR-005|between a 1 s and a 3 s search)).*$";
const RUNS = {
  default: [[{}, "--max-old-space-size=128", []]],
  deepall: [
    ...["src/search.null-move.test.ts", "src/search.pvs-lmr.test.ts", "src/transposition.test.ts", "src/search.test.ts", "src/quiescence.test.ts", "src/search.ordering.test.ts"].map((f) => [{ SEARCH_DEEP: "1" }, "--max-old-space-size=400", [f]]),
    ...["src/engine.test.ts", "src/levels.test.ts", "src/transposition.test.ts", "src/search.pvs-lmr.test.ts", "src/gameend.test.ts", "src/legal.test.ts"].map((f) => [{ ENGINE_DEEP: "1" }, "--max-old-space-size=400", [f, "-t", F]]),
    [{ PUZZLE_DEEP: "1" }, "--max-old-space-size=400", ["src/puzzle-suite.test.ts"]],
  ],
  // the deep lanes whose files import the planted entry modules (uci-session, level-seam, levels); LADDER_DEEP excluded
  deepentry: [
    [{ SEARCH_DEEP: "1" }, "--max-old-space-size=400", ["src/transposition.test.ts"]],
    ...["src/engine.test.ts", "src/levels.test.ts", "src/transposition.test.ts"].map((f) => [{ ENGINE_DEEP: "1" }, "--max-old-space-size=400", [f, "-t", F]]),
  ],
}[lane];

const names = wanted[0] === "all" ? Object.keys(PLANTS) : wanted;
for (const name of names) {
  restore();
  apply(PLANTS[name]);
  const t0 = Date.now();
  let red = 0, total = 0, ok = true;
  const failed = [];
  RUNS.forEach(([envAdd, heap, files], i) => {
    const json = `${out}/plant-${lane}-${name.replace(/[:]/g, "_")}-${i}.json`;
    spawnSync("npx", ["vitest", "run", ...files, "--reporter=json", `--outputFile=${json}`], {
      cwd: tree, env: { ...process.env, NODE_OPTIONS: heap, ...envAdd }, encoding: "utf8",
    });
    try {
      const r = JSON.parse(readFileSync(json, "utf8"));
      red += r.numFailedTests; total += r.numTotalTests;
      if (r.numFailedTestSuites > 0) for (const f of r.testResults) if (f.status === "failed" && f.assertionResults.length === 0) failed.push(`SUITE FAILED ${f.name.split("/src/")[1]}: ${String(f.message).slice(0, 160)}`);
      for (const f of r.testResults)
        for (const a of f.assertionResults)
          if (a.status === "failed") failed.push(`${Object.keys(envAdd)[0] ?? "default"} ${f.name.split("/src/")[1]} :: ${a.fullName}`);
    } catch (e) { ok = false; failed.push(`NO RESULT run ${i}: ${e.message}`); }
  });
  console.log(`${name} [${lane}] ${red} red / ${total}${ok ? "" : " (INCOMPLETE)"} (${Math.round((Date.now() - t0) / 1000)} s)`);
  for (const f of failed) console.log(`    RED ${f.slice(0, 240)}`);
  restore();
}
console.log("restored and verified equal to pristine");
