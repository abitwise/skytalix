---
id: 20260813T011000Z-security-nfr-observation-nfr002-re-derived-from-the-loops-side-on-two-of-my-own-instruments-1bf64fde
kind: observation
by: security-nfr
at: 2026-08-13T01:10:00Z
verified_by:
confidence: high
refs:
  - ABC-019
  - ABC-017
  - ABC-029
  - NFR-002
  - ADR-0002
  - ADR-0011
  - src/turn-loop.ts
  - src/history.ts
  - plans/nfr-catalog.md
supersedes:
---

# `NFR-002` re-derived FROM THE LOOP'S SIDE, on two of my own instruments — and its binding clause spied independently

The brief asked for the `ABC-029` standard: a **TypeScript parser rather than a regex**, so the
instrument cannot inherit the guard's blind spots, and **each production module rooted in its own
child**. I built both, from scratch, and did not read the merged guards' code first.

## Instrument 1 — STATIC, on the TypeScript compiler's own parser

`ts.createSourceFile` + AST walk over every non-test `.ts` in `src/` (**17 production modules**),
`typescript 5.9.3`. It resolves **every** specifier form the compiler recognises — `import`,
`import type`, per-specifier `type` modifiers, bare side-effect `import "x"`, `export … from`,
dynamic `import()`, `require()`, `import x = require()` — and separates **runtime** edges from
**type-only** edges, which a regex cannot do at all.

**Why the distinction is load-bearing:** `import type` is erased by the compiler and creates no
runtime edge. A regex that matches `from "./history.ts"` counts `history-pane.ts` and
`status-panel.ts` as importers of `history.ts`. They are not — they import it **as a type only**,
and my instrument says so:

- **RUNTIME importers of `src/history.ts`: exactly one — `turn-loop`.**
- TYPE-ONLY importers of `src/history.ts`: `history-pane`, `status-panel`, `turn-loop`.
- **Importers of `turn-loop.ts`, of any kind: ZERO.** Nothing in `src/` reaches the loop.
- **Non-literal dynamic imports: ZERO** — so the static graph is complete, with no blind spot from
  a computed specifier. This is the same "cleaner than claimed" result `ABC-029`'s gate recorded,
  re-derived here rather than inherited.

## Instrument 2 — DYNAMIC, one child process per root

`node:module` `registerHooks` `load` hook, **one fresh child process per root**, 17 roots, so no
other root's module cache can contaminate any measurement. Each child appends every resolved load
incrementally, so a root whose body runs work still yields a complete graph. **All 17 children exited
cleanly.**

## The two instruments agree on every root — 17/17 identical, zero disagreements

| root | runtime closure | size |
|---|---|---|
| `frame` | *(empty)* | **0** |
| `render` | `position` | 1 |
| `glyph-mode` | *(empty)* | 0 |
| `history-pane` | `apply fen legal moves position san` | 6 |
| `status-panel` | `apply fen legal moves position san` | 6 |
| **RENDER CLOSURE UNION** | `apply fen frame glyph-mode history-pane legal moves position render san status-panel` | **11** |
| `turn-loop` | `apply fen frame gameend history legal moves position zobrist` | 9 |

**`history.ts` is NOT in the render closure. `turn-loop.ts` is NOT in the render closure.**

**The zero is not a blind zero — the positive control fires.** The same instruments rooted at
`turn-loop.ts` **DO** report `history.ts`. An instrument that cannot see what it should see is not
evidence, and this one can.

**`NFR-002`'s premise is MET from the loop's side.** The row's own words scope it to *a renderer* and
*a frame* — *"the quantity belongs to the LOOP (`ABC-019`), not to a frame"*. The loop holding the
derive is that sentence being **satisfied**, not breached: no renderer pulls the repetition derive
into a frame, and the loop is not reachable from a frame's assembly by any path, because nothing
imports it.

