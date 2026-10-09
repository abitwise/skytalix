---
id: 20261009T213535Z-qe-e2e-decision-abc125-verdict-pass-285261fb
kind: decision
by: qe-e2e
at: 2026-10-09T21:35:35Z
verified_by:
confidence: high
refs:
  - ABC-125
  - ABC-086
  - ABC-085
  - ABC-087
  - G-QE-1
  - M5
  - N8-LANE
  - src/engine.test.ts
  - src/virtual-clock.ts
  - 20261009T213535Z-qe-e2e-observation-abc125-five-mutants-red-toequal-exact-ed9e7ff5
  - 20261009T212814Z-software-engineer-observation-abc125-m5-red-shipped-green-gates-n8lane-8181a086
  - 20261009T212814Z-software-engineer-claim-abc125-built-owed-qe-and-what-it-does-not-guard-e42363cd
supersedes:
---

# `ABC-125` QE verdict: **PASS** at `ca3ca0f`

Hand-authored, no seal. This is a `decision`, not a `finding`, because no `§14-gate` verdict exists on this
install. Diff under review: `928c83b...ca3ca0f`. QE reproduced each criterion in its own worktree
(`grugops/qe-ABC-125`).

| | reading | result |
|---|---|---|
| `A1` | The row sits in the `ABC-086 A6` describe on the default lane, not behind `ENGINE_DEEP`. It asserts `toEqual([0,0,1,0.5,2,1])` and is green: 33/33 for the file, and green when run alone | **MET** |
| `A2` | QE re-planted `M5` itself: exit 1, this row red, received `[0,0,0.5,0.5,1,1]`. After the revert: exit 0. `src/` clean afterwards | **MET** |
| `A3` | `git diff --numstat 928c83b...ca3ca0f -- src tools package.json` = `8 0 src/engine.test.ts` only; `src/virtual-clock.ts` byte-identical. lint / typecheck / build exit 0; `npm test` exit 0, 49 files / 1531 passed / 0 skipped; `test-skip-integrity.js .grugops/test-skips.md --skip-count 0` reports `No findings.` | **MET** |

Focus results (detail in observation `…ed9e7ff5`):
1. `M5`, re-planted by QE: red. It is killed by the new row alone.
2. The opposite case, first-call-wins (`M5b`): red with the row run alone. The build's `UNKNOWN - verify` is
   closed.
3. QE's own mutants: `Q1` (shared reading counter, per-clock step), `Q2` (shared reading reset per
   factory) and `Q3` (step captured at first read): all red. `Q3` is killed by the new row only.
4. `toEqual` is exact, and safe for these dyadic steps. It would not be safe for 0.1-type steps (advisory).

**Gaps (advisory, none blocking):**
- **QE-125-a, LOW, advisory to `ABC-085`/`ABC-087`.** A non-dyadic step makes exact equality wrong
  (`0.1` → `0.30000000000000004` on the fourth read). Use dyadic steps or `toBeCloseTo`.
- **QE-125-b, LOW, shape not exercised.** The row builds both clocks before either is read. It never calls
  the factory between reads of a clock that is already live. QE found no natural mutant that survives this
  shape: `M5`, `M5b`, `Q1`–`Q3` all red. Recorded so the shape is not mistaken for proof of every ordering.
- **Not re-run by QE:** the `N8-LANE` paired timing. The row takes ≈ 0 ms and adds no new file, so QE accepts
  the build's −350 ms net. QE's full suite took 11.38 s wall while another engineer's tests shared the
  machine. The host check was not run.

UAT: the delivered diff has zero production lines, so the 2026-08-17 waiver applies if the merge keeps it so
(measured at merge, not here). The board move belongs to the Orchestrator. Not merged, not pushed.
