---
id: ABC-019
title: Turn loop skeleton — ply dispatch, both seams stubbed, clean termination
status: backlog
column: Backlog
size: L
priority: P0
epic: EPIC-002
feature: —
---

# ABC-019 — Turn loop skeleton: ply dispatch, both seams stubbed, clean termination

## Problem

*User*: everyone. Without this there is no game — there are a renderer and a rules library.

*Pain*: the epic specified the loop in **one line** — *"render → prompt human → apply → render →
engine moves → repeat"* — against two epics that do not exist (`EPIC-003` input, `EPIC-004` engine).
Wave 1 expanded that line into 8 states and 15 transitions and found that the line **hardcodes
human-plays-white**, which is wrong for half the sessions this product promises, and that it does
not contain the loop's **most-travelled edge** at all: the four ways a prompt returns without
advancing a ply.

*Value*: the component that sequences all seven actors. It is the only thing in the product that
touches the renderer, the rules core, the history, the input seam and the engine seam at once.

## Scope

**A ply loop that dispatches on side-to-move**, not a human-turn loop with an engine tail:

```
while not terminal:
    append → derive counts → gameStatus(position, counts) → render → act
```

- **The first actor is a function of `position.blackToMove` versus the human's colour**, fixed at
  startup. `EPIC-006`'s acceptance requires that under `--colour black` the **engine opens as white
  and no prompt appears first**.
- **The order inside a ply is load-bearing and cannot be reordered.** The move is appended to the
  history **before** `gameStatus` runs, because `src/gameend.ts:106` tests
  `counts.get(zobristKey(position)) >= 3` and its doc comment states the count includes **the
  current occurrence** — evaluate before the append and the third occurrence reads as 2 and
  threefold is silently missed. And the frame renders **after** the evaluation, so the last board a
  player sees is the mated one.
- **`gameStatus` is never called bare.** The counts come from `ABC-012`, the single supplier
  (`ADR-0002` clause 4). Omit them and repetition is never reported, silently.
- **One render per ply.** A full move produces two frames.
- **Eight states** — `initialising`, `evaluating-terminal`, `rendering`, `awaiting-human`,
  `engine-thinking`, `applying`, `game-over`, `exiting` — and the transitions between them,
  including the four non-advancing outcomes of a prompt (rejected, ambiguous, non-mutating command,
  input unavailable) which return to the prompt **without** advancing the ply and **without**
  re-evaluating the terminal state, since the position did not change.
- **The loop's terminal reason is a superset of `EndReason`.** `src/gameend.ts:28-34` has exactly
  five values plus `null`; `EPIC-006` promises **six** conditions — those five plus `resignation`.
  The loop must not type its terminal state as `EndReason` verbatim.
- **Two stub seams**, built here and replaced later:
  - **Input stub** — a coordinate-only reader built from merged code alone: match
    `squareName(move.from) + squareName(move.to)` (`src/position.ts:60`, already exported) across
    `legalMoves(position)`. It returns a **generator-owned** `Move`, so it cannot get `captured`,
    `flags` or `promotion` wrong. It reaches the `ambiguous` outcome for free — `addPromotions`
    pushes **four** moves with identical `from`/`to` (`src/moves.ts:88-98`) — and the `rejected`
    outcome for any unmatched input.
  - **Engine stub** — returns a move from `legalMoves(position)`, seeded-deterministic, with an
    optional artificial delay so the thinking state is exercised.
- **`--ascii` / `--unicode` and the human's colour are parameters**, supplied by `EPIC-006`. The loop
  discovers neither and defaults neither.
- **Stdin EOF terminates the loop cleanly**: the loop stops, a one-line *input ended* notice is
  emitted, and the process exits **0**.
- **On any exception thrown by either seam, the position is rebuilt by replay** from
  `{ initialFen, moves }` rather than trusted. `legalMoves`, the search and `gameStatus` all play
  moves and take them back, so a throw mid-operation can leave the live object mid-mutation.

## Out of scope

- **The real parser** (`EPIC-003`) and **the real engine** (`EPIC-004`). The stubs are **test seams,
  not designs** for those epics.
- **`undo` / `resign` / `new` / `quit` and the result screen** — `EPIC-006`. The loop provides the
  transitions those commands drive; it does not implement the commands.
- **The opening book.** `EPIC-005` sits *behind* the engine seam. If the loop can tell a book move
  from a searched move, `EPIC-005`'s *"no discontinuity visible to the player"* has already been
  broken.
- **Frame content and writing** — `ABC-014`, `ABC-016`, `ABC-017`, `ABC-018`.
- **An animating thinking indicator.** The loop owns the flag; the indicator is static.
- **A "claim draw" interaction.** All five terminal conditions are automatic in this product:
  `gameStatus` returns the draw without being asked, and `EPIC-006`'s result screen lists repetition
  and fifty-move among the reasons it must name. FIDE treats threefold and fifty-move as claimable;
  this product does not. Settled by merged code plus `EPIC-006`'s acceptance, not open.

