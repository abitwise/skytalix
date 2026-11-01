---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T17:29:30Z
subtask: qe-ABC-254-a4
role: qe-e2e
ref: .grugops/context/qe-ABC-254-a4/
branch: new grugops/qe-ABC-254-a4 from grugops/qe-ABC-254 (15eadd7a) — worktree .claude/worktrees/qe-ABC-254-a4
width: ALONE. Take `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock` for the WHOLE read (qe-ABC-255 holds it for its games first — wait). No other hop runs tests meanwhile.
---
# QE: A4 re-read for ABC-254 (QE-254-a, the only open criterion)
## Inputs
qe-ABC-254 on its branch: PREREG …6b25d0a8, verdict …1c801504, timing …09221f68, scripts in .grugops/context/qe-ABC-254/raw/. Ticket A4 as written: kiwipete, position-6, start at 4 000 ms, 5 interleaved fresh-process runs per board per build; ≥ 1.10× on two boards, ≥ 1.00× on the third; position-4 ≥ 0.97×; ADR-0055 D3 validity (5 % spread, one re-run).
## Do
- Seal a new PREREG before any run: same method and rule as qe-ABC-254's (do NOT change the spread rule; note QE-254-a's open question only). Use the fixed busy-host check (real processes only, not flock waiters).
- Wait for a clear host (no foreign vitest, no foreign process > 50 % CPU) up to 45 min; then run all four boards fresh. If the host turns busy mid-read, the spread rule decides; if boards void again, report UNRESOLVED with load evidence — do not grade by hand.
- Run time ≤ 30 min excluding waits. Thermal stop Tctl median > 85 °C. Never kill foreign processes.
- Final verdict for ABC-254 combining qe-ABC-254's MET rows with this A4: PASS / PASS_WITH_GAPS (carry QE-254-b/c) / FAIL (A4 missed → ticket's miss rule) / UNRESOLVED.
## Fences
Your records only. No src/, board, plans/, memory-bank/. No push, force, amend, rebase, merge into main. Leave nothing running.
## Publish
Sealed notes (task qe-ABC-254-a4, contextRoot = worktree's .grugops/context, never the plugin cache); commit; ## Result + trace row; brief + claim to done/.
