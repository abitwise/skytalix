---
kind: adr
id: ADR-0033
---
# ADR-0033: `parseFen` checks the side not to move through `moves.ts`'s attack primitive, not `legal.ts`. Rules-core fixtures that need an impossible board parse through a grammar-only entry

## Status

**accepted** 2026-10-10 by the owner. Owner (Olger Oeselg), 2026-10-10, verbatim: *"Accept ABC-036, ABC-051, ABC-127; accept ADR-0029, ADR-0033 ; Explain R4 ; R2 - keep depth 7 ; ABC-074 - rule the test out ; Worktree cleanup - yes"*

Was: **proposed** 2026-10-10 by Architect/Design (task `wave-2026-09-25`, subtask `design-abc010`). It answers
`ABC-010`'s "Open design question" (where the side-not-to-move-in-check rule lives). It also answers the
question the page did not ask but its criterion 9 depends on: how the suite still builds the impossible boards
that the rules core's hardening tests exist to feed. **Owner acceptance owed.** No agent moves an ADR to
`accepted`.

- It amends no ADR. It applies `ADR-0005` clause 2 and `ADR-0006`'s "second, unowned definition of a rules
  concept" test. It reads the module graph the way `ADR-0011` and `ADR-0030` say to read it: runtime
  evaluation, where only `import type` is erased.
- **No code changes in this hop.** The prototype that was measured is a throwaway instrument, out of tree. The
  probes and raw readings are in `.grugops/context/design-abc010/probe/` (`RUN.txt` lists them). The summary
  is in that task's `notes/`.

## Context

`src/fen.ts` imports only `src/position.ts`. The rule "the side not to move is not in check" needs attack
detection, and the page names `fen.ts → legal.ts` (`isInCheck`) as the candidate edge.

**The module graph does not decide it.** Measured on the runtime graph at `6ade041` (35 production modules,
90 runtime edges, `closure.out.txt`): neither `fen.ts → legal.ts` nor `fen.ts → moves.ts` makes a cycle,
and the maximum depth stays 10 either way. Only `fen.ts`'s own closure grows (`+apply, legal, moves` or
`+moves`). All six importers of `fen.ts` already reach `legal.ts`, so no other module's closure changes.
The `ADR-0011` render closure is unchanged too.

**Two other facts do decide it.**

1. **A spy pins `isInCheck`'s count.** `src/status-panel.nfr.test.ts` (`ABC-016` `A13`) spies `legal.ts`
   `isInCheck` and pins the panel's own call at exactly 1, by difference against `toSan`. The panel's replay
   calls `parseFen`. With the check routed through `isInCheck` (variant A), that test goes red: **"expected 2
   to be 1"**. With the check routed through `isSquareAttackedBy` (variant B), the file is green, 17/17
   together with `src/history-pane.nfr.test.ts`.
2. **The repo's own fixtures break criterion 9.** 1,034 FEN literals in `src/` and `spike/` parse today
   (732 distinct). The page's six rules reject **144 distinct (186 occurrences) in 15 files**
   (`fen-corpus.out.txt`). **175 of the 186 sit in six rules-core test files whose purpose is the impossible
   board:** `moves.castling.hardening`, `moves.castling`, `moves.enpassant.hardening`, `moves.enpassant`
   (the `ABC-009` and `ABC-022` defences), and `legal` and `zobrist` (`ADR-0005`'s off-domain en-passant
   shapes). They prove that the generator, the oracle and the hash survive a board that `parseFen` will
   refuse. That defence in depth must stay tested. The other 11 occurrences are incidental: 9 in 8 test
   files, plus 2 rows of `src/puzzle-corpus.ts`.

## Decision

