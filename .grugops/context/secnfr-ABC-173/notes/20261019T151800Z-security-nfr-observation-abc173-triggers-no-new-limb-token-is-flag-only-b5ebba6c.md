---
id: 20261019T151800Z-security-nfr-observation-abc173-triggers-no-new-limb-token-is-flag-only-b5ebba6c
kind: observation
by: security-nfr
task: secnfr-ABC-173
at: 2026-10-19T15:18:00Z
verified_by:
confidence: high
sealed: false
refs:
  - ABC-173
  - ADR-0008
  - ABC-119
  - QE-173-b
  - QE-173-e
  - SEC-173-2
  - SEC-173-3
  - V1.2.5
  - V2.2.1
  - .grugops/context/secnfr-ABC-173/probe/token-fuzz.mjs
  - .grugops/context/secnfr-ABC-173/probe/token-fuzz.out
  - .grugops/context/secnfr-ABC-173/probe/node-flags.out
supersedes:
---

# `ABC-173` at `9c97dd23`: the triggers. The guard adds no capability limb, and the `CLI_DEEP` heap token can only ever be `--max-old-space-size=<digits>`

Hand-authored and unsealed. `scripts/context-io.ts` is absent from this install, as earlier hops on this ticket recorded.
Scratch detached worktree `../wt-secnfr-ABC-173` at `9c97dd23`; diff read against `68bbf33f`. Node v26.11.1, vitest
4.1.11. Production lines: 0 (`src/` changes are `*.test.ts` only, QE's and the SE's measurement, not re-disputed).

**Surface.** Tooling only: `tools/grugops/heap-guard.js` (new), `tools/grugops/run-bounded.js` (header comment only),
`package.json` (`test`, `test:watch` values), `vitest.config.ts` (one `globalSetup` path string, one comment), `AGENTS.md`
lane lines, and test files. No auth, personal data, network, file upload, migration, queue or public API. ASVS L1
items that apply: `V1.2.5` (OS command injection) and `V2.2.1` (allow-list validation of an input that makes a
decision). Every other L1 item is N/A for a local test-lane change.

## 1. No new capability limb (ruled: none added)

| limb | `heap-guard.js` | the new test code | already present before `ABC-173`? |
|---|---|---|---|
| fs read | none | `src/cli.test.ts` reads `AGENTS.md`, `package.json`, `src/**/*.test.ts` | yes: base `src/cli.test.ts:91`, `:1114`, `:1762` read the same kinds of file |
| fs write | none | none | n/a (`result-file-reporter.js` already writes `.test-results/`, in the same main process) |
| child process | none | 2 new children: `heapProbe` via `childOf` (fixed `-e` literal), `CLI_DEEP` probe via `spawnNode` (fixed `-e` literal, `env: CHILD_ENV` = `{}`) | yes: both files already spawn `process.execPath` with array argv, no `shell`, a `timeout` |
| code load | imports `node:v8`, `node:worker_threads` only | `typescript` via `createRequire` | yes: base `src/cli.test.ts:34-35` |
| env write / re-exec | none | none | n/a |
| network | none | none | n/a |
| repo JS in vitest's main process | `globalSetup` | — | yes: `result-file-reporter.js` already runs there as a reporter |

- The `import * as cp from "child_process"` and `spawnSync(...)` lines in the diff are **string fixtures** that the
  `C2` / `A6 (static)` rows parse with the TypeScript parser. They are never executed.
- The guard's only effects are a `throw` and `project.provide("heapRowMiB", row)`. Its error text carries a limit, a
  row, a file count and a flag. No secret and no path outside the repository.

## 2. `NODE_OPTIONS` cannot be turned into code injection (ruled: it cannot, `V1.2.5` / `V2.2.1` met)

**The `CLI_DEEP` token.** `src/cli.real-engine.test.ts` `heapToken()`:
`(process.env.NODE_OPTIONS ?? "").match(/(?:^|\s)(--max-old-space-size=\d+)(?=\s|$)/g)?.at(-1)?.trim()`.
- **Read from the code:** each match is one optional leading whitespace character plus the literal
  `--max-old-space-size=` plus `\d+` (ASCII `[0-9]` without the `u` flag). The lookahead is not consumed. `trim()`
  removes exactly the class `\s` matched. So the token is `--max-old-space-size=[0-9]+` and nothing else. With no
  match it **throws** (fails closed), so the child never runs at Node's default heap.
- **Read by fuzz** (`probe/token-fuzz.mjs`, which extracts the regex verbatim from the file at `9c97dd23`):
  200,016 strings (16 hand cases, 200,000 random strings over separators, quotes, `;`, `$(`, backticks, `|`, `&`,
  `--import=`, Unicode spaces and Arabic-Indic digits). 567 of them yield a token. **0 of those tokens are anything
  other than `^--max-old-space-size=[0-9]+$`.** Cases such as `…=128;--import=evil.mjs`, `…=128$(touch x)`, `…=12a`,
  `…=١٢٣` and the quoted form yield no token, so the call throws.
- **How it crosses:** as **one element of an argv array** to `spawnSync(process.execPath, …)`, before the entry point,
  with no `shell` and `env: {}`. No shell parses it. `NODE_OPTIONS` itself never reaches the child. So the header's
  guarantee against a `--import` double holds: an `--import=` beside the heap flag in the parent's `NODE_OPTIONS` is
  dropped (`probe/token-fuzz.out`, case 5).
- **The worst a hostile value can do** is pick a large heap, such as `--max-old-space-size=999999999999`. That is a
  resource choice the person typing the command already holds, not code execution.

**The other carriers.** `scripts.test` / `test:watch` hard-code the value, and `A10` pins them byte for byte. The
`AGENTS.md` lines are text that people and agents type, and `A3` parses them; no test executes them. Children of
`childOf`, `history-pane.nfr` and `transposition` inherit the worker's environment exactly as they did before
`ABC-173`. The cap adds nothing to that inheritance.

## 3. Edges recorded (INFO, no fix required)

- **`SEC-173-2` (INFO): a mixed-spelling `NODE_OPTIONS` can split the main process from a `CLI_DEEP` child, and the
  lane catches it.**
  - Node takes the last heap flag across both spellings (`probe/node-flags.out`). So
    `NODE_OPTIONS="--max-old-space-size=4000 --max_old_space_size=100"` gives main **196 MiB**, and the guard admits
    the run.
  - `heapToken` matches only the dash spelling and picks `=4000`, so a `CLI_DEEP` child gets **4096 MiB**.
  - The `CLI_DEEP` `A6` probe is built the same way (`nodeArgv`, `CHILD_ENV`), so it reads 4096 MiB against the
    496 MiB row and **goes red**. Shown by the same construction in scratch, not run in the lane.
  - Typing that value is a self-inflicted error, and it is not silent. This is the mirror of `QE-173-b`'s underscore
    case, which `9c97dd23` closed for argv.
- **`SEC-173-3` (INFO):** `npm test` and `test:watch` now **replace** any `NODE_OPTIONS` the caller set, such as a
  developer's own `--require` hook. That narrows what a run carries; it does not widen it. The `VAR=value cmd` script
  form is POSIX-shell only. Windows is out of the ticket's scope.
