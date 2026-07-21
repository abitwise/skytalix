---
id: 20260721T212823Z-ba-pm-artifact-ref-eadb711a
kind: artifact-ref
by: ba-pm
at: 2026-07-21T21:28:23Z
verified_by: 
confidence: high
refs:
  - plans/epics/EPIC-001-chess-rules-core.md
  - plans/epics/EPIC-002-terminal-board-and-game-loop.md
  - plans/epics/EPIC-003-move-input-and-controls.md
  - plans/epics/EPIC-004-engine-and-ai-opponent.md
  - plans/epics/EPIC-005-opening-book.md
  - plans/epics/EPIC-006-game-session-and-packaging.md
  - plans/board.md
  - plans/traceability.md
  - plans/metrics.md
supersedes: 
---

Artifacts produced by Workflow 02 (idea-to-epics) for the CLI chess game.

**Epics — all six in `Backlog`:**

| Epic | Title | Size | Priority | Depends on |
|------|-------|------|----------|------------|
| EPIC-001 | Chess rules core | L | P0 | — |
| EPIC-002 | Terminal board and game loop | M | P0 | 001 |
| EPIC-003 | Move input and controls | M | P0 | 001 |
| EPIC-004 | Engine and AI opponent | L | P0 | 001 |
| EPIC-005 | Opening book | S | P1 | 001, 004 |
| EPIC-006 | Game session and packaging | M | P2 | 001, 002, 003 |

EPIC-001 is the critical path: it unblocks everything, and 002/003/004 can then run in parallel.

**State updated:** `plans/board.md` (six rows in Backlog), `plans/traceability.md` (six rows, Ticket/Feature cells `pending` until Workflow 03 cuts tickets), `plans/metrics.md` (Throughput 0, Lead-time clock started).

**Sizes are epic-level indicative only.** Real t-shirt sizing happens per ticket at refinement, per the board's own convention. The Orchestrator's no-XL-into-dev rule applies to tickets, not to these.

**Not yet done, and owned by other roles:** `plans/nfr-catalog.md` is still empty — NFR-001 through NFR-007 are named in the epics with measurable targets, but Architect/Design owns seeding the catalog rows at design time. No ADRs exist yet. No epic has passed the Definition of Ready, so nothing is in `Ready`; BA/PM owns that exit once tickets are cut.
