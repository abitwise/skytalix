---
id: 20261010T103438Z-qe-e2e-observation-abc119-a2-closers-admissible-twice-cpu-straddles-e28c062a
kind: observation
by: qe-e2e
at: 2026-10-10T10:34:38Z
verified_by:
confidence: high
refs:
  - ABC-119
  - A2
  - N8-LANE
  - NFR-008
  - ADR-0019
  - ABC-130
  - ABC-118
  - QE-119-a
  - plans/nfr-catalog.md
  - tools/grugops/lane-inventory.js
  - .grugops/context/rule-abc119-a2/notes/20261010T100852Z-ba-pm-decision-9f278676.md
  - .grugops/context/qe-ABC-119/probe/a2i-inventory.txt
  - .grugops/context/qe-ABC-119/probe/a2ii-preregistration.txt
  - .grugops/context/qe-ABC-119/probe/a2ii-setA-runs.txt
  - .grugops/context/qe-ABC-119/probe/a2ii-setA-analysis.txt
  - .grugops/context/qe-ABC-119/probe/a2ii-setB-runs.txt
  - .grugops/context/qe-ABC-119/probe/a2ii-setB-analysis.txt
  - .grugops/context/qe-ABC-119/probe/a2ii-dispersion.txt
  - .grugops/context/qe-ABC-119/probe/harness-paired3.sh.txt
  - .grugops/context/qe-ABC-119/probe/harness-analyse.js.txt
supersedes:
---

# `ABC-119` `A2`: the three closers BA/PM listed. (1) and (2) are met cleanly. (3) is ADMISSIBLE in both sets, but the two sets put the CPU median on opposite sides of 0.30 s

Hand-authored, no seal. `<base>` = `git merge-base grugops/wave-2026-09-25 a6453bc` = `242b624`. Raw files are under
`.grugops/context/qe-ABC-119/probe/`. Machine: Apple M3, 8 cores, node 26.11.0, vitest 3.2.7.

## Closer 1: the default lane with `CLI_DEEP` unset

- `env -u CLI_DEEP npm test` (worktree, `a6453bc`, load1 15.3): exit 0, **51 files / 1541 tests**.
- The `[CLI_DEEP]` line count is **0**. It is also 0 in every one of the 66 harness runs below, all exit 0.
- `npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'` = **0**.
- `test-skip-integrity.js … --skip-count 0` printed `No findings.`, exit 0.
- **Spawned children: 0.** The only `spawnSync` is reached from a `beforeAll` inside `if (RUN_DEEP)`, so it is undefined when the variable is unset. That is by construction, and the observed line count of 0 agrees.

## Closer 2: the `lane-inventory.js` delta

The trees are real `git clone`s outside the repository, checked out detached, with `node_modules` symlinked. load1 was 21.0.

| tree | collected / tracked | findings | exit |
|---|---|---|---|
| `<base>` `242b624` | 50 / 53 | three tracked `.grugops/context/` probes (`cut-harder-puzzles`, `fold-abc084-gate-b`, `ruling-abc079-oracle`) | 1 |
| `HEAD` `a6453bc` | **51 / 54** | **the same three, and no others** | 1 |
| worktree at `a6453bc` | 51 / 54 | the same three | 1 |

- `comm -13 base head` on the sorted finding lines prints **nothing**, so no `HEAD` finding is new.
- The counts are **+1 / +1**.
- `src/cli.real-engine.test.ts` is in no finding. It appears in `vitest list` and in `git ls-files`.
- **Met as ruled.** The literal "exits 0" waits on `ABC-130`.
- QE's own probe outputs are named `*.txt`, never `*.test.ts`, so this hop adds no fourth finding.

## Closer 3: the three-tree null-twin harness. ADMISSIBILITY FIRST

**Trees.** `git archive 242b624` was extracted twice (`base`, `twin`) and `git archive a6453bc` once (`head`), all in
the session scratchpad, with `node_modules` symlinked.
- `diff -r base twin` (excluding `node_modules`) gave rc 0.
- A per-file `cmp` over all 4011 files found no difference.
- Under `src/`, `base` and `head` differ only by the new file.

**Runner (stated).** `env -u CLI_DEEP /usr/bin/time -p node node_modules/vitest/vitest.mjs run --dir src`. CPU is user + sys.
- One fresh process per run.
- Round 0 is discarded.
- The order is rotated every round: `base head twin`, then `head twin base`, then `twin base head`.
- load1 is logged before and after every run.

**Pre-registered** before set B ran (`a2ii-preregistration.txt`): set A is the closing reading, and set B is a replication
that is reported separately and never pooled.

| | set A (closing) | set B (replication) |
|---|---|---|
| scored rounds | 10 | 10 |
| load1 over scored runs | 12.5–31.5 | 22.5–35.9 |
| base median CPU / wall | 33.87 s / 9.82 s | 33.02 s / 9.50 s |
| **twin − base CPU** | **−0.110 s = −0.32 %**, sign 5+/5−, p = 1.00 | **−0.065 s = −0.20 %**, sign 5+/5−, p = 1.00 |
| **admissible?** (≤ 1.5 % and sign at chance) | **YES** | **YES** |
| **HEAD − base CPU** (≤ 0.30 s) | **−0.715 s** (−2.11 %), sign 3+/7−, p = 0.34: **within** | **+0.725 s** (+2.20 %), sign 7+/2−, p = 0.18: **OVER, 2.4x** |
| **HEAD − base wall** (≤ 0.30 s) | **+0.035 s**, sign 5+/5−: **within** | **+0.035 s**, sign 7+/3−: **within** |
| `N8-LANE` net of 160 ms (≤ 650 ms) | **−875 ms** | **+565 ms** |

**Reading.**
- `A2`(ii) is **met on the closing set**, as the rule is written.
- **QE does not claim it is robust**: the replication is equally admissible and reads 2.4x over on CPU.
- This is the page's `ABC-114` `A3` discipline. QE's numbers are recorded, and they disagree with each other and with the earlier readings (cut +0.06 s, Engineer pooled +0.115 s).
- **Pooling is not the reading.** For information only: the 20 HEAD−base CPU deltas have a median of +0.125 s, and the 20 twin deltas a median of −0.11 s.

**Why the bound is unresolvable here (QE-119-a).** The supplementary statistics are in `a2ii-dispersion.txt`, with a seeded
bootstrap of 10,000 resamples.

| | twin − base | HEAD − base |
|---|---|---|
| set A | IQR −0.92..+0.72 s, range −2.44..+3.31 s, **95 % CI of median −0.99..+1.57 s** | IQR −1.06..+0.11 s, CI −1.13..+0.26 s |
| set B | IQR −0.51..+0.29 s, range −2.28..+2.91 s, **95 % CI of median −0.59..+0.92 s** | IQR +0.10..+1.87 s, CI −0.22..+1.96 s |

The admissibility rule checks the twin's **median**, and the median of a symmetric noise distribution sits near 0 whatever its
width. 1.5 % of a ~33 s base is **0.50 s**, which is wider than the 0.30 s bound it admits. On this machine at load1 12–36, an
identity null's median alone can land past 0.30 s.
- **What it still resolves:** the `AR-N8SPAWN-DRIFT` failure mode (the guard removed, about +3.1 s per child) by about 90x on wall in both sets.
- **What it does not resolve:** a one-file CPU charge against a 0.30 s bound.
- Two sets were run, which is the `self_fix_attempts` budget. A third set at this load would sample the same spread.
- **No set was inadmissible**, so the hand-up rule did not fire. The disagreement is routed in the gap register.
