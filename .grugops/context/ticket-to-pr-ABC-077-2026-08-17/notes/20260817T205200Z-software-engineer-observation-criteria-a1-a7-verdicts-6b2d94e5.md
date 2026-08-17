---
id: 20260817T205200Z-software-engineer-observation-criteria-a1-a7-verdicts-6b2d94e5
kind: observation
by: software-engineer
at: 2026-08-17T20:52:00Z
verified_by:
confidence: high
refs:
  - ABC-077
  - src/search.ts
  - src/search.test.ts
  - plans/tickets/ABC-077-negamax-alpha-beta-core.md
supersedes:
---

# `A1`-`A7` — each criterion's verdict, with the measurement it is scored on

Measured at `grugops/abc077-negamax-alpha-beta` @ `a00c2a3`. **Every figure below was produced by a
run on this machine and transcribed; none is asserted from reading the code.**

| # | criterion | verdict | the measurement |
|---|---|---|---|
| `A1` | pruned and unpruned scores identical, corpus at depth 3 | **MET** | all six perft positions, depth 3, pruned vs unpruned: `startpos 50/50`, `kiwipete 400/400`, `position-3 130/130`, `position-4 −205/−205`, `position-5 560/560`, `position-6 240/240` — identical in 6 of 6. Also identical in 6 of 6 at depth 2. Asserted with `toBe` (`Object.is`), so `0` vs `−0` cannot pass |
| `A2` | alpha-beta visits < 40% of unpruned nodes, kiwipete depth 3 | **MET** | kiwipete depth 3: **9 016 pruned / 99 950 unpruned = 9.0%** against the 40% bar. Depth 2: 313 / 2 088 = 15.0%. The default lane's standing guard is startpos depth 2 at 114 / 421 = 27.1% |
| `A3` | mate found, shorter mate preferred | **MET** | `7k/8/5K2/8/8/8/8/R7 w` at depth 4 returns `f6f7` scoring **29 997 = `MATE_SCORE − 3`**, i.e. mate in 2, and `> 10 000` (above anything the evaluation can produce). `7k/8/6K1/8/8/8/8/R7 w` at depth 4 returns `a1a8` scoring **29 999 = `MATE_SCORE − 1`**, choosing the mate in 1 over the mates in 2 and 3 that the same position offers. At depth 7 the first position — where `a1a6/a1a7/a1f1/a1g1` force **mate in 4** and ten more force mate in 3 — still returns 29 997, the literal "mate in 2 preferred over mate in 4" |
| `A4` | ≥ 200 corpus positions, root move always legal | **MET** | **231/231** in the default lane (six perft roots, startpos one ply, `position-3` two plies), searched at depth 1; **204/204** on the broad corpus (six roots + every child of each) at depths 1 and 2, and **231/231** at depth 2, in the deep lane. Compared by VALUE against `legalMoves(position)` (`from`/`to`/`promotion`/`flags`), because `legalMoves` builds fresh objects and `===` would pass vacuously. Move generation was NOT re-tested — this reads the search's CHOICE |
| `A5` | stalemate scores exactly 0 | **MET** | three stalemate fixtures (`7k/5Q2/6K1/8/8/8/8/8 b`, `5bnr/4p1pq/4Qpkr/7p/2P4P/8/PP1PPPP1/RNB1KBNR b`, `8/8/8/8/8/5k2/5p2/5K2 w`), each at depths 0, 1, 2, 3 — 12 cases, all **exactly `0`** by `toBe`, and `abs(score) < MATE_SCORE − 1000`. Each fixture's stalemate-ness is asserted from `gameStatus` first, so the test cannot pass on a mis-transcribed FEN. Plus: from `7k/5Q2/8/6K1/8/8/8/8 w`, where NINE white moves stalemate on the spot and none mates, the search declines all nine |
| `A6` | no move selected without a caller-supplied depth; no default depth | **MET** | reads `src/search.ts` BY NAME. Exports are exactly `["MATE_SCORE","search","searchWithoutPruning"]`; `search.length === 2` and `searchWithoutPruning.length === 2` (a default would make it 1); no source match for a defaulted/optional `depth` or a `DEFAULT_DEPTH`-shaped identifier; and no clock (`Date.now`/`performance.now`/`hrtime`/`setTimeout`) anywhere in the module |
| `A7` | position byte-identical after every search | **MET** | 231/231 default corpus and 204/204 broad corpus unchanged after a search, comparing all 128 board bytes and all five scalars (`blackToMove`, `castling`, `epSquare`, `halfmoveClock`, `fullmoveNumber`); the six perft roots unchanged after depth-3 searches, pruned and unpruned |

**`A5` was written first**, as the brief required, and it is the criterion this design most needed:
stalemate-scored-as-mate passes `A1`-`A4` untouched, which the mutation probe in the sibling note
then demonstrated rather than assumed.

## Where each criterion is answered, and what runs where

Every criterion above is answered in the **default lane** (`npm test`, 28 cases in this file). The
deep lane (`SEARCH_DEEP=1 npx vitest run src/search.test.ts`, 41 cases) adds the expensive
REPETITIONS: the depth-3 pair on five of the six positions, `A2`'s own kiwipete-depth-3 case, the
broad 204-position corpus, the depth-5 and depth-7 mate cases. **Two figures in the table above —
`A1` at depth 3 on five positions, and `A2`'s 9.0% — come from the deep lane and NOT from `npm
test`.** That is stated here rather than left for a reader to discover. Unset, the deep cases are
not DEFINED rather than skipped, so the gate's skip count stays 0 (the `PERFT_DEEP` shape).

## What a green `A1` does NOT say — `G2`, carried forward not restated

`A1` is a DIFFERENTIAL oracle: it compares the search against itself, and **both of its sides call
the same `evaluate()`**. It proves alpha-beta changed the WORK and not the VALUE. It is not, and
cannot be, evidence that the evaluation is correct — `ABC-076` closed with its own `A1` found blind
to the piece-square table contents. Nothing in this ticket narrows that, and nothing here should be
read as having done so.
