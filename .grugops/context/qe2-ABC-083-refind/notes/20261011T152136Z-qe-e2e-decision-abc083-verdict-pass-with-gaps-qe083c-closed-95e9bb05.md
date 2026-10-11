---
id: 20261011T152136Z-qe-e2e-decision-abc083-verdict-pass-with-gaps-qe083c-closed-95e9bb05
kind: decision
by: qe-e2e
at: 2026-10-11T15:21:36Z
verified_by:
confidence: high
refs:
  - ABC-083
  - ADR-0028
  - ADR-0034
  - QE-083-a
  - QE-083-b
  - QE-083-c
  - QE-083-d
  - QE-083-e
  - AR-N8LANE-083
  - AR-NFR005-083
  - b29c837c
  - 35f49bb7
  - .grugops/context/qe2-ABC-083-refind/notes/20261011T152136Z-qe-e2e-observation-abc083-refind-5147-readings-54of58-weakened-exit1-levels-green-ee53fec8.md
  - .grugops/context/qe2-ABC-083-refind/notes/20261011T152136Z-qe-e2e-observation-abc083-refind-bar-reread-proofs-conditions-clean-lead-thin-rows-d1c74ad2.md
  - .grugops/context/qe-ABC-083-seed5061/notes/20261011T143751Z-qe-e2e-decision-abc083-verdict-fail-one-route-l-refind-56016fe2.md
  - .grugops/context/qe-ABC-083-seed5061/notes/20261011T143751Z-qe-e2e-observation-abc083-qe-pass-gates-lanes-mutants-gaps-6b2e2f3b.md
  - .grugops/context/design-ABC-083-refind-5061/notes/20261011T150610Z-architect-design-decision-abc083-adr0034-addendum-proposed-clean-lead-bar-d95b51f2.md
supersedes: 20261011T143751Z-qe-e2e-decision-abc083-verdict-fail-one-route-l-refind-56016fe2
---

# QE `ABC-083` at `35f49bb7`: **PASS_WITH_GAPS.** `A10`'s puzzle gate is now MET (54/58 on both trees, `=weakened` exit 1). QE-083-c is closed by the screen. Gaps: 2 LOW (unchanged), INFO only otherwise

This note is hand-authored and unsealed. AGENTS.md says no `finding` is admissible on this install. It
supersedes QE's FAIL (`…56016fe2`) on its one failing item. Everything that note found MET stays MET: the
re-find commit touches test data only, and no engine-loadable file changed (`…ee53fec8`).

## Verdict

**PASS_WITH_GAPS.**
- **`A10` puzzle gate: MET.** `PUZZLE_DEEP=1` 54/58 exit 0 on the branch and on base, 2 + 2 runs, per-row
  lines identical, no other row changed solved state. `PUZZLE_DEEP=weakened` 15/58 exit 1.
- **The re-find is valid on every condition QE's route named (`…d1c74ad2`).** These are `ADR-0028` d1's three
  proofs, `ADR-0034` d4's four conditions, and the ruled clean-lead bar: 270 cp minimum against > 75 at
  d4/d5/d6 on both trees.
- **`A10` ledger rows: MET.** The one deep lane the re-find feeds (`ENGINE_DEEP` levels, `A4` over perft +
  puzzles) is green, 28/28.
- **`A1`–`A9`: MET** as recorded in `…6b2e2f3b` and `…56016fe2`, unchanged.
- **Gates green:** `npm test` 1 739/1 739, skip 0, integrity `No findings.`, lint and typecheck exit 0.

## Gap register

| id | sev | state | what |
|---|---|---|---|
| QE-083-a | LOW | open, unchanged | King safety's edge clamp, second shelter rank and file-scan range are pinned only by class-P node counts (K5–K7 survive the criterion rows). Follow-up, not owed here |
| QE-083-b | LOW | open, unchanged | Mobility's own-occupied and capture-square details, same shape (M4, M5). By design (`A4` asserts relations) |
| QE-083-c | INFO | **CLOSED** | Answered by the Architect's screen (`…3777f413`). It covers every `win-material` row, names seeds 1700 and 5180, and proposes the clean-lead bar as standing (`ADR-0034` addendum, `…d95b51f2`). The residual is QE2-083-a |
| QE-083-d | INFO | open, unchanged | Per-row depth shifts base → branch (the per-row view of `A9`'s growth). 5147 reads d5 on both trees |
| QE-083-e | INFO | open, unchanged | pvs-lmr deep lane and `A5` timing cited, not re-run. The re-find touches no engine-loadable file, so the citations stand |
| QE2-083-a | INFO | new, for Architect/Design and the owner's addendum word | At d ± 1, seed 1700 is a **10 cp (base) / 18 cp (branch)** near-tie at d − 1, and 39 cp at d + 1 on the branch. Seed 5180 is 76–79 cp at all three depths on the branch. The addendum names both rows with d-only figures (75/75, 120/77), and should carry the ± 1 figures when the owner rules it. Other retained rows were read at d only. Mate and do-not-hang rows were not screened. Both rows are solved on every tree and rung, so this is not a gap of `ABC-083` |
| QE2-083-b | INFO | new | Seed 1700's `quiescence` tag no longer reads on the branch: `W1` solves it (`g6h6` d5), and misses it on base. Tags are not asserted. `ABC-127` `A1` stays green |
| QE2-083-c | INFO | new, process, for Architect/Design | A corpus re-find changes the input of the `ENGINE_DEEP` levels lane (`src/levels.test.ts` `A4` reads every `PUZZLES` FEN). The re-find hop's scope check ("no production importer") did not cover that lane. QE ran it, green. If the addendum becomes standing, its d4 list could name "re-run the lanes that load `PUZZLES`". That is Architect/Design's word |
| QE2-083-d | INFO | new, for the AGENTS.md Scribe after merge | `ENGINE_DEEP` levels `A3` reads easiest **31**/58 on the branch, against 35/58 on `main`. The −4 comes from the evaluator, not the re-find (base + 5147: 35; branch before the re-find: 31). `A3` asserts only `easiest < default`, which holds. AGENTS.md's levels-lane comment ("A3 (35 vs 54 of 58)") goes stale when this merges |

## Still owed outside QE (unchanged by this hop)

- The owner's word on `AR-N8LANE-083` and `AR-NFR005-083`, both LOW and proposed by Security/NFR.
- The owner's UAT word. `src/evaluate.ts` is a production line, so the waiver does not apply (`scope.txt`).
- The owner's acceptance of the `ADR-0034` addendum. It does not block this ticket (`…d95b51f2`).

## Board

QE does not edit `plans/board.md` in this hop (fence). On QE's reading, QE no longer holds `ABC-083`. Its
`In Review` exit is satisfied with PASS_WITH_GAPS. What remains is the three owner words above. The
Orchestrator moves the board.
