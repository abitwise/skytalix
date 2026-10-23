---
id: ABC-052
title: The traceability `Status` column goes stale on every merge — 12 of 27 `Done` tickets today, and it grew by exactly two this morning
status: dropped
column: Done
size: S
priority: P2
epic: —
feature: —
---

# ABC-052 — the trace `Status` cell is not a backlog of stale rows, it is a defect the merge step produces

> **Cut 2026-08-13 by BA/PM** (task `home-the-gaps-2026-08-13`, subtask `refinement-home-the-gaps`,
> Workflow 07) from the `refinement-cut-039-040` hop, which **measured this and deliberately refused
> to fold it into `ABC-040`** — *"a different class, row-versus-board, ten rows, and including it
> takes `ABC-040` past `S`"*. That refusal is **upheld here**: this page is the ID that hop could not
> allocate.
>
> **THE PRIOR MEASUREMENT REPRODUCES EXACTLY, AND THE DEFECT GREW WHILE THE RECORD WAS BEING
> WRITTEN.** That hop measured **10 of 25**. Re-measured independently at this hop: **12 of 27**, and
> the two new members are **`ABC-021` and `ABC-026` — the two tickets that merged this morning.** The
> other ten are the same ten. **This is not a backlog of stale cells. It is one stale cell per
> merge**, and a repair that only fixes today's twelve is stale again at the next merge — the exact
> *refresh a number* trap `ABC-030`'s `## Out of scope` refuses.

## Problem

*User*: anyone — a human, an auditor, the next Orchestrator — asking `plans/traceability.md` the one
question it exists to answer: **did this requirement ship?**

*Pain*: for **12 of the 27** `ABC-` tickets standing in `plans/board.md`'s `Done` column, the live
`plans/traceability.md` row's `Status` cell contains **no occurrence of the word `Done`**. Measured
at this hop on `main`, by first-row-per-id over the escape-aware 10-cell split:

```
ABC-013  ABC-016  ABC-017  ABC-018  ABC-019  ABC-021
ABC-022  ABC-023  ABC-025  ABC-026  ABC-027  ABC-029
```

`ABC-021`'s cell ends *"Column: still `In Review` on `main`"* — written by the gate hop, correct when
written, **false since the fast-forward hours later.** `ABC-026`'s cell is still its refinement-era
text. **The board and the trace disagree about 44% of what shipped.**

**Method, stated so the number can be argued with:** a word-presence probe over the **first** row per
id (the live one), on the raw cell text. **The count is a measurement; reading it as *"the Status
column is stale for twelve tickets"* is a judgement and is `UNKNOWN - verify`** — a row could record
the same fact in other words. The prior hop stated this caveat and it is carried, not dropped.

*Value*: the trace stops disagreeing with the board about what shipped, **and stops re-acquiring the
defect at the next merge.** The second half is the one worth buying.

## Scope

1. **The control.** A probe under `tools/grugops/` that reads `plans/board.md`'s `Done` column and
   `plans/traceability.md`, and reports every id whose live row does not record the ticket reaching
   `Done`. **Exit non-zero when the report is non-empty.** *(`tools/grugops/` already holds
   `reference-check.js` and `test-skip-integrity.js`; this is that pattern, not a new one.)*
2. **The one-time discharge.** For each id the probe reports, **APPEND** a dated sentence to the
   `Status` cell recording the terminal state and the commit that reached it.

## Out of scope

- **The duplicate-row reconciliation.** `ABC-040`'s, and this ticket runs **after** it — see
  `## Dependencies` for the specific interaction.
- **Shortening, rewriting or deleting ANY `Status` cell, or any other cell.** `ABC-040`'s rule `R4`
  binds here unchanged: *no dated record may be dropped.* The live `ABC-028` cell is 50,168
  characters and stays that way. **This ticket only appends.**
- **`plans/board.md`.** Read as the authority for the `Done` column; **never written.**
- **Any ticket page, any ADR, `plans/metrics.md`, `plans/nfr-catalog.md`, anything under `src/`.**
- **Wiring the probe into a workflow, a gate, or an `AGENTS.md` command slot.** **Owner: the
  Orchestrator, with the `AGENTS.md` Scribe lane if a slot is wanted.** Named rather than absorbed —
  see `RISK-ABC052-01`.
- **The `_Updated:` header-line convention.** The prior hop flagged that it added none and left the
  decision to the Orchestrator. Unchanged here; not this ticket's question.

## Acceptance (Given/When/Then)

