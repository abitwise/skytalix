---
id: 20261010T163938Z-architect-design-observation-qe137-readings-call-sites-shadows-prototype-pins-ca8c4b23
kind: observation
by: architect-design
at: 2026-10-10T16:39:38Z
verified_by:
confidence: high
refs:
  - QE-137-a
  - QE-137-b
  - R5c
  - R5d
  - ADR-0011
  - ADR-0029
  - src/history-pane.nfr.test.ts
  - .grugops/context/design-qe137-2026-10-10/probe/RUN.txt
  - .grugops/context/design-qe137-2026-10-10/probe/ledger-file.tsv
  - .grugops/context/design-qe137-2026-10-10/probe/ledger-suite.tsv
  - .grugops/context/design-qe137-2026-10-10/probe/ledger-pin.tsv
  - .grugops/context/design-qe137-2026-10-10/probe/plant.mjs
  - .grugops/context/design-qe137-2026-10-10/probe/ledger.sh
  - .grugops/context/design-qe137-2026-10-10/probe/architect-r5d-prototype.patch
  - 20261010T161218Z-qe-e2e-observation-abc137-gap-register-853f77e5
supersedes:
---

# Readings at `eae04388`: the composer tripwire's call AND comparator are unpinned (five survivors, whole suite green); `:653` fails closed; `QE-137-b` survives in two spellings; the prototype pins red all five

This note is hand-authored and unsealed. The raw files are in `../probe/`; read `RUN.txt` first. The test file
under rule is blob `ed2cd2b0`. Machine: Apple M3, Node v26.11.0, vitest 3.2.7. Load ran 4.2 → 35 because other
agents were working, but these are verdicts, not timings.

## Harness

The harness is the Architect's own: `plant.mjs` and `ledger.sh`.
- Each anchor is asserted to match exactly once.
- Each build runs in one fresh `git archive` tree, with `biome check src` and `tsc --noEmit`.
- Results come from the vitest JSON reporter.

QE's committed scripts were read for their anchors and **not executed**. No permission refusal was met and no
other role was asked to run anything. The witnesses are spelled independently of QE's:
- `WPS` is `playMove` plus `void playMove;`.
- `WSC` is `assembleFrame` plus `void assembleFrame;`.
- Both are planted in `perft-bench.ts`, which stays export-free.

## Premises (read from the file at the tip)

- `:24` is the `node:fs` import.
- `:152–153` is "Both guards".
- `:163–164` is the helper, pinned by `R5c`.
- `:369` is the licence call, pinned by `R5b`.
- **`:591–593`, the composer scan statement, is unpinned.**
- **`:595–598`, the composer comparator, is unpinned.**
- `:653`, the probe call: `production` is read once, at `:661`, by `toContain(COMPOSITION_ROOT)`.

## Ledger

Every build below is lint 0 and tsc 0.

| build | file | whole suite |
|---|---|---|
| `CONTROL` | 0, 12/12 | — |
| `WPS` / `WSC` (armed) | 1 licence / 1 composer | `WSC`: 1607/1608, its ONLY red |
| `N591-HEAD`/`-TAIL`/`-WRAP` `+FMT+WSC` | 0, 12/12 | **52 files / 1608 passed**, each |
| `C-CONTAIN` / `C-OPERAND` `+FMT+WSC` | 0, 12/12 | **1608 passed**, each (new, not in QE's register) |
| `N653-NARROW+FMT` | 0, 12/12 (no kill to drop) | — |
| `N653-DROPROOT+FMT` | 1, "the declared composition root exists" | — |
| `W653-WIDEN+ROOT-RENAMED+FMT` | 1, composer tripwire + probe child resolve error | — |
| `H-SHADOW+FMT+WPS` | 0, 12/12 | **1608 passed** (`QE-137-b`) |
| `H-FSMOCK+FMT+WPS` (`:24` byte-identical) | 0, 12/12 | **1608 passed** |

## Prototype pins (`architect-r5d-prototype.patch`: two framed literals after `R5c`'s)

- `PIN` and `PIN+FMT`: 0, 12/12, lint 0, tsc 0. The whole suite has 52 files and 1608 tests, all passing.
- `biome-ignore` count goes 1 → 2.
- The `WSC` and `WPS` reds are unchanged.
- **The three `N591` survivors are RED**: "the composer tripwire scans EVERY production module".
- **`C-CONTAIN` and `C-OPERAND` are RED**: "the composer tripwire compares with an EQUALITY".
- `N653-NARROW`, `H-SHADOW` and `H-FSMOCK` stay 0, as ruled.
