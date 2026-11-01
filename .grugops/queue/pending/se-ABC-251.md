---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T20:28:29Z
subtask: se-ABC-251
role: software-engineer
ticket: ABC-251
ref: .grugops/context/se-ABC-251/
branch: new grugops/ABC-251 from main (worktree .claude/worktrees/se-ABC-251)
width: parallel coding allowed (owner 2026-11-01); test/build/engine runs serialized — see Host rule. QE hops may hold the lock for timing windows.
---
# SE ABC-251
## Read
- plans/tickets/ABC-251-the-search-walks-packed-moves-and-builds-a-move-only-at-its-return-with-inlined-helpers.md in full (acceptance, scope, fences). ADR-0056 (D5 fixed-count rule, C3″, smoke, rule R-TC). EPIC-010 top blocks.
## Host rule (binding)
- **Wrap every vitest / npm test / npm run build|lint|typecheck / engine / cutechess run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <command>`** — no two hops run tests at once; never hold the lock while idle. Single-file vitest needs NODE_OPTIONS=--max-old-space-size=400. Worktree needs npm ci.
- Any timing or real game run you record: under the lock, with load1 and foreign processes logged. A foreign vitest from another repo recurs; never kill it.
- Any single run estimated over 60 min: STOP and report (owner rule).
- Architect design input .grugops/context/arch-abc250-close/notes/…a07418ac (profile first; inline only at hot sites the profile names; Budget literal in deepen). ADR-0055 addendum D3-V2 (your speed figures are informal; QE grades A3 in an alone window). Review notes 6–8 on the page (QE-259-c, QE-260-a, generation order must not change).
## Do
- STOP rule (page 2a): if the profile shows no measurable cost for isBlack/pieceType and only the Budget half remains, STOP and report before building — the Orchestrator then drops the ticket as "nothing to cut" (not a miss).
- Implement the ticket to its acceptance; gates green, 0 skips; skip-integrity and lane inventory clean. A STOP if the page cannot be met as written.
## Fences
- Only the files the ticket's scope names (src/search.ts, src/quiescence.ts, src/engine.ts, src/evaluate.ts only if the profile names it; position.ts exports stay). No push, force, amend, rebase, or merge into main. No board edits. Never bare npx or npm exec. Never `while pgrep -f`. Thermal stop: Tctl median > 85 °C. Leave no process running. Scratch `/tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/se-251/`.
## Publish
Sealed notes (task `se-ABC-251`, contextRoot = worktree; never the plugin cache), commit, `## Result` + 10-cell trace row here, brief + claim to done/.
