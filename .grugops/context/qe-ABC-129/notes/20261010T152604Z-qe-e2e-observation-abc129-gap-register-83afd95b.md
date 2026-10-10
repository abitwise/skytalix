---
id: 20261010T152604Z-qe-e2e-observation-abc129-gap-register-83afd95b
kind: observation
by: qe-e2e
at: 2026-10-10T15:26:04Z
verified_by:
confidence: high
refs:
  - ABC-129
  - QE-129-a
  - QE-129-b
  - QE-129-c
  - QE-129-d
  - QE-129-e
  - 20261010T152604Z-qe-e2e-decision-abc129-verdict-and-site-10-20af9428
  - 20261010T152604Z-qe-e2e-observation-abc129-readings-exit-gates-1d84da40
supersedes:
---

# QE `ABC-129` gap register: 1 LOW, 4 INFO, none blocking

This note is hand-authored and unsealed. Every gap here is pre-existing or concerns process. None
is a defect this diff introduced.

## `QE-129-a` (LOW): site #5's quoted formula is the form its new anchor disowns

- **Where:** `src/command-input.test.ts:412`. The comment quotes `` `1 + one per non-advancing
  outcome` `` and cites `runTurnLoop`'s docblock, "The render cadence".
- **What is wrong:** the paragraph at `src/turn-loop.ts:279` reads `` `1 + plies + take-backs +
  RE-EMITTING non-mutating outcomes` ``. It says the "count-every-outcome form of this sentence is
  satisfied by a build that emits a frame on EOF" (`:284-286`), and that is the form the test quotes.
- **History:** the formula was never verbatim in the loop. At `753556a4`, the commit that wrote the
  cite, the docblock already read `1 + plies + RE-EMITTING …`.
- **Effect:** for the test's input (`board` ×3, all re-emitting) both formulas give 4, so the
  assertion is right. Only the narration is wrong.
- **Not fixed by QE:** the cite is right. The ticket's `## Out of scope` fences "any wording change
  beyond the cite token".
- **Owner:** BA/PM, who cuts or declines a one-line comment follow-up.

## `QE-129-b` (INFO): the Q4 measures each have a blind spot; only the conjunction is sound

- **Measure (ii) misses type-only edits.** The `transpileModule` `removeComments` emit identity
  stays IDENTICAL under `text: string`→`String` (control N3).
- **The regex form of measure (i) misses comment-looking code.** It counts a `//` line inside a
  template literal as a comment (control N4).
- **Each blind spot is covered by the other measure.** The AST-comment form of (i) and the
  stripped-TS print (iii) see both edits. For `ABC-129`, all three measures agree on all 6 files.
- **Ask:** when the Orchestrator applies Q4 to `ABC-132` and later tickets, keep the AND and never
  one measure alone. Better, adopt the AST form of (i) or (iii)
  (`.grugops/context/qe-ABC-129/probe/exit-probe.mjs`).
- **Owner:** the Orchestrator, or the owner if it is written into the rule.

## `QE-129-c` (INFO): a `plans/traceability.md` append conflict with the wave tip

- **What:** `git merge-tree --write-tree 5b03049e <ABC-129 tip>` conflicts in
  `plans/traceability.md` only. Both sides appended rows at the end. The `src/` and ticket-page
  sides merge clean.
- **Resolution:** keep both sides' rows.
- **Owner:** whoever merges (the Orchestrator).

## `QE-129-d` (INFO): two anchors carry slightly less than their sentences say

1. **`` `A9b` `` hits 2 lines.** `:329` is the arm, and `:409` is a mention inside `A10b`'s block
   ("This is `A9b`'s answer"). A reader grepping it lands on the arm first.
2. **#6 "Transition 1 → 2" carries half of #6's sentence.** It covers "evaluates once before the
   first frame". It does not cover "and never again on this path", which the docblock's
   "A NON-MUTATING OUTCOME IS NOT RE-EVALUATED" paragraph carries.

The original line cites had the same reach, so this is no regression. No action is needed.

## `QE-129-e` (INFO): the AGENTS.md `ENGINE_DEEP` count is stale, and this ticket did not cause it

- **What:** `ENGINE_DEEP=1 npx vitest list src/engine.test.ts` collects 46 (33 default). AGENTS.md
  records "45 passed (32 default)".
- **Cause:** both numbers moved by one, consistent with `ABC-125` (`6a25164c`, the last commit to
  `src/engine.test.ts`).
- **Owner:** the AGENTS.md scribe. AGENTS.md is fenced from this hop.
