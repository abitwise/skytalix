---
id: 20261010T170303Z-security-nfr-observation-abc138-plants-a5-gates-f114ac22
kind: observation
by: security-nfr
at: 2026-10-10T17:03:03Z
verified_by:
confidence: high
refs:
  - ABC-138
  - AR-133-LOADER
  - AR-133-WRAP
  - QE-138-a
  - QE-138-b
  - QE-138-c
  - V1.2.5
  - N8-SPAWN
  - src/cli.test.ts
  - 20261010T170303Z-security-nfr-decision-abc138-pass-with-risks-wrap-discharged-loader-narrowed-scan-retired-91830257
supersedes:
---

# `ABC-138` Security/NFR readings at `0a63e4c4`: 58 plants as predicted, `A5` 230.2 / 167.9 ms, `A6` one path, gates green

This note is hand-authored and unsealed. The raw files are in `../probe/`, and `RUN.txt` indexes
them. Every tree is a `git archive` copy of `0a63e4c4`. The committed probe scripts ran and were
not refused.

## Plants (one per `npx vitest run src/cli.test.ts`)

- **The engineer's table** (`se-plants.out.txt`, 25 rows plus a control): **as recorded.**
  - The control is GREEN 67/67.
  - `A1` `X5`, `X5b`, `X6`, `X7`, `S2` and `S3` are RED on (i).
  - `A2` `C5`, `C6`, `C7`, `C8`, `C10` and `Q14` are RED on (iii).
  - `A3`'s kills are RED: `Q11` and `Q12` on (ii), `Q13`, `P1`, `P-DYN` and `E-MS2` on (i), and
    `E-MS1` on (ii).
  - `A3`'s controls are GREEN: `E-A1`, `S-CTRL`, `C13`, `C15` and `C14-ARRAY`.
  - `A4` `C14` and `C14-ARG` are RED on (i).
- **QE's 22 plants** (`qe-plants.out.txt`, with `tsc` and `biome` for each): **as at `33e54f70`.**
  - RED on (i): `L1`, `L2`, `L3a`, `L4`, `L6` and `L7`.
  - RED on (iii): `L8`, `W1`–`W7`, including `W5` and `W6`.
  - GREEN, the named residuals: `L3b`, `L3c` and `L5`.
  - RED as the stated class: `F1` and `F4`. RED as pre-existing behaviour: `F5`.
  - GREEN with no false red: `F1b`, `F2`, `F2b`, `F3`, `F6` and `F7`.
  - `tsc` exits 0 on every plant.
- **This hop's plants** (`sec-plants.out.txt`, 11 plus a control, with `tsc` and `biome` for each):

| plant | suite | tsc | biome | reading |
|---|---|---|---|---|
| control | GREEN 67/67 | 0 | 0 | — |
| `K1` `void JSON.stringify("child_process")` | RED (i) | 0 | 0 | the stated false red |
| `K2` `C14-ARRAY` | GREEN | 0 | 1 (format of the plant line) | the true control |
| `K3` `const CP = "child_process"; expect(t).not.toContain(CP)` | GREEN | 0 | 0 | the remedy works for a call that loads nothing |
| `K4` `const CP = "node:child_process"; vi.importActual(CP)` | GREEN | 0 | 0 | **the remedy misapplied to a loader is blind** (`QE-138-c`) |
| `K5` `const CP …; createRequire(…)(CP).execSync("true")` | GREEN | 0 | 0 | the same |
| `E1` `eval("spawnSync")(process.execPath, […])` | GREEN | 0 | **1, `lint/security/noGlobalEval`** | the mandatory lint gate refuses it |
| `E2` `(spawnSync as typeof spawnSync)(…)` | RED (iii) | 0 | 0 | — |
| `E3` `class … extends (spawnSync as …) {}` + `new` | RED (iii) | 0 | 0 | `QE-138-a` is closed |
| `L-a` `getBuiltinModule.call(process, "node:child_process")` | GREEN | 0 | 1 (format) | `QE-138-b` residual |
| `L-b` `getBuiltinModule("node:child" + "_process")` | GREEN | 0 | 1 (format) | the non-literal residual |
| `L-c` `createRequire(…)("node:child_process")` | RED (i) | 0 | 0 | — |
| `L-d` `vi.mock("node:child_process")` (automock, no factory) | RED: the file fails to run, `TypeError … 'error'` | 0 | 0 | loud; with a factory, `S2` reds (i) |

- **`loader-scan.mjs` on a `W5`-planted copy** (`loader-scan-w5.out.txt`): `spawnSyncValueRefs` lists
  two, the import and the `childOf` call. **The scan misses `W5`; the suite reds it.**

## `A5` (`a4.sh`, base `2946e22a` and head `0a63e4c4` interleaved, n = 10 after round 0)

| batch | head median | base median | paired median | load1 (median) | rounds > 250 ms |
|---|---|---|---|---|---|
| 1 | **230.2 ms** | 206.2 ms | −8.5 ms | 11.28 | 3 head, 3 base |
| 2 | **167.9 ms** | 176.1 ms | −0.5 ms | 9.88 | 0 |

- **Both medians are ≤ 250.** Every round reads (i) `[["spawnSync"]]`, (ii)
  `["spawnSync in childOf"]` and (iii) the two references.
- There is one load and one parse.
- The rise in batch 1 is in the `typescript` load segment (head 125.1 ms against 92.3 ms in batch
  2), and it hits base and head alike.

## `A6` and the one-path checks (`a6.out.txt`)

- Outside `.grugops/context/`, the diff `2946e22a..0a63e4c4` names `src/cli.test.ts` (+42/−13), the
  ticket and `plans/traceability.md`.
- The manifest numstat is empty, with 0 production lines.
- `it(` is 67 at base and 67 at head. `N8_SPAWN = 17 + 7 + 1 + 2`.
- There is one `typescript` load and one `createSourceFile`.
- "resolving it needs data flow" occurs 0 times.
- `loader-scan.mjs` at head reads `[]`, one site (two nested call nodes `@1878`) and two references.

## Gates (`gates.txt`, `0a63e4c4`, own worktree)

- `npm run lint`: exit 0 (100 files).
- `npm run typecheck`: exit 0.
- `npm run build`: exit 0.
- `npm test`: exit 0, 52 files and 1608 passed.
- Skip count: 0. `test-skip-integrity.js --skip-count 0`: `No findings.`, exit 0.
- `lane-inventory.js`: exit 0, `No findings.`
