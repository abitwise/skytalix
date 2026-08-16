---
id: ABC-102
title: `undo` — two plies back in one command, and the loop arm it has no home in
status: backlog
column: Backlog
size: S
priority: P1
epic: EPIC-006
feature: —
---

# ABC-102 — take back the human move AND the engine reply, as one step

> **Cut 2026-08-16 by BA/PM** (task `epic-to-tickets-EPIC-006-packaging`, Workflow 03). `undo` was
> named as deliberately-not-cut at the 2026-08-13 pass; this is its cut.
>
> **THE STATE MECHANISM IS MERGED AND NAMED. THE LOOP INTERACTION IS NOT DECIDED, AND THIS TICKET
> DOES NOT DECIDE IT** — it records the gap where the next engineer will read it, the same way
> `ABC-046` does for `quit` and `new`, and for **the same underlying question**. Its Definition of
> Ready is deliberately not met.

## Problem

*User*: the player who fat-fingered a move, and the beginner who wants to see what the other line
does.

*Pain*: **the operation exists, is merged, and is addressed to this epic by name — and nothing can
call it.** `src/history.ts:90-105`:

> *"Undoes the last `plies` moves: truncates the list, then rebuilds the position by replay from
> `initialFen`. This is `ADR-0002`'s contract made mechanical — undo is one operation on one list, so
> nothing derived can be left behind. **`EPIC-006`'s undo is `takeBack(history, 2)`.**"*

There is no `undo` token in any command table and no outcome the loop can carry for it.

*Value*: the epic's user-value sentence (*"take back the move you fat-fingered"*) and its acceptance
criterion 2 — *"the position returns to before the player's own last move — two plies back, one
command"*. **It is the one command in this epic a player uses in an ordinary game rather than at the
end of one.**

## The risk this epic recorded is STRUCTURALLY ABSENT, and that is measured, not argued

`EPIC-006` § Risks: *"a shallow undo that forgets repetition history would corrupt draw detection."*

**It cannot happen in this codebase.** `GameHistory`'s authoritative state is the move list
(`ADR-0002` clause 2); `position`, `keyHistory` and `repetitionCounts` are all **functions of it**,
recomputed by replay from `initialFen`. `takeBack` splices the list and replays — so the position,
the Zobrist key list and the repetition counts rewind **together or not at all**. There is no cached
derived state to forget. **`A4` asserts it anyway**, because a structural argument that nothing tests
is one refactor from being wrong.

## The contract gap — the SAME open ruling `ABC-046` is blocked on

`PromptOutcome` (`src/turn-loop.ts:125-132`) has seven arms: `move`, `rejected`, `ambiguous`,
`command`, `claim`, `eof`, `game-over`. **`undo` fits none of them.** It is not a move (it does not
advance the game), and `command` is defined as a **non-advancing, message-only** outcome: after
transitions 7/8/9 the loop goes **straight back to `rendering` without re-evaluating `GameStatus`**
(`src/turn-loop.ts:342-346`), which is by design — it is what makes `ABC-019`'s `A5`/`A6`
*"not re-evaluated"* a property of the machine.

**Three shapes, priced, NONE ADOPTED HERE:**

| shape | cost |
|---|---|
| **(a) the `InputSeam` calls `takeBack` on the borrowed history and returns `{ kind: "command" }`** | in-contract, **zero change to `Done` work** — and the loop then renders and evaluates against a **stale `GameStatus` from the position that was just taken back**, until the next move. Check, mate-ability and the draw-claim cell can all be wrong for one or more frames. **`ABC-046` has the same defect on `new`, on one frame; `undo`'s persists until the player moves.** Cheapest by far, and wrong in a way a player can see |
| **(b) the loop re-evaluates on a state-changing command (a new arm, or `command` gains a "state changed" flag)** | correct, and it **re-opens a `Done`, gated, mutation-tested module** whose state machine is enumerated at 8 states / 16 transitions. **Needs Architect/Design and its own ticket** |
| **(c) `undo` is not offered** | rejected outright: the epic's acceptance criterion 2 names it, and it is in the user-value sentence |

**This is the same question `ABC-046` routed on 2026-08-13, and `undo` is the strongest argument for
shape (b) that exists** — stated here so the ruling is made once, for both tickets, rather than twice.
**Owner: Architect/Design.**

