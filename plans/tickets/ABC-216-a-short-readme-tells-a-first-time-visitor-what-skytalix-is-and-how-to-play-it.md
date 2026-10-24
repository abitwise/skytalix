---
id: ABC-216
title: "A short `README.md` with an ASCII-art title tells a first-time visitor what `skytalix` is, how to play it, how to plug it into a UCI GUI, and its licence"
status: ready
column: Ready
size: XS
priority: P2
epic: EPIC-006
feature: —
---

# ABC-216: a short `README.md` with an ASCII-art title. One new file; no code, no test

> **Cut 2026-10-24 by BA/PM** (task `bapm-cut-readme`, records only, at `main` `2a1a7c93`). The rulings are in
> `.grugops/context/bapm-cut-readme/notes/`. This hop ran no npm, vitest, build or CLI. Every fact below was read
> from the code, `package.json`, the runbook and the ADRs at `2a1a7c93`.
>
> **Owner word** (`owner-word-2026-10-24/…619938c5`, a transcription, not a stamp): *"checked Github - README.md is
> missing - analyze and create ticket to add README.md, make in clean, short and nice-looking title, maybe ascii
> art"*. Item 4 adds: it follows `ADR-0049` (no infrastructure names, no personal paths, no claim that a package is
> published) and `ADR-0048` (Apache-2.0, the `NOTICE` carve-out).

## Problem

- **User:** a first-time visitor to the public GitHub repository (`ADR-0049` decision 1). The owner is the second
  user: he wants the page to look clean.
- **Pain:** GitHub shows no README. `git ls-files 'README*'` at the root prints nothing. A visitor sees a file list
  and has to read `AGENTS.md` (an agent contract) or the runbook to learn how to start a game.
- **Value:** one short page answers the four questions a visitor has. What is it? How do I play? How do I use it
  in my chess GUI? What is the licence?

## Scope

1. Add `README.md` at the repository root. It is the only new or changed file outside the records.
2. **The proposed outline.** It is negotiable in order and wording, not in content. Each item names its source.

| # | section | content | source at `2a1a7c93` |
|---|---|---|---|
| 1 | Title | The ASCII-art title in a fenced `text` block (a `# skytalix` line above it is optional), then a one-line tagline. The tagline reuses `package.json` `description` | `package.json` `name`, `description` |
| 2 | Requirements | Node.js 22 or later. npm comes with it | `package.json` `engines.node` `>=22` |
| 3 | Quick start | `git clone <public HTTPS URL>`, `cd` into the clone, `npm install`, `npm run chess` | `ADR-0018` channel; `ADR-0049` decision 3 |
| 4 | Play | The four flags, passed after `--`: `--colour white\|black\|random`, `--difficulty 1`–`7` (default 5), `--ascii`, `--unicode`. On a terminal, a missing flag is asked for. Moves in SAN (`e4`, `Nf3`) or coordinates (`e2e4`). `help` lists the commands: `help`, `moves`, `undo`, `resign`, `quit` | `src/cli-options.ts`, `src/command-input.ts` `COMMAND_TABLE`, `src/move-input.ts`, runbook § Operate |
| 5 | Levels | 1 (weakest) to 7 (strongest), default 5. Level 5 thinks up to about 3 s a move, 6 about 5 s, 7 about 30 s | `src/levels.ts`, `ADR-0045`, `ABC-212` |
| 6 | Saved games | A game that ends (mate, draw or resignation) is saved as PGN under `games/` in the clone. Nothing is saved on `quit` | `src/pgn-file.ts`, `ADR-0047`, `ABC-203` |
| 7 | Use with a chess GUI | `npm run build` writes `dist/uci.js`. In the GUI, add a UCI engine whose command is `node` and whose argument is the full path to `dist/uci.js`. Options: `Skill Level` 1–7 (default 5) and `OwnBook` | `src/uci-session.ts` `uci` reply, `ABC-168`, `ABC-202` launch form |
| 8 | Development | `npm test`, `npm run lint`, `npm run typecheck`. One line may point to `AGENTS.md` for the full command list | `package.json` `scripts`, `AGENTS.md` § Commands |
| 9 | Licence | Apache-2.0, see `LICENSE`. `NOTICE` lists the parts under other terms: the CC BY-SA 3.0 evaluation values and four MIT kit files | `LICENSE`, `NOTICE`, `ADR-0048` |

