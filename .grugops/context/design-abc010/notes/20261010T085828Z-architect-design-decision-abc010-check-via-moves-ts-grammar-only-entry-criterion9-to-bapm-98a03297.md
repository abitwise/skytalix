---
id: 20261010T085828Z-architect-design-decision-abc010-check-via-moves-ts-grammar-only-entry-criterion9-to-bapm-98a03297
kind: decision
by: architect-design
at: 2026-10-10T08:58:28Z
verified_by:
confidence: high
refs:
  - ABC-010
  - ADR-0033
  - ADR-0005
  - ADR-0006
  - ADR-0011
  - ADR-0030
  - ABC-016
  - ABC-009
  - ABC-022
  - ABC-083
  - ABC-084
  - ABC-126
  - ABC-127
  - NFR-002
  - NFR-001
  - N8-LANE
  - memory-bank/50-decisions/ADR-0033-parsefen-checks-the-side-not-to-move-through-moves-ts-and-off-domain-fixtures-parse-grammar-only.md
  - plans/tickets/ABC-010-fen-semantic-validation.md
  - 20261010T085828Z-architect-design-observation-abc010-fen-corpus-spy-cost-measured-on-prototype-aa14ac4d
  - .grugops/context/rescore-batch-2026-10-10/notes/20261010T081343Z-ba-pm-decision-six-ticket-rescore-three-ready-four-rulings-owed-973fd389.md
supersedes:
---

# `ABC-010` design: the check goes through `moves.ts`, and a grammar-only entry is added. Criterion 9 goes back to BA/PM. **Not `Ready for Dev`**

This note is hand-authored. `ADR-0033` (**proposed, owner acceptance owed**) is the authority. The evidence
is `…aa14ac4d`. This note is the summary, the build hop's file list, and the routing.

## The design

1. **`fen.ts → moves.ts` (`isSquareAttackedBy`), not `fen.ts → legal.ts`.** Routing the check through
   `isInCheck` turns `ABC-016` `A13` red ("expected 2 to be 1", measured). The king squares come from the
   existing `assertBothKingsPresent` scan.
2. **`parseFen` (boundary: grammar, then semantics) and `parseFenGrammarOnly` (test-only).** They share one
   private grammar function and take no flag. A guard test in `src/fen.test.ts` fails if any non-test
   `src/*.ts` other than `fen.ts` names `parseFenGrammarOnly`.
3. **Rule order** (first fault thrown):
   1. non-string;
   2. grammar, plus clock byte identity;
   3. back-rank pawns;
   4. castling `KQkq`, king home then rook home;
   5. en passant: rank, empty, pushed pawn, empty origin. No capturer is required;
   6. side not to move in check.

   `ADR-0033` decision 3 has the details.

## Build-hop file list (16 files), measured on the prototype

- **Production:** `src/fen.ts`.
- **Tests:**
  - `src/fen.test.ts`: the new table tests, the guard, and line 29 re-authored to the after-`1.e4` FEN.
- **Import swaps** to `parseFenGrammarOnly`, one line each: `src/moves.castling.hardening.test.ts`,
  `src/moves.castling.test.ts`, `src/moves.enpassant.hardening.test.ts`, `src/moves.enpassant.test.ts`,
  `src/legal.test.ts`, `src/zobrist.test.ts`.
- **Re-author to a legal position that keeps the test's point**, or assert the rejection where the test
  pins a printed FEN as defective: `src/coordinate-move.test.ts`, `src/san.parse.test.ts`,
  `src/move-input.test.ts`, `src/moves.test.ts`, `src/quiescence.test.ts`,
  `src/evaluate.pawns.test.ts`, `src/status-panel.nfr.test.ts`.
- **Corpus data:** `src/puzzle-corpus.ts`, 2 rows ("pin: Re1 pins the queen to the king" and
  "discovered check: the bishop moves, Rxd8").
- **Owed when the code lands:** the `memory-bank/30-architecture.md` `fen.ts` row (level 3, grammar and
  semantics, `parseFenGrammarOnly`).

## Routing: `In Design` → back to BA/PM, **not** `Ready for Dev`

**R1, BA/PM: criterion 9 cannot hold as worded.** The rules reject 144 of the repo's 732 distinct parsing
FENs. Proposed replacement, BA/PM to adopt or re-word:

> **Given** every FEN fixture in the repo, **when** the suite runs after the change, **then**:
> - the six perft positions and every `ABC-001` case parse through `parseFen`;
> - the fixtures of the six named rules-core files parse through `parseFenGrammarOnly`;
> - every other fixture parses through `parseFen`, and each named incidental fixture has been re-authored
>   to a legal position that keeps its test's point, or now asserts its rejection;
> - no production module names `parseFenGrammarOnly`;
> - the suite is green with a skip count of 0.

**R2, BA/PM and the Orchestrator: sequencing and file overlap.** The fence grows from 2 files to 16. The
earlier claim that `ABC-010` shares no file with any other ticket in the batch no longer holds:

- `src/puzzle-corpus.ts` is also touched by `ABC-127`, which is in flight now and keeps the 40 existing rows
  byte-identical, and by `ABC-126`.
- `src/quiescence.test.ts` is also touched by `ABC-083` `A10`.

**R3, BA/PM: the two puzzle rows are corpus defects that exist independently of `ABC-010`.** Re-authoring
them needs `ABC-084`'s oracle-proven answers, and the baseline may move. Recommendation: cut them into
`ABC-126` or a separate `XS` corpus repair that lands before `ABC-010`. `ABC-010` would then name it as a
hard predecessor. This note does not decide that.

**Size and priority stay BA/PM's.** On this measurement the production change is about 60 lines in one
file, and the test churn is mechanical. The architect's reading is that `M` probably holds once the corpus
rows are split out. That reading is not a re-score.

**`NFR-002` / `NFR-001` / `N8-LANE`.**

- **`NFR-002`:** met on the prototype at 2.97 µs mean against the 10 µs bar.
- **`NFR-001`:** met, with perft at 4.96 M nodes/sec and deep perft 32/32.
- **`N8-LANE`:** 0 new test files are needed.
- **`plans/nfr-catalog.md`:** not opened. No target moves.
