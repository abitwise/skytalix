---
id: 20260818T214500Z-ba-pm-observation-four-things-found-and-deliberately-not-cut-d1f4a7b5
kind: observation
by: ba-pm
at: 2026-08-18T21:45:00Z
verified_by:
confidence: high
refs:
  - ABC-078
  - ABC-087
  - ABC-108
  - AR-NFR004-A
  - N8-LANE
  - RISK-002
supersedes:
---

# Four things found and **deliberately NOT cut** — the brief allowed exactly one ticket, and this is the routing list

**This is not a stamp.** Hand-authored `observation`; no `finding` is admissible on this install.
**Nothing below was fixed, ticketed or smoothed. Each is stated so the Orchestrator can route it.**

## 1. `AR-NFR004-A` has a named owner and a named hop, and **`ABC-087`'s page has never heard of it**

Security/NFR's accepted risk reads: *"Owner: Security/NFR, at `EPIC-006`'s difficulty hop
(`ABC-087` if that lands first). Discharge: that hop either passes ~2 900 ms, making the clause
literally true at zero cost, or re-accepts this risk in writing with its number."*

**Measured on the page it points at:** `plans/tickets/ABC-087-difficulty-levels-as-budget-plus-blunder-rate.md`
contains **0 occurrences of `AR-NFR004-A`** and **0 occurrences of `2 900` / `2900`**. Its `A5` and
its trigger section quote `NFR-004`'s 3 s / 5 s bars, so the ticket is on the right subject —
**it simply does not know that a specific number, a specific choice and a written re-acceptance are
owed at it.**

**This is the exact failure mode Security/NFR named one clause earlier in its own ruling**, about
clause B: *"Deferring enforcement to a hop that has not been told the constraint exists is not
deferral; it is loss."* The same sentence applies here, one risk over.

**Not cut, and it is not a ticket anyway.** It is one paragraph on `ABC-087`'s page, and **whose pen
that is is not obvious**: the risk is Security/NFR's, the page is BA/PM's, and writing it would be
BA/PM adding a discharge obligation to a Backlog ticket on another role's authority. **Route it.**
The cheapest correct hop is a one-paragraph annotation on `ABC-087` quoting `AR-NFR004-A` verbatim
with its owner and both discharge routes.

## 2. `ABC-078`'s ticket frontmatter says `column: Backlog` while the board has it in `In Security/NFR`

Measured: `plans/tickets/ABC-078-…md:5` reads `column: Backlog` and `status: backlog`. The board
row records `Backlog → In Development → In Review → In Security/NFR`, all on 2026-08-18.
`ABC-035`'s frontmatter tracked correctly (`In Review`), so this is drift on one page rather than a
convention nobody follows.

**Not touched, on purpose: column moves are the Orchestrator's**, and I decline to edit a column
field on a page in flight even when it is only catching up to the board. **Route it, or fold it
into the repair hop that is already opening this page.**

## 3. `A4`'s failure shape — *"assert it by grep"* — is a pattern, and nobody has swept for it

QE's `G2` is not really about a depth cap. It is about a criterion whose four checks are **source
regexes, `Object.keys` and `Function.length`** — **not one of them runs the thing it is asserting
about.** That guard passes on a build that violates `RISK-002`, this epic's non-negotiable
inherited constraint.

**I did not sweep the other 97 ticket pages for the same shape**, because the brief allowed one
ticket and a sweep would produce a second. **I expect it is not unique.** If it is worth knowing
how many acceptance criteria in this repo are satisfied by text rather than by behaviour, that is a
small BA/PM refinement hop, and it is the kind of question best asked once rather than discovered
one gate at a time. **Named, not cut.**

## 4. Every page in flight and in `Backlog` carries an `N8-LANE ≤ 650 ms` line over a budget under question

This is the consequence `ABC-108` exists for, and it is recorded here as **repo state rather than a
second ticket**: the honest fix is **the ruling**, not a mass edit of ticket pages, and a mass edit
before the ruling would bake in whichever answer the editor guessed. **`ABC-108`'s `A6` is written
to close it in one sentence** — *whether the 5% slice may be granted from that date and against
what total*.

**One page is already an exception and it is deliberate:** `ABC-108` itself carries **no** `N8-LANE`
line, because it cannot honestly quote 5% of the total it exists to re-measure. **Do not
"complete" it.**

## What I did NOT do, stated plainly

**I did not rule `OQ-1`** — I cut it; the ruling is Architect/Design's. **I did not open
`plans/nfr-catalog.md` for writing**: Security/NFR owns those rows, its append moved no bar, and
the eight table rows hash identically before and after it. **I relaxed no bar, floor or level
anywhere.** **I touched nothing under `src/`, moved no board column, merged nothing and deployed
nothing.** **I cut exactly one ticket.**
