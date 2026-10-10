---
id: 20261010T150216Z-software-engineer-artifact-ref-abc131-baseline-lanewall-fix-3f1c9a20
kind: artifact-ref
by: software-engineer
at: 2026-10-10T15:02:16Z
verified_by:
confidence: high
refs:
  - ABC-131
  - QE-131-b
  - branch:grugops/ABC-131-drop-edge-puzzles
  - commit:b31ce2bb
  - src/puzzle-suite.baseline.json
  - 20261010T145645Z-qe-e2e-observation-abc131-gap-register-5e358534
supersedes:
---

# `ABC-131` fix-forward `QE-131-b`: commit `b31ce2bb`, one baseline field

Hand-authored, no seal (no `context-io` writer in this repository). Branch
`grugops/ABC-131-drop-edge-puzzles` from `cb4a14e4`, worktree `.claude/worktrees/fix-ABC-131`.
Not merged, not pushed.

- **`b31ce2bb`** touches only `src/puzzle-suite.baseline.json`, 1/1 lines. The `laneWallSeconds` field changes
  from `28.24 / 33.45 / 28.97 …` to `33.45 / 28.24 / 28.97 …`. The rest of the string is byte-identical
  (`raw-baseline-diff.txt`).
- **Source:** `ticket-to-pr-ABC-131/notes/raw-deep-tip-proc{1,2,3}.txt`, line 80 `Duration` = 33.45 s, 28.24 s and
  28.97 s. The rest of the field was re-read against the same files and was already in process order:
  mate-in-3 oracle 4.20 / 4.18 / 4.25 s, win-material 4.51 / 4.51 / 4.46 s, real 34.84 / 28.74 / 29.51 s.
  `wallSeconds` 23.94 / 19.21 / 19.93 also matches the `PUZZLES shipped` lines.
- **Key-by-key JSON parse diff, HEAD~ vs HEAD:** `solved`, `total`, `budgetMs`, `stepMs`, `unsolved`, `measuredAt`,
  `measuredOn`, `machine`, `load`, `wallSeconds` and `reason` are the same. Only `laneWallSeconds` differs, and the
  key order is identical.
- **Gates at `b31ce2bb`** (`raw-gates-b31ce2bb.txt`, 15:01:03Z–15:01:15Z): lint exit 0 (100 files); typecheck exit 0;
  build exit 0; `npm test` exit 0, 52 files / 1608 passed, 0 skipped; `test-skip-integrity --skip-count 0`
  `No findings.`, exit 0.
- **`PUZZLE_DEEP=1` once** (`raw-deep-b31ce2bb.txt`): start 15:01:21Z, load1 12.95; end load1 9.78. 54/58,
  baseline 54/58, 18 passed, exit 0, 0 NEWLY lines. Gating wall 20.26 s; oracles 4.50 s / 4.76 s; `Duration`
  29.87 s; real 30.43 s. Per-row lines sha1 `11326e1c`, equal to the engineer's and QE's tip readings.
