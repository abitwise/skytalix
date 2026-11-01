---
id: 20261101T071525Z-qe-e2e-observation-ead81ee6
kind: observation
by: qe-e2e
at: 2026-11-01T07:15:25Z
verified_by: 
confidence: high: 3 plants at head and 3 at base, whole default lane each, on a scratch tree; all as pre-registered
refs:
  - qe-ABC-246
  - ABC-246
  - EPIC-009
  - ADR-0052
  - ADR-0046
  - NFR-008
  - ABC-221
  - ABC-170
  - ABC-248
  - QE-221-a
  - QE-221-b
  - SE-221-g
  - SE-246-a
  - QE-246-a
  - QE-246-b
  - QE-246-c
  - QE-246-d
  - W1
  - bapm-tranche2-ruling
  - qe-ABC-221/20261031T060935Z-qe-e2e-observation-8ad25906
  - qe-ABC-221/20261031T060935Z-qe-e2e-observation-c6f37a35
  - se-ABC-246/20261101T070329Z-software-engineer-decision-2f43204c
  - se-ABC-246/20261101T070329Z-software-engineer-observation-8de958b6
  - se-ABC-246/20261101T070329Z-software-engineer-observation-851629b3
  - se-ABC-246/20261101T070329Z-software-engineer-observation-0d04bf8a
  - grugops/ABC-246
  - 3c5e05fd
  - a1942ea0
  - 832ff246
  - grugops/qe-ABC-246
  - c95e6324
  - src/uci-session.test.ts
  - src/engine.test.ts
supersedes: 
seal: sha256:39cd4c43cc79616a411ec949c31b2238f690e28b017d752d23d24423fddad139
---

# `ABC-246` A3 re-read over the WHOLE default lane: HSCM reds exactly {A1}, CLOCKWINSCM reds exactly {A2}, `none` 0 red; at base both plants survive the lane, so the two new rows are the only killers. No plant was committed

- **Method** (`raw/qe-scripts/plant.mjs`, PREREG section 3):
  - The plant strings are verbatim from `qe-ABC-221`'s `raw/qe-scripts/plant.mjs` (`SHARE` → HSCM, `MT` →
    CLOCKWINSCM). Each one is asserted to occur exactly once in `src/uci-session.ts`.
  - Each plant is applied alone to scratch tree P: a hard-link copy of H (or B) with a real `src/`.
  - The whole default lane runs per plant: vitest via node (never npx), json reporter, heap 128.
  - The file is restored after each plant, and P's `src/uci-session.ts` is `cmp`-equal to the tree's at the end.
  - The worktree was never touched. H (`git archive a1942ea0`) has 0 content differences after all runs
    (`raw/gates/tree-integrity.txt`).

| tree | plant | files | total | failed | red rows | handed vs expected |
|---|---|---|---|---|---|---|
| H | none | 63 | 2 366 | 0 | — | — |
| H | **HSCM** | 63 | 2 366 | **1** | `ABC-246` **A1** only | `[2400]` vs `[1900]` |
| H | **CLOCKWINSCM** | 63 | 2 366 | **1** | `ABC-246` **A2** only | `[22375]` vs `[5000]` |
| B | none (extra control, not pre-registered) | 63 | 2 364 | 0 | — | — |
| B | HSCM | 63 | 2 364 | 0 | survives | — |
| B | CLOCKWINSCM | 63 | 2 364 | 0 | survives | — |

- **PLANTS MET** as pre-registered:
  - `none` is green, and each REQUIRED red holds.
  - Nothing else in the lane turns red ("nothing else red", the brief).
  - At base both plants survive, which matches `qe-ABC-221`'s survivor reading at `c48a6f83`. So **QE-221-a is closed**:
    the mode's two guards are held by lane rows, not by QE's oracle.
- This agrees with the SE's one-file read (`se-ABC-246` `…8de958b6`) and extends it from one file to the whole lane.
- Red lists: `raw/plants/plant-{H,B}-*.red.txt`. Json sha256: `raw/plants/json-sha256.txt` (the json stayed in scratch).
