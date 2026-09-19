---
task: wave-2026-09-19
subtask: qe-ABC-120
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-120-the-turn-loop-gains-quit-and-take-back-arms.md
ref: .grugops/context/qe-ABC-120/
build_ref: .grugops/context/ticket-to-pr-ABC-120/
enqueued_by: orchestrator
enqueued_at: 2026-09-19T22:00:00Z
branch: grugops/qe-ABC-120
base: grugops/wave-2026-09-19 (build d8e7ccc / 62381b0 merged at ec160b6; lane 42 / 1297 / 0)
---

# Subtask: QE `ABC-120` — break the two new loop arms, or say why they cannot be broken

The build: `src/turn-loop.ts` +86/−40 (18 non-comment production lines vs `A9`'s 30),
`src/turn-loop.test.ts` +168/−2 (+6 rows). Transitions 17 (`quit`) and 18 (`take-back`) per
`ADR-0021`. Read the Engineer's five notes in `build_ref:` (the `A6` mutant transcripts, the five
interpretations), `ADR-0021` clauses 4–10, the ticket's `A1`–`A10`, then the code.

## Do
- Re-run the four gates at the tip; report numbers (expect 42 / 1297 / 0).
- Reproduce the Engineer's `A6` mutants M1/M2 (take-back without derive; take-back routed to the
  non-mutating branch) and add at least: (a) `quit` renders a frame before exiting, (b) `quit`
  writes `INPUT_ENDED_NOTICE` instead of `QUIT_NOTICE`, (c) `quit` returns `exitCode` ≠ 0,
  (d) take-back of N plies takes back N−1, (e) take-back leaves the repetition/`keyHistory` stale,
  (f) `messages` dropped on the post-take-back render, (g) the derive runs TWICE on take-back
  (the ONE-supplier rule). Each: rows RED or NONE. Revert via `git checkout --`; confirm clean.
- `A7`/`A8`: verify by hash/diff that `TerminalReason`'s ten, `INPUT_ENDED_NOTICE`, `exitCode: 0`'s
  type, the 18 scripted rows and frame counts, and `src/turn-loop.nfr.test.ts` are unchanged.
- `A10`: the three docblocks and the transition-14 comment — true of the code as it now is?
  The Engineer's interpretation that the "7 non-advancing / 5 emit" census excludes `game-over`:
  right or a false sentence (`ABC-114` standard)?
- `A9` recount by your own method; state the number.
- `test-skip-integrity` → `No findings.`; skip 0.

## Do not
- Do not "fix" the build — FAIL with the mutant and the row named.
- Do not touch `src/command-input.*`, `src/line-input.*`, `src/cli.ts` (`ABC-045`/`046`/`102`
  are next and not yet pulled), `src/search.ts`/`src/quiescence.ts` (`ABC-079` blocked on a
  ruling, its branch unmerged). Do not open `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`.
- Do not rule NFR-008 (three hops read > 15 s at load ≥ 7; quiet re-measure owed).
- No merge, no deploy. Own `git worktree`; commit messages via a UNIQUELY-NAMED scratchpad file
  and `git commit -F`; gates/mutants through a node script (hook refuses `$?`, `npm run`).

## Publish
PASS or FAIL as a `decision` note (no `finding` admissible), mutants as an `observation` with raw
output, trace row appended, ticket page § QE. Claim by hand per Workflow 17:
`mkdir .grugops/queue/claimed/qe-ABC-120`, move this file in, then out to `done/`.
Report: verdict, mutant table, `A9` recount, `A10` ruling, gate numbers, sha, numstat.
