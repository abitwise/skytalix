---
id: 20261110T190047Z-software-engineer-observation-04caeccd
kind: observation
by: software-engineer
at: 2026-11-10T19:00:47Z
verified_by: 
confidence: high: both gates were run after the last edit
refs:
  - se-ABC-316-readme
  - ABC-316
  - A4
  - grugops/ABC-316-readme
  - README.md
  - CHANGELOG.md
  - orch-2026-10-30a/20261110T153717Z-orchestrator-decision-20c41f8c
  - orch-2026-10-30a/20261110T181122Z-orchestrator-decision-bce17f44
  - qe-ABC-316/20261110T172339Z-qe-e2e-decision-f44a427d
supersedes: 
seal: sha256:08ae70f1fa2a66b042b73784e9726150df810c41bafdf8c81ce662c806a14c99
---

# se-ABC-316-readme: README Levels strengths and the CHANGELOG Unreleased entry

- **Levels row "Strength":** L1 is `1 500 ± 53, measured` (from 1 499.5 ± 53.4). L2 is the placeholder `L2-PENDING`. L3 is `~1850–1925, projected` and L4 is `~2000–2075, projected`. L5 to L7 keep their ranges, each marked projected.
- **Prose:** what was measured (200 games each against Stockfish 19 with UCI_LimitStrength; L1 at UCI_Elo 1320, L2 at the placeholder `L2-ELO-PENDING`; the level's own time on both sides; blunders on); the projection method (1902.5 at 100 ms, +50 to +60 per doubling, minus 10 to 12 Elo per point of blunder rate for L3 and L4); and the scale caveat.
- **Intro line:** "a projected strength" became "a strength, measured for levels 1 and 2 and projected for the rest". This is outside the brief's letter, but without it the intro would contradict the row.
- **CHANGELOG:** a new `## [Unreleased]` / `### Changed` heading with one line.
- **Gates, each run alone under the host lock:** the art cmp exits 0; `npm run lint` exits 0 (150 files). No test reads README.md or CHANGELOG.md.

Not checked: the two placeholders must be filled in before merge. The L2 figure and L2's E′ wait on the step.
