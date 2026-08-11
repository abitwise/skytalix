---
id: ABC-017
title: Bounded move-history pane — two-column SAN, constant height, constant width
status: in-development
column: In Development
size: S
priority: P2
epic: EPIC-002
feature: —
---

# ABC-017 — Bounded move-history pane: two-column SAN, constant height, constant width

> **AMENDED 2026-08-11 by BA/PM at task `repair-panel-tickets` (Workflow 07), applying accepted
> `ADR-0009`. TWO DEFECTS ON A `Ready` TICKET, AND ONE CRITERION THIS TICKET OWED AND DID NOT HAVE.**
> `ADR-0009` is the input and is **not re-litigated**; what is recorded here is what applying it
> exposed. Acceptance goes **12 → 13**; `A1` loses a clause and gains two; size `S` and priority `P2`
> both re-derived and both unmoved.
>
> | # | Defect | Evidence |
> |---|---|---|
> | D19 | **`A1`'s `frameHeight(...) is 23` clause was the ENTIRE import edge to `ABC-016`** — it evaluated `STATUS_ROWS`, a symbol only `ABC-016` produces, which coupled the project-wide **blocking** typecheck gate to `ABC-016` landing first. It was also **blind to a 10-row board** (`board: 9` literal, mutant M4). Three dependent statements elsewhere on the ticket go false with it | mutants run |
> | D20 ⭐ | **This ticket merges SECOND, so `ADR-0009` cl. 5 puts the composition fit-check on it — and it was in NO criterion.** Its `## Size and priority` also asserts *"nothing … raises the cost of dropping this ticket"*, which the fit-check makes false | ruled + measured |
>
> **The new criterion is `A13`, and it was witnessed rather than asserted.** Eight row-count mutants
> were run against merged `src/frame.ts` / `src/render.ts` from an out-of-tree harness —
> Architect/Design's six **re-run rather than transcribed**, plus two added here — with every `4b`
> verdict taken from `beginFrameSession`'s own strategy choice on a 24-row TTY. `renderBoard` measured
> at **9 rows of 18 characters**. Results are in `A13`. Three of them are load-bearing:
>
> > **`A13`'s `= 23` tripwire is the only form that fails every mutant that moves `H`** — no panel's
> > own clause does, and **M4 (`renderBoard` ships 10) is caught by `renderBoard(...).length` and by
> > nothing else**, which is why `ADR-0009` cl. 6 derives the board term instead of exporting it.
> > **The `<= 24` clause is not a weaker `= 23`** — it is the one that states what `4b` needs, and M7
> > (status 4 + history 7, `H` still 23) is the case that proves the two clauses are doing different
> > jobs. **And the merged assertion at `src/frame.test.ts:633` is blind to all eight**, because its
> > three terms are local shadows at `:38-43`.
>
> **One correction to the record, found here and reported rather than quietly used:** `ADR-0009` and
> Architect/Design's notes state that `src/frame.test.ts:632-638` *"passes on all six mutants"*. That
> is exact for the **assertion** at `:633` and wrong for the **test**, whose third assertion reads the
> real `renderBoard` — measured, the test **FAILS M4 and M5** today. **The suite hole is real but
> narrower than recorded, and it still contains M3**, one of the mutants that kill `4b`. Nothing in the
> ruling changes; `A13` is strictly stronger. Detail in `## Test notes`. **The ADR is NOT edited** — a
> concurrent Architect/Design hop owns `memory-bank/50-decisions/` this wave.
>
> **Zero production lines; `src/` byte-identical to `main`.** `plans/board.md`,
> `plans/nfr-catalog.md` and `memory-bank/50-decisions/` **not edited**.

