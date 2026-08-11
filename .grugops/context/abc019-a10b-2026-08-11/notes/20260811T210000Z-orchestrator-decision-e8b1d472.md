---
id: 20260811T210000Z-orchestrator-decision-e8b1d472
kind: decision
by: orchestrator
at: 2026-08-11T21:00:00Z
verified_by:
confidence: high
refs:
  - ABC-016
  - ABC-019
  - ABC-027
  - ADR-0010
supersedes:
---

# `ABC-019` back to `In Development` for `A10b` — one guard, and it is the only production line owed

> **Hand-authored.** `scripts/context-io.ts` does not exist in this repo or the kit, and
> `mcp__grugops__propose_note` is not in this session's tools. **Nothing here is a `finding`.**
> Written BEFORE the subtask that references it.

## Verified, not accepted

| claim | how | result |
|---|---|---|
| `src/` untouched | `git diff --name-only` over its commit | empty; `turn-loop.ts` md5 still `c92a1776…` |
| `G-6` ruled by a type | read `src/gameend.ts:40-45` and `:57-69` | **confirmed** — `EndReason` is exactly five values and the terminal arm requires it |
| criteria grew, none lost | ticket | 23 → 27, `A1`–`A20` with seven sub-lettered, **none renumbered or deleted** |

## The ruling worth reading twice

**`G-6` was settled by a type, not a preference.** The render seam takes a `GameStatus`; its terminal
arm requires `reason: EndReason`, and `EndReason` is exactly five values. `engine-threw`,
`engine-failure` and `resignation` live in the loop's `TerminalReason` and in **no** `GameStatus`. So
on transitions 12, 13 and the prompt path a terminal frame is **not constructible** without editing
`src/gameend.ts` — which `A14` forbids.

BA/PM did not dismiss QE's player-visible reading; it ruled that reading **correct and owed by
`EPIC-006`'s result screen**, and handed the residue on as a flag. That is the right shape: the
disagreement was real, and it resolved into "both are right about different layers" rather than one
side losing.

## `G-4` is the only thing that moves the board

`A10b`: the loop must guard the **input** seam's move too, and **throw**. `A10` had guarded only the
engine seam, so the delivered loop plays a foreign move from the input seam and corrupts the board.

The ruling declines three cheaper options with reasons: no tenth `A14` value, `engine-failure` not
reused, and `rejected` rejected because **a `{kind:"move"}` that is not legal is a parser bug, not a
typo**. Cost is one membership check over a comparison already present at `src/turn-loop.ts:264-272`,
plus a throw, plus one test row. **No new file, so `N8-LANE` does not move.**

Its decisive input was the owner's 2026-07-31 standing directive — *rules-correctness beats
features* — which has now overturned a BA/PM ruling on this ticket twice.

## `A20` is written RED on purpose

`ADR-0010`'s narrowing criterion is in, and it **states in its own words that it cannot be satisfied
until `ABC-027` merges**, because clause 1's production change lives in `src/frame.ts`, which this
ticket does not open. Red by design now, green after the rebase, at **zero production lines here**.
It rides with `ADR-0009` cl. 9f's re-gate rather than becoming a separate hop.

The prohibition is written in too, with its measured reasons and the honest cost of rejecting `F4`.
Neither ADR was re-opened.

## A divergence recorded rather than smoothed

BA/PM's `G-4` residue FEN differs from QE's. It diagnosed the cause — different hand-coded `Move`
field codes, not different loop behaviour — and stated that every load-bearing fact agrees. **It
published the disagreement instead of quietly adopting its own.**

## My defect, caught a second time

BA/PM independently found the dangling `parent_ref` — `.grugops/context/abc019-qe-gaps-2026-08-11/`
did not exist when its brief was written. **That is the second role to catch the same defect**, and
this one could not have seen my fix: I created the folders after its worktree was rebased.

Its framing is the useful part: *"routing was fully recoverable from `plans/board.md` … but a brief
naming an unreadable `parent_ref` is how a later role invents context or stalls."* The failure was
survivable **because the board header carries the reasoning** — which is an argument for the board
discipline, not an excuse for the defect. The standing correction is already in force: this note was
written before the subtask that references it.

## Sizing caution I am carrying forward

`L` and `P0` are re-derived a **fourth** time and unmoved, and BA/PM recorded a caution I am adopting:
**a fifth hop adding production scope beyond one guard must re-derive against `SPLIT_REQUIRED` rather
than by precedent.** Four unmoved re-derivations is exactly how a ticket drifts past its size without
anyone deciding to let it.

## Board

`In Review` → `In Development`. In Review 2/3 → **1/3** (`ABC-027`), In Development 1/3 → **2/3**
(`ABC-016`, `ABC-019`). Third backward move for this ticket-set; correct, because `A10b` is unbuilt
production code and `A5b`/`A6`/`A8b`/`A9b`(iv)/`A11`/rows 15–17 are unwritten tests.
