---
id: 20260925T151100Z-security-nfr-observation-abc122-n8lane-met-plus-670ms-gross-350ms-net-sign-8of8-wrapper-unresolvable-2ff3a7b8
kind: observation
by: security-nfr
at: 2026-09-25T15:11:00Z
verified_by:
confidence: medium
refs:
  - ABC-122
  - NFR-008
  - N8-LANE
  - N8-SPAWN
  - ADR-0019
  - secnfr-ABC-122
  - .grugops/context/ticket-to-pr-ABC-122/notes/20260925T142300Z-software-engineer-observation-abc122-gates-mutants-hang-proof-lane-wall-n8lane-3a0e770b.md
  - .grugops/context/secnfr-ABC-081/notes/raw-harness-lane.mjs.txt
  - .grugops/context/secnfr-ABC-122/notes/raw-harness-lane.mjs.txt
  - .grugops/context/secnfr-ABC-122/notes/raw-out-lane-summary.txt
  - .grugops/context/secnfr-ABC-122/notes/raw-out-lane.tsv.txt
  - .grugops/context/secnfr-ABC-122/notes/raw-out-lane-load.txt
supersedes:
---

# ABC-122 `N8-LANE`: MET. +670 ms gross CPU, +350 ms net of the 320 ms two-file floor, sign 8/8. The wrapper's own cost is below resolution and is not charged

Hand-authored and unsealed (no `scripts/context-io.ts` on this install; `human_admission` is
`off`). Machine: macOS (Darwin 25.5.0), Node v24.12.0.

## The instrument

`secnfr-ABC-081`'s lane harness, with the arms directory, arm labels and charge labels changed and
one arm added (`raw-harness-lane`'s header says so). It follows `NFR-008`'s protocol: contained lane
`npx vitest run --dir src`, one fresh OS process per run, order rotated every round, 9 rounds with
round 0 discarded, counts asserted on every run, CPU = user + sys from `/usr/bin/time -p`.

Arms, extracted with `git archive` into the scratchpad (no git in them):
- **A** = `ca9f42d`, the delivered code commit. `ca9f42d..9db8f2a` changes nothing under `src/`,
  `tools/`, `package.json`, `package-lock.json` or `vitest.config.ts`.
- **N** = a byte-identical copy of A (`/usr/bin/diff -rq`: identical).
- **B** = `0bc31e1`, the wave merge-base QE ruled as the `A11` base. Under `src/` it differs from A
  by the two new capacity test files and the one-line `SCRIPTS_AT_HEAD.test` pin.
- **W** (new) = arm A's tree, the same lane invoked through the wrapper:
  `node tools/grugops/run-bounded.js 60000 npx vitest run --dir src`. W − A prices the wrapper's
  own process on its own, separately from A − B.

## The reading (36 runs, 0 harness errors)

| arm | files / tests | median CPU | CPU range | median wall |
|---|---|---|---|---|
| A (ABC-122) | 47 / 1 446 | 23.460 s | 23.24 – 23.79 | 5.460 s |
| N (identity) | 47 / 1 446 | 23.385 s | 22.57 – 24.01 | 5.475 s |
| B (base) | 45 / 1 444 | 22.845 s | 22.25 – 23.32 | 5.390 s |
| W (A through the wrapper) | 47 / 1 446 | 23.660 s | 22.93 – 23.78 | 5.500 s |

- **Null control, N − A:** median **−0.020 s (−0.09 %)**, sign 2/8. **Admissible** (within 1.5 %,
  sign at chance).
- **Charge, A − B:** per round 0.88 0.99 0.45 0.69 0.65 0.49 0.34 0.87. Median **+0.670 s CPU
  (+2.86 %)**, **sign 8/8**. The wall charge is +0.045 s.
- **Net of the 2 × 160 ms per-file floor: +350 ms, against 650 ms. MET.**
- **Wrapper, W − A (same tree):** per round −0.27 −0.31 0.34 −0.02 0.31 0.13 0 −0.13. Median
  **−0.010 s**, sign 3/8, so it cannot be told apart from zero at this resolution. As a separate
  point figure, `node run-bounded.js 5000 /usr/bin/true` costs 0.01 s user + sys in each of 7 runs,
  against 0.00 s for bare `true` (`time -p` resolves to 10 ms).
- **Load:** the 1-minute load before each run was min 4.05, median 11.84, max 20.81. That is lower
  than the build's median of 17.41, but other hops were still running.

## The ruling on the build's figure

- **MET is CONFIRMED. The size is CORRECTED UPWARD**, the same shape as `ABC-081`: the build read
  +475 gross / ≈ +155 net at sign 5/8, and this gate reads **+670 gross / +350 net at sign 8/8**.
- Sign 8/8 is the first cleanly resolved reading of this charge. It is still one session under
  load, so the confidence is medium rather than high. The honest statement is **a real charge of
  roughly 0.5–0.9 s gross, 0.2–0.6 s net, under 650 ms at every round's own value**: the largest
  per-round delta, +0.99 s, is +670 ms net.
- The build attributed the charge mostly to the engine row: 224 ms of vitest test time over 130
  deepening iterations of a 128-ply line. This gate did not re-attribute it.

## Does the wrapper's spawn belong in the charge? **No, and the verdict does not depend on it**

1. `N8-LANE` charges **lane files under `src/`**, measured on the contained lane, which invokes the
   runner directly (`npx vitest run --dir src`). The wrapper is not a lane file. It is the gate's
   harness around the lane, in the same place `npm` and `npx` already are, and neither of those is
   charged.
2. It is measured anyway: W − A = −10 ms, and the isolated cost is about 10 ms. **Charged in full,
   W − B = +675 ms gross (sign 8/8), +355 ms net. MET either way.**
3. `N8-SPAWN`: **0 charged, and the build's reading is confirmed.** No test in the lane spawns the
   wrapper. The proof (`run-bounded.proof.js`) runs outside the lane.

## About the lane, not about `ABC-122`

- The lane reads about 23.5 s CPU against `NFR-008`'s 13 s clause. `ADR-0019` trigger (a) stays
  fired, and `AR-N8LANE-079` (accepted by the owner) still covers the level. This ticket is held
  to the per-ticket 650 ms and meets it. No new owner word is owed for `N8-LANE`.
- Lane totals from different sessions are not comparable: A read 24.88 s at the build and 23.46 s
  here, at load medians of 17.4 and 11.8. Only the paired A − B above is this ticket's charge.
- The wall clause (≤ 3 s; this gate reads 5.46 s) is reported, not ruled. `ABC-111` owns it.
