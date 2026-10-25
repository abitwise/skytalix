---
subtask: qe-ABC-217
role: qe-e2e
ticket: plans/tickets/ABC-217-the-abc-206-and-abc-212-guards-see-discovered-checks-in-module-rebuilds-and-the-session-clock.md
ref: .grugops/context/qe-ABC-217/
branch: new grugops/qe-ABC-217 from grugops/ABC-217 (5212a4bd), worktree ../wt-qe-ABC-217
width: 3 of 3 (beside qe-fix-ABC-204, qe-ABC-216; no real-clock timing)
---

# QE gate for ABC-217 (test hardening)

## Do
- Merge current `main` into your branch first (report sha); own `npm ci --ignore-scripts`.
- Verify A1–A7 independently; re-run the four plants yourself (P-a, P-b1, P-b2, Q1) in scratch copies, red at tip and the P-a gap green at base; confirm A6 (`src/gameend.ts` comment-only, stripped output identical) and A5 (exactly four files; no row removed, no expectation weakened).
- Gates: lint, typecheck, build, `npm test` + `last-run.json`, skips. No real-clock searches (keep Q1 off the ABC-167 real-clock rows). Verdict; UAT (waiver if A6 holds).

## Fences
- Only your worktree and `<scratchpad>/qe217/`. No `src/` edits. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task qe-ABC-217). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
