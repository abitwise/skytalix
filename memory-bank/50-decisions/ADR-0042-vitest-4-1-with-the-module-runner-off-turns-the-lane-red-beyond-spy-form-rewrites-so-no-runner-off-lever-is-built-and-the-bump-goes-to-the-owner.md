---
kind: adr
id: ADR-0042
---
# ADR-0042: vitest 4.1.11 with the module runner off turns the default lane red in ways spy-form rewrites do not fix, so no runner-off lever is built and the bump goes to the owner (`ABC-152` `D4` fires)

## Status

**proposed** 2026-10-11 by Architect/Design (task `wave-2026-09-25`, subtask `design-ABC-152`, ticket `ABC-152`
`D1`–`D4`), on branch `grugops/design-ABC-152` from the wave tip `4973d8e0`. **Owner word owed** (§ Decision 5).

- **This is `ABC-152`'s pre-registered split (`D4`).** No runner-off configuration reached a green lane with
  the rewrite forms declared before the screen. So no runner-off lever is built, and the `D3` table goes to the
  owner with the ticket's two options. No agent picks between them.
- **It amends nothing yet.** Decision 2's `ADR-0040` amendment and decision 4's reporter route take effect only
  if the owner picks a 4.1 route. `ADR-0008` d7, `ADR-0040` (k = 3, and k = 2 when `ABC-151` lands) and
  `ADR-0041` stand.
- **Every result below is a pass/fail count or a source read. No wall, CPU or duration was read.** Three hops
  ran in parallel. The probe is `.grugops/context/design-ABC-152/probe/`. Its method `METHOD.md` was committed
  at `1530b965`, before the first graded run. Its one amendment (`R3`, disclosed as named after a reading) was
  committed at `f0edb392`, before `A2`, `S1` and `F1`.
- **Every install was in a scratch tree outside the repository.** This repository's `package.json` and
  lockfile are untouched.
- Notes: `.grugops/context/design-ABC-152/notes/`.

## Context

**The question.** `ADR-0041` found that vitest's ~5x per-node factor is the module runner's cross-module
interop. It named route (a): vitest ≥ 4.1 with `test.experimental.viteModuleRunner: false`. The owner said
"vitest - yes do a ticket and upgrade" (`…fbbdde16` item 4). `ABC-152` reads his "yes" as covering only
mechanism-preserving rewrites of the spy form (`V5`).

**The stack read.** Apple M3, Node v26.11.0. Base: vitest 3.2.7, vite 7.3.6, `maxWorkers: 3`, 56 files and
1740 tests at `4973d8e0`. Target: vitest 4.1.11, the `V4` dist-tag, published 2026-08-18. `5.0.3` is
`latest`, and the ticket fences it out.

### `D3`, the correctness screen (full default lane, `screen.mjs`, 300 s bound, unprofiled)

| arm | tree | exit | files | tests | failed | red files | unfinished |
|---|---|---|---|---|---|---|---|
| `A0` control | base, 3.2.7 | 0 | 56 | 1740 | 0 | 0 | 0 |
| **`A1` (i) bump alone, runner on** | 4.1.11, vite 7.3.6 | 1 | 56 | 1740 | **2** | 1 | 0 |
| **`A2` (ii) bump + runner off** | the same + one key | 1 | 56 | **1723** | **98** (+2 suites) | **13** | 0 |
| `S1` (ii) on npm's default vite 8.3.4 | 4.1.11, vite 8.3.4 | 1 | 56 | 1723 | 98 | 13, the same | 0 |
| **`F1` (ii) + declared rewrites R1–R3** | `A2` + R1–R3 | 1 | 56 | 1723 | **91** (+2 suites) | **10** | 0 |
| `F2` post-hoc, + R4 | `F1` + R4 | 1 | 56 | 1740 | 20 | 3 | 0 |
| `F3` post-hoc, + R5 | `F2` + R5 | 1 | 56 | 1740 | **1** | 1 | 0 |

- **`A1`.** 2 reds, both in `src/command-input.test.ts` "ABC-036 A4 … derives once …" (position-3,
  position-6), `expected "vi.fn()" to be called 1 times, but got 3 / 2`.
  - The cause is the bump, not the runner: **on 4.1.11, `vi.fn(m)` returns `m` itself when `m` is already a
    mock.** 3.2.7 returned a new spy with its own call count.
  - Armed probe `fnwrap/`: 3.2.7 reads `outer=1 same=false` (exit 0); 4.1.11 reads `outer=4 same=true`
    (exit 1).
  - The site is `vi.fn(legalMoves)`, where this file `vi.mock`s `legal.ts` with a `vi.fn`.
