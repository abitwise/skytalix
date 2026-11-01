---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T19:04:33Z
subtask: se-ABC-250
role: software-engineer
ticket: ABC-250
ref: .grugops/context/se-ABC-250/
branch: new grugops/ABC-250 from main (worktree .claude/worktrees/se-ABC-250)
width: parallel coding allowed (owner 2026-11-01); test/build/engine runs serialized — see Host rule. QE hops may hold the lock for timing windows.
---
# SE ABC-250
## Read
- plans/tickets/ABC-250-moves-packed-into-integers-in-reused-typed-arrays-for-generation-legality-and-make-unmake-read-on-perft-first.md in full (acceptance, scope, fences). ADR-0056 (D5 fixed-count rule, C3″, smoke, rule R-TC). EPIC-010 top blocks. ADR-0003 as amended ((1-A) lazy legality now on main via ABC-254; (1-R): clause 1 governs how legality is decided, not how moves are stored). ADR-0055 O1-b and the addendum D3-V2 (any speed reading you record is informal; QE grades it under D3-V2 in an alone window). ABC-254 merged: the lazy filter is the one you pack.
## Host rule (binding)
- **Wrap every vitest / npm test / npm run build|lint|typecheck / engine / cutechess run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <command>`** — no two hops run tests at once; never hold the lock while idle. Single-file vitest needs NODE_OPTIONS=--max-old-space-size=400. Worktree needs npm ci.
- Any timing or real game run you record: under the lock, with load1 and foreign processes logged. A foreign vitest from another repo recurs; never kill it.
- Any single run estimated over 60 min: STOP and report (owner rule).
## Do
- Implement the ticket to its acceptance; gates green, 0 skips; skip-integrity and lane inventory clean. A STOP if the page cannot be met as written.
## Fences
- Only the files the ticket's scope names. No push, force, amend, rebase, or merge into main. No board edits. Never bare npx or npm exec. Never `while pgrep -f`. Thermal stop: Tctl median > 85 °C. Leave no process running. Scratch `/tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/se-250/`.
## Publish
Sealed notes (task `se-ABC-250`, contextRoot = worktree; never the plugin cache), commit, `## Result` + 10-cell trace row here, brief + claim to done/.
