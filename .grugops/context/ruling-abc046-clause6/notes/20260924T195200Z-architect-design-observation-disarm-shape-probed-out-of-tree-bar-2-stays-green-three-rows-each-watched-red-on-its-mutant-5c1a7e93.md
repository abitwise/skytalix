---
id: 20260924T195200Z-architect-design-observation-disarm-shape-probed-out-of-tree-bar-2-stays-green-three-rows-each-watched-red-on-its-mutant-5c1a7e93
kind: observation
by: architect-design
at: 2026-09-24T19:52:00Z
verified_by:
confidence: high
refs:
  - ABC-046
  - ABC-037
  - ADR-0021
  - src/command-input.ts
  - src/line-input.ts
  - src/command-input.test.ts
  - src/line-input.test.ts
  - src/cli.test.ts
  - .grugops/context/qe-ABC-046/notes/20260924T194100Z-qe-e2e-observation-abc046-mutant-ledger-nine-reproduced-to-the-row-nine-more-q3-prefix-arm-survives-q9-proves-overcap-fix-needs-a-surface-9868da88.md
supersedes:
---

# The `disarm` shape, probed out of tree: `ABC-037` bar 2 stays green, and each of the three new rows went red on its own mutant

**NOT A STAMP.** `context.human_admission` is `off`, so no `finding` can be admitted on this install.
This note is hand-authored, as earlier hops here were, because no sanctioned `context-io` writer or
`propose_note` tool is reachable from this repo or session. Everything below was RUN.

**Where it ran:** a scratch copy of `src/`, `package.json`, `tsconfig.json`, `biome.json`,
`vitest.config.ts` and `AGENTS.md`, taken from `grugops/wave-2026-09-24` @ `d68c10e`. The copy sat in
the session scratchpad, outside the repository, with the main checkout's `node_modules` symlinked in.
The start hashes are `command-input.ts` `4eb49f40…` and `line-input.ts` `6b8ee298…`, the same as
QE's. After the run all four touched files were restored in the copy and each sha256 was asserted
equal. **The worktree's `src/` was never written:** `git status --short -- src` is empty.
The first run left out `AGENTS.md`, so 5 `cli.test.ts` rows (`ABC-042`/`ABC-065`, which read
`AGENTS.md`) were red on EVERY shape, the unmutated one included. That was an environment gap, not a
result. The run recorded here includes the file. Load average was 3.7 to 11.6. Raw files sit next to
this note: `raw-probe-harness.mjs.txt`, `raw-probe-summary.json.txt` and `raw-probe-console.txt`.

## The shape probed (`LICENSED-disarm`): +14 / −3 across both production files (`command-input.ts` +10 / −2, `line-input.ts` +4 / −1, by `git diff --no-index --numstat`)

- `src/command-input.ts`:
  - `PromptLineResolver` becomes `((history, line) => PromptLineOutcome) & { readonly disarm: () => void }`.
  - `createPromptLineResolver` names its closure `resolve` and returns
    `Object.assign(resolve, { disarm: () => { quitArmed = false; } })`.
  - The resolve body is byte-identical.
- `src/line-input.ts:245`: `if (line.overlong) return { kind: "rejected", messages: LINE_TOO_LONG_MESSAGES };`
  becomes a block that calls `resolve.disarm();` and then returns the SAME object.
  - One code line is added, plus the braces.
- The exact diff is in `raw-probe-summary.json.txt` → `shapes["LICENSED-disarm"].diff`.
- The existing call sites are unchanged: 13 in `command-input.test.ts`, 1 in `line-input.ts`.
- `npx tsc --noEmit` passes (0) and `npx biome check` on the two files reports no fixes.

## Three probe rows, appended in the copy only

- **R1 (`command-input.test.ts`, `G1`):**
  - `quit` / `quit now` / `quit` answers confirmation, then `rejected`, then confirmation AGAIN.
  - On a fresh resolver, `quit now` twice is `rejected` twice.
- **R2 (`command-input.test.ts`, the disarm unit):**
  - `quit`, then `disarm()`, then `quit` answers confirmation (the flag was cleared). A further
    `quit` gives `{ kind: "quit" }`.
  - On an unarmed resolver, `disarm()` then `quit` then `quit` gives confirmation, then `quit`. A
    no-op disarm is harmless.
  - All four `deps` spies are called **0** times, so `disarm` consults no resolver.
