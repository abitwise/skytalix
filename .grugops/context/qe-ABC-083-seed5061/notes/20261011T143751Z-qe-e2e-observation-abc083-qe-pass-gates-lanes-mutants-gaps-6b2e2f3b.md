---
id: 20261011T143751Z-qe-e2e-observation-abc083-qe-pass-gates-lanes-mutants-gaps-6b2e2f3b
kind: observation
by: qe-e2e
at: 2026-10-11T14:37:51Z
verified_by:
confidence: high
refs:
  - ABC-083
  - ABC-082
  - ABC-084
  - ADR-0028
  - ADR-0039
  - ADR-0031
  - NFR-001
  - src/evaluate.ts
  - src/evaluate.king-mobility.test.ts
  - src/evaluate.pawns.test.ts
  - .grugops/context/qe-ABC-083-seed5061/probe/lanes.txt
  - .grugops/context/qe-ABC-083-seed5061/probe/mutants-eval.tsv
  - .grugops/context/qe-ABC-083-seed5061/probe/mutants-all.tsv
  - .grugops/context/qe-ABC-083-seed5061/probe/scope.txt
  - .grugops/context/ticket-to-pr-ABC-083/notes/20261010T194248Z-software-engineer-observation-abc083-a10-repin-ledger-a8-mutants-fixture-bites-4a6d2c88.md
  - .grugops/context/ticket-to-pr-ABC-083/notes/20261010T194248Z-software-engineer-observation-abc083-a5-cost-three-forms-two-sessions-5b2e9f10.md
  - .grugops/context/secnfr-ABC-083-quiet-readings/notes/20261011T140910Z-security-nfr-decision-abc083-quiet-readings-d5-does-not-fire-n8lane-not-met-ar-proposed-8ff62fd0.md
supersedes:
---

# QE pass on `67c189b9`: gates green, every deep lane green, QE's 19 mutants (12 red on the criterion rows, 5 caught only by node pins elsewhere, 2 for `A8`). Five gaps, none blocking

This note is hand-authored and unsealed. It covers what no earlier hop reviewed as QE: `A1`–`A4`, `A6`,
`A8`, `A10`'s lanes on the merged tip, and the re-level conditions. Seed 5061 is in `…67b0c99a` and
`…b631991b`.

## Gates and lanes on the tip (`lanes.txt`; load1 2.4–4.2, thermal 0 throughout)

| step | result |
|---|---|
| `npm run lint` / `typecheck` / `build` | exit 0 / 0 / 0 |
| `npm test` | exit 0, 56 files, **1 739 passed**, 0 failed, 6 s |
| skip count / integrity | **0** / `No findings.` |
| evaluate files (`king-mobility`, `pawns`, `evaluate`) | 69/69 |
| `SEARCH_DEEP=1` search / quiescence / ordering / transposition | 57/57 (49 s) / 37/37 / **38/38** (148 s) / 40/40 |
| `ENGINE_DEEP=1` transposition / engine / levels | 26/26 / 46/46 (287 s) / 28/28 (203 s) |
| `ZOBRIST_DEEP=1` | 33/33 |
| `CLI_DEEP=1` real engine | 7/7 |
| `PUZZLE_DEEP=1` | **53/58, exit 1** (seed 5061; ×3 runs, `…67b0c99a`) |
| `PUZZLE_DEEP=weakened` | exit 1 by design, 15/58 (proof that the bar bites) |
| `SEARCH_DEEP=1` pvs-lmr | **not re-run** (926–1 117 s). Cited 29/29 at `79248602`. No engine-loadable file changed since (`scope.txt`) |

- **Rows 14 and 15 at the re-levelled bars are green on the tip:** quiescence deep 37/37, ordering deep
  38/38. `ADR-0039` decision 3's conditions were recorded in `547b5155` (mutant 572.57x > 42x).
  Security/NFR read `A9`, so `ADR-0031` decision 5 does not fire, and the re-level stands.
- **The UAT waiver does NOT apply:** `src/evaluate.ts` is a production line (`scope.txt`). The owner's UAT
  word is owed.

## QE's own mutants (`mutants.sh`, one perl substitution each on a `git archive` copy of the tip)

