---
id: 20260919T173100Z-qe-e2e-observation-abc107-mutant-ledger-18-mutants-raw-red-rows-1948a10e
kind: observation
by: qe-e2e
at: 2026-09-19T17:31:00Z
verified_by:
confidence: high
refs:
  - ABC-107
  - ADR-0022
  - src/frame.overflow-bound.test.ts
  - src/frame.ts
  - src/move-input.ts
  - src/frame.test.ts
supersedes:
---

# `ABC-107` mutant ledger — 18 mutants against the 25-row pin, raw red rows, every one reverted

**NOT A STAMP.** Method: a node script (scratchpad, referenced in the sibling `artifact-ref`)
applies each mutant as an exact-string replacement (asserted to match exactly once in the file),
runs `npx vitest run src/frame.overflow-bound.test.ts --reporter=json`, collects the failed
`fullName`s, then `git checkout -- <file>` and asserts `git status --porcelain -- src` is empty.
A mutant with 0 red in the pin is re-run against the whole `--dir src` lane. Row names below drop
the shared describe prefix `ABC-107 A1' / A3 / A5 — the bound is pinned by a test, not by
arithmetic`; `[reach]` = the `A1'` reachability describe, `[A2]` = the `A2` describe.

| id | file | mutant | pin result |
| --- | --- | --- | --- |
| M1a | `src/frame.ts` | `MESSAGE_ROWS` 2 → 1 | **9 red**: six knights `hides exactly 0 of 6`, `shows the marker…`, `shows every candidate in full`; seven knights `hides exactly 2 of 7`, `shows the first candidates whole…`; eight knights `hides exactly 3 of 8`, `shows the first…`; eight queens `hides exactly 3 of 8`, `shows the first…` |
| M1b | `src/frame.ts` | `MESSAGE_ROWS` 2 → 3 | **9 red**: seven knights / eight knights / eight queens × (`hides exactly`, `shows the marker…`, `shows the first…`) |
| M2a | `src/frame.ts` | `markerFor` → `(+${hidden + 1} more)` | **3 red**: seven knights `hides exactly 2 of 7`, eight knights `hides exactly 3 of 8`, eight queens `hides exactly 3 of 8` |
| M2b | `src/frame.ts` | `markerFor` → `(+${hidden - 1} more)` | **3 red**: the same three `hides exactly` rows |
| M2c | `src/frame.ts` | `withMarker`: `if (hidden === 0)` → `if (hidden >= 0)` (never appends) | **6 red**: seven / eight knights / eight queens × (`hides exactly`, `shows the marker…`) |
| M3a | `src/move-input.ts` | `messages: candidates.slice(0, 5).map(…)` — list truncated to 5 | **7 red**: six knights `hides exactly 0 of 6` (length 5 ≠ 6); seven / eight knights / eight queens × (`hides exactly`, `shows the marker…`) |
| M3b | `src/move-input.ts` | `candidates.slice(0, 6)` — truncated to 6 | **9 red**: seven / eight knights / eight queens × (`hides exactly`, `shows the marker…`, `shows the first…`) |
| M4a | `src/move-input.ts` | `legal = deps.legalMoves(position).filter((move) => move.from !== 33)` — b3 dropped from the resolver | **10 red**: six knights `hides exactly 0 of 6`; seven knights `hides exactly`, `shows the marker…`, `shows the first…`; eight knights `hides exactly`, `shows the marker…`, `shows the first…`; `[reach]` six / seven / eight knights. Eight queens untouched (no queen on b3) |
| M4b | `src/move-input.ts` | `candidates.slice(0, -1)` — last candidate dropped | **6 red**: six knights `hides exactly 0 of 6`; seven knights `hides exactly`, `shows the marker…`, `shows the first…`; eight knights `hides exactly`; eight queens `hides exactly` |
| M5a | `src/frame.ts` | `width … + 1` (frame one column wider) | **6 red**: seven knights × 3 rows, eight queens × 3 rows. **Eight knights GREEN at W+1** (hidden still 3) |
| M5b | `src/frame.ts` | `width … + 4` | **9 red**: seven / eight knights / eight queens × 3 rows |
| M5c | `src/frame.ts` | `capacity = width - 1 - …` (region one column narrower) | **6 red**: seven / eight knights / eight queens × (`hides exactly`, `shows the first…`). Six knights GREEN |
| M5d | `src/frame.ts` | `capacity = width - 4 - …` | **6 red**: same six rows. Six knights GREEN |
| M5e | `src/frame.ts` | `capacity = width - 6 - …` | **6 red**: same six rows. Six knights GREEN |
| M5f | `src/frame.ts` | `capacity = width - 7 - …` | **9 red**: the six above PLUS six knights `hides exactly 0 of 6`, `shows the marker…`, `shows every candidate in full` — the requirement row reds at W−7 |
| M6 | `src/frame.ts` | `SEPARATOR` `" "` → `""` | **9 red**: seven / eight knights / eight queens × 3 rows |
| M7 | `src/frame.ts` | marker appended to `rows[0]` instead of the last row | **NONE in the pin (25/25 green)**. Whole lane: exit 1, **2 red / 1238, both in `src/frame.test.ts`** |
| M8 | `src/frame.ts` | `assembleFrame` pushes a second empty row | **5 red**: six knights `shows every candidate in full`; seven / eight knights / eight queens `shows the first…`; `[A2]` `the two-candidate reference is the epic's constant height` |

