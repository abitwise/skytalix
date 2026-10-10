---
id: 20261010T140620Z-software-engineer-observation-abc133-gates-plants-a1-a5-cost-ccb75b95
kind: observation
by: software-engineer
at: 2026-10-10T14:06:20Z
verified_by:
confidence: high
refs:
  - ABC-133
  - ABC-058
  - ABC-059
  - QE-058-a
  - QE-058-e
  - F-058-1
  - AR-058-STRIP
  - V1.2.5
  - N8-SPAWN
  - N8-LANE
  - NFR-008
  - ADR-0035
  - src/cli.test.ts
  - 20261010T140620Z-software-engineer-decision-abc133-specifiers-as-binding-lists-callee-resolution-createrequire-a530d175
supersedes:
---

# `ABC-133` readings: gate green; all five `A1` plants GREEN → RED on the pin row; controls hold; `A4` ≈ 162 ms / 157 ms; narrow set admissible in both sets, head − base +0.144 / +0.089 s

Hand-authored and unsealed.
- Branch `grugops/ABC-133-spawn-pin-parser-view`, from `8be650e6` (the wave tip at pull). The code
  commit is `cd594b5f` (`src/cli.test.ts` +88/−9).
- Not merged, not pushed.
- Machine: Apple M3, Node v26.11.0, `typescript` 5.9.3. load1 is beside every reading.
- Raw files are in `../probe/` (`RUN.txt` indexes them).

**Premise re-verified at `8be650e6` before editing.** It still held:
- The pin is at `:1835-1850`, `N8_SPAWN` is `17 + 7 + 1 + 2` = 27, the import is at `:32`, the
  call at `:341` and the literal at `:1706`.
- Since the page's `9ddd6e80`, `src/cli.test.ts` changed only by `ABC-059`'s one insertion at
  `:2138`.
- The wave tip later advanced to `9128e7a3` with docs and ADR edits only (0 `src/` bytes). The
  `ADR-0035` amendment sets `src/cli.test.ts`'s `F` at 1.097 s and names `A4` as the content bound.

## Gate (at `cd594b5f`, worktree)

| step | result | load1 |
|---|---|---|
| `npm run lint` | exit 0, 98 files | 8.10 |
| `npm run typecheck` / `npm run build` | exit 0 / exit 0 | 8.10 / 7.77 |
| `npm test` | exit 0, **51 files / 1584 passed**, 6.04 s | 7.77 |
| skip count | `0` | 12.35 |
| `test-skip-integrity.js … --skip-count 0` | `No findings.`, exit 0 | 12.35 |
| `lane-inventory.js` | exit 0: "The lane collects 51 test files; git tracks 51. No findings." | 12.35 |

## Plants (out-of-tree `git archive` copies, `npx vitest run src/cli.test.ts`, one plant per run)

| plant | base `8be650e6` | delivered `cd594b5f` | count that reds |
|---|---|---|---|
| control (unmutated) | 67/67 green (load1 4.97) | 67/67 green (5.51) | — |
| **`Q11`** a real `spawnSync` after `"a//b"` | **GREEN** 67/67 (4.89) | **RED 1/67**, the pin row (7.79) | (ii) `["spawnSync","spawnSync in childOf"]` |
| **`Q12`** a real call between `"/*"` and `"*/"` | **GREEN** (4.82) | **RED 1/67** (7.56) | (ii) |
| **`Q13`** `import * as cp` + `cp.spawnSync(` after `"x//y"` | **GREEN** (4.83) | **RED 1/67** (7.36) | (i) `[["spawnSync"],["* as cp"]]`, and (ii) |
| **`P1`** `import * as cp` + `cp.execSync("true")` | **GREEN** (4.93) | **RED 1/67** (7.17) | (i), and (ii) `["cp.execSync","spawnSync in childOf"]` |
| **`P-DYN`** `void import("node:child_process");` | **GREEN** (4.93) | **RED 1/67** (7.17) | (i) `[["spawnSync"],[]]` |
| `E-MS1` a direct `spawnSync` child | RED, pin row (4.93) | **RED**, pin row (7.16) | (ii) |
| `E-MS2` namespace import + destructure | RED, pin row (4.86) | **RED**, pin row (6.90) | (i) `[["* as childProcess"]]` |
| `E-A1` a docblock sentence naming `` `spawnSync(` `` | green (4.86) | **green** (7.15) | — |
| `S-CTRL` `const tag = "a//b /* c"; void tag;` | green (9.04) | **green** (6.74) | — |
| `Q14` `const alias = spawnSync; alias(…)` | green (8.71) | **green** (6.68): the stated bound | — |
| `Q8` template **text** naming `spawnSync(` | RED, a false red (8.66) | **green** (10.07) | — (`QE-058-e` closed) |
| `Q9` a real call in a template interpolation | RED (8.12) | **RED** (11.10) | (ii) |
| `Q10` a `//` comment naming `spawnSync(` | green (7.95) | green (10.61) | — |

- Every RED is the one row `ABC-042 — the shape of what was delivered > N8-LANE — this file spawns
  TWENTY-SEVEN children and no more`.
