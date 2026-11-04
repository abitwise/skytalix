---
id: 20261104T205803Z-ba-pm-observation-0b28bc75
kind: observation
by: ba-pm
at: 2026-11-04T20:58:03Z
verified_by: 
confidence: high for what git, grep and sed show at main 18fbc754 and on e5a51acf; the arithmetic was recomputed
refs:
  - bapm-lines-1104
  - grugops/bapm-lines-1104
  - ABC-289
  - ABC-282
  - ABC-301
  - ABC-286
  - ABC-288
  - EPIC-011
  - ADR-0074
  - ADR-0024
  - ADR-0056
  - OQ-0074-1
  - Q-N8H-1
  - Q-3K-11
  - NFR-005
  - NFR-008
  - NFR-009
  - 18fbc754
  - e5a51acf
  - arch-ABC-289/20261104T204820Z-architect-design-decision-62012bbe
  - orch-2026-10-30a/20261104T195654Z-orchestrator-decision-3b15b361
  - orch-2026-10-30a/20261104T203850Z-orchestrator-decision-f30bd604
  - orch-2026-10-30a/20261104T204925Z-orchestrator-decision-085f647c
supersedes: 
seal: sha256:29bdc75f53af6f7fdf4b2722cfde719c705ca3129f0e4768272173bac7bda10a
---

# bapm-lines-1104 observation: what the records on `main` `18fbc754` show, read before the pages were written

BA/PM, task `bapm-lines-1104`, records only. Read with git, grep and sed. The only things run were the arithmetic below, the note seal and the records-path check.

- **The owed figures agree between `…62012bbe` and `ADR-0074`.** Recomputed from the ADR's counts:
  - d8 ratios 0.6362, 0.8263, 0.6484, 0.8201 from the head and door counts of d12.
  - Bars: ⌈100 · 0.8763⌉ / 100 = 0.88; ⌊20 · 0.7 · 0.279⌋ / 20 = 0.15, so 6.868 + 0.15 = 7.018; max(90, 98) = 98; min(150, max(25, 30)) = 30.
  - Firing 3 785 544 / 7 845 226 = 48.25 %. Premise 1 193 138 / 2 728 650 = 43.73 %. Reach 7.147 − 6.868 = 0.279.
- **Wording:** `…62012bbe` § 6 says "0 sign changes"; `ADR-0074` d11 says "0 mate sign changes". The page uses the ADR's words.
- **`se-ABC-282`'s brief fences out ticket edits,** and its branch has no commit on `ABC-282`'s page, so the budget line there collides with nothing.
- **`ADR-0056` § the bundle read still reads PROPOSED on `main`.** `arch-bundle-1` is pending and owns that line; the owner's (a) is in `…3b15b361` 2.
- **`Q-3K-6` and `Q-3K-8` are the only older owner questions still open** in `EPIC-011`, beside the Q-3K-1 wording row.
- **After `e5a51acf`:** `git diff 18fbc754` over `src`, `tools`, `memory-bank`, `plans/board.md` and `AGENTS.md` is empty.
