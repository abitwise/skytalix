---
id: ABC-021
title: Draw-claim interaction — the player having the move claims, the loop ends the game, the engine does not
status: backlog
column: Backlog
size: S
priority: P1
epic: EPIC-002
feature: —
---

# ABC-021 — Draw-claim interaction: the player having the move claims, the loop ends the game, the engine does not

## Problem

*User*: the human player, who under FIDE 9.2 and 9.3 holds a right — and a right nobody can exercise
is not a right.

*Pain*: `ABC-020` makes threefold repetition and the fifty-move rule **claimable** rather than
automatic, which is what the Laws require. On its own that leaves the product reporting that a draw
is available to the side to move and giving that player **no way to take it**. The game then runs on
to the fivefold / 75-move backstop, which is legal but is not what the player asked for.

*Value*: this is the half of the owner's directive that faces the player. `ABC-020` stops the
product imposing a draw the Laws do not impose; this ticket lets the player claim the draw the Laws
do grant. Together they are FIDE 9.2/9.3/9.6; separately, one is a rules library and the other is a
gap.

## The product ruling this ticket implements

BA/PM ruled on 2026-07-31, under the owner's standing legality-first priority. Four questions, four
answers, each with the reason it was answered that way rather than the other way.

**1. Who claims? The player having the move — and in this slice that means the human only.**
FIDE 9.2.1 gives the claim to the claimant having the move, and `ABC-020` computes availability
against the side to move. The human asks for it explicitly; nothing claims on the human's behalf.

**2. Does the engine claim on its own behalf? No — and the reason is that it cannot yet.**
A claim policy worth having is *"claim when the position is not better for me"*, and that needs an
evaluation function. **`EPIC-004` does not exist**, and `ABC-019`'s engine stub is seeded-random with
no evaluation at all. The only policy implementable today is *"always claim when available"*, which
is **strictly worse chess** — it would throw away won games by claiming a draw in a winning position.
Not claiming is always legal under FIDE (a claim is a right, never an obligation), and the 9.6
backstops still terminate the game four plies later, so declining to claim costs conformance
nothing. **The policy is therefore a named seam handed to `EPIC-004`'s decomposition**, recorded in
this ticket's *Dependencies* so it is not rediscovered. This is a deferral with a named owner, not an
omission.

**3. Is a claim offered when one is available? No prompt, no interruption — the frame states it.**
The status panel gains one indicator (`ABC-016`, amended today) naming what is claimable by the side
to move; the player types `claim` when they want it. **An offer prompt was rejected on product
grounds:** `EPIC-002` acceptance `4a` requires every frame to have an identical row count, and a
modal offer breaks that; and this product's value is *one command, five seconds, and you are
playing* — the same reasoning that rejected the first-run glyph prompt in epic amendment `[A1]`
(`2c`). A player who never learns the command loses nothing they had before this pair of tickets:
the game still ends automatically under 9.6.

**4. What does the status panel show? Availability, attributed to the side to move.** Not "you may
claim" — the panel renders on the engine's plies too, and the claim genuinely belongs to whoever has
the move. One rule, no special case, and it matches `gameStatus`'s own semantics exactly. `ABC-016`
owns the rendering; this ticket owns the value it renders.

## Scope

**The loop's claim path**, built on `ABC-019`'s state machine and its two stub seams.

- **A fifth prompt outcome, `claim`,** alongside `ABC-019`'s four non-advancing outcomes (rejected,
  ambiguous, non-mutating command, input unavailable). It is the only command outcome that
  **terminates**; the other four return to the prompt.
- **A correct claim ends the game.** The loop stops with a terminal reason naming the claimed article
  (threefold repetition claimed, or fifty-move claimed), the final frame shows the claimed position,
  and the process exits **0** — the same termination shape `ABC-019` already specifies for checkmate.
- **An incorrect claim is rejected with a reason that teaches**, and is otherwise `ABC-019`'s
  existing `rejected` path unchanged: the ply is not advanced, the position is byte-identical by
  `toFen`, `gameStatus` is **not** re-evaluated, and the prompt is re-issued. The message names the
  gap — *this position has occurred twice; a claim needs three* / *the halfmove clock is 41; a claim
  needs 100* — never a bare "cannot claim". That is `EPIC-003`'s "reject with a reason that teaches"
  standard applied to a command.
- **The claim-availability value reaches the frame.** The loop already calls `gameStatusOf(history)`
  exactly once per ply (`ABC-019`'s `NFR-002` bar: *derive the counts once per ply, not once per
  call site*). Availability is read off **that same call**. No second derive, no second
  `repetitionCounts`.
- **The engine seam is never asked for a claim** in this slice, and the loop never claims on the
  engine's behalf.
