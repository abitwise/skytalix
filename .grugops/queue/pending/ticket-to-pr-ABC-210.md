---
subtask: ticket-to-pr-ABC-210
role: software-engineer
ticket: plans/tickets/ABC-210-checks-at-the-horizon-a-check-extension-or-checks-in-quiescence.md
ref: .grugops/context/ticket-to-pr-ABC-210/
branch: new grugops/ABC-210 from main, worktree ../wt-ABC-210
width: 2 of 2 (no real-clock timing, no G6, no games)
---

# Build ABC-210: a check extension at the horizon (ADR-0051, ACCEPTED by the owner)

## Do
- Read Orchestrator `owner-word-2026-10-27/…047d411f`. Own worktree and `npm ci --ignore-scripts`.
- Build exactly to the page's `## Design ruling` and ADR-0051 (Architect `arch-design-ABC-210/…c5d0e464`, `…8e6a40c2`) as amended on the page (BA/PM `bapm-amend-ABC-210/…ae96d6d3`, `…6f7cb75e`). That covers:
  - the pure predicate `checkExtensionPlies(position, depth, extensions)` → 1/0 (remaining depth ≤ 0, side to move in check, cap 1 per line), called at node entry in both recursions; `extensions` placed before `afterNull`;
  - the door pair `searchWithoutCheckExtension` / `chooseMoveWithoutCheckExtension`, with older doors as the ruling says;
  - `QUIESCENCE_MAX_PLY` and `src/quiescence.ts` untouched; the page's Scope header lines.
- Tests:
  - A2: ADR-0051 d8's five horizon rows at depth 1 (both recursions), the line-length instrument and the cross-check cap row.
  - A3: d6 nodes against the door (≤ 1.5×); drift d5 on the 190, both recursions, ≥ 90 % within 25 cp, none beyond 174 cp; same-depth mate floor d5 on the 287.
  - The predicate table and the unit rows the ruling names.
- Pins — only those the ruling names:
  - **P1 (Orchestrator, …75af453c):** `transposition.test.ts` ABC-081 A5 fixture row re-pinned depth 3 → depth 2 at −502 (ADR-0026 d7).
  - **P2 (owner, …047d411f):** `search.null-move.test.ts` ABC-208 A2 `zugzwang.005` depth 12 → 13.
  - The 2 export lists, the 2 QE-208-c door maps, and the named re-points to the new doors (ADR-0050's d5 drift ×2, mate floor, "changes the work" ×2).
  - Any other value pin, relation, level or NFR bound moving → STOP to Architect.
- Red-first where the page names plants. Frozen-clock d7/d8 counts on kiwipete and position-6 for base and head (must equal the ruling's), reported, not graded.
- Gates: lint, typecheck, build, `npm test` + `last-run.json` (Duration; NFR-008 headroom), skips (`--skip-count 0`), SEARCH_DEEP (incl. the null-move deep lane per AGENTS.md), ENGINE_DEEP (deterministic rows only), PUZZLE_DEEP (G1 54/58). No real-clock timing.

## Fences
- Only the files the page's Scope names, the tests the ruling names, your worktree and `<scratchpad>/se210/`. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only. Do not edit ADR-0050 or ADR-0051 (Architect is accepting them beside you).

## Publish
- Commit on your branch. Seal notes (task ticket-to-pr-ABC-210). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
