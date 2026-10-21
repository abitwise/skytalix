---
id: 20261021T101010Z-qe-e2e-observation-a1cbb8a6
kind: observation
by: qe-e2e
at: 2026-10-21T10:10:10Z
verified_by: 
confidence: high
refs:
  - ABC-183
  - AR-180-VALIDATED
  - AR-162-FALLBACK
  - grugops/ABC-183
  - c4c6d36e
  - 7bd2b54f
  - 19abbdb1
  - 59fc9215
  - grugops/qe-ABC-183
  - src/cli.real-engine.test.ts
  - plans/tickets/ABC-183-a7-pins-that-the-decoy-is-written-before-the-booked-spawn.md
  - AGENTS.md
  - .test-results/last-run.json
  - NFR-008
supersedes: 
seal: sha256:459eaa26ada65d0a3f93285dcaadd05260275793fb4a61238c9faad3b616a10d
---

# ABC-183 A1, A2, A3 and A5 read by QE, and the gates on c4c6d36e: all MET

- **A1:** `grep -B1 -F 'booked = spawnReal('` prints `decoyBeforeBooked = existsSync(join(neutral, BOOK_PATH));` first (`:468`). At base it prints `bookless = spawnReal(copy, QUIT_TWICE);`.
- **A2:**
  - Inside A7's `it` at `:500-503` there is one `expect(decoyBeforeBooked, "AR-162-FALLBACK: the decoy must exist before the booked child spawns, or the detector is disarmed").toBe(true)`.
  - `decoyBeforeBooked` is declared at `:457` in the `ABC-095` `describe` block. It is assigned once (`:468`) and read once (`:501`).
  - `grep -c 'AR-162-FALLBACK'` is 4 at base and **6** at head. One is the doc comment and one is the message.
- **A3:** `:464` reads `// \`ABC-183\`: this write MUST come before the \`booked\` spawn, or a cwd-first read finds nothing.` It is the second of the three lines directly above the `writeFileSync` at `:466`. The `ABC-180` comment line at `:463` is unchanged.
- **A5, files:** `git diff --name-only 19abbdb1 7bd2b54f` is `src/cli.real-engine.test.ts` only. `git diff --stat 59fc9215 19abbdb1 -- src` is empty. The code diff is +11 / -0.
- **A5, UAT waiver (AGENTS.md form, unfiltered, `.snap` not filtered):** empty for `7bd2b54f~1 7bd2b54f`, for `c4c6d36e~1 c4c6d36e`, and for `19abbdb1..c4c6d36e`. No `.snap` changed.
- **A5, `grep -cF` base → head:**
  - `spawnReal(` 5 → 5
  - `mkdtempSync(` 2 → 2
  - `removeCopy(` 3 → 3
  - `rmSync(` 1 → 1
  - `writeFileSync(` 1 → 1
  - `existsSync(` 5 → **6**
  - `grep -cE '^\s*it\('` 11 → 11
- **A5, top of the file:** `head -439` is byte-identical at base and head (`cmp`). The hunks start at base lines 452, 458, 461 and 492.
- **A5, deep lane:** 11 tests and 6 children at base and head.
- **Gates** on `c4c6d36e` in `../wt-qe-ABC-183` (node_modules symlinked), one at a time:
  - lint: biome, 116 files, no fixes, rc 0
  - typecheck: rc 0
  - build: rc 0
  - `npm test` (128 heap): 59 files, **1987/1987**, rc 0. `last-run.json` reads success true, 436 suites, 1987 tests, 0 failed, 0 pending, 0 todo. This equals base (59 / 1987).
  - `test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: "No findings.", rc 0
  - `CLI_DEEP` (400 heap, private TMPDIR): 11/11, rc 0
  - `PERFT_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/perft.test.ts`: 32/32, rc 0
- **NFR-008:** 0 new files, tests, spawns or `mkdtemp`s.
- No timing taken.
