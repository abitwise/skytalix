---
id: ABC-009
title: legalMoves mutates the position it documents as unchanged
status: backlog
column: Backlog
size: S
priority: P2
epic: EPIC-001
feature: —
---

# ABC-009 — legalMoves mutates the position it documents as unchanged

## Problem

*User*: every downstream consumer of the rules core — the renderer (EPIC-002), the input
layer (EPIC-003), the search (EPIC-004), the session (EPIC-006) — all of which call
`legalMoves` against a position they still intend to use afterwards.

*Pain*: `src/legal.ts:37-41` documents `legalMoves` as a pure query — *"Plays each move on
the position in place and takes it back, so the position is unchanged on return."* On a
grammatical-but-semantically-invalid position it permanently and silently mutates its
argument. There is no error, no log, and no return-value signal. A caller that holds the
position across the call gets a board that is no longer the board it parsed.

*Value*: a documented invariant in the module every other epic sits on either holds or it is
not an invariant. A silent wrong answer from the rules core invalidates the whole game, and
this one is silent by construction.

**The coverage number did not catch it, and that is part of the ticket.** `src/legal.ts`
sits at 100% statement / branch / function coverage in the committed report, and this defect
shipped through that. Coverage measured that every line executed; nothing asserted that the
documented contract held. The fix must add a test that asserts the *contract*, not one that
adds lines to a number that is already 100%.

## Source

Architecture audit, task `architecture-audit-2026-07-29`:

- `20260729T145735Z-security-nfr-observation-abedec95` — §6 case 1 (the reproduction and the
  board-state trace), and `AR-3`, which recorded this as an accepted latent risk with owner
  Software Engineer.
- `20260729T150600Z-orchestrator-observation-7b2f91c4` — synthesis: "correctness defect found
  in merged, Done, 100%-covered code."

The audit's `AR-3` proposed folding this fix into the FEN-validation work (`RF-3`, now
ABC-010). It is cut as its own ticket instead: the two fixes live in different modules, are
independently testable, and either can ship without the other. `legalMoves`' contract should
not depend on a caller having validated its input — that assumption is exactly what failed
here.

## Reproduction (verified 2026-07-29, on `main`)

```
FEN            4k3/8/8/8/8/8/8/K7 w KQ - 0 1     white king on a1, rights KQ, no rooks
fresh parse    4k3/8/8/8/8/8/8/K7 w KQ - 0 1
legalMoves #1  5 moves
board after    4k3/8/8/8/8/8/8/K3K3 w KQ - 0 1   <- phantom second white king on e1
legalMoves #2  10 moves
legalMoves #3  10 moves                          <- not idempotent
```

The mechanism is visible one layer down: with rights `KQ` set, `generateMoves` offers the
castle `4->6` from e1 whether or not the king is on e1 and whether or not a rook is on h1.
`4k3/8/8/8/8/8/8/4K3 w K - 0 1` (king home, no h1 rook) returns 6 legal moves including a
`FLAG_CASTLE` move `4->6`. `makeMove` writes a king to the destination; `unmakeMove` writes
`move.piece` back to `from` — creating a king on a square that never held one.

A well-formed position is unaffected: kiwipete returns 48 moves twice and round-trips to a
byte-identical FEN across both calls.

## Scope

`legalMoves` honors the contract its own doc comment states, for every position it accepts:

- The position is byte-identical on return — placement, side to move, castling rights,
  en-passant square, halfmove clock, fullmove number.
- Repeated calls return identical results.
- No castling move is offered when that castle's own board preconditions do not hold (the
  king on its home square, the matching rook on its home square).

The mechanism is the engineer's call. The observable contract above is the requirement.

## Out of scope

- **Rejecting the invalid FEN at the boundary** — that is `ABC-010`, deliberately separate.
  This ticket does not make the input legal; it makes the query honest about what it does.
- Pin-aware / incremental legality generation and the `legalMoves` throughput deficit — the
  audit's `RF-2`, an EPIC-004 decision. Do not take it here.
- King-square caching (`src/legal.ts:28` linear scan) — measured, not justified, explicitly
  left alone by the audit.
- Any change to `src/fen.ts`.

## Acceptance (Given/When/Then)

Each criterion below is a currently-failing test that must go green. The parenthetical is the
measured behavior on `main` today.

- **Given** the FEN `4k3/8/8/8/8/8/8/K7 w KQ - 0 1`, **when** `legalMoves` is called on the
  parsed position, **then** `toFen(position)` afterwards equals that same FEN string
  byte-for-byte. *(Today: `4k3/8/8/8/8/8/8/K3K3 w KQ - 0 1`.)*
