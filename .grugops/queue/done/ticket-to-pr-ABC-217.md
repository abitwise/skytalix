---
subtask: ticket-to-pr-ABC-217
role: software-engineer
ticket: plans/tickets/ABC-217-the-abc-206-and-abc-212-guards-see-discovered-checks-in-module-rebuilds-and-the-session-clock.md
ref: .grugops/context/ticket-to-pr-ABC-217/
branch: new grugops/ABC-217 from main, worktree ../wt-ABC-217
width: 3 of 3 (beside se-fix-ABC-204 and the other ticket; no real-clock timing)
---

# Build ABC-217

## Do
- Own worktree and `npm ci --ignore-scripts`. Build exactly to the page's criteria; red-first where the page names a plant.
- Exactly the four files the page names; `src/gameend.ts` comments only (A6).
- Gates: lint, typecheck, build; `npm test` + `last-run.json` (note Duration); skips. Anything red outside the page's scope → STOP.

## Fences
- Only your worktree and `<scratchpad>/se217/`. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only — no hostnames, IPs, personal paths (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task ticket-to-pr-ABC-217). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

**Delivered, no STOP, no page defect.** Branch `grugops/ABC-217` in `../wt-ABC-217` (own `npm ci --ignore-scripts`), from `main` `476c9f63`. Code `a98bfc32`, tip **`5212a4bd`** (notes). Not pushed, not merged. Plants ran alone on scratch copies under `<scratchpad>/se217/`; none touched `src/`.

| criterion | rows | plant: red rows |
|---|---|---|
| A1 (QE-206-a) | `DISCOVERED_CHECKS` (Kd4-d5, c2-c3) inside the existing `givesCheck` row: legal, `FLAG_NONE`, gives check, then every move vs make/isInCheck/unmake. 0 new `it` | P-a: 1 of 34 (givesCheck depth 1, at "Kd4-d5 ... givesCheck"). **At base, full lane 2073/2073 green**, so the gap was open |
| A2 (QE-206-b) | 2 new rows in the ABC-206 describe: `makeMove` ×1 for `hasLegalMove`(start); ×N for `legalCaptures`(kiwipete), N computed, 0 < N < pseudo count | P-b1: 1 of 42 (the hasLegalMove row). P-b2: 1 of 42 (the legalCaptures row) |
| A3 (QE-212L-a) | `rig` returns `now`; `budgetAt` stub records `options.now`, helper asserts `toBe(now)`: all 6 budget-read rows | Q1: 2 of 9 (`-t "ABC-212 A9"`): `go movetime 60000 at 7`, `go movetime 1000 at 7`. No real-clock search run |
| A4 | `gameend.ts:17-19` reworded (leaf calls `leafEndReason`, ABC-206); NFR-001 describe title trimmed, 3 `it` at base and tip, bodies unchanged; grep counts 0 and 0 | — |
| A5 | exactly the 4 files (+67 −9); every `-` line is a replaced import, the title, the rig return or the budgetAt destructure | — |
| A6 | one hunk `@@ -17,3 +17,3 @@` in the header; 6 of 6 lines start with ` *`; `removeComments` transpile byte-identical (2 994 B, sha256 `f5ecc1e2…` both) | — |
| A7 | lint clean; typecheck 0; build 0; `npm test` 0, 62 files, **2 075** = 2 073 + 2; `last-run.json` success, 0 failed/pending/todo; **Duration 7.32 s** (base 7.14 s, load1 4.0; not a reading); skips 0, `No findings.`; lane-inventory rc 0 (62 = 62) | — |

Notes, sealed via `admitAndAppend` with `contextRoot` = the worktree's `.grugops/context`, read back 2/2, in `../wt-ABC-217/.grugops/context/ticket-to-pr-ABC-217/notes/`: decision `…b4f96904` (rows and plants), decision `…2e24ed24` (gates, A5, A6).

### Trace row
| ABC-217 (ticket-to-pr-ABC-217) | test hardening: discovered checks in givesCheck, makeMove counts for in-module rebuilds, the session clock in budgetAt; two stale gameStatus texts | EPIC-008 | — | no ADR; NFR-001 text only (no bound); NFR-008 0 new files/spawns/clock reads | grugops/ABC-217 @ 5212a4bd (code a98bfc32)<br>src/legal.test.ts, gameend.nfr.test.ts, uci-session.test.ts; src/gameend.ts comment only; .grugops/context/ticket-to-pr-ABC-217/notes/ (2) | plants P-a 1, P-b1 1, P-b2 1, Q1 2 red; P-a base 2073/2073 green; npm test 62/2075; skips 0, No findings. | waiver expected (A6 holds; owner Q4 …5c8e2a17); QE verdict decides | — | In Development → In Review (QE: four plants, A6) |
