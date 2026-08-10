---
id: ABC-017
title: Bounded move-history pane — two-column SAN, constant height, constant width
status: ready
column: Ready
size: S
priority: P2
epic: EPIC-002
feature: —
---

# ABC-017 — Bounded move-history pane: two-column SAN, constant height, constant width

> **PROMOTED `Backlog` → `Ready` 2026-08-10 by BA/PM** (task `refinement-ABC-017`, subtask
> `refinement-ABC-017-bapm`, Workflow 07). **Eighteen defects found and fixed at this hop; the
> Orchestrator deliberately supplied no flag list.** Five were witnessed by **wrong builds
> constructed and run against merged `src/`**, each of which passes every acceptance criterion as it
> stood. Acceptance went from **8 prose criteria to 12 pinned ones**; the cost bar kept its absolute,
> widened its ratio with a measured reason, and gained the clause that actually binds. **Size `S` and
> priority `P2` both re-derived and both unmoved.** Nothing under `src/` written; the expected
> production diff for a refinement hop is zero lines and it is zero.
>
> | # | Defect | Evidence |
> |---|---|---|
> | D1 | **The `40/120/300` within-2x criterion is called *"the O(window) proof"* and it is not one** — the pane is `O(plies)` in its replay term, and the ratio measures window CONTENT | measured |
> | D2 | No criterion stopped the pane running the repetition derive — the fact `NFR-002`'s `O(window)` claim rests on | read at source |
> | D3 ⭐ | **A window of the last 16 PLIES instead of the last 8 PAIRS passes every stated criterion** and puts Black's moves in White's column at every odd length > 1 | mutant run |
> | D4 ⭐ | **Move numbers from the array index pass every stated criterion** — no criterion states an anchor FEN | mutant run |
> | D5 | The **leading** half-row (a history anchored at a black-to-move FEN) is absent from the ticket entirely | measured |
> | D6 | *"identical in count and **width**"* is false for the natural build and contradicts *"every row is blank"* | measured |
> | D7 ⭐ | **Blank-row placement is pinned by nothing** — *"one of which reads `1. e4`"* | mutant run |
> | D8 | The `takeBack(2)` criterion asserts something `takeBack` does not do | measured |
> | D9 | *"Given glyph mode ASCII"* varies an input the pane does not need | read at source |
> | D10 ⭐ | **A pane that reaches for `takeBack` and restores passes every stated criterion** | mutant run |
> | D11 | Criterion 6's `toFen` snapshot has no timing, and `moves.length` is unwatched | `ABC-016` D12 |
> | D12 ⭐ | **Criterion 3 pins the row numbers and not one of the sixteen cells** | mutant run |
> | D13 | The row count is tied to the frame by nothing, while `ABC-016`'s `A11` already hardcodes it | read at source |
> | D14 | The viewport arithmetic is wrong by one row (the board is **9** rows, not ~10) | measured |
> | D15 | `ABC-016`, `ABC-018` and `ABC-019` unlisted as dependencies | read at source |
> | D16 | `N8-LANE`'s floor allowance is stated for one test file; this ticket now adds two | ruled |
> | D17 | *"the three length cases (0, 1, 80, 300 plies)"* names four, and covers none of the new ones | read at source |
> | D18 | The ticket's own DoR block claimed ✅ on every check that failed | — |

## Problem

*User*: the player who wants to see how the game got here without scrolling back through eighty
reprinted boards.

*Pain*: the move list exists only inside the history module as `Move` objects. There is nothing a
player can read.

*Value*: the two-column SAN move list is what a chess player expects on a board display, and it is
what makes a terminal chess game look like a chess game rather than a REPL.

## The bound, and why it is the whole point of this ticket

Wave 1 quantified an overflow that arrives far earlier than epic acceptance #4's own move 40: with
the board and its labels at **9** rows, the status panel at 3 and the message region at 2, a
conventional 24-row terminal leaves **9** rows for history once the reserved prompt row is counted,
so an **unbounded** pane overflows the viewport at **roughly move 10 — before the opening is over**.
At move 40 the frame would be ~56 rows, more than twice the viewport, and "redraws without leaving
stale rows" is not merely hard there, it is **undefined**: the frame does not fit the region it is
being redrawn into.

> **CORRECTED 2026-08-10 — D14.** This paragraph read *"board and labels at ~10 rows … leaves ~8
> rows for history … at roughly move 9"*. Measured against merged `src/`: `renderBoard` returns
> **9 rows of 18 characters**, not ~10, and `frameHeight({ board: 9, status: 3, history: 8 })` is
> **23** — one row of slack under a 24-row terminal, with `history: 9` also fitting at exactly 24.
> **The bound of 8 is unchanged and is now conservative by one row rather than exact.** The 8 is not
> re-opened: `ABC-016`'s promoted criterion `A11` and `ABC-018`'s merged reference layout both
> already stand on it, and one spare row is a better place to be than none.

BA/PM ruled on 2026-07-30 (epic amendment `[A2]`, criteria `4a`–`4d`) that **the pane is bounded**.
This ticket implements the bound. It is a genuine reduction and it is recorded as one in the epic:
the live frame no longer shows the whole game. `EPIC-006`'s game-end screen already promises *"the
full move list"*, so the information stays in the product.

