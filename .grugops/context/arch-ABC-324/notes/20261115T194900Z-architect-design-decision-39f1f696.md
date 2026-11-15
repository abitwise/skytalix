---
id: 20261115T194900Z-architect-design-decision-39f1f696
kind: decision
by: architect-design
at: 2026-11-15T19:49:00Z
verified_by: 
confidence: medium
refs:
  - arch-ABC-324
  - grugops/arch-ABC-324
  - ABC-324
  - ABC-323
  - ABC-318
  - ADR-0045
  - README.md
  - CHANGELOG.md
  - .grugops/context/arch-ABC-324/raw/notes/note-decision.md
  - orch-2026-10-30a/20261115T020500Z-orchestrator-decision-2bfa1b06
  - qe-ABC-323/20261115T015501Z-qe-e2e-decision-f1531600
  - orch-2026-10-30a/20261111T044438Z-orchestrator-decision-152bb16f
  - arch-ABC-318/20261111T074410Z-architect-design-decision-d82c4579
supersedes: 
seal: sha256:b5cb4a68c1e968d9515da110b5c63f525bc8787bcaec2758556c1efa7770ed56
---

_Admitted by the orchestrator from `.grugops/context/arch-ABC-324/raw/notes/note-decision.md` (sha256 634d7cf2638176fccbe3923eece6c3ed27956f7618ccc42b27c958811f9988c4) on branch `grugops/arch-ABC-324` tip fff61542, merged to main; the architect had no note tool. Headline verbatim; the full body is that committed file. Confidence medium (architect's): arithmetic on sealed readings only; L6 above L5 high, its size medium, L7 medium-low; per-doubling ends, the one-fifth diminishing-returns cut and the Stockfish time-scale effect are assumptions (UNKNOWN - verify); the Stockfish depth-pick is a source reading, not a measurement. The orchestrator re-checked the arithmetic: 2412.9 + log2(2.5) × [50, 125] = 2479.0–2578.1; + log2(3) × [40, 100] = 2542.4–2736.6._

# arch-ABC-324 decision: levels 6 and 7 re-projected from measured level 5. **Level 6 (10 s) ~2470–2580, level 7 (30 s) ~2540–2740, projected.** Level 6 is projected above level 5, its whole range above level 5's 95 % upper end (2464.0). This replaces the model of `…152bb16f` / `…d82c4579` for levels 6 and 7

Model: anchor L5 2412.9 (no ± added); 4→10 s at +50 to +125 a doubling (top = measured L4→L5 with blunder cost added back, held flat; bottom = "part Stockfish" reading, below the +73–79 measured under 1 s); 10→30 s at +40 to +100 (one-fifth diminishing-returns cut). ADR-0045 amended (additions only, § AMENDMENT 2026-11-15). README cells for the SE: L5 `2413 ± 51, measured`, L6 `~2470–2580, projected`, L7 `~2540–2740, projected`, with the replacement paragraph and CHANGELOG line given in the note.
