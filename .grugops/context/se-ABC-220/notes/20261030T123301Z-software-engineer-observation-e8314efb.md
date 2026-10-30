---
id: 20261030T123301Z-software-engineer-observation-e8314efb
kind: observation
by: software-engineer
at: 2026-10-30T12:33:01Z
verified_by: 
confidence: high on counts, red checks and hashes as run; one host, plain node; A11, A14 and A12's wall NOT run (QE's, alone)
refs:
  - se-ABC-220
  - ABC-220
  - EPIC-009
  - ADR-0052
  - grugops/ABC-220
  - 68ba364c
  - 8e1cdda5
  - NFR-004
  - NFR-008
  - AR-NFR004-A
  - .grugops/context/se-ABC-220/raw/id.mjs
supersedes: 
seal: sha256:d400fae85ef41bf13bbc5990cea5874863cdd169712d7c06cd8f3bd3fa978241
---

# Software Engineer observation, se-ABC-220: gates, red checks and identity with base, as run

All results below were run in the worktree at `grugops/ABC-220` `68ba364c`, under plain `node`.

## Mandatory gates (via `npm run`)
- `npm run lint`: exit 0 (129 files). `npm run typecheck`: exit 0. `npm run build`: exit 0.
- `npm test`: 63 files, **2 271 passed**, 0 failed, 0 skipped. `src/uci-session.test.ts` went from 144 to 196 rows, so base had 2 219 (derived: 2 271 − 52). `src/uci.real-engine.test.ts`'s default lane is still 1 row; its A14 rows are not defined while `UCI_DEEP` is unset.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.` `node tools/grugops/lane-inventory.js`: 63 = 63, `No findings.`
- **A12 is NOT read here.** The one `npm test` run took a vitest Duration of 9.54 s, but a CPU-bound out-of-tree harness was running beside it, and the host is shared with another SE. It is not an `NFR-008` reading. QE reads it ALONE.

## Red checks (mutate `src/uci-session.ts`, run the file, restore; the restored file is diff-clean)
Each mutant turned at least one row red:
- increment halved → the increment row;
- reserve 500, overhead 50 → A5, A7 ×3, `tc=40/60`;
- second term without the overhead → the hard-stop row. This mutant survived until that row was added;
- floor 0 → the `wtime 800` row;
- T 22 500 → A2 ×3, A3, A4, A5;
- C not capped by T → A3, A4, A5, A6 (the 1-hour clock), A9;
- `movetime` not capped → A6 and A9;
- the blunder path reachable in a mode → A9 ×2;
- the level cap in a mode → A2, A3, A4, A5;
- a case-insensitive value → A10 ×2;
- `movestogo` default 30 → A5;
- default `simple-tournament` → the `ABC-167 A5` time-rule rows (identity).

## A8 identity out of tree (`raw/id.mjs`, plain node)
- **The script:** base `8e1cdda5`'s `src/` against head's `src/`. For each of 21 sessions (levels 1–7 × 3 clock shapes: `movestogo`, increment, `movetime`) it plays a 40-move game on a virtual clock with the real engine and the real level path, then sends `go depth 3`, a bare `go` and `go infinite`/`stop`. Every output line is hashed.
- **Base:** 1 839 lines, sha256[0:16] `7d319f711ff6e2a5`.
- **Head, `TimeMode` never set:** 1 839 lines, `7d319f711ff6e2a5`.
- **Head after `setoption name TimeMode value level`:** 1 839 lines, `7d319f711ff6e2a5`.
- **Non-vacuity, head after `setoption name TimeMode value simple-tournament`:** the full 21-session run with the setting was too slow (22 s budgets at step 97) and was stopped unfinished. A cut run (`LEVELS=1,5 PLIES=3`) gives base = head = head with `level` at 81 lines, `b504c3dcdb28a754`, and head with `simple-tournament` gives 78 lines, `f4b39a5a6e1c73c5`, which differs, so the harness does see a mode change (`raw/id-result.txt`).

## Results as figures (virtual clock, δ = 31 ms)
- **A3:** 22 000 on all 40 moves; C starts at 22 375 and never falls; 18 760 ms are left after move 40; 97.9 % of the period is used.
- **A4:** 83.2 % used.
- **A5:** T binds for 21 moves, then C. **166 517.12 ms are left after move 40** (BA/PM: about 166 s).
- **A6:** 22 000 for each of the four shapes, and 5 000 for `movetime 5000`. C = 89 875 on the 1-hour clock.
- **A7:** 1 900 ms and 1 069 ms left; `wtime 800` gives 1 ms, and the real engine still returns a legal depth ≥ 1 move. At `tc=40/60`, C binds on all 120 moves, and each period's last move leaves 1 069 ms.

## NOT run by the SE (QE's, with the host ALONE)
- **A11:** `ENGINE_DEEP=1`, `src/uci-session.test.ts`, ~2 min. **Unrun.**
- **A14:** `UCI_DEEP=1`, `src/uci.real-engine.test.ts`, ~3 s plus the existing dialogue. **Unrun.**
- **A12's `npm test` wall.**
