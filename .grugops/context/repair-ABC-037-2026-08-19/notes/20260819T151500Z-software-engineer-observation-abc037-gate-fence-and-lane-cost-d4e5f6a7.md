---
id: 20260819T151500Z-software-engineer-observation-abc037-gate-fence-and-lane-cost-d4e5f6a7
kind: observation
by: software-engineer
at: 2026-08-19T15:15:00Z
verified_by:
confidence: high
refs:
  - ABC-037
  - ABC-108
  - NFR-008
  - N8-LANE
  - A8
supersedes:
---

# The gate re-run in full, the `A8` fence verified from git, and the lane cost reported not claimed

Node v24.12.0, npm 11.7.0, run on `grugops/abc037-repair` in a contained agent worktree.

## Gate — every step run, none reported that was not run

| step | QE baseline | **this branch** |
|---|---|---|
| `npm test` | 39 files / 1175 tests, 0 failed | **39 files / 1181 tests, 0 failed** ✔ (2.46 s wall) |
| skip count (`--reporter=json`, `jq '.numPendingTests + .numTodoTests'`) | 0 | **0** ✔ |
| `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | `No findings.` exit 0 | **`No findings.` exit 0** ✔ |
| `npm run lint` | exit 0, 70 files | **exit 0, 70 files** ✔ |
| `npm run typecheck` | exit 0 | **exit 0** ✔ |
| `npm run build` | exit 0 | **exit 0** ✔ |
| `PERFT_DEEP=1 npx vitest run src/perft.test.ts` | 32/32, 38.49 s | **32/32, 39.74 s** ✔ |
| `INPUT_DEEP=1 npx vitest run src/line-input.test.ts` | 26 passed | **32 passed** ✔ |
| `INPUT_DEEP=1 NODE_OPTIONS=--expose-gc …` | — (new) | **33 passed**, 78 ms ✔ |
| default lane, that file alone | 23 | **29** ✔ |

**1175 → 1181** is +6 default-lane rows: one from splitting the cap boundary row across both
terminators, two new 1025-unit rejection rows, and the three direct guards (`data`-listener count,
surplus-after-`end()`, split-multibyte). **+3 more** exist only in the deep lanes (the retention row
and the two terminator variants that land there is not it — precisely: deep adds the flood, the
retention row, the sweep and the totality row; 29 → 32 → 33).

Skip count is **0** and the new retention row does not change that: without `--expose-gc` it is NOT
DEFINED, the same shape as `INPUT_DEEP` itself, so nothing is ever reported pending or todo.

## `A8` fence — verified from git, not asserted

```
git diff --numstat grugops/quality-gate-ABC-037-qe-2026-08-19 HEAD
195  30  src/line-input.test.ts
 16   3  src/line-input.ts
```

Nothing else under `src/`. The two files named byte-identical are byte-identical **by blob hash on
both sides**:

```
src/turn-loop.ts   9334daf1d2c2242e2071830c491e3b7f86a16a79   base == head
src/frame.ts       6d2a86856baad5a8f5e5c2b4726347a27456e407   base == head
```

`plans/traceability.md` is the only file outside `src/` this hop changed, and it is the role's own
trace obligation rather than a production file. **`AGENTS.md` untouched** — the Scribe holds it.

## Lane cost — `N8-LANE` NOT CLAIMED, and this hop's own delta is BELOW NOISE

Paired and interleaved, same tree, the two files checked out at `HEAD` and then at the QE base each
round, CPU = user + sys around `npm test`, n = 3:

```
round 0  REPAIR 14.420   QE-BASE 14.310      round 2  REPAIR 14.534   QE-BASE 14.748
round 1  REPAIR 14.371   QE-BASE 14.591
```

- Median: **14.420 s CPU with this repair, 14.591 s without it.**
- Paired deltas: **+0.110, −0.220, −0.214.** Sign **1/3 positive**.
- Wall: **2.77–2.92 s**, against the 3 s clause.

**The sign is not consistent, so this hop's own cost is not distinguishable from noise.** Six extra
default-lane rows costing 4 ms of test time are not measurable inside a 14 s lane, and I am reporting
that as "below noise" rather than dressing a negative median difference up as a saving.

**`N8-LANE` is NOT claimed and is NOT grantable, and I am not asking for it.** The lane is over
`NFR-008`'s 13 s CPU clause **with or without this ticket** — 14.4 s here, against QE's 13.91 s
without the files and my own 14.51/14.67 from the delivery tree. That is `ABC-108`'s finding,
measured now from a fourth independent tree. A slice of a budget that is already spent is not a
slice. It is Security/NFR's bar and `ABC-108`'s ticket; **reported, routed, not decided.**

## What I did NOT do

No guard weakened — and where a guard's threshold moved (`absorb`'s memory bound, by one UTF-16
unit), a mutant was written to prove the guard it protects still bites. **Nothing merged, nothing
deployed, no board column moved.** No board file opened. `plans/nfr-catalog.md` not opened. The
token scan not widened. `AGENTS.md` not touched. Two temporary probe files (`src/zz-probe.test.ts`,
a standalone script outside the repo) were deleted and are in no commit.
