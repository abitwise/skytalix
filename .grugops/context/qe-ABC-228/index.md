<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-ABC-228

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-30T07:25:48Z | decision | qe-e2e | high: written before any timed read, value reading or game; bars copied from the ticket, ADR-0053 d9 and EPIC-010 § The merge rule |  | # qe-ABC-228 PREREG: what QE reads, how, and what passes, sealed before any timed run or game |
| 2026-10-30T07:33:01Z | observation | qe-e2e | high: deterministic readings on QE's own trees with QE's own reference; checkpoint before the timed reads and games |  | # qe-ABC-228 checks, part 1: the Q-SET freeze-review, the A1 identity, lint / typecheck / build |
| 2026-10-30T09:14:56Z | decision | qe-e2e | high: verdict applied mechanically from the sealed PREREG section 7 to the readings |  | # qe-ABC-228 verdict: FAIL (STOPPED at G6, position-6 9 < 10). The smokes were not played; the Orchestrator routes (ii). The npm-exec slip is LOW |
| 2026-10-30T09:14:56Z | observation | qe-e2e | high: 20 clean interleaved real-clock reads, wait-clear before each; base 10 x5 vs head 9 x4 + 10 x1 on position-6 |  | # qe-ABC-228 G6 NOT MET on position-6 (head median depth 9 < base 10): STOP before the smokes; G11 reported |
| 2026-10-30T09:14:56Z | observation | qe-e2e | high: a pointer to files committed on the QE branch (recorded as an observation: an artifact-ref needs §14-gate provenance this run does not have) |  | # qe-ABC-228 artifacts, session 2: where the records are |
| 2026-10-30T09:14:56Z | observation | qe-e2e | high: every lane and gate run in this session on the candidate; G8 interleaved with wait-clear before each run |  | # qe-ABC-228 checks, part 2: npm test and skips, the deep lanes (G1, G5, G7, A4), G8 |
| 2026-10-30T09:16:59Z | observation | qe-e2e | high: a file-name pointer; contents unchanged |  | # qe-ABC-228: the four `.log` records are committed as `.log.txt` |
