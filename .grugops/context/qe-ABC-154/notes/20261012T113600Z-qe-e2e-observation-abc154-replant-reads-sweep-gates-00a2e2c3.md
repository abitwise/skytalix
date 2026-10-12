---
id: 20261012T113600Z-qe-e2e-observation-abc154-replant-reads-sweep-gates-00a2e2c3
kind: observation
by: qe-e2e
task: qe-ABC-154
at: 2026-10-12T11:36:00Z
verified_by:
confidence: high
refs:
  - ABC-154
  - ABC-105
  - QE-105-z
  - QE-105-y
  - QE-105-p
  - A1
  - A2
  - A3
  - A4
  - tools/grugops/qe-hop-integrity.test.ts
  - tools/grugops/qe-hop-integrity.js
  - 20261012T111800Z-software-engineer-decision-abc154-positive-control-shape-c8768914
  - 20261012T111830Z-software-engineer-observation-abc154-criteria-readings-e7b2a3e3
  - 20261012T101500Z-qe-e2e-observation-abc105-qe4-plants-seam-reads-gates-6df3826a
supersedes:
---

# QE `ABC-154` at `0f8036f9`: A1 to A4 re-read independently, all hold. QE's own plants are all caught at head. One residual: the two-point control is blind to a thinning that spares its two folders

This is a hand-authored, unsealed note (`AGENTS.md`). QE was the only hop running. Every number below was read
from a file in `probe/`; none is estimated.

## Where and how

- **Tree.** An out-of-repo `git archive beb0991c` tree in the session scratchpad, with `node_modules` symlinked.
  It holds 2656 note files. Only the tool and the test are swapped in.
