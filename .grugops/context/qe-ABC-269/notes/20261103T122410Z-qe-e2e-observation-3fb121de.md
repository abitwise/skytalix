---
id: 20261103T122410Z-qe-e2e-observation-3fb121de
kind: observation
by: qe-e2e
at: 2026-11-03T12:24:10Z
verified_by: 
confidence: high: deterministic counts and hashes re-read on QE's own scratch copy and in the worktree, under the lock
refs:
  - qe-ABC-269
  - grugops/ABC-269
  - ABC-269
  - EPIC-011
  - E1
  - ADR-0064
  - ADR-0031
  - ADR-0061
  - NFR-005
  - Q-3K-4
  - B5
  - B6
  - B7
  - B8
  - G2
  - G6
  - F3
  - F5
  - F6
  - C1
  - 561fc028
  - be87a2f1
  - 01a67c5d
  - 4d6b117b
  - 58fa3eb4
  - 110292d4
  - b8b44ff3
  - src/evaluate.ts
  - src/search.ts
  - src/engine.ts
  - src/quiescence.ts
  - arch-ABC-269-F3/20261103T105957Z-architect-design-decision-e36ee7ca
  - arch-ABC-269-F3/20261103T105957Z-architect-design-decision-a0468a78
  - se-ABC-269-cut/20261103T112851Z-software-engineer-decision-8e00e712
  - se-ABC-269-cut/20261103T112851Z-software-engineer-observation-c9da2d0f
  - B0
  - B1
  - P6
  - G11
  - S-prime
  - QE-269-a
  - QE-269-f
  - QE-269-g
  - QE-269-h
  - QE-269-i
  - QE-269-j
  - QE-269-k
  - ABC-270
  - ABC-274
  - tools/rating/rating.ts
  - src/levels.test.ts
  - qe-ABC-269/20261103T114143Z-qe-e2e-observation-cebf49fe
  - qe-ABC-269/20261103T114143Z-qe-e2e-decision-21cd76df
supersedes: 
seal: sha256:260a8f4dc6bc6d986f1d8961308a59c9f4b5e78ae9ee786cc37b1303094316fa
---

# qe-ABC-269 step 3, the Engineer's claims re-read independently on the cut build: **all reproduce.** B0 exact on all 11 counts; `npm test` **66 files, 2 566 / 2 566**, 0 skipped; typecheck 0, lint 0 (136 files); fixture sha256 `05ed9e81…6e96339`; S1–S3 **+13 / +13 / +23**, equal to the forecast (report, ungraded); D1–D6 +75 / +34 / +85 / +44 / +55 / +35 (all ≥ 20); the six "untouched" files absent from the diff

QE/E2E, task `qe-ABC-269`. Under `flock host-test.lock`, 12:22:20Z–12:22:47Z (load1 1.04 → 1.60). Raw: `raw/out/verify/`; scripts `raw/scripts/verify.sh`, `b0.ts` (the Engineer's `se-ABC-269-cut` reader, unchanged), `kp.ts` (`se-ABC-269`'s reader, unchanged), run against QE's own scratch copy of `561fc028` `src/` (tree `4d6b117b`).

## B0 (P1), frozen clock
| row | read | claim |
|---|---|---|
| `chooseMove` kiwipete d8 / d9 | 1 296 788 / 2 733 330 | equal |
| `chooseMove` position-6 d8 / d9 / d10 | 404 930 / 926 005 / 1 692 669 | equal |
| `search()` d8 kiwipete / position-6 | 839 514 / 1 533 901 | equal |
| `chooseMoveWithoutTaper` d8 | 1 306 981 / 391 451 | equal |
| `searchWithoutTaper` d8 | 888 786 / 1 262 046 | equal |

The `G2` ns-per-node report (`…cebf49fe`) read the same d8 counts in all six rounds per arm, and U (the uncut build) read the same shipped counts as H: node-equal across the cut, as P4 claims.

## Tests and gates (in the worktree at `be87a2f1`, `src/` clean)
- `npm test`: **66 files passed, 2 566 passed (2 566)**, 0 skipped, rc 0. Claim 2 566 / 2 566: equal.
- `npm run typecheck` rc 0; `npm run lint` rc 0, "Checked 136 files". Build not re-run here; the rating tool built both heads from clean clones (`npm ci && npm run build`) for B8 / S′ without error.

## Fixture and untouched files
- `sha256sum src/evaluate.taper-corpus.ts` = `05ed9e81da4ad803a41c43e12c92d8ada9c23d52e91fa7fb770c871ae6e96339`: equal to the freeze.
- `git diff --stat 110292d4 561fc028 -- src/position.ts src/apply.ts src/legal.ts src/moves.ts src/zobrist.ts src/evaluate-params.ts src/evaluate.taper-corpus.ts`: empty. The cut's diff touches 12 files (4 source, 8 test), as the migration note lists.

## B1 (d) and S1–S3 on the cut build (centre minus corner, the walking king's side)
| row | shelter | door | E1 (cut) | forecast / bar |
|---|---|---|---|---|
| D1 | none | −55 | +75 | ≥ 20 |
| D2 | partial | −96 | +34 | ≥ 20 |
| D3 | none | −45 | +85 | ≥ 20 |
| D4 | partial | −86 | +44 | ≥ 20 |
| D5 | none | −35 | +55 | ≥ 20 |
| D6 | none | −55 | +35 | ≥ 20 |
| S1 | full | −117 | **+13** | forecast +13 (report) |
| S2 | full | −117 | **+13** | forecast +13 (report) |
| S3 | full | −107 | **+23** | forecast +23 (report) |

Equal to the uncut build's readings (`se-ABC-269` `kp.out`) cp for cp. S1–S3 are `ABC-270`'s first graded rows; nothing is graded here.
