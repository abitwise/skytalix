<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: arch-g8-headroom

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-30T22:34:15Z | decision | architect-design | high on the mechanism (ADR-0027 cost model, ADR-0046 D2(b) precedent) and the SEC-REBASE-b reading; savings and queue costs are estimates, UNKNOWN - verify until the remedy ticket's QE gate reads them |  | # Architect/Design decision, arch-g8-headroom: win the headroom back with option (a). Time-blind virtual-clock rows take the coarsest kill-set-preserving step (`ADR-0046` § Addendum 2026-10-30, PROPOSED), target `G8` ≤ 9.4 s. `load1 ≤ 8` stands on the 24-CPU reference (`SEC-REBASE-b`). No owner question |
| 2026-10-30T22:34:15Z | observation | architect-design | high for figures copied from qe-ABC-229 / qe-ABC-220 raw records; the row-level and collect split is from QE's G8 run-6 JSON report (sha256 54ae234d…), shape only and not admissible; nothing run or timed at this hop |  | # Architect/Design observation, arch-g8-headroom: the default lane's cost by file at `ABC-229` (9.90 s), and why `src/uci-session.test.ts` costs 2.0 s on a virtual clock |
