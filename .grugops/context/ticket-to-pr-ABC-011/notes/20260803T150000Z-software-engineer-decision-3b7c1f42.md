---
id: 20260803T150000Z-software-engineer-decision-3b7c1f42
kind: decision
by: software-engineer
at: 2026-08-03T15:00:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-011
  - ABC-011
  - ABC-009
  - ABC-010
  - EPIC-004
  - NFR-005
  - ADR-0005
  - plans/tickets/ABC-011-zobrist-en-passant-hashing.md
  - src/legal.ts
  - src/zobrist.ts
  - src/legal.test.ts
  - src/zobrist.test.ts
  - memory-bank/30-architecture.md
  - 20260803T133000Z-architect-design-decision-7c41d0ab
  - 20260803T113000Z-orchestrator-decision-913e6028
  - 20260803T000500Z-software-engineer-decision-26794591
supersedes: 
---

# BUILT: the two guards as ruled, and each one proven load-bearing by deleting it

Second dev pass on `ABC-011`. I ran the first one and its trajectory is gone, so I re-read my own
four notes of 2026-08-03 rather than assuming what I had shipped, and I re-read the shipped
`src/legal.ts` rather than trusting either. **Nothing in either `### ANSWERED` block was re-opened,
re-derived or negotiated.** The reading, the fix shape and the specified answer off-domain are the
design hop's; TDD and the implementation are mine, and this note records only the second kind.

## The change, in the one place it lives

`src/legal.ts` **+32/−6**, of which **four lines are executable**; `src/zobrist.ts` **+5/−1, doc
comment only**. That is the whole production diff.

```ts
// src/legal.ts — inside hasLegalEnPassant, above the EP_CAPTURE_SIDES loop, both loop-invariant
const captured = PAWN | (black ? 0 : BLACK);          // hoisted out of the probe Move
if (position.board[target] !== EMPTY) return false;    // (a) the ANSWER guard
if (position.board[rank] !== captured) return false;   // (b) the PURITY guard
```

`rank` was already computed by the shipped code — it is the capture square, the same value
`enPassantCaptureSquare` derives in `src/apply.ts:78` — so **(b) costs one read of a square the
function already addresses**, exactly as the ruling said it would. Hoisting `captured` out of the
`Move` literal is what lets guard (b) name the piece it is checking for instead of restating the
expression; it is the same expression, moved, and the pre-fix comparison in my harness accounts for
it explicitly.

## Why the two guards stayed two — the decision I could most easily have got wrong

The ruling warned that a one-line simplification which "looks equivalent" reopens a reproduction.
I did not take the warning on trust; I **deleted each guard in turn and ran the suite**:

| tree | tests failing | which tests |
|---|---|---|
| both guards (shipped here) | **0** | 206/206 green |
| guard (a) deleted | **exactly 4** | the two pure-divergence FENs, at the predicate **and** the key level — and nothing else |
| guard (b) deleted | **exactly 7** | the three empty-target corruptions at both levels, plus the every-input purity sweep |
| both deleted (the declined code) | **13** | 193 pass — exactly the pre-fix baseline |

**The two failure sets are disjoint.** That is the whole content of "neither subsumes the other",
turned from a sentence into a measurement. Neither guard can be deleted with the suite green, which
is the property the subtask asked for.

