---
id: 20260926T213500Z-software-engineer-artifact-ref-knight-g1-pair-docstring-corrected-comment-only-4f1c9d27
kind: artifact-ref
by: software-engineer
at: 2026-09-26T21:35:00Z
verified_by:
confidence: high
refs:
  - ABC-081
  - ABC-121
  - ABC-075
  - ADR-0006
  - ADR-0025
  - src/transposition.test.ts
  - 20260926T034200Z-architect-design-decision-g6-pair-is-a-decision-4-row-repoint-stands-no-new-row-ea306e58
  - 20260926T203000Z-architect-design-decision-g6-ruling-amendments-written-into-adr0026-adr0006-b7e41c92
  - 20260926T201000Z-orchestrator-decision-52aaf5f3
supersedes:
---

# `KNIGHT_G1_PAIR` docstring corrected, comment only

Hand-authored, no `seal`: this repo ships no `context-io` writer and no `propose_note` tool was
surfaced at this hop, so it follows the `amend-adr0026` precedent (`…b7e41c92`). An
`artifact-ref`, so no stamp.

- **Owner's word:** Olger Oeselg, 2026-09-26, "run items 1-3" (item 2 = this fix). The `ADR-0006`
  erratum that `…ea306e58` §4 made this edit wait on was accepted earlier ("3. accept", `…52aaf5f3`).
- **Branch:** `grugops/knight-g1-docstring`, off `652ed49`. Not merged, not pushed.
- **Change:** `src/transposition.test.ts`, the `ABC-081` docstring above `KNIGHT_G1_PAIR`, +6/−2.
  Removed: "A key that hashed castling AVAILABILITY would give both the same key, and the table
  would hand one the other's score: `G6`'s FAIL." Now: the pair records only the premise that the
  subtrees differ (830 vs 820 at depth 4 on the pre-`ABC-121` search). It detects no key bug,
  because the table lives one search (`ADR-0025` decision 4). `G6`'s guard is "G6 bites" and
  `zobrist.test.ts`'s castling-rights rows (`ABC-075` `A4`), and the comment points to the
  `ADR-0006` `G6` erratum. Wording follows the erratum text (`…ea306e58` §3).
- **Not changed:** no assertion, identifier, literal, other comment, or `src/` production line.
- **Checks run:** `npm test` gave 48 files, 1 467 passed, 0 skipped. `npm run lint` and
  `npm run typecheck` are clean.
- **Left open:** `ADR-0006`'s 2026-09-25 amendment paragraph still carries the same premise
  (`…b7e41c92` Risks). It is out of scope and needs its own proposal.
