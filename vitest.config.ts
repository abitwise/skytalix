import { defineConfig } from "vitest/config";

/**
 * The default test lane's runner configuration.
 *
 * Governed by `memory-bank/50-decisions/ADR-0008-default-test-lane-budget.md`; the lane's
 * budget is `NFR-008` in `plans/nfr-catalog.md` (<= 3 s wall AND <= 13 s CPU, ratified
 * 2026-08-11 by Olger Oeselg). Created 2026-08-13 by Architect/Design at `ABC-026`
 * (`A4` adoption + `A5` placement). There was no `vitest.config.*` in this project before.
 *
 * NOTE FOR THE NEXT ENGINEER: this file is outside `tsconfig.json`'s `include` and outside
 * `biome.json`'s `files.includes`, so NEITHER `npm run typecheck` NOR `npm run lint` reads it.
 * A mistake here is caught only by `npm test` actually running. Verified 2026-08-13.
 *
 * ===========================================================================================
 *  READ THIS BEFORE YOU TURN ISOLATION OFF.
 *  It is the cheapest-looking change on this lane and it silently disarms three of this
 *  project's own instruments. You are standing exactly where that change gets made.
 * ===========================================================================================
 *
 * `isolate: false` (a.k.a. `--no-isolate`) saves 30.7-36.5% of lane CPU. That is by far the
 * largest saving available anywhere on this lane - larger than every test-content saving
 * anyone has proposed, combined. IT IS NOT AVAILABLE:
 *
 *   full lane, --no-isolate            GREEN in 4 of 21 observed runs
 *   THE FIRST OBSERVED RUN WAS GREEN   <- a single-run adoption was available, and would
 *                                         have shipped this
 *   the ONLY files that ever fail      src/zobrist.nfr.test.ts  NFR-005's call-count sub-bar
 *                                      src/gameend.nfr.test.ts  NFR-001's three gameStatus bars
 *                                      src/san.nfr.test.ts      ABC-025's five N1 rows
 *   same tree, those files removed     GREEN 6 of 6
 *
 * Those files spy on CALL COUNTS. They work because every test file gets a fresh module
 * registry. `isolate: false` shares one registry across files in a worker, so a spy installed
 * by one file lands after another file has already imported the module under test - the
 * captured failure was `expected "hasLegalEnPassant" to be called 1 times, but got 0 times`.
 *
 * So: the lane's dominant cost is buying exactly the module-registry isolation this project's
 * guards depend on. No guard is under suspicion and no test is proposed for deletion. The
 * price is recorded here so that nobody rediscovers the lever, watches one run go green, and
 * takes it. GREEN RUNS ARE NOT THE EVIDENCE THAT SETTLES THIS ONE - a mechanism is.
 *
 * -------------------------------------------------------------------------------------------
 * `pool: "threads"` below is NOT that lever, and the distinction is the whole reason it was
 * adoptable while `isolate: false` is not.
 *
 *   - `isolate` stays at its default `true`. Per-file module-registry isolation is RETAINED,
 *     so the mechanism that breaks the three files above is not present here.
 *   - What threads DOES share is the process. Measured 2026-08-13 on an ARMED probe: a test
 *     file that mutates `process.env` and `process.stdout.isTTY` is NOT observed by a sibling
 *     test file running concurrently in another worker (6 of 6 green), while the identical
 *     assertion goes RED when the mutation and the read share a worker. tinypool does not pass
 *     `SHARE_ENV`, so each worker gets its own `process.env` copy. This matters because
 *     `src/glyph-mode.test.ts` really does mutate both.
 *   - Measured saving, paired and interleaved, two independent samples: -7.3% / -7.7% CPU and
 *     -14.1% / -23.1% wall, sign 0/8 on all four. It also lowers the per-file CPU slope from
 *     158.2 to 138.9 ms/file (-12.2%), so it is not purely a one-time discount.
 *   - Screened before adoption: 24 CONSECUTIVE green runs, 807/807 tests on 28 files, and all
 *     SEVEN `*.nfr.test.ts` files passing in every one. (`ADR-0008` Decision 8 says "all four";
 *     four was the correct census on 2026-08-10 and three more landed 2026-08-11. Read it as
 *     EVERY `*.nfr.test.ts` file.)
 *   - 24 of 24 green bounds the failure rate at roughly 12.5%, NOT at zero. If this lane starts
 *     flaking, delete this file first - that is the whole rollback - and say so on the ticket.
 */
export default defineConfig({
  test: {
    pool: "threads",
    /**
     * Vitest's default `exclude` is REPLACED, not extended, when you set this key - so the
     * stock entries (`node_modules`, `dist`, `.idea`, `.git`, `.cache`) are repeated here by
     * hand. Drop one and it comes back into the lane.
     *
     * The rest are this repo's non-source directories. `.claude/worktrees/` is the one that
     * actually bites: each live agent worktree is a FULL checkout of this project, so the
     * default glob collected 1191 extra `*.test.ts` files - the whole suite, once per
     * worktree - on top of the 28 real ones. `coverage/` is vitest's own output, and
     * `memory-bank/`, `plans/`, `.grugops/`, `.github/`, `.gemini/` are docs and factory
     * state that may carry illustrative code.
     */
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.idea/**",
      "**/.git/**",
      "**/.cache/**",
      ".claude/**",
      ".gemini/**",
      ".github/**",
      ".grugops/**",
      "coverage/**",
      "memory-bank/**",
      "plans/**",
    ],
  },
});
