---
id: 20261101T122732Z-architect-design-observation-85621c95
kind: observation
by: architect-design
at: 2026-11-01T12:27:32Z
verified_by: 
confidence: high on the quoted records and on the sf_19 formula (web, read 2026-11-01); low on the estimates listed as such
refs:
  - arch-adr0056-owner-fold
  - ADR-0056
  - ADR-0055
  - ADR-0053
  - EPIC-011
  - EPIC-010
  - EPIC-009
  - EPIC-008
  - ABC-249
  - ABC-250
  - ABC-251
  - ABC-252
  - ABC-253
  - ABC-254
  - ABC-222
  - ABC-223
  - ABC-204
  - ABC-231
  - ABC-239
  - ABC-209
  - ABC-210
  - ABC-205
  - ABC-207
  - NFR-004
  - NFR-009
  - G6
  - orch-2026-10-30a/20261101T124000Z-orchestrator-decision-022fb66f
  - orch-2026-10-30a/20261030T180500Z-orchestrator-decision-65848126
  - orch-2026-10-28a/20261028T210902Z-orchestrator-decision-5dbd717b
  - qe-ABC-222/20261031T025128Z-qe-e2e-observation-00cc4db1
  - qe-EPIC-010-m1-batch-2/20261101T065538Z-qe-e2e-decision-1a53a7f9
  - arch-algo-analysis/20261101T115549Z-architect-design-decision-ec2f1739
  - bapm-epic011-dedupe
  - https://raw.githubusercontent.com/official-stockfish/Stockfish/sf_19/src/search.h
  - 2e9a2457
  - grugops/arch-adr0056-owner-fold
supersedes: 
seal: sha256:dac89a8cbd79ae638169f275d121a144e2deb0d859b71629468911ea501f0238
---

# Architect/Design, arch-adr0056-owner-fold: the facts the 40/15 plan and the fast controls rest on

Read from the records and the web on 2026-11-01. Nothing was run on the host.

## From the records
- **Owner word:** `orch-2026-10-30a` `…022fb66f`. The claim is read at 22 s a move or 40/15, not at 4 s. Routine readings may be shorter, down to 0.5 s a move. A new epic comes after the open epics close. Dedupe.
- **Width 1 for heat:** `…65848126`. At width 2, Tctl read a median of 87.05 °C, and the owner approved one game at a time.
- **`ABC-222` (40/15 self-play, `simple-tournament`, width 1):** 5 games in 3.44 h, about 41 min a game, with an 80-move cap. Tctl median 73.9 °C, max 76.1 °C, frequency fall ≤ 0.01 %. 0 time losses; the closest call was 19 991 ms. The A7 thermal rule is a sampler ≤ 60 s plus a 5 % frequency fall → UNRESOLVED, re-run once.
- **Milestone 1 R pair (`ADR-0053`):** 400 games in 22.22 h at 18.0 games/h, 0 thermal pauses. That is about 200 s a game at skytalix 4 s and Stockfish `st=0.5`. It is the longest clean run at width 1 on record.
- **R today:** 72.00 % ± 6.11 against E 1 910, about 2 074 (`qe-EPIC-010-m1-batch-2` `…1a53a7f9`). The ± 6.11 points at 200 games is about ± 42 Elo at 50 %.
- **`EPIC-009` modes:** `simple-tournament` uses min(22 s, clock share), with M1 and M2 MET at `ABC-222`. `uci-clock-mode` uses min(59.5 s, clock share), and its reading is `ABC-223`, running now. Neither has soft/hard limits or a doomed-iteration test (ADR-0056 inventory, Time use row).
- **`ABC-204` § Q2:** limited Stockfish picks at depth 1 + int(level) and keeps the move. The depth guard makes a reading UNRESOLVED. The probe read depth 12 at 250 ms on the previous host (Apple M3); the host moved to Linux on 2026-10-28 (`orch-2026-10-28a` `…5dbd717b`).
- **Board / `ADR-0055`:** the queue is qe-ABC-223 → ABC-249 → ABC-250 → (ABC-251/252) → ABC-253. `ADR-0055`'s fold made D4 item 2 "ordered by BA/PM's cut". Original D4 item 2: O1-d (if amended), then O1-b + O1-c, then O1-a. `ABC-250` bar ≥ 1.25×; `ABC-253` bar ≥ 1.02×, "pull after the O1-b tickets".

## From the web (Stockfish `search.h` at tag `sf_19`, raw.githubusercontent.com/official-stockfish/Stockfish/sf_19/src/search.h)
- LowestElo 1320, HighestElo 3190.
- `level = clamp((((37.2473*e - 40.8525)*e + 22.2943)*e - 0.311438), 0, 19)`, with e = (E − 1320)/(3190 − 1320).
- `time_to_pick(depth)`: depth == 1 + int(level).
- **Computed by hand:** E 2 200 → 5.01 (depth 6); 2 300 → 5.51 (6); 2 400 → 6.11 (7); 2 600 → 7.75 (8); 2 800 → 10.21 (11); 2 900 → 11.83 (12); 3 000 → 13.75 (14); 3 190 → 18.38 (19). This reproduces `ABC-204`'s 2.56 at 1 650 and depth 5 at 2 000.

## Estimates (not readings; `[J]` = Architect judgement)
- **SPRT game counts:** normal approximation of the logistic SPRT, per-game score variance ≈ 0.175 (about 30 % draws), 1 Elo ≈ 1/695 of score at 50 %, LLR bounds ± 2.94. For [0, 10]: true +40 ≈ 710 games, +30 ≈ 1 000, +20 ≈ 1 650, +10 ≈ 5 000, +5 ≈ 7 300, 0 ≈ 5 000, −10 ≈ 1 650. [0, 5] costs about 4× as many. Pentanomial pairing would lower these somewhat (`UNKNOWN - verify`).
- **Games/h at 0.5 s self-play:** ≈ 65–80 (about 90 plies × 0.5 s + start-up), `UNKNOWN - verify`.
- **skytalix depth at 0.5 s:** ≈ 5–6, `UNKNOWN - verify`.
- **4 s → 40/15 offset:** ≈ +120–250 (2.5 doublings × 50–100, with diminishing returns), low confidence. C4 measures it.
- **Futility threshold:** SE at 100 games ≈ 4.4 points, so 2 SE under 50 % is ≈ 41 %.
