---
id: 20260803T104000Z-qe-e2e-claim-faefac9a
kind: claim
by: qe-e2e
at: 2026-08-03T10:40:00Z
verified_by: 
confidence: UNKNOWN - verify
refs:
  - ticket-to-pr-ABC-011
  - ABC-011
  - ABC-009
  - ABC-010
  - ABC-012
  - ABC-020
  - EPIC-004
  - NFR-005
  - ADR-0005
  - src/legal.ts
  - src/zobrist.ts
  - src/moves.ts
  - src/apply.ts
  - memory-bank/30-architecture.md
supersedes: 
---

# What this gate could NOT settle — one new defect, and four residuals

Recorded as a `claim` at `confidence: UNKNOWN - verify` because none of it is gate-adjudicable here.
**There is no §14 gate on this install, so no `finding` is admissible on this task, none was
written, and nothing is self-stamped.**

## 1. NEW DEFECT — `zobristKey` now permanently corrupts a position whose ep square is semantically inconsistent

This is the one thing I found that the branch did not know about, and it is the reason this note is
not a formality. Reproduced against the shipped tree, `toFen` and all 128 board bytes compared
before and after **a single `zobristKey` call**:

```
4k3/8/8/4P3/8/8/8/4K3 w - d6 0 1     ep target d6, NO black pawn on d5
  after zobristKey ->  4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1     a PHANTOM BLACK PAWN on d5

4k3/8/8/3PP3/8/8/8/4K3 w - d6 0 1    ep target d6, a WHITE pawn on d5
  after zobristKey ->  4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1     the white pawn is now BLACK

4k3/8/8/8/3p4/4P3/8/4K3 b - e3 0 1   ep target e3, and a WHITE PAWN STANDS ON e3
  after zobristKey ->  4k3/8/8/8/3pP3/4P3/8/4K3 b - e3 0 1   a PHANTOM WHITE PAWN on e4
```

Mechanism: `hasLegalEnPassant` constructs its probe move with `captured: PAWN | (black ? 0 : BLACK)`
without ever checking that such a pawn is there, or that the target square is empty. `makeMove`
clears the square behind the target; `unmakeMove`'s `undoSpecial` then writes the *assumed* pawn
back onto it. When the assumption was false, the write is a creation, not a restore — and it is
**permanent**, not transient.

**What is fair to the Engineer, and I checked it before writing the paragraph above.** On the first
two FENs the predicate's own documented oracle, `legalMoves(p).some(m => m.flags ===
FLAG_EN_PASSANT)`, corrupts them **identically** — the fault is in `generateMoves` + `apply`, is
pre-existing, and the predicate merely reproduces its definition faithfully. The Engineer's claim
"the shipped predicate does not inherit `ABC-009`" is **true as stated** and I verified it: on
`ABC-009`'s own trigger FEN the position is byte-identical, and the phantom-white-king corruption
does not occur.

**Two things are nonetheless new and belong to `ABC-011`:**

- **The third FEN is a genuine divergence from the ruled definition, not an inherited one.** There,
  `generateMoves` does **not** offer the ep move (an occupied enemy target is handled as an ordinary
  capture), so the oracle returns `false` and leaves the position untouched — while
  `hasLegalEnPassant` returns `true` and corrupts. The design hop made
  `legalMoves(...).some(...)` "the DEFINITION and the test oracle"; here the implementation and the
  definition disagree. The property test cannot see it (it walks only reachable positions) and the
  "agrees with legalMoves" test cannot see it (that FEN is not in its list).
- **Before `ABC-011`, `zobristKey` was pure on every input, valid or not.** It is now not. The
  `memory-bank/30-architecture.md` bullet and the `src/zobrist.ts` header both say the function
  "transiently mutates" and returns the position "as they found it". On this class of input that
  sentence is false, and a maintainer will read it as a guarantee.

**Reachability, stated so the severity is not inflated.** Every trigger needs a semantically invalid
FEN through `parseFen`. `makeMove` sets `epSquare` only after a double push, which guarantees both
the capturable pawn and the empty target, so **no position reachable by play can trigger this** —
confirmed over 277,949 reachable nodes, 0 impure. It is the same reachability class as `ABC-009`
(castling rights with no rook) and the class `ABC-010` (FEN semantic validation) exists to close.
`ABC-011`'s `## Out of scope` carries both explicitly.

