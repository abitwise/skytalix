---
task: budget-ABC-115-2026-08-21
subtask: budget-abc115-spawn-clause
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ticket: plans/tickets/ABC-115-piped-session-dies-on-epipe-with-the-refusal-exit-code.md
ref: .grugops/context/budget-ABC-115-2026-08-21/
enqueued_by: orchestrator
enqueued_at: 2026-08-21T00:30:00Z
branch: grugops/abc115-spawn-clause
base: grugops/abc115-piped-session-exits-clean @ aac410c
---

# Subtask: rule the `N8-SPAWN` CPU clause YOU wrote — the delivered build breaches it, and the engineer stopped rather than shipping

**Branch off `grugops/abc115-piped-session-exits-clean` @ `aac410c`, NOT `main`.** Six branches are
stacked unmerged; merging is the human's.

`ABC-115` is built, all four gates green, all nine criteria answered. **It is stopped at
`In Development`** because the delivery breaches `N8-SPAWN`'s `≤ 0.5 s CPU` clause — the clause **you
raised to +6 and gave time clauses to** at `amend-ABC-115-2026-08-20`. The engineer reported it,
took neither remedy, and moved nothing, because both remedies are your pen. **Only you can unblock
the `In Review` exit.**

## The engineer's claim (unstamped — re-measure, do not inherit)
- Measured: +6 children (met, exactly at ceiling), +1.14 s wall (met), **+1.02 s CPU user+sys /
  +0.78 s user against `≤ 0.5 s`** — 5 interleaved paired runs, sign 5/5.
- The claim that matters: **no six children of this product could have met the clause.** The
  `64–72 ms/child` it was derived from is **wall**; a node child reportedly costs ~0.16 s of **CPU**
  against 0.07 s of wall, so six of any shape cost ~0.96 s. If that holds, the clause was
  arithmetically unmeetable the day you wrote it, and nothing the harness did caused the breach.
- They also priced the obvious remedy: dropping `A3`'s default-glyph pair saves ~0.32 s and **still
  breaches**.

## What to settle
1. **Re-measure the wall-vs-CPU-per-child arithmetic yourself.** If the engineer is wrong and a
   meetable shape exists under `≤ 0.5 s`, say so and require it — do not relax a clause that works.
2. **If it is unmeetable, re-derive the clause honestly** — CPU per child measured, not inherited
   from a wall figure — and write WHY the first derivation was wrong so the error is not repeated.
   Re-deriving a budget is not the same as excusing an overrun; say which one you are doing.
3. **Do not drop a criterion to fit a number.** You already priced and rejected that trade; the
   engineer declined it too. If you now think a row should go, that is a re-cut and must be argued.
4. **Say plainly whether `ABC-115` may proceed to `In Review`**, and on what basis.
5. The engineer reported the lane contribution (+1.14 s wall, +1.02 s CPU) **to `ABC-108`**, which
   owns that budget. Confirm that landed as a report and **do not grade `NFR-008` here.**

## Fences
- **Do not touch `src/`.** The build is delivered and green; this is a budget ruling, not a repair.
- Do not re-open the exit code (`ADR-0016`), do not edit `ADR-0016` or `AGENTS.md`, do not touch
  `ABC-108`/`ABC-110` beyond the report the engineer already filed.
- Do not move `ABC-115` yourself past `In Development` — the `In Review` exit follows QE's hop and
  the board move that goes with it. **Rule the clause; the column is not yours here.**
- Do not merge, do not deploy, do not self-sign.

## Publish
Typed notes per Workflow 16 into `ref:`, hand-authored per `agent-factory/contracts/context-note.md`
(no `finding` — `human_admission` is `off`). Append your `plans/traceability.md` row. Claim by hand
per Workflow 17: bare `mkdir .grugops/queue/claimed/budget-abc115-spawn-clause`, move this file in,
then out to `done/`. Work in your own `git worktree`. Commit on `grugops/abc115-spawn-clause`.
