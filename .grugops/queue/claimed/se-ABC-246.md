---
subtask: se-ABC-246
role: software-engineer
ticket: ABC-246
ref: .grugops/context/se-ABC-246/
branch: new grugops/ABC-246 from main (worktree .claude/worktrees/se-ABC-246)
width: one records-only BA/PM hop beside you (no vitest). Record load1 with any timing. Leave no process running.
---
# SE ABC-246 (XS, P3, test-only, UAT waived): two uci-clock-mode rows (hard stop 1 900; movetime over a clock 5 000) + SE-221-g comment
## Read
- The ticket page plans/tickets/ABC-246-*.md (A1–A5, Scope, Out of scope).
- qe-ABC-221 notes …8ad25906 (QE-221-a) and …c6f37a35 (plants HSCM, CLOCKWINSCM); se-ABC-221 …7896971d (SE-221-g).
- src/uci-session.ts parseGo; src/uci-session.test.ts ABC-221 block; src/engine.test.ts ABC-170 A2 block.
## Do
- A1/A2 rows in the ABC-221 describe block, stubbed chooseMove, as A5/A7's budget rows do.
- A3: apply HSCM and CLOCKWINSCM out of tree, each alone; record red/green; restore. Never commit a plant.
- A4: comment-only diff on src/engine.test.ts (figure derived at HARD_CEILING_MS 60 000, or drop the count).
- A5: gates via `npm run …`; `npm test` green, 0 skips; net rows +2. One G8 read is enough (not the QE gate); record load1.
## Fences
- Only src/uci-session.test.ts and the one comment in src/engine.test.ts. No production line (QE-221-b stays out). No push, force, amend, rebase, or merge into main. No board edits. Never bare npx or npm exec. No host paths in committed files.
- Waiting: poll an output file or `kill -0 <pid>`; never `while pgrep -f …`. Never put vitest on the same command line as a wait.
- Scratch `se-246/`.
## Publish
Sealed notes (task `se-ABC-246`, contextRoot = worktree), commit, `## Result` + 10-cell trace row here, brief + claim to done/.
