---
id: 20261104T034427Z-software-engineer-observation-4e6d364a
kind: observation
by: software-engineer
at: 2026-11-04T03:44:27Z
verified_by: 
confidence: high (git, as run); observation because artifact-ref needs a section-14 gate_run this hop does not have
refs:
  - se-ABC-281
  - ABC-281
  - EPIC-011
  - ADR-0046
  - ADR-0050
  - NFR-008
  - R-N8H-1
  - R-281-a
  - Q-N8H-1
  - QE-208-a
  - QE-087-d
  - ABC-230
  - src/search.null-move.test.ts
  - src/engine.test.ts
  - src/levels.test.ts
  - AGENTS.md
  - memory-bank/90-agents-md-command-log.md
  - arch-ABC-281/20261104T032140Z-architect-design-decision-d7b2b02b
  - arch-ABC-281/20261104T032140Z-architect-design-observation-e969c2f0
  - grugops/ABC-281
  - 748d4fa3
  - e526480d
  - 9a8d7493
supersedes: 
seal: sha256:31d6a623fb35e62a70b40905b59bd3a7ab80f4087ecd3f1a7eba52c460a81821
---

# se-ABC-281 observation (artifact record): the ABC-281 build

- **Branch:** `grugops/ABC-281` (worktree `.claude/worktrees/se-ABC-281`), from `main` `748d4fa3`.
- **Commits:**
  - `e526480d` test: the three rows to their deep lanes, with the form-S remnants;
  - `9a8d7493` docs: `AGENTS.md` "44 rows" → "45 rows" (18 429 → 18 429 B) and the command-log entry;
  - then records only (these notes, the queue moves, the trace row).
- **Files:** `src/search.null-move.test.ts`, `src/engine.test.ts`, `src/levels.test.ts`, `AGENTS.md`, `memory-bank/90-agents-md-command-log.md`. No production `src/` line, no new file, no config.
- **Tests:** three remnant rows, each replacing its row in the default lane. Three full rows are now defined only under `SEARCH_DEEP=1` / `ENGINE_DEEP=1`.
- **Commands:**
  - `npm run lint`, `npm run typecheck`, `npm run build`, `npm test`;
  - `test-skip-integrity.js --skip-count 0`, `lane-inventory.js`;
  - the three A4 `-t` lines;
  - the three full deep lanes;
  - `vitest list` at base for the deep counts;
  - the mutant matrix on a scratch copy;
  - 6× `npm test` for the wall reading.
- **Remaining for QE:** A6 (freeze, base and deep-lane kills), A7 re-read, A8 graded B/H/H2 twin. **For Security/NFR:** A9.
- **No UAT:** `git diff --name-only <delivered>~1 <delivered> | grep -v '\.test\.ts$' | grep '^src/'` is empty.
