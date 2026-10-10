---
id: 20261010T141426Z-ba-pm-observation-followups-readings-at-71418879-e0e21bed
kind: observation
by: ba-pm
at: 2026-10-10T14:14:26Z
verified_by:
confidence: high
refs:
  - R5b
  - QE-057-a
  - ABC-136
  - ABC-072
  - ABC-073
  - ABC-055
  - ADR-0036
  - QE-059-e
  - ABC-087
  - RR-LEVEL1-REALCLOCK
  - src/history-pane.nfr.test.ts
  - .grugops/context/qe-ABC-057/probe/plantqe057.py
  - .grugops/context/bapm-followups-2026-10-10/probe/RUN.txt
  - .grugops/context/bapm-followups-2026-10-10/probe/r5b-ledger.sh
  - .grugops/context/bapm-followups-2026-10-10/probe/abc073-set.sh
  - .grugops/context/bapm-followups-2026-10-10/probe/limbs-delta.sh
  - 20261010T141426Z-ba-pm-decision-five-followups-abc136-cut-abc072-ready-abc073-folds-qe059-no-ticket-abc087-a2-e6707fd9
supersedes:
---

# Readings at wave tip `71418879`: `R5b`'s two survivors are still green, `ABC-073`'s live set is `ABC-055` alone, the clause (b) baseline is still 0 / 3 / 0, and three DELTA fixtures have known answers

This note is hand-authored and unsealed. The full output is in `probe/RUN.txt`: started
2026-10-10T14:11:38Z, Node v26.11.0, load1 5.53. The scripts are in `probe/`.

## `R5b` (for `ABC-136`)

- **The file is the one QE reviewed.** `git diff --stat 00aad4da 71418879 --
  src/history-pane.nfr.test.ts` is empty.
- **QE's planter, unchanged.** File lane, one fresh `git archive` per build:

  | build | exit | tests | fails |
  |---|---|---|---|
  | `CONTROL` | 0 | 12/12 | — |
  | `QLHS-INTERSECT+FMT` (and `+WPERFT-STATIC`) | 0 | 12/12 | — |
  | `QSCAN-NARROW+FMT` (and `+WPERFT-STATIC`) | 0 | 12/12 | — |
  | `M15+FMT`, `M15SUB+FMT` | 1 | 11/12 | the drift tripwire |
  | `WLAUNDER` | 1 | 9/12 | `A6.3`, `A6.4`, the licence guard |
  | `WSTALELICENCE`, `WPERFT-STATIC` | 1 | 11/12 | the licence guard |

- **Phrases in collapsed text (`ABC-134`'s `phrases.mjs`):**
  - "a hop that widens the guard reds this test": **1**;
  - `R5b`: **0**.
- **Framed literals in raw text.** Each occurs exactly **1** time:
  - the `\n    const production = productionModulesIn(directory);\n` line. It is unique alone,
    because `:621` reads `directory.pathname`;
  - that line framed with the line after it;
  - the whole `runtimeImporters` statement, `\n`-framed through its `);`.
- **No `grugops/*` branch** touches the file relative to its merge-base with the tip.
- **Name note.** The planter spells the mirror mutant `M15SUB`; the Architect's note writes
  `M15-SUB`. They are the same build.

## `ABC-073`'s live set (`probe/abc073-set.sh`, whitespace-normalized text)

- **Not `Done`:** `ABC-055` (`Ready`; the interim "unruled" text, fail-safe present), plus
  `ABC-072` and `ABC-073` themselves.
- **`Done`, and fenced:**
  - `ABC-041`, `053` and `054` restate the clause;
  - `ABC-057`, `058` and `059` carry the interim "unruled" text, so `A1`'s 0-pages grep could never
    pass on them;
  - `ABC-061`, `063`, `064`, `065`, `067` and `082` restate the clause with no fail-safe.

## Clause (b) (for `ABC-072`)

- **STATE baseline** (`rescore-batch-2-2026-10-10/probe/clause-b-limbs.mjs`): 35 production files.
  - limb 1: **0**;
  - limb 2: **3** in code (`cli.ts`, `glyph-mode.ts`, `perft-bench.ts`), 9 raw;
  - limb 3: **0** calls. The 3 hits are `RegExp.prototype.exec`.
  - Unchanged since `f76e041`.
- **DELTA fixtures** (`probe/limbs-delta.sh`; a rough reading, the instrument is the hop's):
  - **`dbaf972f^..dbaf972f` (`ABC-042`).** 2 production files, both added: `cli.ts` and
    `cli-options.ts`. **4** `process.` code lines. The new edges include a value import of
    `glyph-mode.ts`, which reads `process.` **2×** in code at that commit. **(b1) and (b2) fire.**
  - **`34c9c026^..34c9c026` (`ABC-082`).** 2 production files, **0** limb lines. 3 new edges, to
    `apply.ts`, `fen.ts` and `legal.ts`, all limb-free. **Does not fire.**
  - **`4c33b72b^1..4c33b72b` (`ABC-059` merge).** **0** production files. **Does not fire.**
  - **Known limit of the rough reading:** a multi-line `import {` prints no specifier. The hop's
    instrument has to resolve those.

## `QE-059-e` and `ABC-087`

- **`QE-059-e`.** `.grugops/context/ticket-to-pr-ABC-059/probe/x` is **0** bytes. Its `RUN.txt:9`
  indexes `timing-set{1,2}.log`. Only `timing-set{1,2}.tsv` are tracked.
- **`ABC-087`, on its branch (page not edited).** `:143` reads "the wall clock used matches that
  level's budget within ±20%"; `:259` (test note 3) reads "`A2`'s ±20% must use the injected
  clock".
- **Not wired.** `src/cli.ts:175` builds `createEngine({ budgetMs: DEFAULT_BUDGET_MS })`, and no
  production file on that branch names `levels.ts`.
