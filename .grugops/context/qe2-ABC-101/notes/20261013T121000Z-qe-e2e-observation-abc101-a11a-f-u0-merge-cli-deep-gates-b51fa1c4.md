---
id: 20261013T121000Z-qe-e2e-observation-abc101-a11a-f-u0-merge-cli-deep-gates-b51fa1c4
kind: observation
by: qe-e2e
task: qe2-ABC-101
at: 2026-10-13T12:10:00Z
verified_by:
confidence: high
refs:
  - ABC-101
  - ABC-014
  - src/render.ts
  - src/render.test.ts
  - src/__snapshots__/render.test.ts.snap
  - 20261013T112345Z-frontend-ui-artifact-ref-abc101-piece-polarity-contract-1c687529
  - 20261013T115600Z-software-engineer-artifact-ref-merge-a11-commit-files-gates-a3a7a6f2
  - 20261013T115700Z-software-engineer-observation-a11a-f-readings-u0-pty-frames-1c89fdcb
supersedes:
---

# `A11a`–`A11f` and the widened `A9`, re-read by QE on `081c3715..d22a709f`: all MET. Merge `081c3715` brings 0 `src/` lines; `CLI_DEEP` 10/10; gates green

This note is hand-authored and unsealed (`AGENTS.md`: no `finding` is admissible on this install). QE re-read every row
itself. The SE's readings (`…1c89fdcb`) were not reused. Instruments: `probe/a11/a11_static.py` reads git blobs only, and
`probe/a11/a11_runtime.mts` is plain `node`, outside vitest, run against the B arm (`git archive 081c3715`) and the H arm
(`git archive d22a709f`). Both outputs are committed beside them.

## The `A11` commit and the merge

- **`d22a709f` has exactly three files.** Its parent is `081c3715`, and it has one parent. `--numstat`: `src/render.ts` 8/8,
  `src/render.test.ts` +88/−16, `.snap` 78/78. No other path.
- **`git diff --stat 98ea0a84 081c3715 -- src` is empty.** The merge brings 0 `src/` lines.
  `git diff --name-only 98ea0a84 36378ccf -- src` lists the three `A11` files only, so `src/cli.ts` is unchanged since `98ea0a84`.
- **The `-U0` read of `081c3715..d22a709f`** gives 2 hunks in `render.ts`, 4 in `render.test.ts` and 20 in the `.snap`.
  This agrees with the SE's count.
  - `render.ts`: lines 74–75 are the comment and 77–82 are the six pairs. Every changed pair line equals the base line with
    the six pairs swapped, character for character. Line 70 (the `[white, black]` order), the `ascii` table and `renderBoard`
    are byte-identical.
  - `render.test.ts` lines 1..634 differ at 16 lines only: `:316-317`, `:322-323` and `:411-422`. Each head line is the base
    line with the six pairs swapped. Everything after line 634 is the pure-append `A11` block (+72).
  - **`A9` (as widened 2026-10-13): MET.**

## Criteria

