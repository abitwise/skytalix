---
id: 20260731T181000Z-architect-design-decision-f95614ca
kind: decision
by: architect-design
at: 2026-07-31T18:10:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-020
  - ABC-020
  - ABC-012
  - ABC-016
  - ABC-019
  - ABC-021
  - EPIC-001
  - EPIC-002
  - EPIC-004
  - NFR-001
  - ADR-0002
  - ADR-0004
  - src/gameend.ts
  - src/gameend.test.ts
  - src/legal.ts
  - src/zobrist.ts
  - plans/tickets/ABC-020-claimable-draws-and-fide-96-backstops.md
  - plans/board.md
  - plans/traceability.md
  - plans/nfr-catalog.md
  - memory-bank/50-decisions/ADR-0002-game-history-ownership.md
  - memory-bank/50-decisions/ADR-0004-san-ownership.md
  - 20260731T151500Z-qe-e2e-observation-36373ca4
  - 20260731T152200Z-qe-e2e-observation-1a02d912
  - 20260731T153200Z-qe-e2e-claim-aab64fc7
  - 20260731T103332Z-architect-design-decision-d4ad8f5a
supersedes: 
---

# ABC-020's return shape settled — a two-arm union on the `result` field that already exists, claims optional on the in-progress arm. ADR-0002 clause 4 EXTENDS AROUND; no human ruling owed

Design hop of task `ticket-to-pr-ABC-020` (Workflow 04). The ticket's
`### Open design question — hand to Architect/Design at the design hop, do not decide in dev` is
answered, and the answer is written onto the ticket itself so the engineer reads it where the work
is. **No production code was written; `src/` is untouched by this hop.**

## The shape

```ts
export type GameResult = "in-progress" | "white-wins" | "black-wins" | "draw";

/** How a game ENDED. FIDE 9.2/9.3 are not here: a claimable draw has not ended anything. */
export type EndReason =
  | "checkmate"                // 5.1.1
  | "stalemate"                // 5.2.1
  | "insufficient-material"    // a subset of 5.2.2, as implemented
  | "fivefold-repetition"      // 9.6.1, automatic
  | "seventy-five-move";       // 9.6.2, automatic

/** A draw the player HAVING THE MOVE may claim. Disjoint from `EndReason`, by construction. */
export type ClaimableDraw = "threefold-repetition" | "fifty-move";  // 9.2, 9.3

export interface DrawClaims {
  /** Who may claim. Always the side to move (9.2.1, 9.3.1) — never the side that just moved. */
  readonly by: "white" | "black";
  /** Which draws that side may claim. NEVER empty; ordered threefold first, then fifty-move. */
  readonly draws: readonly ClaimableDraw[];
}

export type GameStatus =
  | {
      readonly result: "white-wins" | "black-wins" | "draw";
      readonly reason: EndReason;
      readonly claimable?: undefined;
    }
  | {
      readonly result: "in-progress";
      readonly reason: null;
      readonly claimable?: DrawClaims;
    };

export function gameStatus(
  position: Position,
  positionCounts?: ReadonlyMap<bigint, number>,
): GameStatus;
```

Naming settled, with the reason for each — these are machine-readable codes, never display copy, the
same rule `ADR-0004` clause 2a fixes for `SanRejectReason`:

- **`seventy-five-move`, not `75-move`.** The neighbour it joins is spelled `fifty-move`; two
  adjacent constants in one union that disagree about digits-versus-words is a coin flip for the
  third one.
- **`fivefold-repetition`** parallels the departing `threefold-repetition` exactly.
- **`threefold-repetition` and `fifty-move` leave `EndReason` and reappear as the whole of
  `ClaimableDraw`.** The two sets are **disjoint**, so no string is overloaded: a reader who finds
  `"fifty-move"` in a value knows it is a claim and can never be reading a completed draw. That
  property is free and it is worth having.
- **`claimable` / `DrawClaims` / `by` / `draws`.** `status.claimable.by === "white"` and
  `status.claimable.draws` read as the FIDE sentence they encode.
