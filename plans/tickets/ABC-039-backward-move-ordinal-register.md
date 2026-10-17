---
id: ABC-039
title: The backward-move ordinal series is uncitable — a false FIRST that is LIVE on the board, and a double-booked SECOND
status: backlog
column: Backlog
size: S
priority: P2
epic: —
feature: —
---

# ABC-039 — the backward-move ordinal series is uncitable

> **Cut 2026-08-13 by BA/PM** (task `cut-039-040-2026-08-13`, subtask `refinement-cut-039-040`,
> Workflow 07) on the owner's ruling *"cut both"*.
>
> **THIS IS A RECORD TICKET, NOT A DEFECT TICKET.** No test fails, no build is wrong, no user is
> affected, and every backward move it concerns was correctly *made* and correctly *recorded as a
> backward move*. What is wrong is the **counting**.
>
> **It exists because the defect has now been recorded FOUR times with no ID and no date** — the
> delivery audit's open-debts note, `plans/metrics.md`'s Rework-rate row, the Orchestrator's
> `post-abc030-2026-08-13` decision note, and the brief that cut this page. Each named it; none
> owned it. **This page is the owner.**
>
> **The audit's own remedy is REFUTED on this page, at the source, and that matters more than the
> defect.** It called the series *"off by one"* and the fix *"one correcting line"*. Measured: a
> uniform `+1` leaves the series reading `2, 3, 3, 4` — **the collision survives it**, because
> there are TWO independent defects, not one.

## Problem

*User*: anyone who cites — or checks — a claim of the form *"the Nth backward move in this
project's history"*. `plans/board.md` is read by every role on start (`AGENTS.md`), and one of
these claims is on it.

*Pain*: **two independent defects, both verified at source on `06c5427`, 2026-08-13.**

**(a) THE FALSE FIRST.** `ABC-011` moved `Ready for UAT` → `In Design` on **2026-08-03** on the
owner's explicit instruction, and its own archived header says so in terms
(`plans/tickets/history/ABC-011-board-history.md:1338-1342`):

```
SENT BACK 2026-08-03 by the Orchestrator on the project owner's explicit instruction ...
  ABC-011 moved Ready for UAT -> In Design. Ready for UAT 1/4 -> 0/4, In Design 0/2 -> 1/2.
  THIS IS A BACKWARD MOVE AND IT IS RECORDED AS ONE.
```

The move labelled **FIRST** is dated **2026-08-09** — six days later.

**(b) THE DOUBLE-BOOKED SECOND.** Two different moves, on two different dates, both carry
**"SECOND"**: `ABC-025`'s move of 2026-08-10 and `ABC-016`'s move of 2026-08-11. This is not a
typo — it is a **dropped move**. The 2026-08-11 author states the arithmetic in the same sentence
(*"and BOTH concurrent tickets have now made one"*), which only reaches `THIRD` by counting
`ABC-009` = 1, `ABC-016` = 2, `ABC-019` = 3 and omitting `ABC-025`'s 08-10 move entirely.

*Value*: **the series becomes citable, and the fifth re-recording does not happen.** One live
false clause on the single source of WIP truth is corrected; seven archived ones become checkable
against one register instead of against each other.

## The verified inventory — eight statements, one of them LIVE

Measured 2026-08-13 on `06c5427`. **`file:line` will drift; re-resolve by the quoted text.**

