---
id: ABC-060
title: Four `EPIC-006` tickets copy `ABC-042` `A12`'s diff-scoping clause without saying WHICH diff — the reading that made it MET is written in a note, not in the criteria
status: backlog
column: Backlog
size: XS
priority: P2
epic: EPIC-006
feature: —
---

# ABC-060 — "nothing else changed" is checked against a diff nobody names, four more times

> **Cut 2026-08-16 by BA/PM** (task `abc042-followups-2026-08-16`, subtask
> `refinement-ABC-042-followups`, Workflow 07) out of QE's `Q12` and the **Orchestrator's ruling on
> it** (`ticket-to-pr-ABC-042`, 2026-08-15), which closed the `ABC-042` instance and said in its own
> words: *"The wording genuinely would be better if it said WHICH diff — that is a BA/PM item."*
> **This is that item. `ABC-042`'s page is not edited: its `A12` is gated, MET and frozen.**

## Problem

*User*: the human turning the merge key, and the QE hop that has to decide whether "and nothing else"
is satisfied.

*Pain*: **a criterion of the form "the diff shows X and nothing else" has two readings that disagree,
and the criterion does not say which one it means.**

Measured on `ABC-042`: the **build-commit** reading (`git diff --name-only e140355~1 e140355`) shows
exactly the six licensed paths — **MET**. The **branch** reading (`7df25b9…HEAD`) shows **eight** —
those six plus the `ADR-0011` amendment and the ticket page, both of which are process artifacts of
the ticket's own refinement. The Orchestrator ruled the build-commit reading correct and **recorded
the command in a context note**. **But the human turning the key runs the branch diff**, and a
literal branch reading is breached by every context note ever written.

**The same clause is already copied into four more tickets, none of which names a diff:**

| ticket | criterion | text |
|---|---|---|
| `ABC-043` | `A8` (`:132`) | *"`git diff --numstat` shows the entry point and its test file and nothing else under `src/`"* |
| `ABC-044` | `A7` (`:131`) | *"`git diff --numstat` shows this module, its test file and `ABC-043`'s entry point, and nothing else"* |
| `ABC-045` | `A6` (`:87`) | *"`git diff --numstat` shows `ABC-035`'s command module, this …"* |
| `ABC-046` | `A8` (`:123`) | *"`git diff --numstat` shows `ABC-035`'s command module, the entry …"* |

*Value*: **`ABC-043` is `P0` and next in `EPIC-006`.** Each of these tickets will be co-merged with
its siblings the same way `ABC-042` was, so each will present a branch diff wider than its criterion
names, and each will spend a hop re-deriving a ruling that already exists. **The ruling is one
sentence; four tickets are about to not have it.**

## Scope

- **Name the diff in all four criteria.** Each says which diff it is checked against — **the
  delivered commit**, in the form the ruling used — and states the command:
  `git diff --name-only <commit>~1 <commit>` (or `--numstat`, matching each criterion's existing
  verb).
- **State the exception in the same clause**, once, in the words the ruling used: the ticket page,
  ADRs, and everything under `.grugops/` are **process artifacts of the ticket's refinement**, not
  part of what it delivers.
- **Change nothing else in those four criteria.** The file lists, the byte-identity clauses, the
  `Suite green, skip 0` clauses and every other criterion stay as written.

## Out of scope

- **`ABC-042` and its `A12`.** **Not one line.** Both gates passed against that page; a criterion
  edited afterwards means the gates were run against a page that no longer exists, and the page is
  already **28 lines over** rule 2's budget (`B2`: 328 against 300, re-measured 2026-08-16). `A12`
  keeps its wording and its ruling permanently, and the ruling is where it already is — in
  `.grugops/context/ticket-to-pr-ABC-042/notes/`.
- **The merge hand-off sentence for `ABC-042`.** QE routed that half of `Q12` to the **Orchestrator**
  — one sentence naming which diff `A12` was checked against, at the merge. **Not this ticket's, and
  cutting it here would take work from its owner.**
