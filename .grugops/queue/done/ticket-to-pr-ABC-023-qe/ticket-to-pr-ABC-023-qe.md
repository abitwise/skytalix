---
task: ticket-to-pr-ABC-023
subtask: ticket-to-pr-ABC-023-qe
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ref: .grugops/context/ticket-to-pr-ABC-023/
enqueued_by: orchestrator
enqueued_at: 2026-08-10T07:17:49Z
branch: grugops/ticket-to-pr-ABC-023
---

# Subtask: break `ABC-023` — independently re-run `A5`, and find the build that passes every criterion

Read the shared verified context at `ref:` first (Workflow 16 step 1). **Nothing is inlined here.**
Five notes matter: the opening decision (the `main` baseline and what it did NOT check), BA/PM's
observation note (34 re-measured mutant verdicts), the pull decision (`A5` as a pincer; who runs the
mutants), the engineer's notes (its 34 runs, its three declared limitations), and my verification note
(what I re-ran at the source, and the correction I made to my own earlier ambiguity).

`ABC-023` is in `In Review` (1/3). **You own that exit.** The ticket is
`plans/tickets/ABC-023-castling-precondition-net-hardening.md` as corrected 2026-08-10.

## The one thing that makes this hop different

**`A5` is currently asserted only by the instrument of the role that wrote the rows.** The engineer
says so itself. That is the exact shape `ABC-009`'s `A7` had before it was retired as false — a
criterion whose only evidence came from the party it grades. **Your independent re-run is the
verification; without it `A5` is unasserted.** Build your own harness; do not reuse the engineer's.

`A5` has two halves and they fail in opposite directions:

- each named discriminating mutant must **DIE** — under-specified rows fail this;
- all **fifteen** behaviour-equivalent controls must still **SURVIVE**, killed count **zero** — rows
  that over-fit implementation shape fail this, and they fail it while everything is green.

The second half is the one that catches good-looking work. A row that kills an equivalent mutant pins
implementation shape instead of behaviour, and nothing in the suite will tell you.

## Three declared limitations to verify rather than inherit

The engineer reported these honestly, which is the standard this board wants. Honest is not the same
as correct:

1. **A pair mutant conditional on BOTH axes at once survives `A1`'s four rows.** The claim is that
   this is within `A1`'s stated bound, since enumerating the 169-combination space is the named `L`
   trap. **"It is out of scope" and "the criterion is short" look identical from the inside** — decide
   which one this is, with a measurement.
2. **One of the nine `A3` rows was already dead pre-rows** (`rook's square admits own BISHOP only
   QUEENSIDE`, killed at 558/559 by an existing `ABC-009` row), so **8 of 9** are proved individually
   necessary rather than 9 of 9. Is that a fine, or a criterion shortfall?
3. **The gate's terminal verdict is recorded as a `claim`, not a stamped finding** — there is no
   `scripts/context-io.ts` in this install, so no `§14-gate#<id>` can be minted. The numbers are hard;
   the verdict is not stampable. Do not treat the engineer's gate numbers as verified — re-derive the
   ones you rely on.

## What the precedent says you will find

On each of the last four tickets QE found builds that passed **every** criterion and the **whole**
suite — three on `ABC-022` that also passed deep perft 32/32, five on `ABC-009` at the first hop,
six on `ABC-018`. **Every one was a gap in the CRITERIA, never a defect in the code.**

When you find one — and you should assume you will — the repair is to **add rows**. **Never amend a
criterion so that a survivor stops counting.** `ABC-022` closed its gap with 120 new rows and no
criterion amended; that is the bar.

## Boundaries

- **`src/moves.ts` must still hash `6335b452fc21ffe2d0f902ecab930840` when you finish.** Check it.
  **You may not repair the module to make your own verdict green** — on the last five tickets the
  module's md5 was identical from the engineer's first commit through every gate, and that record is
  what makes the verdicts worth anything.
- **You may change test files and the ticket's own text is NOT yours to change.** If a criterion is
  short, say so and report it; amending acceptance is BA/PM's, and reopening `ABC-009` is nobody's on
  this ticket.
- **Do not reopen `ABC-009`.** Its `A1`–`A13` verdicts stand.
- **`A4` is a live criterion you must not break**: additions only, no existing test row modified or
  deleted, no other file under `src/` touched. If your rows need to modify an existing row, stop and
  say so — that is a conflict between criteria, and it is a report, not a judgement call.
- Report `PERFT_DEEP=1` **32/32** and skip count **0** as numbers, from your own run.

## Traps this board has already paid for

- **One OS process per tree state.** Node's module cache served a pristine `moves.ts` to four tree
  states in one process on `ABC-009` and produced a false "the harm does not reproduce".
- **Verify the instrument before believing a red.** Typecheck every mutant — `BROKEN-BUILD` is neither
  a survivor nor a kill. A non-compiling control on `ABC-009` produced 147 failures nearly read as
  "the rows over-fit", and BA/PM fixed its own table parser this morning before believing its output.
- **Print the input, not the verdict.** Every measurement prints the FEN it used and re-parses it.
- **A green signal read as protection without asking what it could fail on** is this ticket's own
  stated lesson, and it applies to your harness too.

The test-integrity checker exits **2** here (`.grugops/test-skips.md` does not exist) — that is a
known, recorded condition on this board, "could not run", not a pass and not the exit-`1` short
circuit. **Do not create the registry file**; skip count is 0 so nothing is owed a justification.

Publish typed notes per Workflow 16 in the exact shape of `agent-factory/contracts/context-note.md`.
**`finding` is NOT admissible on this task** — there is no §14 gate here to issue a `§14-gate#<id>`
stamp and `context.human_admission` is `off`. Record results as `observation` / `decision` / `claim` /
`failed-attempt`. Nothing self-stamped; no `index.md` / `index.jsonl` hand-faked.

Claim by hand: **`scripts/claim.js` does not exist in this install.** The claim is the atomic `mkdir`
of `.grugops/queue/claimed/<subtask>/` with a `claim.md` inside it, then `mv` the subtask file in, and
`mv` the whole directory to `done/` when finished.

Take your own `at` from `date -u`; **this machine is UTC+3**, so a local timestamp labelled `Z` is a
three-hour lie. Update your own row in `plans/traceability.md`. Take the `In Review` exit on
`plans/board.md` per your verdict, keeping the ticket frontmatter in sync in the same commit, and
**archive the outgoing `_Updated:` header verbatim to `plans/tickets/history/ABC-023-board-history.md`
BEFORE replacing it**. **Do not enqueue anyone** — the Orchestrator owns decompose→enqueue, and the
Security/NFR call and the merge are the Orchestrator's. Commit on the branch named in the frontmatter;
**never commit directly on `main`**. Never merge, never deploy.
