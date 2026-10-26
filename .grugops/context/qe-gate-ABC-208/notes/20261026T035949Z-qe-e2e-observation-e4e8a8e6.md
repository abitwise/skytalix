---
id: 20261026T035949Z-qe-e2e-observation-e4e8a8e6
kind: observation
by: qe-e2e
at: 2026-10-26T03:59:49Z
verified_by: 
confidence: high: gates as run at ddc307a9 on a shared host; durations are not readings
refs:
  - ABC-208
  - EPIC-008
  - ADR-0050
  - ADR-0026
  - ADR-0034
  - ADR-0020
  - ADR-0027
  - ADR-0049
  - NFR-004
  - NFR-005
  - NFR-008
  - G1
  - G4
  - G6
  - A1
  - A2
  - A3
  - A4
  - A6
  - QE-208-a
  - QE-208-b
  - QE-208-c
  - QE-208-d
  - QE-208-e
  - QE-208-f
  - plans/tickets/ABC-208-null-move-pruning-behind-a-test-only-off-door-with-a-zugzwang-guard.md
  - memory-bank/50-decisions/ADR-0050-null-move-pruning-arrives-at-null-window-nodes-with-r-3-behind-a-test-only-off-door-pair-guarded-below-three-non-pawn-pieces.md
  - arch-design-ABC-208/20261026T023232Z-architect-design-decision-012b1053
  - arch-design-ABC-208/20261026T023232Z-architect-design-observation-bae20026
  - ticket-to-pr-ABC-208/20261026T030739Z-software-engineer-decision-e0666f5b
  - ticket-to-pr-ABC-208/20261026T030739Z-software-engineer-observation-83c40265
  - orch-2026-10-26e/20261026T023422Z-orchestrator-decision-749ff988
  - orch-2026-10-26g/20261026T030853Z-orchestrator-decision-c8b5492f
  - grugops/qe-gate-ABC-208
  - grugops/ABC-208
  - 80345eb9
  - afb6b32f
  - ef9711ec
  - ddc307a9
supersedes: 
seal: sha256:d88278de31e3383909393f3131a9dc9535c5be58b0c063c029483ab81ee64362
---

# QE/E2E static gate ABC-208, the gates at `ddc307a9`: lint, typecheck, build 0; npm test 63 files 2 123/2 123; skips 0, No findings.; lane inventory 63 = 63; SEARCH_DEEP (null-move lane included), ENGINE_DEEP deterministic rows and PUZZLE_DEEP all green; 10 real-clock rows filtered by name and not run

Task `qe-gate-ABC-208`, worktree `../wt-qe-gate-ABC-208` at `ddc307a9`, own `npm ci --ignore-scripts`. Plain node v26.11.1.
Width 1 of 3, NOT alone: no duration below is a reading.

## Mandatory gates
- `npm run lint` exit 0 (biome, 129 files, no fixes). `npm run typecheck` exit 0. `npm run build` exit 0.
- `npm test` exit 0: 63 files, **2 123/2 123** (base 2 090 + 33 new). `.test-results/last-run.json`: `success: true`,
  `runState: exited`, 2 123 passed, 0 failed, 0 pending, 0 todo, 472 suites.
- Skip count (the spelled `--reporter=json` command): **0**. `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md
  --skip-count 0`: `No findings.`, exit 0. `.grugops/test-skips.md` was read and run only.
- `node tools/grugops/lane-inventory.js`: "The lane collects 63 test files; git tracks 63." `No findings.`, exit 0.

## Deep lanes (one file at a time; real-clock rows filtered with
`-t '^(?!.*(real clock|REAL clock|wall clock|NFR-005|between a 1 s and a 3 s search)).*$'`)
| lane | file | result |
|---|---|---|
| `SEARCH_DEEP=1` | `search.null-move` | 39/39 (the new lane) |
| `SEARCH_DEEP=1` | `search` · `search.ordering` · `transposition` · `quiescence` · `search.pvs-lmr` | 57 · 38 · 40 · 37 · 29, all green |
| `ENGINE_DEEP=1` | `engine` | 54 green, 6 filtered |
| `ENGINE_DEEP=1` | `levels` | 37 green, 4 filtered |
| `ENGINE_DEEP=1` | `transposition` | 25 green, 1 filtered |
| `PUZZLE_DEEP=1` | `puzzle-suite` | 18/18; **G1 54/58** |
- **Filtered, real clock, NOT RUN (10):**
  - `engine`: `A1` 30 positions; `NFR-005` depth-in-budget; `A2` 50 ms; `A7` 1 ms; `ABC-086` `A2` shipped wall clock.
  - `levels`: `A5` level 5 ≤ 5 s; `ABC-212` `A4` levels 6 and 7.
  - `transposition`: `A7`'s 1 s / 3 s memory row.
  - `search.pvs-lmr`: the `ENGINE_DEEP` `A2` report row. It is defined only under `ENGINE_DEEP`; this hop ran that file under
    `SEARCH_DEEP` only.
- **Filtered by name only, both default-lane rows, green in `npm test`:** `engine` `ABC-086` `A4` ("reads no real clock")
  and `levels` `A6` ("never blunders, so `NFR-005`'s reading…").
- Owed to `qe-ABC-208` (ALONE): the 10 rows above, `G2`, `G5`, `G6`, `G8`, `G9`, `G10`, `G11`, D, and `N8-LANE` as a timed
  reading.
