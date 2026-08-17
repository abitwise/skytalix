---
id: 20260818T001500Z-orchestrator-observation-rule-1s-control-counts-two-different-things-as-one-and-qe-caught-it-9c2f4a18
kind: observation
by: orchestrator
at: 2026-08-18T00:15:00Z
refs:
  - ABC-032
  - AGENTS.md
  - plans/board.md
confidence: high
verified_by:
supersedes:
---

# Rule 1's control counts two different things as one number. QE caught it, and it is right.

## The control, as written

`AGENTS.md` § Process rules 1: *"gaps found at QE fall below 3 per ticket for five consecutive
tickets and backward moves below 0.5 per ticket, while gaps recorded at the `Ready for Dev` exit
RISE."* And: *"If gaps fall at both ends the rule is not working — it is hiding."*

## What `ABC-032` produced

**1 gap at the `Ready for Dev` exit. 8 gaps at QE.** Read naively against the control, that is the
**wrong direction on both halves** and would be the first evidence rule 1 is failing.

## Why the naive reading is wrong

**5 of QE's 8 are guards that COULD NOT FAIL** — mutation survivors, found by changing production
code and watching a green suite stay green (`G1` a second grammar as a regex literal, `G2` the
capture marker, `G3` pawn origin agreement, `G4` `text.trim()`, plus the `A7` residue).

**That class is structurally unreachable from the `Ready for Dev` exit, because the exit runs BEFORE
THE CODE EXISTS.** No re-read of acceptance criteria against the built tree can discover that a
not-yet-written assertion will be insensitive to a mutation. **The criteria review and the mutation
hop are not two measurements of one quantity; they are measurements of two different quantities,
and rule 1's control silently adds them.**

The other 3 (`G5` redundant qualifiers, `G6` mixed castle spellings, `G7` `e8=K`'s reject code) ARE
criteria-shaped — undisclosed tolerances the closed list does not name — and **those** are the ones
the control means. **On the quantity rule 1 actually tracks, `ABC-032` scored 3 at QE against 1 at
the exit**, which is a normal reading, not an alarm.

## What I am recording, and what I am NOT doing

**Recording:** from `ABC-032` onward the gap count at a QE hop should be reported **split** —
*criteria-shaped* vs *guard-sensitivity* — or rule 1's control will read as failing while measuring
noise. `ABC-032`'s split is **3 / 5**.

**NOT doing:** I am not editing `AGENTS.md` § Process rules 1. That rule is the owner's, adopted
2026-08-13 with a named control, and **changing how its control is counted is a change to the rule**
— exactly the kind of thing this project requires be asked rather than inferred. It also cannot be
settled on one ticket: the honest test is whether the split holds across the next several QE hops.
`ABC-077`'s QE hop is in flight and will be the second data point.

**And I have just made the error this note exists to prevent, today, on `N8-LANE`** — generalising
from two samples. So: **one ticket, one observation, no rule change, and the owner decides whether
the control is re-cut.**
