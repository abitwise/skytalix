---
id: 20261109T001447Z-orchestrator-decision-99fab81a
kind: decision
by: orchestrator
at: 2026-11-09T00:14:47Z
verified_by: 
confidence: high
refs:
  - ABC-298
  - qe-ABC-298
  - …c981798f
  - …c0727df9
  - …e7d15923
  - QE-298-k
  - QE-298-n
  - QE-298-m
supersedes: 
seal: sha256:17ef4a6d6014e7747d746acc74a0945a6a684dd6fd34c5142f774f124af1a772
---

## qe-ABC-298 stage A done; held window asked of the owner

QE stage A (`grugops/qe-ABC-298` tip `59cf3cb3`): stage 0 holds (`43fe357e` descends from `b9b8eee9`; 29 freeze hashes equal); SG0, SG1 (a)–(c), SG2 all met; QE's own G4 run byte-equal; gates green; code read holds all 15 d3 duties. Timing PREREG `…c981798f` sealed at `19d0ba57`, before any figure.

**Rulings:**
- **QE-298-k: no pinning for SG3 and G6, as sealed.** ADR-0077 d7 fixes the instrument unchanged and ADR-0055 says search reads run unpinned. I do not change it; no addendum.
- **QE-298-n: agreed.** The 10 s legs are INFO at one worker; the graded leg is H − B ≤ +0.10 s.
- QE-298-m (LOW, wording of the freeze and the Engineer's note): recorded, no reading changes.

**Stage B waits on the owner's word that the whole host is quiet, his other projects included, and my `ps` check.** About 25–45 min in three holds, each under 1 h. No games, so no W.
