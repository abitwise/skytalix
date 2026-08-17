---
id: 20260818T003600Z-qe-e2e-artifact-ref-branch-files-and-what-qe-touched-0e5b47c9
kind: artifact-ref
by: qe-e2e
at: 2026-08-18T00:36:00Z
verified_by:
confidence: high
refs:
  - ABC-077
  - src/search.qe.test.ts
  - plans/traceability.md
supersedes:
---

# What QE touched, and what it deliberately did not

## Added

- **`src/search.qe.test.ts`** — 6 tests, 171 ms under the runner, default lane. Three groups:
  - `QE-G1` (2 tests) — `A6` asserted by **behaviour**: with the depth argument omitted, no exported function may yield a move. Closes the source-regex bypass (`G1`).
  - `QE-G2` (2 tests) — the search takes the queen, not the rook, from a knight fork at depths 2 and 3.
  - `QE-G3` (2 tests) — the search declines the pawn that costs the queen, at depths 2 and 3.
  - `QE-G2`/`QE-G3` are the coarse net over the `A1`/`evaluate()` blind spot (`G2`). The file's header states in full what they do and do not prove.

## Edited

- **`plans/traceability.md`** — the `ABC-077` row **in place**, two cells (`Tests`, `Status`), plus the file's `_Updated:` header. **10 columns re-asserted by re-splitting the row from disk after the write**; no raw `|` inside a cell; no other row touched or appended. One measured figure corrected in the `Status` cell: the broad corpus is **184**, not 204.

## NOT touched — deliberately

- **`src/search.ts` and `src/evaluate.ts`** are the delivered originals. Fourteen mutants were applied and every one reverted; `git status --porcelain` is clean of both. QE tests behaviour and does not change it.
- **`src/search.test.ts`** — the engineer's file, left exactly as delivered so the criterion assertions and QE's additions stay separately attributable. Its `204` comment is his to correct.
- **`.grugops/test-skips.md`** — read only, never written. Human-owned.
- **`plans/board.md`** — not opened. The `In Review` column move is the Orchestrator's.
- **`plans/tickets/ABC-077-negamax-alpha-beta-core.md`** — not opened. The stale `ABC-076` OPEN line stays flagged, not edited.
- **`main`** — not touched, nothing merged, nothing deployed.

## Branch

Work was done in the isolated worktree `.claude/worktrees/agent-aa67fe4c3ed9ab12f` against tip `45d6591` of `grugops/abc077-negamax-alpha-beta`. **That branch is checked out in another live worktree, so this hop could not commit onto it directly** and committed onto the worktree's own branch at the same base instead. The QE commit is a **fast-forward** of `grugops/abc077-negamax-alpha-beta` — its parent is `45d6591` — and the Orchestrator can advance the branch ref to it without a merge.

## Commands run — all transcribed in the gate note

`npm run lint`, `npm run typecheck`, `npm run build`, `npm test`, the skip-count capture, `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`, `PERFT_DEEP=1 npx vitest run src/perft.test.ts`, `SEARCH_DEEP=1 npx vitest run src/search.test.ts`. Run twice: on the delivered tip and again after the added file. Green both times, 0 skips both times.
