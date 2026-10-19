---
id: 20261019T143000Z-qe-e2e-observation-abc173-mutants-3d7a91c4
kind: observation
by: qe-e2e
task: qe-ABC-173
at: 2026-10-19T14:30:00Z
verified_by:
confidence: high
sealed: false
refs:
  - ABC-173
  - ADR-0008
  - ABC-170
  - ABC-167
  - ABC-119
  - QE-173-a
  - QE-173-b
  - QE-173-c
  - QE-173-e
---

# `ABC-173` mutants at `840ebbf7`: 54 wrong builds, 44 killed, 10 survived; the A5 row's kill set unchanged at step 10

Hand-authored and unsealed. `scripts/context-io.ts` is absent from this install. Every mutant was one exact-once
replacement in the scratch worktree `../wt-qe-ABC-173`. Its bytes were restored after each run, and `git status` was
clean after each batch. Harness and logs: `probe/mut.mjs`, `probe/genspec.mjs`, `probe/ms.mjs`, `probe/*.log`.

**Batteries** (each command run with `NODE_OPTIONS` and every `*_DEEP` unset first, then set as named):
- `DL` = `npm test` as spelled.
- `OF` = one file at flag 400. `SF1` = one file at flag 128. `S128` = two files at flag 128. Each must pass.
- `UNS` / `UNO` = two files / one file, no prefix. `S400` = two files at flag 400. `O450` / `O500` = one file at flag
  450 / 500. Each must be refused by the guard.
- `CLI` = the `CLI_DEEP` lane as spelled. `CLIS` = `CLI_DEEP=1` at flag 128 over two files (a SUITE-shape run; not an
  `AGENTS.md` lane).
- `A173` = `cli.test.ts -t "ABC-173"` at flag 400. `CLIT` = all of `cli.test.ts` at flag 400.

Controls: every battery read its expected outcome on the unmutated tree.

## `tools/grugops/heap-guard.js` (A5), batteries DL OF SF1 S128 UNS UNO S400 O450 O500
| id | wrong build | result | killed by |
|---|---|---|---|
| G01 | row choice inverted | KILLED | OF (every ONE-FILE lane refused), S400 |
| G02 | always SUITE | KILLED | OF |
| G03 | always ONE-FILE | KILLED **only by S400** | the armed command; DL and every lane as spelled pass |
| G04 | `>` -> `>=` | KILLED | DL, OF, S128 (every correct run refused) |
| G05 | file count + 1 | KILLED | OF |
| G06 | 1 or 2 files is ONE-FILE | KILLED **only by S400** | as G03 |
| G07 | never throws | KILLED only by UNS UNO S400 O450 O500 | expected: the guard exists for wrong commands |
| G08 | provides the ONE-FILE row in every shape | **SURVIVED** | none |
| G09 | compares the flag (limit - 96), not the limit | KILLED **only by O450** | |
| G10 | ONE-FILE row 496 -> 592 | KILLED **only by O450** | |
| G11 | SUITE row 224 -> 512 | KILLED **only by S400** | |

**G03, G06, G09, G10 and G11 pass the default lane and every `AGENTS.md` lane as spelled** (`QE-173-a`). G03, G06 and
G11 admit a SUITE run at the ONE-FILE flag: 9 x 496 = 4464 MiB, which is over the 2048 bar. No automated row pins
`ROWS_MIB` or the shape choice: `A3` pins `FLAGS_MIB` against `AGENTS.md`, and `A4` only asserts that the provided row
is one of `ROWS_MIB`'s values. The page's test note "raise one row above the table -> `A4` red" does not hold for a raised
`ROWS_MIB` (G10, G11): `A4` compares against the raised row.

