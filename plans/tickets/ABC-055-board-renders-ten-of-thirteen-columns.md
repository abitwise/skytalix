---
id: ABC-055
title: `plans/board.md` defines 13 columns and renders 11 — `In Analysis` and `In Design` have no heading, so two WIP limits are unenforceable by reading the single source of WIP truth (was 10 of 13 at the cut)
status: in-development
column: In Development
size: XS
priority: P1
epic: —
feature: —
---

# ABC-055 — two columns exist in the table and nowhere else (three at the cut; one has since been given its heading)

> **Cut 2026-08-13 by BA/PM** (task `gate-abc041-2026-08-13`, subtask `refinement-ABC-041-a4`,
> Workflow 07), out of the Orchestrator's observation while placing `ABC-041`
> (`.grugops/context/ticket-to-pr-ABC-041/notes/`). **Found while placing a ticket, not while
> auditing** — and deliberately not fixed mid-pull, which was the right call and is why it needs a
> ticket.
>
> **Re-scored 2026-10-10 by BA/PM** (task `wave-2026-09-25`, subtask `rescore-batch-2-2026-10-10`)
> at wave tip `f76e041`. **Partly fixed by the board's own traffic.** `## Ready for Dev (WIP 0/6)`
> now exists, and `ABC-115` sat in it on 2026-08-20. **`In Analysis` and `In Design` still
> have no heading**: 11 of 13 are rendered. **This page's `P1` trigger has fired.** This morning's
> re-score routes `ABC-010`'s pull to `In Design`
> (`.grugops/context/rescore-batch-2026-10-10/notes/`), and `ABC-072` is waiting on an
> Architect/Design ruling. **P2 → P1, S → XS.** `A5` contradicts today's practice and is
> re-worded. The board has **170** prepended `_Updated:` lines and nothing is replaced, so
> nothing is archived. **DoR 10/10 → `Ready`.** `plans/board.md` is the Orchestrator's file; how
> to sequence the build is in § Dependencies.

## Problem

*User*: every role that reads the board, and the Orchestrator most of all — the board is grugops's
**single source of WIP truth** and the file says so about itself.

*Pain*: **the columns table lists 13 columns** (under `## Columns (spec §6.1)`; it was `:73-87` at
the cut, and every prepended header moves it, so cite the heading, not a line). **The file renders 11 column H2 headings**
(10 at the cut):

```
Backlog  Ready  Ready for Dev  In Development  In Review  In Security/NFR
Ready for UAT  In UAT  Ready to Release  Done  Blocked
```

**Missing: `In Analysis`, `In Design`.** *(`Ready for Dev` was missing at the cut and has had its
heading since; it was used by `ABC-115` on 2026-08-20.)* The FORMAT comment's `HEADING FORMAT (spec
§6.1)` clause says each column is an H2 heading carrying its live/limit WIP count. Two columns cannot
carry a count they have no heading for, so **two WIP limits — 2 and 2 — are unenforceable by reading
the file** (three at the cut: 2, 2 and 6).

*(At the cut, and since fixed:)* `Ready for Dev` was the sharp one: `AGENTS.md` § Process rules, rule 1 names it as **where the
criteria review happens** and names the Orchestrator as its exit owner. It is a column with an owner,
a rule and a WIP limit of 6 that **does not exist as a place to put a ticket**. `ABC-041` moved
`Backlog → In Development` directly for exactly that reason — honest under rule 1, whose operative
clause keys on the entry to `In Development`, and recorded at the time rather than papered over.

*Value*: **nothing has overflowed those limits yet**, and that is the whole argument for doing
this cheaply now rather than expensively later. `EPIC-003` and `EPIC-006` are both open and both
decomposed; the first ticket that genuinely needs `In Analysis` or `In Design` will find the column
missing at the moment it is least convenient.

## Scope

- **Add the two missing H2 headings** (`In Analysis`, `In Design`) in flow order, between `Ready`
  and `Ready for Dev`, each carrying `(WIP live/limit)` in the format
  the FORMAT comment fixes, with the limits taken from `.grugops/factory.config.json#wip_limits` —
  **read from the dial, not copied from the table**, and the two made to agree.
