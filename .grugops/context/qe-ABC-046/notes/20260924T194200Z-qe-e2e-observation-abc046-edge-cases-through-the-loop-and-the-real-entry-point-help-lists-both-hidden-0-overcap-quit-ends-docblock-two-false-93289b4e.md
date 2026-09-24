---
id: 20260924T194200Z-qe-e2e-observation-abc046-edge-cases-through-the-loop-and-the-real-entry-point-help-lists-both-hidden-0-overcap-quit-ends-docblock-two-false-93289b4e
kind: observation
by: qe-e2e
at: 2026-09-24T19:42:00Z
verified_by:
confidence: high
refs:
  - ABC-046
  - ABC-035
  - ABC-037
  - ABC-114
  - ADR-0021
  - src/command-input.ts
  - src/line-input.ts
  - src/turn-loop.ts
  - src/cli.ts
supersedes:
---

# `ABC-046` edge cases through the merged loop AND `node src/cli.ts`, `help` through the real frame, and the docblock audit

I used two scratch harnesses. No repo file was touched and no child was added to the 27-child pin.
**`raw-edges-loop-harness.mjs.txt`** runs `runTurnLoop` with ONE `createPromptLineResolver` per run,
bound the way the reader binds it: **24 / 24 OK**. **`raw-edges-cli-harness.mjs.txt`** spawns the
delivered entry point with the engine substituted by the same `--import` data-URL hook
`src/cli.test.ts` uses: **15 / 15 OK**. The raw outcomes are in the two `*-summary.json.txt` files.
In the table, "Rows" means the existing rows that would go RED if the product changed on that edge
(from the mutant ledger). "NONE" means no row would notice.

| edge | product (loop / real frame) | rows |
| --- | --- | --- |
| **`quit` at ply 0** | loop: renders 2, reads 2, the third line is never read, `{ null, null, 0 }`, last write `quit\n`. Real frame (`--ascii`, white): exit 0, ends `> quit`, 2 frames, 2 prompts, stderr empty, no `wins`/`draw`/`did not finish` | `A1` loop row (`RICH_FEN`, 0 moves; `M2`/`M3`/`M8` red) |
| **`new` at ply 0** | `{ take-back, plies: 0, messages: [] }`. One extra frame, no message. FEN, moves 0, keys 1, one repetition of 1. Real frame: 2 frames, the second board byte-equal to the first | `A4` pure row's ply-0 clause, `ABC-035` A1 sweep (`Q6` red ×4) |
| **`new` straight after `new`** | at ply 4: `take-back 4`, then `take-back 0`. 3 renders, start FEN, keys 1. Real frame `e4 Nf3 new new`: 7 frames, frames 6 and 7 byte-equal to frame 1. `quit / new / new / quit / quit` ends on `QUIT_NOTICE` (`new` clears the flag) | NONE for the sequence; each step is guarded alone (`A4`, `Q6`) |
| **`quit` / `new` after the game is over** | Fool's mate by the human's own lines, then `quit quit new` on the script: reads 2, `black-wins`/`checkmate`, no `QUIT_NOTICE`, no take-back. A history that is already mated gives reads 0. `quit` then the mating reply: the armed flag never fires. Real frame: the checkmate screen, 2 prompts, no `quit` line, no confirmation text | NONE in `ABC-046`'s rows. It is the loop's structure: `evaluating-terminal` returns before any prompt (`ABC-019`), and nothing in this diff can reach it |
| **trailing text** `quit now`, `new game`, `quit!`, `quit.`, `quitnow`, `newgame` | `classifyCommand` is `undefined` for all six. `quit now` ×2 gives `rejected` ×2 and never arms. **`quit / quit now / quit`: the middle line is rejected (`type e2e4 or Nf3`) and CLEARS the flag, so the third asks again; ends on EOF.** Real frame: 4 frames, frame 3 shows the rejection and frame 4 asks again. `e4 / new game`: rejected, board unchanged | fence row *"takes no argument"* for classification and the pure function. **Wrapper arming: NONE (`Q3` survives, `G1`)** |
| **mixed case** `QUIT`/`Quit`, `  quit `/`\tQUIT\r`, `qUiT`/`quit`, `NEW`/`New`/`  nEw  ` | every pair: confirmation, then `QUIT_NOTICE`. `new` in every spelling gives take-back of all plies. Real frame `e4 / QUIT / Quit / d4`: ends `> quit`, 4 frames, 3 prompts (`d4` unread). `e4 / NEW`: frame 4 == frame 1 | `A1` quit/quit (`QUIT`, `  Quit  `; `Q4` red), `ABC-035` A1 sweep for `new` |
| **`new` on the engine's turn** | **The prompt cannot be reached on the engine's turn.** `humanToMove` gates `input`. With `--colour black`, a `new` sitting in stdin is read only AFTER the engine's `e4` (black to move, moves 1). It takes back **1 ply, the engine's**. Transition 18 re-evaluates and renders, then the ENGINE MOVES AGAIN (`d4` in the script). Real frame: 5 frames = start, `e4`, take-back (== frame 1, black-bottom), `d4`, confirmation. Then `quit quit` ends. Correct: a new game as Black means the engine opens | NONE: `A6` is asserted for White only (`G3-INFO`) |
| **over-cap line between two `quit`s** (reading 2) | **`quit` / 1025×`x` / `quit` ENDS the session** on `> quit` after 3 frames. The last frame shows `line too long` / `max 1024 chars`, NOT `quit again to end`. Control `quit` / 1024×`x` / `quit`: the at-cap line reaches the resolver, is rejected, clears the flag, and the session ends on `> input ended` | NONE (clause-6 row unwritten). `Q9` shows the cheap fix reds `ABC-037` bar 2 |

