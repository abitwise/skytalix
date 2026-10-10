---
id: ABC-010
title: FEN semantic validation
status: in-review
column: In Review
size: M
priority: P2
epic: EPIC-003
feature: —
---

# ABC-010 — FEN semantic validation

> **Re-scored 2026-10-10 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-abc010-qe129a-2026-10-10`)
> at the wave tip `b98fb419`. **Both ⚠️ are cleared:** `ABC-126` merged (`f8aa31cf`) and the owner
> accepted `ADR-0033`. **The re-run scan found one new rejection outside the fence:**
> `src/levels.test.ts:351` (`ABC-087`, merged after `980890f`). Its black king is in check with white
> to move, and today it offers `f6h8`, a king capture. **The fence grows from 15 to 16 files,** and (c)
> re-authors that fixture (a measured replacement is in test note 6). `src/quiescence.test.ts:327` is
> now `:329`. `ABC-131` is **not** a predecessor. **DoR 10/10, `M`, `P2`.** The board move is the
> Orchestrator's. Reasoning: `.grugops/context/bapm-abc010-qe129a-2026-10-10/notes/`.
>
> *Earlier:* re-scored at `rescore-batch-2026-10-10` (`P1` → `P2`), and re-cut at `recut-abc010` after
> the design hop (`980890f`; criterion 9 re-worded, corpus rows moved to `ABC-126`;
> `.grugops/context/recut-abc010/notes/`).

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

**How it is built (re-cut 2026-10-10, under `ADR-0033`, accepted).** The design is the ADR's and is
not restated here. This page names only what the build delivers and where.
- **Two entries.** `parseFen` is the boundary (grammar, then semantics, in decision 3's order).
  `parseFenGrammarOnly` is test-only. A guard row in `src/fen.test.ts` keeps every production file
  from naming it.
- **The fence is 16 `src/` files** (`git diff --name-only`), measured at `980890f` and re-measured at
  `b98fb419`, which added `src/levels.test.ts`:
  - **Production:** `src/fen.ts`.
  - **The new table tests, the guard and one re-authored `ABC-001` case:** `src/fen.test.ts`.
  - **Six one-line import swaps** to `parseFenGrammarOnly` (an alias is allowed):
    `src/moves.castling.hardening.test.ts`, `src/moves.castling.test.ts`,
    `src/moves.enpassant.hardening.test.ts`, `src/moves.enpassant.test.ts`, `src/legal.test.ts`,
    `src/zobrist.test.ts`.
  - **Eight files whose fixtures are re-authored**, or that now assert a rejection:
    - `src/coordinate-move.test.ts:17` and `src/san.parse.test.ts:44` assert the rejection;
    - `src/move-input.test.ts:30`, `:51`, `src/moves.test.ts:257`, `src/quiescence.test.ts:329`,
      `src/evaluate.pawns.test.ts:121`, `src/status-panel.nfr.test.ts:64` and
      `src/levels.test.ts:351` are re-authored.
- **Owed when the code lands:** the `src/fen.ts` row of `memory-bank/30-architecture.md` (level 3,
  "grammar and semantics", `parseFenGrammarOnly`), per `ADR-0033` § Consequences.

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
- **`src/puzzle-corpus.ts`** *(re-cut 2026-10-10)*. Its two rows that the rules reject (`:108` "pin:
  Re1", a pawn on h8; `:110` "discovered check", black in check with white to move) are re-authored
  under `ABC-084`'s oracle by **`ABC-126`**, which lands first. This ticket does not edit the corpus
  and does not touch `src/puzzle-suite.baseline.json`.
- **`src/legal.ts`, `src/moves.ts`, `src/apply.ts`.** `ADR-0033` adds an import of
  `isSquareAttackedBy` and changes none of them.

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
- **Criterion 9 (the positive corpus). Re-worded 2026-10-10, `recut-abc010`.** The old text, "every
  fixture still parses", cannot hold: the rules reject 186 fixture occurrences at `980890f`, 175 of
  them on purpose (`ADR-0033` § Context). This is the Architect's proposed text, made checkable.
  **Given** every FEN fixture in the repo, **when** the suite runs after the change, **then**:
  - **(a)** the six perft positions and every `ABC-001` case parse through `parseFen`. A validation
    that rejects kiwipete is a broken validation. The one rejected `ABC-001` case is re-authored,
    not exempted: `src/fen.test.ts:29` becomes
    `rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1`, and it still round-trips.
  - **(b)** in each of the six import-swap files (§ Scope), every line that
    `git diff -U0 <base>...<tip> -- <file>` changes belongs to an import statement. Their fixtures
    parse through `parseFenGrammarOnly`, and their tests pass unedited.
  - **(c)** `src/coordinate-move.test.ts:17` (`A2`) and `src/san.parse.test.ts:44` (`A4`) assert that
    `parseFen` throws `FenError` on their printed FEN (the kings are adjacent). The other eight are re-authored
    to FENs that `parseFen` accepts: the seven in § Scope's last list, and (a)'s. Each test keeps its name and its point.
    The PR note lists the old FEN, the new FEN and every expected value that changed, with the
    reason. None of the eight switches to `parseFenGrammarOnly`. *(Re-scored at `b98fb419`:
    `src/levels.test.ts:351` added, "scores a stalemating child 0", default lane.)*
  - **(d)** `node .grugops/context/recut-abc010/probe/fen-scan.mjs <tip-tree>` runs every FEN
    literal through the tip's `parseFen`. Its `by file:` lines name only these: `src/fen.test.ts`, the
    six swap files, the two files of (c), and `src/history-pane.test.ts` and `src/render.test.ts`.
    The last two each hold one empty-board literal that was already rejected at `980890f`
    (`fen-scan.980890f.out.txt`). **Stop rule:** if the scan rejects a literal in any other file,
    report it and do not re-author it. That covers a row that landed after `980890f`, a
    `src/puzzle-corpus.ts` row and a FEN built at run time. The fence does not grow at build.
  - **(e)** the guard row is red first. A planted `parseFenGrammarOnly` mention in one production
    file turns it red; the plant is reverted (`git status --porcelain src` shows nothing extra).
  - **(f)** `npm test` is green with a skip count of 0. These lanes exit 0, because their files are
    in the fence or parse the corpus: `SEARCH_DEEP=1 npx vitest run src/quiescence.test.ts`,
    `ZOBRIST_DEEP=1 npx vitest run src/zobrist.test.ts`,
    `ENGINE_DEEP=1 npx vitest run src/levels.test.ts` *(added at `b98fb419`; its file joined the
    fence)* and `PUZZLE_DEEP=1 npx vitest run src/puzzle-suite.test.ts`. On the last, the solved count
    is not below the baseline file's on the build's base, and the file is untouched.
- **Given** `PERFT_DEEP=1`, **when** the deep perft lane runs, **then** all 32 cases still
  match their published node counts exactly.
- **Given** each rejection above, **when** the message is read, **then** it names the specific
  fault (which right, which square, which field) — never a bare "invalid FEN". This is
  EPIC-003's "reject with a reason that teaches" applied to the parser.

## Dependencies

*(Re-cut 2026-10-10. This replaces the cut-time "no blocking dependency" line.)*

- **✅ `ADR-0033` accepted by the owner** (Olger Oeselg, 2026-10-10; the ADR's § Status quotes him).
- **✅ `ABC-126` merged** (`f8aa31cf`). At `b98fb419` no `src/puzzle-corpus.ts` row is rejected, and
  `ABC-127` is merged (`d45a0261`).
- **`ABC-131` (Ready for UAT, unmerged) is NOT a predecessor.** It drops four mate-in-3 rows, and
  all four pass the rules. The rules reject the identical list at its tip `677b8b09` as at
  `b98fb419`. It touches no file in the fence. Either may merge first, and 9(f)'s `PUZZLE_DEEP`
  reads whichever baseline is on the base.
- **Never build in parallel with `ABC-083`; the second one rebases.** The two share two files:
  - `src/quiescence.test.ts`, where `ABC-083` `A10` re-pins rows and this ticket re-authors `:329`;
  - `src/evaluate.pawns.test.ts`, where `ABC-083` `A8` adds rows and this ticket re-authors `:121`.

  `ABC-083` changes evaluation, so the second ticket re-measures the other's pinned values. When
  both are pullable, `ABC-083` (`P1`) goes first. It is pullable only once `ABC-131` merges.
- **UAT is owed, not waived:** `src/fen.ts` is a production file, so the owner's word is needed at
  `In UAT`.
- **Not** dependent on `ABC-009`. Either may ship first.

## Design (Architect/Design, 2026-10-10, `design-abc010`)

Authority: [`ADR-0033`](../../memory-bank/50-decisions/ADR-0033-parsefen-checks-the-side-not-to-move-through-moves-ts-and-off-domain-fixtures-parse-grammar-only.md)
(**accepted by the owner 2026-10-10**). Evidence: `.grugops/context/design-abc010/` (`notes/`, `probe/`).

- **Where the check lives:** `fen.ts` imports `moves.ts` `isSquareAttackedBy` and does not use
  `legal.ts` `isInCheck`. The `isInCheck` route turns `ABC-016` `A13` red ("expected 2 to be 1",
  measured). `fen.ts` goes from level 2 to level 3, with no cycle.
- **Rule order, messages, en passant:** these are in `ADR-0033` decision 3. The en-passant rule
  requires no capturer.
- **Bars, measured on a throwaway prototype:** `NFR-002` 2.97 µs against 2.50 µs base; `NFR-001`
  4.96 M nodes/sec; deep perft 32/32.
- **Criterion 9:** it could not hold as worded, and BA/PM re-worded it at `recut-abc010`. The rules
  reject 186 fixture occurrences. 175 sit in the six swap files, 9 are incidental and 2 are corpus
  rows, which went to `ABC-126`. The re-cut scan at `980890f` gives the identical list.

## Security / NFR triggers

- `NFR-003` (keystroke echo < 50 ms; `moves`/Tab < 100 ms). Its cut-time `< 1 ms` per-parse bar is
  superseded by the `NFR-002` bar below, which is 100x tighter.
- **`NFR-002` — full redraw < 16 ms. Re-derived 2026-10-10.**
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
  never per node: `ADR-0002` clause 3.)* `ADR-0033` adds the `fen.ts → moves.ts` edge, so confirm
  `npm run perft` still reports **≥ 1,000,000 nodes/sec** and deep perft **32/32 exact**. The
  prototype read 4.96 M nodes/sec and 32/32.
- **`N8-LANE` ≤ 650 ms CPU net:** 0 new test files. The fixtures change 1:1, and the new rows go
  into `src/fen.test.ts`.
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
3. **Keep a positive corpus** (criterion 9 defines it). Every legal fixture must still parse. The most
   likely way this ticket goes wrong is over-rejection, and the existing 143-test suite (1,608 tests at `b98fb419`) plus
   the deep perft lane are the guard.

The round-trip criterion is best written as a property test over the existing perft position
table rather than as one-off cases — the table is already there.

Two more, added at the re-cut:

4. **Re-run 9(d)'s scan on your own base before you write code** *(re-cut 2026-10-10)*. The
   fixture list is measured at `980890f`. The base you build on is later, at least `ABC-127` and
   `ABC-126`. A FEN outside the list falls under the stop rule.
5. **Measured replacements exist for two fixtures** (Architect, `…aa14ac4d`). For `fen.test.ts:29`,
   use the after-`1.e4` FEN above. For `status-panel.nfr.test.ts:64` `SPARSE_FEN`,
   `4k3/8/8/8/8/8/8/R5K1 w - - 0 1` with plies `a1a2 e8d8` and `a1a2 e8d8 a2a4 d8c8` kept the file
   at 17/17. The other six are the Engineer's to choose, except as note 6 says.
6. **A measured replacement for `src/levels.test.ts:351`** *(re-score at `b98fb419`)*. Use
   `7k/8/6K1/5Q2/8/8/8/8 w - - 0 1`, and the move label `f6f7` becomes `f5f7`. The rules accept it,
   `f5f7` leaves black 0 replies and not in check, and the row's own `play` scores `f5f7` 0
   (`.grugops/context/bapm-abc010-qe129a-2026-10-10/probe/levels-stalemate.out.txt`). The test name
   and its "Qf7 … not in check" comment still hold.

## Size and priority rationale

*(Condensed 2026-10-10 at `recut-abc010`. The cut-time `P1` argument and the earlier DoR texts are
in git at `980890f` and in the notes they cite.)*

**Size `M` (3), re-checked against the 16-file fence** (`b98fb419`). It holds, because the file count measures
breadth, not risk:
- the production change is about 60 lines in one module (prototype, `…aa14ac4d`);
- 6 of the 16 files change one import line each, and were measured green;
- 10 fixtures in 9 files are re-authored or assert a rejection. Three have measured replacements,
  and two only flip an assertion;
- no new module and no open design question remain.

It stays below `ABC-004` (`L`). It calibrates with `ABC-007` and `ABC-001` (`M`). **Not `L`:** the
churn is mechanical and bounded by 9(d)'s stop rule. **Not `XL`.** The cut-time split line ((a)
board semantics, (b) field bounds and typing) existed in case design added a module. Design added
none, so the split is not taken. The one piece that was separable, the corpus rows, went to
`ABC-126`.

**Priority `P2`, unchanged** (re-prioritised from `P1` at `rescore-batch-2026-10-10`). No epic
accepts a FEN from a user. **Not `P3`:** `toFen`'s documented round trip is false today.
**Trigger back to `P1`:** any ticket that lets a human or a file supply a FEN (a `--fen` flag, a
paste command, a saved-game load), or `ABC-093` choosing a FEN-carrying book format that `ABC-094`
parses at run time. That ticket names `ABC-010` as its hard prerequisite. The predecessor
`ABC-126` is `P2` too, so the order costs no priority.

## Definition of Ready

### DoR re-scored 2026-10-10 by BA/PM at `bapm-abc010-qe129a-2026-10-10` — 10 of 10, 0 ⚠️

Wave tip `b98fb419`. **Met.** The design hop is done, so the pull goes straight to `Ready for Dev`. The
board move is the Orchestrator's, and so is the `ABC-083` sequencing in § Dependencies.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** unchanged. Row 3 still offers a king capture, and so does `src/levels.test.ts:351` (`f6h8`) |
| 2 | scope and out-of-scope clear | **✅ re-read.** The fence is 16 files (`src/levels.test.ts` added); `src/puzzle-corpus.ts` and `legal.ts`/`moves.ts`/`apply.ts` stay out |
| 3 | INVEST-shaped | **✅ cleared.** `ABC-126` merged (`f8aa31cf`), and `ABC-131` is not needed (identical reject list at its tip) |
| 4 | acceptance testable and measurable | **✅ re-verified at `b98fb419`.** (a)–(f) re-read against the tip: 10 fixtures in 9 files, `:327` → `:329`, (c) gains `levels.test.ts:351`, and (f) gains the levels deep lane. The 9(d) scan rejects only the 15 grammar faults it rejected at `980890f` |
| 5 | dependencies known | **✅** both ⚠️ released; `ABC-083` shares two files; `ABC-131` independent |
| 6 | security/NFR triggers with a measurable target | **✅** unchanged: `NFR-002` ≤ 10 µs, `NFR-001` ≥ 1 M nodes/sec and 32/32, `N8-LANE` 0 new files |
| 7 | test notes present | **✅** six (note 6 added) |
| 8 | size assigned | **✅** `M` (3), re-checked against 16 files |
| 9 | priority assigned | **✅** `P2`, with the trigger back to `P1` |
| 10 | no major unresolved blocker | **✅ cleared.** `ADR-0033` accepted by the owner |

**History:** cut 2026-07-29 (10/10 claimed); 9/10 on 2026-08-12; 10/10 at `rescore-batch`, then
`Backlog` after the design hop; 8/10 at `recut-abc010` (`980890f`); 10/10 here. Full texts are in git.
