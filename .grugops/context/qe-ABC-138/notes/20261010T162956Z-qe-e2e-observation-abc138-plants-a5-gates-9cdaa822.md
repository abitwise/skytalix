---
id: 20261010T162956Z-qe-e2e-observation-abc138-plants-a5-gates-9cdaa822
kind: observation
by: qe-e2e
at: 2026-10-10T16:29:56Z
verified_by:
confidence: high
refs:
  - ABC-138
  - ABC-133
  - F-133-1
  - QE-133-a
  - QE-133-b
  - AR-133-LOADER
  - AR-133-WRAP
  - V1.2.5
  - N8-SPAWN
  - src/cli.test.ts
  - 20261010T162956Z-qe-e2e-decision-abc138-verdict-pass-with-gaps-6ef45921
  - 20261010T162956Z-qe-e2e-observation-abc138-gap-register-d5a380ba
  - 20261010T160355Z-software-engineer-observation-abc138-gates-plants-a1-a6-cost-74a52ca8
supersedes:
---

# `ABC-138` QE readings: the engineer's 25-row table reproduces at both tips. QE's 22 plants: 12 new kills, 3 gate-admissible holes, 1 hole the formatter breaks. Cost 170.3 ms at load1 10.1; gate green

This note is hand-authored and unsealed. Raw files are in `../probe/` (`RUN.txt` indexes them).
- Base `2946e22a`, code `84edfb46`, tip `7e5c9c74` (`src/` is byte-identical to the code commit).
- Machine: Apple M3, Node v26.11.0. An `ABC-010` build ran deep lanes in parallel, so load1 sat
  between 8 and 52. It is logged beside every reading.
- **The committed probe scripts were not refused.** The engineer's `plants.sh` and `a4.sh` and
  Security/NFR's `loader-scan.mjs` all ran as committed. QE's own plants are in `qe-plants.sh`.

## The engineer's table, re-run by QE (`se-plants-{base,head}.out.txt`)

It reproduces row for row. At base, the control and all 12 gap plants are GREEN 67/67. The seven
kills are RED. The five controls and `C14` / `C14-ARG` are GREEN. At head:
- `A1` (`X5`, `X5b`, `X6`, `X7`, `S2`, `S3`) is RED 1/67 on (i), `[["spawnSync"],[]]`.
- `A2` (`C5`–`C8`, `C10`, `Q14`) is RED 1/67 on (iii), with three references.
- The `A3` kills stay RED on the same counts as at base. `P-DYN` is one extra entry.
- The `A3` controls stay GREEN.
- `A4` (`C14`, `C14-ARG`) is RED on (i).
Every red is the `N8-LANE` row alone. Base load1 was 15.9–35.5, head load1 8.5–15.8.

## QE's own plants (`qe-plants-{base,head}.out.txt`; head with `tsc` + `biome check` per plant)

| plant | base | head | head tsc / biome |
|---|---|---|---|
| `L1` renamed `createRequire`: `const mk = createRequire; mk(…)("node:child_process")` | GREEN | **RED (i)** | 0 / 0 |
| `L2` `require` alias: `const load = r; load("child_process")` | GREEN | **RED (i)** | 0 / format |
| `L3a` `getBuiltinModule` via a variable callee: `const gbm = process.getBuiltinModule; gbm("node:child_process")` | GREEN | **RED (i)** | 0 / 0 |
| `L3b` `getBuiltinModule(CP)`, where `CP` is a `const` holding the name | GREEN | GREEN (out of scope, non-literal) | 0 / 0 |
| `L3c` `process.getBuiltinModule.call(process, "node:child_process")` | GREEN | **GREEN — hole** | 0 / 0 after format |
| `L4` `` getBuiltinModule(`node:child_process`) `` | GREEN | **RED (i)** | 0 / 0 |
| `L5` `Reflect.apply(createRequire(…), undefined, ["child_process"])` | GREEN | **GREEN — hole** | 0 / 0 after format |
| `L6` `vi.doMock("child_process")` | GREEN | **RED (i)** | 0 / 0 |
| `L7` `export * from "node:child_process"` | RED (i) | RED (i) | 0 / `noExportsInTest` |
| `L8` `export { spawnSync }` | GREEN | **RED (iii)** | 0 / `noExportsInTest` |
| `W1` `(spawnSync satisfies typeof spawnSync)()` | GREEN | **RED (iii)** | 0 / 0 |
| `W2` `[spawnSync][0]?.()` | GREEN | **RED (iii)** | 0 / 0 |
| `W3` `const box = { spawnSync }; box.spawnSync()` | GREEN | **RED (iii)**, 4 references | 0 / 0 |
| `W4` `new (spawnSync as …)()` | GREEN | **RED (iii)** | 0 / format |
| `W5` `class S extends (spawnSync as unknown as new (…) => object) {}; new S(…)` | GREEN | **GREEN — hole** | **0 / 0** |
| `W6` `(spawnSync as unknown as <T>(…) => T)<object>`, then called | GREEN | **GREEN — hole** | 0 / format (see below) |
| `W7` `const [s] = [spawnSync]; s()` | GREEN | **RED (iii)** | 0 / 0 |
| `F1` `console.log("child_process")` | GREEN | RED (i), the stated `A4` class | 0 / 0 |
| `F1b` `console.info("module", "child_process")` | GREEN | GREEN | 0 / 0 |
| `F2` `type R = ReturnType<typeof spawnSync>` | GREEN | GREEN | 0 / 0 |
| `F2b` `(file: Parameters<typeof spawnSync>[0])` | GREEN | GREEN | 0 / 0 |
| `F3` JSDoc `{@link spawnSync}` | GREEN | GREEN | 0 / 0 |
| `F4` `expect(text).not.toContain("child_process")` | GREEN | RED (i), the stated `A4` class | 0 / 0 |
| `F5` `import type { SpawnSyncReturns } from "node:child_process"` | RED (i) | RED (i) (`QE-133-d`, unchanged) | 0 / 1 |
| `F6` `type C = typeof import("node:child_process")` | GREEN | GREEN | 0 / 0 |
| `F7` `"child_process loader"` (not an exact name) | GREEN | GREEN | 0 / 0 |

