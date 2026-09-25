---
id: 20260924T194100Z-qe-e2e-observation-abc046-mutant-ledger-nine-reproduced-to-the-row-nine-more-q3-prefix-arm-survives-q9-proves-overcap-fix-needs-a-surface-9868da88
kind: observation
by: qe-e2e
at: 2026-09-24T19:41:00Z
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
supersedes:
---

# `ABC-046` mutant ledger: the Engineer's nine reproduced to the row, plus QE's nine. One survivor (`Q3`); one shape probe (`Q9`)

**Harness:** `raw-mutants-harness.mjs.txt`. Per-mutant JSON: `raw-mutants-summary.json.txt`. Console
output: `raw-mutants-console.txt`. Each mutant was written INTO the named production file. Then
`npx tsc --noEmit` ran (exit 0 on all 18: every mutant typechecks), followed by
`npx vitest run <file>` for **all three** of `src/command-input.test.ts` (131),
`src/line-input.test.ts` (29) and `src/cli.test.ts` (65). The original was then restored. After
every round, `sha256` restore = true and `git status --porcelain -- src` was empty. M1–M9 are
copied verbatim from the Engineer's `raw-mutants-harness.mjs.txt`. Run 2026-09-24 22:31–22:33
local, load 10.2 → 5.9.

| id | file | what | `command-input` (131) | `line-input` (29) | `cli` (65) |
| --- | --- | --- | --- | --- | --- |
| M1 | `command-input.ts` | flag never clears | **6** | 0 | 0 |
| M2 | `command-input.ts` | first `quit` exits | **11** | 0 | **3** (A2/A3, A6, A1 quit/EOF) |
| M3 | `command-input.ts` | module-level flag | **10** | 0 | 0 |
| M4 | `command-input.ts` | `new` → 2 plies | **2** (A4 ×2) | 0 | 0 |
| M5 | `command-input.ts` | `new` row → `command` | **6** | 0 | **1** (A6) |
| M6 | `command-input.ts` | confirmation 36 columns | **2** | 0 | **2** |
| M7 | `command-input.ts` | only commands clear | **3** | 0 | 0 |
| M8 | `command-input.ts` | no confirmation message | **11** (incl. the rewritten `ABC-035` fence row) | 0 | **2** |
| M9 | `line-input.ts` | reader calls bare `resolvePromptLine` | 0 | 0 | **1** (A2/A3) |
| Q1 | `line-input.ts` | **the literal one-line build**: `return createPromptLineResolver(deps)(history, line.text)`, a fresh wrapper per line | 0 | 0 | **1** (A2/A3) |
| Q2 | `line-input.ts` | one wrapper at the reader's MODULE scope (shared, and `deps` cannot be bound) | 0 | **8** (`ABC-037` A2/A3/A4/A5/A7, bar 2 ×2) | 0 |
| Q3 | `command-input.ts` | PREFIX arm: `quitArmed = line.trim().toLowerCase().startsWith("quit")`, so `quit` / `quit now` exits | **0** | **0** | **0** — **SURVIVES** (`G1`) |
| Q4 | `command-input.ts` | case-sensitive arm: `line.trim() === "quit"` | **1** (A1 quit/quit, the `QUIT`/`  Quit  ` half) | 0 | 0 |
| Q5 | `command-input.ts` | COMMANDS do not clear (only moves / rejected lines do) | **3** (quit/other/quit, loop quit/board/quit, quit/new/quit) | 0 | 0 |
| Q6 | `command-input.ts` | `new` at ply 0 guarded into `{ kind: "command", messages: [] }` (`ADR-0021` clause 4: the seam must not guard) | **4** (`ABC-035` A1 sweep `new`/`NEW`/`  New  `, A4 pure) | 0 | 0 |
| Q7 | `command-input.ts` | `new` carries `messages: ["new game"]` (clause 7 says `[]`) | **2** (A4 pure, A5 claim frame) | 0 | **1** (A6) |
| Q8 | `command-input.ts` | the wrapper delegates WITHOUT `deps` | **1** (A7 control) | **8** | 0 |
| Q9 | `line-input.ts` | **shape probe, not a defect**: the over-cap branch calls `resolve(history, "")` to clear the flag (the ADR-literal "any other line") | 0 | **3** (`ABC-037` security bar 2: 1025 on LF, 1025 on CRLF, "never passes it to a resolver") | 0 |
| CONTROL | — | unmutated | 131 / 131 | 29 / 29 | 65 / 65 |

## What the ledger says

- **The Engineer's table is exact.** All nine mutants gave the same red rows and the same counts in
  both of the files the Engineer ran. `line-input.test.ts`, which the Engineer ran only for M9, is
  0 red for M1–M8 as well.
- **`M9` and `Q1` are the same class**: the reader never keeps a per-session wrapper. Both are
  caught ONLY by `CHILDREN.quits`. That supports Ruling 2 in the sibling `decision`: the child is
  enough, and it is a single point (`G2-INFO`).
- **`Q3` survives, 0 of 225.** The no-argument fence (`"quit now"`, `"new game"`) covers
  `classifyCommand` and the pure `resolvePromptLine`, but not the wrapper's arming. The delivered
  build is correct: `quit now` is rejected and clears the flag (edge probe (4a/4b), sibling
  observation). No row would notice if that changed.
- **`Q9` shows why reading (2) cannot be fixed inside the licence.** The only way to clear the flag
  without a new wrapper method is to ask the resolver, and asking the resolver on an over-cap line
  breaks `ABC-037`'s memory/security bar. A compliant fix is a `disarm` on the wrapper plus a line
  in the reader. Both are outside `A8`'s amended licence.
- **`Q6` is well guarded.** The seam-side guard that `ADR-0021` clause 4 forbids turns 4 rows red,
  3 of them in the `ABC-035` spelling sweep, because `new` joined `TOKEN_SPELLINGS`.
