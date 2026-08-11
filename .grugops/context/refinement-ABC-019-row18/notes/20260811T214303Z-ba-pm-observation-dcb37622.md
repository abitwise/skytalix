---
id: 20260811T214303Z-ba-pm-observation-dcb37622
kind: observation
by: ba-pm
at: 2026-08-11T21:43:03Z
verified_by:
confidence: high
refs:
  - ABC-019
  - ABC-016
  - ADR-0010
  - src/status-panel.ts
  - src/turn-loop.test.ts
supersedes:
---

# One input for whoever next touches the status panel's claim cell — `A20` now depends on it

> **Hand-authored**; `kind: observation` because the gate is RED and there is no verdict to stamp
> against. **I did not open `ABC-016`'s ticket and nothing is owed to it today** — this is recorded in
> the shared context for the hop that touches the cell, which is the only channel there is.

## The coupling, stated exactly

`ABC-019`'s `A20` is the only criterion anywhere that checks *nothing stale reaches the screen*
(`ADR-0010` clause 7 assigns it there and says so). After this hop's `[D54]`, its fixture's narrowing
is the **real** status panel's claim cell: `renderClaimCell` (`src/status-panel.ts:163-178`) emits
`White may claim: fifty-move rule` — **32 columns** — while the halfmove clock stands at 100 and
**blank** the ply a pawn move resets it, which is the `45 → 22` narrowing the test replays.

**If that cell is removed, renamed shorter than the widest remaining panel row, or made to persist
across the clock reset, `A20`'s fixture stops narrowing.** It does not then pass quietly: the test
asserts the narrowing **exists** and that a redraw follows the first one
(`src/turn-loop.test.ts:1431-1437`), so it goes RED and names the reason. **That failure mode was
chosen deliberately by the delivering Engineer and ratified here; do not "fix" it by deleting the
existence assertion.**

## Why this is a note and not a criterion on `ABC-016`

`ABC-016` owns the panel and its own criteria already pin the cell's content and its derive counts.
Writing a second criterion in a second ticket to say *"and `ABC-019`'s fixture depends on you"* would
be a cross-ticket constraint no gate can adjudicate and one more thing to keep in sync — **bloat, and
refused on the same ground the sixth hop refused a *"nothing imports `turn-loop.ts`"* criterion.**
The honest instrument is the one already in the tree: the test fails loudly at the moment the
assumption breaks.

## What this does NOT say

- It does **not** say the claim cell may not change. It says the change is visible.
- It does **not** re-open `ADR-0010` or `ADR-0009`, and neither was opened for edit.
- It does **not** move any bar: `plans/nfr-catalog.md` was not opened, and `A20` is a screen-equality
  criterion, not an NFR.
