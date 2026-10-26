---
subtask: ticket-to-pr-ABC-209
role: software-engineer
ticket: plans/tickets/ABC-209-the-transposition-table-is-kept-across-the-moves-of-one-game.md
ref: .grugops/context/ticket-to-pr-ABC-209/
branch: new grugops/ABC-209 from main, worktree ../wt-ABC-209
width: 1 of 3 (no real-clock timing, no G6, no games)
---

# Build ABC-209: the transposition table is kept for one game (ADR-0025 D4 amendment, ACCEPTED by the owner)

## Do
- Read Orchestrator `owner-word-2026-10-26b/…2ae5fc12`.
- Work in your own worktree, and run your own `npm ci --ignore-scripts`.
- Build exactly to the page's `## Design ruling` and the ADR-0025 § Proposed amendment 2026-10-26 (Architect `arch-design-ABC-209/…2e73dcd9`, `…b7d4b710`), as amended on the page (BA/PM `bapm-amend-ABC-209/…3750aaf6`). Every clear point, the token seam, the continuation rule and the no-token door are named there; build each one.
- **Tests:** the rows the page's criteria name (A1–A4), including the NFR-009 40-search row in the shape A4 names. Write a test red first wherever the page names a plant.
- **Pins:** the ruling says 0 moved pins and 0 re-points. Any value pin, relation, level or bound that moves → STOP to Architect/Design.
- **Frozen-clock d7/d8 counts:** kiwipete and position-6, base and head. They must equal each other (A1). Report them; they are not graded.
- **Gates:**
  - lint, typecheck, build;
  - `npm test` + `last-run.json`, including Duration (NFR-008 headroom matters);
  - skips;
  - SEARCH_DEEP, including the null-move lane;
  - ENGINE_DEEP, deterministic rows only;
  - PUZZLE_DEEP (G1 54/58).
  - No real-clock timing.

## Fences
- Touch only the files the page's Scope names, the tests the ruling names, your worktree and `<scratchpad>/se209/`.
- Never push, force, amend or rebase. Never merge into main. No board edits.
- Records: class and count only (ADR-0049 d4).
- Do not edit ADR-0025; the Architect records its status.

## Publish
- Commit on your branch. Seal notes (task `ticket-to-pr-ABC-209`) with `at` taken from `date -u`.
- Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
