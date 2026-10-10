// QE mutant planter for ABC-087 (qe-ABC-087). Usage: node mutate.cjs <copy-root> <mutant-id>
// Plants ONE mutant into <copy-root>/src/levels.ts by exact, single-occurrence replacement.
// Runs only on `git archive` copies in QE's scratchpad, never in a worktree.
const fs = require("node:fs");
const path = require("node:path");

const PICK = `  let pick: ScoredMove | undefined;
  for (const entry of scored) {
    if (
      entry.score < best &&
      entry.score > worst &&
      (pick === undefined || entry.score > pick.score)
    ) {
      pick = entry;
    }
  }`;
const CALL = "return blunder(position, Math.min(level.budgetMs, HARD_CEILING_MS), now);";
const SIG = "function blunder(position: Position, budgetMs: number, now: Clock): LevelChoice | null {";
const SIG_R = "function blunder(position: Position, budgetMs: number, now: Clock, random: () => number = Math.random): LevelChoice | null {";
const CALL_R = "return blunder(position, Math.min(level.budgetMs, HARD_CEILING_MS), now, random);";

const MUTANTS = {
  // Task-named
  M1_nonstrict_second: [[PICK, `  const order = scored.map((_, i) => i).sort((a, b) => (scored[b] as ScoredMove).score - (scored[a] as ScoredMove).score || a - b);
  const second = scored[order[1] as number];
  const pick: ScoredMove | undefined = second !== undefined && second.score > worst ? second : undefined;`]],
  M2_uniform_nonworst: [[CALL, CALL_R], [SIG, SIG_R], [PICK, `  const pool = scored.filter((s) => s.score > worst);
  const pick: ScoredMove | undefined = worst < best ? pool[Math.floor(random() * pool.length)] : undefined;`]],
  M3a_seed_perturbs_engine_budget: [["const choice = chooseMove(position, { budgetMs: level.budgetMs, now });",
    "const choice = chooseMove(position, { budgetMs: level.budgetMs * (0.9 + 0.2 * random()), now });"]],
  M3b_seed_as_engine_option: [["const choice = chooseMove(position, { budgetMs: level.budgetMs, now });",
    "const choice = chooseMove(position, { budgetMs: level.budgetMs, now, seed: options.seed });"]],
  M4_clamp_removed: [[CALL, "return blunder(position, level.budgetMs, now);"]],
  M5a_draw_per_root_move_decides: [["if (random() >= level.blunderRate) {",
    "if (legalMoves(position).every(() => random() >= level.blunderRate)) {"]],
  M5b_extra_draw_per_root_move: [[CALL, CALL_R], [SIG, SIG_R], ["moves.forEach((move, i) => {", "moves.forEach((move, i) => {\n    random();"]],
  // QE's own
  M6_worst_not_excluded: [["      entry.score > worst &&\n", ""]],
  M7_ties_to_last: [["(pick === undefined || entry.score > pick.score)", "(pick === undefined || entry.score >= pick.score)"]],
  M8_child_score_sign_flipped: [["scored.push({ move, score: -child.score });", "scored.push({ move, score: child.score });"]],
  M9_deadline_not_shared: [["const child = chooseMove(position, { budgetMs: deadline - now(), now });",
    "const child = chooseMove(position, { budgetMs: budgetMs + 0 * deadline, now });"]],
};

const [root, id] = process.argv.slice(2);
const edits = MUTANTS[id];
if (!edits) throw new Error(`unknown mutant ${id}; known: ${Object.keys(MUTANTS).join(" ")}`);
const file = path.join(root, "src", "levels.ts");
let src = fs.readFileSync(file, "utf8");
for (const [from, to] of edits) {
  const n = src.split(from).length - 1;
  if (n !== 1) throw new Error(`${id}: anchor matched ${n} times, want 1:\n${from}`);
  src = src.replace(from, () => to);
}
fs.writeFileSync(file, src);
console.log(`${id}: planted ${edits.length} edit(s) in ${file}`);
if (require.main === module && process.argv[4] === "--list") console.log(Object.keys(MUTANTS).join("\n"));
