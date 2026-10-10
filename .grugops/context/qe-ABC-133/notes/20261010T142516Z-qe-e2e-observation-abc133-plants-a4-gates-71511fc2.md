---
id: 20261010T142516Z-qe-e2e-observation-abc133-plants-a4-gates-71511fc2
kind: observation
by: qe-e2e
at: 2026-10-10T14:25:16Z
verified_by:
confidence: high
refs:
  - ABC-133
  - ABC-058
  - ABC-042
  - F-058-1
  - QE-058-a
  - QE-058-e
  - AR-058-STRIP
  - V1.2.5
  - N8-SPAWN
  - src/cli.test.ts
  - 20261010T142516Z-qe-e2e-decision-abc133-verdict-pass-with-gaps-27801a15
  - 20261010T142516Z-qe-e2e-observation-abc133-gap-register-f589327d
  - 20261010T140620Z-software-engineer-observation-abc133-gates-plants-a1-a5-cost-ccb75b95
supersedes:
---

# `ABC-133` QE readings: 49 plants on head and base, 6 soft re-runs, `A4` timed IN SITU on the delivered pin, gates

This note is hand-authored and unsealed. It is an `observation`, not a `finding`: no `§14-gate`
verdict exists on this install (`AGENTS.md`).
- Every reading is QE's own. Each plant ran alone in a fresh `git archive` tree of base `8be650e6`
  or head `82104f70` (`src/` byte-identical to the code commit `cd594b5f`).
- Raw files and scripts are in `../probe/` (index: `RUN.txt`). The engineer's notes and probes were
  used as pointers only.
- The recipes were checked against their sources before use. `mutate.cjs` is byte-identical to
  QE-058's. The `Q*` / `E-*` anchors and bodies match `qe-ABC-058/probe/mutants.sh`, and `P1` / `P2`
  match `secnfr-ABC-058/probe/pin-gaps.sh`.

## Plants (`../probe/summary.txt`; load1 4.3–18.8 across the run)

"RED (i)" means the pin's count (i) assertion fails ("child_process specifier positions…"), and
"RED (ii)" means count (ii)'s ("calls that resolve…"). Every RED on head is `1 failed | 66 passed`,
and it is the `N8-LANE` row alone.

| plant | base `8be650e6` | head `82104f70` |
|---|---|---|
| control (unmutated) | GREEN 67 | GREEN 67 |
| `Q11` real call after a `"a//b"` string | GREEN | **RED (ii)** |
| `Q12` real call between `"/*"` and `"*/"` | GREEN | **RED (ii)** |
| `Q13` namespace import + `cp.spawnSync` after `"x//y"` | GREEN | **RED (i)**, and (ii) under soft |
| `P1` namespace import + `cp.execSync("true")` | GREEN | **RED (i)**, and (ii) under soft |
| `P-DYN` `void import("node:child_process");` | GREEN | **RED (i)** |
| `P2` (SecNFR) real call after a URL string | GREEN | **RED (ii)** |
| `E-MS1` direct `spawnSync` child | RED (regex) | RED (ii) |
| `E-MS2` namespace import, destructured | RED (regex) | RED (i) |
| `E-A1` prose docblock naming `` `spawnSync(` `` | GREEN | GREEN |
| `S-CTRL` `const tag = "a//b /* c"; void tag;` | GREEN | GREEN |
| `Q14` variable alias | GREEN | GREEN (out of scope, stated) |
| `Q8` template TEXT `spawnSync(` | RED (false red) | **GREEN** (`QE-058-e` closed) |
| `Q9` real call in a template interpolation | RED | RED (ii) |
| `Q10` `//` comment naming `spawnSync(` | GREEN | GREEN |
| `X1` second import, bare `"child_process"`, `execSync` | GREEN | **RED (i)**, and (ii) under soft |
| `X2` default import + `cpd.execSync` | GREEN | **RED (i)**, and (ii) under soft |
| `X2b` `import cpd, { spawnSync }` | RED | RED (i) |
| `X2c` `{ spawnSync as runChild }` (plants2) | — | RED (i) |
| `X3` `` require(`node:child_process`) `` (template) | GREEN | **RED (i)** |
| `X3b` `require("child_process")` | GREEN | **RED (i)** |
| `X3c` `` import(`child_process`) `` | GREEN | **RED (i)** |
| `X4` `export { execSync } from "node:child_process"` | GREEN | **RED (i)** |
| `X4b` `export * from "child_process"` | GREEN | **RED (i)** |
| `X4c` `export * as cpx from "node:child_process"` | GREEN | **RED (i)** |
| `X5` `createRequire(import.meta.url)("node:child_process").execSync(…)` | GREEN | **GREEN — hole** |
| `X5b` `const req = createRequire(…); req("child_process")` | GREEN | **GREEN — hole** |
| `X6` `process.getBuiltinModule("node:child_process")` | GREEN | **GREEN — hole** |
| `X7` `vi.importActual("node:child_process")` | GREEN | **GREEN — hole** |
| `X8` `import type { SpawnSyncReturns } from "node:child_process"` | GREEN | RED (i) — new false red |
| `X8b` `import { spawnSync, type SpawnSyncReturns }` | RED | RED (i) |
| `X8c` `typeof import("node:child_process")`, type position only | GREEN | GREEN |
| `X9` `import("node:child_process").then((m) => m.execSync(…))` | GREEN | **RED (i)**; (ii) does not see `m.` (soft) |
| `C1` `spawnSync?.(…)` | GREEN | **RED (ii)** |
| `C2` `spawnSync.call(…)` | GREEN | **RED (ii)** |
| `C3` `spawnSync.apply(…)` | GREEN | **RED (ii)** |
| `C3b` `spawnSync?.call(…)` | GREEN | **RED (ii)** |
| `C4` `spawnSync["call"](…)` (computed member) | GREEN | **RED (ii)** |
| `C5` `(spawnSync)(…)` | GREEN | **GREEN — hole** |
| `C6` `(0, spawnSync)(…)` | GREEN | **GREEN — hole** |
| `C7` `spawnSync!(…)` | GREEN | **GREEN — hole** |
| `C8` `(spawnSync as typeof spawnSync)(…)` | GREEN | **GREEN — hole** |
| `C9` `` spawnSync`true` `` (tagged template) | GREEN | GREEN — cannot spawn (`ERR_INVALID_ARG_TYPE`, `c9-tagged.out.txt`) |
| `C10` `Reflect.apply(spawnSync, …)` | GREEN | GREEN — alias class |
| `C11` call nested in a `.map` callback | RED | RED (ii) |
| `C12` shadowed parameter named `spawnSync`, called | RED (regex) | RED (ii) — false red, fail-loud |
| `C13` `/a/.exec("a")` + local `obj.execSync()` | GREEN | GREEN (no false count) |
| `C14` `"child_process"` strings as array and argument values | GREEN | GREEN (no false count) |
| `C15` `import("./child_process.ts")` lookalike | GREEN | GREEN |

