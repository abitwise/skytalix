/**
 * Quiescence search on captures — the horizon fix (ABC-079).
 *
 * A fixed-depth search evaluates whatever position it lands on. If the last ply was a capture,
 * the recapture is one ply past the horizon and the evaluator scores a won pawn on a board where
 * a queen is about to be lost. `quiesce` replaces the leaf evaluation with a search of CAPTURES
 * ONLY, until the position is quiet, so the score a leaf reports is one the opponent cannot
 * immediately overturn by taking something back.
 *
 * Stand-pat: the static evaluation is a LOWER BOUND on the leaf's value, never a replacement for
 * the capture search. The side to move may decline every capture, so its score is at least the
 * static one; if that alone beats beta the node cuts. Alpha-beta inside is fail-soft, in
 * `src/search.ts`'s convention, and the returned value with a full window is exact.
 *
 * `QUIESCENCE_MAX_PLY` IS A RUNAWAY GUARD, NOT A BUDGET. A capture sequence is naturally bounded
 * (each capture removes a piece), but a cap keeps a pathological board from turning a leaf into
 * a search of its own. At the cap the node stands pat, which is exactly the pre-quiescence
 * behaviour — the guard degrades to the old horizon, never to something worse. The per-move
 * budget is `src/engine.ts`'s, and this constant must not become one.
 *
 * Not here, each a recorded decision rather than an omission: checks in quiescence, delta
 * pruning, static exchange evaluation, and QUIET promotions (a capturing promotion is a capture
 * and is searched like any other). No terminal detection: a quiescence node with no captures
 * stands pat, and mate and stalemate are the full-width search's to notice.
 *
 * CAPTURES ARE SEARCHED MOST-VALUABLE-VICTIM FIRST (`ADR-0024`), and that ordering is THIS
 * module's, not `ABC-080`'s: unordered, a losing capture is refuted only when its child reaches
 * the recapture, and every capture generated before it is searched to its own subtree first —
 * the capture tree GROWS with capture ply and only the cap holds it (kiwipete depth 1: 702x the
 * bare-leaf node count unordered, 13 730x uncapped). Ordered MVV-LVA the same search reads 120x
 * and lifting the cap is a 1.2–1.7x change, so the cap is honestly a guard. The sort is lossless
 * — same score, same move — it only decides which refutation is found first. `ABC-080`'s
 * full-width ordering reuses `mvvLvaKey` rather than writing a second one.
 *
 * Both recursions — `src/search.ts`'s and the abortable copy in `src/engine.ts` — call this one
 * function, so the leaf is shared rather than duplicated a third time. `visit` is how each
 * caller sees the nodes: the search counts them, the engine also consults its clock, and a test
 * observes the recursion depth. It is called once per node entered THROUGH A CAPTURE, never for
 * the leaf itself, which the caller already counted.
 */

import { makeMove, unmakeMove } from "./apply.ts";
import { evaluate } from "./evaluate.ts";
import { legalCaptures } from "./legal.ts";
import type { Move } from "./moves.ts";
import { type Position, pieceType } from "./position.ts";

/**
 * Centipawn value per piece type for ORDERING only, indexed by `pieceType` like
 * `src/evaluate.ts`'s table (which is private to the evaluator, by design — the two must not
 * drift apart in meaning, but ordering is free to weight differently one day). The king is 0
 * here as it is there: a king capture is only ever legal when the victim is undefended, so as
 * an attacker the king is the safest piece to try first, not the most valuable to risk.
 */
const ORDER_VALUE: readonly number[] = [0, 100, 320, 330, 500, 900, 0];

/**
 * MVV-LVA key of a capture — HIGHER SEARCHES FIRST. Most valuable victim first (a capturing
 * promotion counts its victim plus the piece the pawn becomes), least valuable attacker as the
 * tiebreak. Pure and stateless; the attacker term is scaled so it never outranks a victim
 * difference. Exported for `ABC-080`'s full-width ordering (`ADR-0024` decision 2).
 */
