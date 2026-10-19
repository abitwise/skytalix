---
id: 20261019T121000Z-qe-e2e-decision-abc171-verdict-pass-with-gaps-9d61b7e3
kind: decision
by: qe-e2e
task: qe-ABC-171
at: 2026-10-19T12:10:00Z
verified_by:
confidence: high
refs:
  - ABC-171
  - plans/tickets/ABC-171-the-uci-session-offers-ownbook-and-skill-level.md
  - ADR-0044
  - EPIC-007
  - NFR-004
  - NFR-008
  - R-167-1
  - R-167-2
  - ABC-167
  - ABC-168
  - QE-171-a
  - QE-171-b
  - QE-171-c
  - QE-171-d
  - QE-171-e
  - QE-171-f
  - 20261019T110600Z-software-engineer-decision-choices-the-page-left-open-a171d001
  - 20261019T110601Z-software-engineer-observation-readings-a171d002
  - 20261019T113000Z-qe-e2e-observation-abc171-criteria-gates-nfr004-5b2e9d17
  - 20261019T113200Z-qe-e2e-observation-abc171-n8-lane-owed-71c3e0a4
  - 20261019T120500Z-qe-e2e-observation-abc171-mutants-c48a1f60
supersedes:
---

# QE `ABC-171` at `9ae31679` (code `b6afd021`): **PASS_WITH_GAPS**

Hand-authored and unsealed. Nothing was committed to `grugops/ABC-171`, and nothing was pushed or merged. No defect
was fixed. I did not touch `src/`, `plans/board.md`, `plans/traceability.md`, `../wt-ABC-171`, or any process I did
not start.

**Why PASS_WITH_GAPS:**
- A1–A12 are MET against the page (`…5b2e9d17`).
- The gates are green: 1945/1945, `success: true`, skips 0 `No findings.`.
- The ABC-167 rows still kill their 37 mutants, and the brief's 17 are among them.
- NFR-004 holds on the virtual clock: the session's highest budget is 4 500.
- R-167-1 adds nothing.
- **No wrong behaviour was found at the tip.** The gaps are rows that would let a wrong build through (4 LOW), one
  wiring item for ABC-168 (INFO), and choices the page leaves open (INFO). N8-LANE is OWED.

## The six SE choices (`…a171d001`), graded
| # | choice | decided by | grade |
|---|---|---|---|
| 1 | `random`, `book` are required; the ABC-167 helper passes an empty valid book and `seededRandom(1)` | page Scope 1 and D2 (`createUciSession({ write, now, random, book })`); ABC-168 binds both | **Decided.** A12 holds: no ABC-167 row changed except A1, and the 37 ABC-167 kills show the helper weakened nothing. Each ABC-167 `go` now reads the empty book once, which writes no line |
| 2 | `OwnBook` values are case-sensitive (`TRUE` is invalid) | page Scope 3 / D3 "`true` or `false`", read literally | **Decided by the literal reading.** No row pins it (S02). INFO in QE-171-f |
| 3 | the value is every token after `value`, joined; no `value` is invalid | D3: an invalid value keeps the old one with one `info string`. "nothing" is neither `true`/`false` nor an own key, so **no value = invalid is decided** | **The join is a gap, harmless:** under the tip every multi-token value is invalid for both options. A first-token reading (S03) would accept `1 2` as 1, and no row tells them apart. INFO in QE-171-f |
| 4 | on a book hit, `parseGo`'s bad-token `info string`s are still written, before `info string book` | **not decided.** A3's "exactly 2 lines" is for a clean `go`. D12 gives each bad token one `info string`, so the tip's order is consistent with D12 | **Gap, INFO** (QE-171-f), for BA/PM to confirm. Not a defect |
| 5 | the dropped-limit line's wording (`skill level 1 ignores go depth; searching on time`) | D11 "ignored here, with one `info string`"; A7 "one `info string` naming the dropped limit". The substance is decided, the wording is the SE's | **Decided.** Only `depth` is pinned. `nodes`, `mate` and the one-line-for-all rule are not (S38, S39 → QE-171-c) |
| 6 | `warm()` at `isready` and at `go`, `openingName(<start position>)`, once per session while `OwnBook` is on | D10 / Scope 4: "at the first `isready` with `OwnBook` on (warmed with `openingName`), or else at the first `go`" | **Decided.** Which position is warmed is not stated, and it is immaterial: the probe's memo holds `read` at 1 (S45, S47 equivalent) |

