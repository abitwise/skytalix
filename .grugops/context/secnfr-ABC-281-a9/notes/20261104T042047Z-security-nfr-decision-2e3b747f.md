---
id: 20261104T042047Z-security-nfr-decision-2e3b747f
kind: decision
by: security-nfr
at: 2026-11-04T04:20:47Z
verified_by: 
confidence: high: ruled on the observation above; no level, bar, test or config moved; R-281-a run frequency stays UNKNOWN - verify
refs:
  - secnfr-ABC-281-a9
  - ABC-281
  - EPIC-011
  - NFR-008
  - R-N8H-1
  - R-N8H-2
  - R-N8H-3
  - R-281-a
  - Q-N8H-1
  - ADR-0035
  - ADR-0046
  - T-QEHOP-GROWTH
  - ABC-244
  - ABC-197
  - ABC-178
  - src/search.null-move.test.ts
  - src/engine.test.ts
  - src/levels.test.ts
  - plans/nfr-catalog.md
  - AGENTS.md
  - qe-ABC-281/20261104T041512Z-qe-e2e-observation-c7e298cd
  - qe-ABC-281/20261104T041512Z-qe-e2e-decision-960d38ff
  - qe-ABC-281/20261104T041512Z-qe-e2e-observation-f577312b
  - qe-ABC-281/20261104T035245Z-qe-e2e-decision-b3d88219
  - secnfr-nfr008-headroom/20261104T025651Z-security-nfr-decision-8a4fb936
  - secnfr-nfr008-headroom/20261104T025651Z-security-nfr-observation-f925027f
  - ea08d7b6
  - 748d4fa3
  - 983d16c3
  - ebd1263f
supersedes: 
seal: sha256:09a5d1fef01ee9367ebc2fc02740152474d5ce015df85a059699feb5ddbb38a3
---

# Security/NFR decision, secnfr-ABC-281-a9 (`ABC-281` A9): **PASS_WITH_RISKS.** `R-N8H-1` is **carried and downgraded, MEDIUM → LOW**: its condition is discharged on the graded median but has only a 0.08–0.28 s margin. `R-N8H-2` and `R-N8H-3` are unchanged. `R-281-a` is carried at LOW; Architect/Design owns the deep-lane run-frequency rule it lacks. `Q-N8H-1` stays held

Ruled on the observation "the risk states on QE's graded A8" (this task), which rests on `qe-ABC-281` `…c7e298cd` and `…960d38ff`. Nothing was run here. No §14 stamp exists on this install, so nothing here is a `finding`. Every item is a risk at observation grade with a named owner.

## Security review (ASVS L1, `block_on: high`)
- **No security surface is touched.** The delivered diff is five paths: three `*.test.ts` files, `AGENTS.md` and the command log. There are 0 production `src/` lines (QE A1).
- There is no input, auth, session, data, secret, file, config or logging path. No L1 requirement in V1–V17 applies.
- No risk is HIGH, so nothing blocks.

## `NFR-008`
- **MET, graded, at 9.42 s** [9.33, 9.51] on `ea08d7b6` (QE A8, `ADR-0035` D1).
- It holds for `main` `ebd1263f`: the lane-input diff from `ea08d7b6` is empty.
- No level, bar, W, F, cap or flag moved.

## Risks
| id | was | now | owner | why |
| --- | --- | --- | --- | --- |
| **`R-N8H-1`** | MEDIUM, open | **LOW, carried** | **Orchestrator** (the `NFR-008` watch); remedy **Architect/Design** (floor account) | Headroom is 0.58 s on the median, above the 0.3–0.5 s spread, so the MEDIUM condition is discharged. It is not closed. The margin over the spread is 0.08–0.28 s. The lane grew about 0.5 s in the five days before this cut. Two A8 single runs read ≥ 9.6 s. |
| `R-N8H-2` | LOW | LOW, unchanged | Architect/Design (`T-QEHOP-GROWTH`) | 5 087 note files, 413 short of 5 500 |
| `R-N8H-3` | INFO | INFO, unchanged | BA/PM, at each cut | Applied at `ABC-281` (no new file) |
| **`R-281-a`** | LOW | **LOW, carried** | **Architect/Design** (the residual, and the run-frequency rule) | The breadth runs only under `SEARCH_DEEP` / `ENGINE_DEEP`. How often those lanes run is `UNKNOWN - verify`, and no written rule says. |

### `R-N8H-1`: what moves it
- **Back to MEDIUM:** any ALONE or graded reading of `main` with a median ≥ 9.5 s, where headroom is at or under the top of the spread. **The Orchestrator** routes it.
- **≥ 9.6 s** stays `Q-N8H-1`'s trigger, also the Orchestrator's.
- **Closed:** by a graded reading with a median ≤ 9.0 s, where headroom is at least twice the top of the spread. Headroom was about 1 s at `ABC-178` and `ABC-197`, when no such risk was carried.
- **Until then:** every merge that changes a lane input (`src`, `tools`, `package.json`, `package-lock.json`, `vitest.config.ts`, `tsconfig.json`) spends the 0.58 s on an estimate until the lane is read again. This is the same rule the catalog states at `ABC-197`.

### `R-281-a`: who owns how often the deep lanes run
- **Architect/Design** owns the rule. In the kit, test strategy is the Architect's output. In this repo's catalog, Architect/Design owns the lane protocol, and QE `…960d38ff` already names them owner of this residual.
- Once the rule exists, the **Orchestrator** schedules the runs it requires, and **QE/E2E** runs them and records the readings.
- **A shape to consider, not a rule:** a ticket whose diff touches null-move search, the prior-keys doors or the level's draw order runs the matching file's deep lane at its QE hop. Several QE hops already do this (`ABC-281`'s own A4 did).
- **Not escalated.** A6 measured no unique kill in the deep-only breadth, so the gap is unmeasured breadth, not a known escape.

## `Q-N8H-1`
**Held by the Orchestrator, not asked.** The trigger is a median ≥ 9.6 s, and the reading is 9.42 s. The recommendation is still (a): keep the 10 s level and keep moving heavy rows to deep lanes as they appear.

## Records
- `plans/nfr-catalog.md`: one dated insertion in the `NFR-008` row (the latest verdict and `R-N8H-1`'s state), and one `_Updated` line. No other row is touched.
- The `ABC-281` page: a dated line under A9.
