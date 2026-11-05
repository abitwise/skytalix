<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: secnfr-nfr004-1105

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-05T12:20:45Z | observation | security-nfr | high on the figures: recomputed from moves.tsv, 606 of 606 budgets reproduced, logs match SHA256SUMS; medium on the host label, which QE's notes do not spell; nothing run |  | # secnfr-nfr004-1105 readings: the 60 s clause has 5 QE readings at the hard stop and a longest move of 59 501 ms in play; overshoot max +3.9 ms, at a 23 s budget, not at the cap. Both triggers (≥ 59 900 ms, past ~31 ms) stay unfired |
| 2026-11-05T12:21:58Z | decision | security-nfr | high on the cell and the re-acceptance, which rest on recomputed records and the risk's own test; the no-change rating is Security/NFR's judgement; nothing run |  | # secnfr-nfr004-1105 decision: PASS_WITH_RISKS. `NFR-004`'s 60 s clause reads MET on the real clock, its `UNKNOWN - verify` struck and kept; `AR-NFR004-A` re-accepted with its number, with QE-223-d's +2.5 ms and A4's +3.9 ms; no rating changes; neither trigger fired |
