---
id: 20261011T083621Z-architect-design-decision-host-protection-exit-2-is-could-not-run-not-pass-not-fault-647fad5d
kind: decision
by: architect-design
at: 2026-10-11T08:36:21Z
verified_by:
confidence: high
refs:
  - ADR-0007
  - QE-141-d
  - QE-142-f
  - tools/grugops/host-protection.js
  - agent-factory/workflows/05-pr-quality-gate.md
  - 20261010T201446Z-orchestrator-observation-handoff-5-e41d7a20
  - 20261010T190811Z-ba-pm-decision-backlog-rescored-r1-two-drop-four-ready-one-held-abc142-cut-d8990fbb
  - 20261010T185518Z-qe-e2e-observation-abc141-gap-register-baafc88b
  - 20261010T192804Z-qe-e2e-observation-abc142-gap-register-68f78a28
supersedes:
---

# Item 6: `host-protection.js` exit 2 means "could not run", neither a pass nor a fault. Gates keep `UNKNOWN - verify` and add the N/A qualifier

This note is hand-authored and unsealed. The only command run was `git remote -v` (0 lines).

## The question
QE recorded exit 2 at `ABC-082`, `ABC-093`, `ABC-141` (`QE-141-d`) and `ABC-142` (`QE-142-f`). BA/PM
recommended that gates write *"N/A — no git remote (`ADR-0007`)"* instead of `UNKNOWN` (`…d8990fbb` item 5).
Is exit 2 a pass, an N/A, or a fault?

## Ruling
- **The contract.** It is the tool's header (`D-12`) and the kit's gate step 3. Exit 2 means `UNKNOWN - verify`
  on a branch, with none `unprotected`, or "could not run". *"Exit 2 is never a pass."* The gate records
  `UNKNOWN - verify` with the printed reason. The check never changes the terminal result on its own.
- **Not a pass.** No note may say the host floor exists. Here there is no host (`ADR-0007` `D3`). The merge
  floor is the human who merges.
- **Not a fault.** It is not a finding against the ticket. It uses no self-fix attempt and blocks nothing.
- **The one exception: a fault of the invocation.** That is exit 2 with a printed reason that is a refused
  command line or a thrown error. Fix the command and re-run.
- **N/A is right as a qualifier, not as a replacement.** A gate writes:
  `host-protection.js: exit 2, UNKNOWN - verify (<reason as printed>). N/A in this posture: no git remote
  (ADR-0007 D3; git remote -v printed 0 lines at this run).`
- **Where this differs from BA/PM.**
  - The kit prescribes the token, and the kit is read-only.
  - The printed reason, *"gh returned no readable HTTP status"*, is also what a missing `gh` login looks
    like. "N/A" is only true when the same run checks `git remote -v`.
  - A bare "N/A" written from habit would outlive a remote's arrival and hide a real `UNKNOWN`.
- **Revisit trigger:** `D3` fires (a remote is added, `EPIC-006`). Then exit 2 is a real `UNKNOWN - verify`
  for a human, and the qualifier is dropped.

## Recorded
`ADR-0007`, a Status pointer and `§ Pointers 2026-10-11`. No clause is amended.

## Follow-ups
- **QE and Security/NFR, at every gate:** use the line above, and run `git remote -v` in the same gate run.
- **Orchestrator:** cite this note in gate briefs. No ticket is needed.
- **Scribe:** none. `AGENTS.md` carries no host-protection line.
