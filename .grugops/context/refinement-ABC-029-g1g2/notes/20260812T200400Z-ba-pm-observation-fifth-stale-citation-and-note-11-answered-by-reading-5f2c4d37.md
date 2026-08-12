---
id: 20260812T200400Z-ba-pm-observation-fifth-stale-citation-and-note-11-answered-by-reading-5f2c4d37
kind: observation
by: ba-pm
at: 2026-08-12T20:04:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ABC-028
  - A4
  - A6
  - src/history-pane.nfr.test.ts
  - plans/tickets/ABC-029-production-module-scope-and-load-probe.md
supersedes:
---

# The fifth stale-citation instance on this stack — and `## Test notes` 11's open question is ANSWERED by opening the file: ONE block, and both obligations are already TRUE

> **`kind: observation`.** Every line number below was taken from the file at
> md5 `1d33bea667cc792e1fa1fd4030caa718`, read at this hop. No stamp claimed.

## The live sites, and the `grep` that re-finds each

| site | the record says | **live** | the `grep` |
|---|---|---|---|
| the regex guard's `it(` | `:228` / `:230-244` / `:314`+ | **`:302`** | `grep -n 'it("licenses' …` |
| the regex **expression** | `:247` / `:314` | **`:317`** | `grep -n 'history\\.ts");/m' …` |
| the probe's `it(` | `:275` / `:277-283` | **`:384`** | `grep -n 'it("evaluates' …` |
| the probe's docblock | `:253-262` **and** `:346-351` | **ONE block, `:334-383`** | `grep -n '^  /\*\*' …` |
| `productionModulesIn` | `:237-239` | **`:163`** | `grep -n 'productionModulesIn =' …` |
| the two deleted literals | `:281-282` | **gone** — `FRAME_PRODUCERS` `:187`, `LICENSED_DRIVERS` `:212` | `grep -n 'FRAME_PRODUCERS\|LICENSED_DRIVERS' …` |

**The `:314` → `:317` move QE reported reproduces.** And the Orchestrator's own correction reproduces
too: **the two guards begin at `:302` and `:384`, not at `:314`+** — `:314` is the `const directory`
line and was never either guard's start. **Two roles were briefed on that wrong number and neither
could have caught it from the record alone**, which is why it is written into the ticket rather than
only here.

## `## Test notes` 11 — ANSWERED, and the answer removes an obligation rather than adding one

The note asked whether `A4`'s docblock site and the containment's docblock site are one block or two,
and said: *"If they are ONE block the Engineer corrects it once; if they are TWO, BOTH must be true
after the change."* **The record gave two ranges and `ADR-0011` did not disambiguate.**

**Read at this hop: ONE block, `:334-383`.**

- **`A4`'s obligation is carried at `:335-343`** — *"a DIFFERENT property from the guard above, over a
  DIFFERENT set. Neither is a weaker version of the other and neither may be deleted as redundant"*,
  with `ADR-0002` clause 4's licence equality named as the reason. **Already TRUE.**
- **`A6`'s obligation is carried at `:354-361`** — *"THE RESIDUAL IS THE TWO DYNAMIC FORMS AND IT IS
  NAMED HERE RATHER THAN LEFT AS A COMPLETED LIST"*, with re-export named as the miss the silence hid.
  **Already TRUE.**

**So the two clauses are ONE satisfied obligation, not two open ones, and the Engineer corrects nothing
there.** *(The Engineer's own hop reported this conclusion; I did not accept it — I re-derived it by
reading the block.)*

## The rule this hop wrote down, in place of the numbers

**`## Test notes` 13: stop citing line numbers in this file; cite the `grep` that re-finds the site.**
This is the **fifth** instance of one defect on this stack — `A4`'s `:253-262`, note 11's two ranges,
`A11`'s four dated measurements, the guard's `:314`, and now these. **It is stale, not
wrong-at-the-time**, and nothing depends on it a `grep` cannot re-find.

**Only LIVE sites were corrected.** Two: `A4`'s CORRECTED clause (which cited `:253-262` as a
criterion's `Given`) and `## Test notes` 11. **Dated, attributed measurement blocks keep their line
numbers untouched** — they were right about the file they were taken against, and rewriting them would
destroy the audit trail. That fence was in the brief and it held.

## One adjacent thing observed and NOT acted on

The docblock at **`:363-367`** already states *"`(?!type\b)` APPLIES TO BOTH KEYWORDS AND THAT IS
LOAD-BEARING"* and explains `Whalfguard`. **It is silent on the WORD BOUNDARY itself** — which is the
gap `Wtypebrace` walks through. **I did not add a docblock obligation for it:** `A6.3` is a required
verdict and rows are this ticket's enforcement mechanism, and inventing a second prose obligation for
the Engineer to satisfy would be adding scope the brief did not ask for. **Recorded here so the next
hop that opens that block can add a sentence for free if it wants one.**
