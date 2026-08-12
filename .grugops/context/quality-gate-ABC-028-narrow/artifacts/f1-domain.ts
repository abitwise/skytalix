// `F1`'s FORMULA, RUN AT BOTH PARITIES — QE narrow re-gate `quality-gate-ABC-028-narrow`.
//
// The ticket now states the domain of `ABC-028 A5`'s extension rule as
//
//     preservedTail <= n - 1 - firstVisiblePly(n, blackToMoveAtAnchor)
//
// quoting 15 for `blackAnchorTo(21)` (MEASURED at the previous gate) and 14 for a half-row fixture
// (DERIVED at source by BA/PM and marked `UNKNOWN - verify`). This runs BOTH.
//
// `firstVisiblePly` is NOT exported, so it is never re-implemented here: it is MEASURED from the
// pane's own output (n minus the number of plies the pane actually shows). A re-implementation
// would only prove this file agrees with itself.
//
// The edit is built exactly as `A5`'s `it` body builds one: take back `preservedTail + 3`, play a
// replacement, then push the preserved tail back as the SAME `Move` OBJECTS.
import { newGame, playMove, takeBack, type GameHistory } from "./src/history.ts";
import { renderHistory } from "./src/history-pane.ts";
import { legalMoves } from "./src/legal.ts";
import type { Move } from "./src/moves.ts";
import { parseSquareName } from "./src/position.ts";

const ANCHOR_27_BLACK = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 27";
const CYCLE: readonly (readonly [string, string])[] = [
  ["b8", "c6"],
  ["b1", "c3"],
  ["c6", "b8"],
  ["c3", "b1"],
];

function play(history: GameHistory, from: string, to: string): void {
  const move = legalMoves(history.position).find(
    (candidate) => candidate.from === parseSquareName(from) && candidate.to === parseSquareName(to),
  );
  if (move === undefined) throw new Error(`no legal move ${from}${to}`);
  playMove(history, move);
}

/** `blackAnchorTo`, copied from `src/history-pane.test.ts:223` — the builder every `A5` row uses. */
function blackAnchorTo(plies: number): GameHistory {
  const history = newGame(ANCHOR_27_BLACK);
  for (let ply = 0; ply < plies; ply++) {
    const [from, to] = CYCLE[ply % CYCLE.length] as readonly [string, string];
    play(history, from, to);
  }
  return history;
}

/** A cell is "used" when it is non-blank. The pane's layout is `9999. WWWWWWW BBBBBBB`. */
const visiblePlyCount = (rows: readonly string[]): number =>
  rows
    .filter((row) => row.trim() !== "")
    .reduce(
      (total, row) =>
        total + (row.slice(6, 13).trim() === "" ? 0 : 1) + (row.slice(14, 21).trim() === "" ? 0 : 1),
      0,
    );

/**
 * The replacement, DERIVED rather than hand-written per rung.
 *
 * The three replaced plies are `P, P+1, P+2` where `P = n - T - 3`. `P` and `P+2` are the SAME
 * side's two knight moves, and in this cycle they always cancel (out then back, or back then out),
 * so replacing BOTH with quiet pawn moves leaves that knight exactly where the preserved tail needs
 * it. `P+1` — the other side's move — is replayed verbatim. That is why one recipe covers the whole
 * axis, and it is the same shape as the two rows the ticket landed.
 */
function replacementFor(firstIndex: number): readonly (readonly [string, string])[] {
  const outerIsBlack = firstIndex % 2 === 0; // ply 0 is Black: this anchor is black-to-move.
  const middle = CYCLE[(firstIndex + 1) % CYCLE.length] as readonly [string, string];
  return outerIsBlack
    ? [["a7", "a6"], middle, ["h7", "h6"]]
    : [["a2", "a3"], middle, ["h2", "h3"]];
}

interface Cell {
  readonly n: number;
  readonly preservedTail: number;
  readonly firstVisiblePly: number;
  readonly bound: number;
  readonly deepestChangedPly: number;
  readonly predicted: "expressible" | "off-window";
  readonly lengthHeld: boolean;
  readonly tailHeldByIdentity: boolean;
  readonly panesDiffer: boolean;
  readonly changedRows: number[];
}

