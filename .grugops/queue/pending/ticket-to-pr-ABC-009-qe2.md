---
task: ticket-to-pr-ABC-009
subtask: qe-abc009-a11
role: qe-e2e
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-009/
enqueued_by: orchestrator
enqueued_at: 2026-08-09T13:59:50Z
branch: grugops/ticket-to-pr-ABC-009
---

# Subtask: close `A11` in tests — the dimension, not another instance

Read the shared verified context at `ref:` first (Workflow 16 step 1). **Nothing is inlined here.**
Thirty-four notes. Ordering warning: `20260809T141500Z-orchestrator-decision-865b06ae` carries **local
time labelled `Z`** and is **superseded** by `20260809T114649Z-orchestrator-decision-700d4a44`. Take
your own `at` from `date -u`; this machine is UTC+3.

You already hardened this ticket once (`qe-abc009-review`, 62 mutants, 15 survivors, five closed in
tests). **This hop exists because your `G-1` rows closed the queen *instance* and not the *dimension*,
and nobody caught it — including the Orchestrator, who built the queen mutant, watched it die to four
of your tests, and called the gap closed.** That is the ticket's own defect performed on the ticket:
testing the example instead of the rule. It is recorded against the Orchestrator, not against you.

The ticket has been moved **backward**, `Ready for UAT` → `In Review` (1/3), because a ticket with an
unmet acceptance criterion cannot honestly sit in `Ready for UAT`. First backward move in this
project's history.

## What is owed

BA/PM added **`A11`**, which is **NOT MET**, quantifying over **every own piece type on both home
squares** rather than adding a fourth sample. Read its exact text in
`plans/tickets/ABC-009-legalmoves-position-mutation.md` — that text is the requirement, not this
summary.

Measured by BA/PM over ten mutants of the delivered diff, and the first row re-derived independently by
the Orchestrator before the board was moved:

```
king's square as "own KING or own ROOK"    33/33 acceptance · 19/19 YOUR hardening · 356/356 · deep 32/32
king's square as "own KING or own PAWN"    33/33 · 19/19 · 356/356 skip 0
rook's square as "own ROOK or own PAWN"    33/33 · 19/19 · 356/356 skip 0
rook's square as "own ROOK or own KNIGHT"  32/33  ← the only one that dies, to A6's knight row
harm, own-KING-or-ROOK on 4k3/8/8/8/8/8/8/K3R2R w K - 0 1:
  one legalMoves() call → 4k3/8/8/8/8/8/8/K3K2R w K - 0 1   THE ROOK IS DESTROYED, king written over it
```

**The code is correct.** BA/PM measured the delivered diff satisfying every row of `A11` over the full
space `parseFen` accepts, and `src/moves.ts` is byte-identical to the engineer's first commit
(`0e247853ab2c05887c76105ff83d8621`). **What is owed is test rows and ZERO production lines. Do not
touch `src/moves.ts` — if you believe it needs a change, stop and say so instead.**

BA/PM estimates ~9 rows. **That is an estimate, not a specification** — you decide what the criterion
needs. It explicitly rejected scoping `A11` down to the piece types already covered, on the grounds
that doing so *"performs this ticket's own defect on itself with three counter-examples in hand"*.

## The trap to avoid, stated plainly

Three roles have now closed a sample and called the dimension closed. **Write the rows so that a mutant
admitting *any* single wrong own piece type on *either* home square dies** — then prove it by building
the mutants BA/PM names above and confirming each one dies to your new rows. A row set that kills
own-KING-or-ROOK but not own-KING-or-PAWN repeats the error one level up.

Also prove the other direction, as you did last time: the **nine behaviour-equivalent mutants must
still survive**. If your new rows kill those too, they are pinning implementation shape rather than
behaviour.

## Already settled — do not spend the hop on these

- **`A12`** (`G-2`, rights per side, with BA/PM's ordering clause) is **already satisfied** by your
  existing rows. Only three of your six rows discriminate anything; BA/PM recorded which. No work owed.
- **`A7` is KEPT and reclassified.** Inert by construction across 0 of 72 mutants, but it is the suite's
  only purity walk over legal positions and was **absent rather than failing** before this ticket. BA/PM
  deleted its false justification, not the criterion. Do not delete it and do not re-litigate it.
- **Guard ordering** is discharged as a proven property (permutation-invariant) and can carry no
  criterion — no test could ever fail on a reorder, so a criterion would be unfalsifiable.
- **`NFR-001`** is met on both clauses with a count-based argument. Do not re-measure.
- **`ABC-022` half (b)** is live by design. Not a miss.
- **The `plans/traceability.md` 11-cell defect you flagged does NOT exist** — the pipes are correctly
  escaped (`\|`) and every row has ten cells in all eight commits. The Orchestrator confirmed your
  report without re-deriving it and was wrong to; BA/PM caught it. Nothing to fix.

## One measurement trap, recorded because it already caught a role

BA/PM ran four tree states in **one process** and Node's module cache served pristine `moves.ts` to
every round, producing a false *"the harms don't reproduce."* The tell was identical output across
trees. **One process per tree.**

Publish typed notes per Workflow 16. **`finding` is not admissible on this task**. Nothing self-stamped,
no `index.*` faked. Claim by hand; `scripts/claim.js` does not exist here (re-check rather than trusting
this file).

Own the `In Review` exit when `A11` is genuinely closed — that is your board move, and it goes forward
to `Ready for UAT` only if the criterion is met. Update your own row in `plans/traceability.md`. Do not
merge, do not deploy, do not enqueue anyone.
