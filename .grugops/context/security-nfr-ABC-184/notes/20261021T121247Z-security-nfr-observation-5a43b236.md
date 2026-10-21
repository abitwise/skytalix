---
id: 20261021T121247Z-security-nfr-observation-5a43b236
kind: observation
by: security-nfr
at: 2026-10-21T12:12:47Z
verified_by: 
confidence: high
refs:
  - ABC-184
  - AR-183-CWDARG
  - QE-184-a
  - QE-184-b
  - QE-184-c
  - grugops/ABC-184
  - grugops/qe-ABC-184
  - 2c65403b
  - c6f80c81
  - 442d1e57
  - 5277babd
  - src/cli.real-engine.test.ts
  - src/book-file.ts
  - plans/tickets/ABC-184-a7-asserts-the-booked-child-spawned-from-neutral.md
  - V5.3.2
  - NFR-008
  - N8-LANE
  - 20261021T120644Z-qe-e2e-observation-86f4cd19
  - 20261021T120644Z-qe-e2e-observation-ccffd570
  - 20261021T120645Z-qe-e2e-observation-d00d3329
supersedes: 
seal: sha256:28e6c300cef2d23e4c4f2b6fc6b05dcbc2ffb02dbb55d0045696698688943058
---

# Security/NFR readings, `ABC-184` @ QE `2c65403b` (SE `c6f80c81`, code `442d1e57`, base `5277babd`): the close row and TSPWN re-read independently; fences re-read. All match QE

**Plants.** Built in the session scratchpad (`…/sec184/plants/`) from `git show` of `5277babd` and `442d1e57`, by my own shape-checked script (each plant refuses unless its anchor occurs exactly once). Every sha256 is byte-identical to QE's (`…d00d3329`):
- `test.base.ts` `8a84dfa3…d2a6`, `test.head.ts` `a4dbb308…f3bd`, delivered `book-file.ts` `890784c9…116c`
- `test.base.TCWD.ts` `008c4e79…4a16`, `test.head.TCWD.ts` `be86a15f…4166`, `test.head.TSPWN.ts` `01d60c77…9d87`
- `book-file.P6f.ts` `afeab577…f71e`

**Cells.** Each is a fresh `git archive c6f80c81` of `src data tools package.json vitest.config.ts tsconfig.json biome.json` in `…/sec184/cells/<cell>/tree`, `node_modules` symlinked, only the test file and `book-file.ts` swapped. One cell at a time, private `TMPDIR`. Command: `CLI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/cli.real-engine.test.ts --reporter=verbose`. No timing taken.

| cell | result | `[CLI_DEEP] (cwd` lines | `AR-183-CWDARG` in output |
|---|---|---|---|
| base test + TCWD + P6f | rc 0, **11/11 green** (the gap) | 6 | 0 |
| head test + TCWD + P6f | rc 1, **10/11, red A7 `:504`**: `AssertionError: AR-183-CWDARG: the booked child must spawn from neutral, or the detector runs from the tree root and is disarmed` | 6 | 3 |
| head test + TSPWN + P6f | rc 0, **11/11 green** (QE-184-a survives) | 6 | 0 |

- Leftovers in every private `TMPDIR`: only `node-compile-cache`.
- `git status --porcelain` in the main checkout: empty after the runs.

**Code read at `442d1e57`.**
- `spawnNode` passes its `cwd` parameter as the `spawnSync` option (`:247`) and returns the same parameter (`:268`); the `[CLI_DEEP]` log prints that parameter too. So an edit to the option alone splits the option from both the record and the log, and only a child-side read would see it. QE's reading (`…ccffd570`) is correct.
- The TSPWN plant has to name the `mkdtemp` prefix (`abc162-neutral-cwd-`) to aim at `booked`. QE's untargeted form (TSPWG) is killed by four other rows. So the surviving form is deliberate and path-conditional, not an accidental drift.
- `CHILD_ENV` is `{}` (`:104`): no `PWD` / `INIT_CWD` route to the parent's tree root.
- Delivered `src/book-file.ts` is the one constant module-URL read, unchanged by this ticket, so `V5.3.2` [L1] is met at the tip.

**Fences.**
- `git diff --numstat 5277babd grugops/qe-ABC-184 -- src`: `7 0 src/cli.real-engine.test.ts`, and nothing else.
- Waiver form (`git diff --name-only 5277babd grugops/qe-ABC-184 | grep -v '\.test\.ts$' | grep '^src/'`): empty.
- `442d1e57..2c65403b` adds only context notes and the `ABC-184` page's `## QE` section.
- The `merge-base` of `main` and `grugops/qe-ABC-184` is `5277babd`.
