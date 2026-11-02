---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-02T00:36:43Z
subtask: se-ABC-264
role: software-engineer
ticket: ABC-264
ref: .grugops/context/se-ABC-264/
branch: new grugops/ABC-264 from main (worktree .claude/worktrees/se-ABC-264)
width: parallel coding allowed (owner 2026-11-01); test/build/engine runs serialized — see Host rule. QE hops may hold the lock for timing windows.
---
# SE ABC-264
## Read
- plans/tickets/ABC-264-p2-reverse-futility-static-null-move-at-shallow-depth-behind-an-off-door-with-mate-check-and-zugzwang-guards.md in full (acceptance, scope, fences). ADR-0056 (D5 fixed-count rule, C3″, smoke, rule R-TC). EPIC-010 top blocks.
## Host rule (binding)
- **Wrap every vitest / npm test / npm run build|lint|typecheck / engine / cutechess run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <command>`** — no two hops run tests at once; never hold the lock while idle. Single-file vitest needs NODE_OPTIONS=--max-old-space-size=400. Worktree needs npm ci.
- Any timing or real game run you record: under the lock, with load1 and foreign processes logged. A foreign vitest from another repo recurs; never kill it.
- Any single run estimated over 60 min: STOP and report (owner rule).
- ADR-0059 (PROPOSED) is the design and OVERRIDES the page where they differ (BA/PM is updating the page in parallel): predicate reverseFutilityCut(position, depth, ply, beta) exported from src/search.ts; null-window only; after repetition/leaf/TT probe, before null move; depth 1–3; 120 cp/ply; guards root, beta in mate band, in check, < 3 non-pawn pieces; returns beta, stores nothing; doors searchWithoutReverseFutility / chooseMoveWithoutReverseFutility; export lists +3 names; A3 adds a 160 cp cap; A4 ≤ 0.75× in both recursions with the deterministic counts 658 971 / 1 021 190 / 972 596 / 299 183 (explain any other count); falsifiers F1–F7; the predicate unit table must cover the mate-band guard (blind spot). Architect notes .grugops/context/arch-ABC-264/. BUILD ONLY: QE owns the 100-game read, smoke and Levels lane, which wait for owner acceptance of ADR-0059.
## Do
- Implement the ticket to its acceptance; gates green, 0 skips; skip-integrity and lane inventory clean. A STOP if the page cannot be met as written.
## Fences
- Only the files the ticket's scope names (src/search.ts, src/engine.ts and their tests, as ADR-0059 names). No push, force, amend, rebase, or merge into main. No board edits. Never bare npx or npm exec. Never `while pgrep -f`. Thermal stop: Tctl median > 85 °C. Leave no process running. Scratch `/tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/se-264/`.
## Publish
Sealed notes (task `se-ABC-264`, contextRoot = worktree; never the plugin cache), commit, `## Result` + 10-cell trace row here, brief + claim to done/.
