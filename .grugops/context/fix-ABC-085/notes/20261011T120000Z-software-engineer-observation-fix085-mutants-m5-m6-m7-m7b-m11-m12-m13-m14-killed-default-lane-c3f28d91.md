---
id: 20261011T120000Z-software-engineer-observation-fix085-mutants-m5-m6-m7-m7b-m11-m12-m13-m14-killed-default-lane-c3f28d91
kind: observation
by: software-engineer
at: 2026-10-11T12:00:00Z
verified_by:
confidence: high
refs:
  - ABC-085
  - QE-085-a
  - QE-085-b
  - QE-085-c
  - .grugops/context/qe-ABC-085/notes/20261011T101214Z-qe-e2e-observation-abc085-mutants-4-replanted-killed-13-added-10-survive-d4a90f16.md
  - .grugops/context/fix-ABC-085/probe/mutants.out.txt
supersedes:
---

# fix-ABC-085 mutants: all 8 named survivors now killed in the default lane; the 7 already killed stay killed; M9/M10 (INFO) survive as before

Hand-authored and unsealed. The driver is QE's `mutants.mjs` with its plants retargeted to the refactored sites (M5 at `make(...)`, M6 at
`colourSchedule`, M11/M12/M14 at `summarizePair`; M14 scores each game for the opponent of `stronger`). Each plant goes into a scratch copy
`src/ladder.fixmut.test.ts`, which runs alone with `LADDER_DEEP` removed and is deleted afterwards. Afterwards `git status` was clean apart from the intended files.

| id | default lane | red row |
|---|---|---|
| CONTROL | green 13/13 | — |
| M5 budget halved | KILLED | budgets verbatim |
| M6 no colour alternation | KILLED | colour schedule |
| M7 A1 100 → 50 | KILLED | constants + plan; colour schedule |
| M7b short A2 4 → 2 | KILLED | constants + plan |
| M11 `>= 90` → `> 90` | KILLED | pair arithmetic |
| M12 claimed = all draws | KILLED | pair arithmetic |
| M13 `PLY_CAP` → Infinity | KILLED | constants + plan |
| M14 scored for the weaker | KILLED | pair arithmetic |
| M1–M4, M8, M15, M16 | KILLED (as before) | same rows as QE's run |
| M9, M10 (INFO) | survive, as before | — (left, per the subtask) |

Default lane after the fix: 54 files, 1693 tests, 0 ladder games (pinned by the last row).