- **The loop's terminal-reason type admits the claimed reasons** in addition to the automatic ones
  and `resignation`. `ABC-019` already requires that type to be a superset of the rules core's;
  `ABC-020` widens the core's set and this widens the loop's.

## Out of scope

- **The `claim` verb's grammar, aliases, tolerance and tab-completion** — `EPIC-003`, whose `## Scope`
  was amended today to name the command. This ticket builds against `ABC-019`'s **stub** input seam,
  which matches a literal token, exactly as that ticket builds its coordinate reader from merged code
  alone. The stub is a test seam, not a design for the parser.
- **Rendering the availability indicator** — `ABC-016`, amended today to carry it as item 7.
- **The result screen's wording for a claimed draw** — `EPIC-006`.
- **The engine's claim policy** — `EPIC-004`, per the ruling above.
- **What is claimable, and when** — `ABC-020`. This ticket asks the rules core; it does not decide.
- **Draw offers (FIDE 9.1), claiming a draw that will arise after an intended move (9.2.1.1 /
  9.3.1), and any penalty for a false claim (9.5.3)** — all three cut in `ABC-020`'s
  `## Out of scope` with their reasons. Named again here only so nobody re-opens them at the prompt
  layer, where they would look like input features rather than rules.
- **`undo` after a claim, `new`, `resign`** — `EPIC-006`'s command set.

## Acceptance (Given/When/Then)

- **Given** a scripted game driven to `ABC-020`'s A1 position (`6k1/5ppp/8/b7/8/8/5PPP/4R1K1` with
  the shuffle `Kh1 Bb6 Kg1 Ba5 Kh1 Bb6 Kg1 Ba5`) with the **human** playing White, **when** the human
  types `claim` at the prompt, **then** the loop terminates with a reason naming a **claimed
  threefold repetition**, the final frame shows that position, and the process exits **0**.
- **Given** that same position, **when** the human instead plays `Re8`, **then** the game ends
  `white-wins` / `checkmate` and **no draw is reported at any point in the run**. *(This is the
  owner's directive end to end: the draw is available and it is never imposed. Assert on the whole
  run's terminal verdict, not only the final one.)*
- **Given** a position in which nothing is claimable, **when** the human types `claim`, **then** the
  ply is **not** advanced, `toFen(position)` is byte-identical, `gameStatus` is **not** re-evaluated,
  the message names how far the position is from a claim, and the prompt is re-issued. *(Same
  assertions `ABC-019` makes for `rejected`; this is that path, not a new one.)*
- **Given** a claim is available and the **engine** has the move, **when** the engine seam runs,
  **then** the engine plays a move and **no claim is made** — assert by spy that the engine seam is
  never asked for one — and the game continues.
- **Given** a repeated line driven to a **fifth** occurrence with neither side ever claiming, **when**
  the loop evaluates, **then** it terminates automatically with the **fivefold** reason and exits 0.
  *(The 9.6.1 backstop reached through the loop rather than through the rules core in isolation —
  the end-to-end proof that declining to claim cannot hang the game.)*
- **Given** any ply, **when** the frame is composed, **then** the claim-availability value is present
  and was read from the **single** `gameStatusOf` call that ply already makes. *(Assert the call
  count, not just the value. A second derive per ply is the easy wrong implementation and it is
  invisible to every content assertion.)*
- **Given** the loop's terminal-reason type, **when** it is inspected, **then** it admits both claimed
  reasons **and** `resignation` **and** the automatic reasons, **without** `src/gameend.ts` being
  changed by this ticket.
- **Given** `ABC-019`'s per-ply overhead bar, **when** measured after this ticket, **then** it still
  holds. *(See NFR triggers.)*

## Dependencies

- **`ABC-020`** — hard. There is nothing to claim until the rules core reports a claimable set, and
  building this against today's automatic semantics is meaningless.
- **`ABC-019`** — hard. This is one outcome added to that ticket's eight-state machine and one
  terminal transition; it is not a loop of its own. `ABC-019` was amended today to remove its
  "no claim draw" `## Out of scope` block and to carry this ticket by name.
- **`ABC-012`** — the counts supplier behind `gameStatusOf`.
- **`ABC-016`** — no dependency in either direction at build time. The panel reads availability from
  `gameStatusOf(history)` itself; this ticket does not render and that ticket does not decide.
- **Handed to `EPIC-004`'s decomposition, recorded here so it is not lost:** the engine's claim
  policy. The requirement to cut there is *the engine claims a draw when one is available to it and
  its evaluation of the position is not better than a draw* — one ticket-sized decision that needs
  the evaluation function and nothing else.
- **Handed to `EPIC-003`'s decomposition:** the `claim` verb at the real prompt (amended into that
  epic's `## Scope` today).

## Security / NFR triggers

- `NFR-002` — `ABC-019`'s bar of **loop overhead ≤ 100 µs per ply at 120 plies** (excluding render,
  input wait and engine call) is **unchanged by this ticket**, and that is the measurable
  requirement: availability is read from the `gameStatusOf` call the ply already makes, so this adds
  **zero** derives. A second `repetitionCounts` per ply would cost 46–50 µs at 120 plies (measured,
  Apple M3 / Node v24.12.0 / darwin-arm64) — half the whole per-ply budget for a value already in
  hand.
