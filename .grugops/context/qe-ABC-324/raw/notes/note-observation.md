# qe-ABC-324 observation: README and CHANGELOG on `grugops/ABC-324` (tip 7528cafd) checked against QE `…f1531600`, its records, the architect's `…39f1f696` and ADR-0045 § AMENDMENT 2026-11-15. Every L5 number traces, every L6/L7 cell and sentence matches, the arithmetic re-derives, markdown renders clean; lint, typecheck and 72 files / 2740 tests green under the host lock

QE/E2E, task `qe-ABC-324`, branch `grugops/qe-ABC-324` from `grugops/ABC-324` `7528cafd` (merge base with `main` `c2a8dbfa`; `main` at `fe0329e2`), 2026-11-15. Docs only: the change under test is `README.md` (blob `eb34d953`) and `CHANGELOG.md` (blob `3cee9f6b`), docs commit `4ac4a127`. No game, no engine start, no `src/` edit, nothing fixed. The check scripts are in `raw/scripts/` (`arith.mjs`, `render_check.py`); they read only and take the worktree path as an argument.

## Scope of the change
- `git diff main...grugops/ABC-324 --stat`: `README.md` 29 lines, `CHANGELOG.md` +11, and the SE's own queue records. The diff under `src/` and `tools/` is empty.

## 1. Inputs are the admitted ones
- `qe-ABC-323/raw/notes/note-c-verdict.md` sha256 `f7b1bd16211e43679dba9bf7abf95951cc9c6aae43fe57fc8b1eee07efbbb85e`. That is the pin in the admitted `…f1531600`.
- `arch-ABC-324/raw/notes/note-decision.md` sha256 `634d7cf2638176fccbe3923eece6c3ed27956f7618ccc42b27c958811f9988c4`. That is the pin in the admitted `…39f1f696`.

## 2. L5 numbers against QE's records (`qe-ABC-323/raw/out/`)
- `l5-full/full-read.txt` and `full-rsum.txt` show the following:
  - 20 chunks, 200 games, W/D/L 133/7/60, 136.5 / 200 = 68.25 %;
  - Elo 132.9 ± 51.1 (`cutechess-cli` 1.5.1);
  - `state: rating E + X ± Y = 2280 + 132.9 ± 51.1 = 2412.9 ± 51.1`.
- `full-rsum-durable.txt` differs from `full-rsum.txt` only in the segment path prefix (`diff`: lines 4–23, paths only).
- **Both sides at 4 s:** `cmd.txt` (c086) has `st=4` for both engines. `go movetime 4000` reached skytalix 10 466 times and Stockfish 10 429 times, with no other `go`. The latency medians are 4001 and 4000 ms.
- **`UCI_Elo` 2280 and `UCI_LimitStrength`:** `UCI_Elo 2280` reached 200 / 200 processes, and `cmd.txt` has `option.UCI_LimitStrength=true`.
- **Stockfish 19:** `machine.txt` reads `id name Stockfish 19`, at the pinned sha256 `c78c22a9…`.
- **Rounding, as L1–L4:**
  - L4's 2094.3 ± 47.9 and L3's 1909.1 ± 47.9 print as `2094 ± 48` and `1909 ± 48`, so the rule is the nearest integer.
  - 2412.9 ± 51.1 gives `2413 ± 51`. There is no tie.
- **The old projection 2240–2320:** `main`'s README cell is `~2240–2320, projected`. It is re-derived from L4's no-blunder 2144–2164 plus 2 doublings × (50…75), which gives 2244–2314. QE's verdict line 29 quotes it.

## 3. L6/L7 against the architect's note and ADR-0045 § AMENDMENT 2026-11-15
- **Table cells as rendered:**
  - L5 `2413 ± 51, measured`;
  - L6 `~2470–2580, projected`;
  - L7 `~2540–2740, projected`.
  - These equal the note's § 5 and the ADR's § What changed § Results.
