---
id: 20260812T234000Z-ba-pm-observation-f1-the-domain-derived-at-source-and-f2-the-absolute-struck-2d5a3fc8
kind: observation
by: ba-pm
at: 2026-08-12T23:40:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A4
  - ABC-028-A5
  - ABC-029
  - RISK-ABC028-03
  - src/history-pane.ts
  - src/history-pane.test.ts
supersedes:
---

# `F1` — the domain, derived from the pane's own window function; and `F2` — why the fourth correction of that figure is a strike rather than a number

## `F1`: `ABC-028 A5`'s extension rule has a domain, and the page stated none

**The rule** — *"closing a further member of the class is a NEW ROW, never a new criterion"* — **is true
on a domain.** QE measured the boundary; I re-derived it from source rather than transcribing it,
because a bound is a number and `## Test notes` 4 binds.

A row takes back `preservedTail + replacement.length` plies
(`grep -n 'const A5_SHAPES' src/history-pane.test.ts` → `:1026`), so it changes indices
`n − preservedTail − replacement.length … n − 1 − preservedTail`. The pane renders
`firstVisiblePly(n, blackToMoveAtAnchor) … n − 1`
(`grep -n 'function firstVisiblePly' src/history-pane.ts` → `:101`). **A row is expressible while its
deepest changed ply is still inside that window:**

**`preservedTail ≤ n − 1 − firstVisiblePly(n, blackToMoveAtAnchor)`** — one less than the number of
plies the pane shows.

```
fixture                       firstVisiblePly   window        bound
blackAnchorTo(21)  (A5's)     5                 5..20  (16)   preservedTail ≤ 15
blackAnchorTo(22)             7                 7..21  (15)   preservedTail ≤ 14      <- derived, NOT run
```

**Every `ABC-028 A5` row builds `blackAnchorTo(21)`** —
`grep -n 'const history = blackAnchorTo(21)' src/history-pane.test.ts` → `:1063`, **one hit** — so
**15 is right for every row this criterion can carry as written**, and it agrees with QE's measurement
(`preservedTail: 16` → `1 failed / 27` on the **delivered** pane, two renders byte-identical,
`changes: []` being the honest measured value).

**THE CORRECTION I MAKE TO QE'S OWN WORDING, and it is small and in the same direction as QE's own
work.** QE wrote that the bound *"does NOT depend on the fixture's length"*. **True across lengths of
the same parity; false across parity.** The pane shows 16 plies only while the visible block fills all
eight rows; a fixture whose last visible row is a half-row shows 15 and the bound is 14. **So the rule
is written against `firstVisiblePly` and `15` is quoted as THIS FIXTURE's value** — a bare *"≤ 15"*
would have been this page's own defect one more time, planted by the clause that was meant to remove
it. **The 14 is derived from the same function and NOT measured: `UNKNOWN - verify`.**

**Past the bound the class does not end — the ROW does.** A deeper member needs an edit of a different
KIND (one whose off-window change alters a VISIBLE ply's SAN through the replayed position), which is a
criterion's worth of work. **Whether such an edit exists is `UNKNOWN - verify`; QE measured the bound
and explicitly did not claim one, and neither do I.**

**No landed row moves. Rows 1 and 2 sit at `preservedTail` 1 and 2, well inside the domain. `A5` is
MET; what was missing is the domain of its extension rule.**

## `F2`: the lane figure is struck, not corrected

`A4`'s live clause read *"`1 failed, 749 passed` against `750 passed (750)`"*. **On this tip `npm test`
is `755 passed (755)`.** The series:

```
748    QE's A4-only figure (four its)
750    refinement-ABC-028-a2  — this ticket's scope grew to six its
752    quality-gate-ABC-028-final — ABC-028's own A5 rows
755    THIS HOP — ABC-029's 7084c5e, +153/−0 and +3 it in the SHARED nfr file
```

**Two of the four moves were not `ABC-028`'s, and the latest one landed after the gate that reported
the figure stale.** Correcting `749` to `751` would have been stale before anybody read it.

**A suite TOTAL is not a property of this criterion. The shape is** — *exactly one failure, it is this
criterion, zero pre-existing tests break* — which is falsifiable, is what all six `A4` builds were
verified against at three hops, and does not move when a neighbour adds a test. **The dated figures are
kept as dated witnesses and none is refreshed.**

**This is `## Test notes` 11's own lesson — pin the REGION, not the FILE — applied to a count instead
of a digest, and it is the same repair `## Out of scope` made when it replaced a fixed md5 with a
diff.** It is the third time this page has swapped a brittle absolute for the property it was reaching
for, and the first time the absolute was a test count.
