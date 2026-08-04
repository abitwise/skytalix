/**
 * Game history — the move list is the authoritative state.
 *
 * `ADR-0002` clause 2, ratified: the move list is the authority, and the undo stack, the key list
 * and the repetition counts are DERIVED BY REPLAY, never maintained. That is what makes the bug
 * `EPIC-006` predicts — "a shallow undo that forgets repetition history would corrupt draw
 * detection" — unrepresentable rather than merely tested for: there is no second structure to fall
 * out of step with the list.
 *
 * The API is not re-decided here. It is `epic-to-tickets-EPIC-002` note
 * `20260730T143500Z-architect-design-decision-d7a42f7a` (SEAM 1, the exact API), and the absence of
 * any cache is `…-decision-38b772b6` (SEAM 2). `keyHistory` and `repetitionCounts` recompute on
 * every call — no memo, no version counter, no invalidation. The loop makes two to four derives per
 * turn at a measured 46-50 µs each at 120 plies, and it would take ~320 in one turn to spend a
 * single 16 ms frame. The margin is 80x-300x and it was measured, not argued.
 *
 * The initial position is held as a FEN STRING and never as a `Position`, because nothing in `src/`
 * clones a `Position` and no clone function exists — a held one would be aliased by the first
 * replay and destroyed by it. Re-parsing costs a measured 1.62 µs, 3% of one full derive.
 *
 * Free functions over a plain interface, no class: `Position` is an interface and
 * `makeMove(position, move)` is a free function, and this module matches that (AGENTS.md rule 11).
 * Every dependency edge is downward — `fen`, `apply`, `zobrist`, `gameend` — and nothing in the
 * rules core imports this module. It does not import `legal.ts` and does not import `san.ts`.
 */

import { makeMove } from "./apply.ts";
import { parseFen } from "./fen.ts";
import { type GameStatus, gameStatus } from "./gameend.ts";
import type { Move } from "./moves.ts";
import type { Position } from "./position.ts";
import { zobristKey } from "./zobrist.ts";

export interface GameHistory {
  /** The anchor, stored verbatim. Immutable by construction; never held as a `Position`. */
  readonly initialFen: string;
  /** THE authoritative state (ADR-0002 clause 2). Everything else is a function of this. */
  readonly moves: readonly Move[];
  /**
   * Live, forward-applied, BORROWED — never a snapshot. Read it; never mutate it, and do not hold
   * the reference across a `takeBack`. The contract is documented and tested, not typed:
   * `readonly` stops reassignment, it does not stop `history.position.board[0] = 0`, and there is
   * no deep-readonly for a `Uint8Array`. A caller wanting a snapshot calls `toFen(h.position)`.
   */
  readonly position: Position;
}

/**
 * The module's own writable view of the move list. `GameHistory`'s `readonly` states the CALLER's
 * contract — only the functions below may change a history — and TypeScript cannot express
 * "writable in this module, readonly outside", so the two mutators reach through it in this one
 * named place rather than casting inline.
 */
const moveListOf = (history: GameHistory): Move[] => history.moves as Move[];

/** Overwrites `target` with the position `fen` describes, keeping the caller's borrowed object. */
function resetTo(target: Position, fen: string): void {
  const source = parseFen(fen);
  target.board.set(source.board);
  target.blackToMove = source.blackToMove;
  target.castling = source.castling;
  target.epSquare = source.epSquare;
  target.halfmoveClock = source.halfmoveClock;
  target.fullmoveNumber = source.fullmoveNumber;
}

/**
 * A new game anchored at `initialFen`. The FEN is REQUIRED and has no default: a `STARTPOS` default
 * would put a fifth copy of the start FEN in the codebase or force a new shared constant, and
 * `EPIC-006` owns startup and supplies it. Throws `FenError` if the anchor does not parse, which is
 * also why no later replay of it can fail.
 */
export function newGame(initialFen: string): GameHistory {
  return { initialFen, moves: [], position: parseFen(initialFen) };
}

/**
 * Appends `move` to the list and applies it to the live position.
 *
 * IT DOES NOT VALIDATE LEGALITY. Its precondition is that `move` came from
 * `legalMoves(history.position)`, which is exactly where `EPIC-003`'s parser gets it. That matches
 * the core's own style — `makeMove` trusts its input too. The alternative, a defensive
 * `legalMoves` check at ~2-5 µs, is affordable and was considered at SEAM 1 and left out there.
 */
export function playMove(history: GameHistory, move: Move): void {
  moveListOf(history).push(move);
  makeMove(history.position, move);
}

/**
 * Undoes the last `plies` moves: truncates the list, then rebuilds the position by replay from
 * `initialFen`. This is `ADR-0002`'s contract made mechanical — undo is one operation on one list,
 * so nothing derived can be left behind. `EPIC-006`'s undo is `takeBack(history, 2)`.
 *
 * It CLAMPS at zero rather than trusting the caller: taking back more plies than were played
 * leaves the initial position, which is a legal state, where truncating to a negative length would
 * silently produce a DIFFERENT game — a silent-corruption path, not an impossible scenario.
 */
export function takeBack(history: GameHistory, plies: number): void {
  const moves = moveListOf(history);
  moves.splice(Math.max(0, moves.length - plies));

  resetTo(history.position, history.initialFen);
  for (const move of moves) makeMove(history.position, move);
}

/**
 * `keys[i]` is the Zobrist key of the position after `i` plies, so the array has
 * `moves.length + 1` entries and its last one is the live position's key.
 *
 * This is `ADR-0002` clause 3's seam: `EPIC-004` seeds its preallocated per-ply array from this
 * ONCE PER SEARCH — never per node — and `EPIC-005` probes the opening book against the same list.
 * The clause names it the one place the session's representation and the search's array meet, so
 * it is one named function rather than an ad hoc walk in each caller.
 */
export function keyHistory(history: GameHistory): bigint[] {
  const position = parseFen(history.initialFen);
  const keys = [zobristKey(position)];

  for (const move of history.moves) {
    makeMove(position, move);
    keys.push(zobristKey(position));
  }

  return keys;
}

/**
 * How many times each position in the game has occurred, INCLUDING THE CURRENT ONE — `gameStatus`
 * tests `counts.get(zobristKey(position)) >= 3`, so counting only the past would report threefold
 * one repetition late, silently.
 *
 * Counting from ply 0 rather than from the last irreversible move is correct: a capture or a pawn
 * move changes the key permanently, so positions either side of one can never collide.
 */
export function repetitionCounts(history: GameHistory): ReadonlyMap<bigint, number> {
  const counts = new Map<bigint, number>();
  for (const key of keyHistory(history)) counts.set(key, (counts.get(key) ?? 0) + 1);
  return counts;
}

/**
 * The status of the live position, WITH this game's repetition counts supplied.
 *
 * It exists to make `ADR-0002` clause 4 — `positionCounts` gets exactly one supplier — a call-site
 * default rather than a convention someone must remember. Honest limit: it does not PREVENT anyone
 * calling `gameStatus(position)` bare and getting a silently repetition-free answer. That
 * parameter stays optional on purpose, because clause 3 has `EPIC-004`'s search keep its own
 * per-ply key array and decide repetition itself, so a bare search leaf is a legitimate second
 * caller shape.
 */
export function gameStatusOf(history: GameHistory): GameStatus {
  return gameStatus(history.position, repetitionCounts(history));
}
