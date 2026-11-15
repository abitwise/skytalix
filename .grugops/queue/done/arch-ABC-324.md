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

## Result
by: architect-design (claude-opus-5-5), at: 2026-11-15T19:47:56Z.

Records only, from `main` `2366bc1d`. No game, no engine start, no code, no README or CHANGELOG edit.

- **Level 6 (10 s): ~2470–2580, projected** (2479.0–2578.1). It was ~2310–2410 in the ADR and ~2310–2420 in the README.
- **Level 7 (30 s): ~2540–2740, projected** (2542.4–2736.6). It was ~2380–2540.
- **The model:**
  - the anchor is level 5's measured 2412.9 at 4 s, without its ± 51.1;
  - then +50 to +125 a doubling from 4 s to 10 s (1.32 doublings);
  - then +40 to +100 a doubling from 10 s to 30 s (1.58 doublings, one fifth less, for diminishing returns);
  - rounded outward to tens.
- **The readings behind it:**
  - level 4 no-blunder to level 5 gives +125 to +135 a doubling (± 35);
  - 0.1 → 1 s gives +73 to +79 (± 21);
  - 0.1 → 4 s, both rate 0, gives +96 (± 13).
- **The ends:**
  - The top (+125) is the "all skytalix" reading, held flat as the hedge.
  - The bottom (+50) is the "part Stockfish" reading.
- **The Stockfish time-scale effect stays `UNKNOWN - verify`.** In Stockfish `sf_19`'s source, the limited-strength move is
  picked once, at depth 1 + int(level): depth 5 at E 2040 and depth 6 at E 2280. That suggests little time effect, but
  it is a code reading, not a measurement.
- **Level 6 is projected above level 5:**
  - the whole range, +66 to +165, sits above level 5's 95 % upper end (2464.0);
  - that it is stronger: high confidence;
  - the size: medium confidence.
- **The SE's cells:**
  - level 5: `2413 ± 51, measured`;
  - level 6: `~2470–2580, projected`;
  - level 7: `~2540–2740, projected`.
  - The three-sentence paragraph, the intro line and a CHANGELOG line are in the note's § 5.
- **`ADR-0045` is amended,** because it records the projection figures (A1's 2026-11-11 resolution line, and
  § AMENDMENT 2026-11-11 § Why):
  - a § Status blockquote;
  - dated lines in both of those places;
  - a new § AMENDMENT 2026-11-15.
  - It is additions only (64 added lines, 0 removed). No decision moves.
- **Not amended:** `ADR-0044` and `ADR-0052` hold no projected Elo.
- **Routed to the Orchestrator:** `memory-bank/60-progress.md` still quotes the old figures (line 954, § Next action,
  and line 967's "70–120 gaps").
- **Note (no note tool on this host; the Orchestrator admits it):**
  - decision body `.grugops/context/arch-ABC-324/raw/notes/note-decision.md`;
  - sha256 `634d7cf2638176fccbe3923eece6c3ed27956f7618ccc42b27c958811f9988c4`;
  - spec `.grugops/context/arch-ABC-324/raw/spec.json`.
- **Checks:** `records-path-check --base main` is clean.
