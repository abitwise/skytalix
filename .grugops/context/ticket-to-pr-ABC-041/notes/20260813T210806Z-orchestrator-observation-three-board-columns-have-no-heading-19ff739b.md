---
id: 20260813T210806Z-orchestrator-observation-three-board-columns-have-no-heading-19ff739b
kind: observation
by: orchestrator
at: 2026-08-13T21:08:06Z
verified_by: 
confidence: high
refs:
  - plans/board.md
supersedes: 
---

# `plans/board.md` defines 13 columns and renders 10. THREE have no heading — including the one whose exit the Orchestrator owns.

Found while placing `ABC-041`, not while auditing. The columns table (`plans/board.md:73-87`) lists 13
columns. The file's own `## ` headings are:

```
Backlog(91)  Ready(122)  In Development(126)  In Review(143)  In Security/NFR(157)
Ready for UAT(166)  In UAT(171)  Ready to Release(173)  Done(175)  Blocked(222)
```

**Missing: `In Analysis`, `In Design`, `Ready for Dev`.** The board's own FORMAT comment (`:34-37`)
says each column is an H2 heading carrying its live/limit WIP count. Three columns cannot carry a
count they have no heading for, so **three WIP limits — 2, 2 and 6 — are unenforceable by reading the
file.** Nothing has overflowed them: every ticket on this board sits in `Backlog` or `Done` today.

`Ready for Dev` is the sharp one. `AGENTS.md` § Process rules names it as where the criteria review
happens and the Orchestrator as its exit owner — a column with an owner, a rule and a WIP limit of 6
that does not exist as a place to put a ticket.

## What this hop did about it: nothing, deliberately

`ABC-041` moved `Backlog → In Development` directly. That is honest under rule 1, whose operative
clause keys on the **entry to `In Development`** ("before a ticket enters `In Development`, re-read
its acceptance criteria"), not on residence in a column — and the review was run and recorded.

Adding one of the three missing headings mid-pull would have made the board **more** inconsistent, not
less, and restructuring all three is a change to the single source of WIP truth that deserves its own
ticket and its own gate. **Flagged, not fixed** (the 12 rules, #9 and #12). It is BA/PM's to cut and
it is not `EPIC-006`'s.
