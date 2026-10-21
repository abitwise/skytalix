---
id: 20261021T090620Z-software-engineer-observation-81c15cc4
kind: observation
by: software-engineer
at: 2026-10-21T09:06:20Z
verified_by: 
confidence: high
refs:
  - ABC-180
  - AR-162-FALLBACK
  - AR-095-CWD
  - ABC-162
  - ABC-095
  - grugops/ABC-180
  - acb52edf
  - src/cli.real-engine.test.ts
  - plans/tickets/ABC-180-a-decoy-book-in-a7s-neutral-cwd-reds-a-cwd-first-read-with-a-module-fallback.md
  - NFR-008
supersedes: 
seal: sha256:c56db8a73fda979c68101a5481f392648c14a91f12a4d08e885c4ab1c621f0f7
---

# ABC-180 gates on tip acb52edf: all green; UAT-waiver form empty; A4/A5/A6 counts

Run in the worktree `../wt-ABC-180` at `acb52edf`, one at a time, no timing taken.
- `npm run lint` exit 0 (116 files); `npm run typecheck` exit 0; `npm run build` exit 0.
- `npm test` exit 0: 59 files, 1987 tests passed. `.test-results/last-run.json`: `success: true`, 1987 total, 0 failed, 0 pending, 0 todo. Base (scratch `git archive` with the base test): 59 files, 1987 tests, equal.
- Skip count (`--reporter=json`, heap 128): **0**. `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`, exit 0.
- `CLI_DEEP` (heap 400): exit 0, **11/11**, 6 children, 0 lane leftovers under the private TMPDIR.
- `PERFT_DEEP` (heap 400): exit 0, 32/32.
- **UAT waiver** (AGENTS.md form): `git diff --name-only ccccc6bb acb52edf | grep -v '\.test\.ts$' | grep '^src/'`: empty (grep exit 1). Same for `acb52edf~1..acb52edf`. `.snap` changes: none. Diff: 1 file, +35/−11.
- **A4:** `grep -c AR-162-FALLBACK` = 4 at tip; 0 at `e68962d6` (exit 1).
- **A5:** `grep -nE 'no .?data/|holds no|fresh, empty'` exits 1 at tip; at `e68962d6` it prints :48, :443, :476.
- **A6:** `git diff --name-only` = `src/cli.real-engine.test.ts` only. `grep -cF` at tip: `mkdtempSync(` 2, `removeCopy(` 3, `rmSync(` 1, `spawnReal(` 5, all equal to base.
