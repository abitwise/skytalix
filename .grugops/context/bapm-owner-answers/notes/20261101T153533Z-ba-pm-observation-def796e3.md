---
id: 20261101T153533Z-ba-pm-observation-def796e3
kind: observation
by: ba-pm
at: 2026-11-01T15:35:33Z
verified_by: 
confidence: high: read from src/levels.ts, tools/rating/rating.ts and AGENTS.md § Commands at adab5f0d, and a search of EPIC-010, EPIC-011 and their ticket pages for level, difficulty and real-engine checks
refs:
  - bapm-owner-answers
  - EPIC-010
  - EPIC-011
  - ADR-0056
  - ABC-087
  - ABC-119
  - ABC-168
  - ABC-220
  - ABC-221
  - ABC-245
  - ABC-247
  - adab5f0d
  - 47f0c1a0
  - orch-2026-10-30a/20261101T152518Z-orchestrator-decision-43098cef
supersedes: 
seal: sha256:9ed9976c08797c517be394430aeabd2332872750ba0a7ac1d7a106bdce95793f
---

# No ticket in EPIC-010 or EPIC-011 ensures "the engine works on different difficulty settings"; and "0.5s difficulty" matches no level

BA/PM, task `bapm-owner-answers`. Records only; nothing run.

- **No existing ticket carries the check.** No reading row, gate list or close step on EPIC-010, EPIC-011 or their ticket pages validates play across the levels or time controls for a strength change or an epic close. The only level-touching pages are test-only rows on the blunder path (e.g. ABC-245) and level-cap notes. Existing instruments the Architect may name (from AGENTS.md § Commands, not chosen here): the levels deep lane (ABC-087, src/levels.test.ts), the real-engine CLI lane (ABC-119), the real-engine UCI lane (ABC-168), the UCI session deep lane (ABC-220 / ABC-221). Per the brief, no ticket is cut.
- **"0.5s difficulty":** src/levels.ts budgets are 100, 180, 330, 1 000, 4 000, 5 000, 30 000 ms (levels 1-7; levels 1-4 blunder at 0.4-0.05). No level is 0.5 s, so the pages follow the Orchestrator's reading: skytalix at st=0.5 (go movetime 500) at level 5, Stockfish at r's st=0.5. The other reading (the smoke at a difficulty level, e.g. level 3 at 330 ms with blunders, or level 4 at 1 000 ms) is the Orchestrator's to rule if he means it.
- **Config only, as read:** r and d send no Skill Level (level 5, cap 4 000 ms today, 3 000 ms at ca6e675c); rpair sends Skill Level 6 (5 000 ms, ABC-247). 100 ms and 500 ms are below every one of these caps, so neither control needs an engine change.
