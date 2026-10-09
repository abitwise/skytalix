---
id: 20261009T215422Z-qe-e2e-observation-abc084-five-focus-readings-17-weakenings-80be6044
kind: observation
by: qe-e2e
at: 2026-10-09T21:54:22Z
verified_by:
confidence: high
refs:
  - ABC-084
  - ABC-079
  - ADR-0026
  - ADR-0027
  - ADR-0028
  - RISK-003
  - src/puzzle-corpus.ts
  - src/puzzle-suite.test.ts
  - src/puzzle-suite.baseline.json
  - 20261009T215422Z-qe-e2e-decision-abc084-verdict-pass-gate-coarse-927320d8
supersedes:
---

# `ABC-084` QE readings: the five focus points, 17 planted weakenings, the step sweep

Hand-authored, no seal. Worktree `grugops/qe-ABC-084` at `e426e91`. The machine is the build's (Apple M3,
8 cores). load1 was 7–44 during the runs (Security/NFR measures in parallel; QE's runs were sequential).
Raw files are in `../probe/` and every probe there is re-runnable.

## Focus 1 — `A6` provenance (`probe/indep-oracle.mjs`, `indep-oracle.out.txt`)

- **The oracle is independent of the code under review.** It has its own 0x88 move generator, with en passant
  and promotion; every FEN has castling `-`. It imports nothing from `src/` and reads the corpus as text.
  Before use it is checked against published perft counts: start position d3 8 902 and d4 197 281,
  position 3 d4 43 238 and d5 674 624, all OK. (The build's in-repo mate oracle uses `src/legal.ts`, which
  the engine shares. QE's oracle removes that shared dependency.)
- **All 40 rows OK**, 10.2 s total:
  - **Mate (10):** for every row, the set of mate-in-2 first moves equals `accept` exactly, and no row has
    a mate in 1.
  - **Win-material (6):** a material-only negamax (4 plies plus capture quiescence) gives exactly `accept`
    as the strictly-best set, with gains of +9 / +2 / +4 / +10 / +6 / +5, as the source tags say.
    The next-best move is ≥ 3 pawns behind.
  - **Do-not-hang (24):** each losing capture scores −2 to −8, and the best alternative is ≥ 0.
- **No ambiguity:** no row of any class has a mate in 1, and no win-material or do-not-hang row has a mate
  in 2.
- **No duplicate positions:** 40 distinct (placement + side to move).
- **Breadth:** the mates are 6 patterns + 4 colour mirrors; the hanging rows are 12 + 12 mirrors; the 6
  win-material rows all have white to move.
- **Traced by hand as well:** smothered (Qg8+ Rxg8 Nf7#), back rank (Re8+ Rxe8 Rxe8#), knight fork (Ne7+,
  then Nxc6), pin (Re1; Qxe1+ Kxe1 is Q for R, +4) and skewer (Ra6+, then Rxh6).
- **Two rows start in check:** the "R takes a bishop a pawn defends" pair, as the build reported. The moved
  doc comment says no row does.

## Focus 2 — `A3` sensitivity (`probe/weakenings.mjs`, `weakenings.out.jsonl`, `…default-lane.out.jsonl`)

Each weakening is an exact one-site edit (one is a two-site replace), run through `PUZZLE_DEEP=1`, then
reverted. `git status --porcelain src` was empty after every run.

| id | weakening | gate | solved | missed by class |
|---|---|---|---|---|
| W3 | depth cap 2 | **red** | 31 | 9 mates |
| W6 | knight ↔ rook values swapped | **red** | 38 | 2 hang |
| W7 | queen 900 → 300 | **red** | 33 | 1 win, 6 hang |
| W8 | pawn 100 → 300 | **red** | 37 | 3 hang |
| W9 | eval ignores side to move | **red** | 38 | 2 hang (mirrors) |
| W12 | interior checkmate scored 0 | **red** | 32 | 8 mates |
| W15 | TT accepts a shallower entry | **red** | 31 | 9 mates |
| W1 | `QUIESCENCE_MAX_PLY` 0 (quiescence off) | survives | 40 | — |
| W1b | quiescence off at the engine's leaf only | survives | 40 | — |
| W2 | quiescence 1 ply | survives | 40 | — |
| W4 / W5 | depth cap 3 / 4 | survive | 40 | — |
| W10 | PST off | survives | 40 | — |
| W11 | mate score ignores ply | survives | 40 | — |
| W13 / W14 | LMR reduces checks / reduces by 2 | survive | 40 | — |
| W16 | move ordering off | survives | 40 | — |

- **The default lane (`npx vitest run --dir src`) is red on all 10 survivors**, with 1–20 rows each. Every
  red row is an exact pin or an identity oracle: `engine.test.ts` `A3 (identity)`, node-count rows in
  `search.ordering`, `transposition` and `search.pvs-lmr`, the `lateMoveReduction` predicate, and
  `engine.test.ts` `A4` (no ceiling).
- None of those rows is a strength reading. A value-changing change re-records such pins by rule
  (`ADR-0026` decision 10).
- **Resolution, honestly:** the gate catches a broken evaluator, a broken mate detector, broken TT depth
  logic, a depth of 2, and material-value or sign errors. It does not catch the loss of quiescence, of
  depth beyond 3, of PST, or of an LMR or ordering regression.

## Focus 3 — `A4` and other steps (`raw-a4-process{1,2,3}*.txt`, `step-sweep*.mts/out.txt`)

- **Three processes:** 40/40 each, rows `cmp`-identical, and identical to the build's
  `raw-out-a4-process1.rows.txt`. Vitest wall 13.79 / 13.65 / 14.53 s.
- **Plain `node`, step 1:** the same 40 rows byte for byte, in 2.36 s. The vitest runner is ≈ 5.8× slower
  than plain `node`.
- **Budget 25 at other steps (plain `node`):** 0.25, 0.5, 0.8, 1, 1.6, 2 and 5 all read 40/40, mates 10/10,
  0/24 losing, **inside the bars**. At step 5 (5 readings per move) the depth is 3–4.
- **Below 5 readings it leaves the bars:** 4 readings 39/40, 3 readings 39/40, 2 readings 31/40 (mates
  1/10), 1 reading 27/40.
- **The do-not-hang class never reads a losing move with the shipped evaluator, even at depth 1.**
  Quiescence at the leaf sees the recapture.
- **Reading:** the bars hold at every step tried. The suite saturates at about 5 readings per move, so the
  baseline's 25 sits about 5× above saturation.

## Focus 4 — the `ABC-079` corpus move (`raw-cmp-hanging-corpus.txt`, `raw-quiescence-*.txt`)

- **The rows:** `cmp` of `7b54dae:src/quiescence.test.ts` lines 197–222 against the 26 lines after the
  declaration in `src/puzzle-corpus.ts` gives exit 0. That is 24 rows plus the `ADR-0028` comment pair, sha
  `62cf3771…` on both sides.
- **The declaration** gains only `export`, and the 10-line doc comment is identical.
- **The test file's diff** is the import plus the removed block only.
- **`SEARCH_DEEP=1 npx vitest run src/quiescence.test.ts`:** exit 0, 37 passed. Default: 29 passed.

## Focus 5 — the baseline commit (`raw-baseline-commit.txt`)

- `git log --name-only -- src/puzzle-suite.baseline.json`: one commit, `a287461`, which touches only that
  file.
- Its message states the reason: first recording, measured at `b3321f0`, which descends from `0de4a93`.
  It also states the measurement method, and that raising is QE's and lowering is the owner's.
- No trigger-list file is in `7b54dae..e426e91`.

## Gate (`raw-lint.txt`, `raw-typecheck-build.txt`, `raw-npm-test.txt`, `raw-integrity.txt`, `raw-host.txt`)

- lint: 97 files, exit 0. typecheck and build: exit 0.
- `npm test`: 50 / 1539 / 0 skipped, 7.29 s.
- Skip count 0; integrity `No findings.`
- Host check: exit 2 (`UNKNOWN - verify`).
