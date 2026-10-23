---
id: 20261023T083410Z-qe-e2e-observation-5fc0dfac
kind: observation
by: qe-e2e
at: 2026-10-23T08:34:10Z
verified_by: 
confidence: high (every gate run as spelled at 82a3f153; no timing)
refs:
  - ABC-197
  - QE-177-b
  - ABC-177
  - ABC-178
  - ABC-167
  - EPIC-007
  - A1
  - A2
  - A3
  - A4
  - A5
  - A8
  - src/uci-session.test.ts
  - plans/tickets/ABC-197-one-step-100-uci-row-restores-the-dropped-token-budget-band-qe-177-b.md
  - 051d557a
  - 20e397c8
  - 82a3f153
  - 8804937e
  - 20261023T082318Z-ba-pm-decision-4df5ef95
  - src/uci.real-engine.test.ts
  - tools/grugops/test-skip-integrity.js
  - NFR-008
supersedes: 
seal: sha256:379d10c50240aa5bb65b8bd8e83d88f3b921e7812e150d9e83b4b57976d76c95
---

# `ABC-197` A8 gates at QE's merge `82a3f153` (tip `20e397c8` + `main` `8804937e`): all green; M4 sweep row green and still killing M4; UAT waiver form empty. No timing

This is an observation, not a finding: no stamp exists on this install. QE's own worktree `../wt-qe-ABC-197`, own `npm ci --ignore-scripts`, one command at a time.

- `npm run lint` 0 (biome, 122 files, no fixes). `npm run typecheck` 0. `npm run build` 0. `git status` clean afterwards.
- `npm test` (as spelled, heap 128): exit 0, 61 files, 2 019 tests passed. `.test-results/last-run.json` was deleted before the run and read fresh: `success` true, `exitCode` 0, `runState` exited, 61 files, 2 019 total, 2 019 passed, 0 failed, 0 pending, 0 todo. That is the brief's 61 / 2 019.
- Skip capture (AGENTS.md's command as spelled, heap 128) printed `0`. `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` printed `No findings.`, exit 0. The default lane has 0 skips.
- `UCI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/uci.real-engine.test.ts`: exit 0, 1 file, 5 / 5.
- Heap: 128 on every multi-file run, 400 on every one-file run (UCI_DEEP, gp file runs, census, plant).
- **`ABC-167` A11's M4 sweep row** (`every line written in every row starts with an M4 prefix`) passed at the merge.
  - Under QE-177's plant (`write("released")` after the held bestmove in `release()`) on scratch H, it reds: 13 / 128 red, the sweep row and the same 12 hold rows QE-177 read. R2 stays green under it. The source was restored and `cmp`-equal to `git archive 20e397c8`.
- **UAT waiver form**, unfiltered: `git -c core.quotePath=false diff --name-only 20e397c8~1 20e397c8 | grep -v '\.test\.ts$' | grep '^src/'` printed **nothing** (grep exit 1). Zero production lines. A waiver is not a signature.
