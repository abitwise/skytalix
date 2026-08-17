---
id: 20260817T205800Z-software-engineer-observation-guard-sensitivity-mutants-7ac35d16
kind: observation
by: software-engineer
at: 2026-08-17T20:58:00Z
verified_by:
confidence: high
refs:
  - ABC-077
  - src/search.ts
  - src/search.test.ts
supersedes:
---

# Do the guards actually bite? Five mutants, all killed, all in the DEFAULT lane

A green suite says nothing about whether it would notice. Each mutant below was applied to
`src/search.ts`, the default lane run, then the file restored and `cmp`-verified byte-identical
against the original (it is — the last line of the harness asserts it, and the committed
`src/search.ts` is the unmutated one).

| mutant | what it breaks | killed by | cases red |
|---|---|---|---|
| `M1` stalemate scored as a mate | both terminal branches return `-(MATE_SCORE - ply)` | **`A5`** | 4 |
| `M2` the window is computed and never applied | `if (alpha >= beta) break` disabled | **`A2`** | 1 |
| `M3` a default depth appears | `search(position, depth = 4)` | **`A6`** | 2 (`Function.length` AND the source regex) |
| `M4` the root forgets to unmake | `unmakeMove` dropped from the root loop | **`A7`**, and `A1` `A3` `A4` `A5` with it | 9 |
| `M5` mate distance ignored | every mate scores `MATE_SCORE` flat | **`A3`** | 2 |

**Each mutant is killed by the criterion that owns it**, which is the property worth having — `M1`
by `A5`, `M2` by `A2`, `M3` by `A6`, `M5` by `A3` — and `M4` reds seven criteria at once because a
corrupted board is not a subtle failure.

**`M1` is the one the brief predicted and it behaved exactly as predicted**: with stalemate scored
as a mate, `A1`, `A2`, `A3`, `A4`, `A6` and `A7` ALL STAYED GREEN. Only `A5` fell. That is the
concrete demonstration that a differential oracle cannot see a wrong terminal score, and it is why
`A5` was written first.

One honest detail about `M1`'s reach: it killed `A5`'s three depth-0 cases (the leaf path) and the
in-tree case, while the depth 1-3 cases stayed green — those go through the ROOT's own terminal
branch, which `M1` did not touch. Both branches are covered by `A5`; the mutant only reached one of
them.
