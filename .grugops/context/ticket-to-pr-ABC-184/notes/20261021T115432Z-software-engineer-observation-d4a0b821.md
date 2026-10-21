---
id: 20261021T115432Z-software-engineer-observation-d4a0b821
kind: observation
by: software-engineer
at: 2026-10-21T11:54:32Z
verified_by: 
confidence: high
refs:
  - ABC-184
  - AR-183-CWDARG
  - grugops/ABC-184
  - 5277babd
  - 442d1e57
  - src/cli.real-engine.test.ts
  - plans/tickets/ABC-184-a7-asserts-the-booked-child-spawned-from-neutral.md
  - NFR-008
  - N8-LANE
supersedes: 
seal: sha256:e88e88944e1277ccbb2870dcfa683983bcdb627c096e98f51f2dd71dd0cde98f
---

# ABC-184 SE: criteria A1, A2, A4 and A5 measured base (`5277babd`) vs head (`442d1e57`), and gates green on the tip

- **A1:** `grep -cE '^\s*readonly cwd: string;'` 0 → **1**, inside `interface RealChild` (`:231`). `spawnNode` returns `cwd` (`:268`), the same identifier as the `spawnSync` option (`:247`).
- **A2:** one `expect(booked.cwd, "AR-183-CWDARG: …").toBe(neutral)` in A7's `it` (`:501-504`), above the stderr detector (`:549`). `grep -c 'AR-183-CWDARG'` 0 → **1**; `grep -cF 'booked.cwd'` 0 → **1**.
- **A4:** `grep -B1 -F 'booked = spawnReal('`'s first line is `decoyBeforeBooked = existsSync(join(neutral, BOOK_PATH));` at both base and head.
- **A5 counts, base → head:** `spawnReal(` 5→5, `spawnNode(` 2→2, `mkdtempSync(` 2→2, `removeCopy(` 3→3, `rmSync(` 1→1, `writeFileSync(` 1→1, `existsSync(` 6→6, `it(` 11→11, `expect(` **75→76**.
- **No line above `:223` moves:** the first hunk is `@@ -229,0 +230,2 @@`.
- **A5 fences:** `git diff --name-only 5277babd 442d1e57` = `src/cli.real-engine.test.ts` only. The waiver form (`… | grep -v '\.test\.ts$' | grep '^src/'`) is **empty**, with no `.snap` changes.
- **Gates at `442d1e57`:**
  - lint (biome, 116 files, no fixes) rc 0;
  - **typecheck rc 0**: the page's `UNKNOWN - verify` is now measured, and the interface change typechecks;
  - build rc 0;
  - `npm test` rc 0, **59 files / 1987 tests**. `last-run.json` reads success true, 0 failed, 0 pending, 0 todo. That equals base, which I re-read in a scratch tree byte-identical to `main`: 59 / 1987, success true;
  - skip-integrity `--skip-count 0`: `No findings.`, rc 0.
- **Deep lanes:**
  - `CLI_DEEP` **11/11**, rc 0, **6 children** at head and at base. Children were counted from the `[CLI_DEEP] (cwd …)` lines with `--silent=false --reporter=default`, because under `CLAUDECODE=1` the default run prints no console lines;
  - `PERFT_DEEP` 32/32, rc 0.
