---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-142
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-142-npm-test-keeps-the-failing-tests-name-when-the-console-is-truncated.md
ref: .grugops/context/ticket-to-pr-ABC-142/
source_refs: .grugops/context/bapm-rescore-backlog-r1-2026-10-10/notes/ (…d8990fbb), .grugops/context/qe-ABC-141/notes/ (QE-141-a), .grugops/context/qe-ABC-093/notes/ (QE-093-e), tools/grugops/run-bounded.js, memory-bank/50-decisions/ADR-0035*
enqueued_by: orchestrator
enqueued_at: 2026-10-10T19:10:03Z
branch: grugops/ABC-142-test-result-file
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: build `ABC-142` — every `npm test` run keeps the failed tests' names on disk

XS, P2, DoR 10/10. The ticket page is the contract (A1–A5). The mechanism is yours; no retry flag. Re-verify the
premise at the current tip first; if stale, STOP and report.

## Stop conditions
- Diff limited to `package.json`'s `test` script, `.gitignore`, and `tools/grugops/run-bounded.js` only if argv
  needs it (A5). Zero `src/`. Any other path — STOP.
- `run-bounded.js`'s documented exit contract stays byte-unchanged; console output and exit codes unchanged.
- ABC-083 and ABC-094 are being built in parallel and run `npm test` in their own worktrees — do not touch their
  worktrees; A1's inverted assertion goes in a scratch copy of YOUR tree only.
- Cost per ADR-0035: report the added wall/CPU of the extra reporter (expected ≈ 0).

## Fences
Never merge; never push. No `plans/board.md`, ADRs, `AGENTS.md`. Own worktree; link `node_modules` into YOUR
worktree only (`diff -r -x node_modules`). Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC
stamps. Trailer `Co-Authored-By:` naming the model you actually are. Quoted heredocs only (`<<'EOF'`).

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § Delivery. Queue
pending → claimed → done (by hand, main checkout, uncommitted). Report: gates, per-criterion evidence, the
result-file path and sample, cost, diff names, branch + sha.
