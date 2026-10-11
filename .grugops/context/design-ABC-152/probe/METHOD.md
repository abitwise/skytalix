# design-ABC-152 probe method: committed before the first graded run

Ticket `ABC-152`, `D1`–`D4`. Architect/Design, task `wave-2026-09-25`, subtask `design-ABC-152`.
Base: the wave tip `4973d8e0` (vitest 3.2.7, vite 7.3.6, `maxWorkers: 3`, Node v26.11.0, Apple M3).

**This is a correctness screen. It reads nothing on a clock.** No wall, CPU or duration figure is recorded.
The JSON reporter's per-test `duration` fields are stripped before any raw file is kept. Three hops run in
parallel (Architect ABC-151, Architect ABC-152, SE ABC-149), so no timing could be read here anyway.

## Trees (all outside the repository, under the session scratchpad)

| tree | content | node_modules |
|---|---|---|
| `base` | `git archive 4973d8e0` | symlink to the main checkout's (vitest 3.2.7) |
| `v41v7` | `git archive 4973d8e0`; `package.json` devDependencies `vitest ~4.1.11`, `@vitest/coverage-v8 ~4.1.11`, `vite ~7.3.6` (added, to hold vite at 7.3.6); `npm install --ignore-scripts` | its own |
| `v41v7-off` | `v41v7` + one key in `vitest.config.ts`: `experimental: { viteModuleRunner: false }` | symlink to `v41v7`'s |
| `v41` | `git archive 4973d8e0`; `npm install -D vitest@4.1.11 @vitest/coverage-v8@4.1.11 --ignore-scripts` (npm's own resolution: vite 8.3.4) | its own |
| `v41-off` | `v41` + the same one key | symlink to `v41`'s |

The package manifest and lockfile of this repository are never touched. Every install is in a scratch tree.

## Arms (each is the full default lane, `vitest run`, the tree's own `vitest.config.ts`)

Run by `screen.mjs` through the tree's own `tools/grugops/run-bounded.js` with a 300 000 ms bound (a hung
lane is killed as a tree, not orphaned). The reporters are `json` (to a file outside the tree) and
`progress-reporter.mjs` (appends `start <file>` / `end <file> <state>` lines, so a killed run still names
the files that never finished).

| arm | tree | what it reads | role |
|---|---|---|---|
| `A0` | `base` | the control: files, tests, 0 red expected | graded control |
| `A1` | `v41v7` | **D3 (i)**: the bump alone, runner on | graded |
| `A2` | `v41v7-off` | **D3 (ii)**: the bump + runner off | graded |
| `S1` | `v41-off` | sensitivity: (ii) on npm's default vite 8.3.4 | reported, rules nothing unless it differs from `A2` |
| `F1` | `v41v7-off` + the prototype rewrites below | feasibility of **D4**: can the runner-off lane go green with only `V5`-shaped rewrites? | graded for D4 only; it is **not** `V4` (no plants are the build's) |

**Per arm, reported:** exit code; files and tests (total, passed, failed, skipped/todo); every red test by
file and full title with the first line of its first failure message; every file that started and never
ended; every collected file path (for `V8`'s list comparison later).

## The rewrite forms declared now, before any reading (`V5`, `D4`)

A red in `A2` is **`V5`-shaped** only if one of these forms turns it green with the file's `expect` count
unchanged and its assertion unchanged:

- **R1, a namespace spy.** `import * as ns from "./m.ts"; vi.spyOn(ns, "f")` →
  `vi.mock("./m.ts", { spy: true })` at the top of the file, and the spy read from the imported binding
  (`vi.mocked(f)` or `ns.f`). Per-test clear/restore calls become `mockClear()` where the original
  restored, because an automocked spy cannot be restored on 4.x (migration guide) and its implementation is
  the original anyway. Same callee, same call-count assertion.
- **R2, a fresh-registry stub.** `vi.resetModules(); vi.doMock(p, factory); await import(q)` →
  `vi.mock(p, { spy: true })` at the top of the file and, inside the one test,
  `vi.mocked(f).mockImplementation(<the factory's stub>)` restored to the original in `finally`. Same stub,
  same callee, same assertion.

**Any other red is not `V5`-shaped.** It counts toward `D4` and is reported by name, not fixed.

## Static reads declared now (not the screen)

- Every `vi.resetModules()`, `vi.doMock()`, `vi.doUnmock()`, `import.meta.env` and `require(` in a test file
  is read against the runner-off limitations (vitest docs: `vi.resetModules()` cannot invalidate ES
  modules). A test that stays green but whose premise no longer holds is a **silent premise** and is ruled
  separately. The screen cannot see it.

## Mechanism reads (no lane)

- **`D2`(a) workers:** `resolved-workers-v4.mjs` prints the resolved `maxWorkers` and the effective count by
  4.1.11's `resolveMaxWorkers` (project, then root, then `availableParallelism() − 1`), under: no env;
  `VITEST_MAX_THREADS=8`; `VITEST_MAX_FORKS=8`; `VITEST_MAX_WORKERS=8`; `VITEST_MAX_WORKERS=2`. In `v41v7`
  and `v41v7-off`. Read once each.
- **`D2`(b) isolation, ARMED:** `iso/` holds a module with a module-level counter and two test files that
  each increment it once and assert it reads 1. Run with `maxWorkers: 1`, runner off, `isolate` true (expect
  green) and `isolate: false` (expect red: the armed control). The same pair under runner on for reference.
- **`D2`(d) reporter:** in `v41v7-off`, `npm test` once green, and once with QE's unhandled plant (a test
  that throws from a `setTimeout`). Reported: exit, `success`, `exitCode`, and the count of the thrown text in
  the file. That is ABC-149's "unhandled" row, read on 4.1.11. Not `V2` (the build's).

## Pins declared now, before any reading (`V5` "test count = base + the pins declared")

- **`V3`:** **+1 test**, one `it` in `src/cli.test.ts` that asserts the config's
  `test.experimental.viteModuleRunner` is exactly `false`.
- **`V6`:** **+0 tests.** The `ABC-144` `A7` `it` is edited in place (the env name, a `projects` check).
- So **head test count = base + 1**, and file count = base.

## The split (`D4`, the ticket's, pre-registered there and repeated here)

If no runner-off configuration reaches a green lane with only R1/R2 rewrites (`F1`), **no runner-off lever
is built**, and the D3 table goes to the owner with two options (ship 4.1 runner on; stay on 3.2.7). No agent
picks between them.
