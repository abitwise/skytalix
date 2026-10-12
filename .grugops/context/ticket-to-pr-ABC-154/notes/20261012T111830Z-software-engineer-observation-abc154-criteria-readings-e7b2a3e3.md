---
id: 20261012T111830Z-software-engineer-observation-abc154-criteria-readings-e7b2a3e3
kind: observation
by: software-engineer
task: ticket-to-pr-ABC-154
at: 2026-10-12T11:18:30Z
verified_by:
confidence: high
refs:
  - ABC-154
  - ABC-105
  - QE-105-z
  - QE-105-y
  - N8-LANE
  - NFR-008
  - tools/grugops/qe-hop-integrity.test.ts
  - tools/grugops/qe-hop-integrity.js
  - 20261012T111800Z-software-engineer-decision-abc154-positive-control-shape-c8768914
  - 20261012T101500Z-qe-e2e-observation-abc105-qe4-plants-seam-reads-gates-6df3826a
supersedes:
---

# `ABC-154`: the criterion readings. The three QE4 plants go from 0 red to 2 red, head ⊇ base on 32 of 32 plants, reads stay 2, and `--sweep` is byte-identical

This is a hand-authored, unsealed note with no stamp, per `AGENTS.md`. **No timing reading was taken.** RUN
2026-10-12.

## How it was run

- **Base.** `main` `69a1f4b4`, the pull commit. It is a child of the brief's `c4822697` and changes only the
  board and the queue. The tool and the test there have the same blobs as at `c4822697` and `8fd0c233`
  (`4e352175…`, `8c326845…`), so they are `cmp` 0.
- **Head.** Code commit `0f8036f9`.
- **Where.** A `git archive 69a1f4b4` tree in the session scratchpad, outside the repo, with `node_modules`
  symlinked in. It holds 2653 note files. Only the two files under test are swapped in.
- **Harness.** `probe/plants5.py`. It is QE4's `plants4.py` method, re-pointed at base and head.
  - **The plant text is not retyped.** The 23 recorded `PLANTS` dicts are loaded with `ast.literal_eval` from
    QE's, QE2's and fix's probe files at `cfcd59af`. Those blobs are identical at `69a1f4b4`.
  - **The deviation.** `plants4.py`'s own 9 plants are string expressions over named constants (`READ`,
    `LOOP`, `MEMO_A`, …), so `ast.literal_eval` cannot read them. Their assignment statements are parsed out of
    `plants4.py` as committed at `69a1f4b4` and evaluated unedited, in file order. The `reads` hooks come from
    the same file the same way.
  - After every plant, the two files are restored and checked equal.
- **Raw output:**
  - `probe/plants5.base-first.out.txt` is the base pass, run **before** any edit (Test note 1);
  - `probe/plants5.out.txt` is base then head. Its base lines are `cmp` 0 to the base-first pass;
  - `probe/superset5.out.txt` is the by-name comparison;
  - `probe/reads5.out.txt` and `probe/sweep5.out.txt` are the read count and the sweep comparison.

## `A1`: the six readings (3 plants × base and head)

| plant | base test | head test |
|---|---|---|
| `q4a-readNotes-unfiltered-drops-secnfr` | **32/32, 0 red** | **30/32, 2 red**: `A3` unfiltered, `A9` --sweep |
| `q4a-readNotes-unfiltered-drops-quality-gate` | **32/32, 0 red** | **30/32, 2 red**: `A3` unfiltered, `A9` --sweep |
| `q4b-both-memos-empty (two faults)` | **32/32, 0 red** | **30/32, 2 red**: `A3` unfiltered, `A9` --sweep |

The unmutated head reads 32/32 and 0 red. **PASS.**

## `A2`: head ⊇ base by test name, 32 of 32 plants

| plants | base red → head red | red at head only |
|---|---|---|
| the 23 recorded (none included) | equal on every row: 0, 6, 1, 3, 3, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 3, 4, 1, 1, 3, 1 | none, identical sets |
| `q4a-main-sweep-read-drops-secnfr` | 1 → 2 | `A9` --sweep |
| `q4a-main-sweep-read-drops-quality-gate` | 1 → 2 | `A9` --sweep |
| `q4a-readNotes-unfiltered-drops-secnfr` | 0 → 2 | `A3` unfiltered, `A9` --sweep |
| `q4a-readNotes-unfiltered-drops-quality-gate` | 0 → 2 | `A3` unfiltered, `A9` --sweep |
| `q4a-readNotes-unfiltered-empty` | 8 → 10 | `A3` unfiltered, `A9` --sweep |
| `q4b-allNotes-memo-empty` | 1 → 2 | `A3` unfiltered |
| `q4b-allNotes-memo-stale-filtered` | 1 → 2 | `A3` unfiltered |
| `q4b-plainSweep-memo-empty-notes` | 1 → 2 | `A9` --sweep |
| `q4b-both-memos-empty (two faults)` | 0 → 2 | `A3` unfiltered, `A9` --sweep |

- `superset5.py` reads `head ⊇ base on 32 of 32 plants`.
- No plant was n/a in either pair.
- **Every per-plant sweep is identical, base vs head.** The unmutated sweep reads 133/38/78/2/15, not QE4's
  132/38/77/2/15: `ABC-105` itself has since become `Done` and covered.

**PASS.**

## `A3`

`git diff -U0 69a1f4b4 0f8036f9 -- tools/grugops/qe-hop-integrity.js` changes one hunk, `@@ -223 +223 @@`:
- `*   command line can supply neither` becomes `*   command line can supply none of snapshotIds, root and notes`.

That line is the continuation of `main`'s `@param … [options]` line, inside the JSDoc block (lines 220–225). The
word "neither" no longer appears in that block. **PASS.**

## `A4`

- **Changed files.** `git diff --name-only 69a1f4b4 0f8036f9` lists exactly the two files. `--name-status`
  shows 0 added (`A`) files.
- **Spawn sites.** The page's grep reads **0** at head and 0 at base.
- **`it`s.** The count is 22 at base and 22 at head, so 0 new `it`.
- **Whole-tree reads of the real notes,** by instrumenting `readNotes` in the scratch copy:

  | pair | tests | real whole-tree reads | `readNotes` calls |
  |---|---|---|---|
  | base | 32/32 | **2** | 23 (11 filtered, 10 synthetic) |
  | head | 32/32 | **2** | 23 (11 filtered, 10 synthetic) |

  Both pairs read 5390 note files, which is 2.032 × the tree.
- **`--sweep`.** The base tool and the head tool on the same tree both exit 1. Their stdout is 1934 B against
  1934 B, identical, and stderr is identical. `--sweep --json` is 21682 B against 21682 B, identical.
- **`npm test`.**
  - **Base:** the scratch tree with the base pair: exit 0, 57 files, 1775 tests, 0 pending, 0 todo, `success: true`.
  - **Head:** the worktree: exit 0, 57 files, 1775 tests, 0 pending, 0 todo, `success: true`. That is base + 0.
  - **Integrity:** `No findings.`, exit 0.

**PASS.**

**UAT-waiver reading:** `git diff --name-only 0f8036f9~1 0f8036f9 | grep -v '\.test\.ts$' | grep '^src/'` is
empty.

`git status --porcelain` in the worktree after the plants showed only the two intended edits and this folder.
