# ABC-150 D1–D2 method — declared BEFORE the first graded run (ticket Test note 1)

Declared 2026-10-11 by Architect/Design (subtask `design-ABC-150`, task `wave-2026-09-25`), on branch
`grugops/design-ABC-150` from the wave tip `304bbd9d`. This file is committed before any graded run. The
commit time is the proof of order.

## Tree, machine, setting

- Tree: wave tip `304bbd9d`, in a worktree with `node_modules` symlinked to the main checkout.
  `vitest.config.ts` there is `pool: "threads"`, `isolate` default `true`, no `maxWorkers` (`ABC-144` has
  not merged; `D1`–`D3` may run before it, ticket § Dependencies). The probe never reads that file: every
  vitest side runs under the probe-only `vitest.d.config.mjs`, as `ABC-147` `A2` did.
- Machine: Apple M3 (8 cores), Node v26.11.0, vitest 3.2.7, vite 7.3.6, vite-node (vitest 3's module runner).
- QE on `ABC-144` runs in parallel (counts only, no timing grades). The ratios are paired, so they need no
  quiet window (ticket `L6`), and none is taken.

## What ran before this file (ungraded; nothing timed was looked at)

1. `inspect-transform.mjs`: prints vite's esbuild + SSR transform of `src/moves.ts`. Every imported binding
   becomes a property read on the runner's namespace object (`__vite_ssr_import_0__.EMPTY`,
   `(0,__vite_ssr_import_0__.isOnBoard)(to)`), and every export is registered as a getter
   (`__vite_ssr_exportName__("generateMoves", () => { try { return generateMoves } catch {} })`).
2. `inspect-strip-vs-esbuild.mjs`: for all **37** production files, vite's esbuild TS transform and Node's
   own `stripTypeScriptTypes`, both re-printed by esbuild as plain JS, are **byte-identical (37 of 37)**. So
   the TS transform itself emits the same JavaScript plain `node` runs. What C1 can still vary is the
   source map; the SSR rewrite is C3.
3. One inspection process per side of `base` and `C4` under `node --allow-natives-syntax` (`INSPECT=1`):
   under the runner, `src/position.ts`'s namespace is a null-prototype object **without fast properties**
   (V8 dictionary mode) whose exports are **accessors**; externalized (C4), it is a native namespace with
   fast properties and data exports. Digests equal.
4. A smoke run (`SMOKE=1`, one pair per cell, **no timings written or printed**): every candidate's
   mechanism check passed and every digest was equal (E `f66389c97154ff65` and S `0f86f021e96f607d`, as
   in `ABC-147`; P `5ae607b117d26ad2`).
5. `build-bundle.mjs` built the C3 bundle (`bundle/workload150.bundle.mjs`, sha256/16 `47d8c558e2484a48`,
   15 inputs: the two workload files and 13 `src/` modules).

## Workloads (three)

- **E** and **S**: `ABC-147`'s, imported unchanged from `../../ticket-to-pr-ABC-147/probe/workload.mjs`.
- **P** (the third, `RISK-ABC147-02`): `src/perft.test.ts` "startpos perft(4) = 197281", the file's largest
  default-lane case, `perft(parseFen(START_FEN), 4)`. Perft is legal-move generation only, so its
  production CPU is `moves.ts`/`legal.ts`/`position.ts`/`apply.ts`. `src/perft.test.ts` is `ABC-147` `A1`'s
  rank 4.5. Its ratio is reported. **It is not a stop rule.**
- Timing, as `ABC-147` `A2`: one warm-up call, then 5 timed calls (`performance.now()`), median reported.
  The digest of the output is checked on every call.

## Candidates (declared here; each varies ONE thing on the vitest side; the node side is unchanged)