> **AMENDED 2026-08-11 by BA/PM at task `refinement-ABC-027-cut` (Workflow 07), applying accepted
> `ADR-0010` clause 6. ONE JUSTIFICATION STRUCK AS MEASURED FALSE — AND IT WAS IN THREE PLACES, NOT
> ONE. NO CRITERION CHANGES, ACCEPTANCE STAYS AT 13, SIZE `S` AND PRIORITY `P2` BOTH RE-DERIVED AND
> BOTH UNMOVED.**
>
> `ADR-0010` is the input and is **not re-litigated**. **`A2`'s constant-width assertion is KEPT in
> full.** What is struck is its claim that the pane *"is expected to be the widest panel and
> therefore to SET `W`"* and the frame-level argument under it — **measured false**: this pane is
> **21–24** columns against the delivered status panel's **45 / 50 / 67** whenever a draw is
> claimable, and `src/frame.ts:179` is a **max**, so only the largest contributor is visible. The
> frame-level half is now the **consumer's** (`ADR-0010` cl. 1) and lives on **`ABC-027`**; this
> ticket owes it nothing. **Same move as `ADR-0009` cl. 3/4: strike the cross-ticket clause, keep the
> panel-local half.**
>
> | # | Defect | Evidence |
> |---|---|---|
> | D21 ⭐ | **`ADR-0010` names ONE site for this edit and the ticket carries THREE.** `A2`'s parenthetical (`## Acceptance`), the `ABC-014` dependency line (*"making this pane the frame's `W`"*), and the `ABC-018` dependency line (*"which is why `A2` is a criterion and not a nicety"*). **Correcting only the named one would have left the ticket asserting the struck claim twice** — the same shape as D19, where one struck clause left three dependent statements false elsewhere | read at source, all three struck here |
>
> **This ticket is UNBUILT and in `Ready for Dev`, which is why this edit is free.** `ADR-0010`
> `## Consequences` says so explicitly and it is the reason the hop happened now rather than after a
> build. **Zero production lines and zero test lines — `src/` byte-identical to `main`.**
> `plans/board.md`, `plans/nfr-catalog.md` and `memory-bank/50-decisions/` **not edited**;
> `ABC-016` and `ABC-019` **not edited** — an agent is live in each of their worktrees.
>
> **One PROHIBITION recorded on this ticket and it is not paperwork: no constant-FRAME-width
> criterion may be added here.** Under `ADR-0010` cl. 1 the frame's `W` varies by design, and that
> form was measured to fail the **correct** build. `A2` bounds this **pane's** width — a different
> quantity, unaffected, and still required.

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
  2026-08-10 — D13; its REASON REPLACED 2026-08-11 — `ADR-0009` cl. 1, D19. The requirement stands;
  the argument for it does not.** D13 argued the export from the fact that *"`ABC-016`'s
  already-promoted `A11` hardcodes `history: 8` inside a criterion of a neighbouring ticket"*, and
  concluded *"two tickets carrying the same magic number with nothing tying them is how the two come
  to disagree."* **`A11` no longer hardcodes it** — `ADR-0009` cl. 4 struck that clause — so the
  premise is gone. **The conclusion was reaching for the wrong remedy anyway**: tying the two tickets
  together is what created the import edge, and D13's own diagnosis (*"nothing tying them"*) pointed at
  a shared constant when what was missing was a **single place that reads both**. Measured at this hop:
  the shared-number forms — a literal, or a local shadow like merged `src/frame.test.ts:38-43` — pass
  every mutant in `A13`'s table. **The export is required for two live reasons instead:** `ABC-018`'s
  `frameHeight` consumes this pane's row count as a **session constant** read once before the first
  frame (`src/frame.ts:84`, `:211`), and `ADR-0009` cl. 1 — **the producer owns its count** — makes
  this module the only place `HISTORY_ROWS` may live. **`A13` is the single place that reads both
  counts**, and it reads them from delivered code.)*
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

**A1 — the row count is a NUMBER, at every length, and it is THIS pane's number. Given** histories of
**0, 1, 3, 19, 20, 40, 80, 120, 300 and 2,000** plies, **when** the pane renders, **then** it has
**exactly `HISTORY_ROWS` rows** in every case, **`HISTORY_ROWS` is `8`**, and **`HISTORY_ROWS` is read
from this module's own `export`** — imported by the test, never re-declared as a local constant beside
it.

*(**[ADDED/CORRECTED 2026-08-10 — D13, D14. AMENDED 2026-08-11 — `ADR-0009` cl. 3 and 5, D19: one
clause STRUCK, two ADDED.]** The struck clause read *"and `frameHeight({ board: 9, status:
STATUS_ROWS, history: HISTORY_ROWS })` is 23 — the epic's reference layout, which fits a 24-row
terminal."* **That clause was the entire import edge to `ABC-016`** — `STATUS_ROWS` is a symbol only
`ABC-016` produces, and `tsconfig.json` includes `src/**/*.ts` while `npm run typecheck` is
project-wide `tsc --noEmit` with `gate_enforcement: blocking`, so importing it here would have made
**the whole project's blocking typecheck gate** depend on `ABC-016` having landed first. With the
clause gone there is no edge in either direction, this pane goes green alone, and
`## Dependencies`' sentence *"no import edge either way"* becomes true as written.*

*The struck clause's second problem is that **it was blind to the board**: it hardcoded `board: 9`, so
a `renderBoard` shipping 10 rows passed it — re-measured at this hop, M4 below. Paying an import edge
bought two terms of three.*

*The measurement kept from 2026-08-10, still true: 22 / 23 / 24 / 25 frame rows at `history` = 7 / 8 /
9 / 10, so 8 fits a 24-row terminal with one row of slack and 10 does not fit at all.*

*The old parenthetical also said* **"`ABC-016`'s `A11` asserts the same identity from the other side;
when both land, neither ticket owns the 8 alone."** ***Both halves are now false and the second was
the argument for the edge.*** *`A11` no longer asserts that identity (`ADR-0009` cl. 4 struck the same
clause there), and under cl. 1 **each ticket owns exactly its own count**: `ABC-016` owns
`STATUS_ROWS`, this ticket owns `HISTORY_ROWS` and `HISTORY_COLS`, `src/frame.ts` keeps `MESSAGE_ROWS`
and `PROMPT_ROWS`. **The composition is asserted once, by `A13`, and nobody's number is co-owned.***

*The two added clauses are the same pair `ABC-016`'s `A11` gained, for the same measured reason: `A1`
said only* "exactly `HISTORY_ROWS` = 8 rows" *and never said where `HISTORY_ROWS` comes from, so a
build returning 8 rows and **exporting no constant** satisfies it with the test supplying its own
`const HISTORY_ROWS = 8`. **Merged `src/frame.test.ts:40` does exactly that today**, labelled *"`ABC-017`'s
stated constant"*, and that shadow form passes every mutant in `A13`'s table. The export is
load-bearing: `ABC-018`'s `frameHeight` consumes it as a session constant (`src/frame.ts:84`, `:211`),
and **`A13` cannot read delivered geometry without it.**)*

