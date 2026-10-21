---
id: ABC-183
title: "`A7` pins that its decoy book is written before the `booked` child spawns, so moving the write after the spawn (TMO) no longer lets P6f pass `CLI_DEEP` (`AR-180-VALIDATED` G-2)"
status: in-review
column: In Review
size: XS
priority: P3
epic: EPIC-005
feature: —
---

# ABC-183: capture the decoy's existence on the line before the `booked` spawn, and assert it in `A7`. Test-only, `src/cli.real-engine.test.ts`. ZERO production lines

> **Cut 2026-10-21 by BA/PM** (subtask `bapm-cut-2026-10-21b`), from Security/NFR's ruling on `ABC-180`
> (`.grugops/context/security-nfr-ABC-180/notes/…decision-1b032e3f` § 2 (b) and § 3, G-2 fix shape) and the
> Orchestrator's owner record (`…decision-73eb06c5`). QE found G-2 on `ABC-180`
> (`.grugops/context/qe-ABC-180/notes/…observation-91bdbc2a`, verdict `…decision-f88e0845`). Base readings were
> taken at `main` `59fc9215`. `src/` there is byte-identical to `ABC-180`'s merge.

## Problem

*User:* the next hop that edits `src/book-file.ts`, or that adds a launch path (`ABC-168`). Also a player who starts
the CLI from a directory that holds a `data/opening-book/book.json`.

*Pain:* `A7`'s kill of P6f rests on an order that nothing pins. P6f reads the book from the working directory first
and falls back to the module URL.
- `A7`'s `beforeAll` (`src/cli.real-engine.test.ts:456-463` at `59fc9215`) writes the decoy at `:459-460`. It spawns
  `bookless` at `:461` and `booked` at `:462`.
- If the decoy write moves after the `booked` spawn (plant **TMO**), the child runs in an empty directory. P6f's cwd
  read fails, it falls back silently, and stderr is empty.
- `A7`'s own checks on the decoy (`:492`, `:494-501`) run inside the `it`, after the spawn has ended. They still find
  the decoy, so they pass.
- QE read TMO **surviving** under P6f (`…91bdbc2a`): the lane stays green.

*Value:* the `AR-162-FALLBACK` detector cannot be disarmed by reordering the setup. That is part (ii) of
`AR-180-VALIDATED`'s close condition. Part (i) was met at `ABC-163`'s merge (`…8d0de2f4`), so this ticket closes the
risk.

## Scope

All edits are in `src/cli.real-engine.test.ts`, inside the `ABC-095` `describe` block (`:440-537` at `59fc9215`).
This is Security/NFR's fix shape, word for word (`…1b032e3f` § 3):

1. **The capture.** In `A7`'s `beforeAll`, on the line directly before
   `booked = spawnReal(REPOSITORY, …, neutral);`, capture `existsSync(join(neutral, BOOK_PATH))` into a variable
   declared in the `describe` block.
2. **The assertion.** In `A7`'s `it`, assert that the captured value is `true`, with an assertion message that names
   `AR-162-FALLBACK`.
3. **The comment.** On the decoy write (`:458-460`), a `//` comment says that the write must come before the `booked`
   spawn. The existing `ABC-180` comment line may carry it. The Engineer writes the words.
4. **No new spawn, no new test, no new `mkdtemp`.** Nothing else in the file changes.

## Out of scope

- **Any production file.** `src/book-file.ts` is a capability holder (`ADR-0036` § S1 Ruling 2).
- **G-1 (P6g, a cwd book used only if it validates).** Security/NFR accepted it inside `AR-180-VALIDATED` as covered
  by routing plus the gate's by-hand read, not by a test (`…1b032e3f` § 3). QE's valid-book decoy was declined.
- **G-3 (P6i).** INFO, no action.
- **Moving the `bookless` spawn**, or reordering the `beforeAll` in any other way.
- **`ABC-180`'s assertions and label.** They stay as delivered.

## Acceptance (Given/When/Then)

