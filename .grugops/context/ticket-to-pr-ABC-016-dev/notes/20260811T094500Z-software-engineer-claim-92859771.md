---
id: 20260811T094500Z-software-engineer-claim-92859771
kind: claim
by: software-engineer
at: 2026-08-11T09:45:00Z
verified_by:
confidence: high
refs:
  - ABC-016
  - src/san.ts
  - src/status-panel.nfr.test.ts
supersedes:
---

# `A13`'s `isInCheck` clause cannot be satisfied by any correct build. FLAGGED FOR BA/PM, NOT TAKEN

> **Hand-authored**, and a `claim` rather than a `finding` for two separate reasons: no
> `§14-gate#<id>` stamp is issuable to me, **and** an assertion that a ticket's acceptance criterion
> is defective is not gate-adjudicable in the first place — the gate can only run what the criterion
> says, not judge it. **Amendments are BA/PM's. This note asks for one; it does not make one, and no
> ticket text was edited at this hop.**

## The clause

`A13` reads, in part:

> **Given** any panel render, **when** the calls are **spied**, **then** … `isInCheck` **exactly 1**
> time, `toSan` **exactly 1** time (**0** on an empty history) …

The parenthetical carve-out for an empty history is attached to `toSan` and to nothing else.

## Why no build can reach it, and this was MEASURED rather than argued

Two of the panel's own scope items each produce an `isInCheck` call, and they are both mandatory:

1. **Item 2** requires `isInCheck(history.position)` — the check indicator. One call.
2. **Item 4** requires `toSan` of the last move. `toSan`'s suffix makes the move, asks
   `isInCheck(position)` about the side it was played against, and unmakes it —
   **`src/san.ts:101-106`, merged code this ticket does not own.** One more call.

A spy on the `isInCheck` export counts both, because `src/san.ts` imports it from the same module the
spy re-routes. Measured at this hop with a throwaway probe, since a `vi.mock` factory is the only way
to see it:

| history | `isInCheck` calls in one render |
|---|---|
| empty | **1** |
| one ply (`Nf3`) | **2** |
| four plies | **2** |
| one ply that gives check | **2** |

So the literal criterion holds on an empty history and is **unreachable from the first move onward**.
There is no implementation choice that escapes it: `toSan`'s optional `legal` parameter skips the
disambiguator's generation, not the suffix's check test, and the panel cannot skip either item.

**This is not the same class of problem as `D1`.** Nothing is being derived twice and nothing is
expensive — the second call is 0.06–0.11 µs and is SAN's own business. The defect is in the
criterion's arithmetic, not in the code it describes.

## What the test file does instead, stated plainly so nobody mistakes it for the criterion

`src/status-panel.nfr.test.ts` asserts **the panel's own call is exactly one** — it measures the
render's total, measures a bare `toSan` on the same move, and asserts the difference is 1. That is
faithful to what `A13` is *for* (the panel asks the board about check once, and never twice), it is a
real falsifiable count, and it fails on a panel that calls `isInCheck` twice itself. **It is not the
criterion as written, and I am not claiming it is.** Every other clause of `A13` is asserted exactly
as worded and passes: `gameStatusOf`, `repetitionCounts`, `keyHistory` and `gameStatus` all **0**;
`toSan` **1**, and **0** on an empty history; the 64-square scan **exactly once**.

## Three amendments that would close it. The choice is BA/PM's and I am not making it

- **(a) Attribute the count.** *"`isInCheck` exactly 1 time from the panel itself; a further call
  arrives inside the one `toSan` above and is SAN's."* Smallest edit, keeps the count a count.
- **(b) State the total honestly.** *"`isInCheck` exactly 1 time on an empty history and exactly 2
  thereafter."* Simplest to test literally; brittle if `src/san.ts` ever changes its suffix strategy,
  which would make this ticket's test go red for another module's reason.
- **(c) Drop the clause.** `toSan` **1** and the scan **once** already fail on every regression this
  criterion exists to catch — a repetition derive returning to the panel is caught by the four
  zero-counts, not by this one.

**My reading, offered and not acted on: (a).** It preserves D2's intent — a count rather than a
clock — and it is the only one of the three that stays true if `src/san.ts`'s internals move.

## What follows for the board

This is the ticket's own stop condition (*"You find a defect in the ticket's acceptance criteria.
Flag it; amendments are BA/PM's"*). I did not stop the build over it: it is one clause of one
criterion, the other thirteen criteria and the remaining clauses of `A13` are implemented and green,
and stopping would have delivered nothing while leaving the same amendment owed. **`A13` should be
recorded as NOT fully met until amended**, and `ABC-016` should not be called done on `A13` by
reading the test file's green as agreement with the criterion's text.
