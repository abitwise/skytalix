---
id: 20261024T092000Z-orchestrator-decision-1dc2eccc
kind: decision
by: orchestrator
at: 2026-10-24T09:20:00Z
verified_by: 
confidence: medium
refs:
  - ABC-203
  - ABC-213
  - NFR-008
  - N8-LANE
  - security-nfr-ABC-203/…eaaa1133
  - security-nfr-ABC-213/…62e47c24
  - owner-delegation-2026-10-22/…5aaf7cec
supersedes: 
seal: sha256:bbe32aacca18c1e25fb3608a5a4345221987441b894a18cd507b22b02cadcfea
---

# Two owed test-lane timing readings waived (delivery call, timing protocol is mine under …5aaf7cec)

Owner asked whether timing runs are still needed. Ruling per run:

- **WAIVED: `qe-timing-ABC-203` (N8-LANE).** It measures test-suite wall time, not engine behaviour. Page estimate ≤ 0.05 s against NFR-008's published headroom 1.065 s (~20x margin). `N8-SPAWN` is unchanged in `src/cli.test.ts`.
- **WAIVED: ABC-213 writer-child CPU median.** The writer child's whole test block is byte-identical base→head (Security/NFR `…62e47c24`): growth is 0 by construction. The 9 new in-process rows add roughly 0.07 s (Architect estimate, not a reading).
- **Accepted risk LOW (owner: Orchestrator):** test-lane wall time may have grown by ~0.1 s unmeasured; combined estimate is < 1/8 of the NFR-008 headroom. The next full-lane NFR-008 reading (any AC idle window) catches it. No bound moves.
- **Kept (they measure the change itself):** `qe-ABC-206` (the ticket's claim *is* a speed ratio), `qe-ABC-212` (real-clock budgets at levels 6/7 are the acceptance), `qe-ABC-204` and the ABC-205 D reading (clock-based engine games; a loaded host skews strength results).
- Consequence: ABC-213 no longer waits on a reading; it merges now with the ADR-0047 D4 line.
