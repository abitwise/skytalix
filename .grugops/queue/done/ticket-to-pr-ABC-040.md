---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-040
role: software-engineer
ticket: plans/tickets/ABC-040-traceability-duplicate-row-reconciliation.md
ref: .grugops/context/ticket-to-pr-ABC-040/
enqueued_by: orchestrator
enqueued_at: 2026-10-17T00:00:00Z
branch: grugops/ABC-040-trace-dedup (cut from main b84dc637)
---

# Subtask: implement ABC-040. Width 3: SE hops on the other two of ABC-040 / ABC-030 / ABC-024 run beside you.

Deliver every acceptance criterion exactly as the page states (including its latest re-score / amendment notes). Re-measure every number
the page tells you to; never paste one. **You are the ONLY hop that writes `plans/traceability.md`** (the page's sequencing rule); make exactly the page's three edits there and append your own delivery row.
- Work in your own worktree on the branch above (`git worktree add /Users/olgeroeselg/Projects/hacks/grugops-examples/wt-ABC-040 -b grugops/ABC-040-trace-dedup b84dc637`).
- Gates on your tip: `npm run -s lint && npm run -s typecheck && npm run -s build && npm test`, `.test-results/last-run.json` success true,
  `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`. Base at b84dc637: 58 files / 1792 tests.
- Do not touch `plans/board.md`, `AGENTS.md` (0 B headroom), or any ticket page but ABC-040's. Add a Delivery section there; commit typed notes under the ref.
- No timing reading. Never merge, push, --force, --amend, rebase or reset --hard. If a criterion cannot be met as written, STOP and report.
- Finish with `.grugops/queue/done/ticket-to-pr-ABC-040.md` (frontmatter: result, branch, tip, code_commit) and its `.claim.md`, uncommitted on main.
---
done_at: 2026-10-17T13:52:00Z
result: DONE — ready for In Review (QE hop required; UAT waivable: 0 production src lines, waiver grep empty)
branch: grugops/ABC-040-trace-dedup (worktree /Users/olgeroeselg/Projects/hacks/grugops-examples/wt-ABC-040; base b84dc637)
tip: 08bbdf2c (docs: 3 typed notes + ticket § Delivery)
code_commit: 8d2e4f8b (plans/traceability.md only, +9/-13: ABC-028 second row deleted (R3), ABC-029 second row spliced at d=2705 and deleted (R4), comment paragraph -> one dated sentence, own ABC-040 (build) row appended)
readings: A1 0 groups with identical cells 0-4; ABC-028 x1, ABC-029 x1. A2 prefix True 2618/50168, stale Code/Tests empty. A3 d=2705, formula equality True, 206 **, 6 probes. A4 both anchors x1, block == stale[d:] (2404 chars / 2418 B). A5 old sentence 0, dated sentence 1. A6 508 other rows byte-identical, 512 -> 510 (+1 own row = 511), code commit numstat 1 file, src/ empty. Gates at 8d2e4f8b: lint 0, typecheck 0, build 0, npm test 0 58/1792, last-run success true, 0 pending/todo, skip integrity No findings (lint re-run 0 at 08bbdf2c). Merge first (before ABC-030/024 trace rows).
