---
id: 20261102T135100Z-architect-design-decision-a0df22b8
kind: decision
by: architect-design
at: 2026-11-02T13:51:00Z
verified_by: 
confidence: high on the answers; the order and the TH-2 design choices are recommendations, the Orchestrator's and BA/PM's to set
refs:
  - arch-owner-answers-1102
  - grugops/arch-owner-answers-1102
  - 7daf8086
  - orch-2026-10-30a/20261102T134058Z-orchestrator-decision-81ae2db4
  - EPIC-011
  - ADR-0057
  - ADR-0044
  - ADR-0025
  - ADR-0056
  - ADR-0026
  - ABC-263
  - NFR-009
  - NFR-008
  - NFR-005
  - NFR-004
supersedes: 
seal: sha256:acde3ba06df91d9b06a44fa0e1791180cd874a158425aa8ccc2f0081fb32b82d
---

# ADR-0057 ACCEPTED (OQ-1 yes, 2 a, 3 c, 4 a, 5 no, 6 later). Threads sit after Phase 2 and R1, before Phase 3, TH-1 pullable beside Phase 2; inputs for three thread tickets

Architect/Design, task `arch-owner-answers-1102`, from `main` `7daf8086`; owner `…81ae2db4`. Records only. Full text: `ADR-0057` § Status, D6's dated line, § Inputs for the thread tickets; `ADR-0056` D6 dated line.

- **Answers:** OQ-1 yes (threads in `EPIC-011` scope; "Threads" half of § Out of scope lifted, pondering stays out; `ADR-0044` D5 reversal accepted, amending ADR with the worker-pool ticket). OQ-2 (a) one game at a time, several cores inside a game, every 100/400 read at `Threads 1`. OQ-3 (c) 40/15 claim read for `Threads 1` and `Threads N` separately, `Threads 1` first, each labelled "1 CPU"/"N CPU". OQ-4 (a) `NFR-009` counts retained growth (~4 MiB + ~0.5 MiB a worker, ~10 MiB at 12), level unchanged, Q-3K-6 still open. OQ-5 no (no render group; accelerator strand parked). OQ-6 later (NNUE re-asked on V4's trigger).
- **Order (recommendation; the Orchestrator's and BA/PM's to set):** "after phase 1" no longer exists (P paused it, no end date; the table on `main` is stable). (1) After Phase 2 and R1, before Phase 3. (2) TH-1 may be pulled beside Phase 2 by width: it edits only `src/transposition.ts` and is node-equal at `Threads 1`, so it stales no C2' read. (3) All three before W1 and any 40/15 reading. (4) T2/T4 re-asked after TH-2, on the shared table. (5) Phase 2-5 reads stay `Threads 1` vs `Threads 1`.
- **TH-1 shared table:** D2.3 layout (4 x Uint32 over a SharedArrayBuffer, XOR check, key split inside probeTable/storeEntry with bigint signatures kept, store order 2,3,0,1, plain accesses). Replacement, hit rule, clear unchanged. ADR: amendment to `ADR-0025` d2 and d4's last bullet - an accepted ADR, not named in OQ-1, so **the owner's when written** (reading (b) lets the build proceed). Identity: `G4` door at `Threads 1`; ABC-081/122/208 rows unedited or an Architect ruling. Cost: `G6` by its rule at `Threads 1` plus the profile vs `main`; G6 below base triggers D2.3's fallback (+10-20 h). No C2' read (value-identical).
- **TH-2 worker pool + `Threads`:** worker_threads, stop slot via the injected clock (ADR-0044 D5 pre-design), per-worker killers/history, UCI `Threads` spin default 1. New ADR amending `ADR-0044` D3 and D5 (D5 reversal pre-accepted). Read: `Threads N` vs `Threads 1` at 100 ms, GAIN, labelled hardware gain, wall time and core-seconds; S' and Levels at `Threads 1`. Choices for its ADR with recommendations: `Threads 1` spawns no worker; max 12 (8 if the owner wants room); worker 0's move is played; terminal game unchanged.
- **TH-3 tests and lanes (may fold into TH-2):** multi-worker property rows (legal move, bounded time, no throw, no corrupt hit), torn-entry stress, `NFR-009` summed over workers, default lane wall before/after with at most one 2-worker row (`NFR-008`).
- **Size:** L, 32-65 h in all (42-85 h with the fallback).
