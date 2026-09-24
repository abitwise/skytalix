---
id: 20260919T093000Z-software-engineer-decision-rehop-mvv-lva-inside-quiesce-and-a3-refixture-9b2d4f61
kind: decision
by: software-engineer
at: 2026-09-19T09:30:00Z
verified_by:
confidence: high
refs:
  - ABC-079
  - ABC-080
  - ABC-078
  - ADR-0024
  - ADR-0003
  - src/quiescence.ts
  - src/quiescence.test.ts
  - src/engine.test.ts
  - .grugops/context/ruling-abc079-multiplier/probe079.ts
  - plans/tickets/ABC-079-quiescence-search-on-captures.md
supersedes:
---

# Re-hop after `ADR-0024`: the sort, its key, one count that differs from the probe and why, and `A3`'s fixture — four decisions a reviewer should check first

Branch `grugops/ABC-079-quiescence`, code commit `700730b` on top of `f6772c5` (the ruling).
Three files, 103/−37 — `src/quiescence.ts` 42/−5, `src/quiescence.test.ts` 24/−12,
`src/engine.test.ts` 37/−20. `src/search.ts`, `src/engine.ts`, `src/search.test.ts`,
`src/zobrist.*`, `src/turn-loop.*`, `src/move-input.*` untouched; the export forced no type
change.

## 1. The sort is a pure exported key and a stable `Array.prototype.sort` over the filtered captures

`mvvLvaKey(move): number` — HIGHER SEARCHES FIRST — is `value(victim) + value(promotion piece)
− value(attacker) / 1000`, values `[0, 100, 320, 330, 500, 900, 0]` indexed by `pieceType`, held
in a private `ORDER_VALUE` table in `src/quiescence.ts`. Why a second table rather than importing
`src/evaluate.ts`'s: `PIECE_VALUE` is private to the evaluator by that module's own design, and
`src/evaluate.ts` is outside this hop's fence. The attacker term is scaled by 1/1000 so it can
never outrank a victim difference (smallest victim gap is 10, knight vs bishop; largest attacker
term is 0.9). The KING attacker is 0, as in the evaluator: a king capture is only ever legal onto
an undefended square, so as an attacker it is the safest to try first — the same convention the
ruling's probe used, so the ordering matches the probe's except for point 2. The loop filters
captures into an array, sorts once, then searches; ties keep generation order (stable sort), which
is what makes the node counts deterministic. The cap stays 8. Header sentence corrected: it now
says captures are searched most-valuable-victim first and why that is THIS module's.

## 2. Kiwipete's ordered counts are 5 878 / 10 249 / 405 945, not the probe's 5 888 / 10 382 / 405 922 — the promotion term, and the spec wins over the probe

The ruling's list item 1 says *"a capturing promotion ranked by victim + promotion piece"*; its
item 3 quotes the probe's counts. The probe's `mvv` sort (`VAL[victim]*10 − VAL[attacker]/100`)
has NO promotion term. Kiwipete's quiescence tree does reach a capturing promotion
(`d5xe6, exf7, fxg8=Q`), so the two orderings differ there and the counts differ by 10 / 133 /
23 nodes at depths 1–3. Verified, not inferred: a scratch copy of `probe079.ts` with a `mvv+promo`
variant reproduces this build to the node and per-ply histogram (5 878 and 10 249), while the
probe's own `mvv` on this tree still reads 5 888 / 10 382. Position-6, with no promotion in
reach, is identical to the probe at every depth (297 / 9 804 / 120 239). Score and move are the
same under both keys at every cell. **Decision: implement the ruling's spec, record the counts.**
The ratios are 119.96x / 32.74x / 45.02x against the ruling's 120.16x / 33.17x / 45.02x — all
under the `ADR-0024` levels with the same headroom to within a rounding.

## 3. `A2`'s bound held and stays; `A3` is RE-FIXTURED on a new position because its PREMISE, not its count, was gone

- `A2` (kiwipete, 50 ms budget on a 10 ms tick): the delivered build now completes depth 1
  (5 878 nodes, unabortable) and is stopped INSIDE depth 2 by the fourth in-recursion
  consultation at **9 973 nodes ≤ 10 240** — the bound holds, so per the ruling it stays as
  written. The comment's two numbers were re-measured on this fixture rather than inherited:
  QE's `M1` mutant (in-recursion check deleted; a scratch copy of `src/`, one process) reads
  **depth 5, 36 951 122 nodes**, three orders of magnitude over the bound.
- `A3` (was position-6 at 5 ms / 1 ms tick): the ruling expected a budget re-fixture against
  9 804 nodes. Measured, the problem is different: under a quiescence leaf position-6's best move
  is **c3d5 at depths 1, 2 AND 3** (scores 10 / 30 / 30), so "the completed depth-2 move is NOT
  the depth-3 move" is false on position-6 at ANY budget. Weakening that assertion would leave a
  keep-the-aborted-best-so-far build undetected, which is the criterion's whole point. So the
  fixture moved: a scan of the six perft roots, their one-ply children, two plies under
  `startpos` and `position-3`, and the file's endgame corpus (781 positions) for d2-move ≠
  d3-move with a d3 large enough to hold several clock checks. **Chosen: the position after
  1. g4 d5, white to move** (`rnbqkbnr/ppp1pppp/8/3p4/6P1/8/PPPPPP1P/RNBQKBNR w KQkq d6 0 2`) —
  depth 1 = 38 nodes (e2e3), depth 2 = 382 (e2e3, −80), depth 3 = 9 871 (g4g5, −45). Ten
  in-recursion consultations fall inside depth 3, so every budget 3–12 on a 1 ms tick completes
  depth 2 and aborts inside depth 3; **`budgetMs: 8`** is the middle of that window (measured:
  depth 2, 6 181 nodes, e2e3, −80). An EMULATED keep-best-so-far mutant (the engine's negamax
  and leaf re-typed in a scratch script, aborting at each of the ten check points) is caught at
  all ten — its best-so-far is b1c3 / b1a3 / f1h3 / g1f3 / h2h3, never e2e3 at −80. The
  deep-lane computed form of the literal moved with it (`search(A3_FEN, 3).move === "g4g5"`).
  The runner-up (1. e4 Nf6, d3 = 4 929 nodes) was also measured and caught at all five of its
  check points; the chosen one has twice the window.

## 4. `src/search.test.ts` is NOT edited, and the licensed kiwipete drop is NOT applied

The ruling allowed one move if the unpruned-oracle pair could not meet 30 s: drop THAT case's
depth by one on kiwipete only. Measured to completion (2 678 s wall), FOUR cases time out and
only one is kiwipete; the kiwipete drop would also have to reach `A2`'s deep case (same memoised
pair) and would still leave position-5, position-6 and `A7` red. A partial edit that leaves the
lane red is churn on a file the subtask's fence does not list. Reported with every number in the
gate-results claim; the decision on that lane is Architect/Design's.