| # | file:line | label, verbatim | labels the move | move date | state |
|---|---|---|---|---|---|
| 1 | `plans/board.md:185` (the `ABC-009` row, **`Done` column**) | *"FIRST BACKWARD BOARD MOVE IN THIS PROJECT'S HISTORY"* | `ABC-009` `Ready for UAT` → `In Review` | 2026-08-09 | **LIVE** |
| 2 | `…/history/ABC-009-board-history.md:814` | *"FIRST BACKWARD MOVE IN THIS PROJECT'S HISTORY"* | same move | 2026-08-09 | archived |
| 3 | `…/history/ABC-009-board-history.md:17` | *"the return trip from the first backward move in this project's history"* | same move (return trip) | 2026-08-09 | archived |
| 4 | `…/history/ABC-009-board-history.md:451` | *"THIS COLUMN WAS RE-ENTERED BY A BACKWARD MOVE (the first in this project's history)"* | same move | 2026-08-09 | archived |
| 5 | `…/history/ABC-009-board-history.md:786` | *"before the first backward move in this project's history"* | same move | 2026-08-09 | archived |
| 6 | `…/history/ABC-025-board-history.md:37` | *"the SECOND backward move in this project's history"* — and it names its own basis, *"(the first was `ABC-009`, 2026-08-09)"* | `ABC-025` `Ready for UAT` → `In Development` | 2026-08-10 | archived |
| 7 | `…/history/ABC-019-board-history.md:24` | *"the SECOND backward move in this project's history"* | `ABC-016` `In Review` → `In Development` | 2026-08-11 | archived |
| 8 | `…/history/ABC-016-board-history.md:52` | *"the THIRD backward move in this project's history"* | `ABC-019` `In Review` → `In Development` | 2026-08-11 | archived |

**The series is CLOSED.** `plans/metrics.md:23` counts **13 backward moves across 9 tickets**; only
**four** ever received an ordinal, and **no move after 2026-08-11 received one** — the practice was
abandoned. This ticket is not signing anyone up to maintain a counter.

## Scope

**Two writes. Nothing else.**

1. **ONE clause in `plans/board.md:185`** — the `ABC-009` row in the `Done` column. The words
   *"FIRST BACKWARD BOARD MOVE IN THIS PROJECT'S HISTORY"* are false and are **live**.
   **`plans/board.md` is the Orchestrator's file; this edit is the Orchestrator's to make.**
2. **ONE new register** at `plans/tickets/history/backward-move-ordinals.md` — the chronology, the
   eight statements, and the corrected ordinal for each.

**Precedent this follows exactly, rather than inventing a disposition:** `ABC-030` § *Security /
NFR triggers* — *"`ABC-028` is in `Done` and is not re-opened, so the two false sentences on that
page stand as a closed record and the correction is applied **here**, where the clause is still
live."* Same rule, applied to ordinals: **correct the live clause, register the archived ones,
re-open nothing.**

## Out of scope

