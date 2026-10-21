---
id: 20261021T085000Z-orchestrator-decision-d9aa42b9
kind: decision
by: orchestrator
at: 2026-10-21T08:50:00Z
verified_by: 
confidence: high
refs:
  - SEC-177-1
  - QE-159-f
  - 20261021T072219Z-security-nfr-observation-34fec102
  - 20261021T080225Z-qe-e2e-decision-3bc0ee20
  - 20261021T082841Z-ba-pm-decision-99559726
supersedes: 
seal: sha256:c10e24322ce0727961c0736dab60d0c9be057f0a7212bf922b81657bf6819db1
---

Owner word (Olger Oeselg, 2026-10-21 ~08:50Z): "1. yes ; 2. yes ; continue with ABC-180, ABC-179 and ABC-163".

1. QE-159-f: YES. Add the owner's snapshot-waiver rule (…be910aa8: a snapshot-only src change keeps the UAT waiver only if the Orchestrator reads every changed `.snap` and records that in the Done note) to AGENTS.md. This is an explicit owner grant to amend the third kit-override paragraph. The override count stays three. AGENTS.md's waiver measurement stays the reference form, and briefs drop the `__snapshots__` filter. Routed to the Scribe.
2. SEC-177-1 follow-up: YES. Delete the two sealed notes that still hold captured foreign text from the current tree, in a new commit:
   - `security-nfr-ABC-177/notes/20261021T072219Z-security-nfr-observation-34fec102.md`, superseded by …21a20432;
   - `qe-redact-SEC-177-1/notes/20261021T080225Z-qe-e2e-decision-3bc0ee20.md`, superseded by …dae138b1.
   This is an owner-authorised exception to the append-only store, scoped to these two files only. History is not rewritten.