- **Given** that same position, **when** `legalMoves` is called three times in succession,
  **then** all three calls return the same number of moves. *(Today: 5, 10, 10.)*
- **Given** the FEN `4k3/8/8/8/8/8/8/4K3 w K - 0 1` (king on e1, right `K`, no rook on h1),
  **when** `legalMoves` runs, **then** zero returned moves carry `FLAG_CASTLE`, and the move
  count is 5. *(Today: 6 moves, including a `FLAG_CASTLE` move `4->6`.)*
- **Given** every position in the perft suite table (`src/perft.test.ts`), **when**
  `legalMoves` is called twice on each, **then** `toFen` is identical before the first call,
  between the calls, and after the second, and both calls return equal move counts. *(Today:
  passes — this is the regression guard, and it must stay green.)*
- **Given** the full test suite, **when** it runs after the fix, **then** it is green with a
  skip count of 0 and no existing test is modified to accommodate the change.
- **Given** `PERFT_DEEP=1`, **when** the deep perft lane runs, **then** all 32 cases still
  match their published node counts exactly — zero tolerance.

## Dependencies

- No blocking dependency. The defective code is merged on `main` (`ABC-002`, `ABC-004`,
  `ABC-005`).
- **Not** dependent on `ABC-010`, by design. Either ticket may ship first.

## Security / NFR triggers

- `NFR-001` — move generation throughput. The fix touches the search hot path (castle
  generation runs inside `generateMoves`, which `legalMoves` calls per node). Measurable bar:
  `npm run perft` reports **≥ 1,000,000 nodes/sec** after the change, and does not regress
  materially against the 2026-07-29 audit baseline of **6.09M–6.21M nodes/sec** (Apple M3,
  Node v24.12.0). Deep perft stays **32/32 exact**.
- **No security trigger.** The audit classed this reliability, not security: no injection
  sink, no trust boundary, no privilege, no data exposure. The consequence is a wrong chess
  answer and a corrupted in-memory board. Do not inflate it.

## Test notes

The reproduction above is the test. Two shapes are needed and they are not interchangeable:

1. **The exact repro cases** — the two FENs, asserted on `toFen` equality and on move counts.
   These fail today and are the acceptance bar.
2. **A purity property test across the perft table** — for every standard position, assert
   `toFen` is stable across two `legalMoves` calls. This is the guard that would have caught
   the defect originally, and it is cheap because the position table already exists.

Assert the *contract* (position unchanged, results idempotent), not line execution.
`src/legal.ts` was already at 100% coverage when this shipped; a test that only raises
coverage adds nothing here.

If the fix lands in `generateMoves`, the deep perft lane is the oracle that it changed nothing
for legal positions — run it (`PERFT_DEEP=1 npx vitest run src/perft.test.ts`, ~38 s) before
review, not after.

## Size and priority rationale

**Size `S` (2).** One guarded condition plus two test shapes, in a module that already has an
exact reproduction and an existing correctness oracle (perft 32/32). No new module, no new
dependency edge, no design decision. Calibrated against `ABC-006` (perft harness, `S`) and
below `ABC-005` (legality filtering, `M`).

**Priority `P2`, not defaulted.** Applying the latent/live test the audit used:

- **Not `P0`/`P1`:** the defect is *latent*. `parseFen` has no user-facing caller today —
  the module map records exactly one production consumer of `src/fen.ts` (`perft-bench.ts`),
  and every position the code sees today is either the startpos, a perft fixture, or a test
  fixture, all well-formed. Nothing in flight is broken; the suite is 143/143 green. Further,
  `ABC-010` removes this defect's only reachable trigger by rejecting the FEN at the boundary,
  so shipping ABC-010 first makes this unreachable in practice.
- **Not `P3`:** "unreachable in practice" is precisely the reasoning that let a broken
  contract ship under a 100% coverage number. The invariant is documented, is relied on
  transitively by `gameStatus` and `perft`, and fails silently. It is defense in depth in the
  one module whose bugs invalidate every other epic.

**Escalation trigger (do not leave this to judgment later):** ABC-009 rises to `P1` if
`ABC-010` is deferred or descoped, or if any epic begins accepting a position from outside the
rules core before ABC-010 lands.

## Definition of Ready

Problem ✅ · scope + out-of-scope ✅ · INVEST ✅ · acceptance measurable ✅ (exact FENs, exact
counts, byte-identical FEN comparison) · dependencies ✅ (none blocking) · NFR triggers ✅
(NFR-001, numeric bar) · test notes ✅ · size `S` ✅ · priority `P2` ✅ · no blocker ✅

Sits in `Backlog`. Promotion to `Ready` is a separate BA/PM step and has not been taken.
