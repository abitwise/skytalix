---
id: 20260924T200000Z-software-engineer-decision-rehop2-bare-leaf-door-leaf-keyed-pairs-and-sibling-branch-6c1e8a04
kind: decision
by: software-engineer
at: 2026-09-24T20:00:00Z
verified_by:
confidence: high
refs:
  - ABC-079
  - ABC-077
  - src/search.ts
  - src/search.test.ts
  - src/search.qe.test.ts
  - .grugops/context/ruling-abc079-oracle/
  - plans/tickets/ABC-079-quiescence-search-on-captures.md
supersedes:
---

# Re-hop 2 after the oracle ruling: the door, a leaf-keyed pair memo, and a sibling branch because the named one is held by two other worktrees

Code commit `33b9a02`, parent `b324cb6` (the ruling). Three files, 106/−30.
`src/search.ts` 14/−0, `src/search.test.ts` 87/−30, `src/search.qe.test.ts` 5/−0. No other file
under `src/` changed.

## 1. `src/search.ts`: one TEST-ONLY door, and nothing else

`searchWithoutPruningOrQuiescence(position, depth)` = `searchRoot(position, depth, { prune: false,
quiescence: false })`. Its docblock matches its two siblings: required depth, "not an engine
option", nothing in production calls it, and why it exists (the full-window quiescence cost of
the unpruned tree). The module header and the `Switches` docblock were deliberately left
untouched, because the ruling says nothing else in the file changes. `Switches` still says
"each has one export that turns it off". That stays true of the two single-switch doors, but a
reader could now also expect a mention of the both-off door. QE may want to weigh that.

## 2. `src/search.test.ts`: `searchPair` takes a REQUIRED `leaf` argument and keys its memo on it

`searchPair(fen, depth, leaf: "quiescence" | "bare")`, keyed `${leaf}|${depth}|${fen}`. The
`"quiescence"` leaf is `search` vs `searchWithoutPruning`. The `"bare"` leaf is
`searchWithoutQuiescence` vs the door. The argument is required rather than defaulted, so every
call site says which leaf it reads.

- **`A1`:** the depth-2 quiescence pair runs on all six, lanes unchanged. The depth-3 quiescence
  pair runs only on `QUIESCENCE_AT_DEPTH_3 = {position-3, startpos}`: `position-3` in the default
  lane and `startpos` in the deep lane, with the same names as before. A new case, `<name> at
  depth 3 on the bare leaf [deep, SEARCH_DEEP=1]`, runs on all six. Deleted: the quiescence-on
  depth-3 cells for kiwipete, position-4, position-5 and position-6.
- **`A2` deep:** reads `searchPair(KIWIPETE, 3, "bare")`. It is memoised from `A1`, so no new
  search runs. The comment's figures were re-measured: 9 016 / 99 950 = 9.02% for the
  criterion's case, and 122 / 470 = 25.96% for the default-lane startpos depth-2 guard. The
  guard now runs on the quiescence leaf; the old comment said 27.1%, which was ABC-077's bare
  leaf.
- **`A7` deep:** keeps `search(position, 3)` on every root. Its unpruned half is the door at
  depth 3. It also asserts `searchPair(fen, 2, "quiescence").intact` on every root. Those pairs
  are memoised by `A1`, so this adds no searches in a full run.
- **`A6`:** the export list and the `Function.length` check each gain the door.
- **Header:** the ABC-077 figures are now labelled as that tip's, and a paragraph with a table
  says which leaf runs at which depth and why, what is no longer proved, and where the ruling
  lives.
- **Timeouts:** none changed (30 s per `A1`/`A2`/`A3` deep case, 120 s for `A4`/`A7` deep).

## 3. `src/search.qe.test.ts`: `QE-G1` gains one case

`searchWithoutPruningOrQuiescence(position) — with no depth — cannot return a move`. It has
the same shape as the `searchWithoutQuiescence` case.

## 4. Branch: `grugops/ABC-079-quiescence-rehop2`, NOT `grugops/ABC-079-quiescence`. A deviation from the brief

`git checkout grugops/ABC-079-quiescence` was refused. The branch is checked out in two other
worktrees (`agent-a841696333564143a` and `agent-a9d4e213f43f8e3ca`, both at `fa80923`). This
agent is sandboxed to its own worktree and could not inspect them. Checking out with
`--ignore-other-worktrees`, or moving the ref with `update-ref`, would silently leave those two
worktrees' files out of step with their HEAD. So the work sits on a new branch,
`grugops/ABC-079-quiescence-rehop2`, cut from `grugops/ABC-079-quiescence` (`fa80923`) and
fast-forwarded to `grugops/ruling-abc079-oracle` (`b324cb6`). Its tip is a strict
fast-forward of `grugops/ABC-079-quiescence`. Once those worktrees are released, the
Orchestrator can move the named branch with
`git branch -f grugops/ABC-079-quiescence grugops/ABC-079-quiescence-rehop2`, or merge from the
sibling directly. Nothing was merged into the wave branch and nothing was rebased.