| row | QE reading | state |
|---|---|---|
| `A11a` | Runtime, all 6 matrix FENs × 2 orientations: **330 piece cells, 0 off the contract table** (each type's exact code point, read with the orientation rule). The test's own table is written as numbers and equals the contract | **MET** |
| `A11b` | The 14 strings were parsed from the **ticket page's** `A11b` bullet, not from the test. The white-bottom 9 rows are exact; the black-bottom rows 1–2, rows 7–8 and the label row are exact. The test literal equals the same 14 strings | **MET** |
| `A11c` | Runtime: **24/24** matrix cells are 9 rows × 18 code points × 18 UTF-16 units, and **24/24** have 0 `U+001B` | **MET** |
| `A11d` | QE's own `.snap` parse (`exports[\`…\`] = \`…\`;`). Base and head both have **24 keys**, and the key sets are identical. There are 12 `unicode` and 12 `ascii` keys, and no key names both or neither. **12 bodies changed, all of them `unicode`; this is exactly the `unicode` set.** **12/12 `ascii` bodies are byte-identical.** The text outside the entries is byte-identical. Every changed body is the base body with the pairs swapped, with 0 characters differing outside the 12 glyphs. Runtime cross-check: the `ascii` frames give H == B byte for byte (12/12), and the `unicode` frames give H == swap(B) ≠ B (12/12). The ASCII literal rows in `render.test.ts` are not in the diff | **MET** |
| `A11e` | The named `it`s are `:169` ("…inside U+2654-U+265F, white and black on different code points"), `:206`/`:235` (shading, `a1`/`h8`, empty squares), the `2a` rows, `render-seam`, `frame*` and `cli.test` `A7`. None of their lines is in the diff: lines 1..634 differ only at the 16 re-pin lines, and the commit touches no other test file. All are **green** in QE's full run (1792/1792) | **MET** |
| `A11f` | **Exactly 8 re-pinned `it`s.** One white-bottom literal `it` (`:301`, which holds both the ascii literal, unchanged, and the unicode literal, re-pinned). The six snapshot `it`s from the one loop at `:342-352` (their `.snap` bodies). The one oracle `it`, "matches a frame derived independently … 24 matrix cells" (`:467`). It reaches the table through `expectedFrame`, which reads `UNICODE_BY_FEN_LETTER` at `:442`; the table is declared at `:410`, and both lines are unchanged. **Strength, before and after:** the same matcher on the same call (`toEqual` on a full literal, `toMatchSnapshot` per mode × orientation, `toEqual` against `expectedFrame`); only the literal glyphs moved, each by the contract swap. `expect(` count 51 → 61 (+10, all in the new block). `.skip(`/`.todo(`/`.only(`/`.skipIf(`/`.runIf(`/`.fails(` are 0 at base and 0 at head. Every base `it` title is present at head; the 3 added titles are `A11a`/`A11b`/`A11c`. Skip count 0 (`last-run.json`: pending 0, todo 0). The SE's red-first order is the SE's report and QE cannot re-observe it; the commit's shape is consistent with it | **MET** |
| `A11g` | The owner's eye at UAT. **Not QE's** and not automatable (`2c`) | owed |

## `CLI_DEEP` (run once, as the brief asks)

`CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts` ran on the QE worktree (src = `d22a709f`'s), 12:07:49Z.
**Exit 0, 1 file, 10 passed (10).** `abc095-book-absent-*` in `os.tmpdir()`: **0 before, 0 after**. The three idle
`node src/cli.ts` leftovers were 3 before and 3 after, untouched. No time was recorded.

## Gates on the QE tree (HEAD `ee688564`, src byte-identical to `d22a709f`), 12:08:07Z–12:08:16Z

| gate | reading |
|---|---|
| `npm run -s lint` | exit 0, 113 files, no fixes |
| `npm run -s typecheck` | exit 0 |
| `npm run -s build` | exit 0 |
| `npm test` | exit 0. **58 files, 1792 passed** (1792) |
| `.test-results/last-run.json` | `success: true`, 58 files, 1792 total, 1792 passed, 0 failed, 0 pending, 0 todo |
| `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | `No findings.`, exit 0 |

## UAT waiver reading

`git diff --name-only 3ea3e352...36378ccf | grep -v '\.test\.ts$' | grep '^src/'` (the merge-base is `3ea3e352`) gives
`src/__snapshots__/render.test.ts.snap`, `src/cli-options.ts`, `src/cli.ts`, `src/level-seam.ts` and `src/render.ts`.
**The list is not empty, so the waiver does not apply.** The owner's UAT word is owed, and it now includes `A11g`. `A11` alone
(`081c3715..d22a709f`) gives `.snap` and `src/render.ts`. One quirk of the rule's filter: it passes the `.snap` as if it
were a production file (`QE2-101-b`, INFO). Here it changes nothing, because `src/render.ts` is production.
