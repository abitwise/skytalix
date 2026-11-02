---
id: 20261102T173205Z-ba-pm-observation-db3c17c1
kind: observation
by: ba-pm
at: 2026-11-02T17:32:05Z
verified_by: 
confidence: high: file list, src tree id and commit shas read from git in the worktree
refs:
  - bapm-P3-page
  - grugops/bapm-P3-page
  - ABC-268
  - EPIC-011
  - P3
  - ADR-0061
  - ADR-0056
  - ADR-0060
  - ADR-0062
  - ABC-265
  - ABC-266
  - ABC-267
  - RISK-EPIC011-09
  - RISK-EPIC011-08
  - f2388e40
  - 6413f91f
  - d4547643
  - cad4f954
  - arch-phase2-p3/20261102T171413Z-architect-design-decision-004b35ed
  - arch-phase2-p3/20261102T171413Z-architect-design-observation-55f7725e
  - arch-phase2-p3/20261102T171413Z-architect-design-observation-e8bec702
  - qe-ABC-266-d12/20261102T172256Z-qe-e2e-decision-9f9aeb87
  - qe-ABC-266-d12/20261102T172256Z-qe-e2e-observation-cc1de664
  - NFR-005
  - NFR-004
  - NFR-008
  - NFR-009
supersedes: 
seal: sha256:8d64c6d28747e89de64f84cd3abcf5b153287b3f31e249e1ee8ca5cda3b82b03
---

# bapm-P3-page: pages changed and commits

BA/PM, records only. Branch `grugops/bapm-P3-page` from `main` `6413f91f`. Claim `d4547643`; records `cad4f954`.

- `plans/tickets/ABC-268-p3-futility-pruning-skips-late-quiet-moves-at-null-window-nodes-of-remaining-depth-1-to-3-150-350-550-cp-behind-an-off-door-pair.md`: new page, front matter (status backlog, column Backlog, size S, priority P2, adr ADR-0061 PROPOSED reading (b)); top block; Problem; Scope 1-6; Out of scope; A1-A6 and F1-F8 table; NFR triggers; Test notes 1-5; Size and priority; Dependencies; DoR 10/10.
- `plans/epics/EPIC-011-...-measured-path.md`: new top block; Phase 2 rows re-ordered (P2, P3, P1, P5, P4, P6) with dated marks, P4's "after P1" struck; TH-2 phase row mark; P1-parked id and trigger marks; tickets row 18 mark and new row 20; ids line; owner question row ADR-0061; dependencies mark; RISK-08 mark; RISK-09 REALISED mark.
- `plans/tickets/ABC-265-...-at-threads-1.md`: lines 74, 106 and 157 (now 74-75, 107-108, 159) re-pointed from ABC-267 to ABC-266 A8, struck-and-replaced with dated marks.
- `plans/tickets/ABC-266-...-hardware-gain.md`: new top block (D12 MISS, Development blocked, RISK-09 realised); value-line mark; out-of-scope mark; dependencies D12 mark; DoR row 10 and footer marks.
- `main`'s `src/` tree read as `f2388e40` at this cut (`git rev-parse HEAD:src`), the ADR-0061 probe tree.
- Nothing in src/, tests, tools/, memory-bank/ or plans/board.md moved. No push, force, amend, rebase or merge.
