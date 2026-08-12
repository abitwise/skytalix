---
id: 20260813T010500Z-qe-e2e-observation-f1s-formula-holds-at-both-parities-and-the-14-is-now-measured-3d90b6c2
kind: observation
by: qe-e2e
at: 2026-08-13T01:05:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A5
  - RISK-ABC028-02
  - RISK-ABC028-03
  - src/history-pane.ts
  - src/history-pane.test.ts
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
supersedes:
---

# `F1`'s formula HOLDS at both parities — the `14` that was `UNKNOWN - verify` is now MEASURED — and the clause has one inaccuracy that runs in the SAFE direction

> **Hand-authored, no stamp.** Every cell below was RUN. Nothing was landed: `src/history-pane.test.ts`
> is `9533f050…` at the start and the end of this hop, every candidate row lived in an out-of-tree
> lane, and `git diff -- src/` is EMPTY.

The amended clause states the domain as

> **`preservedTail ≤ n − 1 − firstVisiblePly(n, blackToMoveAtAnchor)`**

quoting **15** for `blackAnchorTo(21)` (measured at the previous gate) and **14** for a half-row
fixture — **derived at source by BA/PM and explicitly marked `UNKNOWN - verify`**. The Orchestrator
asked for 14 and 15 on both fixture shapes. **All four cells were run, and the formula is exact.**

## `firstVisiblePly` was MEASURED, not re-implemented

`firstVisiblePly` is not exported. Re-implementing it in a probe would only prove the probe agrees
with itself, so the probe takes it from the pane's own OUTPUT — `n` minus the number of plies the
pane actually puts on screen:

```
fixture              visible plies   firstVisiblePly   window     last visible row   BOUND
blackAnchorTo(21)    16              5                 5..20      FULL row           15
blackAnchorTo(22)    15              7                 7..21      HALF-ROW           14
```

**Both agree with the values the clause quotes, and the half-row identification is confirmed at the
output rather than reasoned from the parity of `n`.**

## The four boundary cells, and the two beyond them

The edit is built exactly as `A5`'s `it` body builds one — take back `preservedTail + 3`, play a
replacement, push the preserved tail back as the SAME `Move` OBJECTS. Class membership was asserted
BEFORE the pane comparison in every cell (`## Test notes` 10's inversion): **length held and the tail
went back by identity in all twelve cells.**

```
 n   T    fvp  bound  deepest changed ply   predicted     panes    rows changed
 21  14   5    15     6                     expressible   DIFFER   0
 21  15   5    15     5                     expressible   DIFFER   0        <- the bound EXACTLY
 21  16   5    15     4                     off-window    same     -
 21  17   5    15     3                     off-window    same     -
 22  13   7    14     8                     expressible   DIFFER   0
 22  14   7    14     7                     expressible   DIFFER   0        <- the bound EXACTLY
 22  15   7    14     6                     off-window    same     -
 22  16   7    14     5                     off-window    same     -
```

**Prediction and measurement agree in every cell.** At `T` = the bound the deepest changed ply lands
exactly on `firstVisiblePly` and exactly one cell of row 0 moves; at `T` = bound + 1 the whole edit is
off-window and the two renders are byte-identical.

**And the boundary was LOCATED rather than sampled** — a full sweep of `T = 0 … n−3` on four fixture
lengths, two of each parity:

```
n=20  formula bound 14   measured largest-differing T 14   AGREE
n=21  formula bound 15   measured largest-differing T 15   AGREE
n=22  formula bound 14   measured largest-differing T 14   AGREE
n=23  formula bound 15   measured largest-differing T 15   AGREE
```

Every profile is monotone — differ for all `T ≤ bound`, same for all `T > bound`, no gaps — so the
bound is a genuine edge and not the first of several.

**BA/PM's correction to my own earlier wording is confirmed and is the right one.** I had written
that the bound *"does NOT depend on the fixture's length"*. Measured: it is constant across lengths
of the **same parity** (20 and 22 both give 14; 21 and 23 both give 15) and **moves across parity**.
A bare *"≤ 15"* would have been wrong for half of all fixtures.

## Run as REAL `A5` rows through the REAL suite, not only as a pane comparison

Each `changes` value was measured on the delivered pane first (`## Test notes` 4) and then written
into a row appended to `A5_SHAPES` in an out-of-tree lane:

```
lane                                   owned lane      verdict
R21-T14  (pure data row)               0 failed / 27   GREEN — inside the bound
R21-T15  (pure data row)               0 failed / 27   GREEN — AT the bound
R21-T16  (pure data row)               1 failed / 27   RED ON THE DELIVERED PANE — one past
R22-T14  (it body re-pointed)          0 failed / 25   GREEN — AT the half-row bound
R22-T15  (it body re-pointed)          1 failed / 25   RED ON THE DELIVERED PANE — one past
```

The two reds fail on `expect(second, "the second pane must not repeat the first").not.toEqual(first)`
with `changes: []` — the honest measured value — exactly the shape `F1` describes. **`R21-T16`
reproduces the previous gate's measurement on a tip it never saw.**

## THE ONE INACCURACY IN THE AMENDED CLAUSE — and it runs in the safe direction

The clause says: *"a future row that changes the builder changes the bound"*.

**A ROW CANNOT CHANGE THE BUILDER.** `EditShape` has exactly three fields — `preservedTail`,
`replacement`, `changes` — and none of them is a fixture; the `it` body hardcodes
`blackAnchorTo(21)` (`:1063`, one hit) and `toHaveLength(21)` (`:1084`). **Measured:** the `R22-T14`
row's data, appended to the table as a row and nothing else, dies with `Error: no legal move a2a3` —
its replacement is meaningless against the fixture the body builds. Reaching the half-row bound
required editing the `it` body in two places, which is not a row.

**So the `14` is real, but it is the bound of a MODIFIED CRITERION, not of any row `A5` can carry.**

**I lean to leaving this alone, and I say so plainly.** The clause's inaccuracy is *conservative*: it
warns against a bare `≤ 15` that would be wrong if the builder ever moved, and that warning is
correct and worth keeping. The cost of the imprecision is that a hop handed `WCACHE-LAST16` might try
a row with a different fixture, fail on an illegal move, and have to work out why. **That is a much
smaller trap than the one the clause removes**, and this ticket is built and green. **Severity LOW,
owner BA/PM, and my recommendation is to record it rather than re-open the page for it** — it is one
parenthesis (*"changing the builder is an `it`-body edit, not a row"*) if anyone opens `A5` for
another reason.

## What this does NOT say

- **Not that `A5` is unmet.** Rows 1 and 2 sit at `preservedTail` 1 and 2, well inside the domain,
  and both are green on the delivered pane — owned lane `26/26` on this tip.
- **Not that a deeper member is unreachable.** Past the bound the ROW ends, not the class. Whether an
  edit of a different KIND reaches rungs 16+ is **`UNKNOWN - verify`**: I measured the bound and I did
  not build such an edit, exactly as the page says.
- **Not that I landed anything.** No row was landed and none is recommended for landing at this hop.
