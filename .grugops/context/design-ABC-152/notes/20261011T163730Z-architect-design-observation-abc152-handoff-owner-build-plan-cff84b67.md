---
id: 20261011T163730Z-architect-design-observation-abc152-handoff-owner-build-plan-cff84b67
kind: observation
by: architect-design
at: 2026-10-11T16:37:30Z
verified_by:
confidence: high
refs:
  - ABC-152
  - ABC-149
  - ABC-151
  - ADR-0042
  - plans/traceability.md
  - plans/nfr-catalog.md
supersedes:
---

# `ABC-152` design hop: hand-off, the owner's questions, the build plan for each option, artifacts

This note is hand-authored and unsealed.

## Board (the Orchestrator's move)

- **Recommended:** `ABC-152` waits in `In Design` (or Blocked) on the owner's `D4` pick.
- **Not `Ready for Dev`** until he picks option (1). Under option (2) it closes at the ruling, as `ABC-150` did.

## Owner questions (via the Orchestrator)

1. **Q1, `D4`:** (1) ship vitest 4.1.11 with the runner on (no CPU by this ruling), or (2) stay on 3.2.7.
2. **Q2:** is R3, which was named after `A1`'s reading, inside your "yes"? It is
   `vi.fn(legalMoves)` → `vi.fn((...a) => legalMoves(...a))` at 2 sites in `command-input.test.ts`, with
   `expect` 295 → 295. Option (1) needs it.
3. **Q3, information:** the runner-off CPU would need R-3 content beyond your "yes":
   - R4: 8 files, 33 imports;
   - R5: 2 files, 7 factories;
   - `san.test.ts` A20's assertion;
   - `book.test.ts` A2's premise.

   That reached 1739 / 1740 in scratch, never plant-checked. It would be a new ticket.

## Build plan if option (1) is picked (Software Engineer, after `ABC-149` and `ABC-151` merge)

1. `package.json` devDependencies: `vitest ~4.1.11`, `@vitest/coverage-v8 ~4.1.11`, `vite ~7.3.6`. Then
   `npm install`, with no `--force`. Check: the lockfile delta is ≈ +3 / −61 / 20 changed, and
   `npm ls vitest @vitest/coverage-v8 vite` exits 0 (`V1`).
2. `tools/grugops/result-file-reporter.js`:
   - unhandled errors come from `onTestRunEnd(testModules, unhandledErrors, reason)`;
   - drop `onFinished`;
   - add a load-time check that `writeReport` and `onTestRunEnd` exist, throwing otherwise;
   - update `ABC-149`'s plant block and re-run its six rows by content (`V2`);
   - `ABC-143` `A1`–`A6` hold.
3. `src/command-input.test.ts`: R3 at the two `vi.fn(legalMoves)` sites (`V5`: `expect` counts equal, file and
   test counts equal to base).
4. `src/cli.test.ts`, the `A7` pin (`ADR-0042` d2):
   - the env loop on `VITEST_MAX_WORKERS` ≤ k, and `projects` `undefined`;
   - reds r1, r2, r3 (`VITEST_MAX_WORKERS=8`), r3b (`=k+1`) and r4 (a `projects` entry), each shown red in
     scratch;
   - read k with `probe/resolved-workers-v4.mjs` (`V6`).
5. QE: `V7` 20 runs, `V8` equal path lists, the opt-in lanes and coverage. `PUZZLE_DEEP=weakened` must still
   exit 1. Security: `V12`.
6. BA/PM re-cuts `V3` (dropped) and `V9`–`V11` (no −15 % bar; a no-rise read) on the owner's word, **before**
   the build.

## Build plan if option (2) is picked

None. `ABC-152` closes at `ADR-0042`. `RISK-ABC143-01` stays open, and `ABC-149` still merges on its own value.

## Artifacts (branch `grugops/design-ABC-152`)

- `memory-bank/50-decisions/ADR-0042-…md` (PROPOSED).
- `.grugops/context/design-ABC-152/probe/`:
  - `METHOD.md` (`1530b965`, amendment `f0edb392`);
  - `screen.mjs` and `progress-reporter.mjs`;
  - `f1-rewrites.mjs`, plus `f2-explore.mjs` and `f3-explore.mjs` (post-hoc);
  - `resolved-workers-v4.mjs`;
  - the probes `iso/`, `fnwrap/` and `reset/`;
  - `raw/`.
- `plans/traceability.md` (one row) and `plans/nfr-catalog.md` (one dated line, no row touched).

## Not done, by instruction

No `package.json` or lockfile change on any shared branch, and no timing read. No `src/`, `vitest.config.ts`,
test file or `plans/board.md` edit. No merge, no push.
