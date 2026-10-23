---
id: ABC-201
title: "On a fresh `git clone`, `npm install` then `npm run chess` starts a playable game, and the first board arrives in < 2 s: take EPIC-006 AC1's and `NFR-007`'s reading"
status: ready
column: Ready
size: XS
priority: P3
epic: EPIC-006
feature: —
---

# ABC-201: one fresh-clone reading of `EPIC-006` acceptance 1 and `NFR-007`. Records only: no code, no test file, no bar moves

> **Cut 2026-10-22 by BA/PM** (task `bapm-cut-ABC-200-followups`, records only, at `main` `3bee4bdd`). The ruling is
> in `.grugops/context/bapm-cut-ABC-200-followups/notes/`. This hop ran no test, took no timing and ran no probe.
>
> **Source.** The Orchestrator deferred this reading in `…de0099fa` ("An XS fresh-clone reading of EPIC-006 AC1 and
> `NFR-007`, cut after ABC-178 (it is a timing reading)"), on BA/PM's recommendation in `…623c0fed`. It is a
> measurement of two lines that already exist. It adds no requirement and moves no bound.
>
> **What is already on record (search-bounded: `plans/`, `.grugops/context/`).**
> - **`NFR-007`:** one end-to-end reading exists. It is Security/NFR's `…8d3f6c15` (2026-10-17, `ABC-096`'s tip, Apple
>   M3), and it shows spawn to frame 0 at 201.8 / 210.8 / **222.1 ms** (min / median / max, n = 10), MET. It was taken
>   on a `git archive` copy with no `node_modules`, not on a clone after `npm install`. The catalog row was never
>   updated from it and still reads `UNKNOWN - verify`. `…623c0fed` said "no reading found"; that was true only for a
>   fresh clone, and this page corrects the record.
> - **`EPIC-006` acceptance 1:** no reading. QE at `ABC-042` wrote "cold `git clone && npm install && npm run chess`
>   was not performed by me" (`…8b41d5e6`). The fresh clones on record (`ABC-168` `A7`, `security-nfr-AR-1-premise`)
>   ran other commands.

## Problem

- **User:** the owner, who must decide whether `EPIC-006` can close, and any future second user of the clone channel
  (`ADR-0018` Decision 3).
