---
id: 20261012T050042Z-qe-e2e-observation-abc145-plants-b9f6d36a
kind: observation
by: qe-e2e
at: 2026-10-12T05:00:42Z
verified_by:
confidence: high
refs:
  - ABC-145
  - QE-145-a
  - QE-145-b
  - QE-145-c
  - QE-145-g
  - tools/opening-book/compile.ts
  - tools/opening-book/book.test.ts
supersedes:
---

# QE `ABC-145`: break-it plants against `book.test.ts`, and which ones the lane catches

This note is hand-authored and unsealed. Every plant was applied on a detached scratch worktree at `62a5f8ea`
in the session scratchpad. Each was reverted with `git checkout -- .`, and `git status` was clean after each.
The QE worktree's `src/`, `tools/` and `data/` were never written. Each row records:
`npx vitest run tools/opening-book/book.test.ts` (19 tests), then `npx tsc --noEmit`.

| id | plant | `A1/A2` `it` | `A3` `it` | other 17 | typecheck | caught? |
|---|---|---|---|---|---|---|
| M00 | none (the tip) | pass | pass | pass | 0 | n/a |
| M01 | the hash is computed on **decoded text** (`readFileSync(…, "utf8")`) | pass | pass | pass | 0 | **NO** (`QE-145-c`) |
| M02 | no check (the loop runs over nothing) | **fail** | pass | pass | 0 | yes |
| M03 | the check runs **after** `writeBook` | **fail** | pass | pass | 0 | yes |
| M04 | the refusal leaves a **partial (empty) file** (`writeFileSync(outPath, "")` before the check) | **fail** | pass | pass | 0 | yes |
| M05 | only `a.tsv` is checked (`SOURCE_FILES.slice(0, 1)`) | pass | pass | pass | 0 | **NO** (`QE-145-a`) |
| M06 | `a.tsv` is skipped (`slice(1)`) | **fail** | pass | pass | 0 | yes |
| M07 | the command-line block calls `writeBook` directly (the check is bypassed) | pass | pass | pass | 0 | **NO in the lane** (`QE-145-b`); the `A4` delivery run catches it |
| M08 | an extra `SOURCE_SHA256` key `f.tsv` that no file has | pass | pass | pass | **2** | typecheck only (`QE-145-g`) |
| M09 | key `e.tsv` renamed to `f.tsv` | pass | **fail** | pass | **2** | yes |
| M10 | one hex character in the `a.tsv` constant | pass | **fail** | pass | 0 | yes |
| M11 | the last hex character of `d.tsv` uppercased | pass | **fail** | pass | 0 | yes |
| M12 | the `a`/`b` constant values swapped | pass | **fail** | pass | 0 | yes |
| M13 | one hex character in `ATTRIBUTION.md`'s `a.tsv` row | pass | **fail** | pass | 0 | yes |
| M14 | the refusal omits the expected hash | **fail** | pass | pass | 0 | yes |
| M15 | only the first 8 hex characters are compared | pass | pass | pass | 0 | no. A one-byte change moves the whole digest, so no feasible test tells this apart; INFO only |

**Delivery-run cross-checks** (on the plant tree, with real fetched bytes, then reverted):
- `M07` on the in-place `c.tsv` flip: exit **0**. The `A4` negative run catches it.
- `M05` on the same copy: exit **0**. The `A4` negative run catches it only when the altered file is not
  `a.tsv`.

**In process:**
- **Extra or missing file.**
  - An extra file in the directory is ignored, and the compile writes. This is correct, because only the five
    are read.
  - A missing `c.tsv` throws `ENOENT` before any write; no output.
  - An `expected` map that lacks `d.tsv` refuses with `expected undefined`; no output.
- **Raw bytes vs decoded text.** A file holding a literal U+FFFD and a copy with an invalid `0xFF` byte in its
  place have **different raw sha256 but the same decoded-text sha256**. The five real sources hold 0 U+FFFD,
  and each round-trips UTF-8 byte-exact. So on the pinned bytes, `M01` gives the same answer as the delivered
  raw-byte check.
