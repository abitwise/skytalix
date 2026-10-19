---
id: 20261019T110600Z-software-engineer-decision-choices-the-page-left-open-a171d001
kind: decision
by: software-engineer
task: ticket-to-pr-ABC-171
at: 2026-10-19T11:06:00Z
verified_by:
confidence: medium
refs:
  - ticket-to-pr-ABC-171
  - ABC-171
  - ADR-0044
  - ABC-167
  - ABC-085
supersedes:
---

# ABC-171: no page edge was left undecided. Six minor choices, made by the most literal reading of D3/D10/D11

This note is hand-authored and unsealed. This install has no `context-io.ts`, so no `finding` can be admitted.

**Every edge case on the page is decided by the page or by ADR-0044.** None was decided here. That covers A2's invalid values, A5's read timing, A8's no reseed and A9's bad book.

**The choices below fall outside the page. They are flagged for QE and BA/PM.**
1. **`random` and `book` are required fields** (D2's full shape). The ABC-167 rows' shared helper now passes a real `createBookProbe` over an empty, valid format-1 book (no hit, no warning) and `seededRandom(1)` (level 3 never calls it). The helper changed. The only row that changed is ABC-167 A1, which gains the two option lines.
2. **`OwnBook` values are case-sensitive**: only `true` or `false`. `TRUE` is invalid (one `info string`, the old value kept). Only the name is case-insensitive (D3).
3. **The `setoption` value** is every token after `value`, joined by single spaces. If there is no `value` token, the value is empty, which is invalid for both options (one `info string`, `got nothing`).
4. **On a book hit, `go`'s token warnings are still written.** These are the existing `parseGo` `info string`s for bad tokens, and they come before `info string book`. The level's dropped-limit line is not written on a hit, because no search runs. A clean `go` gives exactly A3's 2 lines.
5. **The dropped-limit line** at levels 1 and 2 is one `info string` naming the accepted `depth` / `nodes` / `mate` keywords, for example `info string skill level 1 ignores go depth; searching on time`. A rejected token already got its own `parseGo` line, so it is not named again.
6. **Warming**: `isready` and `go` both call `warm()`, which runs `book.openingName(<start position>)` once per session, only while `OwnBook` is on. `go` then calls `bookMove` on the held position. The probe's own memo is what guarantees one `read`.

**Fences kept:** `LEVELS` and `src/levels.ts` are unchanged. The ABC-085 verdict (levels 3, 4 and 5 do not separate) is untouched: `Skill Level` maps to `LEVELS` exactly as the page says. A6 asserts budgets only, and no strength is asserted.
