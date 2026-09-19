---
id: 20260920T032200Z-qe-e2e-observation-abc045-five-edge-cases-through-the-loop-and-the-real-entry-point-help-hidden-0-docblock-audit-two-stale-cites-5c9e2b74
kind: observation
by: qe-e2e
at: 2026-09-20T03:22:00Z
verified_by:
confidence: high
refs:
  - ABC-045
  - ABC-035
  - ABC-019
  - ABC-044
  - ABC-114
  - ABC-120
  - src/command-input.ts
  - src/turn-loop.ts
  - src/line-input.ts
  - src/cli.ts
  - src/cli.test.ts
supersedes:
---

# `ABC-045` — the five edge cases (a)–(e), each run through the MERGED loop and through the REAL entry point; `help` through the real frame; the docblock audit — raw output

Two scratch harnesses beside this note, neither added to the repository: `raw-edges-loop-harness.mjs.txt`
(imports `src/turn-loop.ts`, `src/command-input.ts`, `src/history.ts` directly — Node's type stripping,
no vitest, no mocks; a stub render seam, a scripted input seam that records every read with the side to
move, a scripted engine that records every call) → `raw-edges-loop-summary.json.txt` (**20 checks, 0
failed**); `raw-edges-cli-harness.mjs.txt` (spawns `node src/cli.ts` as a child with the engine
substituted through the SAME `--import` data-URL `registerHooks` shape `src/cli.test.ts` uses, and
compares the tail of stdout against `renderResultScreen(...)` over the replayed game) →
`raw-edges-cli-summary.json.txt` (**11 checks, 0 failed**). Each child 84–102 ms wall. **These are
scratch: no child was added to `src/cli.test.ts`'s `17 + 7 + 1` pin.**

## (a) `resign` while it is the ENGINE's turn

Loop, `humanColour: "black"`, start position, engine scripted `e2e4`, lines `["resign", "d7d5"]`:
```
render(in-progress,thinking=true) → sink.write → engine:e2e4 → render(in-progress,thinking=false) → sink.write → read#1:"resign" sideToMove=black
outcome { result: "white-wins", reason: "resignation", exitCode: 0 }  reads 1  renders 2  moves 1
```
The human cannot reach the prompt off-turn: `runTurnLoop` calls `input` only under `humanToMove`
(`sideToMove(history) === humanColour`), and `createLineInputSeam` attaches its `data` listener per
read and `pause()`s the source between reads, so a line typed during the engine's think is buffered by
the stream and read at the NEXT prompt — when the side to move is the human's. The pure function
called off-turn (start position, white to move, "suppose the human is black") returns `black-wins`:
it names the side to move, which is the question it answers; the loop never asks it off-turn, and that
is the whole safety of the `blackToMove` read. Real frame, `--colour black`, stdin `resign\nd7d5\n`,
engine `e2e4`: exit 0, 2 frames (black-bottom), 1 prompt, stdout ends
`> \nWhite wins by resignation.\n\n1. e4\n`.

## (b) `resign` at ply 0

