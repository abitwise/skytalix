---
id: 20260809T135400Z-ba-pm-observation-264b83fa
kind: observation
by: ba-pm
at: 2026-08-09T13:54:00Z
verified_by: 
confidence: high
refs:
  - ABC-009
  - ABC-011
  - ABC-015
  - plans/traceability.md
  - AGENTS.md
  - 20260809T123600Z-qe-e2e-claim-f3a609d3
  - 20260809T124839Z-orchestrator-decision-ffe8bb73
  - 20260809T131500Z-security-nfr-artifact-ref-0e2d4354
supersedes: 
---

# The `plans/traceability.md` "rendering defect" in rows `ABC-011` and `ABC-015` DOES NOT EXIST. Withdrawn on measurement.

This hop was told the defect was flagged, deliberately out of scope, and mine to cut a ticket for if I
judged it worth one. I judged it by measuring it first. **There is nothing to fix: both rows have
exactly ten cells, they always have, and the pipe that was called unescaped is escaped.**

Recorded as its own note because three roles carried this forward as a real defect and one of them
named a cause and a consequence for it, so a retraction that lives only in a report would not reach the
next reader.

## What was reported

- QE (`20260809T123600Z-qe-e2e-claim-f3a609d3` §8): *"The `ABC-011` and `ABC-015` rows carry 11 cells
  against the header's 10 — an unescaped pipe."* Flagged, not fixed, correctly under coding rule 12.
- The Orchestrator (`20260809T124839Z-orchestrator-decision-ffe8bb73`) confirmed it *"at the source"*,
  named a cause QE had not — *"an unescaped literal `|` inside prose"* — and named a consequence:
  *"every column after `Tests` is shifted, so `UAT`, `Release` and `Status` render one cell to the right
  of their headers."*
- Security/NFR (`20260809T131500Z-security-nfr-artifact-ref-0e2d4354`) re-verified after its own edit
  and reported *"13 raw fields against the header's 12"*, still exactly those two rows.

## What is actually there

A GFM table cell is split on **unescaped** pipes; `\|` is the documented way to put a literal pipe
inside a cell, including inside a code span. Counting unescaped pipes — `(?<!\\)\|` — rather than raw
`|` characters:

```
every table row in plans/traceability.md, including ABC-011 and ABC-015:
  11 unescaped pipes  ->  10 cells  ->  matches the header's 10 exactly
ABC-011 and ABC-015 additionally contain:
  1 ESCAPED pipe each (\|), inside `... --reporter=json \| jq '...'`
```

So the two rows carry **12 raw pipe characters and 11 unescaped ones**. Split on raw `|` they look like
11 cells; split the way a renderer splits them they are 10. **Nothing shifts. `UAT`, `Release` and
`Status` render under their own headers on those two rows exactly as on every other row.**

## It was never broken, checked across the whole history rather than at the tip

All eight commits that have touched `plans/traceability.md`, each row counted on unescaped pipes:

```
commit    rows with != 10 cells    escaped-pipe occurrences in file
b392d2f   NONE                     4
15cf580   NONE                     4
8f540cf   NONE                     4
e01b32f   NONE                     4
ee026af   NONE                     4
364928b   NONE                     4
a446297   NONE                     4
d88a1f0   NONE                     4
```

**And the escape was deliberate, by the role that wrote the row.** The `_Updated:` entry of 2026-08-08
by QE/E2E, still at the head of the file, records the `ABC-015` row as *"still has TEN cells (12 raw
pipes, one escaped), verified by machine before and after the edit"*. The 2026-08-09 `ABC-018` engineer
entry likewise reports *"no unescaped `\|` was introduced"*. The convention was understood and applied
correctly; what drifted later was the **measuring instrument**, not the file.

## Why this is worth a note rather than a shrug

The flag was propagating toward a repair. Three notes carry it, one with a stated cause and a stated
render consequence, and the routing brief for this hop offered the durable fix as *"escape the pipe"* or
a note in `AGENTS.md`. **Both of those would have edited two correct rows or documented a rule already
followed** — and an edit that "removes" the escape from those rows is the one change that would
genuinely corrupt them, turning 10 cells into 11 on the audit surface, on two tickets already past
their gates. A false defect on a trace surface is dangerous in exactly the direction the fix points.

**No ticket was cut, no row was edited, and `AGENTS.md` was not touched.** What is worth carrying, and
is the only durable item here, is the counting rule: **verify a table row by counting unescaped pipes,
not raw `|` characters** — `awk -F'|'`, a naive `split('|')` and a raw `grep -o` all over-count a
correctly escaped row by one. Whether that deserves a line in `AGENTS.md` is the Orchestrator's call,
not this hop's, and it is a process nit rather than a defect.

**This role's own edit to `plans/traceability.md` in this hop was verified the corrected way** — every
one of the 31 table rows at 10 cells counting unescaped pipes, before and after, zero rows whose count
changed, one row (`ABC-009`) changed in content.

## The class this belongs to, stated because it is the third instance on this ticket

A green-looking number believed rather than re-derived. The first was the 100% coverage figure on
`src/legal.ts` that this defect shipped straight through, named in `## Problem`. The second is `A7`,
whose protective value was assumed and is measured at zero. **This is the third, and it is the mirror
image of the other two: not a reassuring number believed, but an alarming one believed.** The same
discipline catches both — re-derive at the source with an instrument that measures what you actually
mean.

## What this note does NOT establish

- **That every markdown renderer displays those two cells identically.** GFM's table-pipe escape is
  what was checked, by the specification's rule and by the file's own convention. **No renderer was
  run** — `AGENTS.md`'s docs-build slot is `UNKNOWN - verify` and none exists in this install — so a
  non-GFM renderer showing a literal backslash inside the code span is possible and unmeasured. That
  would be cosmetic, and it is not the reported defect.
- **That the two rows are otherwise correct.** Only their cell structure was checked. Their content is
  `ABC-011`'s and `ABC-015`'s, not this hop's to audit.
- **That no other file has a genuine unescaped-pipe problem.** Only `plans/traceability.md` was counted.
