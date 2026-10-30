---
id: 20261030T045127Z-ba-pm-observation-1ff9828b
kind: observation
by: ba-pm
at: 2026-10-30T04:51:27Z
verified_by: 
confidence: high on the source mapping (read); nothing timed or played
refs:
  - bapm-q3c-oq228ii-fold
  - EPIC-010
  - ABC-241
  - ABC-228
  - ABC-225
  - ABC-230
  - OQ-228-1
  - ADR-0020
  - ADR-0053
  - ADR-0045
  - ADR-0044
  - ADR-0054
  - ADR-0038
  - NFR-004
  - NFR-005
  - NFR-002
  - orch-2026-10-29g/20261030T044400Z-orchestrator-decision-c4ab73de
  - arch-q3c-oq228ii/20261030T044213Z-architect-design-decision-b86f7d93
  - arch-q3c-oq228ii/20261030T044205Z-architect-design-observation-54dd698c
  - main 7b8eeb94
supersedes: 
seal: sha256:15aa4b141948539f785f9b23734dfe38c22b1ef57036e994b313a790bf1c4f0d
---

# Where each fold item comes from (records read at main 7b8eeb94)

Read: the brief; the owner note `…c4ab73de`; the Architect's `…b86f7d93` and `…54dd698c`; `ADR-0020` § Status and
§ AMENDMENT 2026-10-30; `ADR-0053` § Status, decisions 9 and 10; the ABC-228, ABC-230 and ABC-225 pages; EPIC-010;
`tools/rating/rating.ts` on main (`:405` `mode === "r" ? 3000 : budget`, `:62` `CEILING_MS = 5000`, `:383-384` st and
timemargin derived from ms); `git show 9988a778:tools/rating/rating.ts` (ABC-225's branch: `:410` the same r literal,
`:660` rpair's `budget: 3000`; 9988a778 is not an ancestor of main); `src/levels.ts:54` and `src/engine.ts:132` (both
3_000). Nothing was run except `node tools/grugops/reference-check.js` on the four edited pages: "No findings.", exit 0.

| fold item | source |
|---|---|
| ABC-241 scope C1–C4 | ADR-0020 amendment § Decision |
| ABC-241 A1–A9 | the amendment's Consequences, "The tests the ticket owes" and "Gates" |
| ABC-241 A10 | EPIC-010 § The merge rule; the amendment's Values bullet (repetition-ending count, as ABC-230 A7) |
| ABC-241 NFR-002 line | the amendment's NFR bullet; NFR-002's catalog target (< 16 ms per frame) |
| ABC-241 waits on ABC-230 | the amendment's Status; owner-note delivery ("ABC-230 is not re-scoped") |
| ABC-228 Scope 5, A9, A5/A6 under (ii) | ADR-0053 d10 2026-10-30 block (code, forecast, G9, gates, R frame) |
| ABC-228 § Follow-ups | ADR-0053 d10 "What must be re-read or re-pointed", plus its ADR-0045 fold and EPIC-008 lines |
| R literal placement | brief item 2; ADR-0053 d10 ("BA/PM places it"); ABC-225 Blocked (board, qe-ABC-225 THERMAL STOP) |

Next free id: `grep -rln "ABC-24[1-9]"` over plans, memory-bank and .grugops/context returned nothing.