- **`A2` reds, by cause** (`raw/A2.summary.json.txt` names every one):
  - **Namespace spy** (R1): `cli.test.ts` 1 and `render-seam.test.ts` 3. `Cannot spy on export "…". Module
    namespace is not configurable in ESM.`
  - **Factory mock, then a top-level `const {…} = await import(p)`**:
    - 8 files: `gameend.nfr`, `history-pane.nfr`, `glyph-mode.nfr`, `san.nfr`, `status-panel.nfr`,
      `turn-loop.nfr`, `turn-loop`, `zobrist.nfr`;
    - the mock does not apply, or the exports read `undefined`. That gives `newGame is not a function` in 63
      tests and 1 suite, `… is not a spy` ×10, `zobristKey` / `hasLegalEnPassant is not a function` ×4, and
      `legalMoves is not a function` in 1 suite;
    - a minimal repro shows the dynamic form unmocked and the static form mocked.
  - **Circular manual-mock factory** (`command-input.test.ts`, 13):
    - while a factory is pending, the native mocker exposes the module's exports as `undefined`, then
      redefines them;
    - `src/move-input.ts:108` builds `PRODUCTION_DEPS = { legalMoves, … }` at module evaluation, so it keeps
      the `undefined`. The error is `deps.legalMoves is not a function`.
  - **`vi.fn(mock)`** (R3): the same 2 as `A1`.
  - **Fresh-registry stub** (R2): `tools/opening-book/book.test.ts` D1(f), `expected [Function] to throw`.
    `vi.resetModules()` cannot evaluate a native ES module a second time.
  - **Namespace key order** (`san.test.ts` ABC-013 A20): `Object.keys(namespace)` reads
    `["parseSan", "toSan"]`. A native ES module namespace lists its keys in sorted order; the runner's object
    kept declaration order. The test asserts `["toSan", "parseSan"]`.
- **The lane always finished** in every arm. That differs from C4 on 3.2.7 (`ADR-0041`).
- **Post-hoc forms, explored after the split fired and ruling nothing:**
  - **R4:** a top-level `await import()` that follows `vi.mock` → a static import. 8 files, 33 imports.
  - **R5:** a call-through factory `{ ...actual, f: vi.fn(actual.f) }` → `vi.mock(p, { spy: true })`.
    2 files, 7 factories.
  - **With them, 1739 of 1740 pass.** The one red left is A20, and its fix changes an assertion.
  - None of this was plant-checked. It is a size, not a `V4`.

### `D2`, what 4.1.11 changes under this lane (read from the installed source and docs; probes in `raw/`)

- **(a) Worker count.** `raw/resolved-workers-v4.txt` shows each line below.
  - `resolveConfig` takes `maxWorkers` from the config or CLI. `fileParallelism: false` gives 1. Then, last,
    `VITEST_MAX_WORKERS` overwrites it, outranking both.
  - **`VITEST_MAX_THREADS` and `VITEST_MAX_FORKS` are read nowhere.** Under either at 8, the count resolves
    to 3. `VITEST_MAX_WORKERS=8` resolves to **8**, and today's pin cannot see that.
  - **`poolOptions` is removed.** It logs a deprecation and is ignored.
  - **`resolveMaxWorkers` reads a project's own `maxWorkers` before the root's.** So `QE-144-a`'s trigger is
    live: a `test.projects` entry can raise the cap past the pin.
  - The default is still `availableParallelism() − 1` (7).
  - `tinypool` leaves the tree. An isolated file gets a new worker that is stopped when the file ends, so
    `ADR-0040`'s "idle boots" premise does not apply on 4.x.
  - `resolved-workers.mjs`'s 3.2.7 precedence is stale there. `resolved-workers-v4.mjs` replaces it for any
    4.x read.
- **(b) `isolate` with the runner off.**
  - With `isolate: true`, each test file gets its own `PoolRunner` (a new worker thread), stopped afterwards
    (`cli-api` `getPoolRunner` / `isEqualRunner`: "Isolated tasks should not share runners").
  - A native ESM cache belongs to its thread. So each file still gets a fresh registry.
  - **Armed probe `iso/`** (a module-level counter; two files; 1 worker):
    - runner off: `isolate` true → green; `isolate: false` → **red**;
    - runner on: the same.
  - **`ADR-0008` d7's mechanism holds on 4.1.11 with the runner off.**
  - **However, `vi.resetModules()` gives back the same instance** (`raw/reset-probe.txt`: `same-instance=true`,
    exit 1). `src/book.test.ts` ABC-094 A2 ("two fresh module instances") stays green while its premise is
    gone. **That is a silent premise**, and no screen sees it.
