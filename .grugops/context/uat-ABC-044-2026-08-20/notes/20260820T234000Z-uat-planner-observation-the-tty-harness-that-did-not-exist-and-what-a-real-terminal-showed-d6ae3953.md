---
id: 20260820T234000Z-uat-planner-observation-the-tty-harness-that-did-not-exist-and-what-a-real-terminal-showed-d6ae3953
kind: observation
by: uat-planner
role: uat-planner
task: uat-ABC-044-2026-08-20
at: 2026-08-20T23:40:00Z
verified_by:
confidence: high
refs:
  - ABC-044
  - ABC-044/A4
  - ABC-044/A6
  - src/frame.ts
  - src/glyph-mode.ts
  - src/result-screen.ts
supersedes:
---

# The TTY harness that did not exist, and what a real terminal showed — the measurement a pipe cannot make

QE's exit note said the TTY path had **no harness** and that exercising it was the first thing UAT had
to do. **It was built and it was exercised.** This note records the instrument and the raw readings so
the next reader does not have to take the pack's word for either.

## The instrument

```
( paced move feeder ) | script -q /dev/null bash -c 'stty rows 24 cols 80; exec node src/cli.ts'
```

`script(1)` allocates a real pty and puts **both** stdin and stdout of the child on it. `stty` gives it
a window size — **without which Node reports `rows 0` and the in-place branch silently never fires**,
which is the trap that would have made a TTY run look conducted while measuring the same append path a
pipe measures. Probed directly:

```
$ script -q /dev/null bash -c 'stty rows 24 cols 80; exec node -e "…"'
{"out":true,"rows":24,"cols":80,"in":true}
```

## What the TTY changes, measured against the same game on a pipe

| | pipe | real 24×80 pty |
|---|---|---|
| `CSI H` (`\x1b[H`) occurrences in `1. f3 e5 2. g4 Qh4#` | **0** | **6** — one per frame; `beginFrameSession`'s in-place branch is LIVE |
| glyphs | ASCII (`r n b q k`) | **Unicode** (`♜♞♝♛♚♟`) — `src/glyph-mode.ts:84` reads `isTTY` too |
| ANSI escapes total | 0 | present throughout the frames |

**So every prior `A6` measurement on this ticket was taken against a board a player never sees, on a
code path a player never takes.** That is not a criticism of the tests — `A6` says "with stdout a
pipe" in its own words — it is the reason this hop existed.

## The final screen a player is left looking at, 24×80, replayed from the raw pty bytes

```
 1|4 ..::..::..::.♙:♛|
 2|3 ::..::..::.♙::..|
 3|2 .♙:♙.♙:♙.♙::..:♙|
 4|1 :♖.♘:♗.♕:♔.♗:♘.♖|
 5|   a b c d e f g h|
 6|White to move  3.  CHECK|
 7|last: Qh4#  material: 0|
 8|
 9|   1. f3      e5|
10|   2. g4      Qh4#|
11|
…
19|
20|Black wins by checkmate.|
21|
22|1. f3 e5|
23|2. g4 Qh4#|
24|
```

The frame is 23 rows and the terminal is 24, so the result screen's 5 rows scroll the board's top four
ranks away — and **the outcome line survives, at row 20.** For this game length it is fine. Section 6.1
of the pack is what happens when the game is longer.

## `A6`'s "zero CSI sequences of its own", measured on a repainting terminal for the first time

Everything the process wrote after the final frame's last escape sequence:

```
b'\r\nBlack wins by checkmate.\r\n\r\n1. f3 e5\r\n2. g4 Qh4#\r\n'
```

**Zero `\x1b` bytes.** The `\r` is the pty's own `ONLCR` newline translation, not the program's. The
screen lands *after* the last frame rather than over it, on a terminal that is repainting in place.

## `A4`'s no-screen path, on a real terminal

Ctrl-D at the prompt. Everything after the final frame's last escape:

```
b'\x1b[0J> ^D\x08\x08input ended\r\n'
```

**One notice and nothing else** — no result screen, no invented outcome, not even a stray blank line.

## The `claim` path, on a real terminal

`claim` after `1. e4 Nc6` put `repetition 1 of 3` and `50-move 1 of 100` in the message region, awarded
nothing, and the game continued. **No result screen.**

## A 20-row terminal

At 20 rows the frame (23) is taller than the terminal, so `src/frame.ts` correctly declines to repaint
in place — **`CSI H` ×0** — and appends. The outcome line and the whole move list were both on screen
at exit.

## Standing

Unstamped `observation`, hand-authored: no `scripts/context-io.ts`, no `mcp__grugops__propose_note`, no
`§14-gate#<id>` issuer on this install. These are readings taken by an agent on one machine (Apple
silicon, Darwin 26.5.2, Node v24.12.0) and they are not a human's acceptance of anything.
