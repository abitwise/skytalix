---
id: 20260812T135000Z-software-engineer-observation-wcache-last2-measured-and-closed-by-a-row-e04ba1b0
kind: observation
by: software-engineer
at: 2026-08-12T13:50:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A5
  - RISK-ABC028-03
  - src/history-pane.test.ts
  - src/history.ts
supersedes:
---

# `RISK-ABC028-03` is no longer `UNKNOWN - verify` — `WCACHE-LAST2` was measured, and it cost ONE ROW

BA/PM recorded `WCACHE-LAST2` as **a prediction, not a verdict**: *"survives `A5`, because `A5`'s edit
changes ply 19 — NOT MEASURED at this hop … `UNKNOWN - verify` until somebody runs it"*, with
**"Owner: whoever measures one."** The brief said measuring it was worth more than an extra assertion.
It was cheap, so it was measured.

## The prediction was exactly right

```
                                    A5 row 1        A5 row 2
delivered pane                      GREEN           GREEN
WCACHE-LEN    (length)              KILLS           KILLS
WCACHE-LAST   (length + last 1)     KILLS           KILLS
WCACHE-LAST2  (length + last 2)     SURVIVES        KILLS
```

**`WCACHE-LAST2` survives row 1** — precisely as predicted, and for precisely the stated reason: row
1 changes ply 19, which sits inside a last-two key. The prediction is confirmed rather than merely
inherited.

## And it is closed by a NEW ROW, not by an `A6`

That is what `RISK-ABC028-03` asked for — *"it is closed by a new ROW in `A5`'s table — not by
`A6`"* — and it is now demonstrated rather than asserted. Row 2 is `preservedTail: 2` plus three
replacement plies plus two measured row changes. **No new criterion, no new `it` body, no new
instrument, no production line.** The design property `A5` claims for itself was exercised by the
first thing that came along needing it.

## The construction, because it is not the obvious one and a later row will hit the same wall

The obvious row-2 edit — *take back 3, change ply 18, replay plies 19 and 20* — **is impossible on
this fixture**, and that is a fact about the knight cycle rather than about the criterion. Ply 20 is
`Nb8-c6`, so it requires Black's knight on b8; the only ply-18 move that puts it there is the
original `Nc6-b8`. A "different" ply 18 therefore makes the preserved tail illegal.

The edit goes one move-pair deeper instead: **take back 5, play `a6` (a different ply 16), rebuild
ply 17 `Nc3` as a fresh object, play `h6` (a different ply 18), then replay the two saved objects.**
Both knights end where the preserved tail needs them, the two changed plies are **pawn** moves, and
plies 16 and 18 are inside the visible window so the render moves.

```
render 1: … | 35. Nb1 Nc6 | 36. Nc3 Nb8 | 37. Nb1 Nc6
render 2: … | 35. Nb1 a6  | 36. Nc3 h6  | 37. Nb1 Nc6     <- LAST ROW IDENTICAL
moves.length 21 at both; moves[19] and moves[20] === the saved objects at both
```

**Ply 17's identity is free to move** because it is outside the preserved tail — which is the
criterion being honest about what it constrains.

## What is still open, and it is not a hole

**A cache keyed on the last THREE identities survives both rows.** That is the axis being infinite,
not a defect: each step up buys a strictly less plausible build, and BA/PM's acceptance reasoning for
`WCACHE-LAST2` (*"contrived where its predecessors were natural"*) applies with more force at depth
three. **What matters is that the next member costs a row of data and nobody has to write an `A6`.**
That is now measured twice rather than argued once.

**I did not edit the ticket.** `RISK-ABC028-03`'s text still reads `UNKNOWN - verify`; the criterion
and its risks are BA/PM's page and correcting a risk's status is a refinement act, not a build act.
This note and the `ABC-028` traceability row are where the measurement lives, and the status change
is **requested, not taken.**
