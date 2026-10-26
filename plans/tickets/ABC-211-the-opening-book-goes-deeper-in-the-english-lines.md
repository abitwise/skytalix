---
id: ABC-211
title: "The opening book goes deeper in the English lines (1.c4), from a source the Architect rules, within NFR-006 and the ADR-0037 format"
status: backlog
column: Backlog
size: S
priority: P3
epic: EPIC-008
feature: —
adr: "ADR-0023 (source and licence) if a new source is needed: not named in the brief; a new source is a new or changed ADR, routed to the owner"
---

# ABC-211: a deeper English book

> **Cut 2026-10-23 by BA/PM** (task `bapm-cut-engine-strength`, records only, at `main` `55a8f4ef`). Proposal 8 of
> `…f1771bb3`; owner word `…7feb0553`.
>
> **ADR touch point found at this cut. It is not in the brief, and the analysis did not name it.**
> - The book is compiled from `lichess-org/chess-openings` at `a6189a30` (CC0, `ADR-0023`; `tools/opening-book/compile.ts`).
>   That source is a list of **named** openings. Its lines end where a name is defined, and `book.json` reads
>   `maxPly 12`.
> - **Probed at this cut** (scratch, `src/` read-only). This walks game 1 through `book.json` by Zobrist key:
>   - after 1.c4, 1...c5, 2.Nc3, 2...Nf6 and 3.Nf3, every position is in the book;
>   - after 3.Nf3 the book offers Black only `b8c6`, `d7d5` and `e7e5`;
>   - **3...b6 is not in the source at all**, and the position after it has no entry.
>
>   So Black, not White, left the book first, and **no compile of the current source reaches game 1's position at any
>   depth**. Closing that gap needs lines the current source does not hold.
> - Any new source of lines, whether another database or engine-generated continuations, is a source-and-licence
>   decision under `ADR-0023`. `ABC-092` rule: the licence is "decided before a byte is copied". A new or changed ADR
>   goes to the owner when written.

## Problem

- **User:** the owner, who opens with or meets the English.
- **Pain:** out of book at move 4. The first own-search move, 4.Qa4?!, lost 72 cp.
- **Value:** low (72 cp in one game). It is data only, and it ships if D is not a LOSS.

## Scope

1. **Architect/Design first (records only).** Name one or more candidate sources that hold English lines beyond the
   named openings, game 1's 3...b6 among them, each with its licence. Or rule this ticket closed.
2. If a source is ruled: compile it into `data/opening-book/book.json` in the `ADR-0037` format, unchanged. Update
   `ATTRIBUTION.md`, `SOURCE_COMMIT` and `SOURCE_SHA256` if the source changes.

## Out of scope

- A new book format, a book for lines other than 1.c4 (unless the source comes that way and stays within `NFR-006`),
  and book learning.

## Acceptance criteria

- **`A1` (the gap is closed).** **Given** the position after 1.c4 c5 2.Nc3 Nf6 3.Nf3 b6 (game 1), **then** the book
  holds **≥ 1** move for White there.
  - **Reported:** the count of book positions reached from 1.c4 at each ply, base against branch.
- **`A2` (`NFR-006`).** `book.json` is **≤ 1 048 576 B**. It is 356 526 B today; the new size is reported.
- **`A3` (format and provenance).** The `ADR-0037` D1 format is unchanged. `tools/opening-book/book.test.ts` is green,
  including `A5` (`NFR-006`) and the source sha256 pins. `compile.ts` rebuilds the file byte for byte (`ABC-093` `A1`).
- **`A4` (existing gates).** `G5`, `G8`, `G9`. The book-probe and the UCI `OwnBook` rows stay green.
- **`A5` (the reading).** **Given** `ABC-204` is Done, **then** D on this branch is **not LOSS** (ship rule **S2**).
  - The D reading's openings start inside the book's own CC0 source (`ABC-204` scope 2), so a 1.c4 start shows up only
    if one is drawn. **Reported:** how many of the 100 openings begin with 1.c4.

## NFR triggers

- **`NFR-006`:** ≤ 1 MB, re-read.
- **`NFR-007`** (the first board in < 2 s): the book is read once per process. If the file grows by more than 2x, the
  first-board time is re-read.
- Bounds moved: none planned.
- **Security:** data only, no limb.

## Test notes

1. The source TSVs or other inputs stay outside the repo, as today (`compile.ts` header).
2. UAT: data changes the engine's play, so the QE verdict signs it.

## Dependencies

- **An Architect/Design source ruling.** If it needs a new source, the new or changed ADR is reported to the owner. A
  licence call for a private engine (`ADR-0007`) is his.
- `ABC-204` Done.
- **Ready trigger:** the source ruling lands.

## Size and priority

- **`S`:** a compile, a size check, one reading. More only if the source needs new parsing.
- **`P3`:** the lowest gain of the eight.

## Definition of Ready

BA/PM, 2026-10-23, at `main` `55a8f4ef`. **Result: 9 of 10. `Backlog`** until the source ruling.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | ✅ out of book at move 4; 72 cp |
| 2 | scope and out-of-scope clear | ✅ the source ruling first, then the compile; format and learning fenced |
| 3 | INVEST-shaped | ✅ independent of the engine tickets (data only); `S`; testable |
| 4 | acceptance testable and measurable | ✅ ≥ 1 book move at the game-1 position; ≤ 1 048 576 B; byte-for-byte rebuild; not LOSS |
| 5 | dependencies known | ✅ the source ruling; `ABC-204` |
| 6 | security/NFR triggers with a measurable target | ✅ `NFR-006` ≤ 1 MB; `NFR-007` re-read past 2x growth |
| 7 | test notes present | ✅ two |
| 8 | size assigned | ✅ `S` |
| 9 | priority assigned | ✅ `P3` |
| 10 | no major unresolved blocker | ⏳ **the source:** the current CC0 source does not hold 3...b6 (probed). A new source is an `ADR-0023` decision |

## Source ruling (Architect/Design, 2026-10-26, task `arch-source-ABC-211`, at `main` `1df54ba6`)

- **Not possible inside `ADR-0023`.** 0 of the pinned source's 3,865 rows reach the position after 3...b6 at any ply,
  with transpositions included and no 12-ply cut. The upstream `master` is the pin, so a re-pin adds nothing.
- **A PROPOSED `ADR-0023` amendment goes to the owner**, with options O0–O3 (`ADR-0023` § Proposed amendment
  2026-10-26):
  - **O0:** no new source, and this ticket closes. Recommended: `QE-207-f` found that base already plays 4.d3 here.
  - **O1:** `official-stockfish/books` `8moves_v3.pgn`, CC0, 1.c4 lines only, with graft weights. `A1` is met at
    715,259 B. O1 needs an `ADR-0037` D1 provenance change and a scope change here (`A3`'s wording, size S → M), and
    `NFR-007`'s re-read fires.
  - **O2 and O3:** lines our own engine or Stockfish generates. Not recommended.
- **Ready trigger: NOT MET.** It waits on the owner's pick. Notes: `.grugops/context/arch-source-ABC-211/`.
