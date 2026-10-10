---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-010
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-010-fen-semantic-validation.md
ref: .grugops/context/ticket-to-pr-ABC-010/
source_refs: memory-bank/50-decisions/ADR-0033-parsefen-checks-the-side-not-to-move-through-moves-ts-and-off-domain-fixtures-parse-grammar-only.md (owner ACCEPTED), .grugops/context/design-abc010/ (design hop), .grugops/context/bapm-abc010-qe129a-2026-10-10/ (re-score …6e1b4d27, scans in probe/)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T16:01:16Z
branch: grugops/ABC-010-fen-semantic-validation
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: build `ABC-010` — FEN semantic validation (ADR-0033)

DoR 10/10, M, P2. The ticket page is the contract: criterion 9 (a)–(f), the 16-file fence, test note 6's
measured replacement for `src/levels.test.ts:351`. Re-verify at the current tip first (the 185-occurrence
rejection scan and the 15 grammar faults; the fence; line anchors) — if the premise is stale, STOP and
report. 9(d)'s stop rule binds: a rejection outside the fence stops the build.

## Notes
- Production files (`src/fen.ts` and others in the fence): owner UAT word at the end — no waiver.
- Deep lanes per 9(f) and AGENTS.md triggers (incl. `ENGINE_DEEP=1 … src/levels.test.ts`, ~3.5 min, and
  `PUZZLE_DEEP=1` since `src/puzzle-corpus.ts` is in the fence); log load1.
- `ABC-138` (`src/cli.test.ts`) and QE on `ABC-137` (`src/history-pane.nfr.test.ts`) run in parallel — out of
  your fence; if your fence turns out to need either file, STOP and report.
- ADR-0036 clause (b): if your diff changes a production capability line, say so (Security/NFR then gates).
- Cost per ADR-0035 (proposed): narrow set + twin per changed test file group; inadmissible is a valid report.

## Fences
Never merge; never push. No `plans/board.md`, ADRs, `AGENTS.md`. Own worktree; link `node_modules` into
YOUR worktree only. Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC stamps. Trailer
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § Delivery. Queue
pending → claimed → done (by hand, main checkout, uncommitted). Report: gates + deep lanes, per-criterion
evidence, cost, `src/` numstat (production vs test), branch + sha.