- **12 new kills.** These are `L1`, `L2`, `L3a`, `L4`, `L6`, `L8`, `W1`–`W4` and `W7`.
- **`W5` LIVE** (`live-head.out.txt`): the stray `new` runs at module scope and writes a marker.
  - The suite stays **GREEN 67/67**. The marker shows **1 child ran**.
  - `tsc` exits 0, and `biome check` exits 0 after `biome format --write`.
  - So a real, uncounted child ships green through every gate.
- **`W6` LIVE.** The parse-level hole is real, but the line is not gate-admissible today:
  - `biome format --write` drops the parentheses around `spawnSync as …`, and that changes the
    meaning.
  - The formatted file then fails `tsc` (exit 2), and the suite reds (iii).
  - Another spelling, `box.run<object>`, puts the reference outside the instantiation, and (iii)
    counts it.
- **`L3c` and `L5`** after `biome format --write` (`fmtcheck.out.txt`): GREEN 67/67, `tsc` 0 and
  `biome check` 0. Both are gate-admissible.
- **The fix check** (`fixcheck.out.txt`, scratch only, nothing on the branch): narrowing (iii)'s
  filter to `ts.isTypeNode(n) && !ts.isExpressionWithTypeArguments(n)` reds `W5`. The control,
  `F2` and `F2b` stay GREEN.

## The cost (ticket `A5`, under `ABC-133` `A4`'s protocol; `a5-batch{1,2}*`)

This used the engineer's `a4.sh` as committed, 11 interleaved base/head rounds per batch, with
round 0 discarded.

| batch | head median | base median | paired head − base | head load1 median (range) | rounds > 250 ms |
|---|---|---|---|---|---|
| 1 | **183.7 ms** | 175.6 ms | +5.5 ms | **37.78** (21.5–52.5) | head 2 (267.7, 264.9 at load1 ≈ 50), base 1 |
| 2 | **170.3 ms** | 180.4 ms | −4.3 ms | **10.11** (9.0–12.5) | head 1 (261.1 at 9.2), base 2 |

- **Both medians are ≤ 250 ms.** The added work cannot be told apart from noise at either load.
- One load and one parse run per process. `createSourceFile` and the `typescript` load each occur
  once in the file. Every round read `[["spawnSync"]]`, `["spawnSync in childOf"]` and the two
  references.

## Static checks (`A4` text, `A6`)

- `git diff --name-only 2946e22a 84edfb46` lists `src/cli.test.ts` alone, at +30/−13.
- The manifest numstat is empty, with 0 added or deleted files.
- The zero-production-lines grep is empty, so the UAT waiver measures 0.
- `it(` reads 67 → 67, and `N8_SPAWN` is `17 + 7 + 1 + 2`.
- "resolving it needs data flow" in collapsed text reads 1 → 0.
- `loader-scan.mjs` at the tip reads `[]`, one `createRequire` site (`@1871`) and
  `["ImportSpecifier@32","CallExpression@343"]`.

## Gate at tip `7e5c9c74` (`gates.txt`)

| step | result | load1 |
|---|---|---|
| `npm run lint` | exit 0, 100 files | 8.27 |
| `npm run typecheck` / `npm run build` | exit 0 / exit 0 | 8.27 |
| `npm test` | exit 0, 52 files / 1608 passed, 7.81 s | 8.27 |
| skip count | 0 | 12.47 |
| `test-skip-integrity.js … --skip-count 0` | `No findings.`, exit 0 | 23.19 |
| `lane-inventory.js` | exit 0, "52 test files; git tracks 52. No findings." | 23.19 |

**Not run:** `CLI_DEEP` and `PUZZLE_DEEP`. Neither trigger fires, because `src/cli.ts` and the
engine are untouched.
