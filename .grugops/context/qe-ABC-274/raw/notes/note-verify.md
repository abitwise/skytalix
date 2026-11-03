# qe-ABC-274 independent re-checks of the rows the Engineer read: A3 15 / 15 with the seam ruling's Q1–Q4 met (Q2: ≥ 3 asserted, 6 rows a family except DOUBLED's 4; phase spread narrow, reported); S1–S3 present and green; A4 green; A7 `npm test` **2 588 / 2 588** (66 files, 9.55 s), 0 expectations moved, and **the deep lanes re-run on the repair head equal the pre-ticket head's** lane for lane (taper 168 against 146, +22 added rows); A8 clean; A9 15 910 / 17 510 inside int16; carry-over diff = the seam body plus tests; NFR-009 +1 860 B. Two planted mutants on a scratch copy: A3 alone catches the one A1 / A2 cannot see

QE/E2E, task `qe-ABC-274`. Every run under `flock …/host-test.lock`. Head `grugops/ABC-274` `25dc5b1e` (src = `7daae342`'s, `4cb84035`); base `main` `54dee3f2` (`4d6b117b`). Raw: `raw/out/gates/`, `raw/out/deep-cand/`, `raw/out/deep-base/`, `raw/out/q2.jsonl`, `raw/out/mutants.txt`.

## Scope (`git diff main...HEAD`, three dots)
- Only `src/evaluate.ts` and `src/evaluate.taper.test.ts` change in `src/` (plus records). `src/evaluate-params.ts` byte-unchanged (scope 3). The two-dot diff against `54dee3f2` also lists `tools/rating/*` and `AGENTS.md`; those are `main`'s own later commits merged in, not the ticket's.
- **Carry-over** (`git diff c131ecd0 HEAD -- src/`): `src/evaluate.ts` 4 lines, the `loadParameters` / `clearPawnCacheForTest` pair moved inside `withParametersForTest`'s `try`; the rest is `src/evaluate.taper.test.ts`. The condition holds. A1, A2, A5 and A6 were in any case read here on the repair head itself.

## A3 and the seam ruling's checks (`…3169a174`)
- **Q1** (source read): the row filter (`phaseOf`, `family.shift`) and the E1 readings (`evaluateWithoutTaper`, `evaluateAtPhase(p, 0)`) run before `withParametersForTest` is entered. `shift` uses only the test's board counters (`mobilityCount` after S1). Nothing inside the seam picks a row. Met.
- **Q2** (a scratch copy of the test with one logging line, run with `-t "ABC-274 A3"`, 20 passed): every family asserts ≥ 3 rows. Rows: 6 each, except **DOUBLED 4** (two door-corpus positions and their mirrors). Phases: MATERIAL 4–23, PST.knight 7–23, PST.bishop 22–23, PST.queen 18 only, PASSED 4–23, KING_SHELTER_MISSING 4–23, MOBILITY_WEIGHT 4–23, MOBILITY_CAP 17–23, KING_FILE_OPEN 2 only (the K+R v K mate family), and PST.pawn, PST.rook, PST.king, ISOLATED and KING_FILE_HALF_OPEN all at 4 (position-3 and its five 1-ply children). Reported (QE-274-b).
- **Q3** (source read): the corpora are whole exports in fixed order (`buildCorpus()` 184, `TAPER_DOOR_CORPUS` 176, `MATE_CORPUS` 287), with no filter but the rule. The mate corpus is there because the first two had no `KING_FILE_OPEN` row (`…3219e70e`); it holds the only six KING_FILE_OPEN rows.
- **Q4** (source read): one `Math.trunc` over the summed `egDelta` (`return mg + Math.trunc((egDelta * (PHASE_SPAN - w)) / PHASE_SPAN)`), no `Math.floor` anywhere in `src/evaluate.ts`. `ADR-0064` d2's form. Met.
- **S1–S3:** the three rows exist and are green (verbose deep taper lane, and the default lane). S3's pin read: only `src/evaluate.ts` names the seam; `loadParameters(` at load plus two in the seam.
- **Mutants (scratch copy only, restored, `cmp` equal):** M1 packs each non-king square table's mg half as its eg half. It is invisible to A1 / A2 at E1's equal halves, and it turns exactly the five PST family rows red (5 failed / 154 passed). M2, `Math.floor` for `Math.trunc` in the blend, turns 40 rows red (G3 mirror and taper rows).

## A4, A7, A8, A9, NFR rows
- **A4:** the G3 mirror rows and the taper corpus's mirror rows are green in the default lane. A2's 62 055-position mirror check had 0 misses. `evaluate` writes only the pawn memo and the three part scratch variables, as before. The packed arrays are written only by `loadParameters`.
- **A7:** `npm test` **2 588 / 2 588**, 66 files, 0 skipped, Duration 9.55 s (`NFR-008` ≤ 10 s; one run, not a lane-budget reading). The test diff against `main` deletes two lines, both import lists that were widened, and moves no `expect`. Typecheck exit 0; `biome check` clean (136 files).
- **Deep lanes**, 13 each, candidate (14:14:44Z–14:21:48Z) then a detached `54dee3f2` worktree (14:21:48Z–14:28:52Z, removed afterwards), with the same commands as `se-ABC-274`'s `deep.sh`:

  | lane | head | base |
  |---|---|---|
  | taper (SEARCH_DEEP) | 168 | 146 (+22 = A3 17, A9 2, S1–S3 3) |
  | null-move / futility / search / quiescence | 44 / 53 / 57 / 116 | equal |
  | transposition (SEARCH) / pvs-lmr / ordering | 40 / 29 / 43 | equal |
  | engine / transposition (ENGINE) / pawns | 82 / 26 / 44 | equal |
  | puzzle (`G1`) | 18, solved 54 / 58 | equal |
  | puzzle-weakened | 1 failed, 13 passed (its negative control, "solved 16 / 58") | same |

  - Report lines, after removing timings: identical except the wall-clock ones (the engine's `NFR-005` node counts and "over 4 000 ms: 12 / 30" against base's 9 / 30 under the 5 s ceiling, puzzle walls, and `NFR-009` heapUsed 9.27 against 9.26 MiB). Mate floor 0 / 163 and 0 / 189 on both.
- **A8:** the added production lines read no budget, deadline, `movetime`, clock, environment, argv or test flag (grep of `git diff main HEAD -- src/evaluate.ts`). No games played.
- **A9:** the row prints |Σ mg| ≤ 15 910 and |Σ eg| ≤ 17 510; its non-vacuity row is green. The bound reads soundly: per side, the king's largest entry plus 15 × the largest other entry, both sides' pawn and king-file terms, and the king's eg packed from its mg half, as the loader packs it. The split needs only Σ mg inside int16 (eg is recovered exactly by subtraction in a double), so the row is, if anything, conservative. The largest |score| A2 met, 13 040 (15 queens), sits inside it.
- **`NFR-009`:** +1 860 B fixed at load (`PACKED_PIECE_SQUARE` 1 792, `PACKED_PASSED` 32, `PACKED_TERMS` 20, `MOBILITY_TERMS` 16). The pawn memo keeps three Int32 parts (448 KiB, pinned).
- **C1 / P5:** the walk between `for (let rank = 7;` and the mobility split names no `phase`, `egDelta` or `KING_EG_DELTA` (0 matches). The four P5 rows are green.
