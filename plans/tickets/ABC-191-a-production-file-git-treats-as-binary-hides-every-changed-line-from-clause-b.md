---
id: ABC-191
title: "A production file git treats as binary hides every changed line from clause (b) (the `AR-188-BINARY` fix)"
status: done
column: Done
size: XS
priority: P3
epic: —
feature: —
---

# ABC-191: clause (b)'s one diff call reads `--text --no-textconv`. The harness gains a NUL plant and a `-diff` plant, both FIRE on limb 1, and `ADR-0036` § S1 retires the `--numstat` stand-in. 0 `src/` lines

> **Cut 2026-10-21 by BA/PM** (subtask `bapm-cut-AR-188-BINARY`, at `main` `1ee70c63`). Sources:
> - Security/NFR on `ABC-188`: `.grugops/context/security-nfr-ABC-188/notes/…decision-f5843a71` § 3 (the risk
>   accepted, rated and given a fix shape and a close term), with readings in `…observation-534bddbb` § 3 (plants 1–3).
> - The owner record: `…orchestrator-decision-9f5ca4b4` (`AR-188-BINARY` opened; the `--numstat` stand-in).
> - QE's gap `QE-188-a`: `.grugops/context/qe-ABC-188/notes/…observation-0b73ec04` and Q11c in `…observation-b2674938`.
>
> The readings measured for this cut are in `.grugops/context/bapm-cut-AR-188-BINARY/notes/`. They were taken on a
> scratch prototype only, which is not a design.

## Problem

*User:* the Orchestrator and Security/NFR, who route every ticket on clause (b)'s output.

*Pain:*
- **When git treats a production file as binary, the instrument sees no changed line in it, on any limb.** A `-U0`
  diff of such a file prints `Binary files … differ` and no hunk.
- **Three routes reach this, and none needs an odd tool:**
  - a NUL byte in a holder's comment (QE Q11c). `biome` and `tsc` pass, and Node runs the file;
  - a committed `.gitattributes` line `src/** -diff` in the checkout the instrument runs from (Security/NFR plant 2);
  - the same line in `.git/info/attributes` (measured at cut; no file is committed).
- **It can hide a widening.** An ADDED `node:fs` import is invisible (QE Q11b, Security/NFR plant 1). That is the
  `F-095-1` class: a form that passes silently.
- **A textconv driver garbles the line map.** With `diff=<driver>` and a configured `textconv`, limb 1 still fires,
  but the counts and line numbers are the driver's output, not the file's (Security/NFR plant 3; this host has a
  global `diff.bin.textconv`).
- **Until this lands,** the Orchestrator runs `git diff --numstat <base> <head> -- src | awk '$1=="-"'` at every
  routing and merge, in the same checkout as the instrument (`…9f5ca4b4`).

*Value:*
- The instrument reads every production file as text, so a binary-flagged change routes itself.
- The stand-in retires, and `AR-188-BINARY` closes.

## Scope

Four files. Everything else is out of scope.

1. **`.grugops/context/design-F-072-1/probe/clause-b.mjs`.** Its one diff call (`changedLines`, `:211`) reads
   `--text --no-textconv`. Nothing else in the instrument changes. *(Measured at cut: adding the two flags to that
   argv is the whole prototype.)*
2. **`.grugops/context/design-F-072-1/probe/r2-mutants.sh`.** Two rows are added, after `REN`:
   - **`BIN-NUL`:** X1's edit, plus one NUL byte in the holder's JSDoc (QE Q11c: `* \`ABC-095\`` becomes
     `* \x00\`ABC-095\``). It names `src/book-file.ts`.
   - **`BIN-ATTR`:** X1's edit, plus a committed `.gitattributes` holding the one line `src/** -diff`. It names
     `src/book-file.ts` and `.gitattributes`. The row runs with that plant checked out, so the attribute applies.

   **How limbs 2 and 3 read on the two new rows.** `341da4c1` is blind to both plants, so comparing with it on the
   same plant would hold the instrument to blindness. Instead, on `BIN-NUL` and `BIN-ATTR`, limbs 2 and 3 are
   compared with **`341da4c1`'s output on X1** (the same edit without the binary marker), **with plant ids masked**.
   That reference is taken **with X1 checked out**, because a checked-out `-diff` line blinds every instrument run
   in that tree, the reference included (measured at cut). The 10 existing rows keep their byte-for-byte comparison
   with `341da4c1` on the same plant.

   The summary line counts 12 rows and names both comparisons (the builder words it). The header comment changes
   to match.
