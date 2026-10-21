---
id: ABC-184
title: "`RealChild` records the `cwd` it spawned with, and `A7` asserts `booked.cwd` is `neutral`, so dropping `booked`'s cwd argument (TCWD) no longer lets P6f pass `CLI_DEEP` (`AR-183-CWDARG`)"
status: done
column: Done
size: XS
priority: P3
epic: EPIC-005
feature: —
---

# ABC-184: `A7` asserts the working directory the `booked` child was spawned with, not only the test's variable. Test-only, `src/cli.real-engine.test.ts`. ZERO production lines

> **Cut 2026-10-21 by BA/PM** (subtask `bapm-cut-AR-183-CWDARG`), from Security/NFR's ruling on `ABC-183`
> (`.grugops/context/security-nfr-ABC-183/notes/…decision-41f70925` § 2, fix shape; readings `…observation-d5fd47e1`)
> and the Orchestrator's owner record (`…decision-bc2b06ce`). QE found the gap as QE-183-a on `ABC-183`
> (`.grugops/context/qe-ABC-183/notes/…observation-cbd50a13`, verdict `…decision-be7c2c82`). Base readings were
> taken at `main` `69610c5b`. There, `src/cli.real-engine.test.ts` and `src/book-file.ts` are byte-identical to
> the tree QE and Security/NFR planted (`3ab055f4`, code `7bd2b54f`), so their cells apply unchanged. They are cited
> here, not re-taken.

## Problem

*User:* the next hop that edits `src/book-file.ts`, or that adds a launch path (`ABC-168`). Also a player who starts
the CLI from a directory that holds a `data/opening-book/book.json`.

*Pain:* the `AR-095-CWD` / `AR-162-FALLBACK` detector can be switched off by deleting one argument.
- The detector only works if `booked` runs from `neutral`. `neutral` is the `mkdtemp` directory that holds the decoy.
  `A7`'s `beforeAll` (`src/cli.real-engine.test.ts:469` at `69610c5b`) passes `neutral` as `spawnReal`'s fourth
  argument.
- `spawnReal`'s `cwd` defaults to the tree root (`:233-238`). The real book sits at that root.
- `RealChild` (`:223-230`) has no `cwd` field. Only the unasserted `[CLI_DEEP] (cwd …)` log line (`:257`) records the
  directory.
- `A7`'s `expect(join(neutral, "/"), "A7's working directory").not.toBe(join(REPOSITORY, "/"))` (`:497`) compares two
  test variables. It does not check the child's working directory.
- If the `neutral` argument is dropped (plant **TCWD**), the child runs from the tree root. A cwd-first read (P6f)
  finds the real book there, stderr stays empty, and the lane stays **11/11 green**. QE read this (`…cbd50a13`), and
  Security/NFR read it again with byte-identical plants (`…d5fd47e1`).

*Value:* a one-token edit to the test can no longer disarm the detector without a red row. This is the fix that closes
`AR-183-CWDARG`.

## Scope

All edits are in `src/cli.real-engine.test.ts`. This is Security/NFR's fix shape (`…41f70925` § 2):

1. **The field.** `interface RealChild` (`:223-230`) gains `readonly cwd: string`, with a one-line doc comment.
2. **The record.** `spawnNode` (`:241-266`) adds the `cwd` it passed to `spawnSync` to the object it returns
   (`:260-266`).
   - The field holds that argument string exactly. It is not a `realpath`, and the child does not report it.
   - `spawnReal` passes its `cwd` through unchanged, so the field shows a dropped argument as the tree root.
3. **The assertion.** In `A7`'s `it` (`:491-547`), add one
   `expect(booked.cwd, <message>).toBe(neutral)`. The message contains `AR-183-CWDARG`, and it should say what the
   assertion detects. The Engineer chooses the words and the line. The assertion must come before the stderr
   detector (`:542-545`), so that under TCWD + P6f the new assertion fails first.
4. **No new spawn, no new test, no new `mkdtemp`, no new removal.** Nothing else in the file changes. The existing
   `:497` assertion stays.

## Out of scope

- **Any production file.** `src/book-file.ts` is a capability holder (`ADR-0036` § S1 Ruling 2).
- **The child's real working directory.** Reading `process.cwd()` inside the child would need a child-side print or a
  new spawn. Comparing the realpath would change what is asserted.
  - Residual (INFO, not routed): a plant that edits only `spawnSync`'s `cwd` option inside `spawnNode` survives,
    because the record and the option would then differ. That takes a two-place helper edit, and it is the same
    class as QE-183-b (`…41f70925` § 3).
