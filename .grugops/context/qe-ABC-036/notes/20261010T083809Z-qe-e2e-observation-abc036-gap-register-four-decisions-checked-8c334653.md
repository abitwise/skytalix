---
id: 20261010T083809Z-qe-e2e-observation-abc036-gap-register-four-decisions-checked-8c334653
kind: observation
by: qe-e2e
at: 2026-10-10T08:38:09Z
verified_by:
confidence: high
refs:
  - ABC-036
  - ABC-035
  - ABC-038
  - EPIC-003
  - NFR-003
  - N8-LANE
  - src/command-input.ts
  - src/command-input.test.ts
  - 20261010T082218Z-software-engineer-decision-abc036-count-first-code-unit-sort-eighth-row-daa1392b
  - 20261010T083120Z-software-engineer-claim-abc036-built-owed-qe-three-of-twenty-visible-83696dfe
  - 20261010T083809Z-qe-e2e-observation-abc036-a1-a7-reproduced-nine-mutants-red-gates-green-1af60074
supersedes:
---

# `ABC-036` QE: the Engineer's four decisions against the page, and the gap register

Hand-authored, no seal (degraded posture, `AGENTS.md`). Subtask `qe-ABC-036`. Evidence is in
observation `…1af60074`.

## The four reversible decisions (decision note `…daa1392b`), checked against the criteria

| decision | page / `ABC-035` text it meets | contradicts a criterion? |
|---|---|---|
| Code-unit sort (`.sort()`, no comparator) | `ABC-036` Scope: "ascending by SAN string"; `A2`: "ascending SAN-string order". Code-unit order is the default ordering of JS strings and is the same on every machine (test note 5: "deterministically"). The page does not name a collation | **No.** It is one reading, flagged by the Engineer and pinned by a row. A case-folded order is the product's call |
| `legal moves: <n>` as item 0 | `A1`/`A3`: "the message states a number"; test note 6: "put the count first". The colon form avoids `1 legal moves` (QE probe in check: `legal moves: 1`, `Kxg2`) | **No.** Its cost is visibility, not correctness (G2) |
| Retire `ABC-035 A4`'s foreign-token row | `ABC-035 A4`: help names "every token in this ticket's command table and no token that is not in it". The negative half is still enforced: "one item per table row" (length) plus "every table token present" together mean set equality. QE mutant QM6 (help appends `pager`) is red on 5 rows | **No.** Precedent: `resign`, `new`, `undo` |
| `moves` kept out of `TOKEN_SPELLINGS` | Those rows assert **0** `legalMoves`, which `ABC-036 A4` (exactly 1) contradicts, so including `moves` would be wrong. `ABC-035 A1`'s tolerance is re-asserted by `moves`' own rows (4 accepted, 5 refused). `ABC-035 A2` (0 SAN and coordinate resolver calls) is asserted for `moves` by the `A4` rows. `ABC-035 A6` (0 `gameStatusOf`) is asserted by the `A5` pure row | **No.** See G5 for the one thing that is thinner |

## The three cases the build hop left untested

| case | outcome |
|---|---|
| Zero legal moves | **Row added.** Checkmate and stalemate answer `["legal moves: 0"]`, with one derive and no `toSan`. QM8 survived before the row and is red after it. Reachable only by calling the pure function: the loop ends the game before it prompts |
| `moves` clearing an armed `quit` | **Row added.** quit / moves / quit returns the confirmation twice. QM7 survived before the row and is red after it |
| ASCII glyph mode | **Row added.** A3 (N > 0, count visible) and A7 (`help` hides nothing) at the start position. The region is identical to Unicode's (W = 21) |

## Gap register (all non-blocking; none breaks a criterion)

| id | gap | severity | owner / route |
|---|---|---|---|
| G1 | Stale doc comment in production. `src/command-input.ts:91` still reads "the seven tokens do NOT share one arm. Three are `command`". There are now eight tokens, and four are `command` (`help`, `board`, `quit`, `moves`). Behaviour is unaffected. QE does not edit production code | low | Engineer, a one-line fix before merge or in the next touch of the file |
| G2 | Reduced promise, smaller in practice than the page estimated. The start frame shows **3 of 20** (`Na3 Nc3 Nf3`, `(+17 more)`) in Unicode and in ASCII. The page's problem section estimated "roughly 9". This is within the amended criterion (exact count, partial list, `+N`). It is a product wording choice (the Engineer's claim `…83696dfe`) | info | Owner / Orchestrator. QE takes no position on the wording |
| G3 | The table-order claim is not reproduced for one reorder. `A7`'s note says "the order of the table matters". With `moves` moved to index 3 (QM5), `help` still fits 21/21 at both the start and the claimable frames. Only the "EIGHTH row" row went red. The order is pinned, so nothing is unguarded. The page's reasoning overstates the risk for that permutation, and QE did not try other permutations | info | none. `ABC-038`'s author should know the order is pinned by one row |
| G4 | No wall-clock reading for `NFR-003` ("returns in < 100 ms"). It is held as a count by `A4`, as the page directs. The catalog reading is fenced from both hops | low | Whoever next writes `plans/nfr-catalog.md` |
| G5 | The four accepted `moves` spellings assert classification and the stated count only. FEN identity and 0 `gameStatusOf` are asserted for canonical `moves` only (`A5`). `ABC-035`'s own spellings get both per spelling. The risk is small: the lookup normalises before any branch, so the spelling cannot reach the arm | low | none required |
| G6 | `N8-LANE` was not re-measured by QE. The Engineer measured +130 ms net, under heavy load. QE added 4 rows to an existing file (0.98 ms wall, no new file). The CPU figure for QE's rows is `UNKNOWN - verify`, and expected negligible | low | none required at this size |
| G7 | ASCII and the region were checked at the start position only, which is the narrowest prompt frame. Mid-game ASCII frames are wider and were not rendered | info | none required |

**Merge context (not a gap in this diff).** The wave tip has moved `85eb80c → 767150e`.
`git diff --stat 85eb80c grugops/wave-2026-09-25 -- src` is empty, so nothing under `src/` on the
wave tip collides with this branch. `ABC-127` is running in parallel on puzzle files, which do not
overlap.
