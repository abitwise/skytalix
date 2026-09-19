---
id: 20260920T054000Z-software-engineer-observation-five-rounds-in-a-copy-outside-the-repository-deletion-42-to-41-red-typo-42-to-84-red-new-file-red-then-green-guard-unreachable-5d19c7e2
kind: observation
by: software-engineer
at: 2026-09-20T05:40:00Z
verified_by:
confidence: high
refs:
  - ABC-118
  - tools/grugops/lane-inventory.js
  - vitest.config.ts
supersedes:
---

# `ABC-118` `A1`–`A4` — five rounds in a copy outside the repository; every red watched, every revert checked

**Hand-authored `observation`, no stamp.** Raw transcript: `raw-probe-output.txt`; harness:
`raw-probe-harness.mjs.txt` (it refuses to run against any path that is not the scratchpad
copy). Load 8.4 at start, 9.8 at end.

**Discipline (ticket `## Test notes`):** the tree was copied to the session scratchpad with
`rsync -a --exclude .git --exclude node_modules --exclude .claude/worktrees`, re-initialised as
its own git repository (`git init`, one commit, `git status --porcelain` empty, 42 tracked
`*.test.ts`), `node_modules` symlinked. **`vitest.config.ts` in THIS repository was never
edited** — `A5`'s numstat in the gates note is the proof. Every round rewrote the copy's config
from the saved original and asserted `git status --porcelain` EMPTY afterwards; the final check
was EMPTY.

| round | one type-valid change in the COPY | `vitest list --filesOnly` (root) | instrument | lint / typecheck / build |
|---|---|---|---|---|
| base | none | 42 | exit 0, `42 … git tracks 42. No findings.` | — |
| **M1 (`A1`)** | `exclude` += `"**/glyph-mode.nfr.test.ts"` | **41** | **exit 1** — `Tracked by git but NOT collected by the lane: src/glyph-mode.nfr.test.ts — a test.exclude glob in vitest.config.ts is dropping it.` | **0 / 0 / 0** — three green readings, the instrument is the only thing that saw it |
| M2 pre | throwaway checkout planted at `.claude/worktrees/probe/` (42 `*.test.ts`, a copy of `src/`); config untouched | 42 | exit 0 — the real glob does its job | — |
| **M2 (`A2`)** | `".claude/**"` → `".cluade/**"` | **84** | **exit 1** — `The lane collects 84 test files; git tracks 42.` then 42 lines, each `Collected by the lane but NOT tracked by git: .claude/worktrees/probe/src/<file>.test.ts — git add it, delete it, or repair the test.exclude glob that let it in.` | **0 / 0 / 0** |
| M2 post | typo kept, checkout removed | 42 | exit 0 | — |
| **M3 (`A3`)** | untracked `src/zz-abc118-throwaway.test.ts` planted | 43 | **exit 1** — `Collected by the lane but NOT tracked by git: src/zz-abc118-throwaway.test.ts …` | — |
| M3 after `git add` | the expectation edited (index) | 43 | **exit 0** — `43 … git tracks 43.` | — |
| **M4 (`A4`)** | `exclude` += `"**/tools/**"`, `"**/lane-inventory*"` — globs aimed at the guard | 42 | **exit 0, still runs, still 42/42** — an `exclude` entry cannot reach a file vitest does not collect | — |
| M5 (control) | stock `"**/node_modules/**"` removed | 42 | exit 0 — **not a catch**: `node_modules` is a symlink in the copy and vitest's collector did not descend it, so nothing was there to inflate. Recorded so it is not read as coverage of that edit | — |

## `A2`'s two required statements

- **Collected count both ways at this hop: 42 → 84** (typo + planted checkout), **84 → 42** when
  the checkout was removed with the typo still in place — the inflation is observable only while
  a checkout is live, exactly as the ticket says.
- **A live checkout under `.claude/worktrees/` IS present in this repository at delivery:**
  `git worktree list` shows `.claude/worktrees/residual-gqe115-3` (`281807f`) plus 24 agent
  worktrees (this hop's own among them), every one a full checkout with 42 `*.test.ts`. The
  probe did not run against any of them (`## Out of scope`: measure, do not touch); the copy
  excluded `.claude/worktrees` and a throwaway checkout was created and removed inside the copy
  instead, as `A2` prescribes. In this repository, the typo would take `npm test` from 42 to
  roughly 42 × 26 files; not run, and the number is arithmetic, not a measurement.

## What `A4`'s sentence becomes for this placement

The ticket requires, for an in-lane guard, the sentence "a glob naming the guard file itself
removes the guard silently". **The guard is not in the lane, and `M4` is the runnable
demonstration that a glob naming it changes nothing.** The hole that replaces it is in the
decision note: the four mandatory gates stay green under `M1` and `M2`; only the fifth step, run
by hand or by the gate runner, goes red.
