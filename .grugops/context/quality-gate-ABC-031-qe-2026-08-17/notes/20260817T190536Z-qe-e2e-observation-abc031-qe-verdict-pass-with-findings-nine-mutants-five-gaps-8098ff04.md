---
id: 20260817T190536Z-qe-e2e-observation-abc031-qe-verdict-pass-with-findings-nine-mutants-five-gaps-8098ff04
kind: observation
by: qe-e2e
at: 2026-08-17T19:05:36Z
verified_by:
confidence: high
refs:
  - ABC-031
  - plans/tickets/ABC-031-coordinate-move-input.md
  - src/coordinate-move.ts
  - src/coordinate-move.test.ts
  - memory-bank/50-decisions/ADR-0004-san-ownership.md
  - .grugops/context/ticket-to-pr-ABC-031-2026-08-17/notes/
supersedes:
---

# `ABC-031` QE verdict — **PASS WITH FINDINGS**. Nine mutants, five gaps found at QE.

The first QE hop under the owner's 2026-08-17 standing directive. This is not a rubber stamp:
**nine mutations were run against `src/coordinate-move.ts`, six died and three survived.** The
three survivors are the finding.

## GAPS FOUND AT QE: **5**

Stated as an integer because process rule 1's control consumes it. The list behind it:

| # | gap | how it was found | status |
|---|---|---|---|
| **1** | **`A6` cannot see a redundant `legalMoves` call.** The ticket's `## Security / NFR triggers` says *"This module's own cost bar is `A6`: with `legal` supplied it performs **zero** additional `legalMoves` calls."* `A6` asserts only reference identity of the RESULT, which a wasted call does not disturb. | mutant **M6** | **OPEN** — not closable without `vi.mock`, which forces a second test file and breaks `## Lane cost` |
| **2** | **The `legal`-omitted call path was executed by NO test.** `## Scope` declares `legal?` OPTIONAL, so `parseCoordinateMove(position, text)` is a contract path. Every `A1`-`A6` row supplies `legal`. | mutant **M7** | **CLOSED** by 3 QE rows |
| **3** | **The `## Out of scope` grammar fence was unwatched.** The page forbids `e2 e4`, `e2,e4`, `P-K4` and SAN-ish input and cites coding rules 5 and 7 for it. No criterion tested a single one. | mutant **M8** | **CLOSED** by 14 QE rows |
| **4** | **`A5`'s corpus contains ZERO en-passant moves.** Measured over the six perft FENs: **178 moves, 3 castles, 4 promotions, 19 captures, 0 en passant** — all six carry `-` as the ep square. `A5` is the criterion that exists to catch a fabricated `captured`, and it never renders the one move where `captured` names a piece **not standing on `to`**. That is `src/apply.ts:109`, the exact arm `ADR-0004` (2b) names. | measured, then fixture-built | **CLOSED** by 2 QE rows |
| **5** | **The module header's totality claim is broader than the behaviour.** `src/coordinate-move.ts:30` says *"It is a TOTAL function and does not throw"*, unqualified. Measured: `parseCoordinateMove(null, "e2e4")` throws `TypeError`, and `parseCoordinateMove(position, "e2e4", 42)` throws `TypeError`. | `A4` hostile-input hunt | **OPEN** — documentation precision, severity low |

**`A2`'s defective FEN is deliberately NOT in this count.** It was found by the software engineer at
**build** time and is already published in his `observation` note. Counting another agent's find as a
QE find would flatter the control, which is the same error the orchestrator's own note warns against.
I **confirmed** it independently (below); I did not discover it.

## The mutation campaign — every mutant, and whether it went red

Each ran against the real suite. `A5`/`A1`/`A6` share a kill mechanism (reference identity), so a
provenance mutant reds several criteria at once; that is the criteria working, not redundancy.