## Acceptance (Given/When/Then)

- **Given** the human's colour is **black** and the game starts from the standard position, **when**
  the loop runs, **then** the **first** actor invoked is the engine seam and **zero** prompts are
  issued before the first engine move. *(The control-flow correction. The original one-line flow
  fails this.)*
- **Given** the human's colour is white, **when** the loop runs one full move, **then** exactly
  **two** frames are rendered — one per ply.
- **Given** a ply is applied, **when** the loop proceeds, **then** the calls occur in the order
  *append to history → derive counts → `gameStatus` → render*, and **every** `gameStatus` call in
  the whole run carries a counts map. *(Assert on the call sequence, e.g. by spy. `gameStatus`
  called bare is the loop's single easiest way to ship a wrong-but-quiet game.)*
- **Given** a repeated line that reaches the same position a third time, **when** the loop
  evaluates, **then** it reports `result: "draw"`, `reason: "threefold-repetition"` **on the ply
  that completes the third occurrence**, not one ply later.
- **Given** the input seam returns `rejected`, **when** the loop continues, **then** the ply is
  **not** advanced, the position is byte-identical by `toFen`, `gameStatus` is **not** re-evaluated,
  and the prompt is re-issued. **Given** `ambiguous`, **then** the same holds and the candidate list
  reaches the frame's message region.
- **Given** the input seam returns a non-mutating command (`board`), **when** the loop continues,
  **then** a frame is re-emitted, the ply is not advanced and `gameStatus` is not re-evaluated.
- **Given** a scripted game driven to **checkmate**, **when** the loop ends, **then** the **final
  frame shows the mated position**, the terminal reason is `checkmate`, the winner is derived from
  `position.blackToMove`, and the process exits **0**.
- **Given** a scripted game whose stdin **ends before any terminal condition**, **when** the loop
  reaches end-of-input, **then** it terminates within one ply, emits a one-line *input ended*
  notice, and exits **0** — **and no terminal result is reported**. *(A truncated script must fail a
  test on the missing result screen, not pass on the exit code. See the ruling note below.)*
- **Given** the engine seam throws, **when** the loop recovers, **then** `toFen(position)` equals
  `toFen` of a position replayed from `{ initialFen, moves }`, and the loop either re-prompts or
  terminates with a named reason — it **never** continues on the object in hand.
- **Given** the engine seam returns a move that is not in `legalMoves(position)`, **when** the loop
  receives it, **then** it does **not** apply it and terminates with a named engine-failure reason.
  *(Failing loudly beats playing a corrupt board.)*
- **Given** the loop is in the thinking state, **when** a frame renders, **then** the thinking flag
  is set; **given** any other state, **then** it is clear and the frame's row count is **identical**.
- **Given** a position reaching **each** of the five `EndReason` values, **when** the loop
  evaluates, **then** it stops with that reason. *(All five, including `fifty-move` and
  `insufficient-material`. Note that because mate is tested first, a mate delivered on the 100th
  halfmove is correctly **mate**, not a draw.)*
- **Given** the loop's terminal-reason type, **when** it is inspected, **then** it admits
  `resignation` in addition to the five core values, **without** `src/gameend.ts` being changed.
- **Given** the cost bar in *Security / NFR triggers*, **when** measured, **then** it holds.

## The EOF ruling, recorded because the record did not contain it

No epic said what happens when stdin ends. Both answers are defensible: *treat as quit, exit 0* (it
is what `EPIC-006`'s *"exits cleanly with code 0"* suggests) or *treat as an error* (a scripted game
whose input runs out before mate arguably failed). **BA/PM ruled on 2026-07-30: exit 0, with a
notice, and the safety lives in the test's assertion rather than in the exit code** — `EPIC-006`'s
end-to-end test asserts the **checkmate result screen**, so a truncated script fails on the missing
screen. Putting the safety in the exit code would make the game report a failure for a situation in
which nothing is broken. Undecided, this is the shape of bug that manifests as a test that hangs in
CI.

## Dependencies

- **`ABC-012`** (history and the counts supplier) — hard. The loop cannot evaluate a terminal state
  without it.
- **`ABC-014`** and **`ABC-018`** — it needs something to render and something to write with. It can
  be built against `ABC-016`/`ABC-017` stubs.
- `ABC-005`, `ABC-003`, `ABC-007` — merged on `main`.
- **`EPIC-006`** supplies the human's colour and the glyph flags. The loop takes them as parameters;
  it is not blocked on `EPIC-006`, because a test supplies them directly.
- **Carried, not owned — `ABC-009`.** The loop calls `legalMoves` once per frame through
  `gameStatus`. On a well-formed position that is safe; on a semantically-invalid one `legalMoves`
  permanently mutates the board (phantom king). `ABC-009`'s own escalation trigger names this
  exactly: it *"rises to P1 ... if any epic begins accepting a position from outside the rules core
  before `ABC-010` lands"*. **This loop is the runtime that will be executing when `EPIC-003`'s FEN
  entry ships.** Sequencing input for `EPIC-003`'s decomposition; not a new defect and not re-scoped
  here.
- **Carried, not owned — `ABC-011`.** Every repetition verdict this loop renders inherits the
  en-passant hashing defect. Under-detects only: a legitimate draw is missed, a false draw is never
  declared.

## Security / NFR triggers

- `NFR-002` (16 ms frame) — bar: **loop overhead per ply ≤ 100 µs at 120 plies**, excluding the
  render, the input wait and the engine call, recorded with its machine. Derivation: one
  `repetitionCounts` (measured 46–50 µs at 120 plies, Apple M3 / Node v24.12.0 / darwin-arm64) plus
  one `gameStatus` (2.52 µs) plus one `playMove` (~10 ns). **The loop must derive the counts once
  per ply, not once per call site** — `gameStatusOf` after the human ply and after the engine ply are
  two derives of two different lists and that is correct; three derives of the *same* list is not.
- `NFR-004` (engine ≤ 3 s, hard ceiling 5 s) — **`EPIC-004`'s target, not this ticket's.** What
  binds here: **the engine seam is asynchronous by contract**, not because the engine is I/O-bound
  (it is pure CPU) but because a loop shaped around a synchronous call cannot later accept a yielding
  or worker-based engine without being rewritten, and `NFR-004` permits a 3-second occupancy.
- **No `Position` reference is held across a suspension.** The loop suspends at exactly two places —
  waiting on stdin and waiting up to 3 s on the engine — and **both bracket a mutation**: the search
  descends with `makeMove`/`unmakeMove` on the live object. Anything captured before a suspension and
  read after it is a bug. The only value-snapshot primitive that exists is `toFen(position)`.
  Measurable bar: after any suspension, every rendered value is re-read from the live object at that
  moment.
- **No security trigger of its own.** The loop places strings; `ABC-018` sanitizes them.

## Test notes

The loop is testable end-to-end **today**, with no parser and no engine, because both stubs are
built from merged code. That is the point of the stubs.

- **Drive scripted games through the stub seams**: a mate line, a threefold line, a stalemate line,
  a fifty-move line, an insufficient-material line, a rejected input, an ambiguous input (any
  promotion is ambiguous under a from/to match), a `board` redraw, an EOF, an engine throw, and an
  engine returning a foreign move. Each is a table row with an exact expected terminal reason and
  frame count.
- **The threefold test must use a repeated line that never sets an en-passant square**, for the same
  reason `ABC-012`'s does — `ABC-011` would otherwise make it fail for a reason that is not this
  loop's. `src/gameend.test.ts:27-58`'s knight cycle is the shape to reuse.
- **Assert the call *order* inside a ply, not just the outcome.** Append-then-evaluate versus
  evaluate-then-append produces the same result on every position except the third repetition, which
  is exactly the case a happy-path test does not contain.
- **Assert the frame *count*, not just the final frame.** One render per ply is the cadence; a loop
  that renders twice per ply passes every content assertion.
- **Do not test the real engine's timing here.** `NFR-004` belongs to `EPIC-004`; the stub's delay
  exists to exercise the thinking state, and quoting a number from it would be a fabricated
  measurement.

## Size and priority rationale

**Size `L` (5).** Eight states, fifteen transitions, two stub seams, a load-bearing intra-ply
ordering, exception recovery by replay, and a terminal-reason type that must be a superset of the
core's. It is the only ticket in this epic that touches every other component. Calibrated against
`ABC-004` (special moves, `L`) — comparable in test surface, and like that ticket it is `L` for the
number of distinct cases rather than the volume of code.

**Not `XL`, and here is what was kept out to hold that line:** frame output and the redraw model
(`ABC-018`, 2 points) and the history module (`ABC-012`, 3 points) are separate tickets. Folding
either back in makes this `XL` (8) and an automatic `SPLIT_REQUIRED`. **Re-size at the design hop if
the stubs turn out to need more than merged `src/` provides** — the coordinate reader and the
seeded-random engine were both verified by wave 1 to be buildable from merged code alone.

**Priority `P0`.** There is no game without it.

## Definition of Ready

Problem ✅ · scope + out-of-scope ✅ · INVEST ✅ (testable end-to-end via the two stubs) ·
acceptance measurable ✅ (exact first actor, exact frame counts, exact call order, exact terminal
reasons, exit code, byte-identical FEN after recovery) · dependencies ✅ (`ABC-012`, `ABC-014`,
`ABC-018`; `ABC-009` / `ABC-011` carried and named) · NFR triggers ✅ (numeric per-ply bar with a
derivation; the async-seam and no-reference-across-suspension constraints stated as bars) ·
test notes ✅ · size `L` ✅ · priority `P0` ✅ · no blocker ✅

Sits in `Backlog` behind its three dependencies. Promotion to `Ready` is a separate BA/PM step.