- `NFR-003` (input responsiveness, 50 ms keystroke) — the claim path does no work the prompt did not
  already do. No bar of its own.
- **Security: the rejection message.** It reports counts and clock values derived from the position,
  plus at most the literal command token. Any echo of user-supplied text goes through the frame's
  message region, which **`ABC-018` sanitizes** — that ticket owns terminal escape-sequence
  injection for the whole frame, and this ticket introduces no second path to the sink.

## Test notes

Everything here is testable **today's way** — through `ABC-019`'s stub seams, with no parser and no
engine. The stub input seam matches a literal token, so `claim` is one more token beside a
coordinate.

- **Drive the A1 line twice from the same fixture**, once ending in `claim` and once ending in `Re8`.
  The pair is the ticket: same position, two legal continuations, two different correct results. A
  single test proves half of it.
- **Assert the whole run's verdicts, not only the last one.** The `Re8` case must show that no draw
  was reported at the third occurrence either — that is the regression that would mean `ABC-020` had
  been undone underneath this ticket.
- **Assert the engine seam is never asked to claim, by spy.** A future engine that starts claiming is
  a behaviour change that must fail a test rather than surprise a player, and the spy is the only
  thing that can catch "the loop quietly claimed for it".
- **Assert the `gameStatusOf` call count per ply.** One. This is the same shape as `ABC-019`'s
  spy-assertion that every `gameStatus` call carries a counts map, and it belongs in the same test
  harness.
- **Reuse an en-passant-free repeated line** (`src/gameend.test.ts:27-58`'s knight cycle shape) for
  every repetition fixture, for `ABC-011`'s reason — the same instruction `ABC-012`, `ABC-019` and
  `ABC-020` all carry.

## Size and priority rationale

**Size `S` (2).** One new prompt outcome, one terminal transition, one rejection message, and one
value passed to the frame — all on a state machine `ABC-019` has already specified in full, and all
testable through stubs that ticket already builds. No new module, no chess logic (the rules core
answers every question), no new dependency edge. Calibrated against `ABC-017` (layout over an
existing list, `S`) and `ABC-011` (one guarded condition plus two test shapes, `S`).

**One re-sizing condition, named now rather than improvised later:** if `ABC-019`'s design hop lands
the terminal-reason type in a shape where adding two claimed reasons is not additive, re-size at that
hop — at most `M`, and never split, because it is one outcome in one state machine.

**Priority `P1`, deliberately not `P0`.** `ABC-020` alone leaves the product **fully FIDE-conformant**:
no draw is imposed that the Laws do not impose, and every game terminates under 9.6. The directive is
satisfied without this ticket. What is missing without it is the player's *ability to exercise* a
right the Laws grant — half a rule, not a broken one.

- **Not `P0`:** nothing illegal or non-FIDE happens without it, and it cannot be built until
  `ABC-019` exists.
- **Not `P2`:** `P2` on this board is the drop-first tier (`ABC-017`). This is not droppable — a
  product that tells the player a draw is claimable and offers no way to claim it is worse than one
  that never mentions claims, and the panel indicator `ABC-016` now carries would be a dead end.

## Definition of Ready

Problem ✅ · scope + out-of-scope ✅ · INVEST ✅ (testable end-to-end through `ABC-019`'s stubs) ·
acceptance measurable ✅ (exact fixture line, exact terminal reasons, byte-identical FEN on
rejection, exact call counts, exit code) · dependencies ✅ (`ABC-020` and `ABC-019` hard and named;
two hand-offs recorded with their owners) · NFR triggers ✅ (`ABC-019`'s per-ply bar, unchanged, with
the cost of the wrong implementation quantified) · test notes ✅ · size `S` ✅ · priority `P1` ✅ ·
no blocker ✅ *(its dependencies are tickets, not unresolved decisions)*

Sits in `Backlog` behind `ABC-020` and `ABC-019`. Promotion to `Ready` is a separate BA/PM step and
has not been taken.

## Board history

Every `plans/board.md` entry ever written about this ticket — column entries and exits, the WIP
counts at each move, and what each gate recorded — is in
[`history/ABC-021-board-history.md`](history/ABC-021-board-history.md) (3,264 bytes), moved there **verbatim** on 2026-08-10 when the board
was tidied. It is not duplicated on the board and nothing was summarised or dropped.
