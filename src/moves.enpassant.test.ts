/**
 * ABC-022 — the two en-passant GENERATION preconditions.
 *
 * Before the fix, `addPawnMoves` emitted a `FLAG_EN_PASSANT` move on the single test
 * `to === epSquare`, while the comment above it named two preconditions it checked
 * nowhere:
 *
 *   (a) the target square is EMPTY. The ordinary-capture branch consumes enemy
 *       occupants and `continue`s, so an occupant of the MOVER'S OWN colour fell
 *       through and the generator offered a capture onto the mover's own piece.
 *   (b) the pawn the move claims to capture is on the capture square. The move was
 *       emitted with `captured: PAWN | …` regardless, and `undoSpecial` writes that
 *       byte back unconditionally — so when the board never held that pawn the
 *       "restore" CREATED one, permanently, inside a `legalMoves` call.
 *
 * `src/moves.ts` CHECKS both now, so every row below reads 0 where it read 1 — which is
 * these tables' job and not a reason to retire them. Delete the emptiness condition from
 * the shipped fix and 8 of the 58 tests here go red; delete the captured-pawn condition
 * and 23 do, the purity rows among them: `undoSpecial` is untouched by ABC-022 and still
 * restores `move.captured` unconditionally, so the generator declining to emit the move
 * is the whole of half (b)'s guard.
 *
 * Both halves reach both colours to move. A fix that guards (b) for white only passes
 * every criterion this ticket carried before 2026-08-09 and the whole suite, while
 * still creating a phantom white pawn on e4 — which is why every table below crosses
 * the colour axis explicitly.
 *
 * Purity (`A4`) is asserted over the FULL position state — all 128 board bytes and all
 * five scalars, field by field — and deliberately NOT through `toFen`: `toFen` renders
 * `epSquare` 32 (`a3`) and 40 (`0x28`, off-board) identically and hides 28 distinct
 * `castling` bit values, so it is not injective on the state it would be asked to
 * compare. It is also asserted per make/unmake PAIR and not only across the whole call,
 * because the call-level oracle SELF-MASKED: on `4k3/8/8/8/3pp3/8/8/4K3 b - e3 0 1` the
 * en-passant move rewrote e4 from a black pawn to a white one and the very next move in
 * the same pass wrote it back, so the call read CLEAN on a board the generator was
 * provably corrupting. The pair-level oracle is the one that saw it, and it stays for
 * the same reason the tables do.
 *
 * This file is new rather than appended to `moves.test.ts` so that "no existing test is
 * modified" (`A9`) is a mechanical fact rather than an inspection — the same reason
 * `moves.castling.test.ts` was cut new for ABC-009.
 */

import { describe, expect, it } from "vitest";
import { makeMove, unmakeMove } from "./apply.ts";
import { parseFenGrammarOnly as parseFen } from "./fen.ts";
import { legalMoves } from "./legal.ts";
import { FLAG_EN_PASSANT, generateMoves, type Move } from "./moves.ts";
import type { Position } from "./position.ts";

/** All 128 board bytes and all five scalars — the whole state, kept field by field. */
interface StateSnapshot {
  readonly board: number[];
  readonly blackToMove: boolean;
  readonly castling: number;
  readonly epSquare: number;
  readonly halfmoveClock: number;
  readonly fullmoveNumber: number;
}

function snapshot(position: Position): StateSnapshot {
  return {
    board: Array.from(position.board),
    blackToMove: position.blackToMove,
    castling: position.castling,
    epSquare: position.epSquare,
    halfmoveClock: position.halfmoveClock,
    fullmoveNumber: position.fullmoveNumber,
  };
}

/** Compares every field on its own, so a failure names the field that moved. */
function expectSameState(position: Position, before: StateSnapshot, label: string): void {
  expect(Array.from(position.board), `board bytes: ${label}`).toEqual(before.board);
  expect(position.blackToMove, `blackToMove: ${label}`).toBe(before.blackToMove);
  expect(position.castling, `castling: ${label}`).toBe(before.castling);
  expect(position.epSquare, `epSquare: ${label}`).toBe(before.epSquare);
  expect(position.halfmoveClock, `halfmoveClock: ${label}`).toBe(before.halfmoveClock);
  expect(position.fullmoveNumber, `fullmoveNumber: ${label}`).toBe(before.fullmoveNumber);
}

