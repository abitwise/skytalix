---
kind: adr
id: ADR-0004
---
# ADR-0004: SAN ownership — one module, both directions, derived per frame

## Status

**accepted** — ratified **2026-07-31 by the Orchestrator, under an explicit named delegation from
the project owner Olger Oeselg**, dated the same day. Written 2026-07-30 by Architect/Design during
`EPIC-002`'s decomposition (task `epic-to-tickets-EPIC-002`, subtask `architect-epic002-seams`); the
ruling was applied to this file by Architect/Design (subtask `architect-adr0004-ratify`).

Ratified by: the **Orchestrator**, under delegation from **Olger Oeselg** — 2026-07-31

### The delegation, quoted — because this ratification is irregular

The standing convention in this repo, stated in this ADR's own draft and in every ticket cut against
it, is that **no agent may move an ADR to `accepted`**. `ADR-0002` and `ADR-0003` were each ratified
in session by a named human. **This one was not**, and this record must not be read as though it
were.

The owner delegated the ruling rather than making it, on 2026-07-31:

> *"I will give ADR-0004 ownership to you, you can decide if changes are needed or it can be
> scrapped."*

and set a standing priority that the ruling turns on:

> *"The most important thing is that chess moves are legal according to game rules, everything else
> comes after that. Game has to be played according to it's rules."*

**`Ratified by: Olger Oeselg` is deliberately NOT written here.** It would be false: he delegated the
ruling, he did not make it. A false attribution in an audit trail is worse than the irregularity it
would hide.

### NOT A PRECEDENT — read this before citing it

This is the **first ADR in this project not ratified directly by a human**, and it must not be read
as precedent for agents self-ratifying decision records. **The delegation was specific to `ADR-0004`,
by name.** For every other ADR — drafted, or not yet written — the convention is unchanged and takes
a named human. Any agent that cites this file as authority to accept its own ADR is citing it
wrongly.

### Ratification record — clauses 1 and 3 as proposed, clause 2 AS AMENDED

The ruling was **"accept 1 and 3, amend 2"**. The distinction is the point of this record: clause 2's
draft signature was **not** ratified as written, and this file must not be read as if it were.

- **Clause 1 — accepted as proposed.** `src/san.ts` above `src/legal.ts`. It rests on a structural
  fact — disambiguation requires `legalMoves` — read off merged code, not on a judgment.
- **Clause 3 — accepted as proposed.** SAN derived per frame, never stored. Measured, and it keeps
  `ADR-0002` clause 2's derive-don't-maintain rule whole with no exception.
- **Clause 2 — accepted only as amended.** The single-module, single-grammar call is right, and the
  owner's legality-first priority *strengthens* it: the reason this ADR's Context rejects the honest
  default — *"the move a player reads on screen and the move their typed string resolves to stop
  being the same move"* — is precisely a rule-integrity failure, not a tidiness complaint. But the
  draft signature could not carry that contract. Two amendments:

  - **(2a) `parseSan` must not return `Move | null`.** The draft wrote
    `parseSan(position: Position, text: string): Move | null`. A bare `null` collapses two
    rule-distinct outcomes: the string names a legal move but **more than one** matches (*ambiguous*
    — the player must disambiguate), versus the string names **no** legal move (*illegal* — the
    player broke a rule). Under legality-first the player must be told which, and the turn loop must
    never silently treat an ambiguous input as an illegal one. The System Analyst's `EPIC-003` seam
    contract (`…-system-analyst-observation-2fc3e3d9`, Seam A) already publishes `ambiguous` and
    `rejected` as **separate members of a closed outcome set**, so the draft signature contradicted a
    contract that was already on record. The ratified replacement is a discriminated
    `SanParseResult`, in the Decision section below. `parseSan` stays a **total function** — it does
    not throw for ordinary bad input.
  - **(2b) The move-identity invariant is written into the contract as a normative clause.**
    `parseSan` returns a `Move` that **is an element of the legal move list generated for that
    position**, never one reconstructed from the parsed text. This was established on the seam as
    invariant 2 ("settled rule R4") and called *"the single most load-bearing clause on this seam"*,
    but it lived only in a context note — not in the contract any implementer will read. It is the
    highest-severity legality landmine in this design, so it belongs in the Decision.

