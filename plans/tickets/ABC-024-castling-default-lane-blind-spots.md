---
id: ABC-024
title: castling guards protected only by the opt-in deep lane — the `empty` corridor on black, and the right test off its default scalars
status: backlog
column: Backlog
size: S
priority: P2
epic: EPIC-001
feature: —
---

# ABC-024 — castling guards protected only by the opt-in deep lane: the `empty` corridor on black, and the right test off its default scalars

> **Cut 2026-08-10 by BA/PM** (task `ticket-to-pr-ABC-023`, subtask `ticket-to-pr-ABC-023-bapm2`,
> Workflow 07), from `ABC-023`'s own QE hop and while `ABC-023` is still in `In Security/NFR` — so
> that measured leftovers stop living only in context notes. That sentence is `ABC-023`'s reason for
> existing, applied to `ABC-023`'s own output.
>
> **THIS IS A HARDENING TICKET, NOT A DEFECT TICKET. The delivered code is CORRECT on every item
> below.** `src/moves.ts` at md5 `6335b452fc21ffe2d0f902ecab930840` answers every position in this
> ticket the way the rules require — measured, with the FEN printed and re-parsed on every line.
> What is missing is **default-lane test net**, not behaviour. **The expected production diff is
> zero lines.**
>
> **Every figure in this ticket was measured by BA/PM at the cutting hop (2026-08-10) and NOTHING is
> inherited.** `ABC-023`'s QE hop reported **two** of these survivors; this hop re-derived both on its
> own instrument and found **seven**, because it mutated the whole corridor rather than the one square
> that had been named. Mutants applied to a copy of `src/` held **outside** the repository with
> `node_modules` symlinked; each anchor asserted to occur **exactly once** in the pristine source and
> the bytes asserted to have changed, or the run is a harness error and never a survivor; `tsc
> --noEmit` per mutant, so a tree that does not build can never be scored a survivor; **one fresh OS
> process per tree state** for every typecheck, every `vitest` run and every deep-perft probe;
> `src/moves.ts` restored from a pristine snapshot and **re-hashed to
> `6335b452fc21ffe2d0f902ecab930840` after every single mutant**. **No file under `src/` in the
> repository was written, and no test row was written at this hop.**
> **14 mutants, 0 broken builds, 0 harness errors**, plus 7 deep-lane re-runs and 26 witness
> positions. Machine: Apple M3 (Mac15,13) / Node v24.12.0 / Darwin arm64; the test counts are
> integers and machine-independent, the wall-clock seconds are not.
>
> **Baseline measured in the harness's own processes before any mutant:** `npm test`
> **625 passed / 625 on 18 files** in **1.23 s**, `tsc --noEmit` exit **0**.

## Problem

*User*: the same downstream consumers `ABC-009` and `ABC-023` name — the renderer (`EPIC-002`), the
input layer (`EPIC-003`), the search (`EPIC-004`), the session (`EPIC-006`) — plus the next engineer
to touch `addCastlingMoves`, who is the user this ticket actually protects.

*Pain*: two of the five guards in `addCastlingMoves` are pinned by **nothing the default `npm test`
lane runs**. A wrong build passes all **625** tests in **1.2 s** and is caught only by the opt-in
`PERFT_DEEP=1` lane, **36.5–39.8 s**, which no gate step and no CI runs — and there, in six of the
seven cases, by **exactly one assertion of 32**.

1. **The `empty` corridor is guarded on WHITE and unguarded on BLACK.** Dropping one square from an
   option's `empty` array offers a castle straight through an occupied square. All **five** white
   corridor squares die in the default lane; **four of the five black ones survive it** (`BQ` b8, c8,
   d8 and `BK` g8). The asymmetry is not a design — it is ply parity in the shallow perft depths
   plus one hand-written row that exists for white only.
2. **The castling RIGHT test is pinned only at `- 0 1`.** `NO_RIGHT_HELD` (two rows) kills the
   unconditional removal of that test at **623/625**. But **every FEN in all six tables of
   `src/moves.castling.hardening.test.ts` ends `- 0 1`**, so the right test switched off on **any
   other** value of the scalar fields survives the whole suite. This is `ABC-023`'s gap 9 axis, on
   the one guard `ABC-023`'s QE hop deliberately left alone.

