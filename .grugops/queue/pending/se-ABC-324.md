---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-15T19:50:00Z
subtask: se-ABC-324
role: software-engineer
ref: .grugops/context/se-ABC-324/
branch: new grugops/ABC-324 from main
width: docs only — README Levels and Strength sections, CHANGELOG [Unreleased], and any other doc that quotes L5–L7 strength. No src/ or tools/ change.
---
# ABC-324 hop 2: README and CHANGELOG carry L5 measured and the new L6/L7 projections
Sources (use their wording; do not invent figures):
- QE's L5 verdict: `.grugops/context/qe-ABC-323/raw/notes/note-c-verdict.md` (admitted …f1531600) — the "Recommended README and CHANGELOG" lines: L5 `2413 ± 51, measured` at `UCI_Elo` 2280, the measured-levels sentence extended to 1–5 with E 1320, 1720, 1890, 2040, 2280, the Stockfish 4 s vs 1 s caveat, the stale Strength-section line becoming "At 4 s a move, with Stockfish also at 4 s, it measured 2413 ± 51 (see Levels).", and the CHANGELOG "Strength, measured only" line.
- The architect's note: `.grugops/context/arch-ABC-324/raw/notes/note-decision.md` (admitted …39f1f696) — the table cells L6 `~2470–2580, projected`, L7 `~2540–2740, projected`, the intro line "measured for levels 1 to 5 and projected for 6 and 7", the replacement paragraph for "Levels 5 to 7 do not blunder, …", and the CHANGELOG re-projection line. The Stockfish-caveat paragraph must follow directly after the projection paragraph so its "see below" points at it.
- Orchestrator call: leave OUT the architect's optional Stockfish-code sentence (it is a source reading, not a measurement).
- Grep the repo docs (README, docs/, CHANGELOG, src comments are out of scope unless a user-facing doc string) for other quotes of the old L5/L6/L7 figures (~2240–2320, ~2310–2410/2420, ~2380–2540, "projected for the rest") and list any you find; fix user-facing docs, report the rest.
Gates: lint, typecheck, unit tests and any README/doc test lane must stay green (run each as `flock <scratch>/host-test.lock <cmd>`). Run records-path-check `--base main` before each commit. Commit a short Result block here and move brief and claim to done. No push, force, amend, rebase or merge into main. Commit messages end with "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>".
