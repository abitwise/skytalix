---
id: 20260820T232000Z-ba-pm-decision-n8-spawn-ceiling-raised-to-plus-six-and-re-expressed-in-time-9a8b7c6d
kind: decision
by: ba-pm
at: 2026-08-20T23:20:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - N8-SPAWN
  - NFR-008
  - ABC-108
  - A9
  - A3
supersedes:
---

# `N8-SPAWN` RAISED +5 -> +6, WITH THE REASON WRITTEN — AND THE COUNT RE-EXPRESSED IN TIME, BECAUSE THE COUNT WAS THE WRONG INSTRUMENT

## The ruling

**Ceiling raised to +6. Pin moves 17 -> 23.** Architect/Design was right that `A9` breaches the +5 I
derived at the cut, and right to refuse to spend it on their own authority.

**A shape that fits under +5 exists, was priced, and is REJECTED.** Drop `A3`'s 23-line close on the
default glyph mode (the weakest of its five: it varies two dimensions at once and its property is
already covered by the `--ascii` 23-line row and the default-mode 2-line row) and spend the slot on
`A9`. That buys **~70 ms** — measured against `ABC-043`'s 64-72 ms per child. **Deleting a boundary
guard to protect a proxy number is trading the thing for the measure of the thing**, and `A9` is the
only row on the page that separates the ruled fix from a listener that does nothing.

## The part that matters more than the +1

**A child-COUNT ceiling under-prices `A9` by about 15x, and raising it by one does not repair that.**
Measured at this hop, `A9`'s child: **real 1.04 s, user 0.14 s, sys 0.02 s**. A normal child on this
file is 64-72 ms. So the account I wrote at the cut would have shown "+6, within budget" while the
lane grew by a second.

**The cap on the page is now three clauses, all re-measured at the repair hop:**
**<= 6 added children AND <= 2.0 s added wall AND <= 0.5 s added CPU** on `npx vitest run --dir src`.
A hop that meets the count and blows a time clause has breached this ticket and says so.

## Where the wall goes — routed, not buried

`NFR-008` is **BREACHED on its CPU clause and UNRULED on wall**, re-measured at the cut at 13.74 s
user against the 13 s clause, and **`ABC-108` owns that**. `A9`'s contribution:

| clause | contribution | as a share |
|---|---|---|
| CPU (13 s) | **+0.16 s** | ~**+1.2%** |
| wall | **+~1.0 s** | UNRULED — no clause to be a share of |

**This is reported to `ABC-108` at the repair hop as a measured contribution.** It is not `ABC-115`'s
to rule and it is not `ABC-115`'s to hide. **No `N8-LANE` line is claimed on this ticket** — same
posture as the cut, `ABC-110`, `ABC-113` and `ABC-114`: a 5% slice of a spent total is not a slice.

**Most of `A9`'s second is `sleep`, not compute** — that is why the CPU clause, which is the breached
one, barely moves while the wall clause, which nobody has ruled, moves visibly. **That asymmetry is
the argument for raising the ceiling, and it is measured, not asserted.**

## Not done here

`plans/nfr-catalog.md` NOT opened and no NFR row seeded — `N8-SPAWN`'s ceiling is a number this
ticket derived for itself, not a catalog bar. `ABC-108` NOT edited, NOT re-scored, NOT moved. `A3` NOT
trimmed. Size and priority NOT re-scored.
