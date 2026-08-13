---
id: ABC-055
title: `plans/board.md` defines 13 columns and renders 10 — three have no heading, so three WIP limits are unenforceable by reading the single source of WIP truth
status: backlog
column: Backlog
size: S
priority: P2
epic: —
feature: —
---

# ABC-055 — three columns exist in the table and nowhere else, and one of them is where a process rule lives

> **Cut 2026-08-13 by BA/PM** (task `gate-abc041-2026-08-13`, subtask `refinement-ABC-041-a4`,
> Workflow 07), out of the Orchestrator's observation while placing `ABC-041`
> (`.grugops/context/ticket-to-pr-ABC-041/notes/`). **Found while placing a ticket, not while
> auditing** — and deliberately not fixed mid-pull, which was the right call and is why it needs a
> ticket.

## Problem

*User*: every role that reads the board, and the Orchestrator most of all — the board is grugops's
**single source of WIP truth** and the file says so about itself.

*Pain*: **the columns table (`plans/board.md:73-87`) lists 13 columns. The file renders 10 H2
headings.**

```
Backlog  Ready  In Development  In Review  In Security/NFR
Ready for UAT  In UAT  Ready to Release  Done  Blocked
```

**Missing: `In Analysis`, `In Design`, `Ready for Dev`.** The board's own FORMAT comment (`:33-36`)
says each column is an H2 heading carrying its live/limit WIP count. Three columns cannot carry a
count they have no heading for, so **three WIP limits — 2, 2 and 6 — are unenforceable by reading the
file.**

`Ready for Dev` is the sharp one: `AGENTS.md` § Process rules, rule 1 names it as **where the
criteria review happens** and names the Orchestrator as its exit owner. It is a column with an owner,
a rule and a WIP limit of 6 that **does not exist as a place to put a ticket**. `ABC-041` moved
`Backlog → In Development` directly for exactly that reason — honest under rule 1, whose operative
clause keys on the entry to `In Development`, and recorded at the time rather than papered over.

*Value*: **nothing has overflowed those three limits yet**, and that is the whole argument for doing
this cheaply now rather than expensively later. `EPIC-003` and `EPIC-006` are both open and both
decomposed; the first ticket that genuinely needs `In Analysis` or `In Design` will find the column
missing at the moment it is least convenient.

## Scope

- **Add the three missing H2 headings** in flow order, each carrying `(WIP live/limit)` in the format
  the FORMAT comment fixes, with the limits taken from `.grugops/factory.config.json#wip_limits` —
  **read from the dial, not copied from the table**, and the two made to agree.
- **State which of the 13 columns may be skipped**, and where that is written. The FORMAT comment
  already says `In Security/NFR` and `Ready to Release` may stay empty in `lean` mode; the three
  missing ones have no such statement and their absence has been read as one.
- **One line in the columns table or the FORMAT comment** recording that heading and table must agree,
  so the next reader has the invariant rather than re-deriving it.

## Out of scope

- **Moving any ticket.** This is a structural repair to the file, not a board move. No ticket changes
  column and no WIP count changes as a result of it.
- **Changing any WIP limit.** The limits come from config; if a number is wrong that is a change to
  `.grugops/factory.config.json` and a different conversation.
- **Rewriting the `_Updated:` header convention or the `history/` archive rule.** Both work.
- **`EPIC-006`.** This is not `EPIC-006`'s and must not be folded into it — the Orchestrator's note
  says so explicitly.

## Acceptance (Given/When/Then)

- **`A1` (13 defined, 13 rendered).** **Given** `plans/board.md` after the change, **when** the H2
  headings are listed and the columns table's rows are listed, **then** the two sets are **equal** —
  13 and 13, same names, same order. *(Today: 13 and 10.)*
