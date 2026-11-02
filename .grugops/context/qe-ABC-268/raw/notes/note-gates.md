# qe-ABC-268 gates (part 1): lint/typecheck/build 0; npm test 2 407/2 407 x3; skips 0, integrity and inventory clean; G1 54/58 no NEWLY; G5 MET (max 4 001.3 ms, 0 > 5 000; engine lane 78/78); G6 MET graded (kiwipete 9 = 9, position-6 10 = 10, min 9, 0 WARN); G8 head median 9.00 s; G9 empty; G11 same move at all five; 7 deep lanes green

QE/E2E, task `qe-ABC-268`, at `df984484` (worktree `src/` byte-equal), base `ca6e8506`, PREREG `…fae528bd`. Every run under `flock host-test.lock`, one at a time; local vitest, never npx. Raw in `raw/gates/`, `raw/deep/`, `raw/g6/`.

- **Mandatory:** `npm run lint` 0 ("Checked 132 files … No fixes applied."); `npm run typecheck` 0; `npm run build` 0 (`dist/` removed after).
- **npm test x3 (graded) and G8**, order b h h b b h, `npm test` as spelled, 0 foreign vitest and load1 <= 8 before each:

  | run | tree | rc | tests | wall | load1 before/after |
  |---|---|---|---|---:|---|
  | 1 | base | 0 | 2 376 passed | 8.48 s | 0.50 / 0.73 |
  | 2 | head | 0 | **2 407 passed** | 9.00 s | 0.73 / 1.30 |
  | 3 | head | 0 | **2 407 passed** | 9.00 s | 1.30 / 2.01 |
  | 4 | base | 0 | 2 376 passed | 8.71 s | 2.01 / 1.93 |
  | 5 | base | 0 | 2 376 passed | 8.86 s | 1.93 / 1.94 |
  | 6 | head | 0 | **2 407 passed** | 9.11 s | 1.94 / 2.10 |

  **G8 MET:** head median **9.00 s** <= 10 s (base 8.71 s; +0.29 s for the 31 new default rows). N8-LANE: the new file's default rows ride inside that median; its deep rows took 64 s.
- **Skips:** 0 (`vitest --reporter=json`, pending + todo). `test-skip-integrity.js --skip-count 0`: "No findings." (rc 0). `lane-inventory.js`: "The lane collects 64 test files; git tracks 64. No findings." (rc 0).
- **G9:** `git diff ca6e8506 df984484 -- src/levels.ts` is 0 bytes. **G10:** no level reddened, no fixture re-pinned. **G7:** not owed (`ADR-0061` § Consequences).
- **G1:** `PUZZLE_DEEP=1` 18/18: "PUZZLES shipped: solved **54/58**, baseline 54/58", no NEWLY-MISSED and no newly solved line.
- **Deep lanes** (exit 0 each): SEARCH_DEEP `search.futility` **47/47** (64 s), `search.null-move` 44/44 (28 s), `search` 57/57, `quiescence` 116/116 (48 s), `search.pvs-lmr` 29/29 (54 s); ENGINE_DEEP `engine` **78/78** (178 s; A1 real clock worst startpos/g1h3 4 001 ms at depth 11, 10/30 over 4 000 ms, all under 5 s); PUZZLE_DEEP 18/18. Not run: `uci-session` (no search value row; SE green), the Levels lane (A6, owner-gated).
- **G6, graded** (EPIC-008 row as read 2026-10-25, owner word `…2ae5fc12`; qe-ABC-264's harness unchanged): 5 interleaved rounds, a fresh process per search, `chooseMove` at `LEVELS[5]` = 4 000 ms real clock on both builds, wait-clear before every read, session 18:41:21Z-18:50:55Z:

  | board | base depths | head depths | median B / H | min |
  |---|---|---|---|---|
  | kiwipete | 9 9 9 9 9 | 9 9 9 9 9 | **9 / 9** | 9 |
  | position-6 | 10 10 10 10 10 | 10 10 10 10 10 | **10 / 10** | 10 |

  **G6 MET** ("≥ base" on both; no run below 6; 0 WARN below 7). Median nodes base / head: kiwipete 3 522 285 / 3 515 117, position-6 3 526 427 / 3 425 051. Said plainly: at 4 s the head reached no deeper median on either board (INFO `QE-268-f`).
- **G5: MET.** 30 real-clock reads (20 G6 + 10 G11): max `chooseMove` wall **4 001.3 ms**, 0 over 5 000 ms; reported against 4 000 ms: 19 of 30 ended 0-1.3 ms past it, as every recent 4 s read has. Plus the ENGINE_DEEP engine lane's real-clock rows green. No new throw site in the diff (read).
- **G11 (reported, not graded)**, level-5 choice at 4 000 ms, base -> head: 4.Qa4 d3 d11 56 -> d3 d11 56; 8.e5 Be2 d9 62 -> Be2 d9 62; 10.Ne4 exd6 d10 5 -> exd6 d10 5; 13.d4 d4 d11 -109 -> d4 d12 -173; 17.Kc1 Kc1 d11 -215 -> Kc1 d11 -215. Same move at all five; head one ply deeper at 13.d4.
- **R-TC part 1 item 2 (read at review, for A6's record):** the diff reads no budget, deadline, `movetime`, test flag or environment; the rule is keyed on depth, ply, the entry window, the move and the position only.