**One honesty note the table owes, and it is mine rather than the design hop's:**
`4k3/8/8/8/3p4/4P3/8/4K3 b - e3 0 1` (QE's third reproduction) is closed by **either** guard alone —
its ep target is occupied *and* its captured pawn is absent — so it kills neither single-guard
mutant. It is named rather than counted as evidence for one guard. This is also why my guard-(b)
count is 7 rather than 8: only three of the four corrupting FENs have an empty target.

## The decisions that were actually mine

**TDD, red first, and measured red rather than claimed.** All 13 new tests were written and run
against the unmodified tree before either guard existed: **13 failed, 33 passed** in the two touched
files — the 33 being every pre-existing test in them, which is how I know the new assertions bite the
defect rather than the suite.

**Purity is asserted over the full position state, never through `toFen`.** The bar this pass was
given is byte-identity for *every* input, and `toFen` can see neither an off-board write nor the
counters — the Security/NFR gate found a mutant that returned the correct answer and still left a
stray pawn on off-board square 15. So both new test blocks compare all 128 board bytes plus
`blackToMove` / `castling` / `epSquare` / `halfmoveClock` / `fullmoveNumber`. In
`src/zobrist.test.ts` I reused the `positionSnapshot` helper QE already put there rather than adding
a second one; in `src/legal.test.ts` I wrote the equivalent locally, matching that file's existing
habit of keeping local copies with the reason written beside them.

**"Every input" is a sweep, not a list.** Six probe FENs prove the six known reproductions, but they
are still a list, and a list is what let this defect ship the first time. So one test sets `epSquare`
to **every one of the 128 0x88 indices — the 64 off-board ones included — plus five values outside
the array entirely**, across five boards, and asserts purity on each. That is 665 inputs, it runs in
milliseconds, and it is what makes the unconditional claim in the doc comment an assertion rather
than a promise. It also subsumes the design hop's `… w - a1 0 1` boundary probe, which is why I did
**not** ship that FEN as a separate case: the hop named it as killing nothing, and shipping it alone
would have counted it as coverage.

**Two test blocks, both appended, and no import widened.** The first pass widened three import lines
and QE had to verify at line level that nothing else moved. This pass changes **zero pre-existing
lines** in either test file — I chose the assertions so that every symbol I needed was already
imported, and I dropped `NO_SQUARE` from the sweep rather than widen a line for it (the `NO_SQUARE`
input is the predicate's own early return and is already pinned by an existing test above and by
`src/zobrist.nfr.test.ts`). "No existing test is modified" now holds with nothing to explain.

**The doc comments say WHY, not merely that.** Item 9 owed two corrections. `hasLegalEnPassant`'s
oracle sentence now carries the domain, and its purity promise now names the precondition as the
reason it holds — a promise a reader can check against four lines of code rather than trust.
`src/zobrist.ts`'s header now bounds the transient mutation by that precondition and says the
position comes back byte-identical on **every** input, invalid FENs included.

**I took the `Hashing` row of `memory-bank/30-architecture.md`.** QE named it, Security/NFR named it,
and Architect/Design named it *and* flagged it for this hop with the reason that "everyone agrees and
nobody does it" is how a small correction becomes permanent. It is one cell, no reshuffle: the row
now says `zobrist.ts` asks `legal.ts` whether an en-passant capture is real, so it no longer reads as
a self-contained leaf. Three roles declining it was the argument for taking it, not against.

## What I did NOT do, each with its reason

- **No change to `src/zobrist.ts`'s condition and no change to `zobristKey`'s signature.** Item 6
  lists what must not move; the guards belong in the callee, which is also why the no-ep sub-bar is
  untouched by construction rather than by measurement.
- **No fix for `generateMoves` offering an en-passant capture onto the mover's own piece.** The
  design hop routed it to BA/PM. I re-verified it still reproduces on its own FEN and left it
  alone — this fix makes the *hash* immune to it and does not clean the generator.
- **No fix for `ABC-009` or `ABC-010`.** Carried, as every prior hop carried them.
- **No new test file.** The Security/NFR gate's `src/zobrist.nfr.test.ts` exists because a `vi.mock`
  factory is hoisted to file scope; nothing here needs mocking, so both blocks live beside the tests
  they extend.
- **No re-measurement of `npm run perft`.** The ticket states `NFR-001` is not at risk and that the
  perft lane is not this change's oracle — `src/perft.ts` never calls `zobristKey`. Spending 38 s on
  it would have produced a number that proves nothing about this diff. Its 24 tests are green in the
  ordinary suite.

## What this pass costs, stated because it sits in a per-node function

Re-derived by me rather than inherited, and the honest headline is that **the instrument matters more
than the number**. I kept the two no-ep `NFR-005` anchors as a **null control** — the delta there is
structurally zero, because the caller's short-circuit never enters the predicate — and my first
protocol reported those cells at ratios up to **1.26**, which is nonsense and told me the protocol
was wrong rather than that the guard was expensive. With nine alternating rounds and medians the null
control lands at **+0.06 ns and +0.20 ns**, and only then is a +0.4 ns claim on the ep-set cells worth
anything. Figures are in the observation note beside this one.
