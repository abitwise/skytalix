---
id: ABC-016
title: Status panel — side to move, check, material balance, move number, last move, thinking row
status: in-security-nfr
column: In Security/NFR
size: M
priority: P1
epic: EPIC-002
feature: —
---

# ABC-016 — Status panel: side to move, check, material balance, move number, last move, thinking row

> **AMENDED 2026-08-11 by BA/PM at task `repair-panel-tickets` (Workflow 07), applying accepted
> `ADR-0009`. TWO DEFECTS ON A `Ready` TICKET, ONE OF THEM IN A PROMOTED CRITERION.** `ADR-0009` is
> the input and is **not re-litigated**; what is recorded here is what applying it exposed.
>
> | # | Defect | Where |
> |---|---|---|
> | D17 | **`A11` PASSES M2–M5 — including BOTH mutants that push the frame past 24 rows and make epic `4b` unreachable — and `D8` added it to protect `4b`.** Its `frameHeight(...) is 23` clause was also the entire import edge to `ABC-017`, and its `STATUS_ROWS` had no stated provenance | Acceptance `A11`, Scope, Dependencies |
> | D18 | The carried `NFR-002` flag reads *owed by Architect/Design* and was **already ruled on the day it was raised** (`refinement-ABC-026`, re-checked at `design-frame-contract`) | NFR, DoR |
>
> **D17 was re-measured here, not taken on trust.** The Architect's six-mutant table was **re-run**
> against merged `src/frame.ts` / `src/render.ts` from an out-of-tree harness, a seventh mutant
> (`status` = 5) was added, and every `4b` verdict is `beginFrameSession`'s own strategy choice on a
> 24-row TTY rather than arithmetic. **The finding that matters is one the ADR does not state:**
>
> > **Striking the clause does NOT make `A11` able to catch M3/M5 — measured, `A11` passes both
> > before the strike AND after it. Nothing writable on this ticket can catch them.** Both mutants
> > move `history`, a term this panel must not name (`ADR-0009` cl. 2) and cannot read (`ABC-017` is
> > unbuilt when this ticket merges first); the shadow-literal form that *could* name it passes all
> > six and is `ADR-0009` Alternative B, rejected by measurement. **So `D8`'s claim that `A11`
> > protects `4b` is retracted in half rather than repaired**: `A11` protects `4b` against **this
> > panel's own** row count (`status` ≥ 5 → `H` = 25 → append path → `4b` dead; `A11` fails there),
> > and the `history`/`board` halves move to `ABC-017`'s new `A13` per `ADR-0009` cl. 5. **A
> > criterion that keeps claiming a protection it cannot deliver is worse than one claiming less.**
>
> **One new flag falls out and it is the Orchestrator's:** `ADR-0009` parks `4b`'s cross-panel guard
> on `ABC-017`, which is `P2` and calls itself the first thing to drop. Between this ticket's merge
> and `ABC-017`'s, `4b`'s 24-row budget is guarded only against a `status` change. See
> `## Definition of Ready`.
>
> **Size `M` and priority `P1` both re-read and both unmoved** — the repair removes a clause and adds
> two to an existing criterion. **Zero production lines; `src/` byte-identical to `main`.**
> `plans/board.md`, `plans/nfr-catalog.md` and `memory-bank/50-decisions/` **not edited** — a
> concurrent Architect/Design hop shares this branch and holds the latter two.

> **AMENDED 2026-08-10 by BA/PM at the `Backlog → Ready` promotion** (task `refinement-ABC-016`,
> Workflow 07). **Sixteen defects, two of which the Orchestrator's pre-check named.** Every one is
> corrected below and every correction was verified against merged `src/` rather than argued — four
> of them by building the wrong panel and watching it pass the criterion as it stood.
>
> The one that changes the ticket's shape, stated first because everything else is text:
>
> > **Item 7 called `gameStatusOf(history)` from inside the panel. That is a SECOND repetition
> > derive of the SAME move list in the same ply, and `ABC-019` — the loop that renders this panel —
> > already forbids it in words and has two acceptance criteria that it makes false.** Measured at
> > this hop on merged `src/`: **47.93 µs at 120 plies and 95.64 µs at 300 plies**, which is **91% of
> > the panel's whole cost at 300 plies** and grows with game length. The ticket's own NFR derivation
> > omitted the term entirely, which is how a 250 µs bar came to be justified by a 20 µs estimate.
> > **The claimable set is now an INPUT.** The loop evaluates `gameStatus` once per ply before it
> > renders (`ABC-019`: *append to history → derive counts → `gameStatus` → render*) and hands the
> > answer in. The panel derives nothing.
>
> | # | Defect | Where |
> |---|---|---|
> | D1 | Item 7's derive is a second derive of the same list; breaks two `ABC-019` criteria | Scope 7, Acceptance |
> | D2 | NFR derivation omits its dominant term and over-states `isInCheck` by 30–50x | NFR |
> | D3 | *"the same call the panel's other items already sit beside"* describes a call that does not exist | Scope 7 |
> | D4 | The only in-check FEN in the ticket is **checkmate**; a `reason === "checkmate"` build passes | Acceptance |
> | D5 | Three criteria turn on *present* / *names* and pin no string *(Orchestrator flag 1)* | Acceptance |
> | D6 | A cell that always names BOTH draw rules passes all four claim criteria | Acceptance |
> | D7 | A thinking cell that is always blank passes both thinking criteria | Acceptance |
> | D8 | The panel's row count is pinned by nothing; ≥ 5 rows silently breaks epic `4b` | Scope, Acceptance |
> | D9 | *"Given glyph mode ASCII"* varies an input the panel does not have and will not get | Scope, Acceptance |
> | D10 | No piece-value table, while five exact integers are quoted | Scope 5 |
> | D11 | Four criteria carry no FEN, on a ticket whose standard is exact FENs | Acceptance |
> | D12 | *"the position before it"* names no derivation; the naive one corrupts the live board | Scope 4 |
> | D13 | Item 2's *unreachable* claim is false for the loaded FEN this same ticket relies on | Scope 2 |
> | D14 | *row* / *cell* / *three rows for seven items* are mutually incoherent | Scope 6, 7 |
> | D15 | `ABC-018` and `ABC-019` missing from Dependencies; the `ABC-020` line is now history | Dependencies |
> | D16 | The ticket's own DoR block claimed ✅ on the two checks that failed | DoR |
>
> **Size `M` and priority `P1` are both re-derived and both unmoved** — see their sections, which now
> say why the amendment does not move either. **Nothing under `src/` was written at this hop**;
> `plans/nfr-catalog.md` was **read and deliberately not edited** (`ABC-026`'s Architect/Design hop
> holds that file) and `plans/board.md` was not edited (the Orchestrator makes board moves).

## Problem

*User*: the player mid-game, who needs to know four things without counting pieces on the screen —
whose turn it is, whether they are in check, what move number it is, and what just happened.

*Pain*: a board alone does not answer any of them. Worst of these, a player who does not notice
they are in check will try an illegal move and get a rejection they do not understand.

*Value*: epic acceptance **#3** lives here — *"Given the side to move is in check, when the board
renders, then the status line states it explicitly."* Everything else in the panel is what turns a
board picture into a game.

## Scope

