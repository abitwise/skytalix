---
id: 20260813T024000Z-ba-pm-observation-i-read-the-column-invariant-before-appending-and-its-own-list-is-the-same-shape-3e8a3370
kind: observation
by: ba-pm
at: 2026-08-13T02:40:00Z
verified_by:
confidence: high
refs:
  - ABC-019
  - ABC-009
  - ABC-011
  - ABC-015
  - ABC-029
  - plans/traceability.md
supersedes:
---

# I read the COLUMN INVARIANT before appending — and its own "known malformations" list is the same shape

## I did NOT append to, edit, or rewrite any traceability row

**Nothing in `plans/traceability.md` was changed by this hop.** This hop cut no ticket, wrote no
criterion, added no code and added no test, so the requirement→epic→feature→ticket linkage this
workflow owns is **already complete and already correct** for `ABC-019` — there is no new linkage to
append. **The row was not opened for edit**, and the reason is recorded here rather than left silent.

## What the note says, and what I measured

The note above the header (`plans/traceability.md:117`) says:

> This table has TEN columns. A well-formed row has ELEVEN `|` characters and ENDS with one.
> Count COLUMNS, not `|`-split FIELDS: `line.strip().strip('|').split('|')` must give 10. …
> KNOWN PRE-EXISTING malformations, flagged not rewritten (rule 12): ABC-009 (12 cells),
> ABC-011, ABC-015, ABC-019 (11 each). ABC-029 was repaired 2026-08-12 and is CORRECT.

**I ran the note's own prescribed counter over every `ABC-…` row, and then ran a second counter that
differs from it in exactly one respect — it does not split on a pipe preceded by a backslash:**

| row | note's counter (`strip → split('|')`) | escape-aware counter | `\|` occurrences in the row |
|---|---|---|---|
| ABC-009 | **12** | **10** | **2** |
| ABC-011 | **11** | **10** | **1** |
| ABC-015 | **11** | **10** | **1** |
| **ABC-019** | **11** | **10** | **1** |
| every other `ABC-…` row | 10 | 10 | 0 |

**In all four rows the excess is exactly the number of backslash-escaped pipes, and the escape-aware
count is exactly 10.** `ABC-019`'s single escape is locatable and reads, in the Status cell:
``A14`'s superset was satisfied by `EndReason \| "resignation"` `` — a literal pipe inside an inline
code span, deliberately escaped by whoever wrote it.

## What that does and does not establish

**Established, and it is raw-text arithmetic I ran here:** the note's counter counts a `\|` as a
column delimiter, and every row it lists as malformed is malformed *only* by that counter. There is no
row on this table whose excess is unexplained by an escape.

**`UNKNOWN - verify`, and I will not assert it:** whether a renderer therefore shows these rows with
ten cells. GFM's escaping rule is what the four rows' authors were relying on, but **there is no
markdown renderer in this repo's `node_modules` to run it through**, so I measured the raw text and
stopped there rather than fabricating a render.

## Why I am reporting this rather than fixing it

- **The note is the Orchestrator's own safeguard text**, written after two roles miscounted; amending
  the safeguard is not a BA/PM refinement move and this brief did not ask for it.
- **Three of the four rows belong to merged tickets** (`ABC-009`, `ABC-011`, `ABC-015`), which this
  brief puts out of bounds.
- **Rule 12 stands**: flag, don't rewrite. The note itself already says these are flagged not
  rewritten; what I am adding is that the flag may be describing the counter rather than the rows.
- **The cost is live and recurring**: the 2026-08-13 gate declined to append its NFR verdicts to this
  table because the neighbouring row read malformed, and a role that reads the list will decline
  again. **Owner: the Orchestrator. Trigger: the next append to `plans/traceability.md`.**

**This is the same shape this hop was cut to repair** — a sentence whose measurement is narrower than
its wording — and, consistently with `[D56]`, **I did not write a rule about it.** I measured it once
and handed the measurement over.
