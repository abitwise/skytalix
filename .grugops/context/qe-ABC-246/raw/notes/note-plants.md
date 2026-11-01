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
