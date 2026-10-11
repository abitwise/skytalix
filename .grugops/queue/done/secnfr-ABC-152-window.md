---
task: wave-2026-09-25
subtask: secnfr-ABC-152-window
role: security-nfr
ticket: plans/tickets/ABC-152-upgrade-vitest-to-4-1-and-run-src-without-the-module-runner-with-every-mock-and-spy-guard-still-armed.md
ref: .grugops/context/secnfr-ABC-152-window/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/ABC-152-vitest-4-1-runner-off (tip 3c55b965)
base: 91024242 (main at k = 2, vitest 3.2.7; main since has docs only)
---

# Subtask: ABC-152 Security/NFR. You are the ONLY hop running (width 1).

1. **V12** (no timing): dependency review of the bump (vitest/@vitest/coverage-v8 4.1.11, vite ~7.3.6 direct;
   lockfile +3/−61/20): licences, install scripts, `npm audit`, provenance; 0 production lines.
2. **V9–V11** per ADR-0042 addendum ruling 6 and the page: three trees (base, head, identity twin of base), EACH with
   its own `npm ci` (never a node_modules symlink); `lane144b.mjs`; width 1, n ≥ 8, round 0 discarded, unprofiled,
   behind a step-0 settle gate (level 0, load1 ≤ 4, no foreign vitest — record and wait if another project's vitest
   runs; say so if it never clears). V9: head − base paired median CPU ≤ −15 % merges; (−15 %, 0) with interval wholly
   below 0 → owner; else no merge. V10: wall warm + R ≤ 10 s, cooled owed if > 9.0 s (held to 10 s). V11: thermal
   before/after every run, no bar. Also the RISK-ABC152-PUZZLE-SPY wall reading (PUZZLE_DEEP=1 base vs head), not a gate,
   and a full-lane twin R at k = 2 for RISK-ABC144-FCAP if the twin data gives it.
Log power source. Commit notes and raw TSVs on the ticket branch from your own worktree; never merge. Do not touch
src/, vitest.config.ts, plans/board.md. Use /usr/bin/diff.
