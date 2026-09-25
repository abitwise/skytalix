---
id: 20260924T200200Z-software-engineer-claim-rehop2-search-deep-lane-green-per-case-timeout-shares-7d2f9b15
kind: claim
by: software-engineer
at: 2026-09-24T20:02:00Z
verified_by:
confidence: UNKNOWN - verify
refs:
  - ABC-079
  - ABC-077
  - src/search.test.ts
  - .grugops/context/ruling-abc079-oracle/
supersedes:
---

# `SEARCH_DEEP=1 npx vitest run src/search.test.ts` at `33b9a02`: exit 0, 43 passed, 125.5 s wall. `A4`'s deep case is at 61% of its timeout

This is a `claim` with no stamp: no `finding` is admissible on this install (`AGENTS.md`). The
lane ran once, to completion, in a fresh process, through a node runner (`spawnSync` under
`/usr/bin/time -p`) from the worktree. Apple M3, Node v24.12.0, vitest 3.2.7. **Load went from
3.90 to 7.90 during the run**, and an unrelated project's full vitest run was live on the same
machine.

```
Test Files  1 passed (1)
     Tests  43 passed (43)          exit 0
real 125.48  user 123.05  sys 0.75
```

At `700730b` (re-hop 1) this lane was exit 1, 4 failed / 37 passed, 2 678.5 s. The count moved
41 → 43: four quiescence-on depth-3 cells were deleted and six bare-leaf depth-3 cells added.

## Every case against its timeout (vitest's own per-case duration)

Deep cases, with their declared timeouts, which are unchanged:

| case | duration | timeout | share |
|---|---:|---:|---:|
| **`A4` deep: default corpus d2 + broad corpus d1 and d2 (shipped `search`)** | **73 638 ms** | 120 s | **61.4% (over 50%)** |
| `A1` kiwipete d2 (quiescence leaf) | 11 860 ms | 30 s | 39.5% |
| `A7` deep: corpora d2, every root `search` d3 + door d3, `.intact` on d2 pairs | 21 097 ms | 120 s | 17.6% |
| `A1` kiwipete d3, bare leaf | 3 788 ms | 30 s | 12.6% |
| `A1` position-6 d3, bare leaf | 3 493 ms | 30 s | 11.6% |
| `A1` position-6 d2 (quiescence leaf) | 3 441 ms | 30 s | 11.5% |
| `A1` position-5 d3, bare leaf | 2 139 ms | 30 s | 7.1% |
| `A3` mate-in-2 over mate-in-4, d7 | 1 645 ms | 30 s | 5.5% |
| `A1` position-5 d2 (quiescence leaf) | 1 332 ms | 30 s | 4.4% |
| `A1` position-4 d3, bare leaf | 425 ms | 30 s | 1.4% |
| `A1` startpos d3 (quiescence leaf) | 384 ms | 30 s | 1.3% |
| `A1` startpos d3, bare leaf | 191 ms | 30 s | 0.6% |
| `A3` mate-in-2 over mate-in-3, d5 | 72 ms | 30 s | 0.2% |
| `A1` position-3 d3, bare leaf | 57 ms | 30 s | 0.2% |
| `A2` kiwipete d3, bare leaf (memoised from `A1`) | 0 ms | 30 s | 0% |

Default-lane cases in the same run carry vitest's default 5 s timeout. The largest were
`A1` position-4 d2 at 363 ms (7.3%), `A4` d1 at 233 ms (4.7%) and `A1` position-3 d3 at 193 ms
(3.9%). The rest were under 25 ms.

**One case is over 50%: `A4`'s deep case, at 73.6 s of 120 s (61.4%).** The ruling read it at
60.4 s (50%, load 4.2) and re-hop 1 at 82.7 s (69%, load 10→4). This hop does not touch it: it
runs the shipped quiescence search over the corpora, and no oracle change reaches it. The
ruling assigns its remedy, if it goes red, to a new ruling. Next closest: kiwipete's
quiescence-on depth-2 pair at 39.5%.

## The oracle's node counts, which are deterministic

Measured out of tree (plain node, same `src/` at `33b9a02`). They reproduce the ruling's probe
table to the node:

| position | d3 bare pruned / unpruned | ratio | score (both sides) |
|---|---:|---:|---:|
| startpos | 1 098 / 9 323 | 11.78% | 50 |
| kiwipete | 9 016 / 99 950 | **9.02%** (`A2` < 40%) | 400 |
| position-3 | 530 / 3 018 | 17.56% | 130 |
| position-4 | 813 / 9 738 | 8.35% | −205 |
| position-5 | 11 595 / 63 910 | 18.14% | 560 |
| position-6 | 14 565 / 92 016 | 15.83% | 240 |

Startpos d2 on the quiescence leaf, which is `A2`'s default guard: 122 / 470 = 25.96%.

Transcript: session scratchpad `deep-search.out.txt` (not committed).