- **Arithmetic** (`raw/scripts/arith.mjs`):
  - log2(2.5) = 1.3219 and log2(3) = 1.5850.
  - L6: 2412.9 + 1.3219 × (50…125) = 2479.0–2578.1. Rounded outward to tens, 2470–2580.
  - L7: 2479.0 + 1.585 × 40 = 2542.4, and 2578.1 + 1.585 × 100 = 2736.6. Rounded outward, 2540–2740.
  - L6 − L5: +66.1 to +165.2. L7 − L6: +63.4 to +158.5.
  - L6's bottom, 2479.0, is above L5's 95 % upper end of 2464.0.
  - Sub-1 s rate: (2144…2164 − 1902.5) / log2(10) = +72.7 to +78.7, printed as +73 to +79.
  - 0.1 → 4 s: +95.9, printed as +96.
  - L4 no-blunder → L5: (2412.9 − 2164…2144) / 2 = +124.45 to +134.45. The note, the ADR and the README print this as "about +125 to +135".
  - L5 − old projection: +92.9 to +172.9, printed as 93–173.
  - L5 − L4: +318.6 ± 70.0.
  - Without the one-fifth cut, L7 would be 2558.2–2776.3, as the note says.
- **Wording** (`raw/scripts/render_check.py`, whitespace-normalized substring match against the source notes): MATCH for all seven:
  1. QE's measured-levels paragraph;
  2. QE's "Level 5 measured above its projection…" paragraph;
  3. QE's Strength-section line;
  4. QE's CHANGELOG paragraph;
  5. the architect's three-sentence projection paragraph;
  6. the architect's CHANGELOG line;
  7. the architect's intro line.
  - The architect's optional Stockfish-code sentence is absent, as the orchestrator ruled.
- **"see below":** it sits in README paragraph P3, the projection paragraph. The next paragraph, P4, is QE's Stockfish 4 s vs 1 s caveat ("Level 5 measured above its projection…").
- **The CHANGELOG's "was" figures,** 2310–2420 and 2380–2540, equal `main`'s README L6 and L7 cells.

## 4. The rest of the README, the CHANGELOG format, and rendering
- **Old figures:** a grep of README for 2240, 2310, 2380, "projected for the rest", "Levels 5 to 7" and "not measured" finds:
  - one hit for 2240, in QE's intended "measured above its projection of about 2240 to 2320";
  - "not measured" only in the Stockfish caveat.
- **Other docs and `src/`:** there is no `docs/` directory, and the grep finds no user-facing strength string in `src/`.
- **Old figures that remain are history:** CHANGELOG `[1.0.0]` and `[1.1.0]`, `plans/board.md` ABC-318/319, and the ADR's dated lines.
- **Rendering:** markdown-it-py 3.0.0 is CommonMark, with the GFM table rule enabled.
  - README Levels plus Strength: 2 headings, 7 paragraphs, and no list, code or blockquote token.
  - The table has 4 rows × 8 cells, and its 7 Strength cells parse as quoted in § 3.
  - Lines 89–90 begin with `+125` and `+79`. They are not list markers, since no space follows the `+`, and the parse shows no list token.
- **CHANGELOG `[Unreleased]`:** a paragraph, then `### Changed`, then a one-item list. That is the same shape as `[1.1.0]`: a paragraph and a list, then `### Changed` and a list. The `[Unreleased]: …compare/v1.1.0...HEAD` link reference is present.

## 5. Gates (worktree at `grugops/qe-ABC-324`, docs identical to 7528cafd; every run as `flock <scratch>/host-test.lock <cmd>`)
- `npx biome check .`: exit 0, 150 files, no fixes.
- `npx tsc --noEmit`: exit 0.
- `npx vitest run` with no prefix: refused by the repo's heap guard before any test ran (V8 limit 4192 MiB, above the SUITE row of 224 MiB). This is an invocation precondition, not a test result.
- `NODE_OPTIONS=--max-old-space-size=128 npx vitest run`, the prefix AGENTS.md specifies: exit 0, 72 files, 2740 passed, 0 failed, 0 skipped.
- `node tools/grugops/records-path-check.js --base main`: clean before each commit.
