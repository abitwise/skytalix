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

> **AMENDED 2026-08-11 by BA/PM at task `refinement-ABC-016-qe-gaps` (Workflow 07), ruling on the
> SEVEN CRITERION GAPS QE returned with `PASS_WITH_RISKS`. ZERO code defects; the criteria are
> INCOMPLETE, not unmet, and `A1`–`A14` all hold.** Every gap was **re-measured here, not inherited**
> — and two of QE's own proposed closes were measured and found **insufficient**. **This matters more
> than a normal refinement because `ABC-016` merges FIRST of four (`ABC-016` → `ABC-017` → `ABC-027`
> → `ABC-019`): these criteria become the net the other three are built on.**
>
> | # | Defect | Where |
> |---|---|---|
> | D20 | **`A7` measures the wrong quantity, and the `thinking` flag is crossed with no CONTENT anywhere.** The width clause compares the panel's WIDEST row; row 3 is 11 chars and the widest is row 2 at 21, so dropping the reserved cell entirely leaves `widestOf` at **21 === 21** and `D7`'s own target build passes. Separately, every content criterion is asserted at `thinking: false` only, so the flag can gate any cell | Acceptance `A7` |
> | D21 | **Five piece values are stated as exact integers and only PAWN and QUEEN are pinned.** `A6`'s three FENs vary pawns and queens alone; `KNIGHT`, `BISHOP` and `ROOK` are invisible to every criterion | Acceptance `A6` |
> | D22 | **`A13`'s two counting clauses state no PLY DEPTH**, so both are measured at 0 and 1 ply and a second derive that starts at ply 2 passes them — on the clause `## Security / NFR triggers` calls *"the part that actually binds"* | Acceptance `A13` |
> | D23 | **`check` is never crossed with a claimable draw**, though the state is reachable and the delivered panel renders it correctly | Acceptance `A2` |
> | D24 | **`A9` cannot fail on a panel that INFERS the claimant**, because `src/gameend.ts:170` derives `claimable.by` from the same `position.blackToMove` such a panel would read. `D17`'s class again | Acceptance `A9` |
> | D25 | **The last-move cell's entire tested vocabulary is four strings**, none needing a SAN disambiguator, so a panel handing `toSan` an empty legal list renders `last: Nxd4` for `Nexd4` and passes everything | Acceptance `A5` |
> | D26 | **Four stale-rationale sites and one flag that is already discharged.** Two are under `src/` and are the dev hop's; one was named by nobody | Acceptance `A7`, DoR, Test notes |
>
> **THE TWO CLOSES QE PROPOSED THAT DO NOT WORK, both measured here rather than argued.**
>
> 1. **`G1`: "`CASES` gains a `thinking: true` variant of the in-check case" kills ONE of the five
>    thinking-axis wrong builds, not three.** Measured: that entry is swept only by `A10`, `A11` and
>    `A12` — purity, row count and ASCII — and **no criterion that iterates `CASES` asserts CONTENT**.
>    So it kills `m37` (non-ASCII in the check cell while thinking, via `A12`) and leaves `m06`
>    (`CHECK` dropped while thinking, **378/400 games diverge** — the sharpest build in the report),
>    `m29` (claim cell dropped) and `m46` (side-to-move cell dropped) alive at every criterion. Each
>    would die only to a snapshot, and QE's own verdict on snapshots is *"a genuine regression net and
>    a poor criterion"*, discharged by a single `-u`. **The ruling replaces `A7`'s width clause with
>    one that kills all five and needs no new `CASES` entry at all** — see `A7`.
> 2. **`G3`: "one FEN closes all three" is true of each single mutant and false of the class.**
>    Measured: a position down `R+N+B` reads `material: +11` and each of `KNIGHT=4`, `BISHOP=4`,
>    `ROOK=6` reads `+12`, so each dies — but a **compensating** `KNIGHT=4, BISHOP=2` reads
>    `4+2+5 = +11` and **survives**. Three single-removal rows read `+3 / +3 / +5` and kill it on the
>    first. The ruling takes three rows in a table that already exists.
>
> **What each defect costs the code: NOTHING. What it costs the TESTS: a dev hop, and that is the
> ruling.** Every close is a test addition or a comment repair and **two of the repairs are under
> `src/`**, which BA/PM may not write. Landing the criteria text alone would leave this ticket
> claiming coverage it does not have on the hop where it becomes three other tickets' net — which is
> `D17`'s fault exactly. **`In Review` → `In Development`, requested in this hop's notes.** The work:
> **2 new `CASES` entries, 3 `A6` rows, 1 rewritten `A7` clause, 1 `A5` case, 1 `A9` case, 2 ply
> depths, 1 test-only `> 0` line, 3 comment repairs, regenerated snapshots. ZERO production lines** —
> every added case was rendered against the delivered panel at this hop and goes green on the code as
> it stands.
>
> **`ADR-0010` is NOT re-opened and NO constant-width criterion is added.** Clause 5 refuses one, QE
> did not ask for one, and neither does this. The replacement `A7` clause compares **two renders of
> the SAME position and history** at different `thinking` values; it says nothing about width across
> different positions, names no frame-level term and names no row index — so `ADR-0009` clause 2 and
> `ADR-0010` clauses 2 and 5 are all untouched, and clause 5's *"row-3 content does not jump
> horizontally"* is delivered **without pinning a layout this ticket deliberately leaves to the
> engineer**.
>
> **Size `M` and priority `P1` both re-derived a FIFTH time and both unmoved; NOT `XL`, so
> `SPLIT_REQUIRED` does not apply.** `plans/board.md` **not edited** and the front matter deliberately
> still reads `In Review` — the board move is **requested** in this hop's notes. `src/`, `ABC-017` and
> `ABC-019` **not touched**; a BA/PM agent is live on `ABC-017` and QE on `ABC-019`, and no channel to
> either was opened.

