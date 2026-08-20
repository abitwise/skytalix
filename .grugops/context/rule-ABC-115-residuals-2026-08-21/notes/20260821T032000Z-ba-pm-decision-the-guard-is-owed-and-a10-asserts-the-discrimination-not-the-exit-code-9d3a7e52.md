---
id: 20260821T032000Z-ba-pm-decision-the-guard-is-owed-and-a10-asserts-the-discrimination-not-the-exit-code-9d3a7e52
kind: decision
by: ba-pm
at: 2026-08-21T03:20:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - G-QE115-1
  - A10
  - A5
  - A9
  - ADR-0016
  - plans/tickets/ABC-115-piped-session-dies-on-epipe-with-the-refusal-exit-code.md
supersedes:
---

# RULED: THE GUARD IS OWED. `A10` IS WRITTEN, AND IT ASSERTS THE DISCRIMINATION — NOT THE EXIT CODE

`G-QE115-1` is **upheld**, not closed. No existing guard covers the branch (measured across all forty
files and all four gates), so the first of the subtask's four questions answers itself and the second
is the real one. **My word: a criterion is owed.**

## Why owed rather than accepted

1. **The failure it admits is this ticket's own species.** A build that writes no board and exits `0`
   is the product reporting a false status quietly — the exact thing `ABC-115` was cut to stop, at
   the more dangerous end. `1` says *something went wrong*; `0` says *the session ran*.
2. **The page already pre-registered it.** `## Risks`: *"a hop that widens the arm to every stdout
   error should say so and price it."* With no row, the widening ships green and says nothing.
3. **The precedent is on the same page, one clause over.** `A9` exists because a bare-swallow mutant
   passed every row that existed then. The **ending** clause was unasserted then; the **narrowing**
   clause is unasserted now. Refusing this row would be refusing my own 2026-08-20 reasoning.
4. **It is one row in a file already open, and ZERO production lines.** The arm already
   discriminates; `A10` only asserts that it does.

## The shape, and the part I thought hardest about

**`A10` asserts NON-ZERO status and NON-EMPTY stderr, and nothing else.** No literal `1`, no errno
name, no byte count, no stack shape. The reason is a rejected alternative worth naming: the obvious
row — *"delivered exits 1 with a stack"* — would **pin behaviour this project considers a defect**
(`1` is `USAGE_EXIT_CODE`, the very collision the ticket was cut for) and would go **red for the
wrong reason** the day someone correctly routes non-`EPIPE` to `70`. A criterion that punishes the
fix is worse than no criterion. **Non-zero and non-empty** is precisely the delivered-vs-mutant
delta, measured 5/5 and 3/3, and it survives every future ruling on that path.

## Two things handed to the repair hop so it chooses nothing at the bench

- **The instrument is measured, not suggested**: `node src/cli.ts --ascii 1</dev/null; echo
  NODE_EXIT=$?` inside the existing `childOf` `/bin/sh -c` string, zero new `spawnSync` call sites,
  **status read from `NODE_EXIT=` and never from the wrapper's own status** (the wrapper exits `0` on
  every build — the trap that would ship a row that cannot go red).
- **`A10` does NOT red against `main`.** `main` installs no arm, dies loudly, and passes `A10` by
  accident. It reds **only** against the one-token mutant, so `A5`'s watched-RED round runs against
  that mutant — the same two-round shape `A9` already carries. **Watching only `main` is not watching
  `A10` red.**
