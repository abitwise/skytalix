---
id: 20260812T220300Z-software-engineer-observation-one-sentence-of-the-parent-decision-is-false-and-two-record-defects-5b0c3e24
kind: observation
by: software-engineer
at: 2026-08-12T22:03:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - A6.2
  - A6.3
  - plans/traceability.md
  - plans/tickets/ABC-029-production-module-scope-and-load-probe.md
supersedes:
---

# Three defects in the record, each MEASURED, each flagged and NOT fixed — one of them a sentence in this task's own `parent_ref`

> **`kind: observation`.** Every verdict below is a run or a byte-count at this hop. No stamp claimed;
> `human_admission` is **`off`**. **Nothing below changes what was built** — all three are record
> defects, and each is reported because the next hop would otherwise inherit it.

## 1. `parent_ref`'s `decision` note says `A6.3`'s four builds are all green under `Whalfguard`. TWO OF THE FOUR ARE RED

`20260812T200200Z-ba-pm-decision-…` states:

> *"`A6.3` sits **beside** it and does not subsume it: `A6.3`'s four builds are all green under
> `Whalfguard` too, so `A6.2` remains the sole catcher of `Whalfguard` and neither row may be dropped
> for the other."*

**Measured at the expression at this hop:**

| `A6.3` build | `Whalfguard` |
|---|---|
| `WTYPESTAR-IMPORT` — `import type * as H from` | green |
| `WTYPEDEFAULT-IMPORT` — `import type H from` | green |
| **`WTYPESTAR-EXPORT`** — `export type * from` | **RED** |
| **`WTYPESTARAS-EXPORT`** — `export type * as history from` | **RED** |

`Whalfguard` applies `(?!type\b)` to the `import` branch only, so **every `export type …` spelling
reds under it** — the two `import type` ones do not. **QE's own control sentence already had this
right** (*"`Whalfguard` is also green on the two `import type` spellings — it only fails on
`export type * from`"*), so this is one generalisation in one BA/PM sentence, contradicted by a note
in the same stack and now by a third measurement.

**The consequence is small and points the safe way:** `A6.2` is **no longer the sole catcher** of
`Whalfguard` once `A6.3` exists — `A6.3` catches it too, and (see the sibling `decision`) the
witnesses this hop landed make that catch **executable in CI**. **The conclusion the sentence was
supporting still holds for a different reason**: `A6.2` carries `WTYPEREEXPORT-PANEL` and the
`WPERFT-DYN` restraint row, which `A6.3` does not, and `A6.3` catches `Wtypebrace`, which `A6.2` does
not. **Neither row may be dropped for the other; the "sole catcher" reason for it is what is false.**

**Flagged, NOT fixed.** The note is an immutable record (Workflow 16 appends and supersedes, it does
not rewrite) and the ticket's `A6.2`/`A6.3` wording is BA/PM's. **No criterion was edited, and the
build is unaffected either way.**

## 2. `## Test notes` 13's replacement grep for the expression site does not match the file

`grep -n 'history\\.ts");/m' src/history-pane.nfr.test.ts` → **exit 1, no match**. The pattern carries
one `)` too many; the working form is `grep -n 'history\\.ts";/m'`, which returns **`:317`** (the
executable site) and **`:350`** (the docblock quoting it).

The other five greps in note 13 reproduce exactly. **This is the sixth instance of the defect note 13
was written to end, inside note 13 itself** — and it is the one site on the page a reader cannot
recover by guessing, because the note deliberately deleted the line number it replaced. **Flagged for
BA/PM, not fixed.**

## 3. `plans/traceability.md`'s `ABC-029` row is MALFORMED — 11 content cells against 10 columns

Counted mechanically at this hop over the whole table:

| row | pipes | ends with `|` | content cells |
|---|---|---|---|
| every other ticket row (`ABC-001` … `ABC-028`) | 11 | **YES** | **10** |
| **`ABC-029`** | 11 | **NO** | **11** |

The row is missing its trailing pipe, so its last cell — the previous Engineer hop's
*"CONTAINMENT BUILT AND GREEN …"* status narrative — sits in an **eleventh column that the header
does not have**, and the `Status` column's own cell is the older *"Backlog — DoR NOT MET …"* text.

**How it slipped is worth recording, because the hop that produced it had a safeguard aimed at
exactly this:** its note records *"the cell count was re-counted after the join (12 before, 12
after)"*. Twelve is the count of `|`-split **fields**, and that number is 12 both for a well-formed
row (leading empty + 10 cells + trailing empty) and for this one (leading empty + 11 cells). **The
safeguard counted fields where the invariant is columns.**

**Flagged, NOT fixed, and my own append was made without touching it.** Repairing it means merging
two adjacent cells to preserve every word — an edit to another hop's recorded text on an 87 KB audit
surface, which this brief did not ask for. My append went to the **`Tests`** cell and the **`Status`**
cell by index, asserted pipe-free and newline-free before writing, with the row located by its leading
cell; the file's line count and the row's field count were asserted unchanged after the join, and
**exactly one line differs**. The pipe count is still 11 — I neither fixed nor worsened it. **Owner:
BA/PM or the Orchestrator.**
