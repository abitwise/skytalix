---
id: 20261012T091902Z-qe-e2e-artifact-ref-abc105-qe2-commands-probe-a1267fb5
kind: artifact-ref
by: qe-e2e
task: qe2-ABC-105
at: 2026-10-12T09:19:02Z
verified_by:
confidence: high
refs:
  - ABC-105
  - .grugops/context/qe2-ABC-105/probe/
supersedes:
---

# QE re-check `qe2-ABC-105`: commands run and the probe

This is a hand-authored, unsealed note (`AGENTS.md`). QE changed no `src/`, `tools/`, `AGENTS.md`,
`tsconfig.json`, `biome.json` or `plans/board.md`. Every plant ran in an out-of-repo copy and was restored, with
`cmp` equal. QE took no timing readings.

## Commands, in `../wt-qe2-ABC-105` at `cf353820`

- `git diff --stat a0016dbb 4bf6f3ee` and `git diff --stat 4bf6f3ee cf353820` give the diff scope.
- `git diff --name-only a0016dbb cf353820 -- src tools AGENTS.md tsconfig.json biome.json plans/board.md` lists the
  test file only.
- `git show 60415a8a:tools/grugops/qe-hop-integrity.js | cmp - tools/grugops/qe-hop-integrity.js` exits 0.
- `npm run -s lint`, `npm run -s typecheck` and `npm run -s build` each exit 0. `npm test` exits 0, with 57 files /
  1775 tests.
- `.test-results/last-run.json` was read with `python3 -I`: `success` true, 0 failed, 0 pending, 0 todo.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` prints `No findings.` and
  exits 0.
- `npx vitest run tools/grugops/qe-hop-integrity.test.ts` reads 32/32.
- `node tools/grugops/qe-hop-integrity.js --sweep` reads 132/38/77/2/15 with malformed 0, exit 1.
- `node tools/grugops/qe-hop-integrity.js --ticket ABC-105` exits 0. Before this note was filed it named
  `qe-ABC-105/…-8094d5b1` and `qe-recheck-ABC-105/…-72ae8565`.

## Probe (`probe/`)

- **`plants2.py`** carries QE's plant text from `qe-ABC-105/probe/plants.py` for six plants: none, `coverage()`-only
  refs-only, full refs-only, and three symlink levels. Each plant runs under the old (`a0016dbb`) and the new
  (`4bf6f3ee`) test file.
- **Running it.** Run it as `python3 -I probe/plants2.py` from a scratch directory that holds `probe/` and
  `plant/`.
  - `plant/` is a `git archive cf353820` tree with `node_modules` symlinked.
  - `probe/` holds `pristine.js` (from `60415a8a`), `old.test.ts` and `new.test.ts`.
  - The probe paths are relative to the script.
- **`plants2.out.txt`** is its raw output. The last line reads
  `restored; cmp pristine == tool: True ; cmp new test == test: True`.
