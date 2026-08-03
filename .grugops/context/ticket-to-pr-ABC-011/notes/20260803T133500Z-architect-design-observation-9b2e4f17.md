---
id: 20260803T133500Z-architect-design-observation-9b2e4f17
kind: observation
by: architect-design
at: 2026-08-03T13:35:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-011
  - ABC-011
  - ABC-009
  - ABC-010
  - NFR-005
  - ADR-0005
  - ADR-0006
  - src/legal.ts
  - src/zobrist.ts
  - src/moves.ts
  - src/apply.ts
  - src/perft.test.ts
  - src/zobrist.nfr.test.ts
  - .grugops/context/ticket-to-pr-ABC-011/sources/FIDE-CURRENCY-2026-08-03.txt
supersedes: 
---

# What this hop measured itself, and what each measurement was run against

Neutral record so the ruling beside it can be checked rather than believed. Everything below was run
by me at this hop against **copies** of the shipped tree in the session scratchpad; the repository's
`src/` was never modified. **Apple M3 / Node v24.12.0 / darwin-arm64 — `UNKNOWN - verify` on any
other hardware.** The machine-independent quantity is always the ratio measured in the same process.

## 1. The three QE reproductions, re-derived — plus three FENs nobody had

`toFen` and all 128 board bytes compared before and after a single call. `pred` is the shipped
`hasLegalEnPassant`; `oracle` is `legalMoves(p).some(m => m.flags === FLAG_EN_PASSANT)`, the ruled
definition; `guarded` is the shape this hop specifies.

```
                                          SHIPPED            ORACLE             GUARDED
FEN                                       pred  pure   |  ans   pure   |     pred  pure
4k3/8/8/4P3/8/8/8/4K3 w - d6 0 1          true  FALSE  |  true  FALSE  |    false  true    QE-1
4k3/8/8/3PP3/8/8/8/4K3 w - d6 0 1         true  FALSE  |  true  FALSE  |    false  true    QE-2
4k3/8/8/8/3p4/4P3/8/4K3 b - e3 0 1        true  FALSE  |  false true   |    false  true    QE-3
4k3/8/8/8/8/8/1P6/4K3 w - a3 0 1          true  FALSE  |  true  FALSE  |    false  true    NEW
4k3/8/8/8/3pP3/4N3/8/4K3 b - e3 0 1       true  true   |  false true   |    false  true    NEW
4k3/8/3n4/3pP3/8/8/8/4K3 w - d6 0 1       true  true   |  false true   |    false  true    NEW
4k3/8/8/8/8/8/1P6/4K3 w - a1 0 1          false true   |  false true   |    false  true    boundary
4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1         true  true   |  true  true   |     true  true    valid
7k/8/8/K1Pp3r/8/8/8/8 w - d6 0 1          false true   |  false true   |    false  true    valid
2r4k/8/8/2PpP3/8/8/8/2K5 w - d6 0 1       true  true   |  true  true   |     true  true    QE L8
2k5/8/8/8/2pPp3/8/8/2R4K b - d3 0 1       true  true   |  true  true   |     true  true    QE L8 mirror
```

Every FEN round-trips byte-identically through `toFen`, before and after, under the guarded shape.
The four corruptions, printed rather than described:

```
4k3/8/8/4P3/8/8/8/4K3 w - d6 0 1     ->  4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1      phantom BLACK pawn d5
4k3/8/8/3PP3/8/8/8/4K3 w - d6 0 1    ->  4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1      white pawn d5 turns BLACK
4k3/8/8/8/3p4/4P3/8/4K3 b - e3 0 1   ->  4k3/8/8/8/3pP3/4P3/8/4K3 b - e3 0 1    phantom WHITE pawn e4
4k3/8/8/8/8/8/1P6/4K3 w - a3 0 1     ->  4k3/8/8/8/8/8/pP6/4K3 w - a3 0 1       phantom BLACK pawn a2   <- NEW
```

**Three rows are new at this hop and each says something the prior notes do not:**

- **Row 4** (`… w - a3 0 1`, an ep square on the wrong rank for the side to move) corrupts, and the
  guard Security/NFR sketched — `board[target] === EMPTY` — **would not have caught it**: a3 is
  empty. Only the captured-pawn guard does.
- **Rows 5 and 6** are the opposite shape: the predicate is **pure** and still disagrees with the
  oracle, because the captured pawn is correctly present and only the *target* is occupied.
  `generateMoves` handles an occupied target as an ordinary capture and never offers the ep move.
  These are what separate "corrupts" from "disagrees", and they are the only inputs in this table
  that the empty-target guard is needed for.
- **Row 7** is a boundary probe that **kills nothing** — the shipped code already answers it `false`
  and purely. Named so it is not miscounted as coverage.