**Every file restored; `git status --porcelain -- src` empty after each of the 18 and at the end.**

## What the ledger says

1. All four mutants the subtask names (a)–(d) red the pin, in both directions where a direction
   exists. The tripwire is one-column and one-row sensitive.
2. **On the Engineer's 7-of-25 at `MESSAGE_ROWS` = 3:** QE measures **9 of 25** at `= 3`. The
   difference is the `shows the marker exactly when something is hidden` rows for the three
   overflowing fixtures, which red here because at three rows nothing is hidden and the marker
   vanishes; the Engineer's note names "the 7- and 8-knight hidden/marker/shown rows" (six) plus
   one. Both were watched RED; the count discrepancy is recorded, not resolved, and does not
   change the verdict — the rows that must red do.
3. **`M7` is the only survivor and it is fenced**: the pin asserts no width (ticket test note 2),
   and `src/frame.test.ts` holds the row-width invariant with 2 red rows. Do not add a width
   assertion to the pin to "fix" this.
4. **Requirement-side headroom is six columns** (M5c–M5f): the six-knight `= 0` row stays green
   down to W−6 and reds at W−7. Measured through the real pipeline: six knights render as
   `N2d4 N3d4 Nb5d4 Nfd4 Nc6d4 Ned4` (31 characters incl. separators), packed 4 / 2 at W = 21.
5. **Fixture messages at the tip** (minimal SAN, from `resolveMoveInput`): seven knights `N2d4
   Nb3d4 Nf3d4 Nb5d4 Nf5d4 Nc6d4 Ned4` → region `["N2d4 Nb3d4 Nf3d4", "Nb5d4 Nf5d4 (+2 more)"]`;
   eight knights `Nc2d4 Ne2d4 Nb3d4 Nf3d4 Nb5d4 Nf5d4 Nc6d4 Ne6d4` → `["Nc2d4 Ne2d4 Nb3d4",
   "Nf3d4 Nb5d4 (+3 more)"]`; eight queens `Qa1d4 Qd1d4 Qfd4 Qa4d4 Qh4d4 Q7d4 Qd8d4 Qh8d4` →
   `["Qa1d4 Qd1d4 Qfd4", "Qa4d4 Qh4d4 (+3 more)"]`. All four FENs round-trip through `toFen`.
   Wider-frame sweep (history pane padded, a probe not a mutant): seven knights hidden 0 from
   W+1; eight knights 3 at W+1, 0 from W+2; eight queens 0 from W+1.
