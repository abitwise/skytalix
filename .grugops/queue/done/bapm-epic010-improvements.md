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

## Result (ba-pm, 2026-10-29T20:15Z): **EPIC-010 cut (proposed, P2, L). Measurement first: the pre-merge outside-opponent rule is framed as owner Q4 (options a-d, default (d) hold, BA/PM's reading (b)). Milestone 1 ordered. `ABC-226` and `ABC-227` (records scan, profile; 0 games) are `Ready`; `ABC-225`, `ABC-228`-`ABC-239` wait in `Backlog`.**

Claimed at 20:03:11Z. Records only, on `grugops/bapm-epic010-improvements` in `../wt-bapm-epic010-improvements`, cut
from `main` `f45aea95`. Two commits, head **`6ef97d54`** (`2029e2ef` the cut, `6ef97d54` the Q4 (e) addendum), not
merged and not pushed. Four notes were sealed with grugops
2.2.0 `context-io.js` `admitAndAppend` called directly (the `propose_note` tool was not available to this agent; the
same sanctioned writer, the QE `seal.mjs` precedent), context root the worktree's, read back 4/4:
- `20261029T201508Z-ba-pm-decision-12cb550d`: the epic decision, the rule's options, the order and the board lines;
- `20261029T201508Z-ba-pm-observation-5ada23af`: owner questions Q1-Q5 with defaults;
- `20261029T201508Z-ba-pm-decision-d8064488`: the ticket list with sizes, priorities, DoR and columns;
- `20261029T201602Z-ba-pm-observation-3461cdd9`: Q4 option (e), from the owner's `EPIC-009` reading-size word
  (`…a67f71ac`, landed during this hop), listed and not applied.

**Items:** 1 → `ABC-228`/`229`; 2 → Q4 + `ABC-225`; 3 → `ABC-226` then `ABC-230`; 5 (part) → `ABC-231`/`232`; 6 →
`ABC-233`/`234`; 7 (part) → `ABC-227` then `ABC-235`; 8 → `ABC-239`; 9 (part) → `ABC-236`/`237`/`238`. 4 is
`EPIC-009`'s; 10 is `EPIC-004`'s non-goal (Q1). Not re-proposed: `ABC-205`'s design, `ABC-207`'s weights, `ABC-209`'s
retention, `ABC-210`'s horizon extension.

**Q4 options (per value-changing ticket, this host):** (a) D only, ~9-17 h; (b) D then an interleaved R pair that
must not be LOSS, ~19-27 h, Tctl median 82-83 °C, max 84-87 °C; (c) R pair instead of D, ~10 h, coarse (± 70-75);
(d) hold; (e) a 5-10-game smoke per ticket and a batched validation later (from his `EPIC-009` word, not
assumed for `EPIC-010`). Default (d); BA/PM's reading (b).

**Owner questions:** Q1 Syzygy (default keep out); Q2 the ~1700 line (default cite his `EPIC-008` word); Q3
`ADR-0020` d2 (default keep); Q4 the rule (default hold); Q5 accept M1-M5, no Elo target (default as written).

**Tickets:** see `…d8064488`. Ready: `ABC-226` S P2 10/10, `ABC-227` S P2 10/10. Backlog: `ABC-225` M P2 9/10 (Q4
b/c); `ABC-228` M P2 8/10, `ABC-229` S P2 8/10, `ABC-230` M P2 8/10 (ADR; Q4); `ABC-235` M P2 9/10 (`ABC-227`);
`ABC-231` S, `ABC-232` S, `ABC-233` M, `ABC-236` M, `ABC-237` S, `ABC-238` M (P3, 8/10); `ABC-234` M P3 7/10;
`ABC-239` L P3 7/10. All 15 ids used; no XL.

**Not touched:** `src/`, `data/`, `tools/`, `plans/board.md`, `plans/traceability.md`, `EPIC-009`'s files. No test,
game or probe ran.

**For the Orchestrator:** merge `6ef97d54`; place the board lines from `…12cb550d` (Ready +2 → 3/8); append the trace
row below; put Q1-Q5 to the owner; route `ABC-226` and `ABC-227` (QE/E2E or SA; neither during an ALONE reading).

### Trace row (10 cells, header order)

| EPIC-010 cut (bapm-epic010-improvements) | EPIC-010 proposed: the owner's verified ideas (SA …837e6fa8) cut to ABC-225..239; measurement first: pre-merge outside-opponent rule framed for the owner (Q4: a D only / b D + interleaved R pair not LOSS / c R pair instead / d hold / e smoke + batched later; default d); milestone 1 = ABC-226, 227, 225, 228, 229, 230, 235 | EPIC-010 | — | NFR-005, NFR-009, NFR-008, NFR-004 (none moved); ADR-0024 d4, ADR-0026 d10, ADR-0002 c3, ADR-0020 d2, ADR-0025, ADR-0031, ADR-0048 touch points; RISK-EPIC010-01..06; notes …12cb550d, …5ada23af, …d8064488, …3461cdd9 | grugops/bapm-epic010-improvements @ 6ef97d54 (records only)<br>plans/epics/EPIC-010-…md; plans/tickets/ABC-225..ABC-239 | — (records only) | n/a (records) | not released | EPIC-010: Backlog (proposed); ABC-226, ABC-227 Ready; ABC-225, ABC-228..239 Backlog; card moves the Orchestrator's |
