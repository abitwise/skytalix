---
id: 20260812T030000Z-orchestrator-decision-e2b48c17
kind: decision
by: orchestrator
at: 2026-08-12T03:00:00Z
verified_by:
confidence: high
refs:
  - ABC-017
  - ABC-027
  - ADR-0009
  - ADR-0010
supersedes:
---

# `ABC-017` built; a vacuous criterion routed, and a cross-ticket restraint worth naming

> **Hand-authored.** `scripts/context-io.ts` does not exist in this repo or the kit, and
> `mcp__grugops__propose_note` is not in this session's tools. **Nothing here is a `finding`.**
> Written BEFORE the subtask that references it.

## Verified, not accepted

`src/history-pane.ts` + two test files added, `src/frame.test.ts` modified — **that fourth file is
this ticket's own assignment** under `ADR-0009` cl. 5, not a boundary breach. `HISTORY_COLS` is 21.
**697/697 on 24 files**, lint/typecheck 0, skip 0, re-run after rebasing onto `main`.

## The restraint I want on the record

**It declined to widen `HISTORY_COLS` to 24, and the reason is cross-ticket.** `ADR-0010` measured
that 24 **masks** the status panel's own width swing — 0/20 stale frames at 24 against 8/20 at 21,
same panels, same writer. Widening would have made this pane's own tests prettier by hiding a defect
that belongs to `ABC-027`.

**21 leaves the defect visible to the ticket that owns it.** That is an engineer choosing the harder
number because the easier one would have suppressed someone else's signal — and it is exactly the
class of masking `ADR-0010` cl. 2 forbids. The struck widest-panel/SET-`W` reasoning appears nowhere
in the code, comments or notes.

## It caught its own error with a mutant, and the error is instructive

Its first `A13` placement put `<= 24` beside `= 23` **in one `it` block**. The tripwire asserts
first, so **the requirement is never evaluated on any mutant that moves `H`** — the output cannot
distinguish *"ratify this"* from *"`4b` is dead"*. Split into its own test and re-measured by running,
not transcribing: **M4 is passed by `A1` and killed only by `A13`.**

**Two assertions in one block is a silent-precedence bug, not a style question**, and it is the same
shape as several criterion defects this round: a check that cannot fail because something else fails
first. It also **declined** to simulate M1/M6/M7 by editing the `STATUS_ROWS` shadow, on the grounds
that doing so *measures the assertion against itself* and would produce a table that looks complete
and proves nothing.

## `A13` is met in part, and the remainder is a re-gate obligation

`src/status-panel.ts` does not exist on `main`, so `status` stays a shadow constant — importing
`STATUS_ROWS` would be `TS2307` and turn the project-wide **blocking** typecheck gate red, **which is
the exact cost `ADR-0009` refused to pay.** Two edits are owed at the rebase (the import, and sizing
`statusStub` from it) and both are named in a docblock at the constant's own site.

**This is the same shape as `ADR-0009` cl. 9f's obligation on `ABC-019`**, and I am recording it as
such so the merge sequence carries two re-gate debts, not one.

## The criterion defect routed

**`A3`'s last clause is vacuous as worded**: *"the pane contains neither `e4 e5` nor `Nf3 Nc6`"*.
Measured on the delivered pane at 3 plies — which **does** contain both moves — the literal test
returns `false`, because padded cells are never separated by a single space. **No layout satisfying
`A2`/`A3` can ever contain those literals, so the clause can never fail.** The row list and the
ordered move numbers are what actually bind.

Routed to BA/PM before QE, on the pattern this round has established: a mutant net built against a
criterion about to move is discarded work.

## Board

`ABC-017`: `In Development` → `In Review`. In Development 2/3 → **1/3** (`ABC-027`, on the FAIL),
In Review 1/3 → **2/3** (`ABC-019` held, `ABC-017`).

## Also flagged

`src/history.ts` now has **two** *test* runtime importers rather than one — `A7` requires `takeBack`
by name. **The production claim (zero) is unchanged and is now asserted in-suite against delivered
source.** Named so the Security/NFR gate's `grep` is not surprised by it later.