3. **`.grugops/context/design-F-072-1/probe/r2-mutants.out.txt`**, regenerated from `A4`'s run.
4. **`memory-bank/50-decisions/ADR-0036-…md`**: one dated block appended under `### S1`, after the `ABC-188` block
   (see `A8`). No existing line is edited.

**The rows after this ticket** (the 10 rows of `ABC-188` are unchanged; plants are made on `<tip>`):

| row | edit | expected limb 1 | expected Ruling 2 list | limbs 2/3 compared with |
|---|---|---|---|---|
| the 10 `ABC-188` rows | unchanged | unchanged | unchanged | `341da4c1` on the same plant |
| `BIN-NUL` (new) | X1's edit, plus a NUL byte in the holder's JSDoc | FIRES | `src/book-file.ts@<base>` | `341da4c1` on X1, plant ids masked |
| `BIN-ATTR` (new) | X1's edit, plus a committed `.gitattributes` `src/** -diff` | FIRES | `src/book-file.ts@<base>` | `341da4c1` on X1, plant ids masked |

## Out of scope

- **A textconv row in the harness.** The brief names two plants. `--no-textconv` is read by hand (`A6`).
- **A row for `.git/info/attributes`.** The same flag covers it. Measured at cut: today's instrument does not fire on
  X1 with that file present, and the prototype fires.
- **Widening any ruling.** No limb's unit changes, and Ruling 2 is untouched.
- **The `production files changed` omission of a file deleted at `<head>`** (INFO, Security/NFR `…f5843a71` § 4).
- **`AR-163-UNCOMMENT` on limbs 2 and 3**, and **`QE-188-b`** (INFO; its reading rule stands).
- **Any `src/`, `biome.json`, `.gitattributes` or test-runner change in the repository.** The `.gitattributes` in
  `BIN-ATTR` exists only in the harness's scratch clone.
- **Editing any existing line of `ADR-0036`.**

## Acceptance (Given/When/Then)

"Base" is `main` at pull time (`1ee70c63` at cut; instrument sha-256 `55641c55cac2c060…`). "Head" is the branch merged
with the latest `main`. `<tip>` is head's commit. Every run uses a scratch directory and a private `TMPDIR`, with
`node_modules/typescript` resolvable beside every instrument copy and absolute instrument paths (`QE-182-b`).

- **`A1` (files).** `git diff --name-only main...HEAD` lists exactly the four Scope files. It also lists this hop's
  own records: notes under `.grugops/context/*/notes/`, `.grugops/queue/`, and this page and `plans/board.md` if
  the hop edits them. Those are ignored (`QE-182-d`). The UAT waiver form in `AGENTS.md`
  (`git diff --name-only <range> | grep -v '\.test\.ts$' | grep '^src/'`) prints nothing.