## Gaps
- **QE-171-a LOW: the per-`go` seed derivation is not pinned.** A7 compares two sessions with each other. A
  constant seed with the draw kept (S32), or `* 2 ** 16` (S33), passes every row.
  - Probe P2 shows the tip follows D11 exactly: for k = 1…8 the session matches `createLevel` seeded with
    `floor(random() · 2^32)` per `go`.
  - **Fix:** one row with that oracle (the `firstDraws` helper already re-derives the seed).
- **QE-171-b LOW: the book before the level, at a blunder level.** No row has a book hit at level 1 or 2. A build
  that searches instead (S25) passes, although D10 says "whatever the go limits or the level are".
  - **Linked INFO:** A8 says "each `go` at a blunder level calls it to draw one seed". On a book hit the tip draws
    **0** (P3), which is the D10/D11 reading: no level instance is made. S31, a draw on the hit, also passes.
  - BA/PM should word A8: "each `go` that plays through a blunder level".
  - **Fix:** one row: `START_BOOK`, level 1, `go` → `info string book`, `bestmove e2e4`, 0 draws.
- **QE-171-c LOW: the dropped-limit line is pinned for `depth` only.** S38 (only `depth` named) and S39 (one line
  per limit) survive. D11 names `depth`, `nodes` and `mate`, with one `info string`. The tip is right (P4):
  `go depth 3 nodes 100 mate 2` gives one line naming all three.
  - **Fix:** one row: `go nodes 100` and `go depth 3 nodes 100 mate 2` at level 1.
- **QE-171-d LOW: "keep the old value" for `OwnBook` is pinned in one direction only.** The only row keeps `false`,
  so a build that sets `false` on any invalid value (S12) passes. The tip keeps `true` (P5: `TRUE` and no value both
  keep `true`).
  - **Fix:** one row: `OwnBook maybe` from the default, then `START_BOOK` still hits.
- **QE-171-e INFO, routed to ABC-168: the bad-book warning never reaches the GUI from the session.**
  - The probe's `warn` is a construction argument, so the session writes nothing for it (P6).
  - D10 says it "reaches the GUI as `info string opening book … playing on without it`". That is the `warn` binding
    in `src/uci.ts`.
  - ABC-168's page should say so and pin it.
  - The warning text carries no byte of the error (P6, checked with a planted path).
- **QE-171-f INFO: open readings, no row.**
  - Choices 2, 3 and 4 above.
  - `Skill Level` `01` / `1.0` / `0x1` are refused, because they are not own keys of `LEVELS`. The page's
    `Object.hasOwn(LEVELS, n)` reads `n` as an integer, so this is defensible. An integer-range check (S07) would
    accept them, and no row tells the two apart.
  - Accept these or add rows. The tip's behaviour is coherent.

## NFR-004, N8-LANE
- **NFR-004: confirmed on the virtual clock.** Level 5 is 4 500, under the 5 000 ceiling, and the clamp still
  applies. The maximum reading over levels 1–5 × five unbounded `go`s was 4 600 virtual ms, the budget plus one step.
  Clause A at the default (level 3, 3 000) is unchanged and `AR-NFR004-A` stands. A real-clock UCI level-5 reading is
  the Security/NFR gate's call.
- **N8-LANE: OWED.** In a 180 s foreground window on Mac.lan, foreign vitest/platform processes were in 181/181
  polls, and load1 was 8.74–12.37. Nothing was timed or estimated (`…71c3e0a4`).

## Next column
- **Recommended: `In Security/NFR`.** That hop takes the N8-LANE reading (or the owner's R-167-2-style word) and
  decides whether NFR-004 at level 5 needs a real-clock reading.
- **QE-171-a..d:** four small rows. Add them, or accept the gaps, before or at the gate.
- **QE-171-e:** goes onto ABC-168's page.
- **Then the owner's UAT applies,** because `src/uci-session.ts` is production and is in the diff.
- The Orchestrator decides.
