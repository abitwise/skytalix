---
id: ABC-010
title: FEN semantic validation
status: backlog
column: Backlog
size: M
priority: P1
epic: EPIC-003
feature: —
---

# ABC-010 — FEN semantic validation

## Problem

*User*: the player who pastes or types a FEN to set up a position, and every EPIC-003 code
path that accepts one.

*Pain*: `src/fen.ts` validates FEN **grammar** loudly and correctly — 13 of 13 malformed
cases throw a typed `FenError` naming the exact fault, before any position is returned. It
validates FEN **semantics** not at all. A string that is grammatically perfect but describes
a position that cannot occur in chess is accepted in silence, and the resulting `Position`
then drives the generator into offering moves that do not exist, corrupting the board, or
indexing a `Uint8Array` at `-1`.

*Value*: EPIC-003's headline acceptance criterion is *"reject with a reason that teaches"*.
The parser already does that for grammar. This ticket extends the same standard to the layer
below it, so that a bad FEN produces one clear `FenError` at the boundary instead of a wrong
chess answer three modules downstream.

The failure is **loud where it checks and silent where it does not** — which is the shape
that reaches production.

## Source

Architecture audit, task `architecture-audit-2026-07-29`:

- `20260729T145735Z-security-nfr-observation-abedec95` — §6 (all four semantic holes, the
  adversarial FEN sweep, and the "Minor" non-string-input case), and `RF-3`, which names this
  as a required fix before EPIC-003 accepts user FEN, with ticketing owner BA/PM.
- `20260729T150600Z-orchestrator-observation-7b2f91c4` — synthesis: "grammar validation is
  loud and solid; semantic validation is absent."

## Reproduction (verified 2026-07-29, on `main`)

Every case below parses without error today:

| FEN | Accepted today, and then |
|-----|--------------------------|
| `4k3/8/8/8/8/8/8/K7 w KQ - 0 1` | rights `KQ`, king on a1, no rooks → phantom castles; board corrupted (see `ABC-009`) |
| `4k3/8/8/8/8/8/8/4K3 w K - 0 1` | right `K`, no h1 rook → 6 legal moves, one of them a `FLAG_CASTLE` `4->6` that is not a legal chess move |
| `4k3/8/4Q3/8/8/8/8/4K3 w - - 0 1` | black is in check but **white** is to move → 29 white moves, of which **1 captures the black king** (`84->116`). Downstream, `kingSquareOf` returns `-1` and `isSquareAttackedBy` indexes at negative offsets |
| `4k3/8/8/8/8/8/8/P3K3 w - - 0 1` | a white pawn on rank 1, which no legal game can produce |
| halfmove field of 400 `9`s | `/^\d+$/` passes, `Number()` overflows → `halfmoveClock = Infinity`, and `toFen` emits `... - Infinity 1` |
| fullmove `1000000000000000000000` | `toFen` emits `... 1e+21` |

`toFen` is documented at `src/fen.ts:184` to *"round-trip byte-identically with parseFen"*.
It does not: re-parsing its own output for the `Infinity` case throws
`FenError: halfmove clock must be a non-negative integer, found "Infinity"`.

Separately, non-string input (`null`, `undefined`, `42`, `{}`, `[]`) throws a raw `TypeError`
(`Cannot read properties of null (reading 'trim')`) at `src/fen.ts:144`. All five were
confirmed to fail `instanceof FenError`. A caller that catches `FenError` — the natural thing
to write, and what EPIC-003's CLI boundary will write — leaks a stack trace instead.

## Scope

`parseFen` rejects, with a typed `FenError` naming the specific fault, each of:

- **Castling rights inconsistent with the board** — a right asserted with no king on its home
  square, or no matching rook on its home square.
- **The side not to move is already in check** — a position that cannot be reached, and the
  one that offers a king-capturing move.
- **A pawn on rank 1 or rank 8.**
- **An en-passant square with no pawn that could have made the double push.**
- **Clock fields that do not survive their own round trip** — the parser accepts a halfmove or
  fullmove value only if it is a finite integer whose serialization is byte-identical to the
  input field. `Infinity` and `1e+21` must never reach a `Position` or leave `toFen`.
- **Non-string input** — normalized to `FenError`, never a raw `TypeError`.

`toFen`'s documented round-trip guarantee holds for every position `parseFen` returns.

## Out of scope

- **Fixing `legalMoves`' mutation of its argument** — that is `ABC-009`, deliberately
  separate. This ticket stops the bad input; it does not repair the rules core's contract.
- SAN and coordinate move parsing, ambiguity handling, tab-completion, in-game commands — the
  rest of EPIC-003, decomposed separately.