- **Every archived statement (#2–#8).** They are `_Updated:` headers of tickets in `Done`
  (`ABC-009`, `ABC-016`, `ABC-019`, `ABC-025`). **Not one byte.** A gap found after a merge becomes
  a new ticket, never a silent edit to a merged one — this page *is* that ticket.
- **Re-opening or editing any `Done` ticket page**, any ADR, or anything under `src/`.
- **`plans/metrics.md`.** **Verified 2026-08-13: it does not need repair.** Its Rework-rate row
  (`:23`) already carries the correct chronology — `ABC-011` at 08-03 *and* `ABC-009` at 08-09 —
  and already flags this defect with an owner. **It is the one record that got this right.** The
  register cites it as the chronology source; it does not duplicate it and must not edit it.
- **Renumbering the moves that never received an ordinal.** Nine of the thirteen have no label.
  Giving them one is inventing a series, not repairing one.
- **Every other "in this project's history" claim.** Measured 2026-08-13: **19 such claims exist
  across `plans/`, of which 8 are this backward-move series and 11 are other claims** — *the first
  FAIL* (`plans/board.md:177`, live), *the second design hop*, *first entry to a column*, and so
  on. **They are unaudited and this ticket does not audit them.** A general ordinal register is
  unrequested, unmeasured, and would be exactly the "someday-roadmap" bloat this role exists to
  refuse. **If it is wanted, it is its own ticket with its own measurement.**

## Acceptance (Given/When/Then)

> Written to be executed by an engineer with no interpretation and **no reviewer downstream**:
> criteria review now sits at the `Ready for Dev` exit, not at the QE gate.

**A1 — the live false clause is gone from the board, and nothing else on that row moved. Given**
`plans/board.md` as it stands, **when** the `ABC-009` row's ordinal clause is corrected, **then**

```
grep -c "FIRST BACKWARD BOARD MOVE IN THIS PROJECT'S HISTORY" plans/board.md   -> 0
grep -c "^- \[ABC-009\]" plans/board.md                                        -> 1
```

**and** the corrected row still states the move itself (`Ready for UAT` → `In Review`, 2026-08-09)
and its reason (`A11` found unmet), **and** `git diff --stat plans/board.md` shows **exactly one
changed line**.

**A2 — the register exists and resolves all eight statements. Given**
`plans/tickets/history/backward-move-ordinals.md`, **then** it contains one row per statement in
the inventory above — **eight rows** — each carrying the file, the quoted label, the move it
labels (ticket, from-column → to-column, date), and the **corrected ordinal**; **and** for each of
the seven archived rows, the quoted label string is still found in the file it cites:

```
# for each archived row: exit 0, at least one hit
grep -F "<the quoted label>" "<the cited file>"
```

**A3 — every corrected ordinal is DERIVED from a chronology, not asserted. Given** the register,
**then** it carries a chronology table of **every backward column move**, ordered by date, whose
row count **equals the total stated in `plans/metrics.md`'s Rework-rate row** (13 as of
2026-08-12 — **re-measure it; do not paste this number**), each row naming ticket, date,
from-column → to-column, and the `file:line` it was read from; **and** each corrected ordinal in
`A2` **equals that move's 1-based position in the chronology**. Checkable by arithmetic against
the register's own two tables, with no outside input.

**A4 — both defects are named, and neither is smoothed into the other. Given** the register,
**then** it states in its own words (a) that the move labelled *FIRST* is not first, and (b) that
two distinct moves are both labelled *SECOND*; **and** it records explicitly that **a uniform `+1`
does not repair the series** — it yields `2, 3, 3, 4` and the collision survives. **A register
that fixes only (a) fails this criterion.**

**A5 — nothing archived was touched. Given** the completed change, **then** `git diff --numstat`
against the branch point shows:

```
plans/board.md                                     1 changed line
plans/tickets/history/backward-move-ordinals.md    added (new file)
plans/tickets/ABC-039-*.md                         (this page, if amended)
... and NOTHING else
```

specifically **zero** changed lines in any `plans/tickets/history/ABC-*-board-history.md`, in
`plans/metrics.md`, in any file under `src/`, and in any ticket page other than this one.

**A6 — the repair is smaller than the defect. Given** the register, **then**
`wc -l < plans/tickets/history/backward-move-ordinals.md` is **≤ 60**. This is a criterion and not
a style note: the delivery audit's headline finding is that **the record is this factory's waste**
(10 MB of prose against 131 KB of production code). **A 300-line register correcting four labels
would be the defect, not the fix.**

## Dependencies

- **None blocking.** Nothing waits on this and it waits on nothing.
- **Independent of `ABC-040`.** Different files, different defect, no shared line. Either may be
  pulled first, or one without the other.
- **Sequencing, not a blocker:** `plans/board.md` is written by the Orchestrator on almost every
  hop. `A1`'s single-line edit must not be attempted while another hop holds that file. Cheap to
  satisfy; the Orchestrator already sequences board writes.

## Security / NFR triggers

**NONE FIRE. Threshold stated so the claim is falsifiable rather than asserted.**

- **Firing threshold: any production line at all, or any new file under `src/`.** This ticket adds
  **zero** of both — one clause in a markdown board file, one new markdown file under `plans/`.
  **Measure at the gate:** `git diff --numstat -- src/` must be **empty**.
- **`NFR-008` / `N8-LANE`: delta is ZERO BY CONSTRUCTION.** No test file is added, changed or
  removed, so `ADR-0008`'s paired protocol has nothing to resolve and **must not be run for it**.
  `ABC-026` still owns the lane total.