Every vitest command carries its heap prefix: 400 for one file, 128 for multi-file runs (`ABC-173`'s guard). The deep
lane is `CLI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/cli.real-engine.test.ts`.

- **`A1` (the capture sits on the line before the spawn).**
  `grep -B1 -F 'booked = spawnReal(' src/cli.real-engine.test.ts` prints a first line that contains
  `existsSync(join(neutral, BOOK_PATH))`. At `59fc9215` that line is `bookless = spawnReal(copy, QUIT_TWICE);`.
- **`A2` (asserted in `A7`, labelled).**
  - QE reads, inside `A7`'s `it`, one `expect` on the captured value, with `.toBe(true)` and a message argument that
    contains `AR-162-FALLBACK`.
  - `grep -c 'AR-162-FALLBACK' src/cli.real-engine.test.ts` is **≥ 5**. At `59fc9215` it is **4**.
- **`A3` (the order is commented).** QE reads a `//` comment among the three lines directly above the decoy's
  `writeFileSync(join(neutral, BOOK_PATH), …)` that says the write must precede the `booked` spawn.
- **`A4` (TMO is killed, and nothing else moves).** **Given** each plant below in a scratch copy outside the
  repository, **when** the deep lane runs with the base test (`59fc9215`) and then with the head test, **then**:
  - **TMO** is a test-file plant. In `A7`'s `beforeAll`, the decoy's `mkdirSync` and `writeFileSync` lines move to
    directly after the `booked = spawnReal(` line. On the head test, the capture line stays where it is.
  - **P6f** is the `src/book-file.ts` plant, with the body from QE `…567002e7` (`ABC-162`), as in `ABC-180`'s `A2`.

  | plant | base test | head test |
  |---|---|---|
  | none (delivered) | 11/11 green | 11/11 green |
  | P6f | 10/11, red `A7` at the stderr detector | 10/11, red `A7` at the stderr detector |
  | **TMO + P6f** | **11/11 green** | **10/11, red `A7` at the new assertion** |
  | TMO (delivered `book-file.ts`) | 11/11 green | 10/11, red `A7` at the new assertion |

  The vitest failure output for TMO + P6f at head contains `AR-162-FALLBACK`.
- **`A5` (fences).**
  - `git diff --name-only <base>` lists exactly `src/cli.real-engine.test.ts`.
  - The UAT-waiver form is empty:
    `git diff --name-only <delivered>~1 <delivered> | grep -v '\.test\.ts$' | grep '^src/'`.
  - `npm test`: the file count and the test count equal base, and skips are **0**.
  - The `CLI_DEEP` test count equals base (**11**), and so does the number of children the lane starts (**6**).
  - In the test file, `grep -cF` counts equal base for `spawnReal(` (**5**), `mkdtempSync(` (**2**), `removeCopy(`
    (**3**), `rmSync(` (**1**) and `writeFileSync(` (**1**). `grep -cE '^\s*it\('` equals base (**11**).
    `existsSync(` goes from **5** to **6**.
  - No line is added or removed above `:440`, so pointers into the file's top (`ABC-168`'s and `ABC-172`'s `:84`) do
    not move.

## Dependencies

- **None blocking.** Security/NFR and the Orchestrator rule that this pin is independent of `ABC-163`, and
  `ABC-163` has merged (`59fc9215`).
- **Owed before `ABC-168` merges**, and before any ticket that edits `src/book-file.ts` merges (`AR-180-VALIDATED`
  owed item (b), `…73eb06c5`). Pull it ahead of `ABC-168`.
- **`src/cli.real-engine.test.ts` is shared, but no open ticket edits it.** `ABC-168` and `ABC-172` cite `:84` in prose
  only (that line is already stale at `59fc9215`; it is `RUN_DEEP`). `ABC-161` and `ABC-164` only run or count the
  deep lane, and its count does not move here (`A5`).
- If another ticket edits `A7`'s `beforeAll` or its `it` before this one lands, that ticket carries the pin instead
  (Security/NFR § 3). This ticket then closes as superseded.

## Security / NFR triggers

- **Security: closes `AR-180-VALIDATED`.**
  - **Close condition** (`…73eb06c5`): part (i), `AR-095-L1UNIT` closed, was **met** at `ABC-163`'s merge
    (`…8d0de2f4`). Part (ii) is `A4`'s **TMO + P6f** row: green on the base test and red on the head test, read by
    QE.
  - P6g stays uncovered by any test, by design.
  - The Orchestrator, who owns the risk, records the close.
- **`NFR-008` / `N8-LANE`:** 0 new test files, 0 new tests and 0 new spawns in either lane. One `existsSync` call in
  a `beforeAll`.

## Test notes

1. **Show the gap first:** TMO + P6f against the base test (11/11 green), then against the head test.
2. **Plant in scratch copies only**, outside the repository, with a private `TMPDIR` per run (QE's method,
   `…567002e7`). `git status --porcelain` is empty afterwards.
3. **TMO plants the test file, and P6f plants the production file.** Run both together for the close row. TMO alone
   shows that the pin does not depend on P6f.
4. **Mandatory gates:** lint, typecheck, build, `npm test`, plus `CLI_DEEP`. A QE hop is owed: QE re-plants TMO and
   P6f. The UAT waiver is expected (0 production lines), measured with the `A5` form.
5. No timing at any hop.

## Size and priority

**`XS`:** one captured value, one assertion, one comment. **Not `S`:** no production code, no new test, no new spawn.

**`P3`:**
- **Not `P2` today.** The delivered read is a constant path resolved from the module URL, so `V5.3.2` [L1] is met.
  Ruling 2, now in the instrument, routes any `src/book-file.ts` edit to `In Security/NFR`. The residual is a
  missing detective control, not a failing one.
- **Promotion trigger** (`AR-180-VALIDATED`'s, `…73eb06c5`): a ticket that edits `src/book-file.ts`, or a packaging,
  `bin` or launch-path ticket, is pulled. `ABC-168` fires it; `ABC-161` does not. **When it fires, raise this ticket to
  `P2`. It is due before that ticket merges.**

## Definition of Ready

BA/PM, 2026-10-21. **Result: 10 of 10.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** TMO survives P6f (QE `…91bdbc2a`); the write and spawn lines read at `59fc9215` (`:459-462`) |
| 2 | scope and out-of-scope clear | **✅** Security/NFR's three-part fix shape, one file; production, G-1, G-3 and reordering fenced |
| 3 | INVEST-shaped | **✅** independent (no open ticket edits the file); one plant pair tests it; the words are negotiable |
| 4 | acceptance testable and measurable | **✅** a `grep -B1` line; a count ≥ 5 (base 4); a four-row plant table with base and head counts; a label in the failure output; exact file and grep counts; 11 tests, 6 children |
| 5 | dependencies known | **✅** none blocking; owed before `ABC-168` and any `book-file.ts` edit merge |
| 6 | security/NFR triggers with a measurable target | **✅** closes `AR-180-VALIDATED` on `A4`'s TMO + P6f row; `NFR-008` 0 / 0 / 0 |
| 7 | test notes present | **✅** five |
| 8 | size assigned | **✅** `XS` |
| 9 | priority assigned | **✅** `P3`, with the risk's promotion trigger |
| 10 | no major unresolved blocker | **✅** none |

Column moves after `Ready` are the Orchestrator's.
