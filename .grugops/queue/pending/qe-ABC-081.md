---
task: wave-2026-09-24
subtask: qe-ABC-081
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-081-transposition-table-and-in-tree-repetition.md
ref: .grugops/context/qe-ABC-081/
build_ref: .grugops/context/ticket-to-pr-ABC-081/
adr_refs: ADR-0025 (accepted), ADR-0006 (rights key, G6), ADR-0020
enqueued_by: orchestrator
enqueued_at: 2026-09-25T19:00:00Z
branch: grugops/qe-ABC-081
base: grugops/ABC-081-transposition-table @ 504f046   (NOT on the wave branch until QE + Security/NFR pass)
worktree: .claude/worktrees/qe-ABC-081
diff_under_review: 6033d05..504f046 -- src
---

# Subtask: QE of `ABC-081` — transposition table + in-tree repetition

The build claims `A1`–`A8` MET with no stop fired (`build_ref:` notes). Break it. The ticket page
is the contract. `NFR-005` binds PLAIN NODE (owner's word 2026-09-25, note
`…orchestrator-decision-0288b6ed`); the build's notes predate that ruling.

## Check
1. Every criterion on your own reading. A2 passes narrowly (15.95% / 15.38% vs 15%): re-measure
   it, and say whether it is stable or a coin-flip.
2. **A4 caveat:** the build found no reused mate-in-2 entry that changes a root score. Try
   to construct one. A mate-distance error that no row catches is a gap.
3. **Rule the Engineer's design calls:** (1) exact-depth-only cutoff vs conventional `≥ depth`;
   (2) always-replace; (3) `ABC-080`'s ordering doors keep the table off; (4) three new exports
   and `ABC-077` A6's widened list; (5) the two forced edits (`!(depth >= 1)` root guard, the
   `Parameters<EngineSeam>[0]` type); (6) the three re-measured pins (G4 275 → 261, `ABC-078` A3
   budget 4 → 3, the identity sweep accepting 6/368 equal-score different moves).
4. **Mutants:** K3 (capacity guard removed) SURVIVES; K4 HANGS the lane to the 400 s cap. Is a
   lane that hangs on a plausible regression acceptable, or a gap needing a per-test timeout?
   Extend the thin spots (T3, S1, E1, E3). Re-apply a sample of the 25 claimed kills yourself.
5. `ABC-080` G1 closed as claimed (the engine killer-on-cutoff mutant reds the new pin)?
6. Comments in the diff true by the `ABC-114` standard. Also: does the table break any
   game-level behaviour through `npm run chess` (a scripted game end-to-end, including a
   repetition draw)?
7. Gates: lint, typecheck, build, default lane, skip-integrity; `SEARCH_DEEP=1` and
   `ENGINE_DEEP=1` once each.

## Fences
Zero lines under `src/` in your diff (mutants applied, measured, reverted; `git status
--porcelain -- src` empty after each). No `plans/board.md`, `AGENTS.md`, NFR bars, ADRs.
`NFR-005`/`NFR-009`/`N8-LANE` reported, not ruled (Security/NFR follows). Never merge; never
push. Commit messages via a scratchpad file and `git commit -F`; probes as node scripts.

## Publish
`decision` (verdict) + `observation` (raw readings) notes under `ref:`, trace row, ticket § QE.
Queue pending → claimed → done per Workflow 17. Report: PASS/FAIL in one line, each criterion,
each design call's ruling, the mutant ledger summary, any gap, sha, numstat.
