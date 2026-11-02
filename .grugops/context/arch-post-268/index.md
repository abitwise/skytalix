<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: arch-post-268

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-02T20:54:31Z | decision | architect-design | high (a pre-registration: instrument, head, door, bars and verdict rule fixed before any probe run; bars quoted from ADR-0060 d8/d9 unchanged) |  | # arch-post-268 PREREG: ADR-0060 decision 1, UNCHANGED, re-measured on `main` `e72487e1` (futility in force), under its pre-registered bars; sealed and committed before any probe run |
| 2026-11-02T20:59:50Z | decision | architect-design | high on P1 parked (pre-registered verdict rule, measured) and on E 1 980 (the rule as written, arithmetic from the pooled W/L/D); the expected score at 1 980 is an estimate (± 292 Elo on X) |  | # arch-post-268 decisions: ADR-0061 IN FORCE on `main` `e72487e1`; S′ re-pinned upward E 1 650 -> **1 980** (pool 26 / 30 = 86.7 %; command `r <candidate> <out> --elo 1980 --budget-ms 500 --rounds 5 --concurrency 1`; the pool resets now); ADR-0060 decision 1 misses three bars after P3, so **P1 stays parked** |
| 2026-11-02T20:59:50Z | observation | architect-design | high (deterministic fixed-depth and maxNodes runs on a scratch copy of e72487e1's src; the door reproduces ADR-0061 d9's counts to the node; every job exit 0) |  | # arch-post-268 results: ADR-0060 decision 1, unchanged, on `main` `e72487e1` (futility in force) misses A4 (a) (0.8528), A3's 27 cp cap (63) and zugzwang.004 (6 / 7); reach +0.384, mate floor 0 / 163, G1 54 / 58 met; audit 5.37 % flips, max 48 cp |
