---
id: 20260809T200822Z-orchestrator-decision-fb83873f
kind: decision
by: orchestrator
at: 2026-08-09T20:08:22Z
verified_by: 
confidence: high
refs:
  - ABC-022
  - ABC-023
  - ABC-009
  - EPIC-001
  - NFR-001
  - src/moves.ts
  - src/legal.ts
  - plans/board.md
  - plans/tickets/ABC-022-en-passant-generation-preconditions.md
supersedes: 
---

# Definition of Ready re-run: **GREEN**. `ABC-022` pulled `Ready` → `In Development`

`Ready` 2/8 → 1/8, `In Development` 0/3 → 1/3. Ticket frontmatter moved with the column. No limit
approached, no override taken. This supersedes nothing — the AMBER verdict in
`20260809T192651Z-orchestrator-decision-1b276013` was correct when it was written and the ticket has
since changed underneath it.

## What I verified myself before believing the hand-back

This role's recorded failure shape on `ABC-009` was **believing an instrument without checking the
instrument, five times**. So the crux was re-derived here rather than accepted.

**The boundary claims, checked mechanically:** `git diff --stat main -- src/` empty,
`git diff --name-only main -- 'src/*.test.ts'` empty, `src/moves.ts` md5
`0e247853ab2c05887c76105ff83d8621`. Only `plans/` and `.grugops/` changed.

**The crux — `A3`'s new black-to-move rows — reproduces exactly as reported.** My own probe, FEN
printed and re-parsed per row, purity compared over 128 bytes and five scalars field by field:

```
4k3/8/8/8/3p4/8/8/4K3 b - e3 0 1    gen_ep=1  legal_ep=1  bytes_changed=1  scalars_changed=false
   -> 4k3/8/8/8/3pP3/8/8/4K3 b - e3 0 1     phantom WHITE pawn on e4
4k3/8/8/8/6p1/8/8/4K3 b - h3 0 1    gen_ep=1  legal_ep=1  bytes_changed=1  scalars_changed=false
   -> 4k3/8/8/8/6pP/8/8/4K3 b - h3 0 1      phantom WHITE pawn on h4
4k3/8/8/8/3pP3/4R3/8/4K3 b - e3 0 1   gen_ep=0  (A5's new ROOK row — 0 today, as claimed)
4k3/8/3r4/3pP3/8/8/8/4K3 w - d6 0 1   gen_ep=0  (A5's new ROOK row — 0 today, as claimed)
7k/8/8/K1Pp3r/8/8/8/8 w - d6 0 1      gen_ep=1  legal_ep=0  bytes_changed=0  (A6 control holds)
```

**What I did NOT re-derive**, carried as BA/PM's measurements and labelled as such: the 512-state
exhaustion behind `A5`'s equivalence proof; the colour-shaped restructure mutant `A5` is now kept to
kill; the 28 `toFen` castling aliases and the `epSquare` 32/40 off-board alias; the 331 / 216,269
evaluation counts; the self-masking purity row. None is load-bearing for the pull decision.

## Why this is a PASS and not a second AMBER

**The partial-fix test that blocked `ABC-009` is now passed.** Every partial I could construct is
caught by a named criterion:

| partial fix | caught by |
| --- | --- |
| empty-target condition only | `A3` (a3 is empty; `b2a3` still offered) |
| captured-pawn condition only | `A1` (the white e4 pawn IS present) |
| captured-pawn for white only | `A3`'s new black rows — **the defect this hop found** |
| colour-shaped restructure dropping the ordinary-capture `continue` | `A5` (BA/PM-measured) |

All ten Definition-of-Ready rows hold. The row that was AMBER — *acceptance criteria clear, testable
and measurable* — now carries exact `FLAG_EN_PASSANT` counts per named FEN on both colours to move,
purity over 128 bytes **and** five scalars across all ten reproduction positions compared field by
field rather than through `toFen`, exact per-root node counts, 32/32 zero tolerance and skip count 0.
`NFR-001` carries a runnable bar with a **count** primary (331 evaluations, 0 rejections, with the
216,269 ordering alternative named), a ≥ 1,000,000 nodes/sec clock floor and an aggregate-only ratio.

## The two things worth carrying forward as class defects, not incidents

1. **A criterion narrower than its own `## Scope`** accounted for four of the seven defects here, and
   it has now been the pull-blocking shape on `ABC-018`, `ABC-009` and `ABC-022`. This is a
   refinement-process defect, not three ticket defects. It belongs to the Factory Coach at the next
   retro; `mode` is `lean` so that role is not live, and I am recording it rather than routing it.
2. **Four consecutive pulls have failed the same Definition-of-Ready row** whose tick the ticket's own
   DoR block had set green. The block is written once at cutting and then trusted for days. Every
   pre-check has under-counted: three found five, four found seven, two found seven.

## The `ABC-023` ordering, restated because it now has a deadline

`ABC-023` stays in `Backlog` and is promoted **after** `ABC-022` merges. At that promotion BA/PM must
re-derive `A4`'s `src/moves.ts` hash and every *(Measured today: …)* parenthetical, because
`ABC-022`'s fix changes that file. `ABC-023`'s `## Dependencies` claim that the two are independent
and *"either order works"* is wrong as written and should be corrected at the same hop.

**`ABC-023`'s own escalation trigger is now close to firing:** it promotes to `P1` *"when any ticket
proposes to change `addCastlingMoves`, the `CastleOption` tables, or the through-check loop."*
`ABC-022` changes `addPawnMoves`, **not** those, so **the trigger has NOT fired** — stated plainly
because a trigger treated as fired when it has not is a trigger nobody trusts again.
