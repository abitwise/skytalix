---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-02T17:33:28Z
subtask: se-ABC-268
role: software-engineer
ref: .grugops/context/se-ABC-268/
branch: new grugops/ABC-268 from main (at dispatch) — worktree .claude/worktrees/se-ABC-268
width: wrap EVERY test/build/engine run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`. One core. An Architect timing probe may share the lock — never bypass it.
---
# Build ABC-268 (P3 futility pruning) — build only
## Read
plans/tickets/ABC-268*.md (DoR 10/10 (b)), ADR-0061 (PROPOSED), arch-phase2-p3 notes (…55f7725e, …004b35ed, …e8bec702) and raw/probe (patch, driver incl. audit mode).
## Do
- Implement exactly ADR-0061 in src/search.ts and src/engine.ts: futilityNode/futileMove, switch `futility`, doors searchWithoutFutility / chooseMoveWithoutFutility, every older door turns it off.
- Rows A1–A5 per the page; reproduce the head and door counts and the cut-audit counts exactly (30 272 / 2 943 / 0 flips); plant defects incl. each guard clause and a margin off-by-one, show red.
- G6 vs base (your reading; QE grades), npm test, lint, typecheck, build.
- DO NOT run A6 (100 games, smoke, Levels) — waits owner acceptance of ADR-0061. No merge.
## Fences
Scope per page only. No push, force-push, merge into main. Leave nothing running.
## Publish
Sealed notes (task se-ABC-268, contextRoot = worktree's .grugops/context, never the plugin cache); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/.
