---
id: 20260812T180000Z-architect-design-observation-module-graph-as-built-7c41b9e2
kind: observation
by: architect-design
at: 2026-08-12T18:00:00Z
verified_by:
confidence: high
refs:
  - arch-audit-2026-08-12
  - memory-bank/30-architecture.md
  - src/
  - ADR-0011
supersedes:
---

# The as-built module graph, rebuilt from imports: 17 modules, 49 edges, ZERO cycles, depth 8

> **Hand-authored.** `scripts/context-io.ts` does not exist in this repo or in the kit (verified at
> this hop — there is no `scripts/` directory at all), and `mcp__grugops__propose_note` is not in
> this session's tools. `human_admission` is `off` and no `§14-gate` stamp exists under this task.
> **This is not a `finding` and carries no stamp.**

## How it was measured

Every relative import in the 17 non-test `.ts` files was extracted by regex over the source and the
graph rebuilt from it. **A first pass using a line-oriented `grep` was WRONG and is recorded because
it nearly produced a false headline**: eight modules import `position.ts` with a MULTI-LINE
`import { … }` block, so a `grep` requiring `import` and `from` on one line reported
`render.ts` as importing nothing and would have been published as *"`render.ts` is now a leaf"*. It
is not. The cross-check that caught it was listing every line matching `from "./` regardless of
which keyword began the statement.

No re-export (`export … from`) and no dynamic `import()` or `require()` exists in production source
— checked, so the static graph is the whole graph.

## The graph

**17 production modules, 49 import edges, ZERO cycles, longest path 8 levels.**

```
L1  position
L2  fen  moves  render
L3  apply  frame  glyph-mode
L4  legal
L5  perft  san  zobrist
L6  gameend  perft-bench
L7  history
L8  history-pane  status-panel  turn-loop
```

Fan-in: `position` **11** (of the other 16), `moves` 8, `apply` 6, `legal` 6, `fen` 4, `gameend` 3,
`history` 3, `render` 2, `san` 2, `zobrist` 2, `frame` 1, `perft` 1.

**`position.ts` is still the only leaf and still the hub.** **Five modules have zero importers** —
`turn-loop`, `status-panel`, `history-pane`, `glyph-mode`, `perft-bench`. That is the signature of a
system whose top layer is not yet driven by anything, and `EPIC-006`'s entry point is what will
import four of the five.

## The finding inside the finding: 12 of the 49 edges are TYPE-ONLY and erased at runtime

Under `verbatimModuleSyntax` an `import type` compiles to nothing. Separating them gives a
materially different runtime graph — **37 edges**, and two consequences that matter:

| edge | full graph | runtime |
|---|---|---|
| `frame` → `render`, `glyph-mode` → `render` | 2 importers | **`render.ts` has ZERO runtime importers** |
| `status-panel` → `history`, `history-pane` → `history` | 3 importers | **`turn-loop.ts` is the SOLE runtime importer of `history.ts`** |

The second line is `ADR-0002` clause 4's single-supplier rule and is exactly what `ADR-0011`
clause 3's licence `["turn-loop.ts"]` asserts — **so the licence is correct today, and it is correct
for a reason the text-scanning guard cannot see.** A guard reading source text would count three
importers of `history.ts`; the property is about module *evaluation*, which is why `NFR-002`'s probe
spawns a child and records loads instead of pattern-matching. **`frame.ts`'s runtime closure is
itself alone**, which is `ADR-0011`'s measurement reproduced independently here.

## Cross-check against ADR-0011

Reproduced exactly: the render closure rooted at the five declared frame producers is **11
modules** and `history.ts` is **not** among them. `perft-bench.ts` is still the **only** module with
zero exports (the other 16 export 1–23), so `ADR-0011` clause 4's mechanical *entry point*
definition still selects exactly one file.
