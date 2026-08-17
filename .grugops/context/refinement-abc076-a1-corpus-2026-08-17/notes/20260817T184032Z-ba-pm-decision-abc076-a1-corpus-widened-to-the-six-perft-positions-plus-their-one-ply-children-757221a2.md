---
id: 20260817T184032Z-ba-pm-decision-abc076-a1-corpus-widened-to-the-six-perft-positions-plus-their-one-ply-children-757221a2
kind: decision
by: ba-pm
at: 2026-08-17T18:40:32Z
verified_by:
confidence: high
refs:
  - plans/tickets/ABC-076-evaluation-material-and-piece-square-tables.md
  - plans/tickets/ABC-082-evaluation-pawn-structure.md
  - plans/tickets/ABC-083-evaluation-king-safety-and-mobility.md
  - src/perft.test.ts
  - src/legal.ts
  - src/apply.ts
  - .grugops/context/pull-abc076-abc031-2026-08-17/notes/20260817T183556Z-orchestrator-observation-ready-for-dev-exit-review-three-gaps-and-one-ticket-held-back-5d2b7c81.md
supersedes:
---

# `ABC-076` `A1` — corpus WIDENED, not weakened. Six perft positions plus their one-ply children = 184.

## The finding, re-counted first-hand (not taken from the page)

`src/perft.test.ts`'s `PERFT_SUITE` (`:19`-`:56`) holds **exactly six** entries — `startpos` `:21`,
`kiwipete` `:27`, `position-3` `:33`, `position-4` `:39`, `position-5` `:45`, `position-6` `:51`. The
seventh `fen:` a naive grep returns is the `interface` field declaration at `:16`. Three further FEN
string literals exist and none adds a distinct suite position: `KIWIPETE` `:58` and `START_FEN` `:59`
are duplicates of suite entries, and `:118`'s `7k/4P3/8/8/8/8/8/4K3 w - - 0 1` is an ad-hoc fixture
inside a `perftDivide` promotion-label test, not a member of "the set". **Six positions plus six
mirrors is twelve. `A1`'s `≥ 40` was unsatisfiable from its named source.** `ABC-031` `A5` and its
`## Dependencies` say "the six perft positions"; that side is correct and `ABC-076` was wrong.

## The two candidate fixes are NOT equivalent, and I did not take the cheap one

- **(a) Restate the bar at the corpus's real size (~12 mirrored pairs).** Costs nothing. **It
  WEAKENS the property, and it weakens it precisely where this ticket is weakest.** `ABC-076`
  delivers *one piece-square table per piece type, mirrored for black*. The bug class that
  survives twelve pairs is **one wrong entry in one mirrored table on a square none of the six
  positions occupies**. Six standard positions touch a small, fixed subset of the 64 squares, so
  (a) would ship a property that catches the global sign error and misses per-square mirror errors
  — the more likely defect in hand-typed tables.
- **(b) Widen the corpus — CHOSEN.** "Drawn from" is read as *derived from*: the six positions
  **plus every position reachable from each in exactly one legal ply**. Size is arithmetic, not an
  estimate: the depth-1 perft counts in that same file are `20 + 48 + 14 + 6 + 44 + 46 = 178`, so
  the corpus is `6 + 178 = 184` positions and their mirrors.
- **(c) Hand-pick 40+ new FENs — REJECTED.** It forks a corpus instead of extending one, abandons
  the named source entirely, and hand-picking is exactly what `A1`'s own parenthetical mocks.

## The tradeoff I accepted

(b) costs more than (a) and I paid it. **The cost is smaller than it looks and the benefit is
larger:** the expansion needs no new machinery — merged `legalMoves` (`src/legal.ts:42`) and
`makeMove`/`unmakeMove` (`src/apply.ts:122`/`:152`), whose correctness is proven byte-exact to depth
by the very file supplying the corpus. Generation is deterministic, so `184` is a stable, countable
number, not a sampling target. **What (b) genuinely costs:** the mirror helper now has to handle
castling rights and the en-passant square, because one-ply children include double pawn pushes and
king/rook moves — `A1` now says so explicitly. That is real work `A1`'s original prose had silently
omitted, and (a) would have let it stay omitted while looking cheaper.

**The shape argument decided it.** `A1` is "the whole test suite in one property" by the ticket's own
test note, and `ABC-082` (`A1`: `ABC-076`'s corpus **plus ≥ 15 new** positions) and `ABC-083` (`A1`:
the `ABC-076`/`ABC-082` corpus **plus ≥ 15 new**) are both required to EXTEND it. Under (a) those
tickets inherit a 12-pair base and land at ~42 pairs of hand-named positions across three tickets;
under (b) they inherit 184 and their `≥ 15 new` positions become what they were written to be —
*targeted* additions for structures the derived corpus does not reach. **This choice sets the base
for two later tickets and (b) is the one that makes their own criteria mean what they say.**

## What changed in the ticket — surgical

`A1`, one clause of test note 1 (the derive helper, required by the fix), and the DoR row-4 quote
that restated the dead `≥ 40`. Nothing else. Page went 118 → 122 lines, inside process rule 2's
budget. **No board column moved** — that is the Orchestrator's.
