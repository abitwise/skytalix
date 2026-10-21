---
id: ABC-188
title: "A deletion-only edit to a limb-1 holder fires nothing on clause (b), and `ABC-168` makes `src/uci.ts` the second holder (the `AR-163-DELONLY` fix, owed before `ABC-168` merges)"
status: in-review
column: In Review
size: S
priority: P2
epic: —
feature: —
---

# ABC-188: clause (b) limb 1 fires on any changed line in a limb-1 holder, `+` or `−`, including a holder deleted at `<head>`. The harness rows flip, and `ADR-0036` § S1 records the widened ruling. 0 `src/` lines

> **Cut 2026-10-21 by BA/PM** (subtask `bapm-cut-ABC-168-followups`, at `main` `96dc3fa3`). Sources:
> - Security/NFR on `ABC-168`: `.grugops/context/security-nfr-ABC-168/notes/…decision-75a45be0` § 2 (the term
>   applied, and the widened ruling worded at that gate), with readings in `…observation-edfed8cb` § 3 (D1, D2).
> - The term itself: `.grugops/context/security-nfr-ABC-163/notes/…decision-3e4b4a08` § 2 (`AR-163-DELONLY`,
>   trigger (iv)), as written into `ADR-0036` § S1.
> - The owner record: `…orchestrator-decision-e37f4a1a`.
> - QE's gap `QE-182-a`: `.grugops/context/qe-ABC-182/notes/…observation-87ce96c8`.
>
> The readings and plants measured for this cut are in `.grugops/context/bapm-cut-ABC-168-followups/notes/`. They
> were measured on a scratch prototype only, which is not a design.

## Problem

*User:* the Orchestrator and Security/NFR, who route every ticket on clause (b)'s output. Also the owner, whose
`ABC-168` (P1) merge is held on this ticket.

*Pain:*
- **Ruling 2's unit is a `+` line.** An edit that only deletes lines in a file that holds limb 1 fires nothing
  (`AR-163-DELONLY`).
- **`ABC-168` fired the risk's trigger (iv).** It makes `src/uci.ts` a second limb-1 holder.
- **Security/NFR measured two deletion-only edits to `src/uci.ts`** at `b71f8902`:
  - D1 drops `process.exitCode = INTERNAL_ERROR_EXIT_CODE;` (0/1).
  - D2 drops the 4-line `sink.on("error", …)` EPIPE arm (0/4).
  - Neither fires on any limb, and both pass `npm test` and the `UCI_DEEP` lane.
  - Only QE's hand readings of `A3`/`A4` catch them.
- **Until this is fixed:**
  - the Orchestrator runs the by-hand `--name-only` check at every routing;
  - `ABC-168`'s merge is held, unless the owner accepts the risk at MEDIUM by name.

*Value:*
- The instrument fires on every changed line in a holder file, so a deletion in `src/uci.ts` or `src/book-file.ts`
  routes itself to Security/NFR.
- The by-hand check retires, and `AR-163-DELONLY` closes.
- `ABC-168`'s merge hold lifts.

## Scope

Four files. Everything else is out of scope.

