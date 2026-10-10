---
id: 20261010T165406Z-ba-pm-observation-r5d-qe139a-qe010-readings-at-75dcc0f5-faff5369
kind: observation
by: ba-pm
at: 2026-10-10T16:54:06Z
verified_by:
confidence: high
refs:
  - R5d
  - QE-137-a
  - QE-139-a
  - QE-010-b
  - QE-010-c
  - ABC-140
  - ABC-141
  - src/history-pane.nfr.test.ts
  - src/turn-loop.ts
  - src/move-input.ts
  - src/move-input.test.ts
  - src/history-pane.ts
  - .grugops/context/bapm-r5d-qe139a-2026-10-10/probe/RUN.txt
  - .grugops/context/bapm-r5d-qe139a-2026-10-10/probe/ledger-file.tsv
  - .grugops/context/bapm-r5d-qe139a-2026-10-10/probe/ledger-suite.tsv
  - .grugops/context/bapm-r5d-qe139a-2026-10-10/probe/derives-fullmove.out.txt
  - .grugops/context/design-qe137-2026-10-10/probe/plant.mjs
supersedes:
---

# Readings at `75dcc0f5` (and `ABC-010`'s `f9d1ff4b`): every `R5d` row reproduces, the prototype reds all five; derives 6 → 7; fullmove 1e20 parses

Hand-authored and unsealed. The raw files are in `../probe/`; read `RUN.txt` first.

**Harness.** The Architect's `plant.mjs` ran unchanged from a private copy (sha256 `b6b5e458…57bd`), inside BA/PM's
own loop (`probe/ledger.sh`). That loop builds one fresh `git archive` per build, then runs biome, tsc and the
vitest JSON reporter. The Architect's `ledger.sh` was not run, because it hardcodes the Architect's scratch paths.
Nothing was refused, and no other role was asked to run anything.

- **`R5d`.**
  - The file blob `ed2cd2b0` is identical to `eae04388`. Every cited line holds (`RUN.txt`).
  - The file ledger has 23 builds, all lint 0 and tsc 0.
    - `CONTROL` 12/12. `WSC` and `WPS` are red on their own guards.
    - The five survivors (`N591-HEAD`/`-TAIL`/`-WRAP`, `C-CONTAIN`/`-OPERAND`, `+FMT+WSC`) are each 12/12 green.
    - With the prototype `PIN`, all five red on the new messages. `N653-NARROW`, `H-SHADOW` and `H-FSMOCK` stay
      green, and no anchor fails.
  - Whole suite: `CONTROL`, `N591-TAIL+FMT+WSC`, `C-OPERAND+FMT+WSC` and `PIN` are each 52 files, 1608/1608.
- **`QE-139-a`.**
  - The gloss is at `src/turn-loop.ts:281–282`, and the re-emit by kind at `:392–395`.
  - `board` is a `command` with `[]` messages (`src/command-input.ts:119`, `:269`).
  - `claim` has no `messages` field (`:140`), yet a refused claim re-emits.
  - The phrase also appears in `ABC-019:330`, `src/cli.test.ts:691`, `:2726` (identifier) and `:2732`.
- **`QE-010-b`.**
  - `legalMoves` calls per `resolveMoveInput(…, "Qxd4")`: **6** at `75dcc0f5` (5 `#` candidates), **7** at
    `f9d1ff4b` (6 `#`).
  - The `grep` counts for "cost six of those" and "measured six" are 1 and 1 on both tips.
- **`QE-010-c`.**
  - `parseFen` accepts fullmove 9999, 10000 and 1e20 on both tips.
  - "`ABC-010` is the ticket that would" counts 1 on both tips.
  - `ABC-010`'s branch does not touch `src/move-input.ts` or `src/history-pane.ts`.
- **Open hops on the files**, from ticket pages at `75dcc0f5`:
  - `src/history-pane.nfr.test.ts`: none in flight. `ABC-030` (Backlog, `:115`) is merge order.
  - `src/turn-loop.ts`: `ABC-040` and `ABC-101` (both Backlog).
  - `src/move-input*.ts`, `src/history-pane.ts`: `ABC-010` only.
