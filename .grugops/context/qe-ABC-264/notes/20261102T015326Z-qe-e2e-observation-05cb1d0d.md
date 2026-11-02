---
id: 20261102T015326Z-qe-e2e-observation-05cb1d0d
kind: observation
by: qe-e2e
at: 2026-11-02T01:53:26Z
verified_by: 
confidence: high: every gate ran as stated under the lock; G6 graded by the PREREG rule (grade56.mjs)
refs:
  - qe-ABC-264
  - ABC-264
  - ADR-0059
  - ADR-0050
  - ADR-0026
  - ADR-0028
  - EPIC-011
  - EPIC-008
  - NFR-004
  - NFR-005
  - NFR-008
  - ABC-086
  - ABC-229
  - ABC-230
  - grugops/ABC-264
  - grugops/qe-ABC-264
  - 358b5f4a
  - 0b73f51d
  - 4e6a59ee
  - src/search.reverse-futility.test.ts
  - QE-264-a
  - QE-264-b
  - QE-264-c
  - QE-264-d
  - QE-264-e
  - 20261102T011645Z-qe-e2e-decision-4e787c10
  - se-ABC-264/20261102T010954Z-software-engineer-observation-470e5bf6
  - se-ABC-264/20261102T010954Z-software-engineer-observation-d18a94a0
  - se-ABC-264/20261102T010954Z-software-engineer-decision-1fad1ebe
supersedes: 
seal: sha256:566e13c661eeb4a8d2326dc29fbc4e2c0720c744a4daebe35dd214a5ffbcf39d
---

# qe-ABC-264 gates (part 1): lint/typecheck/build 0; npm test 2 403/2 403 x3; skips 0, integrity and inventory clean; G1 54/58; G5 MET (max 4 001.2 ms, 0 > 5 000; engine lane 78/78); G6 MET graded (kiwipete 9 = 9, position-6 11 > 10, min 8); G8 head median 9.18 s; G9 empty; G11 same move at all five; 7 deep lanes green

QE/E2E, task `qe-ABC-264`, at `358b5f4a` (worktree = branch tip `4e6a59ee` + QE records; `src/` byte-equal to `358b5f4a`), base `0b73f51d`, PREREG `…4e787c10`. Every run under `flock host-test.lock`; local vitest, never npx.

- **Mandatory:** `npm run lint` 0 (132 files, no fixes); `npm run typecheck` 0; `npm run build` 0 (`dist/` removed after).
- **npm test x3 (graded session) and G8**, order b h h b b h, `npm test` as spelled, 0 foreign vitest and load1 <= 8 before each:

  | run | tree | rc | tests | wall | load1 before/after |
  |---|---|---|---|---:|---|
  | 1 | base | 0 | 2 376 passed | 8.88 s | 2.36 / 2.33 |
  | 2 | head | 0 | **2 403 passed** | 8.97 s | 2.33 / 2.36 |
  | 3 | head | 0 | **2 403 passed** | 9.19 s | 2.36 / 2.46 |
  | 4 | base | 0 | 2 376 passed | 8.57 s | 2.46 / 2.63 |
  | 5 | base | 0 | 2 376 passed | 8.83 s | 2.63 / 2.76 |
  | 6 | head | 0 | **2 403 passed** | 9.18 s | 2.76 / 2.78 |

  **G8 MET:** head median **9.18 s** <= 10 s (base 8.83 s; +0.35 s, the 27 new rows). Two earlier G8 sessions were voided by QE's own scratch base tree lacking records the `qe-hop-integrity` test reads (base 2 344 and 2 365 passed); head was 2 403/2 403 in all six of those runs too (walls 8.97-9.39 s). Not counted.
- **Skips:** 0 (`vitest --reporter=json`, pending + todo). `test-skip-integrity.js --skip-count 0`: "No findings." (rc 0). `lane-inventory.js`: "The lane collects 64 test files; git tracks 64. No findings." (rc 0).
- **G9:** `git diff 0b73f51d 358b5f4a -- src/levels.ts` is 0 bytes. **G10:** one fixture re-pin (`ABC-086` A6), justified in the rows note; no level moved. **G7:** not owed (`ADR-0059` § Consequences; the diff adds no structure held between nodes).
- **G1:** `PUZZLE_DEEP=1` 18/18: "PUZZLES shipped: solved **54/58**, baseline 54/58", no NEWLY line.
- **Deep lanes** (exit 0 each): SEARCH_DEEP `search.reverse-futility` 35/35 (32 s), `search.null-move` 44/44 (28 s), `search` 57/57, `quiescence` 116/116 (48 s; the re-pointed `ABC-229` rows), `search.pvs-lmr` 29/29 (54 s); ENGINE_DEEP `engine` **78/78** (178 s; A1 real clock worst kiwipete/a1c1 4 002 ms at depth 11, 9/30 over 4 000 ms, all under the 5 s ceiling); PUZZLE_DEEP 18/18. Not run: `uci-session` (no search value row, SE green), the Levels lane (A6, owner-gated).
- **G6, graded** (EPIC-008 row as read 2026-10-25, owner word `…2ae5fc12`): 5 interleaved rounds, fresh process per search, `chooseMove` at `LEVELS[5]` = 4 000 ms real clock on both builds, wait-clear before every read, session 01:41:02Z-01:51:21Z:

  | board | base depths | head depths | median B / H | min |
  |---|---|---|---|---|
  | kiwipete | 8 9 8 9 9 | 9 9 9 9 9 | **9 / 9** | 8 |
  | position-6 | 10 10 10 10 10 | 11 11 11 11 11 | **10 / 11** | 10 |

  **G6 MET** ("≥ base" on both; no run below 6, 0 WARN below 7). Median nodes base / head: kiwipete 3 466 989 / 3 347 181, position-6 3 510 043 / 3 277 595.
- **G5: MET.** 30 real-clock reads (20 G6 + 10 G11): max `chooseMove` wall **4 001.2 ms**, 0 over 5 000 ms; reported against 4 000 ms: 20 of 30 ended 0-1.2 ms past it, as every recent 4 s read has. Plus the ENGINE_DEEP engine lane's real-clock rows green.
- **G11 (reported, not graded)**, level-5 choice at 4 000 ms, base -> head: 4.Qa4 d3 d11 56 -> d3 d11 56; 8.e5 Be2 d9 62 -> Be2 d9 69; 10.Ne4 exd6 d10 5 -> exd6 d11 1; 13.d4 d4 d11 -109 -> d4 d12 -181; 17.Kc1 Kc1 d11 -215 -> Kc1 d11 -215. Same move at all five; head one ply deeper at 10.Ne4 and 13.d4.
- **N8-LANE (reported):** the new file's default rows ride inside the 9.18 s head median; its deep rows take 32 s.
