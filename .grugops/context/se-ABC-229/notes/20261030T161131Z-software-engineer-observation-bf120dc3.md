---
id: 20261030T161131Z-software-engineer-observation-bf120dc3
kind: observation
by: software-engineer
at: 2026-10-30T16:11:31Z
verified_by: 
confidence: high: commits and files as listed
refs:
  - se-ABC-229
  - ABC-229
  - EPIC-010
  - ADR-0053
  - grugops/ABC-229
  - f6ff1c4a
  - 01c37946
  - src/legal.ts
  - src/quiescence.ts
  - src/search.ts
  - src/engine.ts
  - src/quiescence.test.ts
  - src/gameend.nfr.test.ts
  - src/search.test.ts
  - src/engine.test.ts
  - src/search.null-move.test.ts
  - src/engine.capacity.test.ts
  - src/search.capacity.test.ts
supersedes: 
seal: sha256:7ff43d84830664cbd89193ce3419639cd1c06c2e10567c334d1667719d08a987
---

# Software Engineer observation (artifact pointers), se-ABC-229: branch, commits, files, tests

- **Branch:** `grugops/ABC-229`, from `main` `01c37946`. Code commit `f6ff1c4a`; the records commit follows it on the same branch. Not merged; nothing pushed.
- **Production files:** `src/legal.ts` (`legalCapturesAndQueenPromotions`), `src/quiescence.ts` (`QuiescenceRules.quietPromotions`, the list choice, the header), `src/search.ts` and `src/engine.ts` (the switch, four constant records, the doors `searchWithoutQuietPromotions` / `chooseMoveWithoutQuietPromotions`).
- **Test files:**
  - `src/quiescence.test.ts`: Q-SET QP-1..QP-9, the brute-force twin, the list rows, the doors, the literal rows, the deep A3 and drift rows, and the `ABC-228` re-points.
  - `src/gameend.nfr.test.ts`: the one-pass spy row, and the work reading passing both switches off.
  - `src/search.test.ts` and `src/engine.test.ts`: the export lists.
  - `src/search.null-move.test.ts`: the `QE-208-c` maps.
  - `src/engine.capacity.test.ts` and `src/search.capacity.test.ts`: the shipped record.
- **Commands:** `npm run lint`, `npm run typecheck`, `npm run build`, `npm test`; the deep lanes via `npm run test:watch -- run <file>` (`raw/scripts/deep.sh`); G1 via the local vitest binary at heap 400; `node raw/scripts/{a1,timed,forecast,oracle}.mjs` on `git archive` trees.
- **No dependency, data, format, `tools/` or level change.**
- **Not done here, and owned by QE:** the graded `G6` at 4 000 ms on both sides, G5's real clock, the smoke pair S-1..S-4 (`A5`) on a `main` that carries `ABC-241`, `G11`, and UAT.
