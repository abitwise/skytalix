---
id: 20261009T174408Z-qe-e2e-observation-abc082-terms-hand-scored-mirror-beyond-corpus-own-mutants-5c1e7a20
kind: observation
by: qe-e2e
at: 2026-10-09T17:44:08Z
verified_by:
confidence: high
refs:
  - ABC-082
  - src/evaluate.ts
  - src/evaluate.pawns.test.ts
  - .grugops/context/qe-ABC-082/probe/terms.ts
  - .grugops/context/qe-ABC-082/probe/mutants-eval.mjs
  - .grugops/context/qe-ABC-082/probe/mutants-eval.out.jsonl
supersedes:
---

# The three terms, hand-scored: 20 / 20 exact. Mirror and file-reflection hold on 47 954 positions beyond the corpus. QE's 15 `evaluate.ts` mutants: 11 red, 2 equivalent, **2 semantic survivors (isolation reads one neighbouring file)**

Hand-authored, no `seal` (`AGENTS.md`: no `context-io.ts` on this install). Read at the build tip
`873911d` (`src/evaluate.ts` is byte-identical at `720b92d` and `34c9c02`). Apple M3, plain node
v26.11.0, load1 2.7–4.9. Every number here is node-deterministic; load does not move it.

## Method

`node probe/terms.ts <base-tree> <branch-tree> [<tree-under-test>]`, on `git archive` copies of
`5ebe1d8` (base: material + PST only) and `873911d`. The pawn term is isolated exactly as
`whiteMinusBlack(branch) − whiteMinusBlack(base)`, so nothing else in `evaluate` can hide a fault.

## 1. Hand-built positions, each against a value worked by hand before the run

Weights from the build: doubled 15 per extra pawn on a file, isolated 10, passed by own-side rank
`[0, 5, 10, 20, 35, 60, 100, 0]`. White's view.

| # | position | hand sum | read |
|---|---|---|---:|
| H1 | lone c2 | I −10, P +5 | −5 |
| H2 | doubled c3/c4 | D −15, I −20, P +10 +20 | −5 |
| H3 | tripled d3/d4/d5 | D −30, I −30, P +65 | +5 |
| H4 | d5 v c6 (**adjacent-file blocker ahead**) | neither passed; I −10 +10 | 0 |
| H5 | d5 v d3 (**enemy pawn behind**, same file) | both passed +35 / −60; I −10 +10 | −25 |
| H6 | a5 v h7 (**edge files**) | +35 −10 / −5 +10 | +30 |
| H7 | h5 v a6 (edge, wrap trap) | +35 −10 / −10 +10 | +25 |
| H8 | b7 (**promotion rank**) | P +100, I −10 | +90 |
| H9 | black c2 one step from promotion v d3 | −100 +10 / +10 −10 | −90 |
| H10 | d5 beside c5 (same rank) | both passed +35 / −20; I −10 +10 | +15 |
| H11 | a2 b2 v a7 b7 | connected, none passed | 0 |
| H12 | islands b2 d2 f2 v a7 c7 | I −30 +20; f2 passed +5 | −5 |
| H13 | black doubled d6/d5 | D +15, I +20, P −30 | +5 |
| H14 | d5 v b6 (two files away) | both passed +35 / −10; I −10 +10 | +25 |
| H15 | b6 v a2 | +60 −100; I −10 +10 | −40 |
| H16 | position-3 | three white isolated −30, f4 isolated +10, no passer | −20 |
| H17 | start position | — | 0 |
| H18 | kiwipete | eight files each side, nothing passed | 0 |
| H19 | g2 h2 h3 v h7 | D −15; h7 isolated +10; no passer | −5 |
| H20 | a4 + b2 (only neighbour on one side) | neither isolated; P +20 +5 | +25 |

**20 / 20 exact.** A deliberately wrong expectation reads differently (the harness can fail).
`src/evaluate.ts`'s comment "A pawn behind, a pawn beside on the same rank, and a piece do not
stop it" and the rear-of-a-doubled-pair rule both hold as written.

## 2. Beyond the corpus

- 27 954 positions from random legal games (60 games × ≤ 80 plies from each of the six perft
  roots, seeded PRNG), plus 20 000 random pawn boards (0–8 pawns a side anywhere on ranks 2–7,
  either side to move): **47 954 positions.**
- **Colour mirror** (`mirrorPosition`, the shared helper): `Object.is` equal on **47 954 / 47 954**.
- **File reflection** (a↔h, castling and ep cleared; a symmetry of the pawn term that the colour
  mirror is not): term equal on **47 954 / 47 954**.
- **An independent reference of the term**, written by QE from the ticket's definitions (not from
  the code's loops): equal on **47 954 / 47 954**.

## 3. QE's own mutants of `src/evaluate.ts` (`probe/mutants-eval.mjs`, raw `mutants-eval.out.jsonl`)

Each planted in a scratch copy, read by the ticket's two suites (`src/evaluate.pawns.test.ts` +
`src/evaluate.test.ts`) and by `terms.ts`.

| mutant | ticket suites | QE probe |
|---|---|---|
| E1 sign: black doubled | **red** (A1 ×2) | red |
| E2 sign: black passed | **red** (A1) | red |
| E3 sign: black isolated | **red** (A1) | red |
| E4 off-by-one rank, black passed index | **red** (A1) | red |
| E5 off-by-one rank, both colours alike | survives | red (hand 14, reference) |
| E6 off-by-one: passed scan stops at rank 5 | **red** (A1, A5 ×7) | red |
| E7 off-by-one: passed scan starts on own rank | **red** (A5 "beside it" only) | red |
| **E8 adjacency: isolation sees the right-hand file only** | **survives** | red (hand 3, file-flip 13 235) |
| **E9 adjacency: isolation sees the left-hand file only** | **survives** | red (hand 3, file-flip 13 235) |
| E10 adjacency: isolation counts its own file | **red** (A3 equal-material) | red |
| E11 adjacency: passed ignores right-hand file | **red** (A4, A5 ×3) | red |
| E12 passed is file-only | **red** (A4, A5 ×8) | red |
| E13 doubled pass skips the 2nd rank | **red** (A1, ABC-076 rows) | red |
| E14 colour cross: white isolation from black's files | **red** (A1, A3) | red |
| E15 edge clamp removed | survives | survives — **equivalent** (0x88 off-board bytes are 0) |

- **E5 is weight-equivalent.** A shifted rank table is another hand-tuned table; test note 3
  ("relations, not totals") deliberately leaves it free. Named, not a gap.
- **E8 / E9 are not.** They are a wrong *definition* of isolated: a pawn whose only friend is on
  one side is scored isolated. The colour mirror cannot see them (it flips ranks, not files), and
  A2's and A3's fixtures all have a neighbour on the side the mutant still reads, or none at all.
  This is `A5`'s own lesson ("a file-only passed check passes `A4`") applied to `A3`. It is a test
  gap, not a code defect: the build reads the correct value on every hand row and on 47 954
  reference positions. On the whole default lane they are red only on class-P exact node pins
  (`mutants-eval.full.out.jsonl`). Severity: decision note `…9b4e2d61`.
