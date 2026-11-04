---
id: 20261104T014043Z-software-engineer-observation-e3751084
kind: observation
by: software-engineer
at: 2026-11-04T01:40:43Z
verified_by: 
confidence: high (every figure read from extract.json / fit.json / stage logs / the json reporter of the runs named)
refs:
  - se-ABC-239b
  - grugops/ABC-239b
  - ABC-239
  - ABC-270
  - ABC-279
  - EPIC-011
  - E2
  - ADR-0067
  - ADR-0068
  - ADR-0069
  - ADR-0048
  - ADR-0028
  - B-T0
  - B-T1
  - B-T2
  - B-T3
  - B-T4
  - B-T5
  - F3
  - F4
  - QE-270-e
  - NFR-008
  - a8fbade5
  - 625b75fe
  - 5ce4f870
  - def26997
  - 954d44fb
  - 8c03b713
  - 26d06118
  - arch-ABC-239-rulings/20261103T223637Z-architect-design-decision-2b428ce8
  - orch-2026-10-30a/20261103T221607Z-orchestrator-decision-42c82347
  - orch-2026-10-30a/20261103T223750Z-orchestrator-decision-912ba57d
  - orch-2026-10-30a/20261104T010343Z-orchestrator-decision-d7605102
  - se-ABC-239/20261103T220702Z-software-engineer-failed-attempt-f39f6eb5
  - tools/tune/tune.ts
  - tools/tune/tracer.ts
  - tools/tune/bounds.ts
  - tools/tune/tune.test.ts
  - src/evaluate-params.ts
  - src/evaluate.test.ts
  - src/evaluate.taper.test.ts
  - src/evaluate.king-mobility.test.ts
  - src/evaluate.pawns.test.ts
  - src/search.null-move.test.ts
supersedes: 
seal: sha256:0ac1a33d3993a5d0e7d66841fc20ebf62e668441689da40172077f0caa549aa0
---

# se-ABC-239b observation: the data stage and B-T0–B-T3 on `main` with `ABC-270` and Q1. No data-stage stop fired. B-T1, B-T2 (0.9905 ×) and B-T3 MET. Bound set: one row

Software Engineer, task `se-ABC-239b`. Every run was under the host lock, one process at a time, each stage under `timeout 1800` and `--max-old-space-size=3000`. Raw: `.grugops/context/se-ABC-239b/raw/out/` (`extract.json`, `boxonly-fit.json`, `candidate-fit.json`, `manifest.txt`, `stage-times.txt`, `gate-emitted.txt`, `step4-boxonly-evaluate-files.txt`).

**B-T0 (source and licence).** Own self-play: Apache-2.0 (`ADR-0048`), openings CC0 (`ADR-0023`). Plus `https://database.lichess.org/standard/lichess_db_standard_rated_2017-03.pgn.zst`: 2 169 142 067 bytes, sha256 `b319297e9270285635d615cbcd19a9b0d44747be3ff91d5b3eac41175b794320`, "Lichess database export, CC0 (database.lichess.org)", training only. Before use it was checked again with `sha256sum -c`: OK. **Data manifest sha256 `c9d777ef56d395f453e50066cbc8ac3ef058d9f90039e1d6920c81738eb15934`**: 35 own PGNs, repository-relative, plus the Lichess entry by URL, bytes and sha256.

**Own games (six players, ruling (d)):** 5 858 read, 1 561 other player, 617 duplicates, **3 680 kept**. That is 3 531 + 58 + games tracked on `main` since. A1 marked the base count `UNKNOWN - verify`; the header records 3 680. Positions: 422 749 seen; dropped 7 009 book, 16 476 mate, 31 182 check and 90 855 noisy; 277 227 kept. 106 openings, 23 of them validation; 1 518 validation keys seen in training were removed. Rows: **own training 167 014** (inner validation 48 280), **own outer validation 45 158**.

**Lichess:** 11 346 745 games read. Dropped by g1 0, g2 3 175 054, g3 7 769 697, g4 112 849, g5 0, g6 0. 289 145 reached replay. **g7 reader drops: 0 (stop 2 not fired).** g8 duplicates 278, so 288 867 games kept. Positions: 21 084 733 seen. Dropped by r1 4 613 170, r2 14 420 734, r3 148 675, r4 581 702. r6: 1 320 452 occurrences into 1 274 381 keys. r7 leakage 26. r8 cap 274 355. **Lichess rows 1 000 000 (stop 1 not fired).** These counts are the previous hop's except r7 and r8, which moved with the larger own-validation set.

