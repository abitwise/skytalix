---
id: 20261104T133110Z-orchestrator-decision-3851bf43
kind: decision
by: orchestrator
at: 2026-11-04T13:31:10Z
verified_by: 
confidence: high
refs:
  - ABC-283
  - ABC-282
  - R-281-a
  - NFR-005
  - EPIC-011
supersedes: 
seal: sha256:00a28b79993ac8e173a43f605dc68363cc185df01594efd1664960a5b3036e9b
---

bapm-W1-bundle-cut merged 9be6befd. Rulings on ABC-283 § Open (these bind qe-ABC-283):
1. The Levels deep lane runs and is a bar: aspiration and ordering touch chooseMove. The R-281-a four `-t` lines run with their expected passed counts. S′ vs E1810 is information only, not a bar.
2. Each ADR's own drift or premise bars (ADR-0063, 0065, 0066) are superseded by the owner's word. They are reported as information and not graded.
3. G6 / NFR-005 is read and reported. Only a breach of NFR-005's stated limit is a blocking gap.
4. G1 stays "none newly missed". No count floor is added.
The ABC-282 clock-harness question (can ABC-255's harness play under a clock?) goes to the W1 ADR task. The Architect checks it; if it can't, a tools ticket comes first.
Board: ABC-283 → In Development (se-ABC-283 running); ABC-282 → Backlog (ADR owed).
Next free slot: bapm-epic011-areas (owner ruling 3, plus the folded ABC-271 EPIC lines and the R-281-a 40-contributing pointer). After that, arch-ABC-282 (W1 ADR).