> **AMENDED 2026-08-11 by BA/PM at task `refinement-ABC-016-a13` (Workflow 07), ruling on `A13`.
> TWO ACCEPTANCE DEFECTS ON A DELIVERED, GATED-GREEN TICKET SITTING IN `In Review`.** The
> Orchestrator routed one of them here; the second was found by checking the rest, which this board's
> record says to do. **The ruling sends the ticket BACK to `In Development` for one added test case —
> a deliberate backward move, not a failure** (precedent: `ABC-009`, `Ready for UAT` → `In Review`).
>
> | # | Defect | Where |
> |---|---|---|
> | D19a | **`A13`'s `isInCheck` clause is unsatisfiable by any correct build.** It demands `isInCheck` **exactly 1** *and* `toSan` **exactly 1**, but `toSan`'s `suffix()` calls `isInCheck` unconditionally at **`src/san.ts:104`** — merged code this ticket does not own — so the render's total is **1 on an empty history and 2 from the first move onward** | Acceptance `A13` |
> | D19b | **`A2` and `A6` are blind to a build that reads the check indicator or the material balance from the REPLAY position.** Measured over all 14 cases: every in-check case has an **empty move list** and every played case is **quiet and capture-free**, so nothing on the ticket exercises items 2, 4 and 5 together on a game reached by play | Acceptance `A2`, `A6`, Test notes |
>
> **`A13` was re-measured here, not inherited.** The unsatisfiability was re-spied out of tree
> independently of the engineer's test and of the Orchestrator's source read, and `src/san.ts:104`
> and `src/legal.ts:42-55` were read at source. **The ruling is neither of the two obvious
> amendments.** Stating the total as *"1 empty, 2 thereafter"* would make this ticket **restate a
> number `src/san.ts` owns** — the exact fault `ADR-0009` clause 1 names and that `A11`'s struck
> `frameHeight(...) is 23` clause was struck for. Dropping the clause would lose the only thing on
> this ticket that catches a panel asking the board about check twice. **So the clause now pins the
> panel's OWN call in two ways that name no other module's count**: directly on an empty history,
> where the panel is the render's only caller, and by difference against a bare `toSan` baseline on
> any longer one.
>
> **What each defect costs the code, stated separately, because they are not the same answer:**
>
> - **`D19a` costs NOTHING.** `src/status-panel.ts` was already correct and **both halves of the new
>   clause are already asserted by delivered `src/status-panel.nfr.test.ts`** (`:130-132` and
>   `:140-149`). The engineer's delivered test stops being a stated departure from the criterion and
>   becomes the criterion. **The engineer flagged this and did not amend the ticket — the correct
>   call**, and the amendment is made here where it belongs.
> - **`D19b` costs ONE TEST CASE and no production line.** `1.e4 e5 2.Qh5 g6 3.Qxe5+` renders
>   correctly on the panel as it stands — measured — so the added case goes green on delivered code.
>   It is unwritten, so **the ticket is not done**, and that is why it goes back.
>
> **One new flag falls out, and it is neither of the above:** this panel's **width** is not constant
> — measured **17** columns quiet against **67** with both claims — while `src/frame.ts:179` makes
> the frame's `W` the widest panel row and `ERASE_TO_END_OF_SCREEN` cannot clear to the right of a
> row. `ABC-017` already carries a constant-width criterion for a **3**-column swing. **Not taken
> here**: the two available fixes are a product decision, not a wording one. See
> `## Definition of Ready`.
>
> **Size `M` and priority `P1` both re-derived a fourth time and both unmoved; NOT `XL`, so
> `SPLIT_REQUIRED` does not apply.** **Zero production lines; `src/` byte-identical to the delivered
> branch tip.** `plans/board.md` **not edited**, and this file's **front matter deliberately still
> reads `In Review`** — `git log` shows `status:` / `column:` have only ever moved in the
> Orchestrator's own `docs(board):` commits, in the same commit as the board row, and front matter
> must never lead the board. The move is **requested** in this hop's notes.

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
  **And given the check reached BY PLAY** — from the starting position through
  `1.e4 e5 2.Qh5 g6 3.Qxe5+`, i.e. the ply list `e2e4 e7e5 d1h5 g7g6 h5e5` (Black to move, in check,
  **3 legal replies, game in progress** — measured) — **then** the panel contains `CHECK`, and in
  that same render `Black to move`, `3...`, `last: Qxe5+` and `material: +1`.

  **And given `4k3/8/8/8/8/8/8/4R1K1 b - - 100 60` with an empty move list** — Black to move, **in
  check**, and with a **fifty-move draw claimable** (measured status
  `{by:"black", draws:["fifty-move"]}`) — **then** the panel contains **both** `CHECK` **and**
  `Black may claim: fifty-move rule` in the same render, and it has exactly `STATUS_ROWS` rows.

  *(**[ADDED 2026-08-11 — D23.]** `check` had never been crossed with `claimable` anywhere on this
  ticket, and a build that suppresses `CHECK` whenever a draw is claimable passed every criterion and
  every snapshot. **The state is reachable, not contrived** — it is the fifty-move position of `A8`
  row 2 with the king put in check by the same rook — and the delivered panel already renders it
  correctly. Measured at this hop:*
  ```
  "Black to move  60...  CHECK"
  "material: +5"
  "             Black may claim: fifty-move rule"
  ```
  *It is worth stating why a random corpus will not find this: QE's 400 seeded 80-ply games produced
  **2,138** in-check renders and **zero** claimable draws, so the pair has to be constructed. **This
  case also belongs in `CASES`**, so `A7`, `A10`, `A11` and `A12` sweep it and it gets a snapshot.
  **Costs no production change** — measured green on the panel as it stands.)*

  *(**[ADDED 2026-08-11 — D19. This is the fourth wrong build this criterion has had to be widened
  to kill, and the gap was in the criteria SET rather than in any one criterion's words.]* **Measured
  over all fourteen cases this ticket names: every case that is in check has an EMPTY move list, and
  every case with a move played is quiet and capture-free.** So both the check indicator (item 2) and
  the material balance (item 5) were pinned only on positions that never went through item 4's
  replay, and **a build that read either of them from the REPLAYED position — the one `lastMoveSan`
  is already holding, which is the natural shortcut for an engineer who has a `Position` in hand —
  passes every criterion as they stood.** Measured at this hop on merged `src/`: at the case above
  the replay position is `rnbqkbnr/pppp1p1p/6p1/4p2Q/4P3/8/PPPP1PPP/RNB1KBNR w KQkq - 0 3`, **White**
  to move and **not** in check, so that build renders **nothing** here while the correct one renders
  `CHECK`. This is also **the only case on the ticket in which a capture has occurred**, which is
  what pins the balance to the live board rather than to the replay, and it is the only one that
  exercises items 2, 4 and 5 together on a game reached by play. **Epic acceptance #3 is about a
  played game; until this case, nothing on this ticket proved the indicator on one** — and this
  ticket's own `D13` correction turns on precisely the loaded-FEN/played-position distinction.
  **Costs no production change: the delivered `src/status-panel.ts` already renders this case
  correctly — measured — so the added case goes green on the code as it stands.**)*

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

  **And given a last move that NEEDS A SAN DISAMBIGUATOR** — `4k3/8/8/8/3p4/8/2N1N3/4K3 w - - 0 1`
  (white knights on **c2 and e2, both able to capture on d4**) played through the single ply `e2d4` —
  **then** the panel contains **`last: Nexd4`**, with the file letter, and does **not** contain
  `last: Nxd4`.

  *(**[ADDED 2026-08-11 — D25.]** The whole tested vocabulary of this cell was four strings — `Nf3`,
  `e4`, `e5`, `Qxe5+` — plus the empty-history negative, and **not one of them needs a
  disambiguator**. A build that hands `toSan` an **empty legal list** silently disables every
  disambiguator and passed all three nets while diverging on **218 of 400 games**. Measured at this
  hop on the FEN above: the delivered panel renders `last: Nexd4` and that build renders
  `last: Nxd4`.*

  ***This is the panel's defect and not `ABC-013`'s, and the ticket's own counter-argument is only
  half right.*** *`ABC-013` owns whether `toSan` is correct; **this ticket owns whether the panel
  CALLS it correctly**, and the empty legal list is a defect in the call. That is also why exactly
  **one** case is added and not four: a castle, a promotion and an en-passant capture were rendered
  at this hop and are correct (`last: O-O`, `last: a8=Q+`, `last: exd6`), but they exercise `toSan`'s
  body rather than the panel's call shape and would duplicate `ABC-013`'s own coverage. **The
  disambiguator is the one that discriminates; the other three are bloat and are declined.** This
  case also belongs in `CASES`. **Costs no production change.**)*

  *(**[ADDED 2026-08-10 — D12.]** The last clause is the criterion, not a nicety. Measured at this
  hop: `toSan(history.position, lastMove)` — SAN against the position *after* the move — returns the
  **correct** string `Nf3` and leaves the live board permanently corrupted with a phantom knight
  (`…/RNBQKB1R` → `…/RNBQKBNR`). A content-only assertion passes it. Only a `toFen` snapshot taken
  before the first render catches it, which is why the snapshot's timing is written into the
  criterion.)*
- **A6 — material balance, as a table of exact integers.**

  | FEN | Contains | Pins |
  |---|---|---|
  | `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1` | `material: 0` | the zero |
  | `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNB1KBNR w KQkq - 0 1` | `material: -9` | `QUEEN` |
  | `rnbqkbnr/pppppppp/8/8/7Q/8/PPPPPPP1/RNBQKBNR w KQkq - 0 1` | `material: +8` | `QUEEN − PAWN`, so `PAWN` |
  | `r1bqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1` | `material: +3` | **`KNIGHT`** |
  | `rn1qkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1` | `material: +3` | **`BISHOP`** |
  | `1nbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQk - 0 1` | `material: +5` | **`ROOK`** |

  *(**[ADDED 2026-08-11 — D21. Three rows, and the reason there are three rather than one.]** `D10`
  added the value table because *"five exact integers were quoted and none of them was defined"*.
  They were defined and then **only two of them were pinned**: the first three rows vary pawns and
  queens alone, so `KNIGHT`, `BISHOP` and `ROOK` were invisible to every criterion and to every
  snapshot — a `KNIGHT = 4` build diverges on **325 of 400 games** and passed all three nets. The
  three added rows each remove **one** black piece from the starting complement and pin that piece's
  value on its own, given `PAWN` and `QUEEN` from the rows above. All six measured at this hop
  against merged `src/`; the castling field of the `ROOK` row is `KQk` because removing the a8 rook
  removes Black's queenside right, and `parseFen` accepts it.*

  ***Why not the single joint FEN that was available.*** *A position down `R+N+B` reads
  `material: +11`, and `KNIGHT=4`, `BISHOP=4` and `ROOK=6` each read `+12` there, so one row does
  kill each of the three named mutants. **It does not kill the class**: a compensating
  `KNIGHT=4, BISHOP=2` reads `4+2+5 = +11` and survives it, while the three rows kill it on the
  first. One row also does not say WHICH integer is wrong when it goes red, and it is measurably
  harder to check by eye — the joint FEN was mis-built twice at this hop before it read `+11`. Three
  rows in a table that already exists, iterated by a test that already loops, is the cheaper of the
  two once the second failure mode is counted.*

  ***`KING` stays unpinned, and that is a proof rather than an omission.*** *Its value is
  unobservable — both sides always have exactly one, and `parseFen` refuses any position where they
  do not (`"position must have exactly one white king, found 0"`, measured). A `KING = 9` build
  diverges **0** times in 400 games. The ticket says the king's value is unobservable and the ticket
  is right; **after these rows, all five observable integers are pinned and the sixth is provably
  unpinnable.**)*

  *(The first three measured at this hop under P 1 · N 3 · B 3 · R 5 · Q 9 · K 0. The third is the
  promotion case — white is one pawn short and one queen up — and it is the one a board-diff against
  the standard starting complement gets wrong; a 64-square scan gets it right. It is a constructed
  position rather than one reached by play, which is legitimate because the panel is a pure function
  of the board and `parseFen` accepts it.)*
- **A7 — `thinking` changes the thinking cell and NOTHING else, on EVERY case. Given** the thinking
  flag true, **then** the panel contains `thinking...`; **given** it false, **then** it does **not**.
  **And given every case in `CASES`, rendered twice — once with the flag true and once with it
  false — then** replacing the substring `thinking...` in the busy panel with a run of **spaces of
  the same length** yields a panel **byte-identical** to the idle one, row for row.

  *(**[CORRECTED 2026-08-10 — D7. The width clause REPLACED 2026-08-11 — D20, and the criterion is
  now swept over `CASES` rather than over one position.]** The struck clause read *"the two panels
  have an **identical row count** and an **identical widest-row width**"*. The row-count half
  survives inside byte-identity; **the widest-row half could not fail on the build `D7` added it to
  catch**, and that was measured at `A7`'s own fixture rather than argued:*

  ```
  busy ["Black to move  1...", "last: e4  material: 0", "thinking..."]   widest = 21
  idle ["Black to move  1...", "last: e4  material: 0", "           "]   widest = 21
  row 3 is 11 in both states, and row 3 is NEVER the widest row here
  if the idle cell were DROPPED entirely, widest would still be          21
  ```

  *`A7` compared the panel's **widest** row; the quantity the reservation moves is the **thinking
  cell's own**. Row 2 is the widest row and does not vary with `thinking`, so the cell dropped
  entirely — verbatim `D7`'s target — read `21 === 21` and passed `A7` and every other criterion,
  dying only to snapshots. (`A7` was not inert: it killed a build that drops the **material** cell
  while thinking, because material sits on the widest row. **Catching a shrinking cell iff that cell
  happens to be the widest is not a property any criterion states.**)*

  ***The replacement is stronger than a width comparison and it closes a second gap at the same
  time.*** *`thinking` was an INPUT that no criterion crossed with any CONTENT: every content
  criterion is asserted at `thinking: false`, so the flag could gate any cell. Measured at this hop,
  the five wrong builds on that axis against the two candidate closes:*

  | build | `CASES` gains a thinking+in-check entry | **this clause** |
  |---|---|---|
  | `m06` drops `CHECK` while thinking (378/400 diverge) | **survives** | **KILLED** |
  | `m23` idle thinking cell dropped (`D7`'s target) | **survives** | **KILLED** |
  | `m29` drops the claim cell while thinking | **survives** | **KILLED** |
  | `m37` emits `U+2718` in the check cell while thinking | KILLED (`A12`) | **KILLED** |
  | `m46` drops the side-to-move cell while thinking | **survives** | **KILLED** |

  *The `CASES`-entry close was QE's and it kills **one** of the five, because the three criteria that
  iterate `CASES` assert purity, row count and ASCII — **none of them asserts content**. This clause
  renders **every** case in **both** states, so no new `CASES` entry is needed for the thinking axis
  at all, and it subsumes the row-count and per-row-width properties by byte-identity. Verified green
  on the delivered panel for every case, including the two this amendment adds.*

  ***What it deliberately does NOT say, because `ADR-0010` is accepted and is not re-opened.*** *It
  names **no frame-level term, no row index and no width across different positions.** It compares
  two renders of the **same** position and history, which is exactly `ADR-0010` clause 5's surviving
  rationale — *"`A7` is now a legibility clause (the row-3 content does not jump horizontally)"* —
  delivered **without** pinning the row-3 layout, which `## Acceptance` leaves to the engineer
  (*"the cell strings are pinned; the LAYOUT is not"*, epic acceptance `4a`). **It is NOT a
  constant-width criterion**: `ADR-0010` clause 5 refuses one, QE did not ask for one, and this is
  not one — the panel's width is still free to vary between positions, which under clause 1 it does
  by design. The stale justification that a shrinking cell "makes the whole frame breathe" is struck
  here; after `ADR-0010` clause 1 the consumer clears and that is the writer's job. **The same
  sentence survives in two places under `src/` and is the dev hop's — see `## Test notes`, D26.**)*
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
- **A9 — the claim is READ from `status.claimable.by` and is never inferred from the board. Given**
  `6k1/5ppp/8/b7/8/8/5PPP/4R1K1 b - - 100 60` — the same position with the side to move flipped —
  **when** the panel renders, **then** it contains `Black may claim: fifty-move rule`.

  **And given the one input shape that separates READING from INFERRING** — the position
  `6k1/5ppp/8/b7/8/8/5PPP/4R1K1 w - - 100 60`, which is **White** to move, handed a `GameStatus`
  whose claimant **disagrees** with it, `{ claimable: { by: "black", draws: ["fifty-move"] } }` —
  **then** the panel contains `Black may claim: fifty-move rule` and does **not** contain
  `White may claim`.

  *(**[ADDED 2026-08-11 — D24.]** The parenthetical below claims two protections and the criterion
  could only ever deliver one. It kills the *"you"* half — a build rendering `"You may claim:"` dies
  on `A8` and `A9`. It **could not** kill the inferring half, and the reason is structural rather
  than statistical: **`src/gameend.ts:170` derives the claimant from the same field the inferring
  panel would read** —*

  ```ts
  claimable: { by: position.blackToMove ? "black" : "white", draws }
  ```

  *— so against any status the rules core actually produces, the two builds are **definitionally
  identical**, and an inferring build diverged **0** times in 400 games. This is `D17`'s class
  exactly, and `D17`'s remedy was to state what the criterion protects and stop claiming the rest.*

  ***Here it is closeable rather than only strikeable, and the closing case was built and measured at
  this hop.*** *The added input is **constructed and is NOT producible by merged `gameStatusOf`
  today** — stated in the criterion so no reader mistakes it for a reachable game state, which is the
  `D13` honesty this ticket already had to apply once. It is nonetheless the right criterion and not
  a contrivance: `by` is a **required field of the public `DrawClaims` interface**
  (`src/gameend.ts:50-55`), `status` is a **parameter this panel does not derive**, and `ABC-021`
  will add a second producer of claims. The panel's stated contract is *"`status.claimable.by` is
  that attribution, and it is a required field precisely so the panel cannot infer it"* — this case
  is that sentence made falsifiable, at the one moment it is free, on the ticket that merges first.
  Measured: the delivered panel renders `Black may claim: fifty-move rule` on a White-to-move board;
  an inferring panel renders `White may claim`. **Costs no production change.**)*

  *(This is `ABC-020` `A7`'s rule surfacing in the frame: a panel that renders "you" or infers the
  claimant from anything but `status.claimable.by` reproduces the exact defect `ABC-020` exists to
  fix, and it does so on the engine's plies where nobody is watching.)*
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
  **exactly 0** times, `gameStatus` **exactly 0** times, `toSan` **exactly 1** time (**0** on an
  empty history), the 64-square scan runs **exactly once**, and **the panel makes exactly 1
  `isInCheck` call of its OWN** — asserted in **both** of the two ways below, because neither alone
  is enough:
  - **directly, on an empty history:** the render's **total** spied `isInCheck` count is **exactly
    1**. `toSan` is not called there (the clause above pins that), so the panel is the render's only
    caller and the total **is** its own count. **This clause names no other module.**
  - **by difference, on a history of AT LEAST TWO MOVES:** the render's **total** spied `isInCheck`
    count, **minus** the count that a bare `toSan(position, lastMove)` makes on the **same move**
    against the **same position the panel replays to**, measured in the same file, is **exactly 1**.

  **and both counting clauses are measured at a ply depth of AT LEAST 2**, the scan clause stated
  ply-independently: **the spied `squareAt` count for one render is `64` plus the number of occupied
  squares in `history.initialFen`**, at **every** depth asserted.

  *(**[ADDED 2026-08-11 — D22. The DEPTH is what is new; the arithmetic of both clauses is
  unchanged and both were already correct.]** The 2026-08-11 ruling that rewrote this clause fixed
  what it **counts** and left what it counts it **on** unstated — and an unstated depth defaults to
  whatever fixture is nearest, which was **one ply**. Measured on the delivered file: the `isInCheck`
  clauses are asserted on an **empty** and a **1-ply** history; the scan clause on **two empty** and
  **one 1-ply**. So a build whose extra work starts at **ply 2** was invisible to the clause
  `## Security / NFR triggers` calls "the part that actually binds". **That is this ticket's own
  stated failure mode — "a bar that cannot fail on the regression it exists to catch is not a bar" —
  one level down, and the previous ruling is where it should have been caught.***

  ***Re-spied out of tree at this hop, delivered panel against the two builds that walked through:***

  | build | difference @ 1 ply | difference @ 4 plies | `squareAt` @ 1 ply | `squareAt` @ 4 plies |
  |---|---|---|---|---|
  | **delivered** | 1 **PASS** | 1 **PASS** | 67 **PASS** | 67 **PASS** |
  | a second `isInCheck` from ply 2 on | 1 **PASS** | **2 FAIL** | 67 PASS | 67 PASS |
  | the 64-square scan twice from ply 2 on | 1 PASS | 1 PASS | 67 **PASS** | **131 FAIL** |

  *Both builds are **invisible to output** by construction, so a call count is the only instrument
  that could ever catch them. **The delivered panel is green at every depth**: the difference reads
  **1** at 1, 2, 4 and 5 plies — including a 5-ply history whose last move gives check, which adds no
  third call — and `squareAt` reads **67** on a 3-piece anchor at 1, 2 and 4 plies and **96** on the
  32-piece starting position, because `parseFen` places one piece per occupied square
  (`src/fen.ts:90`) and **`makeMove` never calls `squareAt` at all** — verified by grep at this hop.
  **That is why the scan clause can be stated ply-independently: its expected value depends on the
  anchor's piece count and not on the depth**, which is what makes a depth requirement meaningful
  rather than a second magic number.*

  ***The 4-ply fixture this needs already exists in the file*** *— `["e2e4","e7e5","g1f3","b8c6"]`,
  in the first `A13` test. The difference half at depth needs its baseline `toSan` on the position
  the panel replays to, which is a 3-ply replay rather than a bare `parseFen`; that is the
  construction rule the `## Test notes` already carries, applied one ply deeper. **Costs no
  production change** — the delivered panel satisfies every clause at every depth, measured.)*

  *(**[ADDED 2026-08-10 — D1, D2. The `isInCheck` clause REPLACED 2026-08-11 — D19. The criterion's
  purpose is UNCHANGED and every other clause of it is untouched.]** A count, not a clock, and the
  reason is this project's own record: `plans/nfr-catalog.md` has now moved a bar off the clock and
  onto a count three times — `NFR-005`'s predicate sub-bar, `NFR-001`'s `legalMoves`/`zobristKey`
  bars, and `ABC-009`'s guards — each time because a timing bar with an order of magnitude of
  headroom cannot fail on the regression it exists to catch. **This is still the criterion that fails
  if anybody puts the repetition derive back into the panel** — that property lives entirely in the
  four zero-counts above, which this amendment does not touch — and it still fails at zero timing
  sensitivity.*

  ***The replaced clause read `isInCheck` **exactly 1** time, with the empty-history carve-out
  attached to `toSan` and to nothing else. NO CORRECT BUILD COULD REACH IT, and that was re-measured
  at this hop rather than inherited.*** *`toSan` calls `suffix()` unconditionally (`src/san.ts:147`)
  and `suffix()` calls `isInCheck` unconditionally, before it branches on the answer
  (**`src/san.ts:104`**) — merged code this ticket neither owns nor may work around. Item 2 requires
  one `isInCheck` and item 4 requires one `toSan`, and both are mandatory, so the **render's total**
  is:*

  | history | total spied `isInCheck` in one render |
  |---|---|
  | empty | **1** |
  | 1 ply (`Nf3`) | **2** |
  | 4 plies | **2** |
  | last move gives check | **2** |
  | last move gives mate | **2** |
  | a loaded FEN, in check, empty move list | **1** |

  *(Measured at this hop with a throwaway out-of-tree spy, independently of the engineer's test.
  **The split is on `history.moves.length`, not on whether anybody is in check** — it is the same
  condition the `toSan` clause already carries. A checking or a mating last move adds **no third**
  call: `suffix`'s mate test is `legalMoves`, and `legalMoves` reaches `isSquareAttackedBy` directly
  and never calls `isInCheck` — `src/legal.ts:42-55`, read at source. **These totals are recorded as
  an observation and are deliberately NOT the criterion** — see the next paragraph.)*

  ***Why this shape, and not either of the two obvious alternatives.*** *State the total honestly as
  **"1 on an empty history and 2 thereafter"** — **rejected**, because it makes this ticket
  **restate a number `src/san.ts` owns**, so a change to SAN's suffix strategy turns this ticket's
  suite red for another module's reason. That is the same fault `ADR-0009` clause 1 names in the
  other direction (*the producer owns its count; a consumer must never restate it*), and it is what
  this board struck `A11`'s `frameHeight(...) is 23` clause for. **The difference clause holds
  whatever `suffix()` does**, which is the whole reason it is written as a difference. And **drop the
  clause entirely** — **rejected**, because the four zero-counts catch a returning repetition derive
  but **nothing else on this ticket catches a panel that asks the board about check twice**, and
  `## Security / NFR triggers` names *"the call counts of `A13`"* as the part of the bar that
  actually binds.*

  ***What each half kills, so the mutant net has a target.*** *The **direct** half fails on any build
  whose own count is not one — two calls, or zero (a build reading the indicator out of `toSan`'s
  `+`/`#` suffix reads **0** on an empty history, where there is no last move at all). The
  **difference** half fails on a build that adds a call only once a move exists — the natural one
  being a second `isInCheck` against the replay position `lastMoveSan` is already holding.*

  ***This clause requires NO production change.*** *`src/status-panel.ts` was already correct; it was
  the criterion's arithmetic that was wrong. Both halves above are **already asserted by delivered
  `src/status-panel.nfr.test.ts`** — the direct half at `:130-132`, the difference half at
  `:140-149` — so this amendment repairs the ticket and not the code, and the delivered test stops
  being a stated departure from the criterion and becomes the criterion. **The engineer flagged this
  and did NOT amend the ticket, which was the correct call**; the amendment is BA/PM's and is made
  here.)*
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
  `EPIC-006`'s colour and glyph flags. ~~What is owed is one line on `ABC-019`'s side saying its
  render seam passes the status it just computed; **flagged for the Orchestrator, not edited
  here.**~~ **DISCHARGED — verified 2026-08-11 at this hop, read in `ABC-019`'s ticket rather than
  assumed.** That line landed at `ABC-019`'s own refinement and names itself as such:
  `plans/tickets/ABC-019-turn-loop-skeleton.md:219-228` — *"the loop hands over the `GameHistory`,
  the `GameStatus` **it evaluated for this ply**, and the `thinking` flag … This is the line
  `ABC-016` was owed"*. The seam signature it records at `:230`,
  `(GameHistory, GameStatus, thinking) => readonly string[]`, **accepts the delivered
  `renderStatusPanel(history, status, thinking): string[]`** — `string[]` is assignable to
  `readonly string[]`, so the two are compatible and neither side is owed a change. **Nothing was
  relayed to the `ABC-019` engineer to establish this and no channel to it was opened**: the ticket
  on disk is the only thing that was read.
- ~~**The board row's `blocked-until: ABC-013, ABC-014, ABC-020` is stale on all three** — `ABC-020`
  merged 2026-08-02, `ABC-014` 2026-08-08, `ABC-013` 2026-08-10. **Board hygiene, flagged not
  edited**: two agents share this branch and the Orchestrator makes board moves.~~ **DISCHARGED —
  the Orchestrator corrected it; the row now reads `blocked-until: NONE`** (read in `plans/board.md`
  at this hop, not assumed). Struck rather than deleted so the flag's disposition is visible.

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
  **[CLARIFIED 2026-08-11 — D19, because there are now two different "second calls" in play and they
  are not the same one.]** This bullet is about `gameStatus`'s call, which the panel never triggers
  (`gameStatus` is an input, spied at **0** by `A13`). The *other* one — `toSan`'s own call inside
  `suffix()` at `src/san.ts:104` — is what `A13`'s `isInCheck` clause was rewritten around; it is
  also free at the same price, it is SAN's rather than this panel's, and this ticket deliberately
  does not restate its count. **Neither one is a second derive of anything**; nothing is computed
  twice here, which is the distinction from `D1`.
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
- **[ADDED 2026-08-11 — D19] `A2`'s played-check case must be built by PLAYING the plies, never by
  loading the resulting FEN.** Loading `rnbqkbnr/pppp1p1p/6p1/4Q3/4P3/8/PPPP1PPP/RNB1KBNR b KQkq - 0
  3` gives the same board with an EMPTY move list, which is the fifteenth case of exactly the kind
  this ticket already had fourteen of, and it exercises neither the replay nor `last: Qxe5+`. It also
  belongs in `CASES`, so `A10`, `A11` and `A12` pick it up and it gets a snapshot.
- **[ADDED 2026-08-11 — D19] `A13`'s difference half needs its baseline `toSan` on the SAME move and
  the SAME position the panel replays to**, and the baseline call must be made with the mocks cleared
  immediately before it. Any other move would compare two quantities that are only equal by accident.
- **[ADDED 2026-08-11 — D20/D23/D25] Three `CASES` entries, and `CASES` is now swept in BOTH thinking
  states.** Two entries are new — `A2`'s check-plus-claimable position and `A5`'s disambiguated SAN —
  and both need snapshots. **No `thinking: true` entry is added for `A7`**: the criterion renders
  every case both ways itself, which is what makes the flag crossed with all fifteen cells instead of
  with one position. The existing `thinking` field on each entry still drives `A10`, `A11` and `A12`
  and is unchanged.
- **[ADDED 2026-08-11 — D22] `A13`'s deeper fixture already exists** — `["e2e4","e7e5","g1f3","b8c6"]`
  in the first `A13` test. Reuse it rather than building a second game; the only new construction is
  the baseline's 3-ply replay.
- **[ADDED 2026-08-11 — D26] Take `expect(sanAlone).toBeGreaterThan(0)` in
  `src/status-panel.nfr.test.ts`, and it is a TEST line and NOT a criterion.** It is deliberately not
  `toBe(1)`: `> 0` names no number `src/san.ts` owns, so it is not the `ADR-0009` clause 1 fault that
  got *"1 empty, 2 thereafter"* rejected.

  **The flag it answers was raised as a discrimination gap and it is NOT one — that was measured, not
  reasoned about, and the measurement is why no criterion moves.** The spy **does** intercept
  `san.ts`'s internal call today (`withSan` = 2, `sanAlone` = 1, re-spied at this hop), and in the
  world where it did not, SAN's call would enter both terms with the **same coefficient and cancel
  exactly**: the delivered panel reads `2 − 1 = 1` and would read `1 − 0 = 1`; the two-calls build
  reads `3 − 1 = 2` and would read `2 − 0 = 2`. **Identical verdicts.** The failure the flag imagined
  — the assertion staying green while measuring something else — does not occur; it would stay green
  while measuring the **same** thing by a different route. **The difference form is sound either way
  and needs no repair.**

  **So the reason for the line is provenance, and one more reason that is this ticket's own:** the
  comment block at that site makes a load-bearing factual claim — *"the delta below is exactly
  SAN's"* — and the item below proves this ticket's comments go stale and mislead a reader who acts
  on them. A `> 0` assertion is an **executable guard on that claim**: it can only go red when the
  recorded fact stops being true, which is exactly when the sentence above it stops being true. It
  protects the comment, not the panel, and must not be written as if it protected the panel.
  **`## Security / NFR triggers` does not gain a part 4 and `A13` is unchanged by this bullet** — a
  criterion that pinned the spy's plumbing would go red when vitest changed its mock hoisting, which
  is the foreign-ownership fault `A11`'s struck `frameHeight(...) is 23` clause was struck for.
- **[ADDED 2026-08-11 — D26] FOUR stale comments, and two of them are the dev hop's to fix under
  `src/`. One was named by nobody.** A stale comment on this ticket has now been shown to
  **measurably suppress a real gap**, so these are not hygiene.
  - **`src/status-panel.nfr.test.ts:134-139`** — still says *"`A13` says 'exactly 1' for the total,
    which no build satisfying items 2 and 4 together can reach on a non-empty history"* and points at
    *"the ticket flag raised at this hop"*. **That flag was ruled on 2026-08-11 and `A13` no longer
    says it.** Read at face value the sentence tells the next reader that the difference form is the
    engineer's improvisation around a broken criterion — **and you do not probe the depth of a clause
    you have been told is a workaround.** QE reports it did exactly that, and the two probes that
    found `D22` are precisely what that sentence argues against writing. It must now say that the
    difference form **is** the criterion, and it must state the depth requirement. **Its
    `src/san.ts:101` cite is also wrong for a sentence about a specific call** — verified at source
    at this hop, `:101` is `suffix()`'s **declaration** and **`:104`** is the `isInCheck` call.
    (*The ticket's own `src/san.ts:147` cite is correct: `:146` declares `toSan`, `:147` is the
    return that calls `suffix`.*)
  - **`src/status-panel.ts:95-101`** — justifies the reserved thinking cell by *"the panel's widest
    row is the frame's `W` … a cell that shrinks makes the whole frame breathe."* True when written,
    **false after `ADR-0010` clause 1**, which gives frame-width stability to the consumer.
    `ADR-0010`'s `## Consequences` named this site and deliberately did not edit it.
  - **`src/status-panel.test.ts:263-265`** — the same sentence, in `A7`'s own test. **Named by
    nobody: not by `ADR-0010`, which listed only the module and the ticket, and not by QE.** Found by
    grepping the tree for the sentence at this hop. It is the most misleading of the three, because
    it sits on the criterion this amendment rewrites.
  - **`plans/tickets/ABC-016-status-panel.md`, `A7`'s rationale** — **fixed here**, in `A7`.
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

**Re-derived 2026-08-11 at the `A13` ruling hop (`refinement-ABC-016-a13`) and still `M` (3) /
`P1`.** *Added*: one acceptance case (`A2`'s played check, which also becomes a fifteenth `CASES`
entry and one more snapshot) and one rewritten clause on `A13`. *Removed*: nothing. **No new cell, no
new input, no new module, no new test file, and no production line** — `A13`'s replacement is already
satisfied by delivered code and delivered tests, and `A2`'s new case goes green on the panel as it
stands (measured). The remaining work is **one `CASES` entry, one assertion block of roughly a dozen
lines, and a regenerated snapshot file**. The size arguments above are untouched and this is well
inside `M`: it is smaller than the 2026-08-10 amendment, which added three criteria and a test file
and did not move the 3 either.

**Explicitly NOT `XL`, so `SPLIT_REQUIRED` does not apply.** The ticket is still one module, seven
cells, one short function, no chess logic and no new rules; nothing in this ruling adds a second
deliverable or a second seam. **Priority `P1` re-read a fourth time and unmoved** — this hop changes
how two criteria are *worded* and adds one case; it does not touch item 7's rules-affordance
argument, does not touch epic acceptance #3, and does not change what a player gets. **Not `P0`** (the
game runs with a board and a loop) and **not `P2`** (`EPIC-002` cannot close without epic acceptance
#3, which lives here).

**Re-derived 2026-08-11 a FIFTH time at the QE-gaps ruling (`refinement-ABC-016-qe-gaps`) and still
`M` (3) / `P1`.** *Added*: two `CASES` entries (`A2`'s check-plus-claim, `A5`'s disambiguated SAN),
three `A6` table rows, one `A9` case, one rewritten `A7` clause swept over `CASES`, a stated ply
depth on `A13`'s two counting clauses, one test-only `> 0` line, three comment repairs, and a
regenerated snapshot file. *Removed*: `A7`'s widest-row clause, and the `## Definition of Ready`
width flag, which `ADR-0010` discharged — **the only two items on this hop that take work off the
ticket, and the second removes a carried obligation rather than a line.**

**Why it stays a 3, stated against the two things that could have moved it.** *(1)* **No new cell,
input, module, test file or production line**, and no new instrument: the spy, the `CASES` sweep and
the `A6` table all already exist, and every addition is another row, entry or depth in a loop that is
already written. **Six of the seven closes are a single fixture each.** *(2)* The one structural
change — `A7` iterating `CASES` in both thinking states — **replaces** a clause rather than adding a
test, and it is the change that lets this hop add **no** `thinking` case, so it is net cheaper than
the close it was offered as. Calibrated the same way as before: this is **smaller than the 2026-08-10
amendment** (three new criteria and a new test file, which did not move the 3 either) and larger than
the `D19b` hop (one case). It sits with `ABC-007`, `ABC-013` and `ABC-014` — all `M`, all one short
module with several traps — and above `ABC-018` (`S`). **Not `L`:** the work is fixtures, and every
one of them was rendered against the delivered panel at this hop and goes green.

**Priority `P1`, re-read a fifth time and unmoved.** Nothing here touches item 7's rules-affordance
argument, epic acceptance #3, or what a player gets — the panel's delivered behaviour is unchanged
and correct. **Not `P0`** (the game runs with a board and a loop) and **not `P2`** (`EPIC-002` cannot
close without epic acceptance #3, which lives here). **The merge-order fact — that `ABC-016` merges
first of four and these criteria become the net `ABC-017`, `ABC-027` and `ABC-019` are built
against — is an argument about WHEN, not about RANK**, and it is recorded as such for the fourth time
on this ticket rather than being allowed to inflate the number. It is a scheduling input for the
Orchestrator; the rank is `P1` on its own terms.

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

**RE-DERIVED A THIRD TIME 2026-08-11 by BA/PM at task `refinement-ABC-016-a13` (Workflow 07), ruling
on `A13`. The 2026-08-11 block above claimed ✅ on item 4 and it was WRONG TWICE — `A13`'s
`isInCheck` clause was unsatisfiable by any correct build, and `A2` was blind to a wrong build the
whole criteria set never reached.** That is the **fourth** consecutive time a DoR self-assessment on
this board has certified acceptance a mutant walks through. The pattern is now the point: **a DoR
block reading all ✅ is evidence that nobody re-derived it, not that the ticket is sound**, and this
column is written against the text as it stood at the start of this hop.

| # | Check | At the `In Review` move (2026-08-11) | After the `A13` ruling |
|---|---|---|---|
| 1 | problem clear | ✅ | ✅ unchanged |
| 2 | scope and out-of-scope clear | ✅ | ✅ unchanged — no scope moved; the panel's inputs, cells and row count are all as they were |
| 3 | INVEST | ✅ | ✅ *testable* is what moved: `A13` was **not** testable as written, and no `S`/`I`/`N`/`V`/`E` term changed |
| 4 | acceptance testable and measurable | ❌ **D19** — `A13`'s `isInCheck` clause is unsatisfiable by ANY correct build (`toSan` calls it at `src/san.ts:104`); **and** `A2`/`A6` are blind to a build reading the check indicator or the balance from the REPLAY position, because all 14 cases are either in check with an empty move list or played and capture-free | ✅ 14 criteria; `A13`'s clause re-derived to two halves that name no other module's count, `A2` gains the played-check case that kills the replay build |
| 5 | dependencies known | ⚠️ two carried flags were STALE — the `ABC-019` owed line had landed and the board's `blocked-until` had been corrected | ✅ both verified DISCHARGED by reading `ABC-019`'s ticket and `plans/board.md`, and struck rather than deleted |
| 6 | security/NFR triggers, measurable | ⚠️ the bar's part 3 is *"the call counts of `A13`"*, one of which could not be met | ✅ part 3 now names counts that can all be met; the `isInCheck` bullet clarified, the µs figures untouched |
| 7 | test notes present | ⚠️ nothing told the engineer to build the played case by PLAYING it | ✅ two notes added |
| 8 | size assigned | ✅ `M` | ✅ `M`, re-derived; **not `XL`, so no `SPLIT_REQUIRED`** |
| 9 | priority assigned | ✅ `P1` | ✅ `P1`, re-read a fourth time |
| 10 | no major unresolved blocker | ✅ | ⚠️ **not a blocker, but the ticket is NOT DONE**: `A2`'s new case is unwritten, so the ticket goes back to `In Development` for it — see the board request in this hop's notes |

**Every ✅ and every ❌ above was measured against merged `src/` at this hop, not argued.** The
`isInCheck` totals were re-spied out of tree rather than taken from the engineer's or the
Orchestrator's report; `src/san.ts:104` and `src/legal.ts:42-55` were read at source; the 14-case
matrix (plies / in-check / captures) was generated by running every case rather than by reading the
list; the four gates were re-run in this worktree (**lint / typecheck / build exit 0, 707/707 on 24
files, skip 0**) and `git rev-list --count HEAD..main` re-read as **0**. **Zero production lines
written at this hop; `src/` is byte-identical to the branch tip as delivered.**

**What THIS hop deliberately did NOT do.** It did not re-open `ADR-0009` (accepted). It did not edit
`plans/board.md`, `plans/nfr-catalog.md`, `memory-bank/50-decisions/`, `src/`, or `ABC-017`'s or
`ABC-019`'s tickets. It did not adopt the engineer's recommended amendment `(a)` as offered — the
ruling takes its intent and rejects its wording, because *"exactly 1 from the panel itself"* names no
instrument and two readers would build two different tests. It did not add a constant-width criterion
to this panel: that is a real defect but the fix is a product decision that is not BA/PM's to take
alone — see the flag below. And it did not weaken `A13` to make the delivered test right; the test
happened to be right, which is a different thing and is stated as such.

**RE-DERIVED A FOURTH TIME 2026-08-11 by BA/PM at task `refinement-ABC-016-qe-gaps` (Workflow 07),
ruling on QE's seven criterion gaps. The block above claimed ✅ on item 4 and it was WRONG SEVEN
TIMES.** That is the **fifth** consecutive time a DoR self-assessment on this board has certified
acceptance a wrong build walks through, and the previous block said the pattern was the point. **It
was right, and this hop is the evidence: the block that predicted its own unreliability was itself
unreliable.** The column below is the state at the text as it stood at the start of this hop.

| # | Check | At the QE gate (2026-08-11) | After this ruling |
|---|---|---|---|
| 1 | problem clear | ✅ | ✅ unchanged |
| 2 | scope and out-of-scope clear | ✅ | ✅ unchanged — no scope moved; the panel's inputs, cells and row count are all as they were, and no production line is asked for |
| 3 | INVEST | ✅ | ✅ *testable* is what moved again; no `I`/`N`/`V`/`E`/`S` term changed, and the ticket still goes green alone |
| 4 | acceptance testable and measurable | ❌ **D20–D25** — twelve wrong builds pass every criterion: `A7` cannot fail on `D7`'s own target and `thinking` is crossed with no content (D20); three of five piece values unpinned (D21); `A13`'s counts have no stated ply depth (D22); `check` never crossed with `claimable` (D23); `A9` cannot fail on an inferring panel (D24); the last-move vocabulary is four strings (D25) | ✅ 14 criteria; each gap closed by a fixture measured green on delivered code, and **the two closes QE proposed were themselves measured and replaced where they did not kill** |
| 5 | dependencies known | ✅ | ✅ unchanged — every dependency merged; no new edge, and `ABC-017`/`ABC-019` untouched |
| 6 | security/NFR triggers, measurable | ⚠️ part 3 is *"the call counts of `A13`"* and both counting clauses were blind from ply 2 | ✅ part 3's counts now carry a stated depth; the µs figures and the three-part bar are untouched |
| 7 | test notes present | ⚠️ nothing named the `CASES` sweep, the depth fixture, or the stale comments | ✅ four notes added, incl. the four stale sites and the `> 0` line's honest reason |
| 8 | size assigned | ✅ `M` | ✅ `M`, re-derived a fifth time; **not `XL`, so no `SPLIT_REQUIRED`** |
| 9 | priority assigned | ✅ `P1` | ✅ `P1`, re-read a fifth time |
| 10 | no major unresolved blocker | ✅ | ⚠️ **not a blocker, but the ticket is NOT DONE**: every close is unwritten and two of the comment repairs are under `src/`, so the ticket goes back to `In Development` — see the board request in this hop's notes |

**Every ❌ and every ✅ above was measured against merged `src/` at this hop, not argued.** The
`A7` fixture widths, the `A6` integers, the `A9` forged-status render, the `A2` check-plus-claim
render and the `A5` disambiguated SAN were all **rendered by the delivered panel**; `A13`'s two
clauses were **re-spied out of tree at 1, 2, 4 and 5 plies against two mutant builds**;
`src/gameend.ts:170` and `src/san.ts:101`/`:104`/`:146`/`:147` were **read at source**; the four
stale-comment sites were found by **grepping the tree** rather than by taking QE's list; and the
gates were re-run in this worktree (**lint / typecheck / build exit 0, 708/708 on 24 files, skip 0**)
with `git rev-list --count HEAD..main` re-read as **0**. **Zero production lines written at this hop;
`git status --porcelain -- src/` is empty and `src/` is byte-identical to the branch tip.**

**What THIS hop deliberately did NOT do.** It did not re-open `ADR-0010` or `ADR-0009` (both
accepted), and it did **not** add a constant-frame-width criterion — `ADR-0010` clause 5 refuses one,
QE did not ask for one, and the replacement `A7` clause is not one. It did not edit `plans/board.md`
(the Orchestrator's), `plans/nfr-catalog.md`, `memory-bank/50-decisions/`, `src/`, or `ABC-017`'s or
`ABC-019`'s tickets — a BA/PM agent is live on the first and QE on the second, and no channel to
either was opened. It did not accept QE's dispositions on trust: **two of the seven closes were
measured to be insufficient and were replaced**, and one gap (`D26`) grew a site nobody had named. It
did not add castle, promotion or en-passant cases to `A5` — those exercise `ABC-013`'s `toSan` rather
than this panel's call and are declined as bloat, with the reason recorded. And it did not turn the
`1 - 0` flag into a criterion: the discrimination gap was **measured not to exist**, and the one line
it does take is a test line with an honest and different reason.

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
- ~~**NEW 2026-08-11 — this panel's WIDTH is not constant, `src/frame.ts:179` makes the frame's `W` the
  widest panel row, and no criterion at any level covers it. Owner: Architect/Design to rule; the
  Orchestrator to route.**~~ **RULED AND DISCHARGED — `ADR-0010` (accepted 2026-08-11), read at this
  hop rather than assumed. Struck rather than deleted so the flag's disposition is visible; the
  measurements below stand and are what the ADR was decided on.** The routing worked exactly as this
  flag asked: it named two candidate fixes, said the choice was a design decision and not a wording
  one, and declined to write a criterion — and `ADR-0010` **upholds that judgement in its own Status
  section** (*"the ruling below changes which criterion is even correct, so writing one first would
  have picked the answer"*). **The answer is candidate (ii), the consumer:** `src/frame.ts`'s
  in-place writer clears each row as it writes it, at a measured **+66 characters per frame** and
  **0/24 stale frames**. Candidate (i) — this panel reserving its width — was **rejected by
  measurement**: it makes the frame 67 columns wide in every frame of the game with 49 permanently
  blank, for a cell populated in a small minority of them, at **+152% bytes**.
  **What that leaves on THIS ticket: nothing that changes a criterion, and zero production lines** —
  `ADR-0010` `## Consequences` says so in those words. **`A7` STANDS** (clause 5), narrowed to a
  legibility clause; its stale rationale is repaired above under `D20`, and the two surviving copies
  of that sentence under `src/` are `D26`'s. **No constant-width criterion is added here and clause 5
  refuses one.** The production line has **no home on this ticket** — `ADR-0010` leaves the home to
  the Orchestrator and the board records it as **`ABC-027`, second-to-last in the merge order**. The
  `4b` residue, `ABC-017`'s `A2` parenthetical and `ABC-019`'s owed `F3` criterion are all named in
  the ADR with owners and are **not this ticket's**.
  *(The original flag text follows, unedited, because its numbers are the ADR's input:)* Measured at
  the flagging hop on delivered code: the panel's widest row is **17**
  characters at the quiet starting position and **67** with both draws claimable — **a 50-column
  swing**, driven by the `CHECK` cell (+7) and the claim cell (up to +55), neither of which reserves
  its width. `A7` reserves the *thinking* cell's width and is the only width clause on the ticket;
  the engineer recorded the consequence for the other two honestly rather than hiding it. **Why it
  matters, read at source:** `assembleFrame` recomputes `width` per frame and pads every row to it
  (`src/frame.ts:179`, `:182`), while the in-place writer emits `CURSOR_HOME` + rows +
  `ERASE_TO_END_OF_SCREEN` (`:216`) — and `\x1b[0J` erases from the END of the new frame downward,
  never to the right of a row already written. **So when a claim expires the frame narrows and roughly
  50 columns of the previous frame survive on every row of the redrawn region.** `assembleFrame`'s own
  comment states the assumption this breaks: *"The panels set `W`; the message region is bounded BY
  it"* — the message region was excluded precisely because it was known to be variable, and this
  panel is variable too. **The board already recognises this class for the sibling ticket**:
  `ABC-017` carries *"constant WIDTH is now a criterion because `src/frame.ts:179` takes W as the
  widest panel row"* for a measured **3**-character swing, while this panel's is 50 and has no such
  criterion. **Not taken here, and deliberately so.** There are two defensible fixes and choosing
  between them is a design decision, not a wording one: **(i)** this panel reserves width for its
  variable cells, which costs a permanently blank ~53-column claim area on every frame — a visual
  product decision BA/PM will not make alone; or **(ii)** `ABC-018` clears each row as it writes
  (`\x1b[K`), which touches merged code and reads against epic `4b`'s *"in one operation"* clause.
  **Not blocking this ticket:** nothing composes a frame in a loop until `ABC-019`, so no stale
  column can be rendered before then, and epic `4a` is about row count only while `4b` is worded over
  *rows* rather than characters — so no current criterion is violated today. **The decision is owed
  before `ABC-019` merges**, which is the first moment a second frame is ever written.

**PROMOTED `Backlog` → `Ready` 2026-08-10 by BA/PM** (task `refinement-ABC-016`, subtask
`refinement-ABC-016-bapm`, Workflow 07). `Ready` goes 0/8 → 1/8; no limit approached, no override
taken. **The board move itself is the Orchestrator's** — two agents share this branch — and the exact
row text is in this hop's decision note. **Nothing under `src/` was written, nothing was committed,
nothing merged, nothing deployed.**
