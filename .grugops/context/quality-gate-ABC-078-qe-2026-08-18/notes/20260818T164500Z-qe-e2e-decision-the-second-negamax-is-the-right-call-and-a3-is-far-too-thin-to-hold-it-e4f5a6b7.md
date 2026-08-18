---
id: 20260818T164500Z-qe-e2e-decision-the-second-negamax-is-the-right-call-and-a3-is-far-too-thin-to-hold-it-e4f5a6b7
kind: decision
by: qe-e2e
at: 2026-08-18T16:45:00Z
verified_by:
confidence: high
refs:
  - ABC-078
  - ABC-077
  - ABC-079
  - ABC-080
  - ABC-081
  - src/engine.ts
  - src/search.ts
  - src/search.test.ts
supersedes:
---

# The ~55 duplicated lines: **the duplication is the right call, and the test holding the two copies together is far too thin to hold them.** Both halves, with numbers

A previous attempt at this hop got as far as *"the coupling is one line"* before it died. That is
true and it is the least interesting true thing about it. **The question is not how many lines the
coupling is; it is what the coupling would have to catch, and what it does catch.** I mutated
`src/engine.ts`'s copy three ways and measured.

## Part 1 — the duplication itself: I agree with the engineer, and I checked the constraint rather than taking it

**The forcing constraint is real.** `src/search.test.ts:433-465` is `ABC-077`'s merged `A6` and it
pins `src/search.ts` to exactly three exports (`MATE_SCORE`, `search`, `searchWithoutPruning`), to
`search.length === 2`, and to a source matching no `Date.now|performance.now|hrtime|setTimeout`. I
read it at the tip. Every route to an abortable `search()` breaks one of those three:

| route | breaks |
|---|---|
| export a fourth abortable entry point | the exact-exports assertion |
| add an optional `shouldAbort` / `deadline` parameter | `search.length === 2` |
| read a clock inside `src/search.ts` | the no-clock source regex |
| pass a callback through an existing parameter | there is no such parameter; `search(position, depth)` is all of it |

**So the engineer's claim is correct and it is not an excuse.** `ABC-077`'s `A6` is merged, this
project's `AGENTS.md` treats merged criteria as contracts, and the brief explicitly forbids
weakening it. **Duplicating ~55 lines in the module that owns the clock is the correct move here**,
and I would have made the same one. The alternative — renegotiating a merged criterion mid-ticket
to avoid a duplication — is a much worse precedent than the duplication.

**The duplication is also faithful today.** I compared the two copies line by line: identical
window (`-beta, -alpha`), identical fail-soft return, identical `remaining <= 0` / `depth <= 0`
leaf, identical mate-vs-stalemate branch, identical root incumbent (`moves[0]`) and identical
strict-`>` tie-breaking. The only differences are the abort check, the `finally`-wrapped
`unmakeMove` (which `search.ts` does not need because it cannot throw), the node counter's base
(`search.ts` starts at 1, `engine.ts` at 0 — a node-count difference, never a score difference),
and root move generation hoisted out of the deepening loop. **None of those can change a score.**

Confirmed by differential measurement rather than by reading. Over a **260-position corpus** (the
six benchmark roots, five endgames I added near stalemate and mate, and every position one legal
move from each), comparing `chooseMove`'s completed iteration against `search(position, depth)`:

| build | depth | compared | **move** differs | **score** differs |
|---|---|---|---|---|
| **delivered** | 1 | 260 | **0** | **0** |
| **delivered** | 2 | 252 | **0** | **0** |
| **delivered** | 3 | 92 | **0** | **0** |

**604 comparisons, zero divergence in move and zero in score.** The two implementations agree
exactly today. **This is a positive result for the engineer's work** and it is worth recording as
such — the duplication was done correctly, not just defended well.

## Part 2 — but the test holding them together does not hold them

`A3` is the entire coupling. It asserts, at **one position** (`position-6`), at **one depth** (2),
that the **move** equals `search(position, 2).move`. **The score is never compared, and no other
position ever is.**

I built three drift mutants of `src/engine.ts`'s copy, leaving `src/search.ts` untouched — which is
exactly the shape the engineer's own note predicts (`ABC-079` / `ABC-080` / `ABC-081` landing in one
copy and not the other). **Full default suite, 1 016 tests:**

| mutant | the bug, in chess terms | full suite | `ENGINE_DEEP` |
|---|---|---|---|
| **M4b** — leaf evaluation negated | catastrophic; the engine plays its worst move | **1 failed** (`A3`) | — |
| **M4** — stalemate scored as a loss instead of a draw | the classic negamax bug; the engine flees drawn-but-safe lines and walks into stalemate as if winning | **1 016 PASSED — SURVIVES** | **23 passed — SURVIVES** |
| **M4c** — mate distance lost (`leafScore(position, 0)`) | the engine cannot prefer mate in 2 to mate in 4 | **1 016 PASSED — SURVIVES** | — |

