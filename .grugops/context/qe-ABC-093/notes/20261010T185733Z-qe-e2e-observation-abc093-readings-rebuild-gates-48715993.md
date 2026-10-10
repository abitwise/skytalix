---
id: 20261010T185733Z-qe-e2e-observation-abc093-readings-rebuild-gates-48715993
kind: observation
by: qe-e2e
at: 2026-10-10T18:57:33Z
verified_by:
confidence: high
refs:
  - ABC-093
  - ADR-0037
  - ADR-0023
  - NFR-006
  - NFR-008
  - data/opening-book/book.json
  - data/opening-book/ATTRIBUTION.md
  - tools/opening-book/compile.ts
  - tools/opening-book/book.test.ts
  - .grugops/context/qe-ABC-093/probe/check.ts
  - .grugops/context/qe-ABC-093/probe/cost.sh
  - .grugops/context/qe-ABC-093/probe/cost-runs.tsv
  - 20261010T183947Z-software-engineer-observation-abc093-a1-a8-readings-cost-gates-02e9031a
supersedes:
---

# `ABC-093`: A1–A8 per criterion, the rebuild identity, and the gates — every number RUN by QE

Apple M3, Darwin 25.5.0, Node v26.11.0. Worktree `.claude/worktrees/qe-ABC-093`, `node_modules` linked into it
only. Load1 swung from 4 to 183 during the hop because other agents were running; wall figures are diagnostic.

## Rebuild identity

- **The source.** The five TSVs were fetched at `a6189a30dc273ccb21fc2536a9a2fefd5592a67a` from the raw URLs in
  `ATTRIBUTION.md` into a private scratchpad, and not committed. They total 395,064 B and 3,865 rows. Their
  sha256 values (`a` `3282e4c9…f793`, `b` `1d5ed134…f623`, `c` `45e843c7…986f`, `d` `1cf4057a…ceda`, `e`
  `48c6f664…8546`) equal `ATTRIBUTION.md`'s five, all 5 of 5.
- **Two rebuilds by the documented CLI.** `node tools/opening-book/compile.ts <dir>` ran in an rsync copy of the
  tree with `book.json` deleted first:
  - `cmp build1 build2` exits 0;
  - `cmp build1` against the committed `book.json` exits 0;
  - both hash to sha256 `3802f52f3ced9d6911875c778c42246854893afbc4bcdae18b5b01454d4bb41d`, at 356,526 B.
- **The CLI's failure paths.** With no argument it exits 1 with the usage line. A missing directory exits 1 with
  ENOENT and writes nothing.

## Per criterion

QE's harness is `probe/check.ts`. It imports `src/` read-only. Children are rebuilt from FEN text as fresh
objects, and the walk is a DFS that measures the longest PATH, not the BFS depth.

- **`A1` (MET).**
  - The full source rebuilt twice: byte-identical (above).
  - The lane fixture is green.
  - New: the same bytes whatever order the source rows arrive in.
- **`A2` (MET).**
  - The test prints `examined 5390 entries of 5390; 5825 moves; 0 illegal`.
  - QE's DFS also examined 5,390 of 5,390 entries, with 0 illegal moves, 0 FEN collisions and no cycle.
- **Zobrist keys (all 5,390 entries, not a sample).** Each key equals `zobristKey` of the replayed position, and
  also of `parseFen(toFen(position))`: 0 mismatches. A drift mutant in `src/zobrist.ts` turns A2, A3 and A4 red.
- **The source replay.** Every one of the 3,865 rows was replayed. Every ≤ 12-ply edge is in the book: 0
  misses. Every one of the 5,825 weights equals its line count: 0 mismatches. The start weights sum to 3,865
  rows, and `e2e4` = 2,032 = the rows whose text starts `1. e4`. All 2,853 names sit at the row-end position: 0
  misses.
- **`A3` (MET).** The longest path is 12 by DFS, and 12 by the test's BFS. `maxPly` is 12.
- **`A4` (MET).** There are 19 weighted replies to `1. e4`, at the entry named "King's Pawn Game".
- **`A5` (MET).** `statSync` reads 356,526 B, 34.0% of 1,048,576. A 700 kB pad mutant goes red.
- **`A6` (MET).**
  - `ATTRIBUTION.md` holds all five of `ADR-0023` clause 3's contents: the source and URL; the SHA and read date;
    `CC0-1.0` with the legal-code URL; the README sentence; and the "CC0 requires no attribution" line.
  - QE re-fetched `README.md` at the pin, and the quoted sentence is there verbatim.
  - The `attribution` field is `"ATTRIBUTION.md"`.
- **`A7` (MET).**
  - `git diff e34fbc6f 5332f501 -- package.json package-lock.json` is empty, and `package.json` has no
    `dependencies` key. The guard is `src/line-input.test.ts:674`.
  - The artifact is `.json`, and a `.js` dropped into `data/opening-book/` goes red.
- **`A8` (MET).** Each of the five D1(f) defect classes fails and leaves no file. There are 7 fixtures at
  `5332f501` and 8 now; the new row is a broken SAN at ply 13. The sixth refusal (collision) was read in
  `entryAt`, and is now also exercised with a stubbed `zobristKey`.

## The diff and its scope

- **The UAT waiver filter.** `git diff --name-only <c>~1 <c> | grep -v '\.test\.ts$' | grep '^src/'` is EMPTY,
  for `c` = `5332f501` and for `c` = `e68b5e68`.
- **Config.** The config diff is exactly `ADR-0037` D1(g)'s two lines:
  - `tsconfig.json` `include` gains `tools/opening-book/**/*.ts`, as one line modified;
  - `biome.json` `files.includes` gains the same, as one line added;
  - `vitest.config.ts` is untouched.

## Gates

The gates were RUN at `5332f501` and at QE's tree `8944fc35`, which is `e68b5e68`'s tree.

- **Static gates.** `npm run lint` is clean (102 files). `npm run typecheck` exits 0, and `npm run build` exits 0.
- **`npm test` at QE's tree.** 53 files: 1,679 tests on 3 of 3 runs at 16 tests, then 1,680 on 2 of 2 at 17
  tests. All exit 0, at 7.9–10.6 s.
- **`npm test` at `5332f501`.** 1,676 tests: 3 runs green, and **1 run red**, which is `QE-093-e`.
- **Integrity.** The skip count is 0. `test-skip-integrity.js` exits 0 ("No findings.").
- **Collection.** `lane-inventory.js` reads "collects 53; git tracks 53", exit 0. `vitest list --filesOnly`
  includes `tools/opening-book/book.test.ts`, while `--dir src` lists 52 files (`QE-093-d`).
- **`host-protection.js`.** Exit 2, `UNKNOWN - verify` (gh returned no readable status). No git remote.
- **No green verdict.** No `§14-gate` verdict is emittable: `scripts/context-io.js` is absent (`AGENTS.md`).

## NFR-008 cost of QE's additions

- **The protocol.** `probe/cost.sh`, run by path, compares `5332f501`'s test file with QE's. It ran 9
  interleaved rounds, each a fresh process, with round 0 discarded.
- **Load.** load1 was 18–26.
- **The reading.** The paired CPU median is +0.005 s, with signs 4+ / 4−: not resolvable from 0.
- **What was measured.** The 16-test version. The 17th test (one 13-ply fixture compile) was not measured
  separately.
- **The bound.** One file still. The ticket's 650 ms bound stands on the Engineer's +0.375 s.
