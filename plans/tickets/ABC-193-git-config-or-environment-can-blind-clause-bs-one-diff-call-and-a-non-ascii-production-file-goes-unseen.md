---
id: ABC-193
title: "Git config or environment can blind clause (b)'s one diff call, and a production file whose name git quotes goes unseen (the `AR-191-GITENV` and `AR-191-QUOTEPATH` fix)"
status: ready
column: Ready
size: XS
priority: P3
epic: —
feature: —
---

# ABC-193: clause (b)'s one diff call reads `--no-ext-diff --no-color --src-prefix=a/ --dst-prefix=b/`, every instrument git call reads `-c core.quotePath=false`, and a path git still quotes is a dispute. The harness gains 8 rows. `ADR-0036` § S1 retires the GITENV stand-in. 0 `src/` lines

> **Cut 2026-10-21 by BA/PM** (subtask `bapm-cut-AR-191`, at `main` `05f764cb`). Sources:
> - Security/NFR on `QE-191-a`/`QE-191-b`: `.grugops/context/security-nfr-QE-191-a/notes/…decision-7c1f3590` § 2 and
>   § 3 (both risks accepted and rated; the fix and the `AR-191-GITENV` close term). The readings are in
>   `…observation-62620bb0`, and the probe is in `.grugops/context/security-nfr-QE-191-a/probe/` (`RUN.txt`).
> - The owner record: `…orchestrator-decision-eb401873`. It records both risks, the GITENV stand-in and the
>   `AR-191-QUOTEPATH` dispute-line rule.
> - QE's gap register for `ABC-191`: `.grugops/context/qe-ABC-191/notes/…observation-9bc0b262`.
>
> The readings measured for this cut are in `.grugops/context/bapm-cut-AR-191/notes/`. They were taken on a scratch
> prototype only, which is not a design.

## Problem

*User:* the Orchestrator and Security/NFR. Both route every ticket on clause (b)'s output.

*Pain:*
- **Git config or environment can make the instrument read no changed line.** It then prints `does not fire` on a
  widening, such as an added `node:fs` import plus a `fetch` call, on limbs 1 and 3.
  - The routes are `color.diff`/`color.ui=always`, `diff.external`, `GIT_EXTERNAL_DIFF`, a `diff.<drv>.command` with a
    `diff=<drv>` attribute, and `diff.srcPrefix`/`dstPrefix` (Security/NFR R1–R6, R12).
  - The one diff call takes all of them.
- **Any agent in any worktree can set one, and it leaves no trace.** `.git/config` and `.git/info/attributes` are
  shared by main's checkout and every linked worktree (`extensions.worktreeConfig` is unset). One `git config` there
  blinds the Orchestrator's run. It leaves no commit and no diff, and the instrument's output shows nothing
  (Security/NFR § 3, measured).
- **A production file whose name holds a non-ASCII byte is invisible.**
  - git quotes the name (`"src/q\303\251.ts"`) in `ls-tree` and in the diff, and `isProduction` drops it.
  - Once a production file imports it (one disputed fire), later widenings in it are silent on limbs 1 and 3 (QE2).
  - The same change also rides the `AGENTS.md` UAT waiver.
