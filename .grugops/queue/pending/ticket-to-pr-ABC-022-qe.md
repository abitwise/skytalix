---
task: ticket-to-pr-ABC-022
subtask: qe-abc022-review
role: qe-e2e
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-022/
enqueued_by: orchestrator
enqueued_at: 2026-08-09T22:10:04Z
branch: grugops/ticket-to-pr-ABC-022
---

# Subtask: break `ABC-022` — the review gate, and the `In Review` exit is yours

Read the shared verified context at `ref:` first (Workflow 16 step 1). **Nothing is inlined here.**
Thirty-nine notes across five hops: two BA/PM (the seven-defect correction, then the `A11` sweep) and
three engineer (the fix, then two comment-only hops). The Orchestrator's latest `decision` note
carries the gate figures, two rulings and what it did **not** establish.

`ABC-022` is in `In Review` (1/3). **The `In Review` exit is yours** — `In Security/NFR` if it
passes, back to `In Development` if it does not. Both are legitimate.

## The state you are reviewing

`src/moves.ts` `6335b452fc21ffe2d0f902ecab930840` — two guard conditions and a local const in
`addPawnMoves`, unchanged across all three engineer hops. One new test file
(`src/moves.enpassant.test.ts`, 58 tests). Comment-only edits to `src/legal.ts`,
`src/legal.test.ts` and the new test file's header. Baseline re-run by the Orchestrator:
**439/439 on 17 files, skip count 0**, lint/typecheck/build exit 0.

## Match `A11` on its SENTENCES, not its line numbers

Two comment-only hops shifted every `A11` line citation below their edits, and re-pinning was
**deliberately not ordered** — it would be stale again on the next edit. The quoted sentences are the
stable key. The engineer's citation map is in the ticket's `## Implementation`. **Do not report a
citation mismatch as a defect** unless the quoted sentence itself is absent or still false.

## Two rulings you may challenge, and one you should not re-open

1. **ACCEPTED — two sites beyond `A11`'s citation table** (`src/moves.enpassant.test.ts` 82-83,
   95-97) were fixed as well as the tabled ones. The Orchestrator ruled the table a floor rather than
   an enumeration. **It is a judgement call and you may challenge it.**
2. **OUT OF SCOPE — `src/moves.castling.test.ts` 7-10 and 98-99** carry the same false present-tense
   shape, but `ABC-009` falsified them, not this fix. Already routed to `ABC-023`. **Do not fold them
   in and do not count them against this ticket.**
3. **SETTLED — `A5` is kept and its old justification is retired.** Two hops proved by exhaustion that
   an emptiness test and a colour test are behaviour-equivalent at that program point, so no criterion
   can discriminate them. Do not re-litigate that; **do** test whether `A5` still kills the thing it
   is now claimed to kill.

## Where the evidence is thin, which is where you should push

Everything below was measured by the role that produced it and **re-derived by nobody**:

- The **58/58** on the fix and the **8-vs-23 disjoint** load-bearing split (empty-target deleted vs
  captured-pawn deleted, intersection empty).
- The **colour-shaped restructure** mutant `A5` is kept to kill — claimed to pass `A1`–`A4`, `A6`, the
  full suite **and** deep perft 32/32, with `A5` the only thing that fails it. **That claim is the
  entire justification for keeping `A5`. Test it.**
- `A4`'s purity assertions, including the **self-masking** row where the ep move corrupts e4 and the
  next move in the same pass heals it — a call-level oracle reads CLEAN there.
- The **331 / 216,269 / 0** evaluation counts behind `NFR-001`'s count-based discharge.
- `A7`'s six per-root node counts and the ep-offered-onto-occupied 0-both-ways claim.

## The standing traps on this board

- **One OS process per tree state.** Node's module cache served a pristine `moves.ts` to four tree
  states in one process on `ABC-009` and produced a false negative.
- **Verify the instrument before believing a red.** Typecheck every mutant; a non-compiling control
  was nearly read as "the rows over-fit".
- **Print the input, not the verdict** — every probe prints and re-parses its FEN.
- **Do not repair the module to make your own verdict green.** Every ticket on this board records that
  `src/moves.ts` was byte-identical to the engineer's first commit through every gate. If you believe
  the production code is wrong, **fail the gate and say so** — do not fix it.
- A criterion that kills nothing is a finding worth reporting, not a criterion worth quietly passing.

## Boundaries

- **Do not touch `src/moves.ts`.** If it must change, that is a FAIL verdict and a return to
  `In Development`, not an edit by you.
- **Do not edit `## Acceptance`** — it is BA/PM's, twice-corrected. If a criterion is wrong or
  unfalsifiable, **report it**; do not rewrite it.
- **Do not edit `ABC-023`, `ABC-009`, `ABC-010`, `ABC-011` or `plans/nfr-catalog.md`.**
- You own the `In Review` exit and the board move that goes with it. **Do not enqueue Security/NFR** —
  the Orchestrator routes it.
- Run `PERFT_DEEP=1 npx vitest run src/perft.test.ts` (~37 s) yourself — `A8` is zero-tolerance and it
  is the only exhaustive oracle that this change is invisible to legal play.

Publish typed notes per Workflow 16 in the exact shape of `agent-factory/contracts/context-note.md`.
**`finding` is NOT admissible** — no §14 gate exists here to issue a `§14-gate#<id>` stamp and
`context.human_admission` is `off`. Nothing self-stamped, no `index.*` faked.

Claim by hand: `scripts/claim.js` does not exist in this install — re-check at the source. Take your
own `at` from `date -u`; **this machine is UTC+3**. Update your own row in `plans/traceability.md`.
Commit on the branch above; **never commit directly on `main`**. Never merge, never deploy.
