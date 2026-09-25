---
task: wave-2026-09-25
subtask: rescore-abc121
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md (fold a ruling + DoR re-score)
ticket: plans/tickets/ABC-121-principal-variation-search-late-move-reductions.md
ref: .grugops/context/rescore-abc121/
ruling_ref: .grugops/context/ruling-abc121-lmr-oracle/   (R1–R4, probe)
adr_refs: memory-bank/50-decisions/ADR-0026-a-value-changing-search-heuristic-gets-a-test-only-off-door-and-a-bounded-oracle.md (PROPOSED — owner's acceptance pending)
enqueued_by: orchestrator
enqueued_at: 2026-09-25T20:40:00Z
branch: grugops/rescore-abc121
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: fold `ruling-abc121-lmr-oracle` into `ABC-121` and re-score

Fold R1–R4 into the ticket page: the two test-only door pairs per recursion (R1), LMR's bounded
oracle vs `searchWithoutReductions` — 0 mate flips, ≥ 95% of positions within 25 cp, none beyond
75 cp — replacing the current "50 cp in 95%" (R2, and its test notes: pure reduction predicate,
`A4` through both recursions, `A5` on kiwipete and position-6 only), both recursions in one
ticket built as two commits PVS first (R3), and `ADR-0026`.

Dependencies to name: `ABC-122` (gate hardening) lands first; `ADR-0026` acceptance (owner) — if
not accepted, the ruling says two merged bars (`ABC-080` `A3`, `ABC-081` `A3`) would need
re-levelling. Name the export-list widening (`ABC-077` `A6`) and the `N8-LANE` line (the ruling did
not measure the new rows' default-lane cost).

Score DoR out of 10 with every ⚠️ named; do not smooth the owner's pending ADR word away.

## Fences
No `src/`, `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`, ADRs. Never merge; never push.
Own `git worktree` under `.claude/worktrees/`; commit messages via a scratchpad file and
`git commit -F`.

## Publish
The ticket page edits, a trace row, a `decision` note (DoR) under `ref:`. Queue pending → claimed
→ done per Workflow 17. Report: DoR score with each ⚠️, criteria list one line each, sha, numstat.
