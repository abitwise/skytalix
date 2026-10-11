---
id: 20261010T183947Z-software-engineer-observation-abc093-a1-a8-readings-cost-gates-02e9031a
kind: observation
by: software-engineer
at: 2026-10-10T18:39:47Z
verified_by:
confidence: high
refs:
  - ABC-093
  - ADR-0037
  - ADR-0035
  - ADR-0023
  - NFR-006
  - NFR-008
  - N8-LANE
  - tools/opening-book/book.test.ts
  - .grugops/context/ticket-to-pr-ABC-093/probe/harness.sh
  - .grugops/context/ticket-to-pr-ABC-093/probe/runs.tsv
  - 20261010T183947Z-software-engineer-decision-abc093-compiler-shape-weight-switch-strict-san-79cc28a5
  - 20261010T183612Z-security-nfr-decision-catalog-r1-provisional-retired-node26-risk003-measured-ar133-recorded-d1e00b44
supersedes:
---

# `ABC-093`: A1–A8 readings, rebuild byte-identity, the narrow-set cost, and the gates

Base `e34fbc6f` (wave tip). Apple M3, Darwin 25.5.0, Node v26.11.0, vitest 3.2.7. All RUN, none asserted.

**Premise re-verified at `e34fbc6f`.** `parseFen`/`toFen`/`parseSan`/`makeMove`/`legalMoves`/`zobristKey`
present; `ABC-010` merged. Upstream master head (GitHub API, 2026-10-10T18:34Z) is still
`a6189a30dc273ccb21fc2536a9a2fefd5592a67a`; the five fetched TSVs' sha256 equal the Architect's
`probe/RUN.txt` byte-for-byte (395,064 B, 3,865 rows). Not stale.

**Source.** `https://raw.githubusercontent.com/lichess-org/chess-openings/a6189a30dc273ccb21fc2536a9a2fefd5592a67a/{a..e}.tsv`,
fetched to a private scratchpad, not committed. Hashes are in `data/opening-book/ATTRIBUTION.md`.

**Artifact.** `data/opening-book/book.json`: **356,526 B** (34.0% of 1,048,576), **5,390 entries**
(3,626 with moves, 2,853 named), 5,825 moves, sha256 `3802f52f3ced9d6911875c778c42246854893afbc4bcdae18b5b01454d4bb41d`.
The ADR's 356,295 B estimate counted UTF-16 code units (`string.length`), not UTF-8 bytes, and had no
`attribution` field or trailing newline. Compile: 0.37 s wall, 0.50 s CPU, one process.

**A1.** Three separate-process compiles of the full pinned source, `cmp` exit 0 each time. In-lane
fixture: two `writeBook` runs, `Buffer.equals` true, no temp path in the bytes.
**A2.** `examined 5390 entries of 5390; 5825 moves; 0 illegal`, by a breadth-first replay walk from
`START_FEN` (key derived per child; examined must EQUAL entries; > 0). Weights all safe integers ≥ 1.
**A3.** Longest book line 12 plies; `maxPly` 12 read from the file; asserted ≥ 8 and ≤ `maxPly` ≤ 12.
**A4.** 19 weighted replies to `1. e4`.
**A5.** `statSync` of the real file: 356,526 B, printed by the test. `NFR-006` MET at this SHA.
**A6.** `data/opening-book/ATTRIBUTION.md` holds `ADR-0023` decision 3's five contents (source + URL;
pinned SHA + read date; `CC0-1.0` + legal-code URL; the README sentence verbatim, re-read at the pinned
commit; the "no attribution" line) plus the five raw URLs and sha256. The test asserts `attribution`
is `"ATTRIBUTION.md"`, that the file exists, and that it contains `source.commit`.
**A7.** Diff touches no `package.json` (no `dependencies` key; `devDependencies` unchanged); the
existing guard `src/line-input.test.ts:674` still pins "no `dependencies` key". The artifact is
`.json`; the test asserts the data directory holds no `.ts/.js/.mts/.cjs…`.
**A8.** Five D1(f) defect classes over **7 fixtures** (the control-byte class split into C0 BEL, DEL,
ESC): each `writeBook` throws its OWN reason (regex per fixture) and `existsSync(out)` is false.
D1(f)'s collision refusal is in code (`entryAt`), not a fixture (cannot be built from real chess).

**Mutations (each restored, `cmp` verified).** M1 `e2e4`→`e2e5`: A2 red (2,820 of 5,390, 1 illegal).
M2 add an unreachable key: A2 red (5,390 of 5,391). M3 write before compile: 7 A8 tests red.
M4 a weight of 0: A2 red.

**Cost (`ADR-0035` decision 2, narrow set = the added file).** Run BY PATH,
`npx vitest run tools/opening-book/book.test.ts`, in three out-of-tree copies: base (one-assertion
placeholder at the same path, no compiler, no data), head, twin (`diff -r -x node_modules` identical).
9 rounds, round 0 discarded, rotated, fresh process each, counts asserted (1 / 13 / 13), load1 3.39–3.50.
- Treatment (head − base) CPU: median **+0.375 s**, interval x(2)..x(7) = +0.33..+0.41 s.
- Twin (twin − head): median +0.01 s (0.7% of 1.36 s, ≤ 1.5%: admissible), signs 4+ / 3− / 1 zero,
  **R = 0.06 s**.
- **Against the ticket's 650 ms content bound: MET** (resolves: R 0.06 ≤ 0.65; median 0.375 ≤ 0.65).
  Floor account: 1 added file × 160 ms, by count. Count pin "≤ 2 new test files": **1**.
- Data: `probe/runs.tsv`; harness: `probe/harness.sh`.

**How `npm test` picks the file up (Security/NFR `…d1e00b44` § Flagged, first bullet).** `npm test`
is `vitest run` at the root with `vitest.config.ts`'s `exclude`, which does not list `tools/`, so the
file is collected: `npx vitest list --filesOnly` prints `tools/opening-book/book.test.ts`, and
`node tools/grugops/lane-inventory.js` reads "collects 53; git tracks 53". `vitest run --dir src` does
NOT collect it. That is why the cost above was measured by path and not by `--dir src`. Whether
`ADR-0035`'s wording or `vitest.config.ts` should change is Architect/Design's (that note's owner), not
this hop's.

**Gates at the branch tip.** `npm run lint` clean (102 files); `npm run typecheck` clean; `npm run
build` = typecheck; `npm test` exit 0, **53 files, 1,676 tests**, 7.17 s (wall 7.73 s, CPU 29.1 s,
load1 5.78); skip count 0; `test-skip-integrity.js` "No findings."; `lane-inventory.js` exit 0.
