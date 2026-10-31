---
subtask: se-ABC-247
role: software-engineer
ticket: ABC-247
ref: .grugops/context/se-ABC-247/
branch: new grugops/ABC-247 from main (worktree .claude/worktrees/se-ABC-247)
width: one records-only Architect hop beside you (no vitest). Record load1 with any timing. Leave no process running.
---
# SE ABC-247 (XS, P1, tools only): rpair passes Skill Level 6 to skytalix on both builds
## Read
- The ticket page (A1–A4, Test notes).
- The Orchestrator ruling .grugops/context/orch-2026-10-30a/notes/20261031T065500Z-orchestrator-decision-fb0c8978.md.
- qe-EPIC-010-m1-batch's notes and raw/probe/; ABC-225's page; tools/rating/rating.ts, pair.ts and pair-check.ts.
## Do
- Build A1 (the token in every rpair block for both builds, once, in the skytalix engine group; `r` and `d` argvs byte-equal to main).
- Add pair-check test(s) that go red when the token is removed.
- A3: file:line readings at base ca6e675c and at head of every place Skill Level reaches on a `go movetime` path. A miss is a STOP.
- A4: gates via `npm run …`; `npm test` green with 0 skips; the src/data diff is empty. Do not run A2 (QE's probe) or any cutechess games.
## Fences
- tools/rating/ only. No push, force, amend, rebase, or merge into main. No board edits. Never bare npx or npm exec. No host paths in committed files.
- Waiting: poll an output file or `kill -0 <pid>`; never `while pgrep -f …`. Never put vitest on the same command line as a wait.
- Scratch `se-247/`.
## Publish
Sealed notes (task `se-ABC-247`, contextRoot = worktree), commit, `## Result` + 10-cell trace row here, brief + claim to done/.