- **QE-183-b (TMOC).** INFO, accepted, no cut (`…bc2b06ce`). This ticket keeps it covered as a QE read: see `A4`.
- **Asserting `cwd` on any other child** (`played`, `rejected`, `bookless`, `levelled`, the `ABC-173` probe). They
  get the field because they share the type, but no new assertion is made on them.
- **Moving or rewording `ABC-180`'s and `ABC-183`'s assertions, labels and comments.** They stay as delivered.

## Acceptance (Given/When/Then)

Every vitest command carries its heap prefix: 400 for one file, 128 for multi-file runs (`ABC-173`'s guard). The deep
lane is `CLI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/cli.real-engine.test.ts`.

- **`A1` (the field is recorded).**
  - `grep -cE '^\s*readonly cwd: string;' src/cli.real-engine.test.ts` is **1** (base **0**). QE reads that line
    inside `interface RealChild`.
  - QE reads `cwd` in the object `spawnNode` returns, and that it is the same identifier `spawnSync` receives as its
    `cwd` option.
- **`A2` (asserted in `A7`, labelled, ahead of the detector).**
  - Inside `A7`'s `it`, QE reads exactly one `expect` whose first argument is `booked.cwd`. It has a message argument
    that contains `AR-183-CWDARG`, and it ends in `.toBe(neutral)`. It sits above the stderr detector.
  - `grep -c 'AR-183-CWDARG' src/cli.real-engine.test.ts` is **≥ 1** (base **0**).
  - `grep -cF 'booked.cwd' src/cli.real-engine.test.ts` is **≥ 1** (base **0**).
- **`A3` (TCWD is killed, and the earlier kills hold).** **Given** each plant below in a scratch copy outside the
  repository, **when** the deep lane runs with the base test (`69610c5b`) and then with the head test, **then** the
  counts are as follows:
  - **P6f** is the `src/book-file.ts` plant: the cwd-first `try`/`catch` body from QE `…567002e7` (`ABC-162`), as in
    `ABC-180` `A2` and `ABC-183` `A4`.
  - **TCWD** is a test-file plant: drop `booked`'s fourth argument `neutral` from
    `booked = spawnReal(REPOSITORY, …, neutral);`. Nothing else changes.
  - **TMO** is `ABC-183` `A4`'s test-file plant. The decoy's `mkdirSync` and `writeFileSync` lines move to directly
    after the `booked = spawnReal(` line, and the capture line stays where it is.

  | plant | base test | head test |
  |---|---|---|
  | none (delivered) | 11/11 green | 11/11 green |
  | P6f | 10/11, red `A7` at the stderr detector | 10/11, red `A7` at the stderr detector |
  | **TCWD + P6f** | **11/11 green** (QE `…cbd50a13`, Security/NFR `…d5fd47e1`) | **10/11, red `A7` at the new `booked.cwd` assertion** |
  | TCWD (delivered `book-file.ts`) | 11/11 green (expected: the module-URL read finds the book, and stderr is empty) | 10/11, red `A7` at the new `booked.cwd` assertion |
  | TMO + P6f | 10/11, red `A7` at `ABC-183`'s `AR-162-FALLBACK` assertion | 10/11, red `A7` at `ABC-183`'s `AR-162-FALLBACK` assertion |

  - The vitest failure output for TCWD + P6f at head contains `AR-183-CWDARG`.
  - Security/NFR's FIX cells (`…d5fd47e1`) predict the head column for the first three rows. They are evidence for
    the cut, not QE's reading.
- **`A4` (`ABC-183`'s A1 still holds; QE-183-b's standing read).**
  `grep -B1 -F 'booked = spawnReal(' src/cli.real-engine.test.ts` prints a first line that contains
  `existsSync(join(neutral, BOOK_PATH))`, as it does at `69610c5b`.
- **`A5` (fences).**
  - `git diff --name-only <base>` lists exactly `src/cli.real-engine.test.ts`.
  - The UAT-waiver form is empty:
    `git diff --name-only <delivered>~1 <delivered> | grep -v '\.test\.ts$' | grep '^src/'`. It is measured
    unfiltered, and no `.snap` changes.
  - `npm test`: the file count and the test count equal base, and skips are **0**. QE's last reading on this file's
    tree was 59 / 1987. The SE re-reads it at base.
  - The `CLI_DEEP` test count equals base (**11**), and so does the number of children the lane starts (**6**).
  - In the test file, `grep -cF` counts equal base for `spawnReal(` (**5**), `spawnNode(` (**2**), `mkdtempSync(`
    (**2**), `removeCopy(` (**3**), `rmSync(` (**1**), `writeFileSync(` (**1**) and `existsSync(` (**6**).
    `grep -cE '^\s*it\('` equals base (**11**). `grep -cF 'expect('` goes from **75** to **76**.
  - No line is added or removed above `:223` (`interface RealChild`), so pointers into the file's top (`ABC-168`'s
    and `ABC-172`'s `:84`) do not move.

## Dependencies

- **None blocking.** No open ticket edits `src/cli.real-engine.test.ts`.
  - `ABC-161` is In Development and edits only `src/cli.test.ts`, so the files do not overlap.
  - `ABC-164` only runs and counts the deep lane, and that count does not move here (`A5`).
  - `ABC-168` and `ABC-172` cite `:84` in prose only.
- **Owed before `ABC-168` merges**, and before any ticket that edits `src/book-file.ts` merges (the promotion trigger,
  below). Pull it ahead of `ABC-168`.
- **Superseded by an earlier editor.** Suppose another ticket edits `A7`'s `beforeAll` or `it`, `spawnReal`,
  `spawnNode` or `RealChild` before this one lands. That ticket carries the fix instead (`…bc2b06ce`, `…41f70925`
  § 2), and this ticket then closes as superseded.
  - `ABC-168`'s Scope 3 leaves the file for its real-child lane to the Engineer. If that lane reuses `spawnNode` or
    `RealChild`, it is such a ticket.

## Security / NFR triggers

- **Security: closes `AR-183-CWDARG`** (LOW, owner the Orchestrator; `…41f70925` § 2, `…bc2b06ce`).
  - **Close condition:** the fix lands, and QE reads `A3`'s **TCWD + P6f** row with the plant: green on the base
    test, red on the head test at the new assertion.
  - The Orchestrator, who owns the risk, records the close.
  - `V5.3.2` [L1] is met at the base. This adds a missing detective control in the test. It does not fix a failing
    control.
- **`NFR-008` / `N8-LANE`:** 0 new test files, 0 new tests and 0 new spawns in either lane. One field is added to a
  returned object, and one `expect`.

## Test notes

1. **Show the gap first:** run TCWD + P6f against the base test (11/11 green), then against the head test.
2. **Plant in scratch copies only**, outside the repository, with a private `TMPDIR` per run and one cell at a time
   (QE's method, `…567002e7`; Security/NFR's, `…d5fd47e1`). `git status --porcelain` is empty afterwards.
3. **TCWD and TMO plant the test file, and P6f plants the production file.** TCWD alone shows that the new
   assertion does not depend on P6f. The TMO + P6f row shows that `ABC-183`'s kill survives the edit.
4. **Mandatory gates:** lint, typecheck, build and `npm test`, plus `CLI_DEEP`.
   - Typecheck matters here because the change alters an interface. Vitest strips types, and Security/NFR's
     scratch FIX did not read typecheck (`UNKNOWN - verify`, `…d5fd47e1`).
   - A QE hop is owed: QE re-plants TCWD, P6f and TMO.
   - The UAT waiver is expected (0 production lines), measured with the `A5` form.
5. No timing at any hop.

## Size and priority

**`XS`:** one interface field, one property in a returned object and one assertion. **Not `S`:** no production
code, no new test, no new spawn.

**`P3`:**
- **Not `P2` today.** The delivered read is a constant path resolved from the module URL, so `V5.3.2` [L1] is met.
- Exploiting the gap needs a test-file edit and a cwd-reading production edit together. Ruling 2 routes the production
  half to `In Security/NFR` (`…41f70925` § 2).
- **Promotion trigger** (`AR-183-CWDARG`'s, the same as `AR-180-VALIDATED`'s; `…bc2b06ce`, `…73eb06c5`): a ticket
  is pulled that edits `src/book-file.ts`, or that is a packaging, `bin` or launch-path ticket. `ABC-168` fires it;
  `ABC-161` does not.
- **When it fires,** raise this ticket to `P2`. It is due before that ticket merges. Security/NFR's gate on that
  ticket also reads every production read reachable from the new or changed launch path, looking for a cwd-relative
  book read (S3 item 2).

## Definition of Ready

BA/PM, 2026-10-21. **Result: 10 of 10.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** TCWD + P6f survives 11/11 (QE `…cbd50a13`; Security/NFR `…d5fd47e1`, byte-identical plant). The spawn, type and assertion lines were read at `69610c5b` (`:223-230`, `:233-238`, `:469`, `:497`) |
| 2 | scope and out-of-scope clear | **✅** Security/NFR's fix shape in one file: a field, a record, an assertion. Production, child-side cwd, QE-183-b, other children and earlier labels are fenced |
| 3 | INVEST-shaped | **✅** Independent: no open ticket edits the file. It closes a named risk, and a two-cell plant pair tests it. The words and the line are negotiable |
| 4 | acceptance testable and measurable | **✅** Grep counts 0 → 1 and ≥ 1. A five-row plant table with base and head counts and the failing assertion named. A label in the failure output. A `grep -B1` line. Exact file and grep counts. 11 tests and 6 children |
| 5 | dependencies known | **✅** None blocking. Owed before `ABC-168` and before any `book-file.ts` edit merges. Superseded if an earlier ticket edits A7 or the spawn helpers |
| 6 | security/NFR triggers with a measurable target | **✅** Closes `AR-183-CWDARG` on `A3`'s TCWD + P6f row. `NFR-008` 0 / 0 / 0 |
| 7 | test notes present | **✅** Five |
| 8 | size assigned | **✅** `XS` |
| 9 | priority assigned | **✅** `P3`, with the risk's promotion trigger |
| 10 | no major unresolved blocker | **✅** None. Typecheck of the shape is `UNKNOWN - verify`, and the mandatory gates read it |

Column moves after `Ready` are the Orchestrator's.

## QE

**QE (qe-e2e), 2026-10-21: PASS_WITH_GAPS** on `grugops/ABC-184` @ `c6f80c81` (code `442d1e57`, base `5277babd`).
`A1`–`A5` are MET on QE's own readings and re-plants. Evidence is in `.grugops/context/qe-ABC-184/notes/`:
`…86f4cd19` (the A3 matrix), `…ccffd570` (what `booked.cwd` pins and what survives it), `…83a92ac8` (the criteria
and gates), `…d00d3329` (the artifacts) and `…7b9ef6a7` (the verdict).

- **`AR-183-CWDARG` close condition: MET.**
  - TCWD + P6f is base 11/11 green and head 10/11, with A7 red at `:504`:
    `AR-183-CWDARG: the booked child must spawn from neutral, or the detector runs from the tree root and is disarmed`.
  - TCWD alone reds the head test the same way.
  - P6f reds both tests at the stderr detector, and TMO + P6f reds both at `AR-162-FALLBACK`. The clean build is
    11/11 on both.
  - QE's P6f sha256 is `afeab577…`. TCWD and TMO are byte-identical to QE-183's.
  - The Orchestrator records the close.
- **Gates on `c6f80c81`:**
  - lint, typecheck and build. Typecheck now has a measured negative control: with the record removed it fails
    with `TS2741`;
  - `npm test` 59 / 1987, equal to base as QE read it, with `last-run.json` reading success;
  - skip-integrity with `--skip-count 0`;
  - `CLI_DEEP` 11/11 (6 children);
  - `PERFT_DEEP` 32/32.

  All are green.
- **UAT waiver:** measured in the AGENTS.md form, unfiltered. The result is empty: 0 production lines and no `.snap`.
- **Gaps (all INFO):**
  - **`QE-184-a`:** a one-line edit to `spawnSync`'s `cwd` option inside `spawnNode`, aimed at the neutral child,
    survives P6f. This is this page's named residual. It costs one line, not a "two-place helper edit".
  - **`QE-184-b`:** a forged record on the `booked` line (`{ ...spawnReal(…), cwd: neutral }`) survives P6f.
  - **`QE-184-c`:** in an agent session, vitest hides the `[CLI_DEEP]` lines unless `--reporter=verbose` or
    `--silent=false` is passed. Several variables switch this on, not `CLAUDECODE` alone.

## Erratum and close (Orchestrator, 2026-10-21)

- **Erratum (Security/NFR `…2fe79772` § 2):** Scope's "That takes a two-place helper edit" (`:65`) is wrong. QE measured one line inside `spawnNode` (QE-184-a, TSPWN). The residual is the same; only its cost was misstated.
- **Close:** `AR-183-CWDARG` is CLOSED at this ticket's merge (owner record `…9fd3189b`). QE-184-a and QE-184-b are accepted as INFO; QE owes the standing `spawnNode` read (the `spawnSync` `cwd` option and the returned `cwd` are the same unmodified parameter) at any hop that edits `spawnNode`. QE-184-c: every brief that counts `CLI_DEEP` children names `--reporter=verbose` and requires a count ≥ 1 (6 today; read 6 at merge).
