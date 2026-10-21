---
id: ABC-195
title: "An added line starting `++ ` hides the later hunks of its file from clause (b), and a production file whose name holds a space goes unseen (the `AR-193-HUNKHDR` and `AR-193-SPACEPATH` fix)"
status: in-review
column: In Review
size: XS
priority: P3
epic: —
feature: —
---

# ABC-195: clause (b) reads `---`/`+++` (and the C-quoted test) as headers only between `diff --git ` and that file's first `@@`, and drops one trailing TAB from an unquoted header path. The harness gains 5 rows. `ADR-0036` § S1 retires the HUNKHDR stand-in. 0 `src/` lines

> **Cut 2026-10-21 by BA/PM** (subtask `bapm-cut-AR-193`, at `main` `65bc4375`). Sources:
> - Security/NFR on `QE-193-a`/`QE-193-b`: `.grugops/context/security-nfr-QE-193/notes/…decision-5719a86d` § 1–3
>   (both risks accepted and rated; what the fix must hold; the close conditions). The readings are in
>   `…observation-c5270049`. The probe is in `.grugops/context/security-nfr-QE-193/probe/` (`repro.sh`,
>   `repro.out.txt`, `fix-prototype.patch`, `r2-fix-vs-head.txt`).
> - The owner record: `…orchestrator-decision-73e94c9f`. It records both risks and starts the HUNKHDR stand-in.
> - QE's gap register for `ABC-193`: `.grugops/context/qe-ABC-193/notes/…decision-69c93667` and `…observation-9c7a6680`.
>
> The readings measured for this cut are in `.grugops/context/bapm-cut-AR-193/notes/`. They were taken on a scratch
> prototype only (Security's `fix-prototype.patch` plus a scratch harness copy), which is not a design.

## Problem

*User:* the Orchestrator and Security/NFR. Both route every ticket on clause (b)'s output.

*Pain:*
- **An added line whose text starts `++ ` blinds limbs 2 and 3 to every later hunk of its file** (`AR-193-HUNKHDR`;
  LOW with the stand-in, MEDIUM without).
  - Under `-U0` the line prints as `+++ …`. `changedLines` reads any line starting `+++ ` as a file header, wherever
    it sits, so `file` goes null.
  - It needs no config, no file name and no privilege: one line in a template literal (lint-clean, per QE) or a block
    comment is enough.
  - It hides a new `process.env` read and a new `fetch` (`PP-TPL`), and an in-place edit of an existing `process` read
    in a limb-2 holder (`PP-EDIT`), which `ADR-0036` § Decision 2 says "counts".
  - A line `++ b/src/<file>` reads the later hunks against another production file's line numbers and names a file the
    diff never touched (`PP-REDIR`).
  - A `++ "` line raises a false dispute (`R-193-a`, `RA-PLUS`). That is on the safe side, but it is a wrong record.
- **A production file whose name holds a space is unseen on all three limbs** (`AR-193-SPACEPATH`; LOW, latent).
  - git appends a TAB to that file's `---`/`+++` headers (`+++ b/src/q t.ts<TAB>`). The parse keeps the TAB, and
    `isProduction` refuses the name.
  - Once the file is reached, a later widening is silent on limbs 1, 2 and 3, Ruling 2 included (`SP-N5`). No dispute
    line arises.
- **Both risks are `F-095-1`-class:** a form that passes silently, which can hide a `V5.2.1` / `V5.3.2` regression.
- **Until this lands,** the Orchestrator runs the HUNKHDR stand-in at every routing and merge (`…73e94c9f`):
  `git -c core.quotePath=false diff -U0 --no-renames --text --no-textconv --no-ext-diff --no-color --src-prefix=a/ --dst-prefix=b/ <base> <head> -- src | awk '/^diff --git /{h=0} /^@@/{h=1} /^(\+\+\+|---) / && (h || /\t$/)'`.
  It must print nothing; its `\t$` arm also flags a spaced name. Measured at cut, in a private environment, over
  `47a3c9a1..65bc4375`: nothing.

*Value:*
- The instrument reads every hunk of every production file, whatever text a line adds and whether or not the file's
  name holds a space. So such a widening routes itself.
- The stand-in retires, and both risks close.

## Scope

Four files, the same four as `ABC-193`. Everything else is out of scope.

1. **`.grugops/context/design-F-072-1/probe/clause-b.mjs`**, edited in place, inside `changedLines` only:
   - **(a) The header window.** A `---`/`+++` line, and the C-quoted test `/^(?:---|\+\+\+) "/`, is read as a header
     **only between a `diff --git ` line and that file's first `@@`**. A hunk line never is. *(This is QE's shape.
     It also removes `R-193-a`'s false dispute, and a removed line starting `-- ` no longer drops the `-` count of its
     file's later hunks.)*
   - **(b) The TAB.** An unquoted header path (one not starting `"`) drops **one** trailing TAB. A C-quoted path is
     left as git printed it. *(Unambiguous: git adds the TAB only for a name holding a space, and C-quotes any name
     holding a real TAB.)*

   Nothing else in the instrument changes; the one diff call's argv line is untouched. *(Measured at cut: Security's
   `fix-prototype.patch` does (a) and (b) in 3 added and 5 edited lines, all inside `changedLines`. That is the
   builder's call, not a design.)*
2. **`.grugops/context/design-F-072-1/probe/r2-mutants.sh`.** Five rows are added after `QE2` (25 rows). The header
   comment and the summary line change to match. Three harness changes go with them:
   - **A control-twin reference for limbs 2 and 3.** `341da4c1` has the same header parse and is blind on each of the
     five plants (measured: limbs 2 and 3 `does not fire` on all five). So each new row compares limbs 2 and 3 with
     `341da4c1` run on the row's **twin**:
     - for the four `++ ` rows, the same plant with that line's `++` replaced by `x` (the same line count);
     - for `SP-N5`, the same two commits with `src/q-t.ts` in place of `src/q t.ts`, the name mapped back
       (`src/q-t.ts` → `src/q t.ts`) in the reference's output;
     - in both, the pair ids of the `  diff <base>..<head> = …;` line are masked on both sides, and nowhere else.
   - **The Ruling 2 file-list parse reads a name holding a space.** Today's `sed -E 's/^ +([^ ]+) .*holds limb 1 at
     (.*)\)$/\1@\2/'` reads `src/q t.ts  (fired by Ruling 2: …)` as `src/q@<head>` (measured). Split the name at the
     two spaces before `(fired by Ruling 2:` instead. The 20 existing rows print byte for byte what they print today
     (measured).
   - **A plant check.** The harness exits 2, naming the plant, unless each of the five plants' diff holds a
     header-shaped line inside a hunk or a TAB-ended header (the stand-in's awk prints ≥ 1 line) and each twin holds
     none (0 lines). So a plant whose anchor drifts never runs as a silent control. *(Measured at cut: 1, 1, 1, 1, 2 on
     the plants; 0 on each twin.)*
3. **`.grugops/context/design-F-072-1/probe/r2-mutants.out.txt`**, regenerated from `A4`'s run.
4. **`memory-bank/50-decisions/ADR-0036-…md`**: one dated block appended under `### S1`, after the `ABC-193` block (see
   `A8`). No existing line is edited.

**The rows after this ticket** (the 20 rows of `ABC-193` are unchanged; plants are made on `<tip>`; plant bodies are
Security/NFR's, `probe/repro.sh`):

| row | edit | expected limb 1 | expected Ruling 2 list | limbs 2 / 3 at head (on base's instrument) | limbs 2/3 compared with |
|---|---|---|---|---|---|
| the 20 `ABC-193` rows | unchanged | unchanged | unchanged | unchanged | unchanged |
| `PP-TPL` (new) | `src/fen.ts`: above `import { isSquareAttackedBy }`, ``export const NOTE = `…`;`` holding the line `++ promoted pieces`; at the end, an exported `leak()` reading `process.env.FEN_URL` and calling `fetch(u)` | does not fire | `-` | FIRES / FIRES (does not fire / does not fire) | `341da4c1` on its twin (`x promoted pieces`) |
| `PP-REDIR` (new) | as `PP-TPL`, the line `++ b/src/glyph-mode.ts` | does not fire | `-` | FIRES / FIRES (does not fire / does not fire) | `341da4c1` on its twin (`x b/src/glyph-mode.ts`) |
| `RA-PLUS` (new) | as `PP-TPL`, the line `++ "quoted" note` | does not fire | `-` | FIRES / FIRES (FIRES (disputed) / FIRES (disputed)) | `341da4c1` on its twin (`x "quoted" note`) |
| `PP-EDIT` (new) | `src/cli.ts` (a limb-2 holder): the same template, line `++ promoted pieces`, above its first function; far below, `resolveOptions(process.argv.slice(2))` → `slice(1)` | does not fire | `-` | FIRES / does not fire (does not fire / does not fire) | `341da4c1` on its twin (`x promoted pieces`) |
| `SP-N5` (new; two commits) | base: a benign `src/q t.ts` (`export const q = 1;`) that `src/cli.ts` imports; head: it gains a `node:fs` import, a `process.env.Q` read and a `fetch` call | FIRES | `src/q t.ts@<head>` | FIRES / FIRES (does not fire / does not fire) | `341da4c1` on its twin pair (`src/q-t.ts`), name mapped |

## Out of scope

- **`GIT_DIFF_OPTS` (`QE-193-c`, INFO).** Security/NFR named dropping it from the instrument's git environment as an
  optional rider, never a close term. **Not taken.** It only ever over-counts, so verdicts can only rise (fail-safe);
  the fix still FIRES on `PP-TPL` under `GIT_DIFF_OPTS=--unified=5` (measured); and taking it would add an env edit
  and its own reading to an `XS`. Instead, `A8`'s block states block (i)'s scope exactly. Re-open it as its own cut if
  Security/NFR or the owner asks.
- **Rows for `PP-CMT` (the `++ ` line in a block comment), `PP-L1` and `SP-N4` (an unreached spaced file).** The same
  two edits cover them (Security measured all three FIRE on the fix where a capability line exists). Security's list of
  rows is the five above. Biome on the block-comment form stays `UNKNOWN - verify`.
- **A harness row for the `-- ` mirror (QE's `PM`).** It already FIRES (fail-safe). The corrected count is read by
  hand (`A6`).
- **`QE-193-d`** (the Orchestrator's record) and **`QE-193-e`** (INFO, fail-safe; no action).
- **The C-quoted dispute line keeping a trailing TAB** for a name holding a space and a `"` (cosmetic, Security/NFR).
- **The instrument's baseline line** that names `src/q t.ts` as a holder while the verdict is silent. It is a STATE
  record and is fixed as a by-product; nothing is asked of it.
- **`AR-163-UNCOMMENT`** and **`AR-095-READ`** (carried unchanged). **Widening any ruling:** no limb's unit changes, and
  Ruling 2 is untouched.
- **Any `src/`, `AGENTS.md`, `.gitattributes`, `biome.json` or git-config change in the repository.** Every plant lives
  only in the harness's scratch clone.
- **Editing any existing line of `ADR-0036`.**

## Acceptance (Given/When/Then)

**Terms and conventions used below:**
- "Base" is `main` at pull time: `65bc4375` at cut, instrument sha-256 `2c0c1985e6607110…`, the same file as at
  `63eadabe`.
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
    - it prints `limb 1 MISMATCH:` naming exactly `RA-PLUS` and `SP-N5`;
    - it prints a limbs-2/3 `DIFFER` line naming exactly these 9 limbs: `PP-TPL:limb2 PP-TPL:limb3 PP-REDIR:limb2
      PP-REDIR:limb3 RA-PLUS:limb2 RA-PLUS:limb3 PP-EDIT:limb2 SP-N5:limb2 SP-N5:limb3`;
    - the 20 existing rows read `ok`, with limbs 2 and 3 `identical`.
  - *(Measured at cut, with a scratch copy of the harness holding the five rows: exactly this. `PP-EDIT:limb3` is
    `identical`: neither instrument fires there.)*
- **`A3` (each part has its own teeth).** **Given** a scratch copy of head's instrument with one part removed, **when**
  the `A2` command runs with it, **then**:
  - **without (b), the TAB:** rc 1, `limb 1 MISMATCH: SP-N5` only, and DIFFER on exactly `SP-N5:limb2 SP-N5:limb3`;
  - **without (a), the header window:** rc 1, `limb 1 MISMATCH: RA-PLUS` only, and DIFFER on exactly the 7 limbs
    `PP-TPL:limb2 PP-TPL:limb3 PP-REDIR:limb2 PP-REDIR:limb3 RA-PLUS:limb2 RA-PLUS:limb3 PP-EDIT:limb2`;
  - in both, the 20 existing rows are byte-identical to `A4`'s.
  - *(Measured at cut, both bullets, on copies of Security's prototype.)*
- **`A4` (green on head).**
  - **Given** head's `clause-b.mjs`;
  - **when** the `A2` command runs with its absolute path;
  - **then**:
    - it exits **0**;
    - it prints 25 rows whose verdicts and Ruling 2 lists match the table above;
    - limbs 2 and 3 are identical to the reference named in the table on every row;
    - the 20 existing rows print byte for byte what base's instrument prints for them under base's harness on the
      same `<tip>` (header line aside);
    - the plant check passes, and the clone holds no `color.*`/`diff.*` key and no `.git/info/attributes` afterwards;
    - `git -C <repo> status --porcelain` is unchanged, and `HEAD` and the refs are unchanged.
  - *(Measured at cut, with the prototype: rc 0 and 25 of 25. The 20 rows are byte-identical to base's harness on
    base's instrument (139 lines); `r2-fix-vs-head.txt` reads the same at `aa86a1a1`.)*
- **`A5` (what the rows print).** In `A4`'s output, or by hand on the same plants:
  - `SP-N5` prints `(b1) capability: 1` and `src/q t.ts  (fired by Ruling 2: 3 + lines, 0 - lines; holds limb 1 at
    <head>)`, the name with no TAB; limb 2 names `src/q t.ts:3` and limb 3 `src/q t.ts:4`;
  - `PP-TPL`, `PP-REDIR` and `RA-PLUS`: limb 2 names `src/fen.ts:351  const u = process.env.FEN_URL ?? "";` and limb 3
    `src/fen.ts:352  return (await fetch(u)).text();` (the line numbers at `65bc4375`; they follow `src/fen.ts`);
  - `PP-EDIT`: limb 2 names `src/cli.ts:142  const resolution = resolveOptions(process.argv.slice(1));` (at
    `65bc4375`);
  - `PP-REDIR`, limb 2: `production files changed: 1`, naming only `src/fen.ts` (base's: `2`, naming
    `src/glyph-mode.ts` too);
  - `RA-PLUS`: 0 lines holding `C-quoted` on each limb (base's: 1 per limb). `R-193-a` is gone.
- **`A6` (by hand, not harness rows).** In a scratch clone at `<tip>`:
  - **Quoted names still dispute.** **Given** one commit adding unreached `src/q"t.ts`, `src/a "b.ts` and
    `src/c<TAB>d.ts`, each holding `node:fs`, **when** limb 1 runs, **then** head FIRES (disputed) with exactly 3
    `C-quoted` lines, as base does.
  - **The `-- ` mirror.** **Given** QE's `PM` shape (base gives `src/book-file.ts` a template line `-- promoted
    pieces` and a tail line `// tail`; head deletes both), **when** limb 1 runs, **then** head reads `src/book-file.ts
    (fired by Ruling 2: 0 + lines, 2 - lines; …)` and base reads `0 + lines, 1 - line`. Both FIRE.
  - *(Measured at cut, both, on the prototype and on base.)*
- **`A7` (the edit is confined).** `git diff -U0 main...HEAD -- <clause-b.mjs>` touches only lines inside
  `changedLines`, and the line holding the one `git("diff", …)` call is unchanged. *(Measured at cut: the prototype's
  three hunks sit at base lines 210–224 of `changedLines`' 206–236.)*
- **`A8` (`ADR-0036` records it).**
  - `git diff -U0 main...HEAD -- memory-bank/50-decisions/ADR-0036-*.md` shows only `+` lines (0 `−`).
  - It adds one block headed `#### Hunk lines and spaced names no longer steer clause (b)'s line map — <date>
    (ABC-195)`, placed after the `ABC-193` block. The block states:
    - **(i) The header window.** `changedLines` reads `---`/`+++` and the C-quoted test only between `diff --git ` and
      that file's first `@@`, so an added `++ …` or removed `-- …` line is a hunk line. The rows show what this changes:
      `PP-TPL`, `PP-EDIT`, `PP-REDIR` now fire, `PP-REDIR` names only the real file, `RA-PLUS` raises no dispute, and a
      `-- ` line no longer drops later `-` counts.
    - **(ii) The TAB.** An unquoted header path drops one trailing TAB, so a production file whose name holds a space
      is read like any other (`SP-N5`).
    - **(iii) Block (i) of the `ABC-193` block, its scope stated exactly (`QE-193-c`).** Its flags and `-c
      core.quotePath=false` cover colour, an external diff, a diff driver's `command`, prefixes and quoting.
      `GIT_DIFF_OPTS` still changes what the instrument reads: it overrides `-U0`, so hunks carry context lines and the
      `+`/`−` counts rise. That can only raise a verdict. The instrument does not clear it.
    - **(iv) The stand-in retires.** The Orchestrator's HUNKHDR stand-in (the line above, owner record `…73e94c9f`)
      **retires when this merges.**
    - **(v) `AR-193-HUNKHDR` closes** on QE's read of `PP-TPL`, `PP-EDIT`, `PP-REDIR` and `RA-PLUS` as in `A2`/`A4`,
      with the 20 rows unchanged; **`AR-193-SPACEPATH` closes** on QE's read of `SP-N5`. The Orchestrator records both
      closes.
    - **A rollback sentence:** revert the instrument commit, and the HUNKHDR stand-in and the SPACEPATH trigger rule
      return at every routing and merge.
- **`A9` (no lane moves).**
  - `npm test` exits 0 with the same file and test counts as base: 59 / 1994 at `0222d54d` per QE's `ABC-193` read,
    with `src/` unchanged since. If `ABC-194` merges first, the counts are its merge's.
  - Skips are **0**. `biome.json` is unchanged.
  - lint, typecheck and build exit 0.

## Dependencies

- **None blocking.** `ABC-193` is merged, so the 20-row harness and its flags are on `main`.
- **No file overlap** with `ABC-194` (`src/cli.test.ts`), `ABC-189` (`src/cli.test.ts`) or `ABC-190`
  (`package-lock.json`).
- **Gates no merge** (Security/NFR `…5719a86d`: "Required fixes before any merge: none"). Until this merges, the
  Orchestrator runs the HUNKHDR stand-in at every routing and merge.
- **`AR-193-SPACEPATH`'s trigger:** if a `src/` path holding whitespace appears first, that change routes by hand as
  fired on every limb, and this ticket lands before it merges (`…5719a86d` § 3).

## Security / NFR triggers

- **`AR-193-HUNKHDR`** (LOW with the stand-in, MEDIUM without; owner the Orchestrator). **Closes** when QE reads
  `PP-TPL`, `PP-EDIT`, `PP-REDIR` and `RA-PLUS` firing at head as in the table and silent on base's instrument (`A2`,
  `A4`), with the 20 rows unchanged, as `…5719a86d` § 3 rules. `A3` shows (a)'s share. The stand-in then retires.
- **`AR-193-SPACEPATH`** (LOW, latent; owner the Orchestrator). **Closes** when QE reads `SP-N5` firing on limbs 1, 2
  and 3 at head and silent on base (`A2`, `A4`, `A5`). `A3` shows (b)'s share.
- **Re-rate triggers (Security/NFR's, unchanged until merge):** the stand-in prints a line or is skipped →
  `AR-193-HUNKHDR` MEDIUM; a whitespace `src/` path appears → route by hand, fix lands first.
- No Security/NFR gate is required. **The call surface is unchanged** (one `execFileSync` with an argv, no shell;
  `V1.2.5`; `A7`). `V5.2.1` / `V5.3.2` are the L1 items a silent widening could hide (`F-095-1` class).
- **`NFR-008`:** 0 / 0 / 0. The instrument and the harness run by hand, outside `npm test`.

## Test notes

1. **Run `A2` and `A3` before `A4`,** to show both parts have teeth.
2. **Why twins.** `341da4c1` reads the same plant as base does (blind), so comparing with it on the same plant would
   hold head to blindness. Each twin differs from its plant only in the colliding characters, so line numbers match and
   the outputs equal head's byte for byte after the pair-id mask (and, on `SP-N5`, the name map). Measured at cut on
   all five rows.
3. **Plants are commits the harness resets away.** Read by hand with the ids the harness prints; the fixed commit
   dates make them repeat.
4. **The private environment matters.** This host's global config sets `color.ui=auto`, `diff.renames=copies` and a
   `textconv`; with a private `GIT_CONFIG_GLOBAL`, main's checkout also shows `.claude/settings.local.json` as
   untracked (the user's global `~/.gitignore` normally hides it, `…73e94c9f`). Read `A4`'s status check as "unchanged
   from before the run".
5. **Measured at cut** (scratch prototype, not a design): `A2`; both `A3` bullets; `A4`, including the 20 rows
   byte-identical to base (139 lines); `A5`; `A6`; `A7`'s hunk positions; the plant check's counts; the stand-in empty
   over `47a3c9a1..65bc4375`. Readings are in `.grugops/context/bapm-cut-AR-193/notes/`.
6. **Gates:** lint, typecheck, build, `npm test`, skip count 0. A QE hop is owed: QE reads `A2`–`A7` itself. The UAT
   waiver is expected (0 `src/` lines, `A1`).
7. **Builder:** Architect/Design, who owns the instrument and the ADR. No timing at any hop.

## Size and priority

**`XS`:**
- Two small parse edits in one function (3 added, 5 edited lines in the prototype).
- Five harness rows on two plant shapes, one reference mode (the twin), a one-line parse fix and a plant check.
- A regenerated output, and an ADR block that restates measured facts, not a new ruling.
- Every edit is named, and every criterion except `A8`/`A9` was run at cut on a prototype. `ABC-193`, the same four
  files with eight rows, was `XS`.

**`P3`**, as Security/NFR set it. It gates no merge, and the stand-in holds `AR-193-HUNKHDR` at LOW meanwhile.

## Definition of Ready

BA/PM, 2026-10-21 at `65bc4375`. **Result: 10 of 10.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** a `++ ` added line blinds limbs 2 and 3 in later hunks, and a spaced name blinds all three (both measured by Security/NFR and re-measured at cut); `R-193-a` is a false dispute; the stand-in is manual |
| 2 | scope and out-of-scope clear | **✅** four files; 25 rows in a table, each new row's plant, verdicts and reference named; `GIT_DIFF_OPTS`, extra rows, `PM` as a row and the INFO items fenced |
| 3 | INVEST-shaped | **✅** independent (no file overlap; gates nothing); valuable alone (closes two risks, retires a manual check); `XS`; every criterion is a script run or a by-hand run |
| 4 | acceptance testable and measurable | **✅** exactly 2 mismatches and 9 limb diffs on base; each part's red set named; 25/25 at head with 20 rows byte-equal to base; named lines and counts (3/0, 2 vs 1, 1 vs 2 files, 0 vs 1 dispute); 3 quoted disputes; edit confined; ADR 0 `−`; counts equal base |
| 5 | dependencies known | **✅** none blocking; the stand-in runs until merge; the SPACEPATH trigger is stated |
| 6 | security/NFR triggers with a measurable target | **✅** `AR-193-HUNKHDR` closes on QE's read of 4 rows plus 20 unchanged; `AR-193-SPACEPATH` on `SP-N5`; `V1.2.5` held (`A7`); `NFR-008` 0/0/0 |
| 7 | test notes present | **✅** seven |
| 8 | size assigned | **✅** `XS` |
| 9 | priority assigned | **✅** `P3` |
| 10 | no major unresolved blocker | **✅** none. Biome on the block-comment form is `UNKNOWN - verify` and outside the rows |

Column moves after `Ready` are the Orchestrator's.

## QE

**QE/E2E, 2026-10-21 (subtask `qe-ABC-195`), at `grugops/qe-ABC-195` merge `88b03a37` (tip `f9709ed8`; code `0dfd17b3`; base `99d07d32`). Verdict: PASS_WITH_GAPS.**
- **Merges.** I merged `main` `f6855262` at `fb6d7565`. `main` then moved (ABC-194 merged at `0d05f252`, then `0233ee28`), so I merged it again at `88b03a37`. Both were merges with no conflict.
- **Where things ran.** The gates and the harness runs (head, base, noA, noB, base-on-base) were re-run at `88b03a37`. My own plants and the drift copies ran at `fb6d7565`. Between the two merges `src/` differs only in `src/cli.test.ts`, which `isProduction` excludes.
- **How.** Every criterion was read by my own runs before I opened the Architect's `…1bafd98d`/`…6a068acf`. Those notes agree on every shared number.
- **Environment.** Every run went through one wrapper: private `HOME`, `TMPDIR` and `GIT_CONFIG_GLOBAL` (an empty file), `GIT_CONFIG_NOSYSTEM=1`, with `GIT_DIFF_OPTS` and `GIT_EXTERNAL_DIFF` unset. Plants lived only in scratch clones with their own `.git`. No timing was taken.

- **A1 MET.** `main...HEAD` lists the 4 Scope files plus the 2 Architect notes. The waiver prints nothing over `99d07d32..f9709ed8`, over `99d07d32..88b03a37` and for each of the 4 commits.
- **A2 MET.** Base instrument (sha `2c0c1985e6607110`) with head's harness: rc 1.
  - `limb 1 MISMATCH: RA-PLUS SP-N5`.
  - DIFFER on exactly the 9 limbs. `PP-EDIT:limb3` is `identical`.
  - The 20 rows read `ok`/`identical`.
- **A3 MET.**
  - Without (b): rc 1, `MISMATCH: SP-N5`, DIFFER on `SP-N5:limb2 SP-N5:limb3`.
  - Without (a): rc 1, `MISMATCH: RA-PLUS`, DIFFER on the 7 limbs named.
- **A4 MET.** rc 0, `25 of 25`.
  - The new rows read as the table.
  - Plant check: 1/1/1/1/2 on the plants, 0 on each twin.
  - The 20 rows (139 lines) are byte-identical across base's harness on base, and head's harness on base, noA, noB and head.
  - The committed `r2-mutants.out.txt` equals my run with the ids masked (it was generated at `0dfd17b3`).
  - The clone holds no `color.*`/`diff.*` key and no `info/attributes`.
  - Main's status, `HEAD` and refs are unchanged across the runs.
- **A5 MET.** Each line was read by hand on head and on base:
  - `SP-N5`: `(b1) capability: 1`; `src/q t.ts  (fired by Ruling 2: 3 + lines, 0 - lines; …)` with no TAB; limb 2 at `:3`, limb 3 at `:4`.
  - `src/fen.ts:351`/`:352` on `PP-TPL`, `PP-REDIR` and `RA-PLUS`; `src/cli.ts:142` on `PP-EDIT`.
  - `PP-REDIR`: changed files 1 at head, 2 on base.
  - `RA-PLUS`: `C-quoted` lines 0 at head, 1 per limb on base.
- **A6 MET.**
  - The 3 quoted names FIRE (disputed) with 3 `C-quoted` lines, on head and on base alike.
  - `PM`: head reads `0 + lines, 2 - lines`, base `1 - line`. Both FIRE.
- **A7 MET.** There are 3 hunks, at base lines 210, 213–215 and 223–224 of `changedLines` (206–235). Line 212 (the one `git("diff", …)` call) is unchanged.
- **A8 MET.** 43 `+` / 0 `−` lines. The block is dated and placed after `ABC-193`'s, and states (i)–(v) and a rollback.
  - (iii) holds as measured: under `GIT_DIFF_OPTS=--unified=5`, the verdicts on `PP-TPL`/`PP-EDIT`/`SP-N5` are unchanged, and `PM` rises to `12 +/14 -`.
  - The heading spells `(`ABC-195`)` in backticks, as its neighbours do (QE-195-c).
- **A9 MET.** Lint, typecheck and build exit 0. `npm test` exits 0 with 59 files / 1994 tests, equal to base at the merge. `last-run.json` reads `success` true, 0 failed / pending / todo. The skip count as spelled is `0` → `No findings.` `biome.json` is unchanged.
- **Stand-in.** It prints nothing over `99d07d32..f9709ed8` and `99d07d32..88b03a37`.

**Own plants** (23, head vs base's instrument; the plant names are mine):
- **Head right, base wrong:**
  - **One `++ ` line:** as the only line of a hunk; first of a hunk; last of a hunk.
  - **Several `++ ` lines in one file**, over 3 hunks (`++ b/src/glyph-mode.ts`, `++ b/src/cli.ts`, `++ "q" x`). Base disputes and names 3 files.
  - **`-- ` lines** first and last of a removed hunk in a holder: Ruling 2 `5 -` at head, `3 -` on base.
  - **A minus-side redirect `-- a/src/glyph-mode.ts`:** `2 -` at head, `1 -` on base.
  - **A new file holding `++ b/src/glyph-mode.ts`:** verdicts are equal, but base also lists `glyph-mode.ts` as changed.
  - **A `diff --git` / `@@` look-alike plus `++ b/…` inside a hunk:** head FIRES limbs 2/3 on `src/fen.ts` only; base is blind. Every hunk line carries a prefix, so a look-alike cannot open the window.
  - **Spaced names**, each reached and new-unreached: `src/q  t.ts` (two spaces), `src/sp /q.ts` (a directory ending in a space), `src/ q.ts` (a leading space) and `src/qé t.ts` (a space and non-ASCII). Head FIRES limbs 1/2/3 naming the file; base is silent.
- **Head and base equal and right:**
  - A deleted file holding `-- a/…`/`++ b/…`: one hunk, and the next file's header resets the parse.
  - `src/q<TAB>t.ts` (a real TAB), reached and unreached: C-quoted, FIRES (disputed) on every limb.
  - `src/qt.ts ` (a trailing space after `.ts`): `isProduction` refuses it on both (QE-195-b).
- **Guard check** (5 one-line drift copies of the harness, head instrument):
  - Template anchor drift → exit 2 (`PP-TPL`).
  - `PP-EDIT` template anchor drift → exit 2.
  - Spaceless `SP-N5` name → exit 2.
  - A twin keeping `++` → exit 2 (`1 on the plant, 1 on its twin`).
  - **`PP-EDIT`'s `slice(2)` anchor drift → rc 0, `25 of 25`**, the row a silent control (QE-195-a).

**Gap register** (0 blocking; none against a criterion):
- **QE-195-a (LOW proposed).** The five `TW` rows check limbs 2/3 only as equality with `341da4c1` on the twin. The plant check guards only the header-shaped anchor.
  - If `PP-EDIT`'s in-place edit `resolveOptions(process.argv.slice(2))` stops matching, the template still lands, so `mk` and the plant check pass.
  - Both sides then read `does not fire`, and the harness exits 0 at 25 of 25.
  - The other four rows' capability lines are written without an anchor (`printf`), so only `PP-EDIT` is exposed.
  - Fix shape: assert each `TW` row's expected limb 2/3 verdict, or have `pc` require the capability line in the plant's diff.
  - Owner: BA/PM rules; Architect builds.
- **QE-195-b (INFO).** The retiring stand-in's `\t$` arm also printed lines for a name ending in a space (`src/qt.ts `), which neither instrument reads (`isProduction`, unchanged). Node cannot import it (`ERR_MODULE_NOT_FOUND`, because the specifier's trailing space is trimmed), and it does not end `.ts`. Retiring the stand-in loses no reachable production file. No action.
- **QE-195-c (INFO).** The ADR heading id is in backticks, `(`ABC-195`)`, where the page's text reads `(ABC-195)`. It matches the `ABC-193` block's style. Cosmetic; no action.

**Risk close conditions:**
- **`AR-193-HUNKHDR`: MET.** `PP-TPL`, `PP-EDIT`, `PP-REDIR` and `RA-PLUS` fire at head as the table says, and are silent (or a false dispute on `RA-PLUS`) on base's instrument (A2/A4/A5). The 20 rows are unchanged, and A3 shows (a)'s share.
- **`AR-193-SPACEPATH`: MET.** `SP-N5` FIRES on limbs 1, 2 and 3 at head and is silent on base. A3 shows (b)'s share.
- The Orchestrator records both closes. Per ADR-0036 § S1 (iv), the stand-in retires at merge.

UAT waived (0 `src/` lines); a waiver is not a signature. The `In Review` exit is the Orchestrator's.
