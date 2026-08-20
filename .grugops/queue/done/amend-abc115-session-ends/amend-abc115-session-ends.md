---
task: amend-ABC-115-2026-08-20
subtask: amend-abc115-session-ends
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ticket: plans/tickets/ABC-115-piped-session-dies-on-epipe-with-the-refusal-exit-code.md
ref: .grugops/context/amend-ABC-115-2026-08-20/
enqueued_by: orchestrator
enqueued_at: 2026-08-20T23:00:00Z
branch: grugops/abc115-amend
base: grugops/abc115-design @ 5703fcb
---

# Subtask: close the hole Architect/Design found in YOUR acceptance — a wrong fix passes `ABC-115` today

**Branch off `grugops/abc115-design` @ `5703fcb`, NOT `main`.** Three branches are stacked unmerged
(`cut-epipe-regression` → `abc115-design` → yours) because merging is the human's, not an agent's.

Architect/Design confirmed your exit-code ruling (`0` holds, `A2`(i) unchanged, DoR item 10 closed,
no `AGENTS.md` edit owed) and then found something your page does not catch, and **deliberately did
not write the fix, because criteria are your pen, not theirs.** That deference is the whole reason
this hop exists — read their note before you decide whether they were right.

## The gap, as THEIR claim (unstamped — re-measure it, do not inherit it)
A bare `EPIPE` swallow reportedly satisfies `A1` and `A2` on your own Givens — exit `0`, silent
stderr — while leaving the session running on invisibly into a dead pipe. Their measurement:
**8.02 s against 3.07 s** for the shape they ruled. **Nothing on your page asserts the session
ENDS**, and `A4` does not reach it.

## What to settle
1. **Re-measure the claim.** If a bare swallow does NOT pass your criteria, say so and write
   nothing — that is a legitimate result and better than a criterion for a hole that is not there.
2. **If it does pass, write the criterion that kills it** — the session must terminate, expressed so
   it is falsifiable (a bound a test can assert) rather than as prose about intent.
3. **Adjudicate the cost you yourself capped.** Architect says this row takes `N8-SPAWN` to **+6**,
   above the **+5** ceiling YOUR cut derived. Either raise the ceiling with a written reason, or
   find a shape that fits under it, or state the overrun and route it. Do not quietly exceed it.
4. **`A1`'s byte figure.** Architect measured the stack at **1282 bytes**, not your 1196, and says it
   is path-length dependent. Fix `A1` so it cannot red on a checkout path length.

## Fences
- **Do not touch `src/`.** Do not re-open the exit-code ruling — `0` is settled by ADR-0016.
- Do not re-score size or priority unless the new criterion genuinely changes `S`; if it does, say so
  loudly rather than absorbing it silently. **An XL is `SPLIT_REQUIRED`.**
- Do not edit `ADR-0016`, `AGENTS.md`, or any other ticket. Do not move `ABC-115` off `Ready for Dev`.
- Do not merge, do not deploy, do not self-sign.

## Publish
Typed notes per Workflow 16 into `ref:`, hand-authored per `agent-factory/contracts/context-note.md`
(no `finding` is admissible — `human_admission` is `off`). Append your `plans/traceability.md` row.
Claim by hand per Workflow 17: bare `mkdir .grugops/queue/claimed/amend-abc115-session-ends`, move
this file in, then out to `done/`. Work in your own `git worktree`. Commit on `grugops/abc115-amend`.