- **`by: "white" | "black"` is declared locally in `gameend.ts`.** `src/position.ts` exports no
  colour type — it has `BLACK = 8` (a piece bit) and `position.blackToMove` (a boolean). Inventing a
  shared `Colour` type would edit a second module for one field; a local string union edits nothing
  and adds no import.

Four rules that go with the types, each of which a test can fail:

1. **`claimable` is ABSENT when nothing is claimable** — not `null`, not `[]`, not two `false`s.
2. **Present iff `draws` is non-empty**, and `by` is required whenever present.
3. **State (b) as `result: "draw"` is a compile error**, not a test failure.
4. **One key read, shared** between the fivefold test and the threefold claim, guarded by
   `positionCounts !== undefined`.

And the ordering, unchanged at the front and extended at the back: zero-legal-moves (checkmate /
stalemate) → insufficient material → clock `>= 150` → occurrences `>= 5` → build the claim set from
occurrences `>= 3` and clock `>= 100`. The 150-clock test sits **before** the key read so a
75-move game never pays for a Zobrist key it cannot use; when both automatic rules hold at once the
reason reported is `seventy-five-move`, which is a label divergence with an identical result and is
therefore governed by G-4's standing instruction not to re-order checks to chase a label.

## A claim is a property; a CLAIMED draw is an event, and events do not belong in the rules core

`EndReason` gains no `*-claimed` member, and this is the load-bearing modelling call rather than a
naming preference. `gameStatus(position)` is a pure function of a position. *Claimable* is a property
of a position — it is decidable from the board, the clock and the counts. *Claimed* is something a
player **did**, and no producer that sees only a position could ever return it. This is precisely
QE's G-5 argument for keeping `resignation` out of `EndReason` ("adding it would make the type
describe values its sole producer cannot produce"), applied a second time, and reaching it twice
independently is the reason I trust it.

`ABC-021` therefore names its two claimed reasons in the **loop's** superset type, one-to-one with
`ClaimableDraw`, and its acceptance criterion *"the loop's terminal-reason type admits both claimed
reasons and `resignation` and the automatic reasons, **without `src/gameend.ts` being changed by this
ticket**"* is satisfied by this shape without amendment. `ABC-019`'s superset-never-alias rule is
likewise satisfied and its statement that the loop's type must not be `EndReason` verbatim gets
stronger, not weaker.

## Why the rejected options lose

**Option 2 — a second exported query, `claimableDraws(position, counts)`.** Rejected, four reasons,
the first two fatal:

- **It cannot answer its own question without a second `legalMoves` generation.** A claim exists only
  in a game that is *in progress*: a position that is checkmate has no claimable draw, and the only
  way to know that is to generate the legal moves. So `claimableDraws` either calls `legalMoves`
  itself — a second full generation on the leaf path, which is the one thing `ABC-007` was built to
  prevent and R-4 verified — or it documents "only meaningful when the status is in-progress" and
  pushes the correctness onto every caller. The second option is how G-1 happened in the first place.
- **It breaks two tickets' acceptance that are already on record.** `ABC-021`: *"the
  claim-availability value is present and was read from the **single** `gameStatusOf` call that ply
  already makes … assert the call count"*. `ABC-016` item 7: *"Read from `gameStatusOf(history)` …
  **never recomputed**"*. A separate query is a second call and a second `zobristKey` by construction.
- **It duplicates the G-2 trap into a second entry point.** `claimableDraws(position)` called bare
  would silently report no threefold claim, exactly as `gameStatus` does today. One documented trap
  with one named supplier is a managed cost; two is a pattern.
- **It is the ONE option that actually brushes `ADR-0002` clause 4**, because it creates a second
  function taking `positionCounts` and therefore a second sink for the map whose single supplier the
  clause is about. See the ruling below — this is not why it is rejected, but it is worth knowing
  that the shape most people reach for first is the shape the clause was written near.

**Option 3 as usually drawn — a discriminated result with a NEW tag**, e.g.
`{ state: "over", … } | { state: "in-progress", … }`. Rejected on two grounds:

- **It breaks A9 outright.** Every one of the 18 whole-object `toEqual` assertions outside the named
  five sees a new property and fails. A9 permits five named test edits and no more.
