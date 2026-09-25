---
task: wave-2026-09-25
subtask: qe-ABC-121
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-121-principal-variation-search-late-move-reductions.md
ref: .grugops/context/qe-ABC-121/
build_ref: .grugops/context/ticket-to-pr-ABC-121/   (row inventory …d9a84a04; ledgers; N8 notes)
ruling_refs: .grugops/context/ruling-abc121-g6/  .grugops/context/validate-adr0026/  .grugops/context/amend-adr0026/
enqueued_by: orchestrator
enqueued_at: 2026-09-26T06:30:00Z
branch: grugops/qe-ABC-121
base: grugops/ABC-121-pvs-lmr (tip after this enqueue)
diff_under_review: 15c6eb0...HEAD -- src
---

# Subtask: QE gate for `ABC-121` (PVS + LMR)

Reproduce `A1`–`A6` independently — do not re-read. Focus:
1. **Re-pointed rows** (inventory `…d9a84a04`): each merged row re-pointed to an `ADR-0026` door —
   confirm its literals are unchanged and the door is honestly the pre-`ABC-121` search (not a
   quietly reducing one). Confirm the shipped-path rows (mates, stalemate, repetition, legality,
   clock) stayed on the shipped path.
2. **Deep rows the lane re-hop did not re-run:** the d5 drift and the d7 companion — run them.
3. **Planted variants:** re-apply at least 5 of the 23 yourself, including `noLmrResearch`,
   `r2`, `tactical` and `pvsNoResearch`; confirm the default lane alone reds each.
4. **Depth on plain node:** re-measure depth in 3 s, kiwipete and position-6, ≥ 3 rounds, with load.
5. **The Engineer's suggested saving** (`A4`'s `chooseMove` row dropping its reference search in
   favour of its literal pin) — would it weaken what the row catches? Rule; do not apply.

`N8-LANE` (+1 415 ms net, over) is Security/NFR's to rate — report only.

## Fences
Zero lines under `src/`. No `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`, ADRs. Never
merge; never push. Own `git worktree` `.claude/worktrees/qe-ABC-121` (symlink `node_modules`);
task-unique scratchpad file for commit messages; re-read `git log -1 --format=%s` after each
commit. `npm test` stopped only with Ctrl-C/SIGTERM.

## Publish
`decision` (PASS / PASS WITH FINDINGS / FAIL) + `observation` notes under `ref:`, a trace row, a
ticket § QE section. Queue pending → claimed → done per Workflow 17. Report: verdict, each
criterion with reading, depth table, variants, the saving ruling, gaps, sha, numstat.
