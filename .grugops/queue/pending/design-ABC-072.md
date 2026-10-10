---
task: wave-2026-09-25
subtask: design-ABC-072
role: architect-design
workflow: agent-factory/workflows/07-backlog-refinement.md (ticket build by Architect/Design; docs-only ticket)
ticket: plans/tickets/ABC-072-abc041-clause-b-is-a-state-predicate-with-a-one-limb-instrument.md
also: plans/tickets/ABC-073-clause-b-misreading-has-propagated-to-eight-ticket-pages.md (folds into this hop)
ref: .grugops/context/design-ABC-072/
source_refs: memory-bank/50-decisions/ADR-0036-abc041-clause-b-is-a-delta-test-on-the-production-capability-surface.md, .grugops/context/bapm-followups-2026-10-10/notes/ (…f9ef24db, …e0e21bed)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T14:29:16Z
branch: grugops/ABC-072-clause-b-delta
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: deliver `ABC-072` (A2–A5; A1 met by ADR-0036) with `ABC-073` folded in

DoR 10/10, S, P2. The two ticket pages are the contract (A6 lists the paths allowed, including the fold's).
Re-verify the premises at the current tip first (limb counts, ABC-073's live set = ABC-055 only); if
stale, STOP and report. ADR-0036 is accepted by Architect/Design; the owner may still veto — do not
assume more than the ADR says.

## Fences
Docs only, paths per ABC-072 A6 / ABC-073. Zero `src/`. No `plans/board.md`, `AGENTS.md`; no column
changes. Never merge; never push. Own worktree. Commit-message file in a PRIVATE scratchpad
subdirectory. Real UTC stamps. Trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Publish
Notes per Workflow 16, trace rows at the END of `plans/traceability.md`, § Delivery on both pages. Queue
pending → claimed → done (by hand, main checkout, uncommitted). Report: per-criterion evidence for both
tickets, files, gates (lint + test), branch + sha + numstat.
