---
id: ABC-163
title: "The clause (b) instrument fires nothing when a limb-1 holder changes what it reads: fold `ADR-0036` § S1 Ruling 2 (holders at base AND head) into `clause-b.mjs`"
status: in-development
column: Backlog
size: S
priority: P3
epic: —
feature: —
---

# ABC-163 — `clause-b.mjs` learns Ruling 2, with its empty-holder case. Closes `AR-095-L1UNIT`. ZERO `src/` lines

> **Cut 2026-10-17 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-cut-followups`), from **`AR-095-L1UNIT`** (LOW;
> owner the Orchestrator, fold owed by Architect/Design; `ADR-0036` § S1 Ruling 2 and its S3 reading;
> `.grugops/context/secnfr-ABC-095-s3/notes/…b65b11b7`). The same note confirms **`AR-095-READ`** as still accepted;
> it is closed with no ticket here (decision note). Re-measured at `main` `1671f24f` in a scratch git repository
> outside this one (`…bapm-cut-followups/notes/…readings-85e8dfdd`).

## Problem

*User:* Security/NFR and the Orchestrator, who run `.grugops/context/design-F-072-1/probe/clause-b.mjs` to decide
whether a diff routes to `In Security/NFR`.

*Pain:* `ADR-0036` § S1 Ruling 2 says limb 1's (b1) unit is the **holder file**: any `+` line in a production file
that holds limb 1 at `<base>` or `<head>` fires. The instrument does not carry it. At `1671f24f`, a one-commit pair
that changes `src/book-file.ts` to read `"/etc/passwd"` instead of the book reads **"does not fire" on limbs 1, 2
and 3**, while the by-hand Ruling 2 check (`git diff --name-only <base> <head> -- src/book-file.ts`) prints the file.
The Orchestrator applies the rule by hand at every routing. The by-hand method also has a trap that Security/NFR
recorded: when neither end has a holder, an empty pathspec lists every changed file, which reads as a false "fires".

*Value:* one instrument run gives the routing answer, including Ruling 2, with no by-hand step.

## Scope

- **Limb 1 (b1) fires** on any `+` line of `git diff -U0 --no-renames <base> <head>` in a production file that holds
  limb 1 in code at `<base>` **or** at `<head>`, comment lines included. The output names the file and says the line
  fired by Ruling 2.
- **The empty case is explicit:** with no limb-1 holder at either end, Ruling 2 adds nothing and runs no pathspec diff.
- **Old readings stay reproducible.** The Architect either edits the instrument in place, or writes it at a new path
  and makes `ADR-0036`'s canonical pointer name it. Either way the change is recorded in `ADR-0036` § S1.
- **A dated line in `ADR-0036` § S1** records the fold, its commit, and that the by-hand step is no longer needed.

## Out of scope

- **Any byte of `src/`.** Limbs 2 and 3, (b2), and § Decision 3's residual are unchanged.
- `AR-095-READ` (accepted residual), `AR-095-CWD` (`ABC-162`).

## Acceptance (Given/When/Then)

Every pair is built in a scratch git repository outside this one, from `git archive` of a named commit plus one plant
commit. `L1` below means `node <instrument> <base> <head> 1`.
- **`A1` (the two contract breaks fire).** **Given** each of these plants on `src/book-file.ts`, **when** `L1` runs,
  **then** it prints limb 1 **FIRES**, (b1) naming `src/book-file.ts`, 2 of 2:
  - **P2b:** the holder reads `"/etc/passwd"` (base reading at `1671f24f`: does not fire);
  - **P2c:** the holder takes `path: string`, and `src/cli.ts` passes a value derived from its options.
- **`A2` (a comment edit fires).** A plant that changes only a comment line in `src/book-file.ts` makes `L1` print
  limb 1 **FIRES**.
- **`A3` (the empty case does not fire).** **Given** a real pair from before `ABC-095` in which no production file holds
  limb 1 at either end and at least one production file has a `+` line (the Architect names the pair), **when** `L1`
  runs, **then** Ruling 2 adds **0** lines and the limb-1 verdict equals the old instrument's on the same pair.
- **`A4` (nothing else moved).** On the two recorded pairs below, every limb's verdict and the holder count equal the
  record:
  - `0974102f..2307fc11` (`ABC-095`; `…c24fec8e`): limb 1 FIRES on (b1) `src/book-file.ts:13` and (b2)
    `cli.ts -> book-file.ts`; limb 2 FIRES (`cli.ts:177`); limb 3 does not fire; holders **4**. Ruling 2 adds
    `src/book-file.ts`.
  - `3ea3e352..98ea0a84` (`ABC-101`; `secnfr-ABC-101/notes/…4bed890a`): all three limbs do not fire; holders **4**;
    Ruling 2 adds nothing, because `src/book-file.ts` has no `+` line.
- **`A5` (the record).** `ADR-0036` § S1 carries the dated line from Scope. `git diff --numstat <base> -- src/` is
  empty.

## Dependencies

- None blocking. The instrument has been unchanged since `341da4c1`. No open ticket edits it.

## Security / NFR triggers

- **Security: a detective control is tightened.** It closes `AR-095-L1UNIT` when QE reads `A1`–`A3` with the plants.
  The Orchestrator records the close and stops the by-hand step.
- **`NFR-008`:** not triggered. 0 test files, 0 tests.

## Test notes

1. **Run the old instrument on every pair as well**, so that each reading has a before.
2. **Plants and scratch repositories stay outside this repository.**
3. **Gates:** lint, typecheck, build, `npm test` (unchanged tree under `src/`). A QE hop is owed, and QE re-plants
   P2b, P2c and the comment edit.

## Size and priority

**`S`:** about one screen of instrument code plus five readings on real pairs, and an ADR line. **Not `XS`:** it
changes the instrument every Security/NFR gate uses, so its regression readings (`A3`, `A4`) are half the work.
**Not `M`:** one limb, one rule already written.

**`P3`:** the by-hand rule fires today, and the Orchestrator applies it (Security/NFR S3). **Not `P2`:** no diff
has been mis-routed. **Promotion trigger (`P2`):** a second limb-1 holder appears, or a by-hand reading is missed.

## Definition of Ready

BA/PM, 2026-10-17. **Result: 10 of 10.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** P2b reads "does not fire" on all three limbs at `1671f24f`; by-hand prints the file |
| 2 | scope and out-of-scope clear | **✅** limb 1 (b1) only; `src/` fenced |
| 3 | INVEST-shaped | **✅** independent; testable by plants and recorded pairs |
| 4 | acceptance testable and measurable | **✅** 2 of 2 fire, comment fires, empty case 0 lines, two recorded pairs equal |
| 5 | dependencies known | **✅** none |
| 6 | security/NFR triggers with a measurable target | **✅** closes `AR-095-L1UNIT`; 0 tests |
| 7 | test notes present | **✅** three |
| 8 | size assigned | **✅** `S` |
| 9 | priority assigned | **✅** `P3`, promotion trigger named |
| 10 | no major unresolved blocker | **✅** none |

Column moves are the Orchestrator's. Owner of the build: **Architect/Design** (the instrument's owner), then QE.

## QE (qe-e2e, 2026-10-21): **PASS_WITH_GAPS** at tip `dc4d4f15` (base `ccccc6bb`; OLD instrument `341da4c1`, NEW `87d3897d`)

QE's own readings, taken in `../wt-qe-ABC-163` and in scratch repositories built from `git archive` of `dc4d4f15` and `1671f24f`, outside the repository. The SE's readings were opened only after these were taken, and they agree. Notes: `.grugops/context/qe-ABC-163/notes/`, ids `…5e2bf05e` (A1–A5), `…7f56f339` (edge plants), `…47186969` (regression and consumers), `…7a3267d0` (gates, waiver, lint) and `…8a60d7c8` (verdict).

| criterion | grade | reading |
|---|---|---|
| `A1` | MET | P2b and P2c: NEW limb 1 **FIRES**, `(b1) Ruling 2` naming `src/book-file.ts`, 2 of 2, on both archives; OLD does not fire |
| `A2` | MET | comment-only edit (`book-file.ts:3`): NEW FIRES, OLD does not |
| `A3` | MET | QE's pair `f00038ef^1..f00038ef` (`ABC-083`; `evaluate.ts` +137): `no limb-1 holder at <base> or <head>; adds nothing`, verdict = OLD; same on 6 more pairs. A git shim shows OLD and NEW make identical calls (79 = 79), the one diff being `-U0 --no-renames … -- src` |
| `A4` | MET | both recorded pairs equal the record: verdicts, (b1) `book-file.ts:13`, (b2) `cli.ts -> book-file.ts`, L2 `cli.ts:177`, holders 4, Ruling 2 adds `book-file.ts` / nothing |
| `A5` | MET | `ADR-0036` § S1 dated line names `87d3897d`; `git diff --numstat ccccc6bb dc4d4f15 -- src/` empty |

**Regression:** limbs 2 and 3 are byte-identical OLD vs NEW on 26 real pairs (the SE's 9 included) and on 17 plants. The limb-1 verdict is equal on 26/26 pairs. **Edges:** a holder only at `<head>` fires (already by (b1)). A holder only at `<base>` fires by Ruling 2 alone. A rename is a delete plus an add under `--no-renames`: the new path fires when it holds at `<head>`, and a rename that drops the import fires nothing (the safe direction).

**Gates on the tip:** lint, typecheck and build rc 0; `npm test` 59 files / 1987 tests, `last-run.json` `success: true`; skip count 0, skip-integrity `--skip-count 0` `No findings.`; `CLI_DEEP` 11/11; `PERFT_DEEP` 32/32. **UAT waiver** (AGENTS.md form, no `.snap` filter): empty for `87d3897d`, `d8c073e2`, `dc4d4f15` and the range, so it holds.

**Gaps (non-blocking; `block_on: high`):**
- **G-1 (proposed LOW, latent):** a deletion-only edit to a limb-1 holder fires nothing. The plants: a guard line dropped, so the holder reads any path; the import line dropped; a rename that drops the import.
  - The by-hand check that § S1 now retires fired on all three. The instrument follows Ruling 2's words ("a `+` line").
  - MEDIUM at the first holder with a guard or a multi-line read. Route: Security/NFR, then Architect/Design.
- **G-2 (LOW, pre-existing, every limb):** deleting only the `/*` and `*/` lines around an import creates a holder with no `+` line, and nothing fires. Route: Security/NFR, with G-1.
- **G-3 (LOW):** the harnesses `mutants.sh`, `f-mutants.sh` and `sec-mutants.sh` grep `(b1)`, so all 32 limb-1 rows split across two lines.
  - F5, F6 and S10 gain `L1` by design; clause (b) verdicts are unchanged.
  - `fixtures.sh` gains a field. No live gate parses the output, and recorded readings keep their meaning.
  - Route: Architect/Design.
- **G-4 (LOW):** `biome.json` excludes `.grugops/`, so the instrument is neither linted nor tested. The Ruling 2 code adds 0 diagnostics (measured in scratch), and the plants are not committed as a runnable script. Route: Architect/Design.

**Security:** `AR-095-L1UNIT`'s close condition is met: `clause-b.mjs` fires on a `+` line in a limb-1 holder, with both S1 plants read by QE. G-1 is a new residual for Security/NFR, not a re-open. The next column is `In Security/NFR`, alongside `arch-ABC-163-adr`. Column moves are the Orchestrator's.