**A2 — constant WIDTH, and what "blank" means. Given** every case in `A1`, **when** the pane
renders, **then** every row is **exactly `HISTORY_COLS` characters**, `HISTORY_COLS` does **not**
vary with game length, move-number magnitude or SAN length, and a **blank row is `HISTORY_COLS`
spaces**. **Given** 0 plies, **then** all 8 rows are blank. **Given** 300 plies, **then** the 8 rows
are identical in count and width to the 0-ply case.

*(**[CORRECTED 2026-08-10 — D6.]** The original said *"identical in count and width to the 0-ply
case"* and separately that at 0 plies *"every row is blank"*, and **the two could not both hold**.
Measured on an unpadded correct build: 0-ply rows are **0** characters, 80-ply rows **14–15**, 300-ply
rows **16–17** — because move numbers gain digits and SAN strings vary from `e4` to `dxc8=Q+`.*

*~~The quantity is frame-level and not cosmetic: `src/frame.ts:179` takes the frame's `W` as the
**widest panel row**, so a pane whose width moves makes the whole frame breathe every ply — the same
failure `ABC-016`'s `A7` width clause was added to stop. **This pane is expected to be the widest
panel and therefore to SET `W`**; `ABC-018`'s own QE note already anticipates that (`renderBoard` is
18 wide).~~*

*(**STRUCK 2026-08-11 by BA/PM at task `refinement-ABC-027-cut`, applying accepted `ADR-0010`
clause 6. THE ASSERTION ABOVE IS KEPT IN FULL; only this justification for it is struck, and it is
struck as MEASURED FALSE rather than as a wording preference.** The pane is **21–24** columns wide
against the delivered status panel's **45 / 50 / 67** in every state where a draw is claimable, so
this pane does **not** set `W` and `src/frame.ts:179`'s max hides it whenever the panel is wider.
The frame-level half is now someone else's: `ADR-0010` clause 1 rules that the **CONSUMER** owns
frame-width stability — `src/frame.ts`'s in-place writer clears each row as it writes it —
**because `W` composes by MAX while `H` composes by SUM**, and a producer-side width promise is
unverifiable from outside the panel and green by masking as its normal state. The change lives on
**`ABC-027`**. **This is the same move `ADR-0009` clauses 3 and 4 made on this ticket:** strike the
cross-ticket clause, keep the panel-local half.*

*The panel-local justification, which is the one that survives and is enough on its own:* **a ragged
pane is ugly and `A3` asserts sixteen cells in fixed columns** *— a pane whose rows differ in length
cannot put a cell in a stated column, and `A3`, `A6` and `A7` all read cells positionally. `A2` was
worth having before the frame-level argument existed and it is worth having without it.*

*Two consequences, so nothing downstream is read as still true:* **(i)** *`ABC-016`'s `A7` stands as
delivered but its stated reason is superseded the same way — it is a legibility clause now, not a
defence against stale columns (`ADR-0010` clause 5, and `ABC-016` is owed no criterion change and
**zero** production lines);* **(ii)** ***no constant-FRAME-width criterion may be added to this
ticket or any other*** *— under `ADR-0010` clause 1 the frame's `W` varies by design, and such a
criterion was measured to fail the **correct** build. `A2` bounds this PANE's width, which is a
different quantity and is unaffected.)*

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

**A13 — the composition fit-check, in `src/frame.test.ts`, with all three terms read from DELIVERED
geometry. Given** merged `ABC-016` and this pane, **when** the three local shadow constants at
`src/frame.test.ts:38-43` are replaced so that every term of the frame's height reads delivered code —

| term | reads | must NOT be |
|---|---|---|
| `board` | `renderBoard(<position>, <mode>, <orientation>).length` | a literal `9`, a local shadow, or an import from `src/render.ts` |
| `status` | `ABC-016`'s exported `STATUS_ROWS` | a literal `3` or a local shadow |
| `history` | this pane's exported `HISTORY_ROWS` | a literal `8` or a local shadow |

— **then** both of the following hold:

- **`frameHeight({ board, status, history })` is exactly `23`** — the **tripwire**. Any panel
  row-count change fails it, which is what forces the change to be deliberate rather than silent.
- **the same value is `<= 24`** — the **requirement**. This is what epic acceptance `4b` actually
  needs and what `beginFrameSession` switches on.

**and** `src/render.ts` is not modified and gains **no** row-count export.

