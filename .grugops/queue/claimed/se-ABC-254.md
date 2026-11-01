---
subtask: se-ABC-254
role: software-engineer
ticket: ABC-254
ref: .grugops/context/se-ABC-254/
branch: new grugops/ABC-254 from main (worktree .claude/worktrees/se-ABC-254)
width: parallel coding allowed (owner 2026-11-01: "you can work in-parallel apart from running tests"); test/timing runs are serialized — see Host rule.
---
# SE ABC-254
## Read
- plans/tickets/ABC-254-lazy-legality-make-test-unmake-only-for-king-moves-en-passant-pinned-pieces-and-checks.md in full (acceptance, scope, fences, Test notes). ADR-0003 as amended 2026-11-01 ((1-A), (3-A), (1-R)) for ABC-254; ABC-248/245 precedent rows for ABC-249.
## Host rule (binding)
- Writing and reading code needs no gate. **Before ANY vitest / npm test / npm run build|lint|typecheck / perft / benchmark / engine run, wait until the file `/tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-clear` exists** (poll it every 60 s with a background waiter or a file check; a QE timing probe holds the host until then).
- **Wrap every such command in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <command>`** so no two hops run tests at once. Never hold the lock while idle.
- Any timing you record (informal G8, nps) only under the lock, with load1 and foreign processes logged.
## Do
- Implement the ticket to its acceptance; gates via `npm run …` (under the rule above); npm test green, 0 skips; skip-integrity and lane inventory clean. A STOP if the page cannot be met as written.
## Fences
- Only the files the ticket's scope names. No push, force, amend, rebase, or merge into main. No board edits. Never bare npx or npm exec. Never `while pgrep -f`; never vitest on the same command line as a wait. Thermal stop: Tctl median > 85 °C. Leave no process running. Scratch `se-254/`.
## Publish
Sealed notes (task `se-ABC-254`, contextRoot = worktree), commit, `## Result` + 10-cell trace row here, brief + claim to done/.
