---
id: 20260925T235500Z-architect-design-decision-adr0026-accepted-amendments-written-d41c7a58
kind: decision
by: architect-design
at: 2026-09-25T23:55:00Z
verified_by:
confidence: high
refs:
  - ADR-0026
  - ABC-121
  - ABC-077
  - ABC-078
  - memory-bank/50-decisions/ADR-0026-a-value-changing-search-heuristic-gets-a-test-only-off-door-and-a-bounded-oracle.md
  - 20260925T145700Z-architect-design-decision-adr0026-accept-with-amendments-9a3f6e21
  - 20260925T145600Z-architect-design-observation-bounded-oracle-misses-three-of-six-wrong-lmrs-7c1d05ab
  - 20260925T234000Z-orchestrator-decision-6a63f2b7
  - src/search.mate-corpus.ts
supersedes:
---

# `ADR-0026` is accepted, and the review's amendments are written into it

Hand-authored, no `seal`. This repo ships no `context-io` writer and no `propose_note` tool
surfaced at this hop, so the note follows the precedent of the earlier `validate-adr0026` notes.
This is a `decision`, which needs no stamp. No test was run: every number is cited from
`…7c1d05ab` and the probe `*.jsonl`, and none was re-measured.

## Scope

- In scope: the ADR file, one trace row, this note, and the queue move.
- Not touched: `src/`, the board, `AGENTS.md`, and the `ABC-121` ticket. BA/PM folds the
  amendments into `A1` / `A3` / `A4`.

## What was written

- **Status:** accepted 2026-09-25. It records the owner's word verbatim (*"4. accept"*,
  `…6a63f2b7`) and the review's note id (`…9a3f6e21`).
- **Decision 6:** the predicate returns 0 or 1 ply, and each recursion subtracts exactly that
  value. The predicate classifies capture, promotion, gives-check and in-check itself. The caller
  passes remaining depth, move index and the root flag.
- **Decision 9 (depth):** the drift bars run at depth 5 in both recursions: `search()` vs
  `searchWithoutReductions`, and `chooseMove` vs `chooseMoveWithoutReductions`, iterated to 5.
- **Decision 9 (mate floor):** the 190-corpus mate floor is replaced by a one-extra-ply floor
  (d = 4 → 5) on the mate-rich corpus. "0 flips on the 190 corpus" is now a report, not a bar.
  The ADR states plainly that the bounded oracle is a net for gross drift and window bugs, not a
  proof of the reduction rule.
- **Consequences:** `ABC-121` `A4`'s constructed fail-high happens at a null-window node
  (alpha + 1 = beta). The ADR also lists which row reds each planted wrong LMR.
- **Alternatives:** the one-door options-record alternative is rejected, because it admits
  `reductions` without `pvs`. The reason on the old options-parameter entry is scoped to the
  shipped entry points.

## Choices this hop made (the review left them open)

- **The mate floor's depth is d = 4 → 5**, the cheaper of the two measured pairs. Both pairs read
  0 flips for the correct rule and red the same variants (`r2`, `gross`, PVS window bugs).
- **The fixture path is `src/search.mate-corpus.ts`.** It is a test-only TS data module, not
  `*.test.ts`, so vitest does not collect it. `tsconfig.json` and `biome.json` already cover
  `src/`.
  - It holds a frozen literal list: the seven seeds plus every in-progress position within two
    plies of them, deduplicated. The probe read 287.
  - A pin on the list's length guards it.
  - Frozen rather than generated, so a move-generator change cannot silently shrink the net.
  - The Engineer owns it and builds it under `ABC-121`. It is not built here.

## Risks

- The new rows' lane is `UNKNOWN - verify` (`N8-LANE`). The probe paid 11–19 s per depth pair
  under load 60–122, so they are deep-lane unless the Engineer measures otherwise.
- The 180 / 205 mate counts and the 287 total are probe readings. Until the real
  `searchWithoutReductions` exists they are `UNKNOWN - verify` against the built door.
