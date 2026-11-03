---
id: 20261103T153716Z-software-engineer-decision-5b424fec
kind: decision
by: software-engineer
at: 2026-11-03T15:37:16Z
verified_by: 
confidence: high (design as built; each fix guarded by a row that goes red without it)
refs:
  - ABC-278
  - EPIC-011
  - se-ABC-278
  - grugops/ABC-278
  - d7c0b3ce
  - ADR-0049
  - qe-ABC-277/20261103T151952Z-qe-e2e-observation-7d149fbd
  - QE-277-a
  - QE-277-b
  - QE-277-c
  - QE-277-d
  - QE-277-e
  - QE-277-f
  - NFR-008
  - tools/grugops/records-path-check.js
  - tools/grugops/records-path-check.proof.js
  - memory-bank/70-runbook.md
  - .grugops/context/se-ABC-278/raw/fa-measure.mjs
  - .grugops/context/se-ABC-278/raw/out/fa-measure-361a5af3.txt
supersedes: 
seal: sha256:28eebb4e11acf323a4f5f28a9374d2698f2f61b1b704d90e1021fbd2fe10ccbf
---

# SE decisions for ABC-278: the records path check reads every record as text, opens `.xz`, sees more process lines, and reads both homes

- **QE-277-a: `--text` on the `-U0` diff.** Git treats every file as text, so neither `.gitattributes` (root, any directory, `$GIT_DIR/info/attributes`, `core.attributesFile`) nor a NUL byte turns an added line into "Binary files differ". `--no-textconv` and `--no-ext-diff` stay. `.gz` and `.xz` paths are dropped from the text-diff results, because they are read whole and decompressed instead. So `--text` adds no garbage lines from compressed bytes.
- **QE-277-b: `.xz`.** It sits in the same branch as `.gz`: status A, M, T, or a rename or copy below 100 %. The blob at `head` goes through `xz -dc` (`spawnSync`, no shell, stdin input, `maxBuffer` 256 MiB). A spawn error (xz missing), a non-zero exit or overflow gives one `UNKNOWN - verify (cannot decompress)` finding, worded the same as a corrupt `.gz`. An R100 or C100 move is not opened.
- **QE-277-c: foreign-argv, shapes a to f** (named in the check's header). New:
  - c: `<pid> <cmd> <flags> <abs>`. Flags are `-x`, `--x` or `--x=<v>`, one or more.
  - d: `<pid> <abs>` at the end of the line, or before `]` or a backtick.
  - e: a `ps -ef` row. PID, PPID, C, STIME, TTY and `[D-]HH:MM:SS` come before the command field.
  - f: a `ps aux` row. PID, `%CPU`, `%MEM`, VSZ, RSS, TTY, STAT, START and `M:SS` come before the command field.
  - In e and f the command field is an absolute executable, or a bare command followed by an absolute path.
  - Accepted false positives, written with placeholders on purpose:
    - c: `timeout <n> node --<flag> <abs>`;
    - d: `size <n> /dev/<disk>` at the end of a line, and `<cmd> <n> /usr/bin/<x>` closing a code span (the one measured at base);
    - e and f: a numeric table row shaped like a `ps` row.
  - Not seen: a flag followed by a separate value (`<pid> node -p <n> <abs>`), and a relative executable.
- **QE-277-d.** The home-path lookahead is now "not followed by a letter or digit". `<home>.`, `<home>-old` and `<home>_bak` hit; `<home>2` does not, and that existing row is unedited.
- **QE-277-e.** `unquote` drops one trailing TAB before it unquotes. Git adds that TAB after a quoted name and after a name with a space. A name that itself ends in a TAB is always quoted, so stripping the trailing TAB is safe. `unquote` is now exported, with a direct test.
- **QE-277-f.** A new `homes()` returns `os.homedir()` plus `os.userInfo().homedir`: deduplicated, longest first, `/` and empty dropped. A throwing `userInfo` falls back to `os.homedir()` alone. Each home class stays one class (alternation in one regex), so the five class names and the print format are unchanged. Seams: `home` (the only home, used by the existing rows) and `userInfo` (on `classes`, `check` and `main`).
- **A7 fixture.** The ticket asks for fixtures built from `os.userInfo()`. The A7 row therefore plants the account home, read at run time, in the scratch repository only, which is removed after the run. No real path is in any committed file. The proof header says so.
- **Deviation from the plan:** none in code paths. Files changed: the check, its proof, one runbook line, and this task's `raw/`.
