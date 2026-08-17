/**
 * Coordinate move input — `e2e4`, `E2E4`, `e2-e4`, `e7e8q` — resolved against the legal move list.
 *
 * `EPIC-003` promises that a player who does not know algebraic notation can still play, and this
 * is the half that promise rests on: two square names, optionally separated by a single `-`, with
 * an optional promotion letter, case-insensitive, whitespace trimmed. Those are the ONLY accepted
 * forms (`ABC-031` `## Scope`). No `e2 e4`, no `e2,e4`, no SAN — SAN is `src/san.ts`'s grammar and
 * `ABC-032`'s work, and `ADR-0004` clause 2 is explicit that two grammars in one module is the
 * thing to avoid. This module holds no piece letter, no capture marker and no castle string.
 *
 * THE OUTCOME TYPE IS DECLARED HERE, DELIBERATELY. It matches `ADR-0004`'s `SanParseResult` arms
 * exactly — `move` / `ambiguous` (N >= 2) / `rejected` — so `ABC-033` dispatches over ONE shape
 * when it routes a line of input to a grammar. `SanParseResult` itself does not exist in `src/`
 * yet; it lands with `parseSan` in `ABC-032` (`ADR-0004`:188 is its contract). Nothing here is a
 * copy of code that exists; both are readings of the same ADR.
 *
 * MOVE IDENTITY — `ADR-0004` (2b), adopted verbatim for this reader. Every `Move` returned, in
 * `move` and in every `ambiguous` candidate, is an ELEMENT of the legal move list for the position.
 * This function never constructs a `Move` from the parsed text. It costs nothing — the list is in
 * hand either way and selecting from it is less work than building one — and what it prevents is a
 * silent legality failure: `src/apply.ts:157`, `:160` and `:109` read `piece`, `flags` and
 * `captured` back OFF the `Move` during a take-back, so a fabricated field puts a wrong piece on
 * the board during `EPIC-006`'s `undo`, with nothing thrown and nothing logged.
 *
 * ONE CALLER OBLIGATION, not validated here — the same one `ADR-0004` clause 2 states for `toSan`
 * and `parseSan`: a supplied `legal` list must be the legal moves of the supplied position. Supply
 * another position's list and the answer is silently wrong. That is the price of the parameter and
 * it is paid by the caller.
 *
 * It is a TOTAL function and does not throw, deliberately unlike `parseFen` (`ADR-0004` (2a)): a
 * coordinate arrives on every line a human types, on the loop's most-travelled edge, and exceptions
 * as control flow there is the wrong shape.
 */

import { legalMoves } from "./legal.ts";
import { FLAG_PROMOTION, type Move } from "./moves.ts";
import { BISHOP, KNIGHT, type Position, parseSquareName, QUEEN, ROOK } from "./position.ts";

/**
 * A machine-readable code, never display copy — `ABC-034` owns the wording (`ADR-0004` (2a), seam
 * invariant 5: message text is data the loop places, not output a parser prints). The two members
 * are `ADR-0004` (2a)'s floor applied to this grammar and they must never collapse into one.
 */
export type CoordinateRejectReason =
  /** The text is not a coordinate this module can read at all. */
  | "unreadable"
  /** A well-formed coordinate that names no legal move in this position. */
  | "no-such-move";

/** The three outcomes, closed — `ADR-0004` (2a)'s set, same arms and same closure rule. */
export type CoordinateParseResult =
  | { readonly outcome: "move"; readonly move: Move }
  | { readonly outcome: "ambiguous"; readonly candidates: readonly Move[] }
  | { readonly outcome: "rejected"; readonly reason: CoordinateRejectReason };

/** Two square names, an optional single `-` between them, an optional promotion letter. */
const COORDINATE = /^([a-h][1-8])-?([a-h][1-8])([qrbn])?$/;

const PROMOTION_TYPES: Readonly<Record<string, number>> = {
  q: QUEEN,
  r: ROOK,
  b: BISHOP,
  n: KNIGHT,
};

/**
 * Resolves a coordinate string against the legal moves of `position`.
 *
 * `legal` is optional and carries the caller obligation in the module header; when the caller
 * already holds the list — the turn loop, which just generated it — supplying it means this
 * function performs ZERO additional `legalMoves` calls.
 *
 * `text` is declared `string` because that is what every caller has. The runtime type guard is
 * not defensive dressing: `ABC-031` `A4` requires totality against whatever a loop actually hands
 * over, and a non-string is `unreadable` like any other text this grammar cannot read.
 */
export function parseCoordinateMove(
  position: Position,
  text: string,
  legal?: readonly Move[],
): CoordinateParseResult {
  if (typeof text !== "string") return { outcome: "rejected", reason: "unreadable" };

  const match = COORDINATE.exec(text.trim().toLowerCase());
  if (match === null) return { outcome: "rejected", reason: "unreadable" };

  const from = parseSquareName(match[1] as string);
  const to = parseSquareName(match[2] as string);
  const letter = match[3];
  const promotion = letter === undefined ? undefined : (PROMOTION_TYPES[letter] as number);

  const candidates = (legal ?? legalMoves(position)).filter(
    (move) =>
      move.from === from &&
      move.to === to &&
      (promotion === undefined ||
        ((move.flags & FLAG_PROMOTION) !== 0 && move.promotion === promotion)),
  );

  if (candidates.length === 0) return { outcome: "rejected", reason: "no-such-move" };
  if (candidates.length === 1) return { outcome: "move", move: candidates[0] as Move };
  return { outcome: "ambiguous", candidates };
}
