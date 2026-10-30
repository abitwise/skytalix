---
kind: adr
id: ADR-0020
---
# ADR-0020: The en-passant component keys on the ep square being SET, and the incremental key rides the search's per-ply array, not the `Position`

## Status

> **Amended 2026-10-30: decision 2's threefold consequence (`EPIC-010` Q3 (c)). ACCEPTED on the owner's word**, "Q3: c"
> (Orchestrator note `.grugops/context/orch-2026-10-29g/notes/20261030T044400Z-orchestrator-decision-c4ab73de.md`, a
> transcription, not a stamp). Text by Architect/Design (task `arch-q3c-oq228ii`). In force on `main` at the merge of
> the ticket BA/PM cuts for it, which is built after `ABC-230` merges. See § AMENDMENT 2026-10-30 at the end.
> Decisions 1 and 3 and the hash do not change. Nothing above that section is edited except this block and one line
> under decision 2.

**accepted** — 2026-09-19 by Architect/Design at task `owner-rulings-2026-09-19`, subtask
`ruling-abc075-ep-square`, under the owner's standing directive of 2026-08-03 ("who decides",
`memory-bank/60-progress.md`) that sends architecture decisions and ADR ratification to this role.

**Supersedes `ADR-0005` Decision clause 1 ONLY** — *"available" means a LEGAL en-passant capture
exists for the side to move* — and, with it, the mechanism clauses 2–6 that exist solely to compute
that predicate inside the hash. `ADR-0005`'s falsifier table, its measurements and its domain
analysis stay on record as history; its `F6` is answered below. **`ADR-0006` (castling RIGHTS, not
availability) is NOT re-opened** and is inherited unchanged. **`ADR-0002` clauses 1–4 are NOT
re-opened**; clause 3 is built on, not amended.

Two rulings live here, and they have different authors:

1. **What the ep component keys on** — the **owner's**, taken in session 2026-09-19 and transcribed
   verbatim in `.grugops/context/owner-rulings-2026-09-19/notes/20260919T100000Z-orchestrator-decision-six-owner-rulings-verbatim-3c9e1f42.md`.
2. **How the key is threaded through the search** — **Architect/Design's**. The owner did not rule
   it and it was never his; `ADR-0005 F6` and the 2026-08-12 architecture audit both name it as
   the decision that must be *made explicitly rather than discovered*.

**No code changes because of this ADR.** Zero files under `src/` moved at this hop. `ABC-075`
builds against the seam named in Decision 3; until it lands, `src/zobrist.ts` still conforms to
`ADR-0005` clause for clause, and this ADR is a ruling the code has not yet caught up with — the
same shape as `ADR-0002` clause 2 ahead of `src/history.ts`.

## Context

`ABC-075` (incremental Zobrist key, `P0`, blocks `ABC-081` the transposition table) has been
`Blocked` since it was cut on 2026-08-16, on one fact: under `ADR-0005` the en-passant component
enters the key **only when a LEGAL ep capture exists**, and *whether a legal ep capture exists in
the resulting position is not a local function of the move just played* — deciding it plays a
probe move through `legal.ts → apply.ts`. So piece, castling and side-to-move components XOR-update
cleanly and the ep component does not. The audit's verdict: *"it is the one place the current
shape does not simply extend."*

The Orchestrator put the question to the owner on 2026-09-19 with exactly two options — keep the
legal-ep reading or *relax to "ep square set"* — and the owner answered:

