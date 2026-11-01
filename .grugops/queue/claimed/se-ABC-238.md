---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T23:12:17Z
subtask: se-ABC-238
role: software-engineer
ticket: ABC-238
ref: .grugops/context/se-ABC-238/
branch: new grugops/ABC-238 from main (worktree .claude/worktrees/se-ABC-238)
width: parallel coding allowed (owner 2026-11-01); test/build/engine runs serialized — see Host rule. QE hops may hold the lock for timing windows.
---
# SE ABC-238
## Read
- plans/tickets/ABC-238-a-deeper-stored-entry-may-cut-off-a-shallower-search.md in full (acceptance, scope, fences). ADR-0056 (D5 fixed-count rule, C3″, smoke, rule R-TC). EPIC-010 top blocks.
## Host rule (binding)
- **Wrap every vitest / npm test / npm run build|lint|typecheck / engine / cutechess run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <command>`** — no two hops run tests at once; never hold the lock while idle. Single-file vitest needs NODE_OPTIONS=--max-old-space-size=400. Worktree needs npm ci.
- Any timing or real game run you record: under the lock, with load1 and foreign processes logged. A foreign vitest from another repo recurs; never kill it.
- Any single run estimated over 60 min: STOP and report (owner rule).
- ADR-0058 (PROPOSED) is the design: deeperCutoffs switch, test-only doors searchWithoutDeeperCutoffs / chooseMoveWithoutDeeperCutoffs, older doors switch it off, bounded drift check (depth 5, ABC-121 190 positions, ≥ 95 % within 25 cp, 0 mate sign changes), mate corpus, falsifiers F1–F6. Architect notes .grugops/context/arch-epic011-phase1/ (…2c2c1df6, …1dcdd8c7). ABC-253 was dropped — ignore page lines saying it changes the TT keys first. Count how often a deeper entry cuts (report it). BUILD ONLY: QE owns the 100-game read, smoke and Levels lane, which wait for the owner to accept ADR-0058.
## Do
- Implement the ticket to its acceptance; gates green, 0 skips; skip-integrity and lane inventory clean. A STOP if the page cannot be met as written.
## Fences
- Only the files the ticket's scope names (per ADR-0058 and the page: src/transposition.ts, src/search.ts, src/engine.ts as named, and their tests). No push, force, amend, rebase, or merge into main. No board edits. Never bare npx or npm exec. Never `while pgrep -f`. Thermal stop: Tctl median > 85 °C. Leave no process running. Scratch `/tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/se-238/`.
## Publish
Sealed notes (task `se-ABC-238`, contextRoot = worktree; never the plugin cache), commit, `## Result` + 10-cell trace row here, brief + claim to done/.
