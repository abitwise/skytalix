---
id: 20261104T010223Z-qe-e2e-observation-92aacc6f
kind: observation
by: qe-e2e
at: 2026-11-04T01:02:23Z
verified_by: 
confidence: high: npm test on both trees, typecheck, lint and 14 deep lanes on the build run by QE under the lock; K2 by a diff read of every changed test row; mutants on a scratch copy only, each restored
refs:
  - qe-ABC-270
  - grugops/ABC-270
  - ABC-270
  - EPIC-011
  - E3a
  - ADR-0068
  - ADR-0067
  - ADR-0064
  - ADR-0028
  - ABC-083
  - ABC-274
  - ABC-239
  - K0
  - K1
  - K2
  - K3
  - K4
  - F1
  - F2
  - F5
  - G2
  - G6
  - S2
  - NFR-001
  - NFR-005
  - NFR-008
  - NFR-009
  - QE-270-a
  - QE-270-d
  - QE-270-e
  - QE-270-f
  - QE-270-g
  - UAT
  - 4b9c5357
  - 4cb84035
  - 795a6b61
  - 0f393c18
  - fb920c14
  - src/evaluate.ts
  - src/evaluate-params.ts
  - src/evaluate.queen-on.test.ts
  - src/evaluate.taper.test.ts
  - src/evaluate.king-mobility.test.ts
  - qe-ABC-270/20261104T001924Z-qe-e2e-decision-f8ab73a7
  - qe-ABC-270-freeze/20261103T222633Z-qe-e2e-decision-fa82b3f3
  - qe-ABC-270-freeze/20261103T222638Z-qe-e2e-observation-543b10d8
  - se-ABC-270/20261104T000848Z-software-engineer-decision-007dc90a
  - se-ABC-270/20261104T000848Z-software-engineer-observation-15cac083
  - se-ABC-270/20261104T000848Z-software-engineer-observation-bd09c051
  - se-ABC-270/20261104T000848Z-software-engineer-observation-77fd2bd9
  - sha256:68769ea9712097ff1a366b6ad952a71376579fba94d6625c032062dd5e19c681
supersedes: 
seal: sha256:189f04a3765ebb2f6679b35bc98451108df59c46a3055f5c05ef9151f0fa911d
---

# qe-ABC-270 K2 and the gates, re-run by QE: **0 expectations re-pinned** (diff read row by row; the only removed rows are the two `ABC-083` pawn-ending rows that `ADR-0068` d5 replaces with their phase-24 twins). `npm test` base 2 588 / 2 588 (66 files, 9.46 s) → build **2 604 / 2 604** (67 files, 9.34 s); typecheck and lint exit 0; **14 deep lanes on the build, all as expected** (taper 169, null-move 44, futility 53, search 57, quiescence 116, tt 40 / 26, PVS/LMR 29, ordering 43, engine 82, pawns 44, levels 57, puzzle 18 at 54 / 58; puzzle-weakened red by design). Seven QE mutants on a scratch copy: **7 / 7 killed** by QE's `k1.ts` and by the build's own new file

QE/E2E, task `qe-ABC-270`, on the build worktree (HEAD `fb920c14` = code `795a6b61` + records; `src/` `0f393c18`) and a detached `main` `4b9c5357` worktree for the base `npm test` (removed afterwards). Every run under `flock <scratch>/host-test.lock`. Raw: `raw/out/post.log`, `npm-test-*.txt`, `deep-head/exits.txt`, `mutants/`.

## K2, zero re-pins
- **Diff read** (`8f086ee8..795a6b61`, the three test files):
  - `src/evaluate.king-mobility.test.ts`: A2 (b) and A3 (b), the two pawn-ending rows, are replaced by their phase-24 twins plus two bite rows; four twin FENs join A1's mirror list. Both old rows read green on base and build (K1 (e) note), so no expectation moved; the old FENs stay declared and in the mirror list.
  - `src/evaluate.taper.test.ts`: the parameter-table list gains the three names; A9's bound adds each queen-on pair to its base term (at 0 the printed bound is unchanged, and no expected number in the file changed); one new row.
  - `src/evaluate.queen-on.test.ts`: new (13 rows).
  - No other test file changed. **0 re-pins.** F1 does not fire.
- **`npm test`** (`N8-LANE`, report): base **2 588 / 2 588**, 66 files, Duration 9.46 s; build **2 604 / 2 604**, 67 files, Duration 9.34 s (+16 rows: 13 new file, 2 bite rows, 1 range row; the two replaced rows keep their count). One reading each; host shared.
- `npm run typecheck`, `npm run lint`: exit 0 on the build (biome: 139 files, no fixes).
- **Deep lanes on the build** (`raw/out/deep-head/exits.txt`), each exit 0 unless noted: taper `SEARCH_DEEP=1` 169 / 169 (B0 counts; mate floor d4 → d5 **0 / 163**, d5 → d5 **0 / 189**); null-move 44 / 44 (zugzwang rows at their recorded depths); futility 53 / 53; search 57 / 57; quiescence 116 / 116; transposition 40 / 40; PVS/LMR 29 / 29; ordering 43 / 43; engine `ENGINE_DEEP=1` 82 / 82; transposition 26 / 26; pawns 44 / 44; **levels 57 / 57**; puzzle `PUZZLE_DEEP=1` 18 / 18, solved **54 / 58** = baseline; puzzle-weakened exit 1, 1 failed / 14 (evaluate = 0 solves 16 / 58): the negative control, red by design. Equal to the Engineer's counts.

## Mutants (scratch copy of the build's `src/` only; `raw/scripts/mutate.py`, `mutants.sh`; restored and `cmp`-checked)
QE chose seven not in the Engineer's six. Each was read by QE's `k1.ts` (rule-based) and by the build's `src/evaluate.queen-on.test.ts`:

| id | mutant | QE `k1.ts` | build's new file |
|---|---|---|---|
| CLEAN | none | K1 OK | 13 / 13 |
| Q1 | the walk never sets a queen flag (`type > QUEEN`) | 332 266 misses | 3 failed |
| Q2 | any queen on the board sets both kings' flag | 178 248 | 3 failed |
| Q3 | a queen COUNT, not a flag, in the hot path | 1 942 (QP7, QC8 nets) | 2 failed |
| Q4 | the half-open queen-on pair never added | 249 690 | 4 failed |
| Q5 | black's king never gets the queen-on terms in `evaluate` | 492 093 | 4 failed |
| Q6 | the queen-on pairs subtracted | 498 309 | 4 failed |
| Q7 | the open queen-on pair loaded with its mg in both halves | 91 384 | 2 failed |

- **7 / 7 killed by each.** The walk-only mutants (Q1, Q2, Q3, Q5) are caught in the build's file by its `evaluate`-net, blend, mirror and source-text rows, **not** by its per-king rows, because `kingExposureForTest` scans for queens itself (`QE-270-f`). The Engineer's six (`…bd09c051`) cover swapped flags, flag always on, eg ignored at load, swapped slots, wrong-colour flag.
