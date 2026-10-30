---
id: 20261030T120000Z-agents-md-scribe-decision-5eb0a4b1
kind: decision
by: agents-md-scribe
at: 2026-10-30T12:00:00Z
verified_by: 
confidence: high
refs:
  - ABC-228
  - ADR-0053
  - AGENTS.md
supersedes: 
seal: sha256:64beba358dda66430ba9e734b1950654a824d4bd50473db713cb3374dee7ac05
---


# AGENTS.md: level 5 = 4 000 ms; no npm script exists for any deep lane

1. Dev / run slot: "level 5 (<=3 s/move, ADR-0045;" became "level 5 (<=4 s/move, ADR-0053 d10, was 3 s under ADR-0045;". Source: ABC-228 merge e42b637b; ADR-0053 d10 (LEVELS[5].budgetMs 3 000 -> 4 000). Levels 6 and 7 (5 s, 30 s) unchanged.
2. Deep lanes: none can be re-spelled via `npm run`. package.json scripts are typecheck, test, test:watch, lint, lint:fix, format, build, chess, uci, perft, spike:perft. `npm test` bakes heap 128 and a 60 s run-bounded cap; a deep lane needs heap 400 and runs past 60 s (ENGINE_DEEP alone about 99 s). `test:watch` bakes heap 128 too. No lane has a script: PERFT, SEARCH (search, transposition, quiescence, pvs-lmr, null-move), ENGINE (engine, levels, transposition), INPUT, ZOBRIST, PUZZLE, CLI, UCI, LADDER. package.json not edited (brief fence).
3. So the npx lines stay (real, verified). One line added under the Heap flag bullet: no npm script runs a *_DEEP lane; a brief that fences out npx cannot run them; the Orchestrator routes the lane to a hop that may, or records UNKNOWN - verify. Written without a backticked npx-vitest span so src/cli.test.ts A3 (vitestCommandsIn) does not read it as a command lacking a heap flag. Not run (records only).
4. Size: 17 286 -> 17 648 B, under the 18 432 B budget (ABC-109 A5). Follow-up for a human: if a script-only lane runner is wanted, package.json needs one (heap 400, no 60 s cap); a SE ticket, not mine.
