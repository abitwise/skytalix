/**
 * ABC-034 — rejections that teach: a closed reason set, COMPUTED from the generator, never guessed.
 *
 * `EPIC-003`'s third acceptance criterion is *"given an illegal move, the message names the specific
 * reason"*. `ABC-031` / `ABC-032` ship the floor — `unreadable` vs `no-such-move` — and that floor is
 * exactly the bare rejection the epic forbids: a player who types `Nf3` when the knight is pinned
 * cannot tell a typo from a rule they did not know. This module is where the reason becomes a
 * property of the code rather than a sentence in a document.
 *
 * THIS MODULE ASKS THE READERS AND THE GENERATOR; IT DOES NOT PARSE AND IT DOES NOT RE-IMPLEMENT A
 * RULE. There is no piece-letter table, no castle string, no promotion letter and no square
 * arithmetic here (`ADR-0004` clause 2; `ABC-034` `A8`'s constraint). Every class below is a SET
 * OPERATION over lists the rules core already returns, and the one question the readers answer —
 * *"does this text name a move in THIS list?"* — is put to them with a different list:
 *
 *   - `own-king-exposed` / `must-address-check` are the SET DIFFERENCE `generateMoves(position)`
 *     minus `legalMoves(position)`: a move the piece can make that leaves its own king attacked. The
 *     text is handed to `parseCoordinateMove` and `parseSan` with THAT list as the candidates. The
 *     rule "would leave the king in check" is computed exactly once in this project, in
 *     `src/legal.ts`, and this module never computes it a second time (`ABC-034` test note 2).
 *   - `empty-square` / `not-your-piece` / `piece-cannot-reach` are a board read on the origin square
 *     of a coordinate-shaped line — and "coordinate-shaped" is the coordinate reader's OWN verdict
 *     (`no-such-move` against an empty list means the grammar read it), never a regex of this
 *     module's.
 *   - `no-legal-move-named` is the SAN reader's own `no-such-move`: well-formed SAN with no origin to
 *     name, because SAN carries a destination and this module derives no origin for it.
 *   - `unreadable` is what is left when no text was read by either grammar.
 *
 * THE INPUT IS THE LIST OF TEXTS THE DISPATCHER TRIED, in the order it tried them — the line as
 * typed and `ABC-033`'s case-folded variants. This module knows nothing of folding: it explains why
 * NONE of those readings named a legal move, and the first reading that yields a class wins, in the
 * dispatcher's own coordinate-then-SAN precedence. Handing the texts over is what keeps the fold in
 * one place (`src/move-input.ts`) and this module free of a second copy of it.
 *
 * WORDING IS HERE, AND ONLY HERE. The codes are `Rejection`'s discriminant; the sentences are
 * `rejectionMessage`'s, one per code, each naming a concrete referent — a square from the input, a
 * piece, or the king (`A4`). There is NO default arm: the switch is exhaustive over the union and
 * `tsc` refuses an eighth code that has no sentence. Every message is SHORT BY CONSTRUCTION: the
 * frame's message region is bounded by the panels' width `W` (21 with the history pane,
 * `src/frame.ts` `assembleFrame`) and places an item whole or not at all, so a sentence longer than
 * `W` is a sentence the player never reads (`A5`). The one message that echoes input echoes SAN the
 * reader accepted, which the grammar bounds at 7 characters — never the raw line.
 *
 * Nothing here prints, applies, or advances: the position is read and handed to readers that
 * restore it byte-for-byte (`legalMoves` and `parseSan`'s castle path make-and-unmake). Messages
 * travel as `PromptOutcome.rejected.messages` and the loop places them (`ADR-0004` (2a), seam
 * invariant 5).
 */

import { parseCoordinateMove } from "./coordinate-move.ts";
import { isInCheck, legalMoves } from "./legal.ts";
import { generateMoves, type Move } from "./moves.ts";
import { EMPTY, isBlack, type Position, parseSquareName } from "./position.ts";
import { parseSan } from "./san.ts";

/**
 * The seven codes, closed. `ADR-0004` (2a): widening the REASON set is not an ADR change; widening
 * the OUTCOME set (`move` / `ambiguous` / `rejected`) would be, and this module widens neither.
 */
export const REJECTION_REASONS = [
  "unreadable",
  "empty-square",
  "not-your-piece",
  "piece-cannot-reach",
  "own-king-exposed",
  "must-address-check",
  "no-legal-move-named",
] as const;

export type RejectionReason = (typeof REJECTION_REASONS)[number];

/**
 * A rejection: the code, plus the referent its sentence names. The referents are DATA taken from
 * the input or the board at classification time, so the sentence can be rendered later without the
 * position in hand.
 */
