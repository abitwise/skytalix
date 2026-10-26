---
id: 20261026T011145Z-architect-design-decision-7bb8daf1
kind: decision
by: architect-design
at: 2026-10-26T01:11:45Z
verified_by: 
confidence: high on the not-inside-ADR-0023 ruling (measured); the option pick is the owner's; O1's quality as a repertoire UNKNOWN - verify
refs:
  - ABC-211
  - EPIC-008
  - ADR-0023
  - ADR-0037
  - ADR-0048
  - ADR-0012
  - ABC-092
  - ABC-093
  - NFR-006
  - NFR-007
  - QE-207-f
  - A1
  - A3
  - R1
  - R4
  - R6
  - plans/tickets/ABC-211-the-opening-book-goes-deeper-in-the-english-lines.md
  - memory-bank/50-decisions/ADR-0023-opening-book-source-is-lichess-chess-openings-under-cc0.md
  - bapm-cut-engine-strength/20261023T203657Z-ba-pm-observation-81e021ac
  - bapm-cut-engine-strength/20261023T203717Z-ba-pm-decision-8c3b2f47
  - bapm-s1-ABC-207/20261026T005931Z-ba-pm-decision-f249ca34
  - qe-ABC-207/20261026T005119Z-qe-e2e-decision-cc744e8c
  - qe-ABC-207/20261026T005119Z-qe-e2e-observation-dc779c4a
  - grugops/arch-source-ABC-211
  - 1df54ba6
  - a6189a30
  - a804a97e
supersedes: 
seal: sha256:a55709cb0322eae0378a059ff8ad2274b59df855a4a8687a9cd89117121c1203
---

# Architect/Design: ABC-211's source ruling. NOT possible inside ADR-0023. A PROPOSED ADR-0023 amendment (O0–O3) goes to the owner, recommending O0 (no new source; the ticket closes). Ready trigger NOT MET

Task `arch-source-ABC-211`, records only, branch `grugops/arch-source-ABC-211` from `main` `1df54ba6`. No npm, vitest or
timing. No `src/` or `data/` edit. 0 third-party bytes in the repo. The measurements are in this task's observation note.

## The ruling
- **Inside `ADR-0023`: no.** 0 of the pinned source's 3,865 rows reach the game-1 position (after 1.c4 c5 2.Nc3 Nf6
  3.Nf3 b6) at any ply, with transpositions included and no 12-ply cut. The documented re-pin rule adds nothing, because
  the upstream `master` is the pin `a6189a30`. So `A1` cannot be met from this source by any compile.
- **So the change is the owner's.** It is written as a **PROPOSED** section at the end of `ADR-0023`
  (§ "Proposed amendment 2026-10-26 (`ABC-211`)"), with a one-line pointer in its § Status. Decisions 1–5 are
  unchanged. Default without an answer: nothing changes.

## The options (licences read 2026-10-26 on the licensors' pages)
- **O0, recommended: no new source, and BA/PM closes `ABC-211` undelivered** (veto open). Why:
  1. The motivating move is gone. `QE-207-f`: base plays 4.d3 (depth 8, +56) here since `ABC-215`, not 4.Qa4 (−72 cp).
  2. `P3`, the lowest gain of the eight.
  3. Every source option also needs an `ADR-0037` D1 provenance change and a scope change on the page.
- **O1: `official-stockfish/books` `8moves_v3.pgn` at `a804a97e`, CC0-1.0, 1.c4 lines only, graft weights.**
  - Measured: `A1` met (4 White moves); 715,259 B (68.2 % of `NFR-006`); `NFR-007`'s 2x re-read fires (2.006x).
  - Needs: `ADR-0037` D1 (`source` becomes a list of two, `format` stays 1, because `src/book.ts:96` refuses any other
    `format`); a PGN reader in `compile.ts` (size S → M); a second sha256 pin; a second `ATTRIBUTION.md` section;
    `A3`'s wording.
  - The graft rule: an existing edge keeps its line count, and a new edge gets weight 1. Without it, 1.c4 goes from
    5.2 % to 54.5 % of the root weight. The owner may veto the rule.
- **O2: our own engine's offline lines.** Apache-2.0 and no third-party bytes, but it adds nothing at this position.
  It would be its own ADR (`ADR-0023` `R6`). Not recommended.
- **O3: Stockfish 19's offline lines.** GPL-3.0 program. FSF FAQ: *"The output of a program is not, in general,
  covered by the copyright on the code of the program."* The legal reading is `UNKNOWN - verify` and the owner's. A
  rebuild rests on a host binary. Its own ADR. Not recommended.
- **Re-read and not proposed:** the Lichess database (CC0; `R1`'s fitness rejection stands);
  `bjbraams_chessdb_198350_lines.pgn` (provenance: upstream terms not stated); EPD sets (a position, no move).

## Ready trigger and board
- **`ABC-211`'s trigger ("the source ruling lands"): NOT MET.** The Architect's half has landed. The source pick is the
  owner's.
  - O0: BA/PM closes the ticket.
  - O1: Architect/Design writes the `ADR-0037` D1 amendment, and BA/PM re-scores the DoR (`A3`, size M, `NFR-007`).
    Then Ready.
  - O2 or O3: a new ADR first.
- **Board:** `ABC-211` stays in Backlog (held). No column moves. The card line is in the brief's Result, for the
  Orchestrator.
- **Page:** `ABC-211` gains a dated § Source ruling (+13 lines). `plans/nfr-catalog.md` is untouched, since no bound
  moves at PROPOSED.

## Owed, not this role's
- **Orchestrator:** report the PROPOSED amendment to the owner, with its options; the board card; the trace row.
- **BA/PM:** the close on O0, or the DoR re-score on O1.
