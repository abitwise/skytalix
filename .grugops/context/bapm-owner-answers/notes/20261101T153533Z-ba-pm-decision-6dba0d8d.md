---
id: 20261101T153533Z-ba-pm-decision-6dba0d8d
kind: decision
by: ba-pm
at: 2026-11-01T15:35:33Z
verified_by: 
confidence: high for the shapes, read from the owner's verbatim word and the Orchestrator's rulings; the head-to-head pass line and the smoke's E and bar at 0.5 s are the ADR-0056 owner-answers fold's (not on main at this hop)
refs:
  - bapm-owner-answers
  - EPIC-010
  - EPIC-011
  - ADR-0056
  - ABC-255
  - ABC-256
  - C12
  - C13
  - G7
  - RISK-EPIC011-04
  - RISK-EPIC011-02
  - 47f0c1a0
  - adab5f0d
  - orch-2026-10-30a/20261101T152518Z-orchestrator-decision-43098cef
  - bapm-100-400-rule/20261101T152119Z-ba-pm-decision-ad006634
  - bapm-100-400-rule/20261101T152524Z-ba-pm-decision-25a62150
  - qe-tc-depth-probe/20261101T150824Z-qe-e2e-observation-07357280
supersedes: 
seal: sha256:2a3216e5370ff2ad34839661e0f31818dae444cc0ffad957b8e1317f590e9e37
---

# The owner's answers 1-3 folded into EPIC-010 and EPIC-011: the epic read is 400 games head-to-head at 100 ms, the bars stand, a 10-game Stockfish smoke at 0.5 s returns beside each 100-game read and at each close, test controls are config only; C13 is void

BA/PM, task `bapm-owner-answers`, at `main` `adab5f0d`, pages commit `47f0c1a0`. Records only; nothing run.

- **Source:** owner word `…43098cef` (verbatim: "1. b ; 2. ok ; 3. quick check can be with 0.5s difficulty. Make sure engine is not changed internally and it works on different difficulty settings.") and the Orchestrator's rulings in the brief (smoke kept at 0.5 s; EPIC-010's close owes the per-epic read; ABC-255 may be pulled before that close).
- **Per epic (answer 1):** 400 games head-to-head at 100 ms, closing build against starting build, `d <head> <base> <out> --budget-ms 100 --rounds 200 --concurrency 1` through ABC-255 (d's default 200 rounds over the 100 openings). About +/-24 Elo (the probe's +/-48 for 100 games over sqrt 4; arithmetic). Pass: 400/400 complete, 0 faults and 0 time losses by either build at the 50 ms margin, head point estimate >= 0 (>= 200.0 of 400), **pending the ADR-0056 owner-answers fold**. ~1.6 h (estimate); owner-set, no ask. Replaces the 200 + 200 pair against Stockfish written by `…ad006634` / `…25a62150`.
- **Bars (answer 2):** C2' GAIN >= 50.0 and NEUTRAL >= 43.0 of 100 stand.
- **Smoke (answer 3):** 10 games against Stockfish, skytalix at 0.5 s a move, Stockfish at r's st=0.5, `r <build> <out> --elo E --rounds 5 --concurrency 1`, beside each strength-changing ticket's 100-game read and on the closing build at each epic close. S-1 and S-2 carried; its E and no-collapse bar at 0.5 s are the fold's (UNKNOWN - verify). ~10 min (estimate). Reverses `…25a62150`'s drop of the R smoke.
- **The owner's condition:** 100 ms and 0.5 s are harness config only, reaching skytalix as cutechess-cli st= at level 5, whose cap is above both (4 000 ms today, 3 000 ms at ca6e675c; src/levels.ts); no engine path keyed on a test control. Difficulty settings: see the observation of this task.
- **EPIC-010's close:** head-to-head (main after 1b vs ca6e675c) plus the 0.5 s smoke on the head; M2 stays graded on milestone 1's batch.
- **C13 void:** the close read has no Stockfish half, so ABC-256 (B0) does not merge into it. **C12 confirmed** (Orchestrator).
- **RISK-EPIC011-04 rises:** every routine read is now self-play but the 10-game smoke; the outside checks left are the smoke, the 40/15 claim and any milestone reading the fold keeps.
- **Edits:** EPIC-010 new top block plus four superseded markers (old per-epic bullet, close bullet, instrument bullet, merge-rule note). EPIC-011 new top block; old top-block markers; goal-table routine row; cheapest slice 1; phase row M0; § The per-change rule (R-smoke bullet struck; smoke, condition and head-to-head bullets added; old per-epic bullet marked); G7; close line; ticket rows 1-2; C12; C13; § Close-out EPIC-010; RISK-02 and RISK-04 dated lines.
