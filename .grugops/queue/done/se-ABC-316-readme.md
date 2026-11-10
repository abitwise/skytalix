---
subtask: se-ABC-316-readme
role: software-engineer
ticket: ABC-316 (acceptance A4)
ref: .grugops/context/se-ABC-316-readme/
branch: grugops/ABC-316-readme from main 207c8172
---

# ABC-316 A4: README Levels strengths, CHANGELOG Unreleased entry

## Do
- In README `## Levels`, replace the "Projected strength" row with "Strength": L1 measured, L2 a placeholder, L3 and L4 newly projected, L5 to L7 projected.
- Rewrite the projection paragraph per orchestrator decisions `…20c41f8c` (A4) and `…bce17f44`, and QE verdict `…f44a427d`.
- Add a CHANGELOG `## [Unreleased]` entry. Make no other change.

## Result

**Done on `grugops/ABC-316-readme`. Not merged and not pushed.**

- README `## Levels`:
  - Strength row: `1 500 ± 53, measured` | `L2-PENDING` | `~1850–1925, projected` | `~2000–2075, projected` | the existing L5 to L7 ranges, each `, projected`.
  - The projection paragraph is replaced by three short paragraphs: the measured conditions (with the `L2-ELO-PENDING` placeholder), the projection method, and the scale caveat.
  - The intro line "a projected strength" now reads "a strength, measured for levels 1 and 2 and projected for the rest". This is outside the brief's letter, but without it the intro would contradict the row.
  - `## Strength` and the rest of the README are unchanged.
- CHANGELOG: there was no Unreleased heading, so I added `## [Unreleased]` / `### Changed` above `## [1.0.0]`, with one line.
- Gates, each run alone under the host lock:
  - The art cmp (`sed -n '2,/^```$/p' README.md | sed '$d' | cmp - assets/readme-art.txt`) exits 0.
  - `npm run lint` exits 0 (150 files).
  - No test in `src/` or `tools/` reads README.md or CHANGELOG.md, so there was no test to run.
- The orchestrator still has to fill in `L2-PENDING` and `L2-ELO-PENDING` before merge.
