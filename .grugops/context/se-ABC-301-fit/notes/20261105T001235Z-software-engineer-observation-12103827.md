---
id: 20261105T001235Z-software-engineer-observation-12103827
kind: observation
by: software-engineer
at: 2026-11-05T00:12:35Z
verified_by: 
confidence: high: read from the lane output
refs:
  - se-ABC-301-fit
  - ABC-301
  - F3
  - se-ABC-301-fit/20261105T001224Z-software-engineer-observation-358b29b1
supersedes: 
seal: sha256:024f01a7af1158ad38059b195fcba7e4d8dbef7aaa93278c11c10bdfb638128f
---

# se-ABC-301-fit correction to …358b29b1: seven of the 26 relation rows sit behind a red test row, not two

The F3 line of the results note says "Two of them sit behind red test rows". The count is seven: row 10 (the test row is red on its premise, evaluateWithoutMobility(MOBILE_WHITE) = -4) and rows 21-26 (B1 (d), each test row red on its mainCentreMinusCorner pin, line 181's door assertion, before it reaches the relation). The relation inequalities themselves read green on all 26, by the direct read in raw/relations-on-emission.txt. So the standing test rows do not yet show those seven green; they would at scope 4, after the premise and pins are moved. The sealed note is not rewritten; the rest of it stands.
