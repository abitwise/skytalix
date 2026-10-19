---
id: 20261019T114816Z-architect-design-artifact-ref-adr0045-and-probe-431546f7
kind: artifact-ref
by: architect-design
at: 2026-10-19T11:48:16Z
verified_by:
confidence: high
sealed: false
task: wave-2026-09-25
subtask: arch-levels-recut
refs: [ABC-087, ABC-085, ABC-173, ADR-0045, NFR-004, NFR-005, NFR-008]
---

# Artifacts of `arch-levels-recut`

- `memory-bank/50-decisions/ADR-0045-the-levels-are-re-cut-to-one-ply-and-a-halved-blunder-rate-per-step-and-the-default-moves-to-level-5-where-it-plays-as-today.md`
  (PROPOSED).
- `.grugops/context/arch-levels-recut/probe/`:
  - `RUN.txt`;
  - `depth-ladder.mjs` (sweep and check);
  - `blunder-gap.mjs`;
  - `analyze.mjs`;
  - `raw/sweep-step4.jsonl.txt` (50 positions);
  - `raw/check-step4.jsonl.txt` (60 direct calls);
  - `raw/analysis-sweep-step4.json`;
  - `raw/blunder-gap-b{220,330,500,1000,3000}-step4.jsonl.txt`.
- The tree is `398603fa`. `src/` was imported read-only and is unmodified. Every count was taken on the virtual clock, in plain `node`
  v26.11.1.