## 2. `generateMoves` itself is unsound on this class — measured, not inferred

The reason the oracle cannot be the authority off-domain. On
`4k3/8/8/8/3pP3/4n3/8/4K3 b - e3 0 1` (a **black** knight on the ep target, black to move) and its
mirror `4k3/8/3N4/3pP3/8/8/8/4K3 w - d6 0 1`, `generateMoves` offers `FLAG_EN_PASSANT` — a pawn
capturing onto a square occupied by the **mover's own piece**. Mechanism, read out of
`src/moves.ts:172-197`: the ordinary-capture branch requires `isBlack(target) !== black` and
`continue`s; an own-colour occupant fails that test, does not `continue`, and falls through to the
`to === position.epSquare` branch.

Both are pure — `makeMove`/`unmakeMove` round-trip exactly, because `undo.captured` genuinely holds
what was on the target. So this is a **wrong answer without corruption**, a class neither `ABC-009`
nor QE's three FENs cover. Routed to BA/PM; not cut here.

## 3. The guards change nothing reachable — exhaustive walk, fourth independent script

`src/perft.test.ts`'s own table at its own `fast` depths (startpos d4, kiwipete d3, position-3 d4,
position-4 d3, position-5 d3, position-6 d3), shipped and guarded trees imported side by side, each
hashing its own freshly-parsed copy so neither can disturb the other:

```
startpos     depth 4  nodes 206604
kiwipete     depth 3  nodes  99950
position-3   depth 4  nodes  46256
position-4   depth 3  nodes   9738
position-5   depth 3  nodes  63910
position-6   depth 3  nodes  92016

TOTAL nodes visited                           : 518474
nodes with epSquare set                       :  81397   (15.70%)
GUARD changes the predicate's answer on       :      0
GUARD changes zobristKey's key on             :      0
shipped predicate vs ruled oracle, disagree   :      0
guarded predicate vs ruled oracle, disagree   :      0
shipped predicate impure at a node            :      0
guarded predicate impure at a node            :      0
guard (a) (ep target occupied) would fire on  :      0
guard (b) (captured pawn absent) would fire on:      0
```

**518,474 / 81,397 reproduce the design, dev and QE hops to the number**, on a fourth script that
copied none of them. The two rows that matter for the ruling are the last two: **neither condition
fires once on the reachable population**, so they are preconditions rather than a behaviour change —
which is the claim `ADR-0005`'s falsifier **F5** is written against.

One thing worth recording because it cost time: my first run used the wrong FENs for position-5 and
position-6 and produced 490,296 nodes. The table was then read out of `src/perft.test.ts` rather
than recalled, and the count landed on 518,474. **The three prior hops' figure is what caught my
error, which is the shared context doing its job.**

## 4. The suite is unaffected, and the specified tests were proven to bite

The guarded shape run against the repository's own tests in a sandbox (`src/` copied, `node_modules`
symlinked, the repo's own `src/` untouched):

```
tsc --noEmit           exit 0
vitest run             193 passed / 9 files / 0 failed / 0 skipped
```

**No existing test needs editing** — including `src/zobrist.nfr.test.ts`'s call-count and
byte-identity assertions and QE's `L8` edge probes. The ticket's standing "no existing test is
modified" constraint survives this fix.

Then the specified tests were written in the sandbox and each was run against the shipped code and
against each single-guard mutant, so the engineer inherits assertions known to fail:

| tree under test | result over the 14 specified assertions |
|---|---|
| both guards (the ruled shape) | **207 passed** (193 + 14), 0 failed |
| shipped (`M-G0`, no guards) | **10 failed** |
| guard (a) removed (`M-G1`) | **exactly 2 failed** — and only the two pure-divergence FENs fail |
| guard (b) removed (`M-G2`) | **exactly 6 failed** — the four corrupting FENs, at both levels |

`M-G1`'s two failures are the `hasLegalEnPassant` assertions only; their `zobristKey` byte-identity
twins **pass**, because purity holds there. That is the separation of the two properties, measured.

## 5. Cost of the two guards

**Isolated on the predicate**, where `zobristKey`'s 128-square loop cannot bury a two-read delta.
2,000,000 iterations per cell, interleaved shipped/guarded/guarded/shipped:

| cell | shipped ns | guarded ns | delta |
|---|---|---|---|
| ep set, no capture at all | 8.73–8.83 | 8.64–8.68 | −0.19…−0.05 |
| ep set, capture available | 114.38–115.01 | 116.67–116.99 | **+1.66…+2.61** |
| ep set, pinned capturer | 120.84–121.03 | 122.31–123.80 | **+1.28…+2.96** |
| ep set, two candidates | 191.95–192.20 | 193.07–193.65 | **+0.87…+1.69** |
| INVALID: no pawn to capture | 111.06–113.08 | **5.75** | **−107…−105** |
| INVALID: ep target occupied | 134.06–134.54 | **4.88–4.90** | **−130…−129** |