- **`A2` (red on base's instrument; run first).**
  - **Given** head's `r2-mutants.sh` and base's `clause-b.mjs`;
  - **when** `bash r2-mutants.sh <repo> <tip> <scratch> <base instrument>` runs;
  - **then**:
    - it exits **1**;
    - it prints `limb 1 MISMATCH: BIN-NUL BIN-ATTR`, exactly those two;
    - it prints a limbs-2/3 `DIFFER` line naming exactly `BIN-NUL:limb2 BIN-NUL:limb3 BIN-ATTR:limb2 BIN-ATTR:limb3`;
    - the 10 existing rows read `ok`, with limbs 2 and 3 `identical`.
  - *(Measured at cut. A scratch copy of the harness with the two rows gave rc 1, `limb 1 MISMATCH: BIN-NUL BIN-ATTR`,
    and 10 existing rows `ok` and `identical`. That copy still compared limbs 2/3 on the same plant, so the four limb
    diffs against `341da4c1` on X1 were read by hand: all four DIFFER.)*
- **`A3` (each flag alone falls short).**
  - **Given** a scratch copy of base's instrument whose diff call gains only `--no-textconv`, **when** the `A2`
    command runs with it, **then** its result is the same as `A2`'s: rc 1, with the same two rows and four limbs
    named.
  - **Given** a scratch copy whose diff call gains only `--text`, **when** the `A2` command runs with it, **then** it
    exits 0, and `A6`'s plant reads counts other than `1 + line, 3 - lines` on it.
  - *(Measured at cut, with the limb 1 verdicts from the scratch harness and the limbs 2/3 comparisons against
    `341da4c1` on X1 read by hand. `--no-textconv` only: limb 1 MISMATCH on exactly `BIN-NUL` and `BIN-ATTR`, and all
    four limb diffs DIFFER. `--text` only: 12 of 12 `ok`, and all four comparisons identical. On `A6`'s plant, the
    `--text`-only copy reads `6 + lines, 12 - lines`, and so does base.)*
- **`A4` (green on head).**
  - **Given** head's `clause-b.mjs`;
  - **when** the `A2` command runs with its absolute path;
  - **then**:
    - it exits **0**;
    - it prints 12 rows whose verdicts and Ruling 2 lists match the table above;
    - limbs 2 and 3 are identical to `341da4c1` on the same plant for the 10 existing rows, and to `341da4c1` on X1
      (plant ids masked) for `BIN-NUL` and `BIN-ATTR`;
    - afterwards `git -C <repo> status --porcelain` is empty, and `HEAD` and the refs are unchanged.
  - *(Measured at cut, with the prototype: limb 1 reads `ok` on 12 of 12, and limbs 2/3 are identical on the 10
    existing rows. By hand, on the two new rows, limbs 2 and 3 equal `341da4c1` on X1, and differ from `341da4c1` on
    the same plant only on the line `production files changed: 0` → `1` plus `src/book-file.ts`.)*
- **`A5` (the counts are the file's).** In `A4`'s output:
  - `BIN-NUL`'s file line under `(b1) Ruling 2` shows `+` 2 and `−` 4 (X1's 1 and 3, plus the JSDoc line that
    carries the NUL);
  - `BIN-ATTR`'s shows `+` 1 and `−` 3, the same as X1's.
- **`A6` (textconv; by hand, not a harness row).**
  - **Given** a scratch clone at `<tip>` with a plant `TXC`: X1's edit plus a committed `.gitattributes` line
    `src/** diff=bin`, checked out, and a clone-local `git config diff.bin.textconv "hexdump -v -C"`;
  - **when** `node <clause-b.mjs> <tip> <TXC> 1` runs with head's instrument;
  - **then** limb 1 reads **FIRES**, and the `src/book-file.ts` line under `(b1) Ruling 2` shows `+` 1 and `−` 3,
    the same as X1's. Base's instrument shows other counts (`6` / `12` at cut).
  - Limbs 2 and 3 on `TXC` equal `341da4c1` on X1, plant ids masked (at cut, on both instruments).
- **`A7` (one diff call).**
  - **Given** a git shim that logs every git call, as QE used at `ABC-188`;
  - **when** head's instrument runs on `BIN-NUL` for limb 1;
  - **then** exactly one `diff` call is logged. It carries `-U0`, `--no-renames`, `--text` and `--no-textconv`, and
    the pathspec `-- src`. The total number of git calls equals base's on the same plant. The call is still
    `execFileSync` with an argument array and no shell (`V1.2.5`).
- **`A8` (`ADR-0036` records it).**
  - `git diff -U0 main...HEAD -- memory-bank/50-decisions/ADR-0036-*.md` shows only `+` lines (0 `−`).
  - It adds one block headed `#### Binary-flagged files read as text — <date> (ABC-191)`, placed after the `ABC-188`
    block. The block states:
    - (i) the instrument's one diff call reads `--text --no-textconv`. So a production file git treats as binary (a
      NUL byte, or a `-diff` attribute from any attributes source) shows its changed lines on every limb, and a
      textconv driver no longer changes the line map;
    - (ii) the Orchestrator's `--numstat` stand-in retires when this merges;
    - (iii) `AR-188-BINARY` closes on QE's read of `A2`–`A7`, and the Orchestrator records the close;
    - a rollback sentence: revert the instrument commit, and the stand-in returns.
- **`A9` (no lane moves).**
  - `npm test` exits 0 with the same file and test counts as base (59 / 1987 per QE at `85b462f0`; `src/` is
    unchanged since).
  - Skips are **0**. `biome.json` is unchanged.
  - lint, typecheck and build exit 0.