- The `NFR-005` catalog correction (audit `RF-1`) and the pin-aware legality decision (`RF-2`)
  — both Architect/Design, both out of this ticket.
- Full legality proof of a position (retrograde analysis: is this position reachable from the
  start?). Explicitly declined — unbounded work for no user value. The six checks above are
  the cheap slice that closes every hole the audit actually reproduced.
- Chess960 castling-rights notation. Variants are a permanent non-goal (EPIC-001).

## Acceptance (Given/When/Then)

Each criterion is a currently-failing test that must go green. All FENs are exact.

- **Given** `4k3/8/8/8/8/8/8/K7 w KQ - 0 1`, **when** it is parsed, **then** `parseFen` throws
  a `FenError` whose message names the castling rights as inconsistent with the board.
  *(Today: parses cleanly.)*
- **Given** `4k3/8/8/8/8/8/8/4K3 w K - 0 1`, **when** it is parsed, **then** `parseFen` throws
  a `FenError` naming the missing h1 rook. *(Today: parses, then offers a phantom castle.)*
- **Given** `4k3/8/4Q3/8/8/8/8/4K3 w - - 0 1`, **when** it is parsed, **then** `parseFen`
  throws a `FenError` stating that the side not to move is in check. *(Today: parses, and
  `legalMoves` returns 29 moves of which 1 captures the black king.)*
- **Given** `4k3/8/8/8/8/8/8/P3K3 w - - 0 1`, **when** it is parsed, **then** `parseFen`
  throws a `FenError` naming the pawn on rank 1. *(Today: parses cleanly.)*
- **Given** a FEN whose en-passant square has no pawn able to have double-pushed to it,
  **when** it is parsed, **then** `parseFen` throws a `FenError`. *(Today: accepted.)*
- **Given** a FEN whose halfmove field is 400 `9` characters, **when** it is parsed, **then**
  `parseFen` throws a `FenError` and no `Position` with `halfmoveClock === Infinity` is ever
  returned. Likewise a fullmove field of `1000000000000000000000`. *(Today: both parse;
  `toFen` emits `Infinity` and `1e+21`.)*
- **Given** any FEN string that `parseFen` accepts, **when** it is serialized and re-parsed,
  **then** `parseFen(toFen(p))` does not throw and `toFen(parseFen(toFen(p)))` is
  byte-identical to `toFen(p)`. *(Today: false for the overflow cases.)*
- **Given** each of `null`, `undefined`, `42`, `{}`, `[]`, **when** passed to `parseFen`,
  **then** the thrown error satisfies `instanceof FenError`. *(Today: all five throw
  `TypeError`; `instanceof FenError` is `false` for all five.)*
- **Given** every FEN fixture already in the repo — the six perft positions, all `ABC-001`
  round-trip cases, and every fixture in `src/*.test.ts` — **when** the suite runs after the
  change, **then** all still parse and the suite is green with a skip count of 0. A
  validation that rejects kiwipete is a broken validation, and this is the criterion that
  catches it.
- **Given** `PERFT_DEEP=1`, **when** the deep perft lane runs, **then** all 32 cases still
  match their published node counts exactly.
- **Given** each rejection above, **when** the message is read, **then** it names the specific
  fault (which right, which square, which field) — never a bare "invalid FEN". This is
  EPIC-003's "reject with a reason that teaches" applied to the parser.

## Dependencies

- No blocking dependency. `src/fen.ts` is merged on `main` (`ABC-001`).
- **Not** dependent on `ABC-009`. Either may ship first; shipping this one first makes
  ABC-009's defect unreachable in practice, which is why it carries the higher priority.

### Open design question — hand to Architect/Design at the design hop, do not decide in dev

The "side not to move is in check" rule needs attack detection, which today lives in
`src/moves.ts` (`isSquareAttackedBy`). `src/fen.ts` currently imports from `src/position.ts`
only — it is a level-1 leaf with exactly one production consumer. Adding `fen.ts → moves.ts`
introduces a new dependency edge and moves `fen.ts` down the layering. It creates no cycle,
but it is a real structural change to a graph the audit recorded as a clean acyclic DAG, and
choosing where the check lives is a design decision, not an implementation detail. Flagged
here, not answered here.

## Security / NFR triggers

- `NFR-003` — input responsiveness (EPIC-003): keystroke echo **< 50 ms**, `moves` and
  tab-completion **< 100 ms**. Measurable bar: full parse-with-validation adds **< 1 ms** per
  call. Parsing is a once-per-input operation and the audit measured `legalMoves` itself at
  2.1–5.3 µs, so there is ample room — but the number is stated so a regression is visible
  rather than assumed.
