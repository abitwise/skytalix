---
id: 20261019T140100Z-ba-pm-observation-abc146-a0-already-stale-on-main-and-pins-the-shape-missed-8b2d4e60
kind: observation
by: ba-pm
task: bapm-adr0045-cut
at: 2026-10-19T14:01:00Z
verified_by:
confidence: high
refs:
  - ABC-146
  - ABC-175
  - ABC-174
  - ADR-0045
  - ABC-169
  - ABC-170
  - ABC-061
  - .grugops/context/secnfr-ABC-146-a0/notes/20261017T191132Z-security-nfr-decision-abc146-a0-factor-reading-fhi-1006-route-v-f1558f02.md
  - .grugops/context/qe-ABC-146-166/notes/20261019T091800Z-qe-e2e-observation-abc146-abc166-criteria-staleness-and-record-order-8d3f2b60.md
---

# ABC-146 A0 is already STALE on main by its own rule; ADR-0045 D6.5's "A0 stays current" does not hold

This note is hand-authored and unsealed. It records read-only `git` and `md5` reads at `main` `6fc32150`. Nothing was
run or timed.

- `git diff --name-only eb216351 6fc32150 -- vitest.config.ts package.json package-lock.json src/engine.ts 'src/search*.ts' 'src/evaluate*.ts' src/quiescence.ts src/transposition.ts src/levels.ts src/virtual-clock.ts src/ladder.test.ts`
  prints these files:
  - `package.json`: `b3fecb1b`, ABC-169, `+ "license": "UNLICENSED"`;
  - `src/engine.ts`: `e29f7951`, ABC-170, optional `maxDepth` / `maxNodes`;
  - `src/evaluate.ts`: ABC-169, an attribution comment only.
- `A0`'s staleness inputs (`…f1558f02`) name `package.json` and the PUZZLE_DEEP engine list. So **`A0` is stale by
  rule**, independent of ABC-173 and ABC-174. QE-146-a already recorded the *verdict's* staleness from the same
  commits. This note is about `A0`, which picks the route.
- `md5 -q vitest.config.ts` = `2d2b6379dca047103493ab0bd9b10480` and `md5 -q src/ladder.test.ts` =
  `bba67b75565b4f4a2e8d231e8bcd6b2e`. Both are unchanged since `eb216351`.
- **Consequence:** ABC-175 `A1` requires the `A0` re-take, or the owner's route-N word. BA/PM does not waive it.
  For Architect/Design, a dated line on ADR-0045 D6.5 is optional. It is not edited here (status and fold lines only).
- **Pins the Architect's shape did not list**, read at `6fc32150` / `9ae31679`:
  - the `ABC-061` A2/A3 rows (`difficulty: 3` ×7, `src/cli.test.ts:1319-1386`);
  - `levelTime`'s `level <= 2` selector (`src/uci-session.test.ts:647`);
  - the `:719` read-back;
  - the `:44` comment.
  The rows the shape listed at 211–212, 284–285, 412, 448 and 453 keep their value (3 000 ms at the default); only
  their label text moves.
