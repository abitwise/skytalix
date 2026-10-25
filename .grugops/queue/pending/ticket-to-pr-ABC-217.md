---
subtask: ticket-to-pr-ABC-217
role: software-engineer
ticket: plans/tickets/ABC-217-the-abc-206-and-abc-212-guards-see-discovered-checks-in-module-rebuilds-and-the-session-clock.md
ref: .grugops/context/ticket-to-pr-ABC-217/
branch: new grugops/ABC-217 from main, worktree ../wt-ABC-217
width: 3 of 3 (beside se-fix-ABC-204 and the other ticket; no real-clock timing)
---

# Build ABC-217

## Do
- Own worktree and `npm ci --ignore-scripts`. Build exactly to the page's criteria; red-first where the page names a plant.
- Exactly the four files the page names; `src/gameend.ts` comments only (A6).
- Gates: lint, typecheck, build; `npm test` + `last-run.json` (note Duration); skips. Anything red outside the page's scope → STOP.

## Fences
- Only your worktree and `<scratchpad>/se217/`. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only — no hostnames, IPs, personal paths (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task ticket-to-pr-ABC-217). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
