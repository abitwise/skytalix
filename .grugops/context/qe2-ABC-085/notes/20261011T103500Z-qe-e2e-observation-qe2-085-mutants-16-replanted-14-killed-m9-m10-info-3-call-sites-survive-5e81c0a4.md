---
id: 20261011T103500Z-qe-e2e-observation-qe2-085-mutants-16-replanted-14-killed-m9-m10-info-3-call-sites-survive-5e81c0a4
kind: observation
by: qe-e2e
at: 2026-10-11T10:35:00Z
verified_by:
confidence: high
refs:
  - ABC-085
  - QE-085-a
  - QE-085-b
  - QE-085-c
  - src/ladder.test.ts
  - sha dacbf42a (fix f28d91ad)
  - .grugops/context/qe2-ABC-085/probe/mutants.mjs
  - .grugops/context/qe2-ABC-085/probe/mutants.out.txt
  - .grugops/context/qe-ABC-085/notes/20261011T101214Z-qe-e2e-observation-abc085-mutants-4-replanted-killed-13-added-10-survive-d4a90f16.md
  - .grugops/context/fix-ABC-085/notes/20261011T120000Z-software-engineer-observation-fix085-mutants-m5-m6-m7-m7b-m11-m12-m13-m14-killed-default-lane-c3f28d91.md
supersedes:
---

# QE2 `ABC-085` mutants: all 16 re-planted by QE at `dacbf42a`. 14 killed (M7b killed too), and M9/M10 survive as INFO. 3 new call-site plants survive the default lane

Hand-authored and unsealed. Driver: `../probe/mutants.mjs`, QE's own. Every plant was re-targeted by QE against the refactored file. None
was copied from the SE's driver. Each plant is an exact string, asserted to match exactly once, in a temp copy `src/ladder.qe2mut.test.ts`.
The copy runs alone in the default lane (`LADDER_DEEP` deleted from env) and is deleted afterwards. The unmutated CONTROL copy is green,
13/13. **No mutant was run in a `LADDER_DEEP` lane** (one short-mode run per hop). So "deep lane" below is read from the code.

**Sites the refactor moved, re-found by QE:** M5 `createLevel(…)` → `make(…)` in `makeSide`; M6 `playPair` → `colourSchedule`; M11
`bar` → `met` in `summarizePair`; M14 `scoreFor(g, weaker)` → `summarizePair`, which has no `weaker`. QE's M14 scores each game, and counts
wins, for the opponent of `stronger`.

| id | plant | default lane | red row(s) |
|---|---|---|---|
| M1 | claim branch disabled in `adjudicate` | **KILLED** | threefold claimed; fifty-move claimed; A4 replay oracle |
| M2 | cap returns `draw` | **KILLED** | cap is an ERROR |
| M3 | per-side step check disabled | **KILLED** | refuses a different / un-named step |
| M4 | one real 2v1 game in a default row | **KILLED** | 0-game pin (and the scorer row) |
| M5 | `makeSide` halves `budgetMs` | **KILLED** (was survived) | budgets never scaled |
| M6 | colour alternation dropped | **KILLED** (was survived) | colour schedule |
| M7 / M7b | `VERDICT_A1_GAMES` 100 → 50 / `SHORT_A2_GAMES` 4 → 2 | **KILLED / KILLED** (were survived) | constants + plan (M7 also the colour schedule) |
| M8 | one clock shared per step | **KILLED** | own clock instance |
| M9 | replay's recorded-ending equality dropped | survives (INFO, as before) | — equivalent today: recorder and replay share `adjudicate` |
| M10 | opening from `Math.random` | survives (INFO, as before) | — killed by the deep A5 row by construction; not run as a mutant |
| M11 | A1 bar `>= 90` → `> 90` | **KILLED** (was survived) | pair arithmetic |
| M12 | claimed counts every draw | **KILLED** (was survived) | pair arithmetic |
| M13 | `PLY_CAP` 600 → Infinity (the constant) | **KILLED** (was survived) | constants + plan |
| M14 | pair scored for the weaker level | **KILLED** (was survived) | pair arithmetic |
| M15 | `SHORT_STEP` 120 → 60 | **KILLED** | step constants |
| M16 | claim recorded without `(claimed)` | **KILLED** | threefold claimed; fifty-move claimed |

The 16 ids run M1–M16, and M7b shares the M7 row: 17 plants in all. 15 are killed. M9 and M10 survive, as before, and both are INFO.
**The SE's claim holds:** M5, M6, M7, M7b, M11, M12, M13 and M14 are killed on QE's own plants.

**Plants at the call sites the refactor created (QE added them).** The pure functions are pinned. The deep lane's hand-off into them is
not.

| id | plant | default lane | deep lane (read, not run) |
|---|---|---|---|
| X6 | `playPair` plays `playLadderGame(stronger, weaker, …)`, ignoring the schedule's colours | survives (the deep block is not defined) | survives. Nothing asserts colours, but every GAME line prints `white`/`black`, and the pair digests would move |
| X13 | `runGame` handed Infinity in place of `PLY_CAP` in `playLadderGame` (the SE's named gap) | survives | survives. It is equivalent on any run where every game ends before ply 600 |
| X14 | the deep row calls `summarizePair(played, weaker, …)` | survives | survives. The PAIR line's `score` / MET would be the weaker level's, next to `"stronger": N` |

The ruling on these is in the gaps note `…qe2-085-gaps-…`.
