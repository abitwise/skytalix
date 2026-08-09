---
id: 20260809T195902Z-ba-pm-observation-d508d14a
kind: observation
by: ba-pm
at: 2026-08-09T19:59:02Z
verified_by: 
confidence: high
refs:
  - ABC-022
  - src/moves.ts
  - src/fen.ts
  - src/legal.ts
  - src/position.ts
  - NFR-001
  - plans/nfr-catalog.md
  - plans/tickets/ABC-022-en-passant-generation-preconditions.md
supersedes: 
---

# Five defects no pre-check named, and the pre-check's own mechanism for defect 1 was false

Two was the floor. The sweep found **seven**; **five** were named by no pre-check, and **four of the
seven are the same shape** — a criterion narrower than the ticket's own `## Scope`, which is the shape
the brief said to sweep for specifically.

## Defect 1 confirmed, its STATED MECHANISM corrected

The Orchestrator's witness was *"a build that corrupts a scalar and no board byte satisfies `A4` and
violates `## Scope`"*, on the ground that *"the five scalars are absent"* from `A4`. **That is false
as a behavioural claim** and is corrected in the ticket rather than inherited. `toFen` renders all
five scalars, and **all 15** plausible single-scalar corruptions (3 FENs x 5 scalars, each an
in-domain corruption of the shape a broken unmake produces) are **CAUGHT** by `A4` as written.

What is true is narrower and uglier: **`toFen` is not injective on the position state.** Measured by
direct construction, boards held byte-identical:

- **28 `castling` bit values** — `16, 32, 64, … , 2^31` and the sign bit — change `position.castling`
  and leave the rendered field `-`, because `CASTLING_FLAGS` renders only `K|Q|k|q`.
- **`epSquare` 32 (`a3`, on-board) renders identically to 40 (`0x28`, OFF-BOARD)**: `squareName` reads
  `sq & 7` and `sq >> 4` and never tests `isOnBoard`. That alias is precisely the off-board family
  `## Test notes` item 2 already cites ("a stray write to square 15 that `toFen` was blind to").

So `A4` is unsound as a proxy **in principle** but not by any mechanism a realistic broken fix would
reach. The two narrowings that actually bite are different ones: **coverage** — `## Scope` bullet 3
demands purity on every position in the reproduction table (**ten**), `A4` demanded it on **three** —
and **instrument** — `A4` made `toFen` a co-equal *required* assertion that `## Test notes` item 2
explicitly forbids, so engineer and tester would have read it two ways.

## `A3` had no black-to-move row — the worst of the five, with a live witness

All three of `A3`'s FENs were white to move, while `## Scope` bullet 2 says the precondition holds
"for every position it accepts" and `A1` — the sibling half of the same defect — already said "both
colours to move". A mutant implementing the captured-pawn precondition **for white only**
(`black || board[to - forward] === capturedPawn`, `md5 b72437471705745813163fe77ba8b961`, typecheck
clean) **passes `A1`, `A2`, `A3`, `A4`, `A5` and `A6` exactly as they were written, and the full suite
381/381** — while half (b), the half this ticket calls the worse half, stays fully live for black:

```
4k3/8/8/8/3p4/8/8/4K3 b - e3 0 1   -> d4e3 offered, one legalMoves() call leaves a phantom WHITE pawn on e4
4k3/8/8/8/6p1/8/8/4K3 b - h3 0 1   -> g4h3 offered, phantom WHITE pawn on h4 (edge file)
```

Both rows added to `A3`; both verified RED on pristine and on the white-only mutant, GREEN on a
correct fix.

## The purity oracle is SELF-MASKING, and that changes how the table must be built

`## Scope` bullet 3 and `A4` both state purity **across one whole `legalMoves()` call**. A corruption
made by one move in that pass can be **healed by a later move in the same pass**. Proved step by step
on `4k3/8/8/8/3pp3/8/8/4K3 b - e3 0 1`:

```
after d4d3 pair: e4 = 9
after d4e3 pair: e4 = 1   <- the EN PASSANT move rewrites a black pawn into a white one
after e4e3 pair: e4 = 9   <- the NEXT move in the same pass writes move.piece back and heals it
e4 after the whole pass = 9      legalMoves() purity across the call: reads CLEAN
```

A single `makeMove`/`unmakeMove` on that same position drifts `0x34: 9 -> 1`. **The call-level oracle
reads CLEAN on a position the generator provably corrupts.** All five `A3` rows were checked against
this and none self-masks. This is a **row-selection rule, not a contract change** — `## Scope` is
untouched — and it went into `## Test notes` item 2.

## `NFR-001`'s METHOD is stale by five days, and no target moved

`plans/nfr-catalog.md` was updated **2026-08-09** at `ABC-009`'s gate with its tenth instrument-limit
correction: the perft harness's **per-cell floor is ±2.0%**, not the ~±1% previously recorded, and the
aggregate floor was never characterised — so `ABC-022`'s **per-cell** ratio bar of ≥ 0.98 sits at
about **half the instrument's resolution**. The catalog's own resolution was to move the question
**off the clock and onto a count**. `ABC-022` was cut 2026-08-04 and predates all of it.

Denominator measured at this hop for the count route, on an instrumented copy outside the repository:
over the standing 518,474-node walk the added preconditions are evaluated **331 times** when they sit
after the `to === position.epSquare` test and **216,269 times** if placed before it — a ~650x ordering
difference worth naming — and they **reject 0**. The per-cell ratio is demoted, the aggregate ratio
and the ≥ 1M floor stand, `plans/nfr-catalog.md` was **not** edited and no target moved. **No
throughput figure in this ticket is BA/PM's own: `npm run perft` was not run by this role at any hop.**

## Two smaller ones

- `## Reproduction`'s Controls table named the pinned control's move `e5d6`; it is **`c5d6`** — there
  is no white pawn on e5 in `7k/8/8/K1Pp3r/8/8/8/8 w - d6 0 1`. A copy-down from the row above. `A6`
  states that row by count and never by name, so `A6` itself was not wrong.
- `A11` cited `src/legal.ts:102-104`. The false claim occupies **102-103**; **104-105 is a separate
  and TRUE sentence** that must not be rewritten. And only the claim's *conclusion* becomes true when
  this ticket lands — its *mechanism* clause stays false, because an own-colour occupant is never read
  "as an ordinary capture" (line 177 requires `isBlack(target) !== black`, before and after).
- The `## Acceptance` preamble said every criterion was currently failing except those marked as
  regression guards; only `A5` and `A6` carried that marking, so `A7`–`A10` were mis-described.

## What re-checked SOUND and is not a defect

- All **ten** `## Reproduction` rows reproduce unchanged on today's `main` after `ABC-009` merged
  (`e644039`) — the ticket's independence from `ABC-009` is now a measurement, not an argument.
- `A9` is satisfiable: **no existing test pins the defective behaviour**. Both correct fixes leave the
  suite at 381/381, so "no existing test is modified" is achievable.
- `NFR-001`'s *"in the same process"* is **not** in conflict with the board's one-process-per-tree
  mutation trap. I suspected it was and checked: `plans/nfr-catalog.md`'s guidance is that the harness
  gets **its own** process, and Security/NFR's own 2026-08-09 re-measure ran three trees in one
  process with a `cmp`-verified byte-identical twin. Not a defect; recorded so nobody re-raises it.
- `A2` is structurally implied by `A1`/`A3` — `legalMoves` is a strict filter over `generateMoves`
  (`src/legal.ts:42-55`) — so it is redundant rather than defective. Kept, and widened to both halves.
