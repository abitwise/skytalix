---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-05T12:30:40Z
subtask: se-ABC-305
role: software-engineer
ref: .grugops/context/se-ABC-305/
branch: new grugops/ABC-305 from main — worktree .claude/worktrees/se-ABC-305
width: ABC-305's scope, to the end of its N8-LANE read. No landing.
---
# Build ABC-305 and read its lane
Read ABC-305's page and the Orchestrator's latest decision note.
Do Scope 1 to 3 as the page says: one merge of b297ab89, never either tip of ABC-301, dd88560f out of ancestry. Prove all three. Zero production lines. Re-read the conflict list fresh. Run the N8-LANE read host-alone in one lock hold, then gates and deep lanes. Report the lane figure against ABC-305's +0.10 s budget. The landing waits on the row-move ticket, so stop at Result.
Timing runs ALONE in one hold. Record foreign load; never touch it. If host load voids a read, say so and stop. Check every output file is non-empty before reading it. STOP and report anything the page does not cover.
Every test, build or engine run goes under the host lock named in your dispatch prompt.
Fences: ABC-305's scope and your records. No ticket, ADR, EPIC or board edits. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task se-ABC-305, contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.
