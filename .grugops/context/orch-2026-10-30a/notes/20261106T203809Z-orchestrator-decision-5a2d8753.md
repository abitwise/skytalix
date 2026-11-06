---
id: 20261106T203809Z-orchestrator-decision-5a2d8753
kind: decision
by: orchestrator
at: 2026-11-06T20:38:09Z
verified_by: 
confidence: high
refs:
  - ABC-291
  - ADR-0075
  - ADR-0072
  - qe-ABC-291-k1/20261106T203639Z-qe-e2e-observation-b850a2ad
  - qe-ABC-291-k1/20261106T203639Z-qe-e2e-observation-a223d29a
supersedes: 
seal: sha256:7d7cdce6f81c880d36372ec8526c0e8dd45a7ca4b2d0744a84ef9c1a6eb080cf
---

# QE's K1 read taken: all named rows added; drift is no defect, so the Architect's re-pins stand

- Checked: blind note committed at 4948aad0 first; branch holds records only against 63af973e; path check clean.
- qe-ABC-291-k1's branch carries ABC-291's src, so it merges into grugops/ABC-291, never straight into main.
- K1 (c) names d1's exclusions, and double step and en passant have no row, so the letter is unmet until N13, N14, N16, N17 land. I take QE's whole gap table, not its minimum: the rows are cheap units and 13 of 31 mutants passed SEAM_ROWS. se-ABC-291-k1rows runs after the repair, in the same worktree.
- Drift: F1 does not fire, no production line moves, …2d2c2bad § 1's lines stand. M3 (ADR-0072) moved the figure; its mechanism is `UNKNOWN - verify`, and whether it costs play is C2′'s to price. Whether PR10's figure earns a dated line goes to the next Architect hop.
