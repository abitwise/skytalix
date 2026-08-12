---
id: 20260812T211500Z-qe-e2e-observation-a5s-extension-mechanism-has-an-undocumented-domain-6d0e3f52
kind: observation
by: qe-e2e
at: 2026-08-12T21:15:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A5
  - RISK-ABC028-02
  - RISK-ABC028-03
  - src/history-pane.test.ts
  - src/history-pane.ts
supersedes:
---

# `A5`'s row DOES extend — I closed the deepest live witness with one row — and the mechanism has an UNDOCUMENTED DOMAIN that ends at `preservedTail` 15

> **Hand-authored, no stamp.** Every `changes` value below was MEASURED on the delivered pane before
> any row was written (`## Test notes` 4); nothing here is predicted. **Nothing was landed** — every
> candidate row lives in an out-of-tree lane and `src/history-pane.test.ts` is `9533f050…`, unchanged.

The question put to this gate was: **does `A5` assert enough of the pane for every row it CARRIES, or
only for the two it HAS?** The answer has two halves, and the second one is a gap.

## Half one: the assertion is right, and the design claim is TRUE — demonstrated, not agreed with

`A5` asserts `expect(second).not.toEqual(first)` over the **whole pane**, plus per-row measured
`changes`. That is the correct shape and the deeper-key case proves why: **the deeper the preserved
tail, the further UP the pane the discriminator moves**, because the preserved tail IS the bottom of
the pane.

```
row                   preservedTail   indices whose IDENTITY moved   rows that differ
A5 row 1 (landed)     1               {19}                           row 7  (the LAST row)
A5 row 2 (landed)     2               {16,17,18}                     rows 5, 6
candidate row 3       3               {15,16,17}                     rows 5, 6
candidate row 15      15              {3,4,5}                        row 0  (the FIRST row)
```

An `A5` written against `A1`'s last-row clause would have been structurally incapable of catching
`WCACHE-LAST2`, exactly as the Engineer's design note says. **The whole-pane comparison carries every
row the axis can produce, and I ran the extremes to check it rather than reasoning about the middle.**

**And the central design claim — *closing a further member is a NEW ROW, never a new criterion* — is
TRUE, demonstrated at the very rung the ledger calls open.** I wrote one row of pure data
(`preservedTail: 3`, three replacement plies, two measured `changes`), added no `it` body, no new
fixture builder, no instrument and no production line:

```
lane                                      owned lane        what it says
delivered pane + candidate row 3          0 failed / 27     the row is GREEN on correct code
WCACHE-LAST3 + candidate row 3            1 failed / 27     THE DEEPEST LIVE WITNESS IS CLOSED
WCACHE-LAST4 + candidate row 3            0 failed / 27     and the ladder continues, as it should
```

**`WCACHE-LAST3` — the build that today passes `26/26` in the owned lane and takes the whole suite to
`752 PASSED` once the fixtures are rebuilt — dies to one row of data.** The cost the ticket predicted
is the cost it actually has. That is the second time this mechanism has been exercised by reality and
the first time at the rung that is currently open.

## Half two: THE GAP — the mechanism has a DOMAIN, and nothing on the page states it

**At `preservedTail: 16` the row does not become weak. It becomes FALSE.**

```
candidate row 16      preservedTail 16   indices whose identity moved {2,3,4}
                      rendered window    indices 5..20
                      panes              IDENTICAL — the edit is entirely off-window
                      delivered pane     1 failed / 27   <- THE CRITERION IS RED ON CORRECT CODE
```

The pane renders the most recent `HISTORY_ROWS` move numbers — at most **2 x HISTORY_ROWS = 16
plies**. A row's edit changes the plies at indices `n-T-R … n-1-T`; its shallowest changed ply is
visible only while `n-1-T` is inside the window. **That bound is `T ≤ 15` and it does NOT depend on
the fixture's length** — a longer fixture moves the window down with it. `preservedTail: 15` is the
last expressible rung (measured: exactly one changed ply visible, and it moves row 0);
`preservedTail: 16` pushes the entire edit off-screen, the two renders are byte-identical, and
`not.toEqual` fails **on the delivered pane**.

**This is the mirror image of the `D22` defect this ticket's parent paid for twice.** `D22` is a
criterion that cannot FAIL on the build it exists to catch. This is a criterion that cannot PASS on
the code it exists to protect — and it arrives by following the ticket's own extension instruction
literally. A hop told *"closing a future member of the class must be a NEW ROW, never a new
criterion"* and handed `WCACHE-LAST16` would write the row, watch the suite go red on a correct pane,
and have no way to tell from the page whether the pane broke or the row did.

**What the page says, and what it omits.** `A5`'s blockquote says *"Minimum ONE row at landing … do
not invent a row whose expected value nobody ran"* — which catches a row with fabricated `changes`,
but not this: my row 16 has `changes: []`, which is the honest measured value, and it still goes red.
`RISK-ABC028-03` says the mechanism is *"a ROW in `A5`'s table, never an `A6` and never a new risk
id"* with no bound at all. **The extension rule is stated as universal and is true on a domain
nobody has written down.**

**The repair is one clause, and it is text, not build work:** a row is expressible while
`preservedTail + replacement.length ≤ n - firstVisiblePly(n)` — in plain terms, *while at least one
changed ply is still inside the rendered window*. Past that the class needs a different KIND of edit
(one whose off-window change alters a visible ply's SAN through the replayed position), which is a new
criterion's worth of work and not a row. **I measured the bound; I did not measure whether such an
edit exists, and I do not claim it does.** Owner: BA/PM. It costs one sentence in `A5`.

## What this does to the residual, and it is the useful half

The class is infinite, but **the mechanism's reach is not**: rungs **0–15**. The project owns **0, 1,
2**. **Thirteen rungs are real wrong builds with no owned guard, every one closable by one row of pure
data at a cost this ticket has now paid three times** (twice landed, once by me out of tree). That is
a **finite, countable, priced** residual — a different object from *"there is always a next class"*.
Whether to buy any of the thirteen is BA/PM's and the Orchestrator's call, and it is a schedule
question rather than an open-ended one. **I am not recommending re-opening a built, green ticket to
add rows**; I am recording that the price is known, the mechanism works at the rung in question, and
the number is 13 rather than infinity.