*(**[ADDED 2026-08-11 — `ADR-0009` cl. 5 and 6.** This ticket merges **second**, so the fit-check is
its obligation. Named in ticket text rather than smuggled into a build, because it is **an edit to
`ABC-018`'s already-merged test file** and a new obligation on a merged ticket's file has to be
visible on a ticket.)*

*(**Why it exists, measured at this hop against merged `src/` rather than argued.** Eight row-count
mutants — Architect/Design's six, **re-run rather than transcribed**, plus two this hop added — each
assertion form evaluated exactly as its ticket words it, `4b` taken from `beginFrameSession`'s own
strategy choice on a 24-row TTY rather than from arithmetic:*

| mutant | `A1` (own clause) | `ABC-016` `A11` | merged shadow `:633` | `A13` `= 23` | `A13` `<= 24` | H | `4b` |
|---|---|---|---|---|---|---|---|
| delivered as budgeted 9/3/8 | PASS | PASS | PASS | PASS | PASS | 23 | yes |
| M1 status ships 4 | PASS | **FAIL** | PASS | **FAIL** | PASS | 24 | yes |
| M2 history ships 9 | **FAIL** | PASS | PASS | **FAIL** | PASS | 24 | yes |
| M3 history ships 10 | **FAIL** | PASS | PASS | **FAIL** | **FAIL** | 25 | **no** |
| M4 `renderBoard` ships 10 | PASS | PASS | PASS | **FAIL** | PASS | 24 | yes |
| M5 board 10 **and** history 9 | **FAIL** | PASS | PASS | **FAIL** | **FAIL** | 25 | **no** |
| M6 status ships 5 *(added here)* | PASS | **FAIL** | PASS | **FAIL** | **FAIL** | 25 | **no** |
| M7 status 4 **and** history 7 *(added here)* | **FAIL** | **FAIL** | PASS | PASS | PASS | 23 | yes |

*Four things fall out and each is a reason a clause is worded the way it is:*

1. ***`A13` `= 23` is the only form that fails every mutant that moves `H`.*** *No panel's own clause
   does: `A1` is blind to M1, M4 and M6, `A11` is blind to M2–M5. **`M4` is the one that ONLY
   `renderBoard(...).length` catches**, which is why the board term is a measurement and not a
   constant — and why `ADR-0009` cl. 6 adds no `BOARD_ROWS` export instead of touching a merged
   module.*
2. ***The `<= 24` clause is not a weaker restatement of `= 23`; it is the one that names the actual
   requirement.*** *M3, M5 and M6 are the mutants where `4b` dies, and `<= 24` is the clause that says
   so. `= 23` also fails on M1/M2/M4, where `4b` is **fine** — that is the tripwire doing its job (a
   row-count change must be deliberate), not a requirement being breached. Keeping both means a future
   row-count change can be **ratified by moving one number** without anyone having to rediscover which
   of the two mattered.*
3. ***M7 is why both clauses read delivered geometry and not `HEIGHT`.*** *A compensating change —
   status 4, history 7 — leaves `H` at 23, so `A13` correctly PASSES while `A11` and `A1` correctly
   FAIL on their own counts. The division of labour is deliberate: each panel pins its own number and
   `A13` pins only the composition. **A single criterion trying to do both would have to fail on M7,
   where nothing is wrong with the frame.***
4. ***The merged assertion at `:633` passes M1–M6 because its three terms are local literals.*** *It
   is a tautology over `src/frame.test.ts:38-43` and proves `frameHeight`'s arithmetic, nothing about
   any panel. **`A13` does not add a fourth copy of it — it makes the existing one live.** See
   `## Test notes`, which carries the mechanical detail and one correction to the record.)*

*(**`A13` IS NOT `ADR-0009` CLAUSE 9, and the ADR itself says so — do not let a later hop conflate
them.** Clause 9 was added to `ADR-0009` on 2026-08-11 at task `design-stub-seam-and-nfr002`,
governing **`ABC-019`'s loop** as a *consumer* of panel rows: it names no row count, takes its session
height as `firstFrame.length`, and owes its own assertion that every frame's `length` equals that
height (9a, 9e). The ADR's own point (iv) checked the overlap and ruled there is none: **"Clause 5
proves the real panels compose to a frame that fits. It says nothing about whether the loop's session
height equals the frame the loop assembles. Two different propositions; neither substitutes for the
other."** So `A13` does **not** discharge anything on `ABC-019`, and `ABC-019`'s clause-9 assertion
does **not** discharge `A13`. Clauses 1–8 are unchanged by that amendment — verified at source at this
hop — so nothing in `A13` above moves. **One further non-conflict, stated because 9d reads like a
contradiction of `## Test notes` and is not:** 9d requires **`ABC-019`'s** stub seam to use row counts
that DIFFER from 3 and 8, so a hardcoded height fails at its own gate. It says nothing about
`src/frame.test.ts`'s `statusStub` / `historyStub`, which are `ABC-018`'s, must stay at the reference
layout because that file asserts `H` = 23, and are cited by 9c as the precedent for where a test double
belongs.)*

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
  `HISTORY_COLS` is expected to exceed, ~~making this pane the frame's `W`~~.)* *(**SECOND SITE OF
  THE SAME STRUCK CLAIM, found and corrected 2026-08-11 — `ADR-0010` cl. 6. The clause that survives
  is the first half:** exceeding the board's 18 is measured and true. **Exceeding the board does not
  make this pane the frame's `W`** — the delivered status panel reaches 45 / 50 / 67 against this
  pane's 21–24, and `src/frame.ts:179` is a max, so only the largest contributor is visible. See
  `A2`.)*
- **`ABC-018`** (the frame). **Merged on `main`. ADDED 2026-08-10 — D15.** Three edges, all in
  merged code: `FrameParts.history` takes this pane's rows; `frameHeight` takes `HISTORY_ROWS` as a
  **session constant** known before the first frame; and `assembleFrame` takes the widest panel row
  as the frame's `W` (`src/frame.ts:179`), ~~which is why `A2` is a criterion and not a nicety~~.
  *(**THIRD SITE, corrected 2026-08-11 — `ADR-0010` cl. 1 and 6. The FACT is true and stays; the
  INFERENCE from it is struck.** `:179` is a max and is unchanged by `ADR-0010` (cl. 2). But `A2` is
  a criterion for **panel-local** reasons now — `A3` asserts sixteen cells in fixed columns — and
  **not** because this pane governs the frame's width. Frame-width stability is the **consumer's**
  under `ADR-0010` cl. 1 and lives on **`ABC-027`**; this ticket owes it **nothing** and gains no
  criterion from it.)*
  **A FOURTH EDGE ADDED 2026-08-11 — `ADR-0009` cl. 5, and it runs the other way: this ticket EDITS
  `ABC-018`'s merged test file.** `A13` replaces the three local shadow constants at
  `src/frame.test.ts:38-43` with delivered geometry and adds the `<= 24` clause. **Test-only — zero
  production lines, and `src/frame.ts` is not touched.** Named here because a new obligation on a
  merged ticket's file must be visible on a ticket rather than discovered in a diff.
