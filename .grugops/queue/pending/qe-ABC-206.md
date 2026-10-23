---
subtask: qe-ABC-206
role: qe-e2e
ticket: plans/tickets/ABC-206-the-search-runs-faster-with-identical-answers.md
ref: .grugops/context/qe-ABC-206/
branch: grugops/ABC-206 (0d046948)
width: 1 — ALONE (A4 timing, G6 depth-in-budget, perft rate). Dispatch only on an idle board, AC.
---

# QE gate for ABC-206 (faster search, identical answers)

## Do
- Own worktree from `grugops/ABC-206`; merge current `main` first (report sha); own `npm ci`.
- Re-run A1 at the tip against the merge base (SE probes are a start) and A2; re-plant the count-guard breakages. Then the timing items exactly as the page states: **A4** median time to depth 8 ≤ 0.85 × base on kiwipete and position-6 (plain node, n ≥ 7, interleaved), **G6** depth-in-budget (≥ 6 and ≥ base), **G1** `PUZZLE_DEEP`, perft as named. Preconditions per timed run: AC, load1 ≤ 8, no foreign vitest.
- Gates at your merge; verdict; UAT (value-identical — say whether the waiver form applies).

## Fences
- Only your worktree and `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/qe206/`. Notes + dated `## QE` addendum on the page. No `src/` edits. Never push, force, amend or rebase; never merge into `main`; don't touch the remote.

## Publish
- Seal notes (task `qe-ABC-206`), `at` from `date -u`, `kind: decision`. `## Result` + 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.