**A panel renderer that returns EXACTLY `STATUS_ROWS` rows as a value.** `STATUS_ROWS` is **3**, it
is an exported constant of the panel module and not a literal at the call site, and it is what
`ABC-018`'s `frameHeight({ board, status, history })` is fed. Writes nothing, reads nothing ambient.

**[CORRECTED 2026-08-10 — D8.]** *This line read "a fixed number of rows (three, in the reference
layout)" and no criterion anywhere pinned the number, so "identical row count in both cases" was
satisfied by a 1-row panel and by a 7-row one. It is not a free choice.* `frameHeight` is a session
constant read once by `beginFrameSession` (`src/frame.ts:211`), and the arithmetic was run at this
hop: `frameHeight({ board: 9, status: N, history: 8 })` is **21 / 22 / 23 / 24 / 25 / 27** rows for
`N` = 1 / 2 / 3 / 4 / 5 / 7. **At `N ≥ 5` the frame no longer fits a 24-row terminal, so
`beginFrameSession` takes the append path and epic acceptance `4b` — the in-place redraw with no
stale rows — becomes unreachable on a standard terminal, silently.** Three is the epic's reference
number (`4a`) and 4 is the last value that still fits; the panel ships 3.

**[SCOPED 2026-08-11 — `ADR-0009` clauses 2, 4 and 5, D17.]** *The sweep above is a measurement and it
stands; what it does NOT license is a criterion on this ticket that names another panel's count.* The
`history: 8` in that sweep is **prose about the reference layout**, not a term this panel asserts —
`A11`'s frame-level clause is struck and **this panel neither reads nor names `HISTORY_ROWS`, in
production or in test.** The producer owns its count; this ticket owns `STATUS_ROWS` and no other.
**The composition — all three terms read from delivered code, `= 23` as a tripwire and `≤ 24` as the
requirement — lands once, in `src/frame.test.ts`, and it is `ABC-017`'s `A13` because `ABC-017`
merges second.** Re-verified at this hop: `frameHeight({ board: 9, status: 5, history: 8 })` is
**25**, and `beginFrameSession` on a 24-row TTY takes the **append** path at 25 and the **in-place**
path at 23 and 24 — so `4b` dies at `N ≥ 5` exactly as stated, by the merged code's own choice rather
than by arithmetic.

**Inputs, and they are the whole contract** *(corrected 2026-08-10 — D1, D9)*:

| Input | Why |
|---|---|
| `history: GameHistory` | items 3, 4 and 5 read `history.position`; item 4 replays `initialFen` + `moves` |
| `status: GameStatus` | item 7. **Supplied by the caller, never derived here** — see item 7 |
| `thinking: boolean` | item 6, the flag `ABC-019`'s loop owns |

**Three, and there is no `GlyphMode` — that is a decision, not an omission (D9).** The old ASCII
criterion read *"Given glyph mode ASCII, when the panel renders"*, which varied an input the panel
did not have and could not have been written as a test. There were two ways to fix it and this is the
one taken: **the panel renders no piece glyph and no box character, so it emits ASCII unconditionally
and `A12` asserts that in every case rather than in one mode.** Adding the parameter instead would
have bought an argument no output depends on — and an argument no output depends on is an invitation
to make some cell depend on it later, which is the only way this panel could ever fail epic
acceptance `2a`. `ABC-014` and `ABC-017` genuinely need the mode (they draw pieces and they align
columns); this one does not, and the difference is real rather than an inconsistency.

*The live position is `history.position` and is not a second parameter.* Taking both would let a
panel read side-to-move from one object and the claim from another; there is one live position and
`ABC-012` says it is borrowed, never snapshotted.

Seven items:

1. **Side to move** — `history.position.blackToMove`. A plain boolean on the live object.
2. **Check indicator** — `isInCheck(history.position)` (`src/legal.ts:32`, verified at this hop),
   which reports whether **the side to move** is in check and nothing else. That is exactly what
   criterion #3 asks for.

   **[CORRECTED 2026-08-10 — D13.]** *This item read "it is never the wrong primitive: a position in
   which the side not to move is in check is illegal and unreachable through legal play".* The second
   half is true of positions reached **by play** and false of positions **loaded from a FEN**, which
   is the case this same ticket relies on four paragraphs later for the move number. Measured:
   `parseFen("4k3/8/8/8/8/8/8/4R1K1 w - - 0 1")` **succeeds**, Black stands in check, and
   `isInCheck` correctly answers `false` about White — so the panel silently shows no check on a
   position no legal game can produce. **`ABC-010` (FEN semantic validation) is the ticket that
   closes it and it is in `Backlog`.** `isInCheck` remains the right primitive and no code changes
   here; what changes is that the panel's honesty about loaded positions is now **carried, not
   claimed away**, exactly as `ABC-019` carries the same class for `legalMoves`.
3. **Move number** — `history.position.fullmoveNumber`, rendered `N.` when white is to move and
   `N...` when black is.
4. **Last move played, in SAN** — `toSan` of the last `Move` in the history against the position
   **before** it. Blank when the game has no moves yet.

   **[ADDED 2026-08-10 — D12. The derivation is named, because there is exactly one and the obvious
   alternative corrupts the board.]** `GameHistory` is `{ initialFen, moves, position }`: there is no
   undo stack (`ADR-0002` clause 2 forbids one), no stored `UndoRecord`, and no clone function
   anywhere in `src/`. **So the position before the last move is obtained by replaying
   `parseFen(history.initialFen)` forward through `moves[0 … n−2]` with `makeMove` — a throwaway
   `Position` the panel owns.** Measured at this hop, that whole cell (replay + `toSan`) costs
   **5.18 / 7.77 / 9.75 µs at 40 / 120 / 300 plies**, dominated by one `parseFen` (1.62 µs) and one
   `toSan` (~4.4 µs).

   **What must not be done, and it was built and measured rather than warned about:**
   `toSan(history.position, lastMove)` — SAN against the position *after* the move — **emits the
   correct string `Nf3` and permanently corrupts the live board**, leaving a phantom knight
   (`rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R` becomes `…/RNBQKBNR`). It violates `toSan`'s
   first caller obligation, whose behaviour `ABC-013` explicitly asserts nothing about.

   **This replay uses `fen.ts` and `apply.ts` over `history.initialFen` and `history.moves`, so this
   ticket adds NO RUNTIME IMPORTER of `src/history.ts`** — `GameHistory` is a type-only import. That
   is load-bearing beyond style: `NFR-002`'s `O(window)` boundary condition was verified
   *structurally* at `ABC-012`'s gate on the ground that `src/history.ts` has zero importers, and
   item 7 as originally written would have expired that verification on merge.
5. **Material balance** — sum the piece values of each colour by scanning the 64 squares of
   `history.position.board` and take the difference, rendered as a signed integer from white's point
   of view (`+3`, `-1`, `0`; an explicit `+` on a positive, no sign on `0`).

   **[ADDED 2026-08-10 — D10. The values, because five exact integers were quoted and none of them
   was defined.]** **P 1 · N 3 · B 3 · R 5 · Q 9 · K 0.** Verified at this hop to reproduce every
   integer this ticket asserts. The king's value is unobservable (both sides always have exactly one)
   and is fixed at 0 so that nobody has to wonder.
