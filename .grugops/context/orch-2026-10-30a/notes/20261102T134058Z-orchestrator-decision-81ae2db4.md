---
id: 20261102T134058Z-orchestrator-decision-81ae2db4
kind: decision
by: orchestrator
at: 2026-11-02T13:40:58Z
verified_by: 
confidence: high
refs:
  - ADR-0059
  - ADR-0058
  - ADR-0025
  - ADR-0056
  - ADR-0057
  - ADR-0044
  - ABC-264
  - ABC-257
  - ABC-237
  - ABC-258
  - EPIC-011
  - NFR-009
supersedes: 
seal: sha256:3acb0470a56bb8b86251564dfad992102785042177b16401a105d5b3b8e6a131
---

OWNER ANSWERS (verbatim: "R yes, P yes, A accept, B park, C yes; 1 yes, 2 a, 3 c, 4 a, 5 no, 6 later").
- R: ADR-0059 (reverse futility) ACCEPTED -> ABC-264 part 2 (100 games at 100 ms vs base, GAIN >= 50.0; smoke 10 at 0.5 s vs E1650; Levels deep lane) then merge to local main.
- P: EPIC-011 Phase 1 TT strand PAUSED (ABC-237/258 parked, ABC-257 paused); pruning (phase 2) first.
- A: ADR-0058 ACCEPTED, NOT IN FORCE — switched on only if ABC-257 (T1+T3) meets A8' <= 0.93x.
- B: ADR-0025 T2 amendment PARKED with ABC-258 (larger table / threads).
- C: NEUTRAL bar (>= 43.0/100) allowed for changes invisible at 100 ms, alongside the ticket's own measured bar.
- ADR-0057 ACCEPTED with: OQ-1 yes (threads in EPIC-011 scope; reversal of ADR-0044 D5 for thread tickets accepted, amending ADR with the worker-pool ticket); OQ-2 (a) one game at a time, engine may use several cores within a game, all 100/400 reads stay Threads 1; OQ-3 (c) 40/15 claim read and reported for Threads 1 and Threads N separately, Threads 1 first; OQ-4 (a) NFR-009 counts retained search growth, not per-worker V8 baseline heap; OQ-5 no (no render group change; device strand parked); OQ-6 later (NNUE-on-CPU re-asked on the V4 trigger).
