---
id: ABC-180
title: "`A7`'s neutral working directory holds a decoy book that is not a book, so a cwd-first read with a module-URL fallback (P6f) reds `CLI_DEEP`, and `A7`'s stderr assertion names itself the detector (`AR-162-FALLBACK`: G-1, G-2)"
status: in-development
column: Ready
size: XS
priority: P3
epic: EPIC-005
feature: —
---

# ABC-180: put a non-book decoy at `data/opening-book/book.json` in `A7`'s neutral cwd, and label `A7`'s stderr assertion. Closes `AR-162-FALLBACK`. ZERO production lines

> **Cut 2026-10-21 by BA/PM** (subtask `bapm-cut-AR-162-FALLBACK`), from Security/NFR's ruling on `ABC-162`
> (`.grugops/context/security-nfr-ABC-162/notes/…decision-06c147db`, readings `…observation-3ea2c883`). That ruling
> closed `AR-095-CWD` and opened **`AR-162-FALLBACK`** (LOW, owner the Orchestrator). It recommends one XS, P3,
> test-only cut covering QE's G-1 and G-2 (`.grugops/context/qe-ABC-162/notes/…observation-567002e7` plant matrix and
> decoy probe; `…decision-68554c31` verdict). Base readings were taken at `main` `e68962d6`.
> `src/cli.real-engine.test.ts` and `src/book-file.ts` there are byte-identical to `ABC-162`'s tip `3d05e230`, so
> QE's plant matrix applies to this base unchanged.

## Problem

*User:* the next hop that edits `src/book-file.ts`, and a player who starts the CLI from a directory that happens to
hold a `data/opening-book/book.json`.

*Pain:*
- **G-1: P6f survives.** P6f is a `readBookFile` that tries the cwd-relative path first and falls back to the
  module-URL read on failure. It passes `CLI_DEEP` **11/11** at `ABC-162`'s head (QE `…567002e7`).
  - `A7`'s cwd is an empty `mkdtemp` directory (`src/cli.real-engine.test.ts:449`), so the cwd read always fails and
    the fallback always reads the delivered book.
  - The exploit is `AR-095-CWD`'s: whoever controls the launching directory chooses the book.
  - Security/NFR names P6f as the regression form most likely to arrive on purpose, as a "local override book"
    during packaging (`EPIC-006`).
  - If P6f landed, it would fail `V5.3.2` [L1] (default severity HIGH, which blocks). Today nothing automated would
    see it.
- **G-2: the kill rests on one unlabelled assertion.** Under every cwd plant, `A7`'s other checks still pass. The
  engine's searched reply to 1. e4 (`d6` under P6b) is itself a book entry, so book membership cannot tell a book
  reply from a search reply. Only `expect(booked.stderr).toBe("")` (`:510`) reds the plant.
  - The test file is not a capability holder, so `ADR-0036` Ruling 2 never routes its edits to Security/NFR.
  - A later edit that relaxes that line would silently reopen the class.

*Value:* the lane that runs at QE on every ticket goes red on the fallback form too, so `AR-162-FALLBACK` closes. The
one assertion that does the work says so where an editor will see it.

## Scope

All edits are in `src/cli.real-engine.test.ts`, inside the `ABC-095` `A7` block and the file header.

1. **The decoy (G-1).** In `A7`'s existing `beforeAll`, after `mkdtempSync` and **before** the `booked` spawn, write a
   file at `<neutral>/data/opening-book/book.json` (that is, `join(neutral, BOOK_PATH)`) whose bytes are **not
   UTF-8 JSON**. The Engineer picks the bytes.
   - The file lives inside `neutral`. The existing `afterAll` `removeCopy(neutral)` takes it with the directory, by
     that exact path. There is **no new removal call**, no new `mkdtemp`, no new spawn and no new `it`.
2. **`A7`'s assertions about the cwd.** Replace the "no `data/` entry" assertion (`:479-481`) with one or more
   assertions, in the same `it`, that:
   - the decoy exists at `join(neutral, BOOK_PATH)`;
   - its bytes differ from the delivered `join(REPOSITORY, BOOK_PATH)`; and
   - its bytes do not parse as JSON. This assertion is what keeps the decoy from being swapped for a valid book.
     See "Why the decoy must not be a book" below.
3. **The label (G-2).**
   - `expect(booked.stderr).toBe("")` gets an assertion message naming it the **`AR-095-CWD` / `AR-162-FALLBACK`
     detector**.
   - A one-line `//` comment directly above it says the same thing.
   - The Engineer writes the words. Both ids appear in each.
4. **Comments that the decoy makes false.** Three comments describe `neutral` as empty or as holding no `data/`:
   - the file header, `:47-50` ("a fresh `mkdtemp` directory with no `data/`");
   - the `neutral` doc comment, `:443` ("a fresh, empty `mkdtemp` directory");
   - the `A7` comment, `:476-477` ("holds no `data/`").

   Reword each to say that `neutral` holds a decoy book file that is not the delivered book, so only a read resolved
   from the module's own URL finds the book.
5. Nothing else in the file changes.

### Why the decoy must not be a book