6. **Engine thinking indicator** — **static**, from a flag the loop owns. Shown while the loop is in
   the thinking state, and **its CELL exists in every frame, blank when idle**, so the panel's row
   count does not change when the engine starts or stops.

   **[CORRECTED 2026-08-10 — D14.]** *This item said "its ROW exists in every frame" while `## Scope`
   put seven items in three rows — under which the indicator cannot own a row.* The invariant that
   matters is the panel's total row count, which is `STATUS_ROWS` always; how seven items pack into
   three rows is the engineer's, exactly as epic acceptance `4a` says (*"the invariant is the
   criterion; the exact split is the engineer's"*).
7. **Draw-claim availability** — **[ADDED 2026-07-31 by BA/PM, `ABC-020` / `ABC-021`; its SOURCE
   REVERSED 2026-08-10 — D1, D3.]** What the **side to move** may claim under FIDE 9.2 (threefold
   repetition) and 9.3 (the fifty-move rule), naming which one, or both when both hold. **Read from
   the `GameStatus` the CALLER supplies** — `status.claimable`, which is `DrawClaims | undefined` and
   carries its own `by`. **The panel calls `gameStatusOf`, `repetitionCounts` and `keyHistory`
   exactly zero times.** **Blank when nothing is claimable**, and, like the thinking indicator, **its
   cell exists in every frame** so the panel's row count never changes.

   *This item previously read "Read from `gameStatusOf(history)` — the same call the panel's other
   items already sit beside — never recomputed". Both halves were wrong.* **There is no such call
   beside the panel's other items** (items 1, 3 and 5 read `Position` fields, item 2 is `isInCheck`,
   item 4 is a replay, item 6 is a flag — D3), and calling it here is not "not recomputing", it is
   **the second computation of the ply**. `ABC-019`'s loop runs *append to history → derive counts →
   `gameStatus` → render* and its NFR paragraph rules on this exact question in words: *"The loop
   must derive the counts once per ply, not once per call site … three derives of the same list is
   not"*. Two of its acceptance criteria say that on a `rejected` input and on the `board` command
   **a frame is re-emitted and `gameStatus` is NOT re-evaluated** — which a panel that derives its
   own claims makes false by construction, since re-emitting the frame is what runs the panel.
   Measured at this hop: **47.93 µs at 120 plies, 95.64 µs at 300 plies**, per frame, for a value the
   loop is already holding.

   *It is attributed to the side to move, not to "you".* The panel renders on the engine's plies too,
   and under FIDE the claim genuinely belongs to whoever has the move. One rule, no special case, and
   it matches `gameStatus`'s own semantics — `status.claimable.by` is that attribution, and it is a
   required field precisely so the panel cannot infer it. **This cell is the only way a player learns
   a claim is available** — `ABC-021` deliberately ships no offer prompt, because a modal offer would
   break epic acceptance `4a`'s constant row count.

## Out of scope

- **The captured-piece list.** Cut from the MVP by epic amendment `[A4]`. It is a different quantity
  from the balance with a different correct derivation (the move list, never the board) and two
  traps: a board diff is wrong after any promotion, and en passant does not put the captured pawn on
  the destination square, so it must be read from `move.captured` and never from `undo.captured` or
  `board[to]`. Deferred, with the traps recorded here so whoever picks it up does not rediscover
  them.
- **An animating thinking indicator.** Static only — epic `## Out of scope`. Node is
  single-threaded; an updating indicator would be a requirement on `EPIC-004`'s internals.
- **The board itself** (`ABC-014`), **the move-history pane** (`ABC-017`), **the message region and
  all writing** (`ABC-018`), **the loop that owns the thinking flag** (`ABC-019`).
- **Terminal-state text** ("checkmate — white wins"). The loop's terminal reason and `EPIC-006`'s
  result screen own that; this panel reports check, not game over. **A claimable draw is not a
  terminal state** — under FIDE 9.2/9.3 the game is in progress until somebody claims — so item 7
  belongs here and the claimed *result* still does not.
- **Taking the claim.** The player types `claim` at the prompt (`ABC-021` owns the loop path,
  `EPIC-003` owns the verb). This panel states that a claim exists; it is not an interaction.
- **Deriving the game's status.** **[ADDED 2026-08-10 — D1.]** Evaluating `gameStatus`, deriving
  `repetitionCounts` and deciding whether the game is over are **`ABC-019`'s, once per ply, before
  the render**. This panel is handed the answer. It is out of scope in the strong sense: a build that
  derives it here fails an acceptance criterion below, and the criterion is a **call count**, not a
  timing, because a timing bar with 20x headroom cannot fail on a 48 µs regression.
- **Sanitizing its own output.** `ABC-018`'s `assembleFrame` strips C0, `U+007F` and — in ASCII
  mode — everything above `U+007F` (`src/frame.ts:101`). That is a frame-level control and this
  panel does not duplicate it. **The consequence is a test instruction, not a licence:** the ASCII
  criterion below must be asserted on **the panel's own rows**, because asserting it through an
  assembled frame passes on a panel that emits Unicode.

## Acceptance (Given/When/Then)

**[RE-DERIVED 2026-08-10. Eleven criteria became fourteen, and the strings became strings.]** Every
FEN, every integer and every status object below was **driven against merged `src/` at this hop**,
not reasoned about; the four wrong builds named in the parentheticals were **constructed and run**.

**The cell strings are pinned; the LAYOUT is not.** Each criterion asserts that the panel's joined
rows **contain** the exact cell text and, where stated, that they do **not** contain the other text.
How seven cells pack into `STATUS_ROWS` rows is the engineer's, per epic acceptance `4a`.
**Substring containment is the assertion form, so every cell whose text is a PREFIX of another
cell's text carries a negative** — see `A3`, which is the one place that bites.

| Cell | Text |
|---|---|
| side to move | `White to move` / `Black to move` |
| check | `CHECK` / *(blank)* |
| move number | `1.` `1...` `2.` `27.` — `N.` white to move, `N...` black to move |
| last move | `last: Nf3` / *(blank)* |
| material | `material: 0` `material: -9` `material: +8` — explicit `+` on a positive, bare `0` |
| thinking | `thinking...` / *(blank)* |
| claim | `White may claim: threefold repetition, fifty-move rule` / *(blank)* |

- **A1 — side to move, both ways. Given** any position with `blackToMove` false, **when** the panel
  renders, **then** it contains `White to move` and does **not** contain `Black to move`; **and
  given** `blackToMove` true, **then** the reverse. *(A panel that always says "white" passes a
  one-sided test.)*
- **A2 — the check indicator, and the FEN that was wrong. Given**
  `4k3/8/8/8/8/8/8/4R1K1 b - - 0 1` (Black to move, in check, **4 legal replies, game in
  progress** — measured), **when** the panel renders, **then** it contains `CHECK`. **Given** the
  starting position, **then** it does **not**. **Given**
  `rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3`, **then** it contains `CHECK`.

  *(**[CORRECTED 2026-08-10 — D4.]** The third FEN was this criterion's ONLY in-check case and it is
  **checkmate**: measured, `gameStatus` returns `{result:"black-wins",reason:"checkmate"}` and
  `legalMoves` returns **0**. A build deriving the indicator from `status.reason === "checkmate"`
  instead of from `isInCheck` was constructed and **passes both original cases** — `true` on the mate
  FEN, `false` on the start position. The plain-check FEN kills it: the wrong build answers `false`
  there and the correct one answers `true`. The mate FEN is kept, because a panel must still say
  `CHECK` on a mated board — this panel reports check, not game over.)*
