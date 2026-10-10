---
id: 20261010T194248Z-software-engineer-claim-abc083-built-stopped-two-r-reds-puzzle-red-2f9b6e14
kind: claim
by: software-engineer
at: 2026-10-10T20:13:21Z
verified_by:
confidence: high
refs:
  - ABC-083
  - grugops/ABC-083-king-safety-mobility
  - 79248602
  - .grugops/context/ticket-to-pr-ABC-083/notes/20261010T194248Z-software-engineer-decision-abc083-term-shape-attack-map-mobility-door-c7a1e4d2.md
  - .grugops/context/ticket-to-pr-ABC-083/notes/20261010T194248Z-software-engineer-observation-abc083-a5-cost-three-forms-two-sessions-5b2e9f10.md
  - .grugops/context/ticket-to-pr-ABC-083/notes/20261010T194248Z-software-engineer-observation-abc083-a7-a9-depth-and-nodes-to-depth-7-9d4c3a61.md
  - .grugops/context/ticket-to-pr-ABC-083/notes/20261010T194248Z-software-engineer-observation-abc083-a10-repin-ledger-a8-mutants-fixture-bites-4a6d2c88.md
  - .grugops/context/ticket-to-pr-ABC-083/notes/20261010T194248Z-software-engineer-observation-abc083-stop-two-class-r-levels-and-puzzle-red-e3f81b07.md
  - .grugops/context/ticket-to-pr-ABC-083/notes/20261010T194248Z-software-engineer-observation-abc083-cost-adr0035-clause-b-numstat-81f0d5aa.md
supersedes:
---

# `ABC-083` built at `79248602`. `A1`–`A6` and `A8` met; `A7`/`A9` met on 17 of 18 runs. **`A10` NOT met: two class-R reds and a `PUZZLE_DEEP` red.** Result `BLOCKED_NEEDS_FIX`

This is a claim, not a finding: no `§14-gate` verdict exists on this install. Not merged, not pushed.

## Premise (re-verified at `489c549e` before work)

`ABC-076`, `ABC-078`, `ABC-082`, `ABC-084`, `ABC-126`, `ABC-131` and `ABC-010` are merged. The
puzzle baseline is 54/58. Node is v26.11.0 on an Apple M3. **The premise holds.**

## Criteria

| criterion | state | evidence |
|---|---|---|
| `A1` | MET | 184 + 20 new positions, exact mirror. Sign mutants red |
| `A2` | MET | literal row + equal-material row (g6), red without the term; `noShelter` red |
| `A3` | MET | literal row + equal-material row (e5/f5), red without the term; `noFileTerm` red |
| `A4` | MET | white has ≥ 10 more legal moves, the non-mobility part is 0, and evaluate > 0; 4-queen rig at 100. `noMobility` and `noClamp` red |
| `A5` | MET | 775.8 ns verdict (two sessions); 636 ns at the tip (`…5b2e9f10`) |
| `A6` | MET | byte-identical over 184 + 20 + the perft roots (and `cost.mjs` asserts it in every timing) |
| `A7` | MET on 17 of 18 runs | one position-6 depth 6 in a load spike; margin ~1.05x (`…9d4c3a61`) |
| `A8` | MET | E8 and E9 each exit 1 with both rows red (`…4a6d2c88`) |
| `A9` | readings carried | nodes to depth 7: kiwipete 610 179 → 566 233; position-6 462 871 → 644 469. No depth < 6 |
| `A10` | **NOT MET** | rows 14 and 15 red (R); `PUZZLE_DEEP` 53/58 < 54/58 (`…e3f81b07`) |

## Gate at `79248602`

| check | result |
|---|---|
| `npm run lint` | exit 0, 101 files |
| `npm run typecheck` / `npm run build` | exit 0 / exit 0 |
| `npm test` | **53 files, 1 673 passed, 1 failed** (row 15, class R), Duration 6.02 s |
| skip count, then `test-skip-integrity.js` | 0, then `No findings.` |

## Deep lanes at `79248602` (`probe/deep-lanes-79248602.txt`; load1 2.9–5.5)

| lane | result | wall |
|---|---|---|
| `SEARCH_DEEP` search.ordering | 37 / 38. Red: row 15. `A3` d4 1.82% / 2.48% (≤ 4%); delete rule held | 146 s |
| `SEARCH_DEEP` quiescence | 36 / 37. Red: row 14 | 3 s |
| `SEARCH_DEEP` transposition | 40 / 40. `A2` 15.69% / 13.10% (≥ 10%); `A3` 57.61% / 55.21% | 59 s |
| `ENGINE_DEEP` transposition | 26 / 26 | 5 s |
| `SEARCH_DEEP` search | 57 / 57 | 51 s |
| `ENGINE_DEEP` engine | 46 / 46 | 287 s |
| `SEARCH_DEEP` search.pvs-lmr | 29 / 29. Drift 97.33% / 97.86% within 25 cp, max 51 cp; mate floor 0 / 180 | 1 117 s |
| `PUZZLE_DEEP` puzzle-suite | **53 / 58, exit 1** (seed 5061) | 29 s |

## Terminal result

**`BLOCKED_NEEDS_FIX`.** The stop conditions are `A10`'s "R red = stop" and `ADR-0028` decision 4. No
self-fix attempt was spent: these are rulings, not agent-fixable failures. No level, weight or bar was
moved, and the baseline file is untouched.

**Routes:**
- **Architect/Design:** rows 14/15. A defect ruling, or the owner's re-level. King safety alone is
  green on both, but `ADR-0031` does not license that cut for an R red.
- **QE:** classify seed 5061 under `ADR-0034` (it reads L).
- **Security/NFR:** the position-6 depth-7 margin, and `N8-LANE` NOT MET (+1.08 s).
- **The owner:** the UAT word (a production file).
