---
id: 20261017T111500Z-qe-e2e-observation-abc024-break-attempts-9c3a7f12
kind: observation
by: qe-e2e
task: qe-ABC-024
at: 2026-10-17T11:15:00Z
verified_by:
confidence: high
refs:
  - ABC-024
  - QE-024-a
  - .grugops/context/qe-ABC-024/probe/qe-summary.tsv
  - .grugops/context/qe-ABC-024/probe/qe-xwit.ts
supersedes:
---

# `ABC-024` break attempts beyond the ticket's catalogue: one real survivor, on an axis outside the scope

Same instrument and conditions as `…6b1e4d27`. I ran three mutants that are not in the ticket's catalogue, on base and on head.

| mutant | edit | base 1792 | head 1810 |
|---|---|---|---|
| `X-empty-every` | `option.empty.some(...)` → `.every(...)` | killed 1758 | killed 1765; all 10 A1 rows fail |
| `X-empty-white-only` | the `empty` test guarded by `!black &&` | killed 1718/1766, 1 file fails at load | killed 1730/1784; the 5 black A1 rows fail |
| **`X-any-right`** | `(position.castling & option.right) === 0` → `position.castling === 0` | **survived 1792/1792** | **survived 1810/1810** |

**`X-any-right` is a real wrong build, not an equivalent.** It offers a castle whenever **any** right is held. That
includes a right for the other wing, and a right held only by the opponent. Witness (`probe/qe-xwit.ts`, strict `parseFen`):

```
position                                   delivered             X-any-right
r3k2r/8/8/8/8/8/8/R3K2R w K - 0 1          [e1g1]        25      [e1g1 e1c1]   26
r3k2r/8/8/8/8/8/8/R3K2R w Q - 0 1          [e1c1]        25      [e1g1 e1c1]   26
r3k2r/8/8/8/8/8/8/R3K2R b k - 0 1          [e8g8]        25      [e8g8 e8c8]   26
r3k2r/8/8/8/8/8/8/R3K2R w kq - 0 1         []            24      [e1g1 e1c1]   26
```

Ordinary play reaches it: a rook leaves its home square and comes back while the other right is still held.
`PERFT_DEEP=1 npx vitest run src/perft.test.ts` on the mutant tree gives **31/32**. It dies on exactly one assertion,
`position-5 perft(4) = 2103487`. That is the same profile `ABC-024 § The judgement` rules on: protection by the
opt-in lane alone, with a margin of one assertion. By that ruling the guard is owed a default-lane row.

**It is not this ticket's gap.** `ABC-024`'s scope for the right test is the **scalar** axis (`- 0 1`). This is the
**right-mask** axis: which bit of `castling` the test reads. `NO_RIGHT_HELD` and the four A2 rows hold castling `0`,
where the mutant still refuses. The A1 rows and the A2 controls hold the right of every castle they expect. Measured,
not argued: nothing in the default lane fails (1810/1810). The delivered code is correct. The ticket's own § DoR says *"they do not mean
seven is the complete set"*, and this is an eighth. Recorded as `QE-024-a` and routed to BA/PM. It is not folded in here.
