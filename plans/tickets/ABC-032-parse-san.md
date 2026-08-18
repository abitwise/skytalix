---
id: ABC-032
title: `parseSan` — SAN resolved against the legal move list, three closed outcomes, every move generator-owned
status: done
column: Done
size: M
priority: P0
epic: EPIC-003
feature: —
---

# ABC-032 — `parseSan`: the second direction of one grammar, in the module that already owns it

> **Cut 2026-08-12 by BA/PM** (task `post-abc030-2026-08-12`, subtask `refinement-post-abc030`,
> Workflow 03) at `EPIC-003`'s decomposition.
>
> **THIS IS THE `parseSan` TICKET `plans/board.md`'s `EPIC-003` row has been holding two paragraphs
> for.** Both are below, under `## The two paragraphs this ticket was owed`, placed at the top of the
> NFR section rather than in a footnote — they were put on the epic row at `ABC-025`'s `N5` ruling hop
> **because a warning owned only by a gate that runs after the work arrives too late**, and burying
> them here would reproduce exactly that failure. **One of the two has moved since it was written, and
> the movement is recorded rather than transcribed silently.**

## Problem

*User*: the player who does know algebraic notation and does not want to type `e2e4` for `e4` or
`g1f3` for `Nf3` — and, through `ABC-034`, every player, because a rejection can only teach if
something read the notation well enough to know what went wrong.

