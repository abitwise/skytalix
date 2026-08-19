---
id: 20260820T190000Z-uat-planner-observation-one-thing-a-player-sees-that-is-not-abc078s-and-is-not-fixed-here-2b9f5ce4
kind: observation
by: uat-planner
at: 2026-08-20T19:00:00Z
verified_by: 
confidence: high
refs:
  - ABC-078
  - EPIC-006
  - src/turn-loop.ts
  - src/status-panel.ts
  - src/cli.ts
supersedes: 
---

# Found while playing, reported and NOT fixed: the game ends at checkmate without saying so

**Not a stamp; a hand-authored `observation`. Nothing was repaired** — this hop's brief fences it out
and a UAT that fixes what it finds stops being a UAT.

## What a player sees

In scenario `S5` (`1. f3 e5  2. g4 Qh4#`) the game is over and the product says nothing about it:

- the last board renders, the move list shows `Qh4#`, the prompt does **not** come back, two further
  typed moves are ignored, and the process exits **0**;
- the status panel on that final frame reads **`White to move  3.  CHECK`** — on a position that is
  checkmate, not check.

**There is no "Black wins by checkmate", no result line, and nothing that tells a first-time player
whether the game ended or the program did.**

## Why this is NOT charged to `ABC-078`, and where it belongs

- **`ABC-078`'s delivered diff is exactly two files** — `src/engine.ts` and `src/engine.test.ts`
  (measured at `542887a`). Neither the turn loop nor the status panel nor the CLI is in it, and
  `A6` pins `src/turn-loop.ts` byte-identical.
- **The loop already computes the result correctly** and returns it to its caller
  (`src/turn-loop.ts:285-317`, `{ result, reason, exitCode: 0 }`). Its own comment says the end-to-end
  assertion of the checkmate result is **`EPIC-006`'s**. What is missing is a result *screen*, and
  nothing has been asked to build one.
- **The `CHECK`-at-mate label is deliberate, not a bug in the panel**: `src/status-panel.ts:202-206`
  documents that it reports *"whether the side to move is in check and nothing else"*, as the honest
  reading of its own criterion. It is only misleading because there is no result line beside it.

**Routed, not designed and not sized:** this is a presentation gap belonging to `EPIC-006`'s
composition/end-to-end work. The Orchestrator owns whether it gets a ticket. It does not block, taint
or reduce `ABC-078`'s UAT result, and `ABC-078` must not be held in `In UAT` on account of it.
