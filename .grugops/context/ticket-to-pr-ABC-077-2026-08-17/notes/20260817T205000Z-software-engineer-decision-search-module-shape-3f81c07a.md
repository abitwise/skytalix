---
id: 20260817T205000Z-software-engineer-decision-search-module-shape-3f81c07a
kind: decision
by: software-engineer
at: 2026-08-17T20:50:00Z
verified_by:
confidence: high
refs:
  - ABC-077
  - ABC-078
  - RISK-002
  - src/search.ts
  - src/search.test.ts
  - plans/tickets/ABC-077-negamax-alpha-beta-core.md
supersedes:
---

# `ABC-077` — the delivered module, its path, and the shape `A6` reads

## The path is `src/search.ts`, and `A6` names it

The ticket page names no path (`G3` in the Orchestrator's `Ready for Dev` note). I chose
**`src/search.ts`**, flat in `src/` like every other module here, and **`A6`'s shape assertion reads
that file by name** — `readFileSync(new URL("./search.ts", import.meta.url))` — with a first
assertion that the read returned something (`length > 1000`, contains `export function search(`)
so the guard can never silently assert over an empty string.

## The exported surface, and why it cannot answer "what move should I play"

```
MATE_SCORE            30_000
search(position, depth)              -> { score, move, nodes }
searchWithoutPruning(position, depth) -> { score, move, nodes }   TEST-ONLY
SearchResult                          type only
```

`Object.keys` of the module is exactly `["MATE_SCORE", "search", "searchWithoutPruning"]` and `A6`
asserts that equality, so a later "give me a move" export cannot appear here unnoticed — it would
red this file rather than quietly take `ABC-078`'s job. **Neither function has a default for
`depth`**, asserted three ways: `Function.length === 2` on both (a default drops it to 1), a source
regex for a defaulted/optional `depth`, and a regex for any `DEFAULT_DEPTH`-shaped identifier.
`A6` additionally asserts the module contains **no clock at all** (`Date.now`, `performance.now`,
`hrtime`, `setTimeout`) — the wall clock is `ABC-078`'s and this makes that a criterion instead of
an intention.

## Design choices inside the recursion

- **Fail-soft alpha-beta.** The returned value may fall outside the window. The ROOT opens a full
  `[-Infinity, +Infinity]` window and never cuts off, so the root score is EXACT — which is what
  makes `A1` a property of alpha-beta rather than a coincidence of these six positions.
- **Mate distance from the root.** A side mated `ply` plies from the root scores `-(MATE_SCORE -
  ply)`, so mate in 1 (`MATE_SCORE - 1`) beats mate in 2 (`- 3`) beats mate in 4 (`- 7`). `A3` reads
  those exact integers rather than "is large".
- **`gameStatus` at leaves only.** At `depth <= 0` the leaf asks `gameStatus(position)` with NO
  counts map — `ADR-0002` keeps `positionCounts` optional exactly so a bare call is legitimate here.
  It costs one legal-move generation, the same one an interior node pays for its own move list, so
  nothing is generated twice. It also catches the drawn terminals an empty move list does not (dead
  position by material, seventy-five moves). At INTERIOR nodes terminality is decided from the move
  list already in hand: empty + in check is mate, empty otherwise is stalemate.
- **In-tree repetition is NOT detected**, deliberately: no counts map is passed, because repetition
  is `ABC-081`'s along with the key array it shares (`ADR-0002` clause 3).
- **The pruning-disabled mode is a TEST-ONLY door, not an option** (coding rule 7). It is the
  private `prune` parameter of the internal recursion, reachable only through the exported
  `searchWithoutPruning`, whose docblock says in as many words that nothing in production calls it.
  There is no config, no env var and no options object.
- **`0 - x` rather than `-x` at every negation.** `-0` is `Object.is`-distinct from `0`, and `A5`
  asserts stalemate is EXACTLY `0`. `src/evaluate.ts` guards the same trap for the same reason and
  says so; this module follows its spelling rather than inventing a second one.
- **Moves are searched in generation order.** No ordering (`ABC-080`), no quiescence (`ABC-079`), no
  table (`ABC-081`). The measured pruning ratios are therefore a FLOOR, not a target.
- **Single-threaded, deciding nothing.** `ADR-0005` `F6` is `UNKNOWN - verify` and is
  Architect/Design's; this module starts where every shape of that decision starts.

## One shape the page did not specify: `depth < 1` at the root

`search(position, 0)` returns `{ score: leafScore(position, 0), move: null, nodes: 1 }`. A caller
CAN pass 0 — iterative deepening starts somewhere — so this is not impossible-scenario handling
(rule 8); it is the honest answer that a zero-ply search selects no move. `A5` exercises it: the
stalemate fixtures are scored at depths 0, 1, 2 and 3, and depth 0 goes down this path while 1-3 go
through the root's own terminal branch, so both terminal branches are covered.
