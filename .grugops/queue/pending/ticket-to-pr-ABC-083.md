---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-083
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-083-evaluation-king-safety-and-mobility.md
ref: .grugops/context/ticket-to-pr-ABC-083/
source_refs: memory-bank/50-decisions/ADR-0031*, ADR-0034*, ADR-0035* (accepted 2026-10-10, NFR-008 R-1), .grugops/context/wave-2026-09-25/notes/20261010T173005Z-orchestrator-decision-owner-word-eight-answers-6a1f3d92.md (NFR-005 PROVISIONAL retired; reference runtime Node v26.11.0)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T18:12:58Z
branch: grugops/ABC-083-king-safety-mobility
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: build `ABC-083` — evaluation: king safety and mobility

M, P1, DoR 10/10. The ticket page is the contract (A1–A10; cost risk stated up front; A5 measured BEFORE
tuning). All dependencies are merged: ABC-076/082/078/126, ABC-131 (puzzle corpus 54/58, one reading to spare
at 0.8x) and ABC-010 (stricter `parseFen`). Re-verify the premise at the current tip first; if stale, STOP and
report.

## Stop conditions and known overlaps
- `src/quiescence.test.ts` and `src/evaluate.pawns.test.ts` were last touched by ABC-126/ABC-010/ABC-082. The
  page does not name `evaluate.pawns.test.ts`; if A10's re-pins touch it, list it in § Delivery.
- ABC-084's trigger is live: run `PUZZLE_DEEP=1 npx vitest run src/puzzle-suite.test.ts` and report it
  against the 54/58 baseline. A red is classed per ADR-0034 (run its scope command). The margin is thin —
  report readings, not just pass/fail.
- NFR-005: A5 (≤ 1,100 ns leaf) and A7/A9 (completed depth; record load with every round; nodes-to-depth-7)
  are hard bars. Overrun owner: Architect/Design — STOP and report, do not tune past a bar.
- Cost per ADR-0035 (now accepted): narrow set + twin; inadmissible is a valid report.
- This ticket changes production `src/` → the owner's UAT word is needed. If your diff adds or edits a
  capability line (ADR-0036 clause (b); instrument `.grugops/context/design-F-072-1/probe/clause-b.mjs`), say so.

## Fences
Never merge; never push. No `plans/board.md`, ADRs, `AGENTS.md`. Own worktree; link `node_modules` into YOUR
worktree only (`node_modules/node_modules` is a self-symlink: use `diff -r -x node_modules`). Commit-message file
in a PRIVATE scratchpad subdirectory. Real UTC stamps. Trailer `Co-Authored-By: Claude Opus 5.5
<noreply@anthropic.com>`. Committed probe scripts under `.grugops/context/*/probe/` may now be run with
node/bash/python3 (owner-approved); if one is still refused, say so and use your own harness.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § Delivery. Queue
pending → claimed → done (by hand, main checkout, uncommitted). Report: gates, per-criterion evidence, A5 ns,
depth/nodes readings, PUZZLE_DEEP and ENGINE_DEEP/SEARCH_DEEP results, cost, `src/` numstat, branch + sha.
