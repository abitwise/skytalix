---
id: 20261011T083630Z-architect-design-decision-abc083-routes-puzzle-deep-qe-n8-lane-secnfr-072c2994
kind: decision
by: architect-design
at: 2026-10-11T08:36:30Z
verified_by: 
confidence: high
refs:
  - ABC-083
  - ABC-084
  - ADR-0034
  - ADR-0028
  - ADR-0014
  - ADR-0035
  - ADR-0031
  - N8-LANE
  - NFR-005
  - .grugops/context/ticket-to-pr-ABC-083/notes/20261010T194248Z-software-engineer-observation-abc083-stop-two-class-r-levels-and-puzzle-red-e3f81b07.md
  - .grugops/context/ticket-to-pr-ABC-083/notes/20261010T194248Z-software-engineer-observation-abc083-cost-adr0035-clause-b-numstat-81f0d5aa.md
  - .grugops/context/ticket-to-pr-ABC-083/probe/puzzle-5061-ladder.txt
supersedes: 
seal: sha256:89288e9c5687ad44331bee9108fcd962f1b120b3d7db6fce3c260eec6b10d1b1
---

# Routes, not resolutions: `PUZZLE_DEEP` 53/58 → QE (`ADR-0034`). `N8-LANE` +1.08 s and position-6's depth-7 margin → Security/NFR

Recorded through `context-io.js` `appendNote` (sealed and admitted, no stamp). Neither item is resolved here.

- **`PUZZLE_DEEP` 53/58 (seed 5061) → QE, classing under `ADR-0034` d3.**
  - Inputs, all deterministic and already recorded: base and branch lines (f5e6 d5 n20 507 against g2e1 d5
    n20 507), the +5/+10/+25% ladder (still g2e1 at d5), and the scope command (`src/evaluate.ts` only).
  - The Engineer's reading is **L**. The class is QE's word.
  - **If L:** `ADR-0028` d1 + d2 apply. The re-find goes in its own commit, touches no trigger-list file and not
    the baseline, and meets d5's 0.8x margin on base. **Architect/Design rules the re-find** (`ADR-0034` d4).
  - **If D:** the owner, with `A9`'s nodes and `A7`'s depth.
  - **If B:** the Engineer.
  - King safety alone also misses 5061, so the route is the same under either build. It never fires a cut and
    never licenses re-weighting (d6).
- **`N8-LANE` NOT MET (+1.083 s CPU median, interval +0.923..+1.410, twin R 0.316 s) → Security/NFR.**
  - It is a rate limit (`ADR-0014` d4), not an `ADR-0031` trigger.
  - Attribution is `UNKNOWN - verify`.
  - A fresh reading waits for a quiet machine.
  - If king safety alone ships, the charge is re-read on that build.
- **Position-6 depth-7 margin (1.04–1.07x, one depth-6 run in a load spike) → Security/NFR under `A9`.** Their
  reading decides whether `ADR-0031` d5 cuts mobility. That makes `ADR-0039` d3 void.
- **The `NFR-008` trip-wire** (`npm test` 6.02 s, unpaired) → Security/NFR, as the build note says.
- **Order:** Security/NFR's `A9` reading first, because a stop makes the owner's re-level word moot. QE's classing
  can run in parallel, since it is deterministic.
