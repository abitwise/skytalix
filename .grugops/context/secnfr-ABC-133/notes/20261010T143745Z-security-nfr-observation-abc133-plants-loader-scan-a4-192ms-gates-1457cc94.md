---
id: 20261010T143745Z-security-nfr-observation-abc133-plants-loader-scan-a4-192ms-gates-1457cc94
kind: observation
by: security-nfr
at: 2026-10-10T14:37:45Z
verified_by:
confidence: high
refs:
  - ABC-133
  - ABC-058
  - ABC-041
  - QE-133-a
  - QE-133-b
  - QE-133-f
  - AR-058-STRIP
  - V1.2.5
  - N8-SPAWN
  - N8-LANE
  - NFR-008
  - ADR-0035
  - src/cli.test.ts
  - src/glyph-mode.nfr.test.ts
  - 20261010T143745Z-security-nfr-decision-abc133-pass-with-risks-strip-discharged-loader-wrap-low-f-133-1-0f608f0c
  - 20261010T142516Z-qe-e2e-observation-abc133-plants-a4-gates-71511fc2
  - 20261010T142516Z-qe-e2e-observation-abc133-gap-register-f589327d
  - 20261010T140620Z-software-engineer-observation-abc133-gates-plants-a1-a5-cost-ccb75b95
supersedes:
---

# `ABC-133` Security/NFR readings: the kills reproduce, QE's holes reproduce, three shapes QE did not plant, a loader/reference scan, `A4` re-timed in situ at 192.3 ms, gates green

This note is hand-authored and unsealed. It is an `observation`, not a `finding`, because no `§14-gate`
verdict exists on this install (`AGENTS.md`).
- Every reading is this hop's own. Each was taken in fresh `git archive` trees of head `e542c574` and
  base `8be650e6`, with `node_modules` symlinked. Node is v26.11.0 and `typescript` is 5.9.3. load1 is
  given beside each reading.
- **Quiet was not available.** Sibling hops of this wave were live, and load1 read 8.0–14.6.
- The scripts and raw output are in `../probe/`; `RUN.txt` is the index. `mutate.cjs` is
  byte-identical to QE's.

## R1. Plants (`probe/plants.sh`, `plants-head.out.txt`, `plants-base.out.txt`)

Each plant ran alone, with `npx vitest run src/cli.test.ts`. The tree was restored and diff-checked
after every plant.

| plant | base `8be650e6` | head `e542c574` |
|---|---|---|
| control (unmutated) | GREEN 67 | GREEN 67 |
| `Q11` a real `spawnSync` after a `"a//b"` string | GREEN | **RED 1/67**, (ii) `['spawnSync','spawnSync in childOf']` |
| `P1` (this role's own `ABC-058` plant) `import * as cp` + `cp.execSync("true")` | GREEN | **RED 1/67**, (i) `[['spawnSync'],['* as cp']]` |
| `P-DYN` `void import("node:child_process");` | GREEN | **RED 1/67**, (i) `[['spawnSync'],[]]` |
| `X5` `createRequire(import.meta.url)("node:child_process").execSync(…)` (`QE-133-a`) | GREEN | **GREEN, a hole** |
| `C7` `spawnSync!(…)` (`QE-133-b`) | GREEN | **GREEN, a hole** |
| **`S1` (new)** `import cp = require("node:child_process")` + `cp.execSync` | GREEN | **GREEN under vitest**. `tsc` refuses it on both trees: `TS1202 Import assignment cannot be used when targeting ECMAScript modules` |
| **`S2` (new)** `vi.mock("node:child_process", async (importOriginal) => ({ ...(await importOriginal<object>()) }))` | GREEN | GREEN (the `QE-133-a` vi.* class; it adds no child) |
| **`S3` (new)** `import * as nodeModule from "node:module"` + `nodeModule.createRequire(…)("child_process").execSync` | GREEN | **GREEN, a hole** (the `QE-133-a` class) |

- Every head RED is the one row `ABC-042 — the shape of what was delivered > N8-LANE — this file
  spawns TWENTY-SEVEN children and no more`. Each fails on the pin's own assertion (`:1916`/`:1918`
  for count (i), `:1929` for count (ii)).
- **QE's kills and QE's holes both reproduce.** QE's 49-plant ledger was not re-run in full. This
  sample agrees with it on every row both hops ran.
- **`S1` is a loader `QE-133-a` does not name, and the mandatory `typecheck` gate already closes it.**
  It ships green only if typecheck is skipped.