3. **The ASCII-art title.** The SE draws or generates it. It names `skytalix`. A small chess motif is welcome, not
   required. Constraints are in `A3`.

## Out of scope

- Any file other than `README.md`: no `src/`, `tools/`, `package*.json`, `AGENTS.md`, runbook, `LICENSE` or
  `NOTICE` change.
- Badges, screenshots, images, a changelog, a contributing guide, a table of contents, and a project history.
- An `npx`, global-install or registry install path. `ADR-0049` decision 3 and `ADR-0044` D8 keep it out.
- The exit codes, the `*_DEEP` lanes, the opening-book source, and the agent factory. `AGENTS.md` and the runbook
  hold them.
- A pointer from `AGENTS.md` or the runbook to the README. See § Pointers.

## Acceptance criteria

All checks run at the build tip. `<base>` is the `main` sha the branch was cut from.

- **`A1` (one file).** **Given** the branch, **when** `git diff --name-only <base> <tip>` runs, **then** it lists
  `README.md` and, at most, files under `plans/` and `.grugops/`. `git ls-files README.md` prints `README.md`.
- **`A2` (short).** **Then** `wc -l < README.md` is **≤ 100**, and the file has **≤ 9** `## ` headings.
- **`A3` (the ASCII-art title).** **Then** all of the following hold:
  - the art is the first fenced code block, with info string `text`, before any `## ` heading. A `# skytalix` line
    above it is optional;
  - it is **≤ 12 lines**, and every art line is **≤ 80 columns** (`awk '{ print length }'` on the block);
  - it is ASCII only: `LC_ALL=C grep -nP '[^\x20-\x7E]'` on the block prints nothing, so there are no tabs and no
    Unicode;
  - it is original or generated for this repository. No art is copied from another project. The build note names
    how it was made (by hand, or the tool and font).
  - It renders on GitHub: the reviewer views the file in GitHub's renderer, or in a local Markdown preview that
    uses a monospace code block. The art lines stay aligned.
- **`A4` (every command runs as written).** **Given** a fresh clone of the tip, **when** QE runs each command in a
  fenced shell block of the README verbatim, in order, **then** each exits as below:
  - `git clone`, `cd`, `npm install`: exit 0. The clone URL is replaced by the local path only if the tip is not
    pushed. That substitution is the only edit, and it is recorded;
  - every `npm run chess …` line, with stdin from `/dev/null`: exit 0, with 0 stderr bytes;
  - `npm run build`: exit 0, and `dist/uci.js` exists;
  - `npm test`, `npm run lint`, `npm run typecheck`: exit 0.
  - Every `npm run <name>` shown is a key of `package.json` `scripts` (`jq`).
- **`A5` (every fact matches the code).** **Then** each holds at the tip:
  - every flag shown is in `src/cli-options.ts`'s flag list, and every option example puts it after `--`;
  - the level range and the default equal `EASIEST_LEVEL`, `HARDEST_LEVEL` and `DEFAULT_LEVEL`;
  - each think time shown equals the budget in `src/levels.ts` for its level, rounded to the shown unit;
  - every in-game command shown is a `COMMAND_TABLE` token;
  - the PGN sentence matches `ADR-0047`: written on an outcome, under `games/`, never on `quit` or end of input;
  - the UCI options shown equal the `option name` lines of the `uci` reply in `src/uci-session.ts`;
  - the Node requirement equals `package.json` `engines.node`.
- **`A6` (nothing is published, `ADR-0049` decision 3).** **Then**
  `grep -ciE 'npx|npm (i|install) +(-g|--global|skytalix)|npmjs|published to|from npm' README.md` prints `0`. The
  only install path is `git clone` + `npm install`.
- **`A7` (the licence, `ADR-0048`).** **Then** the licence section names Apache-2.0. It links `LICENSE` and
  `NOTICE`. It says that `NOTICE` lists parts under other terms. No sentence says that every file is Apache-2.0.