**A1 — the property holds, stated as an equality with NO literal count in it. Given**
`plans/board.md` and `plans/traceability.md` as they stand after the repair, **when** the probe runs,
**then** the set of ids it reports is **EMPTY**, and it exits **0**.

> **The criterion deliberately carries no number.** `12`, `27` and `44%` appear in `## Problem` as
> today's measurement and appear in **no criterion**. `ABC-024`'s `A4` carried `625` inside a
> criterion and went false when the lane grew around it; `ABC-040`'s `A1` is a three-way equality for
> the same reason. **A criterion holding a constant is a criterion with an expiry date.**

**A2 — the probe can FAIL, proved by a wrong tree rather than by a green run. Given** the repaired
tree, **when** exactly one repaired `Status` cell has its appended sentence removed, **then** the
probe exits **non-zero** and names **that id and no other**; **and when** it is restored, the probe
exits **0**. *(A control that has never been seen to fail is a control nobody has tested. This board
has the measurement: `ABC-028`'s `F4` — an instrument whose false positives grow with discussion of
its own rule is not an instrument.)*

**A3 — nothing was lost to buy currency. Given** the diff for the whole ticket, **then**
`git diff --numstat -- plans/traceability.md` shows **ZERO deletion lines**; the row count and the
distinct-id count are **identical before and after**; every touched row still splits to the same cell
count as before under the escape-aware split; and `git diff -- plans/board.md` is **EMPTY**.
*(Zero deletion lines is the strongest available proof that no dated record was dropped — `ABC-026`'s
own standard, applied to the file `R4` protects.)*

**A4 — the appended sentence states a fact that can be checked, not a status that can rot. Given**
each appended sentence, **then** it names **the terminal column, the date, and the commit** that
reached it — a **dated record**, which `R5` makes permanent — rather than a bare present-tense
status. *(A cell that says *"Done"* is the same defect one column-move from now. A cell that says
*"reached `Done` 2026-08-13 at `6375fae`"* is true forever.)*

**A5 — no `src/` byte and no gate moved. Given** the whole ticket, **then**
`git diff --numstat -- src/` is **EMPTY**; lint, typecheck, build and `npm test` each exit **0**;
the test-file count, suite total and skip count are **identical before and after**. **Measure the
tip; do not paste a number from this page.**

## Dependencies

- **`ABC-040` must land first — OPEN, and the interaction is specific, not general.** `ABC-040`
  MERGES the two `ABC-029` rows (a 2,404-byte merge) and DELETES the stale `ABC-028` row.
  **`ABC-029` is one of the twelve ids this ticket repairs.** Appending to its live cell before the
  merge means `ABC-040` must carry this ticket's edit through its own reconciliation — and both hops
  write the same file. **Ordering, one direction, for a named reason.**
- **The concurrent `EPIC-006` decomposition lane is appending rows to `plans/traceability.md` right
  now.** Its rows are for new tickets and are not in the `Done` column, so they do not change the
  property — but **the Orchestrator sequences this against any trace-appending hop**, exactly as it
  already does for `ABC-040`.
- **Read, never written:** `plans/board.md`'s `Done` column (the authority), `ABC-040`'s precedence
  rules `R1`–`R5`.

## Security / NFR triggers

- **Security: no trigger, not pre-waived.** The probe reads two tracked markdown files in the
  repository and writes nothing; no network, no shell interpolation of file content, no runtime
  dependency added, no stream written outside its own report. **Firing threshold:** any write by the
  probe to any path, or any dependency added to `package.json`.
- **`N8-LANE`: does not fire, and that is a MEASURED non-trigger rather than a waiver.** This ticket
  adds **zero test files** and **zero tests** — the probe is a `tools/grugops/` script run by hand,
  not a vitest file. The 160 ms-per-file term is **+0** by construction. **If the hop decides the
  probe needs a test file, that changes the answer and is a stop-and-report.**
- **`NFR-002`, `NFR-003`, `NFR-008`: not reached.** Zero `src/` bytes, asserted by `A5`.

## Test notes

1. **`A2` is the criterion that decides whether the control is real.** Build it, break one cell,
   watch it fail, restore.
2. **The probe must read the `Done` column from the board, never a hard-coded id list.** A list is
   the same defect with a different file name — and it is the defect this ticket exists to end.
3. **Do not "fix" a row by making the board agree with it.** The board is the authority for the
   column; the trace records the trail. If they disagree, the trace is what moves.
4. **Twelve is today's number and it will be wrong when this ticket is pulled.** Re-measure at the
   start of the hop. The prior hop's `10 of 25` was correct on 2026-08-13 at `be0f92b` and was
   `12 of 27` the same afternoon.
