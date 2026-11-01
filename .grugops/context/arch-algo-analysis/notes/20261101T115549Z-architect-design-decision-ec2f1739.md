---
id: 20261101T115549Z-architect-design-decision-ec2f1739
kind: decision
by: architect-design
at: 2026-11-01T11:55:49Z
verified_by: 
confidence: high that nothing the owner owns is decided and that ADR-0055's fold follows his recorded word; low on every Elo estimate and on the 3 000 feasibility figure (informal bases, self-play, overlap); medium on the order (file collisions and costs are read from the records)
refs:
  - arch-algo-analysis
  - ADR-0055
  - ADR-0056
  - EPIC-010
  - EPIC-008
  - EPIC-004
  - ABC-231
  - ABC-232
  - ABC-233
  - ABC-234
  - ABC-236
  - ABC-237
  - ABC-238
  - ABC-239
  - ABC-205
  - ABC-207
  - ABC-208
  - ABC-209
  - ABC-210
  - ABC-215
  - ABC-204
  - ABC-249
  - ADR-0001
  - ADR-0003
  - ADR-0024
  - ADR-0025
  - ADR-0026
  - ADR-0048
  - ADR-0050
  - ADR-0051
  - NFR-005
  - NFR-009
  - G6
  - orch-2026-10-30a/20261101T120000Z-orchestrator-decision-74216a44
  - qe-EPIC-010-m1-batch-2/20261101T065538Z-qe-e2e-decision-1a53a7f9
  - qe-ABC-240/20261030T032110Z-qe-e2e-decision-19068f9d
  - sa-ideas-verify/20261029T200022Z-system-analyst-observation-306a4012
  - sa-ideas-verify/20261029T200049Z-system-analyst-decision-837e6fa8
  - owner-word-2026-10-26b/20261026T132424Z-orchestrator-decision-2ae5fc12
  - orch-2026-10-30a/20261030T180500Z-orchestrator-decision-65848126
  - orch-2026-10-29g/20261029T202809Z-orchestrator-decision-278e149b
  - arch-epic008-rd/20261029T195200Z-architect-design-decision-0c5d62f4
  - https://raw.githubusercontent.com/algerbrex/blunder/main/docs/changelog.md
  - https://www.chessprogramming.org/Texel%27s_Tuning_Method
  - https://talkchess.com/viewtopic.php?p=842843
  - https://database.lichess.org/
  - bae25131
  - grugops/arch-algo-analysis
supersedes: 
seal: sha256:31e4f6894dd8fadd396d4e3d1b42dac074d0c41abfe316a9336b9bad2995e713
---

# Architect/Design, arch-algo-analysis: ADR-0055 ACCEPTED (O1) by dated line; ADR-0056 PROPOSED (the classical path toward 3 000: an SPRT lane first, then TT, pruning, ordering, a tuned tapered eval, interleaved with O1). Nothing decided that is the owner's

Records and reading only, at `main` `bae25131`. Nothing run, built, benchmarked or played (`qe-ABC-223` holds the host ALONE). Branch `grugops/arch-algo-analysis`.

## ADR-0055 status fold (on the owner's word, `orch-2026-10-30a` `…74216a44`)
- Status **ACCEPTED (O1)** 2026-11-01. O2/O3 not pursued now; O4 not taken. The D3 prototype is not run (Q-SP-1 answered no by the choice; Q-SP-4/5 fall away; Q-SP-2 binds only an O1-b A1/A0 reading if one is taken). Each O1 ticket is graded on its own S2 reading.
- O1-d waits the owner's yes on amending `ADR-0003` (Q-SP-3); O1-e stays "not now". Accepted: D1's O1 rows, D2, D6's O1 bullet. Not pursued: D3, O2/O3 rows, D4 items 1/4/5.

