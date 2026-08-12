// The UNDO/REDO consumer path, played through the public API only — `takeBack` then `playMove`
// with a Move object the caller SAVED, which is what a redo stack holds. `playMove` pushes the
// caller's object verbatim (`src/history.ts:85-88`), so the last move's IDENTITY is preserved
// across a redo while an EARLIER ply changes.
import { type GameHistory, newGame, playMove, takeBack } from "./src/history.ts";
import { renderHistory } from "./src/history-pane.ts";
import { legalMoves } from "./src/legal.ts";
import type { Move } from "./src/moves.ts";
import { parseSquareName } from "./src/position.ts";

const ANCHOR_27_BLACK = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 27";
const CYCLE: readonly (readonly [string, string])[] = [
  ["b8", "c6"], ["b1", "c3"], ["c6", "b8"], ["c3", "b1"],
];

function moveFor(history: GameHistory, from: string, to: string): Move {
  const move = legalMoves(history.position).find(
    (candidate) => candidate.from === parseSquareName(from) && candidate.to === parseSquareName(to),
  );
  if (move === undefined) throw new Error(`no legal move ${from}${to}`);
  return move;
}

function blackAnchorTo(plies: number): GameHistory {
  const history = newGame(ANCHOR_27_BLACK);
  for (let ply = 0; ply < plies; ply++) {
    const [from, to] = CYCLE[ply % CYCLE.length] as readonly [string, string];
    playMove(history, moveFor(history, from, to));
  }
  return history;
}

const history = blackAnchorTo(21);
const first = renderHistory(history);

// The redo stack keeps the popped move OBJECT. Ply 20 is Nb8-c6 (black); ply 19 is Nc3-b1 (white).
const redoLast = history.moves[20] as Move;
takeBack(history, 2);

// The user redoes differently at ply 19 — Nc3-e4 instead of Nc3-b1 — and then REDOES the saved
// last move, which is still legal. Same length, SAME last-move object, different game.
playMove(history, moveFor(history, "c3", "e4"));
playMove(history, redoLast);

const second = renderHistory(history);

console.log(`moves.length  first ${21}  second ${history.moves.length}`);
console.log(`last move identity preserved: ${history.moves[20] === redoLast}`);
console.log(`render 1 last row: "${first[7] as string}"`);
console.log(`render 2 last row: "${second[7] as string}"`);
console.log(`panes differ: ${JSON.stringify(first) !== JSON.stringify(second)}`);
