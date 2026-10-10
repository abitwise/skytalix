---
id: ABC-073
title: 'Eight ticket pages restate `ABC-041` clause (b) and not one uses the test the clause states — six answer a file-touch or a delta, and two carry no fail-safe sentence at all'
status: backlog
column: Backlog
size: XS
priority: P3
epic: —
feature: —
---

# ABC-073 — the misreading is not one ticket's; it is the house style

> **Cut 2026-08-16 by BA/PM** (task `refinement-abc066-security-qe`, Workflow 07) out of the
> **residual risk** Security/NFR named on `S1`: *"a later BA/PM copies the clause-(b) paragraph
> **without** its closing sentence and cuts a ticket that argues the gate away."* **Measured at the
> cut: that risk is already realised on two pages.** The clause's own shape is `ABC-072`; this ticket
> is the copies.
>
> **Re-scored 2026-10-10 by BA/PM** (task `wave-2026-09-25`, subtask `rescore-batch-2-2026-10-10`)
> at wave tip `f76e041`. **The table moved, and the risk that made this `P1` is not live on any
> open page.** It was re-measured over whitespace-normalized text: the per-line grep in test note 1
> reports `ABC-058`/`ABC-059` as missing the fail-safe, but their sentence is wrapped across lines.
> `ABC-061` merged on 2026-08-17 without the fail-safe; that is the ordering hazard below, and it
> fired. **Live restaters: 6** (`ABC-053`, `054`, `055`, `057`, `058`, `059`). **The fail-safe is
> on 6 of 6**, so `A2` is already met. No page cut since August restates clause (b). The
> page/board disagreement is closed: the page said `P2` and the board said `P1` (promoted
> 2026-08-17 when `ABC-061` was pulled). **→ `P3`, `S` → `XS`.** DoR 9/10, the ⚠️ is still
> `ABC-072`. On 2026-10-10 this re-score already rewrote the (b) answer on `ABC-055`/`057`/`058`/
> `059` to state both readings with each page's own facts. That is an interim form, not a ruled
> one: no wording was guessed.
>
> **Re-measured 2026-10-10 by BA/PM** (subtask `bapm-followups-2026-10-10`) at wave tip `71418879`.
> **The live set is ONE page: `ABC-055` (`Ready`).**
> - `ABC-053`, `054`, `057`, `058` and `059` are `Done`. `ABC-059` merged as `4c33b72b`.
> - The fail-safe is on 1 of 1.
> - **`A4` is void:** `ABC-053` is merged and gated, so its page is not edited.
> - **`A1` repaired.** Three `Done` pages (`057`, `058`, `059`) carry the interim "unruled" text and
>   can never be edited, so the "unruled" grep now counts non-`Done` pages only.
> - **Disposition: FOLD into `ABC-072`'s hop**, as § Size and priority already allows. `ABC-072`
>   `A6` now allows these paths. The ruling exists (`ADR-0036`, DELTA), so the ⚠️ clears → DoR
>   10/10.
> - **Not discharged on its own.** Closing it without a hop drops a ticket, and this board drops
>   only on the owner's word (`ABC-038`, `ABC-060`).
> - **If `ABC-055` is `Done` before `ABC-072`'s hop,** the set is empty, and this ticket closes on
>   that measurement at the same hop.
>
> Readings: `.grugops/context/bapm-followups-2026-10-10/probe/RUN.txt`.

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

**The Backlog pages that still restate clause (b), one bullet each. Zero files under `src/`, zero
tests, zero new spawns.** *(Re-scoped 2026-10-10: six pages, not seven, because `ABC-061` merged.
Any of `ABC-055`/`057`/`058`/`059` merged before this hop leaves the set too.)*

- **Repair the (b) clause on**: `ABC-053`, `ABC-054`, `ABC-055`, `ABC-057`, `ABC-058`, `ABC-059` —
  each to `ABC-072`'s canonical wording, **cited by name rather than re-copied in full**. **The set
  is the union of two greps** (2026-10-10). The first is the restating grep in test note 1, which
  finds `053`/`054`. The second is `` grep -l 'reading is unruled (`ABC-072`)' plans/tickets/ ``,
  which finds the four pages this re-score rewrote: their interim text no longer quotes the
  clause's subject phrase.
- **Keep the fail-safe sentence** — *"Whichever way a reading is disputed, it fires and the gate
  resolves it"* — on every page in the set (6 of 6 carry it at `f76e041`; re-measure at the hop).
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
  `grep -l 'non-\`.test.ts\` file under' plans/tickets/` and the "unruled" grep in § Scope are run,
  **then** every non-`Done` page that either returns states clause (b) in `ABC-072`'s ruled form, and
  the "unruled" grep returns **0** pages, and **every page left carrying the old
  wording is `Done`** (at `f76e041`: `ABC-041`, `ABC-061`, `ABC-063`, `ABC-064`, `ABC-065`, `ABC-067`,
  `ABC-082`), each because it is merged.
  *(2026-10-10, `71418879`.)*
  - **"The 'unruled' grep returns 0 pages" now reads "0 non-`Done` pages, this page excluded".**
    `ABC-057`, `058` and `059` merged with the interim text and are fenced by § Out of scope.
  - **The `Done` set carrying old or interim wording is now** `ABC-041`, `053`, `054`, `057`, `058`,
    `059`, `061`, `063`, `064`, `065`, `067` and `082`.
  - **The live set is `ABC-055`.**
