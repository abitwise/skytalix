---
id: 20261105T001333Z-orchestrator-decision-aa971f0b
kind: decision
by: orchestrator
at: 2026-11-05T00:13:33Z
verified_by: 
confidence: high
refs:
  - ABC-301
  - ABC-303
  - ABC-304
  - ADR-0067
  - ADR-0070
  - 04dc7cd4
  - zugzwang.001
supersedes: 
seal: sha256:9ce27a296accbce64460d23fab85fea60be147bf7466296637445f10941b4e3d
---

ABC-301's F4. The engineer stopped at scope 3 (…04dc7cd4): zugzwang.001 plays e1e5 at depth 9 on emission dd88560f, defect check clean. The rule is written, not open: ADR-0067 F4 reads "a defect check first. If real: NOT MET. Never a re-pin", and F6 and ADR-0070 F5 say not merged, nothing re-fitted on play, the structure stays value-identical. So, subject to QE's independent confirmation, the second pull reads NOT MET. No depth moves, no refit, no attribution feeding a fit, and depth-10 play is not a case for a deeper row.
B-T6 to B-T8, including the ~5 h B-T8 the owner approved, are NOT run: a read that cannot change the outcome is not spent.
qe-ABC-301-miss confirms on its own run. If confirmed, the emission never reaches main, K0 does not retire so ABC-304 stands whole, and ABC-303's C2' slot then waits on ABC-282 alone, on a base that stays near the one the owner was shown. What reaches main of this branch, and whether any further attempt exists, follows QE's verdict; a third pull would be a new call for the owner.
