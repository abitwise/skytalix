---
id: ABC-017
title: Bounded move-history pane — two-column SAN, constant height, constant width
status: in-security-nfr
column: In Security/NFR
size: S
priority: P2
epic: EPIC-002
feature: —
---

# ABC-017 — Bounded move-history pane: two-column SAN, constant height, constant width

> **AMENDED 2026-08-12 by BA/PM at task `refinement-ABC-017-gaps` (Workflow 07), ruling QE's five
> criteria gaps and the Security/NFR gate's `RF-1`. FOUR GAPS CLOSED, ONE LEFT OPEN ON PURPOSE, AND
> `RF-1`'s CRITERION HALF TURNED OUT TO BE MINE — for a defect neither gate named. Acceptance goes
> 13 → 14; NOTHING is renumbered and NOTHING is deleted. Size `S` and priority `P2` both re-derived a
> SEVENTH time and both unmoved; `SPLIT_REQUIRED` checked and it does not apply. Zero production lines
> and zero test lines — `src/history-pane.ts` md5 `54fd4346dcc1a0060c4e66ae0149265d`, unchanged.**
>
> **BOTH GATES RETURNED `PASS_WITH_RISKS` WITH ZERO CODE DEFECTS.** The delivered pane is correct on
> every input either gate could construct, including the three families the criteria never reached.
> **Everything below is a repair of what the criteria ASK. The Engineer is owed fixtures, not a fix.**
>
> | # | Defect | Evidence |
> |---|---|---|
> | D24 ⭐ | **No criterion combined a black-to-move anchor with a window long enough to SLIDE, and one survivor RETURNS NINE ROWS** from a pane whose single reason for existing is a constant height. `A6`'s three anchors are **5 plies each** so the window never moves; `A1`'s ten lengths are **all white-anchored**; `A2`'s black anchor is **1 ply**; and **`A13` cannot see it, because `A13` composes the exported CONSTANT and never the pane's OUTPUT**. `WLEAD-B` puts a phantom empty white cell atop every slid black-anchored pane — **`D5`'s class INVERTED, passed by the criterion added FOR `D5`**. **Closed in `A6`** | 3 survivors (QE, 740/740); gap re-read at source here; the fixture's rows **measured** on delivered code |
> | D25 ⭐ | **Nothing required the caller to be USABLE, or the pane FRESH, after a render.** `WFREEZE` bricks the caller (`Object.freeze` → the next `playMove` throws) and satisfies `A9` **exactly**; `WCACHE` shows move 1 forever. **`playMove` mutates in place (`src/history.ts:85-88`), so `ABC-019`'s loop hands the SAME OBJECT every frame.** **Closed by NEW `A14`** | 2 survivors + 1 whose only catcher is accidental; `A14`'s two panes **measured** here |
> | D26 | **`A9` guarded two of `GameHistory`'s three fields, and its before/after shape is blind to a pane that RESTORES what it broke.** `initialFen` — **the anchor**, the input `A6`/`D4`/`D5` all turn on — was unguarded (`WFENSET` survived), and `WSPLICE` mutates mid-render and puts it back. **Closed in `A9`**: third field, plus *"at no point DURING a render"* | 2 survivors; fields read at `src/history.ts:34-46` |
> | D27 | **`A11`'s clause was MEASURABLY FALSE as worded, and that is BA/PM's defect.** *"Zero runtime importers"* carried no scope, and `src/history.ts` has **FOUR** — all test files. The delivered guard was the half that was right: it is scoped to production and says so. *"Runtime importer"* was also **defined nowhere**, which is exactly how a guard implementing one of five forms could look adequate. **Corrected in `A11`** | counted a third time here, statement-scoped, surface enumerated exhaustively |
>
> **The `RF-1` verdict, since the gate explicitly left it open: the criterion MOVES, and the ruling
> SPLITS.** The gate asked whether the clause was already right and the guard merely weaker. **On
> REACH it was — that half is the ENGINEER's alone and I add nothing to it**: `WDYNIMP` and
> `WBAREIMP` survive 740/740, and closing that needs a better instrument, not better words. **On SCOPE
> and DEFINITION the clause was wrong, and that half is MINE** — `D27`. Both halves land on the same
> Engineer hop.
>
> **The `G2` trap, resolved rather than recorded.** QE found that `WCACHE` dies **only** by the fixture
> SHARING that the `D23` remedy removed — so the remedy and the only catcher pointed in opposite
> directions. **The tension was an artefact of the property being unnamed.** Three properties were
> riding on two criteria: determinism (a cache satisfies it perfectly), non-mutation (needs a FRESH
> object — `D23`), and **freshness (needs ONE object rendered twice ACROSS a mutation, by
> construction)**. Giving freshness its own criterion with its own deliberately-shared object dissolves
> it: **`A11` can now be tidied to per-test fixtures freely and nothing is lost.** Putting freshness
> into `A9` — the criterion `D23` just forced onto fresh objects — is the single edit that would have
> made the contradiction real, and it is the reason `A14` is a new criterion rather than a clause.
>
> **`G5` / `AR-4` is LEFT OPEN AND UNOWNED, deliberately.** `WCOLS24R` now survives **740/740** — worse
> than QE could measure, because `ABC-027` has merged and does not close it. **`HISTORY_COLS` HOLDS at
> 21**, no widening, no criterion here or anywhere, no constant-FRAME-width criterion, `ADR-0009` and
> `ADR-0010` **not re-opened**. Security/NFR left it unhomed saying *"recording a fake owner to satisfy
> the format would be worse"*; **that is upheld — leaving a gap unclosed with a recorded reason is a
> ruling, and this one is made on purpose.**
>
> **TWO RECORD CORRECTIONS, both owed and both made.** (1) The `src/history.ts` importer count is
> **FOUR, not the THREE this ticket stated in bold** — and the SHAPE was wrong too: **two → four, not
> one → three**. The missed importer is `src/status-panel.nfr.test.ts`, **`ABC-016`'s, already on
> `main`**, reaching it by `vi.mock` + `await import` — *the exact form the correction was written to
> catch, missed one ticket over*. Production runtime importers are **ZERO**. (2) **`## Test notes` was
> WRONG about `A6`'s `not.toContain(1)`** and the Engineer was right to keep it against the note: on
> `WPHANTOM` the clause fails *"expected [ 27, 28, 29, 1 ] to not include 1"*, and without it **nothing
> in the acceptance table sees that build at all**. **No criterion changes and no test changes** — only
> the note.
>
> **Board move requested, NOT taken: NONE — `ABC-017` stays in `In Development`**, where the
> Orchestrator placed it for exactly this sequence. The Engineer's fixture hop follows this one.
> `plans/board.md` is the Orchestrator's and was **not** written. *(One trap named: this branch is one
> commit behind `main` and its `plans/board.md` copy still shows this ticket under `In Security/NFR`.
> `main`'s board is correct and the frontmatter is correct in both trees — **do not "fix" the branch
> copy**, it conflicts with `e22ed72` at the rebase.)*

