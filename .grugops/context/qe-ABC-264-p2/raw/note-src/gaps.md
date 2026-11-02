# qe-ABC-264-p2 gaps (part 2): QE-264-p2-a HIGH (A6 NOT MET, 44.0 < 50.0, blocks the merge), QE-264-p2-b INFO (the harness labels 44.0 "NEUTRAL"), QE-264-p2-c INFO (colour asymmetry); QE-264-b LOW carried

| id | severity | owner | gap |
|---|---|---|---|
| **QE-264-p2-a** | **HIGH (blocking)** | Orchestrator / Architect | `ABC-264` `A6` **NOT MET**: 44.0 / 100 at 100 ms against base `0b73f51d` (bar 50.0, GAIN). The ticket's falsifier and `ADR-0059` F5 apply: not merged, and the ADR gets a dated "accepted, not in force" line (the Architect's). Not re-played (the ticket). The interval (-41.9 +/- 58.5 Elo) does not exclude a small gain. The rule allows no second read, so any re-try is a new decision (a new ticket or an ADR amendment such as F1's 150 cp fallback), and that decision is the owner's or the Architect's, not QE's. |
| **QE-264-p2-b** | INFO | BA/PM / tools | `tools/rating/rating.ts d` prints `state: NEUTRAL` for 44.0. That is the C3″/NEUTRAL band (>= 43.0), which the owner allowed (answer C) only for changes invisible at 100 ms. For a change that fires at 100 ms the label can be misread as a pass. The ticket's GAIN bar governs (`ADR-0059` d10; part-1 firing rate). |
| **QE-264-p2-c** | INFO | Architect | The candidate scored 0.360 as White and 0.520 as Black, over 50 games each. This is noise-sized at n=50, recorded for the next reading, not a finding. |
| QE-264-b | LOW (carried) | Architect / BA-PM | Part 1's records gap (the static-score mate-band argument). Still open; no change in this hop. |

Not covered by this hop: nothing in the brief was skipped. The firing rate at 100 ms was not re-measured (the PREREG cites part 1).