1. **The in-check rule calls `moves.ts` `isSquareAttackedBy`.** It never calls `legal.ts` `isInCheck`. The
   king squares come from the scan `assertBothKingsPresent` already makes; it returns them, so there is no
   second scan. `fen.ts` moves from level 2 to level 3, and it gains no edge to `legal.ts`. This is not a
   second definition of check. `legal.ts` itself composes `isSquareAttackedBy(position, kingSquare, …)` at
   three sites (`legalMoves`, `hasLegalEnPassant`, `isInCheck`). `parseFen` is a fourth caller of the same
   primitive.
2. **Two entries, one grammar.** `fen.ts` has one private grammar function and two exports:
   - `parseFen(fen: string): Position` is the boundary: grammar, then semantics. Every production consumer
     and every future input path uses it.
   - `parseFenGrammarOnly(fen: string): Position` is grammar only. It exists for tests that need a board the
     rules core must survive but no game reaches. **No production module names it.** One test in
     `src/fen.test.ts` reads every `src/*.ts` except `*.test.ts` and `fen.ts`, and expects no file to
     contain the identifier. That adds no new test file (`N8-LANE`).
   - There is no options bag and no flag on `parseFen`.
3. **Order and meaning of the rules.** The first fault found is the one thrown, so a FEN with several faults
   always gets the same message.
   - (a) **Non-string input** throws `FenError` before anything else is read (a `typeof` test).
   - (b) **Grammar** runs in field order, as today. Each clock field must also satisfy
     `String(Number(field)) === field`. That rejects `Infinity`, `1e+21` and leading zeros (`"00"`), and no
     fixture in the repo uses a leading zero.
   - (c) **Board semantics** run in this order:
     - pawns on rank 1, then rank 8;
     - castling rights in `K`, `Q`, `k`, `q` order, each checking the king's home square and then the rook's.
       Both are identity tests on the side's own `KING` and `ROOK` bytes, the test `moves.ts` has used since
       `ABC-009`;
     - en passant: the square is on the side to move's rank, it is empty, the side not to move's pawn stands
       in front of it, and the origin square behind it is empty. **No capturer is required.** `ADR-0005`
       rejected normalising `epSquare`, and `makeMove` records the square after every double push;
     - the side not to move is in check. This runs last because it is the costliest test.
   - (d) Each message names the rule, which right, square or field, and why. Example: `castling right "K" is
     inconsistent with the board: no white rook on h1`. There is one `FenError` class, with no codes and no
     subclasses.
   - (e) The four king and rook home squares go in a private table in `fen.ts`, as 0x88 literals. That makes
     a third copy of these squares, after `moves.ts` `WHITE_CASTLES`/`BLACK_CASTLES` and `apply.ts`
     `CASTLE_LOSS`. **That is accepted.** They are fixed rule constants, Chess960 is a permanent non-goal,
     and sharing the squares would pull `moves.ts` and `apply.ts` into the fence.
