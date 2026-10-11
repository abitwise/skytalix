---
id: 20261011T124750Z-security-nfr-decision-abc144-window-b-grades-and-result-e451fa31
kind: decision
by: security-nfr
at: 2026-10-11T12:47:50Z
verified_by:
confidence: high
refs:
  - ABC-144
  - ADR-0040
  - ADR-0035
  - ADR-0017
  - NFR-008
  - N8-LANE
  - AR-N8SPAWN-DRIFT
  - ABC-111
  - .grugops/context/secnfr-ABC-144-window-b/notes/20261011T124750Z-security-nfr-observation-abc144-window-b-readings-bfdcf3b3.md
  - .grugops/context/secnfr-ABC-144-window-b/notes/20261011T124750Z-security-nfr-observation-abc144-window-b-heat-1ff56629.md
  - .grugops/context/secnfr-ABC-144-window-b/notes/20261011T124750Z-security-nfr-observation-abc144-window-b-method-and-limits-866dc5af.md
  - .grugops/context/secnfr-ABC-144-window-b/probe/readout.out.txt
supersedes:
---

# `ABC-144` Window B: `A1`–`A5` and `AR-N8SPAWN-DRIFT` graded. **Result: PASS_WITH_RISKS.** Every bar is met. Heat still reaches moderate at k = 3, and that question goes to the owner

This note is hand-authored and unsealed. It is graded against the page's bars as written, with
`ADR-0035` d1's states (MET / NOT MET / UNRESOLVED). The readings are in `…bfdcf3b3`. Base `5ed308a8`, head
`5ddf150e` (code `d4468fd3`), n = 8 per arm per state, 81 runs, 0 harness errors, width 1.

## Admissibility first

| set | twin T−B CPU median | sign (+) | twin CPU R | twin wall R | admissible |
|---|---|---|---|---|---|
| full lane, warm | −0.025 s (−0.09 % of B) | 3/8 | 0.280 s (0.99 % of B) | 0.180 s | **yes** |
| full lane, cooled | +0.170 s (+0.64 % of B) | 6/8 | 0.870 s (3.28 % of B) | 0.220 s | **yes** |
| `src/cli.test.ts`, narrow | −0.030 s (−0.51 % of B) | 3/8 | 0.070 s | 0.050 s | **yes** |

"Sign at chance" is read as k ≤ positives ≤ n − k, which is 2..6 at n = 8 and k = 2.

## The grades

| criterion | bar | reading | state |
|---|---|---|---|
| **`A1`** warm | H ≤ 0.85 × B CPU, resolved | paired **−16.05 %** (−4.550 s), interval [−16.96 %, −14.60 %], sign 0/8. Medians 24.01 / 28.35 s = **0.847**. Twin R 0.99 % ≪ 15 % | **MET, thin.** The median clears the bar by 1.05 points, but the interval's upper end (−14.60 %) is short of it |
| **`A1`** cooled (for the record) | same | paired **−15.85 %** (−4.200 s), interval [−16.57 %, −15.44 %], sign 0/8. Medians 22.26 / 26.49 s = **0.840** | **MET**: the whole interval is past −15 % |
| **`A2`** | ≤ 4 workers, fixed | `resolved-workers.mjs`: **H 3**, B 7, T 7 (QE read the same). CPU ÷ wall medians: warm B **4.258**, H **3.165** (T 4.239); cooled B **4.129**, H **3.147** (T 4.200) | **MET** |
| **`A3`** | H warm wall median ≤ W = 10 s | **7.54 s** (7.25–8.08). H load1 > 8 before 3 of 8 runs, so the clause counts | **MET**, by 2.46 s |
| **`A4`** warm | H median + twin wall R ≤ W | 7.54 + 0.180 = **7.72 s** | **MET** |
| **`A4`** cooled | H median + twin wall R ≤ W | 7.08 + 0.220 = **7.30 s** | **MET** |
| **`A5`** | the proposal with its readings | below | **delivered** |
| **`AR-N8SPAWN-DRIFT`** | `src/cli.test.ts` within `F` = 1.097 s of base | paired H−B **−0.255 s** (−4.29 %), interval [−0.320, −0.200], sign 0/8. Twin R 0.070 s ≤ `F`, so it resolves | **DISCHARGED for tree `5ddf150e`** (straddle note below) |

**The warm/cold choice cannot flip the verdict at this reading.** Both states are under W by more than 2.2 s.

### Wall cost of the cap (what "a bit" became)

- Paired H−B wall: **+0.86 s warm** (interval [+0.74, +0.95], 8/8), which is +12.9 % on B's 6.66 s.
  **+0.66 s cooled** ([+0.60, +0.94], 8/8), which is +10.3 % on B's 6.43 s.
- Window A's K3 read +0.95 s warm, which agrees.

### `AR-N8SPAWN-DRIFT`: the straddle, said beside the result

- The pair crosses `vitest.config.ts` (`ADR-0040` d5). Plan step B3 pre-registered exactly this pair.
- **What the cap does to this one-file set:** it runs on one worker under either config. Only `tinypool`'s
  idle boots differ (7 → 3). The pin adds one `it`, an in-process import: tests 67 → 68.