export function mvvLvaKey(move: Move): number {
  return (
    (ORDER_VALUE[pieceType(move.captured)] as number) +
    (ORDER_VALUE[move.promotion] as number) -
    (ORDER_VALUE[pieceType(move.piece)] as number) / 1000
  );
}

/** More than any legal position's capture count; a longer list allocates its own keys. */
const CAPTURE_SCRATCH_LENGTH = 256;
/** `orderCaptures`' key scratch: fixed, float64, shared by every ply (the sort never recurses). */
const CAPTURE_KEYS = new Float64Array(CAPTURE_SCRATCH_LENGTH);

/** The capture-sort scratch's fixed size in bytes, for `NFR-009` (a)'s byte-length sum. */
export function captureScratchByteLength(): number {
  return CAPTURE_KEYS.byteLength;
}

/**
 * Sorts `captures` IN PLACE by `mvvLvaKey`, highest first, equal keys in their given order —
 * exactly `captures.sort((a, b) => mvvLvaKey(b) - mvvLvaKey(a))`, which `Array.prototype.sort`
 * keeps stable. `ABC-240`: each key is computed once into `CAPTURE_KEYS` (float64, so the
 * attacker's thousandths never merge), and the list is insertion-sorted beside it, moving an
 * entry only past a STRICTLY smaller key. The list must be the caller's own: `quiesce` sorts the
 * fresh array `legalCaptures` returned. Exported for `src/quiescence.test.ts`'s oracle.
 */
export function orderCaptures(captures: Move[]): void {
  const count = captures.length;
  const keys = count <= CAPTURE_SCRATCH_LENGTH ? CAPTURE_KEYS : new Float64Array(count);
  for (let i = 0; i < count; i++) {
    const move = captures[i] as Move;
    const key = mvvLvaKey(move);
    let j = i;
    while (j > 0 && (keys[j - 1] as number) < key) {
      keys[j] = keys[j - 1] as number;
      captures[j] = captures[j - 1] as Move;
      j--;
    }
    keys[j] = key;
    captures[j] = move;
  }
}

/**
 * The deepest capture ply the quiescence recursion enters past the leaf. A node at this ply
 * stands pat without generating captures. A guard against runaway, sized above any exchange
 * sequence a real position produces; `A3` in `src/quiescence.test.ts` asserts it holds.
 */
export const QUIESCENCE_MAX_PLY = 8;

/**
 * Called once per quiescence node entered through a capture, with that node's ply past the
 * leaf (1 for the first capture). May throw — the engine's abort does — and the position is
 * still byte-identical to the caller when it does.
 */
export type QuiescenceVisitor = (qply: number) => void;

/**
 * The quiescence value of `position` for the side to move, in the negamax convention.
 *
 * `qply` is 0 at the leaf the full-width search handed over. Fail-soft: the result may fall
 * outside `[alpha, beta]`. The position is byte-identical on return, throw or no throw.
 */
export function quiesce(
  position: Position,
  alpha: number,
  beta: number,
  qply: number,
  visit: QuiescenceVisitor,
): number {
  if (qply > 0) visit(qply);

  const standPat = evaluate(position);
  if (standPat >= beta) return standPat; // standing still already refutes the opponent's line
  if (qply >= QUIESCENCE_MAX_PLY) return standPat; // the runaway guard: stand pat, do not expand

  let best = standPat;
  if (best > alpha) alpha = best;

  // The legal captures in generation order (ABC-206): only captures are tested for legality.
  const captures = legalCaptures(position);
  // Stable sort: equal keys keep generation order, so the count is deterministic.
  orderCaptures(captures);

  for (const move of captures) {
    const undo = makeMove(position, move);
    let score: number;
    try {
      score = 0 - quiesce(position, 0 - beta, 0 - alpha, qply + 1, visit);
    } finally {
      unmakeMove(position, move, undo);
    }

    if (score > best) best = score;
    if (best > alpha) alpha = best;
    if (alpha >= beta) break;
  }

  return best;
}
