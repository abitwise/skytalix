---
id: 20260925T103500Z-software-engineer-claim-abc081-what-this-build-did-not-verify-ae9116b7
kind: claim
by: software-engineer
at: 2026-09-25T10:35:00Z
verified_by:
confidence: UNKNOWN - verify
refs:
  - ABC-081
  - ADR-0025
  - NFR-005
  - NFR-009
  - N8-LANE
supersedes:
---

# What the ABC-081 build did not verify

- **The capacity guard (`KEY_ARRAY_CAPACITY = 128`) is not reached by any test.** Mutant K3
  removes it and survives every lane, because no search in the suite goes near ply 128. The
  `NaN`-depth route (`!(depth >= 1)`) is what keeps `QE-G1` meaningful, and mutant K4 shows
  that route IS load-bearing. `ADR-0025` falsifier `T4` asks for the deepest ply reached in
  `ENGINE_DEEP` to be logged. This build did not add that log line; it is named, not done.
- **`A4`'s literal "mate-in-2 position" is answered at the table, not in the search.** In the
  search, the only reused mate entry that the dropped ±ply adjustment could flip, across 182
  endgame positions and four budgets, was a mate-in-ONE position (plies 5 and 9). No reused
  mate-in-2 entry changed a root score in that scan. Whether a search-level mate-in-2 fixture
  exists under the exact-depth rule is UNKNOWN.
- **The `stored >= needed` cutoff rule was measured, not adopted.** It went one ply deeper on
  one rook ending (`kr-mid`, 80 ticks). Whether it buys a ply on kiwipete or position-6 at 3 s
  was not measured: both rules gave identical nodes there to iterative depth 6. It would
  reopen `A1`'s identity question, so it belongs to a ticket that re-levels `A1`, not to this
  build.
- **`ADR-0025` `T2` (a 2^20 table vs 2^18 at 3 s) was not run.** 2^20 is 16 MiB and breaks
  `NFR-009` on its own, so that A/B is a re-level question and was left to its owner.
- **The graph-history interaction was accepted, not measured.** The key excludes the path and
  the halfmove clock, so a repetition's 0 stored on one path can be reused on another. At depth
  ≤ 4 in a fixed-depth search it cannot arise (a repetition there can only be of the root),
  and the identity sweeps are clean. Its size in play is not measured.
- **`startpos` deepened to depth 4 costs 5% MORE nodes with the table on** (2 496 vs 2 378,
  `probe/guards.mjs`). It was seen and not investigated: the hash move re-orders a root that was
  already well ordered. It is one position at one depth, and both criterion positions fall.
- **Game strength is not measured.** Nothing in this ticket says what the extra ply buys in play.
- **Clock.** This hop's system clock read about 10:0xZ at the claim and 10:3xZ at these notes,
  which is earlier than the 17:30Z enqueue stamp. Earlier hops saw the same. The stamps here are
  the clock as read, and why they disagree was not investigated.
