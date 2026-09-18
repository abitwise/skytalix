---
kind: adr
---
# ADR-0022: A candidate list the message region cannot hold is a DOCUMENTED, TESTED BOUND — option 4 — because every candidate is already reachable without the list

## Status

**accepted** — 2026-09-19 by Architect/Design at task `owner-rulings-2026-09-19`, subtask
`ruling-abc107-overflow` (Workflow 07), on the owner's delegation:

> "6. implement best guess for now"
> — Olger Oeselg, project owner, in session, 2026-09-19 (transcribed in
> `.grugops/context/owner-rulings-2026-09-19/notes/20260919T100000Z-orchestrator-decision-six-owner-rulings-verbatim-3c9e1f42.md`)

The owner delegated the SHAPE to this role; this ADR picks one of `ABC-107`'s four options, prices
the other three, and names what would flip it. **No level is set and no target moves**, so no owner
ratification is owed beyond the delegation itself. **"For now" is carried as a revisit trigger**
(`## Consequences`, F1–F4), not a permanence claim. **Zero production lines** are added by this
decision; the one thing it obliges anyone to build is a test.

**Scope fence, first.** `MESSAGE_ROWS` (= 2) and the frame's row count (`frameHeight` = 23) do not
move — `EPIC-002` `4a` and `ADR-0009`'s tripwire stand. Silent truncation and widening the frame
stay ruled out (`ABC-033` `A4`, `EPIC-002` `4a`). `src/move-input.ts` is not changed. The wording
of any message stays `ABC-034`'s.

## Context

