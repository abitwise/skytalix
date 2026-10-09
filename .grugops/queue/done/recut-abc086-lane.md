---
task: wave-2026-09-25
subtask: recut-abc086-lane
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md (re-cut a criterion's lane placement after a build stop)
ticket: plans/tickets/ABC-086-deterministic-move-selection-under-a-fixed-seed.md
ref: .grugops/context/recut-abc086-lane/
build_ref: .grugops/context/ticket-to-pr-ABC-086/   (on grugops/ABC-086-virtual-clock @ 339f940; claim …3bb7069b, observation …542d743a)
enqueued_by: orchestrator
enqueued_at: 2026-10-09T19:41:57Z
branch: grugops/recut-abc086-lane
base: grugops/ABC-086-virtual-clock @ 339f940
---

# Subtask: re-cut `ABC-086`'s default-lane rows so `N8-LANE` holds — no owner breach

The build stopped on `N8-LANE`: +1,070 ms CPU median (sign 8/8, null −0.04%, load1 ~11) vs
≤ 650 ms. Split: the default `A1` slice (30 × 2 at budget 24) 0.7–0.9 s; `A6` 0.3–0.4 s. The
ticket's fallback (move `A6` to `ENGINE_DEEP`) alone is not enough. Budget-1 slice (256 ms) is
rejected by the Orchestrator: every position stops at depth 1, so it guards nothing.

The Orchestrator's direction (yours to shape, not to widen): keep a CHEAP default-lane determinism
guard that still searches past depth 1, and put the full `A1` and `A6` in `ENGINE_DEEP`. E.g. a
smaller position sample at the same budget; size it from the build's per-position readings so the
whole default charge is ≤ ~450 ms in vitest (leave headroom for load). State the arithmetic.
`A1`'s 300/300 and `A6`'s 10/10 stay as written in the deep lane.

Note: the build branch is based on `1d74693`, before `ABC-082` (evaluation) merged into the
wave — the re-hop will merge the wave tip and re-read `A1` there. Say so on the page.

## Fences
No `src/`, `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`, ADRs. Never merge; never
push. Own worktree under `.claude/worktrees/`. Commit messages via a scratchpad file and
`git commit -F`. Real UTC stamps.

## Publish
Ticket page edits, one trace row, a `decision` note under `ref:`. Queue pending → claimed → done
per Workflow 17. Report: the new default-lane row(s) and their estimated charge with arithmetic,
what moved to `ENGINE_DEEP`, DoR (still 10/10?), branch + sha.
