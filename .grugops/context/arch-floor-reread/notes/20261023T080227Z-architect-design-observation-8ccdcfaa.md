---
id: 20261023T080227Z-architect-design-observation-8ccdcfaa
kind: observation
by: architect-design
at: 2026-10-23T08:02:27Z
verified_by: 
confidence: high (recomputed from committed TSVs; agrees with QE and Security/NFR on every figure)
refs:
  - arch-floor-reread
  - R-178-1
  - ABC-197
  - ABC-200
  - ABC-177
  - ABC-178
  - ABC-198
  - NFR-008
  - N8-LANE
  - ADR-0035
  - ADR-0042
  - ADR-0040
  - 20261023T072556Z-security-nfr-decision-d0c770b5
  - 20261023T075206Z-security-nfr-decision-f636dfd0
  - 20261023T071821Z-qe-e2e-observation-03c392fc
  - 20261021T063630Z-qe-e2e-observation-4263d981
  - 20261022T171339Z-qe-e2e-observation-1478c7fc
  - 20261021T055500Z-orchestrator-decision-b87c35b6
  - plans/tickets/ABC-197-one-step-100-uci-row-restores-the-dropped-token-budget-band-qe-177-b.md
  - 43117fbaa2fb
  - 6b5e0392983d
  - f5764cd4f2d6
  - ff1e375f
  - a93c1e72
  - a42f4bbb
supersedes: 
seal: sha256:686f1aa28bdd2d5eec058ca1b17ad1b42da19c493cc53e68568240495bb970ba
---

# Floor re-read inputs: three admissible narrow-set twins, recomputed from the committed per-run TSVs; arm conditions and the 4.1.12 mechanism evidence. Records only

Architect/Design, task `arch-floor-reread`. **Nothing was run or timed.** Every figure below was recomputed at this hop from a committed per-run TSV, in integer centiseconds, by a scratch script (`recompute.py`, not committed). Each one agrees with the figure QE or Security/NFR published.

## The three twins (T − B, n = 8 scored rounds, round 0 discarded, k = 2; admissibility per `ADR-0035` D1 + A1)

| reading | TSV (sha256 prefix) | set | vitest | B CPU median | twin CPU deltas, sorted | CPU: median, sign, R | wall: median, sign, R | admissible |
|---|---|---|---|---:|---|---|---|---|
| `ABC-177` A8 (`qe-ABC-177/probe/timing2/n8-r1/n8-lane.tsv`) | `43117fbaa2fb` | `src/uci-session.test.ts` (ONE-FILE, heap 400) | 4.1.11 | 7.100 s | −0.11, **−0.07**, −0.04, −0.03, −0.03, 0.00, **0.03**, 0.03 | −0.030 s (−0.42 %), +2/−5 p 0.453, **R 0.070 s** | −0.015 s, +2/−5 p 0.453, **R 0.090 s** | yes / yes |
| `ABC-178` B7 (`qe-timing-ABC-178/probe/n8/n8-a1/n8-lane.tsv`) | `6b5e0392983d` | same | 4.1.12 | 4.090 s | −0.04, **−0.03**, 0.00, 0.01, 0.01, 0.01, **0.01**, 0.04 | +0.010 s (+0.24 %), +5/−2 p 0.453, **R 0.030 s** | −0.010 s, +3/−5 p 0.727, **R 0.050 s** | yes / yes |
| `ABC-200` (`security-nfr-timing-2026-10-23/probe/p1/n8-a1/n8-lane.tsv`) | `f5764cd4f2d6` | 5 files (below), heap 128 | 4.1.12 | 8.225 s | −0.13, **−0.05**, −0.05, −0.02, 0.01, 0.02, **0.04**, 0.11 | −0.005 s (−0.06 %), +4/−4 p 1.000, **R 0.050 s** | +0.010 s, +5/−3 p 0.727, **R 0.050 s** | yes / yes |

- The `ABC-200` set: `src/cli.real-engine.test.ts src/cli.test.ts src/engine.test.ts src/line-input.test.ts src/startup-questions.test.ts`. B and T carry the one-assertion placeholder at `src/startup-questions.test.ts` (`f730fdb27019`).
- R ÷ B CPU: 0.99 % (A8), 0.73 % (B7), 0.61 % (`ABC-200`). All three are below the lowest ratio in `ADR-0035` decision 3's amendment table (2.8 %).

## Arm conditions, A8 against B7 (the same set, either side of the bump)
- **Harness: the same.** B = `git archive` of the base, T = `cp -R B` (`diff -r` clean), H = `git archive` of the head, each with its own `npm ci`. CMD `env NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/uci-session.test.ts` plus `lane174.mjs` (`e2074cdbeedd`) in both. AC on every run, thermal 0→0 on every run in both. Foreign load: A8 logged foreign vitest on most runs (owner word `…b87c35b6`: foreign load no longer blocks); B7 had none.
- **Config: the same.** `git diff ff1e375f a93c1e72 -- vitest.config.ts` is empty. `package.json` differs only in the package name, `bin`, the `build` script and a new `uci` script, and none of these is on the `npx vitest run` path.
- **Runner: the lock only.** `ff1e375f` and `f81bf03c` lock vitest and `@vitest/mocker` at 4.1.11. `a93c1e72`, `00f77f26` and `1d5316e0` lock them at 4.1.12 (`a42f4bbb`, `ABC-198`).
- **Content: changed.** `ABC-177` (`f81bf03c`, `ADR-0046` coarser steps) cut the file's B CPU from 7.100 s to 4.090 s. `ABC-178` added one row (126 → 127 tests at H only).

## Evidence on whether 4.1.12 moves per-file cost (QE `qe-ABC-198` `…1478c7fc`, `QE-198-b`)
- Paired, bisected, on `src/engine.test.ts` at heap 400. **With `--coverage`: +4.6 % / +5.0 %** (20 pairs), bisected to `@vitest/mocker` alone.
- **Without coverage: +0.5 % / −1.3 %** (26 pairs, 8/14 and 4/12 slower: noise), and the swap reads −1.5 % / −2.9 % (4/10).
- `N8-LANE` arms run without coverage. That is the CMD above, and `npm test`.
- Limits: the metric is vitest's per-test `duration` sum on another file, not `/usr/bin/time` CPU on this set. The coverage mechanism is `UNKNOWN - verify` (QE).

## The readout's F argument
- `readout174a.py <dir> <tag> <F seconds | 16pct> [changed|added|multi]` (line 167): a numeric F prints "recorded per-set F"; `16pct` prints 16 % of the window's B CPU median.
