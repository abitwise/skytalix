---
id: 20261101T165507Z-software-engineer-decision-8953bec7
kind: decision
by: software-engineer
at: 2026-11-01T16:55:07Z
verified_by: 
confidence: high
refs:
  - ABC-255
  - EPIC-011
  - EPIC-010
  - ADR-0056
  - grugops/ABC-255
  - 78cd2415
  - 8f2fc9b5
  - tools/rating/rating.ts
  - tools/rating/pair-check.ts
  - C2′
  - C3″
  - S′
  - R-TC
supersedes: 
seal: sha256:8bcf03e56a1f7929c35ef5954b6145b57a2cd020859fecb07d7dbd052c85ec0b
---

# SE decision, se-ABC-255: one margin rule, r takes only 500, the control recorded only when short

- **Margin rule.** `timemarginMs(ms)` (exported) returns a fixed 50 ms for the two short budgets (`SHORT_MARGIN_MS`: 100 for C2′/C3″, 500 for S′) and Q1's 5 000 − budget for every other. `sky()` uses it for every engine group, so `r` at 4 000 (1 000), `rpair` (1 000) and `d` at 3 000–1 000 are unchanged by construction. Stockfish's `st=0.5` / `timemargin=2000` are literals in the opponent group and untouched.
- **`d`.** `D_BUDGETS_MS` gains 100; `d --budget-ms 100` gives both sides `st=0.1 timemargin=50`. The round counts are the caller's (`--rounds 50` change read, `--rounds 200` = d's default, epic read); no new opening file.
- **`r`.** `--budget-ms` is now accepted by `r` (it was a usage error). Absent, the budget is `R_BUDGET_MS` = 4 000 as before. Present, any value but 500 is refused (exit 1, "--budget-ms V: r takes only 500"), so `r --budget-ms 4000` is refused too (A2: "a value other than 500"). `cutechessArgs` now takes skytalix's ms from `spec.budget` for both modes instead of the hard `mode === "r" ? 4000`; `rpair` passes `R_BUDGET_MS` explicitly and accepts no new flag.
- **Records (scope 3).** `machine.txt` gains one `control: skytalix[ and base] st=… timemargin=…` line only when a short control is used; every other run's records stay as they were. `cmd.txt` already holds the full vector.
- **Not done (fences).** No Elo/pass-line maths, no SPRT, no `rpair` control, no width change, no `src/`/`data/` line, no dependency change. No real game run (A3–A5 are QE's).
- **Deviation from the page:** none. The flag spelling `--budget-ms` on `r` is the page's A2 shape.
