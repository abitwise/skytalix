---
subtask: se-ABC-317-readme
role: software-engineer
ticket: ABC-317 (acceptance B3)
ref: .grugops/context/se-ABC-317-readme/
branch: grugops/ABC-317-readme from grugops/qe-ABC-317 6006e696
---

# ABC-317 B3: README Levels with L3 and L4 measured, L5 to L7 re-projected; CHANGELOG Unreleased

## Do
- README `## Levels`: the Strength row, intro line and prose per the ruling `…152bb16f`. Close ABC-316's five gaps (`…a55b90ec`).
- CHANGELOG: update the Unreleased / Changed line and add an `[Unreleased]` link definition. Make no other change.

## Result

**Done on `grugops/ABC-317-readme`. Not merged and not pushed.**

- Strength row: L1 1499 ± 53, L2 1678 ± 49, L3 1909 ± 48, L4 2094 ± 48, all measured. L5 ~2240–2320, L6 ~2260–2340, L7 ~2390–2540, all projected.
- Intro line now reads "measured for levels 1 to 4 and projected for the rest".
- Prose: the measured conditions for levels 1 to 4; the new projection method for levels 5 to 7, with the "less at longer times" reason; the unmeasured effect of Stockfish's time; the scale caveat. The old blunder-cost and 1902.5 projection sentences are gone.
- `## Strength` and the rest of the README are unchanged.
- CHANGELOG: the line now covers levels 1 to 4 measured and 5 to 7 re-projected. Added `[Unreleased]: https://github.com/abitwise/skytalix/compare/v1.0.0...HEAD`.
- Gates, each run alone under the host lock: the art cmp exits 0, and `npm run lint` exits 0 (150 files).
- Note: `20261111T044620Z-software-engineer-observation-b1ad14b2`.