function measure(n: number, preservedTail: number): Cell {
  const history = blackAnchorTo(n);
  const first = renderHistory(history);
  const firstVisible = n - visiblePlyCount(first);
  const bound = n - 1 - firstVisible;

  const replacement = replacementFor(n - preservedTail - 3);
  const kept = history.moves.slice(history.moves.length - preservedTail);

  takeBack(history, preservedTail + replacement.length);
  for (const [from, to] of replacement) play(history, from, to);
  for (const move of kept) {
    // The kept moves go back as OBJECTS (`playMove` does not validate), so legality is checked
    // HERE. A row whose tail is not legal after the edit is not a member of the class at all, and
    // silently replaying it would measure a corrupt position.
    const legal = legalMoves(history.position).some(
      (candidate) =>
        candidate.from === move.from &&
        candidate.to === move.to &&
        (candidate.promotion ?? 0) === (move.promotion ?? 0),
    );
    if (!legal) throw new Error(`kept move is not legal on replay at n=${n} T=${preservedTail}`);
    playMove(history, move as Move);
  }

  const second = renderHistory(history);
  const tailHeld = kept.every(
    (move, index) => history.moves[history.moves.length - kept.length + index] === move,
  );
  const changedRows = first
    .map((row, index) => (row === second[index] ? -1 : index))
    .filter((index) => index >= 0);

  return {
    n,
    preservedTail,
    firstVisiblePly: firstVisible,
    bound,
    deepestChangedPly: n - 1 - preservedTail,
    predicted: preservedTail <= bound ? "expressible" : "off-window",
    lengthHeld: history.moves.length === n,
    tailHeldByIdentity: tailHeld,
    panesDiffer: changedRows.length > 0,
    changedRows,
  };
}

console.log("F1's formula: preservedTail <= n - 1 - firstVisiblePly(n, blackToMoveAtAnchor)");
console.log("firstVisiblePly MEASURED from the pane's own output, never re-implemented.\n");

for (const n of [21, 22]) {
  const probe = blackAnchorTo(n);
  const rows = renderHistory(probe);
  const visible = visiblePlyCount(rows);
  const lastRow = rows.filter((row) => row.trim() !== "").at(-1) as string;
  const half = lastRow.slice(14, 21).trim() === "" ? "HALF-ROW" : "full row";
  console.log(
    `blackAnchorTo(${n}): visible plies ${visible}, firstVisiblePly ${n - visible}, ` +
      `window ${n - visible}..${n - 1}, last visible row is a ${half}, BOUND ${n - 1 - (n - visible)}`,
  );
}

console.log("\n n   T    fvp  bound  deepest  predicted     length  tail-id  panes    rows changed");
console.log("---- ---- ---- -----  -------  ------------  ------  -------  -------  ------------");
for (const n of [21, 22]) {
  for (const preservedTail of [12, 13, 14, 15, 16, 17]) {
    const cell = measure(n, preservedTail);
    const agree =
      (cell.predicted === "expressible") === cell.panesDiffer ? "" : "   <<< FORMULA WRONG";
    console.log(
      ` ${String(cell.n).padEnd(3)} ${String(cell.preservedTail).padEnd(4)} ` +
        `${String(cell.firstVisiblePly).padEnd(4)} ${String(cell.bound).padEnd(6)} ` +
        `${String(cell.deepestChangedPly).padEnd(8)} ${cell.predicted.padEnd(13)} ` +
        `${(cell.lengthHeld ? "held" : "MOVED").padEnd(7)} ` +
        `${(cell.tailHeldByIdentity ? "held" : "MOVED").padEnd(8)} ` +
        `${(cell.panesDiffer ? "DIFFER" : "same").padEnd(8)} ` +
        `${cell.changedRows.length === 0 ? "-" : cell.changedRows.join(",")}${agree}`,
    );
  }
}

// The full sweep, so the boundary is located rather than sampled at two points.
console.log("\nFULL SWEEP — the largest T at which the panes still differ, per fixture:");
for (const n of [20, 21, 22, 23]) {
  const rows = renderHistory(blackAnchorTo(n));
  const bound = n - 1 - (n - visiblePlyCount(rows));
  let largest = -1;
  const profile: string[] = [];
  for (let preservedTail = 0; preservedTail <= n - 3; preservedTail++) {
    let differ: boolean;
    try {
      differ = measure(n, preservedTail).panesDiffer;
    } catch {
      profile.push("x");
      continue;
    }
    profile.push(differ ? "D" : ".");
    if (differ) largest = preservedTail;
  }
  console.log(
    `  n=${n}  formula bound ${bound}  measured largest-differing T ${largest}  ` +
      `${largest === bound ? "AGREE" : "*** DISAGREE ***"}   profile T=0..${n - 3}: ${profile.join("")}`,
  );
}
