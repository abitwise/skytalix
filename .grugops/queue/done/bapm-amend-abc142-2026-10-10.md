---
task: wave-2026-09-25
subtask: bapm-amend-abc142-2026-10-10
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ticket: plans/tickets/ABC-142-npm-test-keeps-the-failing-tests-name-when-the-console-is-truncated.md
ref: .grugops/context/bapm-amend-abc142-2026-10-10/
source_refs: .grugops/context/ticket-to-pr-ABC-142/notes/20261010T191119Z-software-engineer-observation-abc142-premise-stale-3e7c51a0.md, src/cli.test.ts:1665–1686 (ABC-042 A10 pin on `scripts.test`)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T19:11:58Z
branch: grugops/bapm-amend-abc142-2026-10-10
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: BA/PM — amend ABC-142's A5 fence (premise stale: the `scripts.test` pin)

The engineer stopped before coding: `src/cli.test.ts:1665–1686` (ABC-042 A10) pins `package.json`'s `test`
script byte-for-byte, so any change to it turns `npm test` red, and A5 forbids every `src/` line. The
Orchestrator's routing choice is the engineer's option 1: change the `test` script AND update that one pinned
literal in `src/cli.test.ts`, keeping A10's intent (exactly one scripts key added by ABC-042; the test script
pinned). Amend A5 to "zero production `src/` lines; the only `src/` change is ABC-042 A10's pinned `scripts.test`
literal in `src/cli.test.ts`" (UAT waiver still applies: test-only). Add a criterion or test note that the
pin still pins the new value exactly (no loosening to a prefix/regex). Re-score DoR. Options 2 (vitest.config.ts)
and 3 (run-bounded.js injecting flags) stay out — say so in one line each.

## Fences
`plans/tickets/ABC-142-*.md`, trace row, your note only. No `src/`, `plans/board.md`, ADRs, `AGENTS.md`,
`column:`/`status:`. Never merge; never push. Own worktree. Commit-message file in a PRIVATE scratchpad
subdirectory. Real UTC stamps. Trailer `Co-Authored-By:` naming the model you actually are. Quoted heredocs only.

## Publish
Note per Workflow 16, trace row at the END of `plans/traceability.md`. Queue pending → claimed → done (by hand,
main checkout, uncommitted). Report: the amended A5 text, DoR, branch + sha.
