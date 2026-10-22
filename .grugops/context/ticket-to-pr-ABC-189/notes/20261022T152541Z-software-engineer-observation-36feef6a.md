---
id: 20261022T152541Z-software-engineer-observation-36feef6a
kind: observation
by: software-engineer
at: 2026-10-22T15:25:41Z
verified_by: 
confidence: high
refs:
  - ABC-189
  - AR-168-BINPIN
  - QE-168-b
  - ABC-042
  - ABC-168
  - EPIC-007
  - grugops/ABC-189
  - deb555d2
  - 823a9885
  - src/cli.test.ts
  - plans/tickets/ABC-189-nothing-pins-the-value-of-package-json-bin-so-bin-pointing-at-src-uci-ts-passes-every-test.md
supersedes: 
seal: sha256:2cd2ac9f4ed689118ba1db95a8105d3930c9542097a3300cb6acac21d0f7382c
---

# ABC-189 gates and fence at tip deb555d2 (worktree ../wt-ABC-189, node_modules symlinked)

- `npm run lint` rc 0 (119 files, no fixes). `npm run typecheck` rc 0. `npm run build` rc 0.
- `npm test` rc 0: 60/60 files, 1995/1995 tests. `.test-results/last-run.json` success true, failed 0, pending 0, todo 0.
  This equals the base count (60/1995); 0 rows added.
- Skip-count capture, run as spelled (heap 128): 0. `test-skip-integrity.js .grugops/test-skips.md --skip-count 0` prints `No findings.`, rc 0.
- ABC-187 A5 closer-count script on AGENTS.md prints **9**, unchanged (AGENTS.md is not touched).
- A1: `grep -c 'AR-168-BINPIN' src/cli.test.ts` gives 1 (base 0). `grep -c 'skytalix: "dist/uci.js"' src/cli.test.ts` gives 1 (base 0).
- A4: `git diff --name-only main...HEAD` lists `src/cli.test.ts` only. numstat is `1 0`.
- UAT waiver, the owner's form `git -c core.quotePath=false diff --name-only 823a9885 deb555d2 | grep -v '\.test\.ts$' | grep '^src/'`:
  prints nothing (grep rc 1). The `<delivered>~1 <delivered>` reference form also prints nothing. 0 production lines.
- Still owed: the QE hop (QE reads A2 red itself). AR-168-BINPIN closes on QE's red read, not on this note.
