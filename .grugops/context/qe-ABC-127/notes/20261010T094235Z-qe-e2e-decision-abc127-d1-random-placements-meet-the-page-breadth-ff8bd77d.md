---
id: 20261010T094235Z-qe-e2e-decision-abc127-d1-random-placements-meet-the-page-breadth-ff8bd77d
kind: decision
by: qe-e2e
at: 2026-10-10T09:42:35Z
verified_by:
confidence: high
refs:
  - ABC-127
  - ABC-084
  - src/puzzle-corpus.ts
  - plans/tickets/ABC-127-harder-puzzles-catch-the-surviving-weakenings-and-leave-headroom.md
  - 20261010T085351Z-software-engineer-decision-abc127-curated-rows-oracles-one-budget-558e9520
  - 20261010T094235Z-qe-e2e-observation-abc127-readings-a3-17of17-identical-oracle-38of38-f5e127b9
  - 20261010T094235Z-qe-e2e-decision-abc127-verdict-pass-with-gaps-affa3970
supersedes:
---

# `ABC-127` D1, judged by QE: seeded random placements **meet** the page's breadth wording. Accepted, with one residual gap (QE-127-c)

Hand-authored and unsealed. The build's decision `…558e9520` D1 asks QE to judge one choice. The rows
are seeded random placements, selected by the weakenings and answered by oracles. They are not
named motifs.

## What the page's breadth wording asks

**`A1` defines "breadth" by enumeration:**
- ≥ 6 `mate-in-3`;
- ≥ 6 new `win-material`, ≥ 3 with black to move;
- ≥ 4 `quiet-key`, ≥ 4 `depth≥5`, ≥ 4 `quiescence`;
- no new row a colour mirror of any corpus row, checked over the mirror-normalised placement and
  side to move.

**What the page asks elsewhere:**
- **Out of scope:** every new row carries a tag that says why it is there, and no row exists only
  to raise the count.
- **Test note 1:** "curate against [`A3`'s harness]. A row earns its place by turning a survivor red."
  That prescribes engine **selection**.
- **`A2`:** answers never come from the engine, and each row records its source under
  "`ABC-084` `A6` discipline". That discipline is provenance (FEN, moves, class, source).

**Nowhere does the page require a named motif.** `ABC-084`'s rows were hand-built on motifs because
that was its build method. `ABC-127`'s page names a different one.

## What QE checked against that wording (observation `…f5e127b9`)

- **Counts:** 12 mate-in-3 and 10 win-material (7 black to move). Tags: `quiet-key` 14, `depth≥5`
  10, `quiescence` 11, `headroom` 4.
- **The default-lane row** asserts the counts.
- **Tag truth** was read from QE's own matrix:
  - `W5` misses all 10 `depth≥5` rows;
  - `W1` misses all 11 `quiescence` rows;
  - the 4 `headroom` rows are the only `NEWLY-SOLVED` lines at 4×.
- **Quiet-key and colour mirrors** were re-checked by QE's own oracle with its own move generator.
- **Answers:** 38/38 are exact under QE's own oracle, which shares no code with either build oracle.
- **Provenance:** 22/22 positions regenerate byte for byte from the seed in their `source`.

## Judgement

**D1 is accepted.** Every breadth requirement the page writes down is met and mechanically
checked. The page itself prescribes the method, selecting rows by the harness. The build's
rejected alternative, hand-built motifs, would have meant guessing which exchange is longer than
the depth reached. That guess is exactly what `A3` measures instead.

## What the method costs: the residual, named rather than hidden (gap QE-127-c, LOW)

**A miss is diagnosed by tag, not by theme.** A `NEWLY-MISSED` line names a seed and the material. The
tag tells the reader which weakening class the row detects, but not which tactic broke.

**The new rows are sparse.**
- The 12 mate-in-3 rows are endings of 4–8 men. The win-material rows have 6–14 men. No row of the
  62 has more than 14 men.
- So the `depth≥5` and `quiescence` sensitivities are measured on sparse boards only. That is where
  25 readings reach d5 (test note 2), so it is a consequence of `A7`'s price, not a defect.

**The improvement signal is narrow.** All 4 `headroom` rows are sparse mates against a bare or nearly
bare king (Q+N v P, Q+R v P, and Q+B v K twice). A stronger engine shows as a raised count only by
finding longer mates in sparse endings. A gain in middlegame tactics or evaluation cannot show yet.

**Who could act on it.** BA/PM, if a later epic ticket needs a middlegame or motif-diverse headroom
tier. That tier would be a second budget, which D3 deliberately did not add. Nothing is owed by this
build.
