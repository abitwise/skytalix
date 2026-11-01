---
id: 20261101T070329Z-software-engineer-observation-8de958b6
kind: observation
by: software-engineer
at: 2026-11-01T07:03:29Z
verified_by: 
confidence: high: each plant run out of tree and read once; red rows and handed values from the vitest json
refs:
  - se-ABC-246
  - ABC-246
  - EPIC-009
  - ADR-0052
  - NFR-008
  - QE-221-a
  - SE-221-g
  - SE-246-a
  - ABC-221
  - ABC-170
  - qe-ABC-221/20261031T060935Z-qe-e2e-observation-8ad25906
  - qe-ABC-221/20261031T060935Z-qe-e2e-observation-c6f37a35
  - se-ABC-221/20261031T053932Z-software-engineer-observation-7896971d
  - grugops/ABC-246
  - 3c5e05fd
  - 832ff246
  - src/uci-session.test.ts
  - src/engine.test.ts
supersedes: 
seal: sha256:1bf449bb21c947096cb026908b633154c89d93b908540aa278bfeb78c79c9f26
---

# `ABC-246` A3: QE's HSCM reds A1 only and CLOCKWINSCM reds A2 only; both rows are green on `main`'s `src/uci-session.ts`; plants never committed

- **Method** (`raw/plant.mjs`). The plant strings are copied verbatim from `qe-ABC-221`'s `raw/qe-scripts/plant.mjs`
  (`SHARE` → HSCM, `MT` → CLOCKWINSCM). Each one is asserted to occur exactly once.
  - Each is applied alone to a scratch tree P, outside the repo.
  - P is a real copy of `src/`, `tools/`, `data/`, `package.json`, `tsconfig.json` and `vitest.config.ts`, with
    `node_modules` symlinked. QE's `cp -al` fails across devices here (scratch and repo are on different
    filesystems).
  - The run is `src/uci-session.test.ts` through `node node_modules/vitest/vitest.mjs run` (never npx), with the
    json reporter and heap flag 400 (the one-file row).
  - The file is restored after each plant, and `cmp` of the worktree's and P's `src/uci-session.ts` is equal at the
    end. The worktree's `src/uci-session.ts` was never touched (`git status` shows only the two test files before
    commit).
- **Readings** (`raw/plants-summary.txt`):

  | plant | file total | passed | failed | red row | handed vs expected |
  |---|---|---|---|---|---|
  | none | 234 | 234 | 0 | — | — |
  | HSCM | 234 | 233 | 1 | ABC-246 A1 | `[2400]` vs `[1900]` |
  | CLOCKWINSCM | 234 | 233 | 1 | ABC-246 A2 | `[22375]` vs `[5000]` |

- These are exactly the ticket's figures: the spread 2 400 and C = 22 375. No other row moved under either plant, in
  this file. QE re-reads A3 on the whole lane.
