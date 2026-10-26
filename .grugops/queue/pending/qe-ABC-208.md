---
subtask: qe-ABC-208
role: qe-e2e
ticket: plans/tickets/ABC-208-null-move-pruning-behind-a-test-only-off-door-with-a-zugzwang-guard.md
ref: .grugops/context/qe-ABC-208/
branch: new grugops/qe-ABC-208 from grugops/ABC-208 (2e9eb9a7), worktree ../wt-qe-ABC-208
width: 1 — ALONE for timing (G2, G5, G6, G8, real-clock rows, D; ~6–12 h). Records-only hops may run beside it (no npm/vitest/build; owner-word-2026-10-24/…619938c5 item 6). ABC-208's own single reading.
---

# QE reading for ABC-208 (null-move pruning; ADR-0050 ACCEPTED by the owner)

> **Owner word (`owner-word-2026-10-26/…58bcd17c`):** ADR-0050 accepted, so the gate on this reading is met (reading (b), `…d25ab770`).
> **One run (`…4c3f7639`):** each reading runs once, and its result is final. No repeat after NOT MET or UNRESOLVED. The ship rule's own extension step is part of the run. Pausing is not a re-run.
> **Battery allowed:** log the power source, and never stop a reading because of it.

## Do
- Merge current `main` first and report the sha. Run your own `npm ci --ignore-scripts`.
- **Re-check the test-gap fix first:** re-run the QE-208-a/b/c plants against SE `se-fix-ABC-208/…2beeb930` (5 rows). Each plant must go red, and head must be green.
- Static items are already passed (`qe-gate-ABC-208/…8c4f3e57`, A1–A3, the 14-row audit). Re-verify only what the merge or the fix could move.
- **Gates:** lint, typecheck, build, `npm test` + `last-run.json`, skips (`test-skip-integrity.js`), SEARCH_DEEP (including the null-move lane), ENGINE_DEEP, PUZZLE_DEEP (G1 ≥ 54/58).
  - Run the lane command as AGENTS.md will carry it, `SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/search.null-move.test.ts`, and report its result and wall time.
- **Real-clock readings:**
  - G2 ≤ 1 100 ns, with the base in the same session.
  - G5, G8, G9, G10, G11 as the page states.
  - The 10 real-clock rows the static gate filtered out.
- **Pre-check** (page Test notes): confirm the frozen-clock d7/d8 counts, base vs head, before any real-clock G6. If a miss is predicted → STOP to Architect/Design.
- **G6** under EPIC-008's G6 reading rule:
  - n = 5 per board per build, interleaved; graded by median.
  - Any run below 6 FAILs. "≥ base" is graded.
  - A miss → STOP to Architect/Design, and no D.
- **D (A5)** only if the gate and G6 pass:
  - ABC-204 harness `d` mode: candidate = your merge, base = its merge-base on main. ABC-204 pins, B = 1 500 ms. PREREG first.
  - Grade by EPIC-008 ship rule **S1**. GAIN → MET.
  - NEUTRAL → the one extension (400 more games, same pins, pooled; report the pooling). GAIN after it → MET.
  - Anything else → NOT MET: a `failed-attempt` note, and no merge.
- **Before each reading:** load1 ≤ 8, and no foreign vitest (wait up to ~60 min). Sample every ~10 s and map overlaps to games. Report all-games and overlap-free results; grade by the page.
- **Verdict and UAT:** this is a production change, so the QE verdict signs UAT under `…5aaf7cec` item 2.

## Fences
- Work only in your worktree and `<scratchpad>/qe208/`. Raw outputs go under your context folder, per ABC-204 A7.
- No `src/` or `tools/` edits.
- Never push, force, amend or rebase. Never merge into main. No board edits.
- Records: class and count only (ADR-0049 d4).

## Publish
- Seal notes (task `qe-ABC-208`) with `at` taken from `date -u`, including a `kind: decision`. Commit on your branch.
- Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
