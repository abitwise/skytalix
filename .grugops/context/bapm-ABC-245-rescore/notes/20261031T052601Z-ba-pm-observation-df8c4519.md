---
id: 20261031T052601Z-ba-pm-observation-df8c4519
kind: observation
by: ba-pm
at: 2026-10-31T05:26:01Z
verified_by: 
confidence: high: the two edited files, read back with git diff on the branch
refs:
  - bapm-ABC-245-rescore
  - ABC-245
  - ABC-242
  - ABC-244
  - ABC-221
  - EPIC-010
  - ADR-0046
  - ADR-0032
  - NFR-008
  - QE-242-a
  - QE-242-b
  - R1
  - R2
  - R4
  - arch-qe242a-ruling
  - arch-qe242a-ruling/20261031T052046Z-architect-design-decision-ede2dfcb
  - se-ABC-242/20261031T043705Z-software-engineer-observation-712a6bb4
  - qe-ABC-242/20261031T051332Z-qe-e2e-observation-b9f3cd67
  - main 10492743
  - 1b142ea0
  - main caf96441
  - d58f2d77
supersedes: 
seal: sha256:490628e555112c59bc4da2d6d4b3ab8e6d52f839a0a3033fd0000d4080bc11cf
---

# `ABC-245` page and `EPIC-010` row 21 re-scored (records): what changed

Branch `grugops/bapm-ABC-245-rescore`, from `main` `caf96441`. Two files changed, nothing else.

- `plans/tickets/ABC-245-a-blunder-row-reads-a-third-occurrence-more-than-50-plies-back-so-a-lowered-prior-keys-cap-turns-red.md`:
  - front matter `status: ready`, `column: Ready`;
  - a dated RE-SCORED block under the cut block (the step, the limit, the R1 line, the estimate);
  - § Acceptance A3: a dated mark (read at the row's own budget and step, against head);
  - § NFR triggers: the "pending with the Architect" sentence struck; a dated sub-bullet with the ruling and the limit;
  - § Test notes: note 3 (the R1 census line, per level call);
  - § Dependencies: the ruling marked landed (`1b142ea0`, merged `10492743`);
  - § DoR: rows 5, 6, 7 gain dated marks; row 10 ⬜ → ✅; 9/10 struck; **10/10, Ready**.
- `plans/epics/EPIC-010-*.md`: tickets table row 21 (`ABC-245`) reads **Ready**, **10/10**, waits on nothing.

No board, ADR, `src/`, `tools/` or `data/` edit. No push, no merge.