*Pain*: `src/san.ts` renders SAN and cannot read it. `ABC-013` shipped `toSan` only, deliberately
(`EPIC-002` § Out of scope: *"`parseSan` — EPIC-003 adds it to the same `src/san.ts` this epic
creates. This epic ships `toSan` only and no second grammar"*). Every SAN string the product has ever
produced — the history pane, the status panel's last-move cell, `ABC-035`'s `moves` listing — is
output the player cannot type back in.

*Value*: it closes the epic's headline promise (*"a player who does know notation must not be forced
to type more than they need to"*) and it is the supplier of **three of the input seam's five
outcomes** (`ADR-0004` (2a)). It is also the cheapest correctness win on the board: parsing is
**resolution against `legalMoves`**, not a second grammar, so `toSan` is its own oracle.

## Scope

`parseSan` is added to `src/san.ts`, to the signature `ADR-0004` clause 2 ratified **as amended**:

```ts
export function parseSan(position: Position, text: string, legal?: readonly Move[]): SanParseResult;

export type SanParseResult =
  | { readonly outcome: "move"; readonly move: Move }
  | { readonly outcome: "ambiguous"; readonly candidates: readonly Move[] }   // N >= 2
  | { readonly outcome: "rejected"; readonly reason: SanRejectReason };
```

- **A total function.** Three arms, closed; nothing throws; `ambiguous` and `rejected` are never
  merged; a single match is `move`, never a one-element `ambiguous` (`ADR-0004` (2a), all four bullets).
- **Move identity (`ADR-0004` (2b), the highest-severity clause on this seam).** Every `Move` in the
  result — in `move` and in every element of `ambiguous.candidates` — is an element of the legal move
  list generated for that position. **`parseSan` never constructs a `Move` from the parsed text.**
- **One grammar table, both directions.** Piece letters, castle strings, promotion, suffix and the
  disambiguation rule are shared with `toSan`, not duplicated (`ADR-0004` clause 2).
- **Decoration tolerance, SAN-side only. The list is CLOSED and it has five entries** — widened from
  two by BA/PM on 2026-08-18, ruling on the tolerances QE measured in the delivered code
  (`G4`–`G6`; task `refinement-abc032-tolerances-2026-08-18`). Anything not on this list is refused,
  and the reasons for each ACCEPT are in that task's notes, not here.
  1. **Check/mate suffix optional** — `Nxf3+`, `Nxf3` and `Nxf3#` all read as the same move if that
     move is legal.
  2. **Digit-zero castles** — `0-0` / `0-0-0` are accepted for `O-O` / `O-O-O`.
  3. **Leading and trailing whitespace is trimmed** (`ACCEPTED`; seam consistency with the merged
     `parseCoordinateMove`, which `ABC-033` dispatches to on the same line). **`trim`, not "ignore
     spaces": interior whitespace is still refused** — `N g5` is `unreadable`.
  4. **A REDUNDANT origin qualifier is accepted** (`ACCEPTED`) — `Nfg5`, `N3g5` and `Nf3g5` resolve
     to the same move as `Ng5`, strings `toSan` never emits. **Bounded: a CONTRADICTORY qualifier
     stays refused** — `Ne4g5` is `no-such-move` — so this is redundancy, never a free-for-all, and
     no string can resolve to a move the player did not name.
  5. **`O` and `0` are interchangeable INSIDE the castle strings** (`ACCEPTED`) — `O-0` and `0-O`
     read as `O-O`. **Bounded: case is still meaning** — `o-o` is refused, and case-folded retry is
     `ABC-033`'s, not this ticket's.
- **`SanRejectReason` — a machine-readable code, never display copy.** This ticket ships the **floor**
  `ADR-0004` (2a) requires and nothing more: *this text is not SAN I can read* vs *this is well-formed
  SAN that names no legal move in this position*. `ABC-034` widens the vocabulary, which that ADR
  explicitly permits without an ADR change. **One classification is ACCEPTED AS DELIVERED and named
  rather than discovered (`G7`): `e8=K` — promotion to a king, which is not well-formed SAN — is
  coded `no-such-move`, not `unreadable`**, because the promotion letter class is derived from the
  one shared table (`ADR-0004` clause 2) and that table contains `K`. It is the same root cause as
  the castle price the engineer disclosed. **`A5` is still MET** — the two codes are independently
  reachable from many inputs and never collapse. **Re-classifying it is `ABC-034`'s, which owns the
  vocabulary; it is not re-opened here and it must not be bought with a second private table.**

## Out of scope

- **Case-insensitive SAN.** Explicitly **refused here and routed to `ABC-033` as an ambiguity**, with
  the reason, because it is the one place the epic's three scope lines contradict each other. The epic
  asks for *"case-insensitive input"*, for *"both formats always accepted, no mode switch"*, and for
  *"when input matches more than one legal move, list the candidates and re-prompt rather than
  guessing"*. **In SAN, case is meaning**: `bxc4` is a pawn capture and `Bxc4` is a bishop capture, and
  **both can be legal in the same position**. A case-folding `parseSan` would therefore have to guess
  between two legal moves — the exact behaviour the third line forbids. `parseSan` stays
  **case-exact**; `ABC-033` owns the case-folded retry and routes a multi-match to `ambiguous`, which
  is what the seam's `ambiguous` arm exists for.
- **Coordinate input** — `ABC-031`. No second grammar in this module, in either direction.
- **Command classification** (`moves` / `help` / `board` / `quit` / `claim`) — `ABC-035`.
  `ADR-0004` (2a): teaching `src/san.ts` the command set drags `EPIC-003`'s vocabulary into a module
  whose whole justification is that it owns one grammar.
- **Rejection wording, and the reason vocabulary beyond the floor** — `ABC-034`.
- **Any change to `toSan`'s behaviour, its 52 rows, or `src/san.qualifier.hardening.test.ts` /
  `src/san.suffix.hardening.test.ts`.** `ABC-025` is merged and its verdicts are closed. If parsing
  proves a `toSan` row wrong, **stop and cut a defect ticket** — do not fold it in here.
- **`src/legal.ts`, `src/moves.ts`, `src/apply.ts`.** Zero production lines outside `src/san.ts`.

## The two paragraphs this ticket was owed

**Placed here at the cut, verbatim in substance, because a warning owned only by a gate that runs
after the work is a warning that arrives too late** — Security/NFR's own argument, confirmed at
`ABC-025`'s `N5` ruling hop and recorded on `plans/board.md`'s `EPIC-003` row ever since.

### (a) `src/san.nfr.test.ts`'s five `N1` call-count rows WILL go red on a sanctioned optimisation of `toSan`. That is `N1` working as specified. **Do not delete the row.**

The file holds **five** tests, all inside `describe("N1 — toSan generates the legal moves only when it
has to (call counts, spied)")` — verified 2026-08-12: `src/san.nfr.test.ts` reports 5 tests, and the
`N1` bar it pins is *"the mean `toSan(position, move, legal)` at `P60` is ≤ 1/5 of the mean
`toSan(position, move)` over the same 42 moves"* (`src/san.nfr.test.ts:4-5`). It is a **structural**
guard: it spies how often `toSan` generates, not how long it takes.

**Measured and carried forward from `ABC-025`'s ruling hop: two behaviour-equivalent builds of `toSan`
die on those five rows and NOWHERE ELSE in the suite.** That is the guard doing its job — a build that
stops generating, or starts generating twice, is behaviour-equivalent on every string and has broken
the only thing the ratio bar rests on.

**Why this ticket must carry it.** `parseSan` is the first caller that will hold a `legal` list and
call `toSan` in a loop over it — the round-trip test in `A5` calls it once per legal move of every
perft position. **The cheapest-looking optimisation from inside this ticket is to change how or how
often `toSan` generates**, and the first thing that happens is five red rows in a file this ticket did
not touch, with a comment that mentions a count. **The next engineer's cheapest move at that moment is
to delete the row.** It is the wrong move: the row is the specification, the optimisation is the
regression, and `ABC-025` paid four gates to establish that. If the optimisation is genuinely wanted,
it is a **new ticket against `N1`**, argued on its own page, and it does not ride in on this one.

### (b) The lane bar this ticket inherits — and it is **`N8-LANE`**, not `ABC-025`'s `N5`. Recorded, not transcribed.

`plans/board.md`'s `EPIC-003` row instructs this ticket to inherit **`ABC-025`'s RE-DERIVED `N5`
wording** — CPU, net of the per-file floor, median of paired per-round deltas, n ≥ 7 interleaved, null
control by identity — and **NOT** the original wall-clock wording, *"which a no-op trips"*. **That
instruction is correct in every clause and it is now one generation stale in its name**, and
`ABC-026` says so itself: *"`EPIC-003`'s `parseSan` ticket, whose `Backlog` row currently instructs it
to inherit `ABC-025`'s re-derived `N5`; that instruction now resolves to `N8-LANE`, same clauses,
corrected denominator"* (`ABC-026` § What remains, item 1a).

So, stated once and completely:

- **The instrument, statistic, controls and scope are `ABC-025`'s re-derived `N5`, adopted unchanged
  and with attribution** — CPU (user + sys), **not wall**; the median of paired per-round deltas over
  **n ≥ 7** interleaved rounds with the sign test reported beside it; **net of the per-file floor**;
  admissible only with an **identity null control**; scope = every file the branch adds under `src/`.
- **Exactly one clause differs, and it is the denominator: 5% of `NFR-008`'s TOTAL (13 s CPU → 650 ms),
  not 5% of the lane as it stands.** *n* tickets at 5% of the *current* lane multiply it by `1.05ⁿ` —
  2.65x at twenty — with every ticket green.
- **The original wall-clock `N5` is refused, and the reason is measured, not stylistic**: its own null
  control by identity read **+0.3% / +3.2% / +0.7%** on a change that is literally nothing, and in one
  interleaved run **two EMPTY test files measured more expensive on the wall clock (+6.0%) than
  `ABC-025`'s entire 24 tests (+4.2%)**. A no-op trips it. An instrument that ranks nothing above
  everything cannot rank anything.

**Both paragraphs now live on this page and this ticket carries them.** They are no longer owed by
`plans/board.md`'s `EPIC-003` row, and that row's instruction may be retired when the row is next
written — by the Orchestrator, who owns it.

## Acceptance (Given/When/Then)

`legal` always means one array from `legalMoves(position)`, handed to the call. Reference identity is
the assertion throughout, for `ADR-0004`'s stated reason.

- **`A1` (the round-trip property — the criterion `ADR-0004` names and `EPIC-003` already owes).**
  **Given** each of the six positions in `src/perft.test.ts` and `const legal = legalMoves(position)`,
  **when** every `move` in `legal` is run through
  `parseSan(position, toSan(position, move, legal), legal)`, **then** every result is
  `outcome === "move"` **and `parsed.move === move` by reference**, for every move of every position,
  **zero exceptions**. *(`ADR-0004` (2b) "How this is falsified": at 0.10 µs per call with the list
  supplied, this is cheap enough to run over the whole corpus, and it falsifies a grammar bug and a
  provenance bug with the same assertion. Deep equality would pass a fabricated `Move` and cannot see
  a (2b) violation at all.)*
- **`A2` (three outcomes, closed, on exact strings).** **Given**
  `r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4` and `legal`, **when** each of
  `Nf3` (already played — names no legal move), `Ng5`, `O-O`, `0-0`, `Bxf7+`, `Bxf7`, `Qh5#` and
  `Nbd2` is resolved, **then** each returns exactly one of the three arms, with `move` reference-
  identical to an element of `legal` where the arm is `move`, and **no call throws**.
- **`A3` (disambiguation, both directions, from `toSan`'s own table).** **Given** a position in which
  two knights can reach the same square by file (`Nbd2` / `Nfd2`) and one in which they are
  distinguished by rank (`N1d2` / `N3d2`), **when** the fully qualified string is resolved, **then**
  `outcome: "move"` and it is the intended one by reference; **when** the bare `Nd2` is resolved,
  **then** `outcome: "ambiguous"` with **exactly 2** candidates, both reference-identical to elements
  of `legal`. *(`EPIC-003` § Risks names this as the fiddly surface and names round-trip testing as
  the mitigation; `A1` covers most of it and this criterion pins the ambiguity arm, which `A1` cannot
  reach because `toSan` never emits an ambiguous string.)*
- **`A4` (promotion and suffix tolerance).** **Given** `8/4P3/8/8/8/4k3/8/4K3 w - - 0 1` and `legal`,
  **when** `e8=Q` is resolved, **then** `outcome: "move"` with the queen promotion by reference; **when**
  `e8` is resolved, **then** `outcome: "ambiguous"` with **exactly 4** candidates. **Given** any
  position where a checking move exists, **when** its SAN is resolved with the `+` present, absent and
  replaced by `#`, **then** all three return the same move by reference. *(The suffix is decoration on
  input; `src/san.suffix.hardening.test.ts` owns it on output and is not touched.)* **FEN repaired
  2026-08-18 by BA/PM — one character, black king `e2` → `e3`; the criterion is unchanged and is NOT
  weakened.** As printed at the cut it was `8/4P3/8/8/8/8/4k3/4K3 w - - 0 1`, whose kings stand
  adjacent on `e1`/`e2`: an illegal position where the entire legal list is **`["Kxe2"]`**, no
  promotion exists, and `A4` was **unsatisfiable by any correct implementation**. The repaired FEN,
  executed against merged `src/fen.ts` + `src/legal.ts` by the engineer, by QE and by BA/PM
  independently, returns **6 moves — `Kf1`, `Kd1`, `e8=Q+`, `e8=R+`, `e8=B`, `e8=N`**: four
  promotions, nothing else reaching `e8`, and two of them checking, which exercises the suffix half
  rather than softening it. **`A4` is MET on the corrected position** — the delivered code was
  measured against exactly this FEN. **This is the SECOND ticket to carry the defective string**
  (`ABC-031` `A2` was the first); `src/coordinate-move.test.ts:17` pins it as `A2_FEN_AS_WRITTEN`
  deliberately and **that pin is correct and must not be removed**. How a hand-written FEN is
  validated before a ticket is cut is stated in
  `.grugops/context/refinement-abc032-tolerances-2026-08-18/notes/`.
- **`A5` (totality — it never throws, and `rejected` classifies).** **Given** each of `null`,
  `undefined`, `42`, `{}`, `[]`, `""`, a 10,000-character string, `Zx9`, and `Qh5#` in a position where
  no queen move exists, **when** each is passed, **then** the call returns `outcome: "rejected"` and
  **throws nothing**, and the code distinguishes *not SAN I can read* from *well-formed SAN naming no
  legal move here*. **The two codes never collapse to one** — `ADR-0004` (2a)'s floor.
- **`A6` (`toSan` is not changed, and `N1` is not touched).** **Given** the delivered diff, **when**
  `git diff -U0` is read at line level, **then** `toSan`'s body is unchanged, **no line of
  `src/san.nfr.test.ts`, `src/san.qualifier.hardening.test.ts` or `src/san.suffix.hardening.test.ts`
  is modified or deleted**, the full suite is green with skip **0**, and `PERFT_DEEP=1` is **32/32**
  exact. *(See paragraph (a). If a row here must move, that is a new ticket, not this diff.)*
- **`A7` (one grammar, asserted rather than promised).** **Given** the delivered `src/san.ts`, **when**
  the piece-letter table, the castle strings and the promotion letters are read, **then** each appears
  **exactly once** in the module and both directions use it. *(`ADR-0004` clause 2: "one table … one
  disambiguation rule, used by both". A second private table is the shape this ADR exists to prevent
  and it is invisible to every behaviour assertion above.)*

## Dependencies

- **None blocking.** `ADR-0004` is **`accepted`** (2026-07-31; clauses 1 and 3 as proposed, clause 2
  **as amended**, and the amendment lands on this ticket). `src/san.ts` with `toSan` is merged
  (`ABC-013`). `legalMoves`, `isInCheck` and the perft table are merged.
- **Not dependent on `ABC-031`.** Separate grammars, separate modules, separate tolerance. Either may
  ship first.
- **`ABC-033` and `ABC-034` depend on THIS ticket**, in that direction only: `ABC-033` dispatches over
  the three-arm shape and owns the case-folded retry this ticket refuses; `ABC-034` widens the
  `SanRejectReason` vocabulary this ticket floors.
- **Read `ADR-0004`'s Status section before citing it.** Clause 2 was ratified by the **Orchestrator
  under a named, quoted delegation from Olger Oeselg** — the only ADR in this project not ratified by
  a human directly, and recorded there as **explicitly not precedent**.

## Security / NFR triggers

- **`N8-LANE`, inherited by name — see paragraph (b) above for the full wording and its provenance.**
  **≤ 650 ms CPU** (5% of `NFR-008`'s 13 s clause), CPU instrument, median of paired per-round deltas,
  n ≥ 7 interleaved, identity null control ≤ 1.5%, net of 160 ms per test file added. **No tighter bar
  is stated and a looser one may not be.**
- **`N1` is a standing structural bar this ticket must leave intact — see paragraph (a).** The
  measurable form: `src/san.nfr.test.ts` has **5 tests, all green, none modified**, after this ticket.
- **`NFR-002` — not triggered.** No renderer imports `parseSan`, and `src/san.ts` is already inside the
  render closure `ADR-0011` scopes; this adds a function to an existing module and no module to the
  set.
- **`NFR-003` (< 50 ms keystroke) — routed to `ABC-036`.** This ticket's own cost claim is
  `ADR-0004` clause 2's measured figure: with `legal` supplied a call costs **0.10 µs instead of
  4.31 µs**, and `A1` is what makes running it over the whole perft corpus affordable.
- **Security: no trigger, not pre-waived.** `parseSan` returns data and prints nothing; user text
  reaching the terminal does so through `assembleFrame`'s message region, which **sanitizes**
  (`src/frame.ts:202`, `ABC-018`'s), and this ticket introduces no second path to that sink. **Firing
  threshold:** the security half fires if the diff touches any file under `src/` other than
  `src/san.ts` and this ticket's test file(s), or if it adds a runtime dependency.

## Test notes

1. **Reference identity, never deep equality** — `ADR-0004`'s falsification note, and the only
   assertion that can see a (2b) violation.
2. **`A1` runs over `src/perft.test.ts`'s existing six positions.** Do not build a corpus. The table is
   there, it is legal play by construction, and `ABC-025` already paid for the lesson that an invented
   corpus is the expensive way to reach the same rows.
3. **`A3` cannot come from `A1`.** `toSan` never emits an ambiguous string — that is its minimality
   property, which `src/san.qualifier.hardening.test.ts` pins — so the ambiguity arm has to be reached
   by hand-written under-qualified input. Two rows, both directions of the disambiguation rule.
4. **Do not "fix" a red `N1` row.** See paragraph (a). Five rows, one file, and a red there means this
   ticket changed `toSan`'s generation behaviour — which `A6` forbids.
5. **Assert `A7` structurally, not by reading the diff.** A second private table passes every
   behaviour criterion above; it is exactly the drift `ADR-0004` clause 2 was written to stop.
6. **Case is meaning.** No test may assert that `bxc4` and `Bxc4` are the same move. They are two legal
   moves in some positions and `ABC-033` owns what happens then.

## Lane cost — how many test FILES this ticket implies

**One expected; zero is achievable and the engineer chooses.** `parseSan`'s rows can extend the
existing `src/san.test.ts` (**0 new files**), but `A1`'s property run over the six perft positions is
the expensive half and a separate `src/san.parse.test.ts` keeps its blast radius and its ownership
clean (**1 new file, ≈ 160 ms CPU, ≈ 1.2% of the 13 s clause**). **Whichever is chosen, the `N1`
additions — if any — go in the EXISTING `src/san.nfr.test.ts` and add no file.** Stated both ways so
the choice is priced rather than discovered at a gate.

## Size and priority rationale

**Size `M` (3).** Calibrated directly against `ABC-013`, which was `M` for `toSan` — a new module, the
full grammar table, the disambiguation rule and 52 rows. This ticket adds the reverse direction to
that same table in that same module, and the grammar work is therefore already paid for; what is new
is the resolution logic, the three-arm result type, the tolerance rules and `A1`'s property run over
the perft corpus. It is above `S` because of `A1` and `A3` and because it touches the most heavily
guarded file in the repository; it is below `L` (`ABC-019`) because there is no new module, no new
dependency edge, no state machine and no design decision left open.

**Not `XL`, and here is the split line if it ever moves** (named now, not improvised later):
**(a) the grammar and the three outcomes** — `A2`, `A4`, `A5`, `A7`; and **(b) provenance and
disambiguation** — `A1`, `A3`, `A6`. Part (a) is `S` and ships alone.

**Priority `P0`.** `EPIC-003` is `P0`; this is its headline promise and the supplier of three of the
five seam outcomes. It is **not** `P1`: `ABC-034`'s teaching rejections cannot be built without a
parser that knows *why* a string failed, and `ABC-035`'s `moves` command is formatting the very list
this ticket resolves against.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-12**. **Result: 10 of 10 MET. Requesting `Backlog`, not `Ready`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear — user, pain, value | **✅** the player who knows notation; `src/san.ts` renders SAN it cannot read; three of the seam's five outcomes |
| 2 | scope and out-of-scope clear | **✅** the ratified signature, four contract bullets, tolerance named exactly; six fences, one of which (case-insensitivity) is a **refusal with the measured reason**, routed to `ABC-033` |
| 3 | INVEST-shaped | **✅** independent of `ABC-031` and of `ABC-010`; two tickets depend on it and neither is a precondition |
| 4 | acceptance testable and measurable | **✅** seven criteria: a property over six positions with **zero** exceptions, exact candidate counts (**2**, **4**), reference identity, `32/32`, skip **0**, a structural single-table assertion. No criterion says "works" |
| 5 | dependencies known | **✅** none blocking; `ADR-0004` accepted, with its non-precedent ratification flagged |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` **≤ 650 ms CPU** with its full wording and its provenance; `N1` carried as a standing bar with a measurable form (**5 tests, none modified**); security threshold falsifiable |
| 7 | test notes present | **✅** six, including the do-not-delete-the-`N1`-row instruction and the case-is-meaning rule |
| 8 | size assigned | **✅** `M` (3), calibrated against `ABC-013`, with the split line named |
| 9 | priority assigned | **✅** `P0`, with the two tickets that cannot proceed without it |
| 10 | no major unresolved blocker | **✅** none. **The two paragraphs this ticket was owed are discharged onto this page** — that was the one thing outstanding for it |
