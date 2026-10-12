---
id: 20261012T105404Z-ba-pm-observation-abc105-153-fold-readings-e2d5f352
kind: observation
by: ba-pm
task: bapm-fold-ABC-105-153
at: 2026-10-12T10:54:04Z
verified_by:
confidence: high
refs:
  - ABC-105
  - ABC-153
  - ABC-154
  - ABC-155
  - QE-105-r
  - QE-105-u
  - QE-105-z
  - QE-153-a
  - 20261012T103400Z-qe-e2e-decision-abc105-qe4-verdict-pass-with-gaps-n8-not-read-6a647762
  - 20261012T065549Z-qe-e2e-observation-abc153-gap-register-e88108db
supersedes:
---

# `ABC-105` / `ABC-153` fold: what I read, and the commands

This is a hand-authored note with no stamp, per `AGENTS.md`. **No timing was read**, because the hops run in
parallel. I took readings only where the fold puts a number on a page; everything else is cited from QE. Every
reading was taken in worktree `../wt-bapm-fold-ABC-105-153` at `6ae6dd27`.

## Base identity (the new tickets' "base")

- `git show 8fd0c233:<f> | cmp - <f>` gives **0** for both `tools/grugops/qe-hop-integrity.test.ts` and
  `tools/grugops/qe-hop-integrity.js`. The merged files are the code QE4 reviewed.
- `git show 917df052:tools/opening-book/book.test.ts | cmp -` gives **0**. That is `ABC-153`'s code commit.

## `QE-105-u` premise (number on `ABC-105` § fold, `AR-105-ALLOWJS`)

`grep -rnE "from ['\"][^'\"]+\.(js|mjs|cjs)['\"]"` over the `tsconfig.json` `include` set (`src`, `spike`,
`tools/opening-book`, the test, `vitest.config.ts`) finds **1 file and 1 line**:
`tools/grugops/qe-hop-integrity.test.ts:22`. A dynamic `import("….js")` scan over `src spike tools
vitest.config.ts` finds **0**.

## `QE-105-r` premise (`AR-105-SYMLINK-ROOT`)

`test -L .grugops/context` is false: **not a link**. `find .grugops/context -type l | wc -l` gives **0**.

## `ABC-154` count pins

- `grep -cE 'spawn\(|spawnSync\(|execFile\(|exec\(|child_process' tools/grugops/qe-hop-integrity.test.ts` gives
  **0**. A looser `spawn|execFile|child_process` gives 1, and that 1 is the line-4 comment "0 spawns".
- `plants4.py` defines **9** QE4 plants: `q4a-*` × 5 and `q4b-*` × 4. The 3 that go 0 red at both old and new
  are QE4's (`…6df3826a`, table rows `q4a-readNotes-unfiltered-drops-secnfr`, `-drops-quality-gate`,
  `q4b-both-memos-empty (two faults)`). I cite them; I did not re-run them.
- `coverage()` returns `QE` / `SUBSTITUTE` / `FINDING` / `PRE_CUTOVER`, read from the tool. A dropped note can
  only remove a match, so the uncaught fault fails closed. That is a reading of the code, not a run.

## `ABC-155` premises

- `compile.ts:168` is `if (actual !== expected[file])`, a full-string compare.
- `book.test.ts` matches `spawn|execFile|child_process` **0** times.
- `Q-PREFIX` = `actual.slice(0, 8) !== expected[file].slice(0, 8)`, passing 19/19 at base and head. That is QE's
  reading (`…3d6ce640`), cited.

## Not measured

The sweep counts, the test counts and any lane cost. The gates I ran before committing are in the decision
note's § Gates.
