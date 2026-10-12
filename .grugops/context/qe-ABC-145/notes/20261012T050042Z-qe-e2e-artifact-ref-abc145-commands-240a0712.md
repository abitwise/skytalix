---
id: 20261012T050042Z-qe-e2e-artifact-ref-abc145-commands-240a0712
kind: artifact-ref
by: qe-e2e
at: 2026-10-12T05:00:42Z
verified_by:
confidence: high
refs:
  - ABC-145
  - grugops/qe-ABC-145
  - grugops/ABC-145-book-source-sha256
supersedes:
---

# QE `ABC-145`: commands run, and where the artifacts are

This note is hand-authored and unsealed. No §14 gate verdict exists on this install, so it carries no
`sha` / `gate_run` / `content_hash` triple.

**Trees used:**
- the QE worktree `../cli-chess-example-qe-ABC-145`, on `grugops/qe-ABC-145` off `62a5f8ea`, with its own
  `npm ci`;
- two detached scratch worktrees in the session scratchpad: base `3537fe48`, and a plant tree at `62a5f8ea`.

Both scratch worktrees are removed at the end of the hop. The SE's branch was not checked out or moved.

**Commands:**
- **Gates:** `npm run lint`, `npm run typecheck`, `npm run build`, `npm test` (head, and base in the scratch
  worktree);
  `npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'` → 0;
  `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` → `No findings.`
- **Fences:**
  - `git diff --name-only|--name-status 3537fe48 7be28bf9` and `7be28bf9 62a5f8ea`, and `--diff-filter=A`;
  - `cmp` of `book.json` against base and against `main`;
  - awk windows of `compileBook` and `writeBook`, then `cmp`;
  - `sed` from `vi.mock` to the end of `book.test.ts` (base against head), then `cmp`;
  - `node tools/opening-book/compile.ts` with no argument → exit 1;
  - `grep -c -E 'spawn|execFile|child_process'` → 0.
- **`A5`:** `awk` § Regenerating, `tr '\n' ' '`, strip `**` and backticks, `grep -o SOURCE_SHA256 | wc -l`, at
  base and head. The table rows (`grep -n '^| \`[a-e].tsv\`'`) `cmp` base against head.
- **`A1`/`A2` plant:** a scratchpad script imports `tools/opening-book/compile.ts` by absolute path and builds
  five distinct files. It flips one byte in place in `c.tsv` (and separately `e.tsv`), then runs
  `checkThenWriteBook`. It runs the same plant through `writeBook` alone as the no-check variant.
- **`A4`:** `curl -fsSL` of the five raw URLs into a new scratchpad directory; `shasum -a 256`;
  `node tools/opening-book/compile.ts <dir>`; `cmp` against `git show main:data/opening-book/book.json`.
  Negative runs on copies: append `x` to `b.tsv`, flip one byte in place in `c.tsv`, remove `e.tsv`, and add
  an extra `f.tsv`. The same copies were then run through the base compiler.
- **Plants `M00`–`M15`:** an exact-match single-replacement helper, then
  `npx vitest run tools/opening-book/book.test.ts --reporter=json` and `npx tsc --noEmit`, then
  `git checkout -- .`.
- **UAT-waiver line:**
  `git diff --name-only 3537fe48 62a5f8ea | grep -v '\.test\.ts$' | grep '^src/'` (and `main...62a5f8ea`).

No timing, wall or CPU reading was taken.