/** How many of `moves` carry FLAG_EN_PASSANT. */
function enPassantCount(moves: Move[]): number {
  return moves.filter((move) => (move.flags & FLAG_EN_PASSANT) !== 0).length;
}

/**
 * `A1` / half (a) — a piece of the MOVER'S OWN colour stands on the en-passant target.
 * Two piece types on both colours to move: the falling-through test at the capture
 * branch reads only the occupant's COLOUR, so a knight-shaped table would under-specify
 * the defect. Before the fix every row offered the capture and `legalMoves` passed it
 * through; playing it removed the mover's own piece by overwrite.
 */
const OWN_COLOUR_OCCUPANT: readonly string[] = [
  "4k3/8/8/8/3pP3/4n3/8/4K3 b - e3 0 1", // own knight on e3, black to move
  "4k3/8/3N4/3pP3/8/8/8/4K3 w - d6 0 1", // own knight on d6, white to move
  "4k3/8/8/8/3pP3/4r3/8/4K3 b - e3 0 1", // own ROOK on e3, black to move
  "4k3/8/3R4/3pP3/8/8/8/4K3 w - d6 0 1", // own ROOK on d6, white to move
];

/**
 * `A3` / half (b) — the en-passant target is empty but the pawn the move claims to
 * capture is not on the board. Both colours to move: the first three rows are the
 * recorded white-to-move reproductions, rows 4 and 5 are the black-to-move mirror that
 * created a phantom WHITE pawn (row 5 on the h-file, where the edge test lives), and
 * row 6 is the self-masking witness whose corruption was healed later in the same pass.
 */
const NO_CAPTURED_PAWN: readonly string[] = [
  "4k3/8/8/8/8/8/1P6/4K3 w - a3 0 1", // nothing on a2 — phantom BLACK pawn a2
  "4k3/8/8/4P3/8/8/8/4K3 w - d6 0 1", // nothing on d5 — phantom BLACK pawn d5
  "4k3/8/8/3PP3/8/8/8/4K3 w - d6 0 1", // a WHITE pawn on d5 — rewritten BLACK
  "4k3/8/8/8/3p4/8/8/4K3 b - e3 0 1", // nothing on e4 — phantom WHITE pawn e4
  "4k3/8/8/8/6p1/8/8/4K3 b - h3 0 1", // nothing on h4 — phantom WHITE pawn h4, edge file
  "4k3/8/8/8/3pp3/8/8/4K3 b - e3 0 1", // a BLACK pawn on e4 — rewritten WHITE, then healed
];

/**
 * `A5` — an ENEMY piece on the target. Already 0 today, and kept as the ONE guard on
 * this board against a colour-shaped RESTRUCTURE: rejecting own-colour occupants at the
 * top of the loop while dropping the ordinary-capture branch's own `continue` lets every
 * enemy occupant fall into the en-passant branch. That mutant passes A1-A4, A6, the full
 * suite and the deep perft lane — perft is blind because an occupied en-passant target
 * is unreachable in legal play — and fails only here.
 *
 * It is NOT a discriminator between an emptiness-shaped and a colour-shaped CLAUSE: at
 * this program point the two are behaviour-equivalent over the branch's entire input
 * domain, so no position can tell them apart and this table does not claim to.
 */
const ENEMY_OCCUPANT: readonly string[] = [
  "4k3/8/8/8/3pP3/4N3/8/4K3 b - e3 0 1", // enemy knight on e3, black to move
  "4k3/8/3n4/3pP3/8/8/8/4K3 w - d6 0 1", // enemy knight on d6, white to move
  "4k3/8/8/8/3pP3/4R3/8/4K3 b - e3 0 1", // enemy ROOK on e3, black to move
  "4k3/8/3r4/3pP3/8/8/8/4K3 w - d6 0 1", // enemy ROOK on d6, white to move
];

