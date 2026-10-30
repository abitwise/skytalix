---
id: 20261030T123301Z-software-engineer-observation-a76bc514
kind: observation
by: software-engineer
at: 2026-10-30T12:33:01Z
verified_by: 
confidence: medium: the A14 bound is unreadable as written under ABC-173 C2; the reading is mine and needs QE/Architect
refs:
  - se-ABC-220
  - ABC-220
  - EPIC-009
  - ADR-0052
  - grugops/ABC-220
  - 68ba364c
  - 8e1cdda5
  - ABC-173
  - ABC-119
  - ABC-168
  - NFR-011
  - AR-NFR004-A
  - src/uci.real-engine.test.ts
supersedes: 
seal: sha256:492c1b4a0505d9c67869a72ec7bf28dc1d9ebebc23dfce8ae19dcb08096e4c56
---

# Software Engineer observation, se-ABC-220: risks and what the next roles need

## F1 (medium): A14's "readyok ≤ 100 ms after bestmove" cannot be read in the lane it is written for
`ABC-173` `C2` (its row lives in `src/cli.test.ts`) bars every asynchronous `child_process` form in `src/**/*.test.ts`. A `spawnSync` child hands its whole stdout over at exit, so the lane has no per-line time. That is the same reason `ABC-168` left its `A6` latencies out.
- **What the A14 rows read:** exactly 2 `readyok`. The busy one is the line directly after the single `bestmove`, and it is the last line. No line is lost (the `TimeMode` line, `uciok` and an `info depth` line are present, and nothing is refused). The `bestmove` is legal. Spawn to exit is ≥ 2 000 ms, which shows the search ran. M4 holds, and the exit is 0 with empty stderr.
- **What they cannot read:** "isready 100 ms later" and "≤ 100 ms after bestmove". The whole script is written at spawn, so `isready` reaches the child during the search, not 100 ms later.
- **What QE needs:** a reading outside vitest, for example a scratch driver with an asynchronous spawn and a timestamp per line. Or the Architect re-words A14's bound to what the lane can see.

## F2 (low): D5's bound is "22 s read to the whole second"
One budget plus the overshoot is 22 000 + ≤ ~31 ms. The header sentence states that. Security/NFR's accepted-risk entry beside `NFR-011` should use the same reading.

## F3 (low): AGENTS.md has no command for the new A11 lane
The Scribe adds the `TimeMode` line to the UCI notes at merge (Test notes 4). The lane command QE uses is `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 ./node_modules/.bin/vitest run src/uci-session.test.ts`. The suite's `A3` row in `src/cli.test.ts` checks the heap flag on every vitest command AGENTS.md spells, so the Scribe should copy that flag.

## F4 (info): shared file
`se-ABC-241` may also touch `src/uci-session.ts`. This build touched the header, a constants block, `parseGo`'s budget block and signature, `go`'s cap and blunder lines, `setOption` and the `uci` case. Whichever branch merges second rebases.

## What QE needs
- A11 (`ENGINE_DEEP=1`, ALONE, ~2 min): record the max wall and its excess over 22 000 ms against `AR-NFR004-A`.
- A14 (`UCI_DEEP=1`), plus F1's latency reading.
- A12's `npm test` wall, ALONE: ≤ 10 s at load1 ≤ 8.
- A8's `git diff 8e1cdda5..` check: `src/engine.ts` and `src/levels.ts` are untouched, which `git diff --stat` shows.
- UAT is owed (production lines change). The QE verdict signs it.

## What Security/NFR needs
- `NFR-004`: the amended text, "22 s in UCI `TimeMode` `simple-tournament` (budget 22 s)". The clamp stays 32 000. Re-read `AR-NFR004-A` at 22 s.
- The accepted-risk entry for a busy `isready`/`stop` beside `NFR-011`.
- ASVS L1: one option, matched exactly against a frozen tuple, with its echo through `printableOf` (an A10 row pins the control-character drop). No new input class: a negative or huge `wtime` lands on C's floor of 1 or on T.
