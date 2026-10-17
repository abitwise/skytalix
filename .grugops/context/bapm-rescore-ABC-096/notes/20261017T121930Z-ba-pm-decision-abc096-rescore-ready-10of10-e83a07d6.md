---
id: 20261017T121930Z-ba-pm-decision-abc096-rescore-ready-10of10-e83a07d6
kind: decision
by: ba-pm
task: bapm-rescore-ABC-096
at: 2026-10-17T12:19:30Z
verified_by:
confidence: high
refs:
  - ABC-096
  - ABC-095
  - ABC-043
  - ADR-0043
  - ADR-0009
  - ADR-0029
  - NFR-002
  - NFR-007
  - NFR-008
  - EPIC-005
  - 20261017T121902Z-ba-pm-observation-abc096-rescore-readings-5c2e91b4
  - 20261017T121500Z-architect-design-decision-abc096-seam-precedence-and-size-27c10876
  - 20261017T121135Z-orchestrator-decision-abc096-product-calls-21ce2dfa
  - 20261017T120435Z-orchestrator-decision-owner-word-abc096-specifics-delegated-a793f166
supersedes:
---

# ABC-096 is DoR 10/10 at `8ed9ba2b`. `S` and `P3` hold. Recommended: `In Design` → `Ready for Dev`

This note is hand-authored and unsealed. The authoritative text is the ticket page's `## Acceptance`,
`## Build contract`, `## UAT observations` and `## Re-score — 2026-10-17`. This note records the choices.

## The decisions

1. **Item 10 is discharged by `ADR-0043`.** The re-size trigger does not fire: `RenderSeam`'s type and
   `src/turn-loop.ts` are unchanged. **`S` holds. `P3` holds**, and this is still the epic's droppable bullet.
2. **Criteria.**
   - `A1`, `A2`, `A4`, `A5`, `A6` and `A8` are amended.
   - `A9` (messages win, and 0 lookups when the loop supplies messages) and `A10` (a real probe in the frame-path
     guard, with a positive control) are added.
   - `A3` and `A7` are unchanged in substance.
3. **`A5` is decided as the current position's own name, or nothing** (`ADR-0043` D5). Under the delegation, this
   was not a question for the owner.
4. **The cut is counted in UTF-16 code units, without splitting a code point.** This is BA/PM's clarification of
   `ADR-0043` D3 (observation `…5c2e91b4`).
   - It is a criterion that `A1`/`A4` can test, and not a new design.
   - **It meets D3's letter and its stated purpose.** Counting code points literally would leave a reachable
     `(+1 more)` lie on hostile astral input in unicode mode.
   - **Recommended to the Orchestrator:** ask Architect/Design for a one-line acknowledgement in an `ADR-0043`
     addendum when convenient. **This is not blocking.**
5. **`NFR-007` is touched.**
   - The measurable target is the probe's first call, now made before frame 0, at ≤ 30 ms cold. That is
     `ABC-095` `A2`'s existing bar for the same parse, so no new number was invented.
   - `< 2 s` does not move.
   - Security/NFR measures it on the build.
6. **The code fence is `ADR-0043`'s list**: 3 production files, 4 test files and 0 new files.
   - The must-not-change list names `src/frame.ts`, `src/turn-loop.ts`, `src/book.test.ts`, `src/book-file.ts`,
     `src/book-engine.ts`, the snapshots, the data and `tools/`.
   - A red that can only be fixed outside the fence is raised, never widened into.
7. **UAT observations for the owner** (UAT is not waived):
   - the flicker (accepted, `…21ce2dfa`);
   - the overdrawn missing-book warning (accepted; stderr still carries it once);
   - ASCII accent loss (accepted 2026-10-12).
   - Each comes with a way to observe it.
8. **The page prose budget.** The 2026-10-10 and 2026-10-12 DoR narrations are folded into a history table. Their
   full text is in git at `8ed9ba2b` and in their own notes. The page is 381 lines, over the 300-line median target
   in `AGENTS.md` rule 2. The extra length is acceptance criteria, which the rule keeps in the ticket.

## Owed by others

- **Orchestrator:**
  - the column move;
  - the `Ready for Dev`-exit criteria re-read (process rule 1);
  - the board row, whose "DoR 8/10" is stale;
  - the optional request for the Architect's addendum.
- **Engineer:** build to the page's § Build contract.
- **Security/NFR:** `A3`, `A4`, `A7` and the `NFR-007` first-call reading.
