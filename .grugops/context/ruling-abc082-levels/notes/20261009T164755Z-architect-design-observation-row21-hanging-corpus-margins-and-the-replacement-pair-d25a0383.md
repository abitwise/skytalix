---
id: 20261009T164755Z-architect-design-observation-row21-hanging-corpus-margins-and-the-replacement-pair-d25a0383
kind: observation
by: architect-design
at: 2026-10-09T16:47:55Z
verified_by:
confidence: high
refs:
  - ABC-082
  - ABC-079
  - ADR-0028
  - src/quiescence.test.ts
  - .grugops/context/ruling-abc082-levels/probe/hanging-replace.ts
  - .grugops/context/ruling-abc082-levels/probe/hanging-base.jsonl
  - .grugops/context/ruling-abc082-levels/probe/hanging-branch.jsonl
  - .grugops/context/ticket-to-pr-ABC-082/notes/20261009T163130Z-software-engineer-observation-abc082-stop-two-r-levels-red-on-deep-lanes-9bdc69b3.md
supersedes:
---

# Row 21: every `HANGING_CORPUS` row's depth-3 margin on base and branch. The red pair recaptures into a dead draw at the thinnest base margin (50 cp). Six one-pawn replacements measured

Hand-authored, no `seal` (`AGENTS.md`: no `context-io.ts` on this install).

**Method.** `node probe/hanging-replace.ts <tree>`, plain node, on `git archive` copies of base
`5ebe1d8` and branch `bef7d43` (only `src/`). Run 2026-10-09T16:41:30Z, load 2.3, 0.25 s each.
For each row the probe reads:
- `search()` at depth 1 and 3;
- the bare leaf (`searchWithoutQuiescence`) at depth 1, which is A1's own mutant;
- the depth-3 value of the labelled losing capture (make it, then negate `search(p, 2)`);
- the best other root move at depth 3. **Margin** = best other − losing;
- whether a recapture on the target square reaches `insufficient-material`.

This does not re-derive the Engineer's 2/24. It reads why the 2 are the 2.

## The corpus (12 rows; each mirror reads the same)

| row | dead-draw recapture | base margin | branch margin | branch d3 pick |
|---|---|---:|---:|---|
| Q takes a pawn a rook defends | no | 775 | 765 | a1a8 |
| R takes a pawn the king defends | **yes** | 395 | 400 | e1f1 |
| B takes a pawn a pawn defends | no | 210 | 180 | e1f2 |
| N takes a pawn a pawn defends | no | 210 | 160 | e1e2 |
| Q takes a knight a rook defends | no | 595 | 595 | a1a6 |
| R takes a knight a pawn defends | no | 180 | 205 | f1g2 |
| Q takes a rook the king defends | **yes** | 390 | 390 | a1f6 |
| Q takes a bishop a knight defends | **yes** | 570 | 570 | a1b1 |
| R takes a bishop a pawn defends | no | 175 | 185 | e1f1 |
| **R takes a pawn a bishop defends** | **yes** | **50** | **−40** | **b1b2** |
| Q takes a pawn a knight defends | **yes** | 745 | 655 | a1a4 |
| B takes a pawn a rook defends | no | 210 | 185 | b1a2 |

- The red pair is the only row where a dead-draw recapture meets a near-level material balance.
  It had the corpus's thinnest margin before `ABC-082` existed.
- Its static evaluation goes from +30 on base to −60 on the branch: R 500 against B + P, plus
  Black's b2 passer on its own 7th rank. Its depth-3 alternatives go from +50 to −40. The capture
  is an exact 0, so it wins.
- The depth-1 bare leaf plays the losing capture on every row, on both trees, so A1's
  differential is intact.

**Side finding, pre-existing since `ABC-079`, not caused by `ABC-082`.** On both trees, the
"R takes a bishop a pawn defends" pair has the side to move **in check**: `4k3/8/1p6/b7/8/8/8/R3K3
w` has Ba5+ on e1, and the mirror has Ba4+ on e8. The corpus header says every row "must NOT be in
check", and the row titled "none of them in check" asserts legality only. The row is still a valid
test, because the losing capture also answers the check, so it is on the menu. Flagged, not fixed
(coding rule 12). Routing is in decision `…33e5e0a3`.

## Six one-pawn candidates for the red pair (all measured; none in check; capture legal)

| candidate | dead draw | base: d1 / bare d1 / d3 / margin | branch: d1 / bare d1 / d3 / margin |
|---|---|---|---|
| C1 + white h2 | no | e1f1 / b1b2 / e1f1 / 370 | e1f1 / b1b2 / e1f1 / 280 |
| C1 mirror + black h7 | no | e8f8 / b8b7 / e8f8 / 370 | h7h5 / b8b7 / e8f8 / 280 |
| **C2 + black g7** | no | e1f1 / b1b2 / e1f1 / **370** | e1f1 / b1b2 / e1f1 / **280** |
| **C2 mirror + white g2** | no | e8f8 / b8b7 / e8f8 / **370** | e8f8 / b8b7 / e8f8 / **280** |
| C3 + white g2 | no | e1f1 / b1b2 / e1f1 / 370 | e1f1 / b1b2 / e1f1 / 280 |
| C3 mirror + black g7 | no | e8f8 / b8b7 / e8f8 / 370 | e8f8 / b8b7 / e8f8 / 280 |

All three pairs read the same at depth 3. The choice between them is chess, not numbers, and is
made in ruling `…f0115510`:
- **C1 and C3** add a pawn for the capturing side. After the recapture the line is K+P v K+B. The
  bishop can still take that pawn deeper in the tree, which leads back to a dead draw.
- **C2** adds a pawn for the defending side. After the recapture the line is K v K+B+P. The g-pawn
  queens on g1 (g8 in the mirror), a dark square, and the a3 bishop is dark-squared (a6 in the
  mirror, light-squared, with the pawn queening on a light square). So it is a won ending for the
  defender at any depth, not a draw the search can later find.
