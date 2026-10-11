---
id: 20261011T152136Z-qe-e2e-observation-abc083-refind-bar-reread-proofs-conditions-clean-lead-thin-rows-d1c74ad2
kind: observation
by: qe-e2e
at: 2026-10-11T15:21:36Z
verified_by:
confidence: high
refs:
  - ABC-083
  - ABC-127
  - ADR-0026
  - ADR-0028
  - ADR-0034
  - QE-083-c
  - b29c837c
  - .grugops/context/qe2-ABC-083-refind/probe/lead.mjs
  - .grugops/context/qe2-ABC-083-refind/probe/lead-base.txt
  - .grugops/context/qe2-ABC-083-refind/probe/lead-branch.txt
  - .grugops/context/qe2-ABC-083-refind/probe/tags.mjs
  - .grugops/context/qe2-ABC-083-refind/probe/tags.txt
  - .grugops/context/qe-ABC-083-seed5061/notes/20261011T143751Z-qe-e2e-decision-abc083-seed5061-class-l-refind-route-b631991b.md
  - .grugops/context/design-ABC-083-refind-5061/notes/20261011T150610Z-architect-design-decision-abc083-refind-5061-as-5147-clean-lead-bar-8205516a.md
  - .grugops/context/design-ABC-083-refind-5061/notes/20261011T150610Z-architect-design-observation-abc083-win-material-clean-lead-screen-qe083c-3777f413.md
supersedes:
---

# The re-find read against QE's route (`…b631991b`): `ADR-0028` d1's three proofs MET, `ADR-0034` d4's four conditions MET, the ruled clean-lead bar MET with 3.6x room on both trees. Seeds 1700 and 5180 are thinner at d ± 1 than the screen's d-only figures show

This note is hand-authored and unsealed. QE wrote its own probe (`lead.mjs`), not a re-run of the Architect's
`focus.mjs`. It adds a second lead, with each child searched by the shipped `search()` (LMR on), and
`chooseMoveWithoutReductions`. Node counts are deterministic: `lead-*.txt` were read at load1 2.68–3.05,
`tags.txt` at 2.49–2.53, thermal 0.

## Seed 5147 (`7k/6n1/7B/1Q6/1b6/5K2/8/8 w`, accepts `b5b4`/`b5b8`/`h6g7`)

| reading | base `5ed308a8` + row | branch `35f49bb7` |
|---|---|---|
| suite call at 20 (0.8x) / 25 / 31.25 (+25 %) readings | SOLVED `b5b4` d5, every rung | SOLVED `b5b4` d5, every rung |
| `chooseMoveWithoutReductions` at 25 | SOLVED `b5b4` d4 | SOLVED `b5b4` d4 |
| clean lead (LMR off) at d4 / **d5** / d6 | 270 / **280** / 280 cp | 282 / **280** / 285 cp |
| lead with children by shipped `search()` at d4 / d5 / d6 | 270 / 275 / 285 cp | 282 / 275 / 285 cp |
| fixed `search()` at d4 / **d5** / d6 | `b5b4` / **`h6g7`** / `b5b4`, all accepted | `b5b4` / **`h6g7`** / `b5b4`, all accepted |
| `W1` (quiescence off) / `W5` (depth cap 4) | MISSED `b5e5` d5 / SOLVED `b5b4` d4 | MISSED `b5e5` d5 / SOLVED `b5b4` d4 |

Every figure equals the Architect's table (`…8205516a`). The control reproduces too: seed 5061 reads 105 cp
(base) and 50 cp (branch) at d5, base's fixed `search()` at d5 plays `g2e1`, and the branch's call misses with
`g2e1` d5 n20507 on every rung.

## Against QE's route

- **`ADR-0028` d1, proof 1 (identity and oracle rows green on the branch): MET.** `ABC-127` `A2`'s oracle row
  and `ABC-084` `A1`/`A2` are green in all four `PUZZLE_DEEP=1` runs (`…ee53fec8`).
- **Proof 2 (explained by mechanism): MET**, on QE's earlier record (`…67b0c99a`), unchanged by a test-data
  commit.
- **Proof 3 (the bar's own mutant still red after the move): MET.** `PUZZLE_DEEP=weakened` at the re-find
  tree: 15/58, exit 1, `A3` green.
- **`ADR-0034` d4 (1), class and tags kept: MET.** It is `win-material`. `W1` misses it on both trees, so the
  `quiescence` tag reads. `W5` solves it at d4 on both trees, so the absent `depth≥5` tag is correct.
- **d4 (2), answer from the oracle: MET** (proof 1 above; pool entry `wm-5147` matches).
- **d4 (3), solved on both trees and at 0.8x on base: MET.** Solved at 20 readings on base, d5.
- **d4 (4), its own commit, no trigger-list file, no baseline: MET** (`scope.txt`).
- **The ruled clean-lead bar (> 75 cp at d − 1 / d / d + 1, LMR off, base AND branch): MET.** The minimum is
  270 cp, 3.6x the bound. At d, `search()` (`h6g7`) and the suite's call (`b5b4`) both play accepted moves.
- **`PUZZLE_DEEP=1` 54/58 on the branch, `=weakened` exit 1: MET** (`…ee53fec8`).

**One limit of the bar, as a reading and not a gap of this ticket.** A per-child lead cannot see the
root-level LMR reduction that flipped 5061. 5061 reads 50 cp on the branch by both of QE's leads while the
call misses. The bar works by size, not by mechanism: a lead larger than `ADR-0026` d9's 75 cp bound cannot
be closed by that drift. 5147 clears it by 195 cp.

## QE-083-c: the two thin rows, read at d ± 1 (the screen read them at d only)

| row | tree | d | lead at d − 1 / d / d + 1 (LMR off) | solved |
|---|---|---|---|---|
| seed 1700 (`g6g7`/`g6h6`) | base | 5 | **10** / 75 / 70 | yes, every rung |
| seed 1700 | branch | 5 | **18** / 75 / **39** | yes, every rung (`g6h6`) |
| seed 5180 (`h6h7`) | base | 6 | 140 / 120 / 100 | yes |
| seed 5180 | branch | 6 | 79 / 77 / 76 | yes |

- The screen's d figures (75/75 and 120/77) are reproduced exactly.
- Under the addendum's own ± 1 rule, seed 1700 would fail on both trees, and on base too. It is a 10–18 cp
  near-tie one ply shallower than it solves. It is the most fragile retained row, and it is solved today on
  every tree and rung QE read.
- **Seed 1700's `quiescence` tag (INFO, confirmed).** `W1` solves it on the branch (`g6h6` d5), and misses it
  on base (`g6d6` d5). No test asserts tags. `ABC-127` `A1` counts the static tags and is green.