`ABC-107` (cut 2026-08-18 from `ABC-033`'s falsified `A4`): the frame's message region is 2 rows
wide by `W` columns, where `W` is the widest panel row (`src/frame.ts` `assembleFrame`), and the
packer places each item whole or not at all, appending `(+N more)` for what it drops. A list of 7
or more same-square SAN candidates does not fit. Four options were left open for this role:
(1) a paged region, (2) a second "which one? 1–8" prompt, (3) a narrower candidate rendering,
(4) an accepted-risk ruling with a documented bound.

**Everything below was MEASURED at this hop through the delivered pipeline** — `newGame(fen)` →
`resolveMoveInput(history, line)` → `assembleFrame` with the real `renderBoard` /
`renderStatusPanel` / `renderHistory` — at `2c96dbd`, not derived by arithmetic. Script and raw
output: `.grugops/context/ruling-abc107-overflow/notes/` (the `observation`).

### The geometry

`W` = **21** (the history pane, `HISTORY_COLS` = 4 + 1 + (1 + 7) × 2; the board is 18, the status
rows 17/13/11). Two rows → **42 cells**. Items are separated by one space; the last row reserves
`(+N more)` (9 chars) plus a separator when anything is hidden.

| item length | per row, no marker | in 2 rows | last row with marker |
|---|---|---|---|
| 2 (`b3`) | 7 | 14 | 4 |
| 3 (`Nb3`) | 5 | 10 | 3 |
| 4 (`Nbd4`, `b3d4`) | 4 | 8 | 2 |
| 5 (`Nb3d4`) | 3 | 6 | 2 |
| 6 (`Nb3xd4`) | 3 | 6 | 1 |
| 7 (`Qh4xe1#`) | 2 | 4 | 1 |

### Fit, per rendering, on the ticket's fixtures plus the queen cap

`hidden` is read from the emitted `(+N more)` marker, exactly as `src/move-input.test.ts:409-419`
reads it. `per row` is items placed on row 0 / row 1.

| fixture (all round-trip through `toFen`) | current rendering (`toSan`, minimal SAN) | option 3 as `Nb3` (piece + origin) | option 3 as `b3d4` (coordinate) |
|---|---|---|---|
| 6 knights `7k/8/2N1N3/1N3N2/8/1N6/2N5/K7 w - - 0 1` | shown 6, hidden **0**, per row 4/2 | shown 6, hidden 0, 5/1 | shown 6, hidden 0, 4/2 |
| 7 knights `7k/8/2N1N3/1N3N2/8/1N3N2/2N5/K7 w - - 0 1` | shown 5, hidden **2**, per row 3/2 | shown 7, hidden 0, 5/2 | shown 7, hidden 0, 4/3 |
| 8 knights `7k/8/2N1N3/1N3N2/8/1N3N2/2N1N3/K7 w - - 0 1` | shown 5, hidden **3**, per row 3/2 | shown 8, hidden 0, 5/3 | shown 8, hidden 0, 4/4 |
| 8 queens `3Q3Q/Q7/6k1/8/Q6Q/8/5Q2/QK1Q4 w - - 0 1` | shown 5, hidden **3**, per row 3/2 | shown 8, hidden 0, 5/3 | shown 8, hidden 0, 4/4 |

So: **current rendering holds to 6 and hides at 7** (QE's `G1` and the Orchestrator's reproduction,
confirmed a third time). **Option 3 as `Nb3` fits 10, so it holds every list up to the cap of 8 with
two items of headroom; as `b3d4` it fits exactly 8 with zero headroom.**

### The two facts the decision turns on

**1. Every candidate is reachable WITHOUT the list, today.** For each of the 6 / 7 / 8 knights and
8 queens, typing the candidate's full-origin SAN (`Nb3d4`) resolves to exactly that move — **8/8,
8/8, 7/7, 6/6** — and so does its coordinate form (`b3d4`) — **8/8, 8/8, 7/7, 6/6**. `parseSan`'s
qualifier is optional-file and optional-rank, so a full origin is always accepted even where the
minimal form would be shorter; the coordinate grammar is always accepted with no mode switch
(`EPIC-003`). And the board — nine rows above the message region in the same frame — shows every
origin square. The list is a courtesy; disambiguation never depends on it. `A1`'s phrase "reachable
by the player" is therefore already true of every candidate, and what the marker withholds is a
hint, not a move.

**2. Seven is out of reach of ordinary play.** The most same-type attackers one square can have:
knights **8**, queens **8** (one per ray; a second queen on a ray is blocked), rooks **4**, bishops
**4**, king 1, pawns 2. A standard army holds 2 knights / 2 rooks / 2 bishops / 1 queen, so a 7-item
list of one piece type needs **five promotions to that type** (knights: 2 + 5; queens: 1 + 6). The
case-folded union `ABC-033` can produce mixes at most one pawn capture with the bishops reaching the
same square (`bxc4` / `Bxc4`), which caps at 5 — under the bound. `ABC-107`'s `P2` rationale already
said this; it is now measured rather than felt.

## Decision

**Option 4. The bound is written down, pinned by a test, and the `(+N more)` marker stays the
honest signal. Nothing pages, nothing re-prompts, nothing is rendered narrower.**

1. **The bound, as the product's contract:** at the delivered panels' width (`W` = 21) and
   `MESSAGE_ROWS` = 2, the message region shows every candidate of an ambiguity of **up to 6** SAN
   items; **7 shows 5 and marks 2 hidden; 8 shows 5 and marks 3 hidden.** Beyond the bound the
   player disambiguates from the board, by full-origin SAN or coordinate form — both accepted for
   every candidate, measured above.
2. **The bound is pinned by a test, not by arithmetic** — `ABC-107` `A5`, unchanged: the 6-, 7- and
   8-knight fixtures as named cases through the real pipeline, asserting `hidden` = **0 / 2 / 3**.
   The `= 0` at six is the **requirement**; the `2` and `3` are the **tripwire** — the same
   requirement-versus-tripwire split `ADR-0009` clause 5 uses for `= 23` / `≤ 24`. A wider frame,
   a narrower SAN or a moved `MESSAGE_ROWS` reds the tripwire so the move is deliberate.
3. **`ABC-107` `A1` is replaced** by the bound in clause 1 (its page carries the new wording as
   `A1'`); `A2`–`A5` stand. The ticket re-shapes to **`XS`**, as its own re-size trigger said.
4. **Zero production lines.** `src/frame.ts`, `src/move-input.ts`, `src/san.ts` are not touched by
   the build. The deliverable is one test file (`≤ 1 new test file`, `0 new spawns`, per the ticket's
   `N8-LANE` line) and this ADR.
5. **Not decided here, named so nobody reads it in:** the marker's *wording* — a `(+3 more)` that
   also said *how* to disambiguate would be better, and that is `ABC-034`'s (rejection/message
   wording), raised there as an observation, not built here.