## Dependencies

- **None blocking.** `ABC-188` is merged, so the 10-row harness and the `−` counts are on `main`.
- **No file overlap** with `ABC-168` (`src/`, `package.json`, `tsconfig.build.json`, `AGENTS.md`), `ABC-189`
  (`src/cli.test.ts`) or `ABC-190` (`package-lock.json`).
- **Gates no merge** (Security/NFR `…f5843a71` § 3). Until this merges, the Orchestrator keeps the `--numstat`
  stand-in at every routing and merge.

## Security / NFR triggers

- **Security:** this closes `AR-188-BINARY`. It is LOW while the stand-in runs, and MEDIUM without it (`F-095-1`
  class; it could hide a `V5.2.1` / `V5.3.2` regression). The term closes on **QE's read** (`A2`–`A7`: both plants
  fire at head and are silent on base's instrument), as `…f5843a71` § 3 states. No Security/NFR gate is required.
  The call surface stays one `execFileSync` with an argv and no shell (`V1.2.5`; `A7`).
- **`NFR-008`:** 0 / 0 / 0. The instrument and the harness run by hand, outside `npm test`.

## Test notes

1. **Run `A2` and `A3` before `A4`**, to show the plants and each flag have teeth.
2. **`BIN-ATTR` must run with its plant checked out.** The harness already runs each row before its
   `git reset --hard`, and that reset removes the plant's `.gitattributes`. A `-diff` line in the working tree
   blinds every instrument run there, including the `341da4c1` reference. So the X1 reference for limbs 2/3 is taken
   at X1's row, with X1 checked out.
3. **Plant ids differ between X1 and the binary rows.** Mask them in the `diff <base>..<head> = …` line, and
   nowhere else, before comparing. Measured at cut: after masking, the prototype's limbs 2/3 output on both binary
   rows equals `341da4c1` on X1 byte for byte.
4. **`mk`'s file check covers `.gitattributes`**: `BIN-ATTR` names it, and the diff's `-- src` pathspec leaves it
   out of the instrument's view.
5. **This host has a global `diff.bin.textconv hexdump -v -C`.** No harness row sets `diff=bin`, so it does not
   touch the 12 rows. `A6` sets the driver clone-locally so it reproduces on any host. Unsetting the clone-local
   value does not remove the global one.
6. **Measured at cut** (scratch prototype, not a design): `A2`, `A3`, `A4` limb 1, the limbs 2/3 comparisons, the
   `A5` counts, `A6`, and the `.git/info/attributes` route. Readings are in `…bapm-cut-AR-188-BINARY/notes/`.
7. **Gates:** lint, typecheck, build, `npm test`, skip count 0. A QE hop is owed: QE reads `A2`–`A7` itself. The UAT
   waiver is expected (0 `src/` lines, `A1`).
8. **Builder:** Architect/Design, who owns the instrument and the ADR. No timing at any hop.

## Size and priority

**`XS`:** the instrument change is one argv. The harness gains two rows and one reference comparison. The output is
regenerated, and the ADR gains one short block that restates a measured fact, not a new ruling. Every edit is
named, and every criterion was run at cut on a prototype. `ABC-188` was `S` for its two code paths and a widened
ruling; this has neither.

**`P3`**, as Security/NFR and the brief set it. It gates no merge, and the stand-in holds the risk at LOW meanwhile.

## Definition of Ready

BA/PM, 2026-10-21 at `1ee70c63`. **Result: 10 of 10.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** three routes blind every limb (Q11c, plant 2, and `.git/info/attributes`, each measured); a fourth garbles the line map; the stand-in is manual |
| 2 | scope and out-of-scope clear | **✅** four files; 12 rows in a table; the limbs 2/3 reference for the new rows named; textconv and info-attributes rows, ruling changes, and the INFO items fenced |
| 3 | INVEST-shaped | **✅** independent (no file overlap; gates nothing); valuable alone (closes a risk, retires a manual check); `XS`; every criterion is a script run |
| 4 | acceptance testable and measurable | **✅** exactly 2 mismatches and 4 limb diffs on base, each flag alone short, 12/12 at head, counts 2/4 and 1/3, TXC at 1/3, one diff call with both flags, ADR diff 0 `−`, counts equal base |
| 5 | dependencies known | **✅** none blocking; the stand-in runs until merge |
| 6 | security/NFR triggers with a measurable target | **✅** closes `AR-188-BINARY` on QE's read of `A2`–`A7`; `V1.2.5` held (`A7`); `NFR-008` 0/0/0 |
| 7 | test notes present | **✅** eight |
| 8 | size assigned | **✅** `XS` |
| 9 | priority assigned | **✅** `P3` |
| 10 | no major unresolved blocker | **✅** none. Which checkout the Orchestrator routes from stays `UNKNOWN - verify` (`…534bddbb` § 3), but `--text` covers every attributes source, so the answer no longer matters once this lands |