- **State which of the 13 columns may be skipped**, and where that is written. The FORMAT comment
  already says `In Security/NFR` and `Ready to Release` may stay empty in `lean` mode; the two
  missing ones have no such statement and their absence has been read as one. *(2026-10-10: the
  FORMAT comment also names the kit's `agent-factory/config/factory.config.json#wip_limits` as the
  source of the numbers, but this repo's dial is `.grugops/factory.config.json`. Correct that path
  in the same line.)*
- **One line in the columns table or the FORMAT comment** recording that heading and table must agree,
  so the next reader has the invariant rather than re-deriving it.

## Out of scope

- **Moving any ticket.** This is a structural repair to the file, not a board move. No ticket changes
  column and no WIP count changes as a result of it.
- **Changing any WIP limit.** The limits come from config; if a number is wrong that is a change to
  `.grugops/factory.config.json` and a different conversation.
- **Rewriting the `_Updated:` header convention or the `history/` archive rule.** *(2026-10-10: the
  rule says "replace the one above, archive the outgoing line", and the practice is to prepend.
  There are 170 lines. That disagreement is real, but it is the Orchestrator's convention, and it is
  out of scope here. The board audit `board-audit-2026-10-10` already recorded it.)*
- **`EPIC-006`.** This is not `EPIC-006`'s and must not be folded into it — the Orchestrator's note
  says so explicitly.

## Acceptance (Given/When/Then)

- **`A1` (13 defined, 13 rendered).** **Given** `plans/board.md` after the change, **when** the H2
  headings are listed and the columns table's rows are listed, **then** the two sets are **equal** —
  13 and 13, same names, same order. *(At the cut: 13 and 10. At `f76e041`: 13 and 11.)*