## `vitest.config.ts`
- V01, `globalSetup` removed: KILLED by DL (`A4` and `A6` red, "no heapRowMiB"). UNS and UNO then run uncapped.
- V02, `maxWorkers` 3: KILLED by CLIT (`ABC-144 A7`).
- V03, `viteModuleRunner: true`: KILLED by CLIT (`ABC-152 V3`).
- V04, the heap flag in vitest `execArgv` (page test note): KILLED, `ERR_WORKER_INVALID_EXEC_ARGV`, no test runs, exit 1.
- G07U, the guard never throws AND the run is unprefixed (the limit unapplied, `A4`'s wrong build): KILLED, `A4` and `A6` red
  in `cli.test.ts`.

## The `CLI_DEEP` argv heap token (A6), batteries CLI CLIS
| id | wrong build | result |
|---|---|---|
| T01 | token dropped | KILLED by CLI, CLIS (`A6` probe) |
| T02 | first token, not last | SURVIVED: equivalent while `NODE_OPTIONS` holds one heap token |
| T03 | literal `--max-old-space-size=400`, not the parent's | KILLED **only by CLIS** (`QE-173-e`) |
| T04 | token after the entry point | KILLED by CLI, CLIS (8 rows) |
| T05 | the whole `NODE_OPTIONS` passed in `env` at the call site | SURVIVED (`QE-173-e`; `ABC-119`'s pin reads the `CHILD_ENV` constant, not the call) |

## The `A3` static row, battery A173: 14 of 14 KILLED
- S01 ZOBRIST line without its prefix; S02 SUITE flag on a one-file line; S03 ONE-FILE flag on the coverage line.
- S04 the quiescence line dropped (the 17 floor is exact: 17 commands today).
- S05 `INPUT_DEEP` split into two assignments; S06 `--expose-gc` dropped; S07 SUITE flag in the `INPUT_DEEP` value.
- S08 prefix moved into `npx --node-options`; S09 a command moved inside an HTML comment.
- S10 ZOBRIST replaced by a duplicate quiescence command (count kept at 17): the per-lane check reds it.
- S11 a second heap flag in one value; S12 `FLAGS_MIB.oneFile` 400 -> 500; S13 `scripts.test` flag 400.
- S14 `--max_old_space_size=400` (the underscore form Node accepts): red, which is the conservative answer.

## The `C2` parser and row, battery A173
- P01 namespace imports ignored, P02 rename resolved to its local name, P03 only the `node:` specifier, P05 no descent
  into function bodies: each KILLED by `C2` (P05 also by `A6 (static)` and the >= 4 floor).
- **P04** `exec` dropped from the async set, **P06** the prefilter needs the `node:` spelling, **P07** the sync floor
  4 -> 0: SURVIVED, each equivalent on today's tree. The in-memory self-test plants `spawn`, `execFile` and `fork`
  only (`QE-173-c`).
- Tree plants: C01 named `spawn(` in `ladder.test.ts`, C02 `cp.exec(` through a namespace, C03 renamed `fork`: each
  KILLED by `C2`. **C04** a dynamic `import()` spawn: SURVIVED. That is the row's stated bound, in its comment.

## The `A6` static row, battery A173
- A01 an `env` key on the history-pane call; A02 a heap flag in the transposition argv; A06 `childOf` with
  `NODE_OPTIONS` emptied: each KILLED (A06 by `A6`'s `heapProbe`).
- A03 a quoted `"env"` key: survives the row, but `npm run lint` reds it (format), and the autofixed key is caught.
  Counted KILLED (lint).
- **A04** env passed through a spread (`...{ env }`, lint-clean after `biome check --write`) and **A05** a
  `--max_old_space_size=4000` argv token (lint-clean; `node --max_old_space_size=4000` reads 4096 MiB): SURVIVED
  (`QE-173-b`).

## The lightened rows (owner `…6e1d9b47`), `probe/ms.log`
- **`ABC-170 A3`, step 5:** the correct build is 6/6 green. **M15 reds all 6** at step 5, as at step 1. M16 (an extra
  read on both paths) is 6/6 green at both steps, as `QE-170-f` recorded.
- **`ABC-167 A5` "movetime 100":** the kill set over M01–M11 (`qe-ABC-167/probe/mutants.mjs`, verbatim) plus MT1
  (movetime ignored), MT2 (minus overhead) and MT3 (halved) is **{MT1, MT2, MT3} at step 1 and {MT1, MT2, MT3} at
  step 10**. M01–M11 survive this row at both steps; they do not touch the `movetime` path. The SE's claim holds.

## Tally
| family | run | killed | survived |
|---|---:|---:|---:|
| guard (G01–G11) | 11 | 10 | 1 (G08) |
| config and `A4` (V01–V04, G07U) | 5 | 5 | 0 |
| `CLI_DEEP` token (T01–T05) | 5 | 3 | 2 (T02 equivalent; T05) |
| `A3` static (S01–S14) | 14 | 14 | 0 |
| `C2` parser and row (P01–P07) | 7 | 4 | 3 (P04, P06, P07; equivalent on today's tree) |
| `C2` tree plants (C01–C04) | 4 | 3 | 1 (C04, the stated bound) |
| `A6` static (A01–A06) | 6 | 4 | 2 (A04, A05) |
| `ABC-170 A3` at step 5 (M15, M16) | 2 | 1 | 1 (M16, known `QE-170-f`) |
| **total** | **54** | **44** | **10** |

Not in the tally: the `ABC-167 A5` "movetime 100" comparison, 14 mutants at each of 2 steps, kill set identical.
