---
task: qe-ABC-115-2026-08-21
subtask: qe-abc115-review
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-115-piped-session-dies-on-epipe-with-the-refusal-exit-code.md
ref: .grugops/context/qe-ABC-115-2026-08-21/
enqueued_by: orchestrator
enqueued_at: 2026-08-21T01:30:00Z
branch: grugops/qe-abc115
base: grugops/abc115-spawn-clause @ 6acc3fb
---

# Subtask: BREAK `ABC-115` — the quality gate on a fix whose own author says it is green

**Branch off `grugops/abc115-spawn-clause` @ `6acc3fb`, NOT `main`.** Seven branches are stacked
unmerged; merging is the human's.

`ABC-115` sits in `In Development` with all four gates green, nine criteria answered, and the
`N8-SPAWN` breach that held it there resolved by a BA/PM ruling that the clause — not the build —
was defective. **Every one of those is a claim by the agent that made it. None is stamped. Your job
is to find what they missed.**

## Read first, then go around it
- The `ABC-115` page in full; `ADR-0016`; `AGENTS.md` (exit-code contract, test-integrity posture).
- The context under `.grugops/context/ticket-to-pr-ABC-115-2026-08-20/` and
  `budget-ABC-115-2026-08-21/` — **including all three `failed-attempt` notes. Do not re-run them.**
- Then **stop reading their instruments and build your own.** The suite was written by the person
  who wrote the fix; a green run of it proves less than one adversarial probe you designed.

## Where the danger is on this ticket
1. **`A9` is the whole guard and it is fragile.** The engineer measured eight criteria going green
   against a bare-swallow mutant with the game running blind. `A9` is what caught it. **Mutate the
   delivered fix yourself and confirm `A9` still reds** — including a mutant that destroys stdin but
   keeps writing, and one that ends the session on a NON-`EPIPE` code.
2. **The re-thrown branch is unexercised in production.** `EPIPE` is silent; every other code
   re-throws. Is there a test that proves a non-`EPIPE` stdout error still crashes loudly, or is
   that branch asserted only by inspection?
3. **`process.stdin.destroy()` with a REAL terminal stdin.** Every measurement so far used
   `</dev/null`, a FIFO, or a pipe. A TTY was flagged `UNKNOWN - verify` at the design hop and, as
   far as the notes show, was never checked. If it still is not, say so plainly rather than passing
   over it.
4. **Timing-dependent rows** (`A9`'s bound, the 0.6 s settle) — probe for flake. Run the suite
   repeatedly. A row that passes 5/5 and fails at 20/20 is a defect you are the last to catch.
5. **The re-derived clause has teeth or it does not.** It is `≤ 0.30 s CPU per added child`. Check
   it is actually asserted somewhere, not merely written on a page.

## Fences
- **Do not fix any defect you find. Report it.** A failing gate is a legitimate, valuable result.
- Do not touch `src/cli.ts`'s delivered fix, `ADR-0016`, `AGENTS.md`, or any other ticket.
- Do not re-open the exit-code ruling or the budget ruling; if you think either is wrong, **say so
  with a measurement** and hand it back — do not edit them.
- Do not merge, do not deploy. **You may not sign UAT** — 13 production lines shipped, so the UAT
  waiver does NOT apply and business acceptance is the named owner's word, never a green agent run.
- Report your lane cost; do not grade it (`NFR-008` breached, `ABC-108`/`ABC-110` open).

## Board
Two moves, kept distinct and both explicitly labelled in your board header:
1. **Transcribe** `In Development` → `In Review` — the engineer's owed move, withheld only for the
   breach, now unblocked by the budget ruling. It is not your decision and say so.
2. **Then make your own `In Review` exit**: PASS → `Ready for UAT`, or FAIL → back to
   `In Development` with the defect named. **That one IS yours.**

## Publish
Typed notes per Workflow 16 into `ref:`, hand-authored per `agent-factory/contracts/context-note.md`
(no `finding` is admissible — `human_admission` is `off`). Append your `plans/traceability.md` row
with the test evidence you measured. Claim by hand per Workflow 17: bare
`mkdir .grugops/queue/claimed/qe-abc115-review`, move this file in, then out to `done/`. Work in
your own `git worktree`. Commit on `grugops/qe-abc115`, never on `main`.