> **AMENDED 2026-08-12 by BA/PM at task `refinement-ABC-017-a3` (Workflow 07). ONE VACUOUS CLAUSE
> STRUCK, AND THE HUNT FOR ITS SIBLINGS FOUND A SURVIVOR. Acceptance stays at 13; size `S` and
> priority `P2` both re-derived and both unmoved. Zero production lines — `src/` is byte-identical
> to the build hop, and nothing under `src/` was written at this hop.**
>
> The routed defect was `A3`'s last clause. **The hunt it triggered is what mattered**: `A1`–`A12`
> had never had a QE pass, and the shape — *a check that cannot fail* — had already been found four
> times this round.
>
> | # | Defect | Evidence |
> |---|---|---|
> | D22 | **`A3`'s last clause cannot fail, and NEITHER OBVIOUS REPAIR CAN EITHER.** As worded it names literals a padded layout can never emit, so it survives `W15` — the exact wrong build it reads as a guard against. The Engineer's suggested move-number rewording and the whole-row form actually delivered are both falsifiable in isolation but **strictly implied by `A3`'s own eight-row table asserted above them**, so neither can ever be the assertion that reports. **Struck, not reworded** | 4 clause forms run against `W15` |
> | D23 ⭐ | **`A9`'s snapshot clause could not fail as delivered, and there is a SURVIVOR.** Its fixtures are module-scope singletons already rendered by `A1`, `A2` and `A6`, so the snapshot is taken *after* any first-render corruption. **`WPOS` — a pane that corrupts the caller's `history.position` once per object — passes 697/697 on 24 files.** This is the `ABC-016` defect `A9` exists to prevent, reproduced at FILE scope | wrong build run; zero catchers |
>
> **Three smaller findings of the same family are recorded in `## Test notes` rather than as criterion
> changes**: `A1` asserts its `= 8` tripwire before its row-count requirement in one `it` (the shape
> the Engineer split `A13` for); four assertions across `A3`, `A4` and `A6` are strictly implied by an
> exact-list assertion earlier in the same `it`; and `A11`'s `<= 2 × HISTORY_ROWS` clause compares two
> of the test's own numbers rather than the build's call count.
>
> **`A13` is confirmed MET IN PART and its deferral is RATIFIED** — the `TS2307` was reproduced at
> this hop. **But its trigger has fired: `ABC-016` merged at `149d643` and `main` is now `505216c`,
> while this branch is rebased onto `98c8a8d`.** Both owed edits were applied out of tree and gated:
> `tsc --noEmit` clean, **732/732 on 26 files**, and the `statusStub` half is measured load-bearing.
>
> **`src/history.ts`'s test runtime importers are THREE, not two** — corrected in the Security/NFR
> block, where the gate reads, and deliberately not in `## Dependencies`.
>
> **This ruling NEEDS THE ENGINEER.** D22 is wording only, but D23 requires a fixture change and
> `A13` requires two. **Recommended board move: `In Review` → `In Development`.** The board is the
> Orchestrator's and was not written; the frontmatter `column` is left as it stands for the same
> reason. `plans/board.md`, `plans/nfr-catalog.md`, `memory-bank/50-decisions/`, `ABC-016`, `ABC-019`
> and `ABC-027` were **not** edited, and `ADR-0009` / `ADR-0010` were **not** re-opened.

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

~~and the pane contains **neither** `e4 e5` **nor** `Nf3 Nc6` — moves 1 and 2 have slid out of the
window.~~

**The eight rows above are the WHOLE of what this criterion asserts about the pane's content.** Moves
1 and 2 are absent because the table begins at `3.` and ends at `10.`, and for no other reason. **No
separate "the window has slid" clause belongs here** — see the strike below. The property is asserted
independently, and non-vacuously, by **`A5`**.

*(**STRUCK 2026-08-12 by BA/PM at task `refinement-ABC-017-a3` (Workflow 07). D22 — A CLAUSE THAT
CANNOT FAIL, AND THE TWO OBVIOUS REPAIRS CANNOT FAIL EITHER.** Flagged by the Engineer at the build
hop and routed here before QE; measured at this hop on the DELIVERED pane and on a constructed wrong
build, not argued.*

***The clause as worded is vacuous absolutely.*** *`A2` and this criterion's own sixteen-cell
requirement together force fixed, padded columns, so **two SAN cells are never separated by a single
space** and the literals `e4 e5` and `Nf3 Nc6` are strings the format cannot emit. Measured on the
delivered pane at 3 plies — a pane that **does** show move 1 in full:*

```
[   1. e4      e5     ]   contains "e4 e5"     -> false
[   2. Nf3            ]   contains "Nf3 Nc6"   -> false
```

***And it survives the exact wrong build it reads as if it were guarding against.*** *`W15` — the
build that shows the FIRST eight move numbers instead of the most recent — renders `1. e4 e5` and
`2. Nf3 Nc6` in its top two rows and **passes this clause**, because those rows are padded too.*

***The Engineer's suggested repair was JUDGED AND NOT ADOPTED.*** *It proposed restating the clause as
move NUMBERS (*"no row is numbered 1 or 2"*), the form `A5` uses. Measured: that form is falsifiable
in isolation — it fails `W15` — but **it is strictly implied by the eight-row table asserted above it
in the same criterion**, so it can never be the assertion that reports. The same is true of the
whole-normalised-row form the Engineer actually delivered. Run against `W15`:*

| clause form | verdict on `W15` | is it ever the discriminator? |
|---|---|---|
| the exact eight-row table (asserted FIRST) | **FAIL** | **yes** — it is the criterion |
| `contains neither "e4 e5" nor "Nf3 Nc6"` (as worded) | PASS | **no** — no build can fail it |
| `not.toContain("1. e4 e5")` on whole rows (as delivered) | **FAIL** | **no** — the table fails first |
| `no row is numbered 1 or 2` (as suggested) | **FAIL** | **no** — the table fails first |

***So the clause is not repairable in this position, and that is the ruling.*** *Once a criterion pins
all eight rows exactly, every statement about what the pane does **not** contain is a logical
consequence of the table. A restatement is not a second guard; it is a sentence a later reader will
mistake for one — which is what the Engineer flagged and it is right. **The fix is to delete the
clause, not to reword it**, and to say in prose why the table starts at `3.`.*

***Nothing is lost, and that was checked rather than assumed.*** *`A5` asserts the eight most recent
move numbers of the 80-ply game as an ordered list of integers, as the ONLY assertion of its
criterion, so it reports its own verdict — measured on `W15`: `expected [1,2,3,4,5,6,7,8] to deeply
equal [33,...,40]`. **`A5` is where "the window has slid" is guarded, and it is guarded there
non-vacuously.** `A6`'s third clause covers this criterion's own fixture from the other side.)*

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
| `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 27` | the **same knight cycle carried to 20 plies** | `30. Nc3 Nb8` … `37. Nb1` — **the window has SLID and the leading half-row is GONE** |

and in the third case the first row's **white cell is empty** and its black cell holds the first ply.
In none of the **first three** does the pane contain a row numbered `1.`.

**The FOURTH anchor is a black-to-move anchor whose window has SLID, and it carries three
requirements of its own:** the pane has **exactly `HISTORY_ROWS` rows**; its eight row numbers are
**30, 31, 32, 33, 34, 35, 36, 37** as an ordered list of integers; and **row 1's white cell is NOT
empty** — it holds `Nc3`. The last row is `37. Nb1`, the white ply alone.

*(**[ADDED 2026-08-12 — D24 ⭐, closing QE's `G1` and Security/NFR's `AR-2`.]** **The first three
anchors are five plies each, so their windows NEVER SLIDE** — three rows in a pane of eight — and
the pane's leading-half-row correction is a no-op until `rowsInGame` exceeds `HISTORY_ROWS`. Verified
at source at this hop rather than taken from the gate: `WHITE_ANCHOR_PLIES` and `BLACK_ANCHOR_PLIES`
are **five entries each** (`src/history-pane.test.ts:193-208`); `A1`'s ten lengths are built by
`deterministicGame` and `shuffleGame`, **both `newGame(START_FEN)`** (`:88`, `:108`), so every one of
them is white-anchored; and `A2`'s wide black cell is **one** ply from `WIDE_BLACK_FEN` (`:164`,
`:180`). **So no criterion on this ticket combined a black-to-move anchor with a game long enough for
the window to move**, and the two correction terms were exercised only where they cannot matter.*

***What that cost, measured by QE against the delivered tree:*** *three wrong builds survive the whole
project. **`WLEAD-A` returns NINE ROWS** at every even ply count ≥ 16 from a black-to-move anchor and
**passes 734/734, and 740/740 on the merged tree** — from a pane whose single reason for existing is a
constant height. `WLEAD-B` puts a **phantom empty white cell** at the top of every slid black-anchored
window, which is **`D5`'s defect class INVERTED and passed by the criterion added FOR `D5`**. `A1`
passes both because its lengths are white-anchored; **`A13` passes both because `A13` composes the
exported CONSTANT `HISTORY_ROWS` and never the pane's OUTPUT.** The nine-row figure is QE's
measurement and is attributed rather than re-run — this hop verified the STRUCTURAL gap at source,
which is what makes the criterion owed regardless of any one mutant's row count.*

***The fixture's numbers are WITNESSED, not derived.*** *Measured at this hop against the delivered
pane from an out-of-tree harness — the arithmetic was done first and then checked, because a criterion
carrying a number nobody ran is how this ticket has been wrong before:*

