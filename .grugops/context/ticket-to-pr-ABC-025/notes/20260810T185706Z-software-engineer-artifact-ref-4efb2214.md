---
id: 20260810T185706Z-software-engineer-artifact-ref-4efb2214
kind: artifact-ref
by: software-engineer
at: 2026-08-10T18:57:06Z
verified_by: 
confidence: high
refs:
  - ABC-025
  - N5
  - N6
  - A6
  - src/san.ts
  - src/san.qualifier.hardening.test.ts
  - src/san.suffix.hardening.test.ts
  - plans/traceability.md
supersedes: 
---

# Artifacts of `ticket-to-pr-ABC-025-dev2` — what this hop changed, what it ran, and what it deliberately left alone

## Branch and diff

Branch `grugops/ticket-to-pr-ABC-025`. Nothing pushed (this repository has no git remote), nothing
merged, nothing deployed.

```
src/                                   UNTOUCHED BY THIS HOP — 0 lines added, 0 removed.
                                       The first hop on this ticket whose `src/` delta is zero.
plans/traceability.md        EDIT      ABC-025 row, `NFRs` and `Status` cells only
.grugops/queue/claimed/ticket-to-pr-ABC-025-dev2/  claim record + subtask file, then -> done/
.grugops/context/ticket-to-pr-ABC-025/notes/       these five notes
plans/board.md               NOT TOUCHED — the column move is the Orchestrator's on this hop
```

`git diff --numstat main -- src/` is unchanged at `655/0` + `168/0` = **+823 / −0**, two files, both
`*.test.ts`. The security trigger (+900 lines, or any non-`*.test.ts` file under `src/`) therefore
reads exactly as Security/NFR left it: **not fired**, margin still 77 lines.

## Commands run, and their results

```
md5 -q src/san.ts                             cbcc3be37c21414d16e8e6b4d0c68959   (A6, unchanged)
md5 -q src/san.qualifier.hardening.test.ts    856ebab15128d8b5945c3038401eeda5   (= QE's / Security's)
md5 -q src/san.suffix.hardening.test.ts       c8beb69c1c4169bde319196c3e138eac   (= Security's)
git diff -U0 main -- src/ | grep -c '^-[^-]'  0
git diff --name-only main -- src/ | grep -v '\.test\.ts$'      EMPTY
git ls-files --others --exclude-standard -- src/               EMPTY
git diff --name-only main -- package.json package-lock.json    EMPTY
npx vitest run --reporter=json                676 passed / 676 on 22 files, exit 0, skip 0
npm run lint                                  exit 0  (40 files, the same 2 PRE-EXISTING infos)
npm run typecheck                             exit 0
npm run build                                 exit 0
PERFT_DEEP=1 npx vitest run src/perft.test.ts 32 passed / 32 EXACT in 37.77 s   (N6)
date -u                                       2026-08-10T18:26:13Z at the claim
```

## Instruments — all outside the repository, none of them in it

- **The divergence probe.** For a given `src/san.ts`, walks three disjoint segments — the 184 derived
  positions, `A5`'s 23, `ABC-013`'s 18 — and counts `toSan(p,m,legal) !== toSan(p,m)` per segment,
  plus the qualifier-only divergence that `A1` actually reads. Reproduces the corpus census
  independently: 184 / 6,637 / 4,861 and 23 / 677 / 663 (4,861 + 663 = the delivered `A1`'s 5,524).
- **The list-equality probe.** 7,649 regenerations across all 225 positions compared element-for-
  element against the supplied list: 0 order differences, 0 content differences, 0 shared objects.
- **The separator census.** Fourteen cheap predicates on `(position, move)` counted over the derived
  half's qualifiable moves and over EVERY legal move of the 41 hand-built positions.
- **The mutant harness.** Anchors asserted to occur exactly once, bytes asserted changed,
  `tsc --noEmit` per mutant, one fresh OS process per tree state, pristine restore and re-hash to
  `cbcc3be3…` after every mutant.
- **The two-net scorer.** 17 mutants x {delivered `A1`, narrowed `A1`}, asserting 22 test files and
  676 tests per run and rejecting any file-level failure that carries no failed assertion.
- **The `N5` harness.** Five to six conditions interleaved, order rotated every round, one fresh OS
  process per run, round 0 discarded, n = 8–10, `/usr/bin/time -p` for wall and CPU (user+sys), the
  runner invoked directly so no `npm` startup sits in the denominator, every run asserting its own
  test AND file count, and the four file variants md5-checked as four distinct files before each run.

The out-of-tree copy was asserted **byte-identical to the repository's `src/` per file (36 files, md5
each)** before anything was applied, and **the repository's own `src/` was never written** —
`git status --short` carried nothing under `src/` at any point and `src/san.ts` re-hashed
`cbcc3be3…` at the end. (Security/NFR recorded 37 files for the same directory; the difference is
the `__snapshots__` subdirectory, which is a directory and not a file. Recorded rather than glossed.)

## What is still owed on this ticket

- **The `N5` disposition, by the Orchestrator with the owner.** The bar is NOT MET at net +7.3% /
  +8.2%, the only measured way to close it costs coverage that has now been shown to be load-bearing
  by a build rather than by an argument, and that change does not reliably buy the number either.
  Nothing further is available to an engineer without narrowing a criterion or moving a bar, and
  neither is mine.
- **`ABC-026`** remains the lever that is worth more than anything this ticket can do: the fixed
  floor for two added test files is 3.6–5.0% of lane CPU, i.e. roughly the whole `≤5%` budget spent
  before a single assertion runs.
- **`A5`'s and `A1`'s evidence parentheticals** are stale in the ticket (see the `decision` note §6).
  BA/PM's to correct; not edited here.
- `RISK-ABC013-04` is **not** closed by this hop — it closes when this ticket is gated and merged.
