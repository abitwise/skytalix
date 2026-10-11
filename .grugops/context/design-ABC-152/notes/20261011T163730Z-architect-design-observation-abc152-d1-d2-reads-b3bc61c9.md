---
id: 20261011T163730Z-architect-design-observation-abc152-d1-d2-reads-b3bc61c9
kind: observation
by: architect-design
at: 2026-10-11T16:37:30Z
verified_by:
confidence: high
refs:
  - ABC-152
  - ADR-0042
  - ADR-0040
  - ADR-0008
  - RISK-ABC143-01
  - QE-144-a
  - QE-143-c
  - .grugops/context/design-ABC-152/probe/resolved-workers-v4.mjs
  - .grugops/context/design-ABC-152/probe/iso/
  - .grugops/context/design-ABC-152/probe/raw/resolved-workers-v4.txt
  - .grugops/context/design-ABC-152/probe/raw/isolation-probe.txt
  - .grugops/context/design-ABC-152/probe/raw/reset-probe.txt
  - .grugops/context/design-ABC-152/probe/raw/reporter-read-4.1.11.txt
supersedes:
---

# `ABC-152` `D1`/`D2`: the 4.1.11 target, the worker count, isolation, the runner key and the reporter

This note is hand-authored and unsealed. It is source and docs reads plus one-shot probes in scratch trees. No
timing.

- **D1, the target.**
  - vitest 4.1.11 (`V4` tag; `latest` is 5.0.3); engines `^20 || ^22 || >=24`; peer vite `^6 || ^7 || ^8`.
    `@vitest/coverage-v8` 4.1.11 peers `vitest: 4.1.11`, MIT.
  - **npm's default resolution moves vite 7.3.6 → 8.3.4** (+32 / −114 packages: rolldown and lightningcss
    in, esbuild and rollup out).
  - With `"vite": "~7.3.6"` direct, it reads **+3 / −61 / 20 changed**, `npm ls` exits 0, and the
    install-script set is unchanged (esbuild, fsevents).
- **D2(a), workers.**
  - `VITEST_MAX_WORKERS` is applied last, over the config and over `fileParallelism: false`.
  - `VITEST_MAX_THREADS` and `VITEST_MAX_FORKS` are **inert**: at 8 each, the count resolves to 3.
    `VITEST_MAX_WORKERS=8` resolves to **8**.
  - `poolOptions` is removed (a deprecation, ignored).
  - A project's `maxWorkers` outranks the root's, so `QE-144-a` is live.
  - No `tinypool`; one worker per isolated file.
- **D2(b), isolation.**
  - Armed counter probe, 1 worker: runner off, `isolate` true → green, false → **red**. Runner on: the same.
  - `vi.resetModules()` + `import()` returns **the same instance** with the runner off (exit 1 on the
    freshness assert). So `book.test.ts` ABC-094 A2's premise is gone.
- **D2(c), the key.** `test.experimental.viteModuleRunner: false` (4.1.0+). `experimental.nodeLoader`
  (default true) carries `vi.mock` through `module.registerHooks`, which needs Node ≥ 22.15.
  - A factory mock read by a later top-level `import()` is unapplied (minimal repro);
  - a circular factory exposes `undefined` until it resolves (native mocker source);
  - namespace keys are sorted.
- **D2(d), the reporter.** `vitest/reporters`, `JsonReporter` fields, `writeReport` and the exit hook are
  present. **`onFinished` is gone.**
  - On 4.1.11 the unhandled plant exits 1, with `success` false only through the exit code,
    `unhandledErrors` `[]` and text count 0 (`QE-143-c` / `RISK-ABC143-01` confirmed by run).