**Nothing was re-measured and no number changed.** This ruling measured nothing; every figure in this
file is exactly as written on 2026-07-30, on the machine named with it.

**One correction to the ruling's evidence, recorded rather than quietly absorbed.** The ruling cited
`src/apply.ts:158` (`position.board[move.to] = undo.captured`) as the line where a fabricated `Move`
corrupts the board on the way back. Read against merged code that line is the one that is **immune**:
`undo.captured` is read from the live board at `apply.ts:124`, not from `move.captured`. The genuine
silent-on-unmake sites are `apply.ts:157` and `apply.ts:109` — named precisely under clause 2b below.
The invariant is unchanged by the correction and is if anything broader than the cited line; only the
mechanism is stated accurately, which is the standard this ADR's Context section already holds itself
to.

### What this ADR blocked, now cleared

It never blocked `EPIC-002`'s ticket cutting — the seam it closes was published as a `decision` note
in the task's shared context, and BA/PM cut against that. It blocked the **merge of the first SAN
code**, because that is the point at which the decision becomes expensive to reverse. **That block is
lifted as of 2026-07-31.** `ABC-013` left `Blocked` for `Ready` on the same ruling, and tickets that
name this ADR as a dependency no longer need to say it is unratified.

**The `plans/traceability.md` row this ADR held back was appended on ratification, 2026-07-31.** The
draft deliberately appended none: the `ADR-0002` and `ADR-0003` rows landed *after* their
ratification, the trailing comment in that file records that as deliberate, and a row for a proposed
decision would read as settled. The row is now owed and paid, in the same shape as those two, and it
carries the clause-by-clause ruling above rather than a bare "Accepted".

## Context

`ADR-0002` (ratified 2026-07-30, all four clauses as proposed) closes its Decision section with
three seams deliberately left to this decomposition: the history module's exact API, whether the
derived counts are memoized, and **where SAN formatting lives** — "that is a separate seam the audit
named, and it is not this ADR's business". This ADR takes the third. The first two are closed as
design notes in the task's shared context and are not ADR-shaped: one is an API that follows from a
ratified clause, the other is a "no, and here is the trigger" that `ADR-0002` itself pre-authorized
as a local change.

### Who needs SAN, and in which direction

| Epic | Needs | Direction |
|---|---|---|
| `EPIC-002` | two-column move-history panel; "last move played" in the status panel | **render** |
| `EPIC-003` | the `moves` command lists every legal move; ambiguity candidates are listed; the parser turns typed `Nf3` into a `Move`; its Test notes name a `parse(toSAN(move))` round-trip property test | **both** |
| `EPIC-006` | the game-end screen shows the full move list; PGN export in the negotiable slice | **render** |
| `EPIC-005` | nothing at runtime — the book is keyed by position. Its *offline* compiler may parse SAN from the chosen source, depending on that source's format: `UNKNOWN - verify` | render/parse, offline only |

`EPIC-002` is `P0` and next in line, and it needs **render only**. `EPIC-003` is the epic that needs
**parse**. That ordering is the whole problem: if `EPIC-002` formats SAN inside its renderer because
that is where it needs it, `EPIC-003` must either import the renderer to name a candidate move — an
upward edge from input into presentation — or write a second grammar. **Two SAN grammars that
disagree fail silently and in the worst direction**: the move a player reads on screen and the move
their typed string resolves to stop being the same move.

### Three facts about SAN that decide the placement

Read off the merged code and the notation's own rules, not assumed:

1. **Disambiguation needs the legal move list of the position.** `Nbd2` versus `N1d2` versus `Nb1d2`
   is decided by which *other* legal moves of the same piece type reach the same square. So a
   correct `toSan` calls `legalMoves(position)`.
2. **The `+` / `#` suffix needs the move played.** Check is `isInCheck` after the move; mate is
   additionally `legalMoves(after).length === 0`. So `toSan` calls `makeMove` / `unmakeMove` too.
