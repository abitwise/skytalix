---
subtask: ticket-to-pr-ABC-215
role: software-engineer
ticket: plans/tickets/ABC-215-the-evaluation-values-are-our-own-and-the-cc-by-sa-carve-out-leaves-notice.md
ref: .grugops/context/ticket-to-pr-ABC-215/
branch: new grugops/ABC-215 from main, worktree ../wt-ABC-215
width: 1 of 3 (no real-clock timing, no G6, no games)
---

# Build ABC-215: rule-made evaluation values (c2); carve-out ends

## Do
- Own worktree and `npm ci --ignore-scripts`. Build exactly to the page's `## Design ruling` (Architect `arch-design-ABC-215/…e04234f4`, `…cbbb9a63`) and the amended A8/A8a (BA/PM `bapm-amend-ABC-215/…fb4f7c9c`): the seven arrays by their rules, the one TEST-ONLY export, the A2 rebuild rows in `src/evaluate.test.ts`, `NOTICE` lines 7–15 removed, the `src/evaluate.ts` header carve-out replaced by one line, the README licence sentence per A8a.
- Pins: only the 16 rows in 5 files the ruling names, each by its stated route (9 re-pins, 5 re-finds under ADR-0028 d2, 2 by the oracle rule). Any other row that moves → STOP to Architect.
- Red-first where the page names plants. Frozen-clock d7/d8 counts on kiwipete and position-6 for base and head (must equal the design's), reported, not graded.
- Gates: lint, typecheck, build, `npm test` + `last-run.json` (Duration), skips, SEARCH_DEEP, ENGINE_DEEP (deterministic rows; filter real-clock rows out by name as the Architect did), PUZZLE_DEEP. No real-clock timing.

## Fences
- Only the files A8 lists, your worktree and `<scratchpad>/se215/`. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task ticket-to-pr-ABC-215). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
