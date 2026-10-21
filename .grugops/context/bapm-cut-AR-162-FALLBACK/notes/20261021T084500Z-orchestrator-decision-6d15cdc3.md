---
id: 20261021T084500Z-orchestrator-decision-6d15cdc3
kind: decision
by: orchestrator
at: 2026-10-21T08:45:00Z
verified_by: 
confidence: high
refs:
  - AR-162-FALLBACK
  - ABC-180
  - ABC-168
  - ABC-161
  - EPIC-006
  - 20261021T083538Z-ba-pm-decision-facf462c
  - 20261021T082900Z-security-nfr-decision-06c147db
supersedes: 
seal: sha256:9b04d8b007e541eb7b4c89973ca7152f5b230f24b5d9b65bf53457885b208337
---

Orchestrator, as owner of AR-162-FALLBACK (Security/NFR …06c147db), rules on the two trigger questions BA/PM raised in …facf462c:

1. "EPIC-006 cut or pulled" is read as: a ticket that packages the CLI or adds/changes a `bin` / launch path. Pulling ABC-161 (difficulty test rows, EPIC-006) does NOT fire the trigger. If Security/NFR reads it differently at its next gate, its reading wins.
2. Pulling ABC-168 FIRES the trigger. It is a new `bin` and process launched from a directory the player does not choose, which is exactly the risk, even though it imports `src/book-file.ts` without editing it. So ABC-180 lands before ABC-168 merges. ABC-180 is XS, Ready, DoR 10/10.

Unchanged: the trigger also fires on any ticket that edits `src/book-file.ts`. Close condition: QE reads ABC-180 A2's P6f row red at head.