| mutant | evaluate files (criterion rows) | whole default lane |
|---|---|---|
| K1 shelter penalty sign flipped | **red**: `A2` equal-material row | — |
| K2 king's own file only (no ±1) | **red**: `A3` equal-material row | — |
| K3 half-open file free | **red**: `A3` equal-material row | — |
| K4 black king's forward step wrong | **red**: `A1` ×3 files, ABC-076 `A2`, `A4` | — |
| K8 king safety off | **red**: `A2`, `A3` equal-material rows | — |
| M1 mobility clamp removed | **red**: `A4` bound | — |
| M2 mobility counted for white only | **red**: `A1` ×3 files, ABC-076 `A2` | — |
| M3 mobility sign flipped | **red**: `A4` ordering and bound | — |
| M6 mobility off | **red**: `A4` ordering and rig | — |
| M7 cap 200 | **red**: `A4` bound | — |
| P1 `evaluate` leaves the board changed | **red**: `A6` ×2 files, ABC-076 `A5` ×6 | — |
| D1 test-only door keeps mobility | **red**: `A4` ×2 | — |
| E8 isolation reads the right-hand file only | **red, exit 1: both `A8` rows** | — |
| E9 isolation reads the left-hand file only | **red, exit 1: both `A8` rows** | — |
| K5 a/h-file king: edge clamp removed | survives | red only on class-P node pins (ordering, pvs-lmr, transposition) |
| K6 shelter reads rank 1 only, not rank 2 | survives | red only on class-P node pins (engine, ordering, transposition) |
| K7 file scan reads ranks 3–6 only | survives | red only on class-P node pins |
| M4 mobility counts own-occupied squares | survives | red only on class-P node pins |
| M5 sliders do not count the capture square | survives | red only on class-P node pins |

## Criteria, as QE reads them on the tip

| criterion | QE reading |
|---|---|
| `A1` symmetry, ≥ 15 new positions | **MET.** 20 new positions, exact equality. K4 and M2 are red |
| `A2` shelter | **MET.** The literal row plus an equal-material twin. K1 and K8 are red |
| `A3` half-open file | **MET.** The literal row plus an equal-material twin. K2, K3 and K8 are red |
| `A4` mobility ordering, ±100 cp | **MET.** M1, M3, M6, M7 and D1 are red |
| `A5` ≤ 1 100 ns | **MET, cited** (`…5b2e9f10`: 775.8 ns over two sessions, 636 ns at `79248602`, Apple M3, Node v26.11.0). `src/evaluate.ts` is unchanged since. QE took no timing |
| `A6` purity | **MET.** P1 is red in three files |
| `A7` / `A9` | **MET**, Security/NFR (`…8ff62fd0`) |
| `A8` | **MET.** QE planted E8 and E9 itself: each exits 1 with both rows red, on the default lane, not on node pins |
| `A10` ledger rows | **MET on the tip.** Every deep lane is green, and rows 14 and 15 are green at the owner's levels |
| `A10` puzzle gate | **NOT MET.** 53/58, class L, route in `…b631991b` |
| `NFR-001` | **MET.** `src/evaluate.ts` imports only `./position.ts`, so it makes 0 generator calls per leaf. `gameend.nfr.test.ts` is green in `npm test` |

## Gap register (none is a criterion, so none blocks)

- **QE-083-a (LOW).** King safety's design details beyond `A2`/`A3` are pinned only by class-P node counts
  elsewhere: the edge clamp, the second shelter rank and the file-scan range (K5, K6, K7). Those pins move
  with every evaluator change, so they are re-pinned rather than read. The next evaluator ticket could
  break these details and re-pin over the break. Hand-scored rows would close this: for example, an
  a-file king's exposure read over two files, not three, and a g3 pawn sheltering a g1 king.
  Proposed as a follow-up, not owed here.
- **QE-083-b (LOW).** The same applies to the mobility count's details (M4 own-occupied squares, M5 the
  capture square). `A4` deliberately asserts relations, not totals (test note 4), so this is by design.
  Recorded so the next hop does not mistake node-pin reds for coverage.
- **QE-083-c (INFO, for Architect/Design).** Seed 5061's cause is an LMR near-tie at d5 that already
  exists on base, not an evaluator margin. The 0.8x margin rule does not see that kind of fragility
  (`…b631991b`, last section).
- **QE-083-d (INFO).** Seven solved puzzle rows read shallower on the branch, two read deeper, and 20
  changed move but stayed solved. This is the per-row view of `A9`'s +39 % position-6 tree. It is not red.
- **QE-083-e (INFO).** QE did not re-run the pvs-lmr deep lane or `A5`'s timing. Both were cited with the
  reason (`scope.txt`).
