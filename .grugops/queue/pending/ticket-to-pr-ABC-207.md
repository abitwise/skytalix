---
subtask: ticket-to-pr-ABC-207
role: software-engineer
ticket: plans/tickets/ABC-207-mobility-is-weighted-per-piece-and-an-early-queen-trip-costs.md
ref: .grugops/context/ticket-to-pr-ABC-207/
branch: new grugops/ABC-207 from main, worktree ../wt-ABC-207
width: 1 of 3 (no real-clock timing, no G6, no games)
---

# Build ABC-207: per-piece mobility weights + early-queen term

## Do
- Own worktree and `npm ci --ignore-scripts`. Build exactly to the page's `## Design ruling` (Architect `arch-design-ABC-207/…a21b7cc9`, `…439d6f8c`; Orchestrator `orch-2026-10-25aa/…6eda769c`): MOBILITY_WEIGHT as ruled, applied before the unchanged ±100 cp clamp; `evaluateWithoutMobility` keeps the exact-difference property; the early-queen term as ruled, outside the clamp, with no new export. Add the A1/A2/A3 relation and mirror rows (≥ 10 new positions) in `src/evaluate*.test.ts`.
- Pins: only the 12 rows in 4 files that the ruling names, each by its stated route. Any relation red, any other row moving, or any level red → STOP to Architect.
- Red-first where the page names plants. Frozen-clock d7/d8 counts on kiwipete and position-6 for base and head (must equal the ruling's), reported, not graded.
- Gates: lint, typecheck, build, `npm test` + `last-run.json` (Duration), skips, SEARCH_DEEP, ENGINE_DEEP (deterministic rows; filter real-clock rows out by name), PUZZLE_DEEP. No real-clock timing.

## Fences
- Only `src/evaluate.ts`, the test files the ruling names, your worktree and `<scratchpad>/se207/`. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only.

## Publish
- Commit on your branch. Seal notes (task ticket-to-pr-ABC-207). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
