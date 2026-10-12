---
id: 20261012T064939Z-software-engineer-observation-abc153-criteria-readings-498907f2
kind: observation
by: software-engineer
at: 2026-10-12T06:49:39Z
verified_by:
confidence: high
refs:
  - ABC-153
  - ABC-145
  - QE-145-a
  - NFR-008
  - plans/tickets/ABC-153-the-book-sha256-test-alters-only-the-first-source-file.md
supersedes:
---

# SE `ABC-153`: criterion and mutant readings (RUN 2026-10-12)

Hand-authored and unsealed. **No timing reading was taken** (a parallel hop runs, width 2).

## `A3` — the eight readings (lane `npx vitest run tools/opening-book/book.test.ts`)

Four builds, each a `git archive main` copy in the session scratchpad OUTSIDE the repo, `node_modules`
symlinked; only `tools/opening-book/compile.ts`'s `checkThenWriteBook` loop differs. Base test = `main:tools/opening-book/book.test.ts`;
head test = `917df052`'s.

| build | mutation | base test | head test |
|---|---|---|---|
| unmutated | none (`cmp` 0 vs `main`) | exit 0, 19 passed | exit 0, 19 passed |
| `M05` | `for (const file of SOURCE_FILES.slice(0, 1))` | **exit 0, 19 passed** | **exit 1, 1 failed / 18 passed** — `expected [] to deeply equal [ 'b.tsv', …(2) ]` |
| `M-SWAP` | `want = expected[b↔c]`, message uses `want` | **exit 0, 19 passed** | **exit 1, 1 failed / 18 passed** — the control throws `b.tsv: sha256 is 28bc0b72…, expected a40a0963…` |
| `M06` | `for (const file of SOURCE_FILES.slice(1))` | exit 1, 1 failed / 18 passed — `[ 'a.tsv', …(2) ]` | exit 1, 1 failed / 18 passed — `[ 'a.tsv', …(2) ]` |

`M05` and `M-SWAP` green on base, red on head; `M06` red on both; unmutated head green. Worktree
`git status --porcelain` after the plants: only the (intended, then committed) test edit.

## `A1` / `A2`

Head lane: 19 passed. The `it` asserts set size 5; for each of five files: refusal, 3 of 3 (name, expected,
actual), output absent. Control writes. Proof the loop has teeth: the `M05`/`M-SWAP` rows above.

## `A4` (read at code commit `917df052`)

- `git diff --name-only main 917df052` = `tools/opening-book/book.test.ts`; 0 untracked files.
- `cmp` 0: lines 1–273 (imports, `fixture()`, every block before the describe, the describe header and its
  `sha256` helper); the `A3` `it` through EOF (base 305–314 = head 317–326); `fixture()` alone.
- `compile.ts` and `data/opening-book/book.json` `cmp` 0 vs `main`.
- `spawn|execFile|child_process` in `book.test.ts`: 0.
- `npm test` base (`main` `21980135`): exit 0, 56 files, 1743 tests, 0 pending, 0 todo. Head: exit 0, 56 files,
  1743 tests, 0 pending, 0 todo; `.test-results/last-run.json` `success: true`.

## Gates (head, before the docs commit)

`npm run -s lint` 0, `typecheck` 0, `build` 0, `npm test` 0 (above). `test-skip-integrity.js --skip-count 0`:
`No findings.`, exit 0. UAT-waiver line `git diff --name-only main...HEAD | grep -v '\.test\.ts$' | grep '^src/'`: empty.
