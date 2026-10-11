---
id: 20261011T203648Z-software-engineer-observation-abc152-handoff-what-is-owed-4567b6b5
kind: observation
by: software-engineer
at: 2026-10-11T20:36:48Z
verified_by:
confidence: high
refs:
  - ABC-152
  - ADR-0042
  - RISK-ABC143-01
  - RISK-ABC152-NEGWORKERS
  - RISK-ABC152-A2-GRAPH
  - QE-149-c
  - NFR-008
supersedes:
---

# SE `ABC-152` hand-off: what is owed, by whom, and four things seen and not changed

This note is hand-authored and unsealed.

## Owed

- **QE (`qe-e2e`):**
  - `V2` with its own plants and `M9b`, which is `QE-149-c` (SE's reading: `…7d490dfe`);
  - `V4`'s plants re-earned (SE's 30: `…99dca079`);
  - `V5`–`V8`;
  - the opt-in lanes' walls, as reported (`…ac190931`);
  - `PUZZLE_DEEP=weakened` still exits 1 (SE did not run it);
  - `RISK-ABC152-NEGWORKERS` (`VITEST_MAX_WORKERS=-1` runs nothing and exits 0), which SE did not re-run.
- **Security/NFR:**
  - `V12`'s review: the lockfile diff (+3 / −61 / 20 changed; the list is in `…bff7dfee`), licences, install
    scripts, `npm audit` (dev and `--omit=dev`) at base and head, and `AR-1`. **SE ran no audit.**
  - `V9`–`V11`, the width-1 window, per ruling 6. Base = `main` `91024242` (the build's merge-base). Head =
    `23c5521a` plus whatever the Orchestrator commits on top. Each tree takes its own `npm ci`.
  - **SE took no timing, CPU or heat reading for `V9`–`V11`.** The lane walls in `…ac190931` are `V8`'s report,
    not `V9`/`V10`.
- **Scribe, after the merge:**
  - `AGENTS.md`'s worker-cap line (`VITEST_MAX_THREADS` ≤ 2 → `VITEST_MAX_WORKERS`), the Stack line, the
    `RISK-ABC143-01` line, and the coverage figure's meaning.
  - On 4.x, `coverage.all` is gone. `npx vitest run --coverage` now reads `All files … 99.43` lines over loaded
    files. That is not the "856/856 on 30 files" denominator.
- **Orchestrator:** the board move `In Development → In Review`, and committing this queue record.

## Seen, not changed (outside the admitted content; routed, not fixed)

1. **`vitest/reporters` is deprecated on 4.1.**
   - `npm test` prints one line: `Importing from "vitest/reporters" is deprecated since Vitest 4.1. Please use
     "vitest/node" instead.`
   - It is `RISK-ABC143-01`'s surface 1 drifting. The export is present, so nothing breaks today. It may go in a
     later major, where the import would fail loudly.
   - Owner: Architect (`RISK-ABC143-01` carrier) or a follow-up. The specifier is not ruling 5's.
2. **Three stale comments** describe the pre-rewrite form:
   - the `src/render-seam.test.ts` header ("NO `vi.mock`");
   - the `src/cli.test.ts` header line 5 ("It holds no `vi.mock`");
   - the `tools/opening-book/book.test.ts` D1(f) comment ("doMock + a fresh module registry").

   `V5` admits only the forms' code and ruling 2's one sentence, so they were left. They are comment-only, for
   BA/PM or QE to route.
3. **The `PRODUCTION_DEPS` path has no exact-count guard.** It has only "A2 control" `>= 1`, and that holds on
   base too. The full reading is in `…99dca079`. This is a test gap, and QE grades it.
4. **A foreign vitest process was on the host** during the opt-in lanes: another project's `install/*.test.ts`
   run. It is logged in `…ac190931`.

## Rollback

The rollback is the addendum's. This branch adds nothing that it does not cover.
