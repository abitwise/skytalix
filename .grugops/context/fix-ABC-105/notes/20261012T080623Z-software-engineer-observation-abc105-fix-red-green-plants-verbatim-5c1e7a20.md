---
id: 20261012T080623Z-software-engineer-observation-abc105-fix-red-green-plants-verbatim-5c1e7a20
kind: observation
by: software-engineer
task: fix-ABC-105
at: 2026-10-12T08:06:23Z
verified_by:
confidence: high
refs:
  - ABC-105
  - A3
  - A6
  - A9
  - QE-105-p
  - QE-105-q
  - QE-105-t
  - tools/grugops/qe-hop-integrity.test.ts
  - 20261012T073610Z-qe-e2e-observation-abc105-plants-a3-and-break-it-bf59d633
supersedes:
---

# `fix-ABC-105` red → green: the new assertions go red on every plant QE named, and stay green on the unmutated tool

This is a hand-authored, unsealed note with no stamp, per `AGENTS.md`.

**How it was run.** The tool was copied out of the repo, never edited in it. The copy is a `git archive a0016dbb`
tree in the session scratchpad, with `node_modules` symlinked in. `pristine.js` there is `cmp`-equal to
`git show 60415a8a:tools/grugops/qe-hop-integrity.js`. For each plant, one exact-string edit was applied (each `old`
string matches exactly once, which is asserted), then the test file was run with
`npx vitest run tools/grugops/qe-hop-integrity.test.ts --reporter=json`. The copy was restored from
`pristine.js` and checked with `cmp` after every plant. Both test files ran under every plant: `old` is the test file
at `a0016dbb` (28 tests), and `new` is the file at `4bf6f3ee` (32 tests). The instrument is
`probe/plants.py`, and its raw output is `probe/plants.out.txt`. The final line reads `restored; cmp pristine == tool:
True`.

## Plant text, verbatim (`QE-105-t`)

Each plant is a Python `(old, new)` pair, applied with `str.replace`:

- **`A3-refs-only (coverage() only)`.** This is QE's `QE-105-p` plant: drop condition 4 from `coverage()` only.
  `("    if (!names(note.folder, n)) continue;\n", "")`
- **`A3-refs-only-full`.** It applies the pair above **and**
  `("readNotes(join(root, CONTEXT), sweep ? undefined : (f) => names(f, n))", "readNotes(join(root, CONTEXT))")`
- **`symlink-notesdir-follow`.** This is QE's text.
  `("    if (stat.isSymbolicLink()) refuseLink(join(CONTEXT, folder.name, \"notes\"));\n    if (!stat.isDirectory()) continue;\n", "")`
- **`symlink-notesdir-refusal-only`.** This plant is mine, and narrower: it removes the refusal line only.
  `("    if (stat.isSymbolicLink()) refuseLink(join(CONTEXT, folder.name, \"notes\"));\n", "")`
- **`symlink-notefile-follow`.** This is QE's text.
  `("      if (entry.isSymbolicLink()) refuseLink(path);\n", "")`

## Readings

| plant | old file (28) | new file (32) | the new tests that go red |
|---|---|---|---|
| none (unmutated tool) | 28/28, 0 red | **32/32, 0 red** | none |
| `A3-refs-only (coverage() only)` | 27/28, 1 red (`A5` abc0066) | **29/32, 3 red** | `A3` unfiltered `coverage()` ABC-062/ABC-073; `A9` `--sweep` lists ABC-073. The third red is the `A5` negative, as before |
| `A3-refs-only-full` | 24/28, 4 red | **26/32, 6 red** | both new real-note tests, plus QE's 4 |
| `symlink-notesdir-follow` | 28/28, 0 red | **31/32, 1 red** | `A6` symlink at the notes/ directory |
| `symlink-notesdir-refusal-only` | 28/28, 0 red | **31/32, 1 red** | `A6` symlink at the notes/ directory |
| `symlink-notefile-follow` | 28/28, 0 red | **31/32, 1 red** | `A6` symlink at a note file |

- **The old file's column reproduces QE's readings in `…bf59d633`** exactly: 1 red for `coverage()` only, 4 for the
  full plant, and 0 for each symlink level.
- **`QE-105-p` is closed.** Under the `coverage()`-only plant, `A3`'s own describe block now goes red. Before, only
  `A5`'s synthetic negative did.
- **`QE-105-q` is closed.** Each symlink level now has a test that goes red when its check is removed.

No timing was read.
