---
id: 20261012T101500Z-qe-e2e-observation-abc105-qe4-plants-seam-reads-gates-6df3826a
kind: observation
by: qe-e2e
task: qe4-ABC-105
at: 2026-10-12T10:15:00Z
verified_by:
confidence: high
refs:
  - ABC-105
  - N8-LANE
  - QE-105-x
  - QE-105-y
  - QE-105-z
  - QE-105-aa
  - A3
  - A4
  - A6
  - A9
  - tools/grugops/qe-hop-integrity.js
  - tools/grugops/qe-hop-integrity.test.ts
  - 20261012T100000Z-software-engineer-decision-abc105-fix2-notes-seam-9c628f28
  - 20261012T101500Z-software-engineer-observation-abc105-fix2-reads-and-plants-c1259095
  - 20261012T101600Z-software-engineer-artifact-ref-abc105-fix2-branch-files-gates-38d73e84
supersedes:
---

# QE4 `ABC-105` at `cfcd59af` (code `8fd0c233`): no catch lost, the `notes` seam is unreachable from argv, whole-tree reads = 2, gates green

This is a hand-authored, unsealed note (`AGENTS.md`). QE4 was the only hop running. Every number was read
from the files in `probe/`; none is estimated. The timing reading is in its own note.

## 1. Plants (`probe/plants4.py`, `probe/plants4.out.txt`)

**Where.** An out-of-repo `git archive cfcd59af` tree in the session scratchpad with `node_modules`
symlinked. It holds 2641 note files.

**The pairs.**
- **old** is the test file at `db1cfb6c` with the tool at `60415a8a`. The tool at `db1cfb6c` is `cmp` 0 to
  that.
- **new** is the test file and the tool at `8fd0c233`. Both are `cmp` 0 to `cfcd59af`.

**The recorded text is loaded, not retyped.** The `PLANTS` dicts are read with `ast.literal_eval` from QE's
`plants.py`, QE2's `plants2.py` and fix's `plants.py` at `cfcd59af`. That gives 23 entries, counting
`none`. fix2 defines no plant text of its own: its `plants3.py` loads the same three dicts, so this is the
same set. The tool and the test are restored and compared after every plant. The last line of the output
reads `tool == 8fd0c233: True ; test == 8fd0c233: True`.

