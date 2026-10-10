---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-093
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-093-compile-the-opening-book-into-a-static-checked-in-artifact.md
ref: .grugops/context/ticket-to-pr-ABC-093/
source_refs: memory-bank/50-decisions/ADR-0037*, .grugops/context/design-ABC-093/ (decision …d06f5ba8, observation …21537f0b, probe/measure.ts, probe/RUN.txt), .grugops/context/bapm-fold-book-chain-2026-10-10/notes/ (…46534e0b)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T18:33:01Z
branch: grugops/ABC-093-opening-book-artifact
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: build `ABC-093` — compile the opening lines into one static, data-only, reproducible book artifact

M, P1, DoR 10/10. The ticket page is the contract (A1–A8). ADR-0037 is the structure: Zobrist key as 16 hex
digits, integer line-count weights, inline name at line ends (≤ 12 plies), artifact
`data/opening-book/book.json`, compiler `tools/opening-book/compile.ts` OUTSIDE `src/`, source pinned to an
upstream commit and not checked in. The Architect's `probe/measure.ts` is a pointer, not the delivery.
Re-verify the premise at the current tip first; if stale, STOP and report.

## Stop conditions
- Zero production lines under `src/` is expected (UAT waived by measurement). If the design forces any non-test
  `src/` line, STOP and report — that changes the gate.
- Config changes are limited to what ADR-0037 names (tsconfig/Biome includes for `tools/opening-book/`).
- Weights: implement ADR-0037's line-count default behind ONE named constant; the owner may still veto in
  favour of uniform. Do not decide that yourself.
- ABC-083 is being built in parallel (`src/evaluate*`, `src/quiescence.test.ts`) — no overlap expected; if you
  find one, STOP and report.
- Cost per ADR-0035 (accepted) for any test you add to the default lane.

## Fences
Never merge; never push. No `plans/board.md`, ADRs, `AGENTS.md`. Own worktree; link `node_modules` into YOUR
worktree only (`node_modules/node_modules` is a self-symlink: use `diff -r -x node_modules`). Fetch the CC0
source into a PRIVATE scratchpad dir, pinned by commit; record the URL + commit + sha256. Commit-message file
in a PRIVATE scratchpad subdirectory. Real UTC stamps. Trailer `Co-Authored-By: Claude Opus 5.5
<noreply@anthropic.com>`. Quoted heredocs only (`<<'EOF'`). Committed `.grugops/context/*/probe/` scripts may be
run with node/bash/python3; if refused, say so and use your own harness.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § Delivery. Queue
pending → claimed → done (by hand, main checkout, uncommitted). Report: gates, per-criterion A1–A8 evidence,
artifact size and entry count, rebuild byte-identity, cost, `src/` numstat, config diff, branch + sha.