- **`Q11`** (a legal prose change in the resolver can red `A6`(i)'s only-argv-literal row). QE
  measured it, called it **friction rather than a false RED** — *"by the criterion's letter this is
  correct"* — and **recommended leaving it**. Agreed and not cut.
- **Any process rule about how criteria are authored.** The Orchestrator declined to raise one from
  the four-instance defect class and named the owner (Factory Coach, on-demand, the project owner's
  call). **This ticket repairs four sentences and proposes no rule.**
- **Adding a diff-scoping criterion to a ticket that does not have one.** Four sites exist; four are
  repaired.

## Acceptance (Given/When/Then)

- **`A1` (all four name a diff).** **Given** `ABC-043` `A8`, `ABC-044` `A7`, `ABC-045` `A6` and
  `ABC-046` `A8` after the change, **then** each names the diff it is checked against and each
  carries the command that produces it — **4 of 4.** *(Today: 0 of 4.)*
- **`A2` (the exception is stated once per criterion, in the ruling's words).** **Given** each of the
  four, **then** it names the ticket page, ADRs and `.grugops/` as process artifacts outside the
  delivered diff — so a co-merged branch does not breach it by existing.
- **`A3` (nothing else moved).** **Given** `git diff` over `plans/tickets/`, **then** the changed
  lines are inside those four criteria only: **zero** file-list entries added or removed, **zero**
  byte-identity clauses changed, **zero** other criteria touched, and **zero** changes to any
  ticket's front matter (`size`, `priority`, `status`, `column` unmoved).
- **`A4` (`ABC-042` is untouched).** **Given** the diff, **then**
  `plans/tickets/ABC-042-entry-point-argv-and-the-first-frame.md` shows **0** changed lines.
- **`A5` (each stays checkable).** **Given** the amended criterion, **when** the named command is run
  against any commit, **then** it produces a file list that can be compared to the criterion's own
  list without further interpretation — **the criterion is executable as written, by a human at the
  merge, with no note to consult.**

## Dependencies

- **None.** All four tickets are in `Backlog` and are BA/PM's own; no gate has run against any of
  them and nothing is in flight on them.
- **It must land before `ABC-043` exits `Ready for Dev`.** `AGENTS.md` § Process rules, rule 1 puts
  the criteria re-read at that exit and names the Orchestrator as its owner — this is exactly a gap
  that exit is meant to catch, and catching it there costs a hop that this ticket costs a paragraph.
  **Sequencing, not a blocker.**
- **Independent of `ABC-042`'s merge.** It touches no file `ABC-042` delivers.

## Security / NFR triggers

- **`N8-LANE` NOT triggered** — **0 new test files, 0 files under `src/`, 0 child processes.** This
  ticket touches `plans/tickets/` and nothing else.
- **`NFR-002` not triggered.** No production path.
- **Security: not triggered.** `ABC-041`'s four clauses are trivially quiet: **(a)** no manifest
  touch, **(b)** nothing under `src/` touched at all, **(c)** no test file touched at all, **(d)**
  blast radius is four markdown files under `plans/tickets/`.

## Test notes

1. **There is no automated criterion linter in this repo and this ticket does not build one.** `A1`
   and `A2` are checked by reading the four criteria; `A3` and `A4` by `git diff`.
2. **The verb differs by ticket** — `ABC-042` used `--name-only`, the four use `--numstat`. Match
   each criterion's existing verb rather than unifying them; unifying is a second change wearing this
   ticket's name.
3. **Do not import `ABC-042`'s six-path list.** Each of the four already has its own file list and
   they are not the same list. Only the *scoping sentence* is shared.
4. **Re-score the Definition of Ready of any ticket whose criterion is edited** — item 4 (acceptance
   testable and measurable) is the one that moves, and it should move up, not just be re-asserted.

## Lane cost — how many test FILES this ticket implies

**Zero, and zero files under `src/`.**

## Size and priority rationale

**Size `XS` (1).** Four sentences, in four files, in one role's own artifacts, with the ruling
already written and quotable. **The measurement behind it took a QE hop and an Orchestrator ruling;
the edit does not.**

**Priority `P2`.** Nothing is blocked today and no gate is waiting. It is `P2` rather than `P3`
because it is **time-boxed by `ABC-043`**, which is `P0` and next in `EPIC-006`: after that ticket
enters development the cheap moment has passed and the ambiguity gets re-derived under gate pressure,
which is what it cost on `ABC-042`. **Promote to `P1` when `ABC-043` is pulled toward
`Ready for Dev`.**

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-16**. **Result: 10 of 10 — MET.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** two readings, measured (six paths vs eight), a ruling that lives in a note, and four criteria about to inherit the ambiguity |
| 2 | scope and out-of-scope clear | **✅** four named criteria at four named line numbers; five fences, first of which is `ABC-042`'s frozen page and second is the Orchestrator's own half of `Q12` |
| 3 | INVEST-shaped | **✅** independent (no dependency on `ABC-042`'s merge), small, testable by reading four sentences and one `git diff` |
| 4 | acceptance testable and measurable | **✅** **4 of 4** naming a diff (today 0 of 4), the exception stated per criterion, **0** file-list entries moved, **0** lines changed in `ABC-042` |
| 5 | dependencies known | **✅** none; the `ABC-043` ordering named as sequencing with the rule-1 exit that would otherwise catch it |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` **0** files and **0** spawns, `NFR-002` untriggered, four security clauses answered |
| 7 | test notes present | **✅** four, including the differing verb and the DoR re-score |
| 8 | size assigned | **✅** `XS` (1) |
| 9 | priority assigned | **✅** `P2`, time-boxed by `ABC-043` with the promotion trigger named |
| 10 | no major unresolved blocker | **✅** nothing open, nothing decided by anyone else — the ruling this depends on is already made and recorded |