**Count discrepancy, stated rather than smoothed:** the brief said `ABC-029`'s gate rooted **16**
modules; I rooted **17**. I did not reconcile the difference by adjusting mine — I report what I
measured. The extra root is most likely `perft-bench.ts`, which `ABC-029`'s probe has cause to
exclude (its module body calls `main()` at import, which is `S-1`'s stdout-channel territory). My
harness rooted it anyway, in its own child, and it exited cleanly.

## THE CLAUSE THAT ACTUALLY BINDS — `A3b`, spied at the module boundary on my own instrument

The ticket is right that the clock cannot do this job, and I re-derived **both halves** of that.

My spy is a `registerHooks` **`resolve`** hook that redirects the LOOP'S OWN module edge to
`./history.ts` (and `history.ts`'s edge to `./gameend.ts`) to counting shims that re-export the real
modules. Every other importer sees the originals. **This is not `vi.mock` and it is not a re-run of
the delivered suite** — it is an independent instrument for the same property.

| run | N | `gameStatus` calls | expected `N+1` | `repetitionCounts` at the boundary | frames | `1+plies+re-emitting` |
|---|---|---|---|---|---|---|
| already-terminal start (`1k6/8/8/8/8/8/1K6/2n5 w - - 0 1`) | 0 | **1** | 1 ✅ | **0** ✅ | 1 | 1 ✅ |
| scripted, no non-advancing outcome | 6 | **7** | 7 ✅ | **0** ✅ | 7 | 7 ✅ |
| **scripted, `k` = 3 non-advancing outcomes** | 12 | **13** | 13 ✅ | **0** ✅ | 16 | 16 ✅ |
| scripted | 40 | **41** | 41 ✅ | **0** ✅ | 41 | 41 ✅ |

The third row is the sharp one: with **three** non-advancing outcomes the count still reads `N + 1`,
so a non-advancing outcome adds **exactly zero** evaluations — `A3b`(a)'s own clause, measured rather
than accepted. `gameStatusOf` carries **every** derive (`N+1` in all four runs), which is `ADR-0002`
clause 4's single supplier holding, and `A2`'s cadence formula holds in all four including
`16 = 1 + 12 + 3`.

## The timing half — own harness, own process, out of tree

Warm-up round discarded, **8 usable rounds × 400 iterations**, cell order **rotated every round**,
medians of per-round means, game built by `src/history.test.ts`'s LCG so a ply count means the same
thing here as in the suite. **Apple silicon / `darwin-arm64` / Node v24.12.0; `UNKNOWN - verify`
elsewhere.**

| plies | 1 derive/ply | **2 derives/ply** | 1 derive + `legalMoves` | bar | correct vs bar | marginal vs bar | **wrong build vs bar** |
|---|---|---|---|---|---|---|---|
| 40 | 20.63 µs | 41.17 µs | 23.19 µs | ≤ 45 µs | **0.46x MET** | 0.52x MET | **0.91x — ALSO MET** |
| 120 | 47.71 µs | 95.53 µs | 50.87 µs | ≤ 100 µs | **0.48x MET** | 0.51x MET | **0.96x — ALSO MET** |
| 300 | 94.09 µs | 189.09 µs | 96.62 µs | ≤ 200 µs | **0.47x MET** | 0.48x MET | **0.95x — ALSO MET** |

**`NFR-002` per-ply: MET at every one of the three ply counts, on my own instrument.** My
0.46x / 0.48x / 0.47x agree with the ticket's recorded 0.46x / 0.48x / 0.48x within ~1%.

**And point 1 of the ticket's own re-derivation is CONFIRMED independently: a two-derives-per-ply
build MEETS the bar at every ply count** — 0.91x / 0.96x / 0.95x. **The timing clause cannot resolve
the 2x error it exists to forbid. `A3b`'s spied count is what binds, and it holds exactly.**

**On the marginal figures and the record: I do not propose replacing it.** The record is the
Engineer's more conservative **0.61x / 0.59x / 0.56x**; QE last read **0.47x / 0.51x / 0.43x**; I read
**0.52x / 0.51x / 0.48x**, between the two. **All three readings are MET at all three ply counts, so
nothing turns on which is quoted, and the conservative one should stay the record.** **No bar moves
and none is proposed.** `plans/nfr-catalog.md` was not opened for edit — the brief made it mine only
if a bar genuinely moves, and none does.

## `NFR-004` and the suspension rules — checked, not skipped

- **`NFR-004` is `EPIC-004`'s target and is NOT a bar this ticket is measured against.** What binds
  here is that the engine seam is asynchronous by contract, and it is: measured across a real
  macrotask suspension, the frame after the suspension **matches the live position at that moment**,
  never a pre-suspension snapshot (`A15`/`A16`).
- **No `Position` reference is held across a suspension** — verified by reading, and structurally:
  the loop re-reads `history` and recomputes `status` inside the iteration, and holds no derived
  value across either `await`.
- **The loop reads NO ambient state.** `grep` for `process.` / `globalThis` / `__dirname` /
  `import.meta` on non-comment lines of `src/turn-loop.ts` returns **nothing** — the only mention of
  `process.stdout` in the file is a JSDoc sentence. It discovers nothing and defaults nothing, exactly
  as `## Scope` claims, and that is now measured rather than asserted.
