---
id: 20261021T131020Z-software-engineer-observation-3064660f
kind: observation
by: software-engineer
at: 2026-10-21T13:10:20Z
verified_by: 
confidence: high
refs:
  - ABC-183
  - AR-180-VALIDATED
  - AR-162-FALLBACK
  - ABC-180
  - ABC-095
  - grugops/ABC-183
  - 7bd2b54f
  - 19abbdb1
  - src/cli.real-engine.test.ts
  - plans/tickets/ABC-183-a7-pins-that-the-decoy-is-written-before-the-booked-spawn.md
  - NFR-008
  - N8-LANE
supersedes: 
seal: sha256:dab435a55db5e89120fe8aadca58ac43a019cafe021aeb309d31d8a42906003f
---

# ABC-183 A1, A2, A5 counts and the gates on 7bd2b54f

- **A1:** `grep -B1 -F 'booked = spawnReal(' src/cli.real-engine.test.ts` first line: `decoyBeforeBooked = existsSync(join(neutral, BOOK_PATH));` (base: `bookless = spawnReal(copy, QUIT_TWICE);`).
- **A2:** `grep -c 'AR-162-FALLBACK'` base **4**, head **6** (the doc comment and the assertion message).
- **A3:** `grep -B3 -F 'writeFileSync(join(neutral, BOOK_PATH)'` shows the `ABC-183` `//` line at -2.
- **A5 grep -cF, base → head:** `spawnReal(` 5 → 5; `mkdtempSync(` 2 → 2; `removeCopy(` 3 → 3; `rmSync(` 1 → 1; `writeFileSync(` 1 → 1; `existsSync(` 5 → 6. `grep -cE '^\s*it\('` 11 → 11.
- **A5 lines above :440:** `git diff -U0 19abbdb1 7bd2b54f` hunks start at base lines 452, 458, 461, 492 — none above 440.
- **A5 files:** `git diff --name-only 19abbdb1 7bd2b54f` = `src/cli.real-engine.test.ts` only. Waiver form `… | grep -v '\.test\.ts$' | grep '^src/'` = empty. `.snap` changes: none.
- **Gates on 7bd2b54f (worktree):** lint (biome, 116 files, no fixes) PASS; typecheck PASS; build PASS; `npm test` 59 files / 1987 tests passed, 0 skipped, `.test-results/last-run.json` success true (base copy: 59 / 1987); skip-integrity `--skip-count 0` "No findings." exit 0; `CLI_DEEP` 11/11; `PERFT_DEEP` 32/32.
- **Children:** `CLI_DEEP` with `--reporter=verbose` prints 6 `[CLI_DEEP] (cwd …)` lines at base and 6 at head (default reporter hides passing-test stdout, so it prints 0 on both).
- No timing taken or reported.
