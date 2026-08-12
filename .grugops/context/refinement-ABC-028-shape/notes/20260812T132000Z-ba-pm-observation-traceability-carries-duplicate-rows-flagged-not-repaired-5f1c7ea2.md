---
id: 20260812T132000Z-ba-pm-observation-traceability-carries-duplicate-rows-flagged-not-repaired-5f1c7ea2
kind: observation
by: ba-pm
at: 2026-08-12T13:20:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-029
  - ABC-019
  - plans/traceability.md
supersedes:
---

# `plans/traceability.md` carries **duplicate `ABC-028` and `ABC-029` rows** — the second of each pair is a stale snapshot, and a reader taking the last match gets a row frozen before five hops of appends

> **Hand-authored, no stamp.** Measured at source with `git` and a column-counting script that
> implements the file's own invariant. **FLAGGED, NOT REPAIRED — nothing was deleted.**

## What is there

```
line 162  | ABC-028 |   49,428 chars   LIVE — every hop has appended to this one
line 163  | ABC-029 |   22,167 chars   LIVE
line 164  | ABC-028 |    4,290 chars   STALE SNAPSHOT
line 165  | ABC-029 |    6,972 chars   STALE SNAPSHOT
```

(line numbers as read before this hop's own edits)

**All four rows are well-formed — 10 columns each.** This is a **duplication** defect, not a
malformation, and the two must not be confused: the file's `COLUMN INVARIANT` note already records
that two roles mis-reported a repaired row as malformed by counting `|`-split fields instead of
columns. **I ran that invariant as written** (`line.strip().strip('|').split('|')` must give 10) and
the only non-10 rows in the whole table are the four already documented as known pre-existing:
`ABC-009` (12), `ABC-011`, `ABC-015`, `ABC-019` (11 each). **My appended row and my new `ABC-030` row
are both 10.**

## Where it came from

```
57e11c2   1 ABC-028 row
b987325   1 ABC-028 row      ("grug rebase ABC-019")
5caef94   2 ABC-028 rows     <- introduced here
```

`git show 5caef94 -- plans/traceability.md` is `4+/1-`: it **removed one `ABC-019` row and added
three** — its own replacement `ABC-019` row plus **copies of `ABC-028`'s and `ABC-029`'s**, evidently
from a pre-rebase copy of the table. The commit's subject is about ruling an `A11` collision; the
duplication is collateral and nobody has reported it in the ten commits since.

## Why it matters more than it looks

**The stale copies sit BELOW the live ones.** A reader — or a script — that takes the **last** match
for `ABC-028` gets a row frozen before five hops of appends: no `A5`, no `F1`–`F5`, no gate results.
**Both copies are well-formed and plausible, so nothing looks wrong.** That is the same defect shape
this whole ticket is about, arriving in the trace file instead of a comment: **a record duplicated so
that one copy silently stops tracking.**

## What I did, and what I deliberately did not

- **Appended to the FIRST (live) `ABC-028` row only**, append-only to its `Status` cell.
- **Flagged the duplication inside the file's own `COLUMN INVARIANT` comment**, above the header and
  **outside the table body** — the place the file already tells readers to look before reporting the
  table broken. A flag inside the table body would have risked breaking the parsers the invariant note
  exists to protect.
- **Deleted nothing.** Two reasons: `AGENTS.md` rule 12 (flag, do not delete pre-existing defects),
  and **a BA/PM hop was live on `ABC-019` when I ran** — the ticket whose commit introduced this, and
  whose own row sits two lines away. De-duplicating under a live hop invites a merge collision on
  exactly the rows in question.

**Owner: the Orchestrator, to sequence the de-duplication against that live `ABC-019` hop.** It is a
two-line deletion once nobody is in the file, and it should keep the FIRST of each pair.

**This is not `ABC-028`'s to fix and I am not asking for it to be.** It is recorded here because I
found it while appending, and because the next role to append will otherwise find it the same way.
