---
id: 20261011T083630Z-architect-design-decision-abc083-adr0031-cut-does-not-fire-what-ships-1b1f103b
kind: decision
by: architect-design
at: 2026-10-11T08:36:30Z
verified_by: 
confidence: high
refs:
  - ABC-083
  - ADR-0031
  - ADR-0034
  - ADR-0039
  - memory-bank/50-decisions/ADR-0039-abc083s-two-r-reds-are-not-defects-the-owner-re-levels-them-and-an-r-red-is-not-a-cut-trigger.md
  - .grugops/context/ticket-to-pr-ABC-083/notes/20261010T194248Z-software-engineer-observation-abc083-a5-cost-three-forms-two-sessions-5b2e9f10.md
  - .grugops/context/ticket-to-pr-ABC-083/notes/20261010T194248Z-software-engineer-observation-abc083-a7-a9-depth-and-nodes-to-depth-7-9d4c3a61.md
  - .grugops/context/wave-2026-09-25/notes/20261010T201446Z-orchestrator-observation-handoff-5-e41d7a20.md
supersedes: 
seal: sha256:4b41aa6fb45e745f8b2a21c03dc350222ddc002443f2734c696e872339a909d9
---

# `ADR-0031`'s cut does NOT fire on the record. An R red is not one of its triggers. Handoff #5's split is the owner's scope word, not an agent move

Recorded through `context-io.js` `appendNote` (sealed and admitted, no stamp). A decision, not a finding.

- **Triggers as written:**
  - every mobility form misses `A5`. **It is met**: 775.8 ns over two sessions, 636 ns at `79248602`.
  - an `A9` stop while depth 7 stays a level (d5). **Kiwipete held depth 7 in every branch run.** Position-6 lost
    it once, inside a load spike, at a 1.04–1.07x margin. Whether that is a stop is **Security/NFR's reading**.
  - **A puzzle red never fires the cut** (`ADR-0034` d6).
- **Nothing ships yet. Two outcomes:**
  - **(a) Mobility ships** (king safety + attack-map mobility, as built). This needs four things:
    - the owner accepts `ADR-0039`, and the two re-levels land under its conditions;
    - QE's 5061 class is resolved;
    - Security/NFR rules `N8-LANE` and does not stop `A9`;
    - rebase, QE review, and the owner's UAT word.
  - **(b) King safety alone ships.** This follows from an `A9` stop (cut through `ADR-0031` d5) or from the
    owner declining `ADR-0039` and giving the scope word. The Engineer then:
    - removes mobility, `evaluateWithoutMobility` and the `A4` rows;
    - re-pins `A10` class P from king-safety-only measurements (`rows-ks.json` holds them);
    - re-checks every fixture bite on that build.

    Rows 14/15 read 27.66% / 18.29x there, green on the current levels. `A5` reads about 455 ns. Puzzle 5061 is
    still red (53/58), on the same QE route. `N8-LANE` is re-read by Security/NFR.
- **For BA/PM, only under (b):**
  - re-cut `ABC-083`'s page: title, scope, drop `A4`, and `A5`'s route;
  - cut a `Backlog` mobility ticket from the PR note:
    - all three forms' readings from one session (`…5b2e9f10`);
    - the term shape (`…c7a1e4d2`);
    - rows 14/15 and their weight sensitivity;
    - position-6 nodes to depth 7 +39.2%;
    - `N8-LANE` +1.08 s.
- **For BA/PM under (a):** fold the owner's `ADR-0039` word into `A10`.
- **Re-weighting to 1 cp** clears both rows (30.44% / 21.18x). It is **not a route**: it tunes the code to a bar.
