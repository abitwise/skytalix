---
id: 20260812T191500Z-ba-pm-decision-risk-abc028-03-ruled-and-no-fourth-risk-id-minted-4c2eb7d1
kind: decision
by: ba-pm
at: 2026-08-12T19:15:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A5
  - RISK-ABC028-02
  - RISK-ABC028-03
  - src/history-pane.test.ts
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
supersedes:
---

# `RISK-ABC028-03` ruled: `UNKNOWN - verify` retired, closed by a ROW — and deliberately no `RISK-ABC028-04`

> Hand-authored `decision`, deliberately **not** a `finding` — see the sibling `observation` for why
> nothing on this hop can carry a stamp.

## The status change, and why it was mine to make

The risk read *"NOT MEASURED at this hop … `UNKNOWN - verify` until somebody runs it"* with **"Owner:
whoever measures one."** The `A5` build hop measured one and **declined to change the status, because
correcting a risk is a refinement act, not a build act.** That was the right call about ownership and
it is why the correction sat waiting for this hop. **Re-measured here on my own harness rather than
accepted from that hop's note:**

```
                                   A5 row 1     A5 row 2     owned lane      full suite
WCACHE-LAST2  (length + last 2)    SURVIVES     KILLS        1 failed / 26   3 failed / 752
```

**The prediction was exactly right and for exactly the stated reason** — row 1 changes ply 19, which
sits inside a last-two key. **Confirmed, not inherited.** The status is now **MEASURED, and CLOSED by
`A5` row 2**.

## The part worth more than the closure

The risk said: *"If `WCACHE-LAST2` or any successor is ever measured live, it is closed by a new ROW in
`A5`'s table — not by `A6`."* **It was, at `preservedTail: 2` — no new criterion, no new `it` body, no
new instrument, no production line.** `A5`'s design property is now **exercised rather than asserted**,
by the first thing that came along needing it. A design claim that gets tested by reality within one
hop of being written is worth recording as such.

## The decision: no `RISK-ABC028-04`, and no `A6`

The next rung — `WCACHE-LAST3` — is **measured live and open**: no owned guard, `26 PASSED` in the
owned lane, and the project's only catcher is the accidental fixture sharing. The obvious move is to
mint a risk id for it. **I refused.**

**Minting a risk per rung is `## Test notes` 1's defect wearing a risk number.** That note's whole
finding is that `A9` was repaired once per node of an object graph and that the per-node description is
what guaranteed the next repair. A per-rung risk id does the same thing one level up: `RISK-ABC028-03`,
then `-04`, then `-05`, one per depth, each closed and each replaced. **The class is the unit, not the
witness.**

So: **the class's home is `RISK-ABC028-02`'s closure ledger**, `WCACHE-LAST3` is recorded there as its
**deepest known live witness**, and the extension mechanism is unchanged — **a ROW in `A5`'s table,
never an `A6` and never a new risk id.** `RISK-ABC028-03` is left in place as the dated record of a
prediction that was made, measured and closed, because deleting it would erase the one worked example
of the mechanism functioning.

## What this ticket does NOT do about `WCACHE-LAST3`, priced rather than waved away

**It does not add the row.** It is cheap — one row of pure data, the harness is generic over rows, well
inside `S`. Against that: all five criteria are met and green, the ticket is one gate from done, and
the ticket's own acceptance reasoning for `WCACHE-LAST2` — *"contrived where its predecessors were
natural … each step up the axis buys a strictly less plausible build"* — **applies with more force at
depth three.** `WCACHE-LAST` is what a competent engineer writes after `A1` fails; **nobody keys a
cache on "the last three moves."**

**Owner: whoever next has cause to open `A5`'s table. No date — latent, and recorded as latent.** This
is the note that says it was cheap, it was on the table, and it was not taken.
