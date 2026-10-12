---
id: 20261012T101500Z-software-engineer-observation-abc105-fix2-reads-and-plants-c1259095
kind: observation
by: software-engineer
task: fix2-ABC-105
at: 2026-10-12T10:15:00Z
verified_by:
confidence: high
refs:
  - ABC-105
  - N8-LANE
  - QE-105-x
  - QE-105-p
  - QE-105-q
  - QE-105-t
  - tools/grugops/qe-hop-integrity.test.ts
  - tools/grugops/qe-hop-integrity.js
  - 20261012T100000Z-software-engineer-decision-abc105-fix2-notes-seam-9c628f28
  - 20261012T095452Z-qe-e2e-decision-abc105-qe3-n8-lane-not-met-15ca6e06
  - 20261012T080623Z-software-engineer-observation-abc105-fix-red-green-plants-verbatim-5c1e7a20
  - 20261012T091900Z-qe-e2e-observation-abc105-qe2-plants-gates-reads-3b7da581
supersedes:
---

# `fix2-ABC-105`: whole-tree reads of the real notes drop from 5 to 2, and every recorded plant turns the same tests red in the new file as in the old

This is a hand-authored, unsealed note with no stamp, per `AGENTS.md`. **No timing was read.** QE re-times.

## How it was run

- **Where.** A `git archive 8fd0c233` tree in the session scratchpad, outside the repo, with `node_modules`
  symlinked in. It holds 2638 note files.
- **The two pairs.**
  - **old:** the test file at `db1cfb6c` (32 tests) with the tool at `60415a8a`. The tool at `db1cfb6c` is `cmp`
    0 to `60415a8a`.
  - **new:** the test file and the tool at `8fd0c233` (32 tests).
- **The plant text is not retyped.** `probe/plants3.py` loads each `PLANTS` dict verbatim with
  `ast.literal_eval`. The sources are QE's `qe-ABC-105/probe/plants.py`, QE2's `qe2-ABC-105/probe/plants2.py`
  and fix's `fix-ABC-105/probe/plants.py`, all as committed at `48a78f08`. Each plant's `old` string is
  asserted to match exactly once in **both** tools. The `notes` seam keeps the `readNotes(...)` text, so the
  read-line plants still apply.
- **Restore.** The tool is rewritten from its pristine text after every plant and checked equal. The final line
  reads `restored to new pair; cmp tool: True ; cmp test: True`.
- **Record.** The raw outputs are `probe/plants3.out.txt` and `probe/reads.out.txt`.

## Whole-tree reads of the real notes, by instrumentation

This is the `reads` mode of `plants3.py`. A scratch copy of `readNotes` appends `contextDir` to a log on every
call with no folder filter. Only paths that equal the archive's own `.grugops/context` are counted. The other
unfiltered calls are `A6`'s synthetic temp trees.

| pair | tests | unfiltered `readNotes` calls | **whole-tree reads of the real notes** |
|---|---|---|---|
| old (`db1cfb6c`) | 32/32 | 13 | **5** |
| new (`8fd0c233`) | 32/32 | 10 | **2** |

The two reads that remain:
- **One plain `run(["--sweep"])`, with nothing injected.** It runs the real end-to-end path. `A9` ("lists
  ABC-073") and `A4`'s text checks share its result.
- **One `readNotes(<real .grugops/context>)` with no filter.** `A3`'s unfiltered `coverage()` uses it. `A4`'s
  `--sweep --json` and all-`Done`-snapshot runs get it through `main`'s new `notes` option.

## Plants: red tests per plant, old vs new

The sweep column is the plant's own CLI `--sweep`, read as Done / pre / qe / substitute / findings.

| plant (source) | old red | new red | same red tests by name | sweep under plant |
|---|---|---|---|---|
| none (unmutated tool) | 0 (32/32) | **0 (32/32)** | yes | 132/38/77/2/15, exit 1, lists ABC-073 |
| `A3-refs-only (coverage() only)` (QE2, fix) | 3 | **3** | yes | 132/38/83/5/6 |
| `A3-refs-only` (QE, same text) | 3 | **3** | yes | 132/38/83/5/6 |
| `A3-refs-only-full` (QE) | 6 | **6** | yes | 132/38/83/5/6 |
| `ticket-filter-removed-only` (QE) | 1 | **1** | yes | 132/38/77/2/15 |
| `A3-exact-refs` (QE) | 3 | **3** | yes | 132/38/76/2/16 |
| `folder-substring` (QE) | 2 | **2** | yes | 132/38/77/2/15 |
| `accept-observation` (QE) | 1 | **1** | yes | 132/38/79/2/13 |
| `accept-own-t2p` (QE) | 1 | **1** | yes | 132/38/80/2/12 |
| `t2p-check-any-folder-substring` (QE) | 1 | **1** | yes | 132/38/80/2/12 |
| `naive-done-all-hits` (QE) | 2 | **2** | yes | 1220/235/827/17/141 |
| `naive-done-distinct` (QE) | 1 | **1** | yes | 137/38/77/2/20 |
| `silent-0-missing-board` (QE) | 1 | **1** | yes | 132/38/77/2/15 |
| `silent-0-missing-snapshot` (QE) | 1 | **1** | yes | 132/38/77/2/15 |
| `flag-force-accepted` (QE) | 1 | **1** | yes | 132/38/77/2/15 |
| `flag-snapshot-accepted` (QE) | 1 | **1** | yes | 132/38/77/2/15 |
| `any-author` (QE) | 3 | **3** | yes | 132/38/86/0/8 |
| `malformed-ignored` (QE) | 4 | **4** | yes | 132/38/77/2/15 |
| `unreadable-note-skipped` (QE) | 1 | **1** | yes | 132/38/77/2/15 |
| `symlink-folder-follow` (QE, QE2) | 1 | **1** | yes | 132/38/77/2/15 |
| `symlink-notesdir-follow` (QE, QE2, fix) | 1 | **1** | yes | 132/38/77/2/15 |
| `symlink-notesdir-refusal-only` (fix) | 1 | **1** | yes | 132/38/77/2/15 |
| `symlink-notefile-follow` (QE, QE2, fix) | 1 | **1** | yes | 132/38/77/2/15 |

- **The new count is ≥ the old count on every plant.** It is equal on all 23 rows.
- **The red tests are the same by name.** A scripted comparison of the sorted `RED:` lines gives 23 of 23
  identical. No catch moved to a different test.
- **The old column matches QE2's new column** in `…3b7da581` on every plant they share. It also extends QE's
  28-test readings in `…bf59d633` with the 4 tests the fix added.

## Every assertion is still present

The diff to the test file only changes where 5 values come from. It adds no `it`, removes no `it`, and drops no
`expect`.
- `A3`'s `all` now comes from `allNotes()`.
- `A9`'s `r` now comes from `plainSweep()`.
- `A4`'s `r` is `--sweep --json` with `{ notes: allNotes() }`.
- `A4`'s `text` now comes from `plainSweep()`.
- `A4`'s all-`Done` run gains `notes: allNotes()`.

`A1`, `A2`, `A5`, `A6`, Test notes 1–5, and the 32 tests and their names are unchanged.
