---
id: 20261103T110658Z-architect-design-observation-b20aa1c0
kind: observation
by: architect-design
at: 2026-11-03T11:06:58Z
verified_by: 
confidence: high: line counts from git diff --numstat; sources named; nothing run
refs:
  - arch-fold-1103b
  - grugops/arch-fold-1103b
  - ABC-274
  - E2-pre
  - ABC-239
  - E2
  - ABC-269
  - E1
  - ABC-270
  - ABC-271
  - ABC-272
  - ABC-273
  - ABC-265
  - EPIC-011
  - ADR-0067
  - ADR-0064
  - ADR-0056
  - ADR-0031
  - F3
  - F8
  - C1
  - G2
  - G6
  - Q-3K-7
  - Q-3K-4
  - Q-3K-9
  - B-T8
  - NFR-005
  - NFR-001
  - 239ac715
  - 58fa3eb4
  - bapm-E2pre-cut/20261103T110035Z-ba-pm-decision-a193625d
  - orch-2026-10-30a/20261103T110500Z-orchestrator-decision-690d3b30
  - arch-ABC-239/20261103T105010Z-architect-design-decision-e4c34239
  - arch-ABC-269-F3/20261103T105957Z-architect-design-decision-a0468a78
  - arch-ABC-269-F3/20261103T105957Z-architect-design-decision-e36ee7ca
supersedes: 
seal: sha256:0377ed6395c848c8d4deb33acbb48654dcdfd24274baaeb566ba1aa756c3f443
---

# arch-fold-1103b sources and diff: three ADRs edited, additions only (`ADR-0067` +42, `ADR-0056` +52, `ADR-0064` +6; 0 lines removed). Every figure quoted was read from a sealed note or a committed output, and nothing was run

- **Read:**
  - `bapm-E2pre-cut` `…a193625d` (the open items: an E2-pre disposition line and the S2 ruling) and `…36f388c6`;
  - `orch-2026-10-30a` `…690d3b30` (rulings 1–3);
  - `arch-ABC-239` `…e4c34239` § 3–§ 5 (the owed lines);
  - `arch-ABC-269-F3` `…a0468a78` (C1, the reasons the packed score is rejected for F3) and PREREG `…e36ee7ca` (the instrument);
  - `se-ABC-269` `raw/out/g2-variants.txt` (v0–v9; v8 is "phase packed into the mobility sum");
  - the `ABC-274` page (main checkout `plans/tickets/`, read only; the pre-ticket head is defined there).
- **Checked:** `ADR-0067` had no E2-pre falsifier row before this edit (F1–F7 only), as BA/PM noted.
- **`ADR-0064`:** the F3 row, d6's F3 sub-bullet and § Alternatives' F3 lines are byte-unchanged. `git diff` shows only the two inserted pointer blocks.
- **Not touched:** `src/`, ticket pages, `board.md`, `EPIC-011`.