- **The discriminant already exists.** `result: "in-progress"` has been the discriminant since
  `ABC-007`. A second tag would mean two fields that must never disagree, which is a new invariant
  bought for nothing. `ADR-0004`'s `SanParseResult` introduced `outcome` because that type was
  **new** and had no discriminant; here one is already merged and already asserted by 20 tests. Same
  house style, different starting position — which is the intended reading of "consistency of house
  style is worth something; identical shape for its own sake is not".

**Option 1 as usually drawn — grow the `GameStatus` interface with a claims field.** This is the
closest to right and the chosen shape is its disciplined form. Rejected in its plain form because a
single interface leaves `{ result: "draw", reason: "threefold-repetition", claimable: {…} }`
compiling. The ticket calls "state (b) is NEVER reported as `result: 'draw'`" *the whole of G-1's
fix*; a fix that is merely tested for is weaker than one that is unrepresentable, and `ADR-0002`'s
own Consequences section uses exactly that standard ("becomes **unrepresentable**, not merely tested
for"). Splitting the interface into two arms on the discriminant that is already there costs one type
alias and buys the ticket's hardest constraint as a compile error.

**Also considered and rejected, briefly:**

- **Two booleans instead of a list** (`threefoldClaimable` / `fiftyMoveClaimable`). Invites the
  all-false state that the outer optionality already forbids, and `ABC-016` renders *"naming which
  one, or both when both hold"* — a list.
- **A bitmask number.** Unreadable at a public seam; this codebase keeps its bit flags inside
  `moves.ts` where they never cross a module boundary.
- **A caller-supplied out-parameter to dodge allocation.** Makes the one pure function in the module
  impure at the seam that makes it testable, and buys nothing the absent-when-empty field does not.
- **A `claimable` field on `Position`.** Forbidden outright by `ADR-0002` clause 1 and named in this
  ticket's own NFR triggers.

## The ruling on `ADR-0002` clause 4 — it EXTENDS AROUND. Reasoning, and the falsifier

Clause 4, in full: *"**`gameStatus`'s `positionCounts` gets exactly one supplier: the history
module.** No other caller constructs that map. **The signature does not change.**"*

**What the clause is about.** Two propositions, and both have `positionCounts` as their subject:
(i) exactly one supplier constructs the map; (ii) the parameter does not change. Four things fix that
reading:

1. **Both sentences of the clause name the map.** So does the ratification record, which restates
   clause 4 as *"`gameStatus`'s `positionCounts` gets exactly one supplier, and the signature does
   not change."*
2. **The ADR glosses the clause itself, in Consequences**, and the gloss is entirely about
   optionality: *"`gameStatus` keeps its optional `positionCounts` … This decision does not fix that
   trap, it assigns it: exactly one supplier, named above. **Making the parameter required** would be
   a breaking change … and this ADR deliberately does not take it."* The sentence "the signature does
   not change" is that refusal, stated in the Decision.
3. **`ADR-0002` never mentions the return value.** `GameStatus`, `GameResult` and `EndReason` appear
   nowhere in the file. There is no measurement, no alternative, no consequence and no rollback
   trigger bearing on what `gameStatus` returns. **A clause cannot have ratified a decision the ADR
   never considered**, and reading one in would attribute to a human a ruling nobody put in front of
   him.
4. **The interest the ADR is protecting is untouched.** Its whole subject is who owns game history,
   because four epics would otherwise invent four incompatible ones. What the function *returns*
   changes nothing about where the history comes from.

**The chosen shape against both propositions.** (i) `ABC-012`'s `gameStatusOf(history)` remains the
single supplier; no new caller constructs a counts map; **and no second exported function taking
`positionCounts` is added** — which is the specific thing that would have created a second sink.
(ii) `gameStatus(position, positionCounts?)` is byte-identical: same order, same optionality, same
type. Clause 3 is served in the same breath — a search leaf still calls `gameStatus(position)` bare,
and under this shape a bare leaf still gets the clock-based 9.3 claim and the 9.6.2 backstop for free,
paying no Zobrist key at all.

**The inversion that confirms the reading.** Under the literalist whole-signature reading, clause 4
forbids all three candidate mechanisms equally — a return-shape change, a second exported query, and
a discriminated result are all "the signature". A clause that blocks *every available mechanism* for
a conformance change the project owner has directed is not a clause anyone ratified; it would also
make the ticket's "resolves identically under all three options" collapse into "all three are
blocked". Under the parameter reading the clause **discriminates between them** — it is quiet about
options 1 and 3 and it speaks directly to option 2. A reading that does useful work is the one that
was meant.

**Verdict: extends around. I am proceeding, and no proposed amendment is owed.** I record the
falsifier so a later reader can overturn me in one step rather than re-deriving the whole argument:

> **If the project owner meant clause 4's second sentence as "`gameStatus`'s public interface does
> not change, in any respect", then this shape AMENDS a ratified clause and must stop.** In that case
> the correct response is a **proposed** amendment to `ADR-0002` handed to a named human, and
> `ABC-020` goes to `Blocked` until it is ruled on. Nothing in the implementation should be started
> under that reading. That is the whole of the disagreement, and it is a question about intent that
> only the ratifier can settle.

**Deliberately NOT written as an ADR, and this is a judgment a reader may check.** `ADR-0004`'s
Context set the test: two of the three seams `ADR-0002` left open were *"closed as design notes in
the task's shared context and are not ADR-shaped: one is an API that follows from a ratified clause,
the other is a 'no, and here is the trigger'"*. This is the first kind — an API that follows from a
ticket's published observable contract plus a ratified clause. Two further reasons: an ADR would
create a human-ratification gate on a `P0` ticket the owner has directly ordered (the standing
convention is that no agent may accept an ADR, and `ADR-0004`'s delegation was **explicitly not
precedent**); and reversal is cheap while it stays cheap — `gameStatus` has zero production callers
and all four consumers are unbuilt, so the cost curve `ADR-0004`'s Rollback describes has not started
climbing. **If a human disagrees and wants this as an ADR, the material is here and nothing has to be
re-derived.**

## Constraint check — the ticket's five, one at a time

**1. The three states of `## Scope`, and (b) never `result: "draw"`.** ✅ **and enforced by the
compiler.**

| State | Value |
|---|---|
| (a) over automatically | `{ result: "white-wins" \| "black-wins" \| "draw", reason: EndReason }`, `claimable` absent |
| (b) in progress, claimable | `{ result: "in-progress", reason: null, claimable: { by, draws } }`, `draws` non-empty |
| (c) in progress, nothing | `{ result: "in-progress", reason: null }` |

Exactly one arm matches any value. Verified by running `tsc` under this repo's exact flags
(`strict`, `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`) over the declarations plus a
stub with the real branch structure, with five `@ts-expect-error` negatives — a green run proves both
that the positives compile and that **every negative is a genuine error**:

```
$ npx tsc --noEmit --strict --exactOptionalPropertyTypes --noUncheckedIndexedAccess \
    --target ES2023 --module ESNext --moduleResolution bundler <scratchpad>/shape.ts
TSC GREEN — positives compile, every @ts-expect-error negative is a real error
```

The five forbidden states: `{result:"draw", reason:"threefold-repetition"}`; a terminal status
carrying a claim; an in-progress status carrying an end reason; `"fifty-move"` used as an
`EndReason`; `"checkmate"` used as a `ClaimableDraw`. **Also verified in the same run: consumers need
NO narrowing** — `status.claimable?.draws ?? []` typechecks on the bare union, which is what makes
`ABC-016`'s always-present panel cell a one-liner. That is why the terminal arm declares
`claimable?: undefined` rather than omitting the key.

**2. The claim is attributable to the side to move (A7).** ✅ `by` is a **required** field of
`DrawClaims`, so "a draw is available" cannot be expressed without naming who may take it. That is
the shape doing the work: the defect QE reproduced is a *direction* error, and a value that carries
availability without a claimant is the shape that let it happen. Driven read-only against merged
`src/`, the two attributions an implementer would most likely get wrong:

```
knight cycle x2 : occurrences=3  sideToMove=WHITE  clock=8   (gameend.test.ts:27)
knight cycle x3 : occurrences=4  sideToMove=WHITE  clock=12
knight cycle x4 : occurrences=5  sideToMove=WHITE  clock=16
fifty-move test : clock=100      sideToMove=BLACK            (gameend.test.ts:69 — White made the
                                                              move that reached 100, so the claim is
                                                              BLACK's)
A1 shuffle line : occurrences=3  sideToMove=WHITE  clock=8
                  fen=6k1/5ppp/8/b7/8/8/5PPP/4R1K1 w - - 8 5  (byte-identical to QE's G-1 FEN)
```

A7's second half — flip the side to move, the attribution flips — is expressible: flipping changes
the Zobrist key, so the test builds its counts map against the flipped position's key and asserts
`by === "black"`.

**3. `positionCounts` stays optional.** ✅ The signature is byte-identical; the parameter is still
second, still `ReadonlyMap<bigint, number>`, still `?`. **A8 holds in both halves**: a bare caller
reads `occurrences = 0`, so neither the 9.6.1 fivefold draw nor the 9.2 threefold claim is reported
(the documented consequence, now pinned by a test); and on the A5 locked wall the same bare caller
still terminates at 150 plies, because 9.6.2 is clock arithmetic and needs no map. **A bare caller
can therefore never produce a non-terminating game.** `ADR-0002` clause 3's search leaf is served
exactly as ratified.

**4. The three `NFR-001` bars.** ✅ by construction; the third is `UNKNOWN - verify` until measured.

- **`legalMoves` calls per `gameStatus` = exactly 1.** The first line is untouched and nothing added
  needs a move list. This is the bar that killed option 2, which cannot decide "is the game over"
  without a second generation.
- **`zobristKey` calls per `gameStatus` ≤ 1.** One read into one local, shared by the `>= 5` test and
  the `>= 3` claim, guarded so a bare caller pays **zero**. Two separate reads is the easy wrong
  implementation and it is invisible to every value assertion, so **A10's harness must spy the call
  count, not infer it.**
- **Within 1.5x of 2.52 µs (≤ 3.78 µs).** The added work is four integer comparisons (150, 5, 3, 100)
  against a baseline dominated by `legalMoves`. **No figure is asserted here — I ran no benchmark and
  invented no number. `UNKNOWN - verify` until A10 measures it on the machine named in the ticket
  (Apple M3, Node v24.12.0, darwin/arm64), and `UNKNOWN - verify` on any other hardware.**
- **No per-call allocation.** State (c) — the common case at a leaf and at most plies — allocates
  exactly what it allocates today: one status object. Only a genuinely claimable position allocates
  the `DrawClaims` and its array. **Permitted and recommended if A10's measurement ever wants it:**
  return one of six module-level frozen values (2 sides × 3 non-empty combinations). The contract is
  value-semantics — deeply `readonly`, **reference identity is NOT part of it and must never be
  asserted** — so a shared instance is a legal implementation, not a bug. Stated so nobody "fixes" it
  either way by reflex.

**5. No new state on `Position`, no new dependency edge out of `src/gameend.ts`.** ✅ `DrawClaims`,
`ClaimableDraw` and the `"white" | "black"` union are declared in `gameend.ts` over primitives; `by`
is derived from `position.blackToMove`, already reachable through the `Position` type the module
imports. **The import list is byte-for-byte the merged one** — `./legal.ts`, `./position.ts`,
`./zobrist.ts`. Same check `ADR-0004`'s ratification ran for `SanParseResult`, same result.

## The A9 finding, stated loudly because the ticket says the opposite

The ticket's Definition of Ready and its open-question section both say every criterion *"resolves
identically under all three options"*. **Two do not, and I am flagging rather than editing them —
both criteria are correct as written and neither needs to change.**

**A9 is a hard shape constraint.** `src/gameend.test.ts` compares a whole status object with
`toEqual` in **18 assertions outside the five named**. Measured on this repo's own vitest 3.2.7 (a
scratchpad suite, five cases, all green):

