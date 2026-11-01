---
id: 20261101T153456Z-architect-design-observation-c8c38f1e
kind: observation
by: architect-design
at: 2026-11-01T15:34:56Z
verified_by: 
confidence: high for the code facts (read by grep at main adab5f0d); lane timings quoted from memory-bank/90-agents-md-command-log.md; UCI deep-lane ~5 min is an estimate
refs:
  - ADR-0056
  - memory-bank/50-decisions/ADR-0056
  - EPIC-010
  - EPIC-011
  - ABC-255
  - ABC-256
  - arch-adr0056-owner-answers
  - grugops/arch-adr0056-owner-answers
  - fe50a11f
  - orch-2026-10-30a/20261101T152518Z-orchestrator-decision-43098cef
  - src/levels.test.ts
  - src/uci-session.test.ts
  - src/ladder.test.ts
  - src/engine.ts
  - src/uci-session.ts
  - tools/rating/rating.ts
  - ABC-087
  - ABC-212
  - ABC-171
  - ABC-220
  - ABC-221
  - ABC-085
  - ADR-0026
supersedes: 
seal: sha256:e981d1951cd8b32c7dfb71299092eaa224a43a03b39eec9a2d854ef088f969dc
---

# Observation: the difficulty-settings check (owner item 3) and its gaps

**Code facts, read at main adab5f0d (no run):**
- src/engine.ts reads options.budgetMs only as `deadline: start + Math.min(options.budgetMs, HARD_CEILING_MS)` (plus the option's type/doc). The clock is read every NODES_PER_CLOCK_CHECK nodes, so overshoot is absolute, not a share of the budget.
- src/search.ts, quiescence.ts, evaluate.ts, transposition.ts: no budgetMs and no environment read (evaluate.ts/transposition.ts mention "process" in comments only).
- src/uci-session.ts go(): under TimeMode level, budget = min(G, LEVELS[skill].budgetMs); level 5 = 4 000 ms, so st=0.1 / st=0.5 reach chooseMove unchanged at rate 0.
- tools/rating/rating.ts: r hard-codes skytalix at 4 000 ms and refuses --budget-ms (allowed flags --elo, --rounds); r's --elo default 1650; Stockfish pin st=0.5, timemargin 2000; d uses -openings order=sequential -repeat -games 2, default 200 rounds; every engine is the clone's dist/uci.js.

**The named check per strength-changing ticket: the Levels deep lane**, `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/levels.test.ts --reporter=verbose` (41 tests, ~555 s per the command log). Rows: A2 (levels 1-7 spend budget +-20 %, fine virtual step, inside ceiling; level-1 blunder path too), A4 (level-1 blunder path over >= 200 + 242 moves: legal, rate +-5 pp, never worst, strict second-best), A5 (level 5 at 4 s real clock, 30/30 <= 5 s), ABC-212 A4 (levels 6 and 7 real clock inside ceilings), A3 (level 1 solves fewer puzzles than level 5). Every PR already runs the default rows of levels.test.ts and uci-session.test.ts (Skill Level 1-7 wiring, TimeMode budgets) in npm test.

**Per epic, on the closing head, added:** ladder short mode `LADDER_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/ladder.test.ts` (848 s loaded; real games levels 1-5, A3/A4 legal endings) and the UCI session deep lane `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/uci-session.test.ts` (5 x 22 s + 3 x 59.5 s real clock; ~5 min, estimate).

**Gaps for BA/PM:**
- G-1: R-TC item 2 has no mechanical guard. Proposed: one default-lane source-scan row (levels.test.ts A8 shape) over engine.ts/search.ts/quiescence.ts/evaluate.ts/transposition.ts: budgetMs only in the deadline expression, no environment/argv read. XS, test-only.
- G-2: the Levels deep lane's recorded trigger (command log: src/levels.ts, src/engine.ts, src/virtual-clock.ts) misses search.ts, evaluate.ts, quiescence.ts, transposition.ts and move ordering. Records-only Scribe line.
- Recorded, not proposed: no real games at levels 6-7 or against an outside engine at any level; judged enough given rate 0 and budget-only difference (gold plating otherwise).