- **No a11y, latency or data surface.** This project has no UI and deploys nowhere (`ADR-0007`).

## Test notes

1. **THE COUNTING BASIS IS RULED, so two readers cannot build two registers.** The unit is the
   **individual backward column move**, counted **chronologically** — not the ticket that moved.
   This is already the project's live definition: `plans/metrics.md:23` counts **13 moves across 9
   tickets** and reports both numbers separately. **A ticket-based count would give `ABC-016` and
   `ABC-019` one position each when they made two moves apiece.** An unstated basis here is exactly
   the DoR item-4 failure this project keeps paying for.
2. **Eight of the thirteen moves have no date on this page, and that is the hop's real work.**
   `plans/metrics.md:23` gives per-ticket counts (`ABC-016` 2, `ABC-017` 1, `ABC-019` 2, `ABC-027`
   1, `ABC-028` 3, `ABC-029` 1) but dates only for `ABC-009` and `ABC-011`. The remaining dates are
   **`UNKNOWN - verify`** and are read from `plans/tickets/history/*.md` and `plans/board.md`.
   **Until they are read, the corrected ordinal of statements #7 and #8 is not known** — they are
   *at least* 4th and 5th, and could be later.
3. **`ABC-009`'s own file holds FOUR of the eight statements and a single grep finds one.** The
   uppercase form (`:814`) is what everyone quotes; `:17`, `:451` and `:786` are lowercase or
   parenthesised. Search case-insensitively for `backward move` **and** for
   `in this project's history` — the two sets overlap but neither contains the other.
4. **Do not repair by editing the archive.** It is forbidden here, and it would also be
   self-defeating: the archived headers are the evidence that the ordinals were recorded honestly
   at the time. The defect is arithmetic, not dishonesty.
5. **`ABC-025`'s statement is the most useful one in the set** — it is the only label that shows
   its work (*"the first was `ABC-009`, 2026-08-09"*). It is wrong for a stated reason, which is
   why the (a) defect is provable rather than arguable. **Quote it in the register.**

## Size and priority rationale

**Size `S` (2).** One board clause, one ≤ 60-line file, and one bounded read: 13 moves across 9
history files whose locations are already named on this page. **Not `XS`** — `XS` is
`ABC-030`'s four one-sentence comment edits with nothing to derive; this hop must *derive a
chronology* before it can write a single ordinal, and eight of thirteen dates are unread. **Not
`M`** — there is no code, no test, no fixture and no instrument. `SPLIT_REQUIRED` bites at `XL`
(8); this is 2.

**Priority `P2`, and the reasoning is stated so it can be argued with.**

- **Not `P0`/`P1`** — nothing is blocked, no criterion is unmet, no user exists, and no code
  computes on an ordinal. Nothing waits on this.
- **Not `P3`, and it would have been `P3` until the live instance was found.** Statement #1 is on
  **`plans/board.md`** — the single source of WIP truth, which `AGENTS.md` has every role read on
  start. A false sentence there is read by every hop, not by an archaeologist. **That one fact is
  the whole difference between this and `ABC-030`'s `P3` comment debt.**
- **`P2`, and it must not be pulled ahead of anything user-facing.** Its value is that a
  re-recording loop stops — this defect has cost four hops a re-derivation each. That is a real
  recurring cost and a small one.
- **The falsifiable statement:** *if any hop cites one of these ordinals as evidence in a ruling —
  as the audit already cites ordinal-shaped facts — this is `P1` and should be re-cut as one.*

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-13**, item by item. **Result: 9 of 10 — NOT MET, and deliberately not smoothed**, the
standard `ABC-024`, `ABC-026`, `ABC-028` and `ABC-030` all set.

