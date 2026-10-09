---
id: 20261009T174408Z-qe-e2e-decision-abc082-verdict-pass-with-findings-9b4e2d61
kind: decision
by: qe-e2e
at: 2026-10-09T17:44:08Z
verified_by:
confidence: high
refs:
  - ABC-082
  - ABC-081
  - ABC-079
  - ABC-078
  - ABC-121
  - ADR-0028
  - ADR-0026
  - NFR-005
  - N8-LANE
  - NFR-008
  - src/evaluate.ts
  - src/evaluate.pawns.test.ts
  - src/evaluate.mirror-corpus.ts
  - 20261009T174408Z-qe-e2e-observation-abc082-terms-hand-scored-mirror-beyond-corpus-own-mutants-5c1e7a20
  - 20261009T174408Z-qe-e2e-observation-abc082-a8-ledger-remeasured-fixture-bites-replanted-7d3f0b42
  - 20261009T174408Z-qe-e2e-observation-abc082-873911d-judged-ten-pct-still-fails-never-store-3a9c5d17
  - 20261009T174408Z-qe-e2e-observation-abc082-gates-and-seven-deep-lanes-oracle-e81c6a95
supersedes:
---

# `ABC-082` QE verdict: **PASS WITH FINDINGS** at `873911d`, with the tip commit's merge conditional on the owner's acceptance of `ADR-0028`

Hand-authored, no `seal`. A `decision`, not a `finding`: no `§14-gate` verdict exists on this
install. Diff under review `5ebe1d8...873911d`. Every figure below was re-measured by QE with its
own probes (`.grugops/context/qe-ABC-082/probe/`); nothing was taken from the build's notes.

## Criteria, as QE read them

| | reading | result |
|---|---|---|
| `A1` | 184 + 36 FENs mirror-equal in the suite; QE: 47 954 more positions mirror-equal, file-reflection-equal, and equal to an independent reference of the term | **MET** |
| `A2` | c3/c4 v c3/d3 gap 35 (hand: D 15 + 2 × I 10), > 0 and ≤ 50 | **MET** |
| `A3` | d4 alone < d4+c3+e3; equal-material a3/g3 row red without the term | **MET** (see G-QE-1) |
| `A4` | a7 > a5 > stopped a5 at equal material | **MET** |
| `A5` | 25 / 25; adjacent-ahead, same-file-behind, beside, piece, both edges, both colours | **MET**; QE's passed-logic mutants: 6 / 6 non-equivalent red (`E2`, `E4`, `E6`, `E7`, `E11`, `E12`) |
| `A6` | purity row green; cost and `NFR-005` depth are Security/NFR's (readings only, below) | **MET** (purity) |
| `A7` | strict superset 184 ⊂ 220; both suites import from `src/evaluate.mirror-corpus.ts`; the three lifted functions are byte-identical to `5ebe1d8`'s; no non-test importer. QE mutant: an arrow-form retyped `mirrorPosition` beside the import reds the import row | **MET** |
| `A8` | 8 pin rows re-measured by QE on base and branch, all match; oracle re-run; 5 F mutants + row 21 + row 8 bites red; no class-R literal changed except the tip; all seven deep lanes green on the tip | **MET at `873911d`**; **without the tip, row 17 is red** (reproduced) |

Gate at `873911d`: lint, typecheck, build exit 0; `npm test` 49 files / 1504 / 0 skipped; skip
count 0, integrity `No findings.`; `host-protection.js` exit 2 (`UNKNOWN - verify`, no remote).

## Judgement on `873911d` (separately)

Sound and minimal; ≥ 10% still reds a table that never stores (0.00% on all three rows, both
lanes). Cost, measured: the default-lane guard no longer reds a half-storing table (10.62%); the
deep A2 rows (8.22% / 7.79%) and two exact node pins still do. **QE does not accept it; the owner
does, by accepting `ADR-0028`.** Refused → `git revert 873911d` → `ABC-082` Blocked on row 17.

## Gaps

- **G-QE-1 (LOW–MEDIUM, test gap, not a code defect).** The isolated-pawn ADJACENCY is
  half-tested. A mutant that reads only the right-hand (or only the left-hand) neighbouring file
  survives both ticket suites (`E8`, `E9`); the colour mirror cannot see it, and A2/A3's fixtures
  never put a pawn's only friend on one side. The build reads correctly (20 hand rows, 47 954
  reference positions). On the WHOLE default lane (`mutants-eval.mjs … full`) E8 and E9 are red
  only on class-P exact node pins (`search.ordering` A4 d2, `transposition` A1 and A5), the rows
  every evaluator change re-pins; the six `cli.test.ts` rows that also red are a scratch-copy
  artefact (no `AGENTS.md` in the copy), red identically under the equivalent `E15` control.
  Remedy for whoever next licenses `src/evaluate.pawns.test.ts` (likely `ABC-083`): one A3-style
  relation row with a friend on one side only, each side (e.g. d4+c3 and d4+e3 both score above
  d4 alone at equal material). Not a blocker: `A3` is met as written.
- **G-QE-2 (LOW, inherited, named by the Engineer).** `ABC-078` `A4` 10-tick reads 6 at the
  `≥ 6` bound (QE re-measured: 4 / 6 / 9). The next evaluator change can red it. `ABC-083`
  inherits it by name (`…33e5e0a3`).
- **G-QE-3 (LOW).** The A2 default-lane guard now passes a half-storing table (10.62% ≥ 10%).
  Accepted by `ADR-0028`'s Consequences; QE puts the number on it.
- **Info.** `E5` (rank table shifted one rank for both colours) survives the suites: a re-weight,
  deliberately left free by test note 3. `E15` is an equivalent mutant (0x88 off-board bytes).
  `ADR-0028` Rollback says "the three A2 literals"; there are two literal sites serving three
  rows. Wording only.

## Readings only (Security/NFR's, running in parallel; not ruled here)

`NFR-005` part 1 (≤ 1,100 ns), part 2 (depth, kiwipete WARN), `N8-LANE` and `NFR-008`: QE did not
re-measure them; the build's figures stand as reported in `…a00b6aaa`, and Security/NFR rules.
QE's lanes ran on the same machine during Security/NFR's window; load is recorded per lane so
their wall-clock readings can be discounted if they overlapped.

## Result

**PASS WITH FINDINGS.** `ABC-082` may leave `In Review` toward Security/NFR. It may not go toward
merge until the owner accepts `ADR-0028` (or refuses it and `873911d` is reverted, which re-blocks
it). The board move is the Orchestrator's.