## Scope

**A pane renderer returning `HISTORY_ROWS` rows of `HISTORY_COLS` characters as a value, given the
history and nothing else.** Writes nothing.

- **Two-column SAN**, one row per move pair: `12. Nf3 Nc6`.
- **`HISTORY_ROWS` is `8` and is EXPORTED**, as `ABC-016` exports `STATUS_ROWS`. *(**ADDED
  2026-08-10 — D13.** `ABC-018`'s `frameHeight` takes this pane's row count as a **session
  constant**, and `ABC-016`'s already-promoted `A11` hardcodes `history: 8` inside a criterion of a
  neighbouring ticket. Two tickets carrying the same magic number with nothing tying them is how the
  two come to disagree.)*
- **`HISTORY_COLS` is a constant this ticket does not choose and DOES export.** Its value is the
  engineer's, on epic acceptance `4a`'s own split — *"the invariant is the criterion; the exact split
  is the engineer's"* — subject to one requirement it must meet: it holds a **4-digit move number**
  and **two 7-character SAN strings** with no truncation. *(**ADDED 2026-08-10 — D6.** 7 is the
  longest SAN this grammar emits — `Qh4xe1#` in shape, and `dxc8=Q+` measured in `ABC-012`'s own
  game. 4 digits covers every move number reachable by play under `ABC-020`'s automatic 75-move and
  fivefold draws. See `## Out of scope` for the loaded-FEN limit above 9,999.)*
- **Bounded to the most recent `HISTORY_ROWS` move NUMBERS — not to the most recent `2 ×
  HISTORY_ROWS` plies.** *(**The distinction is the whole of D3** and the two are identical at every
  even ply count. See `A4`.)*
