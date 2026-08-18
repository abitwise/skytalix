---
id: 20260818T131500Z-software-engineer-claim-a1-honoured-to-the-budgets-granularity-not-literally-d4e5f6a7
kind: claim
by: software-engineer
at: 2026-08-18T13:15:00Z
verified_by:
confidence: high
refs:
  - ABC-078
  - NFR-004
  - NFR-005
  - ABC-074
  - ABC-079
  - ABC-080
  - ABC-081
  - src/engine.test.ts
supersedes:
---

# `A1`'s 3 s clause holds to the budget's GRANULARITY and not literally — 29 of 30 calls returned at 3 000 ms + 27 ms or less, and I did not add a safety margin to make the sentence true

## The measurement

`ENGINE_DEEP=1 npx vitest run src/engine.test.ts` at the branch tip, Apple M3 (Mac15,13), 30
positions (the six standing benchmark roots plus the first four legal children of each — opening
via `startpos`, middlegame via `kiwipete` and `position-4/5/6`, endgame via `position-3`), budget
`DEFAULT_BUDGET_MS` = 3 000 ms, real `Date.now`:

- **0 of 30 over the 5 s hard ceiling.** Worst case **3 027 ms**, `position-4/f3d4`, completed
  depth 4. The ceiling has ~1.65x of margin.
- **29 of 30 over 3 000 ms**, every one of them by the abort granularity: **+27 ms worst case,
  0.9% of the budget.** Not by an iteration — an iteration at these depths costs hundreds of
  milliseconds to seconds.

## Why the number is 3 027 and not 2 998

Iterative deepening spends its whole budget by construction: it keeps deepening while the clock
says there is time, so the last iteration is always aborted AT the deadline rather than before
it. What is left over is the abort granularity — up to `NODES_PER_CLOCK_CHECK` (1 024) nodes
between clock consultations, plus the stack unwinding, plus the final `now()` read.

## What I did NOT do, and why it is being escalated rather than absorbed

**I did not make the engine stop early.** Aiming at `deadline - margin` would make the sentence
"returns in ≤ 3 s" true and would silently redefine what `budgetMs` means — an unrequested
behaviour change (coding rule 5 and 7) that no criterion asks for, on the module whose entire
subject is that the budget is honest. `A2` frames overrun tolerance explicitly (**≤ 2x** the
budget); `A1` says ≤ 3 s. Reading them together, the delivered behaviour is what the ticket
describes; reading `A1`'s clause in isolation and literally, it is not met on 29 of 30 calls.

**The test asserts the 5 s ceiling and PRINTS the 3 s count.** It does not assert 3 000 ms — a
green that depended on a margin I invented would be the expensive kind of green.

**Three remedies exist and all three are somebody else's call.** (a) the caller passes a budget
below the promise — `EPIC-006` owns the choosing, and 2 900 ms would put every one of these 30
calls under 3 s with 100 ms to spare; (b) `NODES_PER_CLOCK_CHECK` drops to 256, which cuts the
overshoot ~4x and adds clock reads to every search; (c) `NFR-004`'s row is read as
budget-plus-granularity, which is Architect/Design's to rule. I am not choosing between them.

## `NFR-005` — reported, not ruled, and it is BELOW the FAIL floor

Same lane, same machine, 3 s budget:

| position | completed depth | nodes | wall |
|---|---|---|---|
| `kiwipete` | **4** | 81 968 | 3 005 ms |
| `position-6` | **3** | 101 422 | 3 025 ms |

`NFR-005`'s row asks for **≥ depth 6 within the 3 s budget (below depth 6 = FAIL)** and depth 7
as a WARN level. **Measured: depth 4 and depth 3.** Reported as a measurement exactly as the
subtask brief directs — I do not rule the level and I did not touch `plans/nfr-catalog.md`.

**What it is NOT evidence of.** It is not evidence that the row's target is wrong, and it is not
evidence that this ticket is defective: the search this budget is spent on has **no move
ordering (`ABC-080`), no quiescence (`ABC-079`) and no transposition table (`ABC-081`)** — all
three unbuilt, and move ordering alone is conventionally worth several plies at a fixed budget.
`ABC-078` is the first hop at which the row is measurable at all, which is precisely what its own
`Security / NFR triggers` section predicted.

**The depth-7 level stays PROVISIONAL** and the off-machine generalisation is `ABC-074`'s, which
is `Blocked` for want of a non-M3 machine. **Every number in this note is true of Apple M3
(Mac15,13) and of nothing else.**