| Extra property on the received object | `toEqual({result, reason})` |
|---|---|
| absent | **passes** |
| explicitly `undefined` | **passes** |
| `null` | **FAILS** |
| `[]` | **FAILS** |
| any defined value | **FAILS** |

So: a **required** claims field, an **empty-array or null sentinel**, or a **new discriminant tag**
each breaks 18 tests A9 forbids touching. Absent-when-empty is the only form that survives — which is
why rule 1 of the shape is a rule and not a preference. **A7 is shape-sensitive in the same way**: it
demands the attribution be asserted on the value, which forces `by` to be required.

Two consequences worth carrying forward:

- **The 18 untouched assertions get stronger for free.** Because a *defined* extra property fails
  `toEqual`, each of them now also asserts "nothing is claimable in this position" — at no cost and
  with no edit. That is 18 free guards against the most likely regression (a claim leaking into a
  position that has none).
- **The claim of shape-independence was wrong, and it was wrong in a useful direction.** A9 and A7
  between them selected the shape. A criterion that constrains design is doing its job; the only
  error was calling it shape-neutral.

## The five named tests, confirmed expressible

All five, with the exact expected values, are written into the ticket's `## Test notes` as a table so
the engineer has them at the point of work. Nothing in the five needs a criterion changed, and **no
sixth test is forced to move** — which is the whole of A9, and it holds because and only because
`claimable` is absent rather than empty. The one that deserves a second read is `line 69`: the
claimant is **Black**, because White made the move that ticked the clock to 100. It is also a bare
call, so it doubles as a miniature of A8's clock-based half.