5. **`ABC-028`'s live cell is 50,168 characters.** Append; do not reformat, do not wrap, do not
   "tidy". `R4` forbids buying brevity with dated history.

## Risks

**`RISK-ABC052-01` — the control is not wired to anything, so the defect can recur between runs.**
Named, not absorbed. Nothing in this repository runs `tools/grugops/*` automatically; there is no CI.
**A probe nobody runs is decoration**, and this ticket cannot fix that from inside its own scope
because the integration point is `AGENTS.md`'s command slots and the merge step — **the
Orchestrator's, with the `AGENTS.md` Scribe lane.** The honest statement: **this ticket makes the
defect DETECTABLE in one command; it does not make it IMPOSSIBLE.** `UNKNOWN - verify` on whether
detection alone changes the outcome — this board's own measurement of *"whoever next opens it"* is
**0-for-2**, and that is the argument for wiring it rather than for trusting it.

## Size and priority rationale

**Size `S` (2), and it is at the TOP of `S`.** One probe of roughly the size of the two scripts
already in `tools/grugops/`, twelve mechanical cell appends, and one wrong-tree demonstration. It is
not `XS` — twelve appends in a file governed by five precedence rules is real care, and `A2` needs an
instrument. It is not `M`: no design decision is open, the rule set is ratified on `ABC-040`'s page,
and the repair shape is one sentence repeated. **If the hop finds the appends need judgement
per-row rather than one shape, that is the signal it is bigger than `S` — say so and split, do not
pad.**

**Priority `P2`.** The defect is **growing** — measured `+2` in one morning, with three roles
watching — which is what lifts it above the rest of the records debt. It is not `P1`: no user is
blocked, no build is wrong, no test fails, and the board (which IS current) answers the same question
correctly today. It is not `P3`: at one stale cell per merge, the cost of waiting is linear in
merges, and `EPIC-003` and `EPIC-006` are about to produce a lot of merges.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-13**. **Result: 8 of 10 clean, 2 recorded ⚠️ — NOT MET; stays in `Backlog`.**
**Deliberately not smoothed:** both ⚠️ are the same open ordering dependency seen from two checklist
items, and it is genuinely open.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** the user, the question the file exists to answer, twelve named ids re-measured independently at this hop, the method stated so it can be argued with, and the growth rate measured rather than asserted |
| 2 | scope and out-of-scope clear | **✅** two deliverables; six fences, including `R4`'s no-shortening rule and the explicitly out-of-scope integration point with its owner named |
| 3 | INVEST-shaped | **⚠️** valuable, negotiable, estimable, small, testable — **not fully independent**: it edits the file `ABC-040` reconciles, and `ABC-029` is in **both** ticket's sets. Ordering, one direction, with the specific interaction named |
| 4 | acceptance testable and measurable | **✅** five criteria: an equality with **no constant in it**, a wrong tree the probe must fail on, **zero deletion lines**, a dated-record form for the appended sentence, and an empty `src/` diff |
| 5 | dependencies known | **✅** one open ordering dependency with its mechanism named; the concurrent trace-appending lane named and assessed as not changing the property |
| 6 | security/NFR triggers with a measurable target | **✅** security assessed with a falsifiable firing threshold; `N8-LANE` shown to be a **measured non-trigger** (+0 files) with a stop-and-report if that changes; the three unreached NFRs named |
| 7 | test notes present | **✅** five, including *re-measure at pull time* and the 50,168-character warning |
| 8 | size assigned | **✅** `S` (2), placed at the top of `S` with the split signal stated in advance |
| 9 | priority assigned | **✅** `P2`, argued from a **measured growth rate**, with both the not-`P1` and not-`P3` cases |
| 10 | no major unresolved blocker | **⚠️** **`ABC-040` is OPEN** and unpulled. Named, owned, sequenced by the Orchestrator — and the reason this sits in `Backlog` |

### Requested board placement 2026-08-13 by BA/PM at `refinement-home-the-gaps`: `Backlog`

**Requested, not taken** — `plans/board.md` is the Orchestrator's. `Backlog`, and it could not go to
`Ready` in any case: the Definition of Ready is **8 of 10, NOT MET.**

## Re-score — 2026-10-12 (BA/PM, subtask `bapm-rescore-backlog-process`, `main` @ `1eb2edbc`)

**Verdict: DoR 8/10. Stays `Backlog`. Both old ⚠️ are discharged; two new ⚠️ replace them, and both
come from one owner question (below).** Readings and commands are in
`.grugops/context/bapm-rescore-backlog-process/notes/` (observation note, § ABC-052). Board md5
`be514ce68361fb27254ad574c8a95dae`; trace md5 `eb3233b22053441f60f6f91cf4f479f8`.