A non-book decoy reds **every** read-level cwd form through one fixed signal. Any read of it goes through `parseBook`
(`src/book.ts:91-95`). That refuses it with `opening book is not valid UTF-8 JSON; playing on without it` on stderr,
and `A7`'s stderr assertion catches that. This holds for P6b, P6c and P6e, and for P6f, whose cwd read now succeeds
and returns the decoy.

A **valid** book as the decoy would read silently, with stderr 0 B:
- If it were a copy of the delivered book, every cwd plant would be indistinguishable from the clean build.
- If it were a different book, the kill would rest on book membership. G-2 shows that membership does not
  discriminate here.

Either way, P6f would pass again. The page pins **not UTF-8 JSON**, rather than any non-book (for example `{}`,
refused as `is not a format-1 book`), so that the red in `A2` carries one fixed message, the one QE's probe
measured.

## Out of scope

- **Any production file.** `src/book-file.ts` is a capability holder (`ADR-0036` § S1 Ruling 2) and is not edited.
- **A new test, a new spawn, or a second neutral directory.** The decoy goes in the existing `neutral`.
- **A non-stderr discriminator**, such as a position whose book reply differs from the searched reply. Security/NFR
  ruled it gold-plating at L1 (`…06c147db` § 2).
- **G-3** (`TMPDIR` inside the tree): INFO, no action (Security/NFR `…3ea2c883` § 2).
- **G-4** (`AGENTS.md` "Two real children"): the Scribe's.
- **`ABC-162`'s page.** Its `A1` stays as delivered. This ticket's `A1` supersedes its wording for the test as it
  stands after this merge.
- **`AR-095-READ`, `AR-095-L1UNIT`:** unchanged.

## Acceptance (Given/When/Then)

Every vitest command carries its heap prefix: 400 for one file, 128 for multi-file runs (`ABC-173`'s guard).
The deep lane is `CLI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/cli.real-engine.test.ts`.

- **`A1` (the child runs beside a decoy book file that is not the delivered book).** **Given** head, **when** the
  deep lane runs, **then**:
  - the `A7` child's `[CLI_DEEP] (cwd …)` line names a directory that is not the tree root and holds a decoy book
    file at `data/opening-book/book.json` that is not the delivered book; `A7` asserts it is present, differs from
    the delivered bytes, and does not parse as JSON;
  - `A7` is green: the reply to 1. e4 is a book entry, stderr is **0 B**, and the exit is **0**;
  - the lane is **11/11** green.

  **And**, with the decoy's bytes replaced by a byte copy of the delivered book (plant **PD**, a scratch copy outside
  the repository, test edit only), `A7` is **red at the does-not-parse-as-JSON assertion**.
- **`A2` (P6f is killed, and the earlier kills hold).** **Given** each plant below in a scratch copy outside the
  repository (bodies as in QE `…567002e7`: only `src/book-file.ts` replaced), **when** the deep lane runs with
  the base test (`e68962d6`) and then with the head test, **then**:

  | plant | base test | head test |
  |---|---|---|
  | none (delivered) | 11/11 green | 11/11 green |
  | **P6f** (cwd first, module-URL fallback) | **11/11 green** | **10/11, red `A7`** |
  | P6b (`readFileSync("data/opening-book/book.json")`) | 10/11, red `A7` | 10/11, red `A7` |
  | P6c (`resolve(process.cwd(), …)`) | 10/11, red `A7` | 10/11, red `A7` |
  | P6e (walk up from cwd) | 10/11, red `A7` | 10/11, red `A7` |

  - Each head red is `A7` at the stderr assertion. The child's stderr begins `opening book is not valid UTF-8 JSON;`.
  - The vitest failure output for P6f at head contains `AR-162-FALLBACK` (the label from Scope 3).
- **`A3` (cleanup).** After a green run, and after the P6f run at head, the number of entries the lane made under
  `os.tmpdir()` that still exist is **0**. The decoy is gone with its directory, through the existing
  `removeCopy(neutral)` on the exact `mkdtemp` path.
- **`A4` (the detector names itself).**
  - `grep -c 'AR-162-FALLBACK' src/cli.real-engine.test.ts` is **≥ 2**. At `e68962d6` it is **0** (grep exits 1).
  - QE reads that one occurrence is in the message argument of `expect(booked.stderr, …)`, and that one is a `//`
    comment line among the three lines directly above that call. Both name `AR-095-CWD` too.
- **`A5` (no comment still says `neutral` is empty).**
  `grep -nE 'no .?data/|holds no|fresh, empty' src/cli.real-engine.test.ts` exits **1**. At `e68962d6` it prints
  `:48`, `:443` and `:476`.
- **`A6` (fences).**
  - `git diff --name-only <base>` lists exactly `src/cli.real-engine.test.ts`.
  - The UAT-waiver form is empty:
    `git diff --name-only <delivered>~1 <delivered> | grep -v '\.test\.ts$' | grep '^src/'`.
  - `npm test`: the file count and the test count equal base, skips **0**.
  - The `CLI_DEEP` test count equals base (**11**), and so does the number of children the lane starts (**6**, QE at
    `3d05e230`).
  - In the test file, `grep -cF` counts equal base for `mkdtempSync(` (**2**), `removeCopy(` (**3**), `rmSync(`
    (**1**) and `spawnReal(` (**5**).

