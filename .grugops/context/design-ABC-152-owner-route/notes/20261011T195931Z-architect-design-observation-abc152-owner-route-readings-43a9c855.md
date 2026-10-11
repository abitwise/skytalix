---
id: 20261011T195931Z-architect-design-observation-abc152-owner-route-readings-43a9c855
kind: observation
by: architect-design
at: 2026-10-11T19:59:31Z
verified_by:
confidence: high
refs:
  - ABC-152
  - ADR-0042
  - QE-151-a
  - QE-151-b
  - QE-149-a
  - RISK-ABC143-01
  - RISK-ABC152-NEGWORKERS
  - .grugops/context/design-ABC-152-owner-route/probe/READINGS.md
  - .grugops/context/design-ABC-152-owner-route/probe/pin-prototype.diff
  - .grugops/context/design-ABC-152-owner-route/probe/rep/reporter-route.diff
  - .grugops/context/design-ABC-152-owner-route/probe/rep/readit-rewrap.txt
  - .grugops/context/design-ABC-152-owner-route/probe/a2-query-form.diff
  - .grugops/context/design-ABC-152-owner-route/probe/a2-plant-book.diff
  - .grugops/context/design-ABC-152-owner-route/probe/a20-sorted-form.diff
  - .grugops/context/design-ABC-152-owner-route/probe/nfr007-r4-form.diff
  - .grugops/context/design-ABC-152-owner-route/probe/nfr007-plants.diff
  - .grugops/context/design-ABC-152/probe/resolved-workers-v4.mjs
supersedes:
---

# `ABC-152` owner-route readings (R1–R10): pass/fail and resolved values on vitest 4.1.11 and 3.2.7. No timing

This note is hand-authored and unsealed. Everything here was RUN in scratch trees under the session scratchpad. The
tree is `git archive main` at `f11afad8`, with vitest 4.1.11, coverage-v8 4.1.11 and vite 7.3.6 (`npm ls` exit 0),
plus the runner-off key. **No wall, CPU or duration was read.** The full tables are in `probe/READINGS.md`.

- **R1, `VITEST_MAX_WORKERS` on 4.1.11.** It is parsed with `Number.parseInt(env)` (no radix), only when it is truthy.
  - `0x3` → 3, and `0x8` → 8 (`QE-151-a` carries to 4.x).
  - **`0` and `abc` → effective 7** (they are falsy, so the count falls back to cpus − 1).
  - `""` is ignored.
  - **`-1` → `vitest run` exits 0 having run no test** (`RISK-ABC152-NEGWORKERS`).
- **R2, module freshness.**
  - With the runner off, `vi.resetModules()` gives back the same instance.
  - A query-string import gives a new instance of that module, while its imports are shared. That holds with the
    runner on and off.
- **R3, `book.test.ts` A2.**
  - A load-time salt plant leaves the as-is A2 green: **blind**.
  - The query form is red on that plant and green without it.
  - `tsc` flags one error in the tree, and it is the pre-existing pin's `test.poolOptions` (TS2339 on 4.1.11's types).
- **R4, `san.test.ts` A20.**
  - The as-is assertion is red, because the keys come out sorted.
  - The sorted form is green.
  - The sorted form is red when an extra export or an alias is planted.
- **R5, `glyph-mode.nfr` (`NFR-007`, expected-0 guards on Node built-ins).**
  - As is: loud (`not a spy`).
  - R4: green.
  - R4 with planted `node:fs`, `node:fs/promises`, `node:child_process` or namespace-import calls: **red ×4**, "got 9
    times".
  - The 3.2.7 base is red on the same `node:fs` plant.
- **R6, the prototype pin on 4.1.11 runner off:**
  - `tsc` 0, and biome 0 with one info (`useParseIntRadix`, an unsafe fix);
  - **red:** r1, r2, r4 (`projects`), `maxWorkers: 3`, `fileParallelism: false`, `poolOptions`, V3 key deleted,
    V3 key true; env `8`, `3`, `0x3`, `0x8`, `0`, `abc`, `" 3"`, `3abc`;
  - **green:** `""`, `1`, `2`, and `VITEST_MAX_THREADS=8` (inert).
- **R7, `nodeLoader: false`.** Loud: "Vitest mocker was not initialized".
- **R8, the reporter.**
  - The `onTestRunEnd` route records `unhandledErrors: ["PLANT-timer"]` on every run vitest saw the error (9 of 9).
    The current reporter records it on 0.
  - **ABC-149's un-awaited `setTimeout` plant races:** in 5 of 10 runs vitest saw nothing and exited 0.
  - The awaited form gave 12 of 12 exit 1.
- **R9, `QE-149-a`.**
  - Today's wrap blocks `jq` on stdin, then runs the path as a command.
  - Joined onto the closing-quote line, it prints `error  PLANT-timer` / `run    exited exitCode=1`.
- **R10, vitest 3.2.7.** The query import and `{ spy: true }` behave the same as on 4.1.11. Counts:
  `render-seam.test.ts` has 9 namespace `vi.spyOn`, and `cli.test.ts` has 1.