| id | mutation | expectation | result |
|---|---|---|---|
| **M1** | `parseCoordinateMove` **CONSTRUCTS** its result — `{from, to, piece, captured: 0, flags: 0, promotion}` — instead of returning the element out of `legal` | `A5` MUST go red | **KILLED. `A5` red on all six perft positions**, plus `A1` (4 rows), `A2` (1 row), `A6`. 12 failed / 14 passed |
| **M2** | ignore the `legal` parameter, call `legalMoves(position)` internally | `A6` MUST go red | **KILLED. `A6` red**, plus `A1`, `A2`, `A5`. 13 failed / 13 passed |
| **M3** | collapse both reject codes onto `"unreadable"` | `A3` MUST go red | **KILLED. `A3` red, and ONLY `A3`** — 2 failed / 24 passed. Clean, targeted kill |
| **M5** | return a **shallow copy** `{...matched}` of the matched move (and of each candidate) | `A1` MUST go red | **KILLED. `A1` red on all four forms**, plus `A2`, `A5`, `A6`. Proves the assertion is genuinely `toBe` reference identity and not deep equality |
| **M9** | fabricate **only** in the `ambiguous` arm, leaving the `move` arm honest | `ADR-0004` (2b) binds candidates too | **KILLED.** `A2`'s ambiguous row red via `legal.includes(candidate)`. 1 failed / 25 passed |
| **M6** | with `legal` supplied, call `legalMoves(position)` and **discard** it, then still select from `legal` | ticket says `A6` is the bar | **SURVIVED — 895/895 GREEN.** Gap 1 |
| **M7** | `legal ?? legalMoves(position)` → `legal ?? []` | — | **SURVIVED — 895/895 GREEN, and `tsc --noEmit` clean.** Gap 2 |
| **M8** | widen `COORDINATE` to `/^([a-h][1-8])[-,. \t]*([a-h][1-8])([qrbn])?$/` | — | **SURVIVED — 895/895 GREEN.** Gap 3 |
| **M8'** | M8 re-run **after** the QE rows landed | — | **KILLED — 5 red** |
| **M7'** | M7 re-run **after** the QE rows landed | — | **KILLED — 2 red** |

### The headline: `A5` is NOT vacuous

**M1 is the mutant the QE brief singled out, and `A5` killed it on all six positions.**
`ADR-0004` (2b) is **enforced**, not decorative. A fabricated `Move` cannot reach `src/apply.ts:157`
/ `:160` / `:109` through this module without the suite going red. That is the opposite of the
`ABC-061` / `ABC-063` / `ABC-064` vacuity pattern, and it is worth recording as a positive result:
the reference-identity discipline in `## Test notes` 1 and 2 did exactly the job it was specified for.

## Verdict per criterion

| criterion | verdict | basis |
|---|---|---|
| **`A1`** | **MET** | 4 forms, reference identity. Killed M1, M2, M5 |
| **`A2`** | **MET IN SUBSTANCE — NOT-MET AS WRITTEN.** I accept the engineer's handling. See the separate `decision` note | confirmed independently |
| **`A3`** | **MET** | M3 killed cleanly and in isolation. The two codes cannot collapse |
| **`A4`** | **MET** | **0 of 34** hostile inputs threw, including a 10,000,000-char string, `Symbol`, `BigInt`, a throwing `toString`, a throwing `Proxy`, lone surrogates, RTL overrides and fullwidth digits. Gap 5 is about the header's prose, not this criterion |
| **`A5`** | **MET, and non-vacuous** | M1 red ×6. Gap 4 is a corpus blind spot now closed, not a failure |
| **`A6`** | **MET as written; WEAKER than the ticket claims** | M2 killed it. Gap 1: it cannot see M6 |
| **`A7`** | **MET, re-verified from git at this hop** | `git diff 42ecc27 --name-only \| grep '^src/' \| grep -v '\.test\.ts$'` → **0 files**. Skips **0**, `PERFT_DEEP=1` **32/32** |

## Gate — run by me at QE, real numbers, branch tip `8ec01a1`

| gate | command | result |
|---|---|---|
| lint | `npm run lint` | **exit 0**, 56 files checked, no fixes applied |
| typecheck | `npm run typecheck` | **exit 0** |
| test | `npm test` | **914 passed / 914, 31 files, exit 0** (895 at `42ecc27`; **+19 QE rows**) |
| build | `npm run build` | **exit 0** |
| skip count | grep for `.skip`/`.todo`/`xit`/`xdescribe` | **0** |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **`No findings.`, exit 0** |
| deep perft | `PERFT_DEEP=1 npx vitest run src/perft.test.ts` | **32 passed / 32, exit 0**, 37.97 s |

The baseline at `42ecc27` reproduced the engineer's published numbers **exactly** (895/895, 31 files,
32/32 deep, skip 0) before any mutation — his gate report is accurate.

## Restoration — every mutation reverted

`git diff 42ecc27 --numstat` is **one line**: `124  1  src/coordinate-move.test.ts`.
**`src/coordinate-move.ts` is byte-identical to `42ecc27`.** Non-test files changed under `src/`:
**0**. Nothing was merged, no board column moved, no ticket page edited, `agent-factory/` untouched.

## What I added, and what I did not

**Added: 19 rows to the EXISTING `src/coordinate-move.test.ts`.** No new test **file**, deliberately —
the ticket's `## Lane cost` says ONE file and prices a second at 160 ms CPU, so a QE-owned second file
would have spent a budget the ticket reserved. **No row was weakened, skipped or deleted.**

**Did not:** change one line of production code, close gaps 1 and 5, edit the ticket, or move `ABC-031`
out of `In Review`.
