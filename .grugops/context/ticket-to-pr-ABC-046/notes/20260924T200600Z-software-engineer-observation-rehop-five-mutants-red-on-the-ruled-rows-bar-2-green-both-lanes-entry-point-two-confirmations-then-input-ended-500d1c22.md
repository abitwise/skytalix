---
id: 20260924T200600Z-software-engineer-observation-rehop-five-mutants-red-on-the-ruled-rows-bar-2-green-both-lanes-entry-point-two-confirmations-then-input-ended-500d1c22
kind: observation
by: software-engineer
at: 2026-09-24T20:06:00Z
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
  - .grugops/context/ruling-abc046-clause6/notes/20260924T195200Z-architect-design-observation-disarm-shape-probed-out-of-tree-bar-2-stays-green-three-rows-each-watched-red-on-its-mutant-5c1a7e93.md
supersedes:
---

# Re-hop at `85b66c6`: each of the five mutants turns its ruled row red, `ABC-037` bar 2 is green in both lanes, and the real entry point shows 2 confirmations and ends on `input ended`

**NOT A STAMP.** Everything below was RUN in the worktree against the committed tree `85b66c6`, from
`raw-rehop-mutants-harness.mjs.txt`. Raw output: `raw-rehop-mutants-console.txt` and
`raw-rehop-mutants-summary.json.txt`. Each mutant was written into `src/`, measured, and the
pristine bytes were written back. After the run, both production files' sha256 matched the start,
and `git status --short -- src` was **empty**. Load average ran 19.7 to 25.3 during the run.

## The mutant table (`vitest run` on `command-input.test.ts` + `line-input.test.ts` + `cli.test.ts`, 228 rows)

| mutant | what it does | `tsc` | red | which rows |
| --- | --- | --- | --- | --- |
| control | none | 0 | **0 / 228** | none |
| `Q3` | arm on `line.trim().toLowerCase().startsWith("quit")` | 0 | **1** | `G1` (command-input) |
| `X1` | `disarm` is a no-op | 0 | **2** | disarm unit row (command-input); clause-6 reader row (line-input) |
| `X2` | the reader does not call `resolve.disarm()` | 0 | **1** | clause-6 reader row (line-input) only |
| `X3` | `disarm` sets `quitArmed = true` | 0 | **2** | disarm unit row; clause-6 reader row |
| `M9` | the reader returns bare `resolvePromptLine(history, line.text, deps)` | 0 | **2** | clause-6 reader row (line-input); `cli.test.ts` `A2/A3` child |

This matches the ruling's table row for row (R1 ← `Q3`; R2 ← `X1`, `X3`; R3 ← `X1`, `X2`, `X3`,
`M9`). **`M9` now goes red in `line-input.test.ts`**, so QE's `G2-INFO` is closed in-file. Before
this hop, the `CHILDREN.quits` child was its only guard.

## `ABC-037` security bar 2, both lanes (`npx vitest run src/line-input.test.ts`)

- **Default lane:** the file is **30 / 30**, 0 skipped. All 8 bar-2 rows pass: the 7 existing rows
  plus the new clause-6 row, which sits inside bar 2's `describe`.
- **Deep lane** (`INPUT_DEEP=1`, `NODE_OPTIONS=--expose-gc`): the file is **34 / 34**, 0 skipped.
  All 8 bar-2 rows pass, and so do all 4 deep breadth rows:
  - 16 MiB flood;
  - retains no more than one chunk (`--expose-gc`);
  - chunk-boundary permutation;
  - 10,000-character totality.
- The ruling probed 33 deep rows. The +1 is this hop's row.

## The real entry point (`node src/cli.ts --colour white --ascii`, with `engine.ts` substituted by an `--import` hook whose engine throws if asked)

| stdin | exit | stderr | prompts | confirmations | `line too long` | ends on |
| --- | --- | --- | --- | --- | --- | --- |
| `quit` / 1025×`x` / `quit` / EOF | 0 | empty | 4 | **2** | 1 | **`> input ended`** |
| `quit` / 1025×`x` / `quit` / `quit` | 0 | empty | 4 | 2 | 1 | `> quit` (`QUIT_NOTICE`) |

- The EOF transcript is 93 lines, `raw-rehop-entry-quit-over-quit-EOF.stdout.txt`. Its message lines
  in order are:
  - line 44 `quit again to end`
  - line 67 `line too long`
  - line 90 `quit again to end`
  - line 93 `> input ended`
- The engine was never asked, so the substitution affects nothing on these inputs.
