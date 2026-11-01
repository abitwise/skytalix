---
id: 20261101T192954Z-software-engineer-observation-af077ad6
kind: observation
by: software-engineer
at: 2026-11-01T19:29:54Z
verified_by: 
confidence: high: git and command record of this hop
refs:
  - se-ABC-250
  - ABC-250
  - EPIC-010
  - ADR-0055
  - ADR-0003
  - ADR-0056
  - NFR-001
  - NFR-005
  - NFR-008
  - NFR-009
  - grugops/ABC-250
  - 2e04eee5
  - ceb28780
  - src/moves.ts
  - src/apply.ts
  - src/legal.ts
  - src/zobrist.ts
  - src/perft.ts
  - src/perft.test.ts
  - src/legal.test.ts
supersedes: 
seal: sha256:cecaba87d8a4bfe17aa18ede8da1596d4b19c3f9f20abc90903352f1ee20557d
---

# ABC-250 artifacts: branch, commits, files, tests, commands

- **Branch:** `grugops/ABC-250`, worktree `.claude/worktrees/se-ABC-250`, from main `ceb28780`. Claim `fba89f77`, code `2e04eee5`. Not pushed, not merged.
- **Files (code):** `src/moves.ts` (+packed encoding and generators), `src/apply.ts` (+UndoStack, packed make/unmake), `src/legal.ts` (+packed lazy filter), `src/zobrist.ts` (+packed key delta), `src/perft.ts` (perft/perftDivide on the packed path).
- **Files (tests):** `src/perft.test.ts` (ABC-250 A1: 7 lane rows + 6 PERFT_DEEP rows), `src/legal.test.ts` (ABC-250 A2: 2 lane rows + 1 ENGINE_DEEP row).
- **Raw evidence:** `.grugops/context/se-ABC-250/raw/`. It holds the probe scripts (probe.mjs, run-speed.sh, med.mjs, bench.mjs, ident.mjs, plant.py), the jsonl and medians for perft and search, the deep-lane output, the plants and the identity hashes.
- **Commands** (each wrapped in `flock <scratchpad>/host-test.lock`):
  - `npm test`; `npm run lint`; `npm run typecheck`; `npm run build`;
  - `NODE_OPTIONS=--max-old-space-size=128 ./node_modules/.bin/vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'` → 0;
  - `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`;
  - `node tools/grugops/lane-inventory.js`;
  - `PERFT_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 ./node_modules/.bin/vitest run src/perft.test.ts`;
  - `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 ./node_modules/.bin/vitest run src/legal.test.ts -t "ABC-250"`.
- **UAT:** owed (production lines); the QE verdict signs it.
- **Remaining for QE:** A3/G4 out of tree, A4 under D3-V2 ALONE on a sealed pre-registration, A5 graded, G1, G5, G6, A7 grade S2 with no smoke.