- The failing assertion is `:1916`/`:1918` (specifiers) or `:1929`/`:1931` (resolved calls); the
  line shifts with the plant's size. Messages are in `probe/plants-reasons.out.txt`.
- The "count that reds" column is from `probe/plants-counts.out.txt`: the delivered walk,
  transcribed, run on each planted tree.
- The first build commit, `68f6dd7f` (ESM import, since squashed), gave the same verdict on every
  row.

## Criteria

- **`A1` MET.** `Q11`, `Q12`, `Q13`, `P1` and `P-DYN` are GREEN at base and RED at delivery,
  attributed to the pin row. `P1` reds on both counts, as the page says.
- **`A2` MET.**
  - The unmutated file is green.
  - (i) reads 1 specifier position. The `:1706` `"child_process"` string is not counted.
  - `E-MS1` and `E-MS2` are still RED.
  - `E-A1`, the prose plant, is still GREEN, and so is the string control.
- **`A3` MET.** `Q14` reads **GREEN** at delivery. The pin's comment names a variable alias as the
  bound it does not see (decision `…a530d175` item 4).
- **`A4` MET.** The instrument's own work is the `createRequire` load plus one parse and walk. It
  was measured over 9 fresh processes, round 0 discarded, n = 8:
  - **plain node:** median **162.0 ms** CPU (160.4–191.0), load1 8.62 (`probe/a4-cost.out.txt`);
  - **inside a vitest worker:** median **156.5 ms** (144.8–164.0), load1 9.74–10.24
    (`probe/a4-cost-in-vitest.out.txt`);
  - both are ≤ 250 ms;
  - the load and parse run once per run of the file, inside the pin's `it`;
  - not delivered: the ESM `import` form read ~205 ms for the load alone under vitest, ~280 ms in
    total (decision item 5).
- **`A5` MET** (`probe/a5.out.txt`):
  - `git diff --name-only 8be650e6 cd594b5f` = `src/cli.test.ts`;
  - the `package.json` / `package-lock.json` numstat is empty;
  - 0 added or deleted files, 0 production lines (the zero-production-lines grep is empty);
  - 0 `it(` added or removed, `N8_SPAWN` `17 + 7 + 1 + 2` = 27;
  - the gate is green, skip 0, `No findings.`;
  - `ABC-042`'s `A1` row (12 lines), `ABC-065`'s `describe` (184) and `ABC-059`'s `describe` (75)
    hash identically before and after;
  - two hunks: the import block (+2) and the pin (+86/−9).
- **`AR-058-STRIP`'s trigger did not fire on this diff.**
  - `scan-literals.mjs` lists 1 `//` / `/*` literal in `cli.test.ts` at base and at delivery: the
    strip helper's regex.
  - No added non-comment line holds `//` or `/*`.
  - No `node:child_process` form was added.

## Cost reading (`ADR-0035`, `proposed`, amended): narrow set `src/cli.test.ts` alone

Harness `probe/timing.sh`:
- three `git archive` trees: base `8be650e6`, head `cd594b5f`, and a twin of base, `diff -r -x
  node_modules` identical;
- 9 rounds, round 0 discarded (n = 8, k = 2), arm order rotated, counts 67/67/67 asserted;
- scored by `probe/score.mjs`, unchanged.

| set | load1 median (range) | base CPU | twin − base (admissibility) | twin R | head − base, interval |
|---|---|---|---|---|---|
| 1 | 7.71 (5.85–12.75) | 5.950 s | −0.044 s (**−0.73 %**), sign 2/8 | 0.582 s | **+0.144 s** (+2.43 %), −0.005..+0.290, sign 6/8 |
| 2 | 6.49 (5.57–11.45) | 6.001 s | −0.014 s (**−0.22 %**), sign 3/8 | 0.371 s | **+0.089 s** (+1.47 %), −0.059..+0.203, sign 6/8 |

- **Both sets are admissible**: the twin is ≤ 1.5 % and its sign is at chance.
- **No bound is checked and no state is written.**
  - `N8-LANE` has no line in scope (0 files added). The page puts the content cost under `A4`.
  - ADR-0035's amended `F` for this file (1.097 s) is above `N8-LANE`'s 650 ms, so that bound is
    refused at the cut anyway.
  - The charge is reported as "at most +0.290 s / +0.203 s" CPU, beside R.
- The first commit (`68f6dd7f`, ESM import) read head − base **+0.358 s** (+0.281..+0.482, twin
  −0.27 %, 3/8, R 0.155 s, load1 7.0). That is the ~120 ms load difference of decision item 5,
  seen on the lane.
- **`N8-SPAWN`**: 27, unchanged. **`NFR-008`**: the added CPU above is reported. No verdict is
  claimed; that is with the owner.

## Side observations (not this ticket's to fix)

- `<repo>/node_modules/node_modules` is the pre-existing self-symlink, left in place. `-x
  node_modules` was used.
- Security/NFR's hop is recommended by the page, because `V1.2.5`'s instrument changed. It is the
  Orchestrator's to route.