- **A3 — the move number from play, and the negative half is not optional. Given** the starting
  position, **then** the panel contains `1.` **and does NOT contain `1...`**; **given** the position
  after `1.e4`, **then** it contains `1...`; **given** the position after `1.e4 e5`, **then** it
  contains `2.` and does **not** contain `1.`.

  *(Verified at this hop: `makeMove` increments `fullmoveNumber` when the side that just moved was
  black, **before** the flip — `src/apply.ts:145`. So the live value is the number of the move the
  side to move is **about** to play, which is what the panel wants. Three cases, not one: a build
  that renders `N...`/`N.` the wrong way round passes any single case. **The `does NOT contain
  1...` clause is load-bearing and this ticket got it wrong once already: `1...` CONTAINS `1.` as a
  substring**, so a panel that always renders `N...` satisfies a bare "contains `1.`" on every white
  case. Every string assertion on this ticket is a substring assertion; where a cell's text is a
  prefix of another cell's text, the negative is what does the work.)*
- **A4 — the move number from a loaded FEN. Given**
  `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 27` with an **empty** move list, **when**
  the panel renders, **then** it contains `27.` and does **not** contain `1.`. *(**Do not derive the
  move number from the history length.** `parseFen` accepts any fullmove ≥ 1 — measured — and
  `EPIC-003` will accept a FEN from a user; `ABC-010` exists for that reason.
  `position.fullmoveNumber` is right in both cases; `history.moves.length` is right in only one.)*
- **A5 — the last move, and the derivation that must not be used. Given** a history of one move
  `Ng1f3` from the start position, **when** the panel renders, **then** it contains `last: Nf3`.
  **Given** an empty history, **then** it does **not** contain `last:` followed by any non-space
  character, and the panel still has exactly `STATUS_ROWS` rows. **And given** `toFen(history.position)` captured **before** the
  first render, **then** it is byte-identical after it.

  *(**[ADDED 2026-08-10 — D12.]** The last clause is the criterion, not a nicety. Measured at this
  hop: `toSan(history.position, lastMove)` — SAN against the position *after* the move — returns the
  **correct** string `Nf3` and leaves the live board permanently corrupted with a phantom knight
  (`…/RNBQKB1R` → `…/RNBQKBNR`). A content-only assertion passes it. Only a `toFen` snapshot taken
  before the first render catches it, which is why the snapshot's timing is written into the
  criterion.)*
- **A6 — material balance, as a table of exact integers.**

  | FEN | Contains |
  |---|---|
  | `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1` | `material: 0` |
  | `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNB1KBNR w KQkq - 0 1` | `material: -9` |
  | `rnbqkbnr/pppppppp/8/8/7Q/8/PPPPPPP1/RNBQKBNR w KQkq - 0 1` | `material: +8` |

  *(All three measured at this hop under P 1 · N 3 · B 3 · R 5 · Q 9 · K 0. The third is the
  promotion case — white is one pawn short and one queen up — and it is the one a board-diff against
  the standard starting complement gets wrong; a 64-square scan gets it right. It is a constructed
  position rather than one reached by play, which is legitimate because the panel is a pure function
  of the board and `parseFen` accepts it.)*
- **A7 — the thinking cell, both ways, in ONE test. Given** the thinking flag true, **then** the
  panel contains `thinking...`; **given** it false, **then** it does **not** contain `thinking...`,
  and — **for the same position and history** — the two panels have an **identical row count** and an
  **identical widest-row width**.

  *(**[CORRECTED 2026-08-10 — D7.]** This read "the indicator is present … the indicator row is
  present and blank". A build whose thinking cell is **always blank** satisfies both halves as
  worded, since the row is present either way. Naming the string kills it; the width clause is what
  makes "blank but reserved" mean something, because the panel's widest row is the frame's `W`
  (`src/frame.ts:179`) and a cell that shrinks when idle makes the whole frame breathe.)*
- **A8 — the claim cell, four cases, each asserting the ABSENCE of the other rule.**

  | Given | Contains | Does NOT contain |
  |---|---|---|
  | `6k1/5ppp/8/b7/8/8/5PPP/4R1K1 w - - 0 1` + `Kh1 Bb6 Kg1 Ba5 Kh1 Bb6 Kg1 Ba5` (`ABC-020` A1) | `White may claim: threefold repetition` | `fifty-move` |
  | `6k1/5ppp/8/b7/8/8/5PPP/4R1K1 w - - 100 60`, empty move list (`ABC-020` A2) | `White may claim: fifty-move rule` | `threefold` |
  | `6k1/5ppp/8/b7/8/8/5PPP/4R1K1 w - - 92 60` + the same 8 plies | `White may claim: threefold repetition, fifty-move rule` | — |
  | the starting position | *(blank claim cell)* | `may claim` |

  and the panel's **row count is identical in all four cases**.

  *(**[CORRECTED 2026-08-10 — D6, D11.]** The criterion previously said the cell "names" the right
  rule, and gave a FEN for only one of the four cases. A build that names **both** rules whenever
  anything is claimable was constructed and **passes all four cases as they were worded** — it names
  threefold in case 1, fifty-move in case 2, both in case 3, and blank in case 4. The
  `Does NOT contain` column is what kills it. **The third row's position did not exist and was
  constructed at this hop**: eight plies of the A1 shuffle from a clock of 92 reaches the third
  occurrence at clock exactly 100, live FEN `6k1/5ppp/8/b7/8/8/5PPP/4R1K1 w - - 100 64`, measured
  status `{by:"white", draws:["threefold-repetition","fifty-move"]}`. **The order is `draws`' own
  order — threefold first, then fifty-move — and the panel never re-sorts it**, because
  `src/gameend.ts:53` guarantees that order and a second sort is a second opinion.)*
- **A9 — the claim is the side-to-move's and nobody else's. Given**
  `6k1/5ppp/8/b7/8/8/5PPP/4R1K1 b - - 100 60` — the same position with the side to move flipped —
  **when** the panel renders, **then** it contains `Black may claim: fifty-move rule`. *(Measured at
  this hop. This is `ABC-020` `A7`'s rule surfacing in the frame: a panel that renders "you" or
  infers the claimant from anything but `status.claimable.by` reproduces the exact defect `ABC-020`
  exists to fix, and it does so on the engine's plies where nobody is watching.)*
- **A10 — purity and determinism. Given** any case above rendered **twice**, **when** compared,
  **then** the two panels are **byte-identical**; and **then** `toFen(history.position)` and
  `history.moves.length` are unchanged across both renders. *(The move-list clause is new: item 4's
  replay is the one place a panel could reach for `takeBack`, which would mutate the caller's
  history and pass every content assertion.)*
- **A11 — the row count is a NUMBER, and it is THIS panel's number. Given** every case above,
  **when** the panel renders, **then** it has **exactly `STATUS_ROWS` rows**, **`STATUS_ROWS` is
  `3`**, and **`STATUS_ROWS` is read from the panel module's own `export`** — imported by the test,
  never re-declared as a local constant beside it.

  *(**[ADDED 2026-08-10 — D8. AMENDED 2026-08-11 — `ADR-0009` clauses 4 and 5, `D17` below: one
  clause STRUCK, two clauses ADDED, and D8's stated purpose PARTLY RETRACTED.]** The struck clause
  read *"and `frameHeight({ board: 9, status: STATUS_ROWS, history: 8 })` is 23 — the epic's
  reference layout, which fits a 24-row terminal."* It is struck because it was the entire import
  edge to `ABC-017`, and because **it did not do the job D8 gave it.***

  ***Re-measured at this hop against merged `src/frame.ts` and merged `src/render.ts` — the
  Architect's table was re-run, not transcribed, and every `4b` verdict below is
  `beginFrameSession`'s own strategy choice on a 24-row TTY rather than arithmetic:***

  | mutant | `A11` as promoted | `A11` as repaired | `ABC-017` `A13` fit-check | H | `4b` |
  |---|---|---|---|---|---|
  | delivered as budgeted 9/3/8 | PASS | PASS | PASS | 23 | yes |
  | M1 status ships 4 | **FAIL** | **FAIL** | **FAIL** | 24 | yes |
  | M2 history ships 9 | PASS | PASS | **FAIL** | 24 | yes |
  | M3 history ships 10 | PASS | PASS | **FAIL** | 25 | **no** |
  | M4 `renderBoard` ships 10 | PASS | PASS | **FAIL** | 24 | yes |
  | M5 board 10 **and** history 9 | PASS | PASS | **FAIL** | 25 | **no** |
  | M6 status 5 | **FAIL** | **FAIL** | **FAIL** | 25 | **no** |

  *(**What D8 claimed, and how much of it survives.** D8 added `A11` *"to protect `4b`"*, and the
  frame-level clause was how it meant to. Measured: **`A11` passes M3 and M5 — the only two of M1–M5
  that make `4b` unreachable — both BEFORE the strike and AFTER it.** Striking the clause therefore
  does **not** repair that blindness; **nothing written on this ticket can.** Both mutants move
  `history`, a term this panel must not name (`ADR-0009` clause 2) and cannot read (`ABC-017` is
  unbuilt when this ticket merges **first**), and the shadow-literal form that could name it passes
  all six — measured, and rejected as `ADR-0009` Alternative B.*

  ***So the honest statement, which replaces D8's:*** `A11` **protects `4b` against THIS panel's own
  row count and against nothing else.** That half is real and is worth the criterion: at
  `status` = 5 the frame is **25** rows (M6, measured), `beginFrameSession` finds `sink.rows >= height`
  false on a standard 24-row terminal, takes the **append** path, and `4b` — the in-place redraw with
  no stale rows — becomes unreachable with no test failing anywhere. `A11`'s `= 3` clause is what
  fails there. **The `history` and `board` halves of `4b`'s row budget are `ABC-017`'s `A13`, per
  `ADR-0009` clause 5 — see the flag in `## Definition of Ready`, because `ABC-017` is `P2` and this
  ticket merges without that cover.** A criterion that keeps claiming a protection it cannot deliver
  is worse than one that claims less: a reader stops looking.*

  ***The two added clauses, and the trap each closes.*** *`STATUS_ROWS` **is `3`** and **is the
  module's export**, read by import. Neither was stated: `A11` as promoted said only *"exactly
  `STATUS_ROWS` = 3 rows"*, which a build that returns 3 rows and **exports no constant at all**
  satisfies, with the test supplying its own `const STATUS_ROWS = 3` beside the assertion. That is not
  a hypothetical — **merged `src/frame.test.ts:38` does exactly that today**, labelled *"`ABC-016`'s
  stated constant"*, and the shadow form it demonstrates passes all six mutants above. The export is
  load-bearing twice over: `ABC-018`'s `frameHeight` consumes it as a session constant
  (`src/frame.ts:84`, `:211`), and `ABC-017`'s `A13` cannot read delivered geometry without it. **A
  local shadow makes this criterion an assertion about the test file.**)*
- **A12 — ASCII, unconditionally, on the panel's OWN rows. Given** every case above, **when** the
  panel renders, **then** the count of code points above `U+007F` in the panel's rows is **exactly
  0**.

  *(**[CORRECTED 2026-08-10 — D9.]** This read "Given glyph mode ASCII", which varied an input the
  panel does not have — see `## Scope`. Unconditional is the stronger and simpler criterion: it makes
  epic acceptance `2a` hold for this region **by construction rather than by vigilance**, the same
  move `src/render.ts:102` made when it kept both shading characters ASCII in both modes.
  **It must be asserted on the panel's returned rows and never through `assembleFrame`**, which
  strips those code points in ASCII mode (`src/frame.ts:106`) and would pass a panel that emits
  them.)*
- **A13 — the panel derives nothing, and this is a CALL COUNT. Given** any panel render, **when** the
  calls are **spied**, **then** `gameStatusOf`, `repetitionCounts` and `keyHistory` are called
  **exactly 0** times, `gameStatus` **exactly 0** times, `isInCheck` **exactly 1** time, `toSan`
  **exactly 1** time (**0** on an empty history), and the 64-square scan runs **exactly once**.

  *(**[ADDED 2026-08-10 — D1, D2.]** A count, not a clock, and the reason is this project's own
  record: `plans/nfr-catalog.md` has now moved a bar off the clock and onto a count three times
  — `NFR-005`'s predicate sub-bar, `NFR-001`'s `legalMoves`/`zobristKey` bars, and `ABC-009`'s
  guards — each time because a timing bar with an order of magnitude of headroom cannot fail on the
  regression it exists to catch. **This is the criterion that fails if anybody puts the repetition
  derive back into the panel**, and it fails at zero timing sensitivity.)*
- **A14 — the cost bar in *Security / NFR triggers* holds when measured**, at all three of its ply
  counts.

## Dependencies

- **`ABC-014`** — the board this panel sits above. *(**CORRECTED 2026-08-10 — D9.** This line read
  "the frame this panel is part of, and the `GlyphMode` type". The frame is `ABC-018`'s, not
  `ABC-014`'s, and this panel takes no `GlyphMode` — so **there is no import edge to `src/render.ts`
  at all.** What survives is real and is what `A11` stands on: `ABC-014`'s **9 rows** are the `board`
  term in `frameHeight`, and its snapshot shape is the one this panel's snapshots match. Merged on
  `main` 2026-08-08.)*
- **`ABC-013`** — `toSan`, for the last-move cell. *(**CORRECTED 2026-07-31**: this line read
  "`ABC-013` is `Blocked` on `ADR-0004`'s ratification, so this ticket inherits that wait." **That
  wait is over.** `ADR-0004` is `accepted` as of 2026-07-31 and `ABC-013` moved to `Ready` the same
  day, so nothing is inherited. `ABC-013` is a plain ticket dependency now. Read `ADR-0004`'s Status
  section before citing the ratification: it was made by the Orchestrator under a named, quoted
  delegation from Olger Oeselg, not by a human directly, and it is explicitly not precedent.)*
- **`ABC-012`** — the history supplies the last `Move` and the position before it.
- **`ABC-020`** — **added 2026-07-31; SATISFIED 2026-08-02.** Item 7 had nothing to render until the
  rules core reported a claimable set, and the constraint was merge-order: this panel must not be
  built against the old semantics, in which a threefold repetition is a completed draw and there is
  no claim to show. **`ABC-020` merged on `main` 2026-08-02, so the constraint is discharged and the
  `DrawClaims` shape this ticket now names is the merged one** (`src/gameend.ts:50-55`).
- `ABC-005` (`isInCheck`) merged on `main`.
- **`ABC-018`** — **added 2026-08-10 (D15); the binding site CORRECTED 2026-08-11 (D17).**
  `frameHeight` consumes this panel's row count as a **session constant** read once before the first
  frame (`src/frame.ts:84`, `:211`), and `assembleFrame` takes the panel's widest row as the frame's
  `W` (`:179`). Merged on `main` 2026-08-08; the edge is real and was unlisted. *(This line read
  *"`A11` is where it binds"*. **After `ADR-0009` clause 4 it does not.** `A11` now asserts this
  panel's own row count and the export `frameHeight` consumes; it asserts **nothing** about
  `frameHeight`'s output. **The edge binds at `ABC-017`'s `A13`**, which is where all three terms are
  read from delivered code. What this ticket owes `ABC-018` is the exported constant, not the
  identity.)*
- **`ABC-019`** — **added 2026-08-10 (D15), and it is a CONTRACT dependency, not a build-order
  one.** The loop supplies the thinking flag (it always did) and now also the `GameStatus`, which it
  already evaluates once per ply before rendering. **This ticket is not blocked on it**: both are
  parameters, and a test supplies them directly — the same posture `ABC-019` itself takes toward
  `EPIC-006`'s colour and glyph flags. What is owed is one line on `ABC-019`'s side saying its render
  seam passes the status it just computed; **flagged for the Orchestrator, not edited here.**
- **The board row's `blocked-until: ABC-013, ABC-014, ABC-020` is stale on all three** — `ABC-020`
  merged 2026-08-02, `ABC-014` 2026-08-08, `ABC-013` 2026-08-10. **Board hygiene, flagged not
  edited**: two agents share this branch and the Orchestrator makes board moves.

## Security / NFR triggers

> **[RE-DERIVED 2026-08-10 — D2. The old bar and its derivation are quoted below and refuted with
> measurement, not replaced quietly.]** It read: *"**panel compute ≤ 250 µs per frame** … one
> 64-square scan, one `isInCheck` (inside `legalMoves`'s measured 2.1–5.3 µs band), and one `toSan`
> (measured 4.31–4.45 µs). The expected total is well under 20 µs; the bar is set an order of
> magnitude above it."* **Three things are wrong with it and all three were measured.**
>
> 1. **It omits its own dominant term.** Item 7 was added on 2026-07-31 and this paragraph was not
>    reopened. `gameStatusOf(history)` measures **4.41 / 21.06 / 47.93 / 95.64 µs at 0 / 40 / 120 /
>    300 plies** — **91% of the panel's whole cost at 300 plies**, and it grows with game length.
> 2. **It over-states the one term it did price.** `isInCheck` is a single attack scan, not a
>    generation; it does **not** sit inside `legalMoves`'s band. Measured **0.06–0.11 µs**, i.e.
>    **30–50x cheaper** than the derivation claims.
> 3. **It has no ply denominator, so nothing about it is checkable.** A "per frame" number for a
>    quantity that is `O(plies)` names no measurement. `NFR-002`'s row has had to have a denominator
>    written into it twice already, and `NFR-005` and `NFR-001` once each.
>
> **As-written panel compute, measured end to end: 4.62 / 26.24 / 56.12 / 105.00 µs at 0 / 40 / 120 /
> 300 plies.** The stated estimate of *"well under 20 µs"* is exceeded from roughly **30 plies** —
> before the opening is over — and is **5.3x** out at 300 plies, a ply count epic acceptance `4a`
> names by number. The 250 µs bar itself is **not** breached today (0.42x at 300 plies), which is the
> one way this differs from `ABC-025`'s `N5`; growth is ~0.335 µs/ply and it would cross 250 µs at
> roughly **730 plies**, a reachable legal game length. **A bar that cannot fail on the regression it
> exists to catch is not a bar** — hence `A13`, which is a count.

- `NFR-002` (full redraw < 16 ms) — bar, in three parts, all on **Apple M3 (Mac15,13) / Node
  v24.12.0 / darwin-arm64**, **`UNKNOWN - verify` on any other hardware**:
  - **panel compute ≤ 25 µs at every one of 40 / 120 / 300 plies**;
  - **the three figures within 3x of each other** — the machine-independent half, and the same shape
    `ABC-017` carries for the same reason;
  - **the call counts of `A13`**, which is the part that actually binds.
- **Derivation, measured at this hop against merged `src/` rather than estimated** — item 7 as an
  input, which is what the bar is set against:

  | Term | 0 plies | 40 | 120 | 300 |
  |---|---|---|---|---|
  | item 2 `isInCheck` | 0.06 | 0.07 | 0.08 | 0.11 µs |
  | item 5 64-square scan | 0.15 | 0.18 | 0.15 | 0.13 µs |
  | item 4 replay to ply *n*−1 + `toSan` | 0.01 | 5.18 | 7.77 | 9.75 µs |
  | items 1, 3, 6 (field reads, a flag) | below resolution | | | |
  | item 7 (**an input**) | 0 | 0 | 0 | 0 µs |
  | **panel total** | **≈ 0.2** | **≈ 5.4** | **≈ 8.0** | **≈ 10.0 µs** |

  Worst cell **10.0 µs against the 25 µs bar (0.40x)**; the 40→300 ratio is **1.88x against 3x**.
  Nine rounds, medians of per-round means, discarded warm-up, `parseFen` inside the timed region
  where the panel would pay it. **This is BA/PM's own measurement and it is a TARGET, not a gate
  result** — the same label `ABC-017`'s bar carries. Security/NFR owns the verdict.
- **What happens if it does not bind, stated up front because `ABC-025` had to learn this the
  expensive way.** The absolute is the loose half by design; **`A13`'s counts are the tight half**,
  and they fail on the exact regression — a repetition derive reappearing inside the panel — at a
  cost of zero measurement precision. **A miss on any of the three parts is BA/PM's to rule on, not
  the gate's to accept and not the engineer's to absorb**, and a re-derivation of the bar is a valid
  ruling. Corroboration that the instrument is sane: `gameStatusOf` at 120 plies reads 47.93 µs here
  against `plans/nfr-catalog.md`'s independently measured 47.75 / 47.59 µs — 0.4%.
- ~~**`plans/nfr-catalog.md`'s `NFR-002` row is owed an update and this ticket adds a SECOND reason.
  Flagged, deliberately NOT edited** — that file is Architect/Design's and `ABC-026`'s hop is inside
  it right now.~~ **RULED, AND NO EDIT IS OWED TO THAT ROW — CORRECTED 2026-08-11 (D18).** *This flag
  read* **owed by Architect/Design** *and was stale. Both of its reasons were ruled at
  `refinement-ABC-026` on the day they were raised, and both dispositions were re-checked and upheld
  at `design-frame-contract` (2026-08-11):* **reason 1 — `EPIC-002` `[A2]`'s — is STALE** (the rewrite
  it asks for landed nine and a half hours after the flag did; the strike, with commit hashes, is on
  `ABC-017` and in `plans/nfr-catalog.md`'s `NFR-002` section), and **reason 2 — the structural note
  below — is CARRIED, deliberately not written into the row, because that file does not certify a
  ticket that has shipped zero lines.** The row is byte-identical and **Architect/Design owes it
  nothing on this ticket's account.**
  **The surviving obligation and its real owner: `Security/NFR`, at THIS ticket's own gate.** The
  row's `O(window)` boundary condition was verified **structurally** at `ABC-012`'s gate on the ground
  that *"`src/history.ts` has ZERO importers, so nothing pulled the repetition derive into a frame"*.
  **Item 7 as originally written was that importer**, and would have expired the verification on
  merge. As now specified the panel imports `GameHistory` as a **type only** and replays through
  `fen.ts` + `apply.ts`, so **the structural fact survives this ticket** — and the gate re-verifies it
  by `grep` on **delivered** code. **`A13` is this ticket's own half and does NOT discharge the
  gate's** (Architect/Design, `design-frame-contract`). *(Re-checked at this hop for information only:
  `src/history.ts` has exactly one importer today, `src/history.test.ts`.)*
- **The panel calls `isInCheck` a second time**, independently of the one `gameStatus` makes inside
  its zero-legal-moves branch. That is deliberate and at 0.06–0.11 µs it is free; it is the honest
  reading of criterion #3, which is about the rendered board and not about the terminal check.
- **No security trigger.** Every value rendered here is derived from `history.position`, from
  generator-owned `Move`s and from a `GameStatus` the rules core produced. No user-supplied string
  reaches this panel. *(It is not the panel's job to sanitize; `ABC-018` does it for the whole frame,
  and `A12` keeps this panel's own output ASCII regardless.)*

## Test notes

- **Write the material-balance test as a table of FENs with exact expected integers** (`A6`),
  including the promotion case. It is the one item where the obvious implementation (diff the board
  against the standard starting complement) is wrong in a way that looks right for the first twenty
  moves.
- **The move-number test needs the loaded-FEN case** (`A4`), not just the from-startpos case. The
  from-startpos case passes under the wrong implementation.
- **Assert the row count in both thinking states in the same test** (`A7`). A separate test per state
  will not catch the height change, which is the thing epic acceptance `4a` turns on.
- **[ADDED 2026-08-10] Assert `A12` on the panel's returned rows, never on an assembled frame.**
  `assembleFrame` strips code points above `U+007F` in ASCII mode, so a frame-level assertion is
  green on a panel that emits them.
- **[ADDED 2026-08-10] Take the `toFen` snapshot BEFORE the first render** (`A5`, `A10`). A snapshot
  taken between two renders is byte-identical across a panel that corrupts the board on every render.
- **[ADDED 2026-08-10] `A13` needs a spy, and a separate test file.** The lesson is
  `src/gameend.nfr.test.ts`'s, recorded in `plans/nfr-catalog.md`: a `vi.mock` factory is hoisted to
  file scope and would re-route the module graph for every test in the file, so the call-count
  assertions live in their own file (`src/status-panel.nfr.test.ts` beside the pattern already set by
  `gameend.nfr.test.ts`, `zobrist.nfr.test.ts`, `glyph-mode.nfr.test.ts`, `san.nfr.test.ts`).
- **[ADDED 2026-08-10] Building the 40 / 120 / 300-ply histories for `A14`: reuse `ABC-012`'s
  deterministic LCG game** (`src/history.test.ts:74-88`) rather than hand-writing a line. It is the
  same instruction `ABC-017` carries and it makes the two tickets' cost figures comparable.
- **[ADDED 2026-08-10] No wall-clock assertion goes into the suite.** This project's standing rule
  (`src/zobrist.nfr.test.ts:112`): the microseconds live in `plans/nfr-catalog.md` with their
  machine, and the suite pins the **counts**.
- Panel snapshots go beside `ABC-014`'s board snapshots and in the same shape, so the frame can later
  be snapshot as a whole.
- **[ADDED 2026-08-10] `ABC-017` needs the same replay this panel's item 4 needs** — to the window's
  first ply, where item 4 goes to ply *n*−1 — and at frame level the two will each pay their own
  `parseFen` and their own walk. Neither ticket's bar is broken by that (10.0 µs + ~75 µs against a
  16 ms frame), and **no shared helper is prescribed here**; it is recorded so that whoever builds
  the second of the two does not discover it as a surprise, and so that `ABC-018` knows the frame's
  compute is the sum and not the max.

## Size and priority rationale

**Size `M` (3), unchanged by the 2026-07-31 amendment.** Six small items — now seven — but four of
them have a correctness trap that has already been identified (move number from FEN, material after
promotion, `isInCheck` semantics, the invariant row count) and each needs a named test. The code is
short; the panel is where several quiet wrong answers would live. Calibrated against `ABC-007` (`M`)
and above `ABC-006` (`S`). Item 7 is a read off a value `ABC-020` computes plus one cell and one
row-count assertion; it does not move a 3 to a 5.

**Re-derived 2026-08-10 and still `M` (3) — the amendment moved work in both directions and the net
is zero.** *Added*: three criteria (11 → 14), a spied call-count test in its own file, an exported
`STATUS_ROWS`, and a named replay for item 4. *Removed*: the `gameStatusOf` call and everything that
hung off it — the panel no longer touches the repetition machinery at all, which is the single
largest piece of work the ticket previously implied. The added criteria are assertions over the same
seven cells, not new behaviour. It sits with `ABC-007`, `ABC-013` and `ABC-014` — all `M`, all one
short module with several traps — and above `ABC-018` (`S`). **Not `L`:** no chess logic, no new
rules, one module, and the one genuinely fiddly derivation (the position before the last move) is
eight lines of replay whose cost is measured.

**Priority `P1`, and deliberately unmoved on 2026-07-31.** The owner's legality-first directive
argues both ways on this ticket and the two cancel: item 7 is a **rules affordance** — without it no
player ever learns a FIDE 9.2/9.3 claim is available — while items 1-6 are renderer work, which the
directive ranks below rules work. It carries epic acceptance #3, so the epic is not done without it,
and the game is playable with a board and a loop alone. `P1` remains the honest rank; what changed is
that it now has a `P0` merge-order dependency (`ABC-020`) it did not have before.

**Re-read 2026-08-10 and still `P1`.** The `ABC-020` merge-order dependency is **discharged**, which
removes the only thing that had changed since the last re-read. The legality-first argument is
untouched: item 7 is still the only surface on which a FIDE 9.2/9.3 claim becomes visible, and items
1–6 are still renderer work. **Not `P0`** — the game runs with a board and a loop — and **not `P2`**,
because epic acceptance #3 lives here and `EPIC-002` cannot close without it. It is the
highest-priority unblocked item on this board, which is why it was scheduled; that is a scheduling
fact and not an argument for moving the rank.

**Re-read 2026-08-11 at the `ADR-0009` repair hop and still `M` (3) / `P1`.** The repair **removed** a
criterion clause and **added** two clauses to a criterion that already existed; it added no cell, no
input, no module and no test file. **`A11` is now cheaper to satisfy than it was**, because it no
longer requires the test file to compose a frame height. The size arguments above are untouched. `P1`
is untouched: nothing in `ADR-0009` moves epic acceptance #3, and the new flag in
`## Definition of Ready` is a **merge-order** fact for the Orchestrator, not a value change here.

## Definition of Ready

**RE-DERIVED IN FULL 2026-08-10 by BA/PM against `agent-factory/checklists/definition-of-ready.md`.
The Orchestrator's pre-check named two problems and said two was a floor. It was: sixteen, of which
fourteen were named by nobody.** The state **before** this amendment is recorded beside the state
after it, because a DoR block that only ever says ✅ is what let two of these through on 2026-07-31.

| # | Check | Before | After |
|---|---|---|---|
| 1 | problem clear | ✅ | ✅ |
| 2 | scope and out-of-scope clear | ⚠️ D8 D9 D14 | ✅ |
| 3 | INVEST | ⚠️ D1 (*independent* — item 7 made two `ABC-019` criteria false) | ✅ |
| 4 | acceptance testable and measurable | ❌ D4 D5 D6 D7 D10 D11 D12 | ✅ 14 criteria, exact strings |
| 5 | dependencies known | ⚠️ D15 (`ABC-018`, `ABC-019` missing) | ✅ |
| 6 | security/NFR triggers, measurable | ❌ D2 D3 (bar omitted its dominant term) | ✅ measured, 3 parts |
| 7 | test notes present | ⚠️ (no ply-indexed cost note, no spy note) | ✅ |
| 8 | size assigned | ✅ | ✅ `M`, re-derived |
| 9 | priority assigned | ✅ | ✅ `P1`, re-read |
| 10 | no major unresolved blocker | ✅ | ✅ every dependency merged |

**RE-DERIVED AGAIN 2026-08-11 by BA/PM at task `repair-panel-tickets` (Workflow 07), applying accepted
`ADR-0009`. The 2026-08-10 block above claimed ✅ on item 4 and it was WRONG — `A11` was defective as
promoted, and no reader of that block could have known.** That is the third time on this board that a
DoR self-assessment has certified a criterion a mutant walks through, so the column below is the state
at the *promoted* text, not at the 2026-07-31 text.

| # | Check | At promotion (2026-08-10) | After the `ADR-0009` repair |
|---|---|---|---|
| 1 | problem clear | ✅ | ✅ unchanged |
| 2 | scope and out-of-scope clear | ⚠️ D17 — `## Scope`'s `N`-sweep implied a frame-level claim this panel may not make | ✅ scoped to `STATUS_ROWS`; `ADR-0009` cl. 2 stated |
| 3 | INVEST | ⚠️ D17 — *independent* was false as promoted: `A11` named `history: 8`, `ABC-017`'s number | ✅ zero cross-ticket coupling, in production and in test; goes green alone |
| 4 | acceptance testable and measurable | ❌ **D17** — `A11` PASSES M2–M5, incl. **both** mutants that make `4b` unreachable, and its `STATUS_ROWS` had no stated provenance | ✅ 14 criteria; `A11` re-measured on 7 mutants, provenance pinned, purpose stated honestly |
| 5 | dependencies known | ⚠️ D17 — the `ABC-018` line named `A11` as the binding site; after the strike it is not | ✅ binding site corrected to `ABC-017`'s `A13` |
| 6 | security/NFR triggers, measurable | ⚠️ **D18** — the `NFR-002` flag read *owed by Architect/Design* and had been ruled the day it was raised | ✅ ruled; surviving half re-homed to Security/NFR at this gate |
| 7 | test notes present | ✅ | ✅ unchanged — the struck clause needed no note |
| 8 | size assigned | ✅ `M` | ✅ `M`, re-read; the repair only removes work |
| 9 | priority assigned | ✅ `P1` | ✅ `P1`, re-read |
| 10 | no major unresolved blocker | ✅ | ✅ every dependency merged; three flags carried, each with an owner, none blocking |

**Every ✅ in the right-hand column was verified against merged `src/` at this hop, not argued.** The
seven-mutant table under `A11` was **re-run** rather than transcribed from Architect/Design's notes,
`4b` reachability was taken from `beginFrameSession`'s own strategy choice on a 24-row TTY rather than
from arithmetic, and the `NFR-002` disposition was read in `plans/nfr-catalog.md` rather than taken on
trust. **Zero production lines: `src/` is byte-identical to `main`.**

**What this hop deliberately did NOT do.** It did not re-litigate `ADR-0009` (accepted). It did not
edit `plans/board.md` (the Orchestrator's), `plans/nfr-catalog.md` or `memory-bank/50-decisions/` (a
concurrent Architect/Design hop's this wave). It did not move size or priority. And it did **not**
invent a way for `A11` to catch M3/M5 — that is structurally impossible on this ticket and pretending
otherwise is the defect, not the fix.

**Flags carried forward rather than closed, each named with an owner, none blocking:**

- ~~**`plans/nfr-catalog.md`'s `NFR-002` row** — owed a rewrite for two reasons now (`EPIC-002` `[A2]`
  and this ticket's structural note). **Owner Architect/Design**, and that role is inside the file on
  `ABC-026` today.~~ **CORRECTED 2026-08-11 — D18: this flag was STALE when it was written here.**
  It is **ruled**, no edit is owed to the row, and Architect/Design owns nothing on this ticket's
  account. What survives is **`Security/NFR`'s, at this ticket's own gate** — a `grep` for importers
  of `src/history.ts` on delivered code, which `A13` does not discharge. Full disposition, with both
  reasons and who ruled them, is in `## Security / NFR triggers`. Not blocking: this ticket's bar
  lives here, with its machine.
- **`ABC-010` (FEN semantic validation), `Backlog`** — item 2 is honest about a loaded position in
  which the side *not* to move is in check, and it is `ABC-010` that makes such a position
  unreachable. **Carried, not owned**, exactly as `ABC-019` carries the same class. Not blocking:
  nothing supplies a FEN to this panel until `EPIC-003`.
- **NEW 2026-08-11 — `4b`'s row budget is only half-covered while this ticket is the only panel
  merged, and the other half rides on a `P2` ticket. Owner: the Orchestrator.** `ADR-0009` clause 5
  puts the composition fit-check on whichever panel merges **second** — `ABC-017`, `P2`, whose own
  `## Size and priority rationale` calls it *"the right thing to drop first if this epic runs long."*
  Measured at this hop: between this ticket's merge and `ABC-017`'s, the only delivered-code guard on
  `4b`'s 24-row budget is `A11`'s own `= 3` clause, which catches a `status` change (M1, M6) and is
  blind to a `history` or `board` change (M2–M5, including **both** mutants that push `H` to 25). **If
  `ABC-017` is dropped, deferred or resequenced, `A13` must be re-homed** — to `ABC-019`, which
  composes the real panels, or to a ticket of its own. Not blocking this ticket: it cannot write that
  check (`ABC-017` is unbuilt when it merges) and `ADR-0009` clause 2 forbids it naming the term.
  **Flagged, not taken — merge order and board moves are the Orchestrator's.**

**PROMOTED `Backlog` → `Ready` 2026-08-10 by BA/PM** (task `refinement-ABC-016`, subtask
`refinement-ABC-016-bapm`, Workflow 07). `Ready` goes 0/8 → 1/8; no limit approached, no override
taken. **The board move itself is the Orchestrator's** — two agents share this branch — and the exact
row text is in this hop's decision note. **Nothing under `src/` was written, nothing was committed,
nothing merged, nothing deployed.**