```
[  30. Nc3     Nb8    ]
[  31. Nb1     Nc6    ]
[  32. Nc3     Nb8    ]
[  33. Nb1     Nc6    ]
[  34. Nc3     Nb8    ]
[  35. Nb1     Nc6    ]
[  36. Nc3     Nb8    ]
[  37. Nb1            ]
```

*Eight rows, all **21** characters, numbers **30–37**, and **moves 27, 28 and 29 have slid out** —
three rows, so an off-by-one in either correction term is still visible. The same cycle from the
**white**-to-move anchor at 20 plies renders 29–36, which is the contrast that makes the anchor, and
not the length, the thing under test. **`A5` does not cover this**: `A5`'s game is white-anchored, so
the leading-half-row terms are zero there too.*

***Why here and not in `A1`.*** *`A1` enumerates LENGTHS and is accurate as scoped — its "in every
case" means its own ten cases. The gap is the **product** of two dimensions, and the anchor is `A6`'s
subject, so `A6` is where the fourth combination belongs. **No new criterion is cut for it**, `A1` is
not edited, and nothing is renumbered.*

***One note for the Engineer, so the split rule is not applied where it does not belong.*** *These
three assertions may share one `it`. `## Test notes`' rule separates a TRIPWIRE from a REQUIREMENT;
all three of these are requirements on the pane's OUTPUT, and they discriminate different builds —
`WLEAD-A` fails the row count, `WLEAD-B` fails the white-cell clause — so each reports on the build
it catches and neither masks the other.)*

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

**A9 — determinism and non-mutation, on a history NOTHING has rendered yet. Given** any case above,
**built fresh for this criterion — a `GameHistory` object no earlier test in the file has passed to
`renderHistory`** — **when** it is rendered **twice** and the two panes are compared, **then** they
are **byte-identical**; and **given** `toFen(history.position)`, `history.moves.length` **and
`history.initialFen`** captured **before that object's FIRST render by anything at all**, **then**
**all three** are unchanged after the second. **And the caller's `moves` array is not mutated AT ANY
POINT DURING a render — not merely restored by the time one returns.**

*(**[CORRECTED 2026-08-12 by BA/PM at task `refinement-ABC-017-gaps` (Workflow 07). D26 — `A9`
GUARDED TWO OF `GameHistory`'S THREE FIELDS, AND ITS BEFORE/AFTER SHAPE IS BLIND TO A PANE THAT
RESTORES WHAT IT BROKE.]** Both halves are QE's `G3`, and both are closed here rather than carried.*

***The third field.*** *`GameHistory` is `{ initialFen, moves, position }` — read at source at this
hop, `src/history.ts:34-46`. `A9` named two of them. **`WFENSET` — a pane that rewrites the caller's
`history.initialFen` on every render — SURVIVED 734/734.** `initialFen` is not an incidental third
field: it is **the anchor**, the input `A6`, `D4` and `D5` all turn on, and the one this pane
re-parses on every render. Adding it costs one captured string and one comparison.*

***The timing.*** *`A9`'s non-mutation clauses are a **before/after** snapshot, so a pane that
mutates the caller's array and puts it back is invisible to them. **`WSPLICE` — splices the caller's
`moves` to the window and `unshift`s it back — SURVIVED 734/734**, and it is the build this ticket
previously believed `A11` caught: `A11` spies `takeBack` and `playMove`, and **raw array operations
are neither**, so the claim that `A11` catches "mutates the caller's state mid-render" was true only
for the `takeBack` route. The words **at any point during** are the criterion; a snapshot cannot
satisfy them and the Engineer will need an observation that is live across the call. **This is the
same correction `D10`/`D11` made once already** — that time the snapshot was taken too late, this
time it is taken too coarsely — and it is `A9`'s third timing repair.*

***What is NOT changed.*** *The byte-identical clause keeps its shared cases, exactly as
`## Test notes` allows; only the non-mutation clauses need fresh objects, and that is `D23`'s remedy
unchanged. **Determinism stays `A9`'s and FRESHNESS is deliberately NOT put here** — it is `A14`,
for the reason argued there, and putting it in `A9` is the one thing that would have re-created the
`D23` trap.*

***Measured on delivered code at this hop, out of tree:*** *across two renders of a black-anchored
20-ply history, `initialFen` unchanged, `toFen(position)` unchanged, `moves.length` unchanged — so
**the delivered pane already satisfies every clause above and the Engineer is owed assertions, not a
fix.**)*

*(**[CORRECTED 2026-08-12 by BA/PM at task `refinement-ABC-017-a3` (Workflow 07). D23 ⭐ — THE
SNAPSHOT CLAUSE COULD NOT FAIL AS DELIVERED, AND THERE IS A SURVIVOR.** Found by hunting `A1`–`A12`
for the shape `A3` turned out to have; witnessed by a wrong build run against the delivered tree,
not by reading the test.]*

***What was wrong.*** *This criterion read* "captured **before the first render**" *, which the
delivered suite satisfies on the weaker of its two readings: the snapshot precedes the two renders
**inside `A9`**. But `A9` loops over `ALL_CASES`, and every one of those fourteen `GameHistory`
objects is a **module-scope singleton that `A1`, `A2` and `A6` have already rendered** before `A9`
runs. So the snapshot is taken **after** any first-render corruption has already happened, and a
build that corrupts once per object and is stable thereafter is invisible to it.*

***This is the `ABC-016` defect this criterion was written to prevent, one level up.*** *D10/D11
added the timing clause because* "a snapshot taken between two renders is byte-identical across a
build that corrupts on every render, so only a snapshot taken before the first one catches it." *The
delivered fixtures reproduce exactly that, at FILE scope instead of at test scope.*

***The survivor, measured.*** *`WPOS` — a pane that corrupts the caller's authoritative
`history.position` on the first render of each history object and never again. It changes **no
rendered byte**, because the pane re-parses `initialFen` and never reads `history.position`. It is
the only state `A9`'s `toFen` clause names, and nothing else in `src/` reads it.*

> **`WPOS` passes 697 / 697 on 24 files. Zero catchers in the whole project.**

*A second build, `W9ONCE` — drops one move from the caller's `moves` array once per object — is
caught by seven other tests because it changes output, but **`A9` itself passes it**. The same
criterion, the same fixture kind, one difference:*

| build | `A9` as DELIVERED (shared fixture) | `A9` as WORDED ABOVE (fresh fixture) |
|---|---|---|
| the delivered pane | PASS | PASS |
| `W9ONCE` — corrupts `moves` once per object | **PASS** | **FAIL** — `expected 19 to be 20` |
| `WPOS` — corrupts `position` once per object | **PASS** | **FAIL** — the `toFen` clause |

***Both of `A9`'s non-mutation clauses have zero killing power as delivered, and the byte-identical
clause masks them when they do fire.*** *Measured on `W9` (corrupts on EVERY render): `A9` fails at
`expect(second).toEqual(first)`, which asserts first, so the `moves.length` clause — the one the
ticket calls "the criterion" — **is never evaluated**. That is the same silent-precedence shape as
the original `A13` placement the Engineer split.*

***The fix is a fixture change, not a new assertion, and it is cheap.*** *Build `A9`'s cases inside
the criterion instead of reusing the shared ones. **Measured: one full rebuild of the heavy fixtures
— the 2,000-ply shuffle and the 300-ply deterministic game included — costs 8.2 ms**, against
`N8-LANE`'s 650 ms content allowance and this ticket's measured 730 ms. **No lane bar is re-derived
and none is threatened**; the ticket forbids re-deriving one and it was not.)*

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
has **zero runtime importers AMONG THE PRODUCTION MODULES**, where a file is a **runtime importer** if
evaluating it causes `src/history.ts`'s module body to be **evaluated**. That covers **five** forms and
the criterion is met only against all five: a static **value** import (including `import * as ns` and a
mixed `{ type T, value }`), a **bare side-effect** import, a **re-export**, a **dynamic** `import()` in
a value position, and a `vi.mock` whose factory calls `importOriginal()`. **`import type` is NOT one**
— `verbatimModuleSyntax` erases it.

