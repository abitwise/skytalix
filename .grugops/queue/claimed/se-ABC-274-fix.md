---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-03T13:06:11Z
subtask: se-ABC-274-fix
role: software-engineer
ref: .grugops/context/se-ABC-274-fix/
branch: grugops/ABC-274 (0730e294 + main merged) — worktree .claude/worktrees/se-ABC-274
width: wrap EVERY test/build/engine run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`. One core. R1 (200 games) holds the lock for a long stretch — expect to wait; never bypass the lock. NO timing readings.
---
# ABC-274: the seam repair S1–S3 (test-only)
Architect ruling …3169a174 (.grugops/context/arch-ABC-274-seam; ADR-0067 d8 dated line):
- S1: A3's mobility rows must not depend on equal mobility halves (no division by MOBILITY_WEIGHT.mg; count mobility another way — a counter in the test or the seam with weights 1/1); re-run the mutant check for both mobility families.
- S2: move loadParameters(parameters) inside the try; add a row: a throwing run and a throwing loader each make the seam throw, and afterwards every corpus score is Object.is-equal to before.
- S3: source-pin row — no non-test src file other than evaluate.ts names the seam, no tools/ file does, and loadParameters( is called only at module load and inside the seam.
- Carry-over condition: `git diff c131ecd0 <repair> -- src/` touches only the seam's body and src/*.test.ts. Report that diff stat.
Also fix the branch's plans/board.md: take main's version (the board is the Orchestrator's; your earlier edit moved a stale line) — do not edit board.md further.
Fences: src/evaluate.ts (seam body only) + src/*.test.ts. No push, force, amend, rebase, merge into main. Leave nothing running.
Publish: sealed notes (task se-ABC-274-fix, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit (Result text included); ## Result + trace row; brief + claim to done/.
