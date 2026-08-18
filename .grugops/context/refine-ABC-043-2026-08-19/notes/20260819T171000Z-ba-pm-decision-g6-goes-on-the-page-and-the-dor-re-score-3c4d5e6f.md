---
id: 20260819T171000Z-ba-pm-decision-g6-goes-on-the-page-and-the-dor-re-score-3c4d5e6f
kind: decision
by: ba-pm
at: 2026-08-19T17:10:00Z
verified_by:
confidence: high
refs:
  - ABC-043
  - ABC-037
  - ABC-108
supersedes:
---

# `G6` goes ON the page as a constraint; the DoR re-scores to **9/10, one ⚠️**

## `G6` — recorded, and here is why it is not the engineer's to discover

QE recorded at `ABC-037` that `createLineInputSeam` has a **single-caller precondition**: `waiting` is
a single slot, so **two overlapping `seam()` calls orphan the first read forever** — the first promise
never settles. **The failure mode is a product that hangs with no output and no exit code**, which is
the worst shape a defect can have on a CLI, and the precondition is written down in **neither the
module header nor the suite nor `AGENTS.md`**. `ABC-043` is the ticket that wires the seam.

**Decision: it goes in `## Scope` as a constraint** — the entry point builds the input seam once,
passes it to `runTurnLoop`, and calls it nowhere else. Recording it costs three lines; discovering it
at integration costs a hang with no diagnostic.

**No new criterion is cut for it, deliberately.** `A1` already pins `runTurnLoop` at exactly one call
with no adapter, and `A8` reads the whole delivered diff — a second `seam()` call has to appear there.
A criterion would be a third instrument for a property two already reach, and the ticket's own budget
rules say no.

**What this does NOT do:** it does not fix `ABC-037`'s module. The guard or header line QE suggested
belongs to that module's owner; this constraint protects `ABC-043`'s build and nothing further.

## The DoR re-score — **9 of 10 clean, 1 ⚠️, STILL NOT MET**

The full table is on the ticket. What moved:

- **Item 3 (INVEST) ⚠️ → ✅** — zero open ordering dependencies; all three merged.
- **Item 10 (no major blocker) ⚠️⚠️ → ✅** — both discharged by measurement.
- **Item 4 (acceptance) ✅ held UNDER CHALLENGE**, which is worth more than the mark: the
  satisfiability of `A5`/`A2` was measured, not assumed. **Had the mechanism not worked this row would
  read ⚠️ and this ticket would be at Architect/Design.**
- **Item 6 (NFR triggers) ✅ → ⚠️ — the one mark, and it is NEW.** `N8-LANE` ≤ 650 ms is arithmetic
  over `ABC-108`'s open `OQ-1`: the lane medians **13.400 s CPU against a 13 s clause**, and the board
  says plainly that until it is ruled the bar cannot honestly be granted to any ticket. This ticket
  adds a **measured ≈ 0.44 s** of criterion-forced children on top.
- **Item 7 (test notes) ✅ five → eight.**

**Why this is not 10/10, said plainly, because 10/10 was available and would have been wrong.** Three
of four old marks are genuinely discharged, and the testability challenge is genuinely answered. But
the ticket's own NFR line is arithmetic over a number that is currently outside its clause, and this
hop **added** to that number. **Scoring the page clean on the discharged blockers while the lane
question is open would have traded a real ⚠️ for a stale one.**

**Nothing on this page can clear the last mark.** `ABC-108`'s `OQ-1` is **Architect/Design's**. A pull
with it open is a decision the Orchestrator may take with the figures in front of him; it is not one
this table makes for him.
