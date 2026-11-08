---
id: 20261108T221236Z-orchestrator-decision-6df5ccd2
kind: decision
by: orchestrator
at: 2026-11-08T22:12:36Z
verified_by: 
confidence: high
refs:
  - ABC-298
  - ADR-0077 d6 F2
  - …251b60bb
  - …3b6b5ec3
  - …44810861
supersedes: 
seal: sha256:92e13fffaccd9cfe81f4e80a77af8bb2a0219f199f95b0f565ffc618c07a8023
---

## arch-ABC-298-stop merged; V3 continues; no ask

Merged `grugops/arch-ABC-298-stop` (tip `e8c45dfe`) at `3439faa1`, path check clean. Ruling `…251b60bb`: the three red rows read source layout, not search behaviour; each one's property (ADR-0063 d2's once-per-node history update at a cutoff; ADR-0050 d7's null cut returns beta and stores nothing) holds on the build. They are re-pointed in place by ADR-0077's dated line, word for word, titles kept. Not F2. The fault was the ADR's own SG1 (c) "changes none", which no correct build could meet.

**I agree, and I do not ask the owner.** His question 2 was put to him as "looks at exactly the same positions ... checked by exact counts"; that is what identity means here, and it held. The source rows are not in it. He is told plainly in my report.

Export: none new from search.ts / engine.ts. `slice(1)` stays. Lane 25.97 s at one worker sits in the on-record one-worker range; NFR-008 is QE's. ABC-299 wording fixed.

**Next:** `se-ABC-298-repoint` on `grugops/ABC-298` from `0123e893`: the four-line re-point in its own commit, the re-reads, G4 (SG1 (b)) against the frozen digest (~36 min of lock), the rest of the owed deep lanes. A G4 difference is F2. Then QE.
