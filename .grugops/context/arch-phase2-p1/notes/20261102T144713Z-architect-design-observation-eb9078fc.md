---
id: 20261102T144713Z-architect-design-observation-eb9078fc
kind: observation
by: architect-design
at: 2026-11-02T14:47:13Z
verified_by: 
confidence: high (files in this branch)
refs:
  - arch-phase2-p1
  - grugops/arch-phase2-p1
  - EPIC-011
  - P1
  - ADR-0060
  - ADR-0026
  - ADR-0056
  - ADR-0059
  - ADR-0050
  - ABC-121
  - ABC-233
  - ABC-264
  - 4d1c0616
  - NFR-005
  - NFR-008
  - NFR-009
supersedes: 
seal: sha256:24895667d8a18ae6248c5f536385d5e19016fb87d25499c76deaf53dd24b09f7
---

# Artifacts of arch-phase2-p1: ADR-0060 (PROPOSED, P1 log-table LMR), dated pointers in ADR-0026 d6 and ADR-0056 D2, raw probe under raw/probe/

## Artifacts
- `memory-bank/50-decisions/ADR-0060-late-move-reductions-come-from-a-log-table-of-depth-and-move-number-capped-at-two-plies-and-one-ply-less-at-pv-nodes-behind-a-test-only-off-door-pair.md` — new, PROPOSED.
- `memory-bank/50-decisions/ADR-0026-…` — decision 6: one dated line (2026-11-02), ADR-0060 would amend d6 for the shipped path only; nothing moves until acceptance and merge.
- `memory-bank/50-decisions/ADR-0056-…` — D2: one dated block (2026-11-02) for row P1: ADR-0060, history term deferred to O1h, P1 stays next.
- `.grugops/context/arch-phase2-p1/raw/probe/` — the scratch patch (`patch.py`), driver (`probe.ts`), sweep scripts and outputs; README says how to reproduce on `git archive 4d1c0616 src`.

## For BA/PM (page deltas, not this hop's fence)
- Cut the P1 page (id is BA/PM's). Title without "history-adjusted"; size S-M; depends on ABC-264 merged.
- A1 export lists +2 / +1 (ADR-0060 d4); A2 table, re-search and source rows (d7); A3 27 cp cap, one-ply-deeper mate floor, zugzwang rows (d8); A4 (a) <= 0.85x, (b) >= +0.25 ply at 47 000 nodes, (c) G6 (d9); A5 G1 >= 54/58; A6 C2' GAIN + S' + Levels deep lane, intent line "GAIN" (d10).
- Whether ABC-233's page carries the history term in LMR (ADR-0060 d11).

## For the Orchestrator
- To the owner: "accept / decline ADR-0060". Reading (b): the build may start once ABC-264 merges.
- Board: no move by this hop.

## Scope
Records only. Scratch checkout deleted after sealing.

## Risks
None beyond the decision note's.
