---
id: 20261012T091900Z-qe-e2e-observation-abc105-qe2-plants-gates-reads-3b7da581
kind: observation
by: qe-e2e
task: qe2-ABC-105
at: 2026-10-12T09:19:00Z
verified_by:
confidence: high
refs:
  - ABC-105
  - A3
  - A6
  - A9
  - QE-105-p
  - QE-105-q
  - QE-105-x
  - tools/grugops/qe-hop-integrity.test.ts
  - 20261012T080623Z-software-engineer-observation-abc105-fix-red-green-plants-verbatim-5c1e7a20
  - 20261012T073610Z-qe-e2e-observation-abc105-plants-a3-and-break-it-bf59d633
supersedes:
---

# QE re-check of `fix-ABC-105`: QE's own plants turn the new tests red, the unmutated tool stays green, and the gates are green at `cf353820`

This is a hand-authored, unsealed note with no stamp, per `AGENTS.md`. The tree is QE's own worktree
`../wt-qe2-ABC-105` on `grugops/qe2-ABC-105`, which is off `cf353820`. `node_modules` is a gitignored symlink.

## Plants: QE's own text, re-planted by this hop

- **Where they ran.** Every plant ran outside the repo, in a `git archive cf353820` tree in the session scratchpad.
- **Plant text.** The text is copied from QE's `qe-ABC-105/probe/plants.py`, not from the Engineer's probe. QE's
  three symlink plants are `folder`, `notes/` and note-file.
- **Pristine copies.** `pristine.js` is `git show 60415a8a:tools/grugops/qe-hop-integrity.js`. The two test files
  are taken from `a0016dbb` (old, 28 tests) and `4bf6f3ee` (new, 32 tests).
- **Method.** Each plant asserts that every `old` string matches exactly once. After the run, the tool is restored
  from `pristine.js` and checked with `cmp`.
- **Final line:** `restored; cmp pristine == tool: True ; cmp new test == test: True`.
- **Record.** The instrument is `probe/plants2.py` and its output is `probe/plants2.out.txt`.
- **The sweep column** is the plant's own `--sweep`, read as Done / pre / qe / substitute / findings.

| plant (QE's text) | old file (28) | new file (32) | new tests red | sweep under plant |
|---|---|---|---|---|
| none (unmutated) | 28/28, 0 red | **32/32, 0 red**, skip 0 | none | 132/38/77/2/15, exit 1, lists `ABC-073` |
| `A3` refs-only, `coverage()` only | 27/28, 1 red (`A5` abc0066) | **29/32, 3 red** | `A3` unfiltered `coverage()` ABC-062/073; `A9` `--sweep` lists ABC-073 (plus `A5` as before) | 132/38/83/5/6, `ABC-073` not listed |
| `A3` refs-only, full | 24/28, 4 red | 26/32, 6 red | both of the above, plus QE's original 4 | 132/38/83/5/6 |
| symlink task folder followed | 27/28, 1 red | 31/32, 1 red | none; the existing folder-level test still catches it | unchanged |
| symlink `notes/` dir followed | **28/28, 0 red** | **31/32, 1 red** | `A6` "at the notes/ directory" | unchanged |
| symlink note file followed | **28/28, 0 red** | **31/32, 1 red** | `A6` "at a note file" | unchanged |

- **The old file's column reproduces `…bf59d633`** row for row. The new file's column reproduces the Engineer's
  table in `…5c1e7a20` row for row. QE disagrees on no reading.
- **Each new test has a plant that turns it red.** All four new tests go red on at least one plant, and none goes
  red on the unmutated tool.

## Scope and gates, at `cf353820`

- **Diff scope.**
  - `git diff --stat a0016dbb 4bf6f3ee` shows one file: `tools/grugops/qe-hop-integrity.test.ts`, +34 lines.
  - `git diff --name-only a0016dbb cf353820 -- src tools AGENTS.md tsconfig.json biome.json plans/board.md` lists
    only that test file.
  - `4bf6f3ee..cf353820` touches only notes, the probe, the ticket and the trace.
- **The tool is unchanged.** `git show 60415a8a:tools/grugops/qe-hop-integrity.js | cmp - tools/grugops/qe-hop-integrity.js`
  exits 0.
- **Still 1 file and 0 spawns.** The only test file for the tool is `qe-hop-integrity.test.ts`. A grep for
  `child_process|spawn|execFile|execSync|exec(` hits only the header comment "0 spawns". The new tests use the
  in-process `run()` / `readNotes()` / `coverage()` seam.
- **Gates.**
  - `npm run -s lint` exits 0 (Biome: 109 files, no fixes). `typecheck` exits 0, and so does `build`.
  - **`npm test` exits 0**, with 57 files / **1775 tests** passed.
  - `.test-results/last-run.json` reads `success: true`. It shows 57 test results, 1775 passed, 0 failed,
    0 pending and 0 todo.
  - `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` prints `No findings.` and
    exits 0.
  - The single file reads 32/32.
- **`--sweep` at the tip** reads 132 / 38 / 77 / 2 / 15 with malformed 0 and **exit 1**. It lists 15 findings by
  id, `ABC-073` among them. These are QE's and the Engineer's readings.

## Real-notes reads (the `QE-105-x` cost driver). No timing was taken.

- **The new tests read the real notes tree in full 2 more times.**
  - The `A3` test makes 1 unfiltered `readNotes(<ROOT>/.grugops/context)`. That opens every note file.
  - The `A9` test makes 1 `run(["--sweep"])`, and `--sweep` reads with no folder filter.
- **The two symlink cases read 0 real notes.** Each builds a synthetic temp tree.
- **The file's whole-tree reads go from 3 to 5.** The 3 at `a0016dbb` were all in `A4`: `--sweep --json`,
  `--sweep`, and `--sweep` with the board snapshot. The filtered `--ticket` / `readNotes(…, filter)` reads open
  only folders that name their id. Those are unchanged in number.
- **What it reads.** The scratch archive of `cf353820` holds 2633 note files, and the tip carries the same tree.
- **The cost grows with the record, now on 5 passes.** Per the brief, this hop did not re-time the lane.
