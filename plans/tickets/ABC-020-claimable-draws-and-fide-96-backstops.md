---
id: ABC-020
title: FIDE 9.2/9.3 draws become claimable, and FIDE 9.6 automatic backstops land with them
status: ready
column: Ready
size: M
priority: P0
epic: EPIC-001
feature: —
---

# ABC-020 — FIDE 9.2/9.3 draws become claimable, and FIDE 9.6 automatic backstops land with them

> **THIS TICKET REVERSES A RULING MADE TWICE.** `ABC-007` `## Out of scope` and `ABC-019`
> `## Out of scope` both put this behaviour out of scope, the latter calling it *"Settled by merged
> code plus `EPIC-006`'s acceptance, not open"*. **Both rulings predate the project owner's standing
> priority of 2026-07-31**, quoted below, which reopens the question and answers it. Neither ruling
> was wrong when it was made; each was made under a priority that no longer applies. Both
> `## Out of scope` blocks have been amended in place on the same day as this ticket was cut, so no
> future reader finds two documents disagreeing with no explanation.
>
> The directive, from the project owner **Olger Oeselg**, 2026-07-31:
>
> > *"The most important thing is that chess moves are legal according to game rules, everything
> > else comes after that. Game has to be played according to it's rules."*
>
> **This is a conformance change, not a defect fix.** `src/gameend.ts` does exactly what `ABC-007`
> specified and was accepted for; what changed is the specification. The distinction matters for how
> this ticket reads in the trace: it is not a bug that escaped a gate, it is behaviour a human
> accepted at merge and a later directive re-scopes.

## Problem

*User*: the human player, who under FIDE is entitled to the draw **and entitled to refuse it**.

*Pain*: `src/gameend.ts:102-108` applies the fifty-move rule at 100 plies and threefold repetition
at three occurrences **automatically**, with no claim. FIDE 9.2 and 9.3 make both a draw *upon a
correct claim by the player having the move*. Only FIDE 9.6 draws automatically, and only at
**fivefold** (9.6.1) and **75 moves** (9.6.2), neither of which this code implements.

The deviation is not "a draw arrives early". It runs one way, and the direction is the point:

> **FIDE gives the claim to the player having the move. This code takes the draw away from exactly
> that player.**

QE reproduced it end to end (`20260731T151500Z-qe-e2e-observation-36373ca4`, gap G-1). Repeated
position `6k1/5ppp/8/b7/8/8/5PPP/4R1K1 w - - 0 1` — White to move has **`Re8#`**. Play the shuffle
`1.Kh1 Bb6 2.Kg1 Ba5 3.Kh1 Bb6 4.Kg1 Ba5` and the third occurrence is created by **Black's** move:

```
  b6a5  occurrence 3  {"result":"draw","reason":"threefold-repetition"}
  final position : 6k1/5ppp/8/b7/8/8/5PPP/4R1K1 w - - 8 5
  side to move   : WHITE
  Re8 still legal for the side to move: true
  and Re8 is       : {"result":"white-wins","reason":"checkmate"}
```

Under FIDE, Black has just moved and so cannot claim (9.2.1 — the claimant must have the move);
White has the move and plays `Re8#`. **FIDE: 1-0. This code: ½-½.** The fifty-move rule has the
identical shape: `6k1/5ppp/8/b7/8/8/5PPP/4R1K1 w - - 100 60` → `{"result":"draw","reason":"fifty-move"}`
with `Re8#` on the board for the side to move.

*Value*: in a human-vs-engine game the engine is the side that repeats when it is losing, **so the
deviation runs systematically against the human.** It hands the losing side a drawing resource the
Laws do not give it and takes a won game from the side that has the move. Under the owner's
directive this is the clearest violation on the board.

**The existing suite looks like it covers this and does not.** `src/gameend.test.ts:142-147`
("prefers checkmate over the fifty-move rule when both could apply") uses a position where mate is
**already delivered**. It does not cover a mate **available to the side to move**, which is the only
case where the deviation bites.

## The coupling — non-negotiable, and the reason this is ONE ticket

**Making the draws claimable REQUIRES FIDE 9.6 in the same change.** The automatic fifty-move rule
is currently the only thing that terminates a locked position. QE proved it by driving one:

```
  8/8/8/p1p1p1p1/P1P1P1P1/8/8/K6k w - - 0 1     locked pawn wall, kings alone
  legal moves : 3   (a1a2 a1b1 a1b2 — king moves only, forever)
  drives to   : terminal after 117 plies: {"result":"draw","reason":"fifty-move"} clock=100
```

Remove the automation without adding 9.6 and that game **never ends**. So the two halves land
together or neither lands.

**If a design hop or an engineer proposes splitting this ticket, the split is refused.** Shipping
the claim half alone ships a game that does not terminate; shipping the 9.6 half alone is dead code.
The ticket is sized `M`, so the no-`XL` rule requires no split and none is available. Acceptance
criterion **A5** below is the criterion that fails if the halves are separated, and it is written
against QE's exact locked-wall FEN so it cannot be satisfied by reasoning.

## Source

- `20260731T151500Z-qe-e2e-observation-36373ca4` — gap **G-1** (the reproduction above, both
  sequencing warnings, and the disposition *"Recommend a human re-read, not a defect ticket"*),
  gap **G-3** (the locked-wall drive), gap **G-4** (the ordering warning carried into
  `## Out of scope` below).
- `20260731T152200Z-qe-e2e-observation-1a02d912` — **R-4** (checkmate-before-draw ordering is
  correct and load-bearing), **R-5** (the halfmove-clock boundary is exact at 100), **R-6** (FIDE 9.6
  is genuinely unreachable *today*, and becomes reachable the same day this ticket lands).
- `20260731T153200Z-qe-e2e-claim-aab64fc7` §1 — QE recorded explicitly that whether the deviation is
  *acceptable* is a product ruling it could not make. **This ticket is that ruling**, taken under the
  owner's directive.
- The owner's standing priority, 2026-07-31 (quoted at the head of this file).

## Scope

`gameStatus` conforms to FIDE Articles 9.2, 9.3 and 9.6. **The mechanism is the engineer's call;
the observable contract below is the requirement.**

For any position and any counts map, exactly one of three states is reported:

- **(a) The game is over automatically** — checkmate (5.1.1), stalemate (5.2.1), dead position by
  material (5.2.2 as implemented), **fivefold repetition (9.6.1)**, **75 moves (9.6.2)**.
- **(b) The game is in progress, AND one or more draws are claimable by the player having the
  move** — threefold repetition (9.2), the fifty-move rule (9.3). Both may hold at once, and both
  are reported when they do.
- **(c) The game is in progress with nothing claimable.**

Three hard constraints on that contract:

- **State (b) is NEVER reported as `result: "draw"`.** A claimable draw is a game in progress. This
  single sentence is the whole of G-1's fix.
- **A claim belongs to the side to move**, and to nobody else. The side that just moved cannot
  claim, which is precisely the asymmetry the reproduction turns on.
- **The automatic thresholds are five occurrences and 150 plies.** Three and 100 stop being
  terminal and become claimable.

Also in scope, because they are the same doc comment and the same edit:

- **The module doc comment (`src/gameend.ts:1-9`) and `isInsufficientMaterial`'s (`:48-54`) are
  corrected.** They describe "five terminal conditions" and present the material-count test as
  though it were the whole of FIDE 5.2.2. There is no FIDE article called "insufficient material";
  it is a **subset** of 5.2.2, and the header must say so. This is QE's G-3 recommendation —
  *documentation, not code* — and it lands here because this ticket rewrites that header anyway.

## Out of scope

- **Full FIDE 5.2.2 dead-position detection** (*no series of legal moves can produce checkmate*).
  QE gap G-3: not implemented by any engine, unbounded work, and the error direction is safe — a
  draw is late, never wrong. The delay is now bounded at 150 plies by 9.6.2 rather than 100 plies by
  the automatic fifty-move rule. **Declined, and the wording correction above is the whole response.**
- **Re-ordering the terminal checks.** QE gap G-4 records that a stalemate arising in an already-dead
  position is labelled `stalemate` where FIDE would call 5.2.2 the operative article. The result is
  identical either way. **Do not "fix" it by re-ordering:** the zero-legal-moves branch running first
  is what makes checkmate beat every draw rule (R-4, verified at clock 100), and that ordering is
  load-bearing. Acceptance **A6** pins it.