- **(c) The key.** It is `test.experimental.viteModuleRunner: false` (4.1.0+, default `true`, threads or forks
  only). `experimental.nodeLoader` (default `true`) carries `vi.mock` / `vi.hoisted` through
  `module.registerHooks`, which needs Node ≥ 22.15.
  - **Reach:** in `F3`, every call-count guard with a non-zero expected count passed. Those include
    `status-panel.nfr`'s `squareAt`, reached through `position.ts`'s importers. So a mock registered before a
    static import reaches production importers in the worker. **That is a green run, not `V4`.**
  - **What does not reach:**
    - a namespace `vi.spyOn` throws, which is loud;
    - a factory mock read through a later top-level `import()` is unapplied or `undefined`. It is loud here,
      but it **can be silent** where a guard expects 0 calls (`ADR-0041` d3's class);
    - a circular factory leaves load-time captures `undefined`;
    - `vi.resetModules()` is a no-op, which is silent.
- **(d) The five `RISK-ABC143-01` surfaces of `tools/grugops/result-file-reporter.js`:**
  1. the `vitest/reporters` export is present;
  2. `JsonReporter`'s `options`, `start` (`onInit`) and `ctx.config` are present;
  3. **`onFinished` is removed** from the reporter API (migration guide; in the source only UI WebSocket
     clients get it), so the override is dead;
  4. `writeReport` is present and is called once, from `onTestRunEnd(testModules)`;
  5. Node's `exit` hook is unchanged.
  - **Read on 4.1.11 with the runner off** (`raw/reporter-read-4.1.11.txt`):
    - green: exit 0, `success` true;
    - QE's unhandled plant: exit 1, `success` false **only through the exit code**, `unhandledErrors` `[]`,
      and the thrown text count is **0** in the file (2 in the console). `QE-142-a`'s half is reopened, as QE
      predicted.

## Decision

1. **`D1`, the target, if any 4.1 route ships:**
   - **`vitest` and `@vitest/coverage-v8` at 4.1.11**, each with the range **`~4.1.11`**. The tilde refuses
     4.2 and 5.x; the runner key is `experimental`. `coverage-v8` 4.1.11 peers `vitest: 4.1.11` exactly.
   - **`vite` is held at 7.3.6 by a direct devDependency `"vite": "~7.3.6"`.** It is named here, as `V1`
     requires.
     - npm's own resolution of vitest's `vite: ^6 || ^7 || ^8` moves it to **8.3.4**: rolldown and
       lightningcss come in, esbuild and rollup go out (+32 / −114 packages).
     - Held at 7.3.6, the lockfile reads **+3 / −61 / 20 changed**, with the same install-script set as base
       (`esbuild`, `fsevents`).
     - `S1` shows vite 8 changes no correctness result. One major family moves at a time.
   - **Node v26.11.0 is satisfied** (`^20 || ^22 || >=24`). The runner-off mode would need ≥ 22.15. `engines`
     says `>=22`. The repo already needs ≥ 22.18 for native type stripping (`npm run chess`), so `engines` is
     not touched.
2. **`D2`, `ADR-0040` d3 amended if any 4.1 route ships.** The `A7` pin follows, and the rest of the pin stands:
   - the env loop checks **`VITEST_MAX_WORKERS` ≤ k** and drops the two 3.x names, because a check on a
     variable vitest no longer reads guards nothing;
   - **`test.projects` is `undefined`**, which closes `QE-144-a`;
   - `poolOptions` stays forbidden: on 4.x it is ignored, and the pin red tells the editor so.
   - **Re-armed reds (`V6`):**
     - r1: delete `maxWorkers`;
     - r2: add `isolate: false`;
     - r3: `VITEST_MAX_WORKERS=8`;
     - r3b: `VITEST_MAX_WORKERS=k+1`;
     - **r4: add a `projects` entry**.
   - Test count stays the same: the `it` is edited in place.
   - `ADR-0008` d7 is unchanged and holds by mechanism (`D2`(b)).
3. **`D3`/`D4`: the split FIRES. No runner-off lever is built in `ABC-152`.**
   - With **R1–R2** (declared at `1530b965`), and with **R1–R3** (R3 disclosed at `f0edb392`), `F1` reads
     **91 red tests in 10 files**.
   - **Under any reading of the forms, `san.test.ts` A20 needs an assertion change**, and that is never
     `V5`-shaped. It even survives the post-hoc R4 and R5.
   - `book.test.ts` ABC-094 A2's silent premise needs test content too.
4. **The reporter route, if any 4.1 route ships (`RISK-ABC143-01`, item 3 of its carrier rule):**
   - QE's route: read unhandled errors from **`onTestRunEnd(testModules, unhandledErrors, reason)`**, and
     delete the dead `onFinished` override;
   - add a **load-time check** that `JsonReporter.prototype.writeReport` and `.onTestRunEnd` are functions, and
     throw if not (5.x turns loud);
   - update `ABC-149`'s REGRESSION PLANTS block in the same commit, and re-run all six rows by content (`V2`).
5. **Owner word owed** (via the Orchestrator; no agent picks):
   - **(Q1, the `D4` pick)** One of:
     - **(1) ship 4.1.11 with the runner on.** It buys **no CPU by this ruling**. Whether 4.x's own module
       runner has a different factor is `UNKNOWN - verify`, and no reading was taken. It pays `V2` (decision
       4), `V12` (the review), decision 2's pin re-arm and **R3** (2 sites in `command-input.test.ts`, `expect`
       count 295 → 295).
     - **(2) stay on 3.2.7.** `ABC-152` closes at this ruling, and `RISK-ABC143-01` stays open.
   - **(Q2, R3)** R3 was named after `A1`'s reading, and it is the only rewrite option (1) needs. Is it inside
     your "yes"? It is a spy form: `vi.fn(f)` → `vi.fn((...a) => f(...a))`, which restores 3.2.7's
     own-count wrapper.
   - **(Q3, information, not an option this ADR offers)** The runner-off CPU would need R-3 test content
     beyond your "yes":
     - R4 (8 files, 33 imports);
     - R5 (2 files, 7 factories);
     - one assertion change (`san.test.ts` A20, key order);
     - a ruling on `book.test.ts` ABC-094 A2's premise.

     In scratch that reached 1739 / 1740 green, never plant-checked. If you want it, it is a new ticket or a
     re-cut on your R-3 word.

