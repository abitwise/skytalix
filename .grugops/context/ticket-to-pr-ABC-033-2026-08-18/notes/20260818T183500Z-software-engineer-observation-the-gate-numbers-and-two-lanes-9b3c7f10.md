---
id: 20260818T183500Z-software-engineer-observation-the-gate-numbers-and-two-lanes-9b3c7f10
kind: observation
by: software-engineer
at: 2026-08-18T18:35:00Z
verified_by:
confidence: high
refs:
  - ABC-033
  - ABC-050
  - NFR-008
  - vitest.config.ts
supersedes:
---

# The blocking gate on the branch tip `e2bed3e` — every number as it ran

Run inside a dedicated git worktree checked out on `grugops/abc033-one-prompt-both-formats`, so the
lane contains this repository and nothing else. See the separate observation about why that worktree
exists.

| step | command | result |
|---|---|---|
| test | `npx vitest run` | **36 files, 1039 tests, all passed**, 0 failed |
| skip count | `npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | **0** |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **`No findings.`**, exit **0** |
| lint | `npm run lint` (`biome check .`) | **64 files checked, clean**, exit **0** |
| typecheck | `npm run typecheck` (`tsc --noEmit`) | clean, exit **0** |
| build | `npm run build` (`tsc --noEmit`) | clean, exit **0** |
| deep perft | `PERFT_DEEP=1 npx vitest run src/perft.test.ts` | **32/32 passed**, 39.19 s |

`SEARCH_DEEP=1` was NOT run: this branch changes nothing under `src/search.ts`, and `AGENTS.md`
names that lane's trigger as the QE hop and any change to that file.

## The default lane in the SHARED checkout is a different number, and it is the known defect

Run from the repository root, where five other agents' worktrees live under `.claude/worktrees/`,
`npm test` reports **246 files / 7033 tests** and `npm run lint` **exits non-zero** — on nested
`biome.json` files inside those worktrees, and on a formatting diff in `src/engine.ts`, an untracked
file belonging to the concurrently-running `ABC-078` hop. **Neither failure is this branch's**, and
neither is new: it is the `vitest.config.ts`-has-no-`exclude` defect the Orchestrator measured on
2026-08-18 (`.grugops/context/pull-next-wave-2026-08-18/notes/…-6c5f2ab1.md`, routed to `ABC-050`).
The contained figure — 36 files / 1039 tests — is the one that describes this branch, and it is
consistent with that note's 35 / 999 for `main` plus this ticket's one file and 40 tests.

## Lane cost, honestly bounded

The new test file's own reported time is **11 ms of test execution** (`src/move-input.test.ts`, 40
tests). The `N8-LANE` bar is ≤ 650 ms CPU and the ticket's projection was ≈ 160 ms for one added
file. **The paired-delta protocol (n >= 7 interleaved rounds, identity null control) was NOT run** —
what is recorded here is the runner's own per-file figure, which is two orders of magnitude inside
the bar, not a measurement conducted to `N8-LANE`'s stated method.
