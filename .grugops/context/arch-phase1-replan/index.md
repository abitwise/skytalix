<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: arch-phase1-replan

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-02T00:02:40Z | decision | architect-design | high on the evidence; the pause changes ADR-0056 D6's Phase 1 order, so the Orchestrator carries it to the owner with the ADR answers |  | # Ruling: pause EPIC-011's Phase 1 TT strand. A combined T1+T3 attempt is defined, with its bar pre-registered, and resumes only on a read that can see it. Next: Phase 2's P2 (reverse futility) |
| 2026-11-02T00:02:40Z | observation | architect-design | high on the store fraction and the 2^14 readings; the 40/15 store counts are arithmetic from qe-tc-depth-probe ...1889e3b0 R1 and EPIC-011's node figures |  | # Table pressure is about 20x lower than ADR-0025's T2 arithmetic; T2 pays only on a loaded table (0.77x at 2^14); kept entries do cut under exact depth (17-23 % of exact cuts) |
| 2026-11-02T00:02:40Z | observation | architect-design | high on the counts (an exact per-hit decomposition, 0 mismatches); medium on the mechanism reading |  | # Why deeper entries are rare: each source searches shallow first; LMR transpositions make 65-80 % of deeper cuts and transpositions across plies 20-35 %; eviction loses almost none |
| 2026-11-02T00:02:40Z | observation | architect-design | high: deterministic fixed-depth readings under the host lock; the instrumented tree reproduces se-ABC-238's node counts to the node (1 109 987 / 1 116 785, 1 595 656 / 1 602 457) and its d6 hit count (262 545) |  | # arch-phase1-replan: the four variants measured. T1 alone 0.994x, T1+T2 0.994x, T2 alone 1.000x at fixed depth 8; T1+T2+T3 across a short game 0.885x pooled |
