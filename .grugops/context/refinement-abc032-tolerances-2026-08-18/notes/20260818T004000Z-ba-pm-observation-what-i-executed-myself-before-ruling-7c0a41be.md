---
id: 20260818T004000Z-ba-pm-observation-what-i-executed-myself-before-ruling-7c0a41be
kind: observation
by: ba-pm
at: 2026-08-18T00:40:00Z
verified_by:
confidence: high
refs:
  - ABC-032
  - ABC-031
  - A4
  - A5
  - src/san.ts
  - src/fen.ts
  - src/legal.ts
supersedes:
---

# The measurements this hop made for itself — nothing below is transcribed from the engineer or from QE

Run on `grugops/ba-abc032-rulings` (from `grugops/abc032-parse-san` @ `c29738c`) with a throwaway
script in the scratchpad that imports the merged `parseFen` / `legalMoves` and the delivered
`toSan` / `parseSan` by absolute path. **No file under `src/` was written by this hop**, and the
script is not in the repository.

## The two `A4` FENs

| FEN | `legalMoves` rendered through `toSan` |
|---|---|
| `8/4P3/8/8/8/8/4k3/4K3 w - - 0 1` (as printed on the page) | `["Kxe2"]` |
| `8/4P3/8/8/8/4k3/8/4K3 w - - 0 1` (the one-character correction) | `["Kf1","Kd1","e8=Q+","e8=R+","e8=B","e8=N"]` |

**The printed FEN makes `A4` unsatisfiable** — one legal move, no promotion, no ambiguity to
collect. **The corrected FEN meets `A4` in full**: four promotions, `e8=Q` resolvable by reference,
bare `e8` ambiguous with exactly 4, and nothing else reaching `e8`. Two of the four promotions check,
which exercises the suffix half of `A4` rather than softening it.

## The three pinned behaviours, re-measured

In `r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4`:

| input | outcome | note |
|---|---|---|
| `Ng5`, `Nfg5`, `N3g5`, `Nf3g5` | `move` → `Ng5` | `G5`: all four the same move |
| `Ne4g5` | `rejected` / `no-such-move` | the bound — a WRONG origin is refused |
| `O-O`, `0-0`, `O-0`, `0-O` | `move` → `O-O` | `G6` |
| `o-o` | `rejected` / `unreadable` | the bound — case is still meaning |

In the corrected `A4` position: `e8=K` → `rejected` / `no-such-move` (`G7`); `e8=P` → `rejected` /
`unreadable`; `e8=Q` → `move`; `e8` → `ambiguous`, 4 candidates. **The two reject codes do not
collapse** — `A5` is MET, as QE found.

## Where the tolerance comes from in the delivered code, read not assumed

`src/san.ts:230` is `text.trim().replace(CHECK_SUFFIX, "")`. `src/san.ts:265` is
`written.replaceAll("0", "O")`, and it sits **after** the piece and pawn branches have both failed to
match, so the `0`→`O` substitution can only ever act on a string that is not a piece or pawn move —
the mixed spelling is confined to the castle path in effect, which is why entry 5 of the closed list
can be written as "inside the castle strings". The redundant qualifier falls out of
`src/san.ts:243-244`, where an empty qualifier is a pass and a present one is an equality test —
there is no rule anywhere that a qualifier must be *necessary*.