- **Pain:** `EPIC-006` cannot close honestly. Its acceptance 1 ("`git clone` … `npm install` and then `npm run chess`
  … a playable game starts with no further install step") has never been read. `NFR-007` (< 2 s to the first board)
  still reads `UNKNOWN - verify` in the catalog, although a reading exists.
- **Value:** one cheap hop either closes both lines with evidence or fires `ADR-0018`'s revisit trigger ("`EPIC-006`
  acceptance criterion 1 is measured and fails"). Either way the owner gets a fact instead of an assumption.

## Scope

1. **The clone.** `git clone <main's checkout> <scratch>/clone`, from the local path (no git remote exists,
   `ADR-0018` `D3`), at the `main` sha current when the hop runs. Record the sha.
2. **The install,** exactly as acceptance 1 spells it: `npm install` in the clone, with no flags, an empty scratch npm
   cache (`npm_config_cache=<scratch>/npm-cache`) and an empty npm user config (`npm_config_userconfig=<scratch>/empty-npmrc`).
   This way the run cannot lean on cached packages or the user's npm settings.
3. **The playable check (acceptance 1).** In the clone: `printf 'e4\n' | npm run --silent chess -- --colour white
   --difficulty 5`. Both flags are given, so no startup question is asked, whether or not `ABC-200` has merged.
4. **The `NFR-007` window.** Spawn to frame 0 whole on stdout, in the clone after the install, on Security/NFR's
   `…8d3f6c15` instrument (series (b)).
5. **The records.** One dated insertion in the `NFR-007` row of `plans/nfr-catalog.md`. It cites this reading and
   `…8d3f6c15`, and it moves no bar or wording. Add one dated line on `EPIC-006`'s page with the AC1 state. Add one
   `## Reading` section on this page.

## Out of scope

- Any edit to `src/`, `tools/`, `package*.json`, `AGENTS.md` or a test file. This hop adds no test.
- The startup-question path on a terminal (`ABC-200`). `NFR-007` is read with both flags given, as the `ABC-200` page's
  `## NFR triggers` already rules.
- A page-cache-cold read (`sudo purge`). `AR-096-DISKCOLD` stays as it is.
- Another machine, another Node major (for example 22), or a truly clean machine. The "nothing else installed" half
  of acceptance 1 is host-bounded and stays `UNKNOWN - verify` beyond this host.
- `npm ci`, `--ignore-scripts`, an offline install, or any other spelling of the install.
- Closing `EPIC-006` (that is the Orchestrator's card move) and any change to the `NFR-007` bar or its denominator
  (`ADR-0018` Decision 4).

## Acceptance criteria

Every figure carries its machine: chip, `node -v`, `npm -v`, `git --version` and Darwin version.

- **`A1` (the clone installs).** **Given** a `git clone` of `main`'s checkout at sha S into an empty scratch
  directory, an empty npm cache and an empty npm user config, **when** `npm install` runs in the clone, **then** it
  exits `0`.
  - **Reported, not graded:** the install's wall time; the `added N packages` line; and `git status --porcelain` in
    the clone afterwards. Any line there, for example a rewritten `package-lock.json`, goes to the Orchestrator as an
    observation.
- **`A2` (a playable game starts, acceptance 1).** **Given** the installed clone, **when** `printf 'e4\n' | npm run
  --silent chess -- --colour white --difficulty 5` runs, **then** all of the following hold:
  - the exit code is `0`;
  - stderr is 0 bytes, because the book is tracked at `data/opening-book/book.json`, so the missing-book warning
    must not appear;
  - the last frame's move list holds exactly 2 plies: the human's `e4`, then one engine reply;
  - `input ended` is written exactly once, after that frame.

  The move-list spelling is read off the first run's frame and quoted raw (for example `1. e4 e5`). It is not
  guessed in advance.
- **`A3` (`NFR-007`, first board < 2 s).** **Given** the same installed clone, **when** n ≥ 10 fresh children of `npm
  run --silent chess -- --colour white --difficulty 5` run one after another, each with stdin a pipe that is closed
  after frame 0 arrives, **then** the maximum time from spawn to frame 0 whole on stdout is **< 2 000 ms**.
  - **The first launch after the install counts.** It is not discarded as a warm-up, because it is the launch a user
    meets first. Report it separately as well.
  - **Frame 0 whole** is frame 0's newline count. Read it off the first child's output, then pin it for the series.
    `…8d3f6c15` counted 23 newlines at `ABC-096`'s tip.
  - **Report** min, median and max. Log load1 before each child (not gated). Apply the Orchestrator's thermal rule.
  - **The states:**
    - **MET:** every child reached frame 0, and the maximum is < 2 000 ms.
    - **NOT MET:** any child took ≥ 2 000 ms.
    - **UNRESOLVED:** any child never reached frame 0, or the host could not be held quiet. The cause is named, and
      UNRESOLVED is never written as MET.
- **`A4` (the records).** **Given** `A1`–`A3`, **then:**
  - the `NFR-007` catalog row gains exactly one dated insertion. It states the `A3` state with min, median, max, n,
    sha S and the machine, and it cites `…8d3f6c15`. The `< 2 s` bar, the denominator and every other row stay
    byte-identical (hash the nine `NFR-` rows before and after, as the catalog's own `_Updated` lines do);
  - `EPIC-006`'s page gains one dated line that states acceptance 1 as MET or NOT MET, with the sha;
  - no file under `src/`, `tools/` or `package*.json` changes.

## NFR triggers

- **`NFR-007`** (< 2 s from `npm run chess` on a completed clone to the first rendered board): read here. The bar is
  unchanged. On a NOT MET result, `ADR-0018` Decision 3's revisit trigger fires. That is a STOP to the owner through
  the Orchestrator, because the channel is the owner's word. No bar is re-argued in this hop.
- **`NFR-008`:** not touched. The hop adds 0 test files and 0 spawns to the lane, so no `N8-LANE` reading is owed.
- **Security:** no code path changes. `npm install` runs the two install scripts the lock carries (`esbuild` 0.28.1,
  `fsevents` 2.3.3, which is optional and darwin-only), exactly as a user's install would. If Security/NFR rules that
  running them on this host is unacceptable, it STOPs and says so. It does not substitute a flag, because that would
  read a different criterion.
- **Timing hygiene:** quiet host only (see `## Dependencies`).

## Test notes

1. **The instrument** is `…8d3f6c15`'s series (b): a fresh process per child, spawn-to-frame-0 measured outside the
   child, and no hook loaded. Name the harness by sha256 in the reading note.
2. **Out of tree:** run everything in the hop's scratch folder. Nothing runs in `main`'s checkout or in another
   worktree.
3. **The plants are the sanity checks.** Check the frame-0 detector against the raw output of child 1, and quote it.
   If `A2`'s stderr is not empty, quote it raw. A missing-book warning means the clone lacks a tracked file, and that
   is a FAIL of acceptance 1's "no further install step".
4. **Keep:** the raw output of the `A2` run and of child 1 of `A3`, with a sha256 for each, under the task's context.
5. **UAT:** 0 production lines, so the waiver is expected. Security/NFR's reading note is the evidence. Under the
   owner delegation (`…5aaf7cec`), the Orchestrator rules the `EPIC-006` card move from it.

## Size and priority

- **Size `XS` (1).** One records-only hop: one clone, one install, one scripted game and about 10 timed launches,
  then three dated record lines. The figure is expected to be about 9× under the bar (222.1 ms on `…8d3f6c15`), so a
  re-run is unlikely.
- **Priority `P3`.** Nothing is broken and no user waits on it. It gates only the honest closure of `EPIC-006`, and
  the `ABC-178` / `ABC-200` readings that gate merges go first in the quiet-host queue.

## Dependencies

- **After `ABC-178`'s B7/B8 timing hop** (the Orchestrator's `…de0099fa`). Queue it behind `ABC-200`'s `N8-LANE`
  reading on the same quiet host, because those two gate merges and this one gates nothing.
- **Not blocked on `ABC-200`'s merge.** It reads whatever `main` is at sha S and records S. If `ABC-200` has merged by
  then, the reading covers its no-question path for free.
- **Network:** `npm install` with an empty cache needs the npm registry. If the registry is unreachable, the state is
  UNRESOLVED (`A1` cause named), not NOT MET.
- **Builder: Security/NFR.** It owns the `NFR-007` row and took `…8d3f6c15` with this instrument. QE is not needed:
  `A2` is a scripted run, not a hand reading.

## Owner questions

None. The reading measures existing lines with an existing instrument. A NOT MET goes to the owner by the
pre-registered `ADR-0018` trigger, not by a question asked now.

## Definition of Ready

BA/PM, 2026-10-22, at `main` `3bee4bdd`. **Result: 10 of 10. `Ready`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | ✅ the owner cannot close `EPIC-006` on evidence; AC1 was never read, and `NFR-007` is `UNKNOWN - verify` in the catalog although a reading exists |
| 2 | scope and out-of-scope clear | ✅ five scope lines; the question path, disk-cold, other machines, `npm ci` and the epic closure are fenced |
| 3 | INVEST-shaped | ✅ independent (no code; it needs no open ticket to merge); valuable alone (it closes or fails two epic lines); estimable; `XS`; testable by exit codes, byte counts, a ply count and a time bar |
| 4 | acceptance testable and measurable | ✅ exit 0 twice; stderr 0 bytes; 2 plies; `input ended` ×1; max < 2 000 ms over n ≥ 10 with the first launch counted; MET, NOT MET or UNRESOLVED; nine `NFR-` rows hashed |
| 5 | dependencies known | ✅ after `ABC-178`'s B7/B8, behind `ABC-200`'s `N8-LANE`; registry reachable; builder named |
| 6 | security/NFR triggers with a measurable target | ✅ `NFR-007` < 2 000 ms; `NFR-008` untouched (0 files, 0 spawns); the 2 install scripts named, with a STOP rule |
| 7 | test notes present | ✅ five |
| 8 | size assigned | ✅ `XS` |
| 9 | priority assigned | ✅ `P3`, argued |
| 10 | no major unresolved blocker | ✅ the quiet host is a queue position, not a blocker; a NOT MET has a pre-registered route |
