---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-15T02:05:30Z
subtask: arch-ABC-324
role: architect-design
ref: .grugops/context/arch-ABC-324/
branch: new grugops/arch-ABC-324 from main
width: re-project L6 (10 s) and L7 (30 s) from measured L4 and L5. No games, no code, no README/CHANGELOG edit.
---
# ABC-324 hop 1: re-project L6 and L7 from measured L5
Read the cut note `.grugops/context/orch-2026-10-30a/notes/20261115T020500Z-orchestrator-decision-2bfa1b06.md`, QE's L5 verdict `.grugops/context/qe-ABC-323/notes/20261115T015501Z-qe-e2e-decision-f1531600.md` (full body `.grugops/context/qe-ABC-323/raw/notes/note-c-verdict.md`), the old projection model `orch-2026-10-30a/…152bb16f` and `arch-ABC-318/…d82c4579`, ADR-0045 (levels) and the README Levels/Strength sections.
- Measured: L1 1 499.5 ± 53.4 (0.1 s? check README), L2 1 678.1 ± 48.6, L3 1 909.1 ± 47.9, L4 2 094.3 ± 47.9 at 1 s, L5 2 412.9 ± 51.1 at 4 s (Stockfish at the same time per move as skytalix each time). L6 is 10 s, L7 30 s.
- Derive new L6 and L7 ranges: state the implied Elo per doubling from L4→L5 with its uncertainty, how the unmeasured Stockfish time-scale effect (Stockfish thinking 4 s vs 1 s at a fixed UCI_Elo) could bias it, and give ranges that cover both "all skytalix" and "part Stockfish" readings plus diminishing returns at long times. Round outward as the old model did. Say plainly whether L6 is projected above L5 and with what confidence.
- Give the exact table cells and one to three sentences of README text the SE should use.
- Publish a decision note (or commit its body under `raw/notes/` if you have no note tool) and amend ADR-0045 only if it records the projection figures (say which). Move the brief and claim to done.
No push, force, amend, rebase or merge into main. Commit messages end with "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>".
