---
id: 20261021T094500Z-orchestrator-decision-8d0de2f4
kind: decision
by: orchestrator
at: 2026-10-21T09:45:00Z
verified_by: 
confidence: high
refs:
  - ABC-163
  - AR-095-L1UNIT
  - AR-163-DELONLY
  - AR-163-UNCOMMENT
  - AR-180-VALIDATED
  - 20261021T093522Z-security-nfr-decision-3e4b4a08
  - 20261021T093843Z-architect-design-decision-b4c6e51b
supersedes: 
seal: sha256:6b07fcc539bf6a8b5174013feafa72065efeae70efd674021c00caadf84e6e45
---

Orchestrator records, on the merge of ABC-163 to main (instrument `87d3897d`, ADR-0036 § S1 text `569a384c`):

- AR-095-L1UNIT is CLOSED. QE (…8a60d7c8) read A1–A3 met with its own plants, and Security/NFR confirmed in …3e4b4a08. The by-hand Ruling 2 check retires, until AR-163-DELONLY's trigger fires without its fix.
- AR-180-VALIDATED: part (i) of its close condition is now met. It stays OPEN until the G-2 pin lands and QE reads TMO red.
- AR-163-DELONLY is OPENED. LOW, latent; owner Orchestrator; fix by Architect/Design. The trigger is a limb-1 holder gaining any of: a guard, a parameter or caller-supplied value at the read, a multi-line read; or a second limb-1 holder appearing. Owed before that ticket merges: Ruling 2 widens to any changed line, and the instrument drops its `!lines.size` skip. Until then the Orchestrator runs the by-hand `--name-only` check on such a ticket.
- AR-163-UNCOMMENT is OPENED. LOW, pre-existing; owner Architect/Design. The trigger is a production block comment holding limb code that would compile without its delimiters.

Kept on purpose: the Architect's bracketed "QE's `G-2`" next to AR-163-UNCOMMENT, for traceability.
