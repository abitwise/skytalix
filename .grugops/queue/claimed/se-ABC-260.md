---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T17:38:22Z
subtask: se-ABC-260
role: software-engineer
ticket: ABC-260
ref: .grugops/context/se-ABC-260/
branch: new grugops/ABC-260 from main (worktree .claude/worktrees/se-ABC-260)
width: parallel coding allowed (owner 2026-11-01); test/build/engine runs serialized — see Host rule. QE hops may hold the lock for timing windows.
---
# SE ABC-260
## Read
- plans/tickets/ABC-260-the-source-scan-catches-process-by-any-spelling-and-a-comment-marker-inside-a-string-cannot-hide-code-test-only.md in full (acceptance, scope, fences). ADR-0056 (D5 fixed-count rule, C3″, smoke, rule R-TC). EPIC-010 top blocks.
## Host rule (binding)
- QE plants Q5/Q6/Q7 for reuse: grugops/qe-ABC-259 raw (now on main under .grugops/context/qe-ABC-259/raw/).
- **Wrap every vitest / npm test / npm run build|lint|typecheck / engine / cutechess run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <command>`** — no two hops run tests at once; never hold the lock while idle. Single-file vitest needs NODE_OPTIONS=--max-old-space-size=400. Worktree needs npm ci.
- Any timing or real game run you record: under the lock, with load1 and foreign processes logged. A foreign vitest from another repo recurs; never kill it.
- Any single run estimated over 60 min: STOP and report (owner rule).
## Do
- Implement the ticket to its acceptance; gates green, 0 skips; skip-integrity and lane inventory clean. A STOP if the page cannot be met as written.
## Fences
- Only the files the ticket's scope names (one test file; no production src/ edits). No push, force, amend, rebase, or merge into main. No board edits. Never bare npx or npm exec. Never `while pgrep -f`. Thermal stop: Tctl median > 85 °C. Leave no process running. Scratch `/tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/se-260/`.
## Publish
Sealed notes (task `se-ABC-260`, contextRoot = worktree; never the plugin cache), commit, `## Result` + 10-cell trace row here, brief + claim to done/.

