---
id: 20261102T153114Z-architect-design-decision-e17a23f4
kind: decision
by: architect-design
at: 2026-11-02T15:31:14Z
verified_by: 
confidence: high on 'no form eligible' and the bars unchanged (measured, pre-registered rule); the P3-restores-the-margin expectation is a judgement (UNKNOWN - verify)
refs:
  - arch-ADR-0060-reopen
  - grugops/arch-ADR-0060-reopen
  - EPIC-011
  - P1
  - P3
  - ADR-0060
  - ADR-0050
  - ADR-0026
  - ADR-0056
  - ABC-121
  - ABC-264
  - ABC-233
  - 0b73f51d
  - 5ffbae25
  - cfff6993
  - 0df9b672
  - arch-ADR-0060-reopen/20261102T152416Z-architect-design-decision-0481036d
  - arch-phase2-rebase/20261102T151839Z-architect-design-decision-f9f440c9
  - arch-phase2-rebase/20261102T151839Z-architect-design-observation-d5870a7a
  - arch-phase2-p1/20261102T144713Z-architect-design-observation-35bd3967
  - NFR-005
  - NFR-008
supersedes: 
seal: sha256:fec1c0c95664563bd4ce57877332e62e4f6b955ceb566fa012e355c8d7ba1c17
---

# ADR-0060 re-open ruling: no form meets every bar on main, so none is written in; the bars stay; the owner question on the 27 cp cap is put with a "keep it" recommendation, because re-deriving it (to 94 cp) alone admits no form

## Context
Brief `arch-ADR-0060-reopen`. ADR-0060 (PROPOSED, RE-OPENED) misses A4 (a) `chooseMove` position-6 (0.8699) and A3's
27 cp cap (63 cp) on main (`arch-phase2-rebase` …f9f440c9). The candidate set and the selection rule were sealed and
committed before any run (decision `…0481036d`, commit `0df9b672`). Results: the observation in this task (same `at`).

## Decision
1. **No form is eligible.** Of nine pre-registered forms, none meets every read bar (A4 (a), A4 (b), A3 drift, mate
   floor, zugzwang 7 / 7, G1). Per step 5 of the rule, **nothing is written into ADR-0060 as its rule.** Decision 1's
   text stays as the measured reference; the build does not start.
2. **No bar moves.** 0.85× (four readings), +0.25 ply, ≥ 95 % / 25 cp, 27 cp, 0 sign flips, mate floor 0, 7 / 7 at the
   recorded depths, `G1` ≥ 54 / 58 all stand.
3. **The set is closed.** No form is added after the results. A further search on the same two boards would be the
   fitting `arch-phase2-rebase` warned against; another try is a new hop under a new premise.
4. **The owner question (his word, not the Architect's):** *"May A3's 27 cp cap be re-derived on main by `ADR-0050`
   d8's method?"*
   - **The number it would become: 94 cp** (⌊1.5 × 63⌋, decision 1's larger maximum on main; 63 cp in `search()`,
     18 cp in `chooseMove`). Decision 1 is the only form in the set that meets A4 (b) and 7 / 7 and misses the cap.
   - **Said plainly: a "yes" alone admits no form.** Decision 1 would still miss A4 (a) on `chooseMove` position-6
     (0.8699 against 0.85). No form in the set misses only the cap. Passing decision 1 would also need A4 (a)'s 0.85
     moved to at least 0.87. That is a second loosening, chosen after the score, and no existing method derives it.
     The forms that clear the cap and A4 (a) (C4, C6, C7) miss A4 (b) and lose `zugzwang.004`. A zugzwang row is F3,
     never a re-pin, and no number touches it.
   - **Recommendation: keep the 27 cp cap (answer "no"), and park P1 on main.**
     - A "yes" unlocks nothing on its own.
     - The 63 cp row comes from two-ply reductions at PV nodes. On main that is also where the reach comes from:
       with PV capped at one ply, even uncapped non-PV reductions reach only +0.174. So the one 63 cp row marks the
       mechanism that buys the reach; it is not a stray row.
     - `ABC-264` read +0.70 ply at 47 000 nodes and still lost 42 Elo on the value side. The drift cap is the only
       value-side gate before games. Loosening it to pass the same form is the wrong lesson.
     - **Next step (the Orchestrator's call):** take P3 next. Once it merges, re-measure decision 1 unchanged on that
       `main` by a dated line here, under every bar unchanged. On `4d1c0616`, whose door had reverse futility
       cutting at remaining depth 1-3, decision 1 met every bar. P3's futility acts on the same shallow subtrees.
       That this restores the margin is a judgement (UNKNOWN - verify). O1h's history table (decision 11) is the
       other named premise.
   - **Answers that settle it:** "keep the cap", the default, under which P1 stays parked and the flat 1-ply LMR stays
     on main. Or "re-derive the cap and A4 (a)", under which decision 1 is re-proposed with 94 cp and his number for
     A4 (a). Or "decline ADR-0060".
5. **ADR-0060 edits (records only):** a dated status block (re-open probe, results, owner question) and a dated line
   in decision 9's instrument check. Decisions 1-11, F1-F8 and the bars are unchanged.

## Alternatives
- Write in C4 or C6. Rejected: each misses A4 (b) (+0.168 / +0.174) and `zugzwang.004`.
- Write in decision 1 under a re-derived cap. Rejected: it still misses A4 (a), and the cap is the owner's.
- Widen the set after reading (PV-only depth gates, finer divisors). Rejected: that is fitting to the bar boards, and
  a depth-gated PV term would hide from the depth-5 drift instrument.

## Scope
Records only: ADR-0060 dated status block and decision 9 dated line; this task's notes and raw. No src/, tests, plans
or board. ADR-0025 and ADR-0056 untouched.

## Risks
- P1, the largest Phase 2 estimate (+40-100), stalls on main until P3 or O1h changes the tree.
- If the post-P3 re-measure also misses, the cap question returns with the same shape.
