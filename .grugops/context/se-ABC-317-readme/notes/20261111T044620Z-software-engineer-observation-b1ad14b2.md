---
id: 20261111T044620Z-software-engineer-observation-b1ad14b2
kind: observation
by: software-engineer
at: 2026-11-11T04:46:20Z
verified_by: 
confidence: high: both gates were run after the last edit
refs:
  - se-ABC-317-readme
  - ABC-317
  - B3
  - grugops/ABC-317-readme
  - README.md
  - CHANGELOG.md
  - orch-2026-10-30a/20261111T044438Z-orchestrator-decision-152bb16f
  - orch-2026-10-30a/20261110T203458Z-orchestrator-decision-7ffdb8a5
  - qe-ABC-317/20261110T230239Z-qe-e2e-decision-181f12c9
  - qe-ABC-317/20261111T044345Z-qe-e2e-decision-75bd7076
  - qe-ABC-316/20261110T190716Z-qe-e2e-decision-a55b90ec
supersedes: 
seal: sha256:7ca65d97db4248b4a6a5e921ecc51ebb1215ceae0f04f3618319f6abb605ef99
---

# se-ABC-317-readme: README Levels L3 and L4 measured, L5 to L7 re-projected, CHANGELOG Unreleased

- **Strength row:** L1 `1499 ± 53, measured`, L2 `1678 ± 49, measured`, L3 `1909 ± 48, measured`, L4 `2094 ± 48, measured`, L5 `~2240–2320, projected`, L6 `~2260–2340, projected`, L7 `~2390–2540, projected`. Values are from the ruling …152bb16f. No thousands separator anywhere written.
- **Intro line:** "measured for levels 1 to 4 and projected for the rest".
- **Prose:** measured conditions for L1 to L4 (200 games each, `UCI_Elo` 1320, 1720, 1890 and 2040, the level's own time on both sides, blunders on). The L5 to L7 method: L4 with its blunder cost added back, about 2144 to 2164 at 1 s, then +50 to +75 per doubling beyond 1 s, less than the roughly +75 seen from 0.1 s to 1 s because the gain falls at longer times. Stockfish had each level's time, and that effect is unmeasured. The scale caveat is kept. The blunder-cost sentence and the old 1902.5 projection sentence are removed. "The times are approximate" and `## Strength` are unchanged.
- **Arithmetic check:** L5 at 4 s is 2 doublings: 2244 to 2314. L6 at 5 s is 2.32: 2260 to 2338. L7 at 30 s is 4.91: 2389 to 2532. Each rounds outward to the table range.
- **CHANGELOG:** the Unreleased / Changed line now says measured strengths for levels 1 to 4 and revised projections for levels 5 to 7. Added `[Unreleased]: https://github.com/abitwise/skytalix/compare/v1.0.0...HEAD` above the `[1.0.0]` definition.
- **Gates, each alone under the host lock:** the art cmp exits 0; `npm run lint` exits 0 (biome, 150 files). The worktree has no `node_modules`, and biome resolved and ran anyway.
- This closes ABC-316 gaps 1 (hedge restored), 2 (no padding beyond outward rounding to tens), 3 (L1 shows 1499), 4 (no space separator) and 5 (Unreleased link).

Not checked: the rendered Markdown on GitHub, and whether the v1.0.0 tag exists on the remote for the compare link (the [1.0.0] link already assumes it).
