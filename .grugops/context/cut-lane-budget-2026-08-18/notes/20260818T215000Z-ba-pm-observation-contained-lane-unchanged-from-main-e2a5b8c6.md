---
id: 20260818T215000Z-ba-pm-observation-contained-lane-unchanged-from-main-e2a5b8c6
kind: observation
by: ba-pm
at: 2026-08-18T21:50:00Z
verified_by:
confidence: high
refs:
  - ABC-108
  - ABC-035
  - ABC-078
  - NFR-008
supersedes:
---

# Gate: the lane is **UNCHANGED from `main`** — 1049 tests / 36 files, skip 0 — and the diff carries **0 lines under `src/`**

**This is not a stamp.** Hand-authored `observation`; no `finding` is admissible on this install.

## The measurement that matters most on this hop

```
git diff --name-only main -- src/    ->  0 files
```

**Zero files under `src/`.** This hop cut a ticket about the cost of the test lane and **added
nothing to the test lane** — which is the same discipline `ABC-108`'s own `A8` requires of the hop
that eventually builds it.

## The contained lane, run on `grugops/cut-lane-budget`

Branch `grugops/cut-lane-budget`, base `main` @ `387c9b2` **plus the Orchestrator's own enqueue
commit `e516dce`** — the branch was taken from `e516dce` rather than `387c9b2` because the subtask
brief this hop was told to read **exists only in that commit**. `e516dce` is `387c9b2`'s direct
child and carries queue files only. **Recorded rather than silently reconciled.**

| step | command | result |
|---|---|---|
| tests | `npm test` | **36 files passed / 1049 tests passed**, 2.09 s |
| skip count | `npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | **0** |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **`No findings.`**, exit 0 |
| typecheck | `npm run typecheck` | clean, exit 0 |
| lint | `npm run lint` | **64 files checked, no fixes applied**, exit 0 |

**1049 / 36 / skip 0 is exactly the figure the brief records for `main` at `387c9b2`.** Nothing
moved, in either direction.

## Two notes on containment, since this hop is about lane measurement

- **This worktree is isolated at `.claude/worktrees/agent-abbaf09ec37f588de` and contains no
  `.claude/worktrees/` of its own** (measured: 0 entries). That is why the recorded commands work
  here unmodified and why **no `--exclude '**/.claude/**'` was needed** — the gate-integrity defect
  the Orchestrator recorded against `ABC-050` (`vitest.config.ts` declares no `exclude`) cannot
  fire inside a clean worktree. **Stated, not assumed.**
- **The 2.09 s figure above is WALL time from vitest's own summary and is NOT an `NFR-008`
  reading.** It is not CPU, not a median of n = 8, has no null control and was taken on a machine
  running agent work. **It must not be quoted against the 3 s wall clause or the 13 s CPU clause**
  — quoting it would be exactly the mistake `ABC-108` exists to prevent.