Column moves after `Ready` are the Orchestrator's.

## QE

**QE/E2E, 2026-10-21 (`qe-ABC-191`): PASS_WITH_GAPS** (`QE-191-a` LOW, `QE-191-b` INFO, `QE-191-c` INFO; 0 blocking;
none against a criterion). Branch `grugops/qe-ABC-191`, from the tip `797a238b`, with `main` `cde60d03` merged at
**`e0bc26fe`**. QE ran every criterion there itself before reading the Architect's notes, and those notes agree on each
one.

| | result |
|---|---|
| A1 | MET: the 4 Scope files plus the Architect's 2 notes (ignored per `QE-182-d`). The waiver form prints nothing over the range and per commit; `--numstat … \| awk '$1=="-"'` prints nothing |
| A2 | MET: base instrument, rc 1, `limb 1 MISMATCH: BIN-NUL BIN-ATTR`, `DIFFER` on exactly the four binary limbs; 10 rows `ok`, 20 `identical` |
| A3 | MET: `--no-textconv` only reads as A2; `--text` only is rc 0, and `TXC` reads 6/12 on it |
| A4 | MET: rc 0, 12 of 12, 22 `identical`. The 10 rows are byte-identical to base's output; status, `HEAD` and 50 refs unchanged; a re-run is byte-identical |
| A5 | MET: `BIN-NUL` 2/4, `BIN-ATTR` 1/3 |
| A6 | MET: `TXC` head FIRES 1/3, base 6/12; limbs 2/3 equal `341da4c1` on X1, masked |
| A7 | MET: 87 git calls on head and on base; one `diff -U0 --no-renames --text --no-textconv … -- src`; one `execFileSync` with an argv and no shell |
| A8 | MET: 22 `+` / 0 `−`, dated, after the `ABC-188` block; (i)–(iii) and the rollback are consistent with the code |
| A9 | MET: lint, typecheck and build rc 0. `npm test` 59 / 1987, `last-run.json` success. Skip count 0, `No findings.` `biome.json` unchanged |

- **`AR-188-BINARY`'s close condition is MET.** Both plants fire at head and are silent on base's instrument, and
  each flag alone falls short. QE's 14 own binary plants (7 NUL placements, 5 more attribute sources including
  `.git/info/attributes` and `core.attributesFile` in a scratch clone, a `binary` driver, and textconv) fire on limb 1
  at head; two of them fire on limbs 2 and 3. The Orchestrator records the close. The `--numstat` stand-in retires at
  merge, per (ii), and it covered nothing the instrument now misses.
- **`QE-191-a` (LOW; Security/NFR rates it).** An external diff driver (`diff=<drv>` plus `diff.<drv>.command`, or
  `GIT_EXTERNAL_DIFF`), `color.diff=always` and `diff.srcPrefix` each still blind every limb, on head and on base.
  Each needs the operator's own config or environment, and none is set on this host. The stand-in never caught them
  either. This is beyond `AR-188-BINARY`'s term.
- **`QE-191-b` (INFO).** A production file with a non-ASCII name is quoted by git and goes unseen. Once a production
  file imports it, the fail-safe fires.
- **`QE-191-c` (INFO; the `R-188-b` class).** `BIN-NUL` does not assert that its NUL applied. Read its count as 2/4 on
  every re-run.
- **UAT: waived** (0 production lines). A waiver is not a signature. No timing was taken.
- **Notes:** `.grugops/context/qe-ABC-191/notes/` (`…993a870d` A1–A9, `…87c9f67b` plants, `…9bc0b262` gaps,
  `…b2a5673a` artifacts, decision `…16ba4076`).
