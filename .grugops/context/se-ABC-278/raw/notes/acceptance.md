# SE acceptance for ABC-278 as run: A1 to A10 met; A4 has 1 new non-process hit (bar 10); A9 exits 0 on all three runs

Every run below was wrapped in `flock` on the host lock.

- **Proof:** `node --test tools/grugops/records-path-check.proof.js` gives **41/41 pass**, 0 fail, 0 skip. The 18 `ABC-277` rows are unedited. The only change to old code is a refactor of the `run` helper: it now calls `runIn(cwd, argv)` with the same behaviour. 23 rows are new.
- **Red checks (mutations, each reverted).** Every fix is guarded by a row that goes red without it:
  - without `--text`, the 4 A1 rows fail;
  - without the TAB strip, the 2 A6 rows fail;
  - with the old home lookahead, the 4 A5 rows fail;
  - without the account home, the A7 row fails;
  - without `.xz` decompression, the A2 row fails.
- **A1 MET.** For `*.md -diff` and for `*.md binary`, the check ran from four places: the branch's own checkout (head defaulted), the same checkout with `--head`, main's checkout with `--head`, and a `git worktree` of main with `--head`. All 8 runs exit 1 with the identical finding set. A NUL-byte record exits 1 with its line's hit. `$GIT_DIR/info/attributes` set to `*.md -diff` exits 1.
- **A2 MET.**
  - An added `.xz` gives `x.xz (decompressed): line 3: home-path` and exit 1.
  - An R100 rename of a planted `.xz` exits 0.
  - A command-line run with `PATH` holding only a `git` symlink exits 1 with exactly one `UNKNOWN - verify (cannot decompress)`.
- **A3 MET.** The 5 shapes classify as `["foreign-argv"]`, and as `["home-path","foreign-argv"]` under the home. Both exclusions stay `[]`.
- **A4 MET.** Run with `raw/fa-measure.mjs 361a5af3`, output in `raw/out/fa-measure-361a5af3.txt`. Over 16 422 record files, foreign-argv hits 77 lines before and 80 after. Of the 3 newly hit lines, 2 are process lines and 1 is not:
  - shape c, `qe-ABC-174/probe/window1.out` lines 16 and 23: process lines (`pgrep` output, a bare command, a flag, an absolute path);
  - shape d, `secnfr-ABC-122/…-2ff3a7b8.md` line 62: not a process line (a numeric argument, then an absolute executable closing a code span).
  - 0 lines are no longer hit. **New false positives at base: 1 (bar ≤ 10).**
- **A5 MET.** `<home>.` at the end of a line, `<home>.` before a space, `<home>-old/x` and `<home>_bak/x` each give `["home-path"]`. The `<home>2/x` row is unedited and still gives `[]`.
- **A6 MET.**
  - A TAB name and a space name each print the expected name, with no `"` and no trailing TAB.
  - The direct `unquote` rows cover: a quoted name with a trailing TAB, `\303\251` → `é`, `\"`, `\\`, a space name with a trailing TAB, and a plain name.
- **A7 MET.**
  - On a branch planting the account home, the command line with `HOME` set to an empty temp directory gives the same finding set as the real `HOME`: exit 1, 8 home-class hits, no value printed.
  - When `userInfo` throws (the seam), the check uses `os.homedir()` alone and exits 1, not 2.
- **A8 MET.** One added line in `memory-bank/70-runbook.md` § Before a merge into main names "the real `HOME`". No other line changed.
- **A9 MET.** All three runs exit 0, clean:
  - `--base main` on the branch;
  - `--base main --head main`;
  - `--base 541ddf45^1 --head 541ddf45`: **0 findings**.
- **A10 MET.**
  - `npm run lint` is clean (138 files, 0 infos).
  - `typecheck` and `build` exit 0.
  - **`npm test` passes 66 files, 2566/2566.**
  - `git diff --name-only main HEAD -- src/ data/ vitest.config.ts` prints 0 lines.
- **NFR.** 0 new lane rows (`NFR-008`). On a scratch branch with 200 changed record files including 1 `.xz`, the check took **0.09 s**; the bar is ≤ 10 s.
