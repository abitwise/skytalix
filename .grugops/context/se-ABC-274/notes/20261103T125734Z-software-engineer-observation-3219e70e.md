---
id: 20261103T125734Z-software-engineer-observation-3219e70e
kind: observation
by: software-engineer
at: 2026-11-03T12:57:34Z
verified_by: 
confidence: high (test diff is additions only, read from git diff; A3 selection rule stated; QE freeze absent: UNKNOWN - verify)
refs:
  - se-ABC-274
  - grugops/ABC-274
  - ABC-274
  - EPIC-011
  - E2-pre
  - ADR-0067
  - ADR-0064
  - F8
  - C1
  - P5
  - A1
  - A2
  - A3
  - A4
  - A5
  - A6
  - A7
  - A8
  - A9
  - B0
  - G2
  - G3
  - G6
  - NFR-009
  - 128e3c6c
  - 54dee3f2
  - c131ecd0
  - src/evaluate.ts
  - src/evaluate.taper.test.ts
  - src/evaluate-params.ts
  - arch-fold-1103b/e16881f5
  - se-ABC-269-cut/20261103T112851Z-software-engineer-decision-8e00e712
supersedes: 
seal: sha256:96b03575d71134c9d643454682c8abd75a987c44b3b2e94ec268237868ee8511
---

# se-ABC-274 tests: rows added only, zero expectations moved (A7). 19 new default-lane rows in `src/evaluate.taper.test.ts`: A3, 15 families plus a name row and a seam-restore row; A9, a bound row plus a non-vacuity row. No existing line of any test file changed except the import lists of that one file

- **`git diff 128e3c6c -- 'src/*.test.ts'`** touches one file, `src/evaluate.taper.test.ts`. The diff is additions only: three import lists widened, and a block appended at the end. No `expect` value, count, pin or string in any existing row changed.
- **C1's P5 guard** (`src/evaluate.taper.test.ts`, "ABC-269 cut C1 P5"): green, and its text was not touched. The walk text between `for (let rank = 7;` and `const mobilityScore` holds no `phase`, `egDelta` or `KING_EG_DELTA`. The two `KING_EG_DELTA[…]` strings are still in the body, verbatim.
- **Pins that could have moved and did not:** the pawn memo's 448 KiB (`src/evaluate.pawns.test.ts`, `src/transposition.test.ts`). The memo keeps three 4-byte parts. `VALUE_TABLES_FOR_TEST`'s 10 names (`src/evaluate.test.ts`) and `ABC-215` A2's rule rows are unchanged too.
- **Not touched:** `src/evaluate-params.ts` (byte-unchanged; `git diff` is empty), the search, the engine, quiescence and every corpus.
- **A3's positions:** QE's freeze (ticket test note 1) **was not found** under `.grugops/context/` or `src/` at build time. The rows use a stated selection rule over corpora already frozen in the repository: `G3`'s 184 in `buildCorpus` order, QE's E1 `TAPER_DOOR_CORPUS`, then `MATE_CORPUS` (ABC-269 B2's 287). Each family takes its first six positions at phases 1–23 where its count (white minus black) is not 0. The mate corpus was added after the first run found no `KING_FILE_OPEN` position in the first two corpora. Nothing was hand-picked. **The QE freeze is owed, `UNKNOWN - verify`:** QE may replace the selection with frozen rows. That adds positions and moves no expectation.
