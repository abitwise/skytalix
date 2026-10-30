---
subtask: se-ABC-244
role: software-engineer
ticket: ABC-244
ref: .grugops/context/se-ABC-244/
branch: new grugops/ABC-244 from main de02f8c2 (worktree .claude/worktrees/se-ABC-244)
width: ALONE-ish (nothing else scheduled; no timed reads owed by the SE — A8/A9 are QE's)
---
# SE ABC-244: time-blind virtual-clock rows take the coarsest kill-set-preserving step (ADR-0046 § Addendum 2026-10-30)
## Read
plans/tickets/ABC-244-time-blind-virtual-clock-rows-in-the-cli-and-uci-tests-take-the-coarsest-kill-set-preserving-step.md (all of it: Scope U1/U2, the step-rule word and its 3 conditions, A1–A10), ADR-0046 § Addendum 2026-10-30 (R1–R4),
arch-g8-headroom notes (`…e15a97a2` + its observation), how ABC-177 was built (the precedent).
## Do
Census per A1; move U1 and U2 per the conditions (the frozen mutant list is QE's — do not choose steps by mutant runs of your own
beyond what the ticket assigns the SE); A3–A5 byte rules; gates via `npm run …`, npm test count. Report an informal npm test wall.
## Fences
Only step literals in src/cli.test.ts and src/uci-session.test.ts (A4/A5). Never push, force, amend, rebase, merge into main. No board
edits. Never bare npx/npm exec. No host paths. Scratch `se-244/`. Wait on jobs via output file or `kill -0`, never `while pgrep -f`.
## Publish
Sealed notes (task `se-ABC-244`, contextRoot = worktree), commit, `## Result` + 10-cell trace row here, brief + claim to done/.
