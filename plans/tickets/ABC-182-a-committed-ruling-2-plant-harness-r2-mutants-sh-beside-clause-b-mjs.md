---
id: ABC-182
title: "A committed Ruling 2 plant harness, `r2-mutants.sh`, beside `clause-b.mjs`, so the next instrument edit re-runs `ADR-0036` § S1 Ruling 2's plants instead of rebuilding them by hand (ABC-163 G-4)"
status: in-development
column: In Development
size: XS
priority: P3
epic: —
feature: —
---

# ABC-182: commit `r2-mutants.sh` and its first run's output beside the clause (b) instrument. ZERO `src/` lines

> **Cut 2026-10-21 by BA/PM** (subtask `bapm-cut-2026-10-21b`), from QE's `ABC-163` gap G-4
> (`.grugops/context/qe-ABC-163/notes/…decision-8a60d7c8`, edge plants `…observation-7f56f339`). The Architect ruled
> that one ticket is cut and gave its shape in `.grugops/context/arch-ABC-163-adr-text/notes/…decision-34e592ac`. This
> page follows that shape. Security/NFR recommends this fixture alongside the `AR-163-DELONLY` fix
> (`.grugops/context/security-nfr-ABC-163/notes/…decision-3e4b4a08` § 2). Base readings were taken at `main`
> `59fc9215`, which is `ABC-163`'s merge. The instrument there,
> `.grugops/context/design-F-072-1/probe/clause-b.mjs`, is byte-identical to `87d3897d`
> (`git diff --quiet 87d3897d 59fc9215 -- <path>` exits 0).

## Problem

*User:* the next hop that edits `clause-b.mjs`, and the QE and Security/NFR hops that must show that Ruling 2 still
fires after that edit.

*Pain:*
- **Ruling 2's plants exist only as scratch scripts** outside the repository: the SE's `bin/plants.sh` and QE's
  `plant.py`. The last two hops each rebuilt them by hand.
- **Nothing else checks the instrument.** `biome.json` excludes `.grugops/`, and no vitest suite runs it.
- **The next edit is likely.** `AR-163-DELONLY`'s fix (about 3 lines in `addedLines`) and `AR-163-UNCOMMENT`'s fix
  both change `clause-b.mjs`. So does any edit at § S1's re-armed trigger. Each needs Ruling 2's plants re-run.

*Value:* one command re-runs every Ruling 2 plant against any copy of the instrument, and its exit code says
whether each verdict is still the expected one. `F-072-1` and `ABC-072` already keep harnesses of this shape beside
the instrument (`f-mutants.sh`, `mutants.sh`).

## Scope

Two new files in `.grugops/context/design-F-072-1/probe/`:

1. **`r2-mutants.sh`**, in `f-mutants.sh`'s shape:
   - usage `r2-mutants.sh <repo> <tip> <scratch-dir> <absolute path to clause-b.mjs>`, stated in its header comment;
   - plants are committed in a `git clone --shared` under `<scratch-dir>`. The repository is never written;
   - it reads limb 1's Ruling 2 result from the `(b1) capability` line and the `(b1) Ruling 2` line, never from a bare
     `(b1)` grep (Architect decision 2, G-3);
   - for each plant it prints the **expected** limb-1 verdict beside the **actual** one.
2. **`r2-mutants.out.txt`**: the output of the first run at `A3`, committed beside the script.