- **`A2` (the fail-safe is universal on live pages).** **Given** the delivered commit, **then** every
  Backlog page that restates clause (b) also carries the fail-safe sentence, counted over
  whitespace-normalized text. **6 of 6 at `f76e041`, and still n of n after the hop.** *(1 of 1 at
  `71418879`.)*
- **`A3` (no verdict was copied).** **Given** the pages in the set, **then** each (b) answer still names
  **that page's own** measured facts — its own path count, its own file list — and **no two pages
  carry an identical (b) answer**. *(`ABC-055`, `ABC-057` and `ABC-059` are identical today; that is
  the symptom.)*
- **`A4` (the self-contradiction is gone).** **Given** `ABC-053`, **then** its Security bullet's
  heading and its (b) answer agree: it does not quote a firing clause under a "not triggered" header.
  *(2026-10-10: **VOID.** `ABC-053` is `Done` and merged, and § Out of scope fences every merged
  page. Its self-contradiction stays on the record, as `ABC-065`'s wording does. Not struck
  silently.)*
- **`A5` (nothing else on those pages moved).** **Given** the delivered commit, **then** for each
  page in the set the diff touches **only** lines inside the `## Security / NFR triggers` section —
  and every `## Acceptance` block is **byte-identical** by blob-level comparison of the section text.
- **`A6` (nothing else changed).** **Given** the delivered commit, `git diff --name-only <commit>~1
  <commit>` shows **exactly** the set's `plans/tickets/ABC-0*.md` paths (6 at `f76e041`) and
  **nothing else** — **0 paths
  under `src/`**, 0 new files. Suite green, skip **0**. *(2026-10-10: 1 at `71418879`, `ABC-055`.
  When folded, `ABC-072` `A6` is the binding path list, and this row is read inside it.)*

## Dependencies

- **`ABC-072` must land first — this is the ⚠️.** There is no canonical wording to propagate until
  the STATE-vs-DELTA ruling exists. **Doing this ticket first means propagating a guess to seven
  pages, which is strictly worse than the status quo.**
- **No dependency on `ABC-042`'s merge** (merged 2026-08-15 @ `dbaf972`), and none on `ABC-060`.
- **Ordering hazard, named**: `ABC-058`, `ABC-057`, `ABC-059` and `ABC-061` are all pullable. If one
  of them is pulled and merged before this ticket, its page leaves the editable set the way
  `ABC-065`'s did. **Re-measure the table at the hop; do not trust these eight rows blind.**

## Design (Architect/Design, 2026-10-10)

**The reading is ruled DELTA:**
[`ADR-0036`](../../memory-bank/50-decisions/ADR-0036-abc041-clause-b-is-a-delta-test-on-the-production-capability-surface.md).
This ticket still waits for `ABC-072`'s canonical paragraph (`A2`). That paragraph is what the pages
cite.
- **What the ruling means for the copies.**
  - Under DELTA, "0 production files touched" is a **sufficient** answer for "(b) does not fire".
    It is not a necessary one.
  - So the file-touch pages answer correctly whenever they touch no production file, and the repair
    is mostly a citation swap.
  - A page that touches production files answers (b1) and (b2) with its own facts (`A3`).
  - `ABC-053`'s self-contradiction is a separate fix (`A4`).
- **The live set has shrunk** at `37ca6ae2`. `ABC-053`, `ABC-054`, `ABC-057` and `ABC-058` are
  `Done`, which leaves `ABC-055` and `ABC-059`. Re-measure at the hop.
- **Not done here:** DoR, size, priority and column.

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

1. **Re-measure the table before editing anything.** It was measured on `main` @ `5cf86d3`
   with `grep -rln 'non-\`.test.ts\` file under' plans/tickets/` and
   `grep -rln 'it fires and the gate resolves it' plans/tickets/`. Tickets merge; the set moves.
   **Measure over whitespace-normalized text** (2026-10-10). The per-line grep misses a sentence
   wrapped across a line break, as on `ABC-058`/`ABC-059`. That is `ABC-059`'s defect class, met
   here.
2. **The two greps are not interchangeable.** The first finds pages that restate the clause; the
   second finds pages carrying the fail-safe. `ABC-056` and `ABC-066` carry the fail-safe **without**
   restating (b) — do not read the second list as the first.
3. **Resist the copy.** The fastest way to close `A1` is one paragraph pasted seven times, which
   fails `A3` and reproduces the defect in a new spelling. Each page's answer is its own measurement.
4. **`ABC-058`'s stale dependency block was repaired on 2026-10-10** by the BA/PM re-score (it is
   now `Ready`). Do not re-fix it here.
