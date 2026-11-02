# qe-ABC-264 firing rate at 100 ms (INFO, not a grade): cuts per node median 0.32 % startpos (d6), 3.66 % kiwipete (d4), 4.82 % position-6 (d6); the predicate cuts on 1.3 % / 78 % / 65 % of its tries

QE/E2E, task `qe-ABC-264`, as `ADR-0059` d10 asks: a scratch instrument, never a production counter. A copy of head's `src/` whose `src/engine.ts` calls `reverseFutilityCut` through a counting wrapper (tries and cuts by remaining depth); nothing else changed (diff recorded in `raw/qe-scripts/fire-instrument.diff`). **Instrument check:** the copy's `chooseMove` to 8 on kiwipete on a frozen clock gives **972 596** nodes, the probe's count, so the wrapper changes nothing. Tries = calls of the predicate (switch on, null-window node, after the table probe).

**100 ms, real clock, 5 fresh processes per board** (01:51:36-01:51:40Z, load1 0.32-0.45):

| board | depth (all 5) | nodes median | cuts median | cuts / node median (range) | cuts / try median (range) |
|---|---|---:|---:|---|---|
| startpos | 6 | 34 836 | 111 | **0.32 %** (0.25-0.36) | 1.27 % (1.01-1.42) |
| kiwipete | 4 | 65 261 | 2 388 | **3.66 %** (3.49-3.90) | 78.14 % (77.81-78.31) |
| position-6 | 6 | 57 115 | 2 752 | **4.82 %** (4.58-5.09) | 65.24 % (64.52-65.89) |

- By remaining depth (round 1): startpos cuts 141 / 0 / 0 at d1/2/3; kiwipete 2 345 / 43 / 0; position-6 2 324 / 403 / 22. Almost every cut is at remaining depth 1.
- **Frozen clock at the median depth (deterministic):** startpos d6 45 cuts / 23 768 nodes (0.19 %); kiwipete d4 1 750 / 27 239 (6.42 %); position-6 d6 2 690 / 43 859 (6.13 %); and kiwipete d6 13 480 / 235 381 (5.73 %), close to the ADR's 5.8 % at depth 6 on the 190.
- **Read plainly:** it fires at 100 ms on the two tactical boards and barely at the level start (the margin rarely holds in a level position, as the ADR's startpos 0.93x predicted). Kiwipete reaches only depth 4 in a cold fresh process at 100 ms; inside a game the process is warm and deeper, so the A6 read will see more firing than this table on that board (an expectation, `UNKNOWN - verify` until A6 reports its own rate).
