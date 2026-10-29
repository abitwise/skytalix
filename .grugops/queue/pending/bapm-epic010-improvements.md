---
subtask: bapm-epic010-improvements
role: ba-pm
ref: .grugops/context/bapm-epic010-improvements/
input: .grugops/context/ideas-2026-10-29/input/owner-ideas.md (§ B, items 1–3 and 5–10)
branch: new grugops/bapm-epic010-improvements from main, worktree ../wt-bapm-epic010-improvements
ids: EPIC-010; tickets ABC-225..ABC-239 reserved (ABC-218..224 belong to EPIC-009, running in parallel)
---

# EPIC-010: engine improvements from the owner's verified ideas, cut to ready tickets

## Read (verified context only — the external list is NOT evidence)
- System Analyst `sa-ideas-verify`: the claims table `…306a4012`, which items stand `…837e6fa8`, time behaviour `…1ccf0010`.
- Architect `arch-epic008-rd`: `…0c5d62f4` and `…9d172446` (why R and D disagree).
- Orchestrator `orch-2026-10-29g`: `…ccb72dbe` (routing), `…a8bfb3be`, and `…183a5bbc` (owner: no gauntlet; EPIC-008 accepted as is; he will run longer-thinking games later).
- EPIC-008, as the house shape and for its lessons (§ D, § R, S1/S3, RISK-EPIC008-03, the not-shipped tickets ABC-205/207/209/210). EPIC-004's non-goals. The ADRs that the SA names per item.

## Do
- Write `plans/epics/EPIC-010-….md` for the items the SA left standing (1, 3, 5, 6, 7, 8 and 9 in part). Don't
  re-propose what was already tried as it was tried: ABC-209's TT retention, ABC-210's check extension, ABC-205's
  design. Where an item stands only "in part", scope it to the part that stands. Item 4 (the clock) belongs to
  EPIC-009; cross-reference it, don't duplicate it.
- **Measurement first (item 2 + the Architect's finding).** Frame a merge rule for value-changing tickets: an
  outside-opponent reading at the product budget before merge, alongside or instead of self-play D. Give its cost on
  this host (heat, hours) and the options. It is a rule the owner sets: list it as an owner question with a default,
  and don't apply it on your own.
- Order the epic into a first milestone. The external list's #1–#3 order is one input, not a ruling. Justify the order
  by the SA's evidence and by cost, and name where an ADR is needed first (for example ADR-0024 d4 for item 1,
  ADR-0026 d10 for item 6, and ADR-0002 clause 3 / ADR-0020 d2 for item 3).
- Cut tickets `ABC-225…`, each XS–L (no XL; split instead). Give each Given/When/Then acceptance, a measurable success
  (a tactical or position suite, nodes or depth, and the reading it owes), security/NFR triggers, test notes and a
  DoR score. A ticket that waits on an owner answer or an ADR stays in Backlog, with that named.
- **Owner questions** (carry them; the Orchestrator also asks them in session):
  - (1) Syzygy (item 10) against EPIC-004's non-goal: reopen or keep out?
  - (2) EPIC-004's "strength above ~1700" non-goal: cite the owner's EPIC-008 word, or amend the line?
  - (3) Re-open ADR-0020 d2 (en-passant repetition key)?
  - (4) the pre-merge outside-opponent rule.
- The board stays the Orchestrator's job. List the board lines you want in your decision note.

## Fences
- Records only: `plans/epics/`, `plans/tickets/`, your context folder. No `src/`, `data/` or `tools/` edits. No board
  edits. Never push, force, amend or rebase. Never merge into main. No host paths or usernames in records. Don't edit
  EPIC-009's files.

## Publish
- Seal notes (task `bapm-epic010-improvements`) with `at` from `date -u`: the epic decision, the owner questions with
  defaults, and the ticket list (sizes, priorities, DoR, column). Commit on your branch.
- Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
