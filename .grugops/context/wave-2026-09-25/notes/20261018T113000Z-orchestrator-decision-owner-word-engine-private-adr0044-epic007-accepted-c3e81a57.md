---
type: decision
role: orchestrator
task: wave-2026-09-25
at: 2026-10-18T11:30:00Z
sealed: false
refs: [EPIC-007, ADR-0044, ABC-169, ABC-172, ABC-166]
---

# Owner word, 2026-10-18: the engine stays private, ADR-0044 and EPIC-007 accepted

The owner's reply, verbatim:

> *"License: let's keep private for now ; Q14: keep it ; Q15: picked private ; accept the revised ADR-0044 and EPIC-007 ; ABC-166 - not
> yet, it is not evening yet."*

- **Licence.** The engine is **private, all rights reserved**, and this supersedes the AGPL-3.0 readings (`…6b2d90f1`, ADR-0044 D13 as of
  `459d6741`).
  - The repo gets no open-source LICENSE. The package declares `"private": true` and `"license": "UNLICENSED"`.
  - The four MIT kit files in `tools/grugops/` keep their MIT notice; MIT allows use in a private repo.
  - ABC-169 is re-scoped to declaring private.
- **Michniewski tables.** The Orchestrator's default reading: the owner said nothing about them. A private engine that is not distributed
  (it runs on the owner's own backend over stdio) does not "share" the CC BY-SA material.
  - The tables stay as they are, with an attribution comment in `src/evaluate.ts`.
  - Re-deriving our own values is recorded as a precondition for any future distribution of the engine to third parties, for example a
    browser bundle or a published binary. A ticket for it is cut only on the owner's word.
  - The owner may correct this.
- **Q14.** `npm run chess` keeps its name.
- **Q15.** Moot, because private was chosen.
- **Acceptance.** **ADR-0044 is ACCEPTED** as revised, with D13 rewritten to private. **EPIC-007 is ACCEPTED** as revised. The DoR item
  "owner acceptance" is met on ABC-167..172. The tickets enter Ready only as far as Ready's WIP limit allows.
- **ABC-166.** Not yet: the owner will say "take it" in the evening.
