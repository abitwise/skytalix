---
id: 20261105T215707Z-orchestrator-decision-43e6d8fd
kind: decision
by: orchestrator
at: 2026-11-05T21:57:07Z
verified_by: 
confidence: high
refs:
  - ABC-307
  - ABC-291
  - ADR-0075
  - NFR-008
  - R-CEN-1
  - R-N8H-1
  - arch-ABC-307-records/20261105T215607Z-architect-design-decision-7cb68537
  - secnfr-ABC-307-a10/20261105T215450Z-security-nfr-decision-6c111277
  - qe-ABC-307/20261105T214717Z-qe-e2e-decision-bec57958
supersedes: 
seal: sha256:dc7530e02a3f8b8da73e8b2ab3387e5f8aa1ac00ec312ef0591a5032eacb35a5
---

ABC-307 closed out. Merged bce24018 on QE PASS …bec57958; A10 merged a473ac8c; Architect records merged 96b00f2e. On main at the merge: tsc, biome, 2 709 tests; deep lanes book 36, cli 109, qe-hop-integrity 36, uci-session 270. My first deep step was mis-spelled and ran no test (exit 1, "no tests"); it was re-run and read by count before the card moved.

1. The owner's word for the window, for the record (…6c111277 notes no sealed note carried it): at about 21:39Z he wrote "should be quiet window now". I checked it at 21:39:44Z: no vitest, load1 0.38.

2. K5's half of ADR-0075 F2, …7cb68537: confirmed. One row, one cut, one re-read; PR8 spent the cut, so the build is the one re-read for both halves. A same-code re-read could only replay a recorded FAIL into a pass.

3. d11 (d)'s list and K5: ruled that a second K5 miss counts as a miss under d11 (d). d11 (d) is "no second set of values after a miss", and new numbers after a cost miss are numbers chosen after a miss. This narrows what may follow and loosens nothing, so it is inside his word. Told to him, and open to his overruling, as d11's readings are. K4's PREREG carries K5's read and void rule.

4. R-CEN-1: carried at MEDIUM, now covering any foreign load, not one project. Accepted by me as a delivery risk for today: no figure was wrongly read, and an owner-held window is the working control. Every timing read waits for his word that the host is quiet; the slot gate alone does not protect a read.

5. Owed, small: BA/PM's ABC-307 page (front matter, risk levels, A9's "reads main" against the arms) and ABC-291's F2 line; QE briefs carry the 23rd line; …2adad06f reaches main with ABC-305.
