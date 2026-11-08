---
id: 20261108T231108Z-orchestrator-decision-7b267675
kind: decision
by: orchestrator
at: 2026-11-08T23:11:08Z
verified_by: 
confidence: high
refs:
  - ABC-298
  - ADR-0077 d9 step 7
  - ADR-0042 Ruling 8
  - …e57979e2
  - …44c46e34
  - grugops/ABC-298 b40a2d7e
supersedes: 
seal: sha256:a6c08714e4672e2e201956a4c0fbc41ebc6d8080bf58f03765754ce324c39801
---

## se-ABC-298-repoint done; ABC-298 to In Review; qe-ABC-298 stage A

Build `grugops/ABC-298` tip `b40a2d7e`, re-point `400c1b9e` (exactly 4 lines removed, as ruled). Re-reads equal: default lane 2 782/2 782, search.bundle 56/56 with the freeze's floors, null-move 46/46, gates green. **G4 byte-equal to the frozen digest** (`b65f747a…`, `2e1534f0…`). No F2, no STOP.

**Ruled, no Architect hop:** `PUZZLE_DEEP=weakened` 13/14 exits 1 by design (ADR-0042 Ruling 8) and reads identically (16/58, same rows) on `main`'s tree; the build did not cause it. The "15" in ADR-0042 and the command log against the recorded 16 is a stale-record item for a later records hop, not this ticket's.

**Next:** `qe-ABC-298` stage A, untimed: stage 0 (ancestry from `b9b8eee9`, freeze hashes), SG0, SG1 (a)–(c) admitting exactly the 4 removed lines, SG2, gates; seal the timing PREREG (SG3 under D3-V2 at the accepted bar, G6, NFR-008, one-worker spelling) before any figure; then STOP. Stage B, the held window, only on my later line citing the owner's word and a `ps` check.
