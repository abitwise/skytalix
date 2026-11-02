---
id: 20261102T015750Z-software-engineer-decision-6d2969b1
kind: decision
by: software-engineer
at: 2026-11-02T01:57:50Z
verified_by: 
confidence: high: as committed in bcc82866
refs:
  - se-ABC-264-fix
  - ABC-264
  - QE-264-a
  - ADR-0059
  - ADR-0054
  - ABC-230
  - grugops/ABC-264-fix
  - grugops/qe-ABC-264
  - 1dede4f2
  - bcc82866
  - src/engine.test.ts
  - qe-ABC-264/20261102T015326Z-qe-e2e-observation-3a95d391
supersedes: 
seal: sha256:bb1bba6a5702fbf64ca50e342bcf710eabf26426b37f7bed0a8043345ff04aa6
---

# se-ABC-264-fix decision: close QE-264-a with one behavioural row in src/engine.test.ts (ABC-230 A3/A4 block), not a literal-map row

Software Engineer, task `se-ABC-264-fix`, brief `.grugops/queue/claimed/se-ABC-264-fix.md` (orchestrator, 30bad2ee). Gap: `qe-ABC-264/20261102T015326Z-qe-e2e-observation-3a95d391` QE-264-a.

- **What.** One `it` row, `ABC-264's door reads prior keys, as chooseMove does: the A1 repetition at 0 with them, not without (QE-264-a)`, in `describe("ABC-230 A3 and A4 — ...")`, after the row "the three test-only doors ignore prior keys". It hands `chooseMoveWithoutReverseFutility` the `THIRD_OCCURRENCE[0]` (KQ v K) game's prior keys at fixed depth 4 on the virtual clock and asserts `{ move: "d8e8", score: 0 }`; without the keys it asserts the move is not `d8e8` and the score is not 0 (non-vacuity).
- **Why behavioural, not a `priorKeys` literal-map row.** The QE note allowed either. A behavioural row pins what the door does (reads the keys), not the spelling of its literal, and reuses the A1 fixtures, helpers (`gameOf`, `priorKeysOf`, `fixedDepth`) and the exact figures already pinned for `chooseMove` in the same file. That is why the row lives in `src/engine.test.ts` rather than `src/search.reverse-futility.test.ts`: those helpers exist only there, and the brief allows one test file.
- **Scope kept.** Only the new door (`chooseMoveWithoutReverseFutility`), as the brief names. The other two prior-key doors (`chooseMoveWithoutQuietPromotions`, `chooseMoveWithoutQuiescenceEvasions`) are not added: not in the brief. No production edit; `src/engine.ts` sha256 172df0b0... unchanged.
- **Deviation.** None from the brief. The describe title says "the doors take none"; the new row's name states its door reads keys, so the title is left as is (renaming a title is outside a one-row diff).
