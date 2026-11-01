---
id: 20261101T151909Z-architect-design-decision-db40f09a
kind: decision
by: architect-design
at: 2026-11-01T15:19:09Z
verified_by: 
confidence: high for the ruling as recorded in ADR-0056; the Elo resolutions, wall times and E at 100 ms are estimates; the GAIN/NEUTRAL bars and the epic opponent are the Architect's reading of the owner rule, owner may correct
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
  - ABC-204
  - ABC-208
supersedes: 
seal: sha256:59b3eb5834bbd2f61d02d8aa79125e03a80835e2aaf5ad39117e55eae4c30ba0
---

# ADR-0056 folded: no SPRT. C2′ is 100 games of self-play at 100 ms per strength change (GAIN ≥ 50.0, NEUTRAL ≥ 43.0). C3′ is a 400-game interleaved pair against Stockfish `st=0.1` per epic. The 0.5 s floor is dropped for routine reads, `restart=on` is kept, and ABC-255 is re-scoped to a fixed-count lane (S)

Architect/Design, task `arch-adr0056-100ms-fold`, records only, at `main` `452415bd`. Nothing was run. Inputs: the
owner's word `orch-2026-10-30a/…2896c6eb`, `…f7a50e95`, and the `qe-tc-depth-probe` readout `…b505d675` (R1–R6, and
QE-TCP-a…i). The text is in ADR-0056, in D5's dated block "the fixed-count rule at 100 ms", with dated lines in
Status, C2, C3, D6, D7, D8 and Consequences.

## The ruling

- **C2 and C3 are superseded.** There is no SPRT lane and no routine 4 s trend reading.
- **C2′, per strength change (any value change; speed tickets stay on S2).**
  - The candidate, rebased on `main`, plays its merge-base. Both sides at 100 ms (`st=0.1`), openings 1–50 × both
    colours = 100 games, width 1. The harness defaults stay: level 5, OwnBook on, `restart=on`, `-maxmoves 200`.
  - **`timemargin` = 50 ms at 100 ms** (not Q1's 5 000 − budget, which would allow a 50× overrun to read as
    strength).
  - **Pass:** 0 candidate faults, 0 candidate losses on time, and a score against the intent the design declares.
    **GAIN: ≥ 50.0 / 100** (point estimate ≥ 0). **NEUTRAL** (a correctness fix or simplification): **≥ 43.0 / 100**
    (≈ −49 Elo).
  - A base fault or a base loss on time makes the read UNRESOLVED; it is re-run once. A miss is NOT MET, with no
    re-play for luck. A stale read is re-read.
  - **The blind spot:** ±48 Elo at draws 0.50 (±57 at 0.30). P(pass, GAIN) is 0.95 / 0.79 / 0.66 / 0.50 / 0.34 / 0.21
    at a true +40 / +20 / +10 / 0 / −10 / −20. It cannot tell +10 from −10.
  - It replaces the D smoke. Recommended: the R smoke at 4 s stays (BA/PM records it; the Orchestrator rules if they
    differ).
- **C3′, per epic.**
  - `rpair` shape, at 100 ms. The base is the epic's start SHA, the head is `main` at close. Each build plays 200
    games against Stockfish 19 `UCI_LimitStrength`, E by the band rule, `--concurrency 1`.
  - **Stockfish `st=0.1` for E ≤ 2 600, with no 0.5 s floor.** 100 ms is ≥ 5× p95 (19.1 ms) and > 3× max (29.2 ms).
    Stockfish's play is depth-pinned, and it spends its whole `st` (milestone 1 PGN: `0.50s` moves at depths 15–18
    when its pick depth is 4). So the floor would roughly triple wall time and change no play. The guard stays.
  - **MET:** the pair's point estimate ≥ 0. **NOT MET:** the next epic's strength tickets wait until BA/PM records
    the suspects and the Orchestrator rules keep, revert or re-read.
  - **Resolution, honest:** each build about ±41–55 Elo, the pair about ±58–78 (estimate). The ±24 holds only for a
    400-game head-to-head. Stockfish is chosen over self-play because the per-change reads are already self-play,
    and non-transfer is the failure on record.
  - ≈ 1.0–1.6 h, owner-set.
- **The C1 floor (0.5 s, the claim at 40/15) is unchanged.**
- **Restart and warm-up:** keep `restart=on` and add no warm-up move. The cold first move is one in about 65 per side.
  It is symmetric in C2′ and cancels in C3′'s pair. Single-search depth or nps at 100 ms is read warm or labelled
  cold.
- **Depth-gated mechanisms:** X2, P5, S1 and T4 barely fire at depth 6. T4 is invisible by construction (≈ 47 k nodes
  against 262 144 slots). The design names the depth at which the mechanism acts. A longer-control read (500 ms ≈ 2.3 h)
  is asked of the owner.
- **E > 2 600 at 100 ms:** it needs an R5-style probe at E 2 700–3 190 first. Then Stockfish's `st` = 100 ms if
  4 × p95 ≤ 100 ms and max < 100 ms, else 4 × p95 rounded up to 50 ms. It costs under 1 h, so it is not asked. It is
  far off, because skytalix at 100 ms is estimated at E 1 550–1 850.
- **C4 is re-pointed:** the anchors pair 40/15 with 100 ms (not 4 s), and C1's "when to spend" uses the C3′ figure
  plus the measured offset.
- **ABC-255: yes, re-scope it** to a fixed-count 100 ms lane, size M → S. Drop the SPRT mode, the bounds, the 1 000
  openings and the `-sprt` question. Instead: `d --budget-ms 100` (50 ms margin), and the 100 ms control in
  `rpair`/`r` (Stockfish `st=0.1`). Existing dry runs stay byte-equal.
  - The acceptance becomes: dry-run rows for both command lines, one C2′ sanity read on `ABC-208` `b5c67ab7` against
    its first parent (reported), and one identical-pair read (games/h, draw ratio).
  - `ABC-256` becomes a 200-game read at the C3′ control (≈ 0.5–0.8 h).

## Open, for the owner if he wants it
- The GAIN/NEUTRAL bars and Stockfish as the epic opponent are the Architect's reading of his rule. He may correct
  them.
- Whether the R smoke stays beside C2′ (recommended: yes).
- Q-3K-4, Q-3K-6, Q-3K-7 and Q-3K-8 are still open.
