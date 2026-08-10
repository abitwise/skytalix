---
id: 20260810T165507Z-security-nfr-artifact-ref-1c8e6f43
kind: artifact-ref
by: security-nfr
at: 2026-08-10T16:55:07Z
verified_by: 
confidence: high
refs:
  - ABC-025
  - N5
  - N6
  - plans/board.md
  - plans/traceability.md
  - plans/tickets/ABC-025-san-qualifier-minimality-net.md
  - plans/tickets/history/ABC-025-board-history.md
supersedes: 
---

# Artifacts of `ticket-to-pr-ABC-025-sec` — what this gate changed, what it ran, and what it deliberately did not touch

## Branch and diff

Branch `grugops/ticket-to-pr-ABC-025`. Nothing pushed (no git remote), nothing merged, nothing
deployed.

```
src/                                            UNTOUCHED BY THIS HOP — 0 lines added, 0 removed.
                                                This gate wrote no test row and no production line.
plans/board.md                        EDIT      ABC-025 In Security/NFR -> Ready for UAT,
                                                column counts updated, header replaced
plans/tickets/history/ABC-025-board-history.md  EDIT  hop 4 header archived VERBATIM before
                                                      the replacement
plans/tickets/ABC-025-…-net.md        EDIT      front matter status/column -> ready-for-uat /
                                                Ready for UAT
plans/traceability.md                 EDIT      ABC-025 row only, cells `NFRs` and `Status`
.grugops/queue/claimed->done/ticket-to-pr-ABC-025-sec/   claim record + subtask file
.grugops/context/ticket-to-pr-ABC-025/notes/             these four notes
```

## Commands run, and their results

```
md5 -q src/san.ts                                cbcc3be37c21414d16e8e6b4d0c68959
md5 -q src/san.qualifier.hardening.test.ts       856ebab15128d8b5945c3038401eeda5  (= QE's value)
md5 -q src/san.suffix.hardening.test.ts          c8beb69c1c4169bde319196c3e138eac
git diff --numstat main -- src/                  655/0 + 168/0 = +823/-0, two files
git diff -U0 main -- src/ | grep -c '^-[^-]'     0
git diff --name-only main -- src/ | grep -v '\.test\.ts$'     EMPTY
git diff --name-only main -- 'src/*' :(exclude)<the two hardening files>   EMPTY
git ls-files --others --exclude-standard -- src/              EMPTY
git diff --name-only main -- package.json package-lock.json   EMPTY
git diff --numstat main                          .grugops +2137/-0, plans +600/-2, src +823/-0
npx vitest run --reporter=json                   676 passed / 676 on 22 files; failed 0,
                                                 pending 0, todo 0 -> skip count 0
npm run lint                                     exit 0 (40 files, 2 PRE-EXISTING infos)
npm run typecheck                                exit 0
npm run build                                    exit 0
PERFT_DEEP=1 npx vitest run src/perft.test.ts    32 passed / 32 EXACT in 36.55 s   (N6)
ls node_modules | grep -x chess.js               absent
```

## Instruments — all of them outside the repository, none of them in it

- **The `N5` A/B/C + null-control harness.** An out-of-tree copy of `src/` with `node_modules`
  symlinked, asserted **byte-identical to the repository's `src/` per-file (37 files, md5 each)**
  before the first run. Four conditions — `A` (652), `A'` (an **identity null control**, the same
  tree as `A`), `B` (672, the delivered file), `C` (676, both hardening files) — **interleaved with
  the order rotated every round**, **one fresh OS process per run**, round 0 discarded, n = 10.
  Every run asserts its own test count; a mismatch is a harness error and never a datum, and none
  occurred. Wall from `/usr/bin/time` real, CPU from user + sys. 95% CIs by bootstrap over the
  paired per-round deltas, 20,000 resamples.
- **The `A1` cost-variant harness.** The same four-condition shape with `Bn` in place of `C`:
  the delivered file with **one line** changed out of tree (`const unassisted = toSan(position,
  move)` → `const unassisted = assisted`), everything else byte-identical. n = 8. This is a cost
  variant for measurement, **not a proposed patch** — nothing was narrowed and nothing was
  committed from it.
- **The per-file readings.** vitest's JSON reporter, per-test durations summed per file, taken both
  from inside the full 676-test lane (5 runs) and from isolated single-file runs (5 runs each), so
  the in-lane / isolated gap could be stated as a number rather than assumed away.
- **A read-only source scan** of the 823 added lines for imports, OS calls, dynamic code execution,
  network, filesystem, environment access, timers, nondeterminism, unbounded loops, secret-shaped
  literals and test-integrity markers.

**The repository's own `src/` was never written by any of them**, and `git status --porcelain`
carried nothing under `src/` at any point.

## What this gate deliberately did NOT do

- **`plans/nfr-catalog.md` is not edited and no target in it moved.** `N5` and `N6` are
  ticket-level bars and are not rows in that file; `NFR-001`-`NFR-007` were not re-measured and are
  not claimed as re-verified at this hop.
- **`N5` was not moved, relaxed, re-scoped or waived** — reported as NOT MET and handed to its owner.
- **No acceptance criterion was narrowed.** `A1` stands as written and as delivered. The narrowed
  variant exists only in a scratchpad, as a measurement.
- **No row was added to the suite**, no mutant was scored, no wall-clock assertion was introduced,
  and no coverage was cut.
- **`ABC-013`, `ADR-0004`, `EPIC-003`'s `parseSan` contract and `ABC-013`'s `N1`-`N4` are not
  re-opened.** `src/san.nfr.test.ts` is byte-unchanged.
- **No dependency was added.** `package.json` / `package-lock.json` byte-identical to `main`.
- **Nothing merged, nothing deployed.** `production_requires_human_confirmation` is `true`; a human
  holds both, and no keystroke toward either was attempted.

## What is still owed on this ticket

- **`N5`'s re-specification, by BA/PM** — the statistic, the sample size, the numerator, the
  isolated-or-in-lane reading and the denominator. Until then the bar cannot adjudicate itself, in
  either direction.
- **The UAT hop.** `ABC-025` has zero production lines and no runtime importer; `ABC-013` recorded
  **UAT DEFERRED, explicitly NOT PASSED** in the same position. That call belongs to that hop.
- **`RISK-ABC013-04` closes on merge, not here.**
