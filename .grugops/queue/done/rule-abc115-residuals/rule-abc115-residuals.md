---
task: rule-ABC-115-residuals-2026-08-21
subtask: rule-abc115-residuals
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ticket: plans/tickets/ABC-115-piped-session-dies-on-epipe-with-the-refusal-exit-code.md
ref: .grugops/context/rule-ABC-115-residuals-2026-08-21/
enqueued_by: orchestrator
enqueued_at: 2026-08-21T02:30:00Z
branch: grugops/abc115-residuals
base: grugops/qe-abc115 @ 3b2ac08
---

# Subtask: rule QE's `G-QE115-1` — is the unguarded re-throw branch owed a test, and does the child ceiling move to 7?

**Branch off `grugops/qe-abc115` @ `3b2ac08`, NOT `main`.** Eight branches are stacked unmerged.

QE/E2E FAILED `ABC-115` back to `In Development` with two defects. **One is not yours** —
`G-QE115-2`, a superseded `≤ 0.5 s CPU` clause and a false "THE CPU CLAUSE IS BREACHED" sentence
left in `src/cli.test.ts` by your own budget ruling, which never reached the code. That is a repair
hop and it is routed separately. **Do not fix it here.**

`G-QE115-1` is yours, because closing it costs a child and the count ceiling is your pen.

## The claim to re-measure (QE's note is unstamped)
QE reports that **deleting the `code !== "EPIPE"` test from the delivered fix leaves the whole lane
60/60 green with all four gates** — while a real write failure (a read-only fd handed to the child
as stdout, `EBADF`) flips from *exit 1 + 1542 bytes of stack* to **silent exit 0**. If that holds,
the branch `ADR-0016` clause 4 exists to protect is asserted by nothing, and the failure it admits
is **the exact species this ticket was cut for**: the product reporting a false exit status quietly.

## What to settle
1. **Re-measure it.** If a guard already covers that branch, say so and rule `G-QE115-1` closed.
2. **If it is genuinely unguarded, decide whether a criterion is owed** — and write it if so. It is
   your pen; QE deliberately did not write one.
3. **The cost, which is the real question: closing it takes the pin 23 → 24, i.e. a SEVENTH added
   child against your own `≤ 6 added children` clause.** Raise the ceiling to 7 with a written
   reason, or rule the guard NOT owed and record `G-QE115-1` as a knowingly-accepted residual with
   that decision named on the page. **Both are legitimate. What is not legitimate is leaving it
   unruled** — this board already carries three items that went unowned by drifting.
   Note the per-child CPU clause you re-derived is unaffected: a seventh child at ~0.20 s stays
   inside `≤ 0.30 s per added child`. **The count clause is the only thing in the way.**
4. If you rule the guard owed, state whether it changes size `S` or priority `P1`. Say it loudly if
   it does.

## Fences
- **Do not touch `src/`** — not the fix, not the test file. Both defects are repaired at a later hop.
- Do not re-open the exit code (`ADR-0016`) or re-derive the CPU clause again; only the COUNT clause
  is in question.
- Do not move the board column — `ABC-115` stays in `In Development` until it is repaired.
- Do not merge, do not deploy, do not self-sign.

## Publish
Typed notes per Workflow 16 into `ref:`, hand-authored per `agent-factory/contracts/context-note.md`
(no `finding` — `human_admission` is `off`). Append your `plans/traceability.md` row. Claim by hand
per Workflow 17: bare `mkdir .grugops/queue/claimed/rule-abc115-residuals`, move this file in, then
out to `done/`. Work in your own `git worktree`. Commit on `grugops/abc115-residuals`.