export type Rejection =
  /** Neither grammar could read any of the texts. */
  | { readonly reason: "unreadable" }
  /** A coordinate whose origin square holds nothing. */
  | { readonly reason: "empty-square"; readonly square: string }
  /** A coordinate whose origin square holds the other side's piece. */
  | { readonly reason: "not-your-piece"; readonly square: string }
  /** A coordinate of the mover's own piece that is not among its pseudo-legal moves at all. */
  | { readonly reason: "piece-cannot-reach"; readonly from: string; readonly to: string }
  /** A pseudo-legal move that is not legal: it leaves the mover's own king attacked. */
  | { readonly reason: "own-king-exposed" }
  /** The same set difference, while the mover is already in check. */
  | { readonly reason: "must-address-check" }
  /** Well-formed SAN (as the SAN reader accepted it) naming no move in this position. */
  | { readonly reason: "no-legal-move-named"; readonly text: string };

/** Two moves are the same move when they agree on origin, destination and promotion piece. */
const sameMove = (a: Move, b: Move): boolean =>
  a.from === b.from && a.to === b.to && a.promotion === b.promotion;

/**
 * The square names a text contains, in order — `A4`'s "a square name from the input", read as
 * exactly that and nothing more. Only consulted AFTER the coordinate reader has said the text is a
 * coordinate, whose form is two square names (`ABC-031` `## Scope`), so the first is the origin and
 * the second the destination.
 */
const squaresNamed = (text: string): string[] => text.toLowerCase().match(/[a-h][1-8]/g) ?? [];

const exposed = (position: Position): Rejection =>
  isInCheck(position) ? { reason: "must-address-check" } : { reason: "own-king-exposed" };

/**
 * Why none of `texts` named a legal move of `position`.
 *
 * PRECONDITION, the caller's: every text in `texts` was already rejected by both readers against
 * `legal`, and `legal` is the legal move list of `position` — the same obligation `parseSan` and
 * `parseCoordinateMove` state. `src/move-input.ts` calls this only on that path. Supply a text that
 * IS a legal move and the answer describes a rejection that did not happen.
 *
 * Costs one `generateMoves` on the position in hand and, when `legal` is not supplied, one
 * `legalMoves`; the dispatcher supplies it, so a rejection there costs the ONE derive `ABC-033` `A5`
 * already counts plus one generation (`NFR-003`'s cost claim on the ticket).
 */
export function classifyRejection(
  position: Position,
  texts: readonly string[],
  legal: readonly Move[] = legalMoves(position),
): Rejection {
  // The set difference: what the piece can do minus what the rules allow. Castles are never in it
  // (`src/moves.ts` filters the through-check rule at generation), which is right — a castle the
  // rules refuse is not a move the king "can make".
  const exposing = generateMoves(position).filter(
    (move) => !legal.some((other) => sameMove(other, move)),
  );

  for (const text of texts) {
    const coordinate = parseCoordinateMove(position, text, exposing);
    if (coordinate.outcome !== "rejected") return exposed(position);
    if (coordinate.reason === "no-such-move") {
      // The coordinate grammar read it: two square names, the first the origin. Not in `legal`
      // (the precondition) and not in `exposing`, so not a move of that piece at all — unless the
      // square holds nothing, or holds the other side's piece, which the player is told first.
      const [from = "", to = ""] = squaresNamed(text);
      const piece = position.board[parseSquareName(from)] as number;
      if (piece === EMPTY) return { reason: "empty-square", square: from };
      if (isBlack(piece) !== position.blackToMove)
        return { reason: "not-your-piece", square: from };
      return { reason: "piece-cannot-reach", from, to };
    }

    const san = parseSan(position, text, exposing);
    if (san.outcome !== "rejected") return exposed(position);
    if (san.reason === "no-such-move") return { reason: "no-legal-move-named", text: text.trim() };
  }

  return { reason: "unreadable" };
}

/**
 * The one sentence for a rejection. Seven arms, no default: an eighth `Rejection` member without a
 * sentence is a type error here, which is how "no catch-all" is a property of the build rather
 * than a promise (`A4`).
 *
 * Every sentence fits one message row at the delivered width (`A5`): the longest fixed one is 21
 * columns, and the echo in `no-legal-move-named` is bounded by the SAN grammar at 7 characters, so
 * that sentence is at most 20.
 */
export function rejectionMessage(rejection: Rejection): string {
  switch (rejection.reason) {
    case "unreadable":
      return "type e2e4 or Nf3";
    case "empty-square":
      return `no piece on ${rejection.square}`;
    case "not-your-piece":
      return `${rejection.square} is not yours`;
    case "piece-cannot-reach":
      return `${rejection.from} cannot reach ${rejection.to}`;
    case "own-king-exposed":
      return "exposes your king";
    case "must-address-check":
      return "your king is in check";
    case "no-legal-move-named":
      return `no move ${rejection.text} here`;
  }
}
