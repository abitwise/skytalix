---
id: 20261027T041414Z-orchestrator-decision-75af453c
kind: decision
by: orchestrator
at: 2026-10-27T04:14:14Z
verified_by: 
confidence: high
refs:
  - ABC-210
  - ADR-0051
  - ADR-0050
  - ADR-0026
  - arch-design-ABC-210/…c5d0e464
  - arch-design-ABC-210/…8e6a40c2
  - orch-2026-10-27d/…828d5794
supersedes: 
seal: sha256:ac61948e54b839e06c98114aa23ce280793ed5a650f8894ff0f8457fe8f56b07
---

# ABC-210 design accepted; pin STOP ruled (P1 mine, P2 the owner's); ADR-0051 + P2 go to the owner as one yes/no; build held

- **Accepted and merged arch-design-ABC-210 (…c5d0e464, …8e6a40c2)** at 2feab03e.
  - **Form (a):** a check extension at the horizon only, +1 ply, capped at 1 per line.
  - ADR-0051 is PROPOSED and reverses nothing. ADR-0024 d4 and quiescence.ts stand.
  - **Doors:** `searchWithoutCheckExtension` / `chooseMoveWithoutCheckExtension`, 300/300 node-equal.
  - **Frozen-clock nodes:** kiwipete d8 +3.4 %, position-6 d8 +0.9 %. Depth-6 nodes are 1.054× / 1.007× base, against the 1.5× bound.
  - G6 against "≥ base" is predicted met. That is a prediction only (UNKNOWN - verify): the cost of the in-check test is not priced by a frozen clock.
  - G1 is 54/58 = base. Size M, no split.
- **"≥ base − 1" is STRUCK.** It is stricter, so no owner word is needed (…828d5794).
- **Pin STOP rulings:**
  - **P1 (`transposition.test.ts` A5 "fixture bites", d3 −485 → reads 0): ACCEPTED, mine (MEDIUM).** The row tests that its fixture bites, not engine strength. Re-pinning it to d2 (−502) keeps it on the shipped path, which is what ADR-0026 d7 requires ("stay where they are" = on the shipped path, not frozen at one depth). No level, relation or NFR bound moves. QE re-plants the fixture bug at d2 and checks that the row goes red.
  - **P2 (`zugzwang.005`, frozen-clock chooseMove, Nxd5 found only from d13, not d12): the OWNER's.** It edits accepted ADR-0050 d9. It is bundled with ADR-0051 as one question.
  - **Re-points/reds:** the other reds (2 export lists, 2 QE-208-c door maps, 2 null-move drift rows) clear by re-pointing to the new doors, inside ADR-0026 d4/d5. Accepted.
- **Also told to the owner:** ADR-0051's own drift oracle is looser than ADR-0050's. It allows ≥ 90 % of positions within 25 cp and none beyond 174 cp (measured 93.6 %, max 116), against 95 %/37 cp. The reason given is that the heuristic is meant to change horizon values. That is inside the yes/no.
- **Delivery call (LOW): the build is HELD until the owner answers,** as for ABC-209. The build itself has to move P2, which is an owner-held row, so building first would be building on an unaccepted pin.
- **Next:** `bapm-amend-ABC-210`, records only. It places the Architect's page lines (adr, Scope 1/3, A2, A3 with "≥ base − 1" struck plus the drift bars and the mate floor, A1 cross-build, test notes 1 and 3) and the P1 ruling line. P2 is written as "on the owner's acceptance". Then DoR → Ready for Dev, held.
- Width 1/3.
