---
id: 20261101T153533Z-ba-pm-decision-cc9d51ed
kind: decision
by: ba-pm
at: 2026-11-01T15:35:33Z
verified_by: 
confidence: high for the scope against the owner's word and the harness as read (tools/rating/rating.ts: D_BUDGETS_MS, r at 4000 ms, rpair reusing r's vector with Skill Level 6); the 0.5 s margin and the smoke's E may be named by the owner-answers fold
refs:
  - bapm-owner-answers
  - ABC-255
  - EPIC-011
  - EPIC-010
  - ADR-0056
  - ABC-204
  - ABC-225
  - ABC-247
  - ABC-208
  - C12
  - 47f0c1a0
  - adab5f0d
  - orch-2026-10-30a/20261101T152518Z-orchestrator-decision-43098cef
  - bapm-100-400-rule/20261101T152524Z-ba-pm-decision-33d46616
supersedes: 20261101T152524Z-ba-pm-decision-33d46616
seal: sha256:e186b6733f3726587e65208288b38658d8c491ca4cff8df51de6524109cf7793
---

# ABC-255 re-scoped again: d at 100 ms for the 100-game change read and the 400-game head-to-head epic read; the 0.5 s skytalix control on r and rpair for the smoke; the 100 ms control on rpair/r dropped; a no-engine-change row; size S; DoR 10/10 -> 9/10

BA/PM, task `bapm-owner-answers`, pages commit `47f0c1a0`. Supersedes `…33d46616` (written for the 200 + 200 Stockfish epic pair).

- **Scope:** (1) `d --budget-ms 100`, timemargin 50 at that budget, every other budget unchanged; change read --rounds 50, epic read --rounds 200 (head vs base). (2) r and rpair accept a 0.5 s skytalix control (st=0.5, margin fixed at design or by the fold); Stockfish keeps st=0.5, timemargin 2000; smoke = r --rounds 5 --concurrency 1. (3) Records as ABC-204 / ABC-225.
- **Dropped:** the 100 ms control on rpair and r (the epic read no longer plays Stockfish); re-added only if the fold keeps a 100 ms Stockfish reading (C1 claim timing, C4 anchors, a milestone reading).
- **Acceptance:** A1 d dry runs at 100 ms for --rounds 50 and 200, existing budgets byte-equal; A2 r and rpair dry runs at 0.5 s (rpair's Skill Level 6 unchanged), defaults byte-equal; A3 sanity read on b5c67ab7 (reported); A4 identical pair (reported); **A5 one real 10-game smoke on main at 0.5 s, ~10 min, 0 faults, 0 time losses, reported, not graded**; **A6 the owner's condition: git diff --name-only <base> <head> -- src/ data/ empty, and the control reaches skytalix only as st= / timemargin=**; A7 gates; A8 reading.
- **DoR 9/10:** row 5 waits on the owner-answers fold (arch-adr0056-owner-answers, not on main), which may name the 0.5 s margin and the smoke's E. Row 10 met by C12 (confirmed). Ready once the fold merges without changing the shapes; the column move is the Orchestrator's.
