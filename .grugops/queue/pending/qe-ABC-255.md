---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T16:56:28Z
subtask: qe-ABC-255
role: qe-e2e
ref: .grugops/context/qe-ABC-255/
branch: new grugops/qe-ABC-255 from grugops/ABC-255 (head a08ba9be; code 78cd2415; base 8f2fc9b5) — worktree .claude/worktrees/qe-ABC-255
width: TESTS/GAMES SERIALIZED. Wrap EVERY test/build/engine/cutechess run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`; hold it for each game block. qe-ABC-254 may hold it first — wait.
---
# QE: grade ABC-255 (harness: d 100 ms control, r 0.5 s smoke) — and its three real reads
## Ticket
plans/tickets/ABC-255*.md, A1–A8. SE notes on the branch .grugops/context/se-ABC-255/ (…8953bec7, …5333bc23, …8b930153, …e65b673f). ADR-0056 C2′/C3″/S′/R-TC.
## Do
- Re-check A1/A2 dry runs and the byte-identity of existing shapes; A6 (0 lines src/ data/; skytalix block keys unchanged); A7 gates; mutation spot-check.
- A3, A4, A5 real reads exactly as the page states (100 + 100 games at 100 ms, 10-game smoke at 0.5 s vs SF E1650), concurrency 1, one at a time; seal a PREREG first with the estimate. These counts are owner-set (100 per change, smoke 10 games) — no ask needed unless one single run is estimated > 60 min; then STOP and report.
- Report time losses, max overshoot, faults, games/hour, and the scores; A4 checks the identical pair sits near 50 %. Write the ## Reading section (A8) — you may edit only that section of the ABC-255 page.
- Host: log foreign CPU (a foreign vitest from projects/public/grugops recurs; count only real vitest, not flock waiter command lines — QE-249-c). Wait cap 20 min per block, then proceed flagged SHARED. Thermal stop Tctl median > 85 °C. Never kill foreign processes.
## Fences
Tests, tools/rating test rows only if a gap needs proof, the ABC-255 page's ## Reading section, your records. No src/, board, other plans/, memory-bank/. No push, force, amend, rebase, merge into main. Leave nothing running.
## Publish
Verdict PASS / PASS_WITH_GAPS / FAIL with gap ids; sealed notes (task qe-ABC-255, contextRoot = worktree's .grugops/context, never the plugin cache); commit; ## Result + trace row; brief + claim to done/.
