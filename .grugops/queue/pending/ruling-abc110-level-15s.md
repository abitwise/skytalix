---
task: owner-rulings-2026-09-19
subtask: ruling-abc110-level-15s
role: architect-design
workflow: agent-factory/workflows/07-backlog-refinement.md (owner moved a level → superseding ADR + re-measure + rule the clause)
ticket: plans/tickets/ABC-110-close-the-default-lanes-1480-ms-cpu-deficit.md
ref: .grugops/context/ruling-abc110-level-15s/
authority: .grugops/context/owner-rulings-2026-09-19/notes/20260919T100000Z-orchestrator-decision-six-owner-rulings-verbatim-3c9e1f42.md
enqueued_by: orchestrator
enqueued_at: 2026-09-19T10:05:00Z
branch: grugops/ruling-abc110-level-15s
base: grugops/owner-rulings-2026-09-19
adr_id: ADR-0019
---

# Subtask: `NFR-008`'s CPU level moves 13 s → 15 s on the owner's word — record it, re-measure, rule the clause

Read the authority note, `ABC-110` in full, `ABC-108`, `ABC-111`, `ADR-0014`, and the `NFR-008` row
in `plans/nfr-catalog.md`. The owner's word: *"3. raise to 15s for now"*. That is lever (ii) — the
one `ABC-110` says is the owner's alone. Lever (i) (moving files behind an opt-in lane) is NOT
taken. `isolate: false` stays forbidden (fourth time written down; do not re-propose).

## Deliver
- `memory-bank/50-decisions/ADR-0019-<slug>.md`, `status: accepted`, superseding `ADR-0014`'s
  level only: **CPU clause ≤ 15 s; wall clause ≤ 3 s UNCHANGED** (the owner did not name it).
  Quote the owner's word verbatim. "For now" → name the revisit trigger (e.g. a reading > 15 s,
  or the lane shrinking back under 13 s making the old level restorable).
- `plans/nfr-catalog.md` `NFR-008` row: level 15 s, dated, citing `ADR-0019`. The `N8-LANE ≤ 650 ms`
  per-ticket rate limit stays (`ADR-0014` decision 4). Do not re-cut any ticket's `N8-LANE` line.
- **Re-measure per `ABC-110` `A6`** under `NFR-008`'s own protocol (as the row states it — read it,
  do not invent one): contained lane `npx vitest run --dir src`, report CPU (user+sys) and wall,
  the 1-min load average, and how many samples/median. Rule the CPU clause against 15 s.
  **The wall figure is REPORTED, not ruled** — `ABC-111`'s warm/cold protocol is unsettled and
  `ABC-110` says the wall verdict cannot be read until it is. Say that explicitly.
- `ABC-110` `A7`: verify no bar, floor, or account moved except the level the owner moved.
- `ABC-110` `A8`: test count identical before/after, skip 0 — nothing moved lanes, so this is a
  no-op you still measure and state.
- Update `ABC-110`'s page: `A5` satisfied (cite the authority note), option taken = level move,
  `A1`–`A4` (per-file saving measurement) are now NOT NEEDED — say so rather than leaving them
  reading as owed. Recommend to the Orchestrator whether `ABC-110` closes or a residual stays
  (the wall clause via `ABC-111`).

## Fences
- Zero files under `src/`, `vitest.config.ts` untouched, `AGENTS.md` untouched (`ABC-109` cap).
- No test moves lanes. No assertion changes.
- Do not merge, do not deploy. Own `git worktree`, commit on the branch above.

## Board / trace
Board row moves are the Orchestrator's. Append your `plans/traceability.md` row.

## Publish
Typed notes per Workflow 16 into `ref:`, hand-authored per `agent-factory/contracts/context-note.md`
(no `finding` admissible; measurements go in as `observation` with the raw numbers, the ruling as
`decision`). Claim by hand per Workflow 17: `mkdir .grugops/queue/claimed/ruling-abc110-level-15s`,
move this file in, then out to `done/` when finished.
