---
id: 20261101T070329Z-software-engineer-observation-851629b3
kind: observation
by: software-engineer
at: 2026-11-01T07:03:29Z
verified_by: 
confidence: high for gates, counts and net rows (all run); the 8.62 s wall is one informal read, not G8
refs:
  - se-ABC-246
  - ABC-246
  - EPIC-009
  - ADR-0052
  - NFR-008
  - QE-221-a
  - SE-221-g
  - SE-246-a
  - ABC-221
  - ABC-170
  - qe-ABC-221/20261031T060935Z-qe-e2e-observation-8ad25906
  - qe-ABC-221/20261031T060935Z-qe-e2e-observation-c6f37a35
  - se-ABC-221/20261031T053932Z-software-engineer-observation-7896971d
  - grugops/ABC-246
  - 3c5e05fd
  - 832ff246
  - src/uci-session.test.ts
  - src/engine.test.ts
supersedes: 
seal: sha256:f00befed557be8b1b82b70cce66b1cedcf67dffe230d171cdb0d353ae1760d94
---

# `ABC-246` A4/A5 readings at code commit `3c5e05fd` (base `main` `832ff246`): gates 0, `npm test` 2 366 / 0 skipped in 8.62 s at load1 0.39, net rows +2, comment-only `engine.test.ts` diff

All runs were in the worktree under plain `node` v26.12.1. Raw output is in `raw/`.
- **Static gates** (`npm run`): lint exit 0 (131 files, `raw/lint.txt`), typecheck exit 0, build exit 0.
- **`npm test`** (`raw/npm-test.txt`; `.test-results/last-run.json`): 63 files, **2 366 passed**, 0 failed,
  0 pending, 0 todo, rc 0.
  - Duration **8.62 s** (vitest; import 5.94 s, tests 7.10 s).
  - load1 was **0.39** before and 0.96 after, with 0 other vitest processes before the run
    (`raw/npm-test.load1.txt`).
  - Only the records-only BA/PM hop ran beside it.
  - This is one informal read, not QE's `G8`. It is under `NFR-008`'s 10 s.
- **Skip integrity** (`test-skip-integrity.js .grugops/test-skips.md --skip-count 0`): "No findings.", exit 0.
- **Lane inventory:** the lane collects 63 files and git tracks 63. "No findings.", exit 0.
- **Net rows +2** (`raw/rows-base-head.txt`, `vitest list` on the two changed files, flag 128).
  - Base `main`: `uci-session.test.ts` 232, `engine.test.ts` 64.
  - Head: 234 and 64.
  - The lane goes 2 364 (`se-ABC-247`'s reading on `main`) → 2 366.
- **A4:** `git diff main -- src/engine.test.ts` has 1 line removed and 4 added, all inside one JSDoc comment.
  `git diff --name-only main | grep -v '\.test\.ts$' | grep '^src/'` is empty, so there is no production line and
  the UAT waiver holds.
- **A5 rows:** every existing `ABC-220` / `ABC-221` row passes unedited. The `uci-session.test.ts` diff removes
  0 lines.