- Plants that would break the module at runtime (`require` in ESM, `getBuiltinModule`, `vi.*`) sit
  inside never-called arrow functions. The pin is a static instrument, so it is the only thing that
  can red them.
- `X2c` in `plants-*.out.txt` is a **recipe error**: `run` collides with the file's own helper at
  `:657`. It is re-run fixed in `plants2-head.out.txt`.
- **Soft re-runs** (`plants2`) make count (i)'s `expect` an `expect.soft`, so count (ii) also
  reports.
  - `P1`, `Q13`, `X1` and `X2` red BOTH counts (`cp.execSync`, `cp.spawnSync`, `execSync`,
    `cpd.execSync`). The engineer's "`P1` reds on both counts" holds.
  - `X9` reds (i) only.
  - A soft-only control is GREEN 67.

## `A2` literal count (`../probe/literals.cjs`)

On head there are 2 `(node:)child_process` literals: `:32` (the specifier) and `:1708`
(`ArrayLiteralExpression`, bar 1's word list, `:1706` before the 2 added import lines). Count (i)
counts 1.

## `A4`, IN SITU (`../probe/a4.sh`, `a4-require.out.txt`)

`process.cpuUsage` marks were planted around the delivered pin's own lines in an out-of-tree copy.
This times the delivered code inside a real vitest worker, not a transcription. There were 9 fresh
`npx vitest run src/cli.test.ts` processes, with round 0 discarded, and every run was 67 passed.

| form | n | load1 | load median | parse+walk median | **total median** | range |
|---|---|---|---|---|---|---|
| `createRequire` (delivered) | 8 | 9.83–11.08 (median 10.1) | 95.9 ms | 80.5 ms | **173.2 ms** | 152.8–254.4 |
| ESM `await import` (swap) | 8 | 6.88–9.18 | 204.4 ms | 66.1 ms | **268.1 ms** | 263.5–290.2 |
| plain node, load only, `createRequire` (`load-form.out.txt`) | 8 | 6.8–7.1 | 84.9 ms | — | — | 80.2–90.0 |
| plain node, load only, ESM import | 8 | 6.8–7.1 | 126.1 ms | — | — | 119.3–134.6 |

- **`A4` MET**: 173.2 ms ≤ 250 ms. One single round, round 1 at load1 9.8, read 254.4 ms. The bound
  is on the median.
- The engineer read 162.0 ms in plain node and 156.5 ms in vitest. QE's in-situ reading is about
  11 % higher, at a higher load1.
- **The ESM form breaches `A4`** (268.1 ms), which confirms the engineer's ~280 ms.
- `typescript` is loaded once, at `:1858`, inside the pin's `it`. There is one `createSourceFile`,
  at `:1859`. No other `src/*.test.ts` names `typescript`.

## `A5`

- `git diff --name-only 8be650e6 cd594b5f` = `src/cli.test.ts`, +88/−9.
- `8be650e6..82104f70` adds only the ticket page, `plans/traceability.md` and the engineer's
  `.grugops/context/ticket-to-pr-ABC-133/`.
- Manifest numstat is empty, and 0 files were added under `src/`.
- The zero-production-lines grep is empty: exit 1, no match.
- The `it(` count is 67 on both base and head, and `N8_SPAWN` is `17 + 7 + 1 + 2`.
- Two hunks: the import block and the pin.

## Gates at `82104f70` (`../probe/gates.txt`, load1 5.8)

- `npm run lint` exit 0 (98 files).
- `npm run typecheck` exit 0.
- `npm run build` exit 0.
- `npm test` exit 0: 51 files / **1584 passed**.
- The skip count (`--reporter=json`, pending + todo) is **0**.
- `test-skip-integrity.js … --skip-count 0`: `No findings.`, exit 0.
- `lane-inventory.js`: 51/51, `No findings.`, exit 0.
- **Deep lanes not run, by trigger.** No `src/cli.ts` or engine file changed, so `CLI_DEEP` and
  `PUZZLE_DEEP` are not triggered (`AGENTS.md`).
