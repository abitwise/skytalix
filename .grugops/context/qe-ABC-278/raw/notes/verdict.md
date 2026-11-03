# QE verdict on ABC-278 (records path check hardened): PASS_WITH_GAPS. A1–A10 MET on an independent re-run; gaps LOW/INFO only, none an AC miss. QE's verdict signs acceptance (Test note 4: no UAT)

Read at branch `grugops/ABC-278` (code `d7c0b3ce`, SE records `c4a2bf97`, `main` `fdc8d0dc` merged in at `b9b50811`). Every test and build ran under the host lock (`flock <scratch>/host-test.lock`). Authority: the ticket's `## Acceptance criteria` and `## What happens on a miss`. The SE notes `…5b424fec`, `…476142cf` and `…ada9e5a7` were read, not trusted. Every row below was re-run with QE's own fixtures (`raw/scripts/harness.mjs`, 81 rows), and the CLI was spawned with no seam unless a row says otherwise.

## Rows as re-run
- **A1 MET.** These branches were each run from four places: the branch's own checkout (head defaulted), the same checkout with `--head`, main's checkout with `--head`, and a `git worktree` of main with `--head`.
  - root `*.md -diff`: exit 1/1/1/1, 4 findings each;
  - root `*.md binary`: exit 1/1/1/1, 4 findings each;
  - nested `.grugops/.gitattributes` `* -diff` with `plans/.gitattributes` `* binary`: exit 1/1/1/1, 4 findings each.
  - Each run's finding set equals the others' and equals the same branch without the attribute.
  - These also exit 1 with the expected hits:
    - a NUL-byte record (`line 2: home-path`, the planted line);
    - `$GIT_DIR/info/attributes` `*.md -diff`, from the own checkout and with `--head`;
    - `core.attributesFile` `* binary`;
    - a `diff=<driver>` attribute whose local config sets `binary=true` and a textconv.
  - **Red baseline:** `main`'s check fails every one of these rows (0/0/1/1, the QE-277-a split).
- **A2 MET.**
  - An added `.xz` gives exactly `x.xz (decompressed): line 3: home-path`, exit 1.
  - An R100 move of a planted `.xz` exits 0.
  - With `PATH` holding only a `git` symlink, exactly one `UNKNOWN - verify (cannot decompress)` is printed, exit 1.
  - These also exit 1:
    - M of a legacy `.xz`;
    - an `.xz` moved in from outside the three paths;
    - `.XZ` in upper case;
    - a multi-stream `.xz`;
    - a 300 MiB `.xz` bomb (UNKNOWN, in 581 ms);
    - a non-xz file named `.xz` (UNKNOWN).
  - A `.lzma`-format file named `.xz` is decompressed and hit, and a symlink named `.xz` is UNKNOWN. Both fail closed.
- **A3 MET.** All 11 of QE's shape variants classify `["foreign-argv"]`: the five ticket shapes, plus multiple flags, trailing spaces, a backtick span, a `ps -ef` row with `?` TTY, `Nov03` and a `D-HH:MM:SS` time, and a `ps aux` row with `Ssl` and `12:34`. Under the home a line gives `["home-path","foreign-argv"]`. Both exclusions stay `[]`. Red on `main`'s check.
- **A4 MET.** QE's own recount (`raw/scripts/fa-recount.mjs`) loads `main`'s check as "before" and copies no regex. At `361a5af3` and at `fdc8d0dc` it gives 77 → 80, 3 newly hit, 0 lost: the same three lines the SE named. QE read them, masked, on the terminal: two are process lines (`pgrep` output: a PID, `tee -a`, an absolute path), and one is not (a code span ending in a number before an absolute executable). **1 new non-process hit; the bar is ≤ 10.**
- **A5 MET.** `<home>.` at the end of a line and before a space, `<home>-old/x` and `<home>_bak/x` each give `["home-path"]`. So do `~` and `:` after the home. `<home>2/x` and `<home>x/y` stay `[]`.
- **A6 MET.**
  - Four names under `.grugops/` each hold a slug, so each has a `(file path)` hit and a line hit. The names hold a TAB, a space, `"` with `\`, and `é`.
  - Each name prints the same redacted path on both hits, and the path equals the expected name. No stray quote and no trailing TAB.
  - 9 direct `unquote` rows pass: the 5 the ticket names, a space name with a TAB, a lone `"`, `""` and an `\001` escape.
- **A7 MET.** A branch plants the account home in all 5 classes × 3 paths plus a `.gz`: 16 findings with the real `HOME`. The set is identical with `HOME` set to an empty temp dir, with `HOME=/`, with `HOME` unset and with `HOME=<home>/`. With `userInfo` throwing (the seam), the run exits 1 with 16 findings, not 2. Red on `main`'s check for the empty-dir and `/` rows.
- **A8 MET.** The runbook diff is +1 line, 0 removed, in § Before a merge into main, and it names "the real `HOME`".
- **A9 MET.** All four exit 0, clean:
  - `--base main`;
  - `--base main --head main`;
  - `--base 541ddf45^1 --head 541ddf45` (0 findings);
  - main's own checkout with `--head grugops/ABC-278`, using both the branch's check and `main`'s check.
- **A10 MET.**
  - `npm run lint` is clean (138 files). `typecheck` and `build` exit 0.
  - `npm test`: 66 files, 2566/2566.
  - Proof: 41/41 pass, 0 fail, 0 skip. Coverage of the check is 98.9 % lines, 87.6 % branches and 100 % functions; only lines 249–252 are uncovered.
  - The proof diff removes only 7 lines: 3 header comment lines, 3 import lines (widened), and the one `main(...)` call in `run`, which moved into `runIn`. No ABC-277 row or assertion changed.
  - `git diff --name-only main HEAD -- src/ data/ vitest.config.ts` prints 0 lines. The only code paths changed are `tools/grugops/records-path-check{,.proof}.js`.
- **NFR.**
  - `NFR-008`: 0 lane rows (a `.proof.js` is outside vitest's include).
  - Speed: 89 ms at 200 changed record files, 2 of them `.xz` (bar ≤ 10 s).
  - Security: the source spawns only `git` and `xz`, with no shell, and imports only node builtins.
- **Real-value check on the SE's commits.** QE grepped the added lines of `03e2f3f8`, `d7c0b3ce`, `c4a2bf97` and the merge `b9b50811` for the real home, its slug, the user name, the scratch root, the session id and the hostname: 0 lines in each. The three header lines that use system paths are placeholders (`/dev/<disk>`, `/usr/<dir>/<x>`, `/usr/bin/<x>`).
- **Regression.** QE re-ran `qe-ABC-277/raw/scripts/harness.mjs` (50 rows) on the new check. 39 rows are unchanged. 11 changed, and 10 of the 11 are the intended fixes: b01, b02, b03, b04, b06, b07, b10, b11, b13, and the HOME-override row (9 → 17 findings). The eleventh is fp02 (`wc -l` output), which now hits: QE-278-a. 0 values were printed in any run.

## Verdict
**PASS_WITH_GAPS.** The MEDIUM (QE-277-a) is closed: the verdict is the same from every checkout and every attribute source QE tried. The gaps are in this task's gaps note: QE-278-a LOW, QE-278-b LOW, QE-278-c INFO. None blocks the merge. The board move out of In Review is the Orchestrator's.
