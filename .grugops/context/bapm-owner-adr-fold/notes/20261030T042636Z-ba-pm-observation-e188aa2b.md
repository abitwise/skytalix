---
id: 20261030T042636Z-ba-pm-observation-e188aa2b
kind: observation
by: ba-pm
at: 2026-10-30T04:26:36Z
verified_by: 
confidence: high on the arithmetic (ADR-0052 D3, ADR-0053 finding 4); medium on the nps figure (Orchestrator's, per-board UNKNOWN - verify)
refs:
  - bapm-owner-adr-fold
  - orch-2026-10-29g/20261030T041740Z-orchestrator-decision-3dd61448
  - ADR-0052
  - ADR-0053
  - ADR-0045
  - OQ-228-1
  - ABC-220
  - ABC-222
  - ABC-228
  - ABC-235
  - ABC-240
  - NFR-004
  - NFR-005
  - AR-NFR004-A
  - G6
supersedes: 
seal: sha256:267e42c4d838683a46e1b53ada4a713a387137dc0eed11855638745f426f277d
---

# Two readings this fold had to make explicit: the 22 s ceiling equal to T, and OQ-228-1's conditional clause

## 1. A ceiling equal to T cannot hold on the wall to the millisecond
- `ADR-0052` D3, as proposed, rejected T = ceiling at 22.5 s. Its reason was that the stop overshoot past the deadline (`AR-NFR004-A`, ≤ ~31 ms; 4 ms at 30 s in `qe-ABC-212` A4; 1–3 ms of pipe in the SA probes) would break the ceiling. With T = ceiling = 22 000 ms, the same holds: a real move's wall is about 22 000 + δ ms.
- The owner said: "no need to implement fraction of a second ceiling or time per move if it is not supported by current solution".
- **BA/PM's reading, written into the pages:** the ceiling is held exactly on the budget and deadline the engine is handed, which is ≤ 22 000 ms on the virtual clock (`ABC-220` A6). It is read **to the whole second** on the wall: ≤ 22 s means < 22 500 ms (`ABC-220` A11, `ABC-222` A5, EPIC-009's ceiling-read line). The excess over 22 000 ms is reported.
- **Why not "≤ 22 000 ms wall":** it would fail on every move by construction, so `ABC-222` A5 could never be MET. **Why not "≤ 22 000 + 31 ms":** `AR-NFR004-A` is "≤ ~31 ms" and the GUI pipe is `UNKNOWN - verify`, so that bound would be flaky.
- **Confirmation for the owner (not a blocker):** the code is the same under any reading. If he means a strict 22 000 ms wall, T must go below 22 s. That is his number, and the ticket would be re-derived.
- The Architect's amended D3 (`arch-adr-accept-0052-0053-0054`, in parallel) rules. If its text reads the wall differently, A11 and `ABC-222` A5 follow it with a one-line fix.

## 2. OQ-228-1's "3s to 4s" is borderline likely to be needed
- `ADR-0053` finding 4: head reaches depth 10 on position-6 at 3 s only if the node rate rises ≈ 1.36× (2 340 431 × 1.09 / 1 878 626 = 1.358).
- The Orchestrator reads `ABC-235` and `ABC-240` together at ≈ 1.3–1.4× nps. The per-board figure for position-6 on the new base is `UNKNOWN - verify` until `ABC-228` A8 runs.
- So a miss is plausible. If it misses, `ABC-228` stops at A8 until the owner says which 3 s he meant: `G6`'s budget, or level 5's per-move time. A level-5 reading would change `ADR-0045` and `NFR-005`'s referent, a product change across every level-5 game. Asking him now, before the build reaches A8, would avoid the stall.
