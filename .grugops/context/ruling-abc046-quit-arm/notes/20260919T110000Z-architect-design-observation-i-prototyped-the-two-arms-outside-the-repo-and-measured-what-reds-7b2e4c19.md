---
id: 20260919T110000Z-architect-design-observation-i-prototyped-the-two-arms-outside-the-repo-and-measured-what-reds-7b2e4c19
kind: observation
by: architect-design
at: 2026-09-19T11:00:00Z
verified_by:
confidence: high
refs:
  - ABC-046
  - ABC-102
  - ABC-112
  - ABC-045
  - ADR-0021
  - src/turn-loop.ts
  - src/turn-loop.test.ts
  - src/command-input.ts
  - src/command-input.test.ts
  - src/line-input.ts
  - src/result-screen.ts
supersedes:
---

# WHAT I MEASURED MYSELF — the two arms prototyped in a scratch copy OUTSIDE the repo, and what reds

**Not a finding.** `human_admission` is `off`, `scripts/context-io.ts` and `mcp__grugops__propose_note`
are absent on this install and no `§14-gate#<id>` verdict can be emitted, so this is an
`observation`. Nothing downstream may read it as verified.

**`src/` WAS NOT TOUCHED.** The prototype is a copy of `src/` plus `package.json`, `tsconfig.json`,
`biome.json`, `vitest.config.ts` and `AGENTS.md` in the session scratchpad, with `node_modules`
symlinked from the main checkout. `git status` on the design branch shows no file under `src/`
modified. The prototype is throwaway and is not delivered.

## Baseline (untouched copy)

`tsc --noEmit`: green. `vitest run --dir src`: **40 files / 1213 tests / 0 failed / 0 skipped**,
3.55 s wall. (A first run reported 5 red in `src/cli.test.ts` because `AGENTS.md` was not yet in the
scratch dir — `ABC-065` reads it; copying it in cleared them. Recorded so nobody chases it.)

## The arms, as ruled (`ADR-0021` clauses 2–4), applied to the scratch `src/turn-loop.ts`

- `PromptOutcome` gains `{ kind: "quit" }` and
  `{ kind: "take-back"; plies: number; messages: readonly string[] }`.
- `export const QUIT_NOTICE` (literal a placeholder; the arm ticket picks it).
- After the `eof` branch: `quit` → `sink.write(QUIT_NOTICE + "\n")`, return `{ null, null, 0 }`.
- Before the `!== "move"` branch: `take-back` → `takeBack(history, plies)`, `messages = ...`, fall
  through to the existing `status = gameStatusOf(history)`; the move path moves inside an `else`.

**+16 lines, 0 removed** (unified diff), before biome re-indents the wrapped block.

## Result against the EXISTING suite

`tsc --noEmit`: **green**. `vitest run --dir src`: **40 / 1213 / 0 red** — identical to baseline.
`biome check src/turn-loop.ts`: one formatting error only (my unformatted indentation), no lint rule.

**So adding the arms reddens NO existing guard.** That is the honest statement of the cost of
re-opening a mutation-tested module: the risk is not that old rows break, it is that the two new
edges are unguarded until the arm ticket writes rows for them (`ADR-0021` clause 9).

## Behaviour, proved by a throwaway scratch test (4 rows, all green on the ruled build)

Scripted seams over the real `legalMoves`; render seam records the `status` it is handed; `gameStatus`
spied the way `src/turn-loop.test.ts` spies it.

| row | script | measured |
|---|---|---|
| `new` on a claimable position | `g1f3 g8f6 f3g1 f6g8` twice (8 plies, third occurrence, human white), then `new`, then `quit` | 10 frames (1 + 8 + 1 re-emit; `quit` adds none); frame 9's `status.claimable` **defined**, frame 10's **undefined**; `moves.length` 0, `keyHistory` 1, `repetitionCounts.size` 1; derives **10** (1 + 8 + 1, none for `quit`) |
| `undo` (take-back 2) | `e2e4 e7e5 undo quit` | `moves.length` 0; 4 frames; the carried message reaches frame 4; derives **4** |
| `quit` | `board quit e2e4` | outcome `{ result: null, reason: null, exitCode: 0 }`; last write is `QUIT_NOTICE`, `INPUT_ENDED_NOTICE` absent; 2 frames (`quit` re-emits nothing); `e2e4` never read; derives **1** |
| control — `eof` | `board` | last write is `INPUT_ENDED_NOTICE`; outcome `{ null, null, 0 }` |

## The mutant, watched RED before the guard was trusted

Shape (a)'s defect re-created on the ruled build: `take-back` does `takeBack` and `continue`s
**without** re-evaluating. Result: the `new` row reds with `expected { by: 'white', … } to be
undefined` — the stale claim cell, exactly `ABC-046` `## Problem`'s sentence — and the `undo` row reds
with `expected 3 to be 4` on the derive count. The two `quit` rows stay green. **The guard
discriminates the take-back edge from the quit edge.** Restored to the ruled build afterwards.

## What this does NOT establish

- Nothing about the confirmation wrapper (`ADR-0021` clause 6) — no command-layer code was
  prototyped; the one-line `src/line-input.ts` cost is read at source (`:243`), not measured.
- Nothing about the entry point end to end — no child was spawned. `src/cli.ts` is untouched by the
  arms and `renderResultScreen` returns zero rows on `reason === null` at source (`:167`), so
  `ABC-046` `A2` is argued from the type, not run.
- No wall-clock or CPU number is claimed for the lane; `NFR-008` is `ADR-0014`'s standing breach.
