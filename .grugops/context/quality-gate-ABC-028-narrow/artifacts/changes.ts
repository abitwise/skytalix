// The `changes` values for the four boundary candidate rows, MEASURED on the DELIVERED pane before
// any row is written (`## Test notes` 4). Nothing here is predicted.
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
const normalised = (row: string): string => row.trim().replace(/\s+/g, " ");

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

function replacementFor(firstIndex: number): readonly (readonly [string, string])[] {
  const middle = CYCLE[(firstIndex + 1) % CYCLE.length] as readonly [string, string];
  return firstIndex % 2 === 0
    ? [["a7", "a6"], middle, ["h7", "h6"]]
    : [["a2", "a3"], middle, ["h2", "h3"]];
}

for (const [n, preservedTail] of [
  [21, 14],
  [21, 15],
  [21, 16],
  [22, 14],
  [22, 15],
] as const) {
  const history = blackAnchorTo(n);
  const kept = history.moves.slice(history.moves.length - preservedTail);
  const first = renderHistory(history);
  const replacement = replacementFor(n - preservedTail - 3);
  takeBack(history, preservedTail + replacement.length);
  for (const [from, to] of replacement) play(history, from, to);
  for (const move of kept) playMove(history, move as Move);
  const second = renderHistory(history);

  const changes = first
    .map((row, index) => [index, normalised(row), normalised(second[index] as string)] as const)
    .filter(([, before, after]) => before !== after);

  console.log(`\n=== blackAnchorTo(${n})  preservedTail ${preservedTail}`);
  console.log(`    replacement: ${JSON.stringify(replacement)}`);
  console.log(`    length after: ${history.moves.length}  (must be ${n})`);
  console.log(
    `    tail by identity: ${kept.every((m, i) => history.moves[history.moves.length - kept.length + i] === m)}`,
  );
  console.log(`    changes: ${JSON.stringify(changes)}`);
}
