---
id: 20260813T112448Z-software-engineer-decision-a4cf9b23
kind: decision
by: software-engineer
at: 2026-08-13T11:24:48Z
verified_by:
confidence: high
refs:
  - ABC-021
  - ABC-020
  - ABC-016
  - src/turn-loop.ts
  - src/gameend.ts
supersedes:
---

# When BOTH draws are claimable, the loop claims `draws[0]` — the rules core's ratified order

> **Hand-authored**, per the sibling `decision` note. Not a `finding`.

## The gap the ticket leaves open

`ABC-021`'s acceptance names *"a reason naming a claimed threefold repetition"* and *"threefold
repetition claimed, or fifty-move claimed"*, and `DrawClaims.draws` can hold BOTH at once — a
position repeated three times whose halfmove clock has also reached 100. The stub token carries no
article, so something has to choose, and nothing on the page chooses.

## The decision, and why it is not an invention

**`claimable.draws[0]`.** `gameend.ts:53` states the order as a contract — *"NEVER empty; ordered
threefold first, then fifty-move"* — and `ABC-016`'s panel already reads it that way and states it
is *"never re-sorted"* (`status-panel.ts:169`). Taking the first is READING a ratified order, not
picking one.

The stakes are low and it is worth saying why rather than implying it: under FIDE 9.2/9.3 **either
ground draws the same game**. The result is `draw` on both; only the recorded reason differs. This
decides a label, never an outcome.

**Pinned by a test rather than by this note**: `A7` drives `6k1/5ppp/8/b7/8/8/5PPP/4R1K1 w - - 92 60`
through the shuffle, which carries the clock 92 → 100 as it makes the third occurrence, asserts
`draws` really is `["threefold-repetition", "fifty-move"]` at that ply, and asserts the loop returns
`threefold-repetition`. A build that took `draws[draws.length - 1]` is red there and green
everywhere else.

## What is deliberately NOT decided here

Which article a **player may name** — `claim fifty` versus a bare `claim` — is `ABC-035`'s grammar.
When that ticket lands, an outcome carrying the named article is an additive change to this arm
(`{ kind: "claim" }` → `{ kind: "claim"; draw?: ClaimableDraw }`), which is why the arm was left
payload-free rather than given a field nothing supplies today (AGENTS.md rule 7).
