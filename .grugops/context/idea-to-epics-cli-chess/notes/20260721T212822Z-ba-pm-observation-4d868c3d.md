---
id: 20260721T212822Z-ba-pm-observation-4d868c3d
kind: observation
by: ba-pm
at: 2026-07-21T21:28:22Z
verified_by: 
confidence: medium
refs:
  - EPIC-001
  - EPIC-002
  - EPIC-004
  - EPIC-005
supersedes: 
---

Five known risks carried into the backlog. Recorded as an observation, not a finding — none is verified yet, and the two that matter are resolved by work, not by analysis.

**RISK-001 — Move-generation edge cases (EPIC-001). Severity: high.** Chess rules hide brutal corner cases: en passant, castling through/out of/into check, castling-rights loss, pinned pieces, under-promotion, threefold repetition, the fifty-move rule. A subtle generator bug does not look like a crash — it silently invalidates every game played on top of it, including the engine's own search. *Mitigation*: build the perft harness alongside the generator, not after it, and gate on exact node counts at published depths. Zero tolerance; a near-miss perft count is a failing perft count.

**RISK-002 — Node/JS search throughput may cap strength (EPIC-004). Severity: high; this is the one that can invalidate a product decision.** The ~1400-1700 target needs a certain search depth within the per-move time budget. If TypeScript on Node cannot reach it, either the strength target or the stack choice has to move. *Mitigation*: a short timeboxed spike that measures nodes/sec **before** EPIC-004's full build commits to a design. Run this early — it is the cheapest way to find out that decision 3 needs revisiting.

**RISK-003 — Strength is hard to verify without a reference opponent (EPIC-004). Severity: medium.** "Is it really 1500?" has no cheap answer offline. *Mitigation*: a fixed tactical-puzzle suite as a regression gate plus a self-play ladder for relative strength. Absolute Elo stays `UNKNOWN - verify` until measured against a rated reference; do not claim a number the project has not measured.

**RISK-004 — Opening-book licensing (EPIC-005). Severity: medium, but cheap to get wrong expensively.** Book data must come from a source whose licence permits redistribution. *Mitigation*: resolve the source and its licence in EPIC-005's **first** ticket, before any data is copied. Copying first and checking later is the failure mode.

**RISK-005 — Terminal rendering portability (EPIC-002). Severity: low.** Unicode chess figurines and colour rendering vary across Windows Terminal, iTerm2, tmux, and CI. *Mitigation*: the ASCII fallback ships from the first render ticket rather than being retrofitted.
