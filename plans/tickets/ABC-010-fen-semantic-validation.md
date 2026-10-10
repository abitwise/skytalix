---
id: ABC-010
title: FEN semantic validation
status: backlog
column: Backlog
size: M
priority: P2
epic: EPIC-003
feature: —
---

# ABC-010 — FEN semantic validation

> **Re-scored 2026-10-10 by BA/PM** (task `wave-2026-09-25`, subtask `rescore-batch-2026-10-10`,
> Workflow 07) against the wave tip `71be48b`. Item 6's `NFR-002` bar is re-derived from a
> measurement (§ Security / NFR triggers). **Priority `P1` → `P2`.** The `P1` argument rested on
> "`EPIC-003` accepts a FEN from a user", and `EPIC-003` does not: no epic scopes a FEN input
> (§ Size and priority rationale). **DoR 10/10 → `Ready`, routed `Ready → In Design → Ready for
> Dev`** for the open design question. Reasoning: `.grugops/context/rescore-batch-2026-10-10/notes/`.

## Problem

*User*: the player who pastes or types a FEN to set up a position, and every EPIC-003 code
path that accepts one. *(Corrected 2026-10-10: no such player exists yet. No epic scopes a FEN
input. The only `newGame` call is `newGame(START_FEN)` (`src/cli.ts:166`). The five production
consumers of `parseFen` (`history.ts` `:58`/`:74`/`:117`, `status-panel.ts:156`,
`history-pane.ts:121`, `result-screen.ts:132`, `perft-bench.ts`) parse `START_FEN`, the
history's own `initialFen` or fixtures. The user today is the maintainer, and the first ticket
that adds a FEN input inherits this guard.)*

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

