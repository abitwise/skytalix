---
id: 20261104T182554Z-software-engineer-observation-82b1f26f
kind: observation
by: software-engineer
at: 2026-11-04T18:25:54Z
verified_by: 
confidence: high: every count, kill and wall below was read from a run under the host lock at the tip; the wall median is ungraded (no twin)
refs:
  - se-ABC-302
  - ABC-302
  - EPIC-011
  - ADR-0046
  - NFR-008
  - R-N8H-1
  - R-302-a
  - arch-ABC-302/20261104T181301Z-architect-design-decision-bcadd41d
  - arch-ABC-302/20261104T175227Z-architect-design-decision-23abb6c5
  - src/search.null-move.test.ts
  - src/uci-session.test.ts
  - src/search.futility.test.ts
  - src/zobrist.test.ts
  - src/engine.test.ts
  - src/levels.test.ts
  - src/cli.test.ts
  - src/engine.capacity.test.ts
  - AGENTS.md
  - memory-bank/90-agents-md-command-log.md
  - Q-N8H-1
  - ABC-109
  - 44817c44
  - 7f4c513a
supersedes: 
seal: sha256:2376d293dc4b8504135e100d0ffe747e25ac58e4abd7270826504fc30031fe21
---

# se-ABC-302 observation: lane 2 684 / 2 684 in 71 files; nine -t lines each 1 passed; M2, M8d, M9 and M9r killed by their remnants; head median 9.52 s against base 9.90 s

All runs were made under the host lock (`<scratch>/host-test.lock`). Base is `main` `bff22046`, extracted to a scratch copy. Head is the tip at `44817c44` (tests) and `7f4c513a` (AGENTS.md).

- **A3, the default lane (vitest JSON):** base 2 687 → head **2 684**, both all passing, 0 skipped, 0 todo, 71 files each (`raw/a3-counts.txt`). Per file: futility 37 → 36 and levels 49 → 47. Null-move 38, uci-session 230, zobrist 32, engine 69, cli 109 and engine.capacity 1 are unchanged, each with one name out and one in (`raw/a3-names.diff`). No " [deep" title appears in the default lane.
- **A4, the nine `-t` lines:** each exits 0 and prints "1 passed" (`raw/tlines.txt`). The collected totals are null-move 46, uci-session 243, futility 53, zobrist 34, engine 84, levels 58 and engine.capacity 2, which equal A4's defined counts.
- **Full deep lanes, run as AGENTS.md spells them:** null-move exits 0 with **46 passed (46)**; futility exits 0 with **53 passed (53)**. I did not run the other touched files' full deep lanes. Those counts are QE's to read.
- **A5:** AGENTS.md null-move "45 rows" → "46 rows" and futility "47 tests" → "53 tests". The file is 18 429 → **18 429 B** (≤ 18 432). `src/cli.test.ts` passes 109 / 109 after the edit. The command-log entry was appended.
- **Mutant spot-checks on a scratch copy of the tip,** using the Architect's `mut.py` (`raw/mut-spotcheck.txt`, `raw/mutrun.sh`):
  - The control (restore) is green in every file and deep line it touches.
  - M2: killed in the default lane by R2's remnant only (uci-session 1 failed of 230), and in the deep lane by the R2 row.
  - M8d: killed in the default lane by R8's remnant (cli 1 of 109) and by R2's remnant (uci-session 1 of 230), and in the deep lane by the R8 row. This matches the Architect's matrix (R2~, R8~).
  - M9 and M9r: killed in the default lane by R9's remnant, and in the deep lane by the R9 row.
  - The remnants are the Architect's, unvaried apart from formatting.
- **Gates:** lint is clean (148 files). Typecheck and build are clean. `npm test` exits 0 with 2 684 passed in 71 files. The skip count is 0. `test-skip-integrity` and `lane-inventory` (71 collected / 71 tracked) both report "No findings."
- **The default-lane wall, ungraded:** 7 interleaved base/head pairs of `npm test` as spelled, order alternating, pair 0 discarded, load1 1.3–3.0 (`raw/wall.tsv`). Over n = 6: **H median 9.52 s**, B median 9.90 s, paired H − B median **−0.39 s**, and H was faster in 6 of 6 pairs. This is under the 9.6 s `Q-N8H-1` trigger and above the 9.4 s target. A8, graded with a twin, is QE's.