**Through `zobristKey`**, 300,000 iterations per cell, two full runs:

| cell | run 1 ratio | run 2 ratio |
|---|---|---|
| startpos — no ep (`NFR-005` anchor) | 0.999–1.006 | 0.993–0.995 |
| kiwipete — no ep (`NFR-005` anchor) | 0.993–1.001 | 1.003–1.032 |
| ep set, no capture at all | 1.001–1.004 | 1.002–1.012 |
| ep set, capture available (worst) | 0.965–1.003 | 0.998–1.026 |
| amortized over an 18,357-node pool (19.80% ep-set) | 0.9815–0.9948 | 1.0383–1.0454 |

**The two whole-key runs bracket 1.0 from both sides, so the guard's cost is below my measurement
resolution (±4%) and I will not claim a number for it.** The isolated figures are the honest ones:
**+0.9 to +3.0 ns on 15.70% of nodes = ≤ +0.5 ns per node amortized, under 0.15% of a ~317 ns key.**
Reported as measured rather than smoothed, and the amortized pool over-represents ep-set nodes 3x
against the design hop's 6.42%, which biases *against* the guard.

**Zero on the no-ep path**, structurally rather than by timing: the caller's
`epSquare !== NO_SQUARE` short-circuit never enters the predicate, so `NFR-005`'s sub-bar and
`src/zobrist.nfr.test.ts`'s zero-call assertion are untouched by construction.

## 6. The castling evidence

**Textual.** Re-fetched today: HTTP 200, 186,226 bytes, sha256
`e0c8bee28c2dee07b724357b9802fee8591e9d11efd2a910b38e9bd21d3c7643` — **identical** to the copy
retained under `refinement-fide-9-6-1`. FIDE's handbook index lists exactly `E012014`, `E012017`,
`E012018`, `E012023`; `E012024`/`2025`/`2026` return the same 74,467-byte soft-404 shell as a
nonsense chapter id (control run). 9.2.3.2 re-extracted from the retained HTML, not from the derived
text file. Full manifest: `.grugops/context/ticket-to-pr-ABC-011/sources/FIDE-CURRENCY-2026-08-03.txt`.

**Structural.** `addCastlingMoves` (`src/moves.ts:299-319`) reads exactly three inputs:
`position.castling`, `position.board`, and the side to move. Nothing else.

**Over-discrimination, reproduced.** Pairs with identical placement, identical side to move,
identical legal-move sets, differing only in a rights bit:

```
rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1  vs  ... w - - 0 1   moves same, keys DIFFER
4k3/8/8/8/8/8/8/4K1NR w K - 0 1                           vs  ... w - - 0 1   moves same, keys DIFFER
4k3/8/8/8/8/8/8/r3K2R w K - 0 1                           vs  ... w - - 0 1   moves same, keys DIFFER
5r2/4k3/8/8/8/8/8/4K2R w K - 0 1                          vs  ... w - - 0 1   moves same, keys DIFFER
4k3/8/8/8/8/8/8/4K2R w K - 0 1                            vs  ... w - - 0 1   moves DIFFER, keys differ  (control)
```

The control row is there because without it the table proves only that the key notices rights, not
that it notices them *when they matter*.

**No stale rights on any reachable position.** `src/apply.ts:142` clears a right when the king or
rook moves and when the rook is captured on its home square — spot-checked by playing `Rh1xh8` from
`4k2r/8/8/8/8/8/8/4K2R w Kk - 0 1` (`castling` 5 → 0), then checked exhaustively over the same
518,474-node walk:

```
nodes                                          518,474
nodes carrying at least one castling right     368,344   (71.0%)
STALE rights (bit set, king or rook not home)        0
```

The 71.0% is also the denominator that prices the rejected alternative: a castling-availability
predicate would run on 4.5x as many nodes as the en-passant one.

## 7. Harness

Six throwaway scripts in the session scratchpad plus a sandbox with `node_modules` symlinked:
`repro.ts` (the reproduction table), `hop2-sweep.ts` (the exhaustive walk), `hop2-bench.ts` (whole-key
cost), `hop2-predbench.ts` (isolated predicate cost), `hop2-guard1.ts` (the pure-divergence search),
`hop2-castling.ts` + `hop2-rightsloss.ts` + `hop2-g4.ts` (the castling evidence), and
`hop2-sandbox/` (the repo's own suite against the guarded shape and each mutant). **Not committed** —
the same posture every measurement on this project has taken. Every number is transcribed here with
its machine, so nothing depends on the scripts surviving; anyone re-running them should expect to
rebuild them from this note rather than find them.
