---
id: 20261024T084459Z-security-nfr-decision-91f3c0d1
kind: decision
by: security-nfr
at: 2026-10-24T08:44:59Z
verified_by: 
confidence: high on the dependency surface, the private guard and the personal-data scan; licence readings UNKNOWN - verify (not legal advice)
refs:
  - ABC-214
  - security-nfr-ABC-214
  - ABC-041
  - ADR-0048
  - grugops/ABC-214
  - c4acf49f
  - bb8d4432
  - 306f1083
  - 2a9f38cf
  - QE-214-a
  - SEC-214-a
  - LIC-PUB-1
  - OQ-214-4
  - ABC-215
  - V15.1.1
  - V15.2.1
  - V13.4.1
  - qe-ABC-214/…719817d2
  - PASS_WITH_RISKS
supersedes: 
seal: sha256:ce72fa3fab683ae23945ccc8e69d5955de545bea184e01d651780cd0b169f01d
---

# ABC-214 Security/NFR result: PASS_WITH_RISKS. No required fix. QE-214-a is carried as an accepted LOW (owner BA/PM). One INFO

The readings are in the sibling observation note.

- **Required fixes: none.**
- **ABC-041 (a): fires, no finding.** The touch is the licence value only. There is no `dependencies` key, no `publishConfig` and no `files` key, and no resolved, integrity or version line moved. Scripts and devDependencies are unchanged. The supply-chain surface is unchanged.
- **`"private": true`: MET.** It is unchanged and pinned by ABC-042 A10. npm 11.20.0 refuses a publish with `EPRIVATE` before it contacts the registry (source read, no publish run).
- **NOTICE, LICENSE and the header lines: MET.** No personal or host detail beyond the owner-chosen copyright line and the owner-chosen kit MIT line. `LICENSE` is the pinned Apache text.
- **ASVS L1:**
  - No L1 row fails.
  - `V15.1.1` and `V15.2.1` (components): no component is added or changed.
  - `V13.4.1` (source control metadata): not applicable. This project deploys nowhere.
  - `V14` (data protection): the only personal datum is the owner's own copyright name, which he published by choice.
- **NFRs: none moves.**
  - The emitted code is byte-identical at base, tip and head (independent transpile).
  - No test file or `it` was added, so the `N8-LANE` set is unchanged.
  - No timing is owed.
- **Accepted risk: QE-214-a, LOW. Owner: BA/PM** (whether a guard ticket is cut).
  - Only `package.json`'s licence value is gated. `LICENSE`, `NOTICE`, the lock licence and the carve-out header lines can be dropped with every gate green.
  - From the security side: a silent loss of the carve-out would claim Apache-2.0 over the CC BY-SA 3.0 values again. That would reopen the exposure this ticket narrows.
  - Why LOW: no L1 control fails, the loss needs a deliberate edit, and every such edit reaches a QE hop.
  - ABC-215 is the next ticket to touch these lines. It removes the carve-out on purpose.
- **INFO SEC-214-a, no action asked. Owner: the owner (licence).** `UNKNOWN - verify`, not legal advice.
  - The machine-readable licence (`package.json` and the lock: `Apache-2.0`) does not express the carve-out. GitHub's detection reads `LICENSE`.
  - So a tool that reads only the metadata reports Apache-2.0 for the whole tree. The carve-out is visible only in `NOTICE` and in the `src/evaluate.ts` header.
  - An SPDX expression such as `Apache-2.0 AND CC-BY-SA-3.0` would contradict A1 and ADR-0048 decision 1, which the owner chose. It is not proposed here.
  - ABC-215 makes the question moot.
- **Licence readings:**
  - Stay `UNKNOWN - verify`: OQ-214-4 (the Adaptation reading under BY-SA 3.0 § 4(b)), ADR-0048 decision 4's engineering reading, and decision 8 (public history).
  - LIC-PUB-1 (MEDIUM, owner-owned) is not re-scored here.
  - Nothing was read from or copied out of the held `security-nfr-public-repo` branch.
- **Owed by the owner, not by this hop:**
  - acceptance of ADR-0048 (PROPOSED) before ABC-214 merges;
  - the GitHub licence display after a push (`UNKNOWN - verify`).
- **No HIGH**, so no risk acceptance goes to the owner.
- **Board:** In Security/NFR → Ready for UAT is the Orchestrator's move. This hop made no board or traceability edit.