5. **Label collision**: `ABC-058` carries a different `S1`/`S4`/`S5` (Security/NFR's `ABC-042`
   re-check). The `S1`/`S2` behind this ticket are `security-nfr-ABC-066`'s. Same labels, different
   authors.

## Size and priority rationale

**Size `XS` (1), re-sized 2026-10-10 from `S`.** At most six bullets, and four of those pages
already state both readings with their own facts. The set shrinks with every pull of `ABC-055`/
`057`/`058`/`059`. **Not `S`:** `A3`'s "different honest answers" are mostly written already.

**Priority `P3` — re-set 2026-10-10.** The page said `P2` and the board `P1`, from trigger (a),
2026-08-17. Trigger (a) has spent itself: `ABC-061` merged. The fail-safe is on 6 of 6 live pages,
and no new page restates the clause. **Promote to `P2`** if a live page loses the fail-safe, or if a
newly cut page restates clause (b). If `ABC-072` rules while this is still `P3`, the Orchestrator may
fold this ticket into `ABC-072`'s hop. That needs `ABC-072` `A6` amended to allow these paths.

## Definition of Ready

**Re-scored 2026-10-10 by BA/PM at `f76e041`. Result: 9 of 10 — NOT MET, unchanged.** The ⚠️ is
still the ordering on `ABC-072`.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** re-measured over normalized text: 6 live restaters, 6/6 with the fail-safe; the wording is still mixed: `053` faithful but self-contradicting, `054` delta, and `055`/`057`/`058`/`059` dual-stated as an interim form since this re-score |
| 2 | scope and out-of-scope clear | **✅** the live set, re-measured at the hop; merged pages fenced |
| 3 | INVEST-shaped | **✅** one subject, one file type; deliverable in one hop once `ABC-072` rules |
| 4 | acceptance testable and measurable | **✅** `A1` names today's merged set; `A2` 6/6 counted over normalized text; `A6` path count = the set |
| 5 | dependencies known | **✅** `ABC-072` first (⚠️); the shrinking-set hazard named and realised once (`ABC-061`) |
| 6 | security/NFR triggers with a measurable target | **✅** unchanged; lane cost zero |
| 7 | test notes present | **✅** five; note 1 now requires normalized text |
| 8 | size assigned | **✅** `XS` (1), was `S` |
| 9 | priority assigned | **✅** `P3` (page `P2` / board `P1` reconciled), with triggers |
| 10 | no major unresolved blocker | **⚠️** `ABC-072`'s ruling must land first |

**Re-scored 2026-10-10 by BA/PM** (`bapm-followups-2026-10-10`, wave tip `71418879`). **Result: 10 of
10, 0 ⚠️ — MET, as a FOLD into `ABC-072`'s hop.** It is not pulled on its own; the board move is the
Orchestrator's.
- **Item 10 → ✅.** The ruling exists (`ADR-0036`). `ABC-072`'s `A2` paragraph is written in the same
  hop, before the page edit, so the order is internal to one hop.
- **Item 4 stays ✅, repaired.** `A1` now counts non-`Done` pages. `A4` is void (`ABC-053` is
  `Done`). The live set is 1.
- **Item 5 stays ✅.** The live set is `ABC-055`. If it merges first, the set is 0.
- **Items 1–3 and 6–9 stay ✅.** `XS`, `P3`.

## Delivery

**2026-10-10, Architect/Design, folded into `ABC-072`'s hop** (subtask `design-ABC-072`, branch
`grugops/ABC-072-clause-b-delta`, delivered commit `088e48db`). Not merged, not pushed.
**`ABC-072` `A6` is the binding path list.**
- **Detail:** decision `…66a8bfa8` and `probe/RUN.txt` under `.grugops/context/design-ABC-072/`.
- **The table was re-measured at `6bfc7b29` before editing** (`abc073-set.sh`, normalized text).
  The live set is `ABC-055` alone, in `Ready`.

| # | verdict | reading at `088e48db` |
|---|---|---|
| `A1` | MET | The non-`Done` pages returning either grep are `ABC-072` (ruled line added) and this page. The "unruled" grep finds 0 non-`Done` pages, this one excluded. `ABC-055` returns neither and cites `ADR-0036` § Canonical clause (b). Every other page carrying old or interim text is `Done` |
| `A2` | MET | `ABC-055` carries the fail-safe: 1 of 1, normalized |
| `A3` | MET | `ABC-055`'s answer gives its own facts: `plans/board.md`, plus one `history/` file only if a header is replaced, so 0 production files |
| `A4` | VOID | `ABC-053` is `Done` (recorded 2026-10-10) |
| `A5` | MET | One hunk, `@@ -133,3 +133,4 @@`, inside `## Security / NFR triggers` (`:127`–`:139`). `## Acceptance` is byte-identical |
| `A6` | MET | The set contributes exactly `ABC-055`. 0 under `src/`, 0 new files. Suite green, skip 0 |
