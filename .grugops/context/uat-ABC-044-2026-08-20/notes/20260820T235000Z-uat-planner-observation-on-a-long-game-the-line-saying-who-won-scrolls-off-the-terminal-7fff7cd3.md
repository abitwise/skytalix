---
id: 20260820T235000Z-uat-planner-observation-on-a-long-game-the-line-saying-who-won-scrolls-off-the-terminal-7fff7cd3
kind: observation
by: uat-planner
role: uat-planner
task: uat-ABC-044-2026-08-20
at: 2026-08-20T23:50:00Z
verified_by:
confidence: medium
refs:
  - ABC-044
  - ABC-044/A5
  - ABC-044/A6
  - EPIC-006
  - src/frame.ts
  - src/result-screen.ts
  - src/cli.ts
supersedes:
---

# On a long game at a standard terminal, the line saying WHO WON is pushed off the top by the move list under it

This is the thing QE said only a terminal could find. **It is real, the mechanism is measured, and the
one join in the argument is stated rather than glossed.**

## The arithmetic, from measurements not from the source

**The frame is 23 rows.** Measured: the pipe transcript of `1. f3 e5 2. g4 Qh4#` is **143 lines** =
6 frames × 23 + the result screen's 5 rows. (9 board + 3 status + 8 history + 2 message + 1 reserved
prompt row.) On a **24-row terminal that leaves exactly one spare row.**

The result screen is written straight after the final frame with **no session, no cursor control and no
pagination of its own.** That is `A6` working as specified, not a defect in the delivery. The terminal
therefore scrolls, and the scroll takes the top of the output with it.

## Measured on a real pty, same 4-ply game, three window sizes

| terminal rows | move-list rows | `Black wins by checkmate.` still on screen at exit? |
|---|---|---|
| 24 | 2 | **yes**, row 20 |
| 6 | 2 | **yes**, row 2 |
| **4** | 2 | **NO.** The player is left with `1. f3 e5` / `2. g4 Qh4#` and nothing saying who won |

At 4 rows, replayed from the raw pty bytes:

```
 1|
 2|1. f3 e5
 3|2. g4 Qh4#
 4|
```

All three readings fit `headline row = rows − movelistrows − 2`. **On a 24-row terminal the outcome
line leaves the screen once the move list reaches 22 rows — a 43-ply game.**

## The game length, also measured on a real pty

A **44-ply** game was played out on the 24×80 pty (a scripted player working through a pool of
candidate moves; it reached move 23 with White in check). **Its move list is 22 rows** — over the
threshold. The same scripted input produced the identical 44 plies on a second run, so the engine is
reproducible on this machine.

## What is NOT established, said plainly

**The mechanism and the game length were each measured on a real terminal, and never in the same run.**
Driving a ≥43-ply game to a *terminal outcome* was attempted three times and failed each time — the
scripted player ran out of legal candidate moves while in check, the input ended, and the product
correctly produced **no** result screen. So the full-scale confirmation is **`UNKNOWN - verify`**, and
the 4-row demonstration is a **proxy for the mechanism, labelled as a proxy**. Confidence on this note
is `medium` for that reason, and it is deliberately not the `high` the other observation notes carry.

## What this is and is not

- **It is not a defect in the delivered diff.** `A6` asks for one write, after the final frame, zero
  CSI of its own, and the product does exactly that on both channels.
- **It is not covered by any acceptance criterion of `ABC-044`.** No criterion mentions the terminal
  height, and `A5` is about the move list being complete, which it is.
- **It is a gap in what was asked for**, which makes it the owner's question and not a quiet ticket
  filed behind his back. It is `Q6` on `plans/uat/ABC-044-signoff-checklist.md`, and "not until there
  is a ticket for it" is a legitimate answer to that question.
- **This role cut no ticket for it.** Cutting is BA/PM's at the Orchestrator's routing, and a ticket
  cut before the owner has been asked would pre-empt the answer.

## Standing

Unstamped `observation`, hand-authored, `confidence: medium` for the un-joined half. One machine only.
Not a human's acceptance of anything.