- **`ABC-016`** (the status panel). **ADDED 2026-08-10 — D13; CORRECTED 2026-08-11 — `ADR-0009` cl. 2,
  3 and 4, D19.** **Not a code dependency — no import edge either way, and that is now true of the
  criteria too.** *This line read* "but its promoted criterion `A11` hardcodes `history: 8`, so the two
  tickets share a number and `A1` is where they are tied." ***All three clauses are now false.*** *`A11`
  no longer hardcodes `history: 8` (cl. 4 struck it); the two tickets share **no** number (cl. 1 — each
  owns its own); and `A1` ties nothing (cl. 3 struck its `frameHeight` clause, which was the entire
  import edge). **What remains is a real but ORDERING-ONLY dependency:** `A13` reads `ABC-016`'s
  exported `STATUS_ROWS` from delivered code, so **`A13` is not evaluable until `ABC-016` has merged.**
  Everything else on this ticket — `A1`–`A12` — goes green with `ABC-016` absent, which is exactly what
  `ADR-0009` cl. 8 means by downgrading the merge order from forced to preferred. **`A13` is the one
  criterion that makes this ticket the second of the two, and it is the reason the fit-check has a
  definite home instead of a "whoever is second" rule nobody can read off a ticket.***
- **`ABC-019`** (the turn loop). **ADDED 2026-08-10 — D15.** It owns the render seam and hands this
  pane the `GameHistory`. `ABC-018`'s own dependency block records that `ABC-019` depends on the
  frame and not the reverse, and that the frame can be built against stub panels — so nothing here is
  gated on `ABC-019` shipping.