| id | what is varied | how (probe config / probe only) | mechanism check, else the pair is not usable |
|---|---|---|---|
| base | nothing (`D1`) | `ABC-147`'s probe config: `pool: "threads"` | worker thread; `src/` export is an accessor |
| **C1** transform and source maps | the inline source map vite-node attaches to every module | `test.server.sourcemap: false` | as base (the map is a code path: `vite-node/dist/server.mjs` `fetchModule`/`_transformRequest`) |
| **C2** worker thread and its flags | the worker thread. The runner, its `execArgv` (`--conditions …` only, plus `--cpu-prof*` if present) and its env (`TEST`, `VITEST`, `NODE_ENV`, `VITEST_MODE`, `FORCE_TTY`, …) are the same in a fork; none is a V8 or GC flag, and no `resourceLimits` are passed (`vitest/dist/chunks/coverage.*.js` `createThreadsPool`) | `test.pool: "forks"` | `isMainThread === true`; accessor |
| **C3** module interop | cross-module calls between `src/` modules go through the runner's namespace getters | the same workload imported as ONE esbuild bundle (`build-bundle.mjs`), which still runs through the module runner, its SSR transform and its source map, in the same worker thread | worker thread; workload is the bundle |
| **C4** (added by the Architect) the module runner for production code | whether `src/` runs under the runner at all | `test.server.deps.external: [<repo>/src/*.ts, not *.test.ts]`: Node imports `src/` natively, by type stripping, inside the same vitest worker thread | worker thread; `src/` export is a **data** property |

- C2 note: `ABC-085` read ~4.3x under both `threads` and `forks` once (`RUN.txt` item 4), so the pool *as a
  lever* is ruled out. C2 re-reads the thread-vs-process question as paired ratios here because it is
  the only way the vitest side can drop the worker thread, and a quote is not a reading (`ABC-147` G4).
- C3 is a **diagnosis**, not a setting. C4 is the setting family that removes what C3 isolates. `D3`
  needs a setting; `D2` needs a cause.
- **Supplementary C3 control** (`c3-control.mjs`): plain node only, `src/` vs the bundle, paired, n = 5 per
  file. It says whether the bundle itself changes plain-node speed. If the bundle under plain node reads
  outside 0.90–1.10 of `src/` on a file, C3's share on that file is reported with that caveat.
- **If no single candidate explains the factor**, the pair **C1 + C3** is read next, then **C2 + C3**,
  under the same rules. No other pair is read.

## Pairs and rules (as `ABC-147` `A2`)

- `d-pairs.mjs`: for each pair index p = 0..4, every candidate (base, C1, C2, C3, C4) and every workload
  (E, S, P) runs one pair. Node first when (p + candidate index) is even. **n = 5 pairs per cell.**
- Before every process: load1 (`sysctl -n vm.loadavg`), `notifyutil -g com.apple.system.thermalpressurelevel`
  and the power source are logged.
- Scheduling gate: wait for load1 ≤ 6 before a process, at most 300 s, logged as `waited_s`. The
  usability rule is separate and unchanged: **a pair whose either side starts at load1 > 8 is recorded
  and not used.**
- **A pair whose digests differ is void**, not averaged. A pair with a non-zero exit, or whose vitest side
  fails its candidate's mechanism check, is not usable.
- If a cell ends with fewer than 5 usable pairs, more pair indices are run for the whole grid (p = 5, 6, …)
  until it has 5. Every extra pair is recorded.
- Raw files: `raw/d-pairs.tsv.txt` (every process), `raw/d-pairs.summary.tsv.txt` (every pair),
  `raw/c3-control.tsv.txt`, `raw/analysis.txt`.

## Analysis (`analyze.mjs`)

- **`D1`:** base ratio vitest ÷ node per file, median (min–max), usable pairs.
  - **Stop rule (pre-registered by the ticket):** if the lowest base pair on E or S is below **1.67x**,
    `D2` is not graded and the ticket goes back to BA/PM.
- **`D2`:** per candidate and file, ratio median (min–max), and **share of the excess removed =
  (r_base − r_cand) ÷ (r_base − 1)**, r_base = that file's `D1` median. Also the range from the
  candidate's max and min.
  - A candidate **explains** the factor when it removes **≥ 50 % of the excess on both E and S**. P is
    reported, not graded.
- Cold first-call ratios are reported as supplementary only.

## `D3` admissibility screen (correctness, not timing)

If an explaining candidate is a setting, it is screened for admissibility before any ruling: the full
default lane is run with that setting layered over `vitest.config.ts` by a probe config under `probe/`
(`vitest run -c <probe config>`, never `npm test`, unprofiled), and **only exit code, files, tests,
failures and the failing files' names** are recorded. **No wall or CPU figure is taken or reported.** That
is not an `L` reading. The import graph is also checked against the modules the default lane mocks
(`vi.mock`/`vi.doMock`) or spies on through a namespace (`vi.spyOn(ns, …)`), by `graph-check.mjs`.
