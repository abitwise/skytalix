---
id: 20261022T200253Z-qe-e2e-observation-0bce441b
kind: observation
by: qe-e2e
at: 2026-10-22T20:02:53Z
verified_by: 
confidence: high
refs:
  - ABC-200
  - EPIC-006
  - d062d60e
  - 0a07df04
  - 1efd2cee
  - bd745ac9
  - be70482f
  - QE-200-a
  - QE-200-b
supersedes: 
seal: sha256:2ee57a6a5b3b4e81e0e629f845a8fa64394dad8ef44f204b7d8a372a6d4477e1
---

# ABC-200 QE readings: A1–A7 and A9 met on QE's own runs; P1–P6 each red on its named row; four extra plants; two gap probes green

QE/E2E, task `qe-ABC-200`, 2026-10-22. Worktree `../wt-qe-ABC-200` on `grugops/qe-ABC-200`; merge `d062d60e` (tip `0a07df04`, code `1efd2cee`, plus `main` `be70482f`). Base `bd745ac9`. These readings were taken before the SE's notes were opened.

## Rows, read against the criteria rather than the code
- **A1 MET.**
  - In memory: 2 questions, colour first. Before the second answer the output holds exactly those 2 writes, so 0 frame bytes. The result is black / black-bottom / 1.
  - Case and surrounding spaces are ignored. An answered `random` comes out white or black, with its orientation.
  - On the real pty (A8 case 1), the engine moved first as White.
  - The level half is read by an instrumented scratch probe (`createLevelSeam` writes its level): answers `black` and `1` built level 1; two empty answers built level 5. No suite row reads this half: see `QE-200-a`.
- **A2 MET.** Two empty lines give options `toEqual` `resolveOptions([]).options` (white, white-bottom, flags off, 5). The questions show `[white]` and `[5]`.
- **A3 MET.**
  - Both flags: 0 writes and 0 listeners.
  - `--colour black`: 1 write, the difficulty question.
  - `--difficulty 2`: 1 write, the colour question.
  - All three shapes also hold on the pty (cases 6, 6b, 6c).
- **A4 MET.**
  - `purple`: one rejection naming `white|black|random` and echoing it, then the same question.
  - ESC row: the echo is `purple[2J`, and 0 C0 or DEL bytes are written.
  - `6`, `0`, `03` and 1 025 × `3`: 4 rejections, each naming `1|2|3|4|5`; the over-cap echo is `""`. The next valid answer is accepted.
  - On the pty, the program's echo of `pur\x1b[31mple` is `"pur[31mple"`, with no `0x1b` byte.
- **A5 MET.**
  - In memory: end of input at colour, and at difficulty with a held partial line, resolves `null`.
  - Source row: `if (resolution === null) return;` sits inside `try {`, ahead of `runTurnLoop(` and `renderResultScreen(`.
  - On the pty (case 5a/5b): exit 0, 0 frame-home bytes, no `input ended`, no stack trace, and the process ended with no further input.
- **A6 MET.**
  - The four pipe shapes give 0 writes and 0 reads, and the line stays in the pipe; the seam's first read is the move `e4`.
  - `git diff bd745ac9 HEAD -- src/cli.test.ts src/cli.real-engine.test.ts` is 0 lines. Both suites are green (`npm test`; `CLI_DEEP` 11/11).
  - Byte comparison against base through pipes: `npm run chess </dev/null | cat` is byte-identical, 542 B. `printf 'help\n' | npm run chess | cat` is byte-identical, 1 029 B. stderr is 0 B in both.
- **A7 MET.** `black\n1\ne5\n` in one write goes through the real `createLineInputSeam` and a real `runTurnLoop`: 3 plies and the expected FEN, with the prompts `[> , > ]`. On the pty (case 4): the engine played `e4`, then `e5` was played from the paste, then the engine played `d4`, and the next prompt waited.
- **A9 MET.** The source-order row passes. An instrumented scratch probe in `readBookFile` read the book exactly once on the pty, after both answers. Only the probe's tokens are read by the row: see `QE-200-b`.

## Plants (scratch copies of the merge tree; whole suite, heap 128 multi-file, JSON reporter)
| plant | change | result (failed / 2 017) |
|---|---|---|
| P1 | `terminal = true` (ask on any stream) | A6 ×4 RED. `cli.test.ts` also fails as a file; its children are asked on a pipe. One such child outlived the run and was stopped with SIGTERM |
| P2 | empty difficulty → 3 | 1: A2 "two empty answers" RED |
| P2c | empty colour → black (the SE's P2 shape) | 1: A2 RED |
| P3 | `void reader.read()` after the answers | 1: A7 RED |
| P4 | echo unfiltered | 1: A4 ESC row RED |
| P5 | `createBookProbe` built before the questions | 2: A9 RED, plus `cli.test.ts` ABC-043 A1 |
| P6 | memo bypassed: a private reader per caller | 1: A7 RED |
| Q2o / Q2i | TTY test reads stdin only / stdout only | 1 each: A6 "stdout a pipe" / "stdin a pipe" RED |
| Q3 | difficulty matched by `Number()` | 1: A4 difficulty row RED (`03`) |
| Q4 | EOF at colour plays on | 1: A5 colour row RED |
| Q1 | destructure `parsed.options` | 1: ABC-101 A8′ RED, which is a text pin (`= resolution.options;`) |
| **Q1b** | `Object.assign(resolution, { options: parsed.options })` after the null check | **0 RED, green 2 017** → `QE-200-a` |
| **P5b** | a bare `readBookFile();` before the questions | **0 RED, green 2 017** → `QE-200-b` |

## Test-name equality (real base run, not arithmetic)
- Base `npm test`: 60 files / 1 995, rc 0. Merge: 61 / 2 017.
- Name diff: +22 (`src/startup-questions.test.ts`). There is 1 rename in `src/line-input.test.ts` ("four" → "five" relative modules), which the ruling licenses.
- Every other file's names and counts are equal.
