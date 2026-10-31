---
id: 20261031T025128Z-qe-e2e-observation-4daf292f
kind: observation
by: qe-e2e
at: 2026-10-31T02:51:28Z
verified_by: 
confidence: high for the measured facts; severities by QE
refs:
  - ABC-222
  - ABC-220
  - EPIC-009
  - ADR-0052
  - NFR-004
  - AR-NFR004-A
  - RISK-EPIC009-02
  - RISK-EPIC009-03
  - RISK-EPIC009-04
  - 19d18df1
  - grugops/qe-ABC-222
  - qe-ABC-222/20261030T232126Z-qe-e2e-decision-63f93685
  - qe-ABC-220/20261030T152147Z-qe-e2e-observation-58af5b6a
supersedes: 
seal: sha256:fa3d58287fd2158da0d96b8d75dc4564c35ec5d540a9d2992b2ebe7eeefd72c7
---

# qe-ABC-222 observations and gaps, with severity: none blocking, no defect

1. **QE-222-a (INFO; build).** The reading built the tip `19d18df1`, not `ABC-220`'s merge `ec1e835b`, under the
   RE-SCORED block's rule.
   - Over `src/uci-session.ts`, `src/engine.ts` and `src/uci.ts`, only `engine.ts` differs: `ABC-229`'s
     `quietPromotions` switch.
   - The deadline, the 1 024-node check and `HARD_CEILING_MS` are unchanged. So this reading covers what `main`
     ships, ABC-228/229 search included.
   - The brief named `d1bd99aa` as the base. The launcher named `19d18df1`, its records-only child, so the code is
     the same.
2. **QE-222-b (INFO; `AR-NFR004-A` at 22 s).** The real per-move overhead seen by cutechess is median 0 ms and max
   +2 ms over 561 searches.
   - The longest move is 22 002 ms, and 150 of 574 moves are over 22 000 ms by ≤ 2 ms.
   - That is far inside ≤ ~31 ms and `ADR-0052` D2's `OVERHEAD` of 100 ms. The pipe and GUI latency is ≤ 2 ms on
     this host.
   - For Security/NFR: the risk stands with its number. The 22 s clause reads MET as < 22 500 ms.
3. **QE-222-c (INFO; M1 margin).** The closest call is 19 991 ms at a period's 40th move with 0 book moves. That is
   `ADR-0052` D3's arithmetic exactly: 900 000 − 40 × 22 000 = 20 000, less 9 ms. Book moves only widen it (63 985
   and 107 984 ms). The ≥ 500 ms bar has ~19.5 s to spare.
4. **QE-222-d (INFO; `RISK-EPIC009-02` not exercised).** `cutechess-cli` 1.5.1 sent 0 `isready` during a search. It
   pings before each `go`. A GUI that pings mid-search is not exercised here, and `AR-UCI-BUSY` still covers it.
5. **QE-222-e (INFO; `RISK-EPIC009-03` not exercised).** All 574 `go` lines carried `movestogo`, so the
   no-`movestogo` branch of C is not read by a real game. It stays covered by `ABC-220`'s virtual-clock rows.
6. **QE-222-f (INFO; the PGN's precision, the ticket's `UNKNOWN - verify` closed).** cutechess 1.5.1 prints a move
   time of ≥ 10 s to whole seconds (`chessgame.cpp` `evalString`).
   - So the PGN alone reads A5 exactly at the owner's whole-second reading: `22s` means < 22 500.
   - The ms figures come from the `go` clock deltas, which are the same `lastMoveTime` integer. 0 of 561 disagree.
   - A book move under 500 ms has no PGN comment at all.
7. **QE-222-g (INFO; process).** After the ungraded rehearsal, the reader got one parsing fix (the termination text
   in the last comment) and one guard for the rehearsal dir. No derivation moved, and the diff is kept.
8. **QE-222-h (INFO; scope of "ALONE").** ALONE is evidenced by a process scan: 0 foreign vitest and 0 second
   `cutechess-cli` in 1 231 samples, with load1 steady at ~1.07. Other agent sessions were present but idle. That no
   other agent hop ran rests on the Orchestrator's schedule (the brief's `width: ALONE`).
9. **The coverage extension did not fire.** Game 3 ended at 59 plies (0 side-periods), but 10 side-periods were
   complete over the 5 games.
