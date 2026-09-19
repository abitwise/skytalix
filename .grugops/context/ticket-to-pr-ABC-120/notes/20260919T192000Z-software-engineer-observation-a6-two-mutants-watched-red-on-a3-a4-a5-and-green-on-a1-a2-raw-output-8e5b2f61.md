---
id: 20260919T192000Z-software-engineer-observation-a6-two-mutants-watched-red-on-a3-a4-a5-and-green-on-a1-a2-raw-output-8e5b2f61
kind: observation
by: software-engineer
at: 2026-09-19T19:20:00Z
verified_by:
confidence: high
refs:
  - ABC-120
  - ADR-0021
  - src/turn-loop.ts
  - src/turn-loop.test.ts
supersedes:
---

# `A6` — the no-re-evaluation mutant and the routed-as-command mutant, both WATCHED RED before the rows were trusted

**Not a finding.** Recorded as an `observation`; the raw vitest output is quoted, not summarised.

## Method

A copy of the tip's `src/` (plus `tools/`, `AGENTS.md`, `biome.json`, `package.json`,
`tsconfig.json`, `vitest.config.ts`, `node_modules` symlinked) was made in the session scratchpad
OUTSIDE the repository, fresh for each mutant. One string replacement was planted in the COPY's
`src/turn-loop.ts`, `npx vitest run src/turn-loop.test.ts` was run there, and the copy was
discarded. `grep -rn "MUTANT M" <worktree>/src` → no match, exit 1: **`src/` on the branch never
carried a mutant.** Harness: `scratchpad/abc120/mutants.mjs`; raw logs `logs/mutant-*.log`.

## M1 — shape (a)'s defect: `takeBack`, then `continue` WITHOUT the derive

Planted: after `messages = outcome.messages;` in the `take-back` branch, `continue; // MUTANT M1`.

```
 FAIL  src/turn-loop.test.ts > ABC-120 acceptance — transitions 17 (quit) and 18 (take-back) > A3 — `take-back` on a CLAIMABLE position: ONE derive clears the stale claim cell, and the three rewind together
AssertionError: expected { by: 'white', …(1) } to be undefined
 FAIL  src/turn-loop.test.ts > ABC-120 acceptance — transitions 17 (quit) and 18 (take-back) > A4 — `take-back` of two plies WITH a message: the message reaches the next frame and leaves with it
AssertionError: expected 5 to be 6 // Object.is equality
 ❯ src/turn-loop.test.ts:1974:27
 FAIL  src/turn-loop.test.ts > ABC-120 acceptance — transitions 17 (quit) and 18 (take-back) > A5 — `take-back` of ZERO plies at ply 0: one derive, one frame, nothing else
AssertionError: expected 1 to be 2 // Object.is equality
 ❯ src/turn-loop.test.ts:1988:27

 Test Files  1 failed (1)
      Tests  3 failed | 60 passed (63)
```

`A3` reds on `statuses[9].claimable` reading the stale `{ by: "white" }` — `ABC-046` `## Problem`'s
sentence, verbatim. `A4` and `A5` red on the derive count (5 vs 6; 1 vs 2). **`A1` and `A2` stay
green** (60 of 63 pass; the only three reds are the three take-back rows). The guard discriminates
the take-back edge from the quit edge, exactly as `A6` asks.

## M2 — `take-back` routed into the transitions-7/8/9 branch

Planted: `if (outcome.kind === "take-back") {` → `if (false) {`, so the outcome falls into
`!== "move"` → `messages = outcome.messages; continue;` — no `takeBack`, no derive.

```
 FAIL  src/turn-loop.test.ts > ABC-120 acceptance — transitions 17 (quit) and 18 (take-back) > A3 — `take-back` on a CLAIMABLE position: ONE derive clears the stale claim cell, and the three rewind together
AssertionError: expected { by: 'white', …(1) } to be undefined
 FAIL  src/turn-loop.test.ts > ABC-120 acceptance — transitions 17 (quit) and 18 (take-back) > A4 — `take-back` of two plies WITH a message: the message reaches the next frame and leaves with it
AssertionError: expected [ { from: 20, to: 52, …(4) }, …(3) ] to have a length of 2 but got 4
 ❯ src/turn-loop.test.ts:1970:27
 FAIL  src/turn-loop.test.ts > ABC-120 acceptance — transitions 17 (quit) and 18 (take-back) > A5 — `take-back` of ZERO plies at ply 0: one derive, one frame, nothing else
AssertionError: expected 1 to be 2 // Object.is equality
 ❯ src/turn-loop.test.ts:1988:27

 Test Files  1 failed (1)
      Tests  3 failed | 60 passed (63)
```

The same three rows; `A4` reds one assertion earlier (four moves on the list instead of two — the
take-back never happened). `A1`/`A2` green.

## M0 — the control: the ruled build, copied unchanged

```
 Test Files  1 passed (1)
      Tests  63 passed (63)
```

## What this does and does not establish

- Both mutants the ticket names die on exactly the rows `A6` predicts and on no other; the quit
  rows are indifferent to them. That is the whole claim.
- No other mutant was run at this hop (a `QUIT_NOTICE = INPUT_ENDED_NOTICE` build would red `A1`
  and `A2`; a `quit` that renders a frame would red `A1`'s frame count — argued from the
  assertions, NOT run). QE's hop is where the wider mutant set belongs.
