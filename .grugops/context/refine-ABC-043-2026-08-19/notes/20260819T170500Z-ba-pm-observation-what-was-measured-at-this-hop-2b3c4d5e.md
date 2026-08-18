---
id: 20260819T170500Z-ba-pm-observation-what-was-measured-at-this-hop-2b3c4d5e
kind: observation
by: ba-pm
at: 2026-08-19T17:05:00Z
verified_by:
confidence: high
refs:
  - ABC-043
  - ABC-108
  - NFR-008
  - ADR-0011
supersedes:
---

# What was MEASURED at this hop — the substitution probes, the blockers, and the child's price

Everything below was run at `main` `e70fda1` (branch `grugops/refine-abc043`, zero `src/` changes).
The substitution probes ran on a **throwaway three-file replica in the scratchpad, outside the
repository**: no repository file was written by any measurement, and none was read into a build.

## 1. The blockers, re-measured rather than re-asserted

| recorded blocker | state today | evidence |
|---|---|---|
| `ABC-041`, `ABC-042` must land | **DISCHARGED** | both in `Done`; `src/cli.ts` calls `makeRenderSeam` |
| `ABC-037` must land | **DISCHARGED** | merged; `createLineInputSeam` at `src/line-input.ts:150` |
| *"NO `EngineSeam` EXISTS"* | **FALSE TODAY** | `createEngine(options): EngineSeam` at `src/engine.ts:305` |
| `src/cli.ts` exports | **0**, and correctly so | `ADR-0011` clause 4, pinned by `ABC-042` `A2` |

## 2. Module substitution into a spawned child — four probes, Node **v24.12.0**

| probe | result |
|---|---|
| child spawned `node --import <hook> entry.ts`, hook `registerHooks({load})` replaces `./engine.ts` with a throwing `createEngine` | fault reached the entry point's own `try`/`catch`; **process exit code 7** |
| identical child, **no** `--import` | real module, **exit 0** — production is untouched by the rig existing |
| hook passed as **`data:text/javascript,<encodeURIComponent(source)>`** instead of a file path | **works** — zero new files; the rig is a string in the test file |
| substituted module containing `import { helper } from "./helper.ts"` | **resolves** against the replaced module's own URL — so a deterministic double may call the real `legalMoves` |

**The two things this rules out, stated as facts rather than as opinions:** no export is needed, and
no env var read by production code is needed.

## 3. The merged engine is NOT deterministic through the entry point

`createEngine` runs iterative deepening against a wall clock (`DEFAULT_BUDGET_MS` = 3 s,
`src/engine.ts:83`). The depth completed — hence the move chosen — depends on hardware and load.
**Consequence for `A2`:** a scripted line asserted against the real search would be flaky, and would
cost 3 s of wall per engine ply against `NFR-008`'s 3 s wall clause for the whole lane.

## 4. The price of a child, measured — and the lane it lands on

`node src/cli.ts`, board-only, stdio piped, n=7, this machine, this hop:

```
61.9 62.1 62.1 62.5 62.8 62.9 67.6  ms wall   ->  median 62.5 ms
```

`ABC-043`'s criteria force **7** children (the `N8-SPAWN` row now on the ticket) ≈ **0.44 s**, and an
`ABC-043` child loads `turn-loop` + `line-input` + the double on top of the board path, so **62.5 ms
is a floor, not an estimate of the real thing**.

**The lane those 0.44 s land on is the one `ABC-108` says is already over its clause**: default lane
median **13.400 s CPU against `NFR-008`'s 13 s**, n=8 (`plans/board.md`, 2026-08-18), with the board's
own words — *"until it is ruled, `N8-LANE` cannot honestly be granted to any ticket"*. **That is why
`ABC-043`'s re-scored DoR keeps one ⚠️ at item 6**, and it is Architect/Design's `OQ-1`, not this
ticket's.

## 5. Facts the engineer will need, found while reading

- `src/cli.test.ts` spawns **TEN** children and pins the number mechanically at `:950`; the ticket's
  old test note asking for *"single digits across both tickets"* was unachievable the day `ABC-042`
  merged. **Struck and replaced by the criterion-derived count of 7 (pin 10 → 17).**
- `childOf` spawns with `stdio: ["ignore", "pipe", "pipe"]` (`src/cli.test.ts:120-126`) — **no stdin**.
  Every `ABC-043` criterion feeds a script, so the one helper gains piped input. `spawnSync` must stay
  the **only** `node:child_process` import with **exactly one call site** (`:961-965`), and that guard
  stays green.
- A hook file placed outside `src/` would fall outside **both** `tsconfig.json`'s and `biome.json`'s
  `includes` — neither typechecked nor linted, the trap `vitest.config.ts`'s header already records.
  The `data:` URL avoids the question entirely.
