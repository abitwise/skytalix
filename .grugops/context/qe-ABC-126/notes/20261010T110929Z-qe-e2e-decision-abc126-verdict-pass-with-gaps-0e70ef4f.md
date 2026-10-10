---
id: 20261010T110929Z-qe-e2e-decision-abc126-verdict-pass-with-gaps-0e70ef4f
kind: decision
by: qe-e2e
at: 2026-10-10T11:09:29Z
verified_by:
confidence: high
refs:
  - ABC-126
  - ABC-079
  - ABC-084
  - ABC-127
  - ABC-010
  - ABC-083
  - ADR-0028
  - ADR-0033
  - RISK-003
  - N8-LANE
  - src/puzzle-corpus.ts
  - src/quiescence.test.ts
  - src/puzzle-suite.test.ts
  - src/puzzle-suite.baseline.json
  - plans/tickets/ABC-126-hanging-corpus-pair-starts-in-check.md
  - 20261010T105616Z-software-engineer-decision-abc126-four-fens-chosen-assertion-carve-out-7c41a2e9
  - 20261010T105616Z-software-engineer-observation-abc126-gates-red-first-margins-puzzle-lane-b3d870e5
  - 20261010T110929Z-qe-e2e-observation-abc126-readings-oracle-deep-lanes-mutants-f7db18ad
supersedes:
---

# `ABC-126` QE verdict: **PASS_WITH_GAPS** at `efcda60d`. `A1`–`A7` all MET, each re-proven with QE's own instruments. Four advisory gaps, none blocking

Hand-authored and unsealed. This is a `decision`, not a `finding`: this install has no `§14-gate`
verdict. Diff under review: `d6aceeb5..efcda60d` (code `d10ffeff`). Owner's option B: QE ran
`PUZZLE_DEEP=1` (three processes) and `PUZZLE_DEEP=weakened` itself. Readings and raw files are in
observation `…f7db18ad` and `../probe/`.

## Per criterion

| | QE's reading | result |
|---|---|---|
| `A1` | The quiescence row asserts `isInCheck === false` per row, 24/24, before legality. **Red first:** M1 is red on the pair row only and M2 on the mirror only, so the shipped tree is red on exactly those 2 (QE's oracle scan of the base: in check = exactly those 2). M4 shows the assertion catches any in-check row | **MET** |
| `A2` | Still 24 rows (asserted `toBe(24)` in the puzzle suite). Both replacements: not in check, capture legal, **8 non-king moves** of 12. `ADR-0033` `accepted` under the ticket's `rules-only.mts` and under QE's own independent rules | **MET** |
| `A3` | Quiescence picks `f1g1`/`f8g8` at d1 and `a1b1`/`a8b8` at d3. The bare leaf picks `a1a5`/`a8a4` at d1. Depth-3 margin **185 / 185 cp**; the oracle has the capture losing 2 pawns. Default lane green; `SEARCH_DEEP=1` quiescence 37 passed, 0/24 at d3 | **MET** |
| `A4` | `PUZZLE_DEEP=1` ×3: total 62 = baseline 62, solved 58 ≥ 58, no `NEWLY-MISSED` (or any `NEWLY`) line, rows `cmp`-identical. The baseline is not touched by any branch commit. The provenance comment above each pair row names `ABC-126`, the fault (`Ba5+`/`Ba4+`) and the 185 cp margin | **MET** |
| `A5` | numstat lists exactly the three named files (12/4, 1/4, 4/2), so zero production lines. Lint, typecheck and build exit 0; `npm test` 51 / 1581; skip 0; integrity and lane inventory `No findings.` | **MET** |
| `A6` | The `kind` exemption and its three-line comment are gone, and all **62** rows are asserted not in check. Red first: M1/M2 are red in this row on exactly the pair rows. M5 (carve-out restored) goes green over the shipped pair, so the removal is load-bearing | **MET** |
| `A7` | **Red first:** `rules-only.mts` prints `pawn on rank 8 (h8)` / `side not to move (black) is in check`, and `accepted` on the replacements. **The oracle's answer, not the engine's:** QE's no-project-code oracle gives keys `[a1e1]` +4 and `[d4c5, d4g7]` +4, equal to `accept` and `source` under both oracle variants; the deep `A2` row is green ×3 and kills M8/M10. **Names byte-identical** (name-list hash equal); `win-material` 16 = 16. **Solved:** `a1e1` d7 and `d4c5` d6 ×3, baseline unmoved. A provenance comment sits above each row | **MET** |

**Option B:** `PUZZLE_DEEP=1` is green ×3 (58/62, no `NEWLY` line). `PUZZLE_DEEP=weakened` exits 1
(19/62), as designed. No trigger-list file is touched, and the lane ran because `A4` requires it.

## Gap register (advisory; none blocks)

- **`QE-126-a`. Nothing in the tree yet guards the `A7` defect class.** Reverting both `A7` rows to
  their shipped FENs (M7) stays green on the default lane and on the deep `A2` oracle row. Only
  `ADR-0033`'s rules catch it, and the ticket fences those out; `ABC-010`'s `parseFen` will catch it
  when it lands. **Owner: `ABC-010`.** Nothing to do here.
- **`QE-126-b`. A `source` `+N` is never checked against the oracle's gain.** M9 (`+4` → `+6`)
  survives; the deep row asserts only `gain > 0`. `A7` makes the gain the oracle's, so today that
  rests on readings: QE's oracle and the Engineer's both give +4 / +4. This is pre-existing
  (`ABC-127` `A2`'s shape). **Route: BA/PM**, as a candidate one-line tightening of that row.
- **`QE-126-c`. Per-row `A3` discrimination is a reading, not an assertion.** The quiescence d1 row
  tolerates ⌊24/20⌋ = 1 losing row, so one regressed re-found row would stay green there. The deep
  gating run would still go red, because solved would fall below 58. This is `ABC-079` by design.
  **No route; recorded.**
- **`QE-126-d`. Cosmetic: the puzzle-suite row title still says "no added row starts in check"**, but
  the row now covers all 62. The Engineer kept the title on purpose, because reports key on it.
  **Route: BA/PM, if anyone wants it renamed.**

**Merge-time note (Orchestrator's):** the wave tip `246ddfc7` has also appended 8 rows to the end of
`plans/traceability.md` since `d6aceeb5`. QE's trace row adds to that append-append overlap. There is
no `src/` drift.

## Board

QE's exit from `In Review`: zero production lines, so UAT is waived under the standing rule and
Security/NFR is not triggered (static test data). The move itself is the Orchestrator's to record;
QE does not touch `plans/board.md`.