- **Claiming a draw that will arise after an intended move** (FIDE 9.2.1.1 / 9.3.1). Cut: it requires
  the player to announce or write down a move before playing it — a tournament-arbiter mechanism with
  no place in a CLI whose value is *one command, five seconds, and you are playing*. The claim in
  this product is always about a position that has already arisen.
- **A penalty for an incorrect claim** (FIDE 9.5.3, which adds time to the opponent's clock). There
  are no clocks in any epic. An unavailable claim is simply rejected — `ABC-021` owns the rejection.
- **Draw by agreement (FIDE 9.1).** No epic has a draw offer; `EPIC-006`'s command set is
  `undo` / `resign` / `new` / `quit`. Cut, and named so the omission is visible rather than assumed.
- **Who claims, how the player asks, and what the frame shows** — `ABC-021` (the loop interaction and
  the engine's policy), `ABC-016` (the status-panel indicator), `EPIC-003` (the `claim` verb at the
  prompt), `EPIC-006` (the result screen's wording). This ticket is the rules core only; it renders
  nothing and prompts for nothing.
- **Making `positionCounts` required.** Out of scope, and the reason is **not** the one
  `ADR-0002`'s Consequences section records. See *Dependencies* below.
- **`ABC-011`** (the en-passant hashing defect) and **`ABC-009`** (`legalMoves` mutating its
  argument). Different modules, independent, both already ticketed. `gameStatus` inherits `ABC-009`
  on its first line and every repetition verdict inherits `ABC-011`; both are **carried, not owned**.

## Acceptance (Given/When/Then)

Each criterion below is a currently-failing test that must go green, except where marked as a
regression guard. Every parenthetical is QE's measured behaviour on `main` today.

- **A1 — the headline case, exactly as reproduced.** **Given** `6k1/5ppp/8/b7/8/8/5PPP/4R1K1 w - - 0 1`
  and the move list `Kh1 Bb6 Kg1 Ba5 Kh1 Bb6 Kg1 Ba5` with a counts map that includes the current
  occurrence, **when** the status is evaluated after the move that creates the **third** occurrence,
  **then** the result is **`in-progress`**, threefold repetition is reported as **claimable by
  White** (the side to move), and `Re8` is still legal. **And when** `Re8` is played, **then** the
  status is `{ result: "white-wins", reason: "checkmate" }`.
  *(Today: `{"result":"draw","reason":"threefold-repetition"}` at the third occurrence.)*
- **A2 — the fifty-move twin.** **Given** `6k1/5ppp/8/b7/8/8/5PPP/4R1K1 w - - 100 60`, **when** the
  status is evaluated, **then** the result is **`in-progress`** and the fifty-move draw is reported
  as **claimable by White**; **and when** `Re8` is played, **then** the result is checkmate,
  white-wins. *(Today: `{"result":"draw","reason":"fifty-move"}`.)*
- **A3 — 9.6.1 fivefold is automatic.** **Given** a counts map in which the current position's key
  has occurred **five** times, **when** the status is evaluated, **then** the result is `draw` with a
  reason naming **fivefold repetition**, and **no claim is required**. **Given** four occurrences,
  **then** the result is `in-progress` and threefold is claimable.
  *(Today: three occurrences draws; five is unreachable because the game already stopped at three —
  QE verified that with a knight cycle from the start position, R-6.)*
- **A4 — 9.6.2 seventy-five-move is automatic, and its boundary is exact.** **Given** halfmove clocks
  of **149** and **150**, **when** the status is evaluated, **then** 149 is `in-progress` with the
  fifty-move draw claimable, and 150 is a `draw` with a reason naming **75 moves**. *(150 plies is 75
  moves by **each** player, the same arithmetic R-5 verified for 100/50. Today both report
  `fifty-move` as a completed draw.)*
- **A5 — THE COUPLING CRITERION. The game still terminates without anybody claiming.** **Given**
  `8/8/8/p1p1p1p1/P1P1P1P1/8/8/K6k w - - 0 1` (QE's locked pawn wall — three legal king moves,
  forever, no capture and no pawn move available to either side), **when** legal moves are played and
  **no claim is ever made**, **then** an automatic terminal verdict is reached **within 150 plies**
  and that verdict is the **75-move** draw. *(Today: terminal after 117 plies with `fifty-move`.
  This is the criterion that fails if the two halves of this ticket are separated, and it is why they
  are not.)*
- **A6 — checkmate still outranks every draw rule, automatic or claimable.** **Given**
  `4Q2k/6pp/8/8/8/8/8/6K1 b - - 100 80`, **when** the status is evaluated, **then** it is
  `{ result: "white-wins", reason: "checkmate" }`; **and given** the same position at clock **150**,
  **then** it is still checkmate, not a 75-move draw. *(Regression guard — passes today at clock 100
  and must keep passing. FIDE 9.6.2 states the same precedence in words: "if the last move resulted
  in checkmate, that shall take precedence". R-4 records this ordering as load-bearing.)*
- **A7 — the claim is the side-to-move's and nobody else's.** **Given** the A1 position at the third
  occurrence, where the occurrence was created by **Black's** move, **when** the claimable set is
  read, **then** it is attributed to **White**. **Given** the same position with the side to move
  flipped, **then** it is attributed to Black. *(Assert the attribution, not merely that something is
  claimable. A test that only asserts "threefold is claimable" passes under an implementation that
  ignores whose turn it is, which is the exact defect being fixed.)*
- **A8 — the counts map stays optional, and the trap's blast radius is pinned rather than hidden.**
  **Given** the counts argument is **omitted** and the current position has occurred five times,
  **when** the status is evaluated, **then** neither the fivefold draw nor the threefold claim is
  reported — the documented consequence of `ADR-0002` clause 4. **And given** that same bare caller
  on the A5 locked wall, **then** the game still terminates within 150 plies on the **75-move**
  backstop, which is clock-based and needs no counts map. *(A bare caller can therefore never produce
  a non-terminating game. This criterion exists so that the one real cost of the optional parameter
  is written down as a test rather than argued about later.)*
- **A9 — existing tests: exactly these change, and no others.** **When** the suite runs after this
  ticket, **then** it is green with a skip count of **0**, and the only modified tests are the ones
  named in *Test notes* below. *(**This is the first ticket in this project whose acceptance permits
  modifying an existing test.** Every other ticket carries "no existing test is modified". That rule
  cannot hold here — the specification changed, so the tests that pin the old specification must
  change with it — and the exception is bounded by naming the tests up front rather than discovered
  during review.)*
- **A10 — the cost bar in *Security / NFR triggers* holds when measured.**

## Dependencies

- **No blocking dependency.** `src/gameend.ts`, `src/zobrist.ts` and `src/legal.ts` are all merged on
  `main` (`ABC-005`, `ABC-007`). Nothing here waits on unbuilt code, which is why this is one of the
  two tickets in this epic that goes straight to `Ready`.
- **Sequencing — this must merge before `ABC-019` and before `ABC-016`.** `ABC-019`'s acceptance
  currently asserts the loop *"stops with that reason"* for all five automatic `EndReason` values
  including `fifty-move`, and `ABC-016`'s panel has no claim row. Build either against today's
  semantics and the deviation stops being a bug and becomes an encoded assumption — the same failure
  `ABC-011`'s escalation trigger was written to prevent. Both tickets have been amended today to
  match this ticket; the amendments are worthless if the merge order is reversed.
- **`ABC-011` — carried, and this ticket gives it a second consumer.** Every repetition verdict here
  rests on the Zobrist key, and `ABC-011` makes it under-detect. That now touches an **automatic**
  rule (9.6.1 fivefold), not only a claimable one. Termination is nevertheless still guaranteed,
  because 9.6.2 is clock-based and a pure repetition loop can contain neither a capture nor a pawn
  move — so the clock climbs to 150 regardless of what the key does. **Under-detection costs a late
  draw, never a non-terminating game.** That is why `ABC-011` does not escalate to `P0` on this
  ticket; see its own note dated today.
- **`ABC-009` — carried, not owned.** `gameStatus` calls `legalMoves` on its first line and inherits
  the mutation defect in full (QE gap G-6: one `gameStatus` call turns
  `4k3/8/8/8/8/8/8/K7 w KQ - 0 1` into a position with a phantom second white king). Not re-scoped
  here.

### Open design question — hand to Architect/Design at the design hop, do not decide in dev

**How the claimable set reaches the caller is a shape decision, and it brushes a ratified ADR.**
`ADR-0002` clause 4 reads *"`gameStatus`'s `positionCounts` gets exactly one supplier ... The
signature does not change."* Read in context that sentence is about the **parameter** — the clause
is refusing to make `positionCounts` required — and this ticket adds no parameter and changes no
supplier. But a claimable set has to reach the caller somehow, and the natural mechanisms all touch
the returned value:

- grow the returned `GameStatus` with a claims field;
- a second exported query, e.g. `claimableDraws(position, counts)`, leaving `GameStatus` alone;
- a discriminated result that distinguishes *over* from *in progress, claimable*.

**Not decided here, and not decidable in dev.** `ADR-0002` is ratified and no agent may amend a
ratified clause; if Architect/Design judges that any option amends clause 4 rather than merely
extending around it, that goes to a named human as an ADR amendment. **This does not block the
acceptance criteria** — every criterion above is written on observable behaviour, not on shape, and
resolves identically under all three options. It is flagged and assigned, exactly as `ABC-010` and
`ABC-011` flag theirs.

### Why `positionCounts` stays optional — the reason to record, which is not the one on file

`ADR-0002`'s Consequences section assigns the optional-parameter trap on the ground that *"making
the parameter required would be a breaking change to merged, `Done`, 100%-covered code."* QE
measured that break: **9 test call sites and 0 production call sites** (`gameStatus` has zero
production callers anywhere in `src/`). As a reason it does not survive one grep.

**The decision is right anyway, for a stronger reason the ADR does not make:** `ADR-0002` clause 3
has `EPIC-004`'s search keep its own per-ply key array and decide repetition itself, so a search leaf
calling `gameStatus(position)` **bare is a legitimate second caller shape, not a mistake**. A
required parameter would force the hot path to construct something it deliberately does not want.
That is the argument, and it is recorded here — on the ticket that would be the site of the
reversal — because the ADR's own clauses are not this ticket's to edit. **Do not make the parameter
required in this ticket.** See the G-2 disposition note for the escalation that carries it to the ADR.

## Security / NFR triggers

- `NFR-001` (throughput) — `ABC-007`'s standing note: the engine calls this at every leaf, so
  terminal detection must be cheap and must never recompute the legal-move list. Measurable bars,
  against the audit figures on the same machine class (**Apple M3, Node v24.12.0, darwin/arm64 —
  `UNKNOWN - verify` on other hardware**):
  - `legalMoves` calls per `gameStatus` stays **exactly 1**. This is the invariant `ABC-007` was
    built to hold and R-4 verified; adding two rules must not add a generation.
  - `zobristKey` calls per `gameStatus` stays **at most 1** — fivefold and threefold read the same
    key. *(Measured at 288–306 ns per call, and it only fires when a counts map is passed.)*
  - `gameStatus` stays within **1.5x** of its measured **2.52 µs** per call.
- **The 75-move check is clock arithmetic and costs nothing** — one integer comparison on
  `position.halfmoveClock`, the same shape as the fifty-move check it joins.
- **No new state on `Position`** (`ADR-0002` clause 1), and no new dependency edge out of
  `src/gameend.ts`. It already imports `legal`, `position` and `zobrist`; it needs nothing else.
- **No security trigger.** No injection sink, no trust boundary, no privilege, no data exposure. The
  consequence is a wrong chess result. Do not inflate it, and do not deflate it either — a wrong
  chess result is what this whole ticket is about.

## Test notes

QE's reproductions are the tests. Every FEN and every move list above was run by QE against merged
`src/` and transcribed with its measured output; none needs to be re-derived.

**The existing tests that must change, named up front (acceptance A9).** All in
`src/gameend.test.ts`:

| Test | Line | What changes |
|---|---|---|
| "reports a draw by threefold repetition when a position occurs a third time" | 27 | third occurrence becomes `in-progress` + claimable; extend the same knight cycle to a **fifth** occurrence for the new automatic draw |
| "reports a draw by the fifty-move rule when the halfmove clock reaches 100" | 69 | clock 100 becomes `in-progress` + claimable |
| "does not draw at 99 plies" | 191 | still not a draw; assert it is **not** claimable either, which is the new half of the boundary |
| "draws at exactly 100 plies" | 195 | becomes `in-progress` + claimable at exactly 100 |
| "still draws above 100 plies, as a position loaded from FEN can be" | 199 | at 150 it is a **75-move** draw, not a `fifty-move` draw |

Nothing else. In particular **"prefers checkmate over the fifty-move rule when both could apply"
(line 142) does not change** — it uses a position where mate is already delivered, so the
zero-legal-moves branch decides it and always did. It is exactly the test that *looks* like it covers
G-1 and does not; leave it, and let A1/A2 cover what it misses.

Four things a naive pass would miss:

1. **Assert `in-progress` explicitly, not just "not a draw".** The wrong fix reports state (b) as
   some fourth result value. The contract is that a claimable draw is a game **in progress**.
2. **Assert the attribution (A7), not merely availability.** An implementation that ignores whose
   turn it is passes every availability assertion and reproduces the original defect.
3. **The A1 and A2 lines must be driven as move lists, not asserted from a single FEN.** The
   asymmetry — third occurrence created by the opponent's move, claim belonging to the side to move —
   only exists in a played line. A one-FEN test cannot express it.
4. **The repeated lines must never set an en-passant square.** `ABC-011` (`src/zobrist.ts:71` hashes
   the ep file whenever `epSquare` is set) would otherwise make a repetition test fail for a reason
   that is not this ticket's. `src/gameend.test.ts:27-58`'s knight cycle is the shape to reuse — the
   same instruction `ABC-012`'s test notes carry, for the same reason.

`npm run perft` is **not** the oracle for any of this and must not be quoted as one: `src/perft.ts`
imports `apply`, `legal`, `moves` and `position` and never calls `gameStatus` or `zobristKey`. That
gap is the reason QE's audit existed at all.

## Size and priority rationale

**Size `M` (3).** One 111-line module, no new module and no new dependency edge. Four rule changes
(two thresholds moved, two automatic rules added, one automatic behaviour withdrawn), a return-shape
question that is flagged rather than solved here, five existing tests rewritten and roughly eight new
ones — including a 150-ply drive. Calibrated against `ABC-007` (five terminal conditions **plus** a
new Zobrist module, `M`) and `ABC-010` (six validation rules in one existing module, `M`); it is
clearly above `ABC-011` (`S`, one guarded condition) and below `ABC-004` (`L`).

**Not `XL`, and there is no split available.** See *The coupling* — the only seam anyone would cut
along is the one that produces a game which never ends. What is genuinely separable is already
separate: the loop interaction is `ABC-021`, the panel row is `ABC-016`, the prompt verb is
`EPIC-003`, the result screen is `EPIC-006`.

**Priority `P0`, and this is the ticket the owner's directive is about.** Applying this project's
standing latent/live test would give `P1` — `gameStatus` has zero production callers, so nothing in
flight is broken today. **The directive outranks that test**, and two facts make it the right call
rather than a deferential one:

- **The deviation costs a won game on a legal position reached by legal play**, with a concrete FEN
  and a verified line. Every other correctness ticket on this board (`ABC-009`, `ABC-010`,
  `ABC-011`) needs either a semantically-invalid position that no path can produce today, or an
  error direction QE measured as safe. This one needs neither: it is a normal chess position and the
  error takes a win from the human.
- **It has a hard deadline that is close.** `ABC-019` and `ABC-016` encode today's semantics in their
  acceptance criteria; both are amended, and both are in `Backlog` behind tickets already in `Ready`.

**Not deferred behind `ABC-012`/`ABC-014`:** those are `P0` because the product does not exist
without them, which is a different `P0` from this one. Within `P0`, the pull order the directive sets
is **this ticket first**.

## Definition of Ready

Problem ✅ · scope + out-of-scope ✅ · INVEST ✅ (independent — merged `src/` only; testable
end-to-end from FENs and move lists QE has already run) · acceptance measurable ✅ (exact FENs, exact
move lists, exact thresholds at 149/150 and four/five occurrences, an exact ply bound, exact call
counts) · dependencies ✅ (none blocking; one open design question flagged and assigned; two carried
defects named) · NFR triggers ✅ (`NFR-001`, three numeric bars each with its machine) · test
notes ✅ (including the five existing tests that change, named) · size `M` ✅ · priority `P0` ✅ ·
no blocker ✅ *(the design question is a design-hop input, not a blocker — the same posture
`ABC-010` and `ABC-011` carry, and every acceptance criterion resolves identically under all three
options)*

**Promoted to `Ready` 2026-07-31 by BA/PM**, in the same step it was cut. `Ready` goes 4/8 → 6/8
with `ABC-009`; no limit approached, no override taken.