- **`A8` (no infrastructure, no personal data, `ADR-0049` decision 4).** **Then** each count is `0`:
  - `grep -cE '/Users/|/home/|~/|[A-Za-z]:\\' README.md` (personal paths);
  - `grep -cE '([0-9]{1,3}\.){3}[0-9]{1,3}' README.md` (IPv4 addresses);
  - `grep -cE '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}' README.md` (e-mail addresses);
  - absolute URLs other than the repository's own public HTTPS URL and the Apache licence URL. The clone line uses
    the HTTPS form, which needs no account key. The SSH form is not shown.
- **`A9` (links resolve).** **Then** every relative link target is a file that `git ls-files` lists at the tip.
- **`A10` (gates).** **Then** lint, typecheck, unit and build exit 0 at the tip. The skip count is 0, and
  `test-skip-integrity.js` prints `No findings.`

## NFR and security triggers

- **No NFR moves.** No code, no test file and no lane row change. `NFR-008` has nothing to read.
- **Security: no hop is triggered.** `ABC-041` (a) does not fire, because `package*.json` is untouched. `ADR-0036`
  (b1), (b2) and (c) do not fire, because there is no production line, import or test edit. `A8` is the
  `ADR-0049` falsifier `P5` class scan for this file, and QE runs it.

## Test notes

1. **QE runs `A4` on a fresh clone** in its own scratch folder, after the owner's timing rule allows npm processes
   on the host. Record each command, its exit code and its stderr byte count.
2. **`A3`'s render check is a reading, not a script.** QE names the viewer it used.
3. **Plant for `A8`:** QE adds one made-up home-directory path line to a scratch copy and shows that the count turns
   1. It removes the plant.
4. **UAT: WAIVED by measurement.** `git diff --name-only <base> <tip> | grep -v '\.test\.ts$' | grep '^src/'` prints
   nothing. The QE verdict is still owed, as for every ticket.

## Pointers

- **No test pins README content.** At `2a1a7c93`, no file under `src/` or `tools/` reads a root `README`. The
  `README` hits in `tools/grugops/host-protection.js` name `install/README.md` of the kit, a different file.
- **`AGENTS.md`: no pointer.** It is the agent contract, with a byte budget of 18 432 B. The README is for people.
- **Runbook: no pointer in this ticket.** A one-line "people start at `README.md`" in § Operate is optional. It is
  the Architect's or the Scribe's call, at their next runbook hop.

## Size and priority

- **Size `XS`.** One file of at most 100 lines, from facts this page already sourced.
- **Priority `P2`.** The repository is public and its front page is empty, so every visitor meets the gap. Nothing
  is broken, so not `P1`.

## Dependencies

- **None blocking.** `ABC-214` is merged (`59f50717`), so `LICENSE` and `NOTICE` exist. `ADR-0049` is accepted.
- **Builder:** software-engineer. **QE hop:** owed (`A3`–`A9` readings, `A4` on a fresh clone).
- **Timing:** `A4` runs npm. It waits until no ALONE reading is running on the host.
- **Push:** the owner pushes. The README is public only after his push (`ADR-0049` decision 1).

## Owner questions

None. The owner's shape is in `A2` and `A3`. **Assumption, stated:** the repository's own public HTTPS clone URL
is not infrastructure in `ADR-0049` decision 4's sense, which covers the home lab. If the Orchestrator reads it
otherwise, the clone line shows `<repository URL>`, and `A4` substitutes it.

## Definition of Ready

BA/PM, 2026-10-24, at `main` `2a1a7c93`. **Result: 10 of 10. `Ready`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | ✅ a public repository with no README; the visitor and the owner named |
| 2 | scope and out-of-scope clear | ✅ one file; a 9-row outline with sources; badges, install paths and pointers fenced |
| 3 | INVEST-shaped | ✅ independent; valuable alone; estimable; `XS`; testable by counts, exit codes and source matches |
| 4 | acceptance testable and measurable | ✅ ≤ 100 lines; art ≤ 12 lines, ≤ 80 columns, ASCII only; every command exit 0; 0 publish, path, address and e-mail hits |
| 5 | dependencies known | ✅ none blocking; `A4` waits for a quiet host |
| 6 | security/NFR triggers with a measurable target | ✅ none fires, each named; `A8` is the `P5` scan |
| 7 | test notes present | ✅ four |
| 8 | size assigned | ✅ `XS` |
| 9 | priority assigned | ✅ `P2`, argued |
| 10 | no major unresolved blocker | ✅ the clone-URL reading is stated, with its fallback |