**Two of the three survive, and the two that survive are the realistic ones.** M4b is the mutant a
compiler would practically catch; M4 and M4c are the kind of divergence that actually appears when
one copy is improved and the other is not.

**M4 is not a toy.** `src/search.ts`'s own comment at its mate/stalemate branch calls scoring
stalemate as a mate *"the classic negamax bug this project's `A5` exists to catch"*. `ABC-077`
built a criterion specifically to catch it — **and that criterion guards `src/search.ts` only.**
The copy in `src/engine.ts`, which is the one an actual game would use, has no such guard. **The
duplication duplicated the code and did not duplicate the criteria that protect it.**

## Part 3 — exactly why `A3` misses, measured, and exactly what would make it bite

I ran the same 260-position differential against the two survivors:

| mutant | depth | **move** differs | **score** differs |
|---|---|---|---|
| M4 stalemate-as-loss | 2 | **3** | 1 |
| M4 stalemate-as-loss | 3 | **3** | 5 |
| M4c mate-distance-lost | 1 | 0 | **2** |
| M4c mate-distance-lost | 2 | **0** | **39** |
| M4c mate-distance-lost | 3 | 2 | 3 |

Three things fall straight out, and they answer the brief's question precisely.

**(a) Score drift precedes move drift, and `A3` only looks at the move.** M4c produces **39 score
mismatches and 0 move mismatches at depth 2**. A move-only assertion is blind to it at exactly the
depth `A3` runs. `EngineChoice` already carries `score` and the delivered build already matches
`search`'s score on all 604 comparisons, so **asserting the score is available today at no cost**.

**(b) Breadth is what does the work, not the score alone.** I checked whether simply adding a score
assertion to `A3`'s **existing** fixture would help. It would not:

| build | `position-6` depth 2 | move | score | matches `search`? |
|---|---|---|---|---|
| delivered | 2 | `70-85` | −10 | move yes, score yes |
| M4 stalemate-as-loss | 2 | `70-85` | −10 | **move yes, score yes** |
| M4c mate-distance-lost | 2 | `70-85` | −10 | **move yes, score yes** |

`position-6` is a quiet middlegame: no mate and no stalemate inside a depth-2 horizon, so all three
builds agree there completely. **A score assertion at the current fixture catches nothing.** The
fixture was chosen for `A3`'s *discard* property — a best move that changes between depth 2 and 3 —
and it is a good fixture for that. It is simply the wrong fixture for the identity property, and
the same test is being asked to carry both.

**(c) The positions that expose the drift are the ones the corpus does not contain.** Every M4
divergence is in a stalemate-adjacent endgame — positions I had to add. The six perft benchmark
roots and their children never reach a stalemate or a mate leaf within depths 1–3, so the standing
corpus **cannot** see M4 no matter how many of its positions are compared.

### What would make the coupling bite

A `A3`-identity sweep, not an `A3`-identity assertion: **`chooseMove`'s completed iteration must
equal `search(position, depth)` in BOTH `move` AND `score`, over a corpus that includes mate- and
stalemate-adjacent endgames, at depths 1–3.** My harness is exactly that and it is green on the
delivered build (604/604) and red on both survivors.

**Lane cost, measured, because `N8-LANE` is real:** the full depths-1-3 sweep over 260 positions is
**~2.0 s** for one build; the depths-1-2 sweep is **1.13 s** including node startup. **Both are too
expensive for the default lane** under `N8-LANE`'s ≤ 650 ms. So the shape is the one this file
already uses twice: **a small default-lane version — the existing `A3` fixture plus its score, plus
three or four endgame positions where mate and stalemate are inside the horizon — and the full
sweep behind `ENGINE_DEEP=1`.** The five endgames I used are enough to kill M4 and cost
milliseconds; they are the cheap 90% of the win.

## The answer the brief asked for, in one paragraph

**No, `A3` is not sufficient.** Two implementations of the same algorithm that can drift silently
is a real maintenance defect, and here the drift is not hypothetical: two of my three drift mutants
pass 1 016 tests and the opt-in deep lane, and one of them is the specific bug `ABC-077` wrote a
criterion to prevent — a criterion that protects only the copy a game does not use. **But the
duplication itself is the right call**, the merged constraint that forces it is real and I verified
it, the two copies agree exactly today across 604 comparisons, and the engineer named the risk in
its own `decision` note with the right tickets attached (`ABC-079`, `ABC-080`, `ABC-081`). **The
defect is not that the code was duplicated. It is that the coupling test was sized to the ticket's
sentence rather than to the risk the duplication creates** — one position, one depth, the move
only, when the risk is score drift across the whole corpus. **The fix is cheap, it is entirely in
test code, it needs no production change, and it must not touch `ABC-077`'s merged `A6`.**
