---
id: ABC-073
title: 'Eight ticket pages restate `ABC-041` clause (b) and not one uses the test the clause states — six answer a file-touch or a delta, and two carry no fail-safe sentence at all'
status: backlog
column: Backlog
size: S
priority: P2
epic: —
feature: —
---

# ABC-073 — the misreading is not one ticket's; it is the house style

> **Cut 2026-08-16 by BA/PM** (task `refinement-abc066-security-qe`, Workflow 07) out of the
> **residual risk** Security/NFR named on `S1`: *"a later BA/PM copies the clause-(b) paragraph
> **without** its closing sentence and cuts a ticket that argues the gate away."* **Measured at the
> cut: that risk is already realised on two pages.** The clause's own shape is `ABC-072`; this ticket
> is the copies.

## Problem

*User*: the BA/PM cutting the next ticket, who copies the previous ticket's Security paragraph, and
the Orchestrator who routes on what that paragraph says.

*Pain*: **eight ticket pages restate `ABC-041` clause (b). Not one of them applies the test the clause
states.** Measured by grep on `main` @ `5cf86d3`:

| page | how it restates (b) | fail-safe sentence | status |
|---|---|---|---|
| `ABC-053` | **faithful** — *"fires if any non-`.test.ts` file under `src/` … reads `process.`"* — then heads the bullet **"Security: not triggered"** | ✅ present | Backlog |
| `ABC-054` | **delta** — *"any non-`.test.ts` file under `src/` **gaining** … a `process.` read"* | ✅ present | Backlog |
| `ABC-055` | **file-touch** — *"no non-`.test.ts` file under `src/` **touched at all**"* | ✅ present | Backlog |
| `ABC-057` | **file-touch** — same wording | ✅ present | Backlog |
| `ABC-058` | **delta** — *"gaining a builtin / `process.` read / …"* | ✅ present | Backlog |
| `ABC-059` | **file-touch** — same wording | ✅ present | Backlog |
| **`ABC-061`** | **file-touch** — *"no non-`.test.ts` file under `src/` touched"* | **❌ ABSENT** | Backlog, **`P1`, `DoR 10/10`** |
| **`ABC-065`** | **file-touch** | **❌ ABSENT** | **MERGED — not editable** |

Two independent misreadings, then: **file-touch** (five pages) and **delta** (three, counting
`ABC-066`'s *"no **new** `process.` read"*, which Security/NFR overturned at the gate). `ABC-053`
quotes the clause correctly and still answers *"not triggered"* — **the one page that gets the words
right contradicts itself in the same bullet.**

*Value*: **the fail-safe is the only thing holding this together, and it is already missing twice.**

- On `ABC-066` the fail-safe is what saved the ticket — Security/NFR said so in those words: *"The
  fail-safe worked. The reasoning above it did not."*
- **`ABC-065` had no fail-safe, and `In Security/NFR` was skipped on it** — on a file-touched reading
  of (b), which is the reading this table shows is endemic. The skip is on the record and arguable
  (`.grugops/context/pull-abc065-066-2026-08-16/notes/` @ `2026-08-16T03:00Z`); **this ticket does not
  re-open it.**
- **`ABC-061` is `P1`, `DoR 10/10` and pullable today**, with the file-touch wording and no fail-safe.
  It is the next ticket that can argue the gate away, and it is not hypothetical.

## Scope

**Seven Backlog ticket pages, one bullet each. Zero files under `src/`, zero tests, zero new spawns.**

- **Repair the (b) clause on**: `ABC-053`, `ABC-054`, `ABC-055`, `ABC-057`, `ABC-058`, `ABC-059`,
  `ABC-061` — each to `ABC-072`'s canonical wording, **cited by name rather than re-copied in full**.
- **Restore the fail-safe sentence** — *"Whichever way a reading is disputed, it fires and the gate
  resolves it"* — on the pages missing it (`ABC-061` today; re-measure at the hop, the set may have
  grown).
- **Each page keeps its own honest ANSWER.** This is a wording repair, not a verdict repair: a page
  that touches no production file still says so, in the vocabulary the ruling establishes. **Copying
  one answer onto seven pages is the failure mode this ticket exists to end.**

