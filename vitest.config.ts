import type { ViteUserConfig } from "vitest/config";

/**
 * The default test lane's runner configuration.
 *
 * Governed by `memory-bank/50-decisions/ADR-0008-default-test-lane-budget.md`; the lane's
 * budget is `NFR-008` in `plans/nfr-catalog.md` (<= 3 s wall AND <= 13 s CPU, ratified
 * 2026-08-11 by Olger Oeselg). Created 2026-08-13 by Architect/Design at `ABC-026`
 * (`A4` adoption + `A5` placement). There was no `vitest.config.*` in this project before.
 *
 * NOTE FOR THE NEXT ENGINEER: this file IS read by both static tools as of `ABC-050`
 * (2026-08-20) — it is named in `tsconfig.json`'s `include` and in `biome.json`'s
 * `files.includes`, so `npm run typecheck`, `npm run build` and `npm run lint` all read it.
 * Until then neither did, and a mistake here was caught only by `npm test` actually running.
 * Keep the two entries: remove either and this file goes back to being guarded by nothing.
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
 *     assertion goes RED when the mutation and the read are in the SAME MODULE. That is the
 *     lever, and it is the only one: `isolate: true` gives every test FILE its own fresh worker
 *     thread (measured as a distinct `threadId` per file), so no arrangement of two FILES
 *     reproduces the red. Corrected at `ABC-050` `A4` - this sentence used to name a
 *     file-against-file arrangement as the red-maker, which is a lever that does not exist.
 *     tinypool does not pass `SHARE_ENV`, so each worker gets its own `process.env` copy. This
 *     matters because `src/glyph-mode.test.ts` really does mutate both.
 *   - Measured saving, paired and interleaved, two independent samples: -7.3% / -7.7% CPU and
 *     -14.1% / -23.1% wall, sign 0/8 on all four. It also lowers the per-file CPU slope from
 *     158.2 to 138.9 ms/file (-12.2%), so it is not purely a one-time discount.
 *   - Screened before adoption: 24 CONSECUTIVE green runs, 807/807 tests on 28 files, and all
 *     SEVEN `*.nfr.test.ts` files passing in every one. (`ADR-0008` Decision 8 says "all four";
 *     four was the correct census on 2026-08-10 and three more landed 2026-08-11. Read it as
 *     EVERY `*.nfr.test.ts` file.)
 *   - 24 of 24 green bounds the failure rate at roughly 12.5%, NOT at zero. If this lane starts
 *     flaking, delete this file first - that is the whole rollback - and say so on the ticket.
 *
 * -------------------------------------------------------------------------------------------
 * `maxWorkers: 2` below is the worker cap ruled by
 * `memory-bank/50-decisions/ADR-0040-the-default-lane-holds-at-most-four-test-workers-pinned-by-value-and-isolation-stays-on.md`
 * (accepted 2026-10-11 with its Window A addendum, `ABC-144`; set to 2 by its addendum 2,
 * `ABC-151`). Without it `vitest run` takes `availableParallelism() - 1` = 7 workers on the
 * reference M3's 8 cores. 2 is THE OWNER'S PICK, FOR HEAT: "Heat 2 workers is fine" (Olger
 * Oeselg, 2026-10-11), answering the moderate thermal pressure `ABC-144` Window B read at 3.
 * Decision 2's rule alone still reads 3 (the largest cap whose Window A reading cut lane CPU by
 * >= 15% with the wall inside 10 s); 2 is eligible under it too, and the owner's word overrides
 * only "largest". It is a fixed integer, not a percentage, so it does not scale with the core
 * count.
 * It is pinned BY VALUE in `src/cli.test.ts` (`ABC-144 A7`): raising it, adding
 * `poolOptions` (whose `maxThreads` silently outranks `maxWorkers`), `fileParallelism: false`
 * or `isolate: false` turns that pin red, and `VITEST_MAX_THREADS` / `VITEST_MAX_FORKS` may
 * lower the cap but never raise it. Changing the number is a ruling, not a drive-by edit.
 * The default export is a plain object (`satisfies ViteUserConfig`, a type-only import) so
 * that the pin's import of this file loads nothing at run time.
 */
export default {
  test: {
    pool: "threads",
    maxWorkers: 2,
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
} satisfies ViteUserConfig;
