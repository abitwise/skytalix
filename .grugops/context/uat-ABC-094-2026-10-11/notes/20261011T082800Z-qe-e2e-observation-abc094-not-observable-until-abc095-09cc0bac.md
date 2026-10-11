---
id: 20261011T082800Z-qe-e2e-observation-abc094-not-observable-until-abc095-09cc0bac
kind: observation
by: qe-e2e
at: 2026-10-11T08:28:00Z
verified_by:
confidence: high
refs:
  - ABC-094
  - ABC-095
  - ABC-096
  - ABC-101
  - EPIC-005
  - QE-094-a
  - QE-094-c
  - QE-094-e
  - NFR-007
  - src/cli.ts
  - src/book.ts
supersedes:
---

# UAT `ABC-094`: what cannot be seen until `ABC-095`, plus two things the run turned up for `ABC-095`

This note is hand-authored and unsealed. None of the items below is graded as a pass or a fail here.

## Not observable until `ABC-095` wires the book in

Today `src/cli.ts` does not import `src/book.ts`. No production file does (`grep` over `src/`, test files
excluded). So `npm run chess` cannot show any of these:

| what the player would see | why not here | where it gets proven |
|---|---|---|
| The engine answers 1.e4 with a book move, instantly, without searching | Nothing calls the probe | `ABC-095` `A1`, `A2`, `A7` (`CLI_DEEP` row) |
| Leaving book is silent and the frame does not change | Same | `ABC-095` `A3`, `A4` |
| With no book, a whole game plays normally on search alone | "Plays on" here only means the probe returns nothing | `ABC-095` `A5` |
| **The one warning appears on stderr and never on the board (stdout)** | The probe writes to no stream. The harness bound stderr in S6/S7, and that binding is not delivered code | `ABC-095` `A5`, **but that page does not yet ask for the stream**: `QE-094-a`, MEDIUM, still open at wave tip `1b6685b6` |
| Exactly 1 warning for the whole process | The probe warns once per instance (`QE-094-e`) | `ABC-095` `A5` |
| The game still starts promptly (`NFR-007`) | S9 shows 0 reads at construction. Real start-up time needs the root | `ABC-095`'s root |
| Variety across real sessions | Sessions use `random: Math.random` (`ADR-0037` D3). S3 and S4 use fixed seeds | `ABC-095` `A7` |
| The opening's name on screen | No accessor was built (optional) | `ABC-096` |

## Two observations for `ABC-095` (INFO, not defects of `ABC-094`)

1. **Every `bookMove` call draws one random number, even out of book.** On Kiwipete, 1 `bookMove` plus
   1 `inBook` consumed 1 draw (S2 INFO line). `inBook` draws none. With `Math.random` (D3) this changes
   nothing. **If a later root shares one seeded generator between the book and anything else** (`ABC-101`'s
   integer seed, a level's blunder rate), each engine turn spends one draw on the book. That keeps games
   reproducible, but it moves the other consumer's sequence. Whoever wires a shared seed should know this.
2. **A book damaged deep inside warns mid-game, not at start-up.** In C5b the book played 3 legal moves.
   Then it reached the illegal entry, warned once, and went quiet. The illegal-move check runs per position
   (`QE-094-c`). Whole-file faults (C2–C4b, C6–C9) warn on the first question. So `ABC-095`'s warning can
   arrive on a later engine turn, while the board is on screen. `ABC-095` `A4` fences the frame. The
   warning's timing is a case it should cover.

## Warning wording (for the owner to judge; not graded)

A player would see one of these six lines, each ending `; playing on without it`: `could not be read`,
`is not valid UTF-8 JSON`, `is not a format-1 book`, `has an entry that does not match the format`,
`holds a move that is illegal in its position`, `is larger than 1048576 bytes`. They are fixed text and
never quote the file. The line has no trailing newline, so the root adds one.
