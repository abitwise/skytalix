---
id: 20261021T102200Z-orchestrator-decision-bc2b06ce
kind: decision
by: orchestrator
at: 2026-10-21T10:22:00Z
verified_by: 
confidence: high
refs:
  - AR-180-VALIDATED
  - AR-183-CWDARG
  - ABC-183
  - ABC-168
  - QE-183-a
  - QE-183-b
  - 20261021T134100Z-security-nfr-decision-41f70925
  - 20261021T134000Z-security-nfr-observation-d5fd47e1
  - 20261021T093500Z-orchestrator-decision-73eb06c5
supersedes: 
seal: sha256:02ecc37f0096239b234d12d7507705ee1dbbf6820764a42d6830f79cf094d748
---

Orchestrator, as owner, records per Security/NFR …41f70925:

- AR-180-VALIDATED is CLOSED on the merge of ABC-183 to main. Part (i) met at ABC-163's merge (…8d0de2f4); part (ii) QE …5e544b3e / verdict …be7c2c82: TMO + P6f green on the base test, red at A7's new labelled assertion on the head test.
- AR-183-CWDARG is OPENED (LOW, owner Orchestrator), from QE-183-a. Dropping `booked`'s `neutral` cwd argument leaves the CLI_DEEP lane 11/11 under P6f; A7 asserts the variable, not the child's cwd. Predates ABC-183 (from ABC-162); not a merge blocker.
  - Fix (BA/PM cut, XS P3, test-only): `RealChild` records the cwd it spawned with; A7 asserts `booked.cwd` is `neutral`, labelled. 0 new spawns, 0 new tests.
  - Trigger: same as AR-180-VALIDATED's (…73eb06c5) — an edit to `src/book-file.ts`, or a packaging/bin/launch-path ticket. ABC-168 fires it; ABC-161 does not. On fire: ticket → P2, owed before that ticket merges. Any earlier ticket editing A7, `spawnReal`, `spawnNode` or `RealChild` carries the fix.
  - Close condition: the fix lands and QE reads TCWD + P6f red at head.
- QE-183-b: INFO, accepted; no record, no cut. ABC-183 A1's `grep -B1` stays a QE read at any hop that edits A7's `beforeAll`.
- Clock note: Security/NFR's two notes in this task carry at-stamps 13:40Z/13:41Z, but were written at about 10:16Z (Security/NFR's own disclosure; it copied the SE's stamps). Content is unaffected; replay order for these two should be read as about 10:16Z, before this note.
