---
id: 20261017T102023Z-qe-e2e-observation-abc155-plants-0877aec3
kind: observation
by: qe-e2e
at: 2026-10-17T10:20:23Z
verified_by:
confidence: high
refs:
  - ABC-155
  - ABC-153
  - QE-153-a
  - QE-153-b
  - QE-153-c
  - QE-155-a
  - QE-155-b
  - QE-155-c
  - tools/opening-book/compile.ts
  - tools/opening-book/book.test.ts
  - 20261012T065549Z-qe-e2e-observation-abc153-plants-3d6ce640
supersedes:
---

# QE `ABC-155`: mutant and plant readings (RUN 2026-10-17, QE re-planted)

Hand-authored and unsealed. The copy is `git archive 819e6933` in the session scratchpad (outside the repo),
with `node_modules` symlinked. Each mutation is an exact-once string replacement: the script refuses if
its anchor does not occur exactly once. Base test = `c9746851:tools/opening-book/book.test.ts` (= `ABC-153`'s
head test). Head test = `819e6933`'s. `compile.ts` is `cmp` 0 at base and head, so one compiler source serves
both. Lane `npx vitest run tools/opening-book/book.test.ts`. The worktree was never planted
(`git status --porcelain` empty). **No timing reading.** In every red row, the failing test is the `A1/A2`
`it` alone, with 0 pending and 0 todo.

## The ticket's `A2` readings (texts: `Q-PREFIX`/`Q-CASE` from `…3d6ce640`, `M05`/`M-SWAP`/`M06` from `ABC-153`)

| build | mutation in `checkThenWriteBook` | base test | head test | page wants |
|---|---|---|---|---|
| unmutated | none | exit 0, 19 passed | exit 0, 19 passed | head green ✔ |
| `Q-PREFIX` | `actual.slice(0, 8) !== expected[file].slice(0, 8)` | **exit 0, 19 passed** | **exit 1, 18 / 1**: `expected [] to deeply equal [ 'e.tsv', …(2) ]` | green → red ✔ |
| `Q-CASE` | `actual.toLowerCase() !== expected[file].toLowerCase()` | exit 0, 19 passed | exit 0, 19 passed | green / green (equivalent) ✔ |
| `M05` | `for (const file of SOURCE_FILES.slice(0, 1))` | exit 1, 18 / 1: `[ 'b.tsv', …(2) ]` | exit 1, 18 / 1: `[ 'b.tsv', …(2) ]` | red / red ✔ |
| `M-SWAP` | `want = expected[b↔c]`, message uses `want` | exit 1, 18 / 1: the control throws `b.tsv: sha256 is 28bc0b72…, expected a40a0963…` | same | red / red ✔ |
| `M06` | `for (const file of SOURCE_FILES.slice(1))` | exit 1, 18 / 1: `[ 'a.tsv', …(2) ]` | exit 1, 18 / 1: `[ 'a.tsv', …(2) ]` | red / red ✔ |

These agree with the SE's table (`…0441078b`), which QE compared against only after its own runs.

## QE's own compiler plants (not named by the ticket)

| id | mutation | base test | head test | reading |
|---|---|---|---|---|
| `Q-PREFIX63` | `actual.slice(0, 63) !== expected[file].slice(0, 63)` (drops ONLY the last char) | exit 0, 19 passed | **exit 1, 18 / 1**: `[ 'e.tsv', …(2) ]` | caught: the narrowest prefix compare dies too |
| `Q-SUFFIX8` | `actual.slice(-8) !== expected[file].slice(-8)` | exit 0, 19 passed | **exit 0, 19 passed** | **survives** (`QE-155-a`) |
| `Q-SKIP8` | `actual.slice(8) !== expected[file].slice(8)` (drops the FIRST 8 chars) | exit 0, 19 passed | **exit 0, 19 passed** | **survives** (`QE-155-a`) |
| `Q-SPARE-E` | full compare for `e.tsv` only, `slice(0, 8)` for the other four | exit 0, 19 passed | **exit 0, 19 passed** | **survives** (`QE-155-b`) |

**Why `Q-SUFFIX8` and `Q-SKIP8` survive:** the near-miss differs from the actual hash ONLY in the last
position, and every other refusal case moves the whole digest. So a compare that keeps the last char and drops
any other position refuses every case the test offers. The new case pins exactly one position: the last.

## Test-quality plants (head test edited in scratch)

| id | edit | compiler | reading | what it shows |
|---|---|---|---|---|
| `T-NOOPNEAR` | `nextHex = own.slice(-1)` (the near-miss equals the actual) | unmutated | exit 1, 18 / 1: `expected [] to deeply equal [ 'e.tsv', …(2) ]` | a no-op near-miss fails loud: no refusal, so the 3-of-3 is empty |
| `T-NORESTORE-LAST` | the loop skips the restore for `i === 4` (`e.tsv`) | unmutated | exit 1, 18 / 1: `expected [ 'e.tsv', …(1) ] to deeply equal [ 'e.tsv', …(2) ]` | **the restore after `e.tsv` is now observed** (`QE-155-c`): the refusal carries the altered actual, not `own` |
| `T-FIRSTCHAR` | the near-miss alters the FIRST char instead of the last | unmutated | exit 0, 19 passed | sanity: a correct check still refuses |
| `T-FIRSTCHAR` | same | `Q-PREFIX` | exit 0, 19 passed | the choice of the LAST char is load-bearing. A first-char near-miss would not kill `Q-PREFIX` |
| `T-FIRSTCHAR` | same | `Q-SUFFIX8` | exit 1, 18 / 1: `[ 'e.tsv', …(2) ]` | a first-char near-miss kills the suffix compare. Last + first together would kill both contiguous narrowings (not proposed here, see `QE-155-a`) |
