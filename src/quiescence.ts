/**
 * Quiescence search on captures — the horizon fix (ABC-079) — with evasions in check (ABC-228)
 * and quiet queen promotions (ABC-229).
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
 * IN CHECK, NO STAND PAT (`ABC-228`, `ADR-0053` decisions 2-4). Below the cap, a node whose side
 * to move is in check searches EVERY legal move — in check, every legal move is an evasion, quiet
 * ones and under-promotions included — in the same stable `mvvLvaKey` order, fail-soft, each
 * child one quiescence ply deeper. With no evasion it is mated, and scores
 * `-(MATE_SCORE - (ply + qply))`, `ply` being the leaf's distance from the root, so a mate found
 * here reads the distance the full-width search would give it. At the cap a node stands pat, in
 * check or not: the guard still degrades to the old horizon. The rule is behind a switch,
 * `QuiescenceRules.evasions`, which each recursion maps onto a constant record; the test-only
 * doors older than `ABC-228` turn it off and reproduce the pre-ticket search node for node.
 *
 * QUIET PROMOTIONS TO A QUEEN (`ABC-229`, `ADR-0053` decision 5). Out of check, the move list is
 * the legal captures plus the legal quiet promotions to a queen, from one generation pass
 * (`legalCapturesAndQueenPromotions`), the promotions appended after the captures and then the one
 * stable `mvvLvaKey` sort: a quiet queen promotion keys at 899.9, beside the queen captures, and a
 * tie keeps the capture first. Stand pat still applies, because the side may decline to promote.
 * The rule is behind a second switch, `QuiescenceRules.quietPromotions`; every test-only door
 * older than `ABC-229`, `ABC-228`'s pair included, turns it off.
 *
 * LOSING CAPTURES ARE SKIPPED OUT OF CHECK (`ABC-279`, `ADR-0069` decisions 1-3). At a node that
 * stood pat, each move is tested in the loop, after the one sort, before it is made: a capture
 * `isLosingCapture` (`src/see.ts`) names — no promotion, not the king, a lesser victim and a static
 * exchange below 0 — is not made, not searched and not counted. A capture that gives check is
 * skipped like any other. In check nothing is skipped: every evasion is searched. The stand pat is
 * the floor of `best`, so a node whose every capture is skipped returns it, as a node with none
 * does. The rule is behind a third field, `QuiescenceRules.seePruning`, true only in the record the
 * shipped recursions pass; every test-only door turns it off.
 *
 * Not here, each a recorded decision rather than an omission: quiet checks in quiescence, delta
 * pruning, and QUIET UNDER-promotions (a capturing promotion, under-promotions included, is a
 * capture and is searched like any other; in check every under-promotion is an evasion). Static
 * exchange evaluation is here for pruning only (`ADR-0069`, amending `ADR-0024` decision 4), never
 * for ordering. No stalemate detection: a quiescence node out of check with no captures stands
 * pat, and stalemate is the full-width search's to notice.
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
 * observes the recursion depth. It is called once per node entered THROUGH A CAPTURE (or, in
 * check, an evasion; or a quiet queen promotion), never for the leaf itself, which the caller already counted.
 */

import { makeMove, unmakeMove } from "./apply.ts";
import { evaluateAtPhase, evaluateWithoutTaper, phaseAfterMove } from "./evaluate.ts";
import { isInCheck, legalCaptures, legalCapturesAndQueenPromotions, legalMoves } from "./legal.ts";
import type { Move } from "./moves.ts";
import { type Position, pieceType } from "./position.ts";
import { isLosingCapture } from "./see.ts";

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
 * fresh array `legalCaptures` (or `legalCapturesAndQueenPromotions`, or in check `legalMoves`)
 * returned. Exported for `src/quiescence.test.ts`'s oracle.
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
 * The score of being checkmated AT THE ROOT, negated: a side mated `ply` plies from the root
 * scores `-(MATE_SCORE - ply)`, so a mate delivered sooner is worth more than the same mate
 * delivered later and the search prefers the short line. Far above any static evaluation the
 * tables can produce (a full board of queens is under 10 000), so a mate is never confused
 * with material. Defined here, the lowest module that scores a mate (`ADR-0053` decision 3);
 * `src/search.ts` re-exports it under the same name.
 */
export const MATE_SCORE = 30_000;

