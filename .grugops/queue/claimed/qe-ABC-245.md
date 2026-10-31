---
subtask: qe-ABC-245
role: qe-e2e
ticket: ABC-245
ref: .grugops/context/qe-ABC-245/
branch: new grugops/qe-ABC-245 from grugops/ABC-245 7c1721ce (worktree .claude/worktrees/qe-ABC-245); base 9c008db4, head 7e81732e
width: ALONE for timing; only a records-only BA/PM hop beside you (no vitest)
---
# QE ABC-245 (XS, P3, test-only): far-back third occurrence row; plus the clean G8 re-read
## Read
The ticket page (RE-SCORED block, A1–A3, Test notes); ADR-0046 § Ruling 2026-10-31; qe-ABC-242's plants note (…93eb0bf9: Q6/Q8 CAP8/CAP50) and se-ABC-245's notes on the branch.
## Do
- PREREG first.
- Re-run Q6 (cap 8) and Q8 (cap 50) against the whole default lane on scratch copies: the new row must go red, and nothing else may change verdict versus qe-ABC-242's runs. Cap 100 green; base levels.ts red on the new row.
- Check the fixture: legal game, no captures or pawn moves, offsets [−98, −94], child clock 98 < 100, keys ≤ 101.
- Gates: lint, typecheck, build, `npm test` ×3 with 0 skips and skip-integrity. The diff is src/levels.test.ts only; check the names diff is +1.
- **G8, ALONE, order b h h b b h, wait-clear by `kill -0`; record load1 and Tctl.** This is also the clean re-read the Orchestrator owes for ABC-221's inadmissible 9.84 s. Report the medians.
  - Head > 9.6 s fires ABC-244 tranche 2 (report only). Head > 10 s: STOP.
- Verdict PASS / PASS_WITH_GAPS / FAIL (UAT waived: 0 production lines).
## Fences
- No edits to src/, tools/, data/ or the board. No push, force, amend, rebase, or merge into main. Never bare npx or npm exec.
- Waiting: poll an output file or `kill -0 <pid>`; never `while pgrep -f …`. Never put vitest on the same command line as a wait.
- Thermal stop: Tctl median > 85 °C. Scratch `qe-245/`, kept small and removed at the end. Leave no process running.
## Publish
Sealed notes (task `qe-ABC-245`, contextRoot = worktree), commit, `## Result` + 10-cell trace row here, brief + claim to done/.
