---
subtask: qe-lane-ABC-212
role: qe-e2e
ticket: plans/tickets/ABC-212-two-stronger-levels-6-thinks-5-s-and-7-thinks-30-s-a-move-and-the-default-stays-5.md
ref: .grugops/context/qe-lane-ABC-212/
branch: new grugops/qe-lane-ABC-212 from grugops/se-lane-ABC-212 (814b92a0), worktree ../wt-qe-lane-ABC-212
width: 1 of 3 (only hop running; no real-clock timing)
---

# QE short re-check: ABC-212 lane-cost fix (A9 + A12)

## Do
- Read SE `se-lane-ABC-212/…a6f0ce67` + `…fcbbf321` and Orchestrator `security-nfr-ABC-212/…550e067d`.
- Rule whether the 6 rows moved to A12's budget-read arm still carry A9's acceptance (SE's open question: `movetime 60000`, `wtime`, level-6 bare `go` now check only the budget handed to the engine). Re-run load-bearing plants yourself (at least P1, P2, one level-6 and one rate plant), and confirm the call-through `vi.mock` is restored and does not leak into other rows of the file.
- Confirm only `src/uci-session.test.ts` changed vs `2079e0df`, and every changed line sits in ABC-212's own A9 block (A13).
- Gates: lint, typecheck, build, `npm test` + `last-run.json`, skips, `UCI_DEEP`. No ENGINE_DEEP, no real-clock timing; the earlier qe-ABC-212 readings stand.
- Verdict PASS / PASS_WITH_GAPS / FAIL.

## Fences
- Only your worktree and `<scratchpad>/qe212lane/`. No `src/` edits. Never push, force, amend or rebase; never merge into main; no board edits. Records: no hostnames, IPs, or personal paths.

## Publish
- Commit on your branch. Seal notes (task qe-lane-ABC-212). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
