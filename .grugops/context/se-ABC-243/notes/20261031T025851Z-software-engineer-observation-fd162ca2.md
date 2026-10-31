---
id: 20261031T025851Z-software-engineer-observation-fd162ca2
kind: observation
by: software-engineer
at: 2026-10-31T02:58:51Z
verified_by: 
confidence: high on what was run; wall cost estimates UNKNOWN - verify until QE's G8
refs:
  - se-ABC-243
  - ABC-243
  - EPIC-010
  - ADR-0046
  - NFR-008
  - NFR-009
  - ABC-228
  - ABC-241
  - ABC-244
  - SE-228ii-a
  - QE-228ii-b
  - QE-241-a
  - QM3
  - QE-244-a
  - grugops/ABC-243
  - 8772cf36
  - 4bd9ac6a
  - src/uci-session.test.ts
  - src/transposition.test.ts
supersedes: 
seal: sha256:92a571a782317f7cb03df3c89067d75d7f8f10aef716b381132f2b08a8c6fbcd
---

# `ABC-243` findings and QE handoff

## Findings (SE, none blocking)
- **SE-243-a INFO.** A6 is pinned at one depth (4), as the ticket allows. QE's QE-A4e read `d1e1` at 0 at depths 1–5;
  only depth 4 is in the lane.
- **SE-243-b INFO.** The Hash row reads `time` with a format-blind regex instead of `parseInfo`, so it no longer checks
  that the info line carries `score` at level 5. Chosen so a plant to 1–4 fails on the time bound, not on a parse; the
  "default level" check is the time bound. `ABC-167`'s "at the default, a bare go …" row (`:976`) still checks `score`.
- **SE-243-c INFO.** The header line `src/transposition.test.ts:19` is now 117 characters. Biome passes (it does not
  wrap comments). It was not re-wrapped, to keep A3's three-line diff exact.
- **SE-243-d INFO.** The `npm test` walls are informal (n = 1 base, n = 2 tip); the A1 row's added cost is about +10 ms
  of row wall (35 → 40 reads), the A6 row about 2 ms, near the ticket's +0.03 s estimate. `UNKNOWN - verify` until QE's `G8`.
- **SE-243-e INFO.** Base is `4bd9ac6a` (Orchestrator's setup) and not `ae7211c3` (brief); the two have the same `src/`,
  `tools/` and `data/`.

## What QE needs
- A2: re-plant L = 4, 6, 7 ("`setoption Hash` sets the level to L") on its own scratch copy; record the three reds
  (SE readings: 1 100, 5 100, 30 100 against 4 000..4 200) and green with no plant.
- A6: re-plant QM3 (`qe-ABC-241` `mutate.mjs` shape); record the red (SE: `cp -875`).
- A3/A4: `git diff 4bd9ac6a 8772cf36` — 2 files; transposition 3 text lines; count base + 1 (2 322 → 2 323).
- A5: `G8` reading (headroom 9.25 s per `secnfr-ABC-244`; if the head median reads > 9.6 s, `ABC-244`'s tranche-2
  trigger fires) and the `ENGINE_DEEP` row once.
- No smoke, no UAT (test-only; QE's verdict is the gate).
