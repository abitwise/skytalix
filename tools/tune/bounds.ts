/**
 * `ABC-239` (`ADR-0067` ruling (b), F3): the bound set. Each entry is one relation row of a
 * `src/evaluate*.test.ts` file that read red on the box-only fit, written as one linear inequality
 * on the parameters: Σ coef · evaluate(fen) ≤ rhs, each `evaluate` from the side to move, the row
 * made strict (≤ rhs − 1) when `strict`. The fit tightens it by its margin (½ ‖a‖₁ for rounding,
 * + |coef| per position with 0 < w < 24 for the blend's trunc, + 1 if strict), so the emitted
 * integer set holds the row by construction. Each FEN appears literally in its test file (the
 * FEN source row in `tools/tune/tune.test.ts`).
 *
 * Empty at the box-only fit (step 1 of the one refit); filled from step 2's red rows only.
 */
export interface BoundRow {
  /** The test file, repository-relative. */
  readonly file: string;
  /** The test row's name, as written in the file. */
  readonly row: string;
  /** Σ coef · evaluate(fen), from the side to move. */
  readonly terms: ReadonlyArray<{ readonly fen: string; readonly coef: number }>;
  readonly rhs: number;
  readonly strict: boolean;
}

export const BOUNDS: readonly BoundRow[] = [];
