---
id: 20260820T192000Z-uat-planner-observation-abc035-conducted-and-the-quit-that-does-not-quit-5b8e04c1
kind: observation
by: uat-planner
at: 2026-08-20T19:20:00Z
verified_by: 
confidence: high
refs:
  - ABC-035
  - plans/tickets/ABC-035-in-game-commands.md
  - src/command-input.ts
  - ABC-021
  - EPIC-006
supersedes: 
---

# `ABC-035` conducted — seven scenarios, and the one a player will call a bug

**This is a conducted result, not an acceptance.** See the sibling `decision` note.

**7 scenarios run, 7 pass, 0 fail.** Every criterion this ticket can be judged on from the prompt
was reachable — this is the ticket with the fewest unexercisable corners. **One documented
boundary is a live usability exposure and is escalated below rather than filed as a pass.**

## 35-1 to 35-5 — the four words, in one session, none of them advancing the game

```
$ printf 'help\nHELP\n  BoArD  \nclaim\nquit\n' | node src/cli.ts
```
exit `0`, **6 boards for 5 typed lines plus the end-of-input** — i.e. **exactly one redraw per
prompt**, which is what `A3` asks for; no command triggered a second frame. Every frame kept
`White to move  1.` — no line advanced the ply, and `material: 0` never moved.

- **`help`** — message region reads:
  ```
  commands: help board
  quit claim
  ```
  The heading plus **all four** tokens and **no token that is not in the table**. It fits the two
  message rows with nothing hidden. **PASS — `A4` and `A7`, read off the screen.**
- **`HELP`** — byte-identical frame to `help`. **PASS — case-insensitive.**
- **`  BoArD  `** — board redrawn, **message region completely empty**, ply unchanged. Leading and
  trailing spaces and mixed case both tolerated. **PASS — `A1` tolerance and `A3` "zero messages".**
- **`claim`** with no draw available — message region reads:
  ```
  repetition 1 of 3
  50-move 0 of 100
  ```
  That is `ABC-021`'s merged `claimShortfall` wording, in numbers, teaching the player exactly
  what a claim would need. This ticket contributed **no** message of its own on that path, which
  is what its `A5` requires. **PASS.**
- **`quit`** — recognised, ply unchanged, **and the session continued.** See below.

## 35-6 / 35-7 — the negative half, which is the criterion

```
$ printf 'hel\nboards\nh\nhelp me\nb4\n' | node src/cli.ts
```
`hel`, `boards`, `h` and `help me` each produced `unreadable` with the board unchanged — **none
is a command, no prefix matching, no aliases, no arguments.** Then `b4` was played **as a chess
move**:
```
Black to move  1...
last: b4  material: 0
   1. b4
```
exit `0`, 7 boards, 6 prompts. **PASS — `b4` never became `board`, which is the collision the
ticket cut this criterion for.**

## The exposure the owner should be asked about explicitly

**`quit` does not quit.** In the 35-5 transcript the player typed `quit` and the game simply
carried on; the session only ended when input ran out. This is **correct against the ticket** —
`ABC-035` ships the grammar and `EPIC-006` owns the confirmation and the exit, ruled 2026-08-12
and restated in the module header — so it is **not** a defect and **no defect was cut for it**.

It is nevertheless the one thing a real player meets and calls broken: the product advertises
`quit` in its own `help` output and then does not honour it. **A UAT that reported this ticket
green without putting that sentence in front of the person who signs would be hiding it.**
The decision the owner has, stated plainly: accept `ABC-035` with a `quit` that is recognised and
inert until `EPIC-006` lands, or hold it. **That judgement is his, not mine.**

## NOT EXERCISED — named, not assumed

- **`A5`'s second half — `claim` in a position where a draw IS available.** Reaching a threefold
  repetition or a 50-move count against a live engine that chooses its own replies is not
  achievable in a bounded script, and the product accepts no starting position. The available-claim
  edge is `ABC-021`'s and is asserted in its suite; **it was not observed at the product surface
  here.** The unavailable half (35-4) was.
- **`A2` (resolvers called exactly 0 times) and `A6` (zero extra derives)** are spy counts, not
  business scenarios. `A2`'s user-visible consequence — `b4` staying a move — IS covered, by 35-7.
- **`A8` (no production change outside the module)** is a diff property, QE's instrument.