- **Net effect: H reads 0.255 s *lower*.** A child that grew could therefore hide behind the cap's saving,
  up to about `F` + 0.26..0.32 s ≈ **1.35–1.42 s**, and still read "within `F`". The drift `ADR-0017` names
  (+2.60 s from one child) is about 1.8–1.9x that, so this reading would still see it.
- **For context only:** B's 5.94 s is below both earlier base readings (`ABC-058` sets 1 and 2: 7.99 / 6.95 s,
  on other runtimes and load).
- A discharge on this tree does not close the risk for later trees (`ADR-0017` § Pointers 2026-10-11).

## `A5`: Security/NFR's proposal

- **`W_new`: none. W stays 10 s, ratio 1.00 of 10 s.** Head's wall rose about +0.7 to +0.9 s and stays
  2.46 s under W warm. The owner allowed "a bit". This change needs none of it above today's level. **The owner
  moves the level; this is a proposal only.**
- **Medians (n = 8 each; load1 is the median before each run):**

  | state | arm | CPU s | wall s | CPU ÷ wall | load1 | twin R (CPU / wall) |
  |---|---|---|---|---|---|---|
  | warm | B | 28.35 | 6.66 | 4.258 | 7.21 | 0.280 / 0.180 |
  | warm | H | 24.01 | 7.54 | 3.165 | 6.63 | 〃 |
  | warm | T | 28.48 | 6.68 | 4.239 | 5.82 | 〃 |
  | cooled | B | 26.49 | 6.43 | 4.129 | 2.55 | 0.870 / 0.220 |
  | cooled | H | 22.26 | 7.08 | 3.147 | 2.75 | 〃 |
  | cooled | T | 26.63 | 6.33 | 4.200 | 2.92 | 〃 |

- **Reference stack:** Apple M3 Mac15,13 / 8 cores (4 P + 4 E) / Darwin 25.5.0 / Node v26.11.0 / vitest
  3.2.7, on AC power.
- **Commit:** head `5ddf150ee3df3dd4e5a1009f50a3d794073e752c` (code `d4468fd3`), base
  `5ed308a835ef4f115f2b09c60e0c842cab9c6f4e`.
- **`A4` re-derivation:**
  - The cooled/warm wall factor at head is **f = 7.08 / 7.54 = 0.939**, so warm is the slower state (at base,
    f = 0.966).
  - W ÷ f = **10.65 s**, which is above W.
  - **Proposed wording for the `NFR-008` row** (replaces `ABC-111`'s "8.76 s"): *"Warm/cold re-open trigger
    (`ABC-144` `A4`, re-measured 2026-10-11 at `maxWorkers: 3`): at head, cooled ÷ warm wall = 0.939, so
    the warm reading is the binding one. Re-open the warm/cold question when a warm wall median reaches
    W = 10 s, or when a re-measured cooled ÷ warm factor f exceeds 1.0. Then the trigger is W ÷ f."*
  - The row is written by Security/NFR in a catalog hop after the owner's word, not here.
- **`AR-N8SPAWN-DRIFT`:** DISCHARGED for `5ddf150e`, as above.
- **`N8-LANE` re-derivation:** not triggered. No CPU level was set (owner question 2), so `N8-LANE` stays
  ≤ 650 ms as a fixed number.

## Security (ASVS L1)

**Not triggered.** The change is a test-runner option and a value pin. It has no input surface, no new
dependency, no network, no secret and no data path. No L1 requirement of the checklist applies. **No
security finding.**

## Result: **PASS_WITH_RISKS**. No required fixes

Nothing blocks (`security.block_on: high`; nothing here is high). These are the risks, each with an owner:

| id | risk | severity (reason) | owner |
|---|---|---|---|
| `RISK-ABC144-HEAT` | **Moderate thermal pressure persists at k = 3** under back-to-back full-lane runs: level 1 from the 21st run in the warm state, with H runs at level 1 like B and T (`…1ff56629`). The cap does not stop it. A head-only sequence was not run, so k = 3's own contribution is not separated. | medium (the owner's stated goal; no bar on the page) | **Olger Oeselg (owner)**: the k = 2 option, Orchestrator width, or `VITEST_MAX_THREADS=2` for hops |
| `RISK-ABC144-A1THIN` | `A1` warm is MET on its median, but the interval's upper end (−14.60 %) is short of −15 %. Any later CPU growth eats a 1.05-point margin. | low (the bar is met; this is a margin) | Security/NFR, re-read at the next lane reading (`ABC-150` `L1` reads on the merged base) |
| `RISK-ABC144-STALL` | One cooled head run took 12.04 s wall at normal CPU. It is the only run over W in 81. Cause `UNKNOWN - verify`. | low (1 of 24 H runs; no median moves) | Security/NFR, at the next cooled reading |
| `RISK-ABC144-FCAP` | The full-lane `F` under the cap is not re-read. Both twins are base copies at 7 workers. | low (`ADR-0040` d4 already routes it) | Architect/Design, from the first three readings after the merge |

**Recommendation to the Orchestrator** (the board is not touched here):
- the `In Security/NFR` exit;
- the UAT waiver applies on QE's reading (0 production `src/` lines);
- **no owner word is needed to merge**, because head's wall is ≤ 10 s (`A3`);
- **the heat question goes to the owner beside it.**
