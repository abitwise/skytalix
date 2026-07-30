---
id: 20260730T152600Z-system-analyst-decision-cca3c342
kind: decision
by: system-analyst
at: 2026-07-30T15:26:00Z
verified_by: 
confidence: high
refs:
  - epic-to-tickets-EPIC-002
  - EPIC-002
  - EPIC-003
  - EPIC-004
  - EPIC-006
  - ADR-0002
  - ADR-0001
  - NFR-002
  - NFR-003
  - RISK-005
  - ABC-009
  - ABC-011
  - 20260730T151200Z-system-analyst-observation-59aca936
  - 20260730T151800Z-system-analyst-observation-ea2a3bce
  - plans/epics/EPIC-002-terminal-board-and-game-loop.md
  - plans/epics/EPIC-006-game-session-and-packaging.md
  - memory-bank/30-architecture.md
  - memory-bank/50-decisions/ADR-0002-game-history-ownership.md
  - src/legal.ts
  - src/apply.ts
  - src/gameend.ts
  - src/position.ts
supersedes: 
---

# Twelve system rules for the turn loop, settled from the record

Each rule below is resolved from merged code, a ratified ADR, or a stated epic acceptance
criterion — the authority is named on every one. These are behavioral rules, not structure: none
of them names a module, an API or a file. What could **not** be settled is on the stop list
(companion `claim` note), and nothing here papers over anything there.

## R1 — The loop iterates plies and dispatches on side-to-move

`while not terminal: evaluate → render → (human if side-to-move is the human's colour, else
engine) → apply`. Not "prompt human, then engine".
*Authority:* `EPIC-006` acceptance — *"Given `--colour black --difficulty 3` … the engine opens
as white."* The epic's one-line flow describes the human-plays-white steady state, not the
control flow.

## R2 — Order within a ply: append → derive → evaluate → render → act

Stated in full in the state-map note §6.
*Authority:* `src/gameend.ts:106` and its doc comment — the repetition count must **include the
current occurrence**, so history must be appended before `gameStatus` runs; and epic acceptance
requires the final frame to show the position the game ended in.

## R3 — `positionCounts` is passed on every `gameStatus` call, from the one supplier

The loop never calls `gameStatus(position)` bare. The counts map includes the **initial position
at count 1** plus every position after every ply.
*Authority:* `ADR-0002` clause 4 (ratified) — *"`gameStatus`'s `positionCounts` gets exactly one
supplier: the history module. No other caller constructs that map."* And `src/gameend.ts:87-90`:
omit it and repetition is *silently* never reported. This is the loop's single easiest place to
ship a wrong-but-quiet game.

## R4 — A `Move` handed to `makeMove` always comes from the generator for that position

Never hand-constructed, never carried over from an earlier position, never assembled from parsed
text.
*Authority:* `src/apply.ts:158` — `unmakeMove` restores `position.board[move.to] = undo.captured`
and `undoSpecial` restores `move.captured` beside `to` for en passant. A `Move` whose `captured`,
`flags` or `promotion` is wrong applies *plausibly* and corrupts the board only on the way back —
i.e. on `EPIC-006`'s `undo`, one to many plies later, with nothing thrown. This rule is what makes
that class of bug unrepresentable, and it binds both the EPIC-003 and EPIC-004 seams.

## R5 — No `Position` reference is held across an `await`

Anything read after suspension is re-read from the live object at that moment. If a frame's data
must outlive a suspension, it is captured as values (the only value-snapshot primitive that exists
today is `toFen(position)` → string).
*Authority:* `memory-bank/30-architecture.md` `## System patterns` — *"a `Position` is a live
object, never a snapshot — hold one across a move and it changes under you"*; nothing clones a
`Position` and no clone function exists. The loop suspends at exactly two places (`S3` waiting on
stdin, `S4` waiting up to 3 s on the engine), and both bracket a mutation.

## R6 — On any exception from a seam, the position is rebuilt by replay, never trusted

