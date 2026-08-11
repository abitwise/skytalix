---
id: 20260811T215000Z-ba-pm-decision-criteria-and-dor-rescore-8c4e1b73
kind: decision
by: ba-pm
at: 2026-08-11T21:50:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ABC-019
  - ABC-028
  - ABC-026
  - ABC-024
  - ABC-017
  - ABC-010
  - NFR-002
  - NFR-008
  - ADR-0002
  - ADR-0008
  - ADR-0011
  - RISK-ABC017-04
  - EPIC-002
  - EPIC-006
supersedes:
---

# The criteria, and the DoR re-score: `ABC-029` reaches `Ready` at 10 of 10 — and the hop that could have rubber-stamped it added a criterion instead

> **Hand-authored** — no `scripts/` directory exists in this repository. `kind: decision` needs no
> stamp; the measurements it rests on are in the sibling `observation` note and **none is recorded as
> a `finding`**, because no §14 gate ran here and `human_admission` is `off`.

## 1. `A3` — written in ONE form, and the single form HOLDS

**Form (b) adopted with its second clause DENIED**, exactly as `ADR-0011` rules. `src/perft-bench.ts`
**is** a production module (cl. 1), **is** an entry point (cl. 4), **is not** on the frame path
(cl. 2), and **stays in the regex's scanned set** (cl. 3).

**The *"either way, `WPERFT-STATIC` must still die, and it must die on the regex"* sentence is
HONOURED, not dropped** — re-measured at this hop on **both** trees: `WPERFT-STATIC` → regex **RED**,
probe green. **No measured kill is lost at `A3` and no loss had to be swallowed.**

**The single form holds, and it holds for a reason stronger than the ADR recorded:** under the ruling
the regex has **two** sole-catcher builds, not one — `WPERFT-STATIC` **and** `WOFFFRAME-STAT`
(`zobrist.ts`, off the frame path and unlicensed), both regex-RED / probe-green on both trees. The old
flag named two possible repairs; **the first was taken and the second — dropping the *either way*
sentence and swallowing a lost kill — was not needed.**

## 2. `A5` is NEW, and it is why this hop was not a rubber stamp

**`ADR-0011`'s load-bearing result — *"BASE green on both guards → `ABC-019` unblocked"* — is correct
on the 17-file tree it was measured on. `ABC-029`'s own gate runs on a 16-file tree with no
`src/turn-loop.ts`.** Criteria are what a build implements, so `A1`–`A4` as previously written admit
**three** builds that satisfy them and still leave `ABC-019` red (measured, sibling note §3):

1. **leave the regex at `toEqual([])`** — green on this ticket's own tree, so there is **no failing
   witness here for the regex half of the work**;
2. **hard-code the licence** as clause 3 reads literally — **RED on this ticket's own blocking gate**,
   so `ABC-029` never merges and the `P0` stays blocked **forever**;
3. **a subset check** — green on both trees and **silently drops `WSTALELICENCE`**.

`A5` forbids all three by naming **five builds across two named trees** with required verdicts, rather
than by saying "the suite is green here". **An implementation satisfying every row exists and was
measured; it is recorded as an existence proof and explicitly NOT mandated — the mechanism is the
Engineer's.**

**I did not edit `ADR-0011` and did not need to.** Clause 3's **property** (*a module may hold a
runtime import of the history module only if it is the licensed driver*) is satisfied on both trees.
What is tree-relative is the word *"today"* in its licence enumeration. The criterion states the
verdicts; the ADR keeps its property.

## 3. What the other criteria became

- **`A1`** — restated on clause 1 and made **countable**: *zero files are omitted from either guard's
  scanned set by a filename* (today **two**, both deleted). **The honest half, stated because a reader
  expecting zero filenames will not find zero: the literals CHANGE JOB — 2 exclusions → 0, and 6 cited
  declaration/licence entries appear (5 frame-path + 1 licence), each at exactly one site.** `A1`'s
  `turn-loop.ts` clause is satisfied **by the property**, and its **verification moves to `A5`**
  because its `Given` does not exist on the tree the gate runs on.
- **`A2` — UNCHANGED and still owed.** `WSTDOUT` in `glyph-mode.ts`, a declared frame producer, still
  corrupts the channel on **both** trees. Re-measured, not assumed.
- **`A4`** — first half unchanged (`src/history-pane.ts:30`; the three-site sweep reproduces exactly).
  **Second half re-pointed**: it named a phrase that has **never been in `src/`**. The inheritable
  defect is the probe's docblock at `src/history-pane.nfr.test.ts:253-262`, and the corrected wording
  is clause 3's — **the regex is not redundant because it holds a DIFFERENT property**, which is
  stronger and truer than *"the coverage is not nested"*.

## 4. `## Test notes` 3 corrected before it went false

*"`WINDIRECT` proves the probe guards the whole production graph"* is false the moment `ADR-0011`
lands — the probe guards the **frame path**. **`san.ts` is the correct transitive witness** (in the
closure, not a root, RED on both trees, measured). Corrected now rather than left for the QE hop that
would have re-run it as evidence.

## 5. Size and priority — both RE-DERIVED, both HOLD

