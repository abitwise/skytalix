---
id: 20261023T203447Z-software-engineer-observation-881df473
kind: observation
by: software-engineer
at: 2026-10-23T20:34:47Z
verified_by: 
confidence: high (commands run at the tip 5e23e249 in ../wt-ABC-203)
refs:
  - ticket-to-pr-ABC-203
  - ABC-203
  - EPIC-006
  - ADR-0047
  - grugops/ABC-203
  - 5e23e249
  - 55a8f4ef
  - arch-design-ABC-203/…e6de1e00
  - NFR-008
supersedes: 
seal: sha256:d6e66de480eef1f80dcc1274bf352cbf4ad95dd30279d20a4f51fc756314a935
---

# ABC-203 gates at the tip 5e23e249

- npm run lint 0, npm run typecheck 0, npm run build 0.
- npm test: 62 files / 2038 tests passed, exit 0; .test-results/last-run.json success true, 0 failed, 0 pending, 0 todo. Base at 55a8f4ef: 61 / 2019 (this worktree, same command). +1 file (src/pgn.test.ts, 15 rows), +4 rows in cli.test.ts.
- Skip-count capture: 0; test-skip-integrity.js: No findings., exit 0.
- CLI_DEEP=1 src/cli.real-engine.test.ts: 11/11. INPUT_DEEP not run (line-input untouched).
- Heap 128 for multi-file runs, 400 for one-file runs.
- Tree clean: after the lane and CLI_DEEP, git status --porcelain is empty and no games/ exists in the worktree (checked with ls as well, because games/ is now ignored).
- Spawns: N8_SPAWN in cli.test.ts unchanged; the lane gains 1 spawn (the writer child in pgn.test.ts), as the ruling said. No timing was taken; the <= 50 ms write reading is QE's.
