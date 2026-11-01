---
id: 20261101T135000Z-orchestrator-decision-aab3b5f4
kind: decision
by: orchestrator
at: 2026-11-01T13:50:00Z
verified_by: 
confidence: medium
refs:
  - memory-bank/50-decisions/ADR-0056
  - plans/epics/EPIC-011
  - .grugops/queue/pending/qe-tc-depth-probe.md
supersedes: 
seal: sha256:3235508b1e8f30697e14dafd4973972e1c4ae383e24e34d0f532e8f904bbbc9e
---

# Owner word 2026-11-01: SPRT approved in principle; minimise time; ask if a run > 1 h; per-epic option

Owner, verbatim: "SPRT - ok in principle i approve, select the most optimal per solution, reduced thinking time to the level that gives mostly yes validity and amount of games also as low as possible, calculate how much time each run would take and if anything is over 1hr ask from me (the human). Another option would be to validate per epic?"

Standing rule from this word: **any validation run estimated over 1 h on the host goes to the owner before it starts.**

Orchestrator arithmetic (estimates; logistic Elo, α = β = 0.05, LLR bound ln 19 ≈ 2.94, per-game variance ≈ 0.2 at ~20 % draws, 1 Elo ≈ 0.00144 score near 50 %; games/hour UNKNOWN - verify, assumed ~300 at 100 ms, ~180 at 250 ms, ~70 at 500 ms, pending qe-tc-depth-probe):
- SPRT [0, 10]: ≈ 800 games if the change is +40, ≈ 1 900 at +20, ≈ 5 700 at 0 or +10 → 2.7 h / 6.3 h / 19 h even at 100 ms. Over 1 h → owner.
- Under 1 h at 100 ms means ≤ ~300 games, which resolves only effects of ~±50 Elo or more (e.g. SPRT [0, 50] ≈ 230 games at either hypothesis).
- A phase bundle (several changes, expected +60…+150 together) against the previous phase resolves in ~100–400 games: under 1 h at 100 ms, ~2–6 h at 500 ms.
Proposed answer put to the owner: hybrid — per change: tests + a ≤ 1 h 100 ms regression screen (catches breakage ≥ ~50 Elo, does not prove a gain); per EPIC-011 phase: one SPRT/fixed reading of the bundle at the control the probe shows valid (bisect only if a phase under-reads); milestone readings vs Stockfish as ADR-0056 (each > 1 h → asked each time). His choice pending.