1. **`.grugops/context/design-F-072-1/probe/clause-b.mjs`.** For limb 1, Ruling 2 fires on a production file that
   holds limb 1 in code at `<base>` or `<head>` and has **any changed line, `+` or `−`, comments included**. Two
   places in today's code miss this (both measured at cut, see the notes):
   - **(a) a holder with only `−` hunks.** It is skipped by `!lines.size` at `:273`. Dropping that skip alone flips
     `G1-IMP`, `G1-GRD`, `G1B`, `UNC1`, D1 and D2 to FIRES.
   - **(b) a holder deleted or renamed away at `<head>`.** `addedLines` (`:207`) sets `file = null` on
     `+++ /dev/null`, so that file never reaches Ruling 2. With only (a) fixed, `REN` (QE's rename-and-drop plant)
     still does not fire. Security/NFR's worded ruling ("any changed line … in a production file that holds limb 1
     … at `<base>` or `<head>`") covers this file, and the by-hand `--name-only` check that this fix retires lists it.

   Each file line under `(b1) Ruling 2` prints the file's `+` count and its `−` count.

   **Unchanged:**
   - the empty-holder case: with no holder at either end, Ruling 2 adds nothing and runs no pathspec diff;
   - limbs 2 and 3, byte for byte;
   - `(b1) capability`.

   How the code does all this is the builder's choice.
2. **`.grugops/context/design-F-072-1/probe/r2-mutants.sh`.**
   - The `G1-IMP` and `G1-GRD` expected verdicts flip to FIRES, and their `AR-163-DELONLY gap` labels change.
   - Three rows are added: `G1B`, `UNC1` and `REN`.
   - The header comment changes to match.
   - **`QE-182-a` is folded in:** each plant checks that the files it changed (its `git diff --name-only`) are
     exactly the files that plant names. If they are not, it exits **2** and names the plant. Today `mk` refuses a
     plant only when nothing changed.
3. **`.grugops/context/design-F-072-1/probe/r2-mutants.out.txt`**, regenerated from `A4`'s run.
4. **`memory-bank/50-decisions/ADR-0036-…md`**: one dated block appended under `### S1` (see `A8`). No existing line
   is edited.

**The rows after this ticket** (plants are made on `<tip>`, except `NOH`, which is made at `f00038ef^1`):

| row | edit | expected limb 1 | expected Ruling 2 list |
|---|---|---|---|
| `P2b`, `P2c`, `CMT` | unchanged | FIRES | `src/book-file.ts@<base> and <head>` |
| `X1` | unchanged | FIRES | `src/book-file.ts@<base>` |
| `NOH` | unchanged | does not fire; `adds nothing` | — |
| `G1-IMP` | unchanged: only the import line of `src/book-file.ts` is deleted | **FIRES** (was: does not fire) | `src/book-file.ts@<base>` |
| `G1-GRD` | unchanged: base guards the read with a parameter, head deletes only the guard line | **FIRES** (was: does not fire) | `src/book-file.ts@<base> and <head>` |
| `G1B` (new) | Security/NFR's G-1b (`…3b895278` § 2): base adds a guard with no parameter, `const st = statSync(BOOK)` then `if (!st.isFile() \|\| st.size > 1_048_576) throw …`; head deletes only the `if` line | FIRES | `src/book-file.ts@<base> and <head>` |
| `UNC1` (new) | QE's limb-1 uncomment plant (`…7f56f339`): base prefixes `src/book.ts` with `/*`, `import { readFileSync } from "node:fs";`, `*/`; head deletes only the two delimiter lines | FIRES | `src/book.ts@<head>` |
| `REN` (new) | QE's rename-and-drop plant (`…7f56f339`): `src/book-file.ts` → `src/book-reader.ts`, its `node:fs` import dropped, returns `new Uint8Array(0)`; the `src/cli.ts` import follows | FIRES | `src/book-file.ts@<base>` |

## Out of scope

- **`AR-163-UNCOMMENT` on limbs 2 and 3.** It stays a separate risk, and no ticket is cut for it. Its limb-1 case
  is covered here by `UNC1`, as `…3e4b4a08` § 3 says. See *AR-163-UNCOMMENT* below.
- **D1 and D2 as committed harness rows.** They need `src/uci.ts`, which `main` does not hold until `ABC-168`
  merges. QE reads them by hand (`A6`). Adding them as rows after that merge is not owed.
- **Widening Ruling 2 to limbs 2 or 3.** Security/NFR ruled limb 1 only.
- **`QE-182-b`** (exit 1 from a relative instrument path) and **`QE-182-c`** (NOH's partial checks): both INFO, and
  the reading rule for each stands.
- **Any `src/`, `biome.json` or test-runner change.** No vitest suite and no gate wiring.
- **Editing any existing line of `ADR-0036`.** The `ABC-163` text stays as history.

## Acceptance (Given/When/Then)

"Base" is `main` at pull time (`96dc3fa3` at cut). "Head" is the branch merged with the latest `main`. `<tip>` is
head's commit. Every run uses a scratch directory and a private `TMPDIR`.

- **`A1` (files).** `git diff --name-only main...HEAD` lists exactly the four Scope files. It also lists this hop's
  own records: notes under `.grugops/context/*/notes/`, `.grugops/queue/`, and this page and `plans/board.md` if
  the hop edits them. Those are ignored (`QE-182-d`). The UAT waiver form in `AGENTS.md`
  (`git diff --name-only <range> | grep -v '\.test\.ts$' | grep '^src/'`) prints nothing.
- **`A2` (red on base's instrument; run first).**
  - **Given** head's `r2-mutants.sh`, and base's `clause-b.mjs` copied to a scratch path where `typescript`
    resolves;
  - **when** `bash r2-mutants.sh <repo> <tip> <scratch> <that copy>` runs;
  - **then** it exits **1** and prints `limb 1 MISMATCH: G1-IMP G1-GRD G1B UNC1 REN`. That is exactly those five,
    and no `DIFFER` line is printed.
  - *(Measured at cut: base's instrument fires on none of the five.)*
- **`A3` (red on a partial fix).**
  - **Given** a scratch copy of base's instrument with only `!lines.size || ` removed from `:273`;
  - **when** the same command runs with it;
  - **then** it exits **1**, and the only mismatch it names is `REN`.
  - *(Measured at cut, with the plants run by hand: that copy fires on `G1-IMP`, `G1-GRD`, `G1B`, `UNC1`, D1 and
    D2, but not on `REN`.)*
- **`A4` (green on head).**
  - **Given** head's `clause-b.mjs`;
  - **when** the same command runs with its absolute path;
  - **then**:
    - it exits **0**;
    - it prints 10 rows whose verdicts and Ruling 2 lists match the table above;
    - limbs 2 and 3 are identical to `341da4c1` on 10 of 10;
    - afterwards `git -C <repo> status --porcelain` is empty, and `HEAD` and the refs are unchanged.
- **`A5` (the `−` count is printed).** In `A4`'s output:
  - `G1-IMP`'s file line under `(b1) Ruling 2` shows `+` 0 and `−` 1;
  - `G1B`'s shows `+` 0 and `−` 1;
  - `REN`'s line for `src/book-file.ts` shows `+` 0 and `−` 17 (the whole file at base);
  - `P2b`'s shows `+` 1 and `−` 1.
- **`A6` (`ABC-168`'s deletion plants, D1 and D2).**
  - **Given** a scratch clone checked out at `b71f8902`. Use `ABC-168`'s tip at read time instead if its
    `src/uci.ts` has changed, and re-plant the same two edits there.
  - **When** head's instrument runs `node <clause-b.mjs> <b71f8902> <plant> <limb>` on:
    - D1 (delete only the line `process.exitCode = INTERNAL_ERROR_EXIT_CODE;`, numstat `0 1`);
    - D2 (delete only the 4-line `sink.on("error", …)` arm, numstat `0 4`);
  - **then** for each plant:
    - limb 1 reads **FIRES**, and Ruling 2 names `src/uci.ts`, holding limb 1 at `<base> and <head>`, with `−` 1
      and `−` 4 respectively;
    - limbs 2 and 3 print what the `341da4c1` copy prints;
    - base's instrument reads limb 1 **does not fire**.
- **`A7` (`QE-182-a`: a plant that applies only in part is refused).**
  - **Given** a scratch commit on `<tip>` in which `src/cli.ts` no longer contains `read: readBookFile,`, as QE
    did at `14989ee2`;
  - **when** the harness runs with that commit as `<tip>`;
  - **then** it exits **2**, and stderr names `P2c`. It does not exit 0 with `P2c … ok`.
- **`A8` (`ADR-0036` records the ruling).**
  - `git diff -U0 main...HEAD -- memory-bank/50-decisions/ADR-0036-*.md` shows only `+` lines (0 `−`).
  - It adds one block headed `#### Ruling 2 widened — <date> (ABC-188)`, placed after the `ABC-163` block. The
    block states:
    - (i) for limb 1, (b1) fires on any changed line, `+` or `−`, comments included, in a production file that
      holds limb 1 in code at `<base>` or `<head>`;
    - (ii) a holder file deleted or renamed away at `<head>` counts;
    - (iii) with no holder at either end, Ruling 2 adds nothing and runs no pathspec diff;
    - (iv) the by-hand `--name-only` check retires when this merges;
    - (v) `AR-163-DELONLY` closes on QE's read of `A2`–`A7`, and the Orchestrator records the close;
    - (vi) `UNC1` covers `AR-163-UNCOMMENT` on limb 1 only.
- **`A9` (no lane moves).**
  - `npm test` exits 0 with the same file and test counts as base (59 / 1987 at cut, per QE-187's reading at
    `4890782a`; `src/` is byte-equal to `96dc3fa3`).
  - Skips are **0**. `biome.json` is unchanged.
  - lint, typecheck and build exit 0.

## Dependencies

- **None blocking.** `ABC-182` merged, so `r2-mutants.sh` is on `main`. `b71f8902` is reachable on
  `grugops/ABC-168`.
- **Due before `ABC-168` merges.** This is `AR-163-DELONLY`'s own term, applied by Security/NFR in `…75a45be0`
  § 2. The owner may instead accept the risk at MEDIUM by name and merge `ABC-168` first.
- **No file overlap with `ABC-168`**, which touches `src/`, `package.json`, `tsconfig.build.json`, `AGENTS.md` and
  its own records. The two can be built in parallel.
- **Until this merges,** the Orchestrator keeps the by-hand check on `src/book-file.ts` and `src/uci.ts` at every
  routing.

## Security / NFR triggers

- **Security:** this closes `AR-163-DELONLY` (MEDIUM while its trigger stands). The term closes on **QE's read**
  (`A2`–`A7`), so no Security/NFR gate is required. `A8` writes Security/NFR's own ruling into the ADR, and adds
  case (ii). So BA/PM recommends a short Security/NFR read of `A8`'s text against `…75a45be0` § 2. That is a
  records read, not a gate, and routing it is the Orchestrator's call.
- **`NFR-008`:** 0 / 0 / 0. The instrument and the harness run by hand, outside `npm test`.

## AR-163-UNCOMMENT: stays separate

It does not ride along, for three reasons.
- **Its limb-1 case is already covered here.** `UNC1` fires once this ticket lands (measured on the prototype),
  because the uncommented file is a holder at `<head>`.
- **Limbs 2 and 3 would contradict this ticket's own check.** Closing them needs the risk's own fix (an AST
  occurrence count on every limb). That changes limbs 2 and 3, which `A4` holds byte-identical to `341da4c1`.
- **Its trigger has not fired.** There are 0 non-JSDoc block-comment openers in production `src/` at `96dc3fa3` and
  at `b71f8902`. Whether a JSDoc block holds compilable limb code was not read: `UNKNOWN - verify`, and Security/NFR's
  trigger check at each gate stands. Security/NFR also ruled "no cut now" (`…3e4b4a08` § 3).

So the risk stays open, LOW, owner Architect/Design, with limb 1 covered when this merges. The Orchestrator records
that partial.

## Test notes

1. **Run `A2` and `A3` before `A4`**, to show the plants have teeth.
2. **`typescript` must resolve for every instrument copy.** Use a scratch directory with `node_modules` symlinked,
   as `ABC-182` does for its `341da4c1` copy. The harness takes absolute instrument paths only (`QE-182-b`).
3. **The harness's row parser** reads each Ruling 2 file line up to `holds limb 1 at (.*)\)$`. Either keep that
   suffix, or change the parser in the same commit.
4. **The summary line `holder files with + lines: N`** will read wrong once `−`-only files count. NOH's `adds nothing`
   is the only part of it the harness checks. The builder words it.
5. **Measured at cut** (scratch prototype, not a design): dropping only the skip flips `G1-IMP`, `G1-GRD`, `G1B`,
   `UNC1`, D1 and D2, and leaves `REN`, and a plain holder delete, silent. Limbs 2 and 3 stayed identical on the 7
   existing rows.
6. **Gates:** lint, typecheck, build, `npm test`, skip count 0. A QE hop is owed: QE reads `A2`–`A7` itself. The UAT
   waiver is expected (0 `src/` lines, `A1`).
7. **Builder:** Architect/Design, who owns the instrument and the ADR. `ABC-163`'s precedent had the SE build the
   instrument and the Architect write the ADR text. Either way, the Orchestrator routes the build.
8. No timing at any hop.

## Size and priority

**`S`:** the instrument change touches two places (the skip and the deleted-file path). The harness gains three rows
and a per-plant file check. The output is regenerated, and the ADR gains one block. **Not `XS`:** four files,
including an ADR. **Not `M`:** every edit is named, and every criterion is a script run.

**`P2`**, as the brief sets it. It is due before `ABC-168` (P1) merges, and that merge is held on it, so the
Orchestrator pulls it next.

## Definition of Ready

BA/PM, 2026-10-21 at `96dc3fa3`. **Result: 10 of 10.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** trigger (iv) fired; D1 and D2 fire nothing (measured by Security/NFR and again at cut); `ABC-168`'s merge is held |
| 2 | scope and out-of-scope clear | **✅** four files; 10 rows in a table; `AR-163-UNCOMMENT` on limbs 2 and 3, D1/D2 as rows, limbs 2/3 widening, and `QE-182-b`/`-c` fenced |
| 3 | INVEST-shaped | **✅** independent of `ABC-168` (no file overlap); valuable alone (closes a MEDIUM risk); `S`; every criterion is a script run |
| 4 | acceptance testable and measurable | **✅** exactly 5 mismatches on base, exactly `REN` on the partial copy, 10/10 rows and limbs 2/3 identical on head, `−` counts 1/1/17, D1 and D2 FIRE, exit 2 on the drift, ADR diff 0 `−` lines, counts equal base |
| 5 | dependencies known | **✅** none blocking; due before `ABC-168` merges; interim by-hand check named |
| 6 | security/NFR triggers with a measurable target | **✅** closes `AR-163-DELONLY` on QE's read; `NFR-008` 0/0/0 |
| 7 | test notes present | **✅** eight |
| 8 | size assigned | **✅** `S` |
| 9 | priority assigned | **✅** `P2`, pulled next |
| 10 | no major unresolved blocker | **✅** none. The deleted-holder case (b) follows Security/NFR's own words; if the Architect reads the ruling more narrowly, it goes back to Security/NFR before the build |

Column moves after `Ready` are the Orchestrator's.

## QE

**QE/E2E, 2026-10-21 (`qe-ABC-188`): PASS_WITH_GAPS** (`QE-188-a` LOW, `QE-188-b` INFO; 0 blocking). Branch
`grugops/qe-ABC-188`, from the tip `66d6a2f1`, with `main` `2c29a603` merged at **`85b462f0`**. QE ran every criterion
there itself, before reading the Architect's notes, and those notes agree on each one.

| | result |
|---|---|
| A1 | MET: the 4 Scope files plus the Architect's 2 notes (ignored per `QE-182-d`). The waiver form prints nothing over the range and per commit |
| A2 | MET: base instrument, rc 1, `limb 1 MISMATCH: G1-IMP G1-GRD G1B UNC1 REN`, 0 `DIFFER` |
| A3 | MET: skip-only copy, rc 1, `limb 1 MISMATCH: REN`, 0 `DIFFER` |
| A4 | MET: rc 0, 10 of 10 rows, limbs 2/3 identical 10 of 10. Status, `HEAD` and 46 refs unchanged |
| A5 | MET: G1-IMP 0/1, G1B 0/1, REN `src/book-file.ts` 0/17, P2b 1/1 |
| A6 | MET: at `b71f8902`, D1 FIRES `src/uci.ts` 0/1 and D2 FIRES 0/4, both `<base> and <head>`. Limbs 2/3 match `341da4c1`. Base instrument: does not fire |
| A7 | MET: drift `a090f354` (P2c's `cli.ts` edit does not apply), rc 2, stderr names `P2c` |
| A8 | MET: 25 `+` / 0 `−`. The block is dated, sits after `ABC-163`, and states (i)–(vi) consistently with the code. (iv) goes past the instrument's cover for binary-flagged files (`QE-188-a`) |
| A9 | MET: lint, typecheck and build rc 0. `npm test` 59 / 1987, `last-run.json` success. Skip-count 0, `No findings.` `biome.json` unchanged |

- **`AR-163-DELONLY`'s close condition is MET.** G-1b (G1B) and the import-line drop (G1-IMP) fire, as do UNC1, D1 and
  D2, and the empty case adds nothing. The Orchestrator records the close.
- **QE's 17 own plants:**
  - Every deleted, moved, renamed (also to `.test.ts` and `.d.ts`), truncated and blank-line-only holder edit fires, on
    `src/book-file.ts` and `src/uci.ts`.
  - The non-holder and caller-line controls do not fire.
  - Limbs 2/3 match `341da4c1` on every plant.
  - Limb 1's output outside the Ruling 2 block equals base on all 29.
  - A git shim shows one diff call, `-- src`.
- **`QE-188-a` (LOW; Security/NFR rates it, Architect/Design fixes it).** One NUL byte in a holder's comment makes git
  treat the file as binary. The instrument then sees no changed line on any limb, which was already true before this
  ticket. `biome` and `tsc` pass. `--name-only` lists the file, and (iv) retires that check. **Interim, for the
  Orchestrator:** `git diff --numstat <base> <head> -- src | awk '$1=="-"'` must print nothing.
- **`QE-188-b` (INFO).** A plant whose two edits are in one file, with only one applied, exits 1 (MISMATCH), not 2.
  Check the plant's diff before blaming the instrument.
- **UAT: waived** (0 production lines). A waiver is not a signature. No timing was taken.
- **Notes:** `.grugops/context/qe-ABC-188/notes/` (`…8ea32c43`, `…b2674938`, `…36ec80ab`, `…0b73ec04`, decision
  `…bfbbb83f`).