## Dependencies

- `ABC-162` is `Done` (`f459353e`), and this ticket is its follow-up. None blocking.
- **No open ticket edits `src/cli.real-engine.test.ts`.**
  - `ABC-161` and `ABC-164` only run or count the deep lane. Its count does not move here (`A6`).
  - `ABC-168` and `ABC-172` cite `src/cli.real-engine.test.ts:84` for the `package.json` copy. That line is already
    off at `e68962d6` (it is the `START_FEN` doc comment), and this ticket's header edit can move it further. Both
    pointers are prose, and no test reads them.

## Security / NFR triggers

- **Security: closes `AR-162-FALLBACK`.**
  - **Close condition:** QE reads this ticket's P6f row red at head with the plant (`A2`): green on the base test,
    red on the head test, with the P6b, P6c and P6e kills still holding. This is Security/NFR's condition in
    `…06c147db` § 1.
  - The Orchestrator, who owns the risk, records the close.
- **`NFR-008` / `N8-LANE`:** the default lane is untouched. 0 new test files, 0 new tests, 0 new spawns in either
  lane.

## Test notes

1. **Show the gap first:** P6f against the base test (11/11 green), then against the head test.
2. **Plant in scratch copies only**, outside the repository, with a private `TMPDIR` per run (QE's method,
   `…567002e7`). `git status --porcelain` is empty afterwards.
3. **PD** (`A1`) is a test-file plant, not a `book-file.ts` plant: it checks that the decoy cannot quietly become a
   book.
4. **Mandatory gates:** lint, typecheck, build, `npm test`, plus `CLI_DEEP`. A QE hop is owed, and QE re-plants P6f,
   P6b, P6c, P6e and PD. The UAT waiver is expected (0 production lines). It is measured with the `A6` form.
5. No timing at any hop.

## Size and priority

**`XS`:** one file written into an existing directory, one assertion swapped, one label, three comments. **Not
`S`:** no production code, no new test, no new spawn.

**`P3`:**
- **Not `P2` today:** the delivered read is a constant path resolved from the module URL, so `V5.3.2` [L1] is met at
  the tip. Two controls stand between a P6f regression and a merge: Ruling 2 routes any `src/book-file.ts` edit to
  Security/NFR, and S3 item 2 reads that file by hand there. The residual is a missing detective control, not a
  failing one.
- **Promotion trigger (Security/NFR's, `…06c147db` § 1):** a ticket that edits `src/book-file.ts`, or `EPIC-006`
  (packaging/`bin`) being cut or pulled. **Either makes this ticket due before that ticket merges**, and raises it
  to `P2`, matching `ABC-162`'s trigger.
- **For the Orchestrator, who owns `AR-162-FALLBACK`: two readings of the trigger, not a change to it.**
  - **`EPIC-006` is already cut, and both halves are decomposed.** Its one ticket still open on the board, `ABC-161`
    (Backlog: three `src/cli.test.ts` difficulty rows), touches no packaging, no `bin` and no book read. BA/PM reads
    the clause as "a packaging/`bin` ticket under `EPIC-006` is cut or pulled", so pulling `ABC-161` does not fire
    it. This reading is `UNKNOWN - verify` with Security/NFR.
  - **`ABC-168` (EPIC-007) fires neither clause as written.** It imports `book-file.ts` from a new entry point but
    does not edit it. Still, it adds a `bin` and a process that a chess GUI starts from a directory the player
    does not choose. That is the shape the trigger guards. BA/PM recommends treating `ABC-168`'s pull as firing
    the trigger: this ticket is XS and Ready, so landing it first costs little. The ruling is the Orchestrator's,
    or Security/NFR's if asked.

## Definition of Ready

BA/PM, 2026-10-21. **Result: 10 of 10.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** P6f passes `CLI_DEEP` 11/11 at `3d05e230` (QE `…567002e7`); the test file is byte-identical at `e68962d6` |
| 2 | scope and out-of-scope clear | **✅** one file, decoy plus assertions, label, three comments; production, new tests, G-3, G-4 and a non-stderr discriminator fenced |
| 3 | INVEST-shaped | **✅** independent; one plant (P6f) tests it; the label words are negotiable |
| 4 | acceptance testable and measurable | **✅** 11/11; a five-row plant table with base and head counts; a fixed stderr prefix; a label in the failure output; grep counts ≥ 2 and exit 1; 0 leftovers; equal counts |
| 5 | dependencies known | **✅** none blocking; no open ticket edits the file |
| 6 | security/NFR triggers with a measurable target | **✅** closes `AR-162-FALLBACK` on `A2`'s P6f row; `NFR-008` 0 / 0 / 0 |
| 7 | test notes present | **✅** five |
| 8 | size assigned | **✅** `XS` |
| 9 | priority assigned | **✅** `P3`, promotion trigger stated, plus two readings routed to the risk's owner |
| 10 | no major unresolved blocker | **✅** none. The trigger readings do not block the build |

Column moves after `Ready` are the Orchestrator's.
