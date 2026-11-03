---
id: ABC-277
title: "A records path check: over the lines a branch adds under `.grugops/`, `plans/` and `memory-bank/` (and every added or changed `.gz`, decompressed), it fails with the file and the class, never the value, on a home path, its slug form, a `/Users/<name>` path, the session scratch path or a `pgrep -a`-style foreign argv. The Orchestrator runs it before each merge. The placeholder rule, with the hostname exemption, is a standing ruling (`ADR-0049` D4; `SEC-HP-1`, `SEC-HP-2`)"
status: ready
column: Ready
size: M
priority: P2
epic: EPIC-011
feature: —
adr: "ADR-0049 D4. No new ADR: a check and a written convention for an accepted decision. Security/NFR ruling sec-host-paths decision …72b4070b, recommendation (b), REQUIRED. The hostname label is exempt by the owner's ruling (SEC-HP-3; orch-2026-10-30a …c2752305)"
---

# ABC-277: a branch cannot add a host path to the records unseen

> **Cut 2026-11-03 by BA/PM: DoR 10/10, Ready** (task `bapm-sec-cut`, records only, at `main` `5222a9b4`; nothing
> run). Source: Security/NFR `sec-host-paths` decision `…72b4070b` (recommendation (b) REQUIRED; ticket text T2) and
> observation `…45ef018a` (SEC-HP-1 counts and sources; SEC-HP-2; SEC-HP-3). Priority **P2** is the Orchestrator's
> brief (public repo). Size **M** at its low end (the brief allowed S/M; see § Size). The Ready column move is the
> Orchestrator's.
> - **Owner item, PENDING (not assumed):** SEC-HP-2's one-line tip redaction of
>   `.grugops/context/se-ABC-262/raw/gates/summary.txt` line 5 to `<foreign: CLASS>` (Security/NFR recommends yes).
>   It is scope item 5 only on his yes. If he declines, it is an accepted risk owned by Olger Oeselg, and item 5 drops
>   with no other change to this page.

## Problem

