---
id: 20260818T002200Z-qe-e2e-observation-a6-broken-by-nullish-default-7b31de92
kind: observation
by: qe-e2e
at: 2026-08-18T00:22:00Z
verified_by:
confidence: high
refs:
  - ABC-077
  - RISK-002
  - src/search.ts
  - src/search.test.ts
  - src/search.qe.test.ts
supersedes:
---

# `G1` — I broke `A6`. One operator defeats all three of its assertions.

`A6` is `RISK-002`'s only falsifiable expression at this layer, and the ticket says so: *"a default depth is a fixed-depth per-move budget wearing a parameter's name."* The criterion is right. **The guard is not sufficient**, and the brief's prediction that source regexes are brittle is confirmed by a working bypass, not by an argument.

## The bypass

```ts
export function search(position: Position, depth: number): SearchResult {
  return searchRoot(position, depth ?? 4, true);   // <- one operator
}
```

Applied to `src/search.ts` on the tip, then reverted. **Everything stayed green:**

| check | result under the bypass |
|---|---|
| `A6` exports set equality (`MATE_SCORE`, `search`, `searchWithoutPruning`) | **passes** — unchanged |
| `A6` `Function.length === 2` on both exports | **passes** — `??` is not a defaulted parameter |
| `A6` source regex `/depth\s*\??\s*(:\s*[\w<>[\]\| ]+)?\s*=[^=>]/` | **passes** — there is no `=` to find |
| `A6` `/default_?depth/i` | **passes** — no such token |
| `A6` no-clock regex | **passes** |
| `npm run typecheck` (`tsc --noEmit`) | **exit 0** |
| `npm run lint` (`biome check .`) | **exit 0, no fixes** |
| `npx vitest run src/search.test.ts` | **28/28 pass** |

And the module then does the forbidden thing. Run on the bypassed tree:

```
search(position) with NO depth argument -> {"score":0,"move":{"from":1,"to":34,...},"nodes":6065}
```

That is a move selected at a **fixed depth 4** with nothing supplied by the caller. `A6`'s own words — *"no function that selects a move without a caller-supplied depth"* — are false while `A6` is green.

**The regex class is the problem, not this regex.** `?? 4`, `|| 4`, `depth < 1 ? 4 : depth`, or a defaulted property on an options object all read a default without writing `depth =`, and `Function.length` counts parameters, not intentions. Tightening the pattern buys the next bypass.

## What I added instead: `QE-G1`, in `src/search.qe.test.ts`

Assert the **behaviour**, which is what the criterion is actually about: call each exported function with the depth argument omitted, and require that **no move comes back** — either it throws or `move` is `null`. On the delivered tip it throws (`RangeError`, depth `undefined` never reaches the `depth <= 0` base case), which is a pass: a module with no default cannot answer *"what move should I play"*.

Verified both directions:

- on the **delivered tip**: `QE-G1` 2/2 green;
- on the **bypassed tree**: `QE-G1` **2 failed**, while all 28 of `src/search.test.ts` stayed green.

The fixture is bare kings (`7k/8/8/8/8/8/8/K7 w - - 0 1`) so the stack unwind costs ~5 ms rather than ~300 ms.

## What this does NOT mean

**`src/search.ts` as delivered is clean.** It has no default, no move-picking export and no clock; I verified that by hand and `QE-G1` passes on it unmodified. The finding is about the guard's strength, not about the code it guards. `RISK-002` is not breached today — it was merely unprotected against tomorrow.
