---
id: 20261102T180901Z-software-engineer-observation-6f57c250
kind: observation
by: software-engineer
at: 2026-11-02T18:09:01Z
verified_by: 
confidence: high: every gate run under the lock; G8 interleaved x3; G6 is the SE's reading, QE grades; QE-owned gates and A6 not run
refs:
  - se-ABC-268
  - ABC-268
  - ADR-0061
  - ADR-0026
  - ADR-0050
  - ADR-0058
  - ADR-0059
  - ADR-0056
  - EPIC-011
  - ABC-229
  - ABC-228
  - ABC-208
  - NFR-005
  - NFR-008
  - grugops/ABC-268
  - df984484
  - ca6e8506
  - aa652215
  - arch-phase2-p3/20261102T171413Z-architect-design-decision-004b35ed
  - arch-phase2-p3/20261102T171413Z-architect-design-observation-55f7725e
  - bapm-P3-page/20261102T173205Z-ba-pm-decision-9018d111
supersedes: 
seal: sha256:53e7d4ca642d924c7d09ad635e08ecf126a64731351387a52f4369929a8f7ec0
---

# se-ABC-268 gates: lint, typecheck, build exit 0; npm test 2 407 passed (base 2 376), skips 0; skip-integrity and lane inventory clean; 14 deep lanes green; G1 54/58; G8 head 8.68 s; G6 (SE reading) >= base on both boards; G9 met

At `df984484`. Every run under the host lock, one at a time. load1 1.2-3.8 during the runs. Foreign long-running processes: a `fake-oidc` node service from another repo (pid 3594620) and `abtop`, untouched. No foreign vitest.

- **Static:** `npm run lint` 0 (132 files, no fixes); `npm run typecheck` 0; `npm run build` 0.
- **Unit:** `npm test`, 64 files, **2 407 passed**, 0 failed, against base `ca6e8506`'s 2 376 (+31: the new file's default rows and the grown literal rows).
- **Skips:** 0 (pending 0, todo 0). `test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: "No findings." `lane-inventory.js`: 64 collected, 64 tracked, "No findings."
- **Deep lanes, exit 0 each** (`raw/deep-summary.txt`; local `./node_modules/.bin/vitest`): SEARCH_DEEP search.futility 47/47; search 57/57; search.null-move 44/44; search.pvs-lmr 29/29; quiescence 116/116; transposition 40/40; ENGINE_DEEP transposition 26/26; engine 78/78; uci-session 241/241; PUZZLE_DEEP puzzle-suite 18/18; ZOBRIST_DEEP 33/33; CLI_DEEP 11/11; UCI_DEEP 13/13; LADDER_DEEP 18/18. The Levels deep lane was NOT run (A6, waits on the owner's acceptance of ADR-0061).
- **G1 (A5):** PUZZLES shipped solved **54/58**, baseline 54/58, no NEWLY-MISSED and no newly solved line (the same four mate-in-3 misses).
- **G8:** `npm test` wall interleaved ×3 (`raw/g8.txt`): head 8.72 / 8.68 / 8.51 s (median **8.68 s**); base `ca6e8506` 8.56 / 8.38 / 8.47 s (median 8.47 s). Bar ≤ 10 s.
- **G6 (A4 (c), the SE's reading; QE grades)** (`raw/g6.jsonl`, `raw/scripts/g6.sh`): 5 rounds, kiwipete pair then position-6 pair, base first in odd rounds, one fresh process per search, `chooseMove` at each build's `LEVELS[5]` (4 000 ms) on the real clock. kiwipete base 8/9/9/9/9 (median 9), head 9/9/9/9/9 (median 9); position-6 base 10×5 (median 10), head 10×5 (median 10). Head ≥ base on both boards; every run ≥ 6 (no FAIL), none at 7 (no WARN). load1 1.2-3.2.
- **G9:** `git diff ca6e8506 -- src/levels.ts` empty.
- **G10:** no level reddened; no fixture re-pin.
- **G5:** abort granularity unchanged (no new throw site; the clock check untouched); the real-clock G5 reading is QE's. **G7:** not owed (ADR-0061 § Consequences: a four-entry constant, nothing held between nodes).
- **Not run (QE / owner):** A6 (100-game C2′ read, the S′ Stockfish smoke, the Levels deep lane), G11, graded G6, UAT.
