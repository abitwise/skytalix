---
id: 20261026T134928Z-software-engineer-observation-b5537728
kind: observation
by: software-engineer
at: 2026-10-26T13:49:28Z
verified_by: 
confidence: high (each gate run at 954eeb35 or as named, exit codes and counts read from output; single Duration runs are not a reading)
refs:
  - ABC-209
  - EPIC-008
  - ADR-0025
  - ADR-0032
  - ADR-0027
  - NFR-009
  - NFR-008
  - A1
  - A2
  - A3
  - A4
  - A5
  - plans/tickets/ABC-209-the-transposition-table-is-kept-across-the-moves-of-one-game.md
  - owner-word-2026-10-26b/20261026T132424Z-orchestrator-decision-2ae5fc12
  - arch-design-ABC-209/20261026T125648Z-architect-design-decision-2e73dcd9
  - arch-design-ABC-209/20261026T125648Z-architect-design-observation-b7d4b710
  - bapm-amend-ABC-209/20261026T130154Z-ba-pm-decision-3750aaf6
  - grugops/ABC-209
  - 9857bd1c
  - f76fbb62
  - 1da0a17f
  - 954eeb35
supersedes: 
seal: sha256:dba36b0eb76d89ca6b524b1e3904107530ebba19f68a0fd4f5556076e45ea7f5
---

# ABC-209 gates at 954eeb35: all green; default lane 2138/2138 (base 2128); deep lanes base = head file for file; G1 54/58; 12 real-clock rows filtered

- `npm run lint` 0, `npm run typecheck` 0, `npm run build` 0.
- `npm test`: exit 0, 63 files, 2138/2138 passed. Base `9857bd1c` (scratch clone, own `npm ci`): 2128/2128. +10 rows, all in `src/transposition.test.ts`.
- `.test-results/last-run.json`: success true, numPendingTests 0, numTodoTests 0. Duration, single runs taken back to back on one host (load1 ≈ 3.6), **not an NFR-008 reading**: base 8.09 s, head 8.06 s (an earlier head run before the depth-3 cut read 8.36 s). The new rows' own test time is about 0.35 s in one file (verbose reporter); no file was added.
- Skip capture: `0`. `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`
- Deep lanes, one file per run, heap 400, real-clock rows filtered by name (`real clock`, `REAL clock`, `wall clock`, `real-clock`, `NFR-005`, `1 s and a 3 s`), the design hop's filter. Head = base on every file except `transposition.test.ts`, 0 failed everywhere:
  - `PUZZLE_DEEP` puzzle-suite 18/18. **G1: solved 54/58, baseline 54/58**, no NEWLY-MISSED row.
  - `SEARCH_DEEP`: search 57, search.ordering 38, quiescence 37, transposition 50 (base 40), search.pvs-lmr 29, search.null-move 44 (the null-move lane).
  - `ENGINE_DEEP` (deterministic rows): engine 54 + 6 filtered, levels 37 + 4, transposition 36 + 1 (base 25 + 1), search.pvs-lmr 20 + 1, gameend 47, legal 37. The 12 filtered rows are the design's 12.
- **Not run:** any real-clock search or row, G2, G5, G6, D, LADDER_DEEP, CLI_DEEP, UCI_DEEP.
