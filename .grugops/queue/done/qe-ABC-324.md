---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-15T20:05:00Z
subtask: qe-ABC-324
role: qe-e2e
ref: .grugops/context/qe-ABC-324/
branch: new grugops/qe-ABC-324 from grugops/ABC-324 (tip 7528cafd)
width: check the docs change only. No game, no engine start.
---
# ABC-324 hop 3: QE check of README and CHANGELOG
Check `git diff main...grugops/ABC-324 -- README.md CHANGELOG.md` against:
- QE's L5 verdict `.grugops/context/qe-ABC-323/raw/notes/note-c-verdict.md` (…f1531600) and the records under `.grugops/context/qe-ABC-323/raw/out/` — every L5 number (2413 ± 51, `UCI_Elo` 2280, 200 games, 4 s both sides, the 2240–2320 old projection) traces to them, rounding as L1–L4;
- the architect's note `.grugops/context/arch-ABC-324/raw/notes/note-decision.md` (…39f1f696) and ADR-0045 § AMENDMENT 2026-11-15 — L6/L7 cells and the projection paragraph match, the arithmetic holds, and "see below" points at the Stockfish paragraph;
- the rest of the README (no remaining stale or contradictory L5–L7 statement; the Strength section line), CHANGELOG format (Keep a Changelog, as in earlier entries), and markdown rendering (no accidental list item or broken table; render with any local markdown tool if available, else reason it).
Re-run lint, typecheck and unit tests on the branch under `flock <scratch>/host-test.lock`. Commit an observation and a verdict note body under `raw/notes/` (no note tool), a `## QE` block here, move brief and claim to done. No src/ edits; fix nothing yourself — report gaps by severity. No push, force, amend, rebase or merge into main. Commit messages end with "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>".

## QE
by: qe-e2e (claude-opus-5-5), at: 2026-11-15T19:56:43Z. Branch `grugops/qe-ABC-324` from `grugops/ABC-324` `7528cafd`.

**Verdict: PASS_WITH_GAPS.** All three checks are MET. There are three Low gaps, which are advisory, and no product finding.
- **L5 numbers: MET.** 2413 ± 51 is 2412.9 ± 51.1 from `qe-ABC-323/raw/out/l5-full/full-rsum.txt`. The rest also trace to those records: `UCI_Elo` 2280 (200/200 processes), 200 games, 4 s for both sides (`st=4` for both, `go movetime 4000` only), Stockfish 19 (`machine.txt`). The old 2240–2320 is `main`'s cell, re-derived as 2244–2314. The rounding follows L1–L4's.
- **L6/L7: MET.**
  - The cells, intro line, projection paragraph and CHANGELOG line match `…39f1f696` and ADR-0045 § AMENDMENT 2026-11-15 word for word.
  - The arithmetic re-derives: L6 2479.0–2578.1 and L7 2542.4–2736.6, rounded outward to ~2470–2580 and ~2540–2740.
  - "see below" sits directly before QE's Stockfish paragraph. The optional Stockfish-code sentence is absent.
- **The rest: MET.** No stale L5–L7 statement remains. The Strength line is as QE recommended. The CHANGELOG has `[1.1.0]`'s shape and its link reference. markdown-it-py rendering shows no list item and a 4 × 8 table.
- **Gates (under the host lock):**
  - biome: exit 0, 150 files.
  - tsc: exit 0.
  - vitest with `NODE_OPTIONS=--max-old-space-size=128`: 72 files, 2740 passed, 0 failed, 0 skipped. The run without that prefix was refused by the heap guard before any test.
  - records-path-check: clean.
- **Gaps:**
  - **Low G-QE-324-1:** the Strength section opens "One measured figure" and now closes with a second one.
  - **Low G-QE-324-2:** the old per-level Stockfish-time caveat is narrowed to level 5 against level 4.
  - **Low G-QE-324-3:** the projection paragraph relies on level 4's blunder cost (50–70) without stating it, and calls the sub-1 s +73–79 "measured" although it includes that assumed cost.
  - Info items are in the verdict.
- **Note bodies:**
  - `.grugops/context/qe-ABC-324/raw/notes/note-observation.md` (sha256 `5a368152e30e0454592a483b1d01383702196d4fefcbb841ce582dd98cb126bf`);
  - `.grugops/context/qe-ABC-324/raw/notes/note-verdict.md` (sha256 `c1acbe7a69c7afd69c221b6ac8f8a7ea2e01b075ce136cc894a887b94ef2a226`);
  - `raw/spec.json`, plus the check scripts in `raw/scripts/`.
- No `src/` edit. Nothing pushed or merged. The board column is the Orchestrator's to move.
