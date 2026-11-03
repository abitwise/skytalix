---
id: 20261103T104753Z-software-engineer-observation-669f366c
kind: observation
by: software-engineer
at: 2026-11-03T10:47:53Z
verified_by: 
confidence: high (deterministic counts and Object.is readings of this build, each a run under the host lock; S1-S3 and B1 (d) equal QE's forecast to the cp); B6 timing medium (shared host)
refs:
  - se-ABC-269
  - grugops/ABC-269
  - ABC-269
  - EPIC-011
  - E1
  - E3
  - ADR-0064
  - ADR-0061
  - ADR-0028
  - ADR-0056
  - ABC-231
  - ABC-232
  - ABC-215
  - ABC-268
  - ABC-228
  - ABC-229
  - ABC-230
  - ABC-249
  - ABC-170
  - ABC-208
  - B0
  - B1
  - B2
  - B3
  - B4
  - B6
  - F3
  - G1
  - G2
  - G3
  - G4
  - NFR-009
  - NFR-008
  - QE-269-a
  - QE-269-b
  - 58fa3eb4
  - b7a8fc3a
  - 8470d3f0
  - src/evaluate-params.ts
  - src/evaluate.ts
  - src/search.ts
  - src/engine.ts
  - src/quiescence.ts
  - src/evaluate.taper.test.ts
  - src/evaluate.taper-corpus.ts
  - arch-ABC-269-rule/20261103T093305Z-architect-design-decision-8ccb561f
  - qe-ABC-269-freeze/20261102T222017Z-qe-e2e-decision-1b856350
  - qe-ABC-269-freeze/20261102T222129Z-qe-e2e-observation-aea4ceba
  - arch-E1/20261102T215541Z-architect-design-decision-d8150777
supersedes: 
seal: sha256:201c3f94632a8180bd834d6306fc0913b368ef453f5b86b49534aafaf3959f9b
---

# se-ABC-269 acceptance readings: B0 EXACT on all 11 counts (F1 clear). B1 (a)–(e) met over QE's frozen fixture, which is untouched. B2 0/163 and 0/189. B3 zugzwang 7/7 at the recorded depths. B4 G1 54/58 with no NEWLY-MISSED line. G4 cross-build: 8 360 door rows node-equal to main. S1–S3 (a report) read +13 / +13 / +23, equal to the forecast. B6 (G2) reads 1.067–1.071 ×, a miss: F3, see the design note. B5, B7 and B8 are QE's and were not run

Software Engineer, task `se-ABC-269`, at `grugops/ABC-269` `8470d3f0` (code `b7a8fc3a`). Every reading is a run of this build, under the host lock. The scripts and outputs are in `raw/`.

## B0, node identity with the design (the instrument check, read first): EXACT
| reading | build | design (ADR-0064 d8) | `main` (door) | ratio |
|---|---|---|---|---|
| chooseMove kiwipete d8 | 1 296 788 | 1 296 788 | 1 306 981 | 0.9922 |
| chooseMove kiwipete d9 | 2 733 330 | 2 733 330 | 2 842 284 | 0.9617 |
| chooseMove position-6 d8 | 404 930 | 404 930 | 391 451 | 1.0344 |
| chooseMove position-6 d9 | 926 005 | 926 005 | 915 007 | 1.0120 |
| chooseMove position-6 d10 | 1 692 669 | 1 692 669 | 1 684 330 | 1.0050 |
| search() d8 kiwipete / position-6 | 839 514 / 1 533 901 | 839 514 / 1 533 901 | — | — |
| chooseMoveWithoutTaper d8 | 1 306 981 / 391 451 | main's | 1 306 981 / 391 451 | 1.0000 |
| searchWithoutTaper d8 | 888 786 / 1 262 046 | main's | 888 786 / 1 262 046 | 1.0000 |
- The ratios fall in 0.96–1.03 × as expected. No count is re-derived (the base `src/` is still 58fa3eb4). Pinned as `SEARCH_DEEP=1` rows in `src/evaluate.taper.test.ts`, which pass.

## B1, relations (default lane, `src/evaluate.taper.test.ts`, 90 new tests, all pass)
- **(a) the mirror, `Object.is`:** G3's 184, plus QE's 30 rows over phases 0–24 (both −0 traps, the clamp rows and the ep row). **0 mismatches.** The −0 traps return +0 on both sides.
- **(b) phase 24:** `evaluate` ≡ `evaluateWithoutTaper` on the 3 frozen rows at raw phase ≥ 24 (`M-p24-pos5-btm`, `M-clamp28`, `M-clamp32`) and on every G3 position at phase ≥ 24. Exact.
- **(c) the door is `main`:** `evaluateWithoutTaper` is `Object.is`-equal to the frozen pre-ticket scores on `TAPER_DOOR_CORPUS` (176) and `G3_CORPUS_MAIN_EVALUATE` (184, `buildCorpus` order). **0 differences.**
- **(d) the king walks, graded D1–D6** (centre minus corner, from the walking king's side; door = frozen pre-ticket):

  | row | shelter | door | E1 | bar ≥ 20 |
  |---|---|---|---|---|
  | D1 | none | −55 | **+75** | met |
  | D2 | partial | −96 | **+34** | met |
  | D3 | none | −45 | **+85** | met |
  | D4 | partial | −86 | **+44** | met |
  | D5 | none | −35 | **+55** | met |
  | D6 | none | −55 | **+35** | met |

  - **S1–S3, the castled corner, a REPORT only** (QE-269-a ruled (a)): **S1 −117 → +13, S2 −117 → +13, S3 −107 → +23.** That equals QE's forecast (`…aea4ceba`) exactly. Not graded, and not a test row. E3 owns it.
- **(e) the passers:** QE's 36 pairs, read as the PREREG states (sign × ((E(A) − E(B)) − (W(A) − W(B))) + base). Every row meets ≥ 1.5 × at phase ≤ 6, exact at 24, and ≤ 1.25 × at 18. The array grid (ranks 2–7; phases 0–6, 24 and 18–24) meets all three bars.
- **Rule rows:** `KING_TABLE_EG` is rebuilt from 40 − 15 m over all 64 squares. `PASSED_PAWN_BONUS_EG` = 2 × mg.
- **11 planted defects (raw/out/plants.out):** 10 go red.
  - The red ones: the full-form blend (the −0 traps), `Math.floor`, both clamps removed, one king-eg cell +1, passer eg = mg, `taper` on in `searchWithoutTaper`, the stand pat always tapered, a stale memo eg part on a hit, the king Δ unsigned for black, and the queen phase weight 3.
  - **One survives: removing the clamp to 24 alone.** It is an equivalent mutant at E1, because w is also clamped to D = 24 when `PHASE_EG` = 0.

## B2, the mate floor (`search()`, the 287, `SEARCH_DEEP=1`): 0 violations
- The door's (`searchWithoutTaper`) depth-4 mates, then `search()` at depth 5: **0 of 163**.
- Its depth-5 mates, then `search()` at depth 5: **0 of 189**. These equal the probe.
- Also: `ABC-268` A3 (b), `search()` against `searchWithoutFutility` at d5: 0 of 189.

## B3, zugzwang (hard): 7 / 7
- The shipped `chooseMove` plays the recorded move at the recorded depth in every row. `src/search.null-move.test.ts` A2 passes (44 / 44).
- `ABC-268` A3 (c) report: zugzwang.001 e1f1 d9, .004 h3h4 d11, .005 f4d5 d12, and kpk-b6c6 / c6d6 / d6e6 / e6f6 at d8.
- **No depth was re-pinned.**

## B4, G1: 54 / 58, no NEWLY-MISSED line
- `PUZZLE_DEEP=1`, the shipped engine: "solved 54/58, baseline 54/58, budget 25 step 1".
- 0 NEWLY lines. 18 / 18 tests pass.

## G4 / F2: the doors equal their pre-ticket selves (cross-build against `main` `src/` 58fa3eb4, one process)
- **The rows:** 190 positions (G3's 184 plus 6 endgames).
  - Every older `search` door at d1–3 (d1–2 for the two unpruned doors), and `searchWithoutTaper` against `main`'s `search()`.
  - Every older `chooseMove` door to d3, and `chooseMoveWithoutTaper` against `main`'s `chooseMove`.
- **The result:** 8 360 rows (nodes | score | move), **0 mismatches.**
- **Non-vacuity:** the shipped `search()` differs from `main` on 444 of 570 readings.

## The drift report on the tapered scale (not a bar)
- The futility deep lane's first run still had `chooseMove` (tapered) against `chooseMoveWithoutFutility`.
- It read 98.40 % within 25 cp, max 61 cp (kiwipete/f3f4 494 → 555). That is the probe's L reading exactly.

## B6, G2: 1.0711 × and 1.0672 ×, a miss of the 1.05 × bar. F3 fires. This task's design decision note has the readings and the variants
## Not run, owed elsewhere
- **B5** (`ADR-0061`'s cut audit on a scratch copy): QE.
- **B7** (G6 at 4 000 ms; `Q-3K-4` = (b), graded on the depth-6 floor): QE, on the reference host.
- **B8** (100 games, S′, Levels deep lane): QE, with the host ALONE.
- **G2 confirmation:** QE or the Architect, given F3.