If the parser or the engine throws mid-operation, the live `Position` may be mid-mutation
(`legalMoves`, the search and `gameStatus` all play moves and take them back). The loop rebuilds
from `{ initial position, Move[] }` rather than continuing on the object in hand.
*Authority:* `ADR-0002` clause 2 (ratified) makes the move list authoritative and replay costs
**41 µs at 120 plies** (M3, Node v24.12.0, darwin/arm64, transcribed from the ADR's Context table)
— cheap enough to be the standing recovery, not a last resort. `memory-bank/30-architecture.md`
`## System patterns` records the transient-mutation pattern this defends against.

## R7 — Orientation is a session constant, applied as a 180° rotation to both axes

White at the bottom: ranks 7→0 down the frame, files 0→7 across, rank labels 8..1, file labels
a..h. Black at the bottom: ranks 0→7, files **7→0**, rank labels 1..8, file labels **h..a**.
Both axes flip together, and the labels flip with them.
*Authority:* the 0x88 mapping in `src/position.ts` (`squareAt(file, rank) = rank*16 + file`) plus
epic acceptance #1 (*"all 64 squares plus file letters `a-h` and rank numbers `1-8` … oriented to
the human's colour"*). Flipping one axis only produces a left-right mirror in which the king and
queen swap files — a board that looks plausible and is wrong. Orientation does not change during
a game: no epic's command set (`moves`/`help`/`board`/`quit`; `undo`/`resign`/`new`/`quit`)
contains a flip, and `EPIC-006` fixes colour at startup including the `random` case.

## R8 — Glyph mode is decided once, at startup, before the first frame

Precedence: **explicit flag > capability detection > default Unicode**. The result is a session
constant, cached, never re-probed per frame.
*Authority:* `RISK-005`'s mitigation is *"the ASCII fallback being built in from the start rather
than retrofitted"*; `--ascii` is a startup flag; `NFR-002`'s 16 ms budget makes per-frame probing
pointless waste; and a mid-game switch would make the session's scrollback internally inconsistent.
**What the detection rule actually is remains unsettled — see the stop list.** This rule fixes the
*timing and precedence* only, which is what the loop needs and what is decidable from the record.

## R9 — The ASCII acceptance criterion is verified on the emitted bytes

Restate epic acceptance #2 — *"no replacement glyphs (`?`/`�`) appear"* — as: **in ASCII mode the
emitted frame contains no code point above U+007F.**
*Authority:* the criterion as written is a property of what the *terminal drew*, which a process
cannot observe; the byte-stream form is the same intent, is decidable in-process, and is directly
assertable by the snapshot tests the epic's own `## Test notes` already call for. This restatement
narrows nothing: any `?`/`�` a terminal substitutes is caused by a non-ASCII code point in the
stream, so an all-ASCII stream cannot produce one. The residual — a terminal in **Unicode** mode
whose font lacks the figurines — is not covered by this and is on the stop list.

## R10 — The frame has invariant height across the thinking transition

The engine-thinking indicator occupies a permanently allocated row, blank when not thinking.
Likewise the message region (EPIC-003's rejections) is a frame-owned region, not text printed
beside the frame.
*Authority:* epic acceptance #4 — *"the board redraws without leaving stale rows from the previous
frame."* A frame that grows by a row when the engine starts thinking, or when a rejection message
appears, is the exact mechanism that produces stale rows. **This rule bounds one source of height
variation; it does not solve the growing-history one, which is on the stop list.**

## R11 — Whatever clears the previous frame clears to end-of-screen, not by counted lines

Erase from the end of the new frame to the end of the screen in one operation, rather than
cursor-up-by-previous-height-and-overwrite.
*Authority:* the same acceptance criterion. Counted-line redraw is correct only while consecutive
frames have equal height; clearing to end-of-screen is correct even when the previous frame was
taller, which is the failure this criterion names. Independent of the in-place-vs-scroll choice
(under scroll mode the rule is vacuous, not violated).

## R12 — The rendered frame must be observable as a value, without a terminal

The frame is assertable without a TTY attached.
*Authority:* EPIC-002's `## Test notes` require snapshot tests over known FENs in both glyph
modes, and `EPIC-006`'s `## Test notes` require an end-to-end test driving *"the real stdin/stdout
interface"* from `npx` to a result screen — which runs with stdout as a **pipe, not a TTY**. Both
are satisfiable only if a frame can be produced and compared without a terminal. This is a
testability requirement on the data, not a statement about where the code lives.

## Rules deliberately NOT taken here

- Where SAN formatting lives, the history module's API, and whether derived counts are memoized —
  `ADR-0002` defers these to this decomposition and **Architect/Design owns them**, concurrently.
  Nothing above depends on how any of the three is answered.
- Ticket boundaries and sizes — BA/PM's, wave 2.
- Any change to merged `src/`. `ABC-009` and `ABC-011` are named as inherited exposure only; they
  are already cut and neither is re-scoped here.