- **`A2` (every heading's limit equals the dial).** **Given** each H2 heading's `(WIP n/limit)`,
  **then** every `limit` equals the matching value in `.grugops/factory.config.json#wip_limits`, and
  the unlimited columns read `(WIP unlimited)` and `Blocked` reads `(visible, time-tracked)` exactly
  as the FORMAT comment specifies.
- **`A3` (live counts are true).** **Given** each heading's left-hand number, **then** it equals the
  count of ticket rows under that heading. **The three new columns read `0`** — verified by there
  being no rows, not by asserting it.
- **`A4` (no ticket moved).** `git diff` shows **zero** ticket rows added, removed, or moved between
  columns. **Given** the diff, **then** the only changes are headings, the FORMAT/table line, and the
  `_Updated:` header.
- **`A5` (the header rule was honoured).** The outgoing `_Updated:` line is appended **verbatim** to
  the matching `plans/tickets/history/<ID>-board-history.md` **before** replacement, with its source
  md5 and character count recorded. *(The board's own rule, and it names two occasions the
  Orchestrator broke it on 2026-08-09 before noticing.)*

## Dependencies

- **None.** The dial exists, the FORMAT comment exists, the columns table exists, and nothing is in
  flight in any of the three columns.
- **It should not be run concurrently with a board-moving hop** — one writer at a time on the single
  source of WIP truth. That is the Orchestrator's to sequence, not a blocker on the ticket.

## Security / NFR triggers

- **`N8-LANE` not triggered** — **0 new test files** and **0 files added under `src/`**. This ticket
  touches `plans/` and nothing else.
- **`NFR-002` not triggered.** No production path.
- **Security: not triggered.** `ABC-041`'s repaired four clauses, and all four are trivially quiet:
  **(a)** no manifest touch, **(b)** no non-`.test.ts` file under `src/` touched at all, **(c)** no
  test file touched at all, **(d)** blast radius is `plans/board.md` plus one `history/` file. **On a
  disputed reading it fires and the gate resolves it.**

## Test notes

1. **`A1`–`A3` are checkable with a shell one-liner** over the file: `grep '^## '` for the headings,
   and `jq` over `.grugops/factory.config.json#wip_limits` for the numbers. State the commands in the
   hop's notes so the next reader can re-run them.
2. **There is no automated board validator in this repo.** The FORMAT comment says *"the validator
   can check the two for drift"* — that validator does not exist here, and this ticket does **not**
   build one. Do not read `A1` as a promise of a tool.
3. **Archive before replacing.** `A5` is the one step that destroys information if it is skipped;
   measured at 98% of board-header content existing nowhere else.

## Lane cost — how many test FILES this ticket implies

**Zero, and zero files under `src/`.** The lane budget is untouched.

## Size and priority rationale

**Size `S` (2).** Three headings and one invariant line is `XS` of typing; the `S` is for reading the
dial, reconciling it against the table, and honouring the archive rule without breaking it.

**Priority `P2`.** Nothing has overflowed the three limits and no ticket is blocked. **Promote to
`P1` the moment any ticket needs `In Analysis`, `In Design` or `Ready for Dev` as a place to sit** —
`ABC-053` and `ABC-054` are both Architect/Design rulings and are the two most likely to want
`In Design` first.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-13**. **Result: 10 of 10 — MET.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** 13 defined, 10 rendered; three WIP limits (2, 2, 6) unenforceable; `Ready for Dev` carries a process rule and does not exist |
| 2 | scope and out-of-scope clear | **✅** three headings, one invariant line, limits read from the dial; four fences, first of which is "move no ticket" |
| 3 | INVEST-shaped | **✅** independent (nothing in flight in those columns), small, testable by counting |
| 4 | acceptance testable and measurable | **✅** 13 = 13, every limit equals the dial, three live counts of 0, zero ticket rows moved, archive verified by md5 |
| 5 | dependencies known | **✅** none; the single-writer sequencing named as the Orchestrator's, not a blocker |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` 0 files, `NFR-002` untriggered, security's four clauses all quiet with reasons |
| 7 | test notes present | **✅** three, including the explicit "no validator is built here" |
| 8 | size assigned | **✅** `S` (2) |
| 9 | priority assigned | **✅** `P2`, with the promotion trigger named |
| 10 | no major unresolved blocker | **✅** nothing is open and nothing is decided by anyone else |
