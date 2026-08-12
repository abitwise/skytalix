// WHICH MOVE INDICES DOES EACH CRITERION'S EDIT ACTUALLY CHANGE?
//
// A cache in this class is a function of (moves.length, some WATCHED SET of positions in the move
// list). Every edit below preserves the length, so such a cache HITs — and shows a stale pane —
// exactly when its watched set MISSES every index the edit changed. So the changed-index set of
// each criterion is what decides which keys the project owns a guard for. It is measured here
// rather than read off the criterion's prose.
//
// Run from a lane root: `node __probe.ts`.
import { type GameHistory, newGame, playMove, takeBack } from "./src/history.ts";
import { HISTORY_ROWS, renderHistory } from "./src/history-pane.ts";
import { legalMoves } from "./src/legal.ts";
import type { Move } from "./src/moves.ts";
import { parseSquareName } from "./src/position.ts";

const ANCHOR_27_BLACK = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 27";
const CYCLE: readonly (readonly [string, string])[] = [
  ["b8", "c6"], ["b1", "c3"], ["c6", "b8"], ["c3", "b1"],
];

function play(history: GameHistory, from: string, to: string): void {
  const move = legalMoves(history.position).find(
    (candidate) => candidate.from === parseSquareName(from) && candidate.to === parseSquareName(to),
  );
  if (move === undefined) throw new Error(`no legal move ${from}${to}`);
  playMove(history, move);
}

function blackAnchorTo(plies: number): GameHistory {
  const history = newGame(ANCHOR_27_BLACK);
  for (let ply = 0; ply < plies; ply++) {
    const [from, to] = CYCLE[ply % CYCLE.length] as readonly [string, string];
    play(history, from, to);
  }
  return history;
}

const normalised = (row: string): string => row.trim().replace(/\s+/g, " ");
const valueOf = (move: Move): string => `${move.from}->${move.to}/${move.promotion ?? 0}`;

interface Shape {
  readonly name: string;
  readonly plies: number;
  readonly preservedTail: number;
  readonly replacement: readonly (readonly [string, string])[];
  /** `A1`'s shape is not a preserved-tail edit: take back N and play different moves. */
  readonly a1Style?: readonly (readonly [string, string])[];
}

const SHAPES: readonly Shape[] = [
  // ABC-028 A1, as the landed test plays it: append b8c6, then takeBack(1) + play g8f6.
  { name: "A1 (landed)", plies: 20, preservedTail: 0, replacement: [], a1Style: [["g8", "f6"]] },
  // ABC-028 A5 row 1 and row 2, exactly as A5_SHAPES declares them.
  { name: "A5 row 1 (landed)", plies: 21, preservedTail: 1, replacement: [["c3", "e4"]] },
  {
    name: "A5 row 2 (landed)",
    plies: 21,
    preservedTail: 2,
    replacement: [["a7", "a6"], ["b1", "c3"], ["h7", "h6"]],
  },
  // Candidate rows this hop constructs to test the EXTENSION MECHANISM, not landed anywhere.
  {
    name: "candidate row 3 (preservedTail 3)",
    plies: 21,
    preservedTail: 3,
    replacement: [["a2", "a3"], ["b8", "c6"], ["h2", "h3"]],
  },
  {
    name: "candidate row 15 (preservedTail 15, the LAST expressible rung)",
    plies: 21,
    preservedTail: 15,
    replacement: [["a2", "a3"], ["b8", "c6"], ["h2", "h3"]],
  },
  {
    name: "candidate row 16 (preservedTail 16, past the window)",
    plies: 21,
    preservedTail: 16,
    replacement: [["a7", "a6"], ["c3", "b1"], ["h7", "h6"]],
  },
];

function firstVisible(plies: number, blackAnchor: boolean): number {
  const leading = blackAnchor ? 1 : 0;
  return Math.max(0, Math.max(0, Math.ceil((plies + leading) / 2) - HISTORY_ROWS) * 2 - leading);
}

for (const shape of SHAPES) {
  const history = blackAnchorTo(shape.plies);
  let before = [...history.moves];
  let first = renderHistory(history);

  if (shape.a1Style !== undefined) {
    // `A1`'s discriminating pair is renders 2 and 3 — both at 21 plies. The append that produces
    // render 2 is not the length-preserving edit and is excluded from the comparison.
    play(history, "b8", "c6");
    before = [...history.moves];
    first = renderHistory(history);
    takeBack(history, 1);
    for (const [from, to] of shape.a1Style) play(history, from, to);
  } else {
    const kept = history.moves.slice(history.moves.length - shape.preservedTail);
    takeBack(history, shape.preservedTail + shape.replacement.length);
    for (const [from, to] of shape.replacement) play(history, from, to);
    for (const move of kept) playMove(history, move);
  }

  const after = [...history.moves];
  const second = renderHistory(history);

  const identityChanged: number[] = [];
  const valueChanged: number[] = [];
  for (let index = 0; index < Math.max(before.length, after.length); index++) {
    const a = before[index];
    const b = after[index];
    if (a !== b) identityChanged.push(index);
    if (a === undefined || b === undefined || valueOf(a) !== valueOf(b)) valueChanged.push(index);
  }

  const rowsChanged: number[] = [];
  for (let row = 0; row < first.length; row++) {
    if (first[row] !== second[row]) rowsChanged.push(row);
  }

  console.log(`--- ${shape.name}`);
  console.log(`  length          ${before.length} -> ${after.length}`);
  console.log(`  window          indices ${firstVisible(after.length, true)}..${after.length - 1}`);
  console.log(`  identity moved  [${identityChanged.join(", ")}]`);
  console.log(`  value moved     [${valueChanged.join(", ")}]`);
  console.log(`  rows differ     [${rowsChanged.join(", ")}]  (0-based)`);
  for (const row of rowsChanged) {
    console.log(
      `     row ${row}: "${normalised(first[row] as string)}" -> "${normalised(second[row] as string)}"`,
    );
  }
  if (rowsChanged.length === 0) console.log("     PANES ARE IDENTICAL — this row cannot report");
}
