---
id: 20261101T202256Z-software-engineer-observation-70b46340
kind: observation
by: software-engineer
at: 2026-11-01T20:22:56Z
verified_by: 
confidence: high: each plant run under the lock; logs and diffs in raw/plants and raw/probe2
refs:
  - se-ABC-262
  - ABC-262
  - ABC-261
  - ABC-254
  - EPIC-011
  - QE-261-a
  - QE-261-b
  - NFR-008
supersedes: 
seal: sha256:d946aa16566023b30fe0b2bd0845fe44b750f7b16d125d29a8f2f27781f05d23
---

# se-ABC-262 plants: QX1, QX2, PL3a red on the early-exit row; QB NOT red on the promotion row (A4 not met)

Out-of-tree copies of the worktree (tracked files + the two edited rows), `node_modules` symlinked. Planted with QE's own planters: `qe-ABC-254/raw/qe-scripts/plant.py` (PL3a, PQ2) and `qe-ABC-261/raw/qe-scripts/qeplant.py` (QX1, QX2, QB). Each copy's early-exit row got a scratch-only `console.log("B2COUNT", …)` (never in tree). Single-file vitest at heap 128, under `flock host-test.lock`. Diffs, logs and scripts in `raw/plants/`, `raw/probe2/`, `raw/plants.sh`, `raw/probe2.sh`.

| plant | B2 count | early-exit row | promotion row (file run) |
|---|---|---|---|
| C0 (control) | **1** | pass | pass |
| QX1 | 2 | **red** (`2 <= 1` fails) | pass |
| PL3a | 9 | **red** (ABC-261's row also red) | pass |
| QX2 | 10 | **red** | pass |
| QB | 1 | pass | **pass — survives** |

QE's probe read 1 / 2 / 9 / 10; these match.

**Why QB survives (cause read from `src/legal.ts`):** `legalCapturesAndQueenPromotions` leaves `epoch = 0` when in check (it only calls `markPins` out of check), and `pinStamp` is a module `Uint32Array(128)` that starts at 0. So in check, `pinStamp[from] === epoch` is TRUE for any square no earlier `markPins` call stamped. QB keeps that operand, so on P1′ (a2 = square 16, never stamped in the run) it still takes the in-check test and a1=Q stays absent. QB is wrong only where `pinStamp[from]` is non-zero, which the 518 474-node ENGINE_DEEP walk reaches and a fresh test file does not.

- **Order check (`-t`, row alone):** QB passes the ABC-262 row alone too, so the miss is not run order. PQ2 (`!inCheck && pinStamp…`, kills both operands) fails both the ABC-261 and ABC-262 rows alone, so ABC-261's PQ2 catch does not depend on this alias.
- **Remedy candidate (scratch only, NOT in tree):** one priming call before the loop, `legalCaptures(parseFen("k7/8/8/8/8/8/r7/R6K b - - 0 1"))` (black rook a2 pinned by the a1 rook), stamps `pinStamp[a2]` non-zero. With it, QB turns the row red on P1′ (`expected [ Array(1) ] to deeply equal []`), alone and in the file run, and the control stays green 44/44. This adds a row precondition that leans on module-private state; it is BA/PM's call, not taken here.

A5: no plant line and no probe line is in any commit (`git diff main HEAD -- src` shows only the two rows; `grep PLANT` matches only `raw/` evidence files).
