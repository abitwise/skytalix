---
id: 20261029T203901Z-software-engineer-decision-e56997fd
kind: decision
by: software-engineer
at: 2026-10-29T20:39:01Z
verified_by: 
confidence: high
refs:
  - se-ABC-227
  - ABC-227
  - EPIC-010
  - ABC-235
  - ABC-206
  - bapm-epic010-improvements/20261029T201508Z-ba-pm-decision-12cb550d
  - sa-ideas-verify/20261029T200022Z-system-analyst-observation-306a4012
  - sa-ideas-verify/20261029T200049Z-system-analyst-decision-837e6fa8
  - ADR-0049
  - NFR-009
  - .grugops/context/se-ABC-227/raw/
supersedes: 
seal: sha256:361baa9b96b89e4a7a0bf7090a9642ffb270498fbd82da10f2328efb5bf51d0e
---

# SE decision, se-ABC-227: how the profile was taken and read

The method choices behind the ABC-227 observation, so a re-run reads the same way:

1. **Fresh process per run, `chooseMove(parseFen(board), { budgetMs: 3000 })`.** That is level 5's budget (`src/levels.ts`), called directly with no level wrapper. Each process makes one call, so it is cold JIT and has an empty TT, as a game's first engine move is.
2. **Separate CPU and heap runs (5 + 5 per board).** The sampling heap profiler with collected objects included slows the search to 0.61-0.70x. So nps and time shares come from the `--cpu-prof` runs only, and the allocation shares from the heap runs. Bytes per node come from V8's `total_allocated_bytes` counter in the CPU runs.
3. **A time window, not the whole profile.** `run.mts` records `process.hrtime` around the call, which is on the same CLOCK_MONOTONIC base as the `.cpuprofile` timestamps. Only samples inside the window count. This was checked: 0 samples under `chooseMove` fell outside it in 15/15 runs.
4. **Buckets.** Each sample's leaf frame is placed by its file (`moves.ts`+`legal.ts`, `apply.ts`, `evaluate.ts`, `transposition.ts`). Ordering is any sample with `orderMoves`/`orderKey` on its stack, which takes in `sameMove`, `mvvLvaKey` as called from `orderKey`, the closures and the native sort. Everything else is "other", itemised. Quiescence's own capture sort is "other" (A3 names only `orderMoves`/`orderKey`).
5. **A2 reading.** Each top-5 function's rank in every run is compared with its rank in the pooled 5-run profile, and must be within ±2.
6. **Cutechess guard by process NAME (`pgrep -i cutechess`), not argv.** A first attempt matched on argv. It matched the calling shell's own command text and waited on itself. That attempt was killed before any run, and nothing from it is used.
7. **Redaction (ADR-0049 d4).** Profile URLs are rewritten to `file:///<repo>/src/…`, and any other home or temp path becomes `<redacted-path>`. `redact.mts` refuses to write a file in which a host path survives. The heap profiles' per-sample list (~400 k entries) is dropped; the call tree's `selfSize`, which all the readings use, is kept whole. Profiles are gzipped (2.0 MB total).