*(**[CORRECTED 2026-08-12 by BA/PM at task `refinement-ABC-017-gaps` (Workflow 07). D27 — THIS CLAUSE
WAS MEASURABLY FALSE AS WORDED, AND THAT IS BA/PM'S DEFECT, NOT THE ENGINEER'S.]** This is the
criterion half of the Security/NFR gate's **`RF-1`**, and the gate offered me the option of ruling that
no criterion moves. **It moves — for a defect neither gate named.***

***The scope was missing and the clause was FALSE.*** *It read* "after this ticket, `src/history.ts`
still has **zero runtime importers**" *, unqualified. **Counted independently at this hop — statement-
scoped, and the textual surface enumerated exhaustively first (zero re-exports, zero bare imports, zero
extensionless paths) — `src/history.ts` has FOUR runtime importers.** All four are test files; see the
corrected table in `## Security / NFR triggers`. So the criterion as worded is **breached on the
delivered tree by a build everybody agrees is correct**, and a future reader checking it literally would
count four and report a violation that is not one. **The delivered guard is the half that was right:**
it is scoped to production modules and says so in its own comment (`src/history-pane.nfr.test.ts:219-227`).
The word `PRODUCTION` is what the criterion was always supposed to carry, and its absence is mine — this
clause is BA/PM's, added at `D1`/`D2`/`D10`.*

***The definition was missing, and that is why a guard blind in two of five directions could look
adequate.*** *"Runtime importer" appeared nowhere on this ticket. Security/NFR stated the five-form rule
**before** producing its number, which is the right order, and the rule is adopted verbatim above.
Without it the clause cannot discriminate a guard that implements one form from one that implements all
five, and a criterion that cannot discriminate its own guard is not testable.*

***What is the ENGINEER's and NOT mine.*** *The **reach** of the in-suite guard. Its regex
`/^import\s+(?!type\b)[^;]*from\s+"\.\/history\.ts";/m` implements **form 1 only**, so `WDYNIMP`
(`void import("./history.ts")`) and `WBAREIMP` (a bare `import "./history.ts";`) each **survive
740/740 while genuinely pulling the module** — found by QE, reproduced independently by Security/NFR,
and caught by that gate's module-graph load probe. **On that half the gate's framing is exactly right
and I add nothing: the clause was already stronger than the guard, and closing the gap needs no
criterion.** Confirmed HEALTHY in the same regex and recorded so nobody re-sweeps it: multi-line
`import { … }` blocks and `import * as ns` **are** matched.*

***One trap for whoever writes the replacement, read at source at this hop and not obvious.***
*The file that must hold the guard is **itself a runtime importer of `src/history.ts`** — 
`src/history-pane.nfr.test.ts:43-44` is `vi.mock` + `importOriginal()` and `:58-60` is
`await import("./history.ts")`, which `A7`'s `takeBack` and this file's own spies require. **So a
load-closure assertion phrased as "`history.ts` never loads in this process" would fail in the very
file that asserts it.** The property is about the **pane's runtime closure**, not the test process:
the pane's closure is exactly seven modules and `history.ts` is not among them. That is also precisely
why the criterion needs the word `PRODUCTION` — without it, the correct fix looks like it contradicts
the criterion.*

***`NFR-002` is NOT affected and its premise is stronger than before.*** *PRODUCTION runtime importers
are **ZERO**, measured by Security/NFR through module-graph closure with a positive control and an
armed negative control — a stronger result than the `grep` this ticket asked for. **No bar, target or
level moves here; only the words that were wrong.**)*

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

> **STATUS 2026-08-12: `A13` IS MET IN PART, AND THE REMAINDER IS A RE-GATE OBLIGATION WHOSE TRIGGER
> HAS NOW FIRED.** Recorded here, on the ticket, because the docblock at the constant's own site in
> `src/frame.test.ts` is only read by someone who has already decided to open that file — and
> **nothing fails to send them there.** A rebase hop reads the ticket.
>
> **The deferral was RIGHT when it was taken, and that was verified rather than accepted.** With
> `src/status-panel.ts` absent, adding the import produces
> `src/frame.test.ts(61,29): error TS2307: Cannot find module './status-panel.ts'` — run at this hop
> — and `typecheck` is project-wide `tsc --noEmit` under `gate_enforcement: blocking`, which is the
> exact cost `ADR-0009`'s `## Context` measured and refused. The Engineer left it a shadow and
> flagged it. That is the correct call and it is ratified here.
>
> **`ABC-016` HAS SINCE MERGED** — `main` is `505216c`, `ABC-016` landed at `149d643`, and
> `src/status-panel.ts` exports `STATUS_ROWS = 3`. **The branch is rebased onto `98c8a8d`, which is
> no longer `main`.** So `A13` is satisfiable in full today; it is no longer a future obligation.
>
> **Both owed edits were applied out of tree, against merged `ABC-016`, and gated:**
>
> 1. `const STATUS_ROWS = 3` becomes `import { STATUS_ROWS } from "./status-panel.ts"`.
> 2. **`statusStub` is sized from `STATUS_ROWS` instead of returning a hardcoded three-element
>    array.**
>
> **Result: `tsc --noEmit` clean, 732 / 732 on 26 files.** Neither edit conflicts.
>
> **Edit 2 is load-bearing, and the Engineer's word for it — "the trap" — is measured, not
> rhetorical.** On `M1` (status ships 4):
>
> | | failures | the FIRST failure says |
> |---|---|---|
> | **both edits applied** | **4** | `expect(HEIGHT).toBe(23)` — *"expected 24 to be 23"*, `A13`'s tripwire naming the right quantity |
> | **edit 1 only, `statusStub` left hardcoded** | **15** | `expect([...counts]).toEqual([HEIGHT])` — *"expected [23] to deeply equal [24]"*, a cascade about frame row counts and screen contents pointing at the assembler |
>
> **Doing edit 1 without edit 2 turns a four-line diagnosis of a panel's row count into a
> fifteen-failure cascade naming the wrong subsystem.** They are one change and must land together.

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

**A14 — the caller is still USABLE after a render, and the next render is FRESH. Given** a
`GameHistory` the pane has **already rendered once**, **when** the caller plays another move with
`playMove` and the pane renders **the same object** again, **then** the `playMove` **succeeds** — it
does not throw — and the second pane **reflects the new ply**: it is not byte-identical to the first,
and the new ply appears in its cell. **Given** the black-to-move anchor of `A6`'s fourth row at 20
plies, **then** the last row moves from `37. Nb1` to `37. Nb1 Nc6` and `history.moves.length` is
**21**.