**Size `S` (2) HOLDS.** The one condition that would have moved it — form (a) — was **rejected**, so
the `main()`-guard production change in `src/perft-bench.ts` never falls due. Still one existing test
file plus one comment line in one existing production file; no new module, test file, dependency,
input or architecture. `A5` adds a criterion, not a file. **New condition named in place of the old
one:** if `A2`'s channel fix needs **a third lane file** or **a dependency**, re-derive.

**Priority `P1` HOLDS**, re-derived on a re-taken measurement: production runtime importers on
`ABC-019`'s tip = **1** (`turn-loop.ts`), both delivered instruments still **RED** there, gate
`blocking`. **Still not `P0`:** the promotion trigger (*the frame path itself gains a runtime importer
of `src/history.ts`*) was **checked and has NOT fired** — frame closure **11 modules** on both trees,
`history.ts` absent. **Being on a `P0`'s critical path still does not make a ticket `P0`.**

## 6. THE DoR RE-SCORE — item by item, and the score MOVES

**10 of 10 MET — 9 clean `✅`, 1 `⚠️` met-with-caveat. The Definition of Ready is MET and `ABC-029`
reaches `Ready`.** The design hop reported items 4 and 10 *unblocked* and deliberately did not score
them; **that was a claim about inputs. This is the score.**

| # | item | prev | now | why |
|---|---|---|---|---|
| 1 | problem clear | ✅ | **✅** | pain now stated at its root: the two guards never held the same property |
| 2 | scope / out-of-scope | ✅ | **✅** | the two load-bearing fences **verified un-breached by measurement**: `perft-bench.ts` stays in the regex's reach (`WPERFT-STATIC` RED), and 15 → 5 roots keeps `WINDIRECT` (RED) and is by property, not for time |
| 3 | INVEST-shaped | ⚠️ | **⚠️** | *estimable* CLEARED (ruling made, form (a) rejected, `S` re-derived); *independent* still not clean — one file shared with `ABC-028`, and it gates `ABC-019` |
| 4 | acceptance testable + measurable | ❌ | **✅** | **CLEARED** — `A3` in one form, no opposing verdicts; `A1` countable; `A4` re-pointed; **`A5` added**. Every criterion carries a site, a discriminating build, a required verdict, a measured today-value |
| 5 | dependencies known | ✅ | **✅** | + the new measured one: the guard change must be run against **both** trees |
| 6 | security/NFR measurable | ✅ | **✅** | unchanged; **no target, bar or level moved** and `plans/nfr-catalog.md` was not opened |
| 7 | test notes | ✅ | **✅** | 7 → **10**, one corrected before going false |
| 8 | size | ✅ | **✅** | `S`, re-derived |
| 9 | priority | ✅ | **✅** | `P1`, re-derived |
| 10 | no major unresolved blocker | ❌ | **✅** | **CLEARED** — `ADR-0011` `accepted` by the owning role; **no owner ratification owed**, argued against `ADR-0008`'s precedent rather than assumed. Nothing this ticket needs is outside BA/PM |

**Item 3 is the single item scored by judgment rather than measurement, and it is flagged as such so
it can be disputed.** Both prior scorings recorded the same `⚠️` while routing to `Ready` through
items 4 and 10 only; the caveat is a **documented sequencing constraint**, not an unstated risk. **If
a reader scores it `❌`, the ticket returns to `Backlog`.**

## 7. The anti-smoothing check, run explicitly

**Would each `❌` clear if `ABC-019` were not behind it? Yes, both.** Item 4 failed because two forms
asserted **opposite verdicts on the same build** — a ruling picked one and I re-measured the result on
**10 builds across 2 trees** rather than taking the ADR's word. Item 10 failed because the answer was
**outside this role** — it no longer is.

**The direction of travel is the tell: this hop ADDED `A5`, corrected a test note that was about to go
false, and re-pointed `A4` at a different site. Smoothing removes obligations; this added three.**
`ABC-024`, `ABC-026`, `ABC-028` and this ticket's own first cut all chose `Backlog` over a smoothed
score, and that record is intact — **the score moved because the blocker was removed, not because the
bar was.**

## 8. Requested board move, and what is NOT mine

**`Backlog → Ready`.** `plans/board.md` was **not opened for edit** — it is the Orchestrator's — and
the ticket front matter still reads `column: Backlog` **deliberately**, so the two records cannot
disagree; it moves when the board does, by the role that owns the board.

**`Ready` is not `pull it now`: `ABC-028` still lands FIRST**, the two build hops share
`src/history-pane.nfr.test.ts` and must not run concurrently. That scheduling call is the
Orchestrator's.

**Not taken here:** no `src/` byte, no test line, no ADR edited or re-opened, `plans/nfr-catalog.md`
not opened, `ABC-017`/`ABC-019`/`ABC-028` tickets not touched, `../cli-chess-ABC-019` never opened.
**`NFR-002`'s `MET`/`MISS` remains Security/NFR's.** Nothing merged, nothing pushed, nothing deployed.

## 9. One item handed on rather than settled

**The bounded reach of clause 3's equality** — a licence whose file is **deleted** is vacuous rather
than red, and **that is not a choice**: `main` and *"the tip with `turn-loop.ts` deleted"* are the same
16 `cmp`-identical files. **An input for Architect/Design at the next hop that touches clause 3.** It
is not a blocker for this ticket: the property clause 3 states is satisfied on both trees, and
`WSTALELICENCE` is still caught in the form that can occur while the driver exists.
