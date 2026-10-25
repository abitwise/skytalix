---
id: 20261025T034141Z-software-engineer-observation-e709eff1
kind: observation
by: software-engineer
at: 2026-10-25T03:41:41Z
verified_by: 
confidence: high (deterministic node counts)
refs:
  - ABC-205
  - EPIC-008
  - ABC-206
  - ABC-212
  - ABC-214
  - ABC-217
  - ADR-0031
  - ADR-0026
  - OD-205-1
  - OD-205-2
  - 7c9cd9b9
  - f3e14a00
  - 18a0570e
  - 4f650a45
  - f47b3429
  - d5690c5c
  - 1fdd4748
  - f00013da
  - grugops/ABC-205
  - grugops/ABC-205-final
  - arch-rule-ABC-205-stop/20261023T231000Z-orchestrator-failed-attempt-c3d204a5
  - se-ABC-205-owner-words/20261024T080705Z-software-engineer-observation-12af0d93
  - plans/tickets/ABC-205-king-safety-bites-while-queens-are-on-and-the-king-table-is-tapered.md
supersedes: 
seal: sha256:92b859e3b32eabeca48906f58c030612296b1a84c2720c444fae67d6c51390f4
---

# Software Engineer: ABC-205 at the new base (tip f00013da). Every pin held, all gates green

Logs are in `<scratchpad>/se205int/` (not committed). Node counts are deterministic. No real-clock timing is quoted, and there was no G6, no harness games and no PUZZLE_DEEP. Width 3: two QE hops ran beside this one.

## Pin re-checks (all held; none moved)
- **Default lane** (in `npm test`, green): the re-pinned rows are unedited from the branch, per proof 1 and 2 in `…c685972c`:
  - transposition A1 knight-g1 919 (×2), position-3 1 357 / 1 529, A5 7 356 / −496;
  - ordering A4 position-6 d2 8 095 / 4 722 / 3 993, G1 349;
  - pvs-lmr A4 [−7, b3f3];
  - engine ABC-170 A1 fixture `8/8/4k3/8/8/4P3/5K2/8 w - - 0 1`.
  ABC-206 kept answers identical, so they hold.
- **Drift** (pvs-lmr A1, SEARCH_DEEP):
  - `search() d5: 96.79% within 25 cp of 187, max 79 cp (position-6/e2d2: 56 -> 135); mate-status flips on the 190: 0`;
  - `chooseMove to d5: 97.33% within 25 cp of 187, max 79 cp (position-6/e2d2: 56 -> 135); mate-status flips on the 190: 0`.
  Both are under the 118 cp bar and equal the owner-words reading (`…12af0d93`).
- **Mate floor:** `ABC-121 A1 mate floor d4 -> d5: 0 of 180 violated`.
- **Quiescence cells (A5):**
  - position-6 d1: 515 / 47 = 10.96x (level 16x);
  - kiwipete 16.06 / 22.04 / 3.97x;
  - position-6 29.36x (d2) and 5.16x (d3; 11 939 / 2 315, oracle 160 / c3d5).
  All unchanged.
- **Transposition A4 deep row** ("both doors at maxDepth 10 on a frozen clock"): passes.

## Gates (worktree `../wt-ABC-205-final`, tip `f00013da`)
- lint (`biome check .`, 128 files) rc 0; typecheck rc 0; build rc 0.
- `npm test`: 62 files, 2 091 tests, 2 091 passed. `last-run.json` success true, 0 pending, 0 todo. **Duration 10.26 s.**
- Skip capture 0; `test-skip-integrity.js --skip-count 0`: `No findings.`, rc 0.
- **SEARCH_DEEP:** search 57/57, ordering 38/38, transposition 40/40, quiescence 37/37, pvs-lmr 29/29.
- **ENGINE_DEEP:** engine 60/60, levels 41/41, transposition 26/26, pvs-lmr 21/21, legal 37/37, gameend 47/47.
  - The levels lane includes ABC-212's A4 real-clock rows. They passed on a shared host; that is a pass/fail, not a timing reading.

## Owed (not this hop)
- G6, D and the QE hop on this branch. Then the Orchestrator's merge into main.
