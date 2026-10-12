---
id: 20261012T075500Z-software-engineer-observation-abc145-criteria-readings-a473a8c1
kind: observation
by: software-engineer
at: 2026-10-12T07:55:00Z
verified_by:
confidence: high
refs:
  - ABC-145
  - ADR-0037
  - QE-093-b
  - NFR-008
  - plans/tickets/ABC-145-the-book-compiler-stamps-its-source-commit-and-never-checks-the-source-bytes.md
supersedes:
---

# SE `ABC-145`: each criterion's reading at `7be28bf9`

This note is hand-authored and unsealed. No §14 gate verdict exists on this install, so it carries no `sha` / `gate_run` / `content_hash` triple. SE's own readings; QE grades them.

- **`A1` green → red, then closed.** First the `it` ran against a stub `checkThenWriteBook` that only
  called `writeBook`: the altered fixture compiled without complaint (the defect), the refusal text matched
  **0 of 3** substrings, and the `it` was red. With the check: **3 of 3** (`a.tsv`, expected, actual), the
  scratch output does not exist, and the `it` is green.
- **`A2`:** the control (unaltered fixture, its own hashes) writes, and the output exists. Same `it` as `A1`.
- **`A3`:** green, **5 of 5** values on their own file's row. Mutants on a scratch copy of the tree (not the
  worktree): one hex character of `c.tsv` (`45e843c7` → `45e843c8`) is red (4 of 5, `c.tsv` missing); the
  full `a.tsv`/`b.tsv` values swapped is red (3 of 5).
- **`A4` (RUN 2026-10-12):** five files fetched with `curl` from the raw URLs at `SOURCE_COMMIT` into the
  session scratchpad, outside the repo. All five `shasum -a 256` values equal the pins. `node
  tools/opening-book/compile.ts <dir>` exits **0**; `cmp` of `book.json` against `git show
  main:data/opening-book/book.json` exits **0**. Negative: a copy with `x` appended to `d.tsv` exits **1**,
  `Error: d.tsv: sha256 is 0349309f…3f68, expected 1cf4057a…cceda`, and `book.json` still `cmp`s **0**.
- **`A5`:** `## Regenerating` to end of file, newlines folded to spaces, `**` and backticks stripped:
  `SOURCE_SHA256` occurs **2** times. The 7 table lines (`^|`) `cmp` **0** base against head.
- **`A6`:** `git diff --name-only main` is the 3 permitted paths; **0** `src/`; **0** added files.
  `book.json` `cmp` 0. `compileBook` (66 lines, awk window) `cmp` 0; the `writeBook` export line `cmp` 0.
  The only deleted line in `book.test.ts` is the `./compile.ts` import; every hunk is in the imports or
  after the last base line, so no existing `it` changed. No-argument run prints the usage line, exits **1**.
  `npm test`: **56 files** (base 56), **1743 tests** (base 1741 + 2), **0 skipped**,
  `.test-results/last-run.json` `success: true`. `spawn|execFile|child_process` in `book.test.ts`: **0**.
- **Gates at `7be28bf9`:** lint, typecheck, build, `npm test` all exit 0; skip count 0; integrity `No
  findings.`
- **UAT-waiver reading:** `git diff --name-only main...HEAD | grep -v '\.test\.ts$' | grep '^src/'` is
  empty.
- No timing, wall or CPU reading was taken or graded (width 3).
