---
subtask: ticket-to-pr-ABC-170-fix
role: software-engineer
ticket: ABC-170
branch: grugops/ABC-170 (existing, tip 64b07741)
worktree: ../wt-ABC-170 (existing)
---

# ABC-170 fix: QE-170-a, the A3 identity row runs close to the 5 s timeout

QE's verdict is `.grugops/context/qe-ABC-170/notes/…09d90757`, and its observations are `…8bd2de27` and `…c63fb059`. The new `ABC-170 A3` row in
`src/engine.test.ts` takes 3.4–4.8 s, against vitest's default 5 s timeout. Under load it timed out in 11 of 18 lane runs, without any
assertion failing.

1. Merge main into the branch (`git merge --no-ff main`). If the trace conflicts, keep both sides.
2. Make the row robust without changing what A3 asserts. The 50 ms budget, the six perft positions and the field-by-field identity
   all stay as they are.
   - Preferred: cut the row's wall cost. Share work between the two runs, drop redundant setup, or move the run onto the virtual clock
     if A3's wording allows it.
   - Give it an explicit per-row timeout only if the cost can't come down. In that case, report the row's cost against the default
     lane's 60 s `run-bounded` bound (NFR-008).
   - Report the row's vitest-reported duration before and after the change. That duration is not an NFR reading.
3. Re-run all gates. Check `.test-results/last-run.json` for success true with the full count. If a run gets cut short, re-run once and
   report both runs.
4. Nothing else is in scope. QE-170-b..g go to BA/PM as follow-ups. Take no timing readings: A6 stays OPEN.

Rules:
- Don't touch `plans/board.md`, `plans/traceability.md`, `wt-ABC-146`, or other sessions' processes.
- Never push, never merge to main, never `git push -f`.
- When done, write `.grugops/queue/done/ticket-to-pr-ABC-170-fix.md` and `.claim.md`, uncommitted, in main's working tree, and include a
  trace row in your handoff.
