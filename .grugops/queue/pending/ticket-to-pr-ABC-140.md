---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-140
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-140-composer-tripwire-call-and-comparator-are-unpinned.md
ref: .grugops/context/ticket-to-pr-ABC-140/
source_refs: .grugops/context/design-qe137-2026-10-10/ (notes …e86924d7; probe/architect-r5d-prototype.patch, plant.mjs), .grugops/context/bapm-r5d-qe139a-2026-10-10/ (…4b4929a5; probe/ledger-file.tsv)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T16:56:46Z
branch: grugops/ABC-140-composer-tripwire-pins
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: build `ABC-140` — pin the composer tripwire's call and comparator (ADR-0011 R5d)

XS, P3, DoR 10/10. The ticket page is the contract (two whole-statement literals, reach comment 5 → 7, the
clause 1 docblock criterion). Test-only, `src/history-pane.nfr.test.ts`. Re-verify the premise at the current
tip first (the five survivors green); if stale, STOP and report. The Architect's prototype patch is a pointer,
not the delivery.

## Stop conditions
- Any other path — STOP. The five existing pin statements (ABC-136/137 and earlier) stay byte-identical; hash
  before/after. Note the page's `H-SHADOW` anchor warning if you reword the docblock's first line.
- Cost per `ADR-0035` (proposed): narrow set + twin, R and load1; inadmissible is a valid report.

## Fences
Never merge; never push. No `plans/board.md`, ADRs, `AGENTS.md`. Own worktree; link `node_modules` into YOUR
worktree only. Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC stamps. Trailer
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. If committed probe scripts are refused, say so and
use your own harness. The Architect's `probe/ledger.sh` hardcodes private paths — don't use it as-is.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § Delivery. Queue
pending → claimed → done (by hand, main checkout, uncommitted). Report: gates, per-criterion evidence (kill
ledger before/after), cost, `src/` numstat, branch + sha.
