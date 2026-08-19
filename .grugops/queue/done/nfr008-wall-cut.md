---
task: cut-nfr008-wall-2026-08-20
subtask: nfr008-wall-cut
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/cut-nfr008-wall-2026-08-20/
parent_ref: .grugops/context/cut-lane-remedy-2026-08-19/
enqueued_by: orchestrator
enqueued_at: 2026-08-20T12:00:00Z
branch: grugops/nfr008-wall-cut
base: main @ HEAD
---

# Subtask: cut the `NFR-008` WALL-clause ticket you recommended — one ticket, and the id is yours

**You recommended this and named it the Orchestrator's to route. It is routed. Cut it.**

Your own words at `parent_ref:`: *"`NFR-008`'s WALL clause is UNRULED with one sample at 3.120 s —
the first time this lane has EVER gone over on wall — and BA/PM RECOMMENDS ITS OWN TICKET, ROUTED
FIRST OR IN PARALLEL, because the warm/cold protocol question is an INPUT to `ABC-110` `A6`."*

## Read first
- `parent_ref:` — your five notes from `cut-lane-remedy-2026-08-19`.
- `.grugops/context/design-oq1-lane-budget-2026-08-19/notes/` — Architect/Design's readings and the
  raw per-run TSVs; **2.805 s warm-interleaved and 3.120 s cooled straddle the 3 s clause.**
- `plans/tickets/ABC-110-*.md` § `## Dependencies` — what that ticket consumes from this one.
- `plans/nfr-catalog.md` § the `NFR-008` row; `ADR-0014`; `ADR-0008`.

## The problem to cut
**A verdict that flips with the filesystem cache is not a verdict.** The wall half of `NFR-008` has
no settled warm/cold protocol, so no wall figure — including `ABC-110` `A6`'s closing one — can be
read as pass or fail. **The deliverable is the PROTOCOL question settled, not the clause ruled by
guesswork.** Cut acceptance that says which state the lane is measured in, why, and how it is
reproduced — measurable, in `ABC-110`'s style (paired medians, n, an admissible null control).

## Fences
- **ONE ticket.** Do not cut a second. If you find work for another, name it and leave it uncut —
  that is the Orchestrator's to route, exactly as this one was.
- **Do not move `NFR-008`'s 3 s or 13 s level.** The owner's outright; an agent re-baselining a level
  is the failure mode this backlog keeps catching.
- **Do not rule the wall clause here.** Cutting a ticket is not ruling it.
- **Do not re-open `AR-N8LANE-078`** (discharged, with the arithmetic) and do not re-cut any ticket's
  `N8-LANE ≤ 650 ms` line — `ADR-0014` decision 4 left them standing on purpose.
- **Do not open `plans/nfr-catalog.md` or `ADR-0014` for writing.** The eight rows `NFR-001`–`NFR-008`
  must stay byte-identical at `sha256 63f66795…ca31` — verify it.
- **Do not re-score `ABC-110`, `ABC-108` or `ABC-109`** unless this cut genuinely moves one of their
  DoR items, and then say which item and why in place, keeping the old score visible.
- **Do not move any board column.** Add the Backlog row; column moves are mine.
- 0 files under `src/`. Do not merge, do not deploy.

## Publish
The ticket page under `plans/tickets/`, the Backlog row on `plans/board.md`, the trace row, and typed
notes per Workflow 16 into `ref:`. No `finding` is admissible on this install — use
`claim` / `observation` / `decision` / `artifact-ref`, hand-authored per
`agent-factory/contracts/context-note.md`. **State the new id explicitly in a `decision` note**, so
`ABC-110`'s `## Dependencies` can be closed the way `ABC-108` `A5`'s gap was closed by `ABC-110`.

Claim by hand: `mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` (no `-p`) of
`.grugops/queue/claimed/nfr008-wall-cut`. Commit incrementally on `grugops/nfr008-wall-cut`,
never on `main`.
