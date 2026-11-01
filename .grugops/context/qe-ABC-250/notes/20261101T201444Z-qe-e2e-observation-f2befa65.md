---
id: 20261101T201444Z-qe-e2e-observation-f2befa65
kind: observation
by: qe-e2e
at: 2026-11-01T20:14:44Z
verified_by: 
confidence: high: gaps named from this hop's readings; QE-250-a mechanism UNKNOWN - verify
refs:
  - qe-ABC-250
  - ABC-250
  - EPIC-010
  - ADR-0055
  - ADR-0055-D3-V2
  - NFR-001
  - NFR-004
  - NFR-005
  - NFR-008
  - NFR-009
  - grugops/ABC-250
  - 2e04eee5
  - ceb28780
  - ABC-251
  - ABC-252
  - ABC-261
  - QE-261-c
  - QE-250-a
  - QE-250-b
  - QE-250-c
  - QE-250-d
  - QE-250-e
  - 20261101T194515Z-qe-e2e-decision-7ff2b573
supersedes: 
seal: sha256:dd0c66a4f9edfff1a4cf5ef2b71c7162346b4cd9f82b286bd36909c5ffd85c0c
---

# ABC-250 gaps after qe-ABC-250: QE-250-a MEDIUM (the perft A4 instrument voids at low foreign load on a hot host; it blocks the A4 grade); QE-250-b LOW (the ALONE window was not alone); QE-250-c INFO (ABC-261's row is on main only; relay verified another way); QE-250-d INFO (both oracles are load-bearing); QE-250-e INFO (steady-state against cold reading)

QE/E2E, task `qe-ABC-250`.

- **QE-250-a: MEDIUM. The instrument blocks the A4 grade (owner: Orchestrator, then Architect or QE).**
  - **What happened:** kiwipete and start voided after D3's one re-run, on within-build spread and on the agreement guard. Every counted run read ≤ 0.64 foreign cores. kiwipete's re-run base runs ranged 20.76–23.73 M nps (12.9 %) at 0.29–0.36 foreign cores. After-run Tctl sat at 78–82 °C through the perft schedule.
  - **Why D3-V2 misses it:** the rule's admission sees foreign CPU, not per-run boost or thermal swings, on back-to-back 2.5 s single-thread perft loads. The mechanism is `UNKNOWN - verify`: boost or thermal, a move to a Zen 5c core, or an SMT sibling (ADR-0055 addendum, "the host").
  - **Candidates for a fresh read's PREREG** (none loosens a bar; the Architect's call where they go beyond D3-V2's (v3)):
    - a cool-down gate before each pair (for example Tctl ≤ 65 °C);
    - the pinning step D3-V2 names (`taskset` to a Zen 5 core, CPUs 0–3);
    - more REPS per run. Disclosed: more REPS alone would not damp per-run boost swings.
- **QE-250-b: LOW. The ALONE window was not alone.**
  - 12 foreign vitest processes appeared during the hop, 8 of them during the timed job. A foreign `abtop` drew 20–24 % of one core on most start runs. Their origin is `UNKNOWN - verify`.
  - The gate waited them out or discarded the pair; no counted pair had one. The Orchestrator may want to find the source before the next ALONE read.
- **QE-250-c: INFO. The QE-261-c relay.**
  - ABC-261's early-exit row landed on `main` (`dd8b17ea`) after the branch base, so the branch's own full lane does not carry it.
  - It was verified another way: `main`'s `gameend.nfr.test.ts` ran 11/11 against head's code, and `generateMoves` is byte-unchanged (0 removed lines in `src/moves.ts`). The merged lane carries the row.
- **QE-250-d: INFO. Two load-bearing oracles until ABC-252.** QP5 (the packed key) was caught only by A1's key rows, and QP6 (packed order) only by A2's ordered list equality. Neither row set can be dropped or thinned before ABC-252 removes the duplicate path.
- **QE-250-e: INFO. The reading choice, disclosed in the PREREG.**
  - The graded nps is the steady state over REPS calls. The cold first-call ratios ran 1.08–1.24 on the graded boards and 0.92–1.15 on the INFO boards.
  - The Engineer's informal reading (`…ff7ffb6e`) put the cold ratio above the steady one; the counted cold and steady ratios here were mixed.
  - A fresh read should keep the method, so that its runs stay comparable.
- **Carried, not re-run:** G2 and G3 are not owed. The `ENGINE_DEEP` levels lane (577 s at qe-ABC-254) was not run: the search is untouched, A3/G4 is byte-equal, and the engine lane is green.
