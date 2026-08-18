---
id: 20260818T120200Z-orchestrator-observation-anchors-remeasured-at-head-b2c3d4e5
kind: observation
by: orchestrator
at: 2026-08-18T12:02:00Z
verified_by:
confidence: high
refs:
  - ABC-078
  - ABC-033
  - src/turn-loop.ts
  - src/search.ts
  - src/frame.ts
  - src/coordinate-move.ts
  - src/san.ts
supersedes:
---

# `Ready for Dev` exit — every line anchor the two pulled tickets cite, re-measured at `main` HEAD `16e9269`

First-hand `grep -n` at HEAD, not read off the pages. The ticket pages were re-scored against
HEAD `7ea9e1b`; `main` has advanced by three bookkeeping commits since (`b7e6b3b`, `0b6b0fc`,
`16e9269`) which touched no file under `src/`. Take these as given; do not re-derive them.

## HOLDS — every anchor `ABC-078` cites

| cite | measured at HEAD | verdict |
|---|---|---|
| `EngineSeam` @ `src/turn-loop.ts:138` | `:138` `export type EngineSeam = (history: GameHistory) => Promise<Move>;` | **exact** |
| `search()` @ `src/search.ts:167` | `:167` `export function search(position: Position, depth: number): SearchResult` | **exact** |
| `SearchResult` @ `:42` | `:42` `export interface SearchResult` | **exact** |
| `searchWithoutPruning` @ `:178` | `:178` | **exact** |
| `MATE_SCORE` @ `:40` | `:40` `export const MATE_SCORE = 30_000;` | **exact** |
| `InputSeam` @ `src/turn-loop.ts:127` (cited by `ABC-037`) | **`:135`** | **DRIFTED by 8** |

## HOLDS — the anchors `ABC-033` cites

| cite | measured at HEAD | verdict |
|---|---|---|
| `PromptOutcome` @ `src/turn-loop.ts:125` | `:125` | **exact** |
| `parseCoordinateMove` @ `src/coordinate-move.ts:77` | `:77` | **exact** |
| `CoordinateParseResult` @ `:51` | `:51` | **exact** |
| `parseSan` @ `src/san.ts:223` | `:223` | **exact** |
| `SanParseResult` @ `:190` | `:190` | **exact** |
| `MESSAGE_ROWS` @ `src/frame.ts:45` | `:45` `export const MESSAGE_ROWS = 2;` | **exact** |
| `PROMPT_ROWS` @ `src/frame.ts:53` | `:53` | **exact** |

## STALE — two anchors on `ABC-033`, corrected here

Both are in `src/frame.ts` and both are cited in load-bearing places (`A4` and the security
section). **Do not follow the page's numbers.**

- **the `+N` marker, cited `src/frame.ts:182-188`** → measured **`:134-141`**: `markerFor(hidden)`
  at `:134`, `withMarker(rows, hidden)` at `:136-141`, and `packRegion(items, hidden, width)` at
  `:149`. `withMarker` has a real `if (hidden === 0) return rows;` no-op path at `:137`, which is
  exactly what `A4`'s *"hidden count is exactly 0"* asserts against.
- **the sanitizer, cited `src/frame.ts:202`** → measured **`:123`**: `function sanitize(text: string, mode: GlyphMode): string`.
  It is module-private, not exported. `ABC-033`'s security claim — *"every message reaches the
  terminal through `assembleFrame`, which sanitizes"* — is unchanged in substance; only the number
  moved.

`ABC-037` cites `src/frame.ts:202` for the same sanitizer and `src/turn-loop.ts:168` for
`INPUT_ENDED_NOTICE`. The first is stale by the same 79 lines. **The second was not measured at
this hop** — `ABC-037` is not pulled, and I am not reporting a number I did not take.

## One live guard both engineers must know about

`src/cli.test.ts` **no longer hard-codes the production-module count** — `ABC-103` closed
2026-08-18 for exactly that reason. `productionModules()` is computed at `src/cli.test.ts:51`. Both
of these tickets add a module under `src/` (59 entries there today) and **neither should red that
guard**. If either does, it is a finding about the guard, not a licence to edit the count.