/**
 * Which of quiescence's rules are on (`ADR-0053` decision 6). Every caller passes one
 * explicitly; each recursion maps its switches onto a module-level constant record.
 */
export interface QuiescenceRules {
  /** In check below the cap: no stand pat, every legal move searched, none means mate (`ABC-228`). */
  readonly evasions: boolean;
  /** Out of check: the legal quiet promotions to a queen join the captures (`ABC-229`). */
  readonly quietPromotions: boolean;
  /**
   * The stand pat reads the tapered `evaluate` (`ABC-269`, `ADR-0064` decision 7). True only in the
   * record the shipped recursions pass; absent or false is `evaluateWithoutTaper`, the
   * pre-`ABC-269` evaluation, so every record that predates the switch is an older door unchanged.
   */
  readonly taper?: boolean;
  /**
   * Out of check, a losing capture is skipped (`ABC-279`, `ADR-0069` decisions 1-3, 6). True only
   * in the record the shipped recursions pass; absent or false searches every capture, so every
   * record that predates the switch, and any record a caller builds for itself, is unchanged.
   */
  readonly seePruning?: boolean;
}

/**
 * Called once per quiescence node entered through a capture, an evasion or a quiet queen
 * promotion, with that node's ply past the leaf (1 for the first). May throw — the engine's abort does — and the position is
 * still byte-identical to the caller when it does.
 */
export type QuiescenceVisitor = (qply: number) => void;

/**
 * The quiescence value of `position` for the side to move, in the negamax convention.
 *
 * `qply` is 0 at the leaf the full-width search handed over; `ply` is that leaf's distance from
 * the root (0 on a direct call), read only by the mate score. Fail-soft: the result may fall
 * outside `[alpha, beta]`. The position is byte-identical on return, throw or no throw.
 *
 * `phase` is `phaseOf(position)`, carried by the caller (`ABC-269` cut C1): the tapered stand pat
 * reads it, each child gets `phaseAfterMove(phase, move)`, and the untapered records ignore it.
 */
export function quiesce(
  position: Position,
  alpha: number,
  beta: number,
  qply: number,
  ply: number,
  rules: QuiescenceRules,
  visit: QuiescenceVisitor,
  phase: number,
): number {
  if (qply > 0) visit(qply);

  let best: number;
  let moves: Move[];
  let skipLosing = false;
  if (rules.evasions && qply < QUIESCENCE_MAX_PLY && isInCheck(position)) {
    // In check (`ADR-0053` decision 2): no stand pat, so `best` starts below every real score
    // and only a searched move raises it. Every legal move is an evasion; none is mate here.
    moves = legalMoves(position);
    if (moves.length === 0) return 0 - (MATE_SCORE - (ply + qply));
    best = Number.NEGATIVE_INFINITY;
  } else {
    const standPat =
      rules.taper === true ? evaluateAtPhase(position, phase) : evaluateWithoutTaper(position);
    if (standPat >= beta) return standPat; // standing still already refutes the opponent's line
    if (qply >= QUIESCENCE_MAX_PLY) return standPat; // the runaway guard: stand pat, do not expand

    best = standPat;
    if (best > alpha) alpha = best;
    skipLosing = rules.seePruning === true;

    // The legal captures in generation order (ABC-206): only captures are tested for legality.
    // With quiet promotions on (`ABC-229`), the legal quiet queen promotions are appended after
    // them from the same pass, and the one stable sort below places them (`ADR-0053` decision 5).
    moves = rules.quietPromotions
      ? legalCapturesAndQueenPromotions(position)
      : legalCaptures(position);
  }
  // Stable sort: equal keys keep generation order, so the count is deterministic.
  orderCaptures(moves);

  for (const move of moves) {
    // Only on the stand-pat branch (`ADR-0069` decision 1): in check every evasion is searched.
    if (skipLosing && isLosingCapture(position, move)) continue;
    const undo = makeMove(position, move);
    let score: number;
    try {
      score =
        0 -
        quiesce(
          position,
          0 - beta,
          0 - alpha,
          qply + 1,
          ply,
          rules,
          visit,
          phaseAfterMove(phase, move),
        );
    } finally {
      unmakeMove(position, move, undo);
    }

    if (score > best) best = score;
    if (best > alpha) alpha = best;
    if (alpha >= beta) break;
  }

  return best;
}
