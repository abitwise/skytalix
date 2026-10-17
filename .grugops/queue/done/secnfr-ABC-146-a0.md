---
done_at: 2026-10-17T19:12:30Z
branch: grugops/ABC-146-ladder-verdict (worktree ../wt-ABC-146; base main eb216351 = brief's 13897307 + one plans/board.md-only commit)
tip: c639a220 (pre-registration 1e2cae9f before the first graded run; reading c639a220; notes + probe + raw only)
result: A0 READ, ROUTE V. F_hi 1.006 <= 1.30.
  - Workload as in ...70684a78: chooseMove(start, 4000 ms, virtualClock(120)), one call per fresh process, no warm-up, graded wall = performance.now() around the call. 5 interleaved pairs (odd pairs node first). vitest arm = the repo's vitest.config.ts unedited, probe dir as --root.
  - 10/10 node counts equal: 29717 (depth 5, score 55, digest 398995d95a12e6e6 on all 10). Not 70684a78's 145765: engine changed since (ABC-121, ABC-083). The page's bar is equality.
  - Ratios (vitest / node): 0.920, 0.946, 1.006, 1.004, 0.954. Median F 0.954, F_hi 1.006. Projection 10 h x 1.006 ~ 10.1 h.
  - Window 2026-10-17T19:11:07Z..19:11:15.8Z, attempt 1, 0 voided windows. A foreign vitest (another project, /Users/olgeroeselg/Projects/public/grugops) ran from before 18:39Z; the driver held until 180 s after it was gone. Not touched.
  - load1 4.92 (pairs 1-2), 5.01 (pairs 3-5). Thermal pressure level 0 before and after all 10 runs. ON BATTERY for every run. Apple M3 Mac15,13.
  - node v26.11.1, vitest 4.1.11.
  - Staleness inputs at eb216351: vitest.config.ts md5 2d2b6379... unchanged since 1671f24f (threads, maxWorkers 2, viteModuleRunner false); package.json and package-lock.json unchanged; PUZZLE_DEEP trigger list, src/levels.ts and src/virtual-clock.ts untouched in 1671f24f..eb216351; src/ladder.test.ts md5 bba67b75... = 1031911b.
  - Verdict run NOT started (the Orchestrator's). A7 (ADR-0038 headings + second addendum on route V) owed to Architect/Design before any verdict number.
  - 0 src/, 0 tools/ lines. plans/traceability.md and plans/board.md NOT touched; the trace row is in the handoff. Decision .grugops/context/secnfr-ABC-146-a0/notes/...-f1558f02 (pre-registration ...-107ff1bf).
