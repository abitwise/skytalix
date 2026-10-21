---
id: 20261021T094552Z-ba-pm-decision-c55cddaa
kind: decision
by: ba-pm
at: 2026-10-21T09:45:52Z
verified_by: 
confidence: high on the cut (Architect's shape followed); instrument identity measured (git diff --quiet 87d3897d 59fc9215 -- clause-b.mjs exits 0); A3's exactly-four mismatch set taken from QE …7f56f339 and ABC-163 A3, UNKNOWN - verify until the harness runs
refs:
  - ABC-182
  - ABC-163
  - G-4
  - AR-163-DELONLY
  - AR-163-UNCOMMENT
  - AR-095-L1UNIT
  - ADR-0036
  - NFR-008
  - 59fc9215
  - 87d3897d
  - 341da4c1
  - f00038ef
  - 20261021T093352Z-architect-design-decision-34e592ac
  - 20261021T093040Z-qe-e2e-decision-8a60d7c8
  - 20261021T093010Z-qe-e2e-observation-7f56f339
  - 20261021T093522Z-security-nfr-decision-3e4b4a08
  - 20261021T094500Z-orchestrator-decision-8d0de2f4
  - .grugops/context/design-F-072-1/probe/clause-b.mjs
  - .grugops/context/design-F-072-1/probe/f-mutants.sh
  - plans/tickets/ABC-182-a-committed-ruling-2-plant-harness-r2-mutants-sh-beside-clause-b-mjs.md
supersedes: 
seal: sha256:339ef0b10803ab7ebea4a3e116a1fc2e783634aa8d622472d5dd6ee495b3b16b
---

# ABC-163 G-4: CUT as ABC-182 (Ready, XS, P3, no epic, DoR 10/10). `r2-mutants.sh` + `.out.txt` beside the instrument

- **Shape.** Architect `…34e592ac`, followed: `f-mutants.sh`'s harness (usage `<repo> <tip> <scratch-dir> <abs clause-b.mjs>`, `git clone --shared` in scratch, reads `(b1) capability` / `(b1) Ruling 2`). Seven plants with expected beside actual limb-1 verdicts: P2b, P2c, CMT, X1 FIRE; NOH (at `f00038ef^1`) adds nothing; G1-IMP and G1-GRD do not fire, labelled AR-163-DELONLY.
- **Acceptance.** A1 exactly two files, instrument unchanged. A2 exit 0 on main's instrument, limbs 2/3 byte-identical to `341da4c1` on all 7, repo status clean. A3 nonzero on the `341da4c1` copy, mismatches exactly P2b, P2c, CMT, X1. A4 an ALT copy with one limb-2 byte changed exits nonzero naming limb 2. A5 committed output reproduces. A6 not in any lane, equal counts.
- **Column: Ready, not Backlog.** ABC-163 merged at `59fc9215` while this hop ran; the instrument there is byte-identical to `87d3897d`. No blocker remains.
- **Out of scope.** Biome on `.grugops/` and a vitest suite (Architect rejected both); the AR-163-UNCOMMENT plant and Security/NFR's G-1b go with those fixes; flipping the G1 rows belongs to the AR-163-DELONLY fix.
- **Priority.** P3; raise to P2 when a ticket that edits `clause-b.mjs` is pulled. Due before it merges.
- **NFR:** NFR-008 0/0/0 (hand-run, outside `npm test`).