/** `A6` — the two valid en-passant positions the fix must keep offering. */
const VALID_EN_PASSANT = "4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1";
const VALID_BUT_PINNED = "7k/8/8/K1Pp3r/8/8/8/8 w - d6 0 1"; // c5d6, capturer pinned on the 5th rank

/**
 * `A4`'s population: every position this file uses, which is a strict superset of the
 * `## Reproduction` tables — the half-(a) rows, the half-(b) rows on both colours, and
 * the control rows.
 */
const EVERY_POSITION: readonly string[] = [
  ...OWN_COLOUR_OCCUPANT,
  ...NO_CAPTURED_PAWN,
  ...ENEMY_OCCUPANT,
  VALID_EN_PASSANT,
  VALID_BUT_PINNED,
];

describe("ABC-022 A1 — half (a): no en-passant onto a square the mover's OWN piece holds", () => {
  it.each(OWN_COLOUR_OCCUPANT)("generateMoves offers no en-passant move on %s", (fen) => {
    expect(enPassantCount(generateMoves(parseFen(fen))), `generateMoves: ${fen}`).toBe(0);
  });
});

describe("ABC-022 A3 — half (b): no en-passant when the captured pawn is not there", () => {
  it.each(NO_CAPTURED_PAWN)("generateMoves offers no en-passant move on %s", (fen) => {
    expect(enPassantCount(generateMoves(parseFen(fen))), `generateMoves: ${fen}`).toBe(0);
  });
});

describe("ABC-022 A2 — the legality filter rescues neither half", () => {
  it.each([...OWN_COLOUR_OCCUPANT, ...NO_CAPTURED_PAWN])(
    "legalMoves returns no en-passant move on %s",
    (fen) => {
      expect(enPassantCount(legalMoves(parseFen(fen))), `legalMoves: ${fen}`).toBe(0);
    },
  );
});

describe("ABC-022 A4 — legalMoves leaves its argument byte-identical", () => {
  it.each(EVERY_POSITION)(
    "keeps all 128 bytes and all five scalars across the call on %s",
    (fen) => {
      const position = parseFen(fen);
      const before = snapshot(position);

      legalMoves(position);

      expectSameState(position, before, fen);
    },
  );

  it.each(EVERY_POSITION)("keeps them after every individual make/unmake pair on %s", (fen) => {
    const position = parseFen(fen);
    const before = snapshot(position);

    // Per PAIR, not only across the call: a corruption one move makes can be healed by a
    // later move in the same pass, and then the call-level oracle reads CLEAN.
    for (const move of generateMoves(position)) {
      const undo = makeMove(position, move);
      unmakeMove(position, move, undo);
      expectSameState(position, before, `${fen} after ${move.from}->${move.to}`);
    }
  });
});

describe("ABC-022 A5 — regression guard: an ENEMY occupant on the target is still rejected", () => {
  it.each(ENEMY_OCCUPANT)("generateMoves offers no en-passant move on %s", (fen) => {
    expect(enPassantCount(generateMoves(parseFen(fen))), `generateMoves: ${fen}`).toBe(0);
  });
});

describe("ABC-022 A6 — regression guard: the fix must not over-reject", () => {
  it("still offers the valid en-passant capture, and it is legal", () => {
    expect(enPassantCount(generateMoves(parseFen(VALID_EN_PASSANT)))).toBe(1);
    expect(enPassantCount(legalMoves(parseFen(VALID_EN_PASSANT)))).toBe(1);
  });

  it("still offers the pinned capturer's en-passant move, and the filter drops it", () => {
    expect(enPassantCount(generateMoves(parseFen(VALID_BUT_PINNED)))).toBe(1);
    expect(enPassantCount(legalMoves(parseFen(VALID_BUT_PINNED)))).toBe(0);
  });
});
