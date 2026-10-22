---
id: 20261022T140148Z-orchestrator-decision-5aaf7cec
kind: decision
by: orchestrator
at: 2026-10-22T14:01:48Z
verified_by: 
confidence: high
refs:
  - memory-bank/45-standing-rulings.md
  - AGENTS.md
  - ABC-168
  - ABC-178
  - ABC-197
supersedes: 
seal: sha256:43ce9165f7349b6a64f438632579705af8dbb10f7e0149f8d6690a26f50e76ca
---

# The owner's standing delegation, 2026-10-22. A transcription, not a stamp

Verbatim: *"i'll handle all decisions to you, unless some big decision needs to be made regarding architecture or requirements. Also let QE verify and let's trust the results. Reduce human gates to minimum, my role as human is stakeholder in this project."*

## How the Orchestrator reads it (standing, from now on)
1. **Delegated to the Orchestrator:** the delivery decisions the owner used to make in session. That covers pulls and priorities, routing, accepting LOW and MEDIUM risks and QE gaps, the timing-protocol details (for example the thermal rule), and housekeeping.
2. **UAT:** the `In UAT` exit is signed by an agent-run acceptance. QE's recorded verdict (PASS or PASS_WITH_GAPS with no blocking gap) against the ticket's UAT criteria is trusted. This supersedes the 2026-08-16 rule that "a green agent report does NOT count as his acceptance", and the owner's word is no longer required. The acceptance is recorded as a `decision` that names the QE verdict note, never as a human stamp.
3. **Still the owner's (escalate):** big architecture decisions (a new ADR, or one that changes or reverses an accepted one); requirement or scope changes (EPIC goals, M-criteria, dropping a requirement, moving an NFR bound such as NFR-008's 10 s); accepting a HIGH security risk (`security.block_on: high`); and anything that touches `production_requires_human_confirmation`, which stays `true` (nothing deploys).
4. **Unchanged:** the gates stay blocking (`quality.gate_enforcement`), every ticket still gets a QE hop, merges still need green gates before and after, and the kit's hard limits hold. Physical host preconditions the agents cannot meet (AC power, pausing another session) are still asked for, as environment facts, not as decisions.

## Applied now
- **ABC-168:** the owner's acceptance of A8–A10 (`…0b63d92f`) stands. The missing A8/A9 raw evidence is accepted by the Orchestrator under this delegation. It is recorded as a gap, not hidden: cutechess and GUI interoperability are not tool-verified. Merge proceeds on green gates.
- **ABC-178:** pulled. Thermal rule for its B8 reading: "thermal kept and flagged" (BA/PM's recommendation), for this reading only.
- **Written rules:** a Scribe hop updates `memory-bank/45-standing-rulings.md` § Test and UAT authority and `AGENTS.md` § Standing rulings to match.
