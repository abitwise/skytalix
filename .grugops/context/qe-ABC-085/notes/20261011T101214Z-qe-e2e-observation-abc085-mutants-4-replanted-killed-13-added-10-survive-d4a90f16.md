---
id: 20261011T101214Z-qe-e2e-observation-abc085-mutants-4-replanted-killed-13-added-10-survive-d4a90f16
kind: observation
by: qe-e2e
at: 2026-10-11T10:12:14Z
verified_by:
confidence: high
refs:
  - ABC-085
  - src/ladder.test.ts
  - .grugops/context/qe-ABC-085/probe/mutants.mjs
  - .grugops/context/qe-ABC-085/probe/mutants.out.txt
supersedes:
---

# QE `ABC-085` mutants: the SE's 4 re-planted and killed; 13 added, 3 killed and 10 surviving the default lane

Hand-authored and unsealed. Driver: `../probe/mutants.mjs`. Each mutant is an exact-string plant, asserted to match exactly once, in a temp
copy of `src/ladder.test.ts`. The copy runs alone in the default lane (`LADDER_DEEP` removed from env) and is deleted afterwards. The
unmutated CONTROL copy is green, 9/9. **No mutant was run in a `LADDER_DEEP` lane** (one short-mode run per hop). So "deep lane" below is
read from the code, not from a run.

| id | plant | default lane | deep lane (read, not run) |
|---|---|---|---|
| M1 (SE) | claim branch disabled in `adjudicate` | **KILLED**, 3 rows red | — |
| M2 (SE) | cap returns `draw` | **KILLED**, cap row red | — |
| M3 (SE) | per-side step check disabled | **KILLED**, refusal row red | — |
| M4 (SE) | one real 2v1 game played in the scorer row | **KILLED**, pin row red | — |
| M5 | `makeSide` halves `budgetMs` | survives | survives (A5 in-process still equal; no pinned digest) |
| M6 | colour alternation dropped (stronger always white) | survives | survives (nothing asserts colours) |
| M7 | `VERDICT_A1_GAMES` 100 → 50 | survives | survives |
| M7b | `SHORT_A2_GAMES` 4 → 2 | survives | survives |
| M8 | both sides share one clock per step | **KILLED**, own-clock row red | — |
| M9 | A4 replay's recorded-ending equality dropped | survives | survives; equivalent today (recorder and replay share `adjudicate`) |
| M10 | opening from `Math.random`, not `seededRandom(seed)` | survives | killed by the A5 row by construction; `UNKNOWN - verify`, not run |
| M11 | A1 bar `>= 90` → `> 90` | survives | survives (printed, never asserted) |
| M12 | `claimedDraws` counts every draw | survives | survives |
| M13 | `PLY_CAP` → Infinity (hang guard gone) | survives | survives unless a game hangs |
| M14 | pair score taken for the weaker level | survives | survives |
| M15 | `SHORT_STEP` 120 → 60 | **KILLED**, constant row red | — |
| M16 | claim recorded without the `(claimed)` tag | **KILLED**, 2 rows red | — |

Read: the A3 claim/cap policy, the A5 step rules and the 0-game pin are well guarded. The survivors cluster in two places. One is the
deep row's report arithmetic (M6, M11, M12, M14). The other is the named constants that are not the step (M5, M7, M7b, M13). Both are
routed in the gaps note.
