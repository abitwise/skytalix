---
result: blocked
branch: grugops/ABC-039-ordinal-register
tip: 6c1257dd
base: e7d9d657
blocked_on: A3 row-count identity (source chronology 14 through 08-12 / 15 at metrics commit 3215004c; plans/metrics.md:28 says 13; A5 fences metrics.md)
---

---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-039
role: software-engineer
ticket: plans/tickets/ABC-039-backward-move-ordinal-register.md
ref: .grugops/context/ticket-to-pr-ABC-039/
enqueued_by: orchestrator
enqueued_at: 2026-10-17T00:00:00Z
branch: grugops/ABC-039-ordinal-register (cut from main)
---

# Subtask: implement ABC-039's register. Width 3: a QE hop on ABC-155 and a Release Manager hop on ABC-056 run beside you.

Write `plans/tickets/history/backward-move-ordinals.md` so it meets A2–A4, A6 and A7 as the page states (with the 2026-10-12 re-score:
the false clause is now near board :969; a ninth statement at trace :437 is registered, not edited).
- Derive the chronology from source; re-measure the Rework-rate total in `plans/metrics.md`, do not paste it. Every row carries file:line.
- **Do NOT edit `plans/board.md`.** A1's one clause is the Orchestrator's. In your handoff, give the exact line number and the exact
  replacement text you propose for the `ABC-009` row, so A1 and A5 can be checked after I make it.
- A5 fences: no byte of any `plans/tickets/history/ABC-*-board-history.md`, `plans/metrics.md`, `src/`, or any ticket page but ABC-039's.
  You may append a traceability row and a Delivery section on the ABC-039 page.
- Work in your own worktree on the branch above. Commit there. Gates on your tip: lint, typecheck, build, `npm test`, skip-integrity `--skip-count 0`.
- Never merge, push, --force, --amend or rebase. If a criterion cannot be met as written, STOP and report.
- Finish with `.grugops/queue/done/ticket-to-pr-ABC-039.md` (frontmatter: result, branch, tip) and its `.claim.md`, uncommitted on main.