*(**[ADDED 2026-08-12 — D25 ⭐, closing QE's `G2` and Security/NFR's `AR-3`. THE ONLY NEW CRITERION
THIS HOP CUTS, AND IT IS CUT RATHER THAN FOLDED INTO `A9` FOR A REASON THAT IS THE WHOLE OF THE
GAP.]***

***The gap.*** *Nothing on this ticket ever **used** a `GameHistory` after rendering it. Two wrong
builds survive the whole project because of it. **`WFREEZE`** — the pane calls `Object.freeze` on the
caller's `moves` — satisfies `A9`'s clauses **exactly** (position unchanged, length unchanged) and
leaves the caller **unable to play another move**: ESM is strict, so the next `playMove`'s
`moves.push` throws `TypeError`. **`WCACHE`** — a pane that memoises rows per `GameHistory` — shows
move 1 forever.*

***The live consumer is real, and it is the next ticket in the merge order.*** *`playMove` mutates
the `GameHistory` **in place** — read at source at this hop, `src/history.ts:85-88`:
`moveListOf(history).push(move)` then `makeMove(history.position, move)` — so **`ABC-019`'s loop hands
the SAME OBJECT to `renderHistory` every frame.** A frozen array leaves that loop unable to play a
move; a cached pane makes the game unreadable from move 2. Both would surface inside `ABC-019` and
name the wrong subsystem.*

***THE TENSION, AND HOW IT IS RESOLVED — this is the part that matters.*** *QE measured that
**`WCACHE` dies only by fixture SHARING in `A11`'s file**: give `A11` the per-test fixtures `D23`
just gave `A9` and `WCACHE` **survives 734/734**, with a green control proving the variant sound. So
the `D23` remedy and the only existing catcher for a caching pane point in **opposite directions**,
and the next person to tidy `A11` would remove a guard without knowing it existed.*

***The resolution is that the tension is an artefact of the property being unnamed, and naming it
dissolves it.*** *Three properties were being carried by two criteria:*

| property | what it needs from a fixture | owner |
|---|---|---|
| **determinism** — same input, same output | anything; a cache satisfies it **perfectly** | `A9` |
| **non-mutation** — the render leaves the caller alone | an object **nothing has rendered yet** (`D23`) | `A9` |
| **freshness** — the next render sees the caller's next move | **one object rendered TWICE ACROSS A MUTATION**, by construction | **`A14`** |

*Freshness is the only one of the three that **requires** a shared object, and it is a statement about
a sequence rather than about a single call. **`D23`'s remedy was never in tension with freshness; it
was in tension with freshness being provided ACCIDENTALLY, by fixtures that happened to be shared
across unrelated tests in another file.** Once `A14` owns the property explicitly — with its own
object, shared deliberately **inside** the criterion — `A11` can be tidied to per-test fixtures freely
and nothing is lost. **That is why this is a new criterion and not a clause on `A9`: putting a
property that requires a shared object inside the criterion `D23` just forced onto fresh objects is
the one edit that would make the contradiction real.***

***Why it earns its place against this ticket's own scope discipline.*** *One test, one object, three
assertions, **no production line and no new test file**. Against that: the failure it catches destroys
the feature's entire purpose in its only consumer, silently, from the second move of every game.
**`WSPLICE` is deliberately NOT this criterion's to catch** — it restores what it breaks, so
render→play→render sees nothing; it belongs to `A9`'s during-render clause and is homed there.*

***Measured on delivered code at this hop, out of tree — so the numbers above are witnessed and the
delivered pane already passes:*** *first render's last row `[  37. Nb1            ]`, then
`playMove`, then `[  37. Nb1     Nc6    ]`; the two panes differ; `moves.length` is 21. **The Engineer
is owed a test, not a fix.***

***No masking, so no split is required:*** *`WFREEZE` fails at the `playMove` call and `WCACHE` fails
at the comparison, so each build reports its own diagnosis.)*

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
  **UPDATED 2026-08-12 at `refinement-ABC-017-a3`: THE CONDITION IS SATISFIED — `ABC-016` MERGED at
  `149d643` and `main` is `505216c`.** The sentence above is left standing because it is the reasoning
  the deferral rests on, but it must now be read in the past tense: `A13` **is** evaluable. This branch
  is rebased onto `98c8a8d`, which was `main` when the build hop ran and is not `main` now, so
  `src/status-panel.ts` is absent from **this worktree** and present on `main`. **The gate figure of
  697/697 on 24 files is against the OLD `main`; the simulated rebase measures 732/732 on 26.**
  Sequencing the rebase is the Orchestrator's.
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
  obligation and does not discharge the gate's.** ~~*(Checked at this hop for information only:
  `src/history.ts` has exactly one importer today, `src/history.test.ts`.)*~~

  ~~**CORRECTED 2026-08-12 by BA/PM at `refinement-ABC-017-a3`. THE COUNT THE GATE WILL FIND IS
  THREE.**~~ **THE COUNT IS FOUR. CORRECTED AGAIN 2026-08-12 by BA/PM at `refinement-ABC-017-gaps`,
  and the SHAPE of the correction was wrong too: it is TWO → FOUR, not one → three.** It is recorded
  HERE and not in `## Dependencies` on purpose — a dependency line records an EDGE between tickets,
  and this is a MEASUREMENT the gate makes. The Engineer said **two**; the `refinement-ABC-017-a3`
  hop said **three**; **both gates independently measured FOUR**, and this hop re-counted a third
  time rather than accepting either:

  | file | how it pulls `src/history.ts` into the runtime graph | whose |
  |---|---|---|
  | `src/history.test.ts` | static value import (`:15-23`) | pre-existing |
  | **`src/status-panel.nfr.test.ts`** | **`vi.mock("./history.ts")` (`:16`) + `importOriginal()` (`:17`) + `await import("./history.ts")` (`:49`)** | **`ABC-016`'s — ALREADY MERGED ON `main`, and this branch does not touch it** |
  | `src/history-pane.test.ts` | static value import (`:27`) — `newGame` / `playMove` / **`takeBack`**, which `A7` requires by name | **this ticket** |
  | `src/history-pane.nfr.test.ts` | **its static import at `:25` is `type`-only**; the runtime pull is `vi.mock` (`:43`) + `importOriginal()` (`:44`) + `await import` (`:58-60`) | **this ticket** |

  **The missed row is `ABC-016`'s, and the shape of the miss is the same one this correction was
  written to prevent — one ticket over.** The `refinement-ABC-017-a3` hop wrote the correction
  *specifically* because a line `grep` for `^import .* from "./history.ts"` misses the
  `vi.mock` + dynamic-`import` form — and then **missed exactly that form in `src/status-panel.nfr.test.ts`**,
  because its table was scoped to the files THIS ticket touches while the sentence above it claimed a
  total. A gate counting from that table reports three, agrees with the note it was handed, and is
  wrong.

  **Counted a third time at `refinement-ABC-017-gaps`, statement-scoped, with the textual surface
  enumerated exhaustively first — every occurrence of `history.ts` in every `.ts` file, plus separate
  sweeps for re-exports, bare side-effect imports and extensionless paths (`from "./history"`):
  ZERO re-exports, ZERO bare imports, ZERO extensionless paths, so nothing can hide.** Correctly
  **excluded** as type-only or type-position: `src/history-pane.ts:61`, `src/status-panel.ts:42`,
  `src/status-panel.test.ts:33`, `src/status-panel.nfr.test.ts:58`; and `src/san.ts:16` is a comment.
  **FOUR, all test files. This ticket takes the count from TWO to FOUR.**

  **One production comment carries the same unqualified phrasing and is FLAGGED, NOT CHANGED.**
  `src/history-pane.ts:30` reads *"so `src/history.ts` keeps its zero runtime importers"* — true of
  the pane's own contribution, unqualified about the total, and the same wording defect `A11` carried
  until this hop. **`src/` is not this ticket's to edit at a refinement hop and it was not edited:
  zero production lines.** It is named for the Engineer's fixture hop as an optional one-word
  clarification, and **no criterion requires it.** By contrast `src/status-panel.ts:24` — *"IT ADDS NO
  RUNTIME IMPORTER"* — is exact, and is the phrasing that should win.

  **`NFR-002`'s claim is UNCHANGED and was re-verified rather than inherited: PRODUCTION runtime
  importers are ZERO.** `src/history-pane.ts` imports `GameHistory` as `import type`, which
  `verbatimModuleSyntax` erases. That half is asserted in-suite against delivered source.

  **One narrowness in that in-suite assertion — for QE, and NOT a criterion change.** It matches
  static value imports only. Measured at this hop: a production module carrying
  `void import("./history.ts")` — a genuine runtime pull — **passes it**. `A11`'s clause says *"zero
  runtime importers"*; the guard implements *"zero static value importers"*. The realistic regression
  this exists to catch (someone writing `import { repetitionCounts } from "./history.ts"`) is caught;
  the dynamic form is not. ~~**The criterion is right and stays as it is**~~; the gap is in the
  guard's reach and is named so QE can decide whether it is worth closing.

  **UPDATED 2026-08-12 at `refinement-ABC-017-gaps` — the struck half was WRONG about the criterion
  and RIGHT about the guard. This is the Security/NFR gate's `RF-1`, and it splits in two.**
  **(i) The guard's reach is wider than this record had it.** QE found a **second** blind direction
  that is not written down anywhere above — `WBAREIMP`, a bare `import "./history.ts";` — because the
  regex requires a `from` clause. **Two of the five forms survive 740/740**, both reproduced
  independently by Security/NFR and both caught by that gate's module-graph load probe. **That half is
  the ENGINEER's and needs no criterion**, exactly as the gate framed it. **(ii) The criterion was not
  right, and it moved** — see `D27` at `A11`'s own site. *"Zero runtime importers"* was unqualified
  and therefore **false on the delivered tree**, where four test files pull `history.ts` at runtime,
  and *"runtime importer"* was defined nowhere on this ticket. **The scope and the definition were
  BA/PM's and are corrected there.** Multi-line `import { … }` blocks and `import * as ns` **are**
  matched — checked and healthy, recorded so nobody re-sweeps it.
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
- **[ADDED 2026-08-12 — the `A1`–`A12` sweep for the shape `A3` and `A13` both had.] ONE RULE, AND IT
  IS THE ONE THIS ROUND KEEPS PAYING FOR: a clause that states the REQUIREMENT and a clause that acts
  as a TRIPWIRE do not go in the same `it`.** A failing assertion ends the test, so the second verdict
  is never reported and the output cannot distinguish the two diagnoses. The Engineer split `A13` for
  exactly this and was right. **Everything below was measured by running wrong builds against the
  delivered tree, not by reading the suite.**
  - **`A1` has the same shape, and it is the only other place where a live requirement is masked.**
    `expect(HISTORY_ROWS).toBe(8)` asserts before `expect(renderHistory(...)).toHaveLength(HISTORY_ROWS)`
    in one `it`. Measured on a self-consistent 9-row build (ships 9, exports 9): `A1` reports
    *"expected 9 to be 8"* and **the row-count requirement is never evaluated** — the output cannot
    say whether the pane still honours its own constant. Low severity, because six other tests fail
    that build; named because we required the split in `A13` and consistency is the point.
    **Put the `= 8` tripwire in its own `it`.**
  - **These assertions are strictly implied by an exact-list assertion earlier in the same `it` and
    can never be the discriminator. QE should not expect a kill from any of them:** `A3`'s
    `numbersOf(rows)` and its two `not.toContain` rows; `A4`'s `numbersOf(rows)`; ~~`A6`'s
    `not.toContain(1)` on the **third** anchor (its `numbersOf` is pinned exactly two lines above).~~
    They are harmless, they cost nothing, and **a later reader will mistake them for protection** —
    which is the whole of D22. Delete them or move them; do not count them.

    **CORRECTED 2026-08-12 at `refinement-ABC-017-gaps` — THIS NOTE WAS WRONG ABOUT `A6`, AND THE
    ENGINEER WAS RIGHT TO KEEP THE CLAUSE AGAINST IT.** The item above told the Engineer to *"delete
    them or move them; do not count them"*, and the Engineer kept `A6`'s `not.toContain(1)` and
    flagged the disagreement. **QE settled it by construction rather than by argument, and the note
    loses.** The clause is written over a **loop across all three anchors**, and the implication
    argument holds only for the **third** — `fromWhite`'s rows 0–2 are pinned by text while its
    `numbersOf` is pinned nowhere, and rows 3–7 of that fixture are asserted by nothing else in the
    project. On `WPHANTOM` — a build emitting a stray row numbered `1.` into the blank region only for
    a white-to-move anchor past fullmove 1, which by construction excludes every other fixture —
    **the clause FAILS with *"expected [ 27, 28, 29, 1 ] to not include 1"*, and with the clause
    removed NOTHING in the acceptance table sees the build at all.** So it is the sole acceptance-table
    catcher for at least one wrong build, and it fired on the **second** anchor, precisely where the
    Engineer said it was live. **The criterion does not change and no test changes** — `A6` says *"in
    none of the three"* and the delivered loop matches it. Only this note was wrong.
    **The general rule is unharmed and still holds**; what was wrong was applying it to a clause whose
    scope is wider than the assertion said to imply it.
  - **`A2`'s "300 plies is identical in count and width to 0 plies" is implied by `A1` plus `A2`'s
    every-row clause and cannot fail alone.** It is in its own `it`, so nothing masks it — it is
    redundant rather than vacuous, and it is left alone. Recorded so a mutant net is not built
    expecting it to kill something.
  - **`A11`'s `expect(rendered).toBeLessThanOrEqual(2 * HISTORY_ROWS)` compares two of the TEST's own
    numbers**, not the build's call count: `rendered` is a literal from the fixture table. The two
    assertions above it make the composition sound, so this is decorative rather than wrong. Bound
    the MEASURED count if it is ever touched.