| plant | old red | new red | note |
|---|---|---|---|
| 23 recorded plants (QE, QE2, fix; = fix2's set) | as fix2 | **= old on 23/23** | all 46 rows are identical to fix2's `plants3.out.txt`: pass count, sweep exit, sweep counts and red test names |
| `q4a-main-sweep-read-drops-secnfr`: `main`'s read line skips `secnfr-*` under `--sweep` | **0** | **1** (`A4`) | plain sweep 132/38/77/**0**/**17**; the injected `--json` stays correct and `A4` sees the two differ |
| `q4a-main-sweep-read-drops-quality-gate`: the same, skipping `quality-gate-*` | **0** | **1** (`A4`) | plain sweep 132/38/**67**/**3**/**24** |
| `q4a-readNotes-unfiltered-drops-secnfr`: inside `readNotes`, only when there is no filter | 0 | **0** | 132/38/77/0/17. Not caught by either pair (`QE-105-z`) |
| `q4a-readNotes-unfiltered-drops-quality-gate`: as above | 0 | **0** | 132/38/67/3/24. Not caught by either pair (`QE-105-z`) |
| `q4a-readNotes-unfiltered-empty`: an unfiltered read returns `[]` | 8 | **8** | all in `A6` (synthetic trees); same names |
| `q4b-allNotes-memo-empty`: `allNotesOnce` starts as `[]` | n/a | **1** (`A4`) | `A3`'s unfiltered check passes on `[]` |
| `q4b-allNotes-memo-stale-filtered`: the memo is filled from a `--ticket`-style read (062/073 folders only) | n/a | **1** (`A4`) | `A3` passes |
| `q4b-plainSweep-memo-empty-notes`: the plain sweep memo is run with `notes: []` | n/a | **1** (`A4`) | `A9` passes, because ABC-073 is still listed |
| `q4b-both-memos-empty` (two faults at once) | n/a | **0** | vacuous (`QE-105-z`) |

**The new count is at least the old count on every plant where old applies.** It is equal on 26 rows and
higher on 2: the `main` read-line plants.

**Brief item (a).** The worry was that the seam might let `A4` assert on injected data while the real read
path is broken. The real path the seam bypasses is `main`'s own read line. A bug there is caught by the plain
`plainSweep()`, because `A4` checks its text labels against the injected `--json` counts. The old file, with 3
plain sweeps that agreed with each other, could not see that bug at all.

A bug **inside** `readNotes` that fires only on the unfiltered read reaches `allNotes()` and `plainSweep()`
alike. Neither pair catches it when it drops notes, because `A4` does not pin 77/2/15 by design. So the seam
neither hides that bug nor creates the blind spot.

**Brief item (b).** A broken memo goes **red, not vacuous**, as long as only one memo is broken: 1 red (`A4`)
in each of the three single-fault plants. Two simultaneous empty memos go vacuous. In every memo plant, `A3`'s
unfiltered assertions alone pass on an empty read.

## 2. The seam (`git diff 48a78f08 8fd0c233`; `probe/seam4.mjs`, `probe/seam4.out.txt`)

**The diff is exactly what fix2 said.** In the tool it is 2 files, +17/−7 and `tools/grugops/qe-hop-integrity.js`
is +2/−2: the `@param` JSDoc type gains `notes?: Note[]`, and the read line becomes `notes = options.notes ??
readNotes(...)`. Nothing else changed. `cfcd59af` holds the same bytes as `8fd0c233` for both files. The fenced
files (`src/`, `AGENTS.md`, `tsconfig.json`, `biome.json`, `plans/board.md`) number 0 in `48a78f08..cfcd59af`.

**No argv path reaches `options.notes`.**
- `options` is read in 3 places (`root`, `snapshotIds`, `notes`), and never from `argv`.
- The CLI wrapper is `main(process.argv.slice(2))`, with no options, and the tool reads no `process.env`.
- At the CLI, `--notes`, `--notes=[]`, `--sweep --notes []`, `--sweep --root /tmp`, `--sweep --snapshotIds
  ABC-001` and `--sweep --options.notes=[]` each exit **2** with `unrecognised argument`.

**A6 fail-closed via the CLI** (a scratch tree holding the tool, the board and the snapshot at `cfcd59af`):
- With no `.grugops/context`, `--sweep` and `--ticket ABC-105` exit **2**, and the `ENOENT` goes to stderr.
- With an empty `.grugops/context`, `--sweep` exits **1** (132/38/0/0/94), and `--ticket ABC-105` exits **1**
  as a finding. That is never a silent 0.
- `notes: []` cannot be given at the CLI.

**What the seam does that the CLI cannot** (in memory only):
- With `notes: []` and no context dir, `--sweep` exits 1. The missing dir is never read, so it gives no exit 2.
- With `notes` injected, `--ticket` skips its folder filter, so a malformed note in another folder is reported
  under `--ticket` (exit 1).
- Neither is reachable from argv. The test passes `notes` under `--sweep` only (`QE-105-aa`, INFO).

**Ruling.** The seam does not weaken any criterion.
- **`A4`** ("given `--sweep` on `main`"). The text labels and every finding id come from the plain, uninjected
  `--sweep`, and the injected `--json` counts must equal them. That makes `A4` stronger against a broken read
  line than before.
- **`A6`.** The CLI still exits 2 on a missing board, snapshot or context dir, and on an unreadable note or a
  symlink.
- **Test note 3.** There is still no override flag.
- **§ Scope 5** ("the command line has no way to supply a snapshot"). It holds for `notes` too.

**`QE-105-y` (LOW, wording).** The JSDoc continuation line still reads "the command line can supply
**neither**", but it now covers three options (`snapshotIds`, `root`, `notes`). The SE flagged it in
`…38d73e84`. QE names it and does not edit it.

## 3. Whole-tree reads (`plants4.py reads`, `probe/reads4.out.txt`)

QE's own instrumentation logs every `readNotes` call (filtered or not, and on which tree) and every note file
read.

| pair | tests | `readNotes` calls | unfiltered on the real tree | filtered on the real tree | synthetic | real note files read |
|---|---|---|---|---|---|---|
| old | 32/32 | 26 | **5** | 11 | 10 | 13289 = 5.032 × 2641 |
| new | 32/32 | 23 | **2** | 11 | 10 | 5366 = 2.032 × 2641 |

**Confirmed: 2 whole-tree reads.** The 11 filtered reads together come to 0.032 of a tree.

## 4. Gates at the tip (`probe/gates4.txt`; worktree `../wt-qe4-ABC-105` at `cfcd59af`, 10:10:39–10:11:05Z)

- The quality gates all pass:
  - `npm run -s lint` exits 0, with 109 files checked and no fixes.
  - `typecheck` exits 0.
  - `build` exits 0.
- `npm test` exits 0: 57 files and 1775 tests passed. `.test-results/last-run.json` was deleted before the run.
  It reads `success: true`, 1775 passed, 0 failed, 0 pending and 0 todo.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` prints `No findings.` and
  exits 0.
- The single file passes 32/32.
- `--sweep` exits **1**: 132 / 38 / 77 / 2 / 15, malformed 0. The findings are ABC-038 044 060 070 073 074 085
  092 100 108 110 111 112 113 150.

**INFO, not ABC-105's.** `cli-chess-example/node_modules/node_modules` is a symlink to its own parent, dated
10:33 local, which is before this hop. `diff -r` over the arms reports `Directory loop detected` for it. It is
untracked and ignored, and QE did not touch it.
