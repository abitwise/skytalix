---
id: 20261026T005119Z-qe-e2e-observation-dc779c4a
kind: observation
by: qe-e2e
at: 2026-10-26T00:51:19Z
verified_by: 
confidence: high (every command run by QE at 3d39c8ff; pre-registered; raw files read)
refs:
  - ABC-207
  - EPIC-008
  - NFR-005
  - NFR-004
  - NFR-008
  - ADR-0028
  - ADR-0031
  - ADR-0049
  - plans/tickets/ABC-207-mobility-is-weighted-per-piece-and-an-early-queen-trip-costs.md
  - owner-word-2026-10-24/20261024T093000Z-orchestrator-decision-4c3f7639
  - qe-ABC-205/20261025T034500Z-orchestrator-decision-10e61802
  - orch-2026-10-25ab/20261025T125052Z-orchestrator-decision-9bd65e3c
  - orch-2026-10-25aa/20261025T123439Z-orchestrator-decision-6eda769c
  - arch-design-ABC-207/20261025T123306Z-architect-design-decision-a21b7cc9
  - arch-design-ABC-207/20261025T123306Z-architect-design-observation-439d6f8c
  - ticket-to-pr-ABC-207/20261025T124944Z-software-engineer-decision-71735f56
  - ticket-to-pr-ABC-207/20261025T124944Z-software-engineer-decision-84f82342
  - ticket-to-pr-ABC-207/20261025T124944Z-software-engineer-observation-723cbf60
  - grugops/qe-ABC-207
  - 3d39c8ff
  - 7020cca3
  - 5477df21
  - G2
  - G5
  - G6
  - G11
  - QE-205-c
  - QE-207-f
  - qe-ABC-215/20261025T121200Z-qe-e2e-observation-a34270bf
  - arch-rule-ABC-205-g6/20261025T042840Z-architect-design-decision-912bcb0d
supersedes: 
seal: sha256:1ddfde7a9cc76d53c3452c72477c989f775eca0533827c566ea0528b918c0238
---

# ABC-207 pre-check, G2 and G6 (NFR-005 at 3 s, ≥ base): pre-check counts equal the design's, no miss predicted; G2 MET (660.7 / 661.7 ns); G6 MET (kiwipete 7 = 7, position-6 8 = 8, all 20 runs), clean host. G11 reported: head's five choices equal base's

QE/E2E, task `qe-ABC-207`. **One run under `…4c3f7639`** (scope reading `orch-2026-10-25ab/…9bd65e3c`), pre-registered
(`raw/PREREG.txt`, 13:16:27Z) before the session. Trees: `git archive` of base `7020cca3` and head `3d39c8ff`. Plain node
v26.11.1, a fresh process per measurement.

## Pre-check (page Test note 4; a count, not a reading)
`chooseMove`, `now: () => 0`, `maxDepth: k`; nodes to complete depth k:
| tree | kiwipete d7 | kiwipete d8 | position-6 d7 | position-6 d8 |
|---|---|---|---|---|
| base `7020cca3` | 609 900 | 1 735 339 | 586 333 | 1 355 149 |
| head `3d39c8ff` | 602 091 (−1.28 %) | 1 700 946 (−1.98 %) | 469 639 (−19.90 %) | 1 111 000 (−18.02 %) |
- All 8 equal the design's (`…a21b7cc9`) and the SE's (`…723cbf60`); d6 too (248 056 / 238 941; 180 658 / 158 592).
- A value-identical base reading exists (`qe-ABC-215` `…a34270bf`, its head `7d4cea3e`, `src` equal to this base): kiwipete
  7 ×5, position-6 8 ×5. Base straddles no depth, and head needs fewer nodes at every depth on both boards. **No miss
  predicted**; the run went ahead. The pre-check grades nothing.

## Session 13:19:01Z–13:21:56Z (G2, then G6, then G11)
- Preconditions met at the first poll (load1 3.18, 0 vitest). 18 samples (10 s): AC, battery 100 %, load1 2.94–3.56,
  thermal 0 in all 18, **0 samples with a foreign vitest**.
- **Overlap: 0 of 20 G6 runs, 0 of 10 G11 runs, 0 of 4 G2 runs** meet a vitest window or a load1 > 8 sample. The
  overlap-free statistics are the all-runs ones.

## G2 (A3; ABC-076 method, N = 1 000 000, best of 5 per root, mean of the six perft roots)
- base 639.8 ns, head 660.7, head 661.7, base 641.0 (order base, head, head, base). **MET** (≤ 1 100; under 990, so no
  second session). Head − base ≈ +20.8 ns (+3.2 %).

## G6, per run (odd rounds base first, even rounds head first)
| board | build | depths r1–r5 | median | nodes (median) | ms (max) |
|---|---|---|---|---|---|
| kiwipete | base | 7 7 7 7 7 | 7 | 1 320 813 | 3 002.4 |
| kiwipete | head | 7 7 7 7 7 | 7 | 1 293 961 | 3 002.0 |
| position-6 | base | 8 8 8 8 8 | 8 | 1 479 266 | 3 001.1 |
| position-6 | head | 8 8 8 8 8 | 8 | 1 492 164 | 3 000.9 |
- Floor (≥ 6): held, minimum 7. WARN level (7): met by every run. **"≥ base": kiwipete 7 ≥ 7; position-6 8 ≥ 8. G6 = MET**
  (n = 5 per board per build; graded over all runs, load1 recorded; the overlap-free grade is the same). Every run chose
  Bxa6 / Nd5.
- Head's depth-8 need on position-6 (1.111 M) lies below every head run's count (1.483–1.494 M), as the pre-check said;
  depth 9 is out of reach for both. Kiwipete's depth-8 need (1.70 M) stays out of reach for both.
- `G5`: all 30 real-clock searches returned in 2 999.4–3 002.4 ms (5 000 ms ceiling); ENGINE_DEEP engine and levels green.

## G11 (A5, reported, not graded): chooseMove at 3 000 ms, one run each, same session
| before | base (`7020cca3`) | head |
|---|---|---|
| 4.Qa4 | d3 (d8, +56) | d3 (d8, +35) |
| 8.e5 | Be2 (d7, +65) | Be2 (d7, +48) |
| 10.Ne4 | exd6 (d8, +19) | exd6 (d8, 0) |
| 13.d4 | d4 (d8, −92) | d4 (d8, −108) |
| 17.Kc1 | Kc1 (d9, −241) | Kc1 (d9, −213) |
- Base's row equals `qe-ABC-215`'s head row exactly (same `src`). Since `ABC-215` the base already plays d3, not 4.Qa4,
  so the ticket's motivating move no longer occurs at base; head changes none of the five choices (`QE-207-f`).
- FENs replayed from `plans/uat/EPIC-006-game-1.pgn` with the tree's own `san.ts`/`apply.ts` (byte-equal to `qe-ABC-215`'s).