- **`ABC-027`** (the in-place writer clears each row). **ADDED 2026-08-11 — `ADR-0010` cl. 1 and 6.
  NOT a code dependency and NOT a criterion dependency in either direction — it is ORDERING-ONLY,
  and it is named here so it is not discovered in a diff (D15's defect class).** `ABC-027` carries
  the frame-width obligation this ticket's `A2` used to justify itself with; it needs **no** symbol
  from this pane and this pane needs none from it. **The one real contact point is that both tickets
  edit `src/frame.test.ts`** — `A13` touches the shadow-constant block at `:38-45` and the `= 23` /
  `<= 24` assertions at `:288` and `:633`; `ABC-027` touches the screen model, `:374`, `:376`, `:419`
  and `:735-771`. **Measured at `refinement-ABC-027-cut`: the two edit DISJOINT line ranges and no
  line is claimed by both**, so either merge order works and a rebase settles it. **Merge order is
  the Orchestrator's**; BA/PM's recommendation and its one condition are argued in `ABC-027`'s
  `## Size and priority rationale`. **Nothing on this ticket is gated on `ABC-027` shipping.**
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
- **NEW 2026-08-11 — `A13` gives `NFR-002` a STRUCTURAL link, and no target moves.** That row's write
  half carries *"a 23-row frame at `W = 18`, 418 characters serialized"* as its **measured
  denominator**. If any panel ever ships a different row count, that denominator silently stops
  describing the delivered frame and the row's measured figure stops being about the thing it names.
  **`A13`'s `= 23` tripwire is what makes such a change fail loudly instead.** Recorded in
  `plans/nfr-catalog.md`'s `NFR-002` section by Architect/Design at `design-frame-contract`; **no
  target, bar or measured figure moves, and that file is NOT edited here.**
- **`A13` adds NO test file and does not touch `N8-LANE`'s file count.** It edits
  `src/frame.test.ts`, which is `ABC-018`'s and already in the lane, and it adds on the order of two
  assertions. **The declaration stays TWO files, floor ~320 ms, content allowance 650 ms** — `A13`'s
  cost is content, and negligible. **Do not re-derive a lane bar for this criterion**; that practice
  has cost this board two ruling hops and nothing in `ADR-0009` reopens `NFR-008`.
- **No security trigger.** SAN strings are derived from generator-owned `Move`s; no user-supplied
  text reaches this pane. **Re-checked 2026-08-10** — the pane's only inputs are a `GameHistory` and
  the FEN string inside it, and `parseFen` owns that parse. **Re-checked 2026-08-11 for `A13`: it
  reads two integers and one array length from delivered code and introduces no input.**

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
- **[ADDED 2026-08-11] `A13` is not a new test — it makes an existing one live, and the edit is
  smaller and wider than it looks. Read at source at this hop so nobody discovers it mid-build:**
  - **`src/frame.test.ts:45` derives `HEIGHT` from the three shadows** and **~40 assertions consume
    it** (`:285`, `:301`, `:316`, `:352`, `:365`, `:379-380`, `:391-393`, `:410-420`, `:429-438`,
    `:445`, `:457`, `:498-500`, `:513-519`, `:528-534`, `:558`, `:567`, `:575-576`, `:586`,
    `:678-683`, `:699`, `:709`, `:725-726`, `:752`, `:764`), including every
    `beginFrameSession(sink, HEIGHT)` and `captureSink(true, HEIGHT)`. **Replacing the shadows
    re-provenances all of them at once.** They stay green while delivered geometry is 9/3/8 — but the
    edit is not local, and that is the honest size of it.
  - **`:288` already asserts `expect(HEIGHT).toBe(23)`**, with a comment saying it is *"near-vacuous
    under fixed-height stubs — BA/PM ruled it left in place for exactly that reason. The falsifiable
    weight sits in the criterion below."* **Once `HEIGHT` reads delivered geometry, `:288` IS `A13`'s
    `= 23` tripwire and stops being vacuous.** So satisfy `A13` by making the terms live and **adding
    the `<= 24` clause** — do **not** add a third copy of `= 23`. `:633`'s first assertion is the same
    arithmetic as `:288` and goes live with it.
  - **`BOARD_ROWS` cannot become an import** (`ADR-0009` cl. 6 adds no export to `src/render.ts`), so
    it becomes `renderBoard(...).length`. Its one non-arithmetic use, `:769`, indexes the frame's rows
    and works unchanged with a derived number.
  - **`historyStub` (`:67-78`) sizes itself from `HISTORY_ROWS`; `statusStub` (`:55-59`) does NOT — it
    returns a hardcoded three-element array.** So after the swap the stub and the real `STATUS_ROWS`
    can disagree, and the failure surfaces at `:285` (`expect([...counts]).toEqual([HEIGHT])`) with a
    message that points at the wrong thing. **Size both stubs from the constants, or replace them with
    the real panels.** Either is fine; leaving them as they are is the trap.
  - **Making `HEIGHT` live does not on its own catch anything.** Measured: with `historyStub` sized
    from a live `HISTORY_ROWS`, a `history: 10` build gives `HEIGHT` = 25 and every
    `toHaveLength(HEIGHT)` and `captureSink(true, HEIGHT)` assertion stays green — they are
    self-consistent. **Only the literal `23` and the literal `24` fail.** Write `A13` against those two
    numbers, never against `HEIGHT` compared with itself.
- **[ADDED 2026-08-11] ONE CORRECTION TO THE RECORD, measured here and reported rather than quietly
  used.** `ADR-0009` and Architect/Design's notes state that *"`src/frame.test.ts:632-638` passes on
  all six mutants"* and call it a hole in a merged suite. **That is exact for the ASSERTION at `:633`
  and wrong for the TEST at `:632-638`, which is the unit a suite fails.** Its third assertion
  (`:635-637`) is `assembleFrame(partsFor(playTo(4), { status: [4 rows] }))` expecting 24 rows, and
  `partsFor` takes `board` from the **real `renderBoard`** while `assembleFrame` returns the sum of
  the arrays it is handed — so that clause is **live on the board term**. Measured: the test **FAILS
  M4 and M5** today and passes M1, M2, M3, M6, M7. **The hole is real but narrower than recorded, and
  it still contains M3 — one of the three mutants that kill `4b`.** *This changes nothing about
  `ADR-0009`'s ruling* (`A13` is strictly stronger, failing all of M1–M6), and the ADR is not
  re-opened; it is written down because the ADR calls that table *"the whole basis of the decision"*
  and its `## Consequences` state the all-six claim as fact.

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
~~Nothing in the eighteen defects raises the cost of dropping this ticket, and the `NFR-002` closer it
owns is a measurement on delivered code, which a dropped ticket simply does not owe.~~*

**Size `S` (2) re-derived 2026-08-11 and unmoved; priority `P2` re-read a FOURTH time and unmoved —
but the struck sentence above is now FALSE and that is a defect this hop found, not a wording
preference (D20).**

***Size.*** *`A13` is the only addition. It removes a clause from `A1` and adds one criterion whose
whole content is: swap three constants for delivered geometry in a file that already exists, and add
one `<= 24` assertion. **No production line, no new module, no new test file, no new input.** Against
that, `## Test notes` now records that the swap re-provenances the `HEIGHT` ~40 assertions consume —
which is breadth, not depth: they stay green at 9/3/8, and the risk is a confusing failure message
rather than work. `S` (2) holds, still at the top of the band, still below `ABC-016` (`M`). **It would
move to `M` only if `A13` required touching `src/frame.ts`, and `ADR-0009` cl. 5 and 6 exist precisely
so that it does not.***

***Priority, and the sentence that became false.*** *"Nothing in the eighteen defects raises the cost
of dropping this ticket" was true of those eighteen and is **not** true after `ADR-0009`. **`A13` is
now the only guard on delivered code for epic acceptance `4b`'s 24-row budget across the `board` and
`history` terms.** Measured at this hop: `ABC-016`'s `A11` catches a `status` change (M1, M6) and is
blind to M2–M5; the merged assertion at `:633` is blind to all of them; so with this ticket dropped,
**M2, M3 and M5 are caught by nothing on delivered code — and M3 and M5 are two of the three mutants
that make `4b` unreachable.** The `NFR-002` denominator link above is a second, smaller cost.*

***Why `P2` still does not move.*** *The **value** ranking is untouched — the game is fully playable
without a history pane, and `EPIC-006`'s end screen carries the full list — and re-ranking a ticket
because a test obligation was parked on it would be letting a checklist set product priority.
`ADR-0009` cl. 5 homes the fit-check on "whichever merges second", not on "whichever is most
important". **What changes is that dropping this ticket is no longer free, and the cost is now named
rather than denied:** `A13` must be **re-homed** — to `ABC-019`, which composes the real panels, or to
a ticket of its own. **Flagged for the Orchestrator, which owns merge order and board moves; not taken
here.** `P3` remains wrong for the reason given above.*

**Size `S` (2) re-derived 2026-08-11 at `refinement-ABC-027-cut` and unmoved; priority `P2` re-read a
FIFTH time and unmoved. `ADR-0010` moved neither, and it is worth saying why each stayed put, because
the ruling touched this ticket's text and could plausibly have moved either.**

***Size — nothing was added and nothing was removed.*** *The edit strikes a justification in three
places and adds no criterion, no clause, no test, no file and no production line. Acceptance stays at
**13**. `A2`'s assertion — every row exactly `HISTORY_COLS`, blank rows included — is **unchanged
character for character**, so the implementation work behind it is unchanged: one format string.
**`S` (2) holds, still at the top of the band.** The one thing that could have moved it did the
opposite: `ADR-0010` cl. 2 rules that **no panel reserves, pads or declares a frame width and the
delivered panel needs zero production lines**, so the reserve-your-own-width alternative — which
would have put a padding obligation on this pane and plausibly made it `M` — was **rejected by
measurement** (it costs a 67-column frame with 49 permanently blank columns and **+152%** bytes per
frame).*

***Priority — the value ranking is untouched and so is the cost of dropping it.*** *The game is still
fully playable without a history pane and `EPIC-006`'s end screen still carries the full list, so the
`P2` value argument stands verbatim. **`ADR-0010` did not add a cost to dropping this ticket and did
not remove one:** the D20 cost recorded above — `A13` is the only delivered-code guard on `4b`'s
`board` and `history` row budget and must be **re-homed** if this ticket is dropped — is a **row-count**
obligation under `ADR-0009`, and `ADR-0010` cl. 3 and 4 explicitly leave row counts alone. The
frame-width obligation that arrived this hop landed on **`ABC-027`**, not here. **`P2` is the judgment
again, not the absence of one.** One ordering note, which is the Orchestrator's and not a priority
change: **BA/PM disputes the `ABC-027`-after-`ABC-017` preference and recommends the reverse** — the
argument is in `ABC-027`'s `## Size and priority rationale`. Nothing on this ticket depends on the
outcome.*

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

**RE-DERIVED AGAIN 2026-08-11 by BA/PM at task `repair-panel-tickets` (Workflow 07), applying accepted
`ADR-0009`. The 2026-08-10 block above claimed ✅ on items 3, 4 and 5, and all three were wrong** —
`A1` named a symbol only `ABC-016` produces, so *independent* was false; the fit-check this ticket owes
for merging second existed nowhere; and the `ABC-016` dependency line stated three things that the ADR
makes false. **D18 said a self-assessment that is wrong is a defect because it is what a promoting role
reads. It happened again, one day later, on the same ticket.**

| # | Check | At promotion (2026-08-10) | After the `ADR-0009` repair |
|---|---|---|---|
| 1 | problem clear | ✅ | ✅ unchanged |
| 2 | scope and out-of-scope clear | ⚠️ D19 — the `HISTORY_ROWS` bullet argued the export from `A11`'s hardcode, a premise the ADR removes | ✅ re-argued from cl. 1 (producer owns its count) + `frameHeight`'s session constant |
| 3 | INVEST | ❌ **D19** — *independent* was FALSE: `A1` evaluated `STATUS_ROWS`, coupling the project-wide **blocking** typecheck gate to `ABC-016` landing first | ✅ zero import edge either way; `A1`–`A12` go green with `ABC-016` absent, `A13` is ordering-only |
| 4 | acceptance testable and measurable | ❌ **D19** — `A1`'s struck clause was blind to a 10-row board (M4), and the composition fit-check `ADR-0009` cl. 5 assigns to this ticket was in no criterion | ✅ 13 criteria; `A13` added and witnessed against 8 measured mutants; `A1`'s provenance pinned |
| 5 | dependencies known | ❌ **D19** — the `ABC-016` line's three clauses are all false after the ADR, and the edit to `ABC-018`'s **merged** test file was an unnamed obligation | ✅ `ABC-016` corrected to ordering-only; `ABC-018`'s fourth edge (test-only) named |
| 6 | security/NFR triggers, measurable | ✅ | ✅ unchanged targets; `NFR-002` gains a structural link and `N8-LANE`'s file count is confirmed at 2 |
| 7 | test notes present | ⚠️ — nothing recorded about the merged file `A13` edits | ✅ `HEIGHT`'s provenance, `:288`, the stub asymmetry, and one correction to the mutant record |
| 8 | size assigned | ✅ `S` | ✅ `S`, re-derived — `A13` adds no file and no production line |
| 9 | priority assigned | ✅ `P2` | ✅ `P2`, re-read a fourth time — **and D20's false sentence corrected**: dropping this ticket is no longer free |
| 10 | no major unresolved blocker | ✅ | ✅ `ABC-012`/`ABC-013`/`ABC-014`/`ABC-018` merged; `A13` needs `ABC-016` merged, which the standing merge order already delivers |

**Every ✅ in the right-hand column was verified against merged `src/` at this hop.** `A13`'s
eight-mutant table was **run**, not transcribed; `4b` reachability came from `beginFrameSession`'s own
strategy choice on a 24-row TTY; `renderBoard(...).length` was **measured at 9 rows of 18 characters**;
and the claims about `src/frame.test.ts` (`HEIGHT` at `:45`, the `= 23` at `:288`, the shadows at
`:38-43`, `historyStub` vs `statusStub`) were **read at source**. **Zero production lines: `src/` is
byte-identical to `main`.**

**Three flags carried, each with an owner, none blocking:** the replay coefficient for `NFR-002`
(Security/NFR, at this ticket's gate); `ABC-010`'s unbounded `fullmoveNumber` (carried, not owned);
and **NEW — if this ticket is dropped, deferred or resequenced, `A13` must be RE-HOMED** (the
Orchestrator), because it is the only delivered-code guard on `4b`'s `board` and `history` row budget.

**What this hop deliberately did NOT do.** It did not re-litigate `ADR-0009` (accepted). It did not
edit `plans/board.md` (the Orchestrator's), `plans/nfr-catalog.md` or `memory-bank/50-decisions/` (a
concurrent Architect/Design hop's this wave) — including the one correction it found to `ADR-0009`'s
mutant table, which is recorded in `## Test notes` and flagged, not applied to the ADR.

**RE-DERIVED A THIRD TIME 2026-08-11 by BA/PM at task `refinement-ABC-027-cut` (Workflow 07),
applying accepted `ADR-0010` cl. 6. THE EDIT DOES NOT BREAK THE DoR. VERDICT: STILL MET, 10 of 10 —
the ticket stays where it is and does NOT move back to `Ready`.** The question was asked explicitly
and it was checked item by item rather than answered by inspection, because on this ticket a wrong
self-assessment has been a recorded defect twice (D18, then again one day later at D19).

| # | Check | After the `ADR-0010` edit | What moved |
|---|---|---|---|
| 1 | problem clear | ✅ | nothing — the user, the pain and the value are untouched |
| 2 | scope and out-of-scope clear | ✅ | nothing removed; **one PROHIBITION added** (no constant-FRAME-width criterion here), which narrows scope rather than blurring it |
| 3 | INVEST | ✅ | *independent* still holds and was re-checked: `ABC-027` needs no symbol from this pane and this pane needs none from it; **`A1`–`A12` still go green with `ABC-016` absent** and `A13` is still ordering-only |
| 4 | acceptance testable and measurable | ✅ | **13 criteria, unchanged. `A2`'s assertion is unchanged character for character** — only its justification was struck, and a justification is not a criterion |
| 5 | dependencies known | ✅ | **`ABC-027` ADDED as an explicit ORDERING-ONLY dependency with the shared file named and the line ranges measured disjoint.** Leaving it unlisted would have recreated D15 exactly |
| 6 | security/NFR triggers, measurable | ✅ | unchanged. No target, bar or measured figure moves; `plans/nfr-catalog.md` not edited. `ADR-0010`'s `NFR-002` denominator note is the Architect's and is already recorded there |
| 7 | test notes present | ✅ | unchanged, and checked at source: **no line of `## Test notes` rested on the struck claim**, so nothing there went stale with it |
| 8 | size assigned | ✅ `S` | re-derived a third time; the edit adds no criterion, file or production line, and `ADR-0010` cl. 2 removed the one alternative that could have grown it |
| 9 | priority assigned | ✅ `P2` | re-read a fifth time; the value ranking is untouched and `ADR-0010` neither added nor removed a cost to dropping this ticket |
| 10 | no major unresolved blocker | ✅ | unchanged. `ABC-012`/`ABC-013`/`ABC-014`/`ABC-018` merged; `A13` still needs `ABC-016` merged, which the standing merge order delivers; `ABC-027` blocks nothing here |

**Why item 4 is the one that could have failed, and why it does not.** `ADR-0010` cl. 6 struck a
sentence sitting inside an acceptance criterion's parenthetical, and on this board that has twice
turned out to falsify statements elsewhere. It was checked rather than assumed: the **assertion**
half of `A2` — every row exactly `HISTORY_COLS`, `HISTORY_COLS` invariant under game length, move
magnitude and SAN length, a blank row is `HISTORY_COLS` spaces, 0-ply and 300-ply identical — makes
**no reference to the frame, to `W`, or to any other panel**. It is testable against this pane's
returned rows alone. **The struck claim was load-bearing for the ARGUMENT and load-bearing for
nothing that runs.**

**The one thing this hop found that `ADR-0010` did not name: the struck claim was in THREE places
(D21), not one.** Two of them are in `## Dependencies`, where a build reads for its edges. All three
are struck above and each is marked at its site.

**Three flags carried, unchanged, each with an owner, none blocking** — the replay coefficient for
`NFR-002` (Security/NFR, at this ticket's gate); `ABC-010`'s unbounded `fullmoveNumber` (carried, not
owned); and `A13`'s re-homing if this ticket is dropped, deferred or resequenced (the Orchestrator).

**What this hop deliberately did NOT do.** It did not re-litigate `ADR-0010` or `ADR-0009` (both
accepted). It did not touch a criterion, a size, a priority or a column. It did not edit
`plans/board.md` (the Orchestrator's), `plans/nfr-catalog.md`, `memory-bank/50-decisions/`,
`ABC-016` or `ABC-019` (an agent is live in each of the last two's worktrees), or anything under
`src/`.