> "relax to "ep swuare set""
> — Olger Oeselg, project owner, in session, 2026-09-19 (`swuare` is a typo for `square`; the
> Orchestrator's question offered the phrase *"ep square set"* verbatim)

**What `src/apply.ts` actually does with the ep square, read at this hop, because it decides
whether "ep square set" is cheap to detect.** `makeMove` sets `position.epSquare` on **every pawn
double push, unconditionally** — `isPawn && Math.abs(move.to - move.from) === DOUBLE_PUSH ?
(move.from + move.to) / 2 : NO_SQUARE` — and clears it on every other move. It does **not** look for
an adjacent enemy pawn (the Stockfish-style normalisation). `unmakeMove` restores it from
`undo.epSquare`. Therefore "ep square set" **is** a local function of the move just played: one
piece-type test and one subtraction, both already executed by `makeMove`. That is what makes the
ep component a plain XOR delta under the ruling, and it is the whole reason the ruling unblocks
`ABC-075` rather than merely relabelling the problem. `ADR-0005` recorded this same rule when it
rejected *"Normalize `epSquare` upstream"* on the FEN round-trip ground; nothing has changed there.

## Decision

**1. The en-passant component enters the key if and only if `position.epSquare !== NO_SQUARE`.**
The owner's ruling. The component is `EP_FILE[fileOf(position.epSquare)]`, as today; the
`hasLegalEnPassant(position)` conjunct is removed from the hash's definition. `zobristKey` becomes
what `src/zobrist.ts` was before `ABC-011`, on this one component, and a **pure read of the board
again** — no probe move, no transient mutation, no `legal.ts` edge.

**2. The consequence, stated so it is never under-read.** Two positions that differ **only** in an ep
square nobody can capture on now hash **differently**. Over the `src/perft.test.ts` table `ADR-0005`
measured 862 such double pushes out of 19,667 (4.4%); `src/zobrist.test.ts:158` measured 505 of 557
within 2 plies. On each consumer:

- **Transposition table (`ABC-081`).** A **TT miss, never a wrong answer.** The key never collides
  two positions with different legal moves (Decision 1 is strictly *finer* than FIDE 9.2.3, never
  coarser), so a TT hit is still a hit on a position with the same move set; a spurious miss
  re-searches a subtree it could have reused. That is the direction every engine that keys on the
  stored ep file already lives with, and it costs nodes, not correctness.
- **Threefold repetition (`src/history.ts`, `gameStatus`'s `positionCounts`).** A recurrence of a
  position whose first occurrence carried an uncapturable ep square is counted **one occurrence
  late**, so a draw is **deferred, never falsely declared**. Same monotonicity: finer key, fewer
  equalities, never a false equality. `ABC-011`'s headline reproduction — the `1.e4` pair — **goes
  back to hashing differently.** This is the deliberate trade the owner made, and it is recorded
  here rather than smoothed over.
  *(2026-10-30, owner "Q3: c" (`…c4ab73de`): from the Q3 (c) ticket's merge, this bullet no longer holds for
  comparisons against the game's history. The hash and the TT bullet above do not change. See § AMENDMENT 2026-10-30.)*

**Why this is the standard, safe direction.** The classic Zobrist scheme hashes the ep file the
position *carries*; that is the simplest thing that is never wrong, because every refinement
(pseudo-legal, legal) only merges keys and any merge that is wrong produces a *false* equality — the
dangerous direction, and the one `ADR-0005` chose to make FIDE-exact at the price of a probe move
per ep node. The ruling trades exactness on ~4% of ep-setting nodes for a key that is a pure
function of `Position`'s fields and XOR-updates in O(1). Should anyone later want the FIDE-exact
equalities back, the cheap and correct place is **upstream normalisation** (set `epSquare` only when
a capturer is adjacent, as `ADR-0005`'s fourth alternative described) — that keeps Decision 1 and
Decision 3 exactly as written, because the key still reads the field. It is not taken now: the
owner said *relax*, and it re-opens the FEN round-trip cost `ADR-0005` measured.

**What `ADR-0005 F6` becomes.** `F6` said the whole ADR falls if *"`EPIC-004` chooses a parallel or
frozen-position search shape that needs a hash which never writes to the board"*. Decision 1
delivers a hash that never writes to the board **by a different route** — not because a parallel
shape was chosen (none is; the search is single-threaded and stays so, `UNKNOWN - verify` for any
future engine ticket) but because the owner removed the predicate that wrote. `F6` is therefore
**discharged, not tripped**: the condition it guarded against can no longer arise, and the
falsifier is retired with the clause it belonged to.

**3. Threading: the key rides the search's per-ply array. `Position` gains no field; `makeMove`
and `unmakeMove` are not touched.** This is Architect/Design's ruling, and it is `ADR-0002` clause
3 taken literally: *"`EPIC-004` keeps its own preallocated array of Zobrist keys indexed by ply,
seeded once per search … Zero allocation per node."* The mechanism:

- `keys[0] = zobristKey(root)` — the full scan survives as the **seed** and the **oracle**.
- After `const undo = makeMove(position, move)` the search computes
  `keys[ply + 1] = zobristKeyAfterMove(keys[ply], position, move, undo)`.
- **`unmakeMove` needs no key work at all.** The pre-move key is still sitting in `keys[ply]`. The
  "unmake restores exactly" property (`ABC-075 A2`) is an array index, not a second XOR pass.

**The seam `ABC-075` implements against** (in `src/zobrist.ts`, beside `zobristKey`; the name is
mine, the internals are the engineer's):

```ts
/**
 * The key of `position` AFTER `makeMove(position, move)` returned `undo`, derived from the key it
 * had BEFORE. Pure; reads `position` and writes nothing. Invariant, asserted against the oracle:
 *   zobristKeyAfterMove(zobristKey(before), after, move, undo) === zobristKey(after)
 */
export function zobristKeyAfterMove(
  keyBefore: bigint,
  position: Position, // the position AFTER makeMove
  move: Move,
  undo: UndoRecord, // what makeMove returned — captured, castling, epSquare, halfmoveClock before
): bigint;
```

Every input the delta needs is already in hand at the call site with no new state anywhere: the
mover, `from`, `to`, flags and promotion piece from `move`; the captured piece and the *before*
castling and ep values from `undo`; the *after* castling and ep values from `position`; the side
flip is unconditional. The components the delta touches, named so `A3`/`A4` are written against a
list rather than discovered: piece `from`→`to` (promotion: the promoted piece lands, the pawn
leaves), the captured piece (on `to`, or on the ep capture square under `FLAG_EN_PASSANT`), the
rook's leg under `FLAG_CASTLE`, each castling flag in `undo.castling ^ position.castling`, the ep
file out if `undo.epSquare` was set and in if `position.epSquare` is set, and `BLACK_TO_MOVE`
always. `UndoRecord` is a **type-only** import from `src/apply.ts`; with the `legal.ts` import
gone, `src/zobrist.ts` sits at `{position, moves} ← apply ← zobrist`, acyclic, and
`src/gameend.ts` drops back one level. Verified by reading the import lines of `apply.ts`,
`moves.ts` and `position.ts` at this hop: none imports `zobrist.ts`.

**How equivalence with the oracle is asserted** (`ABC-075 A1`/`A2`, the shape, not the code): walk
every position in `src/perft.test.ts` to depth 4; at each node, after `makeMove`, compute
`k = zobristKeyAfterMove(keys[ply], position, move, undo)`, assert `k === zobristKey(position)`,
recurse with `keys[ply + 1] = k`, and after `unmakeMove` assert `zobristKey(position) === keys[ply]`.
Count nodes and mismatches; the criterion is **0 mismatches, 0 drift, node count > 0**. The oracle
must be the **post-ruling** `zobristKey` (Decision 1) — asserting the delta against a pre-ruling
oracle would fail on exactly the 4.4% of ep-setting nodes the ruling changed, and that failure would
be the ruling working, not the delta broken.

**Who owns what.** `ABC-075` delivers `zobristKeyAfterMove`, the Decision 1 change to `zobristKey`,
and the oracle walk. **`ABC-081` delivers the array** — the seeding, the per-ply indexing, and the
two consumers (TT probe and backward repetition scan) — because `ADR-0002` clause 3 gives the array
to the search and `ABC-081`'s `A6` already asserts *"the key array is the search's own."*
`ABC-075` does not touch `src/search.ts`; that is the fence its own Security/NFR threshold names.

## Alternatives

**Key carried on the mutable `Position` (`position.key`, maintained inside `makeMove`/`unmakeMove`).**
The shape most engines use, and rejected here on three grounds that are this project's, not
taste. (i) It breaks `ADR-0002` clause 1 as ratified — *"No new state is added to `Position`"* —
and grows `UndoRecord` by a field. (ii) `makeMove` is the legality filter's inner loop: `ADR-0003`
measured 3.3 `makeMove` calls per node under lazy legality and 40.9 under the eager filter. A key
update paid inside every one of them is paid ~3x per node where nobody reads it, whereas the
per-ply array pays exactly once per node, in the search, where it is read. (iii) It moves the change
from a leaf module (`zobrist.ts`) into the hottest path in the engine (`apply.ts`, `NFR-001`), which
widens `ABC-075`'s blast radius from one file to the file every ticket depends on.

**Both — incremental on `makeMove`/`unmakeMove` with the search reading it off the position.**
Rejected as a strict superset of the above: it has every cost of the position-carried key and adds a
second representation of the same truth (the array and the field), which `ADR-0002` already names
as the place a bug will live.

**Two functions, `zobristKeyAfterMove` and `zobristKeyAfterUnmake`.** Rejected: the array already
holds the pre-move key, so an unmake function would compute what is one index away. It also
doubles the surface `A2` has to prove.

**Pass the four `UndoRecord` scalars instead of the record, to avoid the `apply.ts` type import.**
Rejected as an abstraction for its own sake: a type-only import costs nothing at runtime, creates no
cycle, and the caller has the record in hand. If a future graph rule forbids even type edges
upward, the change is one signature and one call site.

**Keep `ADR-0005` and build the ep component non-incrementally** (XOR the ep component on top of
the delta by calling `hasLegalEnPassant` at ep-set nodes only). This was the design `ABC-075`
would have had to invent without a ruling. Foreclosed by the owner's word, and correctly: it keeps
the probe move, the transient mutation and the `legal.ts` edge on the per-node path — precisely the
shape the audit said does not extend.

## Consequences

**`src/zobrist.ts`** (built by `ABC-075`): drops `import { hasLegalEnPassant } from "./legal.ts"`;
gains `import type { UndoRecord } from "./apply.ts"` and `import type { Move } from "./moves.ts"`;
`zobristKey`'s ep clause becomes the bare `epSquare !== NO_SQUARE` test; the module doc's second
paragraph (the `ADR-0005` explanation) is rewritten to cite this ADR.

**`hasLegalEnPassant` becomes an exported function with no production caller.** `ABC-075`'s `A6`
holds `src/legal.ts` byte-identical (`ADR-0003` clause 1), so it stays. Its own tests in
`src/legal.test.ts` keep it honest; `src/zobrist.nfr.test.ts`'s call-count spies on it lose their
subject (see below). Deleting it is a later, separate, one-line ticket if anyone wants it — not
`ABC-075`'s.

**Tests that go RED on purpose, and what happens to them.** Read at this hop from
`src/zobrist.test.ts` and `src/zobrist.nfr.test.ts`; `ABC-075`'s `A6` said both files *"pass
unchanged"*, and under this ruling that is **false as written** — the ticket page carries the
amendment. Naming them here so the engineer re-points rather than rediscovers:

- `zobrist.test.ts:49` *"ignores an ep square no capture can use — the ABC-011 defect pair"* and
  `:73` *"ignores an ep square whose only capture is illegal"* — both assert an equality Decision 1
  reverses. They flip to `not.toBe` and become **the `A3` cases for the "ep set, no legal capture"
  class**, drawn from `ADR-0005`'s own examples exactly as `A3` asks.
- `zobrist.test.ts:158` *"the ep component tracks availability, not the ep field"* — its oracle is
  `legalMoves(...).some(FLAG_EN_PASSANT)`; the oracle becomes `epSquare !== NO_SQUARE`. The
  property's shape (checked > 0, answered > 0, checked − answered > 0) is worth keeping with the
  new oracle.
- `zobrist.test.ts:221`/`:276`/`:308` (purity, board-contradicts-ep) — **stay green and stay**: a
  hash that reads the board is trivially pure. They are now regression guards against anyone
  re-introducing a probe.
- `zobrist.nfr.test.ts:51–79` — the *"zero `hasLegalEnPassant` calls on a no-ep position"* and
  *"exactly once when set"* spies. The first becomes vacuous, the second goes red (0 calls, not 1).
  `NFR-005`'s no-ep-path guarantee is now *structural* (there is no predicate to call). Retire the
  spy rows and keep the per-call cost rows; the catalog's `NFR-005` target does not move.
- `zobrist.test.ts:43`, `:61`, `:199–218` — assert inequalities that remain true. Unchanged.

**`NFR-005` / `NFR-001`.** No target moves. `plans/nfr-catalog.md` was **not opened for writing** at
this hop: the impact is that `zobristKey` gets strictly cheaper on the 15.70% of nodes carrying an
ep square (the probe path is gone) and unchanged elsewhere, and that the per-node key `ABC-075`
measures against the 295–304 ns baseline is now a handful of XORs — the ≥ 5x bar in `A5` stands
and should be comfortably met. If `A5` comes in under 5x the instrument is wrong, not the design.

**`memory-bank/30-architecture.md`** owes two edits **when `ABC-075` lands**, not now: the Key
components row 5 (*"asks `legal.ts` whether an en-passant capture is real (ADR-0005), so it is not
a leaf"*) and the transient-mutation paragraph at line ~91 that names `zobristKey` as the pattern's
worst offender. `ABC-075`'s hop carries them; recorded here so they are not missed.

**`ABC-011`'s work is not undone, it is re-scoped.** The purity precondition (`ADR-0005` clause 6),
the `hasLegalEnPassant` predicate and its tests all still stand in `src/legal.ts`; what leaves is
the hash's *use* of them. The 862 FIDE misses `ADR-0005` measured come back, in the safe direction
(Decision 2).

## Rollback

**To `ADR-0005`'s reading:** re-add the `hasLegalEnPassant` conjunct in `zobristKey` and delete
`zobristKeyAfterMove` — but then the incremental key is impossible again for the reason recorded in
Context, so a rollback of Decision 1 is a rollback of `ABC-075` and re-blocks `ABC-081`. That is the
honest price and it is why the owner was asked rather than the Architect deciding alone.

**To the position-carried key (Decision 3 only):** `zobristKeyAfterMove` is the delta either way; a
`position.key` field would call the same function inside `makeMove`. The rollback is moving one
call site and adding one field, and it gets dearer only once `ABC-081`'s array and its two
consumers exist. Re-opening it would require amending `ADR-0002` clause 1 first.

**Reconsider triggers.** (a) A measured need for FIDE-exact repetition equality in play — the
remedy is upstream normalisation in `apply.ts` plus a FEN round-trip decision, not a change to this
key. (b) `ABC-075 A5` measuring under 5x on the delta — which would mean the delta is doing more
than XORs and should be read as a bug. (c) A parallel search — the array is per-search and copies
trivially per thread; the hash no longer writes; nothing here forecloses it.

## What would falsify this — the ratification's own terms

| # | clause | what would falsify it | how to check |
|---|---|---|---|
| **F1** | 1 — keys on `epSquare` set | the owner withdrawing the 2026-09-19 word, or a consumer found where a *finer* key produces a **false** equality (it cannot by construction; if observed, the delta is wrong, not the reading) | the verbatim note; `ABC-075 A1` walk |
| **F2** | 2 — TT miss / deferred draw, never wrong | any position pair with different legal move sets and equal keys under Decision 1 | perft-table walk comparing `legalMoves` sets on key-equal pairs |
| **F3** | Context — `apply.ts` sets ep on every double push | `src/apply.ts`'s `epSquare` assignment gaining an adjacency test | `grep -n "DOUBLE_PUSH" src/apply.ts` |
| **F4** | 3 — per-ply array, no `Position` field | `Position` gaining a key field, or `makeMove` computing a key | `grep -n "key" src/position.ts src/apply.ts` after `ABC-075`/`ABC-081` |
| **F5** | 3 — seam signature sufficient | a component of the delta that needs an input outside `(keyBefore, position-after, move, undo)` — none was found on the six components listed | `ABC-075 A1` at 0 mismatches is the proof; a mismatch class that cannot be closed from those four inputs is the falsifier |
| **F6** | graph — acyclic, `zobrist` below `legal` | any `from "./zobrist.ts"` in `apply.ts`, `moves.ts` or `position.ts` | rebuild the import graph from `src/*.ts` |

## AMENDMENT 2026-10-30 — comparisons against the game's history remove an uncapturable ep file (`EPIC-010` Q3 (c)); the hash does not change

### Status of this section

**ACCEPTED 2026-10-30 on the owner's word.** His answer, verbatim: *"Q3: c"*. He was asked in session to choose
between *"(a) keep, (b) ep-legal key, (c) normalise only when comparing against the game's earlier positions"*
(Orchestrator note `.grugops/context/orch-2026-10-29g/notes/20261030T044400Z-orchestrator-decision-c4ab73de.md`, a
transcription, not a stamp). The options and their costs are in Architect/Design's Q3 table
(`arch-ABC-230-reading/…90a3aa31` § 3). That table recommended (a), and named (c) as the remedy if FIDE-exact
repetition was wanted. The text below is by Architect/Design (task `arch-q3c-oq228ii`, records only, at `main`
`c0698ddd`).

- **What it amends:** decision 2's threefold bullet ("counted one occurrence late"), for comparisons against the
  game's history only.
- **What it does not amend:**
  - decision 1 (the hash keys on `epSquare` set);
  - decision 3 (the per-ply array);
  - decision 2's TT bullet;
  - `F1`–`F6`.

  `zobristKey` and `zobristKeyAfterMove` return what they return today. The table, the book and every node pin are
  untouched.
- **In force on `main`** at the merge of its own ticket, which BA/PM cuts. It is built **after `ABC-230` merges**,
  because half of it edits the prior-key builders that `ABC-230` (`ADR-0054`) creates. `ABC-230` is not re-scoped.
- **Size S. Value-changing.** The merge rule's smoke pair applies: 10 D games and 10 R games, S-1 to S-4
  (`EPIC-010` § The merge rule).

### Context

- Under decision 1, a position reached by a double push carries an ep square whether or not a pawn can capture on it.
  Its later recurrences carry none. So its first occurrence's key differs from its second's and third's, and the
  threefold is counted one occurrence late (decision 2). cutechess counts it on time.
- SA `sa-ABC-226/…cc53fc79` `A6`: 22 of 1 718 repetitions (all D, 0 R), about 0.5 % of 4 199 games.
- **The fact that keeps the remedy small** (`F3` below, and `src/apply.ts`): a double push resets the halfmove clock,
  and every other move clears the ep square. So in a reversible window (the positions since the clock last reset)
  only the oldest position can carry an ep square. A position before a clock reset can never equal one after it.

### Decision

**C1. The repetition key.** Every comparison of a position against the game's earlier positions uses the *repetition
key*:

- if `position.epSquare` is set and no legal en-passant capture exists (`hasLegalEnPassant(position)` is false,
  `src/legal.ts:182`): `zobristKey(position)` with the ep file XORed out;
- otherwise: `zobristKey(position)`, unchanged.

By the fact above, this changes at most the oldest key of each reversible window. So applying it to every position is
the same as applying it to "the oldest key of the window". The per-position form is the one built: it needs no index
arithmetic, and it is the same rule on every surface.

- A **legal** capture keeps the ep file in (FIDE 9.2.3's test), so two positions with different move sets never get
  equal keys.
- A capture that is pseudo-legal but illegal (a pinned capturer, or the rank pin that the capture would uncover) takes
  the file out. FIDE counts those positions as the same.

**C2. One helper, in `src/gameend.ts`.** One pure function computes the repetition key from a position and its
Zobrist key. Its name and exact signature are the Software Engineer's. That there is exactly one is not.

- **Why `gameend.ts`:**
  - it already holds FIDE 9.2's repetition rule (`gameStatus` reads `positionCounts`);
  - it already imports `legal.ts` and `zobrist.ts`;
  - `history.ts` and `engine.ts` (`leafEndReason`) already import it.

  No module gains an import of `legal.ts`, so the `history.ts` header's "does not import `legal.ts`" stays true.
- **`src/zobrist.ts` gains one export:** a pure read of the ep file's key component. Today `EP_FILE` is private. No
  import edge changes, and `F6` holds: `zobrist.ts` stays below `legal.ts`.
- **Rejected homes:**
  - `zobrist.ts` itself: it would import `legal.ts` again, which decision 1 removed.
  - `legal.ts`: it adds a `legal.ts` → `zobrist.ts` edge and a `history.ts` → `legal.ts` edge, in a file that `ABC-229`
    and `ABC-235` edit.
  - A new module: one more file and one more import on every consumer, for no gain.
- **Cost.** `hasLegalEnPassant` runs once per position with an ep square set, when a key list is built. That is once
  per double push in the game, per derive, and never per search node.

**C3. Where it is used. Both halves land together** (Q3 table: "(c) without the game-end half" is inconsistent).

- **The CLI's game-end count** (`src/history.ts`; the licensed callers are unchanged):
  - **`keyHistory` stays the hash list** and keeps its meaning. Its doc names it as the TT and book seam.
  - `history.ts` gains one function, the repetition-key list: the same replay with C2's helper applied. Its name is
    the Software Engineer's.
  - `repetitionCounts` counts that list. It stays the **one supplier** of `positionCounts` (`ADR-0002` clause 4).
  - `gameStatus` looks up the live position through the same helper (`src/gameend.ts:155`), so the lookup and the
    counts agree. The lookup runs only when a counts map is passed, so a bare caller pays nothing.
  - `src/turn-loop.ts` `claimShortfall` (the "repetition n of 3" line after a refused claim) counts the repetition-key
    list too. Otherwise the line and the claim would disagree.
- **The search's prior keys** (`ADR-0054` decision 2):
  - **CLI:** `cli.ts` injects the repetition-key list into the level seam, where `ABC-230` injects `keyHistory`.
  - **UCI:** `parsePosition`'s replay passes each key through the helper as it keeps it.
  - **Blunder path:** the root key it appends for its child searches is a repetition key too.
  - **The rule: every key in `priorKeys` is a repetition key.** The trim helper, the scan and its two counts
    (`ADR-0054` decisions 1 and 3) are unchanged.
- **Not used by:** the search's own per-ply array, the TT, the book, perft, or any `zobristKey` call inside the
  search. A node's key, and the path scan against it, stay raw.

**C4. What stays one late (recorded, not fixed).** Both cases defer a draw and never declare a false one, which is
decision 2's safe direction.

- **In-tree:** a double push inside the search, then a return to that position. Those nodes are compared raw on the
  path (Q3 table: "in-tree only stays one late").
- **A root that carries an uncapturable ep square.** Its clock is 0, so it has no prior keys, and it sits raw in
  `keys[0]`. A search node that returns to the root's board is compared raw against it. From the next move's search
  on, that position is a prior key and is normalised.

### Alternatives

- **(a) Keep decision 2.** Not taken: the owner chose (c).
- **(b) The ep-legal key in the hash** (the ep file only with an adjacent capturer). Not taken. It reverses the
  owner's 2026-09-19 ruling, re-keys 685 or more book entries and moves node pins, to buy what (c) buys.
- **Upstream normalisation in `apply.ts`** (this ADR's reconsider trigger (a)). Not taken: it changes the FEN
  round-trip and every key. (c) changes neither.
- **Normalise inside `keyHistory`.** Rejected. It gives the hash list a second meaning under the hash's name, and the
  next caller that reads it as a hash (book, TT) would be wrong in the rare ep case.
- **Only the prior-key half, or only the game-end half.** Rejected. Either alone makes the CLI's search and its
  game-end count disagree about one position.

### Consequences

- **Files the ticket touches**, a few lines each:
  - `src/gameend.ts` (the helper and the lookup);
  - `src/zobrist.ts` (one export);
  - `src/history.ts` (one function, and `repetitionCounts`);
  - `src/turn-loop.ts` (`claimShortfall`);
  - `src/cli.ts` (the injection);
  - `src/uci-session.ts` (the replay);
  - the module that appends the blunder path's root key, as `ABC-230` builds it (`UNKNOWN - verify` which one).

  **Not touched:** `src/apply.ts`, `src/legal.ts`, `src/search.ts`, `src/transposition.ts`, `src/quiescence.ts`,
  `src/book*.ts` and `data/`.
- **The licence surface (`ADR-0011` clause 3, `ADR-0002` clause 4, `ADR-0044` D2):**
  - **`LICENSED_DRIVERS` stays `["turn-loop.ts", "cli.ts"]`** (`src/history-pane.nfr.test.ts:274`). No module gains a
    runtime import of `history.ts`. The two licensed drivers call one more `history.ts` function, and nothing else
    does. `history.ts`'s own import list does not change.
  - **Clause 3 (ii), the single supplier, holds.** `repetitionCounts` is still the only builder of a `positionCounts`
    map. `claimShortfall` counts one key and builds no map, as today. The prior-key list is not a counts map.
  - **`src/uci-session.ts` gains an import of `gameend.ts`.** That adds one module to `ADR-0044` D2's allowed list, and
    D2 carries a dated line for it. D2's fence is unchanged: no `history.ts`, `turn-loop.ts`, `book-engine.ts`,
    `level-seam.ts` or `book-file.ts`. `src/uci-session.test.ts` `A11-g1`'s deny list still holds. `gameend.ts` has no
    capabilities, and `engine.ts` already imports it.
  - **`ABC-081` `A6` holds:** no search module imports `history.ts`, and the engine is still handed its keys.
- **Values:**
  - **Unchanged:**
    - the hash, the TT, the book (`book.json` is not rebuilt) and perft;
    - every search with no prior keys: a bare FEN, the benchmarks, the `ABC-078` `A3` corpus and `G6`'s boards;
    - every search whose prior keys hold no uncapturable-ep position.
  - **Changed:**
    - a game search whose prior window starts at a double push with no legal ep capture;
    - the CLI's threefold claim and fivefold draw in that case, which now come one occurrence earlier, on time by FIDE.
  - So it is value-changing. The smoke pair applies, and the count of smoke games that end by repetition, candidate
    against base, is reported (as `ABC-230` `A7`). The expected effect is tiny: about 0.5 % of D games, and none
    measured in R.
- **The tests the ticket owes.** This is their shape; the rows themselves are QE's and the Software Engineer's.
  - **Helper rows:**
    - an ep square with no capturer: the key equals `zobristKey` of the same position with no ep square;
    - an ep square with a legal capture: the key equals `zobristKey`;
    - a pseudo-legal but illegal capture (a pinned capturer, and the rank-pin case): the ep file is removed;
    - no ep square: the key is unchanged;
    - purity: the position is unchanged after the call.
  - **Hash rows, unchanged:** the `zobrist.test.ts` ep rows (decision 1's `not.toBe` pair), the `ABC-075` oracle walk,
    the book rows and every node pin pass as they are. A red there is a build fault, not a re-pin.
  - **Game-end rows (the `ABC-011` `1.e4` line):**
    - after 1.e4 Nf6 2.Nf3 Ng8 3.Ng1 Nf6 4.Nf3 Ng8 5.Ng1, `gameStatusOf` reports the threefold claim. Today it comes
      at 7.Ng1;
    - the fivefold draw comes at 9.Ng1. Today it comes at 11.Ng1;
    - `claimShortfall` reads "2 of 3" after 3.Ng1;
    - a twin line from a FEN where the double push can be captured legally keeps today's counts.
  - **Prior-key rows:**
    - from a FEN with a non-zero score, a line through an uncapturable double push and then a shuffle. The move that
      makes the third occurrence scores exactly 0, on the CLI and on UCI. With a legal ep capture available, the same
      line is not a draw;
    - for the same line, the CLI's injected list equals UCI's list;
    - with no prior keys, or with none that carries ep, every search is node-equal to base.
  - **Consistency row:** on the CLI, the move the search scores 0 is the move after which `gameStatusOf` reports the
    claim.
  - **Fence rows, unchanged:** the `LICENSED_DRIVERS` equality, `A11-g1` and `ABC-081` `A6`.
  - **Gates:** as `ABC-230`: `G4` identity, `G8`, `G9`, `G10` and the smoke pair. `G6` cannot move, because its boards
    have no prior keys, and the identity rows stand for it.
- **NFR:** no level moves. `NFR-002`'s per-ply derive gains one `hasLegalEnPassant` call per double push in the game.
  Its cost on this host is `UNKNOWN - verify`, and it is expected to be within the noise of the 46–50 µs replay.
- **`ADR-0054`** carries a dated line: its "the ep interaction (Q3)" consequence is answered here.

### What would falsify this section

| # | clause | what would falsify it | how to check |
|---|---|---|---|
| **F7** | C1 — only a window's oldest position carries ep | a move other than a double push setting `epSquare`, or a double push that does not reset the clock | `F3`'s grep, and `src/apply.ts`'s clock reset |
| **F8** | C1 — never a false equality | two positions with different legal move sets and equal repetition keys | the `F2` walk, run on repetition keys |
| **F9** | C3 — the hash is unchanged | any node pin, book key or `ABC-075` oracle row that moves at the ticket's merge | the pinned rows, unedited |

### Rollback

Point the call sites (`repetitionCounts`, the `gameStatus` lookup, `claimShortfall`, and the two prior-key builders)
back at the raw key. Then drop the helper and the export. Nothing is stored: no data file, book key or TT entry depends
on the repetition key. The `1.e4` rows go red, which proves the rollback took. Decision 2's bullet then holds again as
written.