## Alternatives

- **Rule R4 and R5 into `V5` after seeing `A2`.** Rejected. They were named after the reading, and they are
  import- and factory-shape changes, not spy forms. Even with them, A20 needs an assertion change. The split
  exists to stop exactly this widening.
- **Hold vite with `overrides`** instead of a direct devDependency. Rejected: it hides the pin from a reader of
  `devDependencies`. A direct entry is the boring, visible form.
- **Take npm's vite 8.3.4.** Rejected for now: it is a second major (a new bundler and native binaries) with no
  correctness or CPU reason (`S1` equals `A2`). Security would review a larger lockfile delta.
- **`^4.1.11`.** Rejected: a 4.x minor may move an `experimental` key.
- **Keep the 3.x env names in the pin.** Rejected: on 4.x they are inert, and `VITEST_MAX_WORKERS` raises the
  cap unseen.
- **`vitest 5.x`.** Fenced out by the ticket (`RISK-ABC143-01`: its import fails loudly).

## Consequences

- **The lane does not change at this hop.** `package.json`, the lockfile, `vitest.config.ts`, `src/` and every
  test file are untouched.
- **Expected effect on lane CPU from `ABC-152` under option (1): `UNKNOWN - verify`, not claimed.** `ADR-0041`'s
  cause (the runner's interop) stays, because the runner stays on. Under option (2) it is 0.
- **`V3`, `V4`, `V9`–`V11` lose their object under either option.** They exist for the runner-off lever.
  - Under option (1), BA/PM re-cuts them on the owner's word. `V3` drops. `V9`'s −15 % bar cannot be met by a
    bump that removes no factor, so it becomes a no-rise read or drops.
  - The +1-test pin declared in `METHOD.md` applies only to a runner-off build. Option (1)'s test count is
    the base's.
- **`NFR-008`** is unchanged. **`NFR-001`, `NFR-005`, `ABC-025` `N1`:** isolation holds by mechanism on 4.1.11
  (`D2`(b)). A 4.x build still owes `V7`'s 20 runs (`ADR-0008` d8: a runner change).
- **4.x side effects a build must expect:**
  - `coverage.all` is removed: only loaded files are reported unless `coverage.include` is set. So
    `AGENTS.md`'s "856/856 on 30 files" changes meaning; that is the Scribe's after a merge;
  - `vi.restoreAllMocks()` no longer resets automocked spies;
  - `getMockName()` reads `vi.fn()`.
- **`ABC-149` is unaffected** and still merges first if option (1) is picked.

## Rollback

This ruling changes no file outside `memory-bank/`, `plans/` and `.grugops/context/`. To roll it back, mark
this ADR `superseded` or `deprecated`. If the owner picks a route this ADR did not offer (for example, Q3's
runner-off content), a new ticket carries it, and decisions 1, 2 and 4 apply to it as written.
