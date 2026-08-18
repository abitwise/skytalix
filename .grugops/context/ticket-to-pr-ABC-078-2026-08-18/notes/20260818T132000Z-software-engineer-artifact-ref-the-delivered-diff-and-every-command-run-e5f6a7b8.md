---
id: 20260818T132000Z-software-engineer-artifact-ref-the-delivered-diff-and-every-command-run-e5f6a7b8
kind: artifact-ref
by: software-engineer
at: 2026-08-18T13:20:00Z
verified_by:
confidence: high
refs:
  - ABC-078
  - src/engine.ts
  - src/engine.test.ts
  - src/turn-loop.ts
  - AGENTS.md
  - plans/traceability.md
supersedes:
---

# The delivered diff, the gate run on the branch tip, and the numbers exactly as they came back

## Branch and base

`grugops/abc078-iterative-deepening-engine-seam`, off `main` at **`3054ee0`**.

**Base deviation, recorded rather than hidden:** the subtask brief names `main @ 16e9269`. By the
time the branch was cut, `main` had advanced by one commit — `3054ee0`, the Orchestrator's own
board-and-queue bookkeeping for this wave, which touches **no file under `src/`**. The branch is
based on `3054ee0` so that this ticket's queue claim is a clean rename of the file that commit
created. `16e9269` is an ancestor of the base; nothing else differs.

## Files

| file | change | lines |
|---|---|---|
| `src/engine.ts` | **ADDED — the only production file in the diff** | 278 |
| `src/engine.test.ts` | ADDED | 558 |
| `AGENTS.md` | the `ENGINE_DEEP=1` lane command, with its RUN evidence | +9 |
| `plans/traceability.md` | `ABC-078` row updated in place, 4 cells, 10 columns re-asserted | +4/−1 |
| `.grugops/queue/…` | the claim: `pending/` → `claimed/abc078-…/`, a rename | — |

**`src/turn-loop.ts` IS BYTE-IDENTICAL (`A6`), and it is verified two ways rather than asserted:**
`git diff --stat 3054ee0 -- src/turn-loop.ts` is EMPTY, and `git hash-object src/turn-loop.ts` ==
`git rev-parse 3054ee0:src/turn-loop.ts` == `9334daf1d2c2242e2071830c491e3b7f86a16a79`.

**`plans/board.md` was NOT opened.** The `In Development` → `In Review` column move is the
Orchestrator's on this project — the ticket page says so and every recent engineer note says so.

## The public surface

`src/engine.ts` exports exactly four names: `chooseMove(position, options)`,
`createEngine(options): EngineSeam`, `DEFAULT_BUDGET_MS = 3_000`, `NODES_PER_CLOCK_CHECK = 1024`,
plus the types `Clock`, `EngineOptions`, `EngineChoice`. `EngineOptions` is `{ budgetMs: number;
now?: Clock }` — **a time budget, required, and no depth anything.**

## Every command run on the branch tip, and what it returned

| command | result |
|---|---|
| `npx vitest run --exclude '**/node_modules/**' --exclude '.claude/**'` | **exit 0 — 36 files, 1 016 tests passed, 0 skipped**, 2.22 s |
| the same with `--reporter=json` piped to `jq '.numPendingTests + .numTodoTests'` | **0** |
| `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **`No findings.`, exit 0** |
| `npm run typecheck` | **exit 0** |
| `npm run build` | **exit 0** |
| `npx biome check src tools spike vitest.config.ts` | **exit 0 — 61 files, no fixes applied** |
| `ENGINE_DEEP=1 npx vitest run src/engine.test.ts` | **exit 0 — 23 tests**, 98.7 s |
| `PERFT_DEEP=1 npx vitest run --exclude … src/perft.test.ts` | **exit 0 — 32/32**, 37.6 s |
| `SEARCH_DEEP=1 npx vitest run --exclude … src/search.test.ts` | **exit 0 — 41/41**, 22.5 s |

**TWO of those commands are NOT the ones `AGENTS.md` records, and the substitution is deliberate
and is its own note** — `npm test` and `npm run lint` are both unusable in this working copy today
for a reason that has nothing to do with this ticket. See the `observation` note on the working
copy in this same folder before quoting or repeating either line. **Nothing was skipped and no
gate was softened: every mandatory gate (`lint`, `typecheck`, `unit`, `build`) RAN and every one
came back green** — three of them by their recorded command and `lint`/`unit` by a scoped
equivalent whose scope is exactly this repository's own files.

**NOT merged and NOT deployed.** The Orchestrator holds the merge and re-runs the gate on `main`.