Two things I did **not** do: I did not write the tests (TDD is the Software Engineer's, and the
ticket says so), and I did not touch `line 142` — the test that looks like it covers G-1 and does
not. It stays exactly as merged.

## Board, ticket, trace, catalog

- **`ABC-020`: `Ready` → `In Design` → `Ready for Dev`**, both moves on this hop; I own the
  `In Design` exit. `Ready` 6/8 → 5/8, `In Design` 0/2 → 1/2 → 0/2, `Ready for Dev` 0/6 → 1/6. No
  limit approached, no override taken, no written reason owed. **`In Development` is deliberately
  NOT entered — that pull is the Orchestrator's.** First entry to and first exit from `In Design` in
  this project's history.
- **The ticket carries the answer**, in a dated `### ANSWERED` block under its own open question,
  plus the expected-value table in `## Test notes`. **No acceptance criterion was edited** — the
  correction to the shape-independence claim is recorded as a correction beside it, not as a rewrite
  of A9 or A7.
- **`plans/traceability.md`**: `ABC-020`'s row updated in place — the clause-4 ruling, the shape, the
  A9 finding, Status → `Ready for Dev`.
- **`plans/nfr-catalog.md`**: `NFR-001`'s row gains its **second consumer**. The row applies to the
  generator and is verified by `npm run perft`, and perft *never calls `gameStatus`* — which is the
  gap QE's audit existed to cover. The three `ABC-020` bars are named there with their owner and
  their `UNKNOWN - verify` status. No target moved and no figure was invented.

