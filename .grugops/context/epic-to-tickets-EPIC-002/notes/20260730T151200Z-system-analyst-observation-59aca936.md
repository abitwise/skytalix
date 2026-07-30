---
id: 20260730T151200Z-system-analyst-observation-59aca936
kind: observation
by: system-analyst
at: 2026-07-30T15:12:00Z
verified_by: 
confidence: high
refs:
  - epic-to-tickets-EPIC-002
  - EPIC-002
  - EPIC-003
  - EPIC-004
  - EPIC-005
  - EPIC-006
  - ADR-0002
  - NFR-002
  - NFR-004
  - NFR-007
  - RISK-005
  - ABC-009
  - ABC-011
  - 20260730T140500Z-orchestrator-observation-c41a7e92
  - plans/epics/EPIC-002-terminal-board-and-game-loop.md
  - plans/epics/EPIC-006-game-session-and-packaging.md
  - memory-bank/30-architecture.md
  - memory-bank/50-decisions/ADR-0002-game-history-ownership.md
  - src/gameend.ts
  - src/legal.ts
  - src/apply.ts
  - src/position.ts
supersedes: 
---

# Turn loop — actors, states, transitions, and every render trigger

The epic specifies the loop in one line: *"render → prompt human → apply → render → engine
moves → repeat"* (`plans/epics/EPIC-002-terminal-board-and-game-loop.md` `## Scope`). This note
expands that line into a state map. It maps behavior only — no module structure, no API shape.

## 1. Actors

| Actor | Exists today | What it does in the loop |
|---|---|---|
| **Human** | — | types one line per prompt: a move, a command, or nothing |
| **Terminal (the device)** | — | renders bytes. A real actor, not a channel: `RISK-005` is entirely about it, and `NFR-002`'s unmeasured half is its paint time |
| **Renderer** | no (EPIC-002) | turns a position + derived facts into one frame |
| **Rules core** | **yes, merged** | `legalMoves` / `isInCheck` / `gameStatus` / `makeMove` / `unmakeMove` |
| **History module** | no (`ADR-0002` clause 2) | owns `{ initial position, Move[] }`; derives the key list, repetition counts and undo by replay |
| **Engine** | no (EPIC-004) | returns one legal move inside a bounded wall clock (`NFR-004`) |
| **Book** | no (EPIC-005) | sits *behind* the engine seam; the loop must not see it |
| **Session / CLI** | no (EPIC-006) | chooses colour + difficulty, owns argv, owns `undo` / `resign` / `new`, owns the result screen and exit code |

The loop skeleton EPIC-002 owns is the thing that sequences these. It is the only component
that touches all seven.

## 2. The loop is driven by side-to-move, not by "human first"

The epic's one-line flow hardcodes *human moves first*. That is wrong for half the sessions
the product promises. `EPIC-006`'s acceptance reads: **"Given `--colour black --difficulty 3`,
when the game starts, then no prompts appear and the engine opens as white."** So the first
actor is a function of `position.blackToMove` vs the human's colour, decided at startup, and
the loop must be written as a ply loop, not as a human-turn loop with an engine tail.

The epic's line remains a correct description of the *steady state* when the human is white.
It is not the control flow.

## 3. States

| State | Entered when | Leaves when |
|---|---|---|
| `S0 initialising` | process start | initial position, history, orientation and glyph mode all fixed |
| `S1 evaluating-terminal` | top of every ply | `gameStatus` answers |
| `S2 rendering` | after `S1` | frame emitted |
| `S3 awaiting-human` | `S2` and side-to-move is the human's colour | a line is read, or stdin closes |
| `S4 engine-thinking` | `S2` and side-to-move is not the human's colour | engine returns a move, or fails |
| `S5 applying` | a `Move` is in hand from `S3` or `S4` | `makeMove` returned and the move is appended to history |
| `S6 game-over` | `S1` reported a non-`in-progress` result, or resign/`quit` (EPIC-006) | result screen shown |
| `S7 exiting` | `S6`, `quit`, or EOF | process exits 0 |

`S3` has four non-advancing outcomes (`rejected`, `ambiguous`, non-mutating command, unreadable
input) that return to `S3` **without** advancing the ply and **without** re-entering `S1`. That
is the loop's most-travelled edge and the epic's one-liner does not contain it at all.