## Out of scope

- **`ABC-041`, `ABC-042`, `ABC-065`, `ABC-066` — every merged or gated page.** Not one line. The
  doctrine is `ABC-058` § *How the wording is repaired without touching a gated page* and it is not
  re-argued here. **The merged pages keep the wrong wording permanently; that is the cost of gating.**
- **Re-opening any merge, gate, verdict or routing decision** — including `ABC-065`'s skipped
  Security/NFR column. Named in the Problem because it is the value; **untouched by the Scope.**
- **Any criterion, size, priority, DoR score or acceptance row on the seven pages.** The `Security /
  NFR triggers` bullet only. A DoR score changes only if the ruling itself changes a ⚠️, and then it
  is stated, not slipped in.
- **`ABC-060`'s four pages (`ABC-043`–`ABC-046`).** Different clause (`A12` diff scoping), different
  pages, different ticket. Measured: none of the four restates clause (b). **The two hops may be
  scheduled together; the tickets are not merged into one.**
- **A guard that reads ticket pages** to assert the paragraph is quoted verbatim. Rejected at the cut
  — new lane cost for a document nobody executes; the reason is in this task's notes.

## Acceptance (Given/When/Then)

- **`A1` (every live copy matches the ruling).** **Given** the delivered commit, **when**
  `grep -l 'non-\`.test.ts\` file under' plans/tickets/` is run, **then** every Backlog page it
  returns states clause (b) in `ABC-072`'s ruled form, and **`ABC-041`, `ABC-065` and `ABC-066` are
  the only pages left carrying the old wording** — each because it is merged.
- **`A2` (the fail-safe is universal on live pages).** **Given** the delivered commit, **then** every
  Backlog page that restates clause (b) also carries the fail-safe sentence. **Count today: 6 of 7.
  After: 7 of 7.** *(`ABC-061` is the one; re-measure before trusting this number.)*
- **`A3` (no verdict was copied).** **Given** the seven pages, **then** each (b) answer still names
  **that page's own** measured facts — its own path count, its own file list — and **no two pages
  carry an identical (b) answer**. *(`ABC-055`, `ABC-057` and `ABC-059` are identical today; that is
  the symptom.)*
- **`A4` (the self-contradiction is gone).** **Given** `ABC-053`, **then** its Security bullet's
  heading and its (b) answer agree: it does not quote a firing clause under a "not triggered" header.
- **`A5` (nothing else on those pages moved).** **Given** the delivered commit, **then** for each of
  the seven pages the diff touches **only** lines inside the `## Security / NFR triggers` section —
  and every `## Acceptance` block is **byte-identical** by blob-level comparison of the section text.
- **`A6` (nothing else changed).** **Given** the delivered commit, `git diff --name-only <commit>~1
  <commit>` shows **exactly seven** `plans/tickets/ABC-0*.md` paths and **nothing else** — **0 paths
  under `src/`**, 0 new files. Suite green, skip **0**.

## Dependencies

- **`ABC-072` must land first — this is the ⚠️.** There is no canonical wording to propagate until
  the STATE-vs-DELTA ruling exists. **Doing this ticket first means propagating a guess to seven
  pages, which is strictly worse than the status quo.**
- **No dependency on `ABC-042`'s merge** (merged 2026-08-15 @ `dbaf972`), and none on `ABC-060`.
- **Ordering hazard, named**: `ABC-058`, `ABC-057`, `ABC-059` and `ABC-061` are all pullable. If one
  of them is pulled and merged before this ticket, its page leaves the editable set the way
  `ABC-065`'s did. **Re-measure the table at the hop; do not trust these eight rows blind.**

## Security / NFR triggers

- **`ABC-041`'s four clauses against this ticket's own diff** — answered in the form `ABC-072` is
  deciding, and stated both ways because the ruling may not have landed when this is read: **(a)** no
  manifest touch; **(b)** **under the STATE reading it FIRES** — 7 production files read `process.`
  on `main` today (`cli.ts`, `frame.ts`, `glyph-mode.ts`, `perft-bench.ts`, `render.ts`,
  `status-panel.ts`, `turn-loop.ts`), unchanged by this ticket — and **under the DELTA reading it does
  not**, 0 files under `src/` touched; **(c)** no test file touched — no network, no write, no spawn;
  **(d)** blast radius is seven markdown paths, none under `src/`. **Whichever way a reading is
  disputed, it fires and the gate resolves it.**
