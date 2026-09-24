---
id: 20260924T201700Z-qe-e2e-observation-abc046-delta-mutants-five-ruled-reproduced-to-the-row-five-more-x4-disarm-before-check-red-x6-equivalent-3e8d6e0e
kind: observation
by: qe-e2e
at: 2026-09-24T20:17:00Z
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
  - .grugops/context/ticket-to-pr-ABC-046/notes/20260924T200600Z-software-engineer-observation-rehop-five-mutants-red-on-the-ruled-rows-bar-2-green-both-lanes-entry-point-two-confirmations-then-input-ended-500d1c22.md
supersedes:
---

# `ABC-046` delta mutant ledger: all five ruled mutants reproduced to the row. QE ran five more: four go red, and `X6` is equivalent. Seven sequences were traced through the seam under every mutant. Bar 2 is green in both lanes, and the entry point gives two confirmations.

**NOT A STAMP.** The harness is `raw-delta-harness.mjs.txt`, with per-mutant JSON in
`raw-delta-summary.json.txt` and console output in `raw-delta-console.txt`. For each mutant, the
harness wrote the change into the named production file and ran `npx tsc --noEmit` (exit 0 on all
10: every mutant typechecks). Then it ran `npx vitest run` over `src/command-input.test.ts` (133),
`src/line-input.test.ts` (30) and `src/cli.test.ts` (65), 228 rows in all, and ran a sequence probe
in a child process. Finally it wrote the pristine bytes back. After every round, `sha256` matched
and `git status --porcelain -- src` was empty; the harness throws otherwise. Load average was
4.3–5.3 (1-min). The ruled five use the Engineer's anchors verbatim
(`raw-rehop-mutants-harness.mjs.txt`).

## The table (red rows per file: `command-input` / `line-input` / `cli`)

| id | file | what | red | which rows |
| --- | --- | --- | --- | --- |
| control | — | unmutated | **0 / 228** | — |
| `Q3` | `command-input.ts` | the arm is `startsWith("quit")` | **1** (1/0/0) | `G1` |
| `X1` | `command-input.ts` | `disarm` is a no-op | **2** (1/1/0) | the disarm unit row; the clause-6 reader row |
| `X2` | `line-input.ts` | the reader does not call `resolve.disarm()` | **1** (0/1/0) | the clause-6 reader row |
| `X3` | `command-input.ts` | `disarm` sets `quitArmed = true` | **2** (1/1/0) | the disarm unit row; the clause-6 reader row |
| `M9` | `line-input.ts` | the reader returns bare `resolvePromptLine(history, line.text, deps)` | **2** (0/1/1) | the clause-6 reader row; `cli` `A2/A3 — quit / quit ends the session on QUIT_NOTICE` |
| **`X4`** | `line-input.ts` | **the disarm moves BEFORE the length check**, so every non-`eof` line disarms before it is resolved | **2** (0/1/1) | the clause-6 reader row; `cli` `A2/A3` |
| `X5` | `line-input.ts` | the disarm moves before the NULL check, so every read disarms, `eof` included | **2** (0/1/1) | the same two as `X4` |
| `X6` | `command-input.ts` | `disarm` sets `quitArmed = classifyCommand("")?.token === "quit"` (it consults the table) | **0** | **NONE: EQUIVALENT.** `classifyCommand("")` is `undefined`, so the flag is set to `false` exactly as delivered. All seven sequences are identical to the control. This is not a gap. |
| `X7` | `line-input.ts` | the over-cap branch disarms AND calls `resolve(history, line.text)` | **4** (0/4/0) | `ABC-037` bar 2: 1025 on LF, 1025 on CRLF, "never passes it to a resolver", and the clause-6 reader row |
| `X8` | `command-input.ts` | `disarm` TOGGLES the flag | **1** (1/0/0) | the disarm unit row (its unarmed half) |

**The ruled five match the Engineer's table row for row and count for count:** `Q3` 1, `X1` 2,
`X2` 1, `X3` 2, `M9` 2. They also match the ruling's R1 ← `Q3`, R2 ← `X1`, `X3`, and R3 ← `X1`,
`X2`, `X3`, `M9`.

## The sequences asked for, through `createLineInputSeam` (start position, one seam per sequence, stdin then end)

