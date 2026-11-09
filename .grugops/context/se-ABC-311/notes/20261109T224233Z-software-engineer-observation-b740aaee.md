---
id: 20261109T224233Z-software-engineer-observation-b740aaee
kind: observation
by: software-engineer
at: 2026-11-09T22:42:33Z
verified_by: 
confidence: high: lint, build and art cmp run and exit 0 after the last edit; table times checked against src/levels.ts
refs:
  - se-ABC-311
  - ABC-311
  - README.md
  - src/levels.ts
  - grugops/ABC-311
  - orch-2026-10-30a/20261109T224101Z-orchestrator-decision-03f8f6f9
supersedes: 
seal: sha256:6dd7b06367feca6fd50a4185cf9daaa27e1c26a16771d31321d43bb37a94f281
---

se-ABC-311 on branch grugops/ABC-311 from main 96107905. Requirement: orch-2026-10-30a/20261109T224101Z-orchestrator-decision-03f8f6f9 (A1-A5). One file changed: README.md (+8 -1). No src/.

What changed:
- A1. § Levels table gains a "Projected strength" row, ranges copied as the note gives them (ASCII spaces, en dashes): ~1 000–1 300, ~1 300–1 550, ~1 550–1 750, ~1 800–1 950, ~2 150–2 250, ~2 170–2 270, ~2 300–2 450 for levels 1-7.
- A2. Under the table, plain sentences: the figures are projections, not measurements; drawn from the one measured figure in § Strength (1902.5 ± 49.1 at 100 ms a move, no blunders) and two assumptions (about +50 to +60 per doubling of time, less at longer times; an unmeasured penalty for the levels that blunder); on the § Strength scale only, not FIDE or online ratings. The README's own number style "1902.5" is kept in prose.
- A3. § Strength unchanged except its last sentence now reads "Its strength at 4 s was not measured; § Levels gives a projection only." It still says level 5 at 4 s was not measured.
- A4. Time row unchanged; checked against src/levels.ts LEVELS budgetMs 100, 180, 330, 1000, 4000, 5000, 30000 ms, shown as 0.1, 0.2, 0.3, 1, 4, 5, 30 s under the existing "times are approximate" line.

Checks, each run under flock <scratch>/<home>/<repo>/host-test.lock, after the last README edit:
- art cmp: sed -n '2,/^```$/p' README.md | sed '$d' | cmp - assets/readme-art.txt -> exit 0
- npm run lint (biome check .): exit 0, 148 files, no fixes
- npm run build (tsc -p tsconfig.build.json): exit 0

Not checked: how the 8-column table row renders on GitHub or narrow terminals (not viewed); the projected ranges themselves are the Orchestrator's, not re-derived here.
