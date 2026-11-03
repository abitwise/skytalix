---
id: ABC-277
title: "A records path check: over the lines a branch adds under `.grugops/`, `plans/` and `memory-bank/` (and every added or changed `.gz`, decompressed), it fails with the file and the class, never the value, on a home path, its slug form, a `/Users/<name>` path, the session scratch path or a `pgrep -a`-style foreign argv. The Orchestrator runs it before each merge. The placeholder rule, with the hostname exemption, is a standing ruling (`ADR-0049` D4; `SEC-HP-1`, `SEC-HP-2`)"
status: done
column: Done
closed: "2026-11-03, merged to local main at 541ddf45 (from grugops/ABC-277 at 0f188473, code 861de9c5); QE PASS_WITH_GAPS (qe-ABC-277 …98c1d275), which signs acceptance (tools and records, no UAT); A1-A6 MET; A7 not done (owner SEC-HP-2 pending, the ticket's skip path); QE-277-a…f routed to ABC-278 (bapm-gaps-1103). Front matter by bapm-gaps-1103. 2026-11-03 (bapm-owner-answers-1103): A7 done at 1e558566 on the owner's SEC-HP-2 yes (…af126c04 item 7); line 5 reads <foreign: vitest> count=3"
size: M
priority: P2
epic: EPIC-011
feature: —
adr: "ADR-0049 D4. No new ADR: a check and a written convention for an accepted decision. Security/NFR ruling sec-host-paths decision …72b4070b, recommendation (b), REQUIRED. The hostname label is exempt by the owner's ruling (SEC-HP-3; orch-2026-10-30a …c2752305)"
---

# ABC-277: a branch cannot add a host path to the records unseen

> **A7 DONE, 2026-11-03, by BA/PM** (task `bapm-owner-answers-1103`, records only, at `main` `bdecb7e1`; nothing run
> but a read of the commit). The owner answered SEC-HP-2 **yes** (`orch-2026-10-30a` `…af126c04` item 7: one-line
> forward redaction, no history rewrite). The Architect's hop `arch-owner-answers-1103` made it in **`1e558566`**
> (`…ab9f83a3`; owed lines `…e81f6b25`).
> - **A7: MET** by the row's own words. `.grugops/context/se-ABC-262/raw/gates/summary.txt` line 5 now reads
>   `foreign=[<foreign: vitest> count=3]`, a class and a count. `git diff --numstat 1e558566^ 1e558566` is `1 1` on that
>   one file, so no other line changed. Read by BA/PM from the commit; a records-only line on a Done ticket, so no
>   new QE hop.
> - **Count corrected: 3, not 2.** A7 and `EPIC-011`'s SEC-HP-2 row said "2 processes". The old line held **3** process
>   ids (one vitest runner and two fork workers), and the redaction says `count=3`. A7's wording is corrected below.

> **CLOSED 2026-11-03, DONE, by BA/PM** (task `bapm-gaps-1103`, records only, at `main` `8580bbd3`; nothing run but the
> path check). **Merged to local `main` at `541ddf45`** from `grugops/ABC-277` at `0f188473` (code `861de9c5`). Not
> pushed. Sources: QE `qe-ABC-277` verdict `…98c1d275` and gaps `…7d149fbd`; the Orchestrator's board line (post-merge
> `npm test` 2 566 / 2 566; the check exits 0 on `main`). The Orchestrator runs it before every merge into `main` from
> now on (board).
>
> **Result: QE PASS_WITH_GAPS**, which signs acceptance (test note 4, no UAT).
>
> | row | read | result |
> |---|---|---|
> | A1 | QE's own scratch repo, real home / uid, CLI with no seam: exit 1, 17 findings; 0 of 10 value strings printed in any of 52 runs | MET |
> | A2 | 5 / 5 cases exit 0 (same, legacy touch, rename text and `.gz`, outside, placeholders) | MET |
> | A3 | real branch and `--head main` exit 0; orphan, non-repo, missing ref, bad arguments exit 2 with a reason | MET |
> | A4 | `70-runbook.md` § Before a merge into main and `40-contributing.md` § Conventions name the command, 0 / 1 / 2, who runs it, and the block | MET |
> | A5 | `45-standing-rulings.md` gains exactly one dated entry (classes, placeholders, `$HOME`, foreign count, hostname exemption, sources) | MET |
> | A6 | lint, typecheck, build green; `npm test` 2 566 / 2 566; lane 66 = 66; proof 18 / 18; 0 lines under `src/` / `data/` | MET |
> | A7 | the owner has not answered SEC-HP-2 | **not done** (the ticket's skip path; not a gap) *2026-11-03 (`bapm-owner-answers-1103`): **MET** at `1e558566` (owner yes `…af126c04` item 7; line 5 `<foreign: vitest> count=3`; 1 line changed)* |
> | NFR | 61 ms at 200 files, 169 ms at 287 (≤ 10 s); 0 lane rows; no value printed | MET |
>
> **Gaps, routed** (`bapm-gaps-1103`): **QE-277-a** (MEDIUM, `.gitattributes` / binary blind spot), **-b** (`.xz`),
> **-c** (foreign-argv misses), **-d** (home before `.` / `-` / `_`), **-e** (quoted file name) and **-f** (the real
> `HOME`: runbook line plus reading both homes) → **`ABC-278`** (S, P2, DoR 10/10, Ready). **QE-277-g** (INFO): accepted
> by QE, unchanged. SEC-HP-2 (A7) stays an owner question on `EPIC-011`. *(2026-11-03: answered yes; A7 done, top block.)*

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
- **A7 (only on the owner's yes).** `summary.txt` line 5 reads `<foreign: CLASS>` with the ~~2~~ *3 (2026-11-03,
  `bapm-owner-answers-1103`: one vitest runner and two fork workers; the line held 3 process ids)* processes' class and
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
