---
id: 20261025T045829Z-architect-design-decision-e04234f4
kind: decision
by: architect-design
at: 2026-10-25T04:58:29Z
verified_by: 
confidence: high on the rules, the moved set and the routes; the G6 MET prediction is a frozen-clock count, UNKNOWN - verify until QE reads it
refs:
  - ABC-215
  - EPIC-008
  - ABC-214
  - ABC-205
  - ABC-207
  - ABC-216
  - ADR-0048
  - ADR-0031
  - ADR-0028
  - ADR-0026
  - ADR-0034
  - ADR-0036
  - NFR-005
  - NFR-008
  - G1
  - G6
  - S3
  - LIC-PUB-1
  - OQ-214-4
  - QE-205-c
  - plans/tickets/ABC-215-the-evaluation-values-are-our-own-and-the-cc-by-sa-carve-out-leaves-notice.md
  - arch-rule-ABC-205-g6/20261025T042840Z-architect-design-decision-912bcb0d
  - arch-rule-ABC-205-g6/20261025T042840Z-architect-design-observation-00c6a18d
  - arch-rule-ABC-205-g6/20261025T043100Z-orchestrator-decision-154f2ced
  - qe-ABC-205/20261025T041540Z-qe-e2e-observation-35de132c
  - grugops/arch-design-ABC-215
  - 15f42dd2
  - d5690c5c
supersedes: 
seal: sha256:fec33448dcd107cd33c174ec19f9a4b0c325c05169ef3d6fa7f92054e261ddb1
---

# Architect/Design: ABC-215 designed. Seven stated rules (candidate `c2`); relations all green; 16 pins move by existing rules; G6 predicted MET (position-6 d8 −6.65 %); one L build, no split; no ADR, no owner word; one BA/PM scope line (README.md:84-86)

Task `arch-design-ABC-215`, records plus probes, at `main` `15f42dd2`, branch `grugops/arch-design-ABC-215`. Full text:
`plans/tickets/ABC-215-…md` § Design ruling. Probes: this task's observation note. Inputs: `arch-rule-ABC-205-g6`
`…912bcb0d` / `…00c6a18d`, Orchestrator `…154f2ced`, `ADR-0031`, `ADR-0048` decision 7, `NOTICE`, `src/evaluate.ts`.

## The rules (white's side; R = rank from own side 1–8; e(f) = file steps from the edge 0–3; ring = min(e(f), min(R−1, 8−R)))
- `PIECE_VALUE` = `[0, 100, 325, 325, 500, 900, 0]`: the classical 1/3/3/5/9 pawn scale × 100 (the scale
  `src/status-panel.ts` shows), plus 25 on each minor so a minor outweighs three pawns. King 0.
- `PAWN_TABLE` = `2 × e(f) × (R − 2)`, 0 on ranks 1/8 (0 … 30). Shelter is left to `ABC-083` king safety.
- `KNIGHT_TABLE` = `10 × n − 50`, n = knight moves on an empty board (−30 … 30).
- `BISHOP_TABLE` = `5 × (n − 9)`, n = diagonal squares on an empty board (= `10 × ring − 10`; −10 … 20).
- `ROOK_TABLE` = 20 on R = 7, else 0. Files are left to mobility.
- `QUEEN_TABLE` = `5 × ring − 5` (−5 … 10).
- `KING_TABLE` = `max(−50, −10 × d − 10 × (R − 1))`, d = file distance to the nearer of b and g (−50 … 0). Untapered.
- The first set `c1` reddened two relation premises (`ABC-083` `A2` equal-material g6/g2 by 5 > 0; `A4` rook d4 table
  ≠ 0). Only those two rules changed to make `c2`. The counts were read after `c2` was fixed. Nothing was chosen by
  a count.

## Form of `A2` and Scope 3
- The seven arrays stay 8×8 literals under a rule comment. One TEST-ONLY export names them (the `evaluateWithoutMobility`
  precedent). The rebuild rows go in `src/evaluate.test.ts`, with an independent rule implementation, all 64 entries
  and every `pieceType` index, the export's keys equal to `A1`'s seven, and at least one entry differing per array. No new file.
  It imports `./evaluate.ts` only.
- Header `:16`–`:22` becomes one line ("this project's own, each made by the rule written above it"). `NOTICE` lines
  7–15 are deleted. The result is byte-equal to `ABC-214` Scope 5's common part, and line 5 stays (the kit files are MIT).
- No ADR: `ADR-0048` decision 7 rules the removal. After the merge, Architect/Design adds a dated status line on
  `ADR-0048`. The `LIC-PUB-1` and `OQ-214-4` dispositions are Security/NFR's, and `LIC-PUB-1` belongs to the owner.

## Moved set and gates (deterministic)
- 13 default-lane reds in 4 files plus 3 deep pins in `quiescence.test.ts`: **16 rows in 5 files, 0 relations, 0 levels.**
  Routes: re-pin (9 value rows), the `ADR-0028` d2 re-find (`engine` `A3` ×2, `ordering` Scope tie, `pvs-lmr` `A4` ×2), and
  the oracle rule (`ORACLE_AT_DEPTH_3`: re-run on `c2`, equal on both boards; kiwipete 70 → 8 / e2a6, position-6 84 → 85 / c3d5).
- Multiplier cells all under level (position-6 d1 9.19 → 8.96x of 10). d5 drift max 63 cp (base 51; row 75), 0 mate flips.
  `G1` 54/58 = baseline.

## G6 pre-check (a count, not a reading)
- Position-6 d8: base 1 451 759 → `c2` 1 355 149 (−6.65 %), below base's lowest 3-s run (1 444 505) by 6.2 %. Kiwipete
  d7 610 k ≪ a run, and d8 1.74 M is out of reach for both. **Predicted `G6` MET** while the throughput cost is under
  about 6 %. The eval code is unchanged, so that cost is `UNKNOWN - verify` but expected near 0.

## Split: no
- One `L` build. The page's split (`PIECE_VALUE` first) is **predicted to miss `G6` on its first half** (`pv` +2.15 % at
  position-6 d8). It would add a second D (6–12 h), and the carve-out could not end until both halves merged.

## Owed
- **BA/PM (records, before Ready for Dev):** `README.md:84-86` says the evaluation values are CC BY-SA 3.0, and that
  is false after the merge. `A8` does not allow `README.md`. Add it to `A8`, limited to that sentence, or cut a
  twin follow-up.
- Owner: nothing. `QE-205-c` stays open and does not block.
- Orchestrator: merge the records, then In Design → Ready for Dev after BA/PM's line.
