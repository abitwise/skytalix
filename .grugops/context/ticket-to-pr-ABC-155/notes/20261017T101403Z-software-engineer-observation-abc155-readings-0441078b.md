---
id: 20261017T101403Z-software-engineer-observation-abc155-readings-0441078b
kind: observation
by: software-engineer
at: 2026-10-17T10:14:03Z
verified_by:
confidence: high
refs:
  - ABC-155
  - ABC-153
  - ABC-145
  - QE-153-a
  - NFR-008
  - plans/tickets/ABC-155-the-book-sha256-test-never-offers-a-hash-that-differs-only-in-its-last-character.md
  - 20261012T065549Z-qe-e2e-observation-abc153-plants-3d6ce640
supersedes:
---

# SE `ABC-155`: criterion and mutant readings (RUN 2026-10-17)

Hand-authored and unsealed. **No timing reading was taken.**

## `A2` — the ten readings (lane `npx vitest run tools/opening-book/book.test.ts`)

Scratch copy: `git archive c9746851` in the session scratchpad OUTSIDE the repo, `node_modules` symlinked; only
`checkThenWriteBook` in `tools/opening-book/compile.ts` differs per build. Base test = `c9746851`'s
`book.test.ts`; head test = `819e6933`'s. Worktree `git status --porcelain` empty after the plants.

| build | mutation | base test | head test |
|---|---|---|---|
| `Q-PREFIX` | `actual.slice(0, 8) !== expected[file].slice(0, 8)` (QE `…3d6ce640`) | **exit 0, 19 passed** | **exit 1, 1 failed / 18 passed** — `expected [] to deeply equal [ 'e.tsv', …(2) ]` |
| `Q-CASE` | `actual.toLowerCase() !== expected[file].toLowerCase()` | exit 0, 19 passed | exit 0, 19 passed (equivalent; recorded) |
| `M05` | `for (const file of SOURCE_FILES.slice(0, 1))` | exit 1, 1 failed / 18 passed — `[ 'b.tsv', …(2) ]` | exit 1, 1 failed / 18 passed — `[ 'b.tsv', …(2) ]` |
| `M-SWAP` | `want = expected[b↔c]`, message uses `want` | exit 1, 1 failed / 18 passed — control throws `b.tsv: sha256 is 28bc0b72…, expected a40a0963…` | exit 1, same |
| `M06` | `for (const file of SOURCE_FILES.slice(1))` | exit 1, 1 failed / 18 passed — `[ 'a.tsv', …(2) ]` | exit 1, 1 failed / 18 passed — `[ 'a.tsv', …(2) ]` |

Unmutated (extra, not in the ten): base exit 0, 19 passed; head exit 0, 19 passed.

## `A1`

Head lane 19 passed; the near-miss case refuses with 3 of 3 (`e.tsv`, altered expected, actual) and no output.
Proof it has teeth: the `Q-PREFIX` head row above names `e.tsv`.

## `A3` (read at code commit `819e6933` vs base `c9746851`)

- `git diff --name-only` = `tools/opening-book/book.test.ts`; 0 added files; one hunk `@@ -315,0 +316,20 @@`,
  inside the `A1/A2` `it` (head 274–336).
- `cmp` 0: base 1–315 = head 1–315 (imports, `fixture()`, every earlier block, the `it` up to the loop's end);
  base 316–EOF = head 336–EOF (the `it`'s close, the `A3` `it`, the describe close).
- `compile.ts` and `data/opening-book/book.json` `cmp` 0 vs base.
- `spawn|execFile|child_process` in `book.test.ts`: 0 at head, 0 at base.
- `npm test` base (scratch copy of `c9746851`): exit 0, 58 files, 1792 tests, 0 pending, 0 todo. Head: exit 0,
  58 files, 1792 tests, 0 pending, 0 todo; `.test-results/last-run.json` `success: true`.

## Gates (head `819e6933`)

`npm run -s lint` 0, `typecheck` 0, `build` 0, `npm test` 0 (above). `test-skip-integrity.js --skip-count 0`:
`No findings.`, exit 0. UAT-waiver line `git diff --name-only c9746851 819e6933 | grep -v '\.test\.ts$' | grep '^src/'`: empty.
