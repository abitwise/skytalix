---
task: wave-2026-09-25
subtask: scribe-ABC-152
role: agents-md-scribe
ticket: plans/tickets/ABC-152-upgrade-vitest-to-4-1-and-run-src-without-the-module-runner-with-every-mock-and-spy-guard-still-armed.md
ref: .grugops/context/scribe-ABC-152/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/scribe-ABC-152 (create from main)
base: main
---

# Subtask: bring AGENTS.md in line with ABC-152 (vitest 4.1.11, module runner off; merged to main).

Owed (from SE handoff `…4567b6b5`, QE notes, Architect rulings 8–13, Security/NFR `…bceca0ca`):
- worker-cap line: `VITEST_MAX_THREADS` is read nowhere on 4.x → `VITEST_MAX_WORKERS` (1 ≤ n ≤ 2), no `projects`;
- the runner stays off (`test.experimental.viteModuleRunner: false`, pinned);
- coverage figure: `coverage.all` is gone in 4.x — the quoted figure's meaning changed (re-read it);
- `PUZZLE_DEEP=weakened`: "exits 1 by design: gate row red (15/58), A3 green" — exit code alone is not the reading;
- `PUZZLE_DEEP=1` wall (was 32–36 s; re-read: ~4 s printed);
- RISK-ABC152-NEGWORKERS one-liner if it fits.
Budget 24,576 B, now 24,485 B: tighten/remove stale text to fit — never move the budget. Main's node_modules is
4.1.11 now; you may run the lanes you cite. Lint, typecheck, `npx vitest run src/cli.test.ts`. Commit on your branch
(own worktree, symlinking main's node_modules is fine now); never merge. Use /usr/bin/diff.
