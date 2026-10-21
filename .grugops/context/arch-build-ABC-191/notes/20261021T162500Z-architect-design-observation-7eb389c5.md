---
id: 20261021T162500Z-architect-design-observation-7eb389c5
kind: observation
by: architect-design
at: 2026-10-21T16:25:00Z
verified_by: 
confidence: high (measured in scratch; no timing)
refs:
  - ABC-191
  - AR-188-BINARY
  - QE-188-a
  - ADR-0036
  - ADR-0036 S1
  - V1.2.5
  - NFR-008
  - 01836fff
  - 56d7215f
  - 11245e3d
  - 6b79aa51
  - 341da4c1
  - d722a6b6
  - .grugops/context/design-F-072-1/probe/clause-b.mjs
  - .grugops/context/design-F-072-1/probe/r2-mutants.sh
  - .grugops/context/design-F-072-1/probe/r2-mutants.out.txt
  - 20261021T154351Z-ba-pm-observation-d4004b45
  - 20261021T154400Z-ba-pm-decision-2edce8cb
supersedes: 
seal: sha256:d90f9e9a2d0a181baa9ea67a830e04088190713bea39f648d579f06b3d00bfcc
---

# ABC-191 builder readings: A2 and A3 red on base's instrument, A4–A7 green at the code commit `11245e3d`, gates at `6b79aa51`

Cites the page `plans/tickets/ABC-191-…md` (§ Scope, § Acceptance) and BA/PM `…observation-d4004b45` as authoritative; this note reproduces the cut's readings on the built harness. Scratch only, under a private `TMPDIR` in the session scratchpad. `<repo>` is the worktree `../wt-ABC-191` on `grugops/ABC-191`, from `main` `01836fff`. Every instrument copy has `node_modules/typescript` beside it and is called by absolute path. git 2.56.0. No timing was taken.

## Instruments
- **base:** `git show 01836fff:<clause-b.mjs>`, sha-256 `55641c55cac2c060`.
- **head:** `11245e3d`, sha-256 `d3abb8478f9e372e` (equal to BA/PM's prototype). `git diff --numstat 01836fff 11245e3d` on the file: `1 1`.
- **`--text` only:** `ce1225a3109951fd`. **`--no-textconv` only:** `6be1a962230be9d5`.

## A2 (red first; harness `56d7215f`, base instrument, `<tip>` `56d7215f`)
- rc **1**. `r2-mutants: limb 1 MISMATCH: BIN-NUL BIN-ATTR`.
- `r2-mutants: limbs 2/3 DIFFER from 341da4c1 (on the same plant; on X1 for BIN-NUL and BIN-ATTR): BIN-NUL:limb2 BIN-NUL:limb3 BIN-ATTR:limb2 BIN-ATTR:limb3`.
- The 10 existing rows: 10 `ok`, 20 `identical`.
- Plant check in the scratch clone: `BIN-NUL`'s holder has `\0` before `` `ABC-095` `` on line 2 (`od -c`); `git diff --stat` reads `Bin 911 -> 816 bytes`. `BIN-ATTR` commits `.gitattributes` = `src/** -diff`. The clone is clean after the run (no `.gitattributes` left).

## A3 (each flag alone)
- **`--no-textconv` only:** rc **1**, `limb 1 MISMATCH: BIN-NUL BIN-ATTR`, the same four limbs `DIFFER`, 10 `ok`. Same as A2.
- **`--text` only:** rc **0**, 12 of 12 `ok`, all comparisons identical. On A6's `TXC` plant it reads `6 + lines, 12 - lines`, not `1 + line, 3 - lines`.

## A4 (green; head instrument, `<tip>` `11245e3d`)
- rc **0**. `r2-mutants: 12 of 12 limb-1 rows as expected; limbs 2 and 3 identical to 341da4c1 on the same plant on 10 of 10, and to 341da4c1 on X1 (plant ids masked) on BIN-NUL and BIN-ATTR`.
- The 10 existing rows equal the prior `r2-mutants.out.txt` (`d722a6b6`) line for line once 8-hex ids are masked.
- Before and after the run: `git status --porcelain` empty in the worktree and the main checkout, both `HEAD`s and the worktree's refs (md5 of `for-each-ref`) unchanged. `.git/info/` holds `exclude` and `refs` only; no `attributes` file.
- This run is `r2-mutants.out.txt` at `6b79aa51`.

## A5 (counts)
- `BIN-NUL`: `src/book-file.ts  (fired by Ruling 2: 2 + lines, 4 - lines; holds limb 1 at <base>)`.
- `BIN-ATTR`: `src/book-file.ts  (fired by Ruling 2: 1 + line, 3 - lines; holds limb 1 at <base>)`, the same as X1's.

## A6 (textconv, by hand)
Scratch clone at `11245e3d`; `TXC` `14bb3ed4` = X1's edit plus committed `.gitattributes` `src/** diff=bin`, checked out; clone-local `diff.bin.textconv "hexdump -v -C"` (the host's global one is the same). `node <instrument> 11245e3d 14bb3ed4 1`:

| instrument | limb 1 | `src/book-file.ts` under `(b1) Ruling 2` | limbs 2/3 vs `341da4c1` on X1 `3f21b6fd`, masked |
|---|---|---|---|
| head | FIRES | `1 + line, 3 - lines` | identical, identical |
| base | FIRES | `6 + lines, 12 - lines` | identical, identical |
| `--text` only | FIRES | `6 + lines, 12 - lines` | identical, identical |
| `--no-textconv` only | FIRES | `1 + line, 3 - lines` | identical, identical |

The X1 reference was taken with X1 checked out, before `TXC` was checked out.

## A7 (git shim; `PATH` shim logging `printf %q` of every argv, then `exec`s the real git)
On `BIN-NUL` (`11245e3d..8e0795d0`), limb 1:
- head: 87 git calls (82 `show`, 2 `ls-tree`, 2 `rev-parse`, 1 `diff`); the one diff is `diff -U0 --no-renames --text --no-textconv 11245e3d 8e0795d0 -- src`; limb 1 FIRES.
- base: 87 git calls; `diff -U0 --no-renames 11245e3d 8e0795d0 -- src`; limb 1 does not fire.
- The two call lists are equal once `--text --no-textconv ` is removed from head's.
- The call is `execFileSync("git", args, …)` at `:75`, an argument array with no `shell` option (`V1.2.5`).

## Gates at `6b79aa51` (the notes commit adds notes only)
- lint rc 0 (`biome check .`, 116 files); typecheck rc 0; build rc 0.
- `npm test` rc 0: 59 files / 1987 tests. `.test-results/last-run.json`: `success` true, 1987 total, 0 failed, 0 pending, 0 todo. Equal to base.
- Skip count 0; `test-skip-integrity.js --skip-count 0`: `No findings.` rc 0.
- Heap 128 (set by `npm test`). No one-file vitest runs.

## Not touched
`.git/info/attributes` was never created or edited in any git dir. The only `.gitattributes` files were in the harness's and A6's scratch clones.
