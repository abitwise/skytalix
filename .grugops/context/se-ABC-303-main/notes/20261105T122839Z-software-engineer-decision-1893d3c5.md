---
id: 20261105T122839Z-software-engineer-decision-1893d3c5
kind: decision
by: software-engineer
at: 2026-11-05T12:28:39Z
verified_by: 
confidence: high
refs:
  - ABC-303
  - ABC-282
  - ABC-286
  - ABC-288
  - EPIC-011
  - ADR-0056
  - ADR-0069
  - ADR-0071
  - ADR-0072
  - ADR-0073
  - NFR-009
  - QE-304-a
  - orch-2026-10-30a/20261105T114920Z-orchestrator-decision-16e0ec2c
supersedes: 
seal: sha256:e40a51cf702d224f86f9498babf0f16c75cbe843b791781bad049d41dc625a48
---

# se-ABC-303-main decision: how `main` went in and how items 3-5 were written

`git merge`, no rewrite: `39a5b912`. Items 3-5: `c0c5b84c`. Two conflicts, neither settled by moving a value.

1. **`src/see.test.ts`, `ABC-279` A3 (a):** took `main`'s door, `searchWithoutBundle` / `chooseMoveWithoutBundle`, the door of record (`ADR-0069` d11's dated line; `ABC-303` test note 4). The all-off imports `searchWithoutQuietBundle` / `chooseMoveWithoutQuietBundle` went with it, as nothing else in the file used them.
2. **`plans/traceability.md`:** both sides' rows kept, `main`'s first.
3. **`src/engine.ts` merged with no conflict.** W1's partial register and the bundle's `previous` argument sit side by side in `runIteration`; S1 and S2 below read the result.
4. **Item 3:** `reach(chooseMove)` to `reach(chooseMoveWithoutBundle)`, door side, title and bar unchanged, one comment citing the ruling (`…21a996c9`). `chooseMove` is then used only as a type in that file, so its import is `type chooseMove`, as lint requires.
5. **Item 4:** `countermoveByteLength()` is an added term in A7's sum, with its import and comment. The level is unchanged.
6. **Item 5:** A3 (a)'s comment now names the door, and says why it is not `…WithoutQuietBundle`. `de15cfb2`'s wrong clause, "measures `ABC-279`'s skip", went in the merge. The row's 90.91 %, 96 cp, 0 changes on the shipped path is for the PR list (test note 4).
7. **The claim came after the merge commit,** since the brief reached the branch only through it. A bare `mkdir` of the claim directory came first.
