---
id: 20261023T215005Z-architect-design-observation-2146d8c6
kind: observation
by: architect-design
at: 2026-10-23T21:50:05Z
verified_by: 
confidence: high on the virtual-clock probe outputs (scratch tree, main 5717edec); cutechess behaviour read from source, other GUIs UNKNOWN - verify
refs:
  - ABC-212
  - EPIC-004
  - EPIC-008
  - ABC-204
  - ABC-087
  - ABC-085
  - NFR-004
  - NFR-005
  - NFR-008
  - NFR-009
  - AR-NFR004-A
  - ADR-0045
  - ADR-0044
  - ADR-0038
  - ADR-0027
  - ADR-0025
  - 5717edec
  - owner-word-2026-10-23/20261023T215000Z-orchestrator-decision-2c6fa3b1
  - bapm-cut-levels-6-7/20261023T213402Z-ba-pm-decision-44bee405
  - bapm-cut-levels-6-7/20261023T213354Z-ba-pm-observation-78d4532b
  - plans/tickets/ABC-212-two-stronger-levels-6-thinks-5-s-and-7-thinks-30-s-a-move-and-the-default-stays-5.md
  - memory-bank/50-decisions/ADR-0045-the-levels-are-re-cut-to-one-ply-and-a-halved-blunder-rate-per-step-and-the-default-moves-to-level-5-where-it-plays-as-today.md
supersedes: 
seal: sha256:30e2820001ea775aed05f0a63d226ed101588021f3be10abe371470dc8abe36f
---

# ABC-212 design probes: the clamp at 32 000 on the virtual clock, bare `go` at levels 5–7, the four unlisted ceiling readers, and cutechess's timeouts (source read)

Architect/Design, task `arch-design-ABC-212`, at `main` `5717edec`. These are light probes in the scratchpad
(`design212/head`, a `git archive` of `5717edec` with `node_modules` symlinked). They ran on the virtual clock only,
and no wall-clock figure was taken. Raw outputs: `probe-head-32000.txt`, `probe-bare-go.txt`,
`probe-bare-go-control.txt` and `scripts/bare-go.ts`.

## Default lanes with only `HARD_CEILING_MS` = 32 000
- `src/engine.test.ts`: 2 failed, 45 passed.
  - `:644` (toBe 5 000) fails.
  - `:651` fails at 35 000 > 34 500. 32 000 is not a multiple of `STEP_MS` 2 500.
- `src/levels.test.ts`: 1 failed, 28 passed. The clause-B row (`:293`–`:296`) fails.
- `src/uci-session.test.ts`: 128 of 128 passed.
- With `STEP_MS = HARD_CEILING_MS / 2` and `:644` → 32 000, the `RF-1` block is 5 of 5 green.
- With the engine clamp removed (deadline = budget), the block reds 3 rows: `:651`, the identity row and the
  `Infinity` row.

## R1 (`src/levels.test.ts:405`–`:413`) goes vacuous at 32 000
- As written (a 20 s blundering level, step 250), it is green at 32 000 both with and without the level clamp
  (`blunder(position, level.budgetMs, now)` planted).
- Refixed (budget `2 * HARD_CEILING_MS`, step `HARD_CEILING_MS / 20`):
  - the plant reds it: 68 800 > 38 400;
  - with no plant it is green, in 5 ms.

## Unlisted readers that loosen (read, not run)
- `src/levels.test.ts:601`: `A2` deep, `elapsed ≤ HARD_CEILING_MS`, "never more than 5 s".
- `:639`: the `A5` real clock, `≤ HARD_CEILING_MS`.
- `src/cli.real-engine.test.ts:408`: `A3(ii)`, the whole CLI child `≤ HARD_CEILING_MS`.
- At 32 000 each of these silently becomes a 32 s bound.
- `src/engine.test.ts:1268` `LONG_MS` moves with no effect: 6 000 nodes bind first.

## Bare `go` with `LEVELS[6]`/`[7]` added and no edit to `src/uci-session.ts`
Virtual clock, step 1 000:

| level | `go` form | searched (`info time`) |
|---|---|---:|
| 5 | `go` | 4 000 |
| 6 | `go` | 6 000 |
| 7 | `go` | 31 000 |
| 7 | `go infinite` + `stop` | 31 000 |
| 7 | `go movetime 60000` | 31 000 |
| 7 | `go movetime 1000` | 2 000 |
| 7 | `go wtime 600000 btime 600000` | 31 000 |
| 7 | `go depth 3` | depth 3, `score cp 0` |

- All rows are within `G ≤ time ≤ G + 2·step`.
- Control, with the clamp left at 5 000: level 7 `go` and `movetime 60000` gave 6 000. That is the `ABC-212` P2 plant.

## Cutechess (source read, `cutechess/cutechess` master, `projects/lib/src/chessengine.cpp` / `.h`)
- `defaultPingTimeout` = 15 000 and `defaultIdleTimeout` = 15 000. Both are scaled by `timeoutScale`.
- `ping()` is called at `endGame()` (no restart), and in `go()` only while observing. It is not called during a
  search.
- `stopThinking()` starts the idle timer and sends `stop`. On timeout, while still thinking, it kills the engine and
  forfeits with `StalledConnection`.
- `src/chessgame.cpp` has no `stopThinking()` call. Games stop through `endGame` (result, adjudication, resignation,
  claim, kill).
- Other GUIs (Arena, Banksia, En Croissant) were not read: `UNKNOWN - verify`.
