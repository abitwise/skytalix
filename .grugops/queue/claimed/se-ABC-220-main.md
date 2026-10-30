---
subtask: se-ABC-220-main
role: software-engineer
ticket: ABC-220
ref: .grugops/context/se-ABC-220-main/
branch: grugops/ABC-220 @ 8f444cc4 (worktree .claude/worktrees/se-ABC-220); bring main a649fbc4 in by MERGE (no rebase)
width: shared, NO timed reads
---
# SE ABC-220: take main (ABC-241 merged, also edits src/uci-session.ts) into the branch
## Do
- `git merge a649fbc4` into grugops/ABC-220. Resolve src/uci-session.ts and its test so BOTH hold: ABC-241's repetition-key
  prior keys (ADR-0020 § AMENDMENT 2026-10-30; gameend.ts import) and ABC-220's TimeMode (ADR-0052). Keep ABC-241's
  rows and yours; re-pin only where both changed the same pinned text, and say which.
- Architect's ruling (arch-ABC-220-a14, now on main): A14a = the lane row your code already asserts; confirm, no new code
  unless a row disagrees with the ruling's list.
- Gates via `npm run …`: lint, typecheck, unit, build; npm test count (expect ≈ 2 271 + 26).
## Fences
No other changes. Never push, force, amend, rebase, or merge into main. No board edits. Never bare `npx`/`npm exec`.
No timed reads (A11/A12/A14b are QE's ALONE). No host paths. Scratch `se-220-main/`.
## Publish
Sealed notes (task `se-ABC-220-main`, contextRoot = worktree), commit on the branch, `## Result` + trace row here, brief + claim to done/.
