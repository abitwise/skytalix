---
id: 20260818T002400Z-qe-e2e-observation-a1-evaluate-blind-spot-sized-9e02b7c4
kind: observation
by: qe-e2e
at: 2026-08-18T00:24:00Z
verified_by:
confidence: high
refs:
  - ABC-077
  - ABC-076
  - src/search.ts
  - src/evaluate.ts
  - src/search.test.ts
  - src/search.qe.test.ts
supersedes:
---

# `G2` — how big the `A1`/`evaluate()` hole is, measured. **A rook worth more than a queen passed 963/963.**

The engineer disclosed this limit plainly and claimed nothing about the evaluation. He is right that `A1` cannot see it. The question I was sent to answer is **how big** the hole is and **what, if anything, in the delivered suite would catch a bad evaluation.** The answer is a number.

## The measurement

Each mutant applied, the suite run, the file restored.

| mutant | what it means | `src/search.test.ts` default lane (28) | `SEARCH_DEEP=1` (41) | whole repo (963 / 33 files) |
|---|---|---|---|---|
| `PIECE_VALUE` ROOK ↔ QUEEN (rook 900, queen 500) | **the engine trades a queen for a rook** | **28/28 GREEN** | **41/41 GREEN** | **963/963 GREEN** |
| `leafScore` returns `0 * evaluate(position)` | **the static evaluation is switched off entirely** | 27/28 — 1 red | not run | not run |
| `leafScore` returns `0 - evaluate(position)` | **the search plays to LOSE** | 26/28 — 2 red | not run | not run |

**Read the first row twice.** Nothing in this repository — not the search's suite, not the evaluator's own suite, not the deep lane — notices that a rook is worth more than a queen.

**And the reds in rows 2 and 3 are not detections.** They are:

- `A5`'s *"does not play into a stalemate one ply inside the tree"*, which reds because with every score equal the root tie-break lands on a stalemating move — an accident of ordering, not a statement about the evaluation;
- `A2`'s startpos ratio, which reds because pruning statistics change when the scores change — again not a statement about the evaluation.

So the honest reading is: **the delivered suite contains ZERO assertions on any non-terminal score.** Every score `src/search.test.ts` asserts is a mate score (`MATE_SCORE - 3`, `MATE_SCORE - 1`), an exact `0` (stalemate), or an equality between two runs of the same code. That is not a criticism of `A1`-`A7` — none of them asks for one — it is the size of the surface they leave.

## Do NOT report the two blind spots as one covered area

They are different holes and they compose into a third:

1. **`ABC-076`'s guard** was found by its own QE hop to be blind to the **piece-square table CONTENTS**.
2. **`ABC-077`'s `A1`** is blind to **`evaluate()` entirely**, by construction: both sides of the differential call it.
3. **Together** there is no test anywhere that asserts the **relative material values the search maximises**. That is not the union of two known holes being restated — it is a third hole, and row 1 of the table is it.

For contrast, the piece-square tables are **partly** guarded: zeroing `KNIGHT_TABLE` reds 2 tests in 2 files. `PIECE_VALUE` reds nothing.

## What I added: `QE-G2` and `QE-G3`

Behavioural nets on the search's **choice**, which is where an evaluation error becomes visible without asserting a total:

- **`QE-G2`** — `7k/8/8/1r3q2/3N4/8/8/7K w - - 0 1`. A knight forks a rook and a queen that defend each other. The search must play `d4f5` (take the queen), not `d4b5` (take the rook), at depths 2 and 3.
- **`QE-G3`** — `7k/8/2p5/3p4/8/8/8/3Q3K w - - 0 1`. `Qxd5` is met by `cxd5`. The search must not play `d1d5`, at depths 2 and 3.

Under the ROOK ↔ QUEEN swap these red **3 of 6**. The mutant that was invisible to 963 tests is now caught by three.

**They are sanity nets, not a correct-evaluation proof.** They would pass under a badly tuned but ordinally sane evaluation, and they say nothing about the piece-square tables. Closing `G2` properly is `ABC-076`'s guard's job, not a search test's; this is the coarsest slice, taken because it cost 171 ms.
