---
task: wave-2026-09-24
subtask: qe-ABC-080
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-080-move-ordering-mvv-lva-killers-hash-move.md
ref: .grugops/context/qe-ABC-080/
build_ref: .grugops/context/ticket-to-pr-ABC-080/
ruling_ref: .grugops/context/ruling-abc080-081/
enqueued_by: orchestrator
enqueued_at: 2026-09-25T15:00:00Z
branch: grugops/qe-ABC-080
base: grugops/wave-2026-09-24 (tip after this enqueue; the build is on it at cb8ca55)
diff_under_review: 4f74acc..cb8ca55 -- src
---

# Subtask: QE of `ABC-080` — move ordering

The build claims `A1`–`A7` MET with no stop fired (`build_ref:` decision + observations + claim).
Break it. The ticket page is the contract.

## Check
1. Every criterion on your own reading, not the Engineer's. Lossless ordering: scores identical
   to `searchWithoutOrdering` on a corpus broader than the six perft roots.
2. **Rule the Engineer's three flagged calls:** (a) the `src/quiescence.test.ts` re-pin outside
   the two named test companions (is it inside the ticket's licence, and is the new node count
   the right pin?); (b) `engine.test.ts` `A3` fixture budget 8 → 4 (does the test still prove
   what it claimed?); (c) killers kept across one `chooseMove`'s iterations vs "cleared
   between searches".
3. Mutants: extend the thin spots named (M7–M10 die on one row, M15–M17 on one row each). Add
   your own on the comparator ordering and the killer update rule. Any survivor is a gap.
4. `ABC-079` QE G4 (promotion term in `mvvLvaKey`) closed as claimed?
5. Comments in the diff: true by the `ABC-114` standard.
6. Gates: lint, typecheck, build, default lane, skip-integrity; `SEARCH_DEEP=1` and
   `ENGINE_DEEP=1` once each.

## Fences
Zero lines under `src/` in your diff (mutants applied, measured, reverted; assert
`git status --porcelain -- src` empty after each). No `plans/board.md`, `AGENTS.md`, NFR bars,
ADRs. `NFR-005`/`NFR-008` are reported, not ruled (Security/NFR follows). Never merge; never
push. Own `git worktree`; commit messages via a scratchpad file and `git commit -F`; probes as
node scripts.

## Publish
`decision` (verdict) + `observation` (raw readings) notes under `ref:`, trace row, ticket § QE.
Queue pending → claimed → done per Workflow 17. Report: PASS/FAIL in one line, each criterion,
each flagged call's ruling, the mutant ledger summary, any gap, sha, numstat.
