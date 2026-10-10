---
id: 20261009T213713Z-software-engineer-decision-abc084-corpus-module-runner-lanes-config-99ac852f
kind: decision
by: software-engineer
at: 2026-10-09T21:37:13Z
verified_by: 
confidence: high
refs:
  - ABC-084
  - ABC-079
  - ADR-0027
  - ADR-0028
  - RISK-003
  - src/puzzle-corpus.ts
  - src/puzzle-suite.test.ts
  - src/puzzle-suite.baseline.json
  - src/quiescence.test.ts
  - .grugops/context/fold-abc084-gate-b/notes/20261009T210454Z-ba-pm-decision-28f56967.md
supersedes: 
---

# `ABC-084` build decisions: one data module, a runner in the test file, three lanes, budget 25 / step 1

Hand-authored, no seal (degraded posture, `AGENTS.md`). Branch `grugops/ABC-084-puzzle-suite` from
`7b54dae`: code `b3321f0`, baseline `a287461` (its own commit).

## Names (the Engineer's, per the page)

- **Data module `src/puzzle-corpus.ts`.** Non-test, in the shape of `src/search.mate-corpus.ts`.
  It holds `HANGING_CORPUS` (ABC-079's 24 rows, exported) and `PUZZLES` (the suite).
- **Suite and runner `src/puzzle-suite.test.ts`.** The runner is used only here, so it lives here
  (rule 6). It is not a separate module.
- **Lane variable `PUZZLE_DEEP`.** `1` is the gating run. `weakened` is `A3`'s demonstration. Unset,
  the deep rows are not defined, so nothing is skipped.
- **Baseline `src/puzzle-suite.baseline.json`.** It is read with `readFileSync` (no `tsconfig`
  change). It sits outside every trigger glob, so `A7`'s own-commit rule can be checked with
  `git log --name-only -- src/puzzle-suite.baseline.json`.

## Reading of "the suite's additions go into the same list" (stated, rule 2)

- `HANGING_CORPUS` stays a separate exported array with its rows byte-identical: the 26 lines
  (24 rows and the ADR-0028 re-found comment pair) are `cmp`-equal to `src/quiescence.test.ts`
  lines 197–222 at `7b54dae`. The declaration gains only `export`.
- `PUZZLES` is the one suite list: 10 mates, then 6 win-material rows, then
  `HANGING_CORPUS.map(…)` with `kind: "do-not-hang"` and a source tag. Every addition has its
  `source` field.
- The other reading was to put a `source` field on the 24 rows. It was rejected because the rows
  would no longer be byte-identical.
- **ABC-079 `A1` reads exactly the 24.** `src/quiescence.test.ts` imports `HANGING_CORPUS`, and the
  suite's default lane asserts length 24 and that the first 24 do-not-hang rows equal it.

## A6 — how the answers were sourced (never this engine's output)

- **Mate-in-2 (10).** Hand-built on named patterns: K+R, smothered, back rank, two-rook ladder, K+Q
  and Anastasia, six with white to move. Four more are colour mirrors with black to move. The
  accepted set is **exactly** the set of first moves that an exhaustive mate search over
  `legalMoves`/`makeMove` finds, with no mate in 1. That oracle is a default-lane row: it imports no
  search and no evaluate, and a planted extra accepted move reds it (checked, then reverted).
- **Win-material (6).** Hand-built on named motifs: knight fork, pawn fork, pin, skewer, discovered
  check and queen fork. The accepted moves are the ones a material-only (P1 N3 B3 R5 Q9) exhaustive
  4-ply search plus a capture search ranks strictly best. The oracle runs over `legalMoves`, with no
  `src/search.ts` and no `src/evaluate.ts`.
  - The gains are +9, +2, +4, +10, +6 and +5 pawns.
  - The discovered-check row accepts all four bishop retreats along the long diagonal, because each
    one checks and uncovers the rook.
  - This oracle is a probe (`raw-probe-oracle.mts.txt`), not a lane row: it takes 24–150 ms per row,
    which the default lane does not pay.
- **Do-not-hang (24).** ABC-079's hand-labelled rows.

## Configuration: budget 25, step 1 (25 virtual readings per move)

- **Vitest runs the engine about 4.5× slower per node than plain `node`.** It reads ~65 k nodes/s,
  against ~290 k in the fold probe. That was likely the fold's "4× under a mock", not the mock.
- **Budget 50 was measured first:** 40/40 in 27.4 s (`raw-out-gating-budget50-provisional.txt`).
  It was too close to `A5`'s 60 s at the load this machine sees (load1 up to 75 today).
- **Budget 25:** 40/40 in 12.2–13.2 s. `A3`'s arm takes 10.4–10.7 s. The step equals
  `budgetMs / 25`, which is far above the `budgetMs / 1000` floor.
- The runner throws `RangeError` before any search when `!(step >= budgetMs / 1000)`, so `NaN` is
  covered too. Four refusals and the bound itself are default-lane rows.

## A3 without a production door

- In `PUZZLE_DEEP=weakened` mode, `vi.doMock("./evaluate.ts", …evaluate: () => 0)` runs before a
  dynamic `import("./engine.ts")`.
- The shipped mode does the same dynamic import with no mock, so the gating run pays no mock cost.
- Nothing is added to `src/engine.ts`, `src/search*.ts` or `src/evaluate*.ts`: 0 lines.
