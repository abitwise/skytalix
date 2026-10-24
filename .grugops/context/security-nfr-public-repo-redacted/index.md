<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: security-nfr-public-repo-redacted

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-24T10:52:32Z | observation | security-nfr | medium (repo facts and closing state read at main 2e67a4b5; every legal conclusion UNKNOWN - verify, not legal advice) |  | # Licence position of the public repo (LIC-PUB-1, MEDIUM): CLOSED by ADR-0048 (accepted) and the ABC-214 merge |
| 2026-10-24T10:52:32Z | observation | security-nfr | high (the 28 items were read at main 36a4902e on 2026-10-23; ADR-0049 status read at main 2e67a4b5) |  | # Posture drift since the repo became public: 28 statements, now carried by ADR-0049 (PROPOSED, the owner's) |
| 2026-10-24T11:06:48Z | observation | security-nfr | high (full-history regex + entropy sweep with a positive control that fired all 33 rules; regex not live-verified, UNKNOWN - verify for formats no rule names) |  | # "No creds" evidence: 0 credential values in the history of every public ref (3,056 commits, 13,619 blobs, re-swept 2026-10-24 with 30 strict rules and a positive control) |
| 2026-10-24T11:06:48Z | observation | security-nfr | high (counts read on 55a8f4ef and its history on 2026-10-23; classes only; fork/clone facts UNKNOWN - verify) |  | # Personal data in the public repo, redacted: SEC-PUB-1 MEDIUM (accepted by the owner on "no creds"), SEC-PUB-2/3/4 LOW, SEC-PUB-5 INFO |
| 2026-10-24T11:06:58Z | decision | security-nfr | high (result read from the four evidence notes of this task; legal items UNKNOWN - verify) |  | # Security/NFR on the public repo, redacted record: PASS_WITH_RISKS. 0 credentials in public history, so the owner's "no creds" condition is met. SEC-PUB-1 is ACCEPTED (owner) and LIC-PUB-1 is CLOSED |