- **User:** every role that commits records (QE, the Engineer, the Architect, BA/PM, the Orchestrator's briefs).
  Behind them, the owner, whose repo is public.
- **Pain:** `ADR-0049` D4 (accepted 2026-10-24) says no personal path. 816 tip files carry the home path in one of
  three forms, every one added after that date; the first literal one is `3ad6bc10` (2026-10-29). 1 file carries a
  foreign private project's argv (SEC-HP-2). Nothing catches either before commit, and there is no written
  placeholder convention (`…45ef018a`, "Process breach").
- **Value:** the breach stops growing. Each new record is checked at the merge it rides on, without failing on the
  816 files already public (accepted, Security/NFR (c)).

## Scope

1. **A check** in `tools/grugops/` (its name and shape are the Engineer's), with its tests. It reads the diff of the
   branch against its merge base with `main`:
   - text files under `.grugops/`, `plans/` and `memory-bank/`: the **added lines** only;
   - `.gz` files there that the branch adds or changes: the whole decompressed content;
   - renames are detected, so a pure move (a queue brief going `pending/` → `claimed/` → `done/`) adds no line.
2. **Five classes:** the literal home path (read at run time from `os.homedir()`); its slug form (`-home-<user>-`,
   the tool session directory name); a `/Users/<name>` path; the session scratch path (`/tmp/claude-<uid>/`); and a
   `pgrep -a`-style line (a PID, then an absolute executable path and its arguments).
3. **Wiring:** the Orchestrator runs it before each merge into `main`, beside the QE-hop check. The step is named in
   `memory-bank/70-runbook.md` and `memory-bank/40-contributing.md` § Conventions.
4. **The rule** in `memory-bank/45-standing-rulings.md`, one dated entry citing `ADR-0049` D4 and `…72b4070b`:
   nothing committed under `.grugops/`, `plans/` or `memory-bank/` carries the five classes; placeholders `<home>`,
   `<repo>`, `<scratch>`, `<out>`, `<node>`, `<cutechess-cli>`, `<stockfish>`, `<user>`; scripts use `$HOME` or
   environment variables, never expanded literals; a foreign process is logged as a count and a class only
   (`SEC-177-1`); **the owner-ruled hostname label (SEC-HP-3) is exempt**.
5. **Only on the owner's yes:** the SEC-HP-2 one-line redaction above. 1 file, no seal, no checksum.

## Out of scope

- Rewriting history, and redacting the 816 existing files (Security/NFR (c): accepted risk, owner Olger Oeselg;
  re-open trigger: a credential, a third party's data or a non-owner private path found in a record).
- The hostname as a class (exempt).
- `rating.ts` `r` / `d` records (`ABC-276`).
- Editing `AGENTS.md` (18 404 of 18 432 B used; a command row there is a Scribe hop, not this ticket).
- The Orchestrator's brief template (not a repo file; the `<scratch>/host-test.lock` form is the Orchestrator's own
  practice, already used in `bapm-sec-cut`'s brief).
- An `ADR-0049` D4 dated line naming the hostname exception (the Architect's, optional, `…45ef018a` SEC-HP-3).
- Scanning `src/`, `tools/`, `tests/` or any other path.

## Acceptance criteria

- **A1 (each class fails, by class only).** **Given** a scratch repo whose branch adds one line of each class to a
  file under each of `.grugops/`, `plans/` and `memory-bank/`, and one `.gz` under `.grugops/` holding a home path,
  **when** the check runs, **then** it exits **1** and prints, for every hit, the file path, the line number (text)
  and the class name, and **0** bytes of the matched value (asserted: the output contains none of the planted
  strings). 5 of 5 classes and the `.gz` case are caught (a positive control).
- **A2 (only the diff counts).** **Given** the same scratch repo, **then** each of these exits **0**:
  1. a branch with no change from `main`;
  2. a branch whose base already holds a planted line in a file and that adds a clean line to that same file;
  3. a branch that only renames a file holding a planted line;
  4. a planted line in a file outside the three paths (`tools/`, `src/`);
  5. a line with the placeholders only (`<home>/x`, `<scratch>/host-test.lock`, `/Users/<name>`).
- **A3 (today's tree).** **When** it runs on this ticket's own branch before merge, **then** it exits 0 (the
  fixtures are generated at test time; no committed file carries a literal). **When** it runs with no merge base or
  outside a git repo, **then** it exits **2** with a one-line reason, as the QE-hop check does.
- **A4 (wiring).** `memory-bank/70-runbook.md` and `memory-bank/40-contributing.md` § Conventions each name the
  command, its exit codes (0 clean, 1 finding, 2 cannot run) and that the Orchestrator runs it before each merge into
  `main`; a finding blocks the merge until the branch replaces the value with a placeholder.
- **A5 (the rule).** `memory-bank/45-standing-rulings.md` carries one dated entry with scope item 4's content, the
  hostname exemption stated in words, citing `ADR-0049` D4 and `sec-host-paths` `…72b4070b`. No other entry changes.
- **A6 (gates).** `npm run lint`, `typecheck`, `test` and `build` green at every commit. `git diff --name-only <base>
  <head> -- src/ data/ vitest.config.ts` prints 0 lines.
- **A7 (only on the owner's yes).** `summary.txt` line 5 reads `<foreign: CLASS>` with the 2 processes' class and
  count; no other line of that file changes. If the owner has not answered at build time, A7 is skipped and the PR
  says so.

## What happens on a miss

- **A1 prints any planted value:** NOT MET (the check itself would leak into gate logs).
- **A2 item 2 or 3 fails:** NOT MET; the check would block every touch of a legacy file and every queue move.
- **A1 misses a class:** NOT MET.

## NFR triggers

- **`NFR-008`:** the check's tests add ≤ 1.0 s to the default lane's wall on the reference machine (read before and
  after in the PR), or run outside it by `node --test` with 0 lane rows.
- **Security (ASVS L1; `ADR-0049` D4):** the check reads only local git data; no network; it never prints a matched
  value.
- **Speed:** on a branch of ≤ 200 changed files, the check finishes in ≤ 10 s on the reference machine (read once in
  the PR).

## Test notes

1. Fixtures are built at test time in a temp git repo, from `os.homedir()`, `os.userInfo()` and the process uid. No
   literal path is committed (A3).
2. The `pgrep` class is a heuristic. The PR names its pattern and one false-positive case it accepts or excludes.
3. After `ABC-276` merges, a real `r` / `d` out dir committed by QE passes this check with no hand step. That is
   read at the next reading, not owed here.
4. No UAT: tools and records only. QE's verdict signs.

## Size and priority

- **Size: M (low end).** A new check with five classes, `.gz` and rename handling and exit codes, about eight offline
  rows, two runbook lines and one ruling entry. Above S because of the diff mechanics (added lines, renames, `.gz`)
  that A2 pins; below L because it touches no product code. Split point if it grows: the ruling entry (A5) can ship
  alone.
- **Priority: P2.** Public repo (the Orchestrator's brief); the breach grows with every record until a check exists.

## Dependencies

- None hard. Scope 5 / A7 waits on the owner's SEC-HP-2 answer and does not block the rest.
- **File overlap:** `tools/grugops/`, `memory-bank/70-runbook.md`, `memory-bank/40-contributing.md`,
  `memory-bank/45-standing-rulings.md`. `ABC-276` edits `tools/rating/` only.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ D4 breached in 816 files after its acceptance; no check, no written convention (`…45ef018a`) |
| 2 | scope and out-of-scope | ✅ diff-scoped check, wiring, ruling; history, bulk redaction, AGENTS.md, hostname out |
| 3 | INVEST | ✅ M; independent of `ABC-276`; the ruling entry is a named split point |
| 4 | testable, measurable acceptance | ✅ A1 5/5 classes + `.gz`, exit 1, 0 value bytes; A2 five exit-0 cases; A3 exit 0 / 2; A4–A5 named lines; A6 0 lines |
| 5 | dependencies known | ✅ none hard; SEC-HP-2 owner answer gates A7 only |
| 6 | NFR triggers with targets | ✅ `NFR-008` ≤ 1.0 s or 0 lane rows; ≤ 10 s at ≤ 200 files; no value printed |
| 7 | test notes | ✅ 1–4 |
| 8 | size | ✅ M |
| 9 | priority | ✅ P2 (Orchestrator's brief) |
| 10 | no major unresolved blocker | ✅ the owner item is optional scope (A7), not a blocker |

**DoR 10/10: Ready.** The column move is the Orchestrator's.
