---
id: 20261022T190056Z-software-engineer-observation-925c7566
kind: observation
by: software-engineer
at: 2026-10-22T19:00:56Z
verified_by: 
confidence: high
refs:
  - ABC-199
  - QE-198-a
  - ABC-170
  - ABC-167
  - ADR-0046
  - 08d42d01
  - 3d6856db
  - 20261022T172640Z-ba-pm-decision-479ce351
  - 20261022T172634Z-ba-pm-observation-1563f813
  - 20261022T171339Z-qe-e2e-observation-0751bfeb
  - 20261019T153000Z-orchestrator-decision-owner-word-abc173-lighten-rows-keep-cap-6e1d9b47
supersedes: 
seal: sha256:f8c590ad7de0b41134c97b81cc70a1507c9a0075a32163a97877ad611504a1af
---

# ABC-199 A5/A6: diff fence, counts and gates on tip `3d6856db`. Counts and exit codes only, no timing

Software Engineer, task `ticket-to-pr-ABC-199`, 2026-10-22. Worktree `../wt-ABC-199`, own `node_modules` (`npm ci --ignore-scripts`). Base `08d42d01`.

## A5
- `git diff --name-only 08d42d01 3d6856db`: `src/engine.test.ts`, `src/uci-session.test.ts` (numstat 8/1 each). The notes commit adds only `.grugops/context/ticket-to-pr-ABC-199/notes/`.
- `+` lines matching `timeout` (any case): 0. `vitest.config.ts` unchanged.
- Hunks: `@@ -1269 +1269,8 @@ describe("ABC-170 A2 …` and `@@ -363 +363,8 @@ describe("ABC-167 A7 …` — one each, inside the two named describes. Row 3 (`maxNodes: 1`), `LONG_MS`, `tickingClock(1)` and the capped `go depth 3` (step 50) are byte-identical.
- Test names: sorted `ancestorTitles > title` lists from `last-run.json` at base (scratch copy of `08d42d01`) and tip are byte-equal (1 995). Per-file counts equal on all 60 files (`engine.test.ts` 47, `uci-session.test.ts` 126). Row 1's title is unchanged: its floor stays ≥ 5.

## A6 (tip)
- `npm run lint` 0 (119 files, no fixes); `npm run typecheck` 0; `npm run build` 0.
- `npm test` rc 0: 60 files / 1 995 tests passed; `.test-results/last-run.json` newer than the run's start marker, `success: true`, `numFailedTests 0`, pending 0, todo 0. Base `npm test` also 60 / 1 995, success true.
- Skip-count capture (as spelled, heap 128): `0` → `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`, rc 0.
- Coverage, both AGENTS.md forms, 2 runs each: `--coverage` runs 1 and 2, `--coverage --coverage.include='src/**'` runs 1 and 2 — every summary `Tests 1995 passed (1995)`, no failed line, no `timed out`. Classified on the failed count (0), not rc (rc was also 0). The spelled commands carry no JSON reporter, so `numFailedTests` is read from the summary line.
- `ENGINE_DEEP=1 … src/engine.test.ts`: 60 / 60 passed. `UCI_DEEP=1 … src/uci.real-engine.test.ts`: 5 / 5 passed.
- UAT waiver form (`git -c core.quotePath=false diff --name-only <delivered>~1 <delivered> | grep -v '\.test\.ts$' | grep '^src/'`): empty on `3d6856db`; recorded again on the delivered commit in the done record.

## Host
Before each heavy run `pgrep -fl '[v]itest'` showed only a foreign session (`Projects/public/grugops` `scripts/` tests), never `qe-timing-ABC-178`. Once my own shell matched (its command line held `npx vitest`); that was not a timing hop.