## ADR-0056 PROPOSED — the answer to "is 3 000 reachable without a neural network?"
- **Today:** ≈ 2 074 on R's scale (72.00 % vs Stockfish 19 E 1 910; `…1a53a7f9`). The "8× time odds" is nominal: limited Stockfish picks at depth 1 + level (`ABC-204`), so its strength is depth-pinned. Two consecutive outside readings after value changes have negative point estimates (EPIC-008 close −82.9 ± 73.8; milestone 1 −58.3 ± 77.9); cause `UNKNOWN - verify`.
- **Feasibility:** reachable for classical engines in principle (Stockfish 11 HCE ≈ 3 430 CCRL 40/15). For a single-threaded TS engine, 3 000 is beyond the best public precedent found (tomitankChess 4.0, pure JS HCE, 2 820 ± 27 CCRL 40/15). D2's rows sum to ≈ +520..+1 330 self-play (estimates); discounted × 0.5–0.7 → central landing ≈ 2 550–2 800 on R's scale, 3 000 at the optimistic edge. Stretch goal; needs essentially all gaps, a tuned eval, an instrument that sees +5..+20 Elo, and likely speed beyond O1. Probability with O1 alone: low (judgement, < 1 in 4). Confidence: low.
- **Top gaps by Elo per cost (estimates):** P2 reverse futility (+30–60, S), P1 log-table LMR (+40–100, S–M), P4 move-count pruning (+20–40, S), T1 TT cutoff at stored depth ≥ requested (+15–40, M, `ABC-238`); then E1 full taper + E2 tuning (+140–370 together, M + L; `ABC-231`/`232` are subsets of E1, `ABC-239` is E2); then history (`ABC-233`), T2/T3/T4, SEE pruning, aspiration (`ABC-236`); then eval terms, singular extensions, staged generation, bitboards (later, owner's).
- **Measurement (D5):** a named scale (proposed: Stockfish 19 `UCI_Elo`, ≈ CCRL Blitz ± 100 by its own calibration, cap 3 190) at a fixed skytalix time (proposed 4 000 ms a move for the trend, one 120 + 1 reading at the claim); Stockfish `st` raised to equal time because E ≈ 3 000 needs pick depth ≈ 18–20 (`UNKNOWN - verify`); E stepped by `ABC-204`'s band rule; milestones 2 200 / 2 400 / 2 600 / 2 800 / 3 000, each MET by a 200-game reading at E = M scoring ≥ 50 %. Per-change: a new SPRT self-play lane (M0); smokes stay as the fault/time/collapse guard.
- **Order (D6):** Phase 0 O1-a → O1-b/c (value-identical) ∥ M0 (`tools/`) ∥ owner calls ∥ `ABC-249`; Phase 1 TT (T1 `ABC-238` → T2 `ABC-237` → T3 `ABC-209` re-try → T4); Phase 2 pruning (P2 → P1 → P4 → P3 → P5 → P6); Phase 3 ordering (`ABC-233` → countermoves → `ABC-234` → SEE/delta pruning) and aspiration (`ABC-236`); Phase 4 eval (E1 → E2 `ABC-239` → E3–E7); Phase 5 extensions, time use, O1-d on the owner's yes, staged generation. R milestone readings after Phases 2, 4, 5.

## Owner calls (D7) — none decided here
- Q-3K-1 scale and time a "3 000" is read on; Q-3K-2 adding/replacing his Q4 = (e) per-change rule with an SPRT verdict; Q-3K-3 width (SPRT at width 1 is ≈ 10–30 h a test, estimate); Q-3K-4 `G6` "≥ base" for value-changing tickets (keep NFR-005's floor 6 and WARN 7, judge on play); Q-3K-5 scope (new epic or EPIC-010 widened; re-opens fenced re-tries of ABC-209/210, SEE/delta pruning, rook activity); Q-3K-6 `NFR-009` above 16 MiB (he pre-offered 128 MiB 2026-09-25); Q-3K-7 tuning data (own games allowed by default; Lichess exports CC0; a Stockfish-evaluated set is a product-identity question); Q-3K-8 later, re-opening `ADR-0001` (bitboards).

## For BA/PM and the Orchestrator
- `ABC-231`…`ABC-239` all still stand; none is done; none is obsolete. `ABC-231`/`ABC-232` are subsets of a full taper (E1). New tickets only on the owner's yes (D8). The sibling hop `bapm-goal3000-o1-cut` cuts O1; this ADR's Phase 0 puts O1-b before any ticket that edits `orderMoves`, `negamax` or `evaluate`.
