---
id: 20261010T103438Z-qe-e2e-observation-abc119-mutants-every-a3-a4-row-red-0e132e4a
kind: observation
by: qe-e2e
at: 2026-10-10T10:34:38Z
verified_by:
confidence: high
refs:
  - ABC-119
  - A1
  - A3
  - A4
  - A6
  - M2
  - src/cli.ts
  - src/cli.real-engine.test.ts
  - .grugops/context/qe-ABC-119/probe/mutants.txt
  - .grugops/context/qe-ABC-119/probe/mutate.js.txt
  - .grugops/context/qe-ABC-119/probe/run-mutant.sh.txt
  - .grugops/context/qe-ABC-119/probe/probe-p1-node-options.txt
  - .grugops/context/ticket-to-pr-ABC-119-r2/notes/raw-a6-mutants.diff.txt
supersedes:
---

# `ABC-119` mutants: `M2` re-planted RED/GREEN, and every `A3` and `A4` row now has a mutant that reds it. `M3c` is a second watched pair, for `A3`(ii)

Hand-authored, no seal. The runner is `run-mutant.sh` with `mutate.js`. Each mutant gets a fresh `git archive a6453bc` copy in the
scratchpad, with `node_modules` symlinked. `mutate.js` makes exact-string edits and refuses a missing anchor. The runner then runs
`CLI_DEEP=1 … run src/cli.real-engine.test.ts` and `env -u CLI_DEEP … run --dir src`. Every mutant is a rebind in `src/cli.ts`'s
**import block**, with line 175 (`engine: createEngine({ budgetMs: DEFAULT_BUDGET_MS })`) left byte-identical (1 match in each
copy), so the composition changes and `:2512`'s text does not. The exception is `M4b`, which also edits `src/turn-loop.ts`. Diffs
and full outcomes are in `probe/mutants.txt`. Nothing was planted in the repository.

| id | what changes | deep lane (rows red) | children | default lane |
|---|---|---|---|---|
| `M0` | nothing (control) | 7/7 green | 3111 / 3133 ms | **green** 1541 |
| **`M2`** | Engineer's, re-planted: `DEFAULT_BUDGET_MS` rebound to `undefined` | **`A1` only** | 141 / 141 ms | **GREEN 51 / 1541**: the watched pair `A6` asks for |
| `M3` | budget = `2 * HARD_CEILING_MS` | **`A3`(ii) only** | 5148 / 5133 ms | red 13, **an artifact**: the hooks' engine double exports no `HARD_CEILING_MS` |
| **`M3c`** | budget = `MERGED + MERGED` (6 s, clamped at 5 s), no literal, no new import name | **`A3`(ii) only** | 5154 / 5198 ms | **GREEN 51 / 1541**: a second watched pair. `A1` cannot see this one |
| `M3b` | budget = `4_500` | **all 7 green** | 4643 / 4624 ms | red 1, `ABC-042` `A8`'s numeric-literal guard (incidental) |
| `M4` | real search, then a foreign move (from/to swapped) handed to the loop | `A3`(i), `A3`(iii), `A4` | 3221 / 3136 ms | red 9 (the double's move is corrupted too) |
| `M4b` | real move pushed one rank (0x88 +16) **and** the loop's transition-13 guard off, so it is actually played and printed | **`A3`(i) only**: `expected [] to have a length of 1` at `:203` | 3157 / 3115 ms | red 10 |
| `M5a` | the engine wrapper writes an `Error` stack to stderr after its ply, exit stays 0 | `A3`(iv), `A4` | 3141 / 3123 ms | red 2, both **textual** guards (`ABC-042` `A9`, `ABC-043` `A1`) |
| `M5b` | `renderResultScreen` throws → `INTERNAL_ERROR`, exit 70 | `A1`, `A3`(iv), `A4` | 3312 / 3186 ms, exit 70 | red 21 |
| `M6a` | the input seam turns `rejected` into `eof` (the session ends on a bad line) | **`A4` only** | 3156 / 3117 ms | red 4 |
| `M6b` | the input seam drops `rejected.messages` (refused silently) | **`A4` only** | 3095 / 3099 ms | red 1, **the textual `ABC-043` `A1` "no adapter" row only**. No behavioural default-lane row sees it |

**Read against the task.**
- **`A3`(i)**: `M4b` reds it alone. It is the generator check itself, not a frame count.
- **`A3`(ii)**: `M3c` reds it alone, and the default lane stays green.
- **`A3`(iii)**: `M4` reds it.
- **`A3`(iv)**: `M5a` (stack, exit 0) and `M5b` (exit 70) red it.
- **`A4`**: `M6a` and `M6b` red it alone.
- **No `A3`/`A4` row is unkillable**, so nothing goes to the gap register as "cannot".

**What `M3b` shows:** a 4.5 s budget passes the whole deep lane (children 4.6 s). That is the 3–5 s blind band the page accepts under
`## Risks` (*"`A3`(ii) is loose by design"*), now measured.

**What the default lane catches is mostly textual.** `M4`, `M5a`, `M6a` and `M6b` are caught there partly or only by source-text
guards (`ABC-042` `A8`/`A9`, `ABC-043` `A1`). Those guards are pinned to a particular import shape, so a mutant planted
inside `src/engine.ts` or `src/line-input.ts` would not trip them. That is why the opt-in lane exists. It is not a defect here.

**P1, the `NODE_OPTIONS` leak** (Engineer decision 3, verified). `CLI_DEEP=1 NODE_OPTIONS=--import=<marker> npx vitest run
src/cli.real-engine.test.ts` gave exit 0, 7/7, and children of 3146 and 3170 ms.
- The marker loaded 10 times: npx, vitest and the tinypool workers.
- It loaded **0 times in `src/cli.ts`**.
- Armed control: the same marker on `node src/cli.ts --colour black --ascii </dev/null` gave 1 hit.
- So `env: {}` closes the route by which a double could leak into the "real" child.
