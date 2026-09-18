---
id: 20260919T112000Z-architect-design-claim-recommend-lichess-chess-openings-under-cc0-and-the-one-sentence-that-ratifies-it-8b41d7f3
kind: claim
by: architect-design
at: 2026-09-19T11:20:00Z
verified_by:
confidence: high
refs:
  - ABC-092
  - ABC-093
  - ABC-094
  - ABC-096
  - EPIC-005
  - RISK-004
  - NFR-006
  - ADR-0023
  - memory-bank/50-decisions/ADR-0023-opening-book-source-is-lichess-chess-openings-under-cc0.md
supersedes:
---

# RECOMMENDATION: `lichess-org/chess-openings` UNDER CC0 1.0 — A CLAIM, NOT A DECISION, UNTIL THE OWNER SPEAKS

**This is a `claim` on purpose.** The owner's word on 2026-09-19 was *"i don't have preferred source,
we can research that"* — authorisation to research. `ABC-092` § Dependencies: the choice *"is the
owner's"*; `ADR-0012` § Status: the book's source and licence is *"a legal and product choice, which
is the owner's"*. `context.human_admission` is `off`, so no stamp can carry his acceptance — it is
carried as his sentence in session, transcribed by the Orchestrator into a `decision` note, as the
2026-08-16 signature ruling set the pattern.

## The recommendation

**Source: `lichess-org/chess-openings`. Licence: `CC0-1.0`. Attribution: none required; provenance
file kept at `data/opening-book/ATTRIBUTION.md`, written on ratification.** Drafted as
`memory-bank/50-decisions/ADR-0023-opening-book-source-is-lichess-chess-openings-under-cc0.md`,
`status: proposed`, with the ratification line blank.

**Confidence: high** on the licence reading (CC0 § 2 is unconditional and quoted verbatim in the
ADR; the licensor's README sentence is quoted verbatim; both read 2026-09-19 on the licensor's
pages). **Medium** on the fitness reading — that its named-line tree, with compiler-assigned uniform
weights and ≤ 12-ply truncation, yields a book that satisfies `ABC-093` `A3`/`A4` and `EPIC-005`'s
"≥ 3 distinct replies to `e4` over ten games" — because nothing was compiled at this hop (`A6`
forbids it) and the row count (3,704) comes from the licensor's Parquet mirror card, not from
counting the TSVs.

## Why this one and not the other six — in one line each (the full table is the sibling `observation`)

- C2 Lichess database: CC0 too, but 2.57 TB of games whose names come from C1 anyway.
- C3 Stockfish books: CC0 too, but no names (`ABC-096` unbuildable) and engine-test sets ≫ 1 MB.
- C4 Perfect 2023 `.bin`: licence forbids modification and commercial redistribution; no names.
- C5 pgn-extract `eco.pgn`: the file's own terms are not published anywhere; GPL if anything.
- C6 Wikipedia: CC BY-SA — ShareAlike onto a repository that has no licence of its own.
- C7 hand-authored: no third-party Work, but no attributable source either — the honest fallback
  if the owner rejects every external candidate; would be its own ADR.

## The ONE sentence the owner must say to ratify

> **"I ratify ADR-0023: the opening-book source is `lichess-org/chess-openings` under CC0 1.0."**

On that sentence, and not before: Status → `accepted` with his name and date; `RISK-004` →
resolved, dated, pointing at `ADR-0023` (`A5`); `data/opening-book/ATTRIBUTION.md` written (`A4`);
`ABC-093`'s hard blocker lifts. **If he names a different source, this claim is superseded and the
ADR is superseded by the next number — the research stands as the record of what was considered.**

## What would flip this recommendation

- The `chess-openings` README or `COPYING.txt` changing to anything other than CC0 at the commit
  `ABC-093` pins — checked at pin time, recorded in the attribution file.
- The owner deciding this repository should carry a licence that CC0 data somehow conflicts with —
  there is none; CC0 is compatible with every outbound licence.
- `ABC-093` finding the compiled tree cannot produce ≥ 8-ply lines from the start position — the
  table's mainlines run well past 8 plies in every ECO volume, so this is not expected; if it
  happens, it is a compiler question, not a source question.
