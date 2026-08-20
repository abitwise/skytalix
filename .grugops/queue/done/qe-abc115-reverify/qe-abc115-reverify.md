---
task: qe-ABC-115-repair-2026-08-21
subtask: qe-abc115-reverify
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-115-piped-session-dies-on-epipe-with-the-refusal-exit-code.md
ref: .grugops/context/qe-ABC-115-repair-2026-08-21/
enqueued_by: orchestrator
enqueued_at: 2026-08-21T04:30:00Z
branch: grugops/qe-abc115-reverify
base: grugops/abc115-repair @ 8d4980c
---

# Subtask: RE-VERIFY `ABC-115` — you failed it, it was repaired, and the owner wants your word before he merges

**Branch off `grugops/abc115-repair` @ `8d4980c`, NOT `main`.** Ten branches are stacked unmerged.
**The project owner has asked for this hop specifically, and intends to merge after it.** Your
verdict is the last gate before the code lands.

You FAILED this ticket with two defects. Both are claimed closed:
- **`G-QE115-1`** — `A10` written by BA/PM, guard implemented by the engineer, zero production lines.
- **`G-QE115-2`** — the superseded `≤ 0.5 s CPU` sentence corrected in `src/cli.test.ts`.

**Everything in that list is the claim of the agent that did it. Re-verify, do not accept.**

## What to check, in this order
1. **Are YOUR two defects actually closed?** Not "a test exists" — does `A10`'s row **red against the
   deleted-token mutant** you originally built, and does the superseded sentence survive nowhere?
   `grep` the tree for `0.5 s` and for the old breach sentence yourself.
2. **`A10` is now the guard, so audit the guard.** The engineer reports it reads status from
   `NODE_EXIT=` and not from the wrapper — confirm that, because reading the wrapper's status would
   make the row green on every build, including a broken one. **Mutate it and prove it can fail.**
3. **`G-QE115-3` IS STILL OPEN and you raised it** — the wall and per-child CPU clauses are asserted
   by nothing mechanical. It was NOT closed at the repair hop, deliberately, as a design question.
   Say whether it should block the merge or stand as a knowingly-open residual, **and say which.**
4. **Regression sweep on the whole delivered build**, not just the repaired rows: the exit-code
   contract (`0` / `1` / `70`), a real TTY, a played move, and flake at your own bar.
5. **Anything the repair broke that no criterion covers.** `src/cli.test.ts` moved 128/34 lines —
   look for a weakened assertion, not only a failing one.

## Fences
- **Do not fix anything you find. Report it.** A second FAIL is a legitimate result and the owner
  would rather hear it now than after merging.
- Do not touch `src/cli.ts`'s delivered fix, `ADR-0016`, `AGENTS.md`, or any other ticket.
- Do not re-open the exit-code, CPU-clause or count-ceiling rulings; disagree with a measurement and
  hand it back instead.
- **You may not sign UAT and you may not merge.** 13 production lines shipped, so the waiver does
  not apply — business acceptance is the owner's word alone, and a green QE run is NOT that.
- Report lane cost; do not grade it.

## Board
Make your own `In Review` exit and label it: **PASS → `Ready for UAT`** (WIP 0/4, room), or
**FAIL → `In Development`** with the defect named. That decision is yours alone.

## Publish
Typed notes per Workflow 16 into `ref:`, hand-authored per `agent-factory/contracts/context-note.md`
(no `finding` — `human_admission` is `off`). Append your `plans/traceability.md` row with measured
evidence. Claim by hand per Workflow 17: bare `mkdir .grugops/queue/claimed/qe-abc115-reverify`,
move this file in, then out to `done/`. Work in your own `git worktree`. Commit on
`grugops/qe-abc115-reverify`, never on `main`.
