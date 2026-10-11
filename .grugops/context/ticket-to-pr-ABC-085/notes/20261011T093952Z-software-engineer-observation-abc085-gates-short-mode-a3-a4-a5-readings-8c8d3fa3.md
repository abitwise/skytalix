---
id: 20261011T093952Z-software-engineer-observation-abc085-gates-short-mode-a3-a4-a5-readings-8c8d3fa3
kind: observation
by: software-engineer
at: 2026-10-11T09:39:52Z
verified_by:
confidence: high
refs:
  - ABC-085
  - ADR-0038
  - N8-LANE
  - NFR-008
  - src/ladder.test.ts
  - .grugops/context/ticket-to-pr-ABC-085/probe/RUN.txt
supersedes:
---

# `ABC-085` gates and short-mode readings: A3/A4/A5 hold in short mode; A1/A2 not taken

Hand-authored and unsealed. Raw: `../probe/`. **Loaded machine, not graded.** Every wall figure is diagnostic.

**Gates on the harness tree** (`d5b0f0e2`): lint, typecheck and build exit 0. `npm test` exits 0 with 54 files
and 1689 passed, against a baseline at `aee4b8cb` of 53 / 1680. So the delta is +1 file and +9 tests, with 0
skipped and 0 todo. `test-skip-integrity.js … --skip-count 0`: `No findings.`. `lane-inventory.js`: 54 = 54.

**Default lane, by count:** 0 ladder games (pinned by its last row), 0 spawns, +1 file, +9 rows.

**Mutants** (each killed by a default row, restored after):
- M1, claim dropped: 3 rows red.
- M2, cap scored as a draw: the cap row red.
- M3, per-side step accepted: the refusal row red.
- M4, a ladder game added to a default row: the pin row red.

**`LADDER_DEEP=1`** (short mode, step 120), two full runs:
- **Run 1** (untracked harness) exited 1. 13 rows passed, and 4v5 failed on the first hang guard only (see
  decision `…098699a1` item 9).
- **Run 2** (`d5b0f0e2`) exited 0, 14/14, 848 s.

| pair (short mode, step 120) | games | stronger W-D-L | score | claimed draws | endings | digest (runs 1 = 2) |
|---|---:|---|---|---:|---|---|
| 3v4 | 4 | 1-3-0 | 2.5/4 | 2 | 2 threefold (claimed), 1 mate, 1 insufficient | `72f01570a3987247` |
| 4v5 | 4 | 1-3-0 | 2.5/4 | 3 | 3 threefold (claimed), 1 mate | `302d8b4676cd7299` |
| 2v3 | 4 | 4-0-0 | 4/4 | 0 | 4 mates | `f89bbd75f4a066e9` |
| 1v2 | 4 | 2-2-0 | 3/4 | 2 | 2 threefold (claimed), 2 mates | `89b8059f53c970df` |
| 1v5 | 10 | 10-0-0 | 10/10 | 0 | 10 mates | `d30b4a153b7c1a9a` |

- **`A3`:** 26 of 26 ladder games per run reached an ending, and 0 hit the cap. 7 ended on a claim. No
  `fivefold-repetition` or `seventy-five-move` occurred.
- **`A4`:** 26 of 26 move lists per run replay through `legalMoves` / `makeMove`, with no ending before the last
  ply and the replayed ending equal to the recorded one.
- **`A5`:**
  - In process, the 1v2 pair played twice gives equal move lists and an equal score.
  - Across runs, all five pair digests are equal between run 1 and run 2.
  - The 3v4 games also equal the Architect's probe games (`…d60bfcc9` item 4) on plies and endings.
- **`A2` early signal ONLY:** 3v4 and 4v5 each read 2.5/4 here. That is short mode, step 120, 4 games, and it
  is never `A2`.
- **`A1`:** 10/10 here is against level 1 on the depth-1 floor. It is never `A1`.
- **Not run:** `LADDER_DEEP=verdict`. `A1`/`A2` wait for a tree that contains `ABC-083`'s merge (`ADR-0038`
  decision 6).