- **A shorter game is blank-padded to `HISTORY_ROWS` rows so the pane's height never changes, and
  the content is TOP-ALIGNED** — oldest visible pair in row 1, blanks at the bottom. *(**ADDED
  2026-08-10 — D7.** A move list that grows downward and starts scrolling once full is what a chess
  player reads; more to the point, the placement had to be pinned by something, and *"one of which
  reads `1. e4`"* pinned nothing.)*
- **Move numbers and columns are READ FROM THE REPLAYED POSITION, never computed from the array
  index.** The pane already replays to reach each visible ply; the position before ply *i* carries
  `fullmoveNumber` and `blackToMove`, and those two fields are the move number and the column.
  *(**ADDED 2026-08-10 — D4, D5.** This costs **no** implementation work — it is reading two fields
  the replay has already produced — and it is the only derivation that is right for a history
  anchored anywhere but the standard start FEN.)*
- **A trailing half-row and a LEADING half-row.** A game in which Black has not yet replied shows the
  white ply alone in the last row. A history anchored at a **black-to-move** FEN shows the move
  number with an **empty white cell** in the first row. *(**ADDED 2026-08-10 — D5.** `newGame` takes
  any FEN, `parseFen` accepts a black-to-move anchor, and `EPIC-006` owns startup and supplies it.
  The leading half-row was in no line of this ticket.)*
- SAN comes from `toSan` (`ABC-013`); the pane does the layout and the numbering.
- **The pane takes NO glyph mode.** *(**CORRECTED 2026-08-10 — D9.** This line gave it one. Nothing
  in the output depends on one: SAN is ASCII by construction and so is the layout. `ABC-016` struck
  the same parameter from the status panel this morning for the same reason — a parameter no output
  depends on is an invitation to make an output depend on it.)*

**This pre-adopts `ADR-0004`'s own first response to its clause-3 trigger** — *"render only the
visible window ... the frame becomes O(window) with no cache at all, and it is a renderer decision
inside `EPIC-002`"*. It is adopted up front rather than held in reserve, because the viewport
arithmetic above forces the bound anyway. **What the pane is NOT is strictly `O(window)`, and the
correction is in `## Security / NFR triggers` rather than smoothed away here.**

## Out of scope

- **Caching or storing SAN strings.** `ADR-0004` clause 3: derived per frame, never stored in the
  history, and `history.ts` does not import `san.ts` (**verified at source, `src/history.ts:24`**).
  The bound is what makes deriving affordable at any game length; a cache would buy nothing here.
- **Scrolling within the pane, paging, or a `history` command.** Not in any epic's command set
  (`moves` / `help` / `board` / `quit`, plus `EPIC-006`'s `undo` / `resign` / `new` / `quit`). If a
  player wants the full list, the end screen has it.
- **The full move list** — `EPIC-006`'s game-end screen.
- **PGN export** — `EPIC-006`'s negotiable slice.
- The board (`ABC-014`), the status panel (`ABC-016`), writing (`ABC-018`).
- **A loaded FEN whose `fullmoveNumber` exceeds 9,999 — ACCEPTED LIMITATION, stated rather than
  silently handled.** *(**ADDED 2026-08-10 — D6.** Measured: `parseFen` accepts `fullmoveNumber`
  100,000 and imposes no upper bound at all, only `>= 1`. No such position is reachable by play. At
  that point the row is wider than `HISTORY_COLS` and the constant-width promise of `A2` does not
  hold. **`ABC-010` (FEN semantic validation) is the ticket that would bound it and it is in
  `Backlog`; this is carried, not owned** — the same posture `ABC-016` and `ABC-019` take toward the
  same class.)*

## Acceptance (Given/When/Then)

**A1 — the row count is a NUMBER, at every length, and it is tied to the frame. Given** histories of
**0, 1, 3, 19, 20, 40, 80, 120, 300 and 2,000** plies, **when** the pane renders, **then** it has
**exactly `HISTORY_ROWS` = 8** rows in every case, and **`frameHeight({ board: 9, status:
STATUS_ROWS, history: HISTORY_ROWS })` is 23** — the epic's reference layout, which fits a 24-row
terminal.

*(**[ADDED/CORRECTED 2026-08-10 — D13, D14.]** Measured against merged `src/frame.ts`: 22 / 23 / 24 /
25 rows at `history` = 7 / 8 / 9 / 10, so 8 fits with one row of slack and 10 does not fit at all.
`ABC-016`'s `A11` asserts the same identity from the other side; when both land, neither ticket owns
the 8 alone.)*

**A2 — constant WIDTH, and what "blank" means. Given** every case in `A1`, **when** the pane
renders, **then** every row is **exactly `HISTORY_COLS` characters**, `HISTORY_COLS` does **not**
vary with game length, move-number magnitude or SAN length, and a **blank row is `HISTORY_COLS`
spaces**. **Given** 0 plies, **then** all 8 rows are blank. **Given** 300 plies, **then** the 8 rows
are identical in count and width to the 0-ply case.

*(**[CORRECTED 2026-08-10 — D6.]** The original said *"identical in count and width to the 0-ply
case"* and separately that at 0 plies *"every row is blank"*, and **the two could not both hold**.
Measured on an unpadded correct build: 0-ply rows are **0** characters, 80-ply rows **14–15**, 300-ply
rows **16–17** — because move numbers gain digits and SAN strings vary from `e4` to `dxc8=Q+`. The
quantity is frame-level and not cosmetic: `src/frame.ts:179` takes the frame's `W` as the **widest
panel row**, so a pane whose width moves makes the whole frame breathe every ply — the same failure
`ABC-016`'s `A7` width clause was added to stop. **This pane is expected to be the widest panel and
therefore to SET `W`**; `ABC-018`'s own QE note already anticipates that (`renderBoard` is 18 wide).)*

**A3 — the exact eight rows, all sixteen cells, for a line stated in full. Given** the standard
start FEN and the 20-ply line

> `1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3 Nf6 5.d4 exd4 6.cxd4 Bb4+ 7.Nc3 Nxe4 8.O-O Bxc3 9.bxc3 d5 10.Ba3 Be6`

**when** the pane renders, **then** its rows, whitespace-normalised, are **exactly** these eight, in
this order:

| row | content |
|---|---|
| 1 | `3. Bc4 Bc5` |
| 2 | `4. c3 Nf6` |
| 3 | `5. d4 exd4` |
| 4 | `6. cxd4 Bb4+` |
| 5 | `7. Nc3 Nxe4` |
| 6 | `8. O-O Bxc3` |
| 7 | `9. bxc3 d5` |
| 8 | `10. Ba3 Be6` |

and the pane contains **neither** `e4 e5` **nor** `Nf3 Nc6` — moves 1 and 2 have slid out of the
window.

*(**[ADDED 2026-08-10 — D12.]** The criterion this replaces said *"the first reads `33.` … and the
last reads `40.` …"* — **the SAN content of all sixteen cells was an ellipsis**, so a build with
correct numbers and wrong cells passed. For scale, measured at this hop: asking `toSan` about the
position **after** the move instead of the one before it returns a **different string on 159 of the
378 plies** of `ABC-012`'s own deterministic game — 42%, first at ply 80 where the correct `Rg6`
becomes `Rg6+` — and leaves a phantom piece on the replayed position through the same
`makeMove`/`unmakeMove` mismatch `ABC-016` measured. **The line is stated in the criterion rather
than generated**, so it does not move if the move generator's ordering ever does; it carries a check
(`Bb4+`), a castle (`O-O`), a piece capture (`Nxe4`), two pawn captures with the file qualifier
(`exd4`, `bxc3`) and a window that has already slid.)*

**A4 — the ODD-length case, which is the only thing separating "8 pairs" from "16 plies". Given**
the same line truncated to **19 plies**, **when** the pane renders, **then** the rows are exactly
`3. Bc4 Bc5` … `9. bxc3 d5` and **`10. Ba3`**, the last row carries the **white ply alone**, and no
row contains a black ply in its white cell.

*(**[ADDED 2026-08-10 — D3.]** **A build windowing the last 16 PLIES was constructed and run and it
passes every criterion this ticket previously had** — 0, 1, 80, 300 plies and the `takeBack` case are
all even or degenerate, and at every even length the two builds are byte-identical. At 19 plies the
wrong build renders `2. Nc6 Bc4 / 3. Bc5 c3 / 4. Nf6 d4 / 5. exd4 cxd4 / 6. Bb4+ Nc3 / 7. Nxe4 O-O /
8. Bxc3 bxc3 / 9. d5 Ba3` — **every cell in the wrong column, every number one too low, eight rows,
all ASCII.** Every ply count the ticket named was even except 1, where the two builds agree.)*

**A5 — the most recent 8 move numbers, at a length the epic names. Given** `ABC-012`'s deterministic
80-ply game, **when** the pane renders, **then** the eight row numbers are **33, 34, 35, 36, 37, 38,
39, 40 in that order** — the **most recent** 8 pairs and not the first 8.

*(Asserted as the ordered list of eight integers, never as a substring: `41.` contains `1.`, and
`ABC-016` got exactly that wrong once. An implementation showing the first 8 pairs passes any
count-only test and is useless.)*

**A6 — the ANCHOR decides the numbers and the columns, three anchors. When** the pane renders,
**then**:

| anchor FEN | history | first rows |
|---|---|---|
| `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1` | `A3`'s 20-ply line | `3. Bc4 Bc5` … |
| `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 27` | `Nc3 Nc6 Nb1 Nb8 Nc3` | `27. Nc3 Nc6`, `28. Nb1 Nb8`, `29. Nc3` |
| `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 27` | `Nc6 Nc3 Nb8 Nb1 Nc6` | `27. ⟨empty⟩ Nc6`, `28. Nc3 Nb8`, `29. Nb1 Nc6` |

and in the third case the first row's **white cell is empty** and its black cell holds the first ply.
In none of the three does the pane contain a row numbered `1.`.

*(**[ADDED 2026-08-10 — D4, D5.]** All three measured at this hop against merged `src/`. **A build
numbering rows `floor(i/2)+1` from the array index was constructed and run and it passes every
criterion this ticket previously had**, because **no criterion stated an anchor FEN** — every one of
them was implicitly a fullmove-1, white-to-move game. From the second anchor it renumbers 27→1; from
the third it *also shifts every column*, rendering `1. Nc6 Nc3 / 2. Nb8 Nb1 / 3. Nc6`. This is
`ABC-016`'s `A4` defect class on a ticket whose scope line says *"Move numbers are the real ones"* and
never said what makes them real. **`parseFen` accepts a black-to-move anchor and any `fullmoveNumber
>= 1` — measured — and `ABC-016` already depends on the loaded-FEN case for its own move number.**)*

**A7 — `takeBack`, both arities, and what each actually does. Given** `ABC-012`'s deterministic
80-ply game, **when** `takeBack(history, 2)` is applied and the pane renders, **then** it has exactly
8 rows numbered **32–39** and its last row is `39.` with **both** plies present; **and when**
`takeBack(history, 1)` is applied to a fresh 80-ply game instead, **then** it has exactly 8 rows
numbered **33–40** and its last row is `40.` with the **white ply alone**. In both cases every row is
`HISTORY_COLS` wide.

*(**[CORRECTED 2026-08-10 — D8.]** This read *"the second shows one fewer move pair in its last row"*,
which **asserts something `takeBack` does not do**. A row holds one pair, not several.
`takeBack(history, 2)` — `EPIC-006`'s undo — truncates to **78 plies = 39 complete pairs**, so the
window **slides by one whole move** and the last row is FULL. Measured: before, `… 39. Nf2 Nh7 /
40. c8=N Rg6`; after, `… 38. Ba6 Bb5 / 39. Nf2 Nh7`. The half-row the old wording was reaching for
is what `takeBack(history, 1)` produces — `40. c8=N` alone — so both are criteria now and each pins a
different thing.)*

**A8 — top alignment, on a pane that is not full. Given** the `A3` line truncated to **1** ply,
**when** the pane renders, **then** row 1 is `1. e4` and rows 2–8 are blank; **given** it truncated
to **3** plies, **then** row 1 is `1. e4 e5`, row 2 is `2. Nf3`, and rows 3–8 are blank.

*(**[ADDED 2026-08-10 — D7.]** The criterion this replaces said the 1-ply pane has *"exactly 8 rows,
one of which reads `1. e4`"*. **A bottom-aligned build was constructed and run and passes every
criterion this ticket previously had**, and so would a build putting the row in position 4. "One of
which" is exactly the vague form the Definition of Ready forbids.)*

**A9 — determinism and non-mutation, with the snapshot taken BEFORE the first render. Given** any
case above rendered **twice**, **when** compared, **then** the two panes are **byte-identical**; and
**given** `toFen(history.position)` **and** `history.moves.length` captured **before the first
render**, **then** both are unchanged after the second.

*(**[CORRECTED 2026-08-10 — D10, D11.]** Two clauses are new and both were paid for by a wrong build.
**The snapshot's TIMING is the criterion**: `ABC-016` established at measurement that a snapshot taken
*between* two renders is byte-identical across a build that corrupts on every render, so only a
snapshot taken before the first one catches it. **`moves.length` is the criterion because this pane's
replay is 16 plies long and `takeBack` is the one exported rewinder in `src/`**: a build that calls
`takeBack` and does NOT restore was run and this clause catches it (`moves.length` 80 → 48, the two
renders differ). **A build that calls `takeBack` and DOES restore was also run and it passes every
clause here** — identical output, byte-identical twice, `toFen` unchanged, `moves.length` unchanged —
while mutating the caller's authoritative state mid-render, and it is caught only by `A11`.)*

**A10 — ASCII, unconditionally, on the pane's OWN rows. Given** every case above, **when** the pane
renders, **then** the count of code points above `U+007F` in the pane's rows is **exactly 0**.

*(**[CORRECTED 2026-08-10 — D9.]** This read *"Given glyph mode ASCII"*, which varies an input the
pane does not have — see `## Scope`. Unconditional is the stronger and simpler criterion. **It must
be asserted on the pane's returned rows and never through `assembleFrame`**, which strips those code
points in ASCII mode (`src/frame.ts:106`) and would pass a pane that emits them.)*

**A11 — the pane derives nothing, and this is a CALL COUNT. Given** any pane render at **40, 120,
300 and 2,000** plies, **when** the calls are **spied**, **then**:

| call | count |
|---|---|
| `gameStatusOf`, `repetitionCounts`, `keyHistory`, `gameStatus` | **exactly 0** |
| `takeBack`, `playMove` | **exactly 0** |
| `parseFen` | **at most 1** |
| `toSan` | **exactly once per rendered ply, and never more than `2 × HISTORY_ROWS` = 16** |

**and** the pane imports `GameHistory` as a **type only** — after this ticket, `src/history.ts` still
has **zero runtime importers**.

*(**[ADDED 2026-08-10 — D1, D2, D10.]** A count, not a clock, and the reason is this project's own
record: `plans/nfr-catalog.md` has moved a bar off the clock and onto a count four times now
(`NFR-005`'s predicate sub-bar, `NFR-001`'s two bars, `ABC-009`'s guards, `ABC-016`'s `A13`), each
time because a timing bar with a factor of two of headroom cannot fail on the regression it exists to
catch. **This is the criterion that fails if anybody puts the repetition derive into this frame**,
which is the structural fact `NFR-002`'s `O(window)` claim rests on and which `ABC-016`'s item 7 was
reversed this morning to preserve. Verified at this hop: `src/history.ts` has exactly one importer
today and it is `src/history.test.ts`. The `parseFen` clause catches a build that re-parses the
anchor per visible ply; the `toSan` clause is the bound itself, expressed at zero timing
sensitivity.)*

**A12 — the cost bar in `## Security / NFR triggers` holds when measured**, at all of its ply counts,
on all three of its parts.

## Dependencies

- **`ABC-013`** (`toSan`). *(**CORRECTED 2026-07-31**: this line read "and through it the wait on
  `ADR-0004`'s ratification". **That wait is over** — `ADR-0004` is `accepted` as of 2026-07-31 and
  `ABC-013` moved to `Ready` the same day. `ABC-013` is a plain ticket dependency now. Read
  `ADR-0004`'s Status section before citing the ratification: it was made by the Orchestrator under a
  named, quoted delegation from Olger Oeselg, not by a human directly, and it is explicitly not
  precedent.)* **Merged on `main`.** *(**ADDED 2026-08-10 — D15.** One caution the pane must honour:
  `toSan`'s optional `legal` parameter is a **contract, not a tuning detail** — `src/san.ts:19-22`,
  *"supply another position's list and the answer is silently wrong"*. **The pane holds no legal
  list and must pass none**; it pays one generation per visible ply and that cost is priced in the
  NFR bar below.)*
- **`ABC-012`** (the history). Merged on `main`. It supplies `initialFen`, `moves` and `position`,
  and it supplies **no way to walk backwards** — see the NFR block.
- **`ABC-014`** (the board). Merged on `main`. *(**CORRECTED 2026-08-10 — D9, D15.** This line read
  "frame conventions, glyph mode". **This pane takes no `GlyphMode`, so there is no import edge to
  `src/render.ts` at all.** What survives is real and is what `A1` stands on: `ABC-014`'s **9 rows**
  are the `board` term in `frameHeight`, and its **18-character** row width is the number this pane's
  `HISTORY_COLS` is expected to exceed, making this pane the frame's `W`.)*
- **`ABC-018`** (the frame). **Merged on `main`. ADDED 2026-08-10 — D15.** Three edges, all in
  merged code: `FrameParts.history` takes this pane's rows; `frameHeight` takes `HISTORY_ROWS` as a
  **session constant** known before the first frame; and `assembleFrame` takes the widest panel row
  as the frame's `W` (`src/frame.ts:179`), which is why `A2` is a criterion and not a nicety.
- **`ABC-016`** (the status panel). **ADDED 2026-08-10 — D13.** Not a code dependency — no import
  edge either way — but its promoted criterion `A11` hardcodes `history: 8`, so the two tickets share
  a number and `A1` is where they are tied.
- **`ABC-019`** (the turn loop). **ADDED 2026-08-10 — D15.** It owns the render seam and hands this
  pane the `GameHistory`. `ABC-018`'s own dependency block records that `ABC-019` depends on the
  frame and not the reverse, and that the frame can be built against stub panels — so nothing here is
  gated on `ABC-019` shipping.
- **No dependency on `ABC-020` or `ABC-021`.** The pane lists moves; it says nothing about terminal
  state or claims. Recorded because every other `EPIC-002` ticket gained one on 2026-07-31 and the
  absence here is deliberate rather than an oversight. **Re-checked 2026-08-10 and still true** —
  `A11` forbids the pane from touching the machinery those tickets own.

## Security / NFR triggers

- `NFR-002` (full redraw < 16 ms) — **the bar has three parts and the third is the one that binds.**
  Recorded with its machine, per `plans/nfr-catalog.md`'s convention.

  1. **Pane compute ≤ 150 µs at each of 40 / 120 / 300 plies.** *(Unchanged, and now validated by
     measurement rather than by arithmetic: worst measured **75.95 µs at 378 plies, 0.51x the bar**.)*
  2. **The three figures within 3x of each other** — the machine-independent half. *(**CORRECTED
     2026-08-10 — D1.** This was `2x`. Measured on the correct build: **1.845x**, i.e. **7.7%
     headroom**, on `ABC-012`'s deterministic game — the builder this ticket's own test notes
     mandate. The same correct build measures **1.060x** on a fixed-content knight shuffle. **What
     varies across 40/120/300 is the cost of `legalMoves` in the positions the window happens to
     contain, not the algorithm's asymptotics**, and a bar that a correct build clears by 7.7% on one
     legal test fixture and by 47% on another is measuring the fixture. `ABC-016` carries `3x` for the
     identically shaped bar and measured 1.88x against it; the two panes of one frame now carry the
     same bound. **This is a bar on pane compute under `NFR-002`, not a test-lane bar — `N8-LANE` is
     inherited untouched, below.**)*
  3. **`A11`'s spied call counts.** *(**This is the clause that binds.** The unbounded model it
     replaces measures **95.3 / 382.1 / 1,192.2 µs** at 40 / 120 / 300 and **1,500 µs** at 378 —
     caught by parts 1 and 2 with room to spare — but a build that reintroduces the repetition derive
     or reaches for `takeBack` is caught by neither at every length, and `ABC-016`'s hop is the
     precedent: its wrong build sat at 0.42x of a timing bar while being 91% of the panel's cost.)*

- **The `O(window)` label is an approximation, and the correction belongs here rather than smoothed
  away. CORRECTED 2026-08-10 — D1.** The derivation this block previously carried read: *"replay to
  the window's first ply costs 2.2–3.9 µs (measured, flat, dominated by one `parseFen` at 1.62 µs)
  and 16 visible plies at 4.31–4.45 µs each is ~70 µs, so ~70–75 µs total."*
  **The total is right. The word "flat" is not, and neither is `O(window)` as an unqualified claim:**
  - Reaching the window's first ply requires replaying **every prior ply** from `initialFen`.
    `GameHistory` is `{ initialFen, moves, position }` — **no undo stack** (`ADR-0002` clause 2
    forbids one), **no stored `UndoRecord`**, and **no clone function anywhere in `src/`**
    (`src/history.ts` header says so). There is no backward walk to take.
  - Measured at this hop, over 40 … 4,000 plies with the window's content held constant:
    **replay = 1.56 µs + 7.42 ns × plies, R² 0.99979.** Linear, not flat. The quoted 2.2–3.9 µs band
    brackets 120–378 plies and misses 40 plies (1.78 µs) at the bottom.
  - **So the pane is `O(plies)` in its replay term at 7.42 ns/ply and `O(window)` in its SAN term at
    ~2.5–4.4 µs per visible ply.** The practical consequence is nil inside any legal game — the pane
    measures **79.50 µs at 4,000 plies, 0.53x the bar** — and the decision to bound the pane is
    unaffected. **The correction is to the label, not to the ruling**, and it is written down because
    `NFR-002`'s section states an `O(window)` claim with a boundary condition and a falsifier, and a
    reader is owed the coefficient.
  - **Flagged for Security/NFR at this ticket's gate, not for the catalog today:** when the bounded
    pane is measured on **delivered** code, record the **replay coefficient** alongside the absolute.
    `plans/nfr-catalog.md` is **not edited here** — `NFR-001`–`NFR-008` are settled as of `74e0f81`.

  All figures **Apple M3 (Mac15,13), Node v24.12.0, darwin/arm64**; **`UNKNOWN - verify` on any other
  hardware.** *These are BA/PM's measurements against merged `src/` from an out-of-tree harness — they
  are TARGETS, and Security/NFR owns the verdict.* **Instrument sanity:** `parseFen` measures
  **1.621 µs** here against the **1.62 µs** the original derivation transcribed from wave 1 — 0.06%
  on a figure this hop did not look up until after measuring.

- ~~**`plans/nfr-catalog.md`'s NFR-002 row is owed an update and this ticket is the reason.** That
  row records that *"the frame is a function of GAME LENGTH, not only of position — the history panel
  is O(plies)"*, which was true of the unbounded model and is not true of this one. **The row is
  Architect/Design's to rewrite; flagged here, not edited.**~~
  *(**STRUCK 2026-08-10 by Architect/Design** at task `refinement-ABC-026`, subtask
  `refinement-ABC-026-design`. **The flag was already STALE when it was written, and no edit is owed
  or has been made to the `NFR-002` row.** The bullet is left standing above rather than deleted,
  because the original text is what the Orchestrator's hold decision and the board row both cite.
  **The rewrite this flag asks for landed nine and a half hours after the flag did.** The quoted
  sentence is verbatim from the row's `Applies to` cell as it stood at `f3d5966`; this ticket was cut
  at `03b0a65`, **2026-07-31T00:27:21+03:00**, and `92046f9` — *"docs(architecture): grug correct
  NFR-002 denominator, ply count to bounded window"* — landed at **2026-07-31T09:55:05+03:00**,
  replacing that cell with *"CORRECTED 2026-07-30 — the frame is NO LONGER `O(plies)`"* and adding
  the section-length correction block that states the `O(window)` claim, its boundary condition and
  its falsifier. Checked at the source, not inferred: the quoted string occurs nowhere in the
  `NFR-002` row or its section today. **Acting on this flag would have re-opened the most-corrected
  row in that file for no reason**, which is why it is struck here rather than carried into
  `ABC-017`'s own hop. The ruling, with the commit hashes and timestamps, is recorded in
  `plans/nfr-catalog.md`'s `NFR-002` section and in
  `.grugops/context/refinement-ABC-026/notes/`.)*
  **RE-CHECKED 2026-08-10 at this hop and the strike is accurate and complete.** `plans/nfr-catalog.md`
  was read and not edited; the string *"the frame is a function of GAME LENGTH"* occurs in that file
  only inside Architect/Design's own ruling block, where it is being quoted. **Not re-opened.**
- **What `NFR-002` still owes this ticket is a MEASUREMENT, not a rewrite, and it is unchanged.** The
  bounded-pane compute is `UNKNOWN - verify` in that row's own unknowns table; the closer named there
  is *"`ABC-017`'s cost test at 40 / 120 / 300 plies: ≤ 150 µs absolute **and** the three within 2x"*.
  **The three-within-2x half of that closer is now three-within-3x on this ticket, for the measured
  reason in part 2 above; the difference is flagged for Security/NFR at the gate and the catalog is
  not edited here.** **The result belongs in the `NFR-002` row when it is measured on delivered code;
  the row is not owed anything before then.**
- **NEW, and it applies to this ticket at its Security/NFR gate.** `NFR-002`'s `O(window)` claim rests
  on a **structural** fact verified at `ABC-012`'s gate — *"`src/history.ts` has ZERO importers, so
  nothing pulled the repetition derive into a frame"*. **This pane and `ABC-016`'s status panel are
  the two tickets on this board that can void it.** This ticket's gate must re-verify the importer
  fact on **delivered** code (a `grep` for importers of `src/history.ts`, not a reading of this
  ticket) and say so. Ruled 2026-08-10 by Architect/Design; owner **Security/NFR at this ticket's
  gate**; trigger: this ticket entering `In Security/NFR`. **`A11` is this ticket's own half of that
  obligation and does not discharge the gate's.** *(Checked at this hop for information only:
  `src/history.ts` has exactly one importer today, `src/history.test.ts`.)*
- **This ticket inherits `NFR-008`'s standing per-ticket lane bar `N8-LANE`** (added
  2026-08-10 to `plans/nfr-catalog.md`): the tests it adds may cost **≤ 5% of the lane's TOTAL
  budget — ≤ 650 ms CPU (user + sys)** — **not** 5% of the lane as it stands, **net of ~160 ms CPU
  per test file added**, as the median of paired per-round deltas over n ≥ 7 interleaved rounds with
  an identity null control. **Do not re-derive a lane bar for this ticket** — that practice has cost
  this board two ruling hops.
  **CORRECTED 2026-08-10 — D16: it adds TWO test files, not one, so its floor allowance is ~320 ms
  CPU and its content allowance is 650 ms.** `A11` is a spied call count and vitest's module-registry
  isolation is **per file**; `ABC-026`'s hop measured that `--no-isolate` fails in exactly the three
  `*.nfr.test.ts` files carrying this project's spy-based guards, which is why those guards live in
  their own files. **No bar is re-derived and no clause of `N8-LANE` is changed** — only the file
  count this ticket declares against it.
- **No security trigger.** SAN strings are derived from generator-owned `Move`s; no user-supplied
  text reaches this pane. **Re-checked 2026-08-10** — the pane's only inputs are a `GameHistory` and
  the FEN string inside it, and `parseFen` owns that parse.

## Test notes

- **The ten length cases of `A1` (0, 1, 3, 19, 20, 40, 80, 120, 300, 2,000 plies) must assert the row
  count AND the row width explicitly**, not just the content. The count and the width are the
  criteria; the content is the feature. *(**CORRECTED 2026-08-10 — D17.** This read "the three length
  cases (0, 1, 80, 300 plies)", which **names four**, and none of the odd ones.)*
- **`A4`'s 19-ply case is not optional and it is not a duplicate of `A3`.** It is the only case in
  this ticket that distinguishes "the last 8 move numbers" from "the last 16 plies", and a build that
  gets it wrong renders every cell of the pane in the wrong column.
- **`A6`'s anchors must be built with `newGame(fen)` and not by playing from the start FEN.** The
  black-to-move anchor is the one no implementation stumbles into by accident.
- **The cost test asserts a ratio, an absolute, AND a call count.** The absolute is machine-dependent
  and will drift; the ratio is machine-independent but is measurably fixture-dependent (1.06x vs
  1.85x for the same build on two legal long-game builders — see the NFR block); **the call count is
  what actually fails when the pane starts deriving.** State the machine beside the microseconds and
  put no wall-clock assertion in the suite — this project's standing rule.
- **Building the long games. `ABC-012`'s deterministic pseudo-random game
  (`src/history.test.ts:74-88`) terminates at exactly 378 plies** — measured at this hop, so it is
  the right builder for 40 / 80 / 120 / 300 and **cannot** produce `A11`'s 2,000-ply case. For that,
  use a legal knight shuffle, which is what `ABC-018`'s own suite already uses to build a real
  300-ply game. **Do not hand-write 300 moves.**
- **`A11` goes in its own test file** (`*.nfr.test.ts` shape), for the module-registry isolation
  reason recorded under `N8-LANE` above. That is the second of this ticket's two test files.
- **`A9`'s two snapshots must be taken before the first render**, and the test must render **twice**.
  A snapshot taken between two renders is byte-identical across a build that corrupts on every one —
  measured at `ABC-016`.

## Size and priority rationale

**Size `S` (2), re-derived 2026-08-10 and unmoved — at the top of the `S` band.** Layout and
numbering over a slice of an existing list, plus `toSan` per visible ply. No chess logic, no new
module of consequence, and the bound removes the only hard part. **This hop's eighteen fixes moved
almost no implementation work**: the move number and the column are two fields of a position the
replay already produces (`fullmoveNumber`, `blackToMove`), the constant width is one format string,
and `HISTORY_ROWS` / `HISTORY_COLS` are two exported constants. What grew is **test** work — 8
criteria to 12, and a second file for the spies. Calibrated against `ABC-006` (`S`), `ABC-011` (`S`)
and `ABC-018` (`S`); below `ABC-016` (`M`), which carries **seven items with seven different
derivations** where this pane has **one derivation applied sixteen times**. It would have been `M` or
worse under the unbounded model, where the pane would have had to negotiate with the viewport.

**Priority `P2`.** The game is fully playable without it: the board renders, the loop runs, the
status panel names the last move. It is the "feel" item, and `EPIC-006`'s end screen carries the
full list regardless. Not `P3` — `P3` is "someday", and this is in the epic's scope line and in its
Done. It is the right thing to drop first if this epic runs long.

*Re-read 2026-07-31 against the owner's legality-first directive and **deliberately left at `P2`**.
The directive re-ranks rules-correctness above renderer work; this ticket is the most purely
renderer-side item on the board and it is already in the drop-first tier. There is nothing below `P2`
that is not "someday", and moving it to `P3` would say this is optional, which the epic's own scope
line contradicts. No change is the judgment, not the absence of one.*

*Re-read a third time 2026-08-10 at this hop and **still `P2`**. One thing changed under it and it
confirms the ranking rather than disturbing it: `ABC-018` is merged and `ABC-016` is in `Ready` at
`P1`, so the frame's other two panels are both ahead of this one — which is the order `P2` describes.
Nothing in the eighteen defects raises the cost of dropping this ticket, and the `NFR-002` closer it
owns is a measurement on delivered code, which a dropped ticket simply does not owe.*

## Definition of Ready

Re-derived from the checklist and the source at `refinement-ABC-017`, 2026-08-10. **Before → after.**

| # | Check | Before | After |
|---|---|---|---|
| 1 | problem clear | ✅ | ✅ |
| 2 | scope and out-of-scope clear | ⚠️ D5 D6 D7 D9 D13 D14 | ✅ row count, width, alignment and both half-rows now in scope; the glyph mode out of it |
| 3 | INVEST | ⚠️ D2 — *independent* is conditional: nothing stopped this pane voiding `NFR-002`'s boundary condition | ✅ `A11` |
| 4 | acceptance testable and measurable | ❌ D3 D4 D7 D8 D10 D11 D12 | ✅ 12 criteria, 5 constructed wrong builds killed |
| 5 | dependencies known | ⚠️ D15 | ✅ `ABC-016`/`ABC-018`/`ABC-019` added, `ABC-014`'s reason corrected |
| 6 | security/NFR triggers, measurable | ❌ D1 D16 | ✅ measured, three parts, `N8-LANE` inherited with the right file count |
| 7 | test notes present | ⚠️ D17 | ✅ |
| 8 | size assigned | ✅ | ✅ `S`, re-derived |
| 9 | priority assigned | ✅ | ✅ `P2`, re-read a third time |
| 10 | no major unresolved blocker | ✅ | ✅ `ABC-012`/`ABC-013`/`ABC-014`/`ABC-018` all merged on `main`; two flags carried with owners, neither blocking |

**D18: the block this replaces claimed ✅ on all ten**, including *"acceptance measurable ✅ (exact
row counts at four game lengths, exact move numbers, a ratio bound and an absolute bound)"* — for
criteria under which five different wrong builds pass. **A self-assessment that is wrong is a defect,
because it is what a promoting role reads.**

**Carried, with owners, neither blocking:** the replay coefficient for `NFR-002` (Security/NFR, at
this ticket's gate) and `ABC-010`'s unbounded `fullmoveNumber` (carried, not owned).

**PROMOTED to `Ready` 2026-08-10 by BA/PM.** The board move itself is the Orchestrator's.