## The product rulings this ticket DOES make

**BA/PM, 2026-08-16.** These are the command's user-facing semantics, which are mine; none of them
touches the arm question above.

1. **One `undo` is two plies** — the human's move and the engine's reply — per acceptance criterion
   2. Never one ply, never "back to my last move whenever that was".
2. **`undo` is repeatable**, back to the start of the game. *(No limit is asked for anywhere, and a
   limit is state this feature does not need — coding rule 5.)*
3. **`undo` with fewer than two plies played is REFUSED, with a message, and changes nothing.**
   **This is the one criterion that matters most**, because `takeBack` *"CLAMPS at zero rather than
   trusting the caller"* (`src/history.ts:95-98`) — so a naive `takeBack(history, 2)` at ply 1
   **silently resets the game to the start** and looks like it worked. The clamp is correct as a
   safety floor and is the wrong behaviour for this command.
4. **No confirmation** — `ABC-045`'s reasoning applies unchanged: a mistaken `undo` is visible in the
   very next frame and is itself undone by playing the move again.
5. **`undo` is a command, classified before the grammars** — `ABC-035`'s merged table order.

**Explicitly NOT ruled here: what happens to a `--difficulty` level, an opening book position or a
transposition table on undo.** None of those exists; `EPIC-004` and `EPIC-005` own them and neither
is decomposed at this hop.

## Scope

- **The `undo` token**, a row added to `ABC-035`'s delivered command table (grammar, tolerance and
  the teaching rejection follow that ticket's merged rules; this adds a row, not a second table).
- **The effect**: `takeBack(history, 2)`, guarded by ruling 3, then a redrawn board.
- **The refusal message** for ruling 3.
- **Nothing else.**

## Out of scope

- **Choosing shape (a), (b) or (c)** — Architect/Design's, and the reason this ticket is not `Ready`.
- **Changing `src/turn-loop.ts`.** If shape (b) is ruled, that change is **its own ticket**, not a
  quiet edit inside this one. Same fence as `ABC-046`.
- **`redo`.** In no epic's scope, and none is cut.
- **An `undo` that takes back only the human's move** when the engine has not yet replied — that
  cannot arise; see `## Two scenarios that cannot occur`.
- **`quit`, `new`, `resign`** — `ABC-045` and `ABC-046`.

## Two scenarios that cannot occur, and are deliberately NOT handled

Coding rule 8, stated so nobody writes a branch for them:

- **`undo` while the engine is thinking.** The loop is single-threaded and `await`s the engine seam;
  input is read only in `awaiting-human`. **The human is always to move when `undo` is typed**, so
  the last two plies are always *engine reply, then human move* — except at ruling 3's boundary.
- **`undo` after the game has ended.** The loop has already returned; there is no prompt to type it
  at. `ABC-044`'s result screen offers nothing (its own fence).

## Acceptance (Given/When/Then)

- **`A1` (two plies, one command).** **Given** a game at ply ≥ 4 with the human to move, **when**
  `undo` is entered, **then** `history.moves.length` decreases by **exactly 2**, and
  `toFen(history.position)` is **byte-identical** to the FEN captured before the human's own last
  move. *(Criterion 2 of the epic, asserted on both the list and the position, because a build that
  rewinds one and not the other passes either check alone.)*
- **`A2` (the refusal at the boundary — THE ONE THAT CATCHES THE CLAMP).** **Given** a game with
  **0** plies played, and again with **exactly 1** ply played, **when** `undo` is entered, **then**
  the move list length is **unchanged**, `toFen(history.position)` is **byte-identical** to the FEN
  before the command, and a message naming why is written. *(A build that calls `takeBack(history, 2)`
  unguarded silently returns a 1-ply game to the start and passes `A1`.)*
- **`A3` (repeatable, and it lands on the start position exactly).** **Given** a game at ply 6,
  **when** `undo` is entered three times, **then** `history.moves.length` is **0**,
  `keyHistory(history).length` is **1**, and a fourth `undo` is refused per `A2`.
