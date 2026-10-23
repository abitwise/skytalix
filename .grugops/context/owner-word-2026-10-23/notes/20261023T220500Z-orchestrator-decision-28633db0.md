---
id: 20261023T220500Z-orchestrator-decision-28633db0
kind: decision
by: orchestrator
at: 2026-10-23T22:05:00Z
verified_by: 
confidence: high
refs:
  - src/evaluate.ts
  - package.json
  - ADR-0044
  - ABC-169
  - LIC-PUB-1
supersedes: 
seal: sha256:892baf1122719426511d0e491ff3dfbcba4e4ac72b6886655be3a0b22a1f9db3
---

# The owner's in-session word. A transcription, not a stamp

Verbatim: *"let's put license as apache 2.0"*

- **Licence: Apache-2.0** for the skytalix repository — owner's decision on LIC-PUB-1 (Security/NFR `security-nfr-public-repo`, held branch).
- **Consequence stated to the owner:** Security/NFR found Apache-2.0 (permissive) is NOT compatible with the CC BY-SA 3.0 evaluation values in `src/evaluate.ts:16-19` if they are an Adaptation (copyrightability `UNKNOWN - verify`; not legal advice). ADR-0044 D13 (owner-accepted) already names the remedy: re-derive our own values before distribution. Options put to the owner: (A) Apache-2.0 now with the tables explicitly carved out as CC BY-SA 3.0 in a NOTICE, then re-derive to drop the carve-out; (B) re-derive first, then Apache-2.0.
- Routed: BA/PM cuts the licence ticket (LICENSE + NOTICE + `package.json` `license`; `"private": true` stays so nothing goes to npm; ABC-041 clause (a) fires on `package.json`; pins in `cli.test.ts`). The licence ADR (superseding ADR-0044 D13 / EPIC-007 M10's "private" reading) is drafted by Architect/Design: Apache-2.0 accepted by the owner; the tables path waits on his A/B answer.
