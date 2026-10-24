---
id: 20261024T130500Z-orchestrator-decision-ad1d2563
kind: decision
by: orchestrator
at: 2026-10-24T13:05:00Z
verified_by: 
confidence: medium
refs:
  - ABC-212
  - AR-212-LANE
  - SEC-212-a
  - SEC-212-b
  - NFR-008
  - N8-LANE
  - NFR-009
  - security-nfr-ABC-212/…e2c5d6b9
  - bapm-fold-ABC-212/…7df0e4af
  - scribe-runbook-ABC-212/…20280cb7
  - owner-word-2026-10-24/…4c3f7639
  - owner-delegation-2026-10-22/…5aaf7cec
supersedes: 
seal: sha256:83fb004651bdf7d9c6c9720f83bc868e3ca12a132f6e2cd75b449a590b8a3163
---

# ABC-212 Security/NFR PASS_WITH_RISKS accepted; AR-212-LANE waived in writing; merge on green

- **Accepted:** Security/NFR PASS_WITH_RISKS (`…e2c5d6b9`), no required fix. NFR-004 owner text placed verbatim; AR-NFR004-A re-accepted at 32 000; clause (b) silent; ASVS L1 no row fails.
- **NFR-009 30 s reading by Security:** kept. It is a memory reading the ticket assigned to Security/NFR, not a timing run under `…4c3f7639`, and a loaded host cannot bias it toward a pass.
- **AR-212-LANE, MEDIUM — reading WAIVED, risk accepted (owner: Orchestrator, delegation `…5aaf7cec`).** The N8-LANE reading is NOT scheduled: the owner's rule `…4c3f7639` ends timing runs after the four pending ones, and N8-LANE is a per-ticket slice instrument, not an owner bound. **Number carried:** the 9 new A9 rows in `src/uci-session.test.ts` sum to **1 053.5 ms** per-test wall (inadmissible indicator: foreign vitest live, no base twin) against the 650 ms slice — read it as likely NOT MET (~1.6x). The owner bound under NFR-008 (`npm test` wall ≤ 10 s, load1 ≤ 8) is not waived: the merge gate's `npm test` wall is recorded as a sentinel, and a sentinel over 10 s stops the merge.
- **Lever kept for later (Backlog, XS, BA/PM to cut when the alone queue is done):** A12's budget-read arm — the 7 searching A9 rows read the budget without searching. Not a merge blocker.
- **SEC-212-a LOW:** stands as the Architect's OQ-212-3 acceptance.
- **SEC-212-b INFO:** rides the next catalog hop (NFR-004 `Verified by` cell).
- **BA/PM fold** (`…7df0e4af`): all eight marks kept, including the four restating lines (D3 `uci`/`setoption` rows, two § Consequences lines); reverting them would leave ADR-0044 contradicting itself.
- **Scribe** (`…20280cb7`): flag placed in `AGENTS.md` (the only copy of the command); the runbook got the QE-212-c wording. Accepted; `npm test` at the merge exercises the ABC-173 A3 command check.
- **Board:** In Security/NFR → Ready for UAT (UAT signed by QE `…e58d4635`) → merge → Done on green gates.
