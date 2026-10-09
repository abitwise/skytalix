---
id: 20261009T174408Z-qe-e2e-observation-abc082-gates-and-seven-deep-lanes-oracle-e81c6a95
kind: observation
by: qe-e2e
at: 2026-10-09T17:44:08Z
verified_by:
confidence: high
refs:
  - ABC-082
  - ABC-079
  - ABC-081
  - ABC-121
  - ADR-0028
  - src/quiescence.test.ts
  - src/transposition.test.ts
  - src/search.test.ts
  - src/search.ordering.test.ts
  - src/search.pvs-lmr.test.ts
  - src/engine.test.ts
  - .grugops/context/qe-ABC-082/probe/lanes.sh
  - .grugops/context/qe-ABC-082/probe/lanes.out.txt
  - .grugops/context/qe-ABC-082/probe/oracle.ts
supersedes:
---

# Gate and all seven `A8` deep lanes re-run at `873911d`, one at a time, load recorded: all green. Row 17 red without the tip (reproduced). Row 7's oracle re-run: equal on both boards

Hand-authored, no `seal`. Worktree `.claude/worktrees/qe-ABC-082` at `873911d` (branch
`grugops/qe-ABC-082`, `node_modules` symlinked). Apple M3, Node v26.11.0. Security/NFR was
measuring on the same machine in parallel; load1 is recorded at each lane's start and end.

## Gate (2026-10-09T17:01:39Z, load1 2.70)

| check | result |
|---|---|
| `npm run lint` | exit 0, 94 files, no fixes |
| `npm run typecheck` | exit 0 |
| `npm run build` | exit 0 |
| `npm test` | exit 0, **49 files, 1504 passed**, 6.03 s |
| skip count (`--reporter=json` + `jq`) | 0 |
| `test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | `No findings.`, exit 0 |
| `host-protection.js` | exit 2, `UNKNOWN - verify` (no git remote; production env not checked by design) |

## Deep lanes (`bash probe/lanes.sh …`, sequential; raw `probe/lanes.out.txt`)

| lane | start (UTC) | result | wall | load1 start → end |
|---|---|---|---:|---|
| `SEARCH_DEEP` `quiescence` | 17:12:00 | **37 / 37**, A1 depth 3 0/24 both arms | 3 s | 3.42 → 3.87 |
| `SEARCH_DEEP` `transposition` | 17:12:03 | **40 / 40**; A2 kiwipete 15.63% (ID 40.54%), position-6 14.46% (ID 44.98%); A3 60.60% / 47.97% | 52 s | 3.87 → 2.92 |
| `SEARCH_DEEP` `transposition` `-t A2` at **`720b92d`** (no tip) | 17:12:55 | **exit 1**: position-6 `0.144617… ≥ 0.15` red; 2 passed | 13 s | 2.92 → 5.12 |
| `ENGINE_DEEP` `transposition` | 17:13:08 | **26 / 26** | 5 s | 5.12 → 4.79 |
| `SEARCH_DEEP` `search` | 17:13:13 | **57 / 57** | 43 s | 4.79 → 3.92 |
| `SEARCH_DEEP` `search.ordering` | 17:13:56 | **38 / 38** | 130 s | 3.92 → 3.98 |
| `ENGINE_DEEP` `engine` (wall-clock cases included) | 17:16:06 | **33 / 33** | 124 s | 3.98 → 4.37 |
| `SEARCH_DEEP` `search.pvs-lmr` | 17:23:52 | **29 / 29**; both drift rows green (≥ 95% within 25 cp, none beyond 75 cp; the exact percentages were not captured by the runner's filter: `UNKNOWN - verify`); A4 rows green | 1 091 s | **16.88** → 3.00 |

- All seven `A8` lanes green on the tip. The `search.pvs-lmr` lane started under load1 16.88.
  QE ran nothing else at that moment, so the load was another process's (likely Security/NFR's
  parallel measurements: `UNKNOWN - verify`). Its rows are node-deterministic, so load moves the
  wall time, not the result. Conversely, QE's lanes (17:12–17:42Z) may have loaded any
  Security/NFR wall-clock reading taken in that window. `ENGINE_DEEP` `engine`'s wall-clock cases passed at
  load1 3.98–4.37.

## Row 7: the in-file re-pin rule, re-run (`node probe/oracle.ts <tip-tree> <name>`, plain node)

| board | `searchWithoutPruning(p, 3)` (oracle) | `searchWithoutPvsOrReductions` | `search()` | pinned |
|---|---|---|---|---|
| position-6 (17:18:10Z, load1 4.37) | **55 / c3d5**, 11 799 948 nodes, 37.7 s | 55 / c3d5 | 55 / c3d5 | 55 / c3d5 |
| kiwipete (17:18:48Z, load1 3.58) | **55 / e2a6**, 76 949 007 nodes, 304.7 s | 55 / e2a6 | 55 / e2a6 | 55 / e2a6 |

Equal on score and move on both boards, so the re-pin satisfies the rule written at
`src/quiescence.test.ts`'s `ORACLE_AT_DEPTH_3`. Oracle node counts equal the Engineer's to the node.
