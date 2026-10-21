---
id: 20261021T091932Z-architect-design-decision-c7df0411
kind: decision
by: architect-design
at: 2026-10-21T09:19:32Z
verified_by: 
confidence: high on the condition; the close itself waits on QE's done record (absent at writing)
refs:
  - ABC-163
  - AR-095-L1UNIT
  - ADR-0036
  - grugops/ABC-163
  - 87d3897d
  - d8c073e2
  - dc4d4f15
  - 341da4c1
  - 20261021T090518Z-software-engineer-decision-78d30164
  - 20261021T090519Z-software-engineer-observation-b896aae8
  - .grugops/context/secnfr-ABC-095-s3/notes/20261012T153000Z-security-nfr-decision-s3-result-pass-with-risks-qe095a-qe095e-ruled-b65b11b7.md
  - .grugops/queue/claimed/arch-ABC-163-adr/arch-ABC-163-adr.md
  - 20261021T091929Z-architect-design-observation-a76b1b2e
  - 20261021T091930Z-architect-design-decision-c3568326
  - 20261021T091931Z-architect-design-decision-a7d9c818
  - AR-095-CWD
  - F-095-1
  - qe-ABC-163
supersedes: 
seal: sha256:1ac9c36e3efdaeaaafa52d83d8cfa5813582b79c0409bdf530d4dfbe293609b5
---

# Decision 3: `AR-095-L1UNIT` closes on this fold plus QE's re-plants, at the merge. Design owes nothing more

**The close conditions on record, each mapped:**
- **`ADR-0036` § S1:** "It closes when `clause-b.mjs` fires on a `+` line in a limb-1 holder. The fold needs at least
  the two plants above, and they must fire." The code does this (decision 1). P2b and P2c are `A1`.
- **Security/NFR `…b65b11b7`:** "an empty-holder case that does not fire". That is `A3`.
- **The `ABC-163` page:** "closes when QE reads `A1`–`A3` with the plants". That is QE's hop.

**Ruling.** `AR-095-L1UNIT` closes when both of these hold:
1. QE's `qe-ABC-163` done record reads `A1`, `A2` and `A3` MET under `87d3897d`, with QE's own plants, not the SE's
   script.
2. `grugops/ABC-163` merges to `main`. The merge is the owner's.

The Orchestrator records the close at the merge. Until then it keeps the by-hand check, with holders at both ends.

**Status now.** QE's done record did not exist when this was written. The fold's side is met on the code, on the SE's
readings and on this role's P2b plant. The close waits on QE.

**What does not hold the close:**
- the deletion-only case, which is outside `AR-095-L1UNIT`'s words;
- decision 2's ADR wording.

**If QE reads any of `A1`–`A3` as not met,** the risk stays open, the by-hand check continues, and the instrument
returns to this role.

**After the close:**
- `F-095-1` is unaffected; Ruling 2 already closed it.
- `AR-095-CWD`'s interim control moves from the by-hand check to the instrument.
- § Decision 3's residual and its re-armed trigger are unchanged.