- **A path git quotes even with `core.quotePath=false`** (one holding `"`, `\`, a tab or a newline) **is dropped the
  same way.** Measured at cut: an unreached `src/q"t.ts` holding `node:fs`, the same with a tab in the name, and a
  reached `src/q"t.ts` gaining `node:fs` plus `fetch` are each silent on limbs 1 and 3. That holds on today's
  instrument and on a copy with only the flags and `core.quotePath=false` added.
- **Both risks are `F-095-1`-class:** a form that passes silently, which can hide a `V5.2.1` / `V5.3.2` regression.
- **Until this lands,** the Orchestrator runs the GITENV stand-in at every routing and merge (`…eb401873`):
  `git config --get-regexp '^(color\.(ui|diff)|diff\.(external|srcprefix|dstprefix)|diff\..+\.command)$' | grep -v -E '^color\.(ui|diff) (auto|true|false|never)$'; printenv GIT_EXTERNAL_DIFF`.
  The Orchestrator also applies the `AR-191-QUOTEPATH` dispute-line rule. Measured at cut on main's checkout at
  `05f764cb`, the stand-in prints nothing.

*Value:*
- The instrument reads the same lines whatever the operator's or any worktree's git config and environment hold,
  and whatever the file's name is. So a widening routes itself.
- The stand-in retires, and `AR-191-GITENV` closes.
- `AR-191-QUOTEPATH`'s instrument half closes.

## Scope

Four files, the same four as `ABC-191`. Everything else is out of scope.

1. **`.grugops/context/design-F-072-1/probe/clause-b.mjs`.** The file is edited in place. It changes three things:
   - **(a) The one diff call** (`changedLines`, `:211`) also reads `--no-ext-diff --no-color --src-prefix=a/
     --dst-prefix=b/`.
   - **(b) Every git call** the instrument makes reads `-c core.quotePath=false`.
   - **(c) A path the one diff call prints C-quoted** (it starts with `"`, as git prints a name holding `"`, `\`, a
     tab or a newline even with `core.quotePath=false`) makes the limb FIRE (disputed). An unresolved-item line names
     the path as git printed it. Such a path is not dropped. A C-quoted file the pair does not change adds nothing.

   Nothing else in the instrument changes. *(Measured at cut: (a) and (b) are two edited lines. One way to do (c) was
   three added lines; that is the builder's call, not a design.)*
2. **`.grugops/context/design-F-072-1/probe/r2-mutants.sh`.** Eight rows are added after `BIN-ATTR`. The header
   comment and the summary line change to match, and `mk`'s file check reads names with `-c core.quotePath=false`.
   - **`ADD` (control):** `src/fen.ts` gains `import { writeFileSync } from "node:fs"` and an exported function that
     calls `writeFileSync` and `fetch`. This is Security/NFR's ADD plant. The row has no route, so a silent route row
     is the route's doing.
   - **Five route rows, each on `ADD`'s plant.** A route is set **only around the head instrument's runs**, in the
     harness's own scratch clone (clone-local config), or in that run's environment for `G-ENV`. It is removed before
     the reference runs and before the next row:
     - **`G-COLOR`:** `color.diff=always`;
     - **`G-EXT`:** `diff.external` = a script that prints nothing;
     - **`G-ENV`:** `GIT_EXTERNAL_DIFF` = the same script;
     - **`G-DRV`:** `diff.ext.command` = the same script, plus `.git/info/attributes` `src/** diff=ext`;
     - **`G-PFX`:** `diff.srcPrefix=x/` and `diff.dstPrefix=y/`.
   - **`QU`:** a new, unreached `src/qé.ts` holding `import { readFileSync } from "node:fs"`.
   - **`QE2`** (two commits). At its base, `src/cli.ts` gains `import "./qé.ts";` and a benign `src/qé.ts` is added.
     At its head, `src/qé.ts` gains a `node:fs` import and a `fetch` call.
   - **After the last row,** the harness exits 2 if the clone still holds a `color.*`/`diff.*` key or a
     `.git/info/attributes`.
3. **`.grugops/context/design-F-072-1/probe/r2-mutants.out.txt`**, regenerated from `A4`'s run.
4. **`memory-bank/50-decisions/ADR-0036-…md`**: one dated block appended under `### S1`, after the `ABC-191` block (see
   `A8`). No existing line is edited.

**The rows after this ticket** (the 12 rows of `ABC-191` are unchanged; plants are made on `<tip>`):

| row | edit | route (head runs only) | expected limb 1 | expected Ruling 2 list | limbs 2/3 compared with |
|---|---|---|---|---|---|
| the 12 `ABC-191` rows | unchanged | none | unchanged | unchanged | unchanged |
| `ADD` (new) | `src/fen.ts` gains `node:fs` + `fetch` | none | FIRES | `src/fen.ts@<head>` | `341da4c1` on the same plant |
| `G-COLOR` (new) | `ADD`'s plant | `color.diff=always` | FIRES | `src/fen.ts@<head>` | `341da4c1` on the same plant, route off |
| `G-EXT` (new) | `ADD`'s plant | `diff.external` | FIRES | `src/fen.ts@<head>` | `341da4c1` on the same plant, route off |
| `G-ENV` (new) | `ADD`'s plant | `GIT_EXTERNAL_DIFF` | FIRES | `src/fen.ts@<head>` | `341da4c1` on the same plant, route off |
| `G-DRV` (new) | `ADD`'s plant | `diff.ext.command` + `.git/info/attributes` `src/** diff=ext` | FIRES | `src/fen.ts@<head>` | `341da4c1` on the same plant, route off |
| `G-PFX` (new) | `ADD`'s plant | `diff.srcPrefix=x/`, `diff.dstPrefix=y/` | FIRES | `src/fen.ts@<head>` | `341da4c1` on the same plant, route off |
| `QU` (new) | new unreached `src/qé.ts` with `node:fs` | none | FIRES | `src/qé.ts@<head>` | `341da4c1` on the same plant, run with `core.quotePath=false` in its environment |
| `QE2` (new) | reached `src/qé.ts` gains `node:fs` + `fetch` | none | FIRES | `src/qé.ts@<head>` | `341da4c1` on the same plant, run with `core.quotePath=false` in its environment |

**Why these references.**
- `341da4c1` is blind on every route, and to `src/qé.ts`. So comparing with it under the same route, or with default
  quoting, would hold the head instrument to blindness.
- With the route off, or with `core.quotePath=false` supplied through `GIT_CONFIG_COUNT`, `341da4c1`'s limbs 2/3 equal
  the prototype's byte for byte on all eight rows (measured at cut).

## Out of scope

- **The `AGENTS.md` UAT waiver form** (Security/NFR `…7c1f3590` § 3, "owed outside the instrument").
  - The form `git diff --name-only <range> | grep -v '\.test\.ts$' | grep '^src/'` misses a quoted
    `"src/q\303\251.ts"`. So a widening in a reached non-ASCII file still rides the waiver after this ticket.
  - The proposed wording, `git -c core.quotePath=false diff --name-only …`, is the owner's text and his open call
    (`…eb401873`). If he approves it, the Scribe applies it in its own hop.
  - **Owed outside this fence.** No line of `AGENTS.md` is edited here.
- **Harness rows for `color.ui=always`, `GIT_CONFIG_COUNT` colour, a global `core.attributesFile`, or a committed
  `diff=<drv>` attribute.** The same flags cover them: Security/NFR measured R2, R12 and R5g firing with the flags,
  and probe2's R5d. Security/NFR's list of rows is the five above.
- **A harness row for a C-quoted path.** Scope 1 (c) is read by hand (`A6`). With a `"` in the name, `mk`'s file check
  still gets a quoted name, even with `core.quotePath=false`.
- **Routes Security/NFR found harmless:** `diff.noprefix`, `diff.mnemonicPrefix`, `GIT_DIFF_OPTS`, `diff.algorithm`,
  `diff.relative` and a textconv reached through `git show` (R7–R11, R13).
- **Any other env that steers git** (`GIT_DIR`, `GIT_CONFIG_PARAMETERS` setting `core.quotePath`, hooks). None was
  ruled in, and widening the fence is Security/NFR's call.
- **`QE-191-c`** (INFO; its reading rule stands: read `BIN-NUL` as 2/4 on every re-run), and **`AR-163-UNCOMMENT`** on
  limbs 2 and 3.
- **Widening any ruling.** No limb's unit changes, and Ruling 2 is untouched.
- **Any `src/`, `AGENTS.md`, `.gitattributes`, `biome.json` or git-config change in the repository.** Every route and
  plant exists only in the harness's scratch clone, or in that run's environment.
- **Editing any existing line of `ADR-0036`.**

## Acceptance (Given/When/Then)

**Terms and conventions used below:**
- "Base" is `main` at pull time: `05f764cb` at cut, instrument sha-256 `d3abb8478f9e372e…`, the same file as at
  `837e8b22`.
- "Head" is the branch merged with the latest `main`, and `<tip>` is head's commit.
- Every run uses a scratch directory with a private `HOME`, `TMPDIR` and `GIT_CONFIG_GLOBAL`, and
  `GIT_CONFIG_NOSYSTEM=1`. `node_modules/typescript` resolves beside every instrument copy, and instrument paths are
  absolute (`QE-182-b`).
- **No run sets git config or attributes in the repository or in any of its worktrees.**

- **`A1` (files).**
  - `git diff --name-only main...HEAD` lists exactly the four Scope files.
  - It may also list this hop's own records: notes under `.grugops/context/*/notes/`, `.grugops/queue/`, and this page
    and `plans/board.md` if the hop edits them. Those are ignored (`QE-182-d`).
  - The UAT waiver form in `AGENTS.md` prints nothing over the range and for each commit.
- **`A2` (red on base's instrument; run first).**
  - **Given** head's `r2-mutants.sh` and base's `clause-b.mjs`;
  - **when** `bash r2-mutants.sh <repo> <tip> <scratch> <base instrument>` runs;
  - **then**:
    - it exits **1**;
    - it prints `limb 1 MISMATCH: G-COLOR G-EXT G-ENV G-DRV G-PFX QU QE2`, exactly those seven;
    - it prints a limbs-2/3 `DIFFER` line naming exactly the 14 limbs `limb2` and `limb3` of those seven rows;
    - the 12 existing rows and `ADD` read `ok`, with limbs 2 and 3 `identical`.
  - *(Measured at cut, with a scratch copy of the harness holding the eight rows: exactly this. On each route row,
    base's instrument reads `production files changed: 0` and `(b1) capability: 0`.)*
- **`A3` (each part has its own teeth).** **Given** a scratch copy of head's instrument with one part removed, **when**
  the `A2` command runs with it, **then**:
  - **without `-c core.quotePath=false`:** rc 1, `limb 1 MISMATCH: QU QE2`, and DIFFER on exactly their 4 limbs;
  - **with `-c core.quotePath=false` but none of the four flags:** rc 1, `MISMATCH: G-COLOR G-EXT G-ENV G-DRV G-PFX`,
    and DIFFER on exactly their 10 limbs;
  - **without `--no-color`:** rc 1, `MISMATCH: G-COLOR` only, and DIFFER on its 2 limbs;
  - **without `--no-ext-diff`:** rc 1, `MISMATCH: G-EXT G-ENV G-DRV` only, and DIFFER on their 6 limbs;
  - **without both prefix flags:** rc 1, `MISMATCH: G-PFX` only, and DIFFER on its 2 limbs;
  - **without `--dst-prefix=b/` only:** rc 1, no limb 1 MISMATCH, and DIFFER on exactly `G-PFX:limb2 G-PFX:limb3`;
  - **without `--src-prefix=a/` only:** rc 0. `ADD` has no `-` line, so this flag's teeth are read in `A6`'s
    `PFX-X1`.
  - *(Measured at cut, every bullet, on copies of the flags-and-quotePath prototype. The (c) prototype's harness
    output equals that prototype's byte for byte after the header line.)*
- **`A4` (green on head).**
  - **Given** head's `clause-b.mjs`;
  - **when** the `A2` command runs with its absolute path;
  - **then**:
    - it exits **0**;
    - it prints 20 rows whose verdicts and Ruling 2 lists match the table above;
    - limbs 2 and 3 are identical to the reference named in the table on every row;
    - the 12 existing rows print byte for byte what base's instrument prints for them on the same `<tip>` (header
      line aside);
    - the clone holds no `color.*`/`diff.*` key and no `.git/info/attributes` afterwards;
    - `git -C <repo> status --porcelain` is empty, and `HEAD` and the refs are unchanged.
  - *(Measured at cut, with the prototype: rc 0 and 20 of 20. The 12 rows are byte-identical to base's (83 lines).)*
- **`A5` (the counts are the file's).** In `A4`'s output:
  - `ADD` and each of the five route rows print `(b1) capability: 1` and the file line
    `src/fen.ts  (fired by Ruling 2: 2 + lines, 0 - lines; holds limb 1 at <head>)`, the same on every route;
  - `QU` and `QE2` print `(b1) capability: 1` and `src/qé.ts  (fired by Ruling 2: 2 + lines, 0 - lines; holds limb 1
    at <head>)`, with the name unquoted;
  - limb 3 FIRES on `ADD`, the five route rows and `QE2`; it does not fire on `QU`, which has no call.
- **`A6` (by hand, not harness rows).** In a scratch clone at `<tip>`:
  - **`PFX-X1`.**
    - **Given** X1's plant (the harness's) and clone-local `diff.srcPrefix=x/` and `diff.dstPrefix=y/`;
    - **when** `node <clause-b.mjs> <tip> <X1> 1` runs;
    - **then** head's instrument FIRES with `src/book-file.ts  (fired by Ruling 2: 1 + line, 3 - lines; holds limb 1
      at <base>)`, X1's own counts. Base's instrument does not fire.
    - *(Measured at cut: a copy without `--src-prefix=a/` reads `1 + line, 0 - lines`. A copy without
      `--dst-prefix=b/` reads `0 + lines, 3 - lines` and `production files changed: 0`.)*
  - **The C-quoted plants.** **Given** the plants below, **when** limbs 1 and 3 run on them, **then** each limb reads:

    | plant | head's instrument | base's instrument |
    |---|---|---|
    | `CQ1`: a new, unreached `src/q"t.ts` holding `node:fs` | `FIRES (disputed: unresolved, the fail-safe)`, the dispute line naming the path as git printed it | `does not fire` |
    | `CQT`: the same, with a tab in place of the `"` | `FIRES (disputed …)`, the dispute line naming the path as git printed it | `does not fire` |
    | `CQ2`: base adds a benign `src/q"t.ts` and `src/cli.ts` gains `import './q"t.ts';`; head gives that file a `node:fs` import and a `fetch` call | `FIRES (disputed …)`, the dispute line naming the path as git printed it | `does not fire` |
    | `CQS`: on `CQ2`'s base, head only appends a comment line to `src/fen.ts` | `does not fire`, and no dispute line names `src/q"t.ts` | — |

    - On these plants the flags-and-quotePath copy reads as base: no dispute names the file.
    - *(Measured at cut, limbs 1 and 3: base and the flags copy on `CQ1`, `CQT` and `CQ2`; the (c) prototype on all
      four plants. Limb 1 on `CQS` with the flags copy.)*
- **`A7` (the git calls).**
  - **Given** a git shim that logs every git call;
  - **when** head's instrument runs on `ADD` for limb 1;
  - **then**:
    - every logged call begins `-c core.quotePath=false`;
    - exactly one `diff` call is logged. Its argv carries `-U0`, `--no-renames`, `--text`, `--no-textconv`,
      `--no-ext-diff`, `--no-color`, `--src-prefix=a/`, `--dst-prefix=b/` and the pathspec `-- src`;
    - the number of calls equals base's on the same plant;
    - the call is still `execFileSync` with an argument array and no shell (`V1.2.5`).
  - *(Measured at cut: 87 calls on base and on the prototype; 87 of 87 carry the `-c`; one diff call, as stated.)*
- **`A8` (`ADR-0036` records it).**
  - `git diff -U0 main...HEAD -- memory-bank/50-decisions/ADR-0036-*.md` shows only `+` lines (0 `−`).
  - It adds one block headed `#### Git config, environment and quoted names no longer steer clause (b) — <date>
    (ABC-193)`, placed after the `ABC-191` block. The block states:
    - **(i) The instrument ignores git config and environment.** The one diff call reads `--no-ext-diff --no-color
      --src-prefix=a/ --dst-prefix=b/`, and every git call reads `-c core.quotePath=false`. So git config or
      environment in any checkout or worktree (colour, an external diff, a diff driver's `command`, prefixes) no
      longer changes what the instrument reads. A production file whose name holds a non-ASCII byte is read like any
      other.
    - **(ii) Quoted paths are disputes.** A path the diff still prints C-quoted makes the limb FIRE (disputed).
    - **(iii) The stand-in retires.** The Orchestrator's GITENV stand-in (the line above, owner record `…eb401873`)
      retires when this merges.
    - **(iv) `AR-191-GITENV` closes** on QE's read of `A2`–`A4`, and the Orchestrator records the close.
    - **(v) `AR-191-QUOTEPATH`'s instrument half closes** on QE's read of `QU`, `QE2` and `A6`'s C-quoted plants. The
      `AGENTS.md` waiver form stays owed as the owner's text.
    - **A rollback sentence:** revert the instrument commit, and the stand-in and the dispute-line rule return.
- **`A9` (no lane moves).**
  - `npm test` exits 0 with the same file and test counts as base: 59 / 1992 at `03ac8bc4` per the `ABC-176` merge
    record, with `src/` unchanged since. If `ABC-192` merges first, the counts are its merge's.
  - Skips are **0**. `biome.json` is unchanged.
  - lint, typecheck and build exit 0.

## Dependencies

- **None blocking.** `ABC-191` is merged, so the 12-row harness and `--text --no-textconv` are on `main`.
- **No file overlap** with `ABC-192` (`src/cli.test.ts`), `ABC-189` (`src/cli.test.ts`) or `ABC-190`
  (`package-lock.json`). The only `AGENTS.md` change in sight (the waiver form) is outside this ticket.
- **Gates no merge** (Security/NFR `…7c1f3590`: "Required fixes before any merge: none"). Until this merges, the
  Orchestrator keeps the GITENV stand-in at every routing and merge, and the `AR-191-QUOTEPATH` dispute-line rule.

## Security / NFR triggers

- **`AR-191-GITENV`** (LOW with the stand-in, MEDIUM without; owner the Orchestrator).
  - **Closes** when QE reads the five route rows firing at head and silent on base's instrument (`A2`, `A4`), as
    `…7c1f3590` § 2 states. `A3` shows each flag's share.
  - The stand-in then retires.
  - No Security/NFR gate is required.
- **`AR-191-QUOTEPATH`** (LOW, latent; owner the Orchestrator).
  - Security/NFR folds its fix into this ticket (`…7c1f3590` § 3) but states no separate close term.
  - **This page reads it as the GITENV term applied to its rows:** the instrument half closes when QE reads `QU`, `QE2`
    and `A6`'s C-quoted plants firing at head and silent on base.
  - The `AGENTS.md` waiver form stays owed outside the fence.
  - Whether the Orchestrator then closes the risk whole, or carries its waiver half until the owner's text lands, is
    the Orchestrator's record (`UNKNOWN - verify`; Security/NFR's call if the Orchestrator asks).
- **The call surface stays one `execFileSync` with an argv and no shell** (`V1.2.5`; `A7`). `V5.2.1` / `V5.3.2` are the
  L1 items a silent widening could hide (`F-095-1` class).
- **`NFR-008`:** 0 / 0 / 0. The instrument and the harness run by hand, outside `npm test`.

## Test notes

1. **Run `A2` and `A3` before `A4`,** to show the routes and each part have teeth.
2. **Routes live only in the harness's scratch clone, or in one run's environment.**
   - `git clone --shared` gives the clone its own `.git/config` and `.git/info/attributes`.
   - Set a route only around the head instrument's runs, and remove it before the `341da4c1` reference runs. A route
     left on blinds the reference too, and the comparison then holds head to blindness.
   - `G-ENV` exports `GIT_EXTERNAL_DIFF` for those runs only.
   - **Never run `git config` in the repository or in any worktree.** `…62620bb0` § 3 measured that one such write
     reaches the Orchestrator's checkout.
3. **`mk`'s name check must read names unquoted** (`git -c core.quotePath=false diff --cached --name-only …`).
   - Without it, `QU` and `QE2` are refused with exit 2: git prints `"src/q\303\251.ts"` (Security/NFR probe3's raw
     `--name-only` line; not re-run at cut).
   - A `"` in a name stays quoted even then. That is why the C-quoted plants are read by hand (`A6`).
4. **This host's global config sets `color.ui=auto`, `diff.renames=copies` and `diff.bin.textconv`** (`…62620bb0` § 3).
   A private `GIT_CONFIG_GLOBAL` keeps them out of every run. `--no-renames` and `--no-textconv` override the last two
   anyway.
5. **The private-environment run is the reference reading.** Today, main's checkout holds only `core.*` keys, and the
   stand-in prints nothing there (measured at cut).
6. **Measured at cut** (scratch prototype, not a design): `A2`; every `A3` bullet; `A4`, including the 12 rows
   byte-identical to base; `A5`; `A6`; and `A7`'s call count and argv. Readings are in `…bapm-cut-AR-191/notes/`.
7. **Gates:** lint, typecheck, build, `npm test`, skip count 0. A QE hop is owed: QE reads `A2`–`A7` itself. The UAT
   waiver is expected (0 `src/` lines, `A1`).
8. **Builder:** Architect/Design, who owns the instrument and the ADR. No timing at any hop.

## Size and priority

**`XS`:**
- Two edited lines and one small dispute rule in the instrument.
- Eight harness rows on one plant shape, with one route hook and one reference mode.
- A regenerated output, and an ADR block that restates measured facts, not a new ruling.
- Every edit is named, and every criterion except `A8`/`A9` was run at cut on a prototype. `ABC-191`, the same four
  files with two rows, was `XS`.

**`P3`**, as Security/NFR and the brief set it. It gates no merge, and the stand-in holds `AR-191-GITENV` at LOW
meanwhile.

## Definition of Ready

BA/PM, 2026-10-21 at `05f764cb`. **Result: 10 of 10.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** five config/env routes blind limbs 1 and 3 on a widening, and any worktree can set the config ones (both measured by Security/NFR); non-ASCII and C-quoted names are dropped (QU and QE2 by Security/NFR, CQ1/CQT/CQ2 at cut); the stand-in is manual |
| 2 | scope and out-of-scope clear | **✅** four files; 20 rows in a table, with each new row's route and reference named; the waiver form, harmless routes, more env routes and the INFO items fenced |
| 3 | INVEST-shaped | **✅** independent (no file overlap; gates nothing); valuable alone (closes one risk and half of another, and retires a manual check); `XS`; every criterion is a script run or a by-hand run |
| 4 | acceptance testable and measurable | **✅** exactly 7 mismatches and 14 limb diffs on base; each part's red set named; 20/20 at head with 12 rows byte-equal to base; counts 2/0; PFX-X1 at 1/3; 4 C-quoted plants; 87 calls, all `-c`, one diff argv; ADR 0 `−`; counts equal base |
| 5 | dependencies known | **✅** none blocking; the stand-in and the dispute-line rule run until merge |
| 6 | security/NFR triggers with a measurable target | **✅** `AR-191-GITENV` closes on QE's read of `A2`–`A4`; `AR-191-QUOTEPATH`'s instrument half on `QU`/`QE2`/`A6`; `V1.2.5` held (`A7`); `NFR-008` 0/0/0 |
| 7 | test notes present | **✅** eight |
| 8 | size assigned | **✅** `XS` |
| 9 | priority assigned | **✅** `P3` |
| 10 | no major unresolved blocker | **✅** none. Whether `AR-191-QUOTEPATH` closes whole or carries its waiver half is the Orchestrator's record, and it does not block the build |

Column moves after `Ready` are the Orchestrator's.