## `help` through the real frame — lists both, hidden 0

`help` at the start position (the narrowest frame) and after `e4 e5`, in BOTH `--ascii` and
`--unicode`, `--colour white`. The help frame's message region reads, byte for byte:

    commands: help board
    quit claim resign new

All six tokens and the heading are present, and there is no `(+` marker anywhere in the stream
(hidden count 0). Exit 0, 2 frames and 4 frames respectively. The Delivery's note that `ABC-102`
inherits a second row at 21 of 21 columns is consistent with this: the second row
`quit claim resign new` is 21 characters.

## Docblock audit (`ABC-114` standard) — the lines this diff wrote in `src/command-input.ts` and `src/line-input.ts`

Probe: `raw-docblock-probe.mjs.txt`, output `raw-docblock-probe-summary.json.txt`. The file was
mutated in place for S2, then restored with sha256 = true and `git status -- src` empty.

- **FALSE — D1, `command-input.ts:4-5`:** "one of **seven** commands and, for **six** of them".
  Measured: `COMMAND_TABLE.length` 6 (`help, board, quit, claim, resign, new`), `helpMessages()` 7
  (heading + 6). The same file says "The six tokens" (`:69`) and "the six tokens do NOT share one
  arm" (`:75`).
- **FALSE — D2, `command-input.ts:222-223`:** "Armed and asked again, it answers
  `{ kind: "quit" }` and **never consults the table**". Measured: delivered wrapper `quit`/`quit` →
  `{command, ["quit again to end"]}` then `{kind:"quit"}`. With the `quit` row removed from
  `COMMAND_TABLE` → `rejected` / `rejected`. The exit path reads the table through
  `classifyCommand`. The Engineer's `decision` repeats the sentence ("the table is not consulted on
  that path"). What is true: the row's `outcome` is never read, and `resolvePromptLine` is never
  called, on that path.
- **Checked, TRUE:**
  - `:10-17`: the flag, transition 9 / 17, two states, no second read.
  - `:19-21`: `new` mutates nothing here, `plies: moves.length`, the loop splices.
  - `:75-83`: "Three are `command`" (help, board, quit), and `quit` is `command` because
    classifying produces the confirmation.
  - `:88-96`: `undo` not here, `new` here.
  - `:110-115`: 17 columns; `"quit again to end".length` is 17.
  - `:143-146`: the arm census.
  - `:169-178`: history consulted on TWO command paths, derived on none. `A7` spies are 0 for
    `new`/`quit`.
  - `:219-230`, except D2: one per session; any other line clears (true for every line the wrapper
    sees); module-level flag rejected.
  - `line-input.ts:9-14`, `:134-137`, `:153`: true. "holds the `quit` confirmation flag and nothing
    else" is imprecise, because the closure also holds `deps`. As a statement about STATE it is
    true, so it is not counted.
- **Test-comment imprecision (`G4-INFO`, not a production docblock):** `command-input.test.ts`
  ABC-046 banner "A1-A7 here … A2/A3/A6 also as entry-point children", but there is no `A6` row in
  that file. The sweep title "ABC-035 A1 — four tokens" was stale before this ticket.

None was corrected by QE (`ABC-114`: the agent that finds a sentence does not author its
replacement).