- **`A4` (the derived state rewinds with it — the epic's own risk).** **Given** a game at ply ≥ 6
  containing a **repeated position**, **when** `undo` is entered, **then** `repetitionCounts(history)`
  matches the counts computed for the shortened game **entry for entry** — not merely smaller — and
  `keyHistory(history).length` equals `history.moves.length + 1`.
- **`A5` (the frame after `undo` shows the position that is now live — THE CRITERION THE RULING
  DECIDES).** **Given** a position whose `GameStatus` differs before and after the take-back (a check
  that is undone, or a live draw claim that is undone), **when** `undo` is entered, **then** the
  **next frame's status panel reflects the position after the undo**. **A build on shape (a) fails
  this criterion.** *(Stated rather than softened so that adopting (a) is a recorded, deliberate
  acceptance of a wrong panel and not an accident. If the ruling is (a), this criterion must be
  **explicitly amended by BA/PM with the defect recorded**, not quietly dropped — `ABC-046` `A5`'s
  rule, applied to the same question.)*
- **`A6` (it is a command, classified before the grammars).** **Given** the line `undo`, **then** the
  outcome is produced by the command table and **neither move resolver is called** (spied).
- **`A7` (no confirmation).** **Given** a single `undo` line, **then** it takes effect on that line —
  **no** second line is read (asserted by a stdin whose next line is never consumed).
- **`A8` (nothing else changed).** `git diff --numstat` shows `ABC-035`'s command module and the test
  file(s) and nothing else under `src/` — **`src/turn-loop.ts` and `src/history.ts` byte-identical**,
  unless shape (b) is ruled, in which case that change is a separate ticket and this criterion still
  holds for this one. Suite green, skip **0**.

## Dependencies

- **THE FIRST BLOCKER IS A RULING, NOT A TICKET: shape (a), (b) or (c). Owner: Architect/Design —
  and it is the SAME ruling `ABC-046` is blocked on.** Until it lands, `A5` is not satisfiable in
  merged code.
- **THE SECOND BLOCKER IS `EPIC-004`, BY NAME AND BEHAVIOUR — NOT by ticket id.** *"Takes back the
  human move **and the engine reply**"* needs an engine reply to take back. **No `EngineSeam`
  implementation exists anywhere** (`ABC-043` records the same fact). Until one does, `A1`, `A3` and
  `A4` can be proved only against a **test double** engine — which is honest unit coverage and is
  **not** the epic's end-to-end criterion. *(Its ids are being minted in parallel with this hop and
  none is guessed here.)*
- **`ABC-035` must land first — OPEN** (`EPIC-003`): this ticket adds a row to its command table.
- **`ABC-037` must land first — OPEN** (`EPIC-003`): the table is consulted by the reader.
- **`ABC-043` must land first — OPEN and itself blocked**: `A5` needs a running session.
- **`ABC-012` (`takeBack`, `keyHistory`, `repetitionCounts`), `ABC-019` and `ADR-0002` are MERGED**
  and supply the entire state mechanism. **`undo` needs no new state logic at all** — that is the one
  genuinely cheap half of this ticket, and it is why the risk in the epic is already answered.
- **Cross-epic check, named so it is not discovered:** if `ABC-038` (tab-completion) has merged,
  `undo` must be a completion target — automatic if its source is the command table, a second edit if
  it is a separate list.

## Security / NFR triggers

- **`N8-LANE`, inherited by name** — ≤ **650 ms CPU**, same instrument and protocol.
- **Cost of `undo`, priced rather than asserted:** `takeBack` replays from `initialFen` — `O(plies)`,
  the same operation the loop already performs on **both** seam-failure paths (`takeBack(history, 0)`
  at `src/turn-loop.ts:307` and `:374`). It runs **once per `undo`**, never per ply. `keyHistory` is
  ~46–50 µs at 120 plies (`src/history.ts:13-15`), and `A4` is the only criterion that calls it.
