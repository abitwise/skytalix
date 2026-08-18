---
id: 20260819T191000Z-software-engineer-observation-ten-mutants-and-the-two-guards-that-were-blind-9c3d4e5f
kind: observation
by: software-engineer
at: 2026-08-19T19:10:00Z
verified_by:
confidence: high
refs:
  - ABC-043
  - ABC-042
  - ABC-037
  - src/cli.test.ts
supersedes:
---

# Ten mutants, ten dead — and the TWO guards that were blind until one of them ran

Every mutant below was applied to the delivered tree, run, and reverted. The rule the brief sets is
the one that found both defects: **mutate every guard before you believe it.**

## The mutants

| # | the mutant, as a diff | rows it killed |
|---|---|---|
| `M1` | `const INTERNAL_ERROR_EXIT_CODE = 70;` → `= 0;` | `A3`, `A4`, and the numbers transcription — **3** |
| `M2` | `const INTERNAL_ERROR = "…not a chess outcome";` → `= "the game ended in a draw";` | `A3`, `A4`, `ABC-066` `A1/A2/A3` — **3** |
| `M3` | `process.exitCode = outcome.exitCode;` → `= 1;` | **10**, including `A2`, `A4`, `A5` |
| `M4` | the seam bound to a name and **awaited** before the loop: `const seam = createLineInputSeam(…); await seam(newGame(START_FEN));` | `G6`, `A1`, `A2`, `A3`, `A6`, `A7`, `ABC-042` `A4` — **7** |
| `M4b` | the same, **unawaited** (`void seam(…)`) — the true `G6` violation | `G6`, `A1`, `A2`, `A6`, `ABC-042` `A4` — **5** |
| `M5` | `humanColour: colour` → `humanColour: "white"` | `A1`, `A5`, `A7`, `ABC-064` `A3` — **4** |
| `M6`/`M7` | `import { beginFrameSession } from "./frame.ts";` plus `beginFrameSession(sink, 23)([]);` after `sink` | `A6`, the `A8`/`A6` structural row, `ABC-042` `A4` — and, **after the repair below**, the numbers transcription — **4** |
| `M8` | `engine: createEngine({ budgetMs: DEFAULT_BUDGET_MS })` → `engine: async (game) => legalMoves(game.position)[0] as never` (a placeholder opponent, `ADR-0013`) | `A1`, `A2`, `A5`, `A7` — **4** |
| `M9` | test-side: the foreign-move double made LEGAL (`captured: 1` dropped) | `A5` — **1**. This is what proves the fault is really injected rather than the row passing on an unfaulted child. |
| `M10` | test-side: the opponent scripted `b8c6` instead of `d8h4`, so it never mates | `A2` — **1**. Same purpose, for the scripted game. |

## Guard defect 1 — the row-count transcription's template blanker was BLIND, and it shipped green

`ABC-042`'s `numbersIn` blanks string literals before scanning for numbers. Its template-literal
expression could not match a literal containing an interpolation **at all**, so with **two** such
literals in one module the regex matched from the CLOSING backtick of the first to the OPENING
backtick of the second and blanked **every line between them**.

**MEASURED:** with `M6`/`M7`'s deliberate `beginFrameSession(sink, 23)` planted in exactly that gap,
`A8 — neither delivered module names a row count` stayed **GREEN**. The `23` had been erased before
the scan ran. `ABC-042` shipped with one interpolated literal, so the hole could not open until
`ABC-043` added the crash line's — **this is not `ABC-042`'s defect showing up late, it is a latent
hole my diff opened**, and it was invisible to everything except a planted mutant.

Repaired in place: match to the next unescaped backtick. The same planted `23` reds the row now,
verified twice (once inside `M6`/`M7`, once with a standalone `const unused = 23;`).

## Guard defect 2 — a hung child had no bound, and `G6`'s failure mode is exactly a hang

`G6` says two overlapping `seam()` calls orphan the first read forever. **MEASURED at this hop, on
`M4b` run outside the suite:** the product wrote **501 bytes** and then never exited — killed after
8 s, with stdin already at EOF. A suite whose `spawnSync` has no `timeout` waits for that for as long
as anyone lets it, and a stalled lane is a worse diagnostic than any red row.

`childOf` now spawns with `timeout: 30_000`. `spawnSync` then returns an `ETIMEDOUT` error and the
helper's existing "a child that never started says so loudly" throw names it. **WATCHED GOING RED**
at a temporary 1 ms bound: `Error: child npm failed to start: Error: spawnSync npm ETIMEDOUT`. The
bound is two orders of magnitude above the 64-72 ms a child costs here — it is not a performance
assertion and must never be read as one.

**A caveat recorded honestly:** under `spawnSync` with a piped, immediately-closed stdin, `M4b` did
NOT hang — it reds on the structural `G6` row in ~2 s. The hang reproduces on a real invocation
(`node src/cli.ts < /dev/null`). So the timeout is insurance against a shape this suite has not
reproduced, and the structural row is what actually stands between the product and `G6`.

## What this means for the next hop

Both defects were in **instruments**, not in the product, and neither was reachable by reading. If
`ABC-042`'s numbers row had been trusted, `A6`'s "no numeric row-count literal in the diff" would
have been asserted by a guard that could not see one.