**The plants** (Architect `…34e592ac`; plant bodies as in QE `…7f56f339` and `ABC-163`'s `A1`–`A3`):

| plant | edit | expected limb 1 |
|---|---|---|
| `P2b` | `src/book-file.ts`'s read becomes `"/etc/passwd"` | **FIRES**, `(b1) Ruling 2` names `src/book-file.ts` |
| `P2c` | the holder takes `path: string`, and `src/cli.ts` passes a value from its options | **FIRES**, and the Ruling 2 list names `src/book-file.ts` only |
| `CMT` | only a comment line in `src/book-file.ts` changes | **FIRES** |
| `X1` (base-only) | `src/book-file.ts` drops its `node:fs` import and returns `new Uint8Array(0)` | **FIRES**, holder at `<base>` |
| `NOH` (no holder) | a `+` line in a non-holder file, planted at `f00038ef^1`, before `ABC-095`, where no file holds limb 1 | **does not fire**; the instrument prints `no limb-1 holder at <base> or <head>; adds nothing` |
| `G1-IMP` | deletion only: `src/book-file.ts` loses only its import line | **does not fire**, labelled as the `AR-163-DELONLY` gap |
| `G1-GRD` | deletion only, two commits: base adds a guard to the holder's read, head deletes only the guard line | **does not fire**, labelled as the `AR-163-DELONLY` gap |

**Checks the script makes:**
- it exits **nonzero** when any actual limb-1 verdict differs from the expected one, and it names that plant;
- on every plant, it compares limbs 2 and 3 with the output of the `341da4c1` instrument
  (`git show 341da4c1:.grugops/context/design-F-072-1/probe/clause-b.mjs`), and exits **nonzero** on any byte
  difference, naming the plant and the limb. The builder chooses how the script gets that copy, and states it in the
  header comment.

## Out of scope

- **Any edit to `clause-b.mjs`**, `ADR-0036`, `src/` or `biome.json`.
- **Bringing the instrument under Biome** by narrowing `!.grugops` in `biome.json`. The Architect rejected this: QE
  measured 0 new diagnostics, and a lint pass does not show whether Ruling 2 fires.
- **A vitest suite for the instrument.** The Architect rejected this too. It would put a hand-run probe under
  `src/`'s runner, its heap and `NFR-008`'s lane budget.
- **The `AR-163-UNCOMMENT` plant** and Security/NFR's no-parameter guard drop (`G-1b`). They belong to those risks'
  fix tickets, which add their rows to this harness.
- **Flipping the `G1-*` rows.** They flip on purpose when `AR-163-DELONLY`'s fix lands. That ticket edits the
  expected verdicts.
- **Wiring the harness into any gate.** It is run by hand.

## Acceptance (Given/When/Then)

- **`A1` (files).** `git diff --name-only <base>` lists exactly
  `.grugops/context/design-F-072-1/probe/r2-mutants.sh` and `.grugops/context/design-F-072-1/probe/r2-mutants.out.txt`.
  `git diff --quiet <base> -- .grugops/context/design-F-072-1/probe/clause-b.mjs` exits **0**.
- **`A2` (green on the folded instrument).** **Given** the instrument at `<base>` (byte-identical to `87d3897d`),
  **when** `bash r2-mutants.sh <repo> <base> <scratch> <absolute path to that clause-b.mjs>` runs, **then**:
  - it prints one expected-and-actual row for each of the 7 plants, with the verdicts in the Scope table;
  - limbs 2 and 3 are byte-identical to the `341da4c1` copy on all 7 plants (QE measured 28 of 28 on 14 plants in
    `…7f56f339`);
  - it exits **0**;
  - afterwards `git -C <repo> status --porcelain` prints nothing, and the repository's `HEAD` and refs are unchanged.
- **`A3` (red on the pre-fold instrument).** **Given** the `341da4c1` copy of `clause-b.mjs`, placed where `typescript`
  resolves (see Test notes), **when** the same command runs with that path, **then** it exits **nonzero**, and the
  plants it names as mismatched on limb 1 are exactly `P2b`, `P2c`, `CMT` and `X1`.
- **`A4` (the limb 2 and 3 comparison has teeth).** **Given** a scratch copy of the folded instrument with one byte of
  limb 2's output changed (plant `ALT`, scratch only), **when** the harness runs with it, **then** it exits
  **nonzero** and names limb 2. The `ALT` copy is deleted afterwards.
- **`A5` (the committed output is the run).** `r2-mutants.out.txt` is `A2`'s output. Re-running `A2` at the same
  `<tip>` reproduces it byte for byte, except a header line carrying the time or load, if there is one.
- **`A6` (not in any lane).** `npm test`: the file count and the test count equal base, and skips are **0**.
  `biome.json` is unchanged.

## Dependencies

- **None blocking.** `ABC-163` merged at `59fc9215`, so the instrument on `main` is the folded one this harness
  checks.
- **This ticket is owed before any ticket that edits `clause-b.mjs` merges** (Architect's promotion trigger). Today
  that includes `AR-163-DELONLY`'s fix and `AR-163-UNCOMMENT`'s fix, when either is cut.
- No open ticket touches `.grugops/context/design-F-072-1/probe/`.

## Security / NFR triggers

- **Security:** none directly. The harness is a re-runnable check for a detective control (clause (b)). It does not
  close a risk. The Orchestrator owns `AR-163-DELONLY`; that risk's close condition is unchanged.
- **`NFR-008`:** 0 / 0 / 0. The harness runs by hand, outside `npm test`.

## Test notes

1. **`typescript` must resolve for the instrument.** The `341da4c1` copy can be placed temporarily at the worktree
   root, and deleted afterwards, as `RUN.txt` (`F-072-1`) did. Or it can go in a scratch directory with
   `node_modules` symlinked. Either way, `git status` is clean afterwards.
2. **Run `A3` first**, to show that the plants have teeth before reading the green.
3. **Plants only in the clone** under `<scratch-dir>`. Use a private `TMPDIR`.
4. **Mandatory gates:** lint, typecheck, build, `npm test`. Each must show no change, since nothing they read
   changes. A QE hop is owed: QE reads `A2`–`A4` itself. The UAT waiver is expected (0 `src/` lines). Measure it with
   AGENTS.md's form, which must print nothing.
5. **Builder:** the Architect owns the instrument (`…34e592ac`). The Orchestrator routes the build.
6. No timing at any hop.

## Size and priority

**`XS`:** one shell script of about `f-mutants.sh`'s size (38 lines) and its output. **Not `S`:** no production code
and no test-runner change.

**`P3`:** today's instrument is green on every plant, and nothing that edits it is on the board. **Raise it to `P2`
when a ticket that edits `clause-b.mjs` is pulled.** It is due before that ticket merges.

## Definition of Ready

BA/PM, 2026-10-21. **Result: 10 of 10.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** plants exist only in two scratch scripts; Biome excludes `.grugops/`; likely next edits named (`AR-163-DELONLY`, `AR-163-UNCOMMENT`) |
| 2 | scope and out-of-scope clear | **✅** two files, 7 plants in a table; Biome, vitest, the instrument, the uncomment and `G-1b` plants and gate wiring fenced |
| 3 | INVEST-shaped | **✅** independent (`ABC-163` merged); one script; plant bodies negotiable within the table |
| 4 | acceptance testable and measurable | **✅** exactly 2 files; exit 0 / nonzero; exactly 4 named mismatches on the old copy; 28-style byte compare; an `ALT` plant names limb 2; clean `status`; equal counts |
| 5 | dependencies known | **✅** none blocking; due before any `clause-b.mjs` edit merges |
| 6 | security/NFR triggers with a measurable target | **✅** `NFR-008` 0 / 0 / 0; no risk closed or opened |
| 7 | test notes present | **✅** six |
| 8 | size assigned | **✅** `XS` |
| 9 | priority assigned | **✅** `P3`, with a promotion trigger |
| 10 | no major unresolved blocker | **✅** none. The instrument at `59fc9215` is byte-identical to `87d3897d` |

Column moves after `Ready` are the Orchestrator's.

## QE

QE/E2E, 2026-10-21 (subtask `qe-ABC-182`). I reviewed tip `a7adaf21` (code `053595af`) against base `19abbdb1`. I ran
the harness myself in scratch clones and read every plant diff before opening the SE's notes. The detail is in
`.grugops/context/qe-ABC-182/notes/`. The verdict is in `…decision-8168f877`, the gaps in `…observation-87ce96c8`, and
the plant grading in `…observation-1636f225`.

**Verdict: PASS_WITH_GAPS.** All six criteria are MET. One gap is LOW and three are INFO. None is against a criterion
or blocks.

- **`A3` (run first):** with the `341da4c1` copy (`node_modules` symlinked in scratch), the harness exits 1 and prints
  `limb 1 MISMATCH: P2b P2c CMT X1`, exactly four. MET.
- **`A2`:** with the folded instrument, it exits 0 at `19abbdb1` and at `053595af`.
  - 7 of 7 rows match the Scope table, and limbs 2 and 3 are identical to `341da4c1` (14 of 14).
  - Afterwards `status --porcelain` is empty, and `HEAD` and the 24 refs are unchanged.
  - No plant commit exists in the repository. MET.
- **`A4`:** a 1-byte `ALT` (`NAME[2]`) exits 1 and names `limb2` on 7 of 7. QE's twin `ALT3` names only `limb3`. Both
  were deleted. MET.
- **`A5`:** `cmp` of the re-run at `19abbdb1` against `r2-mutants.out.txt` gives rc 0. MET.
- **`A1`:** at `053595af` the diff lists exactly the 2 probe files, and `clause-b.mjs` is unchanged. At the tip it also
  lists the SE's 3 Workflow 16 notes. I rule A1 MET on intent: it guards the delivered change, and the notes are
  process records. MET.
- **`A6`:** 59 files / 1987 tests at the tip, equal to QE's own base run at `19abbdb1`. Skips 0. `biome.json` is
  unchanged. MET.
- **Plants:**
  - All 7 bodies match the table and the ABC-163 plants. P2c's `colour` comes from `resolution.options`.
  - NOH sits at `619abc14` = `f00038ef^1`, where no file holds limb 1.
  - The G1 rows are labelled `AR-163-DELONLY gap`.
  - Limb 1 is read from the `limb 1:` verdict and the `(b1) Ruling 2` file list, never from a bare `(b1)`.
- **Gates (tip; its code tree equals `053595af`):** lint, typecheck and build exit 0. `npm test` exits 0 (59 files,
  1987 tests), and `last-run.json` reads `success: true` with 0 pending and 0 todo. The skip count is 0, and the
  integrity check reports `No findings.`. `CLI_DEEP` 11/11 and `PERFT_DEEP` 32/32. No timing was taken.
- **Gaps:**
  - `QE-182-a` (LOW, route Architect/Design): a two-edit plant that applies only in part passes under its full label.
    Shown on a scratch drift commit, where P2c's `cli.ts` edit misses and the harness still exits 0 with `P2c … ok`.
    It is not live at `19abbdb1` or `053595af`.
  - `QE-182-b` (INFO, Architect/Design): exit 1 also means the instrument could not run (a relative instrument path
    names no plant). Read an exit 1 as a verdict only if the run ends with a `MISMATCH` or `DIFFER` line.
  - `QE-182-c` (INFO, records): two checks are by design weaker than they could be. NOH's `adds nothing` is checked
    only when a Ruling 2 line is printed. The `(b1) capability` count and the "no pathspec diff" property are not
    asserted.
  - `QE-182-d` (INFO, BA/PM): A1's literal wording does not hold at the tip. Scope item 2 says the output is from "the
    first run at `A3`"; it is A2's run, as A5 says.
- **UAT waiver reading (AGENTS.md's form, `.snap` not filtered):**
  `git diff --name-only <d>~1 <d> | grep -v '\.test\.ts$' | grep '^src/'` is **empty** for `053595af` and for
  `a7adaf21`, and so is the range from `19abbdb1`. No `.snap` changed. Applying the waiver is the Orchestrator's job.