**Stops 3 and 4:** one run takes about 4 min 44 s to 5 min 0 s (extract 3:27–3:29, fit 1:17 box-only / 1:31 bounded, emit 0.1 s), against the 30 min stop. Peak RSS: extract 1.50–1.60 GB, fit 0.44 GB, inside the 3 000 MB flag. Neither stop fired.

**B-T1 (identity gate, d5): MET.** 0 misses over 1 488 071 gated keys (every own and Lichess key before the cap); worst |model − evaluate| 0.9583 cp; equal wherever w = 24. At the base values the queen-on pairs are 0, so B-T1 cannot see them. **The gate once more on the emitted file** (d5's dated line 2): **0 misses over 1 212 172 rows**, worst 0.9583 cp. 448 779 of those rows carry a nonzero queen-on count, and the queen-on mg halves are live (14 / 29 / 0), so this pass does see the new features.

**K:** K_own 0.602537777981346, K_lichess 0.825971782675998.

**Step 3, the box-only fit (scratch, never committed; sha256 `5493876073…4237`).** Inner rule: C-S 0.587276; C-F λ 1e-8 0.586440 (the winner, by more than 0.1 %), λ 1e-7 0.587251, λ 1e-6 0.588271; base 0.589850. Outer validation 0.590390 → 0.584498 (0.9900 ×).

**Step 4, the relation rows on the box-only set.** Each of the five `src/evaluate*.test.ts` files was run with the box-only file in place (list: `step4-boxonly-evaluate-files.txt`). **One relation row read red:** king-mobility A2 (b)'s phase-24 twin, "at EQUAL material too, at phase 24: the g-pawn on g6 instead of g2 scores strictly lower (ABC-270 re-find)", **+46 against < 0**. That is ruling (b)'s forecast case. Every other relation row read green: pawns A2 to A8 (A2's gap 49, bar ≤ 50), evaluate.test A3 and A4, king-mobility A2 (a), A3 (a) and (b), and the bite rows after QE-270-e. Rows that fail first on a pin were read past it (`relread.ts`): B1 (d) D1–D6 at 182 / 170 / 202 / 174 / 96 / 92 against 20, and A4's order at +65 / −65. The other reds there are retirements, pins and lost fixture premises, not relations. **`zugzwang.001` at depth 9 on the box-only set: e1e5** (noted, not graded, as step 4 says).

**Step 5, the one refit** with that bound (`tools/tune/bounds.ts`, tool commit `8c03b713`). C-F at λ 1e-8 is still the inner rule's choice (C-S 0.587309; C-F 0.586448 / 0.587278 / 0.588287). Full fit: 10 Newton steps, all of them bounded. The bound is active with μ 9.58e-7 and margin 3.5 (½ × 5 + 1 for strict; at w = 24 there is no trunc). a = PST pawn g6 mg +1 (tied b6), pawn g2 mg −1 (tied b2), KING_SHELTER_MISSING mg −1, KING_SHELTER_MISSING_QUEEN mg −1, MOBILITY_WEIGHT mg +1. On the rounded set the row reads **−3** (−20 − (−27) − 0 − 14 + 4).

**B-T2 (the emitted integer set, own outer validation 45 158 rows, K_own): MET.** Cross-entropy base 0.590390 → fit 0.584768, **0.9905 ×** (< 1.000 ×). Squared error 0.078415 → 0.076358. Training (own) 0.587977 → 0.582341 (0.9904 ×): no overfit gap. Reported beside it, grading nothing: on the Lichess rows (K_lichess) 0.591611 → 0.585533 (box-only 0.585854). The own-only fit (same rules and bounds, C-S chosen; one bounded step, and its rounded set is the box-only own-only set) reads 0.585296 on the same outer rows (0.9914 ×).

**B-T3 (reproducibility): MET.** Two full `extract | fit | emit` runs from the base table, the bounded refit included, gave a byte-identical `src/evaluate-params.ts`, **sha256 `10581fb5dd0395f577b5483f3b6ead9ec4a363374a68c0982acadf2b1c0995af`**. `rows.jsonl` is identical across all three runs (box-only, run 1, run 2), and `fit.json` across the two bounded runs.

**The candidate's values, in brief:** material, the phase constants and the mobility cap are frozen. Passed mg 0 0 0 16 55 98, eg 28 52 71 92 159 219. Doubled 0 / 9, isolated 16 / 20. Shelter 0 / 0, half-open 0 / 0, open 39 / 14. **Queen-on mg 14 / 29 / 0** (eg 0, held). Mobility 4 / 8. The base shelter and half-open terms went to 0 in both halves, and that weight moved onto the queen-on terms. A9's int16 range row (Σ inside int16) is green.
