---
id: 20261010T164758Z-software-engineer-observation-abc138-fix-plants-a5-gates-3133420f
kind: observation
by: software-engineer
at: 2026-10-10T16:47:58Z
verified_by:
confidence: high
refs:
  - ABC-138
  - QE-138-a
  - QE-138-b
  - QE-138-d
  - N8-SPAWN
  - V1.2.5
  - src/cli.test.ts
  - 20261010T162956Z-qe-e2e-observation-abc138-plants-a5-gates-9cdaa822
  - 20261010T164758Z-software-engineer-decision-abc138-fix-iii-counts-expression-with-type-arguments-4c39f4c1
supersedes:
---

# `ABC-138` fix-forward readings at `33e54f70`: `W5` and `W6` now RED (iii); every other plant reads as at `84edfb46`; A5 174.5 ms at load1 8.87; gate green

This note is hand-authored and unsealed. Raw files are in `../probe/` (`RUN.txt` indexes them). Every committed
probe script ran as committed; none was refused. load1 ranged 7.4–38.3 over the plant runs (other agents in parallel).

## Plants (`plants-fix.out.txt`, `qe-plants-fix.out.txt`)

- **Engineer's table, 25 rows + control.** Control GREEN 67/67. `A1` (`X5`, `X5b`, `X6`, `X7`, `S2`, `S3`) RED 1/67
  on (i). `A2` (`C5`–`C8`, `C10`, `Q14`) RED on (iii). `A3` kills RED on the same counts as before (`Q11`, `Q12`,
  `E-MS1` on (ii); `Q13`, `P1`, `P-DYN`, `E-MS2` on (i)). `A3` controls `E-A1`, `S-CTRL`, `C13`, `C15`,
  `C14-ARRAY` GREEN. `A4` `C14`, `C14-ARG` RED on (i).
- **QE's 22 plants, with `tsc` + `biome`.** **`W5` GREEN → RED (iii)** (tsc 0, biome 0). **`W6` GREEN → RED (iii)**
  as written (`QE-138-d` closed at the source). Every other row reads as QE recorded at `84edfb46`: `L1`–`L4`,
  `L6`, `L7` RED (i); `L8`, `W1`–`W4`, `W7` RED (iii); `F1`, `F4`, `F5` RED (i), stated/pre-existing; `L3b`,
  `F1b`, `F2`, `F2b`, `F3`, `F6`, `F7` GREEN. `L3c` and `L5` stay GREEN, the `QE-138-b` residual the comment
  now names.
- **`W5` LIVE** (`live-fix.out.txt`): RED 1/67, the (iii) row, with tsc 0 and biome 0. The stray child still runs at
  module scope (1 mark) because a test cannot stop module-scope code; the suite now fails on it.
  **`W6` LIVE** after `biome format`: RED (iii), tsc exit 2, as at `84edfb46`.
- **Own controls** (`own-controls.out.txt`): `G1` `class … extends Array<ReturnType<typeof spawnSync>>`,
  `G2` `interface … extends Pick<…typeof spawnSync…>`, `G3` `class … implements Pick<…>`: all GREEN 67/67, tsc 0,
  biome 0. The narrowing adds no false red on type arguments.

## A5 (`a5.out.txt`, engineer's `a4.sh`, base `2946e22a` vs `33e54f70`, 11 interleaved rounds, round 0 discarded)

Head median **174.5 ms** CPU at load1 median **8.87** (7.54–11.4); base 170.6 ms at 9.29; paired median −7.4 ms;
max 242.9; 0 rounds over 250. One `typescript` load, one `createSourceFile`. Every round read
`[["spawnSync"]]`, `["spawnSync in childOf"]` and the two references.

## A6 (`a6.out.txt`)

Fix diff `1759e14c..33e54f70`: `src/cli.test.ts` only, +13/−3. Ticket `src/` diff `2946e22a..33e54f70`:
`src/cli.test.ts` only, +40/−13. Manifest numstat empty; 0 added/deleted files; production-lines grep empty;
`it(` 67 → 67; `N8_SPAWN` `17 + 7 + 1 + 2`; data-flow phrase 0. `loader-scan.mjs`: `[]`, one `createRequire` site,
`["ImportSpecifier@32","CallExpression@343"]`.

## Gate at `33e54f70` (`gates.txt`)

Lint exit 0 (100 files), typecheck 0, build 0 (load1 10.35). `npm test` exit 0, 52 files / 1608 passed. Skip
count 0; `test-skip-integrity.js … --skip-count 0` `No findings.` exit 0; `lane-inventory.js` "52 test files; git
tracks 52. No findings." exit 0.