- `NFR-001` — move generation throughput is **not** at risk: `src/fen.ts` has exactly one
  production consumer (`perft-bench.ts`) and is not on the search hot path. If the design
  question above adds a `fen.ts → moves.ts` edge, confirm `npm run perft` still reports
  **≥ 1,000,000 nodes/sec** and deep perft **32/32 exact**.
- **No security trigger.** The audit was explicit: this is a reliability defect, not a
  security one. There is no injection sink, no trust boundary, no privilege and no data
  exposure; the consequences are a wrong chess answer and a corrupted in-memory board. No
  ASVS L1 requirement fails. Do not re-file this as a security item.

## Test notes

The audit's adversarial sweep is the test corpus — every row of the reproduction table becomes
a case with an exact FEN and an exact expected `FenError`. This is a table test, the same
shape `ABC-007` used.

Three things the tests must do that a naive pass would miss:

1. **Assert the error type, not just that it throws.** The non-string cases already throw
   today; what is wrong is *what* they throw. `expect(...).toThrow(FenError)` is the
   assertion, and `instanceof` must be checked explicitly for the five non-string inputs.
2. **Assert the message names the fault.** EPIC-003's acceptance is that rejections teach.
   A generic "invalid FEN" passes a throw-assertion and fails the requirement.
3. **Keep a positive corpus.** Every legal fixture in the repo must still parse. The most
   likely way this ticket goes wrong is over-rejection, and the existing 143-test suite plus
   the deep perft lane are the guard.

The round-trip criterion is best written as a property test over the existing perft position
table rather than as one-off cases — the table is already there.

## Size and priority rationale

**Size `M` (3).** Six validation rules, all local to one existing 225-line module, each with
an exact FEN fixture and an exact expected error. Calibrated against `ABC-007` (five terminal
conditions **plus** a new Zobrist module, `M`) and `ABC-001` (position representation plus
full FEN parse/serialize plus an ADR, `M`); it is clearly below `ABC-004` (special moves,
`L`). Not `L`, because no new subsystem is created and the oracle already exists.

**Not `XL`, and here is the split line if it moves.** If the design hop decides the
side-not-to-move-in-check rule requires a new module or a restructure of the dependency graph,
this ticket splits along a line named now, not improvised later: **(a) board-semantic legality**
— castling rights, side-not-to-move-in-check, pawns on rank 1/8, en-passant plausibility; and
**(b) field bounds and error typing** — clock overflow, `toFen` round-trip guarantee,
non-string input to `FenError`. Part (b) is `S`, has no new dependency edge, and can ship on
its own.

**Priority `P1`, not defaulted.** Applying the latent/live test:

- **Not `P0`:** the defect is latent today. `parseFen` has no user-facing caller — the module
  map records exactly one production consumer, the perft harness, which feeds it only
  well-formed fixture FENs. Nothing in flight is broken and the suite is 143/143 green.
  Dropping everything is not warranted.
- **Not `P2`/`P3`:** it goes **live the moment EPIC-003 accepts a FEN from a user**, which is
  what EPIC-003 exists to do — and EPIC-003 is a `P0` epic. It is the audit's named required
  fix `RF-3`, gated explicitly on "before EPIC-003 accepts user FEN". It is also the **only**
  boundary guarding this class: every deeper symptom the audit found, including `ABC-009`'s
  board corruption, enters through this parser. Fixing the boundary makes the class
  unreachable; leaving it means EPIC-003 is decomposed on a parser known to accept impossible
  positions.

This must be `Ready` before EPIC-003 is decomposed, so it is not discovered as rework
mid-epic.

## Definition of Ready

Problem ✅ · scope + out-of-scope ✅ · INVEST ✅ · acceptance measurable ✅ (exact FENs, exact
error type, byte-identical round trip) · dependencies ✅ (none blocking; one open design
question flagged and assigned) · NFR triggers ✅ (NFR-003, numeric bar) · test notes ✅ ·
size `M` ✅ · priority `P1` ✅ · no blocker ✅

Sits in `Backlog`. The open design question is a design-hop input, not a blocker. Promotion
to `Ready` is a separate BA/PM step and has not been taken.

### DoR RE-SCORED 2026-08-12 by BA/PM — **9 of 10. NOT promoted, and the reason is a measurement this page's own argument rests on.**

