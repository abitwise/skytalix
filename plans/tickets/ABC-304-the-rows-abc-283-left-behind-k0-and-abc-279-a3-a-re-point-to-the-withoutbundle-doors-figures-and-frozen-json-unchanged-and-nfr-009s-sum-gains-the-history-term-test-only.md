---
id: ABC-304
title: "The rows ABC-283 left behind on main: ABC-271 K0's seven counts and ABC-279 A3 (a) re-point to the …WithoutBundle doors, figures, bars and frozen JSON unchanged, and NFR-009's sum gains the history term (test-only, UAT waived)"
status: done
column: Done
closed: "2026-11-05, merged to local main at 9f481fa5 (a merge commit); QE PASS_WITH_GAPS, none blocking (qe-ABC-304 …e1bb0944); UAT waived (test-only, zero production lines). K0 stands re-pointed: ABC-301 closed NOT MET, so its scope 4 retirement was not taken. QE-304-a and -b ruled by the Architect (…21a996c9). Front matter only, by bapm-wait-lines-1105"
size: XS
priority: P2
epic: EPIC-011
feature: —
adr: "No new ADR. The dated lines of arch-ABC-303-open govern: ADR-0070 d5 (K0), ADR-0069 d11 and ADR-0072 d7 (A3 (a)), ADR-0063 § Consequences (the history term), ADR-0067 (K0 retires at ABC-301 scope 4)"
---

# ABC-304: three stale rows on `main`, one test-only hop

> **Cut 2026-11-04 by BA/PM: DoR 10/10, Ready** (task `bapm-K0-cut`, records only, at `main` `8527e49f`; nothing run).
> Sources: Architect decisions `arch-ABC-303-open` `…e28552ac`, `…84f9bae1`, `…5aee89b7` item 6 and observation `…261ea757`;
> the Orchestrator's rulings `orch-2026-10-30a` `…681c6363` 1 and 3 and brief `bapm-K0-cut`. **No bar moves.** The id was
> checked free on every local ref at the cut.
> - **Rides on neither `ABC-303` nor `ABC-301`.** A bundle that misses its read would leave these unwritten, and `ABC-301`'s
>   scope bars the edit (`…e28552ac`, `…5aee89b7` item 6).
> - **Lane hygiene in `EPIC-011`, outside the phase order,** as `ABC-302`. The column moves are the Orchestrator's.

## Problem

