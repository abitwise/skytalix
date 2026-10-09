---
task: wave-2026-09-25
subtask: qe-ABC-084
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-084-tactical-puzzle-suite-strength-regression-gate.md
ref: .grugops/context/qe-ABC-084/
build_ref: .grugops/context/ticket-to-pr-ABC-084/   (on the build branch; decision …99ac852f, observation …26f28829, claim …a9bf6ab2)
enqueued_by: orchestrator
enqueued_at: 2026-10-09T21:40:19Z
branch: grugops/qe-ABC-084
base: grugops/ABC-084-puzzle-suite @ e426e91
diff_under_review: 7b54dae...e426e91
---

# Subtask: QE gate for `ABC-084` (the tactical puzzle suite)

Build: gates green 50 / 1539 / 0 skips; suite 40/40 in 3 processes byte-identical; `A3` weakened
10/40 exit 1; baseline 40/40 at budget 25 / step 1. Reproduce `A1`–`A7` independently.

Focus:
1. **`A6` provenance is the ticket's heart:** for every puzzle, is the accepted answer
   independently sourced (not the engine's own output)? Spot-verify ≥ 10 by hand / by an
   independent solver of your own (e.g. a plain brute-force mate-in-2 search you write in the probe).
   Are any two puzzles the same position? Any mate-in-2 that also has a mate-in-1 (ambiguous)?
2. **`A3` sensitivity:** besides the constant evaluator, plant at least two SUBTLER weakenings
   (e.g. quiescence off; material values swapped for one piece; depth capped at 2) — does the
   suite go below baseline? A gate that only catches a destroyed engine is weak; report the
   resolution honestly.
3. **`A4`:** re-run the 3-process identity yourself; try a different step at the same budget and
   say whether results stay inside the bars.
4. The `ABC-079` corpus move: `cmp` the 24 rows yourself; `SEARCH_DEEP` quiescence green.
5. The baseline-file commit (`a287461`) touches no trigger-list file and states a reason.

`N8-LANE` is Security/NFR's (running in parallel) — readings only. Note load; Security/NFR is
measuring on this machine.

## Fences
Zero lines under `src/` (probes under `ref:`), `tools/`, `package.json`. No `plans/board.md`,
`AGENTS.md`, ADRs. Never merge; never push. Own worktree; link `node_modules` into YOUR worktree
only. **Commit-message files in a PRIVATE subdirectory of the scratchpad** (another agent clobbered
a shared one). Real UTC stamps.

## Publish
`decision` + `observation` notes under `ref:`, trace row, ticket § QE. Queue pending → claimed →
done per Workflow 17. Report: verdict, criteria readings, the five focus results, gaps, sha.
