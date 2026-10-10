---
id: 20261010T120729Z-software-engineer-observation-abc087-rehop-option-a-n8-lane-met-69fa98d1
kind: observation
by: software-engineer
at: 2026-10-10T12:07:29Z
verified_by:
confidence: high
refs:
  - ABC-087
  - N8-LANE
  - ADR-0035
  - src/levels.test.ts
  - .grugops/context/rule-abc087-cost/notes/20261010T120017Z-ba-pm-decision-abc087-n8lane-option-a-a4-frequency-reworded-085-risk-named-52f042aa.md
  - 20261010T115230Z-software-engineer-observation-abc087-gates-a1-a10-readings-n8-lane-not-met-25962b19
  - 20261010T115230Z-software-engineer-claim-abc087-agents-md-line-nfr004-wording-a4-bias-53ebd6d1
supersedes:
  - 20261010T115230Z-software-engineer-observation-abc087-gates-a1-a10-readings-n8-lane-not-met-25962b19
---

# `ABC-087` re-hop (option (a)) at `f61ad6b1`: **`N8-LANE` MET at +0.535 s CPU (0.50-0.62), twin +0.31 % at 4/8, R 0.030 s**; gate green 52 / 1600; `ENGINE_DEEP=1` 25 passed (19 default)

This note is hand-authored and unsealed. It supersedes `…25962b19` for the gate, the lane split and
the cost reading. That note's criterion readings stand, apart from `A4`'s frequency wording below.

## What changed (`src/levels.test.ts` only; `src/levels.ts` untouched)

These follow BA/PM's ruling `…52f042aa` exactly:
1. The default-lane `A4` ≥ 200-move `ENDGAMES` run moved unchanged into the `RUN_DEEP` block, tagged
   `[deep]`. Its body is byte-identical, including the `"default lane, ENDGAMES"` log label. That
   label is now stale in its wording, and I kept it because the ruling said unchanged.
2. The default lane keeps the 19 named tests.
3. Test note 7's guard: `assertPerMove` (extracted from `assertA4`) runs on each seed's choices inside
   `A9`'s existing `it`. It adds no new search and no new test. It checks that each move is legal,
   that the list is in `legalMoves` order, never the worst, the strict second-best, and that a
   no-candidate move has fewer than three distinct scores.
4. `assertA4`'s frequency is now (blunder + no-candidate) ÷ moves, and it logs blunders ÷ moves beside
   it. The explicit "< 3 distinct scores" check on no-candidate moves is added in `assertPerMove`.
   The old `between` check is kept.

## Readings (Apple M3, Node v26.11.0, vitest 3.2.7; raw files in `../probe/`)

- **Gate** at `f61ad6b1` (`raw-gates-f61ad6b1.log`):
  - lint, typecheck and build: exit 0;
  - `npm test`: **52 files / 1600 passed / 0 skipped**, 7.61 s real at load1 3.75;
  - skip count 0; integrity `No findings.`;
  - lane inventory 52 = 52.
- **`ENGINE_DEEP=1 npx vitest run src/levels.test.ts`:** exit 0, **25 passed (19 default)**, 200.84 s
  real at load1 6.90 → 3.67 (`raw-deep-rehop-f61ad6b1.log`).
  - `A4` on `ENDGAMES`: (80 + 1)/204 = **39.7 %**, played 39.2 %.
  - `A4` on perft + puzzles: (97 + 0)/246 = **39.4 %**, played 39.4 %. Both match BA/PM's expectation.
  - `A2`: unchanged.
  - `A5`: 30/30, max **4,590 ms** (previously 4,527-4,536).
  - `A3`: 35/62 vs 58/62.
- **`N8-LANE`** (`ADR-0035` narrow set; same harness: placeholder base, `diff -r` twin, n = 8, k = 2;
  `runs-rehop1.tsv`):

  | treatment median | sign | interval | twin | twin sign | R | load1 | state |
  |---:|---:|---|---:|---:|---:|---|---|
  | **+0.535 s** | 8/8 | **0.50-0.62** | +0.31 % | 4/8 | **0.030 s** | 6.42-6.85 | **MET**: admissible, R ≤ 0.65 s, median ≤ 0.65 s |

  This was the first run, so no re-run was needed. Earlier readings of the build hop (+0.825 s,
  NOT MET) stay in `cost-readings.txt`. The verdict rests on `ADR-0035`, which is `proposed`
  (BA/PM `…52f042aa` § 1).
