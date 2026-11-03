---
id: ABC-278
title: "The records path check, hardened: it reads every record as text whatever `.gitattributes` says (the verdict no longer depends on which checkout runs it), decompresses `.xz` like `.gz`, catches the foreign-argv shapes it missed (`<pid> <cmd> <flags> <abs>`, an absolute executable alone, `ps -ef` / `ps aux` lines) and a home path followed by `.`, `-` or `_`, prints a git-quoted file name without a stray quote or TAB, and reads both the `$HOME` and the account home. Still exits 0 on its own branch (`ADR-0049` D4; `QE-277-a`…`-f`)"
status: ready
column: Ready
size: S
priority: P2
epic: EPIC-011
feature: —
adr: "ADR-0049 D4. No new ADR: hardening of ABC-277's check (sec-host-paths decision …72b4070b, recommendation (b)); same classes, same exit codes, same placeholder rule"
---

# ABC-278: the records path check cannot be blinded or narrowed

> **Cut 2026-11-03 by BA/PM: DoR 10/10, Ready** (task `bapm-gaps-1103`, records only, at `main` `8580bbd3`; only the
> path check itself run). Source: QE `qe-ABC-277` gaps `…7d149fbd` (QE-277-a MEDIUM; QE-277-b to -e LOW; QE-277-f
> INFO) and verdict `…98c1d275`. The check read at `main` `8580bbd3` (`tools/grugops/records-path-check.js`, not
> edited). Size **S** and priority **P2** are the Orchestrator's brief (public repo). The Ready column move is the
> Orchestrator's.

## Problem

- **User:** the Orchestrator, who runs `records-path-check.js` before every merge into `main` (`memory-bank/70-runbook.md`
  § Before a merge into main). Behind him, the owner, whose repo is public.