**The re-measured count (same method as the page, plus two others):** the board's `Done` column holds
**134** ids, and every one has at least one trace row.
- **94 of 134** have a first row whose `Status` lacks the word `Done` (the page's method; was 12 of 27).
- **77** have no row whose `Status` holds `Done`.
- **56** have no cell anywhere holding `Done`.
- The original twelve are all still in every set.

**Why the page's method and scope no longer fit:**
- Since `05eecc1a` (2026-08-17), each hop **appends its own row** and touches nothing in place. So the
  first row per id is the cut row by construction. "First row lacks `Done`" now measures the
  convention, not staleness.
- The word probe misfires both ways. `(BA/PM fold)` rows reading "`Done` (unchanged)" count as
  recorded. `ABC-105`'s cut row counts because it says "flags 9 `Done` tickets".
- **Nobody records the move to `Done` in the trace at all.** That move is a board-only act. The defect
  is not "one stale cell per merge". It is "the merge step writes no trace row".
- Scope item 2 (append a sentence **inside** each `Status` cell) contradicts today's append-a-row
  convention. It is also no longer `S`: 94 rows, and **28 of 134** board `Done` rows carry no merge
  date+sha, so those need a per-row `git` lookup. **That is the page's own split signal.**
- **`ABC-052` has never had a trace row of its own** (`git log -S'| ABC-052'` → none). This hop's
  appended row is its first.

**Discharged:** the `ABC-040` ordering ⚠️ (items 3 and 10). Appending rows never edits `ABC-029`'s
cell, so the two tickets now only share a file. That is sequencing, not a dependency.
**New facts for the design:**
- `ABC-105`'s `tools/grugops/qe-hop-integrity.js` exports `parseDone(boardText)`, which reads exactly
  the `Done` ids this probe needs.
- Its Done-exit practice (`memory-bank/40-contributing.md` § Conventions: the Orchestrator runs
  `--ticket` at every move to `Done`, forward-only from a committed cutover) is the wiring precedent
  `RISK-ABC052-01` lacked.

**Owner question (exact):** *"For 94 of the 134 `Done` tickets, `plans/traceability.md` does not record
that the ticket reached `Done`, and no hop writes that record today. Which do you want?*
- *(A) The board's `Done` column is the only record of column state. One dated legend paragraph in the
  trace says so, and `ABC-052` is dropped. Size `XS`; Orchestrator's paragraph.*
- *(B) Forward-only: from a committed cutover, the Orchestrator appends one dated `ABC-xxx (done)` row
  (date + merge sha) at every move to `Done`, and a probe reusing `parseDone` checks it at the Done
  exit, like `qe-hop-integrity --ticket`. Size `S`.*
- *(C) (B) plus a one-time backfill row for each of today's 94 (28 need a `git` lookup). Size `M`; I
  would split it off as its own ticket."*

**BA/PM recommendation: (A).** `AGENTS.md` § Mission already says "the board is the state". The board
answers "did it ship?" correctly today. The delivery audit names the record as this factory's waste.
(B) is the fallback if the owner wants the trace to carry it.

**Criteria amendments (2026-10-12), applying under (B)/(C) only; (A) replaces the ticket:**
- **`A1`** ~~reports every id whose live row does not record `Done`~~ → the probe reports every
  in-scope `Done` id (per `parseDone`, minus the cutover snapshot under (B)) for which **no** trace row
  whose first cell names the id contains `` reached `Done` YYYY-MM-DD at `<sha>` ``. An empty set exits
  0. The id rule must handle multi-id first cells (`ABC-154 / ABC-155 (cut) + …`).
- **Scope item 2** ~~APPEND a dated sentence to the `Status` cell~~ → append **one row per id**.
  Nothing is touched in place. `A3` (zero deletion lines) is unchanged and now holds by construction.
- `A2`, `A4`, `A5` unchanged.

**DoR 8/10:** 1 ✅ (re-measured three ways), 2 ✅ (each option's scope and fences stated), 3 ✅
(independent of `ABC-040` once rows are appended), 4 ✅ (amended `A1` testable under (B)/(C)), 5 ✅
(`ABC-040` sequencing only; `parseDone` reuse), 6 ✅ (unchanged; a probe test file would fire
`N8-LANE`, which is still a stop-and-report), 7 ✅, 8 ⚠️ size depends on the answer (`XS` / `S` /
`M`), 9 ✅ `P2` kept, 10 ⚠️ the owner question above is open. Items 8 and 10 are the same open
question.
