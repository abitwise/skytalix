---
id: 20260926T204400Z-architect-design-decision-adr0006-amendment-sentence-rescope-not-strike-proposed-text-9c4d2b18
kind: decision
by: architect-design
at: 2026-09-26T20:44:00Z
verified_by:
confidence: high
refs:
  - ADR-0006
  - ADR-0025
  - ABC-081
  - memory-bank/50-decisions/ADR-0006-castling-rights-stay-rights-in-the-hash.md
  - 20260926T235000Z-orchestrator-decision-c99c5919
  - 20260926T204300Z-architect-design-observation-availability-key-collides-inside-one-search-no-root-score-moved-5e1a7c30
  - 20260926T034100Z-architect-design-observation-g6-score-pair-reds-no-castling-key-bug-on-any-path-0a3528d1
  - 20260926T203000Z-architect-design-decision-g6-ruling-amendments-written-into-adr0026-adr0006-b7e41c92
supersedes:
---

# PROPOSAL: `ADR-0006`'s 2026-09-25 amendment sentence is rescoped, not struck. The exact text is below, and the owner decides

Hand-authored, no `seal` (same precedent as `…b7e41c92`). It is a `decision` and a PROPOSAL.
**This note does not edit `ADR-0006`.** The owner's word dispatched it: Olger Oeselg, 2026-09-26,
verbatim *"1. ok ; both"* (`…c99c5919`, item 2). The text needs his word before it is applied.
The evidence is `…5e1a7c30`.

## Scope

- In scope: one sentence in `ADR-0006` § "Amendment — 2026-09-25", and one erratum paragraph
  added under it.
- Out of scope: the Decision, the bold "rights key is REQUIRED" lead, the three measured bullets,
  the rest of the paragraph, the `G6` row and its 2026-09-26 erratum. All of them stand.

## 1. What is wrong and what is still true

The sentence is *"An availability key would collide the two, and the table would return a wrong
score."*

- **"collide the two": true for the keys, wrong as a table claim.** The two roots do share an
  availability key (measured). They never share a table, because `clearTable` runs at every
  `search()` (`ADR-0025` decision 4). So the collision of *the two* never reaches the table. This
  is the premise that `ruling-abc121-g6` removed from the `G6` cell and that the Engineer removed
  from the `KNIGHT_G1_PAIR` docstring. This sentence is its last copy.
- **"the table would return a wrong score": true only inside one search, and "wrong" is
  unproven.** Inside one search the same kind of pair recurs as interior nodes. An
  availability-keyed table hands a node another position's entry and cuts on it: 3–8 times per
  search from `knight-g1 w K` at depths 4–6, 17 on kiwipete and 2 on position-5 at depth 4. The
  rights key never does this. No root score moved on any of 32 readings. Whether a foreign
  cutoff was wrong for its node was not measured.
- **So the amendment's conclusion survives, on a narrower ground.** A table entry must belong to
  the position that probes it. The rights key guarantees that. An availability key breaks it,
  measured. That is enough for "REQUIRED" and it does not need a wrong root score. Striking the
  sentence would drop the only in-search reason the paragraph gives.

## 2. Proposed text: replace the sentence in place

In `ADR-0006` § "Amendment — 2026-09-25", replace exactly:

> An availability key would collide the two, and the table would return a wrong score.

with:

> An availability key would give the two the same key. They never share a table, because the
> table lives one search (`ADR-0025` decision 4), so the pair's own two scores are never
> confused. Inside one search, though, positions that differ only in such a right recur as
> interior nodes. A table keyed on availability hands such a node the other position's entry
> and cuts on it, which the rights key never does. That was measured on this pair, kiwipete and
> position-5, and no root score moved on the readings taken. *(amended <date>)*

The next sentence ("So the "Consequences" bullet … resolves as follows.") and everything after it
stay word for word.

## 3. Proposed text: erratum paragraph, appended after the existing 2026-09-26 `G6` erratum (end of file)

> *Erratum to the amendment's collision sentence, <date> (Architect/Design, subtask
> `adr0006-amend-sentence`), on the owner's word (<owner, date, verbatim>, `<note id>`).
> Proposed in `adr0006-amend-sentence` (`…9c4d2b18`, evidence `…5e1a7c30`). The sentence read:
> "An availability key would collide the two, and the table would return a wrong score." The
> first half holds for the keys only. The two roots never share a table, because `clearTable`
> runs at every `search()` (the `G6` erratum above). The second half holds only inside one
> search. There an availability-keyed table cut on another position's entry 3–8 times per search
> from `knight-g1 w K` at depths 4–6, 17 times on kiwipete and twice on position-5 at depth 4. No
> root score changed on any of the 32 readings. Whether any of those cutoffs was wrong for its
> node is `UNKNOWN - verify`. No clause of the Decision changes, the table still keys on rights,
> and `G6` is unchanged.*

The `<date>`, `<owner, date, verbatim>` and `<note id>` placeholders are filled in when the
owner's word is recorded. They follow the `…b7e41c92` pattern.

## 4. Alternatives rejected

- **Strike the sentence.** This fails the facts. Half of it is true inside one search, and that
  half is the in-search reason "REQUIRED" rests on.
- **Leave it.** It restates the premise already corrected in the `G6` cell and in the docstring,
  and a reader would draw the root-pair inference again.
- **Rewrite the whole amendment.** That is gold plate. One sentence is wrong, and the rest reads
  true.
- **Claim "a wrong score" at the root on this evidence.** That is not on record. 32 of 32 root
  readings were equal.

## Risks

- The in-search counts come from the probe's own availability predicate (`…5e1a7c30` §Risks). A
  different predicate could give different counts. The root-pair half does not depend on it.
- The trace row is appended in this branch's `plans/traceability.md`. The board is not edited.