Loop, white: `{ black-wins, resignation, 0 }`, reads 1, renders 1, 0 moves, FEN = start. Real frame,
`--colour white`, `resign\n`: exit 0, 1 frame, 1 prompt, screen `\nBlack wins by resignation.\n\n`
(empty move list — `ABC-044`'s own rendering of a game with no plies; no row asserts that shape, and
it is not this ticket's).

## (c) `resign` after the game is already over

Loop on Fool's mate (`f2f3 e7e5 g2g4 d8h4`, `gameStatusOf` → `black-wins` / `checkmate`), lines
`["resign", "resign"]`: **reads 0**, renders 1 (the mated frame), outcome `black-wins` / `checkmate`
— the exit test sits between render and act (`ABC-019`), so the seam is never asked. Real frame,
`--colour white`, `f3\ng4\nresign\n`, engine `e7e5, d8h4`: exit 0, **exactly 2 prompts**, 5 frames,
stdout ends `Black wins by checkmate.\n\n1. f3 e5\n2. g4 Qh4#\n`, the word `resignation` absent from
the entire stream. `resign` after `resign` (`e4\nresign\nresign\nd4\n`, engine `e7e5`): 2 prompts,
resignation screen; the loop returned on the first.

## (d) `resign now` (trailing text)

`classifyCommand("resign now")` → `undefined`. Loop at ply 4, lines `["resign now", "resign"]`: the
first outcome is `{ kind: "rejected", messages: ["type e2e4 or Nf3"] }`, reads 2, renders 2,
`messagesPerFrame` `[[], ["type e2e4 or Nf3"]]`, FEN unchanged, final outcome `resignation`. Pure
function: `resign!`, `resign.`, `resignation`, ` resign now ` → `rejected`; `resign\t` → `game-over`
(trailing whitespace is trimmed, the merged `ABC-035` rule). Real frame, `resign now\nresign\n`: exit
0, 2 prompts, 2 frames, the second frame's rows include `type e2e4 or Nf3` in the message region,
then the resignation screen.

## (e) `RESIGN` / `Resign`

Loop as black after `e4`: `RESIGN`, `Resign`, `  resign  `, `\tRESIGN\r`, `rEsIgN` → `white-wins` /
`resignation`, reads 1 each. Real frame after `e4` (engine `e7e5`): `RESIGN`, `Resign`, `  resign  `
→ exit 0, resignation screen, 2 prompts. Same rule as the other four tokens; mutant `M10` (case
folding dropped) reds 18 `ABC-035` rows, two of them `resign`'s.

## `help` through the real frame — hidden 0

`--colour white`, `help\n` at the start and `e4\nhelp\n` after `e4 e5` (engine `e7e5`): exit 0; the
frame's message region rows read `commands: help board ` and `quit claim resign    `; **no `(+`
anywhere in the stream**; the session ends on `input ended`. `helpMessages()` →
`["commands:", "help", "board", "quit", "claim", "resign"]` (6 items).

## Docblock audit of the amended `src/command-input.ts` (`git diff bd40d85 b8afa30 -- src/command-input.ts`)

Amended or added sentences, each read against a measurement above or in the mutant ledger:

| sentence (paraphrased, line at the tip) | verdict |
| --- | --- |
| `:4` "IS one of five commands" | true — 5 rows |
| `:10-15` "`resign` … IS THE ONE TOKEN THAT CARRIES A VERDICT … resolves to the EXISTING `game-over` arm … no new arm, no new reason, no confirmation … and no derive. The loser is the side to move, read off ONE field … the loop prompts only when that side is the human's" | true — `src/turn-loop.ts` byte-identical (`A6`); `M5`/`M9` (confirmation), `M6`/`M7` (derive) all red; edge (a) |
| `:56` "The five tokens, and the type that makes a sixth a compile error" | true |
| `:62-66` "the five tokens do NOT share one arm. Three are `command` … `claim` … `resign` is the `game-over` arm with a result" | true — the table |
| `:77-79` "`undo` and `new` are NOT here — `ABC-102`'s and `ABC-046`'s. `resign` IS here" | true |
| `:117` "`ABC-033`'s three, `ABC-035`'s two, `ABC-045`'s one" | true — six `Extract` members |
| `:130-134` "`history` is consulted on ONE command path and derived from on NONE … reads `position.blackToMove` — a field, not a derive" | true — `M6`/`M7` |
| `:151-154` the branch comment | true — edge (a) |

**No false sentence.** Two stale LINE CITES, neither a claim about behaviour, named and not corrected
(`ABC-114`: the pen and the verdict stay separate):

- `src/command-input.ts:63` "(`src/turn-loop.ts:129`)" and `:64` "(`:130`)" — the `command` and
  `claim` arms are at **`:139` / `:140`** since `ABC-120` (+10 lines in that file). This paragraph WAS
  re-written by this ticket and the cites were carried along unchecked.
- `src/command-input.ts:41` "`src/turn-loop.ts:319-341`" → the claim adjudication is at **`:354-376`**;
  `:42` "`src/turn-loop.ts:234`" → `claimShortfall` is at **`:255`**. Not touched by this ticket;
  same `ABC-120` shift.
- `src/cli.test.ts:278` "THE CHILDREN. Ten, spawned once each" — 25; pre-existing, not this ticket's.
