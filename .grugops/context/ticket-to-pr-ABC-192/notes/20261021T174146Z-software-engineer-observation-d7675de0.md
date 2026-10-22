---
id: 20261021T174146Z-software-engineer-observation-d7675de0
kind: observation
by: software-engineer
at: 2026-10-21T17:41:46Z
verified_by: 
confidence: high (scratch copies outside the repository, private TMPDIR, each file restored and cmp-checked)
refs:
  - ABC-192
  - QE-176-a
  - QE-176-b
  - M4
  - M4b
  - grugops/ABC-192
  - 5d1fbaa7
  - 47a3c9a1
  - tools/grugops/heap-guard.js
  - src/cli.test.ts
  - .grugops/context/qe-ABC-176/notes/20261021T164420Z-qe-e2e-observation-fbdf5a60.md
supersedes: 
seal: sha256:6256c1ad347058dfd5039a442ecd959e4a9db3eb44b614675eda7a948dfe2384
---

# ABC-192 red-first readings: M4, M4b and a vitest 4.1.12 bump each turn exactly the new row red, one-file and under npm test; the unmutated control is green

Scratch copies under this session's scratchpad (never a worktree). Mutants by `sed` on the scratch `tools/grugops/heap-guard.js` line 94; the bump by editing only the scratch `node_modules/vitest/package.json` (4.1.11 → 4.1.12). After each: restored from a saved original, `cmp` clean.

**One-file, `NODE_OPTIONS=--max-old-space-size=400 … vitest run src/cli.test.ts -t "ABC-192"`** (base `47a3c9a1` + the tip's `src/cli.test.ts`):
| build | exit | result | failing row / message |
|---|---|---|---|
| control | 0 | 2 passed | — |
| M4 `process.stderr` | 1 | 1 failed, 1 passed | A1: `guard(…)'s arguments are [project, v8.getHeapStatistics(), process.stderr], not (…, …, process.stdout)` |
| M4b `{ write() {} }` | 1 | 1 failed, 1 passed | A1: `… [project, v8.getHeapStatistics(), { write() {} }] …` |
| vitest 4.1.12 | 1 | 1 failed, 1 passed | A2: the four-item re-run list, then `expected '4.1.12' to be '4.1.11'` |

**Suite, `npm test`** (`git archive 5d1fbaa7` + a full real copy of `node_modules`):
| build | exit | files | tests | last-run.json success | failed row |
|---|---|---|---|---|---|
| control | 0 | 59 passed | 1994 passed | true | — |
| M4 | 1 | 1 failed / 58 | 1 failed / 1993 | false | ABC-192 A1 |
| M4b | 1 | 1 failed / 58 | 1 failed / 1993 | false | ABC-192 A1 |
| vitest 4.1.12 | 1 | 1 failed / 58 | 1 failed / 1993 | false | ABC-192 A2 |

At base (before the rows) M4 survives the suite: QE's reading `…fbdf5a60`, not re-run.

**A scratch artefact, recorded so nobody chases it:** a first layout copied only `vitest` and symlinked the rest of `node_modules`. That gave 23 `toMatchSnapshot` failures ("snapshot state … is not found") in render.test.ts and status-panel.test.ts in the unmutated control too: two vitest module instances. A full copy removed them. The mutant deltas were identical in both layouts.