- **[ADDED 2026-08-12] `A9`'s fixtures must be BUILT INSIDE the criterion.** `ALL_CASES` are
  module-scope singletons that `A1`, `A2` and `A6` have already rendered, which is what made the
  snapshot clause unfalsifiable — see D23 and the survivor it names. **Measured: rebuilding them
  fresh costs 8.2 ms**, so `N8-LANE` is not in play and no bar is re-derived. The byte-identical
  clause may keep using the shared cases; **the two non-mutation clauses may not.**
- **[ADDED 2026-08-12] `A2`'s WIDTH clauses are a self-comparison, and this is recorded as an
  EXPOSURE rather than fixed.** `expect(row).toHaveLength(HISTORY_COLS)` measures the pane against
  the pane's own exported constant, so **a build that pads to 24 columns and exports
  `HISTORY_COLS = 24` passes every width assertion in `A1`–`A12`** — measured. It is caught only by
  the hardcoded slice offsets `row.slice(6, 13)` / `row.slice(14, 21)` in the wide-cell test, and the
  failure message reads as SAN truncation (*"expected ' dxc1=Q' to be 'dxc1=Q+'"*) rather than as a
  width change.
  **No criterion is added and `A2` is NOT edited.** Its assertion stays unchanged character for
  character, as `refinement-ABC-027-cut` left it. Three reasons, and the third binds: epic acceptance
  `4a` gives the exact split to the engineer and only the *requirement* — a 4-digit number and two
  7-character SAN cells, untruncated — is the criterion, which `A2` already asserts; `ADR-0010` cl. 2
  is not re-opened; and **the reason `HISTORY_COLS` is 21 rather than 24 is CROSS-TICKET.** 24 was
  measured at `ADR-0010` to MASK the status panel's width swing — 0/20 stale frames at 24 against
  8/20 at 21. **A restraint taken for another ticket's benefit cannot be guarded by a criterion on
  this one.** Carried as a flag for the Orchestrator; the defect belongs to **`ABC-027`**, which owns
  the swing. **Nothing here proposes widening `HISTORY_COLS`, and it must not be widened.**
  **RE-DERIVED 2026-08-12 by Security/NFR and the exposure is WORSE than recorded — which changes
  nothing here.** `WCOLS24R` survives **740/740**; QE measured 734/734, so **`ABC-027` merging did not
  close it either**, and the six tests `ABC-027` added see nothing. `HISTORY_COLS` **HOLDS at 21**: no
  widening, no criterion on this ticket or any other, no constant-FRAME-width criterion (`ADR-0010`
  cl. 5 refuses it and `W` varies by design), `ADR-0009`/`ADR-0010` **not re-opened**. **`G5`/`AR-4`
  stays deliberately UNOWNED** — see `## Size and priority rationale` for why this hop declined to
  home it.