3. **Parsing needs exactly the same list.** `parseSan(position, "Nf3")` resolves a string against
   the legal moves of the position. Render and parse take the *same two inputs* and have the *same
   dependencies*; they are inverse functions over one grammar.

Fact 1 alone rules out the rules core: SAN cannot sit below `src/legal.ts`. Facts 1 and 2 together
mean any module that formats SAN has a rules dependency — including a renderer, if the renderer is
where it lands.

### Measured — one machine, and it says which costs matter

Produced this session by a scratchpad harness run **outside the repo**, read-only against merged
`src/`, no `src/` file modified. **Apple M3, Node v24.12.0, darwin/arm64.** Positions are a
deterministic random-legal game from `startpos`; the per-ply figures are at a ply-60 middlegame
position of that game. Two full runs; both are shown where they differ. `UNKNOWN - verify` on any
other hardware.

| What | Measured | Against a budget |
|---|---:|---|
| `toSan(position, move)` — computes its own `legalMoves` | **4.31 / 4.45 µs** | |
| `toSan(position, move, legal)` — caller supplies the list | **0.10 / 0.11 µs** | **40x cheaper** |
| `legalMoves` at that position | 3.18 µs | agrees with `ADR-0003`'s 1.8-5.4 µs range |
| Full move-history render (replay + `toSan` per ply), 40 plies | **171 / 176 µs** | 1.1% of `NFR-002`'s 16 ms frame |
| … 120 plies | **517 / 533 µs** | **3.3%** |
| … 300 plies | **1,272 / 1,318 µs** | 8.2% |

**SAN is ~97% `legalMoves` and ~3% string work.** That single ratio decides two of the three clauses
below: it is why the optional `legal` parameter is worth having, and it is why the per-frame render
cost is what it is.

## Decision

**Ratified: one module, both directions, derived per frame** — clauses 1 and 3 as proposed, clause 2
as amended (see the ratification record in Status). Three clauses:

**1. SAN lives in one new module, `src/san.ts`, above `src/legal.ts` and beside `src/gameend.ts`.**
It imports `position.ts`, `moves.ts`, `apply.ts` and `legal.ts`. It does **not** import
`gameend.ts` — the `#` suffix is checkmate only, and `gameStatus` would additionally compute
insufficient material and repetition, which are not SAN suffixes and would drag in the repetition
counts. It does **not** import `history.ts`. The dependency graph stays an acyclic DAG with no
upward edge, and `src/` gains its tenth production module. No new runtime dependency.

