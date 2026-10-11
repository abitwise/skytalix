---
id: 20261011T143751Z-qe-e2e-decision-abc083-verdict-fail-one-route-l-refind-56016fe2
kind: decision
by: qe-e2e
at: 2026-10-11T14:37:51Z
verified_by:
confidence: high
refs:
  - ABC-083
  - ABC-084
  - ADR-0034
  - ADR-0028
  - ADR-0039
  - ADR-0031
  - AR-N8LANE-083
  - AR-NFR005-083
  - .grugops/context/qe-ABC-083-seed5061/notes/20261011T143751Z-qe-e2e-observation-abc083-seed5061-readings-lmr-near-tie-at-d5-67b0c99a.md
  - .grugops/context/qe-ABC-083-seed5061/notes/20261011T143751Z-qe-e2e-decision-abc083-seed5061-class-l-refind-route-b631991b.md
  - .grugops/context/qe-ABC-083-seed5061/notes/20261011T143751Z-qe-e2e-observation-abc083-qe-pass-gates-lanes-mutants-gaps-6b2e2f3b.md
  - .grugops/context/qe-ABC-083-seed5061/notes/20261011T143751Z-qe-e2e-artifact-ref-abc083-qe-probes-and-trees-ae73a687.md
  - .grugops/context/secnfr-ABC-083-quiet-readings/notes/20261011T140910Z-security-nfr-decision-abc083-quiet-readings-d5-does-not-fire-n8lane-not-met-ar-proposed-8ff62fd0.md
supersedes:
---

# QE `ABC-083` at `67c189b9`: **FAIL**, on one item with an agent route: `A10`'s puzzle gate, seed 5061, class L, needs a re-find. Everything else is MET

This note is hand-authored and unsealed. AGENTS.md says no `finding` is admissible on this install.

## Verdict

**FAIL.** The page says a `PUZZLE_DEEP` red is a QE FAIL (`A10`; `AGENTS.md` option B), and `PUZZLE_DEEP=1`
reads 53/58 against 54/58. **This is the only failing item.**
- `A1`–`A4`, `A6` and `A8` are MET on QE's own mutants.
- `A5`, `A7` and `A9` are MET (cited).
- `A10`'s ledger rows are MET on every deep lane QE ran on the tip.
- Readings: `…6b2e2f3b`.

## The route out (no owner word is needed for it)

1. **Architect/Design** rules a re-find of seed 5061 under `ADR-0028` decision 2, read through `ADR-0034`
   decision 4. QE's recommendation: the label move should lead the best non-accepted move by more than
   75 cp in a clean search at the solving depth, on base and on the branch (`…b631991b`).
2. **Whoever Architect/Design names** lands it in its own commit. The commit touches only
   `src/puzzle-corpus.ts` (and its own notes). It touches no trigger-list file and not the baseline.
3. **QE re-reads, as a delta pass:**
   - `PUZZLE_DEEP=1` at 54/58, exit 0, with no other row changing solved state;
   - `PUZZLE_DEEP=weakened` at exit 1 (`ADR-0028` decision 1 proof 3);
   - `npm test` green.
   When those hold, QE expects **PASS_WITH_GAPS** with the register in `…6b2e2f3b`. That is a
   prediction, not a verdict.

**Not routes** (`ADR-0034` decision 6): no mobility or king-safety cut, no re-weight, no baseline change.
`ADR-0039`'s re-level (`547b5155`) stands.

## Still owed outside QE (unchanged by this hop)

- The owner's word on `AR-N8LANE-083` and `AR-NFR005-083`, both LOW and proposed by Security/NFR
  (`…8ff62fd0`).
- The owner's UAT word. `src/evaluate.ts` is a production line, so the waiver does not apply
  (`probe/scope.txt`).

## Board

QE does not move the board in this hop (fence: no `plans/board.md` edit). On QE's reading the ticket
stays `Blocked`, now on the re-find and on the two owner words above. It no longer waits on QE's classing.
