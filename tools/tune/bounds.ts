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

/**
 * The bound set of `se-ABC-239b`'s one refit: the relation rows red on the box-only fit (emitted
 * sha256 5493876073…4237, never committed) at step 2 of the procedure. Of every
 * `src/evaluate*.test.ts` relation row, one read red: `ABC-083` A2 (b)'s phase-24 twin (`ABC-270`,
 * `ADR-0068` d5), +46 against a bar of < 0, as `ADR-0067` ruling (b) forecast.
 */
export const BOUNDS: readonly BoundRow[] = [
  {
    file: "src/evaluate.king-mobility.test.ts",
    row: "at EQUAL material too, at phase 24: the g-pawn on g6 instead of g2 scores strictly lower (ABC-270 re-find)",
    terms: [
      { fen: "rnbq1rk1/3nbppp/6P1/8/8/8/3NBP1P/RNBQ1RK1 w - - 0 1", coef: 1 },
      { fen: "rnbq1rk1/3nbppp/8/8/8/8/3NBPPP/RNBQ1RK1 w - - 0 1", coef: -1 },
    ],
    rhs: 0,
    strict: true,
  },
];
