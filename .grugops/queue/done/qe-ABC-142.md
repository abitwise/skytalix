---
task: wave-2026-09-25
subtask: qe-ABC-142
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-142-npm-test-keeps-the-failing-tests-name-when-the-console-is-truncated.md
ref: .grugops/context/qe-ABC-142/
source_refs: .grugops/context/ticket-to-pr-ABC-142/notes/ — on the ticket branch; .grugops/context/bapm-amend-abc142-2026-10-10/notes/ (…02595e96); src/cli.test.ts (ABC-042 A10)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T19:20:41Z
branch: grugops/ABC-142-test-result-file (tip ab8d0088)
---

# Subtask: QE `ABC-142` — `npm test` keeps the failing test's name on disk

Verify A1–A6 independently (base `086185d9` or the branch's merge base, code `41abc389`): invert one assertion in a
scratch copy OUTSIDE the repo, run red, pipe through `| tail -3`, read the file; green run counts; git-ignore;
A10's pin still exact (append one character → red).

**Deviation to rule on (Orchestrator's provisional reading: acceptable if nothing breaks):** vitest now prints
one extra console line after the summary (`JSON report written to <abs path>`); the Scope said console output
unchanged. Find every consumer of `npm test`'s console output — `AGENTS.md` commands (the skip-count capture
must still return an integer), `tools/grugops/*` (lane-inventory, skip-integrity, run-bounded), any test that
spawns `npm test`, and the `| tail -N` habits in notes — and say whether any breaks or reads a different number.
Also: does the absolute path in that line leak anything a committed note would carry? Is the ~674 KB file
overwritten (not appended) per run? Do the `*_DEEP` lanes stay untouched?

## Fences
Test-only additions on the ticket branch if gaps need closing; no production `src/`. Never merge; never push.
No `plans/board.md`, ADRs, `AGENTS.md`. Own worktree; link `node_modules` into YOUR worktree only
(`diff -r -x node_modules`). Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC stamps.
Trailer `Co-Authored-By:` naming the model you actually are. Quoted heredocs only (placeholder + sed for
timestamps). Two other agents (ABC-083 build, ABC-094 QE) run `npm test` in parallel — record load1.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § QE. Queue
pending → claimed → done (by hand, main checkout, uncommitted). Report: verdict, per-criterion evidence, the
console-line ruling input (consumers checked, any break), gaps with severity, gates, branch + sha.