- **[ADDED 2026-08-12 — the four test edits this hop's rulings owe, and what each is for.]** All four
  land in files that already exist. **No new test file, so `N8-LANE`'s declared file count stays TWO
  and its floor allowance stays ~320 ms.** Everything below is **content** against the 650 ms
  allowance.
  - **`A6`'s fourth anchor** (`src/history-pane.test.ts`): one fixture — the same knight cycle from
    `ANCHOR_27_BLACK` carried to **20** plies rather than five — and three assertions (the row count,
    the ordered list `30…37`, and row 1's white cell **non-empty**). It kills `WLEAD-A`, `WLEAD-B` and
    `WLEAD-C`. **Build it with `newGame(fen)` and never by playing from the start FEN**, the rule the
    other three anchors already carry.
  - **`A9`'s third field and its during-render clause** (`src/history-pane.test.ts`): one more
    captured string compared after, plus an observation that is **live across the call** — a
    before/after snapshot cannot express *"at no point during"*, which is the whole of the clause.
    Freezing the caller's `moves` **in the test** before rendering is one way, and it is the exact
    inverse of `WFREEZE`; the instrument is the Engineer's choice.
  - **`A14`** (`src/history-pane.test.ts`): one object, one `playMove` between two renders. **It must
    SHARE its object across the two renders — that is the property**, and it is not a `D23`
    regression. `A14`'s own table says why.
  - **`RF-1`'s guard** (`src/history-pane.nfr.test.ts`): replace the regex with an assertion over the
    **pane's runtime closure**, not the test process's — that file is itself a runtime importer of
    `history.ts` (`:43-44`, `:58-60`), so a naively-scoped load probe would fail in the very file that
    holds it. **No criterion mandates an instrument**; `A11` now states the property and the five
    forms, and anything that discriminates all five satisfies it.
  - **Expected cost — an ESTIMATE with its basis, NOT a measurement, because this hop measured none of
    it.** The heaviest thing any of these does is build a fixture. A **full** rebuild of all fourteen
    heavy cases — the 2,000-ply shuffle and the 300-ply deterministic game included — was measured at
    `refinement-ABC-017-a3` at **8.2 ms warm**, and the Engineer measured the delivered `A9` fixture
    change at **~35 ms cold, ≈ 6%** of the allowance. **Nothing here rebuilds fourteen:** `A6`'s
    anchor is a 20-ply knight cycle, `A14` is one object plus one `playMove`, and a single render
    costs **39–74 µs** on two roles' measurements. **So the expectation is TENS OF MILLISECONDS —
    inside the 650 ms content allowance with room to spare, and inside the ~410 ms this ticket has
    already measured against it.** **No bar is re-derived and no clause of `N8-LANE` is changed** —
    the ticket forbids it and this hop did not. **The Engineer measures it; this is a prediction to
    check, not a figure to inherit**, and the Engineer has already caught one warm-state figure on
    this ticket.

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

**Size `S` (2) re-derived 2026-08-12 at `refinement-ABC-017-a3` and UNMOVED; priority `P2` re-read a
SIXTH time and UNMOVED. Both were genuinely in question this time, and each is a judgment rather than
an omission.**

***Size — the ticket is BUILT, so the question is what is still owed, and it is four small test
edits.*** *`A3` loses a clause and gains none, which is negative work. `A9` keeps both its clauses and
changes only where its fixtures come from — **measured at 8.2 ms**, so `N8-LANE` is untouched and no
bar is re-derived. `A1`'s tripwire moves into its own `it`, which is the edit the Engineer already
made once on `A13`. `A13`'s two owed edits were **applied out of tree and gated green** —
`tsc --noEmit` clean, **732 / 732 on 26 files** — so their size is known rather than estimated. **No
production line, no new module, no new test file, no new dependency, no architecture change.**
Acceptance stays at **13**. **`S` (2) holds, still at the top of the band, still below `ABC-016`
(`M`).** The one thing that could have moved it — a criterion pinning `HISTORY_COLS`, which would have
reopened `ADR-0010` cl. 2 and put a width obligation on this pane — was **declined**, and the exposure
carried to `ABC-027` instead.*

***Priority — D23 is a test hole, and a test hole does not re-rank a product.*** *The value argument is
untouched verbatim: the game is fully playable without a history pane, the board renders, the loop
runs, the status panel names the last move, and `EPIC-006`'s end screen carries the full list.
**Letting a suite defect set product priority is the same error as letting a checklist set it**, which
this ticket's own `ADR-0009` re-read already refused. `P3` stays wrong for the reason given three
times above: `P3` is "someday", and this is in the epic's scope line and in its Done.*

***What DID change under the priority, and it is recorded rather than denied.*** *D20's cost — `A13` is
the only delivered-code guard on epic `4b`'s 24-row budget across the `board` and `history` terms, so
dropping this ticket is not free and `A13` must be **re-homed** — is **unchanged and still carried**.
What moved is its urgency: **`ABC-016` has merged, so `A13` is satisfiable in full today** rather than
at some future rebase. That makes the debt cheaper to discharge, not smaller. **Merge order and the
re-home decision are the Orchestrator's; neither is taken here.***

**Size `S` (2) re-derived 2026-08-12 at `refinement-ABC-017-gaps` and UNMOVED; priority `P2` re-read a
SEVENTH time and UNMOVED. `SPLIT_REQUIRED` checked explicitly and it does NOT apply.** This hop added
a criterion, which is the first time since `A13` that one was cut, so both were genuinely in question.

***Size — one new criterion, and it is the cheapest kind there is.*** *`A14` adds **one test, one
object, three assertions**. `A6` gains **one fixture**; `A9` gains **one captured field and one
timing observation**; `A11` gains **words only — no assertion moves**, because the guard's reach is
the Engineer's half of `RF-1` and needs no criterion. **Zero production lines, zero new modules, zero
new test files, zero new dependencies, zero new inputs, and no architecture change.** The band is
`XS=1 S=2 M=3 L=5 XL=8`; on this ticket `S` has meant *"layout and numbering over a slice of an
existing list"* through six re-derivations, and **four test edits inside two existing files do not
move it to `M`**. The one thing that would — a production line, or a criterion forcing one — was
declined twice at this hop: `HISTORY_COLS` is not widened (`ADR-0010` cl. 2), and `RF-1`'s guard is a
test instrument, not a module. **`S` (2) holds, still at the top of the band, still below `ABC-016`
(`M`).***

***`SPLIT_REQUIRED`: NO, and it was checked rather than assumed.*** *The rule bites at `XL` (8) and
this is `2` — four sizes clear. More usefully than the arithmetic: a split has to produce two
independently valuable tickets, and **every one of this hop's four edits is a guard on the SAME
delivered pane, in the same two files, owed by the same Engineer hop.** Splitting them would
manufacture a second ticket with no product value that could only be worked after the first. **The
ticket is BUILT and the remainder is smaller than the whole**, which is the opposite of the condition
a split exists to relieve.*

***Priority — `P2`, and the value argument is again untouched verbatim.*** *The game is fully playable
without a history pane: the board renders, the loop runs, the status panel names the last move, and
`EPIC-006`'s end screen carries the full list. **`D25` is the closest thing this hop found to a
priority argument and it deliberately does NOT move one.** `A14` guards a failure that would make the
pane useless inside `ABC-019` — but a pane that is dropped cannot be cached, so **`A14` adds no cost
to DROPPING this ticket**; it dies with the ticket it guards. That is the honest distinction from
`D20`, which did add such a cost and is **unchanged and still carried**: `A13` guards epic `4b`'s
24-row budget on delivered code and would have to be **re-homed** if this ticket were dropped.
**Letting a guard gap re-rank a product is the same error as letting a checklist or a suite defect do
it**, which this ticket has now refused three times. `P3` stays wrong for the reason given six times:
`P3` is "someday", and this is in the epic's scope line and in its Done.*

***One thing this hop declined to do, recorded because declining is a ruling.*** *`G5`/`AR-4` — the
`HISTORY_COLS` self-comparison, now measured to survive **740/740** even after `ABC-027` merged — is
**left UNOWNED**. It has no owner on this ticket, no criterion, and no proposed fix. Security/NFR
deliberately left it unhomed and said *"recording a fake owner to satisfy the format would be worse
than saying so"*; **that judgment is upheld here.** The restraint is cross-ticket — 21 rather than 24
was chosen to keep `ABC-027`'s width swing **visible** — and a restraint taken for another ticket's
benefit cannot be guarded by a criterion on this one. **It stays an unhomed Architect/Design question
and this hop did not tidy it into a false home.***

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

**RE-DERIVED A FOURTH TIME 2026-08-12 by BA/PM at task `refinement-ABC-017-a3` (Workflow 07). VERDICT:
9 of 10 MET, and ITEM 4 IS ❌ — for the third time on this ticket, and for the third time in the same
place.**

**This is D18's pattern and it is now a habit, so it is stated first rather than buried.** D18 recorded
that a wrong self-assessment is a defect because it is what a promoting role reads. Item 4 —
*acceptance testable and measurable* — was marked ❌ at `refinement-ABC-017` (D3, D4, D7, D8, D10, D11,
D12), ❌ again at `repair-panel-tickets` (D19), then ✅ at `refinement-ABC-027-cut` on the reasoning
that *"`A2`'s assertion is unchanged character for character — only its justification was struck, and a
justification is not a criterion."* **That reasoning was sound and the conclusion was still wrong**,
because nobody asked the different question: *can each criterion's clauses actually fail?* **They had
not been checked, and two of them could not.**

| # | Check | At `refinement-ABC-027-cut` | After this hop |
|---|---|---|---|
| 1 | problem clear | ✅ | ✅ unchanged |
| 2 | scope and out-of-scope clear | ✅ | ✅ unchanged; no scope moved, one exposure carried to `ABC-027` |
| 3 | INVEST | ✅ | ✅ still independent — but note `A13`'s ordering dependency is now **satisfied**, not pending |
| 4 | acceptance testable and measurable | ✅ | ❌ **D22 and D23** — `A3`'s last clause could not fail on any build, and `A9`'s snapshot clause could not fail as delivered, with a survivor to prove it. **Both now fixed in text; D23 also needs a test edit** |
| 5 | dependencies known | ✅ | ⚠️ → ✅ the `ABC-016` line said `A13` *"is not evaluable until `ABC-016` has merged"*; **`ABC-016` HAS merged and the line still reads as a future tense.** Corrected at `A13`'s own site |
| 6 | security/NFR triggers, measurable | ✅ | ✅ targets unchanged; **the importer count corrected from one to three** and one narrowness in the in-suite guard named for QE |
| 7 | test notes present | ✅ | ✅ and materially extended — the tripwire/requirement rule, four dominated assertions, `A9`'s fixtures, the width self-comparison |
| 8 | size assigned | ✅ `S` | ✅ `S`, re-derived a fourth time against work that is now **measured** rather than estimated |
| 9 | priority assigned | ✅ `P2` | ✅ `P2`, re-read a sixth time |
| 10 | no major unresolved blocker | ✅ | ✅ nothing blocking. `A13`'s remainder is owed work with a known cost, not a blocker |

**Item 4 is ❌ and the ticket does NOT return to `Ready`** — it is built, and the remedy is four test
edits, not a re-specification. **The ❌ is recorded honestly rather than softened to ⚠️**, because a
criterion that cannot fail is not a partially-met check: for the purpose the check exists to serve, it
was not met.

**Everything in the right-hand column was verified by running against the delivered tree at this hop.**
The four `A3` clause forms and both `A9` variants were **run** against constructed wrong builds, not
transcribed; `WPOS` was run against the **full** suite (697/697, 24 files) before being called a
survivor; the `TS2307` was reproduced; `A13`'s two owed edits were applied out of tree and gated
(732/732, 26 files); the importer count came from a statement-scoped parse rather than a line `grep`;
and the 8.2 ms fixture cost was measured. **Zero production lines: nothing under `src/` was written.**

**Four flags carried, each with an owner, none blocking:** the replay coefficient for `NFR-002`
(Security/NFR, at this ticket's gate); `ABC-010`'s unbounded `fullmoveNumber` (carried, not owned);
`A13`'s re-homing if this ticket is dropped, deferred or resequenced (the Orchestrator); and **NEW —
`HISTORY_COLS` is held at 21 for a CROSS-TICKET reason that no criterion on this ticket guards**
(the Orchestrator; the defect belongs to `ABC-027`).

**RE-DERIVED A FIFTH TIME 2026-08-12 by BA/PM at task `refinement-ABC-017-gaps` (Workflow 07), on the
two gates' output. VERDICT: 9 of 10 MET, and ITEM 4 IS ❌ AGAIN — the FOURTH time on this ticket and
the fourth time in the same place.**

**The pattern is stated first rather than buried, because it is now four for four.** `D18` recorded
that a wrong self-assessment is a defect because it is what a promoting role reads. Item 4 was ❌ at
`refinement-ABC-017` (D3–D12), ❌ at `repair-panel-tickets` (D19), ✅ at `refinement-ABC-027-cut`, ❌ at
`refinement-ABC-017-a3` (D22, D23) on the question *"can each criterion's clauses actually fail?"* —
and it is ❌ here on a **third** question nobody had asked: **not can a clause fail, but is there an
INPUT CLASS the whole acceptance table never reaches?** There was. Black-to-move anchors past the
window's slide point, and the caller's life after a render.

| # | Check | At `refinement-ABC-017-a3` | After this hop |
|---|---|---|---|
| 1 | problem clear | ✅ | ✅ unchanged |
| 2 | scope and out-of-scope clear | ✅ | ✅ unchanged; nothing entered or left scope, and `HISTORY_COLS` is held at 21 |
| 3 | INVEST | ✅ | ✅ still independent — `A14` needs no symbol from `ABC-019` and adds no import edge; it asserts a property of THIS pane using `playMove`, which `A7` already requires |
| 4 | acceptance testable and measurable | ❌ D22, D23 | ❌ **D24, D25, D26, D27** — three input classes the table never reached and one clause that was measurably FALSE as worded. **All four now fixed in text; D24/D25/D26 also need test edits** |
| 5 | dependencies known | ✅ | ✅ unchanged. `A14`'s consumer relationship to `ABC-019` is the one already recorded — the loop hands this pane the `GameHistory` — and it creates no new edge |
| 6 | security/NFR triggers, measurable | ✅ | ✅ every bar MET on delivered code by the gate's own instruments; **the importer count corrected a second time, THREE → FOUR**, and `A11`'s clause corrected to match what the guard always meant |
| 7 | test notes present | ✅ | ✅ and materially extended — the four owed edits with their purposes, the `RF-1` closure-scope trap, and **one item CORRECTED against the Engineer's flag** (`A6`'s `not.toContain(1)`) |
| 8 | size assigned | ✅ `S` | ✅ `S`, re-derived a seventh time; **`SPLIT_REQUIRED` checked explicitly and it does not apply** |
| 9 | priority assigned | ✅ `P2` | ✅ `P2`, re-read a seventh time |
| 10 | no major unresolved blocker | ✅ | ✅ nothing blocking. Both gates are `PASS_WITH_RISKS` with **ZERO code defects**; `RF-1` is `medium` and `security.block_on` is `high` |

**Item 4 is ❌ and the ticket does NOT return to `Ready`.** It is built, both gates passed it, and the
remedy is four test edits — not a re-specification. **The ❌ is recorded honestly rather than softened
to ⚠️**, for the same reason as last time: a criterion that never reaches an input class is not a
partially-met check, and on this ticket a ⚠️ has twice been the shape a defect hid in.

**What was verified at THIS hop rather than inherited, item by item.** The baseline was re-run before
any ruling — **lint / typecheck / build exit 0, 740/740 on 26 files, skip 0**, `src/history-pane.ts`
md5 `54fd4346dcc1a0060c4e66ae0149265d` — and re-checked after, unchanged. The `G1` structural gap was
read **at source** (`A6`'s two anchors are five plies each at `src/history-pane.test.ts:193-208`;
`A1`'s builders are both `newGame(START_FEN)` at `:88`/`:108`; `A2`'s black anchor is one ply at
`:164`/`:180`). `A6`'s fourth-anchor rows, `A14`'s two panes and `A9`'s three fields were **measured
against the delivered pane from an out-of-tree harness**, so every number this hop writes into a
criterion was run. The importer count was **re-counted a third time** with the textual surface
enumerated exhaustively first. `GameHistory`'s three fields and `playMove`'s in-place mutation were
read at `src/history.ts:34-46` and `:85-88`. **The nine-row figure for `WLEAD-A` is QE's and is
attributed, not re-derived — this hop built no mutants.** **Zero production lines and zero test lines:
`src/` is byte-identical to where this hop found it.**

**Five flags carried, each with an owner, none blocking:** the four above — with the replay
coefficient now **measured** by Security/NFR and reported as a **band** (4.86–4.92 ns/ply by
total-render regression against 6.93–6.98 by replay-loop isolation, the two instrument families
disagreeing and the gate declining to smooth them) — plus **NEW: `AR-1`, the supplied-FEN width and
compute path**, whose owner is **BA/PM at `ABC-010`** with **Architect/Design at `EPIC-006`** as the
checkpoint, triggered the first time a FEN reaches the process from outside it. **`AR-1` is NOT this
ticket's to fix**: the gap is in `src/fen.ts`, it pre-exists this ticket, it is unreachable until
`EPIC-006`, it is already an accepted limitation in `## Out of scope`, and it is **bounded** at +19
characters. It is recorded here so `ABC-010` inherits a bar and not a feeling.

**What this hop deliberately did NOT do.** It did not re-litigate `ADR-0009` or `ADR-0010` (both
`accepted`, both read, neither re-opened). It did not widen `HISTORY_COLS` or add any criterion for
it, and it did not home `G5`/`AR-4`. It added no constant-FRAME-width criterion anywhere. It wrote no
code and no test — the fixture hop is the Engineer's. It did not touch `src/`, `plans/board.md` (the
Orchestrator's), `plans/nfr-catalog.md`, `memory-bank/50-decisions/`, `ABC-016`, `ABC-019` or
`ABC-027`. **Nothing was merged, pushed or deployed — a human holds merge and deploy.**
