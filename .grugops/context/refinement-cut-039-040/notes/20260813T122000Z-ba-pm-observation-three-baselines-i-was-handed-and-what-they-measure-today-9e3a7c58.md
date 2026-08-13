---
id: 20260813T122000Z-ba-pm-observation-three-baselines-i-was-handed-and-what-they-measure-today-9e3a7c58
kind: observation
by: ba-pm
at: 2026-08-13T12:20:00Z
verified_by:
confidence: high
refs:
  - ABC-039
  - ABC-040
  - plans/traceability.md
  - plans/board.md
  - plans/tickets/
supersedes:
---

# Three baselines I was handed, re-measured — one stale, one true-but-mis-inferred, and one new defect I refused to fold in

> **Hand-authored, no stamp.** No `context-io.ts`, no `mcp__grugops__propose_note`,
> `human_admission` `off` — **no `finding` on this hop**. These are measurements recorded as
> `observation`, which is the honest kind without a gate stamp.

## 1. The row/ticket counts I was given are STALE. The defect shape is unchanged.

The brief: *"Verified this morning: 32 `ABC-` rows for 30 tickets."*

**Measured on `06c5427`: 40 rows for 38 distinct ids and 38 files in `plans/tickets/`.** The id set
and the file set are **identical** — `comm -3` over them is empty — so the whole excess is
duplication.

Traced through git:

| commit | rows | distinct |
|---|---|---|
| `43d5a9d` | 32 | 30 |
| `69908cc` (the `EPIC-003` cut: `ABC-031`…`ABC-038`) | **40** | **38** |
| `06c5427` (branch point) | 40 | 38 |

**The `32/30` figure predates `69908cc` by two commits.** The brief re-measured the *line numbers*
(203/205 and 204/206 — current, and confirmed) but carried the *counts* forward from the delivery
audit. **The defect shape is untouched: exactly two duplicate pairs, exactly `+2` rows over the
ticket count.** After this hop's own two rows the file stands at **42 for 40** — which is why
`ABC-040`'s `A1` is written as a three-way **equality with no literal number in it**, so it survives
every future append including mine.

## 2. The "not a prefix" property: TRUE as written, and the disposition drawn from it is wrong

Recorded in full on the `ABC-040` decision note. Short version: the sentence measures **whole
rows** and is correct at char 1619; the disposition needs a measurement of **cells**, and per cell
the stale `ABC-028` row is a byte-exact prefix in `Status` and empty in `Code`/`Tests`. **The reason
that deferred this three times is true of `ABC-029` and was written on `ABC-028`'s row.**

## 3. NEW — the status-currency defect. Measured, refused, and it needs an ID I could not allocate.

While checking whether the reconciled rows would state a current status, I measured:

**Of the 25 tickets in `plans/board.md`'s `Done` column, 10 have a live `plans/traceability.md`
`Status` cell containing no occurrence of the word `Done`:**

```
ABC-013  ABC-016  ABC-017  ABC-018  ABC-019  ABC-022  ABC-023  ABC-025  ABC-027  ABC-029
```

**Method, stated so the number can be argued with:** a word-presence probe over the **first** row
per id (the live one), on the raw cell text. **The count is a measurement; reading it as
"the trace Status column is stale for ten tickets" is a judgement and is `UNKNOWN - verify`** — a
row could record the same fact in other words. Neither `ABC-028`'s nor `ABC-029`'s live row records
a merge to `Done`; `ABC-029`'s ends *"NOTHING MERGED, NOTHING PUSHED, NOTHING DEPLOYED."*

**I refused to fold this into `ABC-040`, and the refusal is the point.** It is a different class —
**row-versus-board, ten rows** — and including it takes `ABC-040` past `S`. The brief said an `S`
growing past `S` is a signal that something bigger was found, to be said rather than padded around.
**This is me saying it.**

**No ID is allocated.** This hop held `ABC-039` and `ABC-040` only; the next free is `ABC-041`.
It is recorded in `ABC-040`'s `## Out of scope` with the ten ids and the method, and routed to the
Orchestrator. **If it is left here with a date and no ticket, that is a decision somebody should
make out loud — which is exactly the pattern these two tickets exist to end.**

## 4. Two smaller re-checks, both clean

- **Well-formedness.** Every one of the 42 `ABC-` rows gives **10 cells** under the escape-aware
  split, including the four the file flags as pre-existing malformations at `:157-158` (`ABC-009`,
  `ABC-011`, `ABC-015`, `ABC-019`). **This agrees with the file's own `MEASURED STATE 2026-08-13`
  note** and confirms the duplicates are a duplication defect, not a malformation.
- **The board columns.** `ABC-019`, `ABC-028` and `ABC-029` are all in `Done` — which is what
  discharges the blocker `plans/traceability.md:168-169` named for not repairing the duplicates.

## 5. One boundary I obeyed against a file convention, flagged rather than resolved silently

Every prior hop that edited `plans/traceability.md` added an `_Updated:` header line at the top of
the file; the file has 27 of them. **I added none.** My brief's boundary was *"append rows for your
two new tickets only"*, and an `_Updated:` line is not a row. **Where a boundary and a convention
conflicted I followed the boundary and am naming the gap** rather than quietly taking the wider
reading: the file therefore carries two new rows with no header line recording who added them, and
this note is the provenance until the Orchestrator decides whether it wants one.