- **`A2` (every heading's limit equals the dial).** **Given** each H2 heading's `(WIP n/limit)`,
  **then** every `limit` equals the matching value in `.grugops/factory.config.json#wip_limits`, and
  the unlimited columns read `(WIP unlimited)` and `Blocked` reads `(visible, time-tracked)` exactly
  as the FORMAT comment specifies.
- **`A3` (live counts are true).** **Given** each heading's left-hand number, **then** it equals the
  count of ticket rows under that heading. **The two new columns read `0`** — verified by there
  being no rows, not by asserting it.
- **`A4` (no ticket moved).** `git diff` shows **zero** ticket rows added, removed, or moved between
  columns. **Given** the diff, **then** the only changes are the two headings, the FORMAT/table
  line, and one `_Updated:` line.
- **`A5` (the header is written the way the board writes it at the build; re-worded 2026-10-10).**
  **Given** the diff, **then** exactly **one** `_Updated:` line is added, in the position and form
  the Orchestrator's own last header uses, and **zero** existing `_Updated:` lines are changed or
  removed (`git diff` shows no `-_Updated:` line). **If** the hop replaces a line instead, the
  outgoing line is first appended **verbatim** to `plans/tickets/history/ABC-055-board-history.md`,
  with its md5 and character count recorded. *(Was: "archive before replacement", unconditionally.
  The practice since then has been to prepend, with 170 lines at `f76e041`. Under that practice
  nothing is replaced, so nothing is lost.)*

## Dependencies

- **None.** The dial exists, the FORMAT comment exists, the columns table exists, and nothing is in
  flight in either missing column.
- **How the build is sequenced (2026-10-10, BA/PM's recommendation, the Orchestrator's call).**
  `plans/board.md` is the Orchestrator's file, and every hop's close-out commits to it. So:
  **(i)** the Orchestrator builds this itself, or holds every other board write for the length of
  one hop; **(ii)** branch from the wave tip immediately before, and merge before the next board
  move; **(iii)** do it **before** routing `ABC-010` (or the `ABC-072` ruling) into `In Design`, so
  that the first ticket to sit there has a heading to sit under. The edit is two headings between
  `Ready` and `Ready for Dev`, one FORMAT line and one prepended `_Updated:` line. Rows are not
  touched, so only the prepend can conflict, and a rebase resolves it.

## Security / NFR triggers

- **`N8-LANE` not triggered** — **0 new test files** and **0 files added under `src/`**. This ticket
  touches `plans/` and nothing else.
- **`NFR-002` not triggered.** No production path.
- **Security: not triggered.** `ABC-041`'s repaired four clauses: **(a)** no manifest touch.
  **(b)** Does not fire, per `ADR-0036` § Canonical clause (b) (DELTA). This ticket edits
  `plans/board.md` and, only if a header is replaced, one `history/` file: 0 production files, so
  (b1) 0 capability lines and (b2) 0 new import edges. Run that section's three commands on the
  delivered commit and record them. **(c)** No test file is touched. **(d)** The blast radius is `plans/board.md`, plus one
  `history/` file only if a header is replaced. **On a disputed reading it fires and the gate
  resolves it.**

## Test notes

1. **`A1`–`A3` are checkable with a shell one-liner** over the file: `grep '^## '` for the headings,
   and `jq` over `.grugops/factory.config.json#wip_limits` for the numbers. State the commands in the
   hop's notes so the next reader can re-run them.
2. **There is no automated board validator in this repo.** The FORMAT comment says *"the validator
   can check the two for drift"* — that validator does not exist here, and this ticket does **not**
   build one. Do not read `A1` as a promise of a tool.
3. **Archive before replacing — if you replace.** `A5` destroys information only if a line is
   replaced without being archived first (98% of board-header content existed nowhere else, per the
   cut's measurement). Prepending, as the board does today, replaces nothing.

## Lane cost — how many test FILES this ticket implies

**Zero, and zero files under `src/`.** The lane budget is untouched.

## Size and priority rationale

**Size `XS` (1), re-sized 2026-10-10 from `S`.** Two headings and one FORMAT line. The archive step
that made it `S` does not arise under the prepend practice.

**Priority `P1` — PROMOTED 2026-10-10, on this page's own trigger.** The trigger was "promote to `P1`
the moment any ticket needs `In Analysis`, `In Design` or `Ready for Dev` as a place to sit".
`Ready for Dev` was needed and was given a heading (`ABC-115`, 2026-08-20). `In Design` is needed
now: `ABC-010`'s pull routes there, per the 2026-10-10 re-score, and `ABC-072` waits on an
Architect/Design ruling. **Not `P0`:** nothing is blocked; a ticket can still be placed by prose.

## Definition of Ready

**Re-scored 2026-10-10 by BA/PM at `f76e041`. Result: 10 of 10 — MET → `Ready`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** 13 defined, 11 rendered (re-measured); two limits (2, 2) unenforceable; `In Design` is about to be needed |
| 2 | scope and out-of-scope clear | **✅** two headings, one FORMAT line (including the dial path); move no ticket; the header convention fenced |
| 3 | INVEST-shaped | **✅** independent, small, testable by counting |
| 4 | acceptance testable and measurable | **✅** 13 = 13; every limit equals the dial; two live counts of 0; zero rows moved; `A5` re-worded to today's practice |
| 5 | dependencies known | **✅** none; the build's sequencing on the Orchestrator's file is named in three steps |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` 0 files; (b) under both readings |
| 7 | test notes present | **✅** three, note 3 conditional on replacement |
| 8 | size assigned | **✅** `XS` (1), was `S` |
| 9 | priority assigned | **✅** `P1`, promoted on its own trigger |
| 10 | no major unresolved blocker | **✅** none |
