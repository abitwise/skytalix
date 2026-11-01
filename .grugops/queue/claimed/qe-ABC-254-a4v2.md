---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T18:16:56Z
subtask: qe-ABC-254-a4v2
role: qe-e2e
ref: .grugops/context/qe-ABC-254-a4v2/
branch: new grugops/qe-ABC-254-a4v2 from grugops/qe-ABC-254-a4 (c5da6514) — worktree .claude/worktrees/qe-ABC-254-a4v2
width: ALONE WINDOW. The Orchestrator dispatches this only when no other hop of this session is running and dispatches nothing during it. Still take `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock` for the whole read.
---
# QE: fresh A4 read for ABC-254 under ADR-0055 D3-V2
## Inputs
ADR-0055 addendum D3-V2 (on main; Architect notes .grugops/context/arch-d3-under-load/ …6f646a39, …603a0ca9). Prior reads (qe-ABC-254, qe-ABC-254-a4) stay UNRESOLVED; never pool or re-grade them. Carried MET: A1, A2, A3, A5 (…1c801504).
## Do
- Seal a PREREG implementing D3-V2 exactly: pair counts only if after it no foreign vitest/cutechess, both runs foreign load ≤ 0.8 cores, Tctl < 85 °C; first 5 counted pairs per board; order alternates by counted-pair count (3:2); cap 15 attempts per board; VOID-LOAD if < 5 counted; agreement check (paired-ratio median vs graded ratio on the same side of every bar, else one re-run then VOID); bars unchanged (≥ 1.10 on two of kiwipete/position-6/start, ≥ 1.00 third, position-4 ≥ 0.97). Grade by script, not by hand.
- Record the window's start/end UTC. Start check as qe-ABC-254-a4 (3 s /proc sample, real-vitest detector); wait cap 45 min.
- Final ABC-254 verdict: PASS / PASS_WITH_GAPS (carry QE-254-b/c/d) / FAIL (bar missed → ticket miss rule) / UNRESOLVED (VOID-LOAD).
- Run time ≤ 40 min excluding waits. Thermal stop. Never kill foreign processes.
## Fences
Your records only. No src/, board, plans/, memory-bank/. No push, force, amend, rebase, merge into main. Leave nothing running.
## Publish
Sealed notes (task qe-ABC-254-a4v2, contextRoot = worktree's .grugops/context, never the plugin cache); commit; ## Result + trace row; brief + claim to done/.
