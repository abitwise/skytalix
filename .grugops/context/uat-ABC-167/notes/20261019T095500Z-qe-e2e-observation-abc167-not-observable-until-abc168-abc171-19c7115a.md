---
id: 20261019T095500Z-qe-e2e-observation-abc167-not-observable-until-abc168-abc171-19c7115a
kind: observation
by: qe-e2e
task: uat-ABC-167
at: 2026-10-19T09:55:00Z
verified_by:
confidence: high
refs:
  - ABC-167
  - ABC-168
  - ABC-171
  - ADR-0044
  - NFR-005
  - NFR-008
  - R-167-2
  - 20261019T095300Z-qe-e2e-artifact-ref-abc167-uat-pack-af06cf1f
supersedes:
---

# What `ABC-167`'s UAT cannot observe, and which ticket can

This note is hand-authored and unsealed. Nothing below was graded, and no scenario was invented for it.

## Until `ABC-168` (the `skytalix` binary, `src/uci.ts`, stdin/stdout)

| not observable here | why | where it becomes observable |
|---|---|---|
| A **real GUI** talking to the engine: cutechess-cli, En Croissant, Lichess's provider | there is no process to start; the harness stands in for the GUI | `ABC-168`, once `skytalix` runs |
| **Real stdin/stdout**: `node:readline` line splitting, the stdout `EPIPE` arm, exit codes `0` / `1` / `70` | `src/uci.ts` does not exist yet (D2) | `ABC-168` |
| **Real time**: whether a GUI flags the engine on a real clock, and how late `isready` / `stop` are answered during a search (D5: up to one budget, about 3 s at level 3) | the session reads only the injected clock; this UAT took **no timing reading** by its brief | `ABC-168`, on `Date.now` |
| **NFR-008 N8-LANE** (the lane delta of the new test file) | OWED: no admissible quiet window (`…a4316655`); the owner accepted R-167-2 (`…5d7c2e18`) | the next admissible lane reading |
| **NFR-005** (depth reached in real time) | not this ticket's; a virtual depth says nothing about real seconds (`virtual-clock.ts`) | not owed by `ABC-167` |

What *is* observed here on the transport side: the session trims each line, so a CRLF-terminated `isready\r` and
`go movetime 100\r` answer normally (S1, S8). Whether `uci.ts` strips the CR first is `ABC-168`'s concern.

## Until `ABC-171` (options, book, levels)

- `uci` writing `option name OwnBook …` and `option name Skill Level …` (D3). Today it writes exactly three lines
  (S1, `OBS`).
- `setoption name OwnBook` / `Skill Level`, its case-insensitive names, and its one `info string` on a bad value.
  Today every `setoption` is ignored (S8).
- Book moves and `info string book` (D10), and `isready` warming the book.
- Levels 1, 2, 4 and 5, and the `createLevel` output line with no score (D11). Today the strength is fixed at level
  3, so `depth` / `nodes` / `mate` always apply. At levels 1 and 2 they are not forwarded (D6).
- The `random` and `book` capabilities that complete D2's `createUciSession` shape.

## Not in v1 at all (ADR-0044 D6), so not owed by any ticket in this epic

- `searchmoves` honoured (today: one `info string`, all moves searched; S8).
- `info` per iteration, `seldepth`, `currmove`, and a pv longer than one move.
- Real pondering: `ponderhit` is `stop` (D3), and no `Ponder` option is offered.
- The search seeing the game's repetitions. S2's 3+2 game repeats a position three times by ply 48 (`UAT-167-b`).
