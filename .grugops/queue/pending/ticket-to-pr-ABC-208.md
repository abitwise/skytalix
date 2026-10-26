---
subtask: ticket-to-pr-ABC-208
role: software-engineer
ticket: plans/tickets/ABC-208-null-move-pruning-behind-a-test-only-off-door-with-a-zugzwang-guard.md
ref: .grugops/context/ticket-to-pr-ABC-208/
branch: new grugops/ABC-208 from main, worktree ../wt-ABC-208
width: 1 of 3 (no real-clock timing, no G6, no games)
---

# Build ABC-208: null-move pruning (ADR-0050, PROPOSED)

## Do
- Own worktree and `npm ci --ignore-scripts`. Build exactly to the page's `## Design ruling` and ADR-0050 (Architect `arch-design-ABC-208/…012b1053`, `…bae20026`) as amended on the page (BA/PM `bapm-amend-ABC-208/…e8505f19`). That covers:
  - the pure `nullMoveReduction` predicate (R = 3, depth ≥ 2, null-window only; never in check, after a null, at the root, or below three non-pawn pieces);
  - the null move in `src/apply.ts` (halfmove reset) and its key in `src/zobrist.ts`;
  - both recursions, with a cut returning beta and storing nothing;
  - the door pair `searchWithoutNullMove` / `chooseMoveWithoutNullMove`, with every older door turning null move off;
  - the Scope 5 header lines in `src/engine.ts` and `src/search.ts`.
- Tests:
  - A2's 7 zugzwang rows at their per-row depths.
  - A3's oracle: d5 drift ≥ 95 % ≤ 25 cp, none > 37 cp, on the 190 for both recursions; and the mate floor at d5 on the 287.
  - The predicate table, the source row and the unit rows that catch the oracle's named blind spots.
- Pins: only the 2 export-list rows (by list growth) and the 12 re-pointed rows the ruling names. Any value pin, relation, level or bound moving → STOP to Architect.
- Red-first where the page names plants. Frozen-clock d7/d8 counts on kiwipete and position-6 for base and head (must equal the ruling's), reported, not graded.
- Gates: lint, typecheck, build, `npm test` + `last-run.json` (Duration; NFR-008 headroom matters), skips, SEARCH_DEEP, ENGINE_DEEP (deterministic rows only), PUZZLE_DEEP (G1 54/58). No real-clock timing.

## Fences
- Only the files the page's Scope names, the tests the ruling names, your worktree and `<scratchpad>/se208/`. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only. ADR-0050 stays PROPOSED; do not edit its status.

## Publish
- Commit on your branch. Seal notes (task ticket-to-pr-ABC-208). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