**2. Both directions live in that one module, over one grammar.** *(As amended on ratification. The
draft's signature was `parseSan(position: Position, text: string): Move | null`; it is quoted in
amendment (2a) in Status so this clause can be read without the file's history.)*

```ts
export function toSan(position: Position, move: Move, legal?: readonly Move[]): string;
export function parseSan(position: Position, text: string, legal?: readonly Move[]): SanParseResult;

export type SanParseResult =
  | { readonly outcome: "move"; readonly move: Move }
  | { readonly outcome: "ambiguous"; readonly candidates: readonly Move[] }   // N ≥ 2
  | { readonly outcome: "rejected"; readonly reason: SanRejectReason };

// SanRejectReason is deliberately not defined here: a machine-readable code, never display
// copy, whose membership EPIC-003 owns. This ADR fixes the three outcomes, not the reasons.
```

One table of piece letters, castle strings, promotion and suffix; one disambiguation rule, used by
both. The optional `legal` parameter is part of the contract rather than a tuning detail: the two
call sites that already hold the list — `EPIC-003`'s parser, which just called `legalMoves` to
validate, and its `moves` command, which is formatting that very list — pay **0.10 µs instead of
4.31 µs per move**, and the `moves` command formats ~41 of them. It carries a caller obligation, and
it is the same one in both directions: *the supplied list must be the legal moves of the supplied
position*. Supply another position's list and both functions are wrong, silently — that is the price
of the 40x and it is paid by the caller.

**(2a) Three outcomes, and they are closed.** `parseSan` is a **total function**: every input
produces one of the three arms and none of them throws. The three names are the seam contract's own
(`…-system-analyst-observation-2fc3e3d9`, Seam A), matched deliberately:

| `outcome` | Carries | Means | The loop |
|---|---|---|---|
| `move` | exactly one `Move` | the text names exactly one legal move | apply it, advance the ply |
| `ambiguous` | **N ≥ 2** candidate `Move`s | the text names a legal move, but more than one matches | list the candidates, re-prompt, **ply not advanced** |
| `rejected` | a machine-readable `SanRejectReason` | the text names **no** legal move in this position | show the reason, re-prompt, **ply not advanced** |

- **`ambiguous` and `rejected` are never merged**, and this is the clause the owner's legality-first
  priority buys. "More than one legal move matches" is the player being imprecise; "no legal move
  matches" is the player breaking a rule or mistyping. A `null` cannot tell them apart, so a loop
  built on `Move | null` must either guess or say something false to the player about the rules.
- **A single match is `move`, never a one-element `ambiguous`.** N ≥ 2 is a contract, not a comment.
- **`SanRejectReason` is a machine-readable code, never display copy.** Seam invariant 5 is that
  message text is data the loop places, not output the parser prints; `EPIC-003` owns the wording and
  the teaching rejections, so a rendered English string coming out of `src/san.ts` would put UI copy
  in the grammar module. This ADR fixes the **outcome set** at three and does **not** fix the reason
  vocabulary — `EPIC-003` owns its exact membership, and may extend it inside the `rejected` arm
  without touching this clause. The floor it must meet: distinguish *this text is not SAN I can read*
  from *this is well-formed SAN that names no legal move here*. Widening the outcome set from three
  is an ADR change; widening the reason set is not.
- **`parseSan` does not classify commands.** The seam's other two outcomes — `command` and
  `input-unavailable` — belong to `EPIC-003`'s input layer, not to the grammar: `moves` / `help` /
  `quit` are not SAN, and teaching `src/san.ts` the command set would drag `EPIC-003`'s command
  vocabulary into a module whose entire justification is that it owns one grammar. `parseSan` is a
  **supplier of three of the seam's five outcomes**, and the input layer owns the other two.
- **It does not throw, and that is deliberately unlike `src/fen.ts`.** `parseFen` throws `FenError`
  on every fault, and that is right for it: FEN arrives once, at a boundary, and a bad one should
  stop a load. SAN arrives on **every line a human types**, on the loop's most-travelled edge — the
  `S3` re-prompt, which the seam's own state map has four non-advancing outcomes for. Exceptions as
  control flow for ordinary human typing is the wrong shape there, so the divergence is recorded
  rather than left to look like an oversight.

**(2b) Move identity — every `Move` this module returns comes from the generator.** Normative, and
the highest-severity clause on this seam:

> **Every `Move` in a `SanParseResult` — the one in `move`, and every one in `ambiguous.candidates` —
> is an element of the legal move list generated for that position. `parseSan` never constructs a
> `Move` from the parsed text.**

This costs nothing: fact 3 above already says parsing resolves the text *against* the legal moves of
the position, so the list is in hand either way, and selecting from it is strictly less work than
building a `Move`. What it prevents has two levels, and both are legality failures:

- **The loud one, which is the point.** A `Move` assembled from text can simply be **illegal** — a
  pinned piece moving, a king walking into check, an en-passant capture that is not available.
  Membership in `legalMoves(position)` rules that out by construction; a hand-rolled square-and-piece
  parse does not.
- **The quiet one, which is worse.** A `Move` with the right `from`/`to` but a wrong `captured`,
  `flags` or `promotion` applies plausibly and shows a plausible board, then corrupts the position on
  the way **back**, during `EPIC-006`'s `undo`. Read off merged code, the unmake path reads three of
  the `Move`'s own fields rather than the undo record: `src/apply.ts:157`
  (`position.board[move.from] = move.piece`) writes the mover back from the `Move`;
  `src/apply.ts:160` branches on `move.flags`; and `undoSpecial`'s en-passant arm,
  `src/apply.ts:109` (`position.board[enPassantCaptureSquare(move)] = move.captured`), materialises
  the captured pawn from `move.captured`. Only `src/apply.ts:158` is safe, and only because
  `undo.captured` was read from the live board at `src/apply.ts:124`. So a wrong `piece` or a wrong
  `captured` puts a **wrong piece on the board during a take-back**, with nothing thrown and nothing
  logged. `EPIC-006`'s `undo` is where a player would find it, a full move after the mistake.

The candidates arm is bound by the same clause for the same reason: an ambiguity list is a list the
player is about to pick from, so a fabricated candidate is a fabricated move one keystroke later.

**How this is falsified** — and it is the reason `parseSan` takes the optional `legal` list. Because
`generateMoves` allocates a fresh `Move` object per call, two `legalMoves(position)` calls return
field-equal but **reference-distinct** objects, so `parse(toSan(move)) === move` across two separate
calls can never hold, and a deep-equality comparison would pass a perfectly reconstructed `Move` —
i.e. it cannot detect a 2b violation at all. Handing **one** list to both directions makes reference
identity exact and makes the invariant testable:

```ts
const legal = legalMoves(position);
for (const move of legal) {
  const parsed = parseSan(position, toSan(position, move, legal), legal);
  // outcome === "move" && parsed.move === move  — identity, not field equality
}
```

That is the round-trip property test `EPIC-003` already owes, made precise: at 0.10 µs per call it is
cheap enough to run over every legal move of every perft position, and it falsifies a grammar bug and
a provenance bug with the same assertion.

**The ticket boundary this implies, stated because the decomposition asked for it:** `EPIC-002`
creates `src/san.ts` with `toSan` only and its tests. `EPIC-003` adds `parseSan` to the same file
and owns the round-trip property test its Test notes already name. `EPIC-002` does not ship a
parser, and `EPIC-003` does not ship a second formatter.

**3. SAN strings are NOT stored in the history module; they are derived per frame.** `history.ts`
does not import `san.ts`. The renderer composes the two: it replays the move list and formats each
ply. This keeps `ADR-0002` clause 2's rule whole with no exception — **everything above the move
list is derived, nothing is maintained** — and it costs a measured 533 µs at 120 plies, 3.3% of
`NFR-002`'s 16 ms frame budget.

The trigger for revisiting clause 3, and the response, are in Rollback. Both are local changes.

### Confidence, and what would change my mind

**Confidence: high on the placement, medium-high on "both directions in one file", high on the
measurements.**

High on clause 1 because it rests on a structural fact — SAN needs `legalMoves` — that is read off
the merged code, not judged. Medium-high on clause 2's single-file call, which is a judgment about a
parser nobody has written yet. High on the numbers: two runs, agreeing, and `legalMoves` and
`zobristKey` in the same harness reproduce `ADR-0002`'s and `ADR-0003`'s published figures.

What would change my mind, stated so a human can check it later:

- **`parseSan` turning out to need materially more than the grammar `toSan` needs** — full PGN input
  with comments, variations and annotation glyphs, say. `EPIC-003`'s scope is a move typed at a
  prompt, so the grammar is small; if PGN *import* is ever added (it is not in any epic — `EPIC-006`
  lists PGN *export* in its negotiable slice) the parser grows a lexer and a split becomes arguable.
- **A measured frame in which the SAN history panel is the thing that misses `NFR-002`.** That
  changes clause 3, not clauses 1 or 2 — see Rollback.
- **A consumer of SAN that has no position to hand.** Every SAN string is a function of a position;
  a caller that wants one without a position is asking for something else (a coordinate string, or a
  cached line), and that request should be read carefully rather than served by widening this module.

What would **not** change my mind: the 4.31 µs per SAN string. It is affordable everywhere it is
called, and it is 97% a `legalMoves` call whose cost `ADR-0003` already ruled on.

### Stated dependency on ADR-0003

If `ADR-0003` clause 3's menu is ever spent — its **(c2)** lazy legality measured 2.95x-4.38x per
`legalMoves` call — this module gets roughly that much cheaper for free, because 97% of its cost is
that call. Nothing here depends on which option is chosen, and this ADR authorizes none of them.
`ADR-0003` clause 1 (make/test/unmake stays) is what the 4.31 µs figure was measured under.

## Alternatives

**Render in `EPIC-002`'s renderer, parse in `EPIC-003`'s input module — the honest default.**
It is what happens if nobody decides, and it is cheapest for `EPIC-002` alone: the renderer needs a
string and formats one. Rejected for three reasons, in order of weight. First, it produces **two
implementations of one grammar**, and the failure mode is silent — a disambiguation rule that
differs between them means the move rendered and the move parsed diverge without an error. Second,
`EPIC-003` also needs *rendering* (the `moves` command, the ambiguity candidate list), so it would
either import the renderer — an upward edge into presentation — or duplicate. Third, `EPIC-003`'s
own Test notes name a `parse(toSAN(move))` round-trip property test over perft positions; with SAN
split across a renderer and a parser that test has no single subject and has to reach into the
presentation layer to run.

**Put SAN in `history.ts`.** Tempting, because the move-history panel is the biggest consumer and
the history is right there. Rejected: SAN is a function of `(position, move)`, not of a game.
`EPIC-003`'s `moves` command formats candidate moves in a position with no game at all, and the
round-trip property test runs over perft positions that have no history. It would also give the
history module a second job and a dependency on `legal.ts` that `ADR-0002` clause 2's "owns exactly
`{ initial position, Move[] }`" does not ask for.

**Split `san-render.ts` and `san-parse.ts`, so `EPIC-002` does not carry a parser it never calls.**
The strongest rival, and it maps cleanly onto the epic boundary. Rejected because the two halves
share the grammar tables *and* the disambiguation rule, so the split either duplicates them or needs
a third module to hold them — three files where one does. There is no packaging argument on the
other side: `npm run build` is `tsc --noEmit`, there is no bundler, and nothing is published until
`EPIC-006`, so an unused export costs nothing at runtime. The work can still be split into two
tickets inside one file, which is what clause 2 says to do.

**Put SAN in the rules core, below `legal.ts`.** The naive first instinct — SAN is chess notation,
so it looks like a rules concern. Not possible: disambiguation needs `legalMoves`, and the core is
strictly below it. Recorded because it is the option a reader will wonder about, and the reason it
is impossible is worth one sentence.

**Store the SAN strings in the history at append time** (a `string[]` beside the move list, appended
by `playMove` and truncated by `takeBack`). Rejected today, on measurement rather than on principle:
it buys 533 µs per frame at 120 plies, which is 3.3% of a budget the renderer has not yet started
spending, and it costs a second array that must stay in step with the authoritative one — the exact
shape `ADR-0002` clause 2 rejected for the undo stack and the repetition counts. It is kept as the
named response in Rollback because it is genuinely safe to add later: the SAN of ply *i* depends
only on the position at ply *i* and the move, so truncation never invalidates a surviving entry.

## Consequences

- **One place to fix a disambiguation bug**, and `EPIC-003`'s round-trip property test has exactly
  one subject. That test is the real safety net for this module, and it only works if there is one
  grammar to round-trip through.
- **`EPIC-002` and `EPIC-003` get a clean ticket seam.** "Move history display" is a render ticket
  in `EPIC-002` that creates `src/san.ts`; the parser is a separate `EPIC-003` ticket that extends
  it. Neither epic waits on the other, and neither duplicates the other.
- **The move-history panel is the most expensive item in a frame**, and 97% of that cost is inside
  `legal.ts`. Anyone profiling the renderer will land in the rules core; that is worth knowing before
  it looks like a renderer bug.
- **The frame cost is O(plies)** while the frame budget is fixed, so the panel gets more expensive as
  a game goes on: 1.1% of `NFR-002` at 40 plies, 3.3% at 120, 8.2% at 300 on this machine. A terminal
  history panel shows a window of rows rather than the whole game, and rendering only the visible
  window makes the frame O(window) with no cache at all — that is a renderer decision inside
  `EPIC-002`, and it is the first thing to reach for if the panel ever gets expensive.
- **What this forecloses.** A renderer with no rules dependency: SAN inherently has one, and this
  decision routes it through `san.ts` rather than pretending it is absent. And a SAN implementation
  that skips the legal move list — there is no correct one; a "fast path" that formats without
  disambiguating is wrong on exactly the positions where notation matters.
- **`src/` grows a tenth module and `memory-bank/30-architecture.md`'s component table and dependency
  chain will need `san.ts` and `history.ts` added when they are built.** That update is owed at build
  time, not now — no module exists yet, and the as-built map should stay as-built.

### Added on ratification, 2026-07-31 — the consequences clause 2's amendments create

- **`EPIC-003`'s turn loop branches three ways at this seam, not two.** `Move | null` would have let
  a loop be written with one `if`; `SanParseResult` will not compile that way. That is the amendment
  doing its job — the ambiguity path is a real path (the seam note records it as reachable *without
  SAN at all*, because `addPromotions` pushes four moves with identical `from`/`to`, `src/moves.ts`),
  and a loop that never had to name it would have shipped treating a promotion as an illegal move.
- **The round-trip property test gains an exact form and a second subject.** It asserts identity, not
  field equality, and it now falsifies provenance as well as grammar (see clause 2b). It is still
  `EPIC-003`'s and it still cannot run until both directions exist — this ADR's honest limit is
  unchanged: **no existing test covers any of this.**
- **`src/san.ts` gains no dependency from either amendment.** `SanParseResult` is declared in the
  module itself over `Move` and `Position`, both already imported; the optional `legal` parameter
  changes no import. The DAG in clause 1 is byte-for-byte the one that was ratified.
- **A second, smaller divergence is now on record**: the newest parser in this codebase does not
  throw, and the oldest one (`src/fen.ts`) throws on everything. Clause 2a says why. Anyone adding a
  third parser should read that paragraph before matching either style by reflex.

## Rollback

Cheap now, dear after `EPIC-003`. Today no line of SAN exists anywhere, so reversing any clause means
editing this file. Once `EPIC-002` ships a formatter inside its renderer and `EPIC-003` ships a
parser beside it, reversing clause 1 or 2 means touching the renderer, the input layer and the
round-trip test at once — against a failure mode that does not throw.

Clause 3 is the one with a live trigger, and it is deliberately the cheap clause to reverse:

- **Trigger:** a measured frame on target hardware in which the SAN history panel exceeds ~25% of
  `NFR-002`'s 16 ms budget (~4 ms). By linear extrapolation from the table above that is around
  900-1,000 plies on this M3 — `UNKNOWN - verify` on any other machine, and a slower machine reaches
  it sooner.
- **First response — renderer-side, no structural change:** render only the visible window of the
  history panel. The frame becomes O(window): replay to the window's first ply (2.4 µs at 120 plies,
  measured) plus ~4.3 µs per visible row.
- **Second response — local to `history.ts`:** compute SAN at append time and store it beside the
  move list, truncated by the same function that truncates the list, so the two can never drift.
  Only clause 3 changes; clauses 1 and 2 are unaffected, and `history.ts` gains an import of
  `san.ts` (still downward, still acyclic).

The mitigation that makes all of this safe is `EPIC-003`'s round-trip property test over the perft
positions — for every legal move, `parseSan(position, toSan(position, move, legal), legal)` returns
`outcome: "move"` with `move` **identical by reference** to the one formatted *(amended on
ratification; the draft wrote this as `parse(toSan(move)) === move`, which is unsatisfiable across
two `legalMoves` calls — see clause 2b)* — which asserts behaviour, not structure, and survives every
rollback above. Note the honest limit, the same one `ADR-0002` names:
**no existing test covers any of this**, because none of it exists. The round-trip test and the
history module's own tests are the only safety net this decision will ever have.