## 4. Transition table

| # | From | Trigger | To | Notes |
|---|---|---|---|---|
| T1 | `S0` | startup complete | `S1` | orientation + glyph mode are session constants from here on |
| T2 | `S1` | `result === "in-progress"` | `S2` | |
| T3 | `S1` | `result !== "in-progress"` | `S2` then `S6` | the **final frame renders first**, so the last board a player sees is the mated one |
| T4 | `S2` | side to move is human | `S3` | |
| T5 | `S2` | side to move is engine | `S4` | |
| T6 | `S3` | line parses to one legal move | `S5` | |
| T7 | `S3` | ambiguous / illegal / unparseable | `S3` | **position unchanged, ply not advanced** |
| T8 | `S3` | non-mutating command (`moves`, `help`, `board`) | `S3` (via a redraw for `board`) | no `S1` re-entry: the position did not change |
| T9 | `S3` | mutating command (`undo`, `new` — EPIC-006) | `S1` | position changed by 2 plies or reset; terminal state must be re-evaluated |
| T10 | `S3` | `quit` / `resign` (EPIC-006) | `S6` | |
| T11 | `S3` | **stdin EOF** | `S7` | not in any epic's record — see the stop list |
| T12 | `S4` | engine returns a legal move | `S5` | |
| T13 | `S4` | engine throws or returns an illegal/foreign move | `S6` or recovery | see the settled rules note; failing loudly beats playing a corrupt board |
| T14 | `S5` | `makeMove` returned, history appended | `S1` | **append before evaluating** — see §6 |
| T15 | `S6` | result screen shown | `S7` | exit code 0 (`EPIC-006` acceptance) |

## 5. Render trigger points, and what data each one needs

Every trigger emits the **same frame shape**. That is the point: one frame builder, ten
triggers. What differs per trigger is only which loop state the frame is rendered in.

| # | Trigger | Owner | Data beyond the position |
|---|---|---|---|
| R1 | first frame after startup | EPIC-002 (clock owned by `NFR-007`, EPIC-006) | orientation, glyph mode; history empty |
| R2 | top of every ply (`S2`) | EPIC-002 | terminal status, check, last move, history |
| R3 | after the human's move | = R2 on the next iteration | — |
| R4 | after the engine's move | = R2 on the next iteration | — |
| R5 | `board` command | EPIC-003 triggers, EPIC-002 renders | identical frame, identical orientation — a redraw is not a new turn |
| R6 | after a rejected move | EPIC-003 supplies the message | the **message text** must land in a frame-owned region, not be printed beside the frame |
| R7 | after an ambiguity list | EPIC-003 supplies N candidate SANs | **variable height** — the hard case for a fixed-region frame |
| R8 | entering / leaving `S4` | EPIC-002 | the thinking flag; the row must exist in both states so frame height does not change |
| R9 | terminal state reached | EPIC-002 renders the board, EPIC-006 the result screen | end reason + result |
| R10 | after `undo` (EPIC-006) | EPIC-006 triggers | position is 2 plies back; history, counts and last-move all rewound with it |

