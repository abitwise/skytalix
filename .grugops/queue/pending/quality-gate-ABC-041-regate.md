---
task: gate-abc041-2026-08-13
subtask: quality-gate-ABC-041-regate
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ref: .grugops/context/quality-gate-ABC-041-regate/
parent_ref: .grugops/context/quality-gate-ABC-041/
also_read: .grugops/context/ticket-to-pr-ABC-041-a4fix/, .grugops/context/refinement-ABC-041-a4/
ticket: plans/tickets/ABC-041-render-seam-closure.md
enqueued_by: orchestrator
enqueued_at: 2026-08-13T22:45:00Z
branch: grugops/quality-gate-ABC-041-regate
worktree: ../cli-chess-qe041b
base: grugops/ticket-to-pr-ABC-041-a4fix @ 78a3db8
---

# Subtask: NARROW re-gate. You raised the block on `ABC-041`; you clear it or you keep it.

**This is not the first gate again.** Your `parent_ref:` is your own previous hop — 13 mutants, 9
killed, 4 survived. **Do not rebuild what you already established.** Two hops answered you: BA/PM
repaired the criteria, the Engineer repaired the instruments. Judge the answer, not the ticket from
scratch.

## Verified by the Orchestrator before you were called — check me, don't repeat me

- `src/render-seam.ts` is byte-identical to BA/PM's base: **the same git blob object**
  (`51e50a38…`) — it is absent from the Engineer's diff entirely.
- The Engineer's scope is `src/render-seam.test.ts` (+48/−28), `plans/traceability.md` (+3/−1) and
  five notes. The ticket page was not opened; `src/history-pane.nfr.test.ts` was not opened.
- Gates at my own hand on `78a3db8`: lint **0**, typecheck **0**, build **0**, **828/828 on 29
  files**, `src/render-seam.test.ts` **12 passed**, skip **0**.
- The `supersedes:` chain is real and points at the right note id.

## The four questions this hop exists to answer

1. **Does the repaired `A4`'s instrument actually kill what the circular one let through?** The
   Engineer reports an A/B/C matrix: same `X2` mutant, whole-frame check removed in both B and C,
   **only the width source differing** — panel-derived RED, `frame[0]`-derived GREEN. That is the
   right shape for the measurement. **Reproduce B and C.** If it holds, the circularity is closed on
   evidence rather than on a rewrite.
2. **Is the repaired `A4` still worth having, or was it softened to fit the build?** It now states
   what it does **not** catch. Confirm that what it *does* claim is real: the orientation-ignoring
   mutant and the self-padding mutant both still die.
3. **`A11`.** The Engineer did not add a row — it reports that your own `A4 (purpose)` row already
   asserted exactly `A11` and **renamed** it, assertions untouched. Verify the rename is a rename:
   diff it. Then confirm `A11` kills the byte-identical-copy mutant that `A4` provably cannot — that
   is the property that moved, and if it did not survive the move, it was lost.
4. **The overlap you are owed.** The Engineer **kept** your standalone `A4 (width)` row even though
   the repaired `A4` may subsume it, saying that deleting a gate row on the hop answering that gate
   looks like softening. That instinct is right and the disposal is **yours**: keep it, fold it, or
   delete it — with a reason.

## Also

- Three of your four earlier survivors were criterion-instrument weaknesses homed to BA/PM
  (`A3`'s digit-grep, `A6`'s substring grep, the diff-vs-file scope). Confirm the repaired page
  addresses them **or** say plainly that it does not — you are the only role that has seen both the
  mutant and the new wording.
- The lane allotment of **1** new test file must still be spent exactly once. Confirm the file count
  did not move.

## Hard limits

- You are in `../cli-chess-qe041b` on `grugops/quality-gate-ABC-041-regate`, off `78a3db8`.
  `node_modules` is symlinked; **remove the symlink before you finish.** Commit on that branch only —
  **never `main`, never another agent's branch.**
- **Do not touch the ticket page** and do not touch `src/render-seam.ts`.
- Record under `ref:` as `claim` / `observation` / `decision` / `artifact-ref`. **No `finding` is
  admissible on this install**; never invent a `§14-gate#<id>` stamp, never record a could-not-run as
  a pass.
- **Do not merge, do not deploy.** Return a verdict — `READY_FOR_HUMAN_REVIEW` or a maintained block
  — with every remaining gap homed to a named role.

## The one thing I will not have you do

Do not clear the block because two hops did work. **Clear it because the evidence says the criterion
now discriminates.** If it does not, keep the block and say what is still missing — a gate that yields
to effort is not a gate.
