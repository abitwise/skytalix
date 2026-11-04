# bapm-ABC-271-ready decision: ABC-271 is re-cut to ADR-0070 ACCEPTED, form (a), structure only at 0. K0–K4 and F1–F5 replace P0–P8 and F1–F6. Size S, DoR 10/10, Ready

BA/PM, task `bapm-ABC-271-ready`, records only, on `grugops/bapm-ABC-271-ready` from `main` `7968c97f` (`src/` tree
`4fb3da04`). Nothing was run. The pages are in commit `17c9f052`. Inputs: `ADR-0070` (merged `139d5cfa`), the
Architect's owed lines (`arch-ADR-0070-accept` `…212d6a4c` § 5) and the Orchestrator's rulings (`…730399e5`).

## What the `ABC-271` page now says (the page is authoritative)
- **Front matter:** `status: ready`, `column: Ready`, `size: S`, and `adr:` "`ADR-0070` ACCEPTED 2026-11-04 (owner,
  form (a), structure only)". The priority stays P3.
- **The title** drops "behind an ADR-0026 test-only off-door pair" and names the structure-only form. The file name
  keeps the as-cut slug, because sealed notes cite the path (as `ADR-0070` keeps its own slug).
- **Intent GAIN is struck.** There is no intent class and no read. The firing figure (29.75 %) is history and a
  forecast for the second pull.
- **§ Problem:** a value line. This ticket alone moves no Elo. Its value is the feature class the second pull fits.
- **§ Scope:** 1–3 are the rules at 0, each recorded as the prior. Scope 3 reads "0; the rule value 400 is not
  shipped (`ADR-0070` d7)". Scope 4: the memo is 576 KiB. Scope 5 is struck. `passerTermsForTest` stays, and only
  test files call it.
- **§ Acceptance:** K0 with `ADR-0070` d5's seven exact counts; K1 (a)–(e) and the source row; K2 exactly two
  memo-size re-pins (458 752 → 589 824); K3 `G2` ≤ 1.05 ×; K4 `G6` ≥ base with every run ≥ 6. No games. S2 nps is
  reported only if the Orchestrator rules (open).
- **§ Falsifiers:** `ADR-0070` F1–F5, with their rows.
- **§ NFR triggers:** `NFR-009` +128 KiB (576 KiB); `NFR-001` / `G2` K3; `NFR-005` K4; `NFR-008` K1 units.
- **§ Test notes:** QE freezes K1 (a)'s ≥ 10 passer positions and K1 (c)'s fixtures before the build. UAT is owed and
  the QE verdict signs it (production lines). The PR lists K0's counts. `R-281-a`'s four `-t` lines run at the QE hop
  (`…730399e5` item 3).
- **§ Dependencies:** every hard dependency is met. The ticket comes before the second pull, whose fit is taken on a
  `main` that contains it. U is held at 0 there.
- **§ DoR:** re-scored, 10/10. Row 10 flips because `ADR-0070` is accepted and the door reading and U = 0 are ruled.
- **§ As cut:** the old Acceptance (P0–P8, F1–F6), Dependencies and DoR are kept unedited.
- **`ABC-279`:** one pointer line under A1 (b) to `ADR-0069` d10's dated line of 2026-11-04 (`QE-279-a`). No bar moved.

## Judgments, flagged
1. **K1 (c)'s fixture floor is BA/PM's carry, not an `ADR-0070` bar.** The ADR names "fixtures QE freezes before the
   build" with no count. A count-free freeze is vague, so test note 1 carries the as-cut P1 (c)–(e) counts: ≥ 8 pawn
   endings for U (4 outside, 4 inside twins) plus one fixture above phase 0 that reads U = 0; ≥ 6 king-distance pairs,
   at least one for each king and one past the cap of 5; ≥ 4 free-path pairs. The cap and the own-king pair test
   terms the ADR's rule names. They add no new behaviour.
2. **The priority stays P3.** The brief did not ask to change it. The order (before the second pull) is a dependency.
3. **K4 has no depth-7 WARN line.** `ADR-0070` d5's K4 does not name one, unlike `ABC-270`'s page.
4. **The live page is 262 lines, and 348 with § As cut.** That is under the 300-line control for the live part
   (`45-standing-rulings.md` item 2). The as-cut record follows `ABC-270`'s precedent.

## Flagged to the Architect and the Orchestrator (not a wait of this ticket)
- `ADR-0070` d1 says `tools/tune` "reads and writes them unchanged". On `main`, the emitter writes a fixed list of 13
  value exports that does not name `PASSED_KING_ENEMY`, `PASSED_KING_OWN`, `PASSED_FREE` or `PASSED_UNSTOPPABLE`
  (observation note). The read side ignores unknown exports. So the second pull's tool change, beside `ADR-0067` d5's
  tracer extension, must also write the four exports. `UNKNOWN - verify` until the Architect confirms it.

## Not written here
- **`EPIC-011`:** the E4 / E2 / Phase-4 lines and the owner's open items fold into the next `EPIC-011` cut task
  (`…730399e5` item 4). `bapm-W1-bundle-cut` holds that page.
- **The board:** the Orchestrator's. `[ABC-271]` goes Backlog/In Design → Ready, then Ready for Dev if he pulls it.