## Provenance of this note

Written directly into `notes/` in the schema's exact shape. **This install has no
`scripts/context-io.ts` and no `mcp__grugops__propose_note` tool**, so the sanctioned writer named by
Workflow 16 does not exist here; QE recorded the same degradation on 2026-07-31 and every note in
this project was recorded the same way. This is a `decision` — a soft kind with an empty
`verified_by` — so no admission stamp was required and none was bypassed. **Nothing here is
self-stamped and no `finding` was recorded or attempted**: there is no §14 gate in this task to stamp
one.

The two verification runs above were executed in the session scratchpad **outside the repo**,
importing merged `src/` read-only by absolute path (the same posture QE's four harnesses used).
Nothing in `src/` was written, and the harnesses are throwaway — every result that matters is
transcribed here with its command.

## Confidence

**High** on the shape, on the constraint check and on the A9 finding: the type behaviour and the
`toEqual` behaviour were **run**, not reasoned, on this repo's own toolchain, and the side-to-move
attributions were driven against merged `src/`. **High** on the clause-4 ruling as a reading of the
text — the four grounds are quotations from `ADR-0002` itself — but it is a reading of intent, and I
have written the falsifier above so a human can overturn it in one sentence rather than an argument.
**No performance figure is claimed at any confidence**: I ran no benchmark, the 1.5x bar is
`UNKNOWN - verify` until A10 measures it, and the ticket's 2.52 µs baseline stays attributed to the
machine it was measured on.
