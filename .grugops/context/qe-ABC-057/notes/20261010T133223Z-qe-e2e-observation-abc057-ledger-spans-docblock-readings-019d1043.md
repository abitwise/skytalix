---
id: 20261010T133223Z-qe-e2e-observation-abc057-ledger-spans-docblock-readings-019d1043
kind: observation
by: qe-e2e
at: 2026-10-10T13:32:23Z
verified_by:
confidence: high
refs:
  - ABC-057
  - ADR-0011
  - ADR-0029
  - ADR-0030
  - R5
  - M15
  - QE-054-b
  - AR-053-ORDER
  - src/history-pane.nfr.test.ts
  - .grugops/context/qe-ABC-053/probe/plant.py
  - 20261010T133223Z-qe-e2e-decision-abc057-verdict-pass-with-gaps-70eb6930
supersedes:
---

# `ABC-057` QE readings: 96 out-of-tree builds, the spans, and the two docblocks against the code

This note is hand-authored and unsealed. The raw files are in `../probe/`.
- Base is `079284d9` and head is `00aad4da`. The `src` tree at head is identical to `d2920d60`.
- Each build is one fresh `git archive` copy with `node_modules` linked.
- For each build `ledger.sh` records the vitest exit, `biome check src` (lint) and `tsc --noEmit`.
- `+FMT` means `biome format --write src` ran after the plant, which gives the gate-clean spelling of
  the same edit.
- "file" means the lane `src/history-pane.nfr.test.ts`, 12 tests. "src" means the whole lane, 1583
  tests.
- 96 builds ran. 6 more were `PLANT-FAILED` on a build-name separator bug in QE's harness; they were
  renamed and re-run, and the failed rows are left in the ledgers. load1 was 2–47 across the ledger.
  Other roles were running in parallel, and the verdicts are deterministic.

## 1. The operator: the ticket's mutants and QE's own swaps (`ledger-A1*.tsv`, `ledger-combos*.tsv`)

| build | head, whole lane | base, whole lane | gate-clean? | what it loses on base (file lane + witness) |
|---|---|---|---|---|
| `M15` (A1 verbatim) | **RED**, only the tripwire | 1583/1583 | lint **1** (format only), tsc 0 | — |
| `M15+FMT` | **RED**, only the tripwire | 1583/1583 | **yes** | `+WSTALELICENCE` **green** (stale licence lost) |
| `M15SUB` / `+FMT` | **RED**, only the tripwire | 1583/1583 | `+FMT` yes | `+WPERFT-STATIC` **green**, `+QWLAUNDER-CLIOPT` **green** (unlicensed importer lost) |
| `QSTRICT` (`toStrictEqual`) / `+FMT` | **RED**, only the tripwire | 1583/1583 | `+FMT` yes | nothing: `+WLAUNDER`, `+WSTALELICENCE` and `+WPERFT-STATIC` all red. **Equivalent** |
| `QMATCHOBJ` (`toMatchObject`) / `+FMT` | **RED**, only the tripwire | 1583/1583 | `+FMT` yes | nothing: all three red. **Equivalent** |
| `QSTRICT-AC` (`toStrictEqual(expect.arrayContaining(licence))`) / `+FMT` | **RED**, only the tripwire | 1583/1583 | `+FMT` yes | `+WPERFT-STATIC` **green** (same as `M15SUB`) |
| `QMATCHOBJ-AC` (`expect(licence).toMatchObject(expect.arrayContaining(importers))`) / `+FMT` | **RED**, only the tripwire | 1583/1583 | `+FMT` yes | `+WSTALELICENCE` **green** (same as `M15`) |
| `QCONTAIN-EACH` (`for … expect(LICENSED_DRIVERS).toContain(file)`) | **RED**, only the tripwire | 1583/1583 | **yes, as planted** | `+WSTALELICENCE` **green** |

**`WLAUNDER` is a poor discriminator for the superset direction.** Its plant edits `zobrist.ts`, and
the `A6.3`/`A6.4` witnesses read `zobrist.ts` as their unmutated control. So `M15SUB+FMT+WLAUNDER`
stays red on base (2 failed, both `A6`), even though the guard's own equality is the one that
passed. `QWLAUNDER-CLIOPT` launders through `cli-options.ts` instead: alone it reds only the equality,
and under `M15SUB` it is green. Readers of `A2` should know that `WLAUNDER`'s red does not depend
only on the operator.

## 2. Reformatted and moved comparators (`ledger-reformat-move-operand.tsv`, `ledger-move2.tsv`), head, file lane

