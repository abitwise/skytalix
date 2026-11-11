
# qe-ABC-317 verdict for ABC-317: **PASS_WITH_GAPS, no blocking gap.** B1–B4 are met. B3: every measured README figure traces to QE's sealed verdicts, L5–L7 follow the ruling `…152bb16f` and are marked projected, ABC-316's five gaps are closed, `## Strength` is unchanged and the art cmp passes. B4: lint, typecheck, unit (one worker), build and the harness suite pass on `41afdc90`, each alone under the host lock. The `src/` diff against `main` is empty, so the zero-production-lines UAT waiver applies

QE/E2E, task `qe-ABC-317`, stage C. The checks and commands are in observation `20261111T044946Z-qe-e2e-observation-8586e284`, sealed just before this note. This verdict signs UAT per the 2026-10-22 ruling; with the waiver it is not needed for that.

## Acceptance (the cut note `…7ffdb8a5`)
- **B1 MET**, stage A (`…aeaf90e3`, PREREG `…e6cf1088`).
- **B2 MET**: L3 1 909.1 ± 47.9 (`…181f12c9`), L4 2 094.3 ± 47.9 (`…75bd7076`).
- **B3 MET.**
  - L1–L4 are labelled measured: `1499 ± 53`, `1678 ± 49`, `1909 ± 48`, `2094 ± 48`. Each traces to its sealed verdict, also at full precision from W / D / L.
  - The prose states the conditions: 200 games, `UCI_Elo` 1320, 1720, 1890 and 2040, the level's own time on both sides, blunders on.
  - L5–L7 are labelled projected. They follow the ruling's method (anchor 2 144–2 164 at 1 s, +50 to +75 per doubling), and the prose states that method. The one exception is L7's low edge, in gap 1.
  - The prose says Stockfish had each level's time, and that its effect on the scale was not measured, as the ruling asks. The scale caveat is kept.
  - ABC-316's five gaps are closed: the hedge is restored, there is no padding beyond rounding, L1 shows 1499, there is no thousands separator, and `[Unreleased]` has a link.
  - `## Strength` and everything outside `## Levels` are unchanged, and the art cmp exits 0.
  - The diff against `main` is limited to README, CHANGELOG and records under `.grugops/`.
- **B4 MET.** All six checks exit 0 (2 740 / 2 740 unit, 52 / 52 harness, 0 skipped). `src/` is tree `21f3b304` on both sides.

## Gaps (none blocking; README defects are reported, not fixed)
1. **L7's low edge is not rounded outward.** The method gives 2 144 + 50 × log2(30) = 2 389.3. The ruling says "rounded outward to tens", which gives 2 380, but the ruling's own line and the README both write 2 390. The SE note `…b1ad14b2` says each edge "rounds outward to the table range", which is not true for this edge. The README itself does not claim outward rounding, and the cell reads `~`. The 0.7 difference is far inside L4's ± 48. The source is the ruling, so a fix is the Orchestrator's call: either `~2380–2540`, or the ruling restated as rounding to the nearest ten.
2. **The blunder cost is used but not stated.** The prose says "level 4's figure with its blunder cost added back, about 2144 to 2164". It no longer gives the cost (10 to 14 Elo for each percentage point, so 50 to 70 at L4). A reader cannot rebuild 2144–2164 from 2094. The ruling removed the blunder-cost sentence on purpose, because no projected level blunders. The gap is that the anchor still depends on it.
3. **The "+75" comparison is loose.**
   - The prose compares "+50 to +75 … is less than the roughly +75 … seen between 0.1 s and 1 s". The range's top equals the number it is said to be less than. The ruling's measured figure is 73–79.
   - The prose does not name the 0.1 s point. It is the Strength section's 1902.5, level 5 without blunders at 100 ms. A reader could take it to be L1's 1499, which also runs at 0.1 s.
   - This is wording only. No figure changes.

## Not covered
- The Stockfish time-scale effect across 0.1, 0.18, 0.33 and 1 s (UNKNOWN - verify). The README now says it is unmeasured.
- The projections' own uncertainty. L5–L7 rest on one 1 s anchor (± 48) and an assumed gain per doubling, and the ranges do not carry that error. They are marked projected. The ruling's confidence is medium.
- Whether `v1.0.0` exists on the remote, for the compare link (UNKNOWN - verify). It exists locally, and the existing `[1.0.0]` link makes the same assumption. Rendered Markdown was not checked.
- Levels 5–7 measured, and the 40/15 claim: these are later tickets.

## Fences held
- No games.
- No `src/`, README, CHANGELOG, ADR, EPIC or board edit.
- No push, merge, amend, force or rebase.