## R2. Loader and reference scan (`probe/loader-scan.mjs`, `loader-scan.out.txt`)

The scan runs over the parser view and makes three lists:
- (a) calls whose first argument names `(node:)child_process`, whatever the callee;
- (b) `createRequire` call sites;
- (c) value-position identifiers named `spawnSync`. Type nodes are excluded.

| tree | (a) | (b) | (c) |
|---|---|---|---|
| base `8be650e6` | `[]` | `[]` | import `@32`, call `@341` |
| **head `e542c574`** | **`[]`** | **one site, the pin's `typescript` load `@1858`** (two nested call nodes) | **import `@32`, call `@343` in `childOf`** |
| head + `X5`, `X6`, `S2`, `X7` planted together | all four listed | `X5`'s site added | unchanged |
| head + `C5`, `C7`, `C8`, `Q14`, `C10` planted together | `[]` | unchanged | **five more**: `ParenthesizedExpression`, `NonNullExpression`, `AsExpression`, `VariableDeclaration`, `CallExpression` (the `Reflect.apply` argument) |

- **(a) reads `[]` on the delivered file.** QE's cheap widening for `QE-133-a` would therefore not
  false-red it. It counts any call with a `child_process` first argument.
- **(c) reads exactly two on the delivered file.** A rule that a bound name occurs in value position
  only as its binding and as the `childOf` callee would red every `QE-133-b` shape, `Q14` and
  `Reflect.apply`, with no data flow. `typeof spawnSync` in a type is not counted. This is a dry
  run only; nothing was added to the file.
- **One other test file already uses the loader idiom `QE-133-a` names.**
  `src/glyph-mode.nfr.test.ts` holds `vi.mock("node:child_process", …)` at `:37` and
  `await import("node:child_process")` at `:65`. It is a spy guard and spawns nothing. It shows the
  vi.* loader is live in this repository, though not in `src/cli.test.ts`.

## R3. `A4` in situ (`probe/a4.sh`, adapted from QE's; `a4-require.out.txt`)

- The method: `process.cpuUsage` marks were planted around the delivered pin's own lines in an
  out-of-tree copy. There were 9 fresh vitest processes; round 0 was discarded, leaving n = 8. Every
  run was 67 passed, and every run read `[["spawnSync"]]` / `["spawnSync in childOf"]`.
- **The total median is 192.3 ms** (range 144.5–230.5). Of that, the load is 99.8 ms and the parse
  and walk 92.5 ms. load1 median was 11.27 (range 10.29–12.03).
- **`A4` is MET against 250 ms, with 23.1 % headroom.** QE read 173.2 ms at load1 10.1, which was
  31 % headroom. The margin shrinks with load. No single round exceeded 250 ms in this set.

## R4. `A5`, `N8-SPAWN` and the `V1.2.5` shape (`probe/a5.out.txt`)

- `git diff --name-only 8be650e6 cd594b5f` is `src/cli.test.ts`. Over `8be650e6..e542c574`, the only
  `src/` path is the same file.
- The manifest numstat is empty, and no file was added under `src/`.
- `N8_SPAWN` is `17 + 7 + 1 + 2` at `:1837`. The `it(` count is 67 on both trees.
- **`V1.2.5` is MET at head.** There is one `spawnSync` call site (`:343`, in `childOf`), and no
  `exec`/`execSync`/`execFile*` call. The one `.exec(` hit, at `:507`, is `RegExp.prototype.exec`.
  There is no `shell:` option. `ABC-115`'s `/bin/sh -c` children are unchanged by this diff.

## R5. Gate, in this hop's worktree at `e542c574` (`probe/gates.txt`, load1 8.81)

- `npm run lint` exit 0 (98 files).
- `npm run typecheck` exit 0, and `npm run build` exit 0.
- `npm test` exit 0: **51 files / 1584 passed**.
- The skip count (JSON reporter, pending + todo) is **0**.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` prints
  `No findings.` and exits 0.

## Not re-verified here (relied on as QE's and the Engineer's, which agree)

- `Q12`, `Q13`, `E-MS1`/`E-MS2`, `E-A1`, `S-CTRL`, `Q8`/`Q9` (the `QE-058-e` closure), `C1`–`C4`,
  `C13`–`C15`, `X1`–`X4c`, `X8*` and `X9`.
- The narrow-set lane readings (+0.144 / +0.089 s).
