---
id: 20260819T110500Z-software-engineer-claim-abc037-eight-criteria-with-evidence-b2e4f6a8
kind: claim
by: software-engineer
at: 2026-08-19T11:05:00Z
verified_by:
confidence: high
refs:
  - ABC-037
  - ABC-019
  - src/line-input.ts
  - src/line-input.test.ts
supersedes:
---

# `ABC-037` `A1`–`A8`: eight verdicts, each with the evidence and the mutant that would break it

Measured on `grugops/abc037-the-real-prompt` at `fa21662`'s parent tree, in a contained agent
worktree. `npm test`: **39 files / 1175 tests, 0 failed, skip 0**.

| # | verdict | evidence | the mutant that reds it |
|---|---|---|---|
| `A1` | **MET** | The export is declared `const input: InputSeam = createLineInputSeam({ source, output })` and passed as `options.input` — **no adapter, no cast**, and `npm run typecheck` exits 0. A scholar's-mate script of **7 plies** (4 human, 3 engine) runs through it to `{ result: "white-wins", reason: "checkmate", exitCode: 0 }`, `history.moves.length` 7. | any signature change fails `tsc` |
| `A2` | **MET** | `e4\n`, `Nf3\n`, `d4\n` written as THREE chunks; two awaits resolve `move e4` then `move Nf3`, and the witness is the pipe itself: `source.readableLength === 3` and `source.read()` returns `"d4\n"`. The spied resolvers were never asked about `d4`. A second row covers the one-chunk overshoot: the surplus is queued, still not resolved, and served in order on the third call. | `M2` (drop `pause()`, drain the pipe) reds 1; `M13` (throw the surplus away) reds 3 |
| `A3` | **MET** | Both end shapes resolve `{ kind: "eof" }`: ended with a trailing newline-less line (`e4\nNf3` then `end()`), and ended MID-LINE while a read is in flight. Through the merged loop: `{ result: null, reason: null, exitCode: 0 }` and the sink receives `"input ended\n"`. `exitCode: 0` is `ABC-019`'s and is not re-decided here. | `M3` (submit the tail) reds 2; `M16` (never set `ended`) reds 1 |
| `A4` | **MET** | `help\n` resolves `{ kind: "command", messages: helpMessages() }` with **`parseCoordinateMove` 0, `parseSan` 0, `legalMoves` 0** — asserted by spy over `MoveInputDeps`. `claim\n` reaches the dedicated `{ kind: "claim" }` arm with `legalMoves` still 0. A non-command then drives `legalMoves` to exactly 1, so the zeros are not vacuous. | `M8` (bypass the table) reds 3 |
| `A5` | **MET — and it is the criterion that decides the ticket** | Run **THROUGH `runTurnLoop`**. An injected `parseSan` throws; the throw propagates out of `runTurnLoop` (`.rejects.toBe(boom)` — the same object, not a lookalike), `toFen(history.position)` is **byte-identical** to its pre-call value, `history.moves.length` is unchanged at 0, the recorded-outcome array is **empty** (no `PromptOutcome` at all, in particular not `rejected` and not `eof`), and the render seam was called **exactly once** — the initial frame. A rejecting build renders a second frame carrying the message. | **`M1`** — wrap the resolver call in `try`/`catch` returning `rejected` — reds **2** |
| `A6` | **MET, with the guard's limit stated** | The seam's writes are `["> ", "> ", "> "]` across a rejected line, a move and an EOF: every write byte-equal to `PROMPT`, **zero `\x1b`**, **zero CSI matches** against `/\x1b\[[\x30-\x3f]*[\x20-\x2f]*[\x40-\x7e]/`, and **0** writes to the loop's `FrameSink` counted while the seam is on the stack. Plus `console.log/error/warn/info/debug` 0, `process.stdout.write` 0, `process.stderr.write` 0, `globalThis` key-set diff empty, the module's import set exactly four relative project modules, and a token scan of the delivered file (comments stripped) at zero for `process`/`console`/`globalThis`/`eval`/`Function`/`require`/`import(`/`child_process`/`writeSync`/`fetch`/`Buffer`. | `M7` (emit `\x1b[K`) reds 4; `M9` (`console.log`) reds 2; `M10` (`fs.writeSync`) reds 2; `M15` (`globalThis` flag) reds 1; `M14` (prompt written AFTER the read) reds 1 |
| `A7` | **MET** | A line typed one character at a time into the pipe (`N`, `f`, `3`, each its own chunk with a macrotask between): `legalMoves` **0**, `parseSan` **0**, `parseCoordinateMove` **0** before the newline; after `\n` the outcome is `move` and `legalMoves` is **exactly 1**. This is `NFR-003` in its count form; no wall clock is asserted, per the standing rule. | `M11` (complete a line on every chunk) reds 3 |
| `A8` | **MET** | `git diff --numstat e9a61ae HEAD` for the delivery commits: **`src/line-input.ts` 232/0** and **`src/line-input.test.ts` 771/0**, and **nothing else under `src/`**. `src/turn-loop.ts` and `src/frame.ts` are byte-identical by **blob hash on both sides** (`9334daf1…`, `6d2a8685…`). Suite green, **skip 0**, integrity `No findings.` exit 0, `PERFT_DEEP=1` **32/32**. | — |

## The one thing NOT claimed

**`N8-LANE` is not claimed met.** See the gate note. The ticket-page allotment of one test file is
honoured; the 650 ms figure is not asserted, because `ABC-108` has the lane at or over `NFR-008`'s
13 s clause and a percentage of a spent budget is not a budget.
