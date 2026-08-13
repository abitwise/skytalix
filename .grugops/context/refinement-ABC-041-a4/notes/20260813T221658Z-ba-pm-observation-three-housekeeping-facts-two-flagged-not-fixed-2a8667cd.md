---
id: 20260813T221658Z-ba-pm-observation-three-housekeeping-facts-two-flagged-not-fixed-2a8667cd
kind: observation
by: ba-pm
at: 2026-08-13T22:16:58Z
verified_by: 
confidence: high
refs:
  - ABC-041
  - ABC-050
  - ABC-051
  - ABC-052
  - plans/traceability.md
  - plans/board.md
  - plans/tickets/ABC-041-render-seam-closure.md
supersedes: 
---

# Three things found while doing this hop's own work. One corrected, two flagged and not fixed.

## CORRECTED — `ABC-041`'s front matter disagreed with the board

`plans/tickets/ABC-041-render-seam-closure.md` read `status: in-development` / `column: In
Development`. `plans/board.md` has carried `ABC-041` under **`## In Review (WIP 1/3)`** since
`ac17fe2`. The board's own FORMAT comment states the contract: *"A ticket's `column:` value MUST equal
the board column it sits under, and `status:` is the kebab-case form of that column."*

Changed to `status: in-review` / `column: In Review`. **This is not a board move**: the board is the
state, it already said `In Review`, and the ticket page was stale. Nothing moved forward and nothing
moved backward — `ABC-041` is exactly where the gate left it. Recorded because a front-matter edit on
a ticket in flight should never be silent.

## FLAGGED, NOT FIXED (1) — `ABC-050`, `ABC-051` and `ABC-052` have no traceability rows

Measured while appending my own four. `plans/traceability.md`'s table runs to `ABC-046` and then
stops; `ABC-050`, `ABC-051` and `ABC-052` have **board rows and ticket files and no row in the
matrix**. All three were cut on 2026-08-13 by a different hop.

Not fixed, for two reasons. Appending trace rows for another hop's tickets means writing that hop's
account of its own work from the outside, and it sits squarely in **`ABC-052`'s** own subject — the
traceability `Status` column's currency — with **`ABC-040`** (the duplicate-row reconciliation) queued
in front of it and explicitly sequenced by the Orchestrator against trace-appending hops. Adding three
rows here would put a third writer into that queue for no gain. **Owner: the Orchestrator, to
sequence; the work itself is BA/PM's.**

## FLAGGED, NOT FIXED (2) — four merged trace rows carry unescaped pipes

A column-count check over every `| ABC-` / `| EPIC-` row after my edit:

```
ABC-009  13 pipes      (expected 11)
ABC-011  12 pipes
ABC-015  12 pipes
ABC-019  12 pipes
all other rows, including the four appended here: 11
```

The table is 10 columns, so a well-formed row has 11 pipes. These four carry a literal `|` inside a
cell — almost certainly a TypeScript union written in prose — which makes them render as 11- and
12-column rows. **All four are merged and pre-existing; none is mine.** Coding rule 12: flag, do not
delete. It is the same neighbourhood as `ABC-040`/`ABC-052` and should ride with whichever of them
runs first rather than becoming a fifth ticket — **cutting a ticket for four stray pipe characters
would be exactly the bloat this role exists to refuse.**

## What is NOT claimed

- Not claimed that the four malformed rows lose information. They render badly; the text is all
  there. I did not verify how each one displays.
- Not claimed that `ABC-050`/`ABC-051`/`ABC-052`'s missing rows are a defect in those tickets. The
  omission is in the matrix, not on their pages.
