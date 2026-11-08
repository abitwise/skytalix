// SCRATCH PROBE (arch-ABC-298-probe; ADR-0077 d9 step 3). Writes the counters into a scratch copy's
// src/engine.ts `negamax`, the shipped chooseMove path. Counters only: each insertion is an
// increment of a module-level typed array and changes no value, branch or call the search makes.
// Every anchor must match exactly once, or the patch throws and writes nothing.
// Usage: node patch_count.mjs <copy root>
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.argv[2];
if (root === undefined) throw new Error("usage: node patch_count.mjs <copy root>");
const file = join(root, "src/engine.ts");
let text = readFileSync(file, "utf8");
const R = "remaining > 63 ? 63 : remaining";

const edits = [
  // G: a full-width node below the root that reaches legalMoves (negamax only; the root's list is
  // built in deepen, not here).
  [
    "  const moves = legalMoves(position);\n  if (moves.length === 0) return isInCheck(position)",
    `  PROBE_G[${R}]++; // PROBE\n  const moves = legalMoves(position);\n  if (moves.length === 0) return isInCheck(position)`,
  ],
  // H by remaining depth: the probe hit and entryMove is not null. In engine.ts the table is always
  // on and the ordering always "full", so d1's gate is this at remaining 1 or 2.
  [
    "  const hashMove = slot === -1 ? null : entryMove(slot, moves);\n",
    `  const hashMove = slot === -1 ? null : entryMove(slot, moves);\n  if (hashMove !== null) PROBE_H[${R}]++; // PROBE\n`,
  ],
  // Instrument check X[0]: a hash move that the sort did not put first. Expected 0.
  [
    "  // Move-count pruning (`ABC-303`): the tail is read here, before any recursion reuses the keys.\n",
    "  if (hashMove !== null && list[0] !== hashMove) PROBE_X[0]++; // PROBE\n  // Move-count pruning (`ABC-303`): the tail is read here, before any recursion reuses the keys.\n",
  ],
  // C by remaining depth: of H, the hash move cut off at index 0 (index is 1 after the first move;
  // futility and the move-count rule never skip index 0). X[1]: a cut at index 0 by a move that is
  // not the hash move at a node that has one. Expected 0.
  [
    "    if (alpha >= beta) {\n      if (budget.history) {\n        recordHistoryCutoff(",
    `    if (alpha >= beta) {\n      if (hashMove !== null && index === 1) { if (move === hashMove) PROBE_C[${R}]++; else PROBE_X[1]++; } // PROBE\n      if (budget.history) {\n        recordHistoryCutoff(`,
  ],
];
for (const [from, to] of edits) {
  const n = text.split(from).length - 1;
  if (n !== 1) throw new Error(`anchor matched ${n} times: ${JSON.stringify(from.slice(0, 60))}`);
  text = text.replace(from, () => to);
}
text +=
  "\n// PROBE (arch-ABC-298-probe): counters by remaining depth (index 63 holds 63 and above). Read by probe.ts.\n" +
  "export const PROBE_G = new Float64Array(64);\n" +
  "export const PROBE_H = new Float64Array(64);\n" +
  "export const PROBE_C = new Float64Array(64);\n" +
  "export const PROBE_X = new Float64Array(2);\n";
writeFileSync(file, text);
console.log(`patched ${edits.length} anchors + 4 exports`);