- **`NFR-002` — not triggered.** No frame is composed and no derive is added. **`A5` is an
  `NFR-002`-adjacent *correctness* criterion, not a latency one**, and is labelled so the two are not
  confused (`ABC-046`'s wording, same reason).
- **Security — not triggered.** One token in an existing table already covered by `ABC-037`'s three
  bars. **Firing threshold: it fires if the diff touches any file under `src/` other than
  `ABC-035`'s command module and the test file(s).**

## Test notes

1. **`A2` is the whole ticket.** Test **0** plies and **1** ply separately. The 1-ply case is the one
   the clamp turns into a silent full reset, and it is reachable in a real game: the human plays
   black, the engine opens, the human types `undo`.
2. **`A4` must compare counts entry for entry**, not just assert the map is smaller. A rewind that
   rebuilds the position but keeps a stale key list passes a size check and corrupts the next draw
   detection — the epic's stated risk.
3. **`A1` must capture the FEN before the human's move and compare bytes.** A ply-count assertion
   alone passes a build that takes back two *different* plies.
4. **`A5` needs a fixture whose status genuinely differs across the take-back.** `src/turn-loop.test.ts`
   already builds threefold positions; reuse one rather than constructing a new one.
5. **`A1`/`A3`/`A4` run against a stub `EngineSeam` returning a fixed legal move.** Do not wait for
   `EPIC-004` to write them, and do not claim end-to-end coverage from them.
6. **Reuse the entry-point spawn harness** from `ABC-042`/`ABC-043` for `A5`. Do not build another.

## Lane cost — how many test FILES this ticket implies

**Zero new files.** `A1`–`A4`, `A6`, `A7` extend `ABC-035`'s command test file (with a stub engine);
`A5` extends the entry-point file `ABC-042`/`ABC-043` share. No `vi.mock`, so **no `*.nfr.test.ts`**.
**Weight: nil** — it adds no file. **If shape (b) is ruled**, the loop change is a separate ticket
with its own file count and is **not** counted here — stated so the epic's arithmetic stays honest.

## Size and priority rationale

**Size `S` (2).** One table row, one guarded call to a merged function, one refusal message, eight
criteria — and **no new state logic whatsoever**. It is above `XS` because of ruling 3's boundary
guard and because `A5` is contingent on a ruling. Calibrated against `ABC-046` (`S`), which it
closely resembles.

**Not `XL`. No split line** — a two-ply take-back with a boundary guard does not divide into two
valuable halves.

**Priority `P1`.** It is named in the epic's user-value sentence **and** is one of the epic's three
acceptance criteria, and unlike `quit`/`new` it has **no workaround at all**: a player who mis-moves
today must restart the process and replay the game. **Not `P0`:** the game is playable without it,
and three `P0` tickets (`ABC-041`–`ABC-043`) plus an engine sit in front of it.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-16**. **Result: 7 of 10 clean, 3 recorded ⚠️ — NOT MET; stays in `Backlog`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** the operation is merged and addressed to this epic by name at `src/history.ts:93`; no token and no arm exists — both read at source, neither argued |
| 2 | scope and out-of-scope clear | **✅** one token, one guarded call, one message; five fences plus two explicitly unhandled impossible scenarios |
| 3 | INVEST-shaped | **⚠️** valuable, negotiable, estimable, small, testable — **not independent**: three open ordering dependencies, an open ruling, and an epic that owes the engine reply |
| 4 | acceptance testable and measurable | **✅** eight criteria: **exactly 2** plies, a byte-identical FEN, an **unchanged** list at the 0- and 1-ply boundary, `moves.length` **0** / `keyHistory` **1** after three undos, repetition counts compared entry for entry, both resolvers spied at **0**, an unconsumed-line witness, `turn-loop.ts` byte-identical |
| 5 | dependencies known | **✅** the ruling named with its owner and three priced shapes, and identified as the **same** ruling `ABC-046` carries; `EPIC-004` depended on **by name and behaviour with no id guessed**; three open tickets; three merged sources; one cross-epic completion check |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` ≤ **650 ms CPU**; `takeBack` priced against the loop's two existing call sites; `NFR-002` not triggered with `A5` labelled correctness rather than latency; security not triggered with a falsifiable threshold |
| 7 | test notes present | **✅** six |
| 8 | size assigned | **✅** `S` (2), calibrated against `ABC-046` |
| 9 | priority assigned | **✅** `P1`, on the measured fact that there is **no workaround** |
| 10 | no major unresolved blocker | **⚠️⚠️ TWO.** **(a) THE CONTRACT RULING IS OPEN** — `undo` has no arm, three shapes are priced and **none is adopted here**; it is `ABC-046`'s ruling and should be made once for both. **(b) `EPIC-004` owes the engine reply** this command exists to take back; until it lands, `A1`/`A3`/`A4` are provable only against a stub. *(Three open ordering dependencies are counted under item 3, not double-counted here.)* |