- **Pain** (QE `…7d149fbd`, measured on QE's own scratch repos):
  - **QE-277-a (MEDIUM, fail-open).** The text diff obeys `.gitattributes` from the checkout that runs it. A branch that
    adds `*.md -diff` (or `binary`) at the root, which is outside the three scanned paths, hides every added `.md` line:
    exit **0** from the branch's own checkout, exit **1** from main's. A record git classes as binary (a NUL byte) is
    never read, by the same mechanism. Exposure today 0 (no `.gitattributes` in the repo).
  - **QE-277-b (LOW).** `.xz` is not decompressed. 5 `.xz` records are committed under `.grugops/context/*/raw/` today
    (0 class hits in them). A new `.xz` carrying the home path passes.
  - **QE-277-c (LOW).** foreign-argv misses realistic process lines: a bare command, then flags, then an absolute path
    (`<pid> node --<flag>=<n> <abs>`, `<pid> python3 -u <abs>`); an absolute executable with no argument; `ps -ef` lines
    (and `ps aux`, which the check's header already names as unseen). 75 of 77 foreign-argv lines at `main` also hit
    another class, so a foreign project under another user's home is the case left open.
  - **QE-277-d (LOW).** home-path is not matched when the home is followed by `.`, `-` or `_` (a sentence ending in
    `<home>.`). 0 such lines at `main`.
  - **QE-277-e (LOW, cosmetic, no leak).** For a git-quoted file name (a TAB or a space in it), the line hit prints the
    path with a stray `"` or a trailing TAB, unlike the same file's `(file path)` hit. `unquote` has no test.
  - **QE-277-f (INFO).** `os.homedir()` follows `$HOME`. Run with `HOME` overridden, the home classes test the
    override: QE's A1 branch showed 9 of 17 hits, with no warning.
- **Value:** the merge gate gives the same verdict wherever it runs and cannot be switched off by a line outside the
  paths it reads. The remaining known holes in the classes close at the cost of one small change.

## Scope

1. **Text whatever the attributes say (QE-277-a).** The added-lines diff reads every file under the three paths as
   text (git's `--text`, or an equivalent the Engineer names), so neither `.gitattributes` (at any level, including
   `$GIT_DIR/info/attributes` and `core.attributesFile`) nor a NUL byte hides an added line. The header's "WHAT IT DOES
   NOT SEE" paragraph drops the "text file git calls binary" limit.
2. **`.xz` like `.gz` (QE-277-b).** An `.xz` file under the three paths that the branch adds or changes (not a pure
   R100 / C100 move) is decompressed whole and every line classified, printed `(decompressed)` as `.gz` is. It is read
   by spawning `xz -dc` with no shell, capped at the same 256 MiB of output. When `xz` is missing or fails, the file is
   one `UNKNOWN - verify (cannot decompress)` finding (exit 1), as a corrupt `.gz` is today.
3. **foreign-argv, wider (QE-277-c).** The class also catches: (i) a PID, a bare command name, one or more flags
   (`-x`, `--x`, `--x=<v>`), then an absolute path of 2+ segments; (ii) a PID then an absolute executable of 2+
   segments at the end of the line or before a closing bracket or backtick; (iii) a `ps -ef` line and a `ps aux` line
   whose command field is an absolute executable or a bare command followed by an absolute path. The header's heuristic
   paragraph names the new shapes, its accepted false positives and its exclusions.
4. **home-path before punctuation (QE-277-d).** The home followed by `.`, `-` or `_` is a hit. The home followed by a
   letter or digit (`<home>2/x`, a longer user name) stays a non-hit.
5. **Quoted names printed clean (QE-277-e).** A git-quoted `+++` header that ends in a TAB is unquoted to the real
   name, so a line hit prints the same path string as the file's `(file path)` hit, with class values still redacted.
6. **Both homes (QE-277-f).** The home-path and home-slug classes are built for `os.homedir()` and, when it differs
   and can be read, `os.userInfo().homedir`. If `os.userInfo()` throws, `os.homedir()` alone is used, as today.
7. **Runbook text (QE-277-f).** `memory-bank/70-runbook.md` § Before a merge into main gains one line: run the check
   with the real `HOME` (no override); the check also reads the account home, but an override is not the supported
   form.

## Out of scope

- A new class, a new placeholder, or any change to the five class names, the exit codes or the print format beyond
  scope 5.
- **Treating a `.gitattributes` change as a finding.** Declined (QE's alternative hint). With scope 1 the attributes no
  longer change what is read. A finding has a placeholder remedy, and a legitimate `.gitattributes` has none, so it
  would block every merge that adds one.
- **JSON-escaped slashes (`\/`, QE-277-d's INFO half).** Declined. Node's `JSON.stringify` and Python's `json.dumps`
  do not escape `/`, and 0 such lines are at `main`. Re-open trigger: a record writer that escapes `/`.
- Other compressed or archive forms (`.bz2`, `.zst`, `.zip`, `.tar`). Re-open trigger: one committed under the three
  paths.
- Redacting existing files or history (accepted risk, Olger Oeselg); scanning `src/`, `tools/` or `tests/`.
- `QE-277-g` (two accepted false positives; a touched legacy `.gz` is re-read whole). Accepted by QE, unchanged.
- `QE-276-a` / `QE-276-b` (`tools/rating/`). Recorded on `ABC-276` as accepted LOW with re-open triggers, not folded
  (see that page).
- `memory-bank/40-contributing.md`, `memory-bank/45-standing-rulings.md`, `AGENTS.md`: unchanged.

## Acceptance criteria

Every fixture is built at test time in a temp git repo from `os.homedir()`, `os.userInfo()` and the process uid. No
literal path is committed.

- **A1 (attributes cannot blind it; QE-277-a).** **Given** a scratch branch that adds a `.gitattributes` at the repo
  root reading `*.md -diff`, and a second branch reading `*.md binary`, each beside an added `.grugops/` `.md` line
  holding a home path, **when** the check runs from the branch's own checkout and from main's checkout (`--head`),
  **then** all four runs exit **1** and each prints the same finding set (file, line, class). **And given** an added
  record line holding a home path in a file that also holds a NUL byte, **then** it exits 1 with that line's hit.
  **And given** `*.md -diff` placed in `$GIT_DIR/info/attributes` instead, **then** it exits 1.
- **A2 (`.xz`; QE-277-b).** **Given** a branch that adds a `.grugops/…/x.xz` whose content holds a home path on line
  3, **then** exit 1 with `x.xz (decompressed): line 3: home-path`. **Given** a branch that only renames (R100) an `.xz`
  holding a planted line, **then** exit 0. **Given** the first branch run with `PATH` holding no `xz`, **then** exit 1
  with exactly one `UNKNOWN - verify (cannot decompress)` finding for that file.
- **A3 (foreign-argv shapes; QE-277-c).** Each of these, with real absolute paths generated at test time, classifies
  as `["foreign-argv"]` (or with another class beside it when the path is under home): (1) `<pid> node
  --max-old-space-size=<n> <abs>`; (2) `<pid> python3 -u <abs>`; (3) `<pid> <abs-exec>` at the end of a line and
  inside `[…]`; (4) a `ps -ef` line (`<user> <pid> <ppid> 0 <hh:mm> pts/1 00:00:02 <abs-exec> <arg>`); (5) a `ps aux`
  line (`<user> <pid> 0.0 0.1 <vsz> <rss> pts/1 S+ <hh:mm> 0:00 node <abs>`). The existing exclusions still classify
  as `[]`: `12 plans/x.md changed`, `NODE_OPTIONS=--max-old-space-size=400 flock /opt/a/b x`.
- **A4 (false-positive budget; QE-277-c).** The PR reports how many lines foreign-argv hits over the text record files
  under the three paths at its base, before and after the change, and classes each newly hit line as a process line or
  not. **Bar: ≤ 10 newly hit lines that are not process lines.** The measuring script is committed under the
  Engineer's `.grugops/context/<task>/raw/` and prints counts and classes only, never a line's text.
- **A5 (home before punctuation; QE-277-d).** `<home>.` at the end of a line and before a space, `<home>-old/x` and
  `<home>_bak/x` each classify as `["home-path"]`. `<home>2/x` still classifies as `[]` (the existing row, unedited).
- **A6 (quoted names; QE-277-e).** **Given** files under `.grugops/` named with a TAB and with a space, each with an
  added home-path line, **then** each line hit prints a path equal to the expected name (built at test time, class
  values redacted) with no `"` and no trailing TAB. A direct row of `unquote` (exported or reached through
  `addedLines`) reads: a quoted name ending in a TAB, an octal UTF-8 escape (`\303\251` → `é`), `\"`, `\\`, and an
  unquoted name returned as is.
- **A7 (both homes; QE-277-f).** **Given** A1 of `ABC-277`'s proof (the five classes × three paths and the `.gz`),
  **when** the command line runs with `HOME` set to an empty temp dir, **then** its finding set equals the set with
  the real `HOME`. When `os.userInfo()` throws (test seam), the check runs on `os.homedir()` alone and does not exit 2.
- **A8 (runbook).** `memory-bank/70-runbook.md` § Before a merge into main carries one added line naming "the real
  `HOME`" (scope 7). No other line of that section changes.
- **A9 (still clean).** **When** the check runs on this ticket's own branch with `--base main` before merge, **then**
  it exits 0, and `--base main --head main` exits 0. **When** it runs over `ABC-277`'s merged branch (`--base
  541ddf45^1 --head 541ddf45`), **then** the PR prints its exit code and finding count (expected 0; not read by
  BA/PM). A finding there that is a real value is a leak to report to the Orchestrator, not a miss of this ticket; a
  false positive counts toward A4's bar.
- **A10 (gates and net).** `npm run lint`, `typecheck`, `test` and `build` green at every commit. `node --test
  tools/grugops/records-path-check.proof.js` passes in full: the 18 existing rows pass unedited, or the PR names each
  edited row and why, and no existing assertion is weakened. `git diff --name-only <base> <head> -- src/ data/
  vitest.config.ts` prints 0 lines. Code paths changed: `tools/grugops/records-path-check*.js` only.

## What happens on a miss

- **A1 exits 0 in any of its runs, or the two checkouts disagree:** NOT MET (the MEDIUM is the reason for the ticket).
- **Any new row prints a planted value:** NOT MET (ABC-277 A1's rule still holds).
- **A4 over 10:** the Engineer narrows the pattern, or BA/PM re-rules the bar with the counts in hand. Not a merge as
  is.
- **A3 item (4) or (5) costs more than the budget:** split, by the size note below; items (1)–(3) ship.

## NFR triggers

- **`NFR-008`:** 0 new default-lane rows (the proof runs by `node --test`, outside `npm test`).
- **Speed:** on a branch of ≤ 200 changed record files (including ≥ 1 `.xz`), the check finishes in ≤ 10 s on the
  reference machine (read once in the PR; QE read 61 ms at 200 files for `ABC-277`).
- **Security (ASVS L1; `ADR-0049` D4):** local git data only, no network. It spawns only `git` and `xz`, without a
  shell. It never prints a matched value.

## Test notes

1. `xz` is on the reference host (`/usr/bin/xz`, read 2026-11-03). A2's fixture needs it to compress. If it is absent,
   the row fails red, never skips (`test-skip-integrity`).
2. A3/A4 are a heuristic. The PR names the final pattern, one accepted false positive per new shape, and the A4
   counts.
3. A1's second checkout can be a `git worktree` of `main` in the temp repo, or `--head` from the base checkout. Both
   forms are read.
4. No UAT: tools and records only. QE's verdict signs.

## Size and priority

- **Size: S (upper end).** Six small edits in one existing file (a diff flag, an `xz` branch beside `gunzipSync`, two
  regexes, a TAB strip, a second home) plus about ten proof rows and one runbook line. Below M because it changes no
  mechanism `ABC-277` built (diff range, rename handling, exit codes). **Split point if it grows:** scope 3 with A3/A4
  (the heuristic and its false-positive count) ships as its own ticket. Scope 1 (the MEDIUM) always stays in the first ticket.
- **Priority: P2.** QE-277-a is fail-open on the merge gate of a public repo (the Orchestrator's brief).

## Dependencies

- None hard. `ABC-277` Done (merged `541ddf45`). Met.
- **File overlap:** `tools/grugops/records-path-check.js`, `tools/grugops/records-path-check.proof.js`,
  `memory-bank/70-runbook.md` (one line). No open ticket edits them.
- **Merge order:** none. Until it merges, the Orchestrator can run the check from main's checkout with `--head
  grugops/<task>` (QE's measurement: main's checkout has no `.gitattributes` to obey).

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ six named gaps, each measured by QE (`…7d149fbd`) |
| 2 | scope and out-of-scope | ✅ seven items; `.gitattributes`-as-finding, `\/`, other archives, `QE-277-g`, `QE-276-*` out, each with a reason |
| 3 | INVEST | ✅ S; one file plus its proof; independent; split point named |
| 4 | testable, measurable acceptance | ✅ A1 4 runs exit 1, equal sets; A2 exit 1 / 0 / 1 UNKNOWN; A3 5 shapes, 2 exclusions; A4 ≤ 10; A5–A7 named strings and equal sets; A9 exit 0; A10 0 lines |
| 5 | dependencies known | ✅ none hard; `ABC-277` Done |
| 6 | NFR triggers with targets | ✅ `NFR-008` 0 lane rows; ≤ 10 s at ≤ 200 files; no network, no shell, no value printed |
| 7 | test notes | ✅ 1–4 |
| 8 | size | ✅ S |
| 9 | priority | ✅ P2 (Orchestrator's brief) |
| 10 | no major unresolved blocker | ✅ none |

**DoR 10/10: Ready.** The column move is the Orchestrator's.
