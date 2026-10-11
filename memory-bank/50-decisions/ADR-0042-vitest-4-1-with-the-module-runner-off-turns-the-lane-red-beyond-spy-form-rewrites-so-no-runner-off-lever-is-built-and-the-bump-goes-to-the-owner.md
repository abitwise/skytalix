---
kind: adr
id: ADR-0042
---
# ADR-0042: vitest 4.1.11 with the module runner off turns the default lane red in ways spy-form rewrites do not fix, so no runner-off lever is built and the bump goes to the owner (`ABC-152` `D4` fires)

## Status

**accepted** 2026-10-11 by Olger Oeselg (owner), with the owner-route addendum, verbatim "1. ADR-0042 - accept ; 2. yes" (Orchestrator transcription note `…c9b52bb2`); the "yes" also accepts `RISK-ABC152-A2-GRAPH`.

Previously **proposed** 2026-10-11 by Architect/Design (task `wave-2026-09-25`, subtask `design-ABC-152`, ticket `ABC-152`
`D1`–`D4`), on branch `grugops/design-ABC-152` from the wave tip `4973d8e0`. ~~**Owner word owed** (§ Decision 5).~~

**ADDENDUM 2 2026-10-11 (rulings 8–11 on QE's `ABC-152` gaps), the last section of this file.** It extends rulings 1
and 5 and the residuals. It changes no decision and adds no ruling 7 case.

**ADDENDUM 2026-10-11 (the owner's route), the section before addendum 2: it governs over decisions 3 and 5.**
The owner answered decision 5 with Q3's route: vitest 4.1.11 **with the module runner off and the test rework**,
in **one ticket** (`ABC-152`), with the CPU saving in scope (note `…06bfc2d7`). Decisions 1, 2 and 4 take effect as
the addendum details them. Decision 3's "no runner-off lever is built" is overtaken by his pick. The file name is
kept so that existing links resolve.

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

## ADDENDUM 2026-10-11: the owner's route. vitest 4.1.11 with the runner off and the test rework, in one ticket, CPU in scope

Written by Architect/Design (task `wave-2026-09-25`, subtask `design-ABC-152-owner-route`, ticket `ABC-152`), on
branch `grugops/design-ABC-152-owner-route` from `main` `f11afad8`. `ABC-149` and `ABC-151` are merged there, so
`maxWorkers` is 2. **This hop took no timing, CPU or heat reading.** Every result is a pass/fail, a resolved value or
a source read. All of them were taken in scratch trees outside the repository with vitest 4.1.11, `@vitest/coverage-v8`
4.1.11 and vite 7.3.6. This repository's `package.json` and lockfile are untouched. Readings are in
`.grugops/context/design-ABC-152-owner-route/probe/READINGS.md` (`R1`–`R10`), and notes are in
`.grugops/context/design-ABC-152-owner-route/notes/`.

**Status: governs the build.** It records the owner's own pick, and the rulings below sit inside it. **Two things
remain the owner's:** acceptance of this ADR as a whole (asked by the Orchestrator; recommended to hold the merge,
not the build), and every case in ruling 7.

### The owner's word

- **Verbatim, 2026-10-11, in session:** *"Vitest - upgrade and fix/upgrade tests as well, use one ticket for it,
  include CPU saving."* It comes from the Orchestrator's transcription, note
  `.grugops/context/wave-2026-09-25/notes/20261011T194129Z-orchestrator-decision-owner-word-abc151-keep-k2-abc152-runner-off-one-ticket-06bfc2d7.md`,
  item 2. That note is a transcription, not a stamp.
- **It answers decision 5:**
  - **Q1:** neither option (1) nor option (2). He picked Q3's route.
  - **Q2:** R3 is in.
  - **Q3:** he wants it, and in this ticket. **"One ticket" overrides this ADR's Rollback**, which said a new
    ticket would carry it.
  - **The transcription reads "fix/upgrade tests" as covering** R1–R5, the `san.test.ts` A20 assertion and the
    re-grounding of `book.test.ts` ABC-094 A2, each with its guard plant-checked. Deleting or skipping a test is
    **not** read as covered.
- **Consequences:**
  - **Decision 3** ("no runner-off lever is built") is overtaken.
  - **Decision 1** (the target), **decision 2** (the `ADR-0040` d3 amendment) and **decision 4** (the reporter)
    take effect, as rulings 4 and 5 detail.
  - The `deps.external` guard question was delegated to the Orchestrator, who ruled no separate ticket. Ruling 4's
    runner-off pin is the guard that matters after the bump.

### Ruling 1: the admitted rewrite forms, and what "armed" means for each

**The rule for every form.** A rewritten guard is **armed** only when all of these hold:
- **The plant.** In a scratch copy outside the repository, one plant adds or removes **one call** to the spied or
  mocked function, on the production path the test drives.
  - The plant goes in production code (`src/*.ts` or `tools/**` that is not a test), never in the test.
  - The test's call-count or mock-routing assertion turns **red** at head.
- **Expected count 0.** For a guard that expects 0 calls, the plant adds the call and the guard must go red. **A
  green is never the evidence** (`ADR-0041` d3).
- **Recorded:** each plant's diff, its red message and the rewritten file.
- **The pre-rewrite form, where it is green under the runner off** (only `book.test.ts` A2, ruling 3), is shown
  **blind** on the same plant.
- **Counts:** each rewritten file keeps its `expect(` count, except the pin deltas that ruling 4 declares. The file
  count equals base. The test count is base + 1.

| form | from → to | where (screen `F1`–`F3`) | armed = this plant turns red |
|---|---|---|---|
| **R1** namespace spy | `import * as ns; vi.spyOn(ns, "f")` → `vi.mock(path, { spy: true })` at file top, the spy read as `vi.mocked(ns.f)` and cleared where the original was installed. `mockRestore()` → `mockClear()` (4.x cannot restore an automock spy; its implementation is the original) | `cli.test.ts` (1 site), `render-seam.test.ts` (9 sites) | one call to `f` added or removed in the production caller → the count assertion |
| **R2** fresh-registry stub | `vi.resetModules(); vi.doMock(p, stub); await import(q)` → `vi.mock(p, { spy: true })` at file top + `vi.mocked(f).mockImplementation(stub)` in the test, reset in `finally` | `tools/opening-book/book.test.ts` D1(f) | (a) delete the `mockImplementation` line → the test's assertion (`expected [Function] to throw`); (b) delete the `finally` reset → a later test in the file that reads the real `f` goes red. If no later test reads it, record "no leak reader" and do not invent one |
| **R3** `vi.fn(mock)` | `vi.fn(f)`, where `f` is this file's `vi.fn` mock → `vi.fn((...a: Parameters<typeof f>) => f(...a))` | `command-input.test.ts` (2 sites) | one extra call of the derived function in production → `called 1 times, but got 2`. The unwrapped form is already red on 4.1.11 (`A1`) |
| **R4** dynamic after mock | a top-level `const {…} = await import(p)` after `vi.mock` → `import {…} from p`, kept where the dynamic import stood (after the `vi.mock` blocks: the form run in `F2` and `READINGS` R5; moving it elsewhere is not ruled) | 8 files, 33 imports: `gameend.nfr`, `history-pane.nfr`, `glyph-mode.nfr`, `san.nfr`, `status-panel.nfr`, `turn-loop.nfr`, `turn-loop`, `zobrist.nfr` | one call added or removed on the mocked function's production path → the count. **Shown here for `glyph-mode.nfr`'s expected-0 `NFR-007` guards** (`READINGS` R5): planted `node:fs`, `node:fs/promises` and `node:child_process` calls, and a namespace import, each go red ("got 9 times"), as on 3.2.7 |
| **R5** call-through factory | `vi.mock(p, async (io) => ({ ...actual, f: vi.fn(actual.f) }))`, where the body is only call-through spies → `vi.mock(p, { spy: true })`. A factory with any stub is **not** R5 | `command-input.test.ts` (2), `status-panel.nfr.test.ts` (5) | as R1. In `command-input`, a plant inside the deps path of `PRODUCTION_DEPS` (`src/move-input.ts:108`) must reach the count |

- **Behaviour under `{ spy: true }`:** it spies every export of the module for the whole file, and each spy calls
  through. So no other test in the file changes behaviour; `F3` was green on them.
- **`V4`'s set is wider than the rewritten files:** the 13 files `A2` turned red, plus `src/book.test.ts` (ruling 3),
  plus the ticket's C4 set. `NFR-001` (`gameend.nfr`), `NFR-005` (`zobrist.nfr`) and `ABC-025` `N1` (`san.nfr`)
  are each shown red, as the ticket says.
- **Not pinned: `experimental.nodeLoader`.** Turning it off fails **loudly** (`READINGS` R7: "Vitest mocker was
  not initialized"), so it needs no pin.

### Ruling 2: `san.test.ts` ABC-013 A20

- **Replace** `expect(Object.keys(namespace)).toEqual(["toSan", "parseSan"])` **with**
  `expect(Object.keys(namespace).sort()).toEqual(["parseSan", "toSan"])`.
  - The file's `expect(` count is unchanged (1 → 1 in that `it`), and the rest of the `it` is unchanged.
  - The comment gains one sentence: a native namespace lists its keys sorted, so the row pins the set, not the order.
- **The property it must still pin:** the module's run-time surface is **exactly** `toSan` and `parseSan`.
  - No third export, and no alias, may appear: an alias such as `toSanX` would also make the surface grow.
  - None of them may be lost.
  - The import set below it (the row's stated guard) is untouched.
  - **Declaration order was never the property.** `ABC-032` moved the surface "by exactly the one export". The
    order only came from the 3.x runner.
- **Armed** (`READINGS` R4): adding `export const PLANT` turns it red, and so does adding `export { toSan as toSanX }`.
  The old form is red on 4.1.11 with no plant. The sorted form is order-free by construction. It was not run on
  3.2.7.

### Ruling 3: `book.test.ts` ABC-094 A2, re-grounded without `vi.resetModules()`

- **The premise that went silent.** A2 stands in for "two separate processes" (`ABC-094` `A2`) with "two fresh
  module instances". With the runner off, `vi.resetModules()` gives back **the same instance** (`READINGS` R2).
  - So a **load-time** nondeterminism in `book.ts` is invisible to it.
  - Shown: a planted load-time `Math.random()` salt leaves the as-is A2 **green** (`READINGS` R3).
- **The re-grounding:** ``const fresh = (await import(`./book.ts?abc094-a2=${run}`)) as typeof import("./book.ts");``.
  - It replaces `vi.resetModules()` and the plain import, and nothing else changes.
  - Native ESM keys modules by URL, so each query is a new module record, and `book.ts` is evaluated again (`R2`).
  - vitest 4.1 imports test files the same way (`?vitest=<time>`, `test.DNmyFkvJ.js:4292`).
  - **Armed:** the same salt plant turns it **red** (`R3`). `tsc` reports no error in `book.test.ts`, and `biome` is
    clean on it.
  - The `it` title keeps "fresh module instances".
- **What narrows, stated rather than hidden:**
  - Under the 3.x runner, `vi.resetModules()` re-evaluated `book.ts` **and its import graph** (`legal`, `zobrist`,
    `position`, `apply`). The query form re-evaluates `book.ts` only; its imports are shared (`R2`: `dep2` fresh,
    `dep` shared).
  - **Ruled inside the owner's "re-ground":**
    - The criterion's subject is the probe in `book.ts`.
    - A load-time nondeterminism in `zobrist.ts` would break `A1` (the book is keyed by Zobrist hex) and the
      `zobrist` suites.
    - `legalMoves`' order cannot change a pick, because the pick is matched by UCI.
  - **The alternative, rejected:** a `node:worker_threads` run per sequence gives a fresh graph. But it adds a worker
    mechanism to a test, and needs either a non-test helper under `src/` (which breaks the zero-production-lines
    measurement) or an `eval` worker.
  - **The owner may overrule** this (ruling 7).

### Ruling 4: the pin at k = 2 on 4.1.11 (`ADR-0040` d3, amended as decision 2 said; `ADR-0040` addendum 2's literal stays 2)

The `ABC-144` `A7` `it` is edited in place. One new `it` is added (`V3`, declared at `1530b965`). Prototype:
`probe/pin-prototype.diff`. `tsc` exits 0 on it.

- **`A7` asserts:**
  - `pool` is `"threads"` and `maxWorkers` is exactly `2`;
  - `fileParallelism ?? true` and `isolate ?? true` are both `true`;
  - **`Object.hasOwn(test, "poolOptions")` is `false`.** On 4.1.11 the type no longer has `poolOptions`, so today's
    `expect(test.poolOptions)` fails `tsc` with TS2339 (`READINGS` R3);
  - **`test.projects` is `undefined`.** This closes `QE-144-a`: a project's `maxWorkers` outranks the root's;
  - **`VITEST_MAX_WORKERS`, parsed exactly as vitest 4.1.11 parses it:** `if (raw) { const n =
    Number.parseInt(raw); expect(n).toBeGreaterThanOrEqual(1); expect(n).toBeLessThanOrEqual(2) }`. The
    `parseInt` carries no radix, with `// biome-ignore lint/correctness/useParseIntRadix: parsed as vitest parses
    it (QE-151-a)`. Biome's fix is marked unsafe, and the `0x3` plant below catches a re-added radix.
    - **This folds `QE-151-a`:** `0x3` reads 3, so it is red.
    - **It folds `QE-151-b`:** an empty value is ignored, as vitest ignores it.
    - **It adds `≥ 1`:** on 4.1.11, `0` and `abc` both fall back to `cpus − 1` = 7 (`R1`), so a "lowering" value
      is a raise.
  - **The `VITEST_MAX_THREADS` / `VITEST_MAX_FORKS` loop is dropped:** 4.x reads neither.
- **`V3` asserts:** `test.experimental?.viteModuleRunner` is exactly `false`.
- **Plants on a scratch copy** (`npx vitest run src/cli.test.ts -t "ABC-144 A7|ABC-152 V3"`; all were run here,
  `READINGS` R6):
  - **red:** r1 delete `maxWorkers`; r2 `isolate: false`; r3 `VITEST_MAX_WORKERS=8`; r3b `=3`; r4 a `projects`
    entry; `maxWorkers: 3`; `fileParallelism: false`; a `poolOptions` entry; `=0x3`; `=0`; `=abc`; V3 key deleted;
    V3 key `true`;
  - **green:** `=` (empty), `=1`, `=2`.
- **Counts:**
  - `src/cli.test.ts` `expect(`: **+3** (A7 6 → 8, V3 +1). Every other `expect(` in the file is unchanged;
  - tests: **base + 1**; files: base.
- **The header of `vitest.config.ts`** gains one paragraph that names this addendum, the runner key and the pin.
  - Its "`maxWorkers` … `VITEST_MAX_THREADS` / `VITEST_MAX_FORKS` may lower" sentence names `VITEST_MAX_WORKERS`
    instead.
  - The isolation warning stays word for word. Isolation holds by mechanism on 4.1.11 with the runner off
    (`ADR-0042` `D2`(b)).
- **QE's resolved read** is `design-ABC-152/probe/resolved-workers-v4.mjs`: `effectiveWorkers` 2, `isolate` true,
  `viteModuleRunner` false.

### Ruling 5: the reporter (`RISK-ABC143-01`, decision 4), with `QE-149-a` and `QE-149-c`, in one commit

1. **The route** (`probe/rep/reporter-route.diff`):
   - `onFinished` is deleted, and `async onTestRunEnd(testModules, unhandledErrors = [], reason)` keeps the errors
     and calls `super.onTestRunEnd(testModules, unhandledErrors, reason)`;
   - a **load-time check** throws if `JsonReporter.prototype.writeReport` or `.onTestRunEnd` is not a function;
   - the header's "WHAT THIS DOES" item 2 names `onTestRunEnd`.
   - **Read:** the route names `PLANT-timer` in `unhandledErrors` on every run that vitest saw it (9 of 9). The
     current file names it on none (`READINGS` R8).
2. **The unhandled row's plant changes.** On 4.1.11 with the runner off, ABC-149's example is a **race**:
   - a test that schedules a throw and returns at once can have its worker stopped first. Then vitest sees nothing
     and exits 0. That happened in 5 of 10 runs, under either reporter (R8).
   - **The plant becomes** `it("p", async () => { setTimeout(() => { throw new Error("PLANT-timer"); }, 0); await
     new Promise((r) => setTimeout(r, 50)); })`. It was deterministic in 12 of 12 runs.
   - The row's expected fields and query lines are unchanged.
3. **`QE-149-a`:** the READ IT query is re-wrapped with `.test-results/last-run.json` on the line that carries the
   closing `'` (`probe/rep/readit-rewrap.txt`). That one join is the whole change.
   - Pasted with its line breaks, it prints the row's lines by content (`READINGS` R9).
   - Today's wrap blocks on stdin and then runs the path as a command.
4. **`QE-149-c` (`V2`):**
   - all **six** rows run at head **by content**, including the **exit-code-only** row. `ABC-143` `A1`–`A6` are
     also run, and never instead of a row;
   - **QE re-runs `M9b`** (a report-time write of `runState` / `exitCode` from `process.exitCode`). Only the
     exit-code-only row may kill it, and it must;
   - **On 4.x, `coverage.all` is gone.** If `--coverage.thresholds.lines=100` ever passes, the row is re-planted, as
     the block already says.

### Ruling 6: the CPU bar and how it is read (`V9`–`V11`; `ABC-150` `L1`'s form)

- **Trees.** All three are built the same way, with their own `node_modules`, by the same `npm ci` from their own
  lockfile. A symlink to the main checkout would give head vitest 3.2.7.
  - **base (B):** the build's merge-base on `main`, which carries `ABC-149` and `ABC-151`. vitest 3.2.7, runner
    on, k = 2.
  - **head (H):** the branch tip.
  - **twin (T):** a second tree of base.
  - **Logged before the first run, per tree:** `npm ls vitest`, the resolved workers (base and twin with
    `resolved-workers.mjs`, head with `resolved-workers-v4.mjs`) and head's `viteModuleRunner: false`.
- **Instrument:** `.grugops/context/secnfr-ABC-144-window-b/probe/lane144b.mjs`, used in place. It has
  `lane144.mjs`'s CPU and wall columns, plus the thermal and foreign-runner columns that `V11` needs (`ADR-0035`
  d2).
  - **Runs:** width 1; n ≥ 8 scored rounds, rotated; round 0 discarded; GAP 0 (warm); unprofiled.
  - **Asserted on every run:** file and test counts. Base is 56 / 1740; head is 56 / 1741.
- **Step 0 gate** (as `ABC-151`'s window): 4 consecutive 15 s samples at thermal level 0, load1 ≤ 4.0, and no
  `[v]itest` process.
  - Foreign runner presence is logged per run, and named in the grade (`RISK-ABC151-FOREIGN`).
  - Scheduling width 1 across the owner's sessions is the Orchestrator's.
- **`V9`, the bar:**
  - first, the twin must be admissible (`ADR-0035` d1), with twin CPU R ≤ 15 % of base CPU;
  - **H − B paired median CPU ≤ −15 % of B's median → merges;**
  - between −15 % and 0, with the interval wholly below 0 → the owner;
  - anything else → no merge, and the owner gets the `D3` table and this addendum.
  - **The bar is the measured lane CPU.** `ADR-0041`'s ratios and `ABC-147`'s R are never quoted as `V9`, and the
    number is never weakened silently.
- **`V10`, the wall:**
  - H's warm median wall + T's wall R must be ≤ W = 10 s;
  - H − B's paired median wall must be ≤ + T's wall R;
  - **the cooled state is owed when H warm + R > 9.0 s**, because at k = 2 the cooled state was the binding one
    (`ABC-151`: f = 1.023).
- **`V11`, heat:** the level is read before and after every run, and the count at level ≥ 1 is reported per arm. If
  H's count is higher than B's, it goes to the owner. No `A5`-style sequence is owed.
- **The floors `F` (the ticket's § Dependencies asks).** None carries over the merge, because the runner change
  moves every file's per-file cost.
  - After the merge, every set is "a set with none" and takes `ADR-0035` d3's provisional 16 %. Its first three
    readings on 4.1 replace that (`ADR-0035` Rollback: floors are data).
  - **The full lane keeps the recorded `F`** (1.72 s CPU / 3.25 s wall) until a twin R is read on 4.1 runner off at
    k = 2.
  - `V9`'s twin R is a 3.2.7, k = 2 reading. It closes `RISK-ABC144-FCAP` for the lane **before** the merge, and
    it is listed, not used, after it.
- **The straddle rule** (`ADR-0040` d5) applies to this merge as the ticket says. That includes `ABC-146` `A1`'s
  `LADDER_DEEP=1` check.

### Ruling 7: cases that need the owner, which no agent rules

- **Any test that only deletion, a skip, a move to an opt-in lane, a merge or a weakened assertion would turn
  green** stops the build. It goes to the owner with its reading.
  - **The same applies to any guard whose plant stays green under every admitted form.** "Armed" is not met, and no
    agent picks a sixth form.
  - **Found so far: 0.** That rests on `F3` (1739 / 1740, the one red being ruling 2), on ruling 3, and on this
    hop's plants on `glyph-mode.nfr`.
  - **Whether it stays 0 across every `V4` plant is `UNKNOWN - verify`** (the build).
- **Ruling 3's narrowing** (`book.ts` fresh, its imports shared). It is ruled, and the owner may overrule it. The
  alternative is the worker route, at its cost.
- **Acceptance of `ADR-0042` with this addendum.** Recommended: it holds the merge, not the build.
- **`V9` outside the merge band**, as the ticket says.

### Residuals

| id | residual | severity | owner |
|---|---|---|---|
| `RISK-ABC152-NEGWORKERS` | On 4.1.11, `VITEST_MAX_WORKERS=-1` makes `vitest run` (full lane, and one file) **exit 0 having run no test**. The pin cannot see it, because nothing runs. The result file reads `success: false` with no counts (`R1`) | low (nobody sets −1 by accident; the result file stays truthful; only an exit-code-only consumer is fooled) | QE (`V2` / `V6` review); Security/NFR |
| `RISK-ABC152-A2-GRAPH` | Ruling 3: A2 re-evaluates `book.ts`, not its imports | low | the owner (ruling 7) |

### What this does NOT change

- **Decision 1:** `~4.1.11`, and vite held at `~7.3.6` by a direct devDependency.
- **`ADR-0040` addendum 2's k = 2, its literals and its rule.** `ADR-0008` d7 still forbids `isolate: false`.
- **`ADR-0041` d3:** no `deps.external` over `src/`.
- **The ticket's other criteria:** `V1`, `V7` (20 runs), `V8` (lanes and paths) and `V12` (Security, and the
  0-production-lines check).
- **`AGENTS.md`.** The worker-cap line, the Stack line, the `RISK-ABC143-01` line and the coverage figure are the
  Scribe's, after the merge.

### Rollback, extended for this addendum

Before the merge, mark this addendum superseded, and decisions 3 and 5 read as before.

After the merge, do all of these in one commit:
- revert the bump: `package.json` and the lockfile;
- remove the runner key, with `V3`'s `it`;
- restore the `A7` env loop to the 3.x names;
- restore the reporter's `onFinished`.

The test rewrites R1–R5, ruling 2 and ruling 3 may stay. Both mechanisms they rest on work on 3.2.7:
- a query import gives a fresh instance;
- `{ spy: true }` counts calls made through an importer (`READINGS` R10).

**`UNKNOWN - verify`:** the whole lane on 3.2.7 with the rewrites was not run here.

## ADDENDUM 2 2026-10-11: rulings 8–11 on QE's `ABC-152` gaps

Written by Architect/Design (task `wave-2026-09-25`, subtask `design-ABC-152-qe-rulings`, ticket `ABC-152`), on
branch `grugops/design-ABC-152-qe-rulings` from `main` `ab0c76e0`. **Rulings only. This hop measured nothing.** It
read sources and ran a grep at the ticket tip `88009d0b`. The inputs are QE's verdict `…ee5be445`, its gap register
`…8bfb6cb5`, and its probe `qe-ABC-152/probe/puzzle-weakened/` (both on `grugops/ABC-152-vitest-4-1-runner-off`).
Note: `.grugops/context/design-ABC-152-qe-rulings/notes/`. **No owner word is owed.** No decision moves, no test is
weakened, and no ruling 7 case is added. The owner may overrule any ruling here.

### Ruling 8 (`QE-152-h`): R2 covers `src/puzzle-suite.test.ts`'s `PUZZLE_DEEP=weakened` site, and `V4`'s set is defined by mechanism in every lane

- **The same form.** The site uses `vi.doMock(p, <factory with a stub>)` and then a dynamic `import(q)`. That is R2's
  from-shape without the `resetModules` call, which the file never needed because it loads the engine once.
- **The to-form is QE's probe diff, exactly:**
  - add `import { evaluate } from "./evaluate.ts"`;
  - add `vi.mock("./evaluate.ts", { spy: true })` at file top;
  - replace the `doMock` block with `vi.mocked(evaluate).mockImplementation(() => 0)`;
  - `return (await import("./engine.ts")).chooseMove` stays as it is.
- **No reset, and never one inside `engineUnderTest()`.**
  - Under `{ spy: true }` the stub is read **at each call**. It is not fixed at import time, as `doMock` fixed it.
  - So a `finally` reset in `engineUnderTest()` would run **before** `runSuite`. That puts the real `evaluate` back
    and makes the demonstration blind again (head's 54/58).
  - The stub must hold through the memoized `gatingRun()`. The only rows after it are the gate row and A3, and both
    read the memoized result. So R2's plant (b) records **"no leak reader"**.
- **Armed, for a red demonstration.** These are R2's two plants, read for a mode whose designed outcome is a red:
  - **At head**, `PUZZLE_DEEP=weakened` exits 1 with **exactly one red, the gate row**
    (`expected 15 to be greater than or equal to 54`). The `PUZZLES` line reads `solved 15/58`, and A3 is green.
  - **15 is the reach proof.** It equals base 3.2.7's weakened count, where `doMock` reached every importer.
    A red at any other count below 54 is partial reach. That stops the hop and returns to the Architect.
  - **Plant (a):** delete the `mockImplementation` line in a scratch copy. The run reads 54/58, the gate row is
    green and A3 is red (`expected 54 to be less than 54`).
  - **Plant (b):** "no leak reader", as above.
  - `PUZZLE_DEEP=1` stays green: 18 passed, 54/58 = the baseline, and the baseline file is unchanged. The default
    lane stays green: 12 passed.
- **"Exits 1" is not evidence for this mode.** The graded reading is which row is red, and the count.
- **`V4`'s set gains a fourth group: every mock mechanism that runs only under an opt-in environment value.**
  - The set is defined by mechanism. `D3`'s default-lane screen is no longer its source.
  - Today the group is exactly this site.
  - A file-top mock that the default lane already exercises, and that a `V4` plant already showed red in the same
    file, is not a separate member. It is the same mechanism in every lane.
- **How the absence of any other site is proven: a census, recorded by the SE.** It runs over `V8`'s 56 lane paths:
  1. list every environment read that gates rows (file, line range, value);
  2. list every `vi.mock`, `vi.doMock`, `vi.unmock`, `vi.doUnmock`, `vi.resetModules`, `vi.importActual`,
     `vi.importMock`, `vi.spyOn` and `importOriginal`, and every dynamic `import(`;
  3. classify each hit of step 2 that sits inside a region of step 1 as exactly one of:
     - **(i)** a file-top mock whose route a `V4` plant already showed red in the same file (name the plant);
     - **(ii)** a spy on an object (`console`, `process.stdout`, a class prototype), not on a module namespace;
     - **(iii)** a dynamic import whose module graph holds no module the file mocks (name the graph);
     - **(iv)** a mock mechanism that runs only in that lane. It joins group 4 and gets its own plant under its
       lane. A **second (iv)** stops the hop. It is armed with an admitted form, or, failing that, it is a ruling 7
       case for the owner.
  - **The Architect's read at `88009d0b` is not a substitute for the census.** Seven files hold both a gate and a mock
    API: `cli`, `levels`, `line-input`, `puzzle-suite`, `search.ordering`, `search.pvs-lmr` and `transposition`.
    Only `puzzle-suite.test.ts:368-374` reads as (iv). Three others are expected:
    - `levels.test.ts:468-469` is (iii): `evaluate.mirror-corpus.ts` imports `apply`, `fen`, `legal` and
      `position`, and `levels` mocks only `engine.ts`;
    - the `vi.spyOn` calls in `line-input` and `search.ordering` are (ii);
    - `transposition.test.ts:650-651` sits in a child-process script string, so it is not a mock site.
- **New residual `RISK-ABC152-PUZZLE-SPY`** (low). The file-top spy wraps `evaluate` in every mode. So
  `PUZZLE_DEEP=1` now runs the shipped engine through a spy that keeps every call until the file ends.
  - The results are unchanged: QE read 18/18 at 54/58.
  - The wall is not read, because QE reads no timing. The 300 s row timeout bounds it.
  - Security/NFR may read the printed `wall` against `AGENTS.md`'s 32–36 s when it runs the lanes. This is not a
    gate.

### Ruling 9 (`QE-152-a`): `vitest/node` is admitted under ruling 5

- **One specifier changes:** `tools/grugops/result-file-reporter.js:76`, from `"vitest/reporters"` to `"vitest/node"`.
  - It is the same class (`===`, QE's probe).
  - The load-time check is unchanged, and it is the guard if that export ever changes.
  - `RISK-ABC143-01` surface 1 (decision 4, `D2` (d)) now reads: "`vitest/node` exports `JsonReporter`".
  - Nothing else in the file changes.
- **It rides in its own commit.** Ruling 5's "one commit" binds the route and the plant block, and they are already
  in `2d523837`.
- **Readings:**
  - `===` is true;
  - `npm test` exits 0 at 56 / 1741 / 0 skipped, with **0 console lines containing `deprecated`**;
  - `V2`'s six rows hold by content at the new head, because `V2` is graded at head and head's reporter changed;
  - `M9b` is QE's to re-run, as `V2` says.
- **This closes `ABC-143` `A5`'s "the console gains no line".** The zero-production-lines measurement stays empty,
  because the file is under `tools/`, not `src/`.

### Ruling 10 (`QE-152-d`): the six stale comments are admitted into `V5` as comment-only lines

- **This ticket's own rewrites made each of them false:**
  - R1: `src/render-seam.test.ts` lines 4 and 6–7, and `src/cli.test.ts` line 5;
  - R2: `tools/opening-book/book.test.ts` line 101;
  - R5: `src/command-input.test.ts` lines 51 and 63;
  - R4: `src/history-pane.nfr.test.ts` line 670.
- **A comment that misstates the mechanism a guard rests on is a trap for the next maintainer.** Correcting it is
  part of the rewrite that made it false.
- **Bounds:**
  - exactly those sites;
  - every changed line is a comment line;
  - each states the mechanism now present;
  - no line-number citation: line 670 names "the static imports after the `vi.mock` blocks";
  - no code line, and no other comment;
  - it rides in its own commit, and `expect(` counts are unchanged.
- **`V5`'s list gains:** "comment lines the rewrites made false, at the sites ruling 10 names".

### Ruling 11 (`QE-152-b`, `QE-152-c`, `QE-152-f`): accepted as residuals; this ticket owes nothing more for them

- **`QE-152-b`.** `RISK-ABC152-NEGWORKERS` widens from `-1` to **any negative value**. It stays low, and its owners
  are unchanged.
  - The Scribe's `AGENTS.md` line stands.
  - No config-load guard is added in this ticket. Nobody sets the value by accident, the result file stays
    truthful, and the guard was not requested.
- **`QE-152-c`.** It is the new `RISK-ABC152-COV-MARGIN` (low, BA/PM: fold it into the next ticket that edits the
  reporter's plant block).
  - The block's re-plant rule stands, and a lost margin fails loudly.
  - **A candidate durable red, `UNKNOWN - verify`:** a threshold no run can meet, such as `lines=101`. It works only
    if vitest 4.1.11 accepts the value, and only if vitest's verdict sets the exit code, not a config validation
    error.
- **`QE-152-f`.** It is the new `RISK-ABC152-SPY-QUERY` (low, the Architect and QE).
  - No production file uses a query import today (grep exit 1).
  - The tripwire is review: any new `?` import of a production module in non-test code is read against the
    `{ spy: true }` guards on that module.
- **`QE-152-e` and `QE-152-g`:** no ruling is needed. Both are pre-existing, and QE recorded them.

### Residuals (addendum 2)

| id | residual | severity | owner |
|---|---|---|---|
| `RISK-ABC152-NEGWORKERS` (widened) | Any negative `VITEST_MAX_WORKERS` makes `npm test` exit 0 having run no test | low | QE; Security/NFR |
| `RISK-ABC152-PUZZLE-SPY` | `PUZZLE_DEEP=1` runs the engine through a recording `evaluate` spy. Its wall is not read | low | Security/NFR (a reading, not a gate) |
| `RISK-ABC152-COV-MARGIN` | The exit-code-only row's precondition holds by 0.57 points of lines coverage on 4.x | low | BA/PM |
| `RISK-ABC152-SPY-QUERY` | A `{ spy: true }` automock does not count calls through a query-string import of the same file | low | Architect; QE |

### What addendum 2 does NOT change

- Decisions 1, 2 and 4, rulings 2–4, 6 and 7, `ADR-0040` addendum 2's k = 2, and `ADR-0008` d7.
- Ruling 7's count: **0 cases**.
- The UAT-waiver measurement (`grep '^src/'` over the delivered diff) stays empty under rulings 8–10.
