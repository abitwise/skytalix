# QE runs for ABC-277: commands, test data, 34 break attempts and the false-positive judgement

## Commands (all `flock <scratch>/host-test.lock …`, from the worktree)
- `node --test tools/grugops/records-path-check.proof.js`: 18/18, about 0.3 s.
  - With `--experimental-test-coverage`, the check scores 91.47 % lines, 83.54 % branches and 100 % functions (lean mode: reported, not enforced; threshold 0.8).
  - Uncovered: `unquote` (see QE-277-e), the hunk context-line branch, and the cannot-decompress branch. QE's b16 exercises that last one.
- `node .grugops/context/qe-ABC-277/raw/scripts/harness.mjs <cli> <scratch>/qe-ABC-277`:
  - 52 rows, output `raw/out/harness-run.txt`;
  - run twice, identical except timings (second run from the committed copy);
  - scratch repo deleted after.
- `node .grugops/context/qe-ABC-277/raw/scripts/fprate.mjs <cli>`: foreign-argv over main's text records gives 77 lines in 7 files (the SE's count reproduced). **75 of the 77 also hit home-path, home-slug or scratch-path.**
- The real check:
  - `--base main` exits 0;
  - `--head main` exits 0;
  - `--base 14912a02~1 --head 14912a02` (SEC-HP-2 commit) exits 1: foreign-argv 1, home-path 10, home-slug 54, scratch-path 54;
  - `--base HEAD~40` exits 1 over 287 files in 169 ms;
  - all three runs: 0 home/slug/scratch values in the output (grep counts).
- `npm run lint` / `typecheck` / `build` / `test`, then `node tools/grugops/lane-inventory.js`.

## Test data
- Synthetic scratch repo, built at run time. The values come from `os.homedir()`, its slug, `process.getuid()`, a `/Users/<user>qe` name, and a made-up PID and `/srv/<project>` argv.
- Nothing literal is committed. The harness builds its argv-class strings at run time, and the committed files were pre-checked with the tool's own `classify` (0 hits) before commit.

## Break attempts (exit; class). Placeholders: `<pid>` a PID, `<abs>` an absolute path of 2+ segments
- **Caught (exit 1):**
  - `pgrep -af`-style `<pid> /usr/bin/python3 <abs> --port <n>`;
  - `ps -eo pid,args` with leading spaces;
  - a systemd CGroup line (box-drawing character before the PID);
  - a symlink under `plans/` whose target is the home path;
  - a `.gz` of two concatenated members, the second holding the value;
  - a `.gz` that is not gzip: `UNKNOWN - verify (cannot decompress)`, fails closed;
  - an upper-case `.OUT.GZ`;
  - CRLF lines;
  - added lines that read like diff headers (`++ `, `@@ … @@`, `diff --git`, `+++ b/`);
  - a copy of a legacy planted file to a new path (correct: the lines are new);
  - a `.gz` renamed with an edit (R<100): whole content re-read, by scope;
  - a slug inside a `.gz` file name, and inside a git-quoted name with a TAB (file path redacted).
- **Missed (exit 0): the gaps note gives severities.**
  - home path followed by `.`, `-` or `_` (e.g. a sentence ending in `<home>.`);
  - JSON-escaped slashes;
  - bare command then a flag then the path (`<pid> node --<flag>=<n> <abs>`, `<pid> python3 -u <abs>`);
  - an absolute executable with no argument;
  - `ps -ef` and `ps aux` lines;
  - an `.xz` holding the home path;
  - a text record with a NUL byte (git calls it binary);
  - **a branch that adds `.gitattributes` with `*.md -diff`, run from that branch's checkout (exit 0), while the same branch run from main's checkout exits 1.**
- **Correctly clean (exit 0):** `/Users/Shared/x`; `C:\Users\<user>\x` (not a class); a move plus a large edit of a legacy brief (git still pairs it as a rename, so only the new lines are read); `wc -l`, `ls -l`, `df`, `du` (TAB) lines; prose counts.
- **False positives (exit 1, foreign-argv):** `GET <n> /api/games/<id> <t>ms`, `listening on <n> /api/v1/health ok`, and the SE's accepted `timeout <n> node <abs>`.

## False-positive judgement (brief asks)
**Accept** the SE's three accepted false positives and QE's two extra (a number before a URL route of 2+ segments and a token):
- They fail closed. The cost is one blocked merge, cleared by writing a placeholder, which the rule wants for such lines anyway.
- They are rare in practice: the class hits 77 lines in 7 of the more than 16 000 text record files at main, and 75 of those lines also carry a home, slug or scratch value.

## Flaky risk
None seen:
- the harness is deterministic (two runs identical but for timings);
- the proof is outside the lane;
- the check only reads git objects.
