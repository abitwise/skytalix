---
subtask: ticket-to-pr-ABC-200
role: software-engineer
ticket: plans/tickets/ABC-200-on-a-terminal-npm-run-chess-asks-for-colour-and-difficulty-when-the-flags-are-absent.md
ref: .grugops/context/ticket-to-pr-ABC-200/
inputs: Architect …f612277c, …0d7cbff3 (arch-design-ABC-200) and the page's ## Build notes; BA/PM …2fddb7fa; Orchestrator …de0099fa
width: 2 (beside qe-ABC-199)
---

# Build ABC-200: the startup colour and difficulty questions on a TTY

## Do
- Create worktree `../wt-ABC-200` on `grugops/ABC-200` from `main`, with its own `npm ci --ignore-scripts`. Never run npm in main's checkout.
- Build exactly to the page's criteria and the Architect's `## Build notes`:
  - `src/line-reader.ts`: the shared reader;
  - `src/startup-questions.ts`;
  - the additive `cli-options.ts` changes;
  - the `cli.ts` wiring, keeping `process` at exactly 10 occurrences;
  - the A7 test, using the real seam, with plant P6 shown red.
- Red first: show each new test red before its code lands.
- Gates on the tip: lint, typecheck, build; `npm test` + `last-run.json` success; skip-count capture → `test-skip-integrity.js`; `CLI_DEEP`, `UCI_DEEP`, `PERFT_DEEP`. Heap 128 multi-file, 400 one-file.
- **This ticket has production lines, so UAT is not waived.** Say what the QE hand reading on a real terminal (A8) must cover, including Ctrl-D on a question.
- If the build needs anything the Architect's ruling does not cover (a new or changed ADR, a moved acceptance criterion), STOP and report it.
- **Merge order:** after ABC-178. Do not merge into `main`. No timing claims.

## Fences
- Only the files the build notes name. No `package*.json`, `tools/`, `AGENTS.md`, `plans/board.md` or `plans/traceability.md`. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/se200/`. Never push, force, amend or rebase.

## Publish
- Seal notes via the plugin writer (task `ticket-to-pr-ABC-200`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief, then move it to `done/`.

## Result

**Delivered, no STOP.** Branch `grugops/ABC-200` in worktree `../wt-ABC-200` (own `node_modules`, `npm ci --ignore-scripts`), from `main` `bd745ac9`. Tip **`0a07df04`**: `1efd2cee` (code and tests), then `0a07df04` (notes). Not pushed, not merged. No timing claim. `main` gained only records (`0cf13982`) while this ran; `ABC-178` has not landed, so the `main` merge-in (not a rebase) and a gate re-read are owed after it does.

Notes, sealed via `admitAndAppend` and read back 3/3 by `readContext`, in `../wt-ABC-200/.grugops/context/ticket-to-pr-ABC-200/notes/`:
- observation `…f274160a`: criteria, red-first, plants P1–P6;
- observation `…3ccb839a`: gates;
- decision `…11628f2f`.

### Per criterion
| crit | result |
|---|---|
| A1 | **MET**. 2 questions, colour first. Before the 2nd answer the output is exactly those 2 writes. Result: black, black-bottom, level 1. Case and spaces are ignored; `random` gives both colours over 64 runs |
| A2 | **MET**. Two empty lines give `resolveOptions([]).options`: white, white-bottom, flags off, 5 |
| A3 | **MET**. Both flags: 0 writes, no reader built. `--colour black`: only the difficulty question. `--difficulty 2`: only the colour question |
| A4 | **MET**. `purple`, `6`, `0`, `03` and 1 025 × `3` each give 1 rejection line that names the accepted set, then the same question. ESC/C0/DEL are filtered from the echo; the over-cap echo is `""` |
| A5 | **MET** (module + source row). End of input at either question gives `null`, and `cli.ts` then does `if (resolution === null) return;` inside the `try`, before the loop and the result screen. A real-process exit-0 reading is not spawned here |
| A6 | **MET**. Pipe on either side: 0 writes, 0 reads, 0 listeners, and the seam's first read is `e4`. `cli.test.ts` and `cli.real-engine.test.ts` have 0 edited lines and are green (CLI_DEEP 11/11) |
| A7 | **MET**. `black\n1\ne5\n` in one write, real seam, real `runTurnLoop`: e4, e5, Nf3, then eof, with no line dropped or read twice. **P6 reds it**: 1 ply; the game's first prompt read end of input and `e5` was lost |
| A8 | owed: QE hand reading on a real pty (coverage list in `…11628f2f`, including Ctrl-D at each question) |
| A9 | **MET**. In `cli.ts` source order, `askAbsentOptions(` comes before `createBookProbe(`, `readBookFile`, `beginGlyphModeSession(`, `newGame(` and `runTurnLoop(`. P5 reds it |

Plants: P1 → A6 ×4 red (by a hang, caught by the test timeout), P2 → A2, P3 → A7, P4 → A4 ESC row, P5 → A9, P6 → A7. Each was reverted and the file returned to 22/22.

Gates at tip:
- lint, typecheck and build: exit 0.
- `npm test`: 61 files / 2 017 tests, 0 failed, `last-run.json` `success: true`. Base by arithmetic is 60 / 1 995.
- Skips: 0, and the integrity check prints `No findings.`
- Deep lanes: CLI_DEEP 11, UCI_DEEP 5, PERFT_DEEP 32, and INPUT_DEEP 34 (extra; the reader moved).
- Heap 128 for multi-file runs, 400 for one-file runs.

**UAT is not waived** (production lines).

### Trace row
| ABC-200 (ticket-to-pr-ABC-200) | startup questions on a TTY: colour then difficulty when the flag is absent; Enter keeps white/5; one line reader per stream (EPIC-006 G6) | EPIC-006 | — | NFR-007 (A9 by order), NFR-008 (+1 file; not read); ADR-0036 (b1) fires → Security/NFR owed | grugops/ABC-200 @ 0a07df04 (code 1efd2cee)<br>new src/line-reader.ts, src/startup-questions.ts, src/startup-questions.test.ts; edited src/line-input.ts, src/cli-options.ts, src/cli.ts, src/line-input.test.ts (guards only); cli.test.ts + cli.real-engine.test.ts 0 lines; .grugops/context/ticket-to-pr-ABC-200/notes/ (3) | startup-questions.test.ts 22 rows (A1–A7, A9, module bars); red-first: missing module, base stub 16 red, cli rows 2 red; plants P1–P6 each red; lint/typecheck/build 0; npm test 61/2017, success true; skips 0, No findings.; CLI_DEEP 11, UCI_DEEP 5, PERFT_DEEP 32, INPUT_DEEP 34 | not waived (production lines); QE A1–A9 incl. A8 pty reading signs under …5aaf7cec item 2 | — | In Development → In Review (QE incl. A8, Security/NFR (b1) owed; merges after ABC-178, main merge-in owed) |
