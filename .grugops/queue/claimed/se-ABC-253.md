---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T20:40:32Z
subtask: se-ABC-253
role: software-engineer
ticket: ABC-253
ref: .grugops/context/se-ABC-253/
branch: new grugops/ABC-253 from main (worktree .claude/worktrees/se-ABC-253)
width: parallel coding allowed (owner 2026-11-01); test/build/engine runs serialized — see Host rule. QE hops may hold the lock for timing windows.
---
# SE ABC-253
## Read
- plans/tickets/ABC-253-zobrist-keys-travel-as-two-32-bit-halves-in-the-search-the-tt-and-the-repetition-scan-bigint-at-the-api.md in full (acceptance, scope, fences). ADR-0056 (D5 fixed-count rule, C3″, smoke, rule R-TC). EPIC-010 top blocks.
## Host rule (binding)
- **Wrap every vitest / npm test / npm run build|lint|typecheck / engine / cutechess run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <command>`** — no two hops run tests at once; never hold the lock while idle. Single-file vitest needs NODE_OPTIONS=--max-old-space-size=400. Worktree needs npm ci.
- Any timing or real game run you record: under the lock, with load1 and foreign processes logged. A foreign vitest from another repo recurs; never kill it.
- Any single run estimated over 60 min: STOP and report (owner rule).
- ADR-0055 O1-a; addendum D3-V2 and the perft-read addendum (A5 is a search read: chooseMove at 4 000 ms, D3-V2 as written; your speed figures are informal; QE grades in an alone window). ABC-251 profile lesson: V8 already inlines small helpers — profile before hand-optimizing.
## Do
- Profile first (cheap): confirm bigint key work is a measurable share of search time on today's main; if it is under ~1 %, STOP and report before building (Orchestrator drops as "nothing to cut").
- Implement the ticket to its acceptance; gates green, 0 skips; skip-integrity and lane inventory clean. A STOP if the page cannot be met as written.
## Fences
- Only the files the ticket's scope names (per the page; bigint stays at the API — book.json and signatures unchanged). No push, force, amend, rebase, or merge into main. No board edits. Never bare npx or npm exec. Never `while pgrep -f`. Thermal stop: Tctl median > 85 °C. Leave no process running. Scratch `/tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/se-253/`.
## Publish
Sealed notes (task `se-ABC-253`, contextRoot = worktree; never the plugin cache), commit, `## Result` + 10-cell trace row here, brief + claim to done/.
