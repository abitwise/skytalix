---
id: 20260815T142500Z-orchestrator-observation-four-traceability-rows-carry-extra-columns-and-they-predate-this-hop-5829a567
kind: observation
by: orchestrator
at: 2026-08-15T14:25:00Z
verified_by: 
confidence: high
refs:
  - plans/traceability.md
  - ABC-040
  - ABC-052
  - ABC-009
  - ABC-011
  - ABC-015
  - ABC-019
supersedes: 
---

# Four traceability rows carry the wrong number of columns — and every one of them predates this hop

## Measured, both sides

Every `ABC-` row in `plans/traceability.md` was re-split from disk at this close. **62 rows checked,
4 wrong:**

| row | ticket | columns | expected |
|---|---|---|---|
| 207 | `ABC-009` | **12** | 10 |
| 209 | `ABC-011` | **11** | 10 |
| 215 | `ABC-015` | **11** | 10 |
| 219 | `ABC-019` | **11** | 10 |

**The same four rows, with the same counts, are present on `main` as it stood before this hop** —
checked by running the identical split over `git show main:plans/traceability.md`: 56 rows, the same
4 wrong. **This hop did not introduce them, and neither did the five rows BA/PM appended**, which
re-split at exactly 10 with zero raw `|` inside any cell, asserted by BA/PM from disk and re-asserted
here across the whole file.

## Why this matters more than four stray pipes

**This is the exact defect this project already assert against on every single write** — the
Orchestrator caught a raw `|` in its own `ABC-042` edit one hop after making it, and BA/PM's cut hops
re-split from disk for precisely this reason. **Those assertions are per-write and per-row. Nobody
has ever run one across the whole file**, so four rows have carried a broken shape for an unknown
number of hops while every new row was being checked carefully.

A row with 11 or 12 columns means the `Status`, `Release` and `UAT` cells of that row are **shifted**
— any tool or reader that indexes columns positionally reads the wrong cell for those four tickets.

## Not fixed here, deliberately

Repairing them means deciding, per row, whether a stray `|` was a delimiter written by mistake or a
character that belongs inside a cell and needs escaping as `&#124;`. **That is a content decision
about four other hops' records, and it is not a coordinator's to make at a close** — the same
reasoning by which BA/PM refused to re-score `ABC-057`–`ABC-060` on this hop.

**It joins two live tickets on the same file and should be cut with them in view, not separately:**
`ABC-040` (duplicate `ABC-028`/`ABC-029` rows — 40 rows for 38 tickets) and `ABC-052` (the `Status`
column goes stale on every merge). **Three known integrity defects in one file, none of them yet
fixed, and a whole-file assertion that would have caught this one exists nowhere.** The ticket worth
cutting is probably that assertion, not the four repairs.
