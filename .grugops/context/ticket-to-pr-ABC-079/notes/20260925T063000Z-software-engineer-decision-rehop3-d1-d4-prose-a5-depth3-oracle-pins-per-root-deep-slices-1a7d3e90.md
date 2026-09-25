---
id: 20260925T063000Z-software-engineer-decision-rehop3-d1-d4-prose-a5-depth3-oracle-pins-per-root-deep-slices-1a7d3e90
kind: decision
by: software-engineer
at: 2026-09-25T06:30:00Z
verified_by:
confidence: high
refs:
  - ABC-079
  - ABC-114
  - NFR-008
  - src/search.ts
  - src/search.test.ts
  - src/quiescence.test.ts
  - .grugops/context/ruling-abc079-g1g2/notes/20260925T061500Z-architect-design-decision-g1-pin-oracle-checked-depth3-answers-in-a5-g2-split-deep-corpus-by-root-licence-8c3e5a72.md
  - .grugops/context/qe-ABC-079/notes/20260924T215000Z-qe-e2e-decision-abc079-fail-four-false-search-ts-sentences-behaviour-meets-a1-a6-conjunction-gap-real-and-move-changing-a4-a7-lane-risk-2c7e91a4.md
  - plans/tickets/ABC-079-quiescence-search-on-captures.md
supersedes:
---

# Re-hop 3: D1–D4 rewritten as comment-only prose, `A5`'s depth-3 rows pin the oracle-checked answer, and every `A4`/`A7` deep case pays at most one corpus slice

**NOT A STAMP.** `context.human_admission` is `off`, so this is a hand-authored `decision`.

Code commit `9d2306c` on `grugops/ABC-079-quiescence-rehop3`, whose parent is `9a7e549` (the
enqueue commit, on top of the ruling `b6dfee0`). `src/` at `9a7e549` is byte-identical to
`9b4dd68`, where the licence's line numbers were taken (`git diff --stat 9b4dd68 9a7e549 -- src`
is empty). Three files: `src/search.ts` 21/−8, `src/search.test.ts` 60/−14,
`src/quiescence.test.ts` 38/−8. No other file under `src/` changed.

## 1. `src/search.ts`: comment lines only (D1–D4)

- **D2 (`:24–27`):** the header now names both TEST-ONLY bare-leaf doors,
  `searchWithoutQuiescence` (pruned) and `searchWithoutPruningOrQuiescence` (unpruned). The
  singular "the door" is gone.
- **D1 (`:61–69`):** each switch is turned off by TWO exports. The `prune` field doc no longer
  says "brute-force negamax". It now says the flag declines the MAIN TREE's cutoffs only, that a
  quiescence leaf still runs `quiesce` with its own cutoffs, and it names both exports. The
  `quiescence` field doc names both of its doors. The two one-line field docs became multi-line
  JSDoc blocks. That is the only reason the line count grew.
- **D4 (`:112–114`):** `prune` false is brute force above the horizon only. `quiesce` keeps its
  stand-pat and capture cutoffs. It is still `A1`/`A2`'s differential oracle for the main tree.
- **D3 (`:204–209`):** `searchWithoutPruning` disables the main tree's cutoffs and is NOT brute
  force below the horizon. It cites QE's measurement (position-3 d1: 46 nodes shipped, 63 with
  `quiesce`'s cutoffs removed).
- The door's docblock (`:227–236`) is true, as the ruling says, and it is untouched.

## 2. `src/quiescence.test.ts`: only inside `A5`

- `ORACLE_AT_DEPTH_3 = { kiwipete: 50 / e2a6, position-6: 30 / c3d5 }`, with the docblock the
  ruling asks for. It says the values are the retired unpruned quiescence oracle's depth-3
  answers, checked by the ruling, and that they close QE's G1. It says node counts are
  deliberately not pinned. It gives the re-pin rule: re-run `searchWithoutPruning(parseFen(<fen>), 3)`
  and re-pin only when it agrees on score and move.
- `multiplier()` now returns `{ ratio, result }`, where `result` is the SAME `search()` call the
  ratio was taken from. There is no second `search()`. The return type is written as
  `ReturnType<typeof search>` rather than by importing `SearchResult`, because the import line
  sits OUTSIDE the `A5` describe and so outside the licence.
- The deep loop is unrolled into a depth-2 case (ratio only, title unchanged) and a depth-3
  case. The depth-3 case asserts the ratio, then `score` and `label(move)`. Its title now names
  the oracle-checked answer. Depth 1 and depth 2 are not pinned. Timeouts stay at `120_000`.

## 3. `src/search.test.ts`: header, `A1` banner, corpus helpers, `A4`/`A7` deep

- **Header `:37–43`:** "What no case proves any more is the combination" is replaced. The
  combination is now covered on kiwipete and position-6 at depth 3 by `A5`'s pinned,
  oracle-checked `{score, move}`, and the text cites the ruling. "Neither leaf brute-forces
  quiescence's own alpha-beta" stays.
- **`A1` banner `:352`:** "the SAME score as brute force" becomes "the SAME score as the
  unpruned main tree".
- **Helpers `:236–289`:** there is a new `broadSlice(root)`, which is that root plus its
  one-ply children, `inProgress`-filtered. `broadCorpus()` is left as it was on purpose, so the
  coverage check compares two independent generators rather than one generator against itself.
  `corpusRun`'s `kind` gains `` `broad:${string}` ``. The memo key is still `${kind}|${depth}`,
  so `default|d` and `broad|d` keep their keys, and a slice is keyed `broad:<root>|2`.
- **`A4` deep:** there are eight cases where there was one. They are `default` d2
  (`illegal` = []), `broad` d1, and one case per root for the broad corpus at d2. The `broad` d1
  case holds the `size ≥ 100` check. It also asserts that the six slices' sizes sum to the
  searched run's size and that their concatenated names EQUAL `broadCorpus()`'s names in order.
  That check generates positions and does not search them. The `size ≥ 100` check no longer
  runs on `default` d2. The ruling moved it, and the same corpus is held to `≥ 200` in the
  default-lane d1 case.
- **`A7` deep:** there are eight cases where there was one. They are `default` d2
  (`mutated` = []), one case per root for the broad corpus at d2, and one roots case whose body
  is today's loop, unchanged (the `.intact` d2 pairs, then `search(p, 3)` and the bare door at
  d3 with the snapshot check). `A7`'s slices share `A4`'s memo keys, so in a full-file run they
  read warm, and run alone each pays for one slice.
- No timeout value changed anywhere (every deep case keeps `120_000`).

## Rejected

- Building `broadCorpus()` out of `broadSlice()`. That would make the "slices are exactly the
  corpus" assertion true by construction, which is the opposite of what the ruling asked for
  (claim note, item 5).
- Importing `SearchResult` into `src/quiescence.test.ts`. The line is outside the licence.
