---
id: 20260817T190711Z-qe-e2e-decision-abc076-qe-verdict-pass-six-of-six-criteria-met-two-gaps-found-at-qe-99a7fcf7
kind: decision
by: qe-e2e
at: 2026-08-17T19:07:11Z
verified_by:
confidence: high
refs:
  - src/evaluate.ts
  - src/evaluate.test.ts
  - plans/tickets/ABC-076-evaluation-material-and-piece-square-tables.md
  - .grugops/context/ticket-to-pr-ABC-076-2026-08-17/notes/20260817T185041Z-software-engineer-artifact-ref-abc076-evaluate-delivered-a1-a5-met-a6-measured-f8b36aa.md
  - .grugops/context/quality-gate-ABC-076-qe-2026-08-17/notes/20260817T190709Z-qe-e2e-observation-abc076-a1-is-vacuous-for-table-content-at-184-and-at-12-the-widening-bought-nothing-for-that-defect-class-99a7fcf7.md
  - .grugops/context/quality-gate-ABC-076-qe-2026-08-17/notes/20260817T190710Z-qe-e2e-observation-abc076-the-full-mutation-ledger-every-mutant-run-and-restored-99a7fcf7.md
supersedes:
---

# `ABC-076` QE verdict: **PASS**. Six of six criteria MET as written. **Gaps found at QE: 2** — one closed here, one referred to BA/PM.

This is the QE hop the owner's 2026-08-17 standing directive requires before `ABC-076` may leave
`In Review`. **It is not UAT and carries no human acceptance.** Branch
`grugops/ticket-to-pr-ABC-076-2026-08-17`, tip `99a7fcf`.

## Verdict per criterion

| criterion | verdict | how it was tested, beyond reading it |
|---|---|---|
| **`A1`** symmetry over 184 mirrored pairs, exactly equal | **MET** | All 184 pairs equal under `Object.is`. Global-sign-flip mutant reds it (170 mismatches). **But see gap G1: the criterion's own parenthetical about "one wrong mirrored table entry" is false — that mutant survives.** |
| **`A2`** startpos exactly `0` | **MET** | Returns `+0`. Reverting the `-0` fix (`0 - score` → `-score`) reds **`A1`**, not `A2` — `A2` only exercises white-to-move. |
| **`A3`** startpos minus a black knight ∈ [+250, +400] | **MET** | Scores `280`. Reds at KNIGHT = 280/260/250/240/200/100/32/3200. Accepts KNIGHT ∈ [290, 440]. |
| **`A4`** knight on `e4` strictly beats knight on `b1` | **MET** | Mutating `KNIGHT_TABLE[36]` (`e4`) `20` → `-50` reds `A4`. |
| **`A5`** purity, byte-identical before and after | **MET** | Persistent mutation of `halfmoveClock` reds all six rows; of `board[0]` reds ten of twenty. |
| **`A6`** mean cost reported, bar ≤ 1,100 ns | **MET** | **Independently re-measured: 133.0 ns/call mean of six** (best-of-3 × 200k, Node v24.12.0, darwin/arm64) against the engineer's 128.8. **~8.3× under the bar.** No wall-clock assertion in the suite — `grep` for `hrtime`/`Date.now`/`performance.now`/`setTimeout` over both files returns nothing. Engineer's arithmetic re-checked: 773.1/6 = 128.85. |

## Gaps found at QE: **2**

Counted against one definition, stated so the rule-1 control is comparable across tickets: *a place
where the delivered tests do not enforce what the ticket's criterion says.*

**G1 — `A1` does not do what `A1` says it does. REFERRED to BA/PM, not fixable at QE.**
`A1` on `main` promises *"One hard-coded sign error, **or one wrong mirrored table entry**, fails
this."* The second half is false. The symmetry is an algebraic identity of the mirrored-*index*
implementation and survives randomising all six tables and all six material values, at 184 pairs and
at 12. Evidence and the full experiment: the companion `observation` note. **Not fixed at QE
because the fix is either a criterion rewording or a table-content test, and the ticket's own test
note 3 forbids the latter — both are BA/PM's.**

**G2 — the corpus's *contents* were never asserted. CLOSED at QE.**
`buildCorpus()` was checked for length `184` only. A `buildCorpus` returning 184 copies of the start
position passed all 20 tests. **One test was added** — *"holds the RIGHT 184 — distinct positions,
grouped per root"* — asserting 184 distinct `board|blackToMove|castling|epSquare` keys and the
per-root grouping in `PERFT_POSITIONS` order. Verified red against that mutant. Suite is now 21.

## Residuals — named, deliberately NOT counted as gaps

Each of these matches its criterion **as written**, so counting them would inflate the rule-1
control with things no criterion asked for. They are on record for `ABC-077` and for BA/PM.

- **R1 — five of six material values are unguarded.** PAWN, BISHOP, ROOK, QUEEN each set to `1`, and
  KING to `5000`, pass the whole suite. Only KNIGHT is pinned, and only to [290, 440] — **`320` →
  `300` passes everything.** `A3`'s Given/When/Then speaks of one black knight and nothing else, so
  the criterion is met.
- **R2 — `A5` cannot see the transient shape it cites.** Mutate-then-restore inside `evaluate`
  passes. `A5` says *"byte-identical before and after"* and the test does exactly that; the
  overstatement is in `src/evaluate.test.ts:239`-`:240`'s comment, not in the criterion.
- **R3 — the branch predates the `A1` repair.** `plans/tickets/ABC-076-…md` **on this branch** still
  carries the dead `≥ 40` wording; the repaired text (184, castling + `epSquare` mirroring) is on
  `main` at `9ad3eb1`, which is **not an ancestor of `99a7fcf`**. The delivered code matches the
  repaired text, so nothing is wrong with the work — but the branch's own ticket page contradicts
  it, and the merge must take `main`'s version. **Integration matter for the Orchestrator.**

## Gate, run at this working tree (branch tip + the one added test)

| step | result |
|---|---|
| `npm run lint` | **GREEN** — `biome check .`, 56 files, no fixes applied |
| `npm run typecheck` | **GREEN** — exit 0 |
| `npm test` | **GREEN — 890 passed (890), 31/31 files** |
| `npm run build` | **GREEN** — exit 0 |
| skip count | **0** |
| `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **`No findings.`, exit 0** |

Baseline before my added test, for comparison: **889 passed (889), 31/31**, lint/typecheck/build
green, skips 0. **The `src/cli.test.ts` red the engineer reported at `f8b36aa` is gone** — the
Orchestrator's `99a7fcf` (20 → 21) fixed it, and I re-measured rather than assumed.

## What this verdict does and does not authorise

**PASS. `ABC-076` may leave `In Review`.** I did not merge, did not move a board column, did not
edit the ticket page, and did not touch `agent-factory/…`. **G1 should be routed to BA/PM before
`ABC-082` is pulled** — that ticket's `A1` inherits this corpus and would inherit the false promise
with it.