*Value*: `EPIC-004` rewrites this hot path (pin-aware / incremental generation, the audit's `RF-2`),
and the `CastleOption` tables — where the `empty` arrays live — are exactly what it rewrites. A
rewrite validated by a lane nobody runs, whose red is a wrong node count 40 seconds later rather than
a named failing row, is the standing lesson of this board (`ABC-009`'s retired `A7`; the 100%
coverage number in `ABC-009`'s `## Problem`) in a new dress. Closing this costs test rows and no
production risk.

## The judgement — is the deep lane adequate protection? NO, and the ruling is bounded

The interesting question here is not "add rows". It is **whether a guard protected only by an opt-in
lane is adequately protected**, which is a judgement about where this project wants its net. It is
answered here rather than assumed, and it is deliberately answered **narrowly**, because a reflexive
"add a row for everything perft catches" would be waste.

**The ruling.** *A guard whose ONLY protection is the `PERFT_DEEP=1` lane is owed a default-lane row.
A guard the default lane already names is not, and nothing here promotes the deep lane into the
gate.* Six measured reasons:

1. **The lane is in no gate.** `quality.mandatory_gates` is `["lint", "typecheck", "unit", "build"]`.
   There is no CI — `.github/` holds one file, `copilot-instructions.md`, and `AGENTS.md`
   `## Deployment posture` records "no CI, no git remote". The deep lane therefore runs **only when a
   ticket's own acceptance names it**: `ABC-023`'s `A4` does, `ABC-022`'s did, `ABC-009`'s did. That
   is protection by an author remembering, not by a net. On `ABC-009` — six hops — the board's own
   record says the lane was measured **once**, by the Orchestrator, after the merge.
2. **This project already made this exact ruling once, in code, about this exact guard.**
   `src/moves.castling.hardening.test.ts:596-601`, above `NO_RIGHT_HELD`:
   *"The `PERFT_DEEP=1` lane does catch a build that drops the right test … but the default
   `npm test` does not, and a 40-second opt-in lane is the wrong place for the only guard on the
   cheapest condition in the function."* Rows were written for that reason. This ticket is not a new
   judgement; it is the same one applied to the slice those rows cannot reach, because all of them
   sit at `- 0 1`.
3. **The margin is one assertion, not a lane.** All three right-test mutants die on **exactly one**
   of the 32 deep rows — `position-5 perft(4)`. Three of the four corridor survivors die on exactly
   one — `kiwipete perft(4)`. Re-tune or drop that single row and the guard has **nothing**.
4. **The signal is a wrong number, not a named failure.** A deep-lane red reads `perft(4) = 4085603`
   expected, got something else, after 36–40 s. It does not read "black was offered `e8c8` with a
   bishop on c8". Diagnosis cost is precisely what a default row buys, and it is what a rewrite needs.
5. **The cost ratio is ~25x.** 625 tests in **1.23 s** against **36.5–39.8 s** for the deep lane. That
   is not an inner-loop signal; nobody runs it while editing.
6. **`EPIC-004` rewrites the `CastleOption` tables**, which is where four of the seven survivors live.

**What this ruling does NOT say, stated so it is not over-applied.** It does not say the deep lane is
worthless — it is the strongest oracle in this codebase and it is what proved all seven survivors are
**legally reachable**, since perft walks only legal play. It does not say every deep-lane kill is owed
a unit row; duplicating perft wholesale would be bloat. And it does **not** propose adding
`PERFT_DEEP=1` to `quality.mandatory_gates` — that is a config change costing 36–40 s on every gate,
it is not this ticket's to make, and it would not fix reason 4 anyway.

## Source

`ABC-023`, task `ticket-to-pr-ABC-023`, QE hop 2026-08-10
(`20260810T081840Z-qe-e2e-observation-7db643c3`, `20260810T081841Z-qe-e2e-decision-7b183991`). QE
measured two survivors, wrote **no** rows for them, and said so out loud: both sit in `ABC-009`'s
dimensions and `ABC-023`'s `## Out of scope` fences those, so it reported and stopped. That was
right, and it is the reason this is a ticket instead of a lost note.

**`ABC-009` is not reopened by any of this.** `A1`–`A13` are green and their verdicts stand. This
ticket adds rows to a file `ABC-009` delivered, in the way `ABC-023` already does, and edits no
existing row, count or verdict.

## Reproduction (measured 2026-08-10 by BA/PM on the delivered tree `6335b452fc21ffe2d0f902ecab930840`, default suite 625/625 on 18 files)

**1 — the `empty` corridor. Each of the ten squares in the four `CastleOption.empty` arrays dropped
in turn.** `SURVIVED` means the whole default `npm test` passed 625/625 with `PERFT_DEEP` unset.

```
mutant                                  default    deep      default-lane killers
WK empty drops f1 (king crossing)       KILLED     —         gameend.test.ts, history.test.ts, perft.test.ts   615/625
WK empty drops g1 (king landing)        KILLED     —         perft.test.ts                                     624/625
WQ empty drops b1 (ROOK crossing)       KILLED     —         moves.test.ts, perft.test.ts                      622/625
WQ empty drops c1 (king landing)        KILLED     —         perft.test.ts                                     623/625
WQ empty drops d1 (king crossing)       KILLED     —         perft.test.ts                                     623/625
BK empty drops f8 (king crossing)       KILLED     —         gameend.test.ts, history.test.ts, perft.test.ts   620/625
BK empty drops g8 (king landing)        SURVIVED   29/32     nothing            625/625   kiwipete d4, position-4 d4, position-4 d5
BQ empty drops b8 (ROOK crossing)       SURVIVED   31/32     nothing            625/625   kiwipete perft(4) ONLY
BQ empty drops c8 (king landing)        SURVIVED   31/32     nothing            625/625   kiwipete perft(4) ONLY
BQ empty drops d8 (king crossing)       SURVIVED   31/32     nothing            625/625   kiwipete perft(4) ONLY

CONTROL the whole `empty` test removed  KILLED     —         apply, gameend, history, legal, moves.castling,
                                                             moves, perft (7 files)                            605/625
```

**The control is what makes this a gap rather than an opinion**: the corridor class is richly
discriminable at 605/625 when removed wholesale, so the four survivors are a hole in the ROWS, not a
property nothing can see.

**Why white is guarded and black is not — measured, not guessed.** Exactly **one** hand-written row on
this board names a corridor square: `src/moves.test.ts:241`, *"withholds queenside but keeps kingside
when b1 is occupied"*, on `r3k2r/8/8/8/8/8/8/RN2K2R w KQkq - 0 1`. Its black mirror does not exist —
`grep` for a `b8`-occupancy castling row across `src/*.test.ts` returns nothing. The other five white
kills come from **incidental** positions in the shallow perft depths and in `gameend`/`history`, which
reach white castling positions a ply earlier than black's. **1 of the 10 corridor squares is named by a
row; 5 are covered only by accident; 4 are covered by nothing in the default lane.**

**Witnesses, one fresh process per tree state, the FEN printed and round-tripped through `toFen`
(`rt=ok` on all 26).** Each mutant moves **exactly its own row** and no other:

```
position                                    delivered            E-BQ-b8            E-BQ-c8       E-BQ-d8       E-BK-g8
rn2k2r/8/8/8/8/8/8/R3K2R b KQkq - 0 1       gen[e8g8]  25 legal  gen[e8c8 e8g8] 26  gen[e8g8] 25  gen[e8g8] 25  gen[e8g8] 25
r1b1k2r/8/8/8/8/8/8/R3K2R b KQkq - 0 1      gen[e8g8]  30        gen[e8g8]      30  [e8c8 e8g8]31 gen[e8g8] 30  gen[e8g8] 30
r2qk2r/8/8/8/8/8/8/R3K2R b KQkq - 0 1       gen[e8g8]  39        gen[e8g8]      39  gen[e8g8] 39  [e8c8 e8g8]40 gen[e8g8] 39
r3k1nr/8/8/8/8/8/8/R3K2R b KQkq - 0 1       gen[e8c8]  26        gen[e8c8]      26  gen[e8c8] 26  gen[e8c8] 26  [e8c8 e8g8]27
CONTROL r3k2r/…/R3K2R b KQkq - 0 1          gen[e8c8 e8g8] 26    unchanged 26       unchanged 26  unchanged 26  unchanged 26
```

The delivered tree offers **the other castle and only the other castle** on every corridor position —
which is the assertion shape `A1` requires below, and is why a count alone will not do.

**`option.empty` is colour-blind and type-blind by construction** (`src/moves.ts:340` tests
`!== EMPTY`), and that is measured rather than asserted: an **enemy** knight on the corridor square
behaves identically —
`rN2k2r/8/8/8/8/8/8/R3K2R b KQkq - 0 1` → delivered `gen[e8g8]`, 22 legal; under `E-BQ-b8`
`gen[e8c8 e8g8]`, 23 legal. This is the measurement that **bounds** `A1` to ten rows instead of
enumerating occupants.

**2 — the castling RIGHT test, off its default scalars.**

```
mutant                                             default    deep      killers
RIGHT test skipped when halfmoveClock !== 0        SURVIVED   31/32     625/625   position-5 perft(4) ONLY
RIGHT test skipped when fullmoveNumber !== 1       SURVIVED   31/32     625/625   position-5 perft(4) ONLY
RIGHT test skipped when an ep square is set        SURVIVED   31/32     625/625   position-5 perft(4) ONLY
CONTROL RIGHT test removed unconditionally         KILLED     —         623/625   moves.castling.hardening.test.ts
```

**The control is again what turns this into a gap**: the unconditional removal dies inside
`moves.castling.hardening.test.ts` — that is `NO_RIGHT_HELD` doing its job — so the guard IS reached
by default rows. They just all sit at `- 0 1`.

```
witness                                        delivered        R-halfmove       R-fullmove       R-ep
4k3/8/8/8/8/8/8/R3K2R w - - 5 9                gen[-]  24 legal [e1c1 e1g1] 26  [e1c1 e1g1] 26  gen[-] 24
r3k2r/8/8/8/8/8/8/4K3 b - - 5 9                gen[-]  24       [e8c8 e8g8] 26  [e8c8 e8g8] 26  gen[-] 24
4k3/8/8/2p5/8/8/8/R3K2R w - c6 0 12            gen[-]  24       gen[-]      24  [e1c1 e1g1] 26  [e1c1 e1g1] 26
r3k2r/8/8/8/2P5/8/8/4K3 b - c3 0 12            gen[-]  24       gen[-]      24  [e8c8 e8g8] 26  [e8c8 e8g8] 26
EXISTING ROW 4k3/…/R3K2R w - - 0 1             gen[-]  24       gen[-]      24  gen[-]      24  gen[-] 24
CONTROL 4k3/…/R3K2R w KQ - 5 9 (right HELD)    [e1c1 e1g1] 26   26              26              26
```

**The `EXISTING ROW` line is the gap, executable**: `NO_RIGHT_HELD`'s own FEN cannot see any of the
three mutants, and the control on the line below proves the scalars are not what suppresses castling
— with the right held at clock 5 / move 9 the delivered tree offers both castles at 26 moves.

## Scope

`src/moves.castling.hardening.test.ts` — the existing table-driven hardening file — gains rows and
quantifier tests so that each survivor above **fails at least one row in the DEFAULT `npm test`
lane, with `PERFT_DEEP` unset**. Concretely:

- Every square in every `CastleOption.empty` array is named by a row, on **both** colours.
- The castling right test is exercised at scalar values **other than** `- 0 1`.
- Both are asserted **over the tables** as quantifiers, so the gap cannot silently regrow.

**No production change is expected.** If a row proves the delivered code wrong, that is a defect and
gets its own ticket rather than being folded in here — say so out loud rather than quietly editing
`src/moves.ts` under a hardening ticket.

## Out of scope

- **`ABC-009`'s criteria `A1`–`A13`.** Not reopened, not re-measured, no verdict changed. This ticket
  extends the net around two guards `ABC-009` delivered, exactly as `ABC-023` extends its `A11`/`A13`
  tables; no existing row, count or verdict is edited.
- **`ABC-023`'s criteria `A1`–`A5` and its rows.** A gate is running against them right now. Not one
  word is touched, and this ticket writes its rows in **new** tables and **new** `describe` blocks for
  the same mechanical reason QE recorded: `ABC-023`'s quantifiers compute over named row sets, and a
  row spread into an existing table would drive one of them off its count.
- **The king's ATTACK path (`kingPath`) and the through-check loop.** That is `ABC-023`'s `A2`, being
  built now. This ticket touches the `empty` array only. They are different fields of the same table
  and must not be conflated: `empty` is an occupancy test, `kingPath` an attack test.
- **The two identity guards** (the king's and rook's home-square bytes). `ABC-009`'s fix, and their
  scalar axis was closed by `ABC-023`'s QE hop with 5 rows. This ticket takes the two guards that hop
  deliberately left.
- **Promoting `PERFT_DEEP=1` into `quality.mandatory_gates`.** Considered and rejected — see
  `## The judgement`. Named here so the omission stays deliberate.
- **Enumerating occupant piece types per corridor square** (5 squares × 2 colours × the 12 wrong bytes
  `parseFen` writes = 120 rows). `option.empty` tests `!== EMPTY` and is colour- and type-blind by
  construction — measured above with an enemy occupant — so a second byte on the same square pins
  nothing new. This is the `L` trap; if it is ever wanted, **split it, do not grow this ticket**.
- **`ABC-010`'s FEN semantic validation.** The en-passant rows here are grammatical and plausible;
  whether a FEN's scalars are mutually consistent is `ABC-010`'s question.
- **Coverage as a criterion.** `ABC-009`'s standing reason: `src/legal.ts` shipped this project's
  worst defect at 100% statement/branch/function coverage.

## Acceptance (Given/When/Then)

Every *(Measured …)* parenthetical is the behaviour of the **delivered** tree at
`6335b452fc21ffe2d0f902ecab930840` against the **625-test suite on 18 files**, and is evidence, not a
target. **Every parenthetical names the suite size it was measured against** — the omission of that
figure is what let `ABC-023` go stale between `ABC-022`'s merge and the morning of 2026-08-10.
**Each criterion names the mutant that must die**, because "the rows exist" is not the requirement;
"a wrong build fails **in the default lane**" is.

- **`A1` (the `empty` corridor, every square of every option, in the DEFAULT lane).** **Given** each
  of the **ten** squares named in the four `CastleOption.empty` arrays (`WK` f1 g1; `WQ` b1 c1 d1;
  `BK` f8 g8; `BQ` b8 c8 d8) and a position holding **that one square** occupied while the same side's
  **other** castling right is held and its corridor fully clear, **when** `generateMoves` runs,
  **then** the `FLAG_CASTLE` count is **exactly 1**, the surviving castle is asserted **BY NAME** and
  not by count, and the `legalMoves` count is exact. **Ten rows, one per square.** At least one row
  holds an **enemy** piece on the corridor square, so the guard's colour-blindness is exercised at
  **zero extra rows** rather than enumerated. Each row asserts the occupant byte on the corridor
  square in **type and colour** before reading any outcome. **The discriminating requirement:**
  dropping any one square from any one option's `empty` array must fail **exactly its own row and no
  other**, with `PERFT_DEEP` unset.
  *(Measured 2026-08-10 at 625: `rn2k2r/8/8/8/8/8/8/R3K2R b KQkq - 0 1` → `gen[e8g8]`, **25** legal;
  `r1b1k2r/…` → `gen[e8g8]`, **30**; `r2qk2r/…` → `gen[e8g8]`, **39**; `r3k1nr/…` → `gen[e8c8]`,
  **26**; the enemy-occupant row `rN2k2r/…` → `gen[e8g8]`, **22**. Four of the ten mutants — `BQ` b8,
  c8, d8 and `BK` g8 — **survive 625/625** and die only in the deep lane at 31/32, 31/32, 31/32 and
  29/32; the other six die in the default lane at 615–624/625, and removing the whole `empty` test
  dies at **605/625**, which is what makes the class discriminable rather than invisible.)*

- **`A2` (the castling RIGHT test, off the `- 0 1` every existing row uses).** **Given** a position
  with king and both rooks home, both corridors clear and **no** castling right held, whose scalar
  fields are **not** `- 0 1` — (a) `halfmoveClock` and `fullmoveNumber` moved off `0`/`1`, and (b) an
  en-passant square set — **when** `generateMoves` runs, **then** the `FLAG_CASTLE` count is
  **exactly 0** and the `legalMoves` count is **exactly 24**. **Four rows: both colours × both scalar
  classes.** The two classes **cannot** be combined into one FEN — the double pawn push that sets an
  en-passant square also zeroes `halfmoveClock` — so four is forced rather than padded. **Plus one
  non-inertness control per class**: the identical position with the right **held** offers **exactly
  2** castles at **26** moves, proving the RIGHT test is the mechanism and not the scalars suppressing
  castling globally. **The discriminating requirement:** each of "the right test skipped when
  `halfmoveClock !== 0`", "… when `fullmoveNumber !== 1`" and "… when an en-passant square is set"
  must fail at least one row, with `PERFT_DEEP` unset.
  *(Measured 2026-08-10 at 625: `4k3/8/8/8/8/8/8/R3K2R w - - 5 9` → 0 castles, **24** legal;
  `r3k2r/8/8/8/8/8/8/4K3 b - - 5 9` → 0, **24**; `4k3/8/8/2p5/8/8/8/R3K2R w - c6 0 12` → 0, **24**;
  `r3k2r/8/8/8/2P5/8/8/4K3 b - c3 0 12` → 0, **24**; the control `4k3/8/8/8/8/8/8/R3K2R w KQ - 5 9` →
  `e1c1` and `e1g1`, **26**. All three mutants **survive 625/625** and die only at deep 31/32, on
  `position-5 perft(4)` and nothing else. `NO_RIGHT_HELD`'s existing FEN `4k3/…/R3K2R w - - 0 1`
  returns 0 castles at 24 moves under **all three** mutants — it cannot see any of them — while the
  unconditional removal of the same test dies at **623/625** inside this very file.)*

- **`A3` (the quantifiers — the gap cannot regrow, and is asserted rather than narrated).** **Given**
  the four `CastleOption` tables and the six FEN tables in
  `src/moves.castling.hardening.test.ts`, **when** the rows are read, **then** (i) **every** square
  appearing in **any** option's `empty` array is named by at least one `A1` row — so a new option or a
  widened corridor goes **red** until a row exists for it — and (ii) the existing `NO_RIGHT_HELD` rows
  are asserted to end `- 0 1` **and** the `A2` rows are asserted to move at least one scalar off it,
  so the gap itself is executable rather than a comment that rots. Both in the shape `A11`, `A13` and
  `ABC-023`'s `A3` already use, reading the tables **without modifying them**. **The discriminating
  requirement:** deleting any `A1` row, or narrowing any `A2` row back to `- 0 1`, must turn a
  quantifier red.
  *(Measured 2026-08-10 at 625: the four `empty` arrays hold **10** squares across
  `src/moves.ts:295-314`; **1** of the 10 is named by a hand-written row anywhere in `src/*.test.ts`
  (`src/moves.test.ts:241`, white b1); **every** FEN in all six tables of the hardening file ends
  `- 0 1`, which is the same measurement `ABC-023`'s QE hop made for its gap 9 and is re-derived here
  rather than inherited.)*

- **`A4` (no production change, and no existing test row modified).** **Given** the delivered tree,
  **when** this ticket's rows land, **then** `src/moves.ts` still hashes
  **`6335b452fc21ffe2d0f902ecab930840`**, **no existing test row is modified or deleted in any file —
  the diff to `src/moves.castling.hardening.test.ts` is ADDITIONS ONLY and no other file under `src/`
  is touched** — verified at line level with `git diff -U0`, not by inspection — the full suite is
  green (**625 before this ticket's rows**, plus them) with a **skip count of 0**, and the
  `PERFT_DEEP=1` lane is **32/32** exact.
  *(The hash is `src/moves.ts` on branch `grugops/ticket-to-pr-ABC-023`, measured with `md5 -q` at
  this hop and re-asserted after every one of this hop's 14 mutants. **It goes stale the moment any
  ticket changes `src/moves.ts`** — that is what happened to `ABC-023` when `ABC-022` merged, and the
  rule is under `## Dependencies`. If any row proves the delivered code wrong, this criterion FAILS by
  design and the defect is cut as its own ticket; the expectation is that none does, since all seven
  survivors were measured against a tree that answers every one of them correctly.)*

- **`A5` (the rows close the hole in the DEFAULT lane — the deep lane is the witness, never the net).**
  **Given** the rows from `A1`–`A3`, **when** each named discriminating mutant is run against
  `npm test` **with `PERFT_DEEP` UNSET**, **then** each **dies** — a mutant that dies only under
  `PERFT_DEEP=1` has **not** been closed by this ticket and the row is not yet load-bearing — and
  **when** the **fifteen** behaviour-equivalent controls `ABC-009` established and `ABC-023`'s `A5`
  enumerates are run, **then all fifteen still SURVIVE**, killed count **zero**.
  *(That second half is the half that catches good-looking work: a row killing an equivalent mutant
  pins implementation shape instead of behaviour. `ABC-023`'s QE hop measured all fifteen surviving at
  **625/625** with the deep lane 32/32, killed count zero — that is the starting state these rows must
  not disturb, and it is cited from that hop rather than re-run here, which is stated plainly rather
  than passed off as this hop's own measurement. The first half is measured here: all seven survivors
  pass 625/625 with `PERFT_DEEP` unset today.)*

## Dependencies

- **`ABC-023` must land first — OPEN.** It edits the same file (`src/moves.castling.hardening.test.ts`)
  additions-only and is in `In Security/NFR` on branch `grugops/ticket-to-pr-ABC-023`, **not merged**.
  This is an **ordering** dependency over one file, not a content one: no criterion here depends on any
  criterion there, and the two touch different guards. It is the reason this ticket sits in `Backlog`.
- **Any ticket that changes `src/moves.ts` invalidates every verdict here until it is re-measured.**
  `A4`'s hash pin, all 14 mutant verdicts and all 26 witness counts were scored against
  `6335b452fc21ffe2d0f902ecab930840`. `ABC-023` learned this the expensive way when `ABC-022` merged
  after it was cut and re-scoped every figure it carried from a 381-test suite to a 559-test one. The
  direction is one-way: this ticket adds zero production lines, so nothing here can affect another.
- **Independent of `ABC-010`, `ABC-011` and `ABC-013`** — different modules; `ABC-013`'s own
  `## Out of scope` line 79 excludes "any change to `src/legal.ts` or the rules core".
- **`EPIC-004` is the reason this has a deadline shape rather than a date**: it rewrites the
  `CastleOption` tables, and rows that do not exist before that rewrite cannot protect it.

## Security / NFR triggers

**NFR: none, and the reason is structural rather than a judgement.** This ticket adds **no production
line**, so it changes no code path, no allocation and no branch in the search's inner loop.
`NFR-001`'s count-based discharge on `ABC-009` is untouched by a test-only change and `NFR-005` is not
triggered for the same reason. **No throughput figure appears in this ticket and `npm run perft` was
NOT run by this hop** — said plainly rather than implied. The standing bars are carried as numbers by
`A4`: deep perft **32/32** exact, skip count **0**.

**Security: NOT pre-waived, and the threshold is named up front.** `ABC-023` wrote "none, structural"
against an expected 17-row diff and delivered **+749 lines written by two agents**; the Orchestrator
had to **over-rule** that line on 2026-08-10, because test code is still code — it can carry a secret,
a spawn, a network call or an unbounded loop, and none of that shows up as a failing test. The lesson
is applied here as a **measurable trigger** instead of a word: the security half **fires** if the
delivered diff **exceeds +525 lines**, or **touches any file other than
`src/moves.castling.hardening.test.ts`**. The prediction it is set against is **~+350 lines** for 16
rows and 2 quantifiers, derived from `ABC-023`'s **measured** +375 for 17 rows and 2 quantifiers at its
dev hop. Below that threshold the structural argument holds; above it, the added lines get read for
secrets, spawns, network calls and unbounded loops before the ticket leaves review.

No security trigger from the input class itself: this is reliability, not security, no user-supplied
string reaches `src/moves.ts`, and there is no user surface at all until `EPIC-006`.

## Test notes

1. **Run the discriminating mutants with `PERFT_DEEP` UNSET.** A mutant that dies only in the deep
   lane has not been closed by this ticket. The deep lane is what proved these seven are real and
   legally reachable; it is not what protects them. This is the note the whole ticket turns on.
2. **Assert the setup before the outcome.** Every row asserts the occupant byte on the corridor square
   in **type and colour**, plus the right held and the other corridor clear — `ABC-009`'s
   `expectImpostorSetup` lesson, which has already caught two lying labels on this board.
3. **Assert non-inertness by keeping the OTHER castle alive, and name it.** A corridor row whose
   position offers no castle at all proves nothing about the `empty` guard — it could be failing for
   any of the four other reasons. This is `ONE_OF_TWO_RIGHTS_VALID`'s own standing rule: *"a count
   alone cannot tell 'the invalid one was rejected' from 'the valid one was dropped and something
   else appeared'."*
4. **Do not merge the four `A2` rows into two.** An en-passant square and a non-zero halfmove clock
   cannot honestly co-occur — the double push that sets the one zeroes the other. Four rows is the
   floor, not padding.
5. **One OS process per tree state** in any mutation run. Node's module cache served a pristine
   `moves.ts` to four tree states in one process on `ABC-009` and produced a false *"the harm does not
   reproduce"*.
6. **Verify the instrument before believing a red**, and typecheck every mutant — a tree that does not
   build is a broken build, never a survivor.
7. **Print the input, not the verdict.** Every measurement prints the FEN it used and round-trips it
   through `toFen`; all 26 witnesses at this hop did (`rt=ok` on every one).
8. **The rows go in NEW tables and NEW `describe` blocks**, never spread into `ABC-009`'s or
   `ABC-023`'s. Those files' quantifiers compute over named row sets and a spread-in row drives them
   off their counts — a criteria conflict, not a preference. `A4` forbids editing the row that would
   have to move.

## Size and priority rationale

**Size `S` (2 points).** Measured content: **10** rows for `A1`, **4** rows plus **2** control rows for
`A2`, and **2** quantifier tests for `A3` — **16 rows and 18 tests**, all in **one existing
table-driven file**, with **zero production lines** expected. It is `S` on this board's own calibration
because there is **no new module, no new export, no new dependency edge and no design decision** — the
same test `ABC-009` and `ABC-023` each applied to themselves, and `ABC-023` was `S` at 17 rows and 19
tests.

**The cheaper shape was considered and rejected, on a measurement.** Writing rows for only the **four**
measured survivors is 4 rows instead of 10. Rejected because the other six die by **accident** — five
of them purely through incidental shallow-perft, `gameend` and `history` positions that no criterion
owns, so a change to any of those files silently removes the only thing covering them — and because
without `A3`'s quantifier the gap regrows the next time the tables change. The marginal cost of the
symmetric shape is **six rows in an existing table**.

**The one thing that would make it `L`, named so nobody does it:** enumerating occupant piece types per
corridor square (120 rows). `option.empty` tests `!== EMPTY` and is colour- and type-blind by
construction — measured at this hop with an enemy occupant — so a second byte on the same square pins
nothing new. **If the enumeration is ever wanted, split it; do not grow this ticket into it.**

**Priority `P2`.** It is **not** `P1`: nothing is wrong in the delivered code, no user is affected, and
there is no user surface at all until `EPIC-006` — this board's `P1` is for real defects and for the
owner's legality-first directive, and a test-net hole is neither. It is **not** `P3`: all seven
survivors are **legally reachable**, and that is proved rather than argued — perft walks only legal
play, so a mutant perft can see is a mutant ordinary play reaches. It ranks **alongside `ABC-023`, not
above it**: `ABC-023`'s `A2` class leaks past perft entirely, while this one is at least caught
somewhere.

**Escalation triggers, stated so they can actually fire — and BOTH checked, not assumed:**

1. **Promote to `P1` when any ticket proposes to change `addCastlingMoves`, the `CastleOption` tables
   (including any `empty` array) or the castling right test** — including `EPIC-004`'s `RF-2` work. At
   that moment these rows stop being hardening and become the only thing between a rewrite and a
   silent legality regression. **NOT FIRED at 2026-08-10**, checked at the source: the only ticket in
   `Ready` or beyond is `ABC-013`, which creates `src/san.ts` with `toSan` only and whose
   `## Out of scope` line 79 reads *"Any change to `src/legal.ts` or the rules core"*; `EPIC-004` is
   still in `Backlog`.
2. **Promote to `P1` if `src/perft.test.ts`'s six positions or their `fast` depths change.** Six of the
   seven survivors hang on **exactly one** deep assertion — `kiwipete perft(4)` or
   `position-5 perft(4)`. Re-tune or drop that one row and those guards have nothing at all, in either
   lane. **NOT FIRED at 2026-08-10** — no ticket in `Backlog` or beyond proposes to touch
   `src/perft.test.ts`.

Saying "not fired" plainly matters: a trigger treated as fired when it has not is a trigger nobody
trusts again.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-10**. **Result: 8 of 10 clean, 2 recorded ⚠️ — the Definition of Ready is NOT fully met and
this ticket stays in `Backlog`.** The ⚠️s are recorded rather than smoothed over, because a ticket
that fails the DoR belongs in `Backlog`, not in "almost ready".

- **problem clear — user, pain, value stated** ✅ — `## Problem`, with the user named and the
  `EPIC-004` reason for doing it before that rewrite.
- **scope and out-of-scope clear** ✅ — `## Scope` is three observable requirements; `## Out of scope`
  draws eight fences, each with its owner, including the two most tempting adjacent jobs (promoting
  the deep lane into the gate; enumerating occupants).
- **INVEST-shaped** ⚠️ — **valuable**, **estimable** (16 rows derived from 14 mutants and 26 witnesses
  measured at this hop), **small** (`S`), **testable** (each criterion names the mutant that must die
  and the lane it must die in) and **negotiable** (the negotiation is over row counts; `A1`'s four
  measured survivors cannot be dropped without dropping the whole reason). **It is NOT fully
  independent**, and that is the ⚠️: it shares one file with `ABC-023`, which is in flight, so it must
  land after it. Recorded rather than claimed clean.
- **acceptance criteria clear, testable and measurable** ✅ — five Given/When/Then criteria, each with
  exact counts, exact FENs, a **named discriminating mutant** and the **lane** that mutant must die in;
  every parenthetical names the suite size it was measured against (**625 on 18 files**). No criterion
  says "works" or "is hardened".
- **dependencies known** ✅ — one open ordering dependency stated in the direction it runs, plus the
  general re-measurement rule for any `src/moves.ts` change.
- **security/NFR triggers marked, each with a measurable target** ✅ — NFR **none** with the structural
  reason (zero production lines) and two carried numbers (deep perft **32/32**, skip **0**); security
  **not pre-waived**, with a firing threshold of **+525 lines or any second file**, set against a
  measured prediction of ~+350. This is the direct lesson of the Orchestrator's over-rule of
  `ABC-023`'s "none" on 2026-08-10.
- **test notes present** ✅ — eight, six of them lessons this board already paid for and two new
  (the `PERFT_DEEP`-unset rule; the ep/halfmove incompatibility).
- **size assigned** ✅ — `S` (2), with the cheaper shape considered and rejected on a measurement and
  the condition that would make it `L` named.
- **priority assigned** ✅ — `P2`, with **two** escalation triggers, both checked at the source and
  both explicitly **not fired**.
- **no major unresolved blocker** ⚠️ — **one ordering dependency is OPEN**: `ABC-023` is unmerged and
  edits the same file. It is named, it has an owner, and it is precisely why this ticket sits in
  `Backlog` rather than competing for `Ready` today. Nothing else is unresolved and nobody is waiting
  on a decision.

**Left in `Backlog` on 2026-08-10 by BA/PM** (task `ticket-to-pr-ABC-023`, subtask
`ticket-to-pr-ABC-023-bapm2`, Workflow 07). **Not promoted, and the two reasons are the two ⚠️s
above** — the `ABC-023` ordering dependency is open, and nothing is blocked on this ticket. It should
compete for `Ready` at a refinement pass once `ABC-023` merges, exactly as `ABC-023` itself was made
to. `Backlog` is unlimited; no WIP limit is approached.

**What this ticket's figures do and do not mean.** They mean seven wrong builds passed 625 of 625
tests on 2026-08-10 against `6335b452fc21ffe2d0f902ecab930840`. They do **not** mean seven is the
complete set — the catalogue reached the corridor and the right test because those are what the two
reported survivors pointed at; a guard nobody asked about would not appear here. And **this ticket goes
stale the moment `src/moves.ts` changes**: if that happens before it is built, all fourteen verdicts,
all twenty-six witness counts and the `A4` hash must be re-measured, exactly as `ABC-023`'s were.
