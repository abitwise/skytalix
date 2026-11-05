---
id: 20261105T000021Z-software-engineer-decision-aa228da0
kind: decision
by: software-engineer
at: 2026-11-05T00:00:21Z
verified_by: 
confidence: high: the ticket and the decision fix the form; items 2 and 3 are my reading, disclosed
refs:
  - se-ABC-304
  - ABC-304
  - ABC-271
  - ABC-279
  - ABC-283
  - ADR-0070
  - ADR-0069
  - ADR-0072
  - ADR-0063
  - NFR-009
  - arch-ABC-303-open/20261104T233941Z-architect-design-decision-e28552ac
  - bapm-K0-cut/20261104T235027Z-ba-pm-decision-555a9a9e
  - grugops/ABC-304
  - df426688
  - 9e0d4044
supersedes: 
seal: sha256:c94d6e04ec700256483eda403e054339cdd81e9004b7aaf17882436af5403bc6
---

# se-ABC-304: the build followed the ticket's form; four small choices

Software Engineer, task `se-ABC-304`, branch `grugops/ABC-304` from `main` `df426688`. K0's block was on `main` at the claim, so the ticket did not shrink.

1. **K0's five `chooseMove` rows re-point through their one helper.** `deepenTo` now calls `chooseMoveWithoutBundle`, and the two `search` rows call `searchWithoutBundle`. The file's two imports change, since neither old name has another use there.
2. **One comment per re-point, not one per row.** K0 has one comment above the helper, and A3 (a) one above its two rows. Each cites its dated ADR line. Scope 4 says "one comment on each re-point"; I read each block as one re-point. QE can overrule that.
3. **A3 (a)'s log labels stay,** as "search() d5" and "chooseMove to d5", beside the titles the ticket keeps. So the lane log says `search()` over a door, as J4 of `…555a9a9e` accepts for the title.
4. **`transposition.test.ts`'s two deep lanes both ran.** `AGENTS.md` lists a `SEARCH_DEEP` and an `ENGINE_DEEP` lane for that file, and the brief asks for the deep lane of every file touched.
