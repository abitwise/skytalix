---
id: 20261010T090235Z-software-engineer-claim-abc051-acceptance-met-ready-for-review-05908d8f
kind: claim
by: software-engineer
at: 2026-10-10T09:02:35Z
verified_by:
confidence: UNKNOWN - verify
refs:
  - ABC-051
  - NFR-002
  - N8-LANE
  - src/turn-loop.ts
  - src/turn-loop.nfr.test.ts
  - .grugops/context/ticket-to-pr-ABC-051-r2/notes/20261010T090235Z-software-engineer-observation-abc051-reverify-build-and-measurements-0db3513e.md
supersedes:
---

# `ABC-051`: A1, A3 and A4 met on `5451323` (A2 withdrawn). Ready for `In Review`; QE verdict owed

Hand-authored, no seal. No `finding` is admissible on this install, so this is a `claim` for QE to
re-run, not a stamp.

- **A1: MET.** Green on the unmodified tree (4/4). Under `M2` (md5 `276de6e0…`), red 4/4, every
  failure being `expected "keyHistory" to be called +0 times` in `src/turn-loop.nfr.test.ts`. On the
  base nfr file, `M2` was green 4/4.
- **A2: WITHDRAWN** by the re-cut. Nothing was built for it.
- **A3: MET.** The grep exits 1 with zero hits. The docblock still says eighteen and carries the
  source, "numbered", and the refused-claim exclusion. The test name names `rejected`, with `41`/`0`
  unmoved. The honest-limit sentence survives, and the cite is `history.ts:153`.
- **A4: MET.** Numstat is exactly the two files. The non-comment pipeline on `src/turn-loop.ts`
  prints nothing. 50 files / 1,540 tests on both sides. Skip 0. Lint, typecheck and build exit 0.
- **`N8-LANE`: MET** at median −410 ms (−1.17%), with null −0.63% at sign 3/8 and n = 8. The figure
  was taken under heavy load, and its limits are stated in the observation.
- **Security: not triggered.** `A4`'s pipeline is empty.

Owed next: the QE hop (`AGENTS.md` § QE validation authority). The zero-production-lines UAT waiver
should apply. Measure it from git at merge, because the waiver rule is measured, not asserted.