**Why 4 over the Orchestrator's prior (3), in two sentences.** Option 3 buys two more items than the
cap ever needs at the price of making EVERY ambiguity — including the everyday two-knight case —
non-retypeable (`Nb1 Nf3` is not SAN and `parseSan` reads it as a move *to* b1), which is exactly the
common-case regression `A3` exists to refuse, and it has to be built in `src/move-input.ts`'s
`ambiguous()` because the frame knows no chess, contradicting `A4`. Option 4 costs nothing today, is
honest by construction (the marker already exists and every candidate is already reachable), and
leaves the one real risk — the threshold drifting silently into ordinary-play range — to a tripwire
that fails loudly.

## Alternatives

**Option 1 — a paged or scrollable message region.** The frame stops being a pure function of its
items: a page index becomes loop state, an affordance ("more") becomes an input arm, and
`src/turn-loop.ts` — `Done`, mutation-tested, re-opened only for the owner's `quit` arm
(ruling 5) — gains a second reason to change. Priced **`M`**, two production modules, a state the
frame never had, and the `A3` regression risk the ticket names (paging makes the two-candidate case
worse). **Rejected: the cost is real and the case it serves is five promotions away.**

**Option 2 — a "which one? 1–8" second prompt.** Adds an input-side dependency and a prompt mode.
It also **does not solve the display problem it is offered for**: the numbered menu still has to
show the 8 candidates, and `1 Nb3d4 2 Nb5d4 …` is longer than the list it replaces. Priced **`M`+**.
**Rejected.**

**Option 3 — a narrower rendering (the Orchestrator's prior).** Measured above: as `Nb3` it fits 10
(8 with headroom); as `b3d4` exactly 8. Priced **`S`**: one function (`ambiguous()` in
`src/move-input.ts`), a rewrite of `A4`, and a re-reading of `EPIC-003`'s "candidate moves are
listed in SAN" (`Nb3` is not SAN; `b3d4` is not SAN). The cost that decides it is in the common
case: today's list is retypeable as shown; a piece-plus-origin list must be composed. A
CONDITIONAL narrowing (full SAN when it fits, narrower only on overflow) avoids that but needs the
producer to know `W` or the frame to know chess — a new seam across `ADR-0010`'s width ownership.
**Rejected for now, and named as the fallback shape if F2 below fires.**

**Ruled out before design (unchanged):** silent truncation; widening the frame; moving
`MESSAGE_ROWS`.

## Consequences

- `ABC-107`: `M` → **`XS`**; `A1` → `A1'` (documented bound); DoR items 3 and 10 re-scored on its
  page; **pullable**. `ABC-033` `A4` stays "NOT met" on its own page — this ADR re-scopes the promise,
  it does not make the original sentence true.
- `NFR-002` (< 16 ms redraw): untouched — no render-path change. `ADR-0009` tripwire: untouched.
  `N8-LANE`: one test file, four fixtures, each costing one `legalMoves` per candidate for the
  suffix (`src/san.ts` `suffix`) — milliseconds; `NFR-008` is still breached on CPU (`ABC-108`), so
  no lane line is claimed.
- The residual the ruling ACCEPTS, named: a player who reaches a 7- or 8-way same-piece ambiguity
  sees five candidates and a count, and disambiguates from the board. That is the whole of it.

**What would flip this ADR (the falsifiers):**

- **F1 — a 7+ list from fewer than five promotions of one type.** Any producer that hands the
  region a list of 7 or more by design — a `moves` listing, a multi-line `help`, a rejection with
  many reasons — is a NEW consumer (`ABC-107` fences those out) and re-opens this question for that
  consumer, with option 3 or 1 as the shape.
- **F2 — the tripwire reds toward the player: the 6-fixture stops fitting** (a wider SAN, a
  narrower `W`, a third status column). The bound would then sit inside ordinary play (two to four
  candidates is a real game), and this ADR is superseded by option 3 conditional on overflow.
- **F3 — the owner's word** that the board was not enough in a real session.
- **F4 — the tripwire reds the other way** (a wider frame makes 7 or 8 fit): not a flip, a
  re-baseline — update the numbers in clause 1 and in `A5`, deliberately.

## Rollback

Revert this file and `ABC-107`'s page block to `2c96dbd`; the ticket returns to `M` with `A1` as
written and the four options open. No production code exists to revert. If the `A5` test file has
landed, it can stay: its assertions are true of the delivered tree under every option.