| # | item | verdict |
|---|---|---|
| 1 | problem clear — user, pain, value stated | **✅** the user is anyone citing or checking an ordinal; the pain is two named, source-verified defects; the value is one live false clause corrected and a closed series made citable |
| 2 | scope and out-of-scope clear | **✅** two writes, named exactly; six exclusions, including `plans/metrics.md` (**verified already correct**) and the 11 other ordinal claims (**counted, then refused**) |
| 3 | INVEST-shaped | **⚠️ the one honest gap, and it is on _valuable_.** Independent, negotiable, estimable, small and testable all hold. But **the register is citable, not reachable**: a reader who greps `FIRST BACKWARD MOVE` lands on an archived header and sees nothing pointing at the register. The ticket cannot close that without editing the archive, which is forbidden. **So it corrects the one live instance and makes the other seven checkable *on purpose* — it does not intercept a reader who never checks.** That is a partial fix and it is recorded as one. The alternatives were weighed: editing the archive is forbidden, and doing nothing has been chosen four times and produced four re-recordings |
| 4 | acceptance testable and measurable | **✅** six criteria — three `grep` exit codes, one `git diff --numstat` file list, one arithmetic identity between two tables in one file, one `wc -l` bound. **No criterion says "works"** |
| 5 | dependencies known | **✅** none blocking; independent of `ABC-040`; the one real constraint (do not edit `plans/board.md` concurrently with another hop) is named with its owner |
| 6 | security/NFR triggers marked with a measurable target | **✅** threshold stated as *any production line, or any new file under `src/`*, measured zero, **checkable at the gate by `git diff --numstat -- src/`**; `N8-LANE` delta zero by construction |
| 7 | test notes present | **✅** five, including the ruled counting basis and the eight unread dates that are the hop's actual work |
| 8 | size assigned | **✅** `S`, calibrated against `ABC-030` (`XS`) in both directions |
| 9 | priority assigned | **✅** `P2`, with the fact that raised it from `P3` named, and a falsifiable statement of what would raise it again |
| 10 | no major unresolved blocker | **✅** none. The eight unread move dates are the ticket's **work**, not a blocker — the sources are named and reading them needs no decision from anyone |

### Requested board move 2026-08-13 by BA/PM at `refinement-cut-039-040`: `Backlog` (placement REQUESTED, not taken)

**`plans/board.md` was NOT opened for edit** — it is the Orchestrator's. This page exists; placing
it is the Orchestrator's call.

**`Backlog`, not `Ready`, and the DoR is not met anyway.** Even at 10/10 this would be a `Backlog`
request: `Ready` is the pull queue and stands at 2/8, and stocking it with records debt makes an
under-stocked column *look* stocked. `ABC-030`'s reasoning, adopted unchanged.

## Re-score — 2026-10-12 (BA/PM, subtask `bapm-rescore-backlog-process`, `main` @ `1eb2edbc`)

**Verdict: DoR 10/10 (was 9/10), recommend `Ready`. `S`, `P2` kept.** The inventory grows from eight
statements to **nine**. `A2` would have failed on a correct register. The item-3 ⚠️ is discharged by a
new `A7`. Commands are in `.grugops/context/bapm-rescore-backlog-process/notes/` (observation note,
§ ABC-039). Board md5 `be514ce6…`; `plans/metrics.md` md5 `1b083e8d…`, last changed `30197d6f`
(2026-08-20).

**What still holds (re-resolved by quoted text):**
- **#1 LIVE** is now `plans/board.md:969` (was `:185`). `grep -c "FIRST BACKWARD BOARD MOVE IN THIS
  PROJECT'S HISTORY" plans/board.md` → **1**.
- #3–#8 are at their cited lines: `ABC-009-board-history.md:17`, `:451`, `:786`;
  `ABC-025-…:37`, `ABC-019-…:24`, `ABC-016-…:52`.
