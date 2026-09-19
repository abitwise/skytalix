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
 * and is searched like any other). Move ordering is `ABC-080`'s; captures are searched in
 * generation order. No terminal detection: a quiescence node with no captures stands pat, and
 * mate and stalemate are the full-width search's to notice.
 *
 * Both recursions — `src/search.ts`'s and the abortable copy in `src/engine.ts` — call this one
 * function, so the leaf is shared rather than duplicated a third time. `visit` is how each
 * caller sees the nodes: the search counts them, the engine also consults its clock, and a test
 * observes the recursion depth. It is called once per node entered THROUGH A CAPTURE, never for
 * the leaf itself, which the caller already counted.
 */

import { makeMove, unmakeMove } from "./apply.ts";
import { evaluate } from "./evaluate.ts";
import { legalMoves } from "./legal.ts";
import { EMPTY, type Position } from "./position.ts";

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

  for (const move of legalMoves(position)) {
    if (move.captured === EMPTY) continue;

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
