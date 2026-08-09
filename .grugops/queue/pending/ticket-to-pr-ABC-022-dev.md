---
task: ticket-to-pr-ABC-022
subtask: engineer-abc022-implement
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-022/
enqueued_by: orchestrator
enqueued_at: 2026-08-09T20:08:22Z
branch: grugops/ticket-to-pr-ABC-022
---

# Subtask: implement `ABC-022` — the two en-passant preconditions `addPawnMoves` does not enforce

Read the shared verified context at `ref:` first (Workflow 16 step 1). **Nothing is inlined here.**
Seven notes. The two Orchestrator `decision` notes carry the Definition-of-Ready history and what was
verified on whose instrument; the five BA/PM notes carry the correction hop's measurements.

`ABC-022` is in `In Development` (1/3). Its `## Acceptance` was **corrected in place on 2026-08-09**
after a DoR re-check found seven defects — **read the ticket as it stands now, not any summary of
it.** `A2`, `A3`, `A4`, `A5`, `A11` and the acceptance preamble all changed, and four of the seven
were the same shape: a criterion narrower than the ticket's own `## Scope`.

## The ticket is the specification. Three things about it are worth flagging up front

1. **`A3` covers BOTH colours to move, and that is the defect this hop found.** A fix implementing
   the captured-pawn precondition for white only passes `A1`–`A6` *as they were written before today*
   and the whole suite 381/381, while still creating a phantom white pawn. Do not write the guard
   against `black` in one direction.
2. **`A4` is asserted against the STATE — 128 board bytes and all five scalars, field by field — and
   NOT through `toFen`.** `toFen` is measurably not injective on this state (28 castling bit values
   render as `-`; `epSquare` 32 renders identically to the off-board 40). `## Test notes` item 2 has
   always said this; `A4` now matches it.
3. **`A5` is a real guard with a re-derived justification.** Its old justification was false and was
   retired. It is kept because it is the only thing on this board that kills a colour-shaped
   *restructure* of the ordinary-capture branch — a mutant that otherwise passes 381/381 **and** deep
   perft 32/32. Do not delete `A5` on the grounds that it looks inert.

## The ordering choice is yours and it is worth making deliberately

`NFR-001`'s primary evidence on this ticket is a **count, not a clock** (the perft harness's per-cell
floor is ±2.0%, so a per-cell ratio bar cannot carry a verdict — the catalog's own resolution). The
count is already measured and it depends on where you put the guards: the added conditions are
evaluated **331** times over the standing 518,474-node walk when they sit **after** the
`to === position.epSquare` test, and **216,269** times if placed before it — a ~650x difference — and
they reject **0** either way. Make that placement a decision and record it as one, with the
alternative you rejected. `ABC-009`'s engineer did exactly this for the castling guards and the
reasoning is on that ticket.

## Boundaries

- **Fix site is `addPawnMoves` in `src/moves.ts`.** `src/legal.ts` gets a **comment-only** edit for
  `A11` — no executable line there changes. `A11`'s citation is lines **102-103**; **line 104-105 is a
  separate and TRUE sentence and must not be rewritten.**
- **Do not touch `src/legal.ts`'s guards or `src/zobrist.ts`.** `ABC-022`'s `## Out of scope` and its
  `## THE CORRECTION THIS TICKET CARRIES` section explain why `ABC-011`'s guard (a) is **not** a
  workaround for this defect and does not become deletable when it lands. Deleting it reopens four
  assertions.
- **`A9` requires that no existing test is modified — verified at line level, not by inspection.** Put
  the new table in a NEW test file so that claim is mechanical, the way `ABC-009` did with
  `src/moves.castling.test.ts`.
- **Do not add a perft position.** `A7` is a walk of the existing table. Perft provably cannot reach
  this defect (0 of 518,474 nodes) and a new case would cost minutes for zero coverage.
- **Do not edit `ABC-023`.** Its `A4` pins `src/moves.ts` at md5
  `0e247853ab2c05887c76105ff83d8621` and your fix will invalidate it. That is known, it is recorded,
  and it is deliberately deferred to `ABC-023`'s own promotion hop — do not re-pin it and do not note
  it again.
- **Do not edit `plans/nfr-catalog.md`**, `ABC-010`, `ABC-011` or `ABC-013`.
- **`## Scope`, `## Out of scope`, size `S` and priority `P1` are settled.** If implementation forces
  one of them to move, **say so and stop** — do not move it silently.

## Prove it red before you prove it green

`## Test notes` item 3 is a requirement, not advice: prove each new assertion RED before the fix
exists, and prove each half load-bearing by deleting it — the empty-target condition alone and the
captured-pawn condition alone must fail **disjoint** named sets. If deleting one fails nothing, the
other is subsuming it and one of your two conditions is not the condition it claims to be.

Run the deep perft lane (`PERFT_DEEP=1 npx vitest run src/perft.test.ts`, ~38 s) **before** you hand
back, not after. Baseline on the branch tip right now: **381/381 on 16 files, skip count 0**, perft
fast 24/24.

## Traps this board has already paid for

- **One OS process per tree state** in any mutation run — Node's module cache served a pristine
  `moves.ts` to four tree states in one process on `ABC-009` and produced a false negative.
- **Verify the instrument before believing a red.** Typecheck every mutant; a non-compiling control
  was nearly read as "the rows over-fit".
- **Print the input, not the verdict** — every probe prints and re-parses the FEN it used.
- **The purity oracle is self-masking on some positions**: on `4k3/8/8/8/3pp3/8/8/4K3 b - e3 0 1` the
  ep move corrupts e4 and the next move in the same pass heals it, so a call-level purity check reads
  CLEAN on a board the generator provably wrecks. BA/PM's notes carry the row-selection rule.

Publish typed notes per Workflow 16 in the exact shape of `agent-factory/contracts/context-note.md`.
**`finding` is NOT admissible on this task** — there is no §14 gate here to issue a `§14-gate#<id>`
stamp and `context.human_admission` is `off`. Record results as `observation` / `decision` /
`claim` / `failed-attempt`. Nothing self-stamped; no `index.md` / `index.jsonl` hand-faked.

Claim by hand: **`scripts/claim.js` does not exist in this install** — no `scripts/` directory in the
repository and none in the kit root. Re-check that at the source rather than trusting this file.

Take your own `at` from `date -u`; **this machine is UTC+3**, so a local timestamp labelled `Z` is a
three-hour lie. Update your own row in `plans/traceability.md`. Commit on the branch named above;
**never commit directly on `main`**. The `In Development → In Review` exit is yours; **do not enqueue
QE and do not take any later column.** Never merge, never deploy — a human holds both.
