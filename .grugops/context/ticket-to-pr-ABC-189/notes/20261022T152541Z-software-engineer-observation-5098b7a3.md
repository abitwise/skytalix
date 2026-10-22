---
id: 20261022T152541Z-software-engineer-observation-5098b7a3
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
seal: sha256:60f2457311e38973b7c35602e72619ad4d2c925814f3a1da26477394bb58df80
---

# ABC-189 red first: scratch exports, full copied `node_modules`, `vitest run src/cli.test.ts -t "A10 — package.json"`, heap 400

Exports are `git archive <sha> | tar -x`, with `node_modules` copied in (`cp -a`, not a symlink). The mutants were made by
`sed` on the export's `package.json` only. The real worktree `package.json` was never edited. `cli.test.ts` has 95 tests, 1 selected.

| sha | package.json bin | result | rc |
|---|---|---|---|
| base 823a9885 | real dist/uci.js | 1 passed / 94 skipped | 0 |
| base 823a9885 | (iv-b) src/uci.ts | 1 passed / 94 skipped (the gap) | 0 |
| base 823a9885 | (iv-a) dist/cli.js | 1 passed / 94 skipped | 0 |
| tip deb555d2 | real dist/uci.js | 1 passed / 94 skipped | 0 |
| tip deb555d2 | (iv-b) src/uci.ts | 1 failed: `package.json bin (AR-168-BINPIN): expected { skytalix: 'src/uci.ts' } to deeply equal { skytalix: 'dist/uci.js' }` | 1 |
| tip deb555d2 | (iv-a) dist/cli.js | 1 failed: `… expected { skytalix: 'dist/cli.js' } to deeply equal { skytalix: 'dist/uci.js' }` | 1 |

Full suite (`npm test`):
- base (iv-b): 60/60 files, 1995/1995 tests pass, rc 0, `last-run.json` success true. Every test passes.
- tip (iv-b): 1 failed / 59 passed files, 1 failed / 1994 passed tests, rc 1, `success` false. The only failure is A10 on the new assertion.
