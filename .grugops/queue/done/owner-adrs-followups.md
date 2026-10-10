---
task: wave-2026-09-25
subtask: owner-adrs-followups
role: ba-pm
workflow: agent-factory/workflows (BA/PM re-score / re-cut / cut)
ref: .grugops/context/owner-adrs-followups/
source_refs: .grugops/context/wave-2026-09-25/notes/ (…owner-word-d7a1c3e5, …owner-word-r4-6b2f90e4, …owner-word-adrs-91c4e7a0)  memory-bank/50-decisions/ADR-0029..0034
enqueued_by: orchestrator
enqueued_at: 2026-10-10T10:59:02Z
branch: grugops/owner-adrs-followups
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: fold today's owner rulings into the pages they unblock

All six ADRs 0029–0034 are ACCEPTED (owner, 2026-10-10). For each, discharge the DoR items on the page
and re-score — say Ready or not, with any remaining ⚠️ and owner:
1. `ABC-053` — `ADR-0029` discharges item 10. Name `src/render-seam.test.ts` A9 as a build file.
2. `ABC-054` — re-cut per `ADR-0030` (licence half → docblock prose only; A8 → value-binding consumers).
   Sequence 053 → 054 → 057 (shared `src/history-pane.nfr.test.ts`; 057 is Ready now).
3. `ABC-083` — `ADR-0031` (R1), `ADR-0034` (puzzle red classification), owner R2 = keep depth 7. Fix stale
   "40/40" (baseline is 58/62, becoming 54/58), stale ABC-126 "XS". Name its predecessor: the new
   puzzle-edge ticket (item 4).
4. **CUT** (next free id after ABC-130): drop puzzle seeds 1982/1008/1424/1075 per `ADR-0034` (b) at
   0.8x — 58/62 → 54/58, baseline re-recorded in its OWN commit with the reason, W14 expected to
   survive (A3 of ABC-127 still ≥ 6/10 — verify), AGENTS.md `PUZZLE_DEEP` count line owed to the
   Scribe (note `AGENTS.md` is at 24,433 / 24,576 B). Ordered AFTER `ABC-126` (in review, same files).
5. `ABC-087` — fold `ADR-0032`'s four criteria edits (A4 denominator; A4 per blunder move on its
   returned list; A2 ≥ 1 blunder at the easiest level; A5 blunder path if the hardest rate > 0), clear
   stale "OPEN" in Dependencies, fix stale "40/40".
6. `EPIC-003` — amend the scope line: `ABC-038` dropped (claim the queued
   `pending/epic003-drop-abc038.md` task as part of this hop and close it too).
7. `ABC-060` — leave as is (owner word on the drop is pending).
Fences: no `src/`, no `plans/board.md`, no ADR edits. Decision note per Workflow 16; trace rows at the
END of `plans/traceability.md`.
