---
id: 20261023T223054Z-software-engineer-decision-9ca0557a
kind: decision
by: software-engineer
at: 2026-10-23T22:30:54Z
verified_by: 
confidence: high (A1/A2 run by the SE at each commit; deterministic; outputs compared with cmp)
refs:
  - ABC-206
  - EPIC-008
  - ABC-078
  - ABC-205
  - ABC-212
  - NFR-001
  - NFR-004
  - ADR-0003
  - ADR-0026
  - plans/tickets/ABC-206-the-search-runs-faster-with-identical-answers.md
  - arch-design-ABC-206/20261023T220816Z-architect-design-decision-e3ff760b
  - arch-design-ABC-206/20261023T220929Z-architect-design-decision-90b06dec
  - grugops/ABC-206
  - 268ff42a
  - ee77a62d
  - 5ff2a129
  - 26dacbf6
supersedes: 
seal: sha256:c9bd5202b3e812f710a31945e5c11fb09298c89f9498b105b6f5ef7e9073ab97
---

# ABC-206 built as the ruling's three value-identical commits; A1 byte-equal and A2 0 mismatches at each

Software Engineer, task `ticket-to-pr-ABC-206`, branch `grugops/ABC-206` from `main` `268ff42a` (the merge base).
Worktree `../wt-ABC-206`, its own `npm ci --ignore-scripts`. Built to the page's § Design ruling, no deviation.

## Commits
1. `ee77a62d` (i) leaf: `hasLegalMove` (legal.ts), `leafEndReason` (gameend.ts), both `leafScore`s read it.
2. `5ff2a129` (ii) quiescence: `legalCaptures` (legal.ts); `quiesce` builds `captures` from it.
3. `26dacbf6` (iii) LMR: `givesCheck` (legal.ts); `lateMoveReduction` calls it; doc line updated.

## Identity proof, per commit (plain node, scratchpad `se206/`)
- **A1** differential against the merge base `268ff42a` (src extracted with `git archive`): 317 positions (the six
  endgames and two 148-clock roots, each with in-progress children; `broadCorpus`), 5 706 rows. Searches:
  `chooseMove` and both doors at budgets 3 and 5 on a ticking clock(1); `search`, `searchWithoutReductions`,
  `searchWithoutPvsOrReductions` and `searchWithoutQuiescence` at depths 1-3. Compared: move, score, depth, nodes,
  clock reads, position purity. **`cmp` byte-identical at (i), (ii) and (iii).** In a scratch-instrumented copy of
  the tip the corpus calls `givesCheck` 6 472 times through LMR (6 447 unflagged), so (iii) is exercised.
- **A2** depth 3 over the six perft FENs plus six terminal or clock FENs: 285 074 positions, 11 137 359 moves,
  **0 mismatches** at each commit (each built piece against its oracle, position unchanged). Reasons seen: null
  281 393, checkmate 68, stalemate 2, insufficient-material 202, seventy-five-move 3 409.

## Byte-identical, as ruled
`legalMoves`, `isInCheck`, `hasLegalEnPassant`, `gameStatus` and `quiesce`'s signature: the diff removes only two
import lines in legal.ts/gameend.ts. `search.ts` and `engine.ts` exports unchanged. `moves.ts`, `apply.ts`,
`perft.ts`, `evaluate.ts`, `engine.test.ts`, ABC-205's five re-pinned files and every `package*.json` untouched.

## Files (merge base to tip, +/-)
src/legal.ts +76 -1 · src/gameend.ts +18 -1 · src/search.ts +15 -17 · src/engine.ts +4 -4 · src/quiescence.ts +4 -6 ·
src/legal.test.ts +128 -3 · src/gameend.test.ts +79 -2 · src/gameend.nfr.test.ts +77 -3. 8 files, +401 -37.
