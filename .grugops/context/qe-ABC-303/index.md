<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-ABC-303

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-06T13:57:02Z | decision | qe-e2e | high: rows and CF1-CF10 copied from ADR-0056 before any run; two points held open, not chosen |  | # qe-ABC-303 PREREG, ABC-303 bundle 1. The premises are not met and were overridden by the owner's word (`ADR-0072` L2's drift and audit rows, `ADR-0073` CH3; `orch-2026-10-30a` `…3e73f9f9`). Sealed before any run. **Two lines hold every game: see § 0** |
| 2026-11-06T14:06:59Z | decision | qe-e2e | high: the page and CF lines were read for the point and hold no line on it; nothing played |  | # qe-ABC-303 STOP before the first game: no C2′, S′ or Levels run has happened. Two questions need an answer on the record, and QE chooses neither. Nothing is a miss and nothing is spent |
| 2026-11-06T14:06:59Z | observation | qe-e2e | high: count rows read as sealed; P6, P7, R5 not read; R2 hooks are the engineer's |  | # qe-ABC-303 count rows: every count row of tables 1 and 2 is met, and table 3's count rows equal the figures on `0cc9afd1`. P6 and P7 are not read, so table 2 is not whole and the read may not start |
| 2026-11-06T16:53:15Z | decision | qe-e2e | high: FL and W copied from the ADR block, Q2 and W's drop from the brief and the Orchestrator's note; the clock and the reading of busy stated before any run |  | # qe-ABC-303 ADDENDUM to PREREG `…53858301`: FL fills H1, W is dropped by its recorded line, Q2 is ruled timing first. Sealed before any run of this hop. No bar moves, no word of CF1–CF10 moves |
