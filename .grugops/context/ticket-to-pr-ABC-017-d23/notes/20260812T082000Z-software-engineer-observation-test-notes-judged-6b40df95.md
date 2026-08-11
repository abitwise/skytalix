---
id: 20260812T082000Z-software-engineer-observation-test-notes-judged-6b40df95
kind: observation
by: software-engineer
at: 2026-08-12T08:20:00Z
verified_by:
confidence: high
refs:
  - ticket-to-pr-ABC-017-d23
  - ABC-017
  - ABC-027
  - src/history-pane.test.ts
  - src/history-pane.nfr.test.ts
  - plans/tickets/ABC-017-bounded-move-history-pane.md
  - 20260812T041000Z-ba-pm-decision-a3-struck-4f19c2ab
supersedes:
---

# The four `## Test notes` items, judged one at a time — three taken, one kept and here is why

> Hand-authored; `scripts/context-io.ts` is absent here and in the kit. **Not a `finding`.**

BA/PM put these in `## Test notes` rather than making them criteria, so none of them is an
obligation. Each was judged against one question: **is this in the code I touch, and does acting on
it lose coverage?**

## TAKEN — `A1`'s `= 8` tripwire is now its own `it`

The ticket states this one as an imperative (*"Put the `= 8` tripwire in its own `it`"*) and it is
the exact shape `A13` was split for last hop. On a self-consistent 9-row build the delivered form
reported only *"expected 9 to be 8"* and the row-count requirement was never evaluated. Two `it`s
now; both report.

## TAKEN — `A3`'s two `not.toContain` rows, deleted as the assertions of a STRUCK clause

D22 struck *"the pane contains neither `e4 e5` nor `Nf3 Nc6`"* from `A3` at the previous hop. The
delivered test still asserted it in the whole-row form. **A test asserting a clause the ticket no
longer carries is not a judgment call** — the criterion moved and the test had to follow. The
comment above them, which described the deleted clause, went with them.

## TAKEN — `A3`'s and `A4`'s `numbersOf`, deleted as strictly implied

Both sit below an exact-list `toEqual` **in the same `it`** that pins all eight rows including their
numbers, so neither can ever be the assertion that reports. The ticket's words are *"a later reader
will mistake them for protection — which is the whole of D22. Delete them or move them."*

## KEPT — `A6`'s `not.toContain(1)`, and the ticket's own wording says why

The sweep note names it precisely: *"`A6`'s `not.toContain(1)` on the **third** anchor (its
`numbersOf` is pinned exactly two lines above)"*. **Only the third anchor's is implied.** The
delivered code is one loop covering all three anchors, and `A6` pins only `fromStart[0]` and
`fromWhite.slice(0, 3)` — so on the first two anchors the clause is falsifiable in isolation and
live. Deleting the loop would lose real coverage; narrowing it to two anchors would make the test
stop matching the criterion, which says *"in none of the three"*. **Left as delivered.**

## KEPT — `A2`'s 300-vs-0 test and `A11`'s `<= 2 x HISTORY_ROWS`

The ticket directs both: `A2`'s is *"redundant rather than vacuous … left alone"* and `A11`'s is
*"decorative rather than wrong … bound the MEASURED count if it is ever touched"*. `A11` lives in
`src/history-pane.nfr.test.ts`, which this hop does not touch at all.

## The `HISTORY_COLS` boundary — I AGREE with the restraint, and add one point

`HISTORY_COLS` stays at **21** and `src/history-pane.ts` is byte-identical. I did not widen it, and
I do not disagree with the principle that a restraint taken for `ABC-027`'s benefit cannot be
guarded by a criterion on this ticket.

One measured point for whoever homes the invariant, offered and **not acted on**: `A2` asserts
`expect(row).toHaveLength(HISTORY_COLS)` against the pane's **own export**, so the guard is a
self-comparison in the same sense `A11`'s `<= 2 x HISTORY_ROWS` is. That is BA/PM's own exposure,
restated only to note that it is the *same shape* as an item already in `## Test notes` — which may
be useful when Architect/Design decides where a cross-ticket invariant with no home belongs.
**Nothing here proposes widening it.**
