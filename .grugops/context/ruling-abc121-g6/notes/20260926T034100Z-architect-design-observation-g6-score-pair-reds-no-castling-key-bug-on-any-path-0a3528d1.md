---
id: 20260926T034100Z-architect-design-observation-g6-score-pair-reds-no-castling-key-bug-on-any-path-0a3528d1
kind: observation
by: architect-design
at: 2026-09-26T03:41:00Z
verified_by:
confidence: high
refs:
  - ABC-121
  - ABC-081
  - ABC-075
  - ADR-0006
  - ADR-0025
  - ADR-0026
  - .grugops/context/ruling-abc121-g6/probe/g6-bite.mjs
  - .grugops/context/ruling-abc121-g6/probe/g6-keycheck.mjs
  - .grugops/context/ruling-abc121-g6/probe/g6-suite.mjs
  - .grugops/context/ticket-to-pr-ABC-121/notes/20260925T184100Z-software-engineer-decision-abc121-g6-pair-repointed-decision-4-over-7-needs-ratifying-0da3f1a5.md
supersedes:
---

# The G6 knight pair's SCORE rows red no castling-key bug, on the shipped path or the door; G6's teeth are three key rows that no search switch touches

Hand-authored, no `seal`. Tree: `66afd16` (the build `9823c27` plus docs). No `src/` file in the
repository was edited. Every mutant ran in a scratch copy outside the repository, and each
exact-string edit was asserted to match once. Load average was 30–55 (parallel hops). These are
values, not timings, so load does not move them.

## 1. The pair under every configuration, depths 3–6 (`g6-bite.mjs`, clean)

| depth | `w K`: `search` / door / `…WithoutReductions` / table off | `w -`: same four |
|---|---|---|
| 3 | 850 / 850 / 850 / 850 | 830 / 830 / 830 / 830 |
| 4 | 830 / 830 / 830 / 830 | **830** / 820 / 820 / 820 |
| 5 | 840 / 840 / 840 / 840 | 830 / 830 / 830 / 830 |
| 6 | 840 / 840 / 840 / 840 | 830 / 830 / 830 / 830 |

This reproduces the Engineer's `probe/g6.ts`. Depth 4 is the only depth where the configurations
disagree. At depths 3, 5 and 6 the shipped `search()` keeps the pair distinct, and `search()` equals
table-off.

## 2. Two castling-key bugs, planted in `src/zobrist.ts`

- **`drop-rights`**: the key ignores castling rights, in `zobristKey` and in `zobristKeyAfterMove`.
  This is `G6`'s own FAIL. For this pair it gives the same key as an availability key, because
  the right is unusable now.
- **`delta-ignores-rights`**: the full key is correct, but the incremental update drops a lost
  right. The key goes stale after the rook leaves h1.

`g6-keycheck.mjs` confirms that each edit took effect:

- `drop-rights`: the two roots share a key.
- `delta-ignores-rights`: after 1. Rh2 Kd8 2. Rh1 Ke8, the incremental key differs from the
  full key.
- clean: that walk's full key equals the no-right root's key.

**Score readings under both mutants are identical to the clean table in section 1**, cell for
cell, on all four configurations at depths 3–6. The score pair reds neither bug, on either path.
It never did on the door either, and the door is the pre-`ABC-121` search node for node
(`…d9a84a04`).

- *Why:* the table lives one search, and `clearTable` runs at every `search()` (`ADR-0025`
  decision 4). The two roots never share a table.
- Inside one root's tree, the colliding node is the rook's round trip. It sits four plies deep,
  and a line that wastes four plies is never the best line.

## 3. The suite against both mutants (`g6-suite.mjs`: `zobrist.test.ts` + `transposition.test.ts`, both lanes)

| variant | default (57) | `SEARCH_DEEP` (72) | rows that red it |
|---|---|---|---|
| clean | 0 red | 0 red | — |
| `drop-rights` | 3 red | 3 red | `transposition.test.ts` "G6 bites: the knight-g1 pair keys differently"; `zobrist.test.ts` "zobristKey depends on castling rights"; `zobrist.test.ts` `ABC-075` `A4` "hashes castling RIGHTS, not availability (ADR-0006), and the delta agrees" |
| `delta-ignores-rights` | 5 red | 5 red | `zobrist.test.ts` `ABC-075` `A1/A2` and `A3/A4` oracle walks (4 rows) and `A3` |

None of the red rows calls `search`, and no search switch reaches any of them. They read the same
before and after `ABC-121`.

## 4. The price and bite of a shipped-path score row, if one were wanted

`search()` on the pair at depth 5 reads **840 / 830**. It equals table-off, LMR fires there
(root depth ≥ 4), and it costs 2 472 + 2 007 nodes. Its bite on both key bugs is **none**, as in
section 2. It would pin the premise (the subtrees differ on the engine the player gets), not the
key.
