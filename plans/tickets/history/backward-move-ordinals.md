# Backward-move ordinal register (ABC-039)

The series of claims "the Nth backward move in this project's history" was closed on 2026-08-11. This file
resolves every one of those claims against a chronology derived from source. Archived files are not edited.
Lines drift, so re-resolve each cite by its quoted text. Measured on branch `grugops/ABC-039-ordinal-register`.

## Three defects, each separate

- **(a) The move labelled FIRST is not first.** `ABC-011` moved back on 2026-08-03 (chronology #1). `ABC-009`'s
  move on 2026-08-09 is the second. `ABC-025`'s label shows the wrong basis: *"(the first was `ABC-009`, 2026-08-09)"*.
- **(b) Two different moves are both labelled SECOND.** These are `ABC-025` (2026-08-10) and `ABC-016` (2026-08-11).
  The 08-11 author counted `ABC-009`, `ABC-016`, `ABC-019` and left out `ABC-025`'s move.
- **A uniform +1 does not repair the series.** Adding one to FIRST, SECOND, SECOND, THIRD gives `2, 3, 3, 4`, and
  the collision is still there. The correct ordinals are `2, 3, 4, 5`.
- **(c) `plans/metrics.md:28` (Rework rate) reads 13 backward moves; the source has 15.** The gap is exactly
  `ABC-017` (1 there, 2 here) and `ABC-019` (2 there, 3 here). Every other per-ticket count matches (`ABC-009` 1,
  `ABC-011` 1, `ABC-016` 2, `ABC-025` 1, `ABC-027` 1, `ABC-028` 3, `ABC-029` 1). `ABC-156` owns the repair; this
  ticket writes nothing there.

## Statements (nine; each label quoted verbatim on one line)

| # | file:line | label, verbatim | move it labels | chronology # | labelled | corrected |
|---|---|---|---|---|---|---|
| 1 | `plans/board.md:1001` (LIVE, corrected by A1) | *"FIRST BACKWARD BOARD MOVE IN THIS PROJECT'S HISTORY"* | `ABC-009` Ready for UAT → In Review, 2026-08-09 | 2 | 1 | **2** |
| 2 | `ABC-009-board-history.md:814-815` (wrapped) | *"FIRST BACKWARD MOVE IN THIS PROJECT'S HISTORY"* | same move | 2 | 1 | **2** |
| 3 | `ABC-009-board-history.md:17` | *"the return trip from the first backward move in this project's history"* | same move (return trip) | 2 | 1 | **2** |
| 4 | `ABC-009-board-history.md:451` | *"THIS COLUMN WAS RE-ENTERED BY A BACKWARD MOVE (the first in this project's history)"* | same move | 2 | 1 | **2** |
| 5 | `ABC-009-board-history.md:786` | *"before the first backward move in this project's history"* | same move | 2 | 1 | **2** |
| 6 | `ABC-025-board-history.md:37` | *"the SECOND backward move in this project's history"* | `ABC-025` Ready for UAT → In Development, 2026-08-10 | 3 | 2 | **3** |
| 7 | `ABC-019-board-history.md:24` | *"the SECOND backward move in this project's history"* | `ABC-016` In Review → In Development, 2026-08-11 | 4 | 2 | **4** |
| 8 | `ABC-016-board-history.md:52` | *"the THIRD backward move in this project's history"* | `ABC-019` In Review → In Development, 2026-08-11 | 5 | 3 | **5** |
| 9 | `plans/traceability.md:438` (`ABC-009` Status cell; a trace record, not edited) | *"first backward board move in this project's history"* | `ABC-009` Ready for UAT → In Review, 2026-08-09 | 2 | 1 | **2** |

History files are under `plans/tickets/history/`. Statements #2 to #9 stay as they are. They are honest records
with a counting error.

## Chronology (every backward column move by a commit at or before `3215004c`, git commit order)

A backward move is a ticket whose `plans/board.md` row moves to an earlier column. One exclusion: `47b5b935`
(`ABC-013` Done → Ready for UAT) corrects a false merge record and is not a move. Every commit below passes
`git merge-base --is-ancestor <commit> 3215004c`. Record dates and git dates differ by about a day on 08-11/08-12.

| # | ticket | record date | from → to | file:line | commit |
|---|---|---|---|---|---|
| 1 | ABC-011 | 2026-08-03 | Ready for UAT → In Design (board shows Ready for Dev; design ruled in the same commit) | `ABC-011-board-history.md:1338` | `b44b679c` |
| 2 | ABC-009 | 2026-08-09 | Ready for UAT → In Review | `ABC-009-board-history.md:814` | `c71c9ba9` |
| 3 | ABC-025 | 2026-08-10 | Ready for UAT → In Development | `ABC-025-board-history.md:37` | `22549f6f` |
| 4 | ABC-016 | 2026-08-11 | In Review → In Development | `ABC-019-board-history.md:24` | `0b6e1fd7` |
| 5 | ABC-019 | 2026-08-11 | In Review → In Development | `ABC-016-board-history.md:52` | `9e7d9ab7` |
| 6 | ABC-016 | 2026-08-11 | In Review → In Development | `ABC-016-board-history.md:76` | `3fa06f8e` |
| 7 | ABC-019 | 2026-08-11 | In Review → In Development | `ABC-016-board-history.md:82` | `8cc4d8c3` |
| 8 | ABC-027 | 2026-08-12 | In Security/NFR → In Development | `ABC-017-board-history.md:18` | `9fb55db3` |
| 9 | ABC-017 | 2026-08-12 | In Review → In Development | `plans/board.md:992` (task `abc017-d23-2026-08-12`) | `5d387e60` |
| 10 | ABC-017 | 2026-08-12 | In Security/NFR → In Development | `ABC-017-board-history.md:24` | `e22ed720` |
| 11 | ABC-019 | 2026-08-11 | In Review → In Development | `ABC-019-board-history.md:63` | `c6ea796d` |
| 12 | ABC-028 | 2026-08-12 | In Review → In Development | `ABC-028-board-history.md:35` | `e9027480` |
| 13 | ABC-029 | 2026-08-12 | In Review → In Design | `ABC-028-board-history.md:41` | `1adbb8c4` |
| 14 | ABC-028 | 2026-08-12 | In Review → In Development | `plans/board.md:989` (task `quality-gate-ABC-028-final`) | `1e70dc2f` |
| 15 | ABC-028 | 2026-08-13 | In Review → In Development | `ABC-019-board-history.md:99` | `ca6c4243` |