Each outcome below is the delivered product's (the control). "RED" means that every mutant that
changes this sequence's outcome is caught by at least one row. "NONE" means that no row plays the
sequence.

| seq | lines | product | mutants that change it | rows |
| --- | --- | --- | --- | --- |
| S0 | `quit` / `quit` | confirmation, `quit` | `M9`, `X4`, `X5`: confirmation twice, then `eof` | **RED** (`cli` `A2/A3`, the reader row) |
| S1 | `quit` / 1025 / `quit` / EOF | confirmation, `line too long`, **confirmation**, `eof` | `X1`, `X2`, `X3`: the third line ENDS on `quit` | **RED** (the reader row) |
| S2 | `quit` / 1025 / `quit` / `quit` (the ruled row) | confirmation, `line too long`, confirmation, `quit` | `X1`, `X2`, `X3` end one line early; `M9`, `X4`, `X5` never end | **RED** (it is the reader row) |
| **S3** | **`quit` / 1025 / `new` / `quit` / `quit`** | confirmation, `line too long`, `take-back:0`, confirmation, `quit` | `M9`, `X4`, `X5` only (the trailing `quit`/`quit`). **`X1`, `X2`, `X3` and `X8` do NOT change it**: `new` clears the flag itself, so a broken disarm is masked on this sequence | **NONE** plays the sequence. No distinguishing mutant survives, though. Every mutant that changes it is red elsewhere |
| **S4** | **1025 / `quit` / `quit`** (disarm on an UNARMED resolver, then a normal exit) | `line too long`, confirmation, `quit` | **`X3`, `X8`**: the over-cap line ARMS, so the FIRST `quit` exits with no confirmation. `M9`, `X4`, `X5` never end | **RED** (`X3` and `X8` by the disarm unit row's unarmed half; `X3` by the reader row too) |
| S5 | `quit` / 1025 / 1025 / `quit` / `quit` | confirmation, `line too long` ×2, confirmation, `quit` | `X1`, `X2`, `X3`, `X8` (`X8` toggles back to armed on the second over-cap line); `M9`, `X4`, `X5` | **RED** (`X8` by the unit row, the rest by the reader row) |
| S6 | `quit` / 1024 / `quit` / EOF (the at-cap control) | confirmation, `type e2e4 or Nf3`, confirmation, `eof` | none of the ten | the at-cap line reaches the resolver and clears the flag by resolution |

**`X4` answers the brief's question, "does anything notice?" YES, two rows.** A disarm placed
before the length check runs on the second `quit` too and clears the flag that `quit` / `quit`
needs. The product would never end on `quit`. `cli` `A2/A3` and the clause-6 reader row both go red.

## `ABC-037` security bar 2, both lanes (`npx vitest run src/line-input.test.ts`, delivered tree)

- **Default lane:** the file is **30 / 30**, 0 failed, 0 skipped. All 8 `security bar 2` rows
  passed, including the clause-6 reader row.
- **Deep lane** (`INPUT_DEEP=1`, `NODE_OPTIONS=--expose-gc`): the file is **34 / 34**, 0 failed,
  0 skipped. The 8 bar-2 rows passed, and so did all 4 `breadth [deep]` rows:
  - the 16 MiB flood;
  - retains no more than one chunk;
  - the chunk-boundary permutation;
  - 10,000-character totality.

## The real entry point: `node src/cli.ts --colour white --ascii`, with `engine.ts` substituted by an `--import` hook whose engine throws if asked

| stdin | exit | stderr | lines | prompts | confirmations | `line too long` | ends |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `quit` / 1025×`x` / `quit` / EOF | 0 | empty | 93 | 4 | **2** | 1 | **`> input ended`** |
| `quit` / 1025×`x` / `quit` / `quit` | 0 | empty | 93 | 4 | 2 | 1 | **`> quit`** (`QUIT_NOTICE`) |

- In both transcripts the message lines are:
  - line 44 `quit again to end`
  - lines 67–68 `line too long` / `max 1024 chars`
  - line 90 `quit again to end`
  - line 93, the end
- `diff` of the two transcripts shows only line 93 differs (`input ended` / `quit`).
- The engine was never asked, so the substitution affects nothing on these inputs.
- Raw: `raw-delta-entry-quit-over-quit-EOF.stdout.txt`, `raw-delta-entry-quit-over-quit-quit.stdout.txt`.
