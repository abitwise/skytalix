---
id: 20261108T220239Z-software-engineer-observation-c160708c
kind: observation
by: software-engineer
at: 2026-11-08T22:02:39Z
verified_by: 
confidence: high: commits and files as listed (recorded as an observation: an artifact-ref needs a §14-gate run, and none exists)
refs:
  - se-ABC-298
  - ABC-298
  - ADR-0077
  - qe-ABC-298-freeze/20261108T212842Z-qe-e2e-decision-44a6717d
  - b9b8eee9
  - 43fe357e
  - 05b2ea2f
supersedes: 
seal: sha256:99e8e45f7aa343f5cd86b88afa426d9400d3a4fca0555e9824838e7f769fc904
---

# se-ABC-298 artifacts: branch `grugops/ABC-298`, the build and its rows, STOPPED before the gate's close (the `failed-attempt` note)

- **Branch:** `grugops/ABC-298`, from `main` `6f943726`. The freeze commit `b9b8eee9` is an ancestor of the first commit.
- **Commits:**
  - claim `12447f09`;
  - build `43fe357e`, the code and the SG2 rows;
  - rows `05b2ea2f`, SG1 (a);
  - then the records commit.
- **Not pushed or merged.**
- **`src/` changed:** `src/moves.ts` (+31), `src/legal.ts` (+28), `src/transposition.ts` (+23), `src/search.ts` (+67 −5), `src/engine.ts` (+65 −4).
- **Test files, rows added only:** `src/legal.test.ts`, `src/moves.test.ts`, `src/search.futility.test.ts`, `src/search.bundle.test.ts`.
- **Tests added:**
  - default lane: SG2 (a) 38 + 1, the per-square row 1, SG2 (c) 8;
  - `ENGINE_DEEP`: SG2 (b) 2 (`src/legal.test.ts`) and the 301 per-square row 1 (`src/moves.test.ts`);
  - `SEARCH_DEEP`: SG1 (a) 7 (`src/search.bundle.test.ts`).
- **Raw:**
  - `raw/scripts/lanes.sh`, the lane runner;
  - `raw/out/`: `lanes.txt`, `holds.txt`, the `sg1a.jsonl` read on the head and its `cmp`, and each lane's summary lines;
  - `raw/seal.mjs`, copied from `se-ABC-303`.
