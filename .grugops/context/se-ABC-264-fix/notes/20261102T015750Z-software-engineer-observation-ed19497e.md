---
id: 20261102T015750Z-software-engineer-observation-ed19497e
kind: observation
by: software-engineer
at: 2026-11-02T01:57:50Z
verified_by: 
confidence: high: plant and head runs under the lock, raw in raw/plant; sha256 equal before/after
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
seal: sha256:75782a433bb14555ec17b00f81d03eda4ef5525019c35b3906fd7ed01a467257
---

# se-ABC-264-fix plant proof: the new row is red under QP6 and green at head; engine.ts restored byte-exact

- **Plant QP6** (QE's `qe-ABC-264/raw/plants/QP6.plant.txt`: `chooseMoveWithoutReverseFutility priorKeys: false`). Applied by awk to a copy held out of tree (scratchpad `qp6/engine.ts.orig`); diff `raw/plant/plant.diff` is one line, `src/engine.ts:635 priorKeys: true -> false`, inside `chooseMoveWithoutReverseFutility` only.
- **Red under plant** (`raw/plant/plant-run.txt`, `npm test -- src/engine.test.ts -t QE-264-a` under the host-test flock): rc=1, `Tests 1 failed | 65 skipped (66)`, `AssertionError: expected { move: 'd8c8', score: -1006 } to deeply equal { move: 'd8e8', score: +0 }`. The planted door plays base's move at base's score (the `THIRD_OCCURRENCE[0].base` figures).
- **Restore.** Copied the held original back; sha256 before = after = `172df0b0a89f22982093df61cd2ea828057e8d3f1f0c9382b45236f2ef10d6af` (`raw/plant/before.sha`, `after.sha`, `head.sha`); `git status` showed only `src/engine.test.ts` modified.
- **Green at head** (`raw/plant/head-run.txt`, at bcc82866): rc=0, `Tests 1 passed | 65 skipped (66)`. Also green in the full lane (`raw/gates/test.txt`, `src/engine.test.ts (66 tests)` all passed).
