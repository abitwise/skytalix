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