| build | tripwire | lint | reading |
|---|---|---|---|
| `QWRAP` (the same call over 3 lines) | RED | **1** (format) | The false red is on a tree the lint gate already rejects |
| `QWRAP+FMT` | green | 0 | The formatter restores the one line, so there is **no** false red on a gate-clean tree |
| `QTRAIL-WS` (trailing space) | RED | **1** | as `QWRAP` |
| `QCRLF` (whole file in CRLF) | RED | **1** | as `QWRAP`. The sibling tripwire carries no newline, so it is immune. No `.gitattributes`, `core.autocrlf` unset |
| `QPARAM` (`(f) => … includes(f)`) | **RED** | 0 | A gate-clean, semantically identical edit that reds. An over-pin by design (INFO) |
| `QMOVE-AFTER` (same block, same indent, after the type-import assertion) | green | 0 | A harmless move, **no** false red |
| `QMOVE-NESTED` / `+FMT` (inside a `{ }` block, indent 6) | **RED** | `+FMT` 0 | A gate-clean harmless move that reds, because the literal pins the indent (INFO) |
| `QMOVE-UNREACHABLE` (same text after a `return;`) | **green**; `+WSTALELICENCE` green | **1** (`noUnreachable`) | The text pin cannot see reachability. The lint gate kills it |
| `QMOVE-COMMENTED-M15` / `+FMT` (the original line kept in a `/* */` at indent 4, `M15` below it) | **green** | `+FMT` **0**, tsc 0 | Gate-clean. With `+WSTALELICENCE` the kill is lost. This is test note 2's "not tamper-proof", measured. The lint 1 on the `+WSTALELICENCE` row is QE's plant import order in `turn-loop.ts`, not the mutant |

## 3. Operands outside both pinned lines (head and base)

| build | file lane | whole lane (head) | lint / tsc |
|---|---|---|---|
| `QLHS-INTERSECT+FMT` (`runtimeImporters` gains `.filter((file) => LICENSED_DRIVERS.includes(file))`) | 12/12 | — | 0 / 0 |
| `QLHS-INTERSECT+FMT+WPERFT-STATIC` | **12/12 head, 12/12 base** | **1583/1583** | 0 / 0 |
| `QLHS-INTERSECT+FMT+QWLAUNDER-CLIOPT` | **12/12** head | — | 0 / 0 |
| `QSCAN-NARROW+FMT+WPERFT-STATIC` (the guard's `production` drops `perft-bench.ts`) | **12/12 head, 12/12 base** | **1583/1583** | 0 / 0 |

These are QE-057-a. They are pre-existing, and they are not the ticket's property (`A1` is the
operator).

## 4. The composer claim (`QE-054-b` fold-in), head, file lane (`ledger-composer-ctrl-hist.tsv`)

- **Controls.** `QF-ALIAS` (`{ assembleFrame as compose }`) and `QF-NAMESPACE` are RED on the tripwire,
  as the docblock says.
- **The two named spellings.** `QF-COMMENT` (`{ /* composer */ assembleFrame as compose }`) is GREEN and
  gate-clean. `QF-DEFAULT-AS` (`{ default as compose }`) is GREEN, with tsc **2** (`frame.ts` has no
  default export).
- **Not named.** `QF-STRING-NAME` (`{ "assembleFrame" as compose }`) is GREEN, **lint 0, tsc 0**.
  `QF-COMMENT-AFTER-SEMI` (`{ assembleFrame as compose /* a; b */ }`) is GREEN, **lint 0, tsc 0**:
  `[^;]*?` stops at the `;`, so the statement is never read.

This is QE-057-b.

## 5. The spans, QE's anchors, sha256 (`spansqe.py` → `spans-qe.txt`)

Identical at `079284d9`, `404934f3`, `d2920d60` and `00aad4da`:

| span | lines | sha256 (16) |
|---|---|---|
| licence regex lines | 3 | `3541fa85000a2f08` |
| the licence `it`, whole (name to closing `});`) | 32 | `33e2691d32c0f775` |
| sibling tripwire | 4 | `0f1fda2690e34d56` |
| composer tripwire code (`const directory` to `});`) | 19 | `9513ddcff3cfb93e` |
| `WITNESSED_EXPRESSION` | 3 | `5fcde2281bb76239` |
| `LICENSED_DRIVERS` | 2 | `d846613674bb11a9` |
| probe `it` | 115 | `051ea712d8d7c1e5` |

The guard line occurs exactly once in head's text when it is framed by real newlines. So the literal
can only match the guard.

## 6. The docblocks against the code

- **The licence docblock's history sentence** ("green before `ABC-019` added `turn-loop.ts` and after
  it") was **measured true**. The guard was born at `b7e1226d` on a tree without `turn-loop.ts`.
  `6cd25079` (guard, no loop) passes 11/11, and so does `d83a7e4d` (loop added).
- **`A4`'s facts** are all true (see the decision note). There is no bare `gameStatus(`, `new Map` or
  `positionCounts` in code lines of `turn-loop.ts` or `cli.ts`.
- **The composer docblock and the in-test comment** say the same thing, and both are accurate for
  the two spellings they name. The comment line at head `:545` is **172 characters**. The file's
  widest comment line at base was 103. Biome does not reflow comments, so lint is clean.