- No archive file has changed since the cut (`ABC-009`'s last commit is `d568e3b9`, 2026-08-10).
- `backward-move-ordinals.md` does not exist yet.
- `plans/metrics.md`'s Rework-rate row is now **`:28`** (was `:23`), and it still says **13 moves
  across 9 tickets**.
- The `P1` trigger has not fired: every note that cites an ordinal is dated 2026-08-13 or earlier.

**What changed:**
- **#2 is WRAPPED.** `ABC-009-board-history.md:814-815` splits *"FIRST BACKWARD MOVE IN THIS / PROJECT'S
  HISTORY"* across two lines. `grep -cF` for the full label reads **0**. **`A2`'s check as written
  exits 1 on a correct register.**
- **#9, a second LIVE statement the cut missed:** `plans/traceability.md:437`, the `ABC-009` row's
  `Status` cell, *"**first backward board move in this project's history**"*. It was already present
  at `06c5427`. It is a dated hop record in a trace cell, so **register it and do not edit it**
  (`ABC-040` `R5`; trace hops append rows and touch nothing in place).

**Criteria amendments (2026-10-12; old text struck, kept for one re-score):**
- **Inventory / `A2`** ~~eight rows~~ → **nine rows**, adding #9 above. ~~`grep -F "<the quoted
  label>" "<the cited file>"`~~ → for #2, `grep -nF "FIRST BACKWARD MOVE IN THIS"
  plans/tickets/history/ABC-009-board-history.md` must hit `:814`, and `sed -n 815p` must match
  `^ *PROJECT'S HISTORY` (the line is indented). The others are unchanged. #9 is checked against `plans/traceability.md`.
- **`A3`** ~~every backward column move~~ → every backward column move **in the window `plans/metrics.md`'s
  Rework-rate row covers (through 2026-08-12)**. The row count equals that row's total (13 at this tip;
  re-read it). The series closed at 08-11, so later moves are out of scope.
- **`A5`** ~~… and NOTHING else~~. That unscoped clause fires on the hop's own paperwork (`ABC-030`'s
  33-file lesson). → Under `plans/`, `src/`, `memory-bank/` and `AGENTS.md`, the diff is exactly:
  `plans/board.md` 1 line changed, the new register, optionally this page, and
  `plans/traceability.md` with **0 deletion lines** (an appended row only). Files under `.grugops/`
  are free.
- **`A7` (new; discharges the item-3 ⚠️):** the register quotes each of the nine labels **verbatim on
  one line**, so `grep -rlF "<label>" plans/` lists the register for every label, #2 included. **And**
  the corrected `ABC-009` board clause names `plans/tickets/history/backward-move-ordinals.md`. A
  reader who greps any label now lands on the register. **Residual (named, accepted):** a reader who
  opens an archive file and does not grep is not intercepted. Only editing the archive could change
  that, and editing the archive is forbidden.
- **`A6`** (≤ 60 lines) unchanged. Nine rows plus the 13-move chronology fit.

