---
task: wave-2026-09-25
subtask: qe-ABC-082
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-082-evaluation-pawn-structure.md
ref: .grugops/context/qe-ABC-082/
build_ref: .grugops/context/ticket-to-pr-ABC-082/   ruling_ref: .grugops/context/ruling-abc082-levels/   (both on the build branch)
enqueued_by: orchestrator
enqueued_at: 2026-10-09T16:59:33Z
branch: grugops/qe-ABC-082
base: grugops/ABC-082-pawn-structure @ 873911d
diff_under_review: 5ebe1d8...873911d (code 34c9c02 + re-hop 720b92d; 873911d = PENDING OWNER WORD, ADR-0028)
---

# Subtask: QE gate for `ABC-082` (pawn-structure evaluation)

Build: gates green 1504/1504; deep lanes green except the ruled row 17 (green only with `873911d`).
Reproduce `A1`–`A8` independently; do not re-read.

Focus:
1. The terms themselves: hand-built positions for doubled / isolated / passed (incl. adjacent-file
   blockers, pawns behind, edge files, promotion rank), each against a hand-computed score; mirror
   symmetry beyond the corpus.
2. The `A8` re-pin ledger: re-measure at least five exact pins yourself on base and branch;
   re-plant at least three named mutants from the "purpose fixture" class and confirm they red.
3. Row 21's new pair and row 8's (b) fixture: confirm each still bites its mutant (incl. the
   Architect's throw-away-re-search mutant).
4. Mutants of your own in `src/evaluate.ts` (sign flips, off-by-one rank, file-adjacency) — at
   least four.
5. Judge `873911d` separately: does the 10% bar still fail a table that never stores?

`NFR-005` / `N8-LANE` / `NFR-008` are Security/NFR's (running in parallel); report readings only.
Run deep lanes one at a time; note load (Security/NFR measures on this machine too).

## Fences
Zero lines under `src/` (probes under `ref:`), `tools/`, `package.json`. No `plans/board.md`,
`AGENTS.md`, `plans/nfr-catalog.md`, ADRs. Never merge; never push. Own worktree under
`.claude/worktrees/`. Commit messages via scratchpad file + `git commit -F`. Real UTC stamps.

## Publish
`decision` (PASS / PASS WITH FINDINGS / FAIL) + `observation` notes under `ref:`, trace row,
ticket § QE. Queue pending → claimed → done per Workflow 17. Report: verdict, criteria readings,
mutants, ledger re-measures, gaps, sha, numstat.
