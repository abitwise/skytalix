---
id: 20261012T120700Z-ba-pm-observation-abc154-fold-readings-3a619733
kind: observation
by: ba-pm
task: bapm-fold-ABC-154
at: 2026-10-12T12:07:00Z
verified_by:
confidence: high
refs:
  - ABC-154
  - QE-154-a
  - QE-105-z
  - tools/grugops/qe-hop-integrity.js
  - tools/grugops/qe-hop-integrity.test.ts
  - .grugops/context/qe-ABC-154/probe/extra6.out.txt
  - .grugops/context/qe-ABC-154/probe/plants6.py
  - 20261012T113600Z-qe-e2e-observation-abc154-replant-reads-sweep-gates-00a2e2c3
  - 20261012T113800Z-qe-e2e-decision-abc154-verdict-pass-with-gaps-n8-met-d9ae510a
supersedes:
---

# `ABC-154` fold: what I read before disposing of `QE-154-a`, and the commands

This is a hand-authored, unsealed note (`AGENTS.md`). **I took no timing reading.** Two hops run in
parallel. I ran no plant: every plant result below is QE's, cited from `qe-ABC-154/probe/`. My own readings
are counts and code reads, taken in worktree `../wt-bapm-fold-ABC-154` at `main` `b89b3fd2`.

## Both blind plants are tuned to the control (`probe/extra6.out.txt`, `probe/plants6.py` lines 204–206)

| plant (unfiltered read only) | base red | head red | how it avoids the control |
|---|---|---|---|
| `q5x-readNotes-unfiltered-drops-qe-folders` | 4 (`A6`) | 4 (`A6`) | it does not: untuned, caught |
| `q5x-readNotes-unfiltered-drops-qe-and-qe2-qe3-qe4` | 4 (`A6`) | 4 (`A6`) | it does not: untuned, caught |
| `q5x-…-drops-qe-folders-real-tree-only` | 0 | **0** | spares `qe-ABC-200` by name; QE's own comment says "tuned to the test ON PURPOSE" |
| `q5x-…-drops-quality-gate-except-ABC-031 (real tree)` | 0 | **0** | spares `quality-gate-ABC-031*` by name, which is the control's own folder |

- **The family drop is caught.** Without the hand-written exception, a `qe*-` prefix drop goes red. The catch
  is `A6`'s four synthetic-tree tests, not the real-tree control, and it was the same at base. `ABC-154` did not
  add that catch.
- **Every other QE plant is caught at head** (`…00a2e2c3` § "QE's own plants"): the by-`security-nfr` drop, the
  hash half, the random half, and both one-folder memos.
- **My reading:** to stay green, a fault has to spare the control's folders by name. I did not search for an
  untuned fault that stays green, so "none exists" is `UNKNOWN - verify`, not a claim.

## `readNotes` reads one entry per file (`tools/grugops/qe-hop-integrity.js` lines 137–177, read)

- It walks every non-symlink folder under the context root. For each `notes/` that is a real directory, it
  pushes **one** entry per `*.md` name. Malformed notes are included and flagged, not dropped.
- An unreadable note throws, and so does a symlink at the folder, at `notes/` or at a note.
- **So, on the real tree, `readNotes(root).length` equals the number of `*.md` names under the
  `<folder>/notes/` directories.** A names-only listing gives that number without opening a file. QE read
  2656 = 2656 at `beb0991c` (`…00a2e2c3` § "Whole-tree reads").
- **At `b89b3fd2`:**
  - `find .grugops/context -path '*/notes/*.md' -type f | wc -l` gives **2660**, and the same without
    `-type f` gives 2660;
  - `find … -type l | wc -l` gives **0**;
  - `test -L .grugops/context` is false.

## The plain sweep is already tied to `allNotes()` (test lines 164–181, read)

- In `A4`'s first `it`, `run(["--sweep","--json"], { notes: allNotes() })` produces the counts.
- The same `it` then requires `plainSweep()`'s stdout to contain each of those count lines and every finding
  id.
- **So pinning `allNotes()`'s size also covers the plain sweep's own read,** unless the two reads diverge only
  on notes that change no count, and those cannot change the sweep's output. This is a reading of the code, not
  a run.

## Folder forms at `b89b3fd2` (the "more ids" option)

Only folders that hold a `notes/` directory are counted, grouped by the prefix before the ticket id.
`.grugops/context` is the root.

| prefix | folders |
|---|---|
| `qe-` | 72 |
| `quality-gate-` | 32 |
| `secnfr-` | 21 |
| `security-nfr-` | 15 |
| `qe2-` | 8 |
| `qe3-` | 2 |
| `qe4-` | 1 |
| `qe-recheck-` | 1 |

There are at least eight forms. **Each id added only moves the blind spot** (QE, `…d9ae510a`): a thinning that
spares the named folders still passes.

## Gates and sweep in the worktree (`b89b3fd2` plus this hop's three files, before the commit)

- `npm run -s lint` exits 0 with 109 files checked. `typecheck` and `build` each exit 0.
- `npm test` exits 0: 57 files, 1775 tests.
  - `.test-results/last-run.json` was deleted before the run. It reads `success: true`, 1775 passed, 0 failed,
    0 pending and 0 todo.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` prints `No findings.`.
- `node tools/grugops/qe-hop-integrity.js --sweep` exits 1 and reads **134/38/79/2/15**, with
  `Malformed front matter: 0`.
  - The two notes in this folder parse.
  - QE's 133/38/78 at `beb0991c` is +1 here: that is `ABC-154`, now `Done` and covered.

## Commands

- `sed -n '137,177p' tools/grugops/qe-hop-integrity.js`, and `sed -n '100,192p'` over the test file
- `find .grugops/context -path '*/notes/*.md' [-type f | -type l] | wc -l`, and `test -L .grugops/context`
- A loop over `.grugops/context/*/` for folders with `notes/`, piped through `grep -iE
  "qe|quality-gate|secnfr|security"`, then the id stripped, then `sort | uniq -c`
- `head -30 .grugops/context/qe-ABC-154/probe/extra6.out.txt`, and `grep -n` over `plants6.py`
