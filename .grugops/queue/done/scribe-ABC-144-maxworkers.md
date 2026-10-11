---
task: wave-2026-09-25
subtask: scribe-ABC-144-maxworkers
role: agents-md-scribe
ticket: plans/tickets/ABC-144-npm-test-chokes-the-macbook-air-m3-cut-its-cpu-and-cap-its-cores.md
ref: .grugops/context/scribe-ABC-144-maxworkers/
enqueued_by: orchestrator
enqueued_at: 2026-10-11T00:00:00Z
branch: grugops/scribe-ABC-144-maxworkers (create from grugops/wave-2026-09-25)
base: grugops/wave-2026-09-25
---

# Subtask: add the ABC-144 worker-cap line to AGENTS.md.

ABC-144 merged (`f272eedb`): `vitest.config.ts` `test.maxWorkers: 3` (ADR-0040, accepted), pinned by value in
`src/cli.test.ts` (env may lower, never raise; `VITEST_MAX_THREADS` ≤ 3), `isolate` stays on (ADR-0008 d7). Agents
must not raise the cap or pass a higher `--maxWorkers`. Add one terse line in the right `### Test` place.
AGENTS.md is 24,237 B against the 24,576 B budget pinned in `src/cli.test.ts` (339 B headroom): tighten existing
wording if needed — never move the budget. Run lint, typecheck and `npx vitest run src/cli.test.ts` only (a QE hop
is running puzzle readings; do NOT run the full `npm test`). Commit on your branch; never merge.
