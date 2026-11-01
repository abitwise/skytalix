---
id: 20261101T202347Z-architect-design-observation-f5f41888
kind: observation
by: architect-design
at: 2026-11-01T20:23:47Z
verified_by: 
confidence: low-medium: an estimate from pre-ABC-235/240/254 shares (no search profile since, UNKNOWN - verify); medium-high on the ceilings; Elo figures informal
refs:
  - arch-abc250-close
  - ADR-0055
  - ADR-0055-D3-V2
  - ABC-250
  - ABC-251
  - ABC-252
  - ABC-253
  - ABC-254
  - EPIC-010
  - QE-250-a
  - qe-ABC-250
  - grugops/arch-abc250-close
  - 032def2a
  - 767a2e3e
  - ADR-0056
  - NFR-001
  - se-ABC-250/20261101T192954Z-software-engineer-observation-ff7ffb6e
  - qe-ABC-254-a4v2/20261101T190238Z-qe-e2e-observation-7aaf058c
  - qe-ABC-250/20261101T201444Z-qe-e2e-observation-677d4d41
  - se-ABC-227
supersedes: 
seal: sha256:2037773087a9fa044d8c8af6cff9511864e0d75436709585f0cbe0102fe42eb7
---

# The remaining ADR-0055 O1 speed path, re-estimated after ABC-250's close: O1-c ≈ 1.00–1.04× and O1-a ≈ 1.01–1.06×, together ≈ 1.01–1.10× (central ≈ 1.04×, ≈ 3–6 Elo informal); O1 in total ≈ 1.12–1.23× (central ≈ 1.16×) against ADR-0055 D1's 1.25–1.85× (central 1.5×)

Architect/Design, task `arch-abc250-close`. An estimate, not a reading. Nothing run. Recorded in ADR-0055's dated status line (`032def2a`).

## Scope
What ADR-0055 O1 has delivered and what its remaining cuts can still buy, from the shares and readings on record.

## Basis
- **Delivered (reading):** O1-d, `ABC-254`, kiwipete 1.112, position-6 1.120, start 1.106 at 4 s (`qe-ABC-254-a4v2` `…7aaf058c`). Below D1's band 1.15–1.40×.
- **Not delivered:** O1-b. `ABC-250`'s perft read was not graded (UNRESOLVED); its search guard A5 read 1.003 / 0.994 / 1.005, as expected for a core-only change (`qe-ABC-250` A5). After `ABC-254`, allocation was ~4 % of perft time (`se-ABC-250` `…ff7ffb6e`, informal, not ALONE: base GC 4.2 %, `addMove` 3.7 %), so O1-b's upper band (to 1.25×) had lost its support on today's profile.
- **O1-c:** helpers `isBlack` / `pieceType` ~2 % self and engine bookkeeping 1.3–2.0 % (`se-ABC-227`, before `ABC-235` / `ABC-240` / `ABC-254`). The helpers sit mostly in generation (`moves.ts` 13 call sites), which those cuts shrank, so their share need not have grown. Estimate 1.00–1.04×.
- **O1-a:** zobrist + TT 1.8–3.4 % at the same profile. Those buckets were untouched by the cuts since, which removed about 1.45–1.6× of total time (1.20–1.28 × 1.09–1.12 × 1.11–1.12, assuming no overlap: `UNKNOWN - verify`), so their share may now be up to ~1.5× larger. Ceiling ≈ 1/(1 − 0.054) ≈ 1.06. Estimate 1.01–1.06×.
- **Product:** 1.01–1.10×, central ≈ 1.04× (each near half its ceiling; judgement). O1 total: 1.11–1.12 × that ≈ 1.12–1.23×, central ≈ 1.16×.
- **Elo (ADR-0055 § Elo per speed doubling, informal 50–100 per doubling):** log2(1.04) ≈ 0.057 → ≈ 3–6 Elo remaining; log2(1.16) ≈ 0.21 → ≈ 11–21 Elo for O1 in total. Invisible to C2′ (100 games), C3″ and S′; both remaining tickets stay S2-graded.

## Reading for routing (not a ruling)
- Both remaining bars sit inside their estimates (1.03 in 1.00–1.04; 1.02 in 1.01–1.06), so "not merged, dropped" is a likely and harmless outcome for each. Cost: one S + one M ticket, two QE hops, about 2 h ALONE host time.
- ABC-253 is the cleaner of the two (independent, medium-high confidence on its ceiling, and its share has likely grown). ABC-251 narrowed is the more doubtful; its design input (companion decision) adds a profile-first stop rule so a dead cut stops before the ALONE read.
- Beyond O1, speed is ADR-0056's V3 (staged generation) and V4 (bitboards, the owner's). ADR-0056 D3's "very likely a speed step beyond O1" reads more likely now.

## Risks
- Every share predates three cuts; no search profile has been taken since `se-ABC-227` (`UNKNOWN - verify`). The estimate could be off in either direction by a few percent, which is the whole size of the prize.
- O1-d's shortfall against its band is unexplained (`UNKNOWN - verify`); the same optimism may sit in O1-c / O1-a's bands.
