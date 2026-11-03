---
id: 20261103T202049Z-architect-design-observation-08beac19
kind: observation
by: architect-design
at: 2026-11-03T20:20:49Z
verified_by: 
confidence: high
refs:
  - arch-owner-answers-1103
  - grugops/arch-owner-answers-1103
  - ADR-0067
  - ADR-0056
  - ADR-0024
  - ADR-0048
  - ABC-239
  - ABC-274
  - ABC-270
  - ABC-277
  - EPIC-011
  - Q-3K-7
  - Q-3K-9
  - Q-3K-6
  - Q-3K-8
  - B-T8
  - SEC-HP-2
  - Q1
  - E2
  - E2-pre
  - NFR-008
  - RISK-EPIC010-05
  - dc7dc15d
  - 2410d4f7
  - 1e558566
  - orch-2026-10-30a/20261103T200613Z-orchestrator-decision-af126c04
  - qe-ABC-274/20261103T143139Z-qe-e2e-decision-fa87f74d
  - arch-ABC-239/20261103T105010Z-architect-design-decision-e4c34239
supersedes: 
seal: sha256:7311222f4a168e97fd43dc70762a25a540f096707c2ecea0cd8142b7773c45f2
---

# arch-owner-answers-1103 artifacts (recorded as an observation: no §14 gate run exists for a records-only hop, so an artifact-ref cannot bind): the four ADR folds, the Lichess data pin in `ADR-0067` § Addendum 2026-11-03, the probe table, and the `SEC-HP-2` redaction commit

- `memory-bank/50-decisions/ADR-0067-…-every-half-first.md`: the § Status ACCEPTED / IN FORCE block, three decision-log
  rows, the decision 9 pointer, B-T8 approved, **§ Addendum 2026-11-03: the Lichess data pin**, a § Consequences dated
  line, and § Sources.
- `memory-bank/50-decisions/ADR-0056-…-interleaved-with-o1.md`: the status fold, and the D2 and D7 dated lines.
- `memory-bank/50-decisions/ADR-0024-…-inside-quiescence.md`: the status block and the d4 line (Q1 design opened).
- `memory-bank/50-decisions/ADR-0048-…-until-re-derived.md`: the status block and the d6 line (CC0 data admitted for
  tuning).
- `.grugops/context/arch-owner-answers-1103/raw/lichess-probe.txt`: the month, game count, byte length and sha256 of
  ten candidate months, read 2026-11-03 under the host lock. No game file was downloaded.
- `.grugops/context/se-ABC-262/raw/gates/summary.txt` line 5: redacted to a class and a count (`1e558566`).
- **The pin, for `ABC-239`'s Engineer:** `https://database.lichess.org/standard/lichess_db_standard_rated_2017-03.pgn.zst`,
  2 169 142 067 bytes, sha256 `b319297e9270285635d615cbcd19a9b0d44747be3ff91d5b3eac41175b794320`. Download it by hand,
  outside the repository, and check it with `sha256sum -c`.
