---
id: 20261024T105232Z-security-nfr-observation-aa568d21
kind: observation
by: security-nfr
at: 2026-10-24T10:52:32Z
verified_by: 
confidence: high (the 28 items were read at main 36a4902e on 2026-10-23; ADR-0049 status read at main 2e67a4b5)
refs:
  - security-nfr-public-repo-redacted
  - ADR-0007
  - ADR-0018
  - ADR-0044
  - ADR-0049
  - EPIC-007
  - ABC-169
  - memory-bank/45-standing-rulings.md
  - memory-bank/70-runbook.md
  - memory-bank/30-architecture.md
  - plans/nfr-catalog.md
  - 20261023T212123Z-security-nfr-observation-4d1d39b5
supersedes: 
seal: sha256:fcb0ca1a7872a3b453382941f76d1f12cec468ff8ce1c71b9467b5d83267e2f6
---

# Posture drift since the repo became public: 28 statements, now carried by ADR-0049 (PROPOSED, the owner's)

**Why this note exists.** This note re-publishes the posture part of the 2026-10-23 review (held branch
`grugops/security-nfr-public-repo` @ `5fd5ee65`, never merged). The 28-item list was routed to Architect/Design and was read at
`main` `36a4902e`. **Not edited here.** "False" means false as a statement about today. Dated history stays as written.

**Trigger.** A git remote was added. The repository on the hosting provider was made public. `origin/main` is `55a8f4ef`.

**What still holds:**
- Nothing is deployed.
- No package is published (`"private": true`).
- No CI exists.
- `plans/releases/` holds only `.gitkeep`.
- `production_requires_human_confirmation` is `true`.

## The 28 items by file (count, and what fired)

- **ADR-0007 (deployment posture), 5 items:**
  - Context row 4 and the 2026-08-15 Fact A ("no git remote");
  - **falsifier `D3` FIRED**;
  - § Pointers 2026-10-11: its own revisit trigger fired, so **branch protection on `main` is now a real `UNKNOWN - verify`**;
  - § Note 2026-10-23.
- **ADR-0018 (channel), 5 items:**
  - Context row 3;
  - **Decision 3's "a git remote appears" trigger FIRED**, which calls for a superseding ADR, not a revert;
  - the Alternatives row;
  - **falsifier `D3` FIRED**;
  - § Note 2026-10-23.
- **ADR-0044, 7 items:**
  - D8, "nothing is published";
  - D13, "not distributed";
  - **D13's re-derive precondition was not met before publication** (now closed as LIC-PUB-1 by ADR-0048);
  - the withdrawn AGPL Source link;
  - the kit notice, now known;
  - Consequences;
  - acceptance note `…fe0a5538`.
- **EPIC-007 M10 / ABC-169, 3 items:**
  - The M10 label;
  - ABC-169 § Out of scope;
  - ABC-169 *Value*.
  - The M10 measure itself still reads MET.
- **`memory-bank/45-standing-rulings.md` § Deployment posture, 2 items:**
  - "no … git remote";
  - the stale `EPIC-006` revisit wording.
- **`memory-bank/70-runbook.md`, 3 items:**
  - "Nowhere to push";
  - "clone path only on the author's machine";
  - an open question: does public source count as a distributed artifact that is owed a "take it private" step?
- **Elsewhere, 3 items:**
  - `memory-bank/30-architecture.md`, "no git remote";
  - `plans/nfr-catalog.md`, the availability table's "No git remote" (its conclusion still holds);
  - `AGENTS.md` "deploys nowhere", which is **still true** and is listed so the ADR does not over-reach.

**Where it went.** Architect/Design drafted **ADR-0049** (*the source is public, and the engine still deploys nowhere and
publishes no package*). It is **PROPOSED** at `main` and **acceptance is the owner's**. Its § Records carries each item with a
disposition. This note does not restate them.