Task `post-abc030-2026-08-12`, subtask `refinement-post-abc030`, Workflow 07. **`EPIC-003` was
decomposed at this hop** (`ABC-031`…`ABC-038`), which is the event this page's closing line names:
*"this must be `Ready` before EPIC-003 is decomposed, so it is not discovered as rework mid-epic."*
So the promotion was assessed rather than deferred — **and it does not pass.**

**THE MODULE MAP THIS TICKET QUOTES IS STALE, MEASURED AT THE SOURCE ON `main` AT `43d5a9d`:**

```
this page says:  "src/fen.ts has exactly ONE production consumer (perft-bench.ts)"
                 "parseFen has no user-facing caller"
                 "NFR-001 is not at risk: fen.ts ... is not on the search hot path"

measured 2026-08-12, production (non-test) importers of src/fen.ts:  FOUR
  src/perft-bench.ts   :63 :71 :84
  src/history.ts       :58  :74  :117   <- :117 is inside keyHistory(), which repetitionCounts
                                            uses, which gameStatusOf uses, which the LOOP calls
                                            once per ply
  src/status-panel.ts  :156                <- ONCE PER FRAME
  src/history-pane.ts  :121                <- ONCE PER FRAME
```

**`parseFen` is now on the render path, twice per frame, and on the per-ply evaluation path.** Three
tickets merged after this one was written (`ABC-012`, `ABC-016`, `ABC-017`) put it there, each
legitimately — `ADR-0002`'s derive-don't-maintain rule makes replay-from-`initialFen` the correct
shape, and replay starts with a `parseFen`.

**What that does to this page, item by item:**

- **item 6 — security/NFR triggers, each with a measurable target: ✅ → ⚠️.** The trigger set names
  `NFR-003` and `NFR-001` and **does not mention `NFR-002` at all** — the render-latency bar of
  **< 16 ms per frame**, which is now reachable by this ticket **twice per frame**. And the stated bar
  is the wrong size in the new context: *"full parse-with-validation adds **< 1 ms** per call"* was set
  against a module with one consumer on no hot path; **two calls at 1 ms each is 12.5% of the whole
  frame budget.** The bar needs re-deriving against `NFR-002`, not merely re-typing. **This is the one
  item that blocks promotion.**
- **item 9 — priority `P1`: still ✅, and the argument is now stronger in one half and weaker in the
  other, so both are stated.** *Weaker:* "no user-facing caller, one consumer, nothing in flight" is
  false — four consumers, two of them per-frame. *Unchanged:* the **latency** argument for `P1` rather
  than `P0` still holds, because none of the four callers feeds `parseFen` a **user-supplied** string
  — all three new ones pass `history.initialFen`, which the product produced itself. The defect this
  ticket fixes stays latent until `EPIC-003` accepts a FEN from a human, exactly as written.
- **items 1–5, 7, 8, 10: ✅, re-verified individually.** The acceptance criteria are unaffected by the
  module-map change — every FEN and every expected `FenError` is a property of `parseFen` alone.

**On the open design question, and why it is NOT the ⚠️.** *Does `fen.ts` gain an edge to `moves.ts`
for the side-not-to-move-in-check rule?* It stays a **design-hop input, not a blocker**, and that
differs from `ABC-026`'s precedent for a stated reason: there, the acceptance criteria **could not be
written** until an architect produced a number; here they **are written** and are identical whichever
way the edge falls. **The routing consequence is real though and belongs to the Orchestrator:** when
this ticket is pulled it goes `Ready → In Design → Ready for Dev`, not straight to development.
**And the new measurement makes that design hop bigger than it looked** — an edge from `fen.ts` to
`moves.ts` now lands on a module the renderers call twice per frame.

**`N8-LANE` inheritance, noted because this ticket predates the row.** `plans/nfr-catalog.md`'s
standing bar did not exist on 2026-07-29, and its own sentence — *"a ticket that states nothing has
stated this one"* — makes this page compliant without an edit: **≤ 650 ms CPU** (5% of `NFR-008`'s
13 s clause), net of 160 ms per test file added. **Expected new test files: 0–1** — the table tests
belong in the existing `src/fen.test.ts`, so **0 is the honest expectation** and this ticket may cost
the lane nothing at all in per-file floor.

**Result: 9 of 10, DoR NOT met, stays in `Backlog`, NOT promoted, and not smoothed** — `ABC-024`,
`ABC-026`, `ABC-028` and `ABC-030` were each left with the DoR honestly unmet rather than rounded up,
and this board's standard is not suspended because a promotion would have been convenient. **What is
needed before `Ready` is one short BA/PM pass with Architect/Design input: re-derive item 6's bar
against `NFR-002` with the four call sites in view.** It is small, it is named, and it is cheaper than
discovering it inside `EPIC-003`.
