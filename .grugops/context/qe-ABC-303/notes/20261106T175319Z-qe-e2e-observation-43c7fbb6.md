---
id: 20261106T175319Z-qe-e2e-observation-43c7fbb6
kind: observation
by: qe-e2e
at: 2026-11-06T17:53:19Z
verified_by: 
confidence: high: as played, the sealed commands, cross-checked from the PGN; figures from the harness and analyze.py
refs:
  - qe-ABC-303
  - grugops/ABC-303
  - grugops/qe-ABC-303
  - ABC-303
  - ABC-286
  - ABC-288
  - EPIC-011
  - ADR-0056
  - ADR-0072
  - ADR-0073
  - ADR-0046
  - R-BUNDLE-1
  - PREREG
  - C2-prime
  - S-prime
  - G1
  - G2
  - G6
  - NFR-005
  - NFR-008
  - NFR-009
  - R-CEN-1
  - bb0cc134
  - 63667fc8
  - 38914841
  - arch-owner-answers-1104b/20261104T220311Z-architect-design-decision-d776c0f0
  - arch-bundle-1/20261104T201203Z-architect-design-decision-aa5c4dc1
  - orch-2026-10-30a/20261104T215525Z-orchestrator-decision-3e73f9f9
  - orch-2026-10-30a/20261105T215707Z-orchestrator-decision-43e6d8fd
  - se-ABC-303-main/20261105T122839Z-software-engineer-observation-bd60978c
  - se-ABC-303-main2/20261106T134724Z-software-engineer-observation-e6cff498
  - secnfr-census-1105/20261105T115526Z-security-nfr-decision-b9038a14
  - qe-ABC-303/20261106T135702Z-qe-e2e-decision-53858301
  - qe-ABC-282/20261104T230342Z-qe-e2e-observation-b4427cbd
  - qe-ABC-303/20261106T140659Z-qe-e2e-decision-b59650bc
  - orch-2026-10-30a/20261106T164759Z-orchestrator-decision-318c9e3b
  - arch-ABC-303-load/20261106T141500Z-architect-design-decision-a5dc0532
  - FL
  - 55996783
  - qe-ABC-303/20261106T165315Z-qe-e2e-decision-79bd6622
  - qe-ABC-303/20261106T170749Z-qe-e2e-observation-397a7ec5
  - qe-ABC-303/20261106T171254Z-qe-e2e-observation-f0be43f8
  - qe-ABC-303/20261106T171431Z-qe-e2e-observation-2f8fccef
supersedes: 
seal: sha256:ad3fae0bf9140f108bfaebd43ebab212f8d2f129705986f094b137f2f27f8dea
---

# qe-ABC-303 the games, as played: **C2′ 47 / 36 / 17 = 55.5 / 100, MET. S′ 9 / 1 / 0 = 9.0 / 10, MET. The Levels deep lane 58 / 58, exit 0, MET.** Each read once, with its sealed command, under FL

QE/E2E, task `qe-ABC-303`, PREREG `…53858301` § 6, addendum `…79bd6622`. Candidate `bb0cc134`, base `38914841`. Every output file was non-empty before it was read, but for the two stderr files of each match, which read 0 bytes as they should. Raw: `raw/out/c2/`, `raw/out/s1/`, `raw/out/levels/`.

## C2′ (one hold, 17:14:36Z to 17:34:59Z, 20 min 23 s)
- `node tools/rating/rating.ts d bb0cc134 38914841 <out> --budget-ms 100 --rounds 50 --concurrency 1`, the second launch of the same command (`…2f8fccef`: the first stopped before any game).
- **100 of 100 complete. W/L/D 47 / 36 / 17, 55.5 / 100, at or above 50.0: MET.** 0 candidate faults, 0 base faults, 0 losses on time, 0 unclassified, 0 move-cap draws, both stderr files 0 bytes. My own count from `d.pgn` agrees: 100 games, 47 / 36 / 17.
- Elo +38.4 ± 63.0, LOS 88.6 %, draw ratio 17.0 %. **The harness's `state: NEUTRAL` is not the verdict** (§ 6). The interval spans 0: this read shows the bundle not worse than the base at the bar, and it does not prove a gain.
- Largest move: candidate 105 ms, base 105 ms, medians 101 ms; 0 past 150 ms. Largest overshoot 5 ms on each side.
- By colour 29.5 / 50 as White, 26.0 / 50 as Black. Opening pairs (0, 0.5, 1, 1.5, 2): 8, 7, 14, 8, 13. Mates 83, threefold 10, insufficient material 4, fifty moves 3.
- `dist/` differs from the base in `engine.js` and `search.js` only, as § 2's production diff has it. Pins equal.

## S′ (one hold, 17:35:24Z to 17:42:22Z, 6 min 58 s)
- `node tools/rating/rating.ts r bb0cc134 <out> --elo 1810 --budget-ms 500 --rounds 5 --concurrency 1`.
- **10 of 10 complete. W/L/D 9 / 1 / 0, 9.0 / 10, at or above 3.0: MET.** S-1 0 faults; S-2 0 losses on time; S-4 met on the first ten, so no second ten. Stockfish's depth guard 0 of 420 below depth 4.
- Largest move: candidate 505 ms, Stockfish 501 ms; 0 past 750 ms. The harness prints 1 810 + 381.7 ± nan; the error is `nan` at this score, and no bar reads it.

## The Levels deep lane (one hold, 17:42:41Z to 17:52:19Z, 9 min 38 s)
- The sealed command on arm H, `git archive bb0cc134`, `src/` equal to the worktree's. **Exit 0. 1 file, 58 of 58 passed, 0 failed, 0 skipped: MET.**

## FL's figures, by class and count. No verdict rides on them
| stage | `fsample.sh`, busy foreign of total | `host.log`, samples with a foreign vitest | largest load1 | largest move, candidate / other |
|---|---|---|---|---|
| C2′ | 8 of 405 | 3 of 122, count at most 2 | 2.08 | 105 / 105 ms |
| S′ | 70 of 138 | 11 of 18, count at most 3 | 3.72 | 505 / 501 ms |
| Levels (outside FL's words, reported as well) | 34 of 191 | none kept | 4.61 | not a game |

All foreign rows are one class: vitest in one project, `marketing`. None was touched, nothing paused, nothing voided. Game time 37 min 0 s against the 44 min forecast.
