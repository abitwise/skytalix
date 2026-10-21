---
id: 20261021T082220Z-qe-e2e-observation-df4fc9ed
kind: observation
by: qe-e2e
at: 2026-10-21T08:22:20Z
verified_by: 
confidence: high
refs:
  - ABC-162
  - ABC-095
  - AR-095-CWD
  - QE-095-a
  - grugops/ABC-162
  - 3d05e230
  - 51503331
  - grugops/qe-ABC-162
  - src/cli.real-engine.test.ts
  - plans/tickets/ABC-162-the-real-engine-book-child-runs-from-the-tree-root-so-a-cwd-relative-book-read-passes.md
supersedes: 
seal: sha256:0b3855cc80da285b2d42e348216de647bcbbf58dfb74ce12fd430a82814bfbbd
---

# `ABC-162` temp directories: every `mkdtemp` path the lane makes is removed by that exact path, on green, on red and on a failing hook

The removals were checked by exact path, never by glob. Each scratch run had its own `TMPDIR` (`mktemp -d …/qe162/tmpdir-<tag>.XXXXXX`), so no parallel agent's entries can be counted. The real-condition run used the default `os.tmpdir()` and was checked by exact path only.

- **Instrument.** `trace-fs.mjs` (sha256 `17ede2bc…4b7`) was preloaded with `--import` in `NODE_OPTIONS` for the traced runs only. It wraps `fs.mkdtempSync`/`fs.rmSync` and calls `syncBuiltinESMExports`, and logs each returned/removed path. Runner: `run-lane.sh`, sha256 `757e5b57…103`. The children's environment stays empty, so the children are not traced and not changed.
- **Head, clean, traced:** 3 `mkdtemp` and 3 `rm`, each `rm` argument equal to a `mkdtemp` return.
  - `abc095-book-absent-f3Wyde`: the default-lane `ABC-119` row's own copy, whose path is never logged.
  - `abc095-book-absent-PqWxSj`: the shared deep copy.
  - `abc162-neutral-cwd-vArRMF`: A7's cwd.
- **Tip in the QE worktree, default `os.tmpdir()`:** `…/T/abc095-book-absent-Z88V90` and `…/T/abc162-neutral-cwd-fDJ6Bw` were both gone after the run (`test -e`).
- **After every plant run** (base and head for P6b, P6c, P6e and P6f, and the 3 decoy-row runs), every logged `(cwd …)` temp path was gone. The only entry left in each private `TMPDIR` was `node-compile-cache/`. That is the toolchain's module compile cache: it was present after the no-plant base run too, and it is not one of the lane's `mkdtemp` returns, so it is not lane-made.
- **Failing hook (scratch plant: `src/cli.ts` replaced by `setInterval(() => {}, 1000);`, sha256 `f184ed81…9f9`).** Every spawn hits the hang guard and each describe's `beforeAll` throws. The run read rc 1, 2 passed and 9 not run.
  - The trace still shows `mkdtemp …/abc162-neutral-cwd-rUwc2t` → `rm …/abc162-neutral-cwd-rUwc2t`. The `afterAll` guard (`if (neutral !== undefined)`) removes it even when the hook fails.
- **`A3` reading: 0** lane-made entries survive, after green and after red.
