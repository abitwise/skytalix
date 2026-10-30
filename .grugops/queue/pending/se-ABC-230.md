---
subtask: se-ABC-230
role: software-engineer
ticket: ABC-230
ref: .grugops/context/se-ABC-230/
workflow: agent-factory/workflows/ticket-to-pr (SE hop; QE follows with the smoke pair)
branch: new grugops/ABC-230 from main (d44bf6c1 or later), own worktree
---

# ABC-230: the game's earlier positions reach the search, from the CLI and from UCI

Build ABC-230 to its ticket page (folded, DoR 10/10) and ADR-0054 (ACCEPTED 2026-10-30). The design is in the ADR and in
`arch-ABC-230-reading/…90a3aa31` § 1. The fold is in `bapm-ABC-230-fold/…644cf2af`.

## Do
- `priorKeys` on `EngineOptions`, built by one trim helper. CLI injection keeps `level-seam.ts` free of a runtime
  `history.ts` import, and the licence set stays unchanged. UCI `parsePosition` keeps the keys, emptied on `ucinewgame`, a
  refused `position`, or a bare FEN. The scan rule: path needs one occurrence, pre-root needs two. No TT, quiescence,
  `search()` or door change.
- Acceptance rows A1–A6, A8 and A9 in the existing test files. A6's guard tests must stay green unchanged: a red is a
  build fault, not a re-pin.
- Identity: with no prior keys, and with the root clock at 0, node-equal to base (out of tree, plain node, the ABC-235
  harness pattern).
- Gates: lint, typecheck, `npm test` and build green at every commit; G1, G5, G6 (identity covers it), G7, G8, G9.
- **A7 (the smokes) is QE's, not yours.** Play no games.

## Fences
- `src/` as the ADR names, plus tests, the ticket's dated result line and your context. No tools/ or data/ edits.
- Own `npm ci --ignore-scripts`. Linters only via `npm run …`. **Never a bare `npx`.** No games, no cutechess.
- Never push, force, amend or rebase. Never merge into main. No board edits. **No host paths in any commit**, intermediate
  ones included: leak-scan the staged diff for /home/ and /tmp/claude before every commit.

## Publish
- Seal notes (task `se-ABC-230`) with `at` from `date -u`. Commit on your branch. Write `## Result` plus a 10-cell trace
  row into this brief, then move it and its claim.md to done/.
