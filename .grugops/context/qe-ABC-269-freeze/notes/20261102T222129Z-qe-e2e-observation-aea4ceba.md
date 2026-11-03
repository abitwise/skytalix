---
id: 20261102T222129Z-qe-e2e-observation-aea4ceba
kind: observation
by: qe-e2e
at: 2026-11-02T22:21:29Z
verified_by: 
confidence: high on the arithmetic (deterministic, from ADR-0064 d1-d3 and main's evaluate); information only, not a reading of any build
refs:
  - qe-ABC-269-freeze
  - grugops/ABC-269
  - ABC-269
  - EPIC-011
  - E1
  - E3
  - ADR-0064
  - ABC-082
  - G3
  - B1
  - 58fa3eb4
  - d6a57653
  - src/evaluate.taper-corpus.ts
  - qe-ABC-269-freeze/20261102T222017Z-qe-e2e-decision-1b856350
  - arch-E1/20261102T215541Z-architect-design-decision-d8150777
supersedes: 
seal: sha256:e18f66520d1e02ba40e345febf09e13c770c441f1db970cd7fccf387c2517faf
---

# qe-ABC-269-freeze forecasts, as information only: what `ADR-0064` d1–d3's arithmetic predicts on the frozen sets. B1 (d) graded: +34 to +85 (all ≥ 20). Shelter stress: +13, +13, +23. B1 (e) pairs: ≥ 1.6 × at phase ≤ 6, exactly 1.0 × at 24, ≤ 1.25 × at 18. Mirror: the delta form is exact on all 30 rows; the full form fails the 2 −0 traps. Not readings of any build; the build's numbers are its own

QE/E2E, task `qe-ABC-269-freeze`. **These numbers come from `raw/scripts/lib.ts` `analyse`, not from E1 code** (none exists):
- mg is `main`'s `evaluate` from white's side;
- Δ is the king's (40 − 15 m) − `KING_TABLE` plus each passer's bonus;
- the forecast is mg + trunc(Δ × (24 − w) / 24), with w = min(24, phase).

Under the PREREG (decision `…1b856350`) none of this is a bar.

## B1 (d), centre minus corner, from the walking king's side
- **The rule at phase 0:** the score is the eg half exactly, so E1 = base + (eg − mg at the centre) − (eg − mg at the corner).
- **Graded endings:**

  | row | pre-ticket | forecast |
  |---|---|---|
  | D1 | −55 | +75 |
  | D2 | −96 | +34 |
  | D3 | −45 | +85 |
  | D4 | −86 | +44 |
  | D5 | −35 | +55 |
  | D6 | −55 | +35 |

  - The minimum is +34 (D2, the partly sheltered h1).
  - D5 and D6 use the far corners, where mg = eg, so E1 adds exactly +90 there.
- **Shelter stress (a report):** S1 −117 → **+13**, S2 −117 → **+13**, S3 −107 → +23.
  - For a1 or h1 corners (white) the gap is base + 130, so the bar needs base ≥ −110.
  - A fully sheltered corner with the centre files bare reads −117 (PST −40, mobility +28, exposure −105).

## B1 (e), by pair (the kings sit on equal-halves squares, so this is exact)

| own rank (base) | phase 0 | phase 6 | phase 18 | phase 24 |
|---|---|---|---|---|
| 2 (5) | 10 (2.0×) | 8 (1.6×) | 6 (1.2×) | 5 |
| 3 (10) | 20 | 17 (1.7×) | 12 (1.2×) | 10 |
| 4 (20) | 40 | 35 (1.75×) | **25 (1.25×, equality)** | 20 |
| 5 (35) | 70 | 61 (1.743×) | 43 (1.229×) | 35 |
| 6 (60) | 120 | 105 (1.75×) | **75 (1.25×, equality)** | 60 |
| 7 (100) | 200 | 175 (1.75×) | **125 (1.25×, equality)** | 100 |

- The black passers on ranks 2, 5 and 7 read the same, from black's side.
- **The ≤ 1.25 × bar holds at equality** for ranks 4, 6 and 7 at phase 18. Rounding to nearest instead of truncating would put rank 5 at phase 18 at 44 (1.257 ×) and fail it. So the pairs also catch the wrong rounding.
- **Over the array grid, the lowest ratio at phase ≤ 6 is 1.6 ×** (rank 2 at phases 5–6). Rank 3 reads 1.7 × and rank 5 1.743 × at phase 6. d8's parenthetical "(by construction ≥ 1.75 ×)" is not exact under trunc; the ≥ 1.5 × bar is unaffected.

## B1 (a) and (b)
- **The delta form** mg + trunc(...) is `Object.is`-equal to its mirror on all 30 rows.
- **The full form** trunc((mg × w + eg × (D − w)) / D) fails on `M-negzero-a` and `M-negzero-b`: −0 against +0.
- **At raw phase ≥ 24** (3 rows, the 2 clamp rows included), the forecast equals `main` by construction. An unclamped build would not: `M-clamp28` would move by trunc(−50 × −4 / 24) = +8.
