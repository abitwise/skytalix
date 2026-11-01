---
id: 20261101T151909Z-architect-design-observation-874a59c0
kind: observation
by: architect-design
at: 2026-11-01T15:19:09Z
verified_by: 
confidence: high for the quoted readings (sealed notes, committed PGN); the probabilities and resolutions are derivations (normal approximation)
refs:
  - ADR-0056
  - EPIC-011
  - EPIC-010
  - ABC-255
  - ABC-256
  - arch-adr0056-100ms-fold
  - grugops/arch-adr0056-100ms-fold
  - 75919370
  - orch-2026-10-30a/20261101T125800Z-orchestrator-decision-2896c6eb
  - orch-2026-10-30a/20261101T131000Z-orchestrator-decision-f7a50e95
  - qe-tc-depth-probe/20261101T150834Z-qe-e2e-decision-b505d675
  - qe-tc-depth-probe/20261101T150824Z-qe-e2e-observation-1889e3b0
  - qe-tc-depth-probe/20261101T150824Z-qe-e2e-observation-07357280
  - qe-tc-depth-probe/20261101T150824Z-qe-e2e-observation-9fd1fdce
  - qe-tc-depth-probe/20261101T150824Z-qe-e2e-observation-f440e5f5
  - qe-EPIC-010-m1-batch-2
supersedes: 
seal: sha256:a131914627a011392393397c070f78983d376098b0c41c54873bd6804f40c7bf
---

# ADR-0056 C2's estimates against the measurement: depth at 0.5 s is 8, not 5–6, and 100 ms is 6. Self-play at 0.5 s runs 44.2 games/h, not 65–80. Stockfish spends its whole move time past its pick depth. The pass probabilities of the 100-game rule

Architect/Design, task `arch-adr0056-100ms-fold`. These are readings quoted from sealed notes, plus derivations that
are marked as such. Nothing was run in this hop.

- **Depth** (`qe-tc-depth-probe/…1889e3b0` R1, 25 positions, fresh process): the median completed depth is 6 / 7 / 8
  / 9 / 10 at 100 / 250 / 500 / 1 000 / 4 000 ms. ADR-0056 C2 estimated "about 5–6" at 0.5 s, which is two plies low.
  C2's "7–8 at 4 s" was `G6`'s median on its own position set before milestone 1b's speed-ups, and is not comparable.
- **Throughput** (`…07357280` R4, self-play, SHARED, so lower bounds): 259.2 games/h at 100 ms (137.6 plies a game)
  and 44.2 at 500 ms (163.7 plies). C2 estimated 65–80 at 0.5 s from ≈ 90-ply games.
- **Stockfish spends its whole `st`.** `qe-EPIC-010-m1-batch-2/raw/batch/base/b04/r.pgn` shows Stockfish moves at
  E 1 910 (pick depth 4) as `{… /15–18 0.50s}`. So a 0.5 s floor at a 100 ms routine control would make each Stockfish
  move 5× a skytalix move. Read from a committed PGN; no run.
- **The fixed-count pass probabilities** (derivation: normal approximation, trinomial with a fixed draw ratio, 1 SE =
  48 / 1.96 = 24.5 Elo at 100 games and draws 0.50):
  - GAIN rule (≥ 50.0 / 100): P(pass) is 0.948 / 0.792 / 0.658 / 0.500 / 0.342 / 0.208 / 0.025 at a true +40 / +20 /
    +10 / 0 / −10 / −20 / −48.
  - NEUTRAL rule (≥ 43.0 / 100, ≈ −49.0 Elo): P(pass) is 1.00 / 1.00 / 0.99 / 0.98 / 0.94 / 0.88 / 0.52 at the same
    effects.
  - At draws 0.30 (1 SE = 29.1), GAIN reads +20 → 0.754 and −20 → 0.246.
- **The C3′ pair's resolution** (estimate): 200 games against Stockfish at a score of 50 % and 26.5 % draws (the
  milestone 1 batch's rate) give ≈ ±41 Elo per build and ≈ ±58 on the pair. The milestone 1 pair read ±77.9 at
  72–78 %.
- **T4 is invisible at 100 ms** (derivation): a median 100 ms search visits 47 131 nodes (R1). The TT has 2^18 =
  262 144 slots and is cleared at every `chooseMove` (ADR-0056 § Inventory), so the table does not fill within one
  move.
