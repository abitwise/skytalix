---
id: 20261021T095902Z-software-engineer-observation-8f09b496
kind: observation
by: software-engineer
at: 2026-10-21T09:59:02Z
verified_by: 
confidence: high (each gate run once, sequentially, on the tip tree)
refs:
  - ABC-181
  - grugops/ABC-181
  - 8f8c88b3
  - 19abbdb1
  - QE-179-a
  - plans/tickets/ABC-181-status-panel-header-credits-the-catalog-with-a-lesson-it-does-not-hold.md
  - .grugops/context/qe-ABC-179/notes/20261021T091230Z-qe-e2e-observation-42fba2a4.md
supersedes: 
seal: sha256:4998d3b9f5ece6b06a3dc9e2866ef923458e7fc883145fc55c878c4d92bc0a63
---

# ABC-181 gates on tip `8f8c88b3`

- `npm run lint` exit 0 (biome, 116 files). `npm run typecheck` exit 0. `npm run build` exit 0.
- `npm test` exit 0: 59 files, 1987 tests passed, 0 failed. `.test-results/last-run.json` shows success true, 1987 tests,
  0 pending, 0 todo. At base (change stashed, same command) it was 59 files and 1987 tests, so the counts are equal.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: "No findings.", exit 0.
- `CLI_DEEP=1` src/cli.real-engine.test.ts: 11 of 11 passed. `PERFT_DEEP=1` src/perft.test.ts: 32 of 32 passed.
  Both used heap 400 and ran one at a time.
- UAT waiver: `git diff --name-only 19abbdb1 8f8c88b3 | grep -v '\.test\.ts$' | grep '^src/'` gives nothing, so 0 production
  lines. No `.snap` file changed. No timing was taken.
