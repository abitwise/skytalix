---
id: 20261022T193009Z-software-engineer-observation-f274160a
kind: observation
by: software-engineer
at: 2026-10-22T19:30:09Z
verified_by: 
confidence: high (every row and plant run under vitest in the worktree; outputs kept in scratch)
refs:
  - ABC-200
  - EPIC-006
  - G6
  - ABC-037
  - ADR-0011
  - ADR-0015
  - ADR-0016
  - ADR-0036
  - ADR-0042
  - bd745ac9
  - 1efd2cee
  - 20261022T191404Z-architect-design-decision-f612277c
  - 20261022T191359Z-architect-design-observation-0d7cbff3
  - plans/tickets/ABC-200-on-a-terminal-npm-run-chess-asks-for-colour-and-difficulty-when-the-flags-are-absent.md
supersedes: 
seal: sha256:e6798770e3484b0f08187e84282180d1615f242611686c57cede3c2be630f107
---

# ABC-200 built to the ruling: per-criterion readings, red-first and plants P1–P6 (P6 reds A7: the game's first prompt read end of input)

Software Engineer, task `ticket-to-pr-ABC-200`, 2026-10-22. Branch `grugops/ABC-200`, worktree `../wt-ABC-200`, from `main` `bd745ac9`. Code commit `1efd2cee`. Not pushed, not merged. No timing was taken. Raw outputs: `scratchpad/se200/` (session scratch, not committed).

## Files (all named by the Build notes)
- New: `src/line-reader.ts` (the `ABC-037` state machine, moved unchanged; `lineReaderOf` memoized by a module `WeakMap`), `src/startup-questions.ts` (`askAbsentOptions`), `src/startup-questions.test.ts` (22 rows).
- Edited: `src/line-input.ts` (reads through `lineReaderOf(source)`; re-exports `MAX_LINE_LENGTH` and `LineSource` from one import of `./line-reader.ts`), `src/cli-options.ts` (additive), `src/cli.ts` (R4 wiring), `src/line-input.test.ts` (guards only).
- `src/cli.test.ts` and `src/cli.real-engine.test.ts`: 0 lines edited (`git diff main --stat` empty for both).

## Per criterion (in-memory `PassThrough`, test-set `isTTY`, 0 spawns)
| crit | reading at tip |
|---|---|
| A1 | 2 questions, colour first; before the 2nd answer the output holds exactly the 2 questions (0 other bytes). Result black / black-bottom / difficulty 1. Extra rows: case and spaces ignored (`  BlAcK \r\n`, ` 2  `); answered `random` gives white and black over 64 runs, orientation following. GREEN |
| A2 | two empty lines → options `toEqual` `resolveOptions([]).options` = white / white-bottom / flags off / 5. Questions show `[white]`, `[5]`. GREEN |
| A3 | `--colour black --difficulty 3`: 0 writes, 0 `end` listeners on the source. `--colour black`: 1 write, the difficulty question. `--difficulty 2`: 1 write, the colour question. GREEN |
| A4 | `purple`: [colour, rejection, colour]; the rejection is one line, names `white|black|random`, echoes `purple`. `purple\x1b[2J\x07\x7f`: echo `purple[2J`, 0 C0/DEL bytes in all output. Difficulty `6`,`0`,`03`, 1 025 × `3`: 4 rejections, 5 questions, each names `1|2|3|4|5`; over-cap echo is `""`. Next valid answer accepted. GREEN |
| A5 | end at colour → `null`, writes [colour]; end at difficulty (with a held partial `3`) → `null`, writes [colour, difficulty]. Source row: `cli.ts` has `const resolution = await askAbsentOptions(parsed, { source: stdin, output: sink }); if (resolution === null) return;` after `try {` and before `runTurnLoop(` and `renderResultScreen(`. Exit 0 / no stack trace on a real run: by the wiring (no assignment, no throw), not spawned here. GREEN |
| A6 | module half: 4 rows (stdin pipe; stdout pipe; both pipes; `isTTY:false` both) → result = parsed options, 0 writes, `readableLength` 3 (line unread), 0 `end`/`data` listeners, then the real seam's first read is the move `e4`. Suite half: `cli.test.ts` and `cli.real-engine.test.ts` unedited and green (`npm test`; `CLI_DEEP` 11/11). GREEN |
| A7 | `black\n1\ne5\n` in ONE write + end, real `createLineInputSeam` over the same source inside a real `runTurnLoop` (human black, engine e2e4, g1f3): options black/1; 3 plies; final FEN `rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2`; outcome result null, exit 0; prompt writes exactly 2 (e5, then eof). GREEN |
| A8 | not mine: QE hand reading on a real pty |
| A9 | source order over `cli.ts` code: `askAbsentOptions(` precedes `createBookProbe(`, `readBookFile,`, `beginGlyphModeSession(`, `newGame(`, `runTurnLoop(`. GREEN |

Module bars (same file): runtime imports exactly `./cli-options.ts` and `./line-reader.ts`; no `process`, `console`, `globalThis`, `Buffer`, `node:`, `eval`, `Function`, `require`, dynamic import, `.on(`, `try`, `catch`, ESC spelling. GREEN.

## Red-first
1. `src/line-input.ts` switched to the reader first: `line-input.test.ts` import-set row RED (received +`./line-reader.ts`), 1 failed / 29 passed. Then the guard edit; 30/30.
2. Guard bite on the moved file: a planted `try {} catch {}` + `process` in `line-reader.ts` → 2 RED (no-try row, bar 1), 28 passed; reverted, 30/30.
3. `startup-questions.test.ts` written before the module: whole file RED (`Cannot find module …/startup-questions.ts`).
4. Base-behaving stub (returns `parsed.options`, asks nothing): 16 RED / 6 green. Green at base, by design: A3 both-flags, A6 ×4, the code-bar row (they assert unchanged behaviour; P1 reds A6).
5. Real module: 2 RED (the two `cli.ts` source rows, A5 wiring and A9), 20 green. After the `cli.ts` wiring: 22/22.

## Plants (each applied alone, file run, reverted; 22/22 after)
| plant | change | result |
|---|---|---|
| P1 | ask on a non-TTY (`terminal = true`) | A6 ×4 RED (hang: colour question waits; 3 000 ms test timeout) |
| P2 | empty colour answer → `black` | A2 RED |
| P3 | an extra eager `reader.read()` after the questions | A7 RED (history 1 ply, not 3) |
| P4 | echo unfiltered | A4 ESC row RED |
| P5 | `createBookProbe` built before the questions in `cli.ts` | A9 RED |
| P6 | private reader per caller (memo bypassed) | A7 RED: `history.moves` length 1 — the engine's e4 only; the game's first prompt read end of input and `e5` was lost |
