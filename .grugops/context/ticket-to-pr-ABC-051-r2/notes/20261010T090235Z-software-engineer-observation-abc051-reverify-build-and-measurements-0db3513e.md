---
id: 20261010T090235Z-software-engineer-observation-abc051-reverify-build-and-measurements-0db3513e
kind: observation
by: software-engineer
at: 2026-10-10T09:02:35Z
verified_by:
confidence: high
refs:
  - ABC-051
  - ADR-0021
  - NFR-002
  - N8-LANE
  - src/turn-loop.ts
  - src/turn-loop.nfr.test.ts
  - src/turn-loop.test.ts
  - src/history.ts
  - plans/tickets/ABC-051-turn-loop-records-false-and-per-ply-bar-blind.md
  - .grugops/context/recut-abc051/notes/20261010T085203Z-ba-pm-decision-abc051-recut-keep-18-drop-site1-withdraw-a2-15914c23.md
supersedes:
---

# `ABC-051` build: re-verification held, `M2` red on `keyHistory` in the bar's own file, gates green

Hand-authored, no seal (degraded posture, `AGENTS.md`). Subtask `ticket-to-pr-ABC-051-r2`, branch
`grugops/ABC-051-r2` from `7812018`, code commit `5451323`. Apple M3, darwin-arm64, Node v26.11.0.

## Re-verification (base `7812018`)

Pins match the page: `src/turn-loop.ts` md5 `0b0687a1…`, `src/turn-loop.nfr.test.ts` md5
`d48a0eb3…`. `src/turn-loop.test.ts` md5 `e6d3ac40…` and `src/history.ts` md5 `12f8c562…` (read only).

| # | site | today | verdict |
|---|---|---|---|
| 2 | `src/turn-loop.ts:268-271` | bare "eighteen transitions", no rule | still false (premise holds) |
| 3 | nfr `:21-24` | "derives nothing on its own"; cites `history.ts:152` (the call is `:153`) | still false |
| 4 | nfr `:131` | same sentence | still false |
| 5 | nfr `:136` | "a non-advancing prompt outcome", drives `rejected` only | still false |
| 6 | nfr `:40-43` | mock wraps `repetitionCounts` only | still a hole |

Other anchors as cited: `claimShortfall` `:255` (call `:256`), advancing derive `:436`, `A8`
`turn-loop.test.ts:1813`, `keyHistory` `history.ts:116`, `repetitionCounts` `:136`, `gameStatusOf`
`:152`, call `:153`. `ABC-019` `## Scope` numbers its transition rows 1-15. `ADR-0021` clause 5 says
"Transitions go 16 → 18" and lists the refused claim beside 7, 8, 9 with no number. Nothing moved.
No stop.

## A1: `M2` measured both sides

`M2` was run with the first hop's runner (copied to this hop's scratchpad, verbose reporter added).
It pins `src/turn-loop.ts` by md5 and throws on a mismatch, then restores from a pristine copy in a
`finally` and re-checks the md5. Mutant md5 `276de6e0bf1e115a6d29820c37ce54f5`, which matches the
first hop's. Restored `0b0687a1…` on both runs.

- **Base nfr file:** exit 0, 4/4 green. The file is blind to `M2`.
- **Repaired nfr file (md5 `c9c6373a…`):** exit 1, **4/4 failed**. Every failure is
  `expected "keyHistory" to be called +0 times, but got N times`, with N = 40, 120 and 300 on the
  three ply-count cases and 40 on the `rejected` case. No other assertion failed. The red names
  `keyHistory` `toHaveBeenCalledTimes(0)` in `src/turn-loop.nfr.test.ts`, which is the wiring proof
  `A1` requires.
- Unmodified tree with the repaired file: 4/4 green.

## A3 and A4, measured on the branch

- `/usr/bin/grep -nE 'derives nothing on its own' src/turn-loop.ts src/turn-loop.nfr.test.ts` gives
  **exit 1, zero hits**.
- `A4`'s non-comment pipeline over `git diff -U0 7812018 -- src/turn-loop.ts` is **empty**.
- `git diff --numstat 7812018 5451323`: `19 7 src/turn-loop.nfr.test.ts` and `7 1 src/turn-loop.ts`.
  That is exactly two files.
- Suite total: **base 50 files / 1,540 tests; branch 50 / 1,540.** No new `it` and no new file. The
  nfr file has 2 `it(` sites on both sides. (`AGENTS.md`'s "1539" receipt is from 2026-10-09 and
  is not this hop's to refresh.)

## Gates on the branch worktree

`npm run lint` exit 0 (97 files). `npm run typecheck` exit 0. `npm run build` exit 0. `npm test`
exit 0: 50 files, 1,540 passed. Skip count is 0 (vitest json `numPendingTests + numTodoTests`).
`node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` printed
`No findings.`, exit 0.

## `N8-LANE`

The default lane was run as `npm test` with CPU = user + sys of the whole process tree
(`/usr/bin/time -p`). There were three conditions. **base** = `git archive 7812018`. **null** = a
second `git archive 7812018`, `cmp`-identical to base over all 3,923 files. **branch** =
`git archive 5451323`, which differs from base in exactly the two ticket files. All three share
`node_modules` through a symlink. The harness ran 9 rounds with round 0 discarded, so n = 8. Each
run was a fresh process, and the order rotated every round. Raw TSV:
`/private/tmp/…/scratchpad/ABC-051-r2/n8.tsv`.

- Base median CPU **34,895 ms**.
- **branch − base: median −410 ms (−1.17%), sign 2/8 positive.** Deltas −430, 260, 1360, −2660,
  −390, −1650, −650, −120.
- **null − base: median −220 ms (−0.63%), sign 3/8.** This is within ±1.5% with the sign at chance,
  so the control is admissible.
- New test files: 0, so the 160 ms/file floor term is +0.
- **Verdict: ≤ 650 ms, MET.** I report one honest limit with it. The machine was heavily loaded by
  parallel hops: load1 was 17.8 at the start and 58.1 at the end. Per-round deltas swung by up to
  ±3.7 s, and lane CPU drifted from ~25 s to ~35 s across rounds. The instrument's resolution in
  this session is far coarser than 650 ms. The median passes and the control is admissible, but
  the figure says "no detectable cost", not "costs −410 ms". Under 650 ms is the expected result
  by construction: 3 extra spy reads, one extra `vi.fn` wrapper, and the `keyHistory` wrapper on a
  function the advancing path never calls.

## Pre-existing stale citations (flagged, not touched; outside this ticket's file set)

These five `src/` comments cite `turn-loop.ts` lines past `:271`. Each was **already wrong at base
`7812018`** (for example, `INPUT_ENDED_NOTICE` sits at base `:342`, not `:312`, and the `A9b` arm
is at base ~`:320-338`, not `:291-309`). This ticket's 6 inserted comment lines shift them further:

- `src/line-input.ts:21`, `turn-loop.ts:291-309`
- `src/command-input.ts:58`, `turn-loop.ts:319-341` (and `:234` for `claimShortfall`, now `:255`).
  This file is `ABC-036`'s, which is fenced.
- `src/result-screen.ts:12`, `turn-loop.ts:312`
- `src/cli.ts:30`, `turn-loop.ts:293-309`
- `src/cli.ts:181`, `turn-loop.ts:312`

Changing any of them is a file outside this ticket's set, which the task's stop condition forbids. I
suggest a follow-up for BA/PM: cite by symbol name rather than by line.