**Why I did not fix it and why I did not pin it.** Fixing it is a production change, which this role
does not make. It is also **not obviously a dev-hop fix**: guarding the predicate on
`board[target] === EMPTY` and on the captured pawn's presence would make it return `false` where its
ruled oracle returns `true`, i.e. it would deliberately diverge from the definition the design hop
ratified — a design call, not an implementation one. And I would not add a test that asserts the
current output, because that enshrines the defect as intended behaviour. What I did instead: pinned
the property that *is* true and *is* load-bearing — `zobristKey` is byte-pure at every reachable
node — so a future regression on the reachable path is caught, and named this one here in full with
its reproduction. **Owner: BA/PM to cut it (or fold it into `ABC-010`), Architect/Design to rule on
the predicate-vs-oracle divergence. It does not block `ABC-011`.**

## 2. `NFR-005`'s cost bars are unverified by me, deliberately

I re-measured **no** timing figure. The Engineer's 302.9–306.5 ns / 309.1–315.6 ns / 1.357–1.383x /
0.9948–1.0218x are `UNKNOWN - verify` **from this role**, not because I doubt them but because
Security/NFR owns them next and two roles measuring the same bar is waste — the same disposition the
`ABC-020` QE gate took with A10. What I did re-derive is the *structural* half of the sub-bar: over
277,949 reachable nodes the predicate's make/unmake path is entered only where a legal ep capture
exists. Owner: Security/NFR.

## 3. The guard-first ordering remains pinned by nothing in the repo

Three mutants still survive a 189-test suite (Z1 reorder, Z4 drop the guard, L11 drop the internal
early return) and they are one gap. I agree with the Engineer that it is Security/NFR's, and the
`decision` note beside this one gives the reasoning rather than the deference. Carried forward with
the mutant strings and one new fact: **Z1 and L11 together are green and produce real off-board
board damage.** Until that gate runs, "the guard comes first" is a comment, not a constraint. Owner:
Security/NFR.

## 4. The property walk's depth, and what a drift would have to look like to escape it

2 plies from six roots reaches 557 double pushes and the divergent geometry, and my exhaustive
518,474-node sweep found 0 predicate-vs-oracle disagreements — strong, but both populations are
*reachable* positions from six roots. A future change to `src/moves.ts`'s pawn geometry that
desynchronises the predicate only in a shape absent from that population would survive both. The
Engineer named this residual; I confirm it is still open and I did not close it. I also confirm
their instinct on depth: I did **not** add a `PERFT_DEEP=1` lane for one property test, because the
exhaustive sweep at `fast` depths already found nothing and a slower default lane is a lane people
start skipping.

## 5. `ADR-0005` is still `proposed`, and the code it describes is merged on this branch

Unchanged from the Engineer's note and repeated because it survives this gate too: **no agent may
mark it `accepted` and I did not.** `ABC-011` was never blocked on it. Worth a human's attention.

## Carried, not fixed — each deliberate

- **`ABC-009` and `ABC-010`** untouched and still reproduce. Confirmed independently; `ABC-009` is
  demonstrably not inherited by the shipped predicate.
- **`memory-bank/30-architecture.md`'s module table** left ordered by conceptual layer. I agree with
  the Engineer and would not reorder it. The one imprecision I *would* fix is the `Hashing` row's
  content, which still reads as a self-contained leaf and says nothing about the `legal.ts` edge —
  a one-cell edit, not a reshuffle, and not taken here.
- **The Engineer's "nine new assertions" is ten.** 174 → 184, and their own arithmetic (9 failed /
  19 passed against 18 pre-existing tests in the two files) only closes at ten. Immaterial to every
  verdict, recorded because a number in a note should be right.
- **`src/gameend.test.ts:27-58` still cannot catch this defect** and `ABC-012`'s threefold test no
  longer needs to dodge it — the sequencing win the Orchestrator pulled this ticket for is real.
  Whether `ABC-012`'s Test notes get updated is BA/PM's.