**Re-run 2026-10-10 at `71be48b`** (`.grugops/context/rescore-batch-2026-10-10/probe/`): all six
rows still parse, and all five non-string inputs still throw `TypeError`. Rows 1–2 no longer yield
a castle move, because the move generator now checks the rook, so their "and then" cell is stale.
Their acceptance (`parseFen` throws) is unchanged. Row 3 still offers the king capture
`84->116`. In rows 5–6 **both** re-parses throw, not only the `Infinity` one.

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
here, not answered here. *(2026-10-10: `isInCheck` is now exported at `src/legal.ts:32`, so the
candidate edge is `fen.ts → legal.ts`. `legal.ts` imports `apply`, `moves` and `position`, not
`fen`, so the edge makes no cycle. Still Architect/Design's at the design hop.)* **Answered
2026-10-10 in § Design below (`ADR-0033`, proposed): `fen.ts → moves.ts`, not `legal.ts`.**

## Design (Architect/Design, 2026-10-10, `design-abc010`)

Authority: [`ADR-0033`](../../memory-bank/50-decisions/ADR-0033-parsefen-checks-the-side-not-to-move-through-moves-ts-and-off-domain-fixtures-parse-grammar-only.md)
(**proposed, owner acceptance owed**). Evidence: `.grugops/context/design-abc010/` (`notes/`, `probe/`).

- **Where the check lives.** `fen.ts` imports `isSquareAttackedBy` from `moves.ts`, on the king squares
  `assertBothKingsPresent` already finds. It does **not** call `legal.ts` `isInCheck`, because that turns
  `ABC-016` `A13` red (`src/status-panel.nfr.test.ts`: "expected 2 to be 1", measured).
  `fen.ts` moves from level 2 to level 3, there is no cycle, and no importer's closure changes.
- **Two entries.** `parseFen` is the boundary: grammar, then semantics. `parseFenGrammarOnly` is
  test-only, and a test in `fen.test.ts` keeps every production file from naming it. Rule order,
  message shape and the en-passant definition (no capturer required) are in `ADR-0033` decision 3.
- **Bars, measured on a throwaway prototype.** `NFR-002`: 2.97 µs mean against 2.50 µs base, so ≤
  10 µs holds. `NFR-001`: perft 4.96 M nodes/sec. Deep perft: 32/32.
- **⚠️ Criterion 9 cannot hold as worded. This goes back to BA/PM.** The six rules reject 144 of
  the repo's 732 distinct parsing FENs (186 occurrences).
  - 175 of the 186 sit in six rules-core files that feed impossible boards on purpose: `moves.castling*`,
    `moves.enpassant*`, `legal`, `zobrist`. These switch to `parseFenGrammarOnly`, one import line each,
    and were measured green.
  - 9 more are incidental, in 8 test files, and must be re-authored. One is `fen.test.ts:29`, an
    `ABC-001` case, `e3` with white to move.
  - 2 are rows of `src/puzzle-corpus.ts`: a pawn on h8, and black in check with white to move.

  The fence becomes 16 files. The page's "shares no file" no longer holds: `puzzle-corpus.ts` is
  shared with `ABC-127` and `ABC-126`, and `quiescence.test.ts` with `ABC-083`. The proposed wording
  and the file list are in the decision note.

## Security / NFR triggers

- `NFR-003` — input responsiveness (EPIC-003): keystroke echo **< 50 ms**, `moves` and
  tab-completion **< 100 ms**. Measurable bar: full parse-with-validation adds **< 1 ms** per
  call. Parsing is a once-per-input operation and the audit measured `legalMoves` itself at
  2.1–5.3 µs, so there is ample room — but the number is stated so a regression is visible
  rather than assumed.
- **`NFR-002` — full redraw < 16 ms. Re-derived 2026-10-10; this bar replaces the `< 1 ms` above.**
  **Validated `parseFen` ≤ 10 µs mean per call.** It is read in the PR note, base against branch in
  one process, with the machine, Node version and 1-minute load recorded. It is not asserted in the
  suite (`src/gameend.nfr.test.ts:16`–`:17`). Derivation: there are **2 calls per frame**
  (`status-panel.ts:156`, `history-pane.ts:121`), so the frame cost is ≤ 20 µs, **0.125%** of
  16 ms. There are ≤ 4 history derives per turn (`NFR-003`'s second component), so the turn cost
  is ≤ 40 µs. Today's unvalidated parse reads **1.85 µs** median, and one in-check probe of the side
  not to move reads **0.15 µs** (BA/PM probe, Apple M3, Node v26.11.0, load1 4.8). That is 5x
  headroom. **Above 10 µs: stop and report to Security/NFR.**
- `NFR-001` — move generation throughput is **not** at risk: `src/fen.ts` has exactly one
  production consumer (`perft-bench.ts`) and is not on the search hot path. *(2026-10-10: five
  production consumers, still none on the search hot path. `keyHistory` parses once per search,
  never per node: `ADR-0002` clause 3.)* If the design
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
   likely way this ticket goes wrong is over-rejection, and the existing 143-test suite (1,540 tests at `71be48b`) plus
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

**Re-prioritised 2026-10-10: `P1` → `P2` (BA/PM).** The "Not `P2`/`P3`" argument above is false on
today's plans. `EPIC-003`'s scope (`plans/epics/EPIC-003-move-input-and-controls.md` § Scope) is the
move parsers, the ambiguity list, teaching rejections, the commands and Tab-completion. **It never
accepts a FEN**, and no other epic does. The defect class is real and reproduced (re-run above),
but no input reaches it. **Not `P3`:** `toFen`'s documented round trip is false today, and
`EPIC-005` may make this live soon (next line). **Trigger back to `P1`:** any ticket that lets a
human or a file supply a FEN (a `--fen` flag, a paste command, a saved-game load), or `ABC-093`
choosing a FEN-carrying book format that `ABC-094` parses at run time. That ticket then names
`ABC-010` as its hard prerequisite. The Orchestrator may reverse this re-prioritisation.

## Definition of Ready

Problem ✅ · scope + out-of-scope ✅ · INVEST ✅ · acceptance measurable ✅ (exact FENs, exact
error type, byte-identical round trip) · dependencies ✅ (none blocking; one open design
question flagged and assigned) · NFR triggers ✅ (NFR-003, numeric bar) · test notes ✅ ·
size `M` ✅ · priority `P1` ✅ · no blocker ✅

Sits in `Backlog`. The open design question is a design-hop input, not a blocker. Promotion
to `Ready` is a separate BA/PM step and has not been taken.

### DoR re-scored 2026-08-12 by BA/PM — 9 of 10, not promoted

*(Condensed 2026-10-10. The full text is in git history at `71be48b` and in
`.grugops/context/refinement-post-abc030/notes/20260812T181000Z-ba-pm-observation-i-re-verified-five-dor-scores-and-three-of-them-moved-6b2d5f81.md`.)*
That re-score found four production consumers of `src/fen.ts`, two of them once per frame, and set
**item 6 to ⚠️**: the triggers omitted `NFR-002`, and the `< 1 ms` bar was the wrong size for a
per-frame call. It also said the design question is a design-hop input, not a blocker, so a pull
routes `Ready → In Design → Ready for Dev`. And it noted `N8-LANE` (≤ 650 ms CPU) is inherited, with
0 new test files expected.

### DoR re-scored 2026-10-10 by BA/PM — 10 of 10, page `Ready`

`rescore-batch-2026-10-10`, wave tip `71be48b`. **The board move is the Orchestrator's, and the pull
goes to `In Design` first.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** corrected: no FEN input exists yet, so the user is the maintainer and the first ticket to add one. Reproduction re-run today |
| 2 | scope and out-of-scope clear | **✅** six rules plus round trip and error typing; retrograde legality and Chess960 fenced |
| 3 | INVEST-shaped | **✅** independent (no dependency), small enough at `M`, with a split line named if design moves it |
| 4 | acceptance testable and measurable | **✅** exact FENs, exact error type, byte-identical round trip, positive corpus, `32/32` |
| 5 | dependencies known | **✅** none blocking. The design question is assigned to Architect/Design and is a routing step |
| 6 | security/NFR triggers with a measurable target | **✅** (was ⚠️) `NFR-002`: ≤ 10 µs per validated parse, derived from 2 calls per frame and measured at 1.85 µs today; `NFR-001` perft ≥ 1,000,000 nodes/sec if an edge is added; `N8-LANE`; no security trigger |
| 7 | test notes present | **✅** three |
| 8 | size assigned | **✅** `M` (3) |
| 9 | priority assigned | **✅** `P2` (re-prioritised from `P1`, with the trigger back) |
| 10 | no major unresolved blocker | **✅** the design question is answered at the design hop and does not change any criterion |