**Cadence: one render per ply.** R2 fires once per ply, so a full move produces two frames.
That matches the epic's line read literally (`render → prompt → apply → render → engine moves
→ repeat` loops back onto the same top-of-ply render).

**Data every frame needs**, all of it available from one live `Position` plus the history:
64 square bytes, orientation, side to move, check flag, fullmove number, terminal status, last
move, move history, material balance, thinking flag. Item-by-item availability against merged
`src/` is the subject of the companion observation note.

## 6. Ordering inside a ply — this order is load-bearing

```
append the move to history  →  derive repetition counts  →  gameStatus(position, counts)  →  render  →  act
```

Two reasons it cannot be reordered:

- `gameend.ts:106` tests `(positionCounts.get(zobristKey(position)) ?? 0) >= 3`, and its doc
  comment states the count includes **the current occurrence**. Evaluate before the append and
  the third occurrence reads as 2 — threefold is silently missed. The counts must also include
  the **initial** position at count 1, or a return to the start position is under-counted.
- The final frame must show the position the game ended in. Rendering before evaluating means
  the mate is announced over the pre-mate board.

## 7. Game ending mid-loop — all five reasons `src/gameend.ts` can report

`EndReason` is exactly five values plus `null` (`src/gameend.ts:28-34`). `gameStatus` decides
them in a fixed order, and that order is already correct for the loop:

| Reason | Arises after | Loop behaviour | Notes |
|---|---|---|---|
| `checkmate` | either side's move | `S6`, winner from `position.blackToMove` | checked **first**, from the single shared `legalMoves` call |
| `stalemate` | either side's move | `S6`, draw | same branch as mate; `isInCheck` separates them |
| `insufficient-material` | a capture | `S6`, draw | checked before the clock and repetition |
| `fifty-move` | `halfmoveClock >= 100` | `S6`, draw | because mate is tested first, a mate delivered on the 100th halfmove is correctly **mate, not a draw** |
| `threefold-repetition` | any move, **only if counts are supplied** | `S6`, draw | omit `positionCounts` and it is never reported — silently |

All five are **automatic** in this product, not claimed: `gameStatus` returns the draw without
being asked, and `EPIC-006`'s result screen lists repetition and fifty-move among the reasons
it must name. No "claim draw" interaction exists in any epic's scope. FIDE treats threefold and
fifty-move as claimable; this product does not. That is settled by merged code plus EPIC-006's
acceptance, not open.

**`EndReason` is not sufficient for EPIC-006.** EPIC-006 promises **six** terminal conditions —
the five above plus `resignation`. The loop's game-over reason is therefore a superset of the
core's `EndReason`, and EPIC-002 must not type its terminal state as `EndReason` verbatim.

**Threefold under-detects today, in the safe direction.** `ABC-011` (`src/zobrist.ts:71` hashes
the en-passant file whenever `epSquare` is set, not only when a capture is available) makes two
FIDE-identical positions hash differently. A legitimate draw is missed; a false draw is never
declared. Every repetition verdict the loop renders inherits that.

## 8. The human in check

- Epic acceptance #3 is about **the side to move**, not about the human: *"Given the side to
  move is in check, when the board renders, then the status line states it explicitly."*
  `isInCheck(position)` reports exactly that and nothing else (`src/legal.ts:32-35` reads
  `position.blackToMove`). It is the right primitive and it is never the wrong one, because a
  position in which the side **not** to move is in check is illegal and unreachable through
  legal play. The loop never needs to ask "is the other side in check".
- In check is never a dead end. Either evasions exist — `legalMoves` returns only evasions, the
  loop prompts normally with the indicator on — or there are none, in which case `S1` already
  reported `checkmate` and `S3` is never entered. **A player in checkmate is never prompted.**
- The epic scopes the check indicator to the **status panel** only. No square highlighting is in
  scope; the board rendering scope item lists grid, labels, shading and pieces, and nothing else.
- EPIC-003 owns the *rejection* message for a move that would leave the king in check ("own king
  would be in check"). That is a `T7` re-prompt, not a check indicator concern.

## 9. Two hazards this loop inherits from merged code

**The mutable `Position`.** `memory-bank/30-architecture.md` `## System patterns` states it
plainly: *"a `Position` is a live object, never a snapshot — hold one across a move and it
changes under you."* Nothing clones a `Position` and no clone function exists. The loop is the
first component in this product that holds state across a move, so it is the first component
this hazard can bite. Concretely: `S4` can run for up to 3 s (`NFR-004`), and an engine search
built on `makeMove`/`unmakeMove` mutates the very object the renderer would read. Anything
captured before an `await` and read after it is a bug. The only value-snapshot primitive that
exists today is `toFen(position)` → string.

**`legalMoves` is not pure on a semantically-invalid position (`ABC-009`).** The loop calls it
once per frame through `gameStatus`. On a well-formed position it round-trips byte-identically;
on a grammatically-valid-but-invalid one it permanently mutates the board (phantom king). The
loop is safe **only** while every position it holds came from legal play out of a validated
start. `ABC-009`'s own escalation trigger names this exactly: *"ABC-009 rises to P1 if ABC-010
is deferred or descoped, or if any epic begins accepting a position from outside the rules core
before ABC-010 lands."* The loop is what will be running when that happens.
