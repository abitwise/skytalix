---
id: 20261010T133848Z-software-engineer-observation-abc104-fix-forward-readings-c73ed93e
kind: observation
by: software-engineer
at: 2026-10-10T13:38:48Z
verified_by:
confidence: high
refs:
  - ABC-104
  - N8-LANE
  - src/coordinate-move.ts
  - 20261010T133848Z-software-engineer-decision-abc104-fix-forward-qe-gaps-2e7fbb75
---

# `ABC-104` fix-forward readings: probe, comment-only, gates at `82180eae`

This note is hand-authored and unsealed. Worktree `.claude/worktrees/fix-ABC-104`, base `b7cffc52`.

- **Probe.** QE's probe (`.grugops/context/qe-ABC-104/probe/qe-probe.mts`) was re-run after the edit, and
  its output is identical to `qe-probe.out.txt`. `(null,"e2e4")` and `(startpos,"e2e4",42)` each throw
  `TypeError`. B1 `(null,"hello")` returns `rejected/unreadable`. B4/B5 return `move` (`position` is
  unread when `legal` is supplied), B6 falls back via `??`, and B10 `[42]` returns `no-such-move`. The
  `text` domain has 0 of 38 throws. Every clause of the new sentence matches a row.
- **Comment-only.**
  - `git diff -U0 82180eae~1 82180eae` touches `src/coordinate-move.ts` only, with numstat 12/10 in
    two hunks (`@@ -25,4 +25,5 @@`, `@@ -32,6 +33,7 @@`). Every `+`/`-` line matches `^[+-] \*( |$)`.
  - Both hunks lie inside the header, which closes at `:40`.
  - `src/` numstat against `b7cffc52` is 14/7, one file.
  - `transpileModule` with `removeComments` emits 1291 B for base and for tip, sha256
    `f59e2c3244e8da62cb9e25b8a5896bcd62eaa4c46b53aeb9814c4eda27488fb6` on both.
- **Gates.**
  - lint (98 files, no fixes), typecheck and build all exit 0.
  - `npm test` exits 0 with 51 files / 1583 passed. No skipped or todo tests appear in the output.
  - `test-skip-integrity --skip-count 0` reports `No findings.`
- **N8-LANE.** 0 test files and 0 executable lines, so no measurement is owed. Security is not triggered.
