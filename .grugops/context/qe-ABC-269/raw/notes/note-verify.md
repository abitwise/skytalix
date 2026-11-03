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