- **User:** every hop that runs a deep lane or reads `NFR-009` on `main`.
- **Pain:** `ABC-283` changed the shipped search on purpose, and three rows outside its re-point pass stayed where they were.
  No play, search or evaluation is wrong.
  1. **`ABC-271` K0 is red on `main`:** 7 of 28 in the `SEARCH_DEEP` lane of `src/evaluate.passer.test.ts`, since `58e90d07`
     (`…261ea757`, on `src/` tree `845f5662`). The rows ask the shipped path a pre-`ABC-283` question.
  2. **`ABC-279` A3 (a) sits one rung short.** It reads Q1 plus history, SEE ordering and aspiration, under a level derived
     for Q1 alone (`ADR-0069` d11's dated line). It is green on `main`, its exact figure not on record. `grugops/ABC-303`'s
     shipped path read 90.91 %, 96 cp, under the 93 % bar (`…84f9bae1`).
  3. **`NFR-009` (a)'s sum has no `historyByteLength()` term.** The row is green and understates by 32 768 bytes on `main`,
     about 4.6 MiB against 16 MiB in all (`ADR-0063` § Consequences' dated line).
- **Value:** the deep lanes of `main` read green and mean what they say, and the memory sum counts what ships.

## Scope

1. **K0, `src/evaluate.passer.test.ts`:** in the seven rows, `chooseMove` → `chooseMoveWithoutBundle` (five) and `search` →
   `searchWithoutBundle` (two). A re-point, not a re-pin. Row names stay: they are the keys of `FROZEN.k0`.
2. **A3 (a), `src/see.test.ts`:** the two rows' shipped side goes to `searchWithoutBundle` / `chooseMoveWithoutBundle`. The other
   side stays `…WithoutSeePruning`. Titles stay.
3. **`NFR-009` (a), `src/transposition.test.ts`:** `historyByteLength()` becomes one term in A7's sum. No new row. Its 32 768 is
   already pinned in `src/search.bundle.test.ts`.
4. **One comment on each re-point,** citing its dated ADR line.

## Out of scope

- Any figure, bar or level. Any edit to `src/evaluate.passer-fixtures.json`, so no re-freeze.
- Any production line. Any new row, file or lane.
- The countermove's term: `ABC-303` owes it (`…5aee89b7` item 6). The other re-points of `se-ABC-303`.
- K0's retirement: `ABC-301` scope 4 (`ADR-0067`'s dated line).
- The lane line for this file in `AGENTS.md` and the command log, and the written rule for merge re-reads: outside this hop
  (Orchestrator or Scribe, `…e28552ac`).

## Acceptance criteria

- **A1 (K0).** **Given** the seven rows on the doors of scope 1, **when** the passer deep lane runs, **then** it exits 0 with
  **28 / 28** passed, and each row reads its figure in `FROZEN.k0` exactly: 766 275, 1 725 150, 87 475, 253 724, 533 916,
  605 117, 406 787. Green is expected from `se-ABC-283-merge` `…f7f63e1d`, read on a tree whose non-test `src/` equals
  `main`'s; this hop's run is what shows it.
- **A2 (A3 (a)).** **Given** the two rows on the doors of scope 2, **when** the SEE deep lane runs, **then** it exits 0 and each
  row holds ≥ 93 % within 25 cp, ≤ 144 cp, 0 sign changes, at ≥ 100 compared. It should read 96.26 % / 95.72 %, 66 / 96 cp,
  0 changes: `UNKNOWN - verify` until the lane runs. The figures read go in the PR.
- **A3 (`NFR-009`).** **Given** A7's sum row, **then** the summed expression has a `historyByteLength()` term, its level stays
  ≤ 16 MiB, and the row passes. The row stays green with or without the term, so QE reads the term in the diff.
- **A4 (the fence).** `git -c core.quotePath=false diff --name-only <delivered>~1 <delivered> | grep -v '\.test\.ts$' | grep '^src/'`
  prints **nothing**. That covers the JSON too. The diff touches at most the three named test files. No `it` is added or removed.
- **A5 (the list).** The PR lists every re-pointed row, nine on the full scope (`ADR-0058` d5), and QE checks the list against a
  grep for `search(` and `chooseMove(` beside a door name in the two files.
- **Standing gates:** lint, typecheck, unit (`npm test`), build, skip count 0; the QE hop and its verdict; merge on green.

## If another ticket lands first

**Read `main` at the claim. The ticket shrinks only if K0's block is gone from it.**

| lands first | what happens here |
|---|---|
| `ABC-301`, on an emission that moved any value | **K0 retires there** (`ADR-0067`; `…681c6363` 1), so scope 1, A1 and the passer lane fall away, and A5 lists two rows. Scopes 2–4, A2–A5 stand. A2's bars stand; its expected figures do not carry over a fitted table (`UNKNOWN - verify`) |
| `ABC-301` closes NOT MET, or its emission moved no value | K0 stands. Nothing here changes |
| this ticket, then `ABC-301` | `ABC-301` retires the rows on their re-pointed doors. Its line stands as written |
| this ticket, then `ABC-303` | `ABC-303` takes A3 (a)'s door when `main` goes in, `de15cfb2`'s comment and `…WithoutQuietBundle` imports go, and the countermove's term joins the history term in the one sum |
| `ABC-303` | A3 (a) starts from `…WithoutQuietBundle` and ends on the same door; `de15cfb2`'s comment goes. K0 reads the same: an older door turns both parts off |

## What happens on a miss

- **A K0 row off its figure:** a STOP to Architect/Design. `ADR-0070` F1 says never re-pin.
- **A2 red:** back to Architect/Design (`ADR-0069` d11's dated line). No bar moves.
- **Any need for a production line or a JSON edit:** a STOP. It is no longer this ticket.

## NFR triggers

- **`NFR-009`** (≤ 16 MiB, ≤ 1 MiB growth): A3. The sum gains 32 768 bytes already allocated, so nothing grows.
- **`NFR-008`** (`npm test` ≤ 10 s): 0 rows and 0 files added to the default lane, and one integer term in an existing row. The
  rest is deep. No graded read is owed.
- **Security:** none.

## Test notes

1. **Passer deep lane** (no lane line yet): `SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/evaluate.passer.test.ts`. **SEE deep
   lane:** `AGENTS.md` § Test, about 55 s. Then the default lane. Under the host lock, one core, one job at a time.
2. **A red before this hop is the record:** K0's seven on `main` read as in `…261ea757`.
3. **A merge re-read runs the deep lane of any test file arriving from the other side** (`…681c6363` 3). If `main` moves before
   this merges, that applies here.
4. **`ABC-303`'s and `ABC-301`'s branches carry the same red** until this reaches them. It is not a new red there.
5. **UAT is waived** (2026-08-17: zero production lines, by A4). No game is owed: no production line moves.

## Size and priority

- **Size: XS.** About ten changed lines over three test files, two deep lanes and a QE hop.
- **Priority: P2.** A deep lane is red on `main`, and every hop must discount it. It gates neither `ABC-303`'s read nor `ABC-301`.

## Dependencies

- **None.** `searchWithoutBundle`, `chooseMoveWithoutBundle` and `historyByteLength` are on `main`; `src/see.test.ts` imports both doors.
- **File collisions:** `src/see.test.ts` and `src/transposition.test.ts` with `grugops/ABC-303`; `src/evaluate.passer.test.ts` with
  `grugops/ABC-301`. § If another ticket lands first.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ seven red deep rows, one row a rung short, one term missing; no engine defect |
| 2 | scope and out-of-scope | ✅ scope 1–4; figures, bars, JSON, production lines, the countermove's term and K0's retirement out |
| 3 | INVEST | ✅ XS, independent in either order, testable by A1–A5 |
| 4 | testable, measurable acceptance | ✅ 28 / 28 and seven exact counts; ≥ 93 %, ≤ 144 cp, 0 changes; the term present, ≤ 16 MiB; an empty diff list; nine rows listed |
| 5 | dependencies known | ✅ none; three collisions and every landing order stated |
| 6 | NFR triggers with targets | ✅ `NFR-009` ≤ 16 MiB; `NFR-008` 0 rows, 0 files added |
| 7 | test notes | ✅ 1–5 |
| 8 | size | ✅ XS |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ✅ the form is ruled (`…e28552ac`, `…84f9bae1`), the identity reading is ruled (`…681c6363` 1), and no owner question rides on it |

**DoR 10/10: Ready.** The column move and the slot are the Orchestrator's.