**DoR 10/10:** 1 ✅, 2 ✅ (#9 registered, not edited), 3 ✅ (reachability by `A7`, residual named),
4 ✅ (`A2`/`A3`/`A5` now pass on a correct register), 5 ✅, 6 ✅ (0 `src/`, `N8-LANE` zero), 7 ✅,
8 ✅ `S`, 9 ✅ `P2`, 10 ✅.

## Amendment — 2026-10-17 (BA/PM, subtask `bapm-amend-ABC-039`, branch tip `6c1257dd`)

**Ruling: option (a).** The SE stopped at `A3`
(`.grugops/context/ticket-to-pr-ABC-039/notes/…observation-chronology-cdf60868.md`, `…decision-stop-a3-183cc20d.md`).
BA/PM re-derived the counts at source and they hold. All 15 move commits are ancestors of `3215004c`, the commit that wrote
`plans/metrics.md:28`. `ABC-017` moved back twice (`5d387e60`, `e22ed720`), not once. `ABC-019` moved back three
times (`9e7d9ab7`, `8cc4d8c3`, `c6ea796d`), not twice. **Why (a) and not (b):** `A3`'s link to metrics.md was a
cross-check, made on the assumption that metrics.md was right ("the one record that got this right", § Out of scope).
That assumption is now refuted. If `A3` keeps the 13, the register would have to drop two real moves or block forever.
Under (b), a `P2` record ticket waits on a repair that none of its ordinals depend on, which fails INVEST
*independent*. The live metrics row is repaired as its own ticket, **`ABC-156`**. Reasoning and the re-derivation
are in `.grugops/context/bapm-amend-ABC-039/notes/`.

**Current cites** (re-resolved at `6c1257dd`; these replace `:185`, `:969` and `:437`): #1 `plans/board.md:1001`;
#2 `ABC-009-board-history.md:814–815` (wrapped; the `A2` check from the 2026-10-12 amendment stands);
#3–#8 unchanged (`:17`, `:451`, `:786`, `ABC-025-…:37`, `ABC-019-…:24`, `ABC-016-…:52`);
#9 `plans/traceability.md:438`. Lines drift; re-resolve each by its quoted text.

**Criteria amendments (2026-10-17):**
- **`A3`** ~~in the window `plans/metrics.md`'s Rework-rate row covers (through 2026-08-12) … equals that row's total~~ →
  **Given** the register, **then** its chronology lists every backward column move made by a commit at or before
  `3215004c` (inclusive), in **git commit order**. A backward move is a ticket whose `plans/board.md` row moves to an
  earlier column. Commit order is used because record dates and git dates differ by about a day on 08-11 and 08-12.
  One exclusion, stated so two readers build the same table: `47b5b935` (`ABC-013` `Done` → `Ready for UAT`) corrects a
  false merge record and is not a move. **The row count is 15.** The window is a commit, so this number cannot drift. A
  derivation that does not reach 15 is a STOP, not a reason to edit the table to fit. Each row names ticket, record
  date, from-column → to-column, the `file:line` it was read from, and its commit, and
  `git merge-base --is-ancestor <commit> 3215004c` exits 0 for every row. Each corrected ordinal in `A2` equals that
  move's 1-based position: `ABC-009` 08-09 = **2** (#1–#5, #9), `ABC-025` = **3** (#6), `ABC-016` first 08-11 = **4**
  (#7), `ABC-019` first 08-11 = **5** (#8).
- **`A4`** gains **(c)**. The register states that `plans/metrics.md:28` reads **13**. Re-read it at the tip and do not
  paste the number. It also states that the source has **15**, that the gap is exactly `ABC-017` (1 vs 2) and `ABC-019`
  (2 vs 3), that every other per-ticket count matches, and that `ABC-156` owns the repair. Three defects, each named
  separately.
- **§ Out of scope, `plans/metrics.md`:** ~~does not need repair … the one record that got this right~~ → it **does**
  need repair (its 13 is defect (c) above), and that repair is `ABC-156`'s. **This ticket still writes zero lines
  there.**
- **`A5`** adds one allowed file: `plans/tickets/ABC-156-*.md`, added by this BA/PM hop on this branch, **0 lines
  changed after `bapm-amend-ABC-039`'s commit**. The rest of the 2026-10-12 list stands as written, and
  `plans/metrics.md` stays at **0** lines.
- `A1`, `A2`, `A6` (≤ 60 lines: 9 + 15 rows fit) and `A7` are unchanged.

**DoR re-check: 10/10.** Items 1 ✅, 2 ✅ (metrics.md exclusion corrected and still fenced), 3 ✅ (now independent of
`ABC-156`), 4 ✅ (`A3` has a fixed window, a fixed count and a per-row ancestry check; `A4` (c) is checkable against
`:28`), 5 ✅ (`ABC-156` depends on this ticket, not the other way round), 6 ✅ (0 `src/` lines, `N8-LANE` zero), 7 ✅,
8 ✅ `S`, 9 ✅ `P2`, 10 ✅ (no owner word needed). **Resume the SE hop on this branch.**