- **`N8-LANE`, inherited by name** — ≤ **650 ms CPU**. **0 new test files, 0 new files under `src/`,
  0 new child processes.** Lane cost **zero**, checkable from `A6`'s path list.
- **`NFR-002` not triggered.** No frame path, no production module opened.

## Test notes

1. **Re-measure the eight-row table before editing anything.** It was measured on `main` @ `5cf86d3`
   with `grep -rln 'non-\`.test.ts\` file under' plans/tickets/` and
   `grep -rln 'it fires and the gate resolves it' plans/tickets/`. Tickets merge; the set moves.
2. **The two greps are not interchangeable.** The first finds pages that restate the clause; the
   second finds pages carrying the fail-safe. `ABC-056` and `ABC-066` carry the fail-safe **without**
   restating (b) — do not read the second list as the first.
3. **Resist the copy.** The fastest way to close `A1` is one paragraph pasted seven times, which
   fails `A3` and reproduces the defect in a new spelling. Each page's answer is its own measurement.
4. **`ABC-058` is one of the seven and it is also mid-flight in the Backlog** — its own dependency
   block is stale (it says `src/cli.test.ts` does not exist on `main`; it does, and `ABC-042` merged).
   **That is a separate repair, owned by whoever next opens that page — do not silently ride it in
   here**, and if it has already been fixed, say so rather than re-fixing it.
5. **Label collision**: `ABC-058` carries a different `S1`/`S4`/`S5` (Security/NFR's `ABC-042`
   re-check). The `S1`/`S2` behind this ticket are `security-nfr-ABC-066`'s. Same labels, different
   authors.

## Size and priority rationale

**Size `S` (2).** Seven bullets is `XS` of typing; the `S` is `A3` — writing seven **different**
honest answers instead of one, and re-measuring the table first. **Not `M`**: nothing is designed and
no code moves.

**Priority `P2`.** Nothing is broken today and every live page still routes through the Orchestrator
regardless of what its page says. **Promotion triggers, named: (a)** promote to **`P1`** the moment
`ABC-061` is pulled — it is the page with the file-touch wording and no fail-safe; **(b)** promote if
a second page is found to have lost the fail-safe sentence, because the residual risk `S1` bounded on
"the sentence surviving in both places" is then unbounded.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-16**. **Result: 9 of 10 — NOT MET.** ⚠️×1, an ordering on `ABC-072`.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** eight pages tabulated by grep with their exact wording class and fail-safe state; two pages measured missing the sentence, one of them `P1` and pullable |
| 2 | scope and out-of-scope clear | **✅** seven pages, one bullet each; five fences including every merged page, `ABC-060`'s four, and the rejected guard |
| 3 | INVEST-shaped | **✅** one subject, one file type, one reviewer; deliverable in one hop once `ABC-072` rules |
| 4 | acceptance testable and measurable | **✅** two named greps, **6 of 7 → 7 of 7** on the fail-safe, no two identical (b) answers, section-only diffs, **exactly 7** paths, **0** under `src/` |
| 5 | dependencies known | **✅** `ABC-072` first (⚠️); `ABC-042` measured merged and NOT a dependency; the "a page may merge out of the set" hazard named |
| 6 | security/NFR triggers with a measurable target | **✅** all four clauses answered, (b) answered **under both readings** with the 7-file measurement, fail-safe carried; `N8-LANE` ≤ 650 ms, lane cost zero |
| 7 | test notes present | **✅** five, including the two-greps-are-not-the-same trap and the `ABC-058` stale-dependency warning |
| 8 | size assigned | **✅** `S` (2), with the reason it is not `XS` |
| 9 | priority assigned | **✅** `P2` with two named promotion triggers |
| 10 | no major unresolved blocker | **⚠️** `ABC-072`'s ruling must land first. Real, internal, and this ticket is deliberately **not** written to guess the outcome |