4. **How each rejected fixture is handled.**
   - **The six off-domain files** switch their `fen.ts` import to `parseFenGrammarOnly` (aliasing it is
     allowed). That is one line per file, and all six were measured green.
   - **Every other rejected fixture** is re-authored to a legal position that keeps its test's point. A test
     that pins a printed FEN as defective (`coordinate-move` `A2`, `san.parse` `A4`) instead asserts that
     `parseFen` rejects it. Neither kind may switch to grammar only: they run through production consumers
     (`newGame`, the panel's replay), or they should exercise the boundary.
   - **The two `puzzle-corpus.ts` rows** are corpus defects. One has a black pawn on h8; in the other, white
     is to move while black is in check. They are re-authored under `ABC-084`'s provenance rule. This ADR
     routes that work and does not decide it.
5. **The NFR bars hold for variant B.** All runs were on an Apple M3 with Node v26.11.0.
   - **`NFR-002`:** validated `parseFen` read **2.97 µs** mean against **2.50 µs** for the base parser, in one
     process at load1 9.45. That is +466 ns, under the 10 µs bar with 3.4x headroom.
   - **`NFR-001`:** `npm run perft` read 4.96 M nodes/sec against 5.04 M for the base, back to back at
     load1 about 8.
   - **Deep perft** (`PERFT_DEEP=1`) was 32/32.

## Alternatives

- **A. `fen.ts → legal.ts`, `isInCheck` with a side flip** (the page's candidate). **Rejected** because it
  turns `ABC-016` `A13` red (measured). Fixing that means re-deriving a count in a test built so that it
  names no other module's number. It also writes `blackToMove` twice on the position under construction, and
  pulls `apply.ts` and `legal.ts` into `fen.ts`'s closure for one call.
- **C. A side-parameterised export in `legal.ts` (`isKingAttacked(position, black)`), with `isInCheck`
  delegating to it.** This keeps one composition and avoids the spy. **Rejected:** it changes `legal.ts`, on
  search's `isInCheck` path, to save one two-argument call. The primitive already exists in `moves.ts`.
- **D. `assertPlayable(position)` as a separate call each caller makes.** **Rejected:** the page's scope says
  `parseFen` rejects. Six consumers, plus the first FEN-input ticket, would each have to remember the call,
  and one forgotten call is the silent hole this ticket closes.
- **E. `parseFen(fen, { validate: false })`.** **Rejected:** it puts a bypass on the boundary function
  itself. Every production caller could use it, and no import-level guard can see it.
- **F. Build impossible boards by parsing a legal FEN and then writing `board`/`castling`/`epSquare`.**
  **Rejected:** it rewrites about 175 table rows as imperative setup. The FEN-as-fixture tables are what make
  the hardening suites readable.
- **G. Normalise instead of reject** (clear the square, drop the right). **Rejected:** `ADR-0005` already
  rejected normalising `epSquare` because it breaks the round trip, and the page asks for a rejection that
  teaches.
- **H. A new `fen-semantics.ts` module.** **Rejected as gold plating:** it is about 50 lines, and `parseFen`
  must import it anyway.

## Consequences

- **The graph.** It gains one runtime edge, `fen.ts → moves.ts`. `fen.ts` moves from level 2 to level 3,
  there is no cycle, and no importer's closure changes. When the build lands, two edits to
  `memory-bank/30-architecture.md` fall due on the `fen.ts` row: level 3, "grammar and semantics", and
  `parseFenGrammarOnly`.
- **`ABC-010` criterion 9 cannot hold as worded.** BA/PM owns the re-wording; the ticket's `## Design`
  section proposes text. The fence grows from 2 files to 16:
  - `fen.ts` and `fen.test.ts`;
  - the 6 import swaps;
  - 8 test files to re-author: `coordinate-move`, `evaluate.pawns`, `fen`, `move-input`, `moves`,
    `quiescence`, `san.parse` and `status-panel.nfr`. `fen.test.ts` is in both lists;
  - `src/puzzle-corpus.ts` (2 rows).

  The ticket now shares files with other tickets. `puzzle-corpus.ts` is touched by `ABC-127` (in flight) and
  `ABC-126`, and `quiescence.test.ts` by `ABC-083` `A10`. BA/PM's "shares no file with any other ticket"
  stopped being true at this hop.
- **The rules core keeps every defence it has today.** The `ABC-009`/`ABC-022` guards in `moves.ts`,
  `legal.ts` and `zobrist.ts` stay, and they stay tested through `parseFenGrammarOnly`. Boards from
  `makeMove` and grammar-only boards still reach them.
- **A future FEN input gets validation for free.** That means the `P1` trigger, or a book format that parses
  FEN at run time, as long as it calls `parseFen`.
- **What this ADR does not decide:** the re-authored puzzle rows, and `ABC-010`'s size, priority and DoR.

## Rollback

**Before the build:** delete this file. **After it:** switching to variant A or C is a one-file change in
`fen.ts`. Variant A also needs `A13`'s count re-derived. Removing `parseFenGrammarOnly` is the expensive
direction, because the six files would then have to build their boards some other way, and that cost is why
the entry exists.