- **Pairs.**
  - *base* is the test + tool at `69a1f4b4` (blobs `8c326845` / `4e352175`; the same as `8fd0c233`, QE4's "new");
  - *head* is the test + tool at `0f8036f9` (blobs `bf0ea7d5` / `cc0f4157`; `beb0991c` holds the same).
- **After every plant** both files are restored and compared to the pair. Every run ends with
  `tool == 0f8036f9: True ; test == 0f8036f9: True`.
- **Harness.** QE's own `probe/plants6.py`; it is not the SE's `plants5.py`.

## The plant text: the SE's load reproduces QE4's exactly (`probe/load6.out.txt`)

- **QE's load.** `plants4.py` (blob `29917268`, as added in `5843e282` and unchanged at `69a1f4b4` and `beb0991c`)
  is executed **verbatim up to its `PAIRS = ` line**, with argv as QE4 ran it. That prefix holds QE4's own loader
  for the 23 recorded dicts (`ast.literal_eval`) and its own 9 definitions. So the dicts are the very objects QE4's
  process applied.
- **The SE's load.** `plants5.py` ast-parses the assignments and execs them. Run the same way, it gives the
  **same names, order and edit text on 32 of 32 plants**.
- **Behaviour against QE4's output (`probe/compare6.out.txt`).** QE's base rows run the same blobs as QE4's
  `[new]` rows in `plants4.out.txt`. They read **the same pass count and the same red test names on 32 of 32**.
  Only the sweep counts differ, by board drift: 133/38/78/2/15 now against 132/38/77/2/15 then.

## `A1`: the six readings (`probe/plants6.out.txt`)

| plant | base test | head test |
|---|---|---|
| `q4a-readNotes-unfiltered-drops-secnfr` | 32/32, **0 red** | 30/32, **2 red**: `A3` unfiltered, `A9` --sweep |
| `q4a-readNotes-unfiltered-drops-quality-gate` | 32/32, **0 red** | 30/32, **2 red**: `A3` unfiltered, `A9` --sweep |
| `q4b-both-memos-empty (two faults)` | 32/32, **0 red** | 30/32, **2 red**: `A3` unfiltered, `A9` --sweep |
| unmutated | 32/32, 0 red | 32/32, 0 red |

**MET.**

## `A2`: head ⊇ base by test name, 32 of 32 (`probe/compare6.out.txt`)

- **The 23 recorded plants** have identical red sets at base and head.
- **The 9 `plants4.py` plants** each gain red tests at head and lose none:
  - the two `main` sweep-read plants go 1 → 2 (+`A9` --sweep);
  - the two unfiltered drops go 0 → 2;
  - unfiltered-empty goes 8 → 10;
  - the three single-memo plants go 1 → 2;
  - both-memos goes 0 → 2.
- No plant was n/a in either pair. **MET.**

## QE's own plants (brief item 2; `probe/own6.out.txt`)

| plant | base red | head red | caught at head by |
|---|---|---|---|
| `readNotes` drops notes whose `by:` is `security-nfr`, on every read | 1 (`A9` ABC-072 `--ticket`) | **3** | `A3` unfiltered, `A9` --sweep, `A9` ABC-072 |
| the same, on the unfiltered read only | **0** | **2** | `A3` unfiltered, `A9` --sweep |
| drops a deterministic half (filename hash), every read | 9 | 11 | adds `A3` unfiltered, `A9` --sweep |
| the same, unfiltered only | 6 (all `A6`, synthetic trees) | 8 | adds `A3` unfiltered, `A9` --sweep |
| drops a random half (`Math.random`), unfiltered only, 3 runs | 6 / 5 / 4 | 5 / 4 / 4 | `A3` unfiltered and `A9` --sweep in all 3 runs, plus `A4`, `A6` |
| `allNotes()` memo from a FILTERED read of `quality-gate-ABC-031-qe-2026-08-17` only | 1 (`A4`) | 2 | `A3` unfiltered, `A4` |
| `allNotes()` memo from a FILTERED read of `secnfr-ABC-072` only | 1 (`A4`) | 2 | `A3` unfiltered, `A4` |

- **The head test catches every one** (≥ 2 red).
- The by-`security-nfr`-unfiltered drop is a new instance of `QE-105-z`. It is 0 red at base, so the gap
  `ABC-154` closes was real for that plant too.
- Random runs are single samples. They differ run to run and are not compared as base against head.

**The four new expects, removed one at a time and in pairs** (head test; the faults are the A1 three, the two
single-memo plants, QE's unfiltered by-secnfr and hash-half, and the two one-folder memos):
- **All four present:** every fault reads ≥ 2 red.
- **No removal leaves any fault uncaught.** The minimum is 1 red in every variant.
- **The `A3` pair removed:** `A3`'s unfiltered check is vacuous again.
  - Each A1 fault is caught only by `A9` --sweep.
  - The `allNotes()`-memo-empty fault and both one-folder memos are caught only by `A4`.
- **The `A9` pair removed:** each A1 fault is caught only by `A3` unfiltered.
- **Single removals:**
  - Without the `A3` `ABC-031` expect, the quality-gate drop no longer turns `A3` red, and only `A9` catches it.
  - Without the `A3` `ABC-072` expect, the secnfr drop no longer turns `A3` red.
  - The `A9` singles mirror this.
- **So each `A3` expect is load-bearing for `A3`'s own non-vacuity on one drop class, and the `A9` pair is the
  independent second catch.**

## Residual: `QE-154-a` (LOW, test strength; `probe/extra6.out.txt`)

The control checks two ids (two folders). A real-tree, unfiltered-only thinning that spares those two folders
stays **green at head**:

| plant (unfiltered read only) | sweep | base red | head red |
|---|---|---|---|
| drops every real `qe-*` / `qe2-*`…`qe4-*` folder (A6's synthetic `qe-ABC-200` spared, **tuned to the test on purpose**) | 133/38/**14**/**20**/**61** | 0 | **0** |
| drops every `quality-gate-*` folder except `quality-gate-ABC-031*` | 133/38/**69**/**3**/**23** | 0 | **0** |
| the same `qe-*` drop **without** sparing `qe-ABC-200` | 133/38/21/18/56 | 4 (`A6` only) | 4 (`A6` only) |

- Its direction is the same as `QE-105-z`'s: a dropped note can only cost coverage, so the result is a false
  finding and never a false pass.
- The `--ticket` path is filtered and is not affected.
- **`A1` is met as written.** The ticket made the three QE4 plants the criterion and left the sweep counts unpinned
  by design.

## Whole-tree reads (`A4`; `probe/reads6.out.txt`): **2 at base, 2 at head**

- **QE's own hook point,** not QE4's or the SE's: one log line at the **end** of `readNotes`, giving filtered or
  unfiltered, the realpath of the tree, the files read and the notes returned.
- **Both pairs read the same way:**
  - unfiltered on the real tree **2**, each returning 2656 notes (the whole tree);
  - filtered on the real tree 11;
  - other trees 6;
  - real note files read 5396, which is 2.032 × the tree.
- 19 calls completed, against QE4's 23 entry-counted calls. The 4 synthetic-tree calls that throw (refusals, an
  unreadable note) never reach an end-of-function hook.

## `--sweep` (`A4`; `probe/sweep6.out.txt`)

- Base tool and head tool on the same tree both exit 1.
- **`--sweep` stdout is 1934 B against 1934 B, and `--sweep --json` is 21682 B against 21682 B. Both are `cmp` 0,
  and stderr is `cmp` 0 (0 B).**

## Static (`A3`, `A4`; `probe/static6.out.txt`)

- **`A3`.**
  - `git diff -U0 69a1f4b4 0f8036f9 -- tools/grugops/qe-hop-integrity.js` is one hunk, `@@ -223 +223 @@`, inside
    `main`'s JSDoc (lines 220–225).
  - "neither" appears 0 times in that block.
  - The tool's one other "neither" is line 117, a runtime string in `parseFrontMatter`. It is unrelated.
  - **The tool with comments stripped hashes the same at base and head** (`637dd6fe…`): the change is a comment.
  - **MET.**
- **`A4`.**
  - `--name-status 69a1f4b4 0f8036f9` shows exactly `M` for the two files, with 0 added.
  - Spawn grep reads 0 at `6ae6dd27`, at `69a1f4b4` and at `0f8036f9`.
  - The test count is 32 at both.
  - QE's line-anchored `it(` grep reads 18 = 18. The SE's 22 = 22 used another regex; both are equal base to head.
  - Fenced paths (`src/`, `AGENTS.md`, `tsconfig.json`, `biome.json`, the board, the catalog, ADRs) number 0 in
    `69a1f4b4..beb0991c`.
  - **MET.**

## Gates at QE's tip (`probe/gates6.txt`, 11:33:34–11:33:44Z; tree = `beb0991c` + QE probe files)

- `npm run -s lint` exits 0, with 109 files checked and no fixes. `typecheck` and `build` each exit 0.
- `npm test` exits 0: 57 files, 1775 tests.
  - `last-run.json` was deleted before the run. It reads `success: true`, 1775 passed, 0 failed, 0 pending,
    0 todo.
  - That equals base (the SE's reading), with **+0 tests**.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` prints `No findings.` and
  exits 0.
- The single file passes 32/32.
- `--sweep` exits 1 (133/38/78/2/15). `--ticket ABC-154` exits 1 *before* this hop's decision note existed, which
  is expected.
- **"foreign vitest 4" in the gate log is a self-match.** The gate's own command line contains "vitest"; 0
  processes were found at 11:34Z.
