---
id: 20261105T004230Z-architect-design-decision-21a996c9
kind: decision
by: architect-design
at: 2026-11-05T00:42:30Z
verified_by: 
confidence: high: the ADR text decides both; figures are QE's, none run here
refs:
  - arch-ABC-301-miss
  - ABC-279
  - ABC-304
  - ABC-303
  - ADR-0069
  - ADR-0050
  - ADR-0058
  - ADR-0061
  - QE-304-a
  - QE-304-b
  - src/see.test.ts
  - qe-ABC-304/20261105T001541Z-qe-e2e-decision-9ac0fbda
  - arch-ABC-303-open/20261104T233811Z-architect-design-decision-84f9bae1
  - arch-ABC-283-mate/05ef9fc9
supersedes: 
seal: sha256:5697ea0e6da3dfcf205d292d06e2238f50ef3455287fc324a49937930920c409
---

# arch-ABC-301-miss item 5: `QE-304-a`, A4 (b)'s head side re-points to `chooseMoveWithoutBundle`, no level moves. `QE-304-b`, the clause "compare with no door" is wrong, A3 (b) stays on `search()` and its reason is d8

Architect/Design, task `arch-ABC-301-miss`, records only, from `main` `701ef5bd`. Nothing was run; the figures are QE's (`qe-ABC-304` `…9ac0fbda`). Lines of record: `ADR-0069` d11's and d12's dated lines of 2026-11-05.

## `QE-304-a`: `src/see.test.ts`, `ABC-279` A4 (b)
**Ruling: re-point the head side.** `const head = reach(chooseMove)` becomes `reach(chooseMoveWithoutBundle)`. The door side stays `chooseMoveWithoutSeePruning`. The bar stays ≥ door + 0.55.
- **The rule reaches it.** Its shipped side is `chooseMove` and its other side is an older door, which is the words of `ADR-0050` d4 and `ADR-0058` d5, sent here by d8. It is not a zugzwang, mate or `G1` row. A shipped search passed to a helper by name is still the row's shipped side.
- **The level is Q1's alone.** ⌊20 · 0.7 · 0.837⌋ / 20 comes from the skip against its own door. On `chooseMove` the row reads Q1 plus the bundle, +0.989, a level nobody set for that stack (`…84f9bae1`'s reason for A3 (a)).
- **Its siblings already stand there.** A4 (a), under the same F4, re-pointed at `ABC-283`. The twin, `ABC-268` A4 (b), stands on `chooseMoveWithoutTaper`.
- **QE has read the door:** 6.716, +0.837, the ADR's figure exactly. A different reading in the hop comes back here.
- **It gates nothing.** Green on both sides, no red, no STOP, no owner word.
- **The title stays,** by `…555a9a9e` J4. A one-line comment cites this ruling.
- **Who carries it is the Orchestrator's.** One test line, colliding with `grugops/ABC-303`'s `src/see.test.ts`. The tools landing (item 3) or the next test-only hop on `main` can take it, and `ABC-303` takes it when `main` goes in.

## `QE-304-b`: "compare with no door"
**Ruling: QE's reading stands.** The clause is wrong and the conclusion is right. I did not mean it as a test, and it is not one.
- `ADR-0069` d11's dated line and `…84f9bae1` item 3 say zugzwang, mates and `G1` "compare with no door". `ABC-279` A3 (b) compares with `searchWithoutSeePruning`.
- **The reason that holds:** d8 keeps mates on the shipped path by name, and `…05ef9fc9` has this row turn green "with no re-pin" with all three parts on. A mate floor is a safety bar on the engine that ships. This row went red on the KRK defect on the shipped path, which a door could not have shown (`…9ac0fbda`).
- **So A3 (b) stays on `search()`.** The test for staying is what the row guards, not whether its reference is a door.
- **Not moved by this:** A3 (a)'s ruling stands on the rule's own naming of the d5 drift rows. The older floors that stand on doors (null move, `ABC-228`) stay where they are.
- `…84f9bae1` is sealed. This note and the ADR's line correct its one clause, as `…5aee89b7` corrected another.