- **R3 (`line-input.test.ts`, the clause-6 wiring through `createLineInputSeam`):**
  - `quit` / 1025×`z` / `quit` / `quit` answers confirmation, then `rejected` + `LINE_TOO_LONG_MESSAGES`,
    then confirmation, then `{ kind: "quit" }`.
  - `texts` is `[]` and `legalMoves` is called 0 times.
  - The fourth line is the `G2-INFO` row QE recommended: the reader binds the wrapper.

## The ledger (existing rows = unmodified test files; probe = with R1–R3 appended)

| shape | `tsc` | `command-input` (131) | `line-input` (29) | `line-input` deep (33, `INPUT_DEEP=1`, `--expose-gc`) | `cli` (65) | probe rows red |
|---|---|---|---|---|---|---|
| `delivered` (today's `6cdde15` code) | 0 | 0 | 0 | 0 | 0 | **R2, R3** (R2 does not typecheck: `disarm` does not exist yet) |
| **`LICENSED-disarm`** | **0** | **0** | **0** | **0** | **0** | **none: 133/133, 30/30** |
| `X1` disarm is a no-op | 0 | 0 | 0 | 0 | 0 | **R2, R3** |
| `X2` disarm exists, reader does not call it | 0 | 0 | 0 | 0 | 0 | **R3 only** |
| `X3` disarm ARMS the flag | 0 | 0 | 0 | 0 | 0 | **R2, R3** |
| `Q9a` reader calls `resolve(history, "")`, then rejects | 0 | 0 | **3** | **6** | 0 | R2 (type), R3 |
| `Q9b` reader returns `resolve(history, "")` | 0 | 0 | **3** | **6** | 0 | R2 (type), R3 |
| `Q3` prefix arm, on the licensed shape | 0 | 0 | 0 | 0 | 0 | **R1 only** |
| `M9` reader bypasses the wrapper, on the licensed shape | 0 | 0 | 0 | 0 | **1** (`A2/A3` child) | **R3** (4th line) |

**Full lane** (`npx vitest run --dir=src`, JSON reporter):

- `delivered`, unmodified tests: **1361 / 1361, 0 skipped**, the same as QE's figure.
- `LICENSED-disarm`, unmodified tests: **1361 / 1361, 0 red, 0 skipped**.
- `LICENSED-disarm` with R1–R3: **1364 / 1364, 0 red, 0 skipped**.
- `delivered` with R1–R3: 1362 / 1364, with R2 and R3 red.

## The real entry point (`node src/cli.ts --colour white --ascii`, engine scripted by QE's `--import` hook)

| stdin | delivered | licensed |
|---|---|---|
| `quit` / 1025×`x` / `quit` / EOF | 3 prompts, 1 confirmation, **ends on `QUIT_NOTICE`** (QE's edge 7, reproduced) | 4 prompts, **2 confirmations**, ends on **`input ended`** |
| `quit` / 1025×`x` / `quit` / `quit` | 3 prompts, ends on `QUIT_NOTICE`; the 4th line is never read | 4 prompts, 2 confirmations, ends on `QUIT_NOTICE` |

Every run exited 0 with stderr empty.

## What the numbers say

1. **Bar 2 holds under the disarm.** All 3 of `ABC-037`'s security-bar-2 rows that `Q9` reds are
   green, and so are all 3 deep flood/breadth rows that `Q9` also reds. The deep figures are new
   here; QE ran only the default lane. The reason is structural: `disarm` takes no line and calls
   nothing below the wrapper, so the over-cap text still reaches no resolver and `texts` stays `[]`.
2. **Each row guards its own thing.**
   - R3 is the only row that catches an unwired disarm (`X2`).
   - R1 is the only row that catches `Q3`, which QE found surviving 0 of 225.
   - R2 and R3 both catch a wrong disarm body (`X1`, `X3`).
   - R3's fourth line catches `M9` in-file. Until now `CHILDREN.quits` was the only guard on it.
3. **The disarm adds 0 files, 0 children and +3 rows**, all in existing files. `N8-LANE`'s
   file and child counts are unchanged.
