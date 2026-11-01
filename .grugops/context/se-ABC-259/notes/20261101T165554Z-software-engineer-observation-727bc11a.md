---
id: 20261101T165554Z-software-engineer-observation-727bc11a
kind: observation
by: software-engineer
at: 2026-11-01T16:55:54Z
verified_by: 
confidence: high: each plant applied by sed to a full out-of-tree copy of the tip (src, tools, configs; node_modules symlinked), vitest -t ABC-259 run under flock host-test.lock at e1c10e19; diffs and JSON in scratchpad se-259/plants/; nothing planted was committed
refs:
  - se-ABC-259
  - ABC-259
  - EPIC-010
  - ADR-0056
  - R-TC
  - G-1
  - grugops/ABC-259
  - 8f2fc9b5
  - 496a8941
  - f40665b1
  - e1c10e19
  - A1
  - A2
  - A3
  - A4
  - A5
  - A6
supersedes: 
seal: sha256:192f0e750a475ae31d4d9bddbc90ab8fc6bf11b9bddf517c1be8988d4db9a356
---

# se-ABC-259 plants (A2–A6): each rule red on its plant, naming file and rule; comment plant and control green

Scratch: `/tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/se-259/plants/` (script `../plants.sh`). Command: `vitest run src/levels.test.ts -t "ABC-259"` with heap 400 (3 rows run; the other 46 are filtered out).

| id | plant (one line) | result | failing row's message headline |
|---|---|---|---|
| A0 control | none (tip copy) | 3/3 pass | — |
| A2-engine | src/engine.ts after `const start = now();`: `if (options.budgetMs <= 100) { void 0; }` | budget row FAILS; 2 pass | expected 'src/engine.ts: budget rule — budgetMs…' to be '' |
| A2-search | src/search.ts in orderKey: `if ((move as { budgetMs?: number }).budgetMs === 1) return 0;` | budget row FAILS; 2 pass | expected 'src/search.ts: budget rule — budgetMs…' to be '' |
| A3-search | src/search.ts in orderKey: `if (process.env.SKYTALIX_FAST) return 0;` | environment row FAILS; 2 pass | expected 'src/search.ts: environment rule — pro…' to be '' |
| A4-evaluate | src/evaluate.ts in isPassedPawn: `const SEARCH_DEEP = false; if (SEARCH_DEEP) return false;` | test-flag row FAILS; 2 pass | expected 'src/evaluate.ts: test-flag rule — SEA…' to be '' |
| A5-quiescence | appended to src/quiescence.ts: `// ABC-259 A5 plant: budgetMs, process.env, ENGINE_DEEP` and `/* budgetMs process.env ENGINE_DEEP */` | 3/3 pass (green) | — |

- vitest truncates the string at about 40 characters. The file and the rule always fall inside it; the full string is in the run's diff output.
- **First pass (before e1c10e19):** the same plants gave the same red/green pattern, but the headline was "expected [ Array(1) ] to deeply equal []". That missed A2–A4's "naming the file", so the assertion was changed (decision note, item 7).
- **An earlier attempt was invalid (setup):** the plant copies lacked `tools/`, so vitest's globalSetup `tools/grugops/heap-guard.js` was not found. Every copy, including A5, exited 1 with no test run. Fixed by copying `tools/`; not counted as a reading.
- **A1 at production:** the comment mentions are present at the tip: `budgetMs` at src/engine.ts lines 56, 148, 176, 578; `process` at src/transposition.ts 13–14 and src/evaluate.ts 377, 402. The rows pass in every head run (artifact note).
