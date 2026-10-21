---
id: 20261021T080448Z-software-engineer-observation-abc160-readings-381bd855
kind: observation
by: software-engineer
at: 2026-10-21T08:04:48Z
verified_by:
confidence: high
sealed: false
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-160
refs: [ABC-160, ABC-155, ABC-153, ABC-145, QE-155-a, NFR-008, 20261012T065549Z-qe-e2e-observation-abc153-plants-3d6ce640]
supersedes:
---

# SE `ABC-160`: criterion and mutant readings (RUN 2026-10-21)

Hand-authored and unsealed. **No timing reading was taken** (N8 and NFR-008 are QE's).

## `A2`: the 16 readings (lane `NODE_OPTIONS=--max-old-space-size=400 npx vitest run tools/opening-book/book.test.ts`)

Scratch copy: `git archive 51503331` in the session scratchpad, OUTSIDE the repo, with `node_modules` symlinked.
Only `checkThenWriteBook` in `tools/opening-book/compile.ts` differs per build (`probe/plant.mjs`). Base test is
`51503331`'s `book.test.ts`; head test is `1d2fd467`'s. The base readings were taken BEFORE the edit was written.
The worktree was never planted (`git status --porcelain` empty), and the scratch copy was restored to pristine (`cmp` 0).

| build | mutation | base test | head test |
|---|---|---|---|
| unmutated | none | exit 0, 19 passed | exit 0, 19 passed |
| `Q-SUFFIX8` | `actual.slice(-8) !== expected[file].slice(-8)` | **exit 0, 19 passed** | **exit 1, 1 failed / 18 passed**: `expected [] to deeply equal [ 'a.tsv', …(2) ]` at `book.test.ts:352` |
| `Q-SKIP8` | `actual.slice(8) !== expected[file].slice(8)` | **exit 0, 19 passed** | **exit 1, 1 failed / 18 passed**: `[ 'a.tsv', …(2) ]` at `:352` |
| `Q-PREFIX` | `actual.slice(0, 8) !== expected[file].slice(0, 8)` | exit 1, 1/18: `[ 'e.tsv', …(2) ]` | exit 1, 1/18: `[ 'e.tsv', …(2) ]` at `:330` |
| `Q-CASE` | `actual.toLowerCase() !== expected[file].toLowerCase()` | exit 0, 19 passed | exit 0, 19 passed (equivalent; recorded) |
| `M05` | `for (const file of SOURCE_FILES.slice(0, 1))` | exit 1, 1/18: `[ 'b.tsv', …(2) ]` | exit 1, 1/18: `[ 'b.tsv', …(2) ]` at `:308` |
| `M-SWAP` | `want = expected[b↔c]`, compare and message use `want` | exit 1, 1/18: control throws `b.tsv: sha256 is 28bc0b72…, expected a40a0963…` | exit 1, same, at `:288` |
| `M06` | `for (const file of SOURCE_FILES.slice(1))` | exit 1, 1/18: `[ 'a.tsv', …(2) ]` | exit 1, 1/18: `[ 'a.tsv', …(2) ]` at `:308` |

`Q-SUFFIX8` and `Q-SKIP8` are green on base and red on head, and the new case at `:352` is the killer. `Q-PREFIX`,
`M05`, `M-SWAP` and `M06` are red on both. `Q-CASE` is green on both. The unmutated head is green. **A2 MET.**

## `A1`

On the unmutated head the lane passes 19 of 19. The new case refuses `a.tsv` with all 3 of 3 parts (`a.tsv`, the
altered expected hash, the actual hash) and writes no output (`existsSync` false). Proof it has teeth: the `Q-SUFFIX8`
and `Q-SKIP8` head rows fail at the 3-of-3 assertion (`:352`) and name `a.tsv`. **MET.**

## `A3` (read at tip `1d2fd467` vs base `51503331`)

- `git diff --name-only` = `tools/opening-book/book.test.ts`; 0 added files. One hunk `@@ -335,0 +336,18 @@`,
  inside the `A1/A2` `it` (head 274–354). `fixture()` and every other block are unedited.
- `tools/opening-book/compile.ts` and `data/opening-book/book.json` are `cmp` 0 vs base.
- `spawn|execFile|child_process` in `book.test.ts`: 0.
- `npm test`, base (scratch copy of `51503331`): exit 0, 59 files, 1987 tests, 0 pending, 0 todo. Head: exit 0,
  59 files, 1987 tests, 0 pending, 0 todo; `.test-results/last-run.json` `success: true`. **MET.**
