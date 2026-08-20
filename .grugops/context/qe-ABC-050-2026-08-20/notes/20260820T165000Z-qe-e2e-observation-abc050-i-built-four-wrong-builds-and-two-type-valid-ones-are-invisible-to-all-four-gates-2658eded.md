---
id: 20260820T165000Z-qe-e2e-observation-abc050-i-built-four-wrong-builds-and-two-type-valid-ones-are-invisible-to-all-four-gates-2658eded
kind: observation
by: qe-e2e
at: 2026-08-20T16:50:00Z
verified_by: ""
confidence: high
refs:
  - ABC-050
  - vitest.config.ts
  - src/glyph-mode.nfr.test.ts
  - NFR-008
supersedes: ""
type: observation
task: qe-ABC-050-2026-08-20
role: qe-e2e
ticket: ABC-050
created: 2026-08-20T16:50:00Z
tree: grugops/abc050-lane-runner-guard @ ca50b26 (probes run in a scratch copy)
---

# `A2`: the widening CATCHES, I reproduced it — and I then built the type-valid defect the engineer said would slip. It slips. Two of my four wrong builds are invisible to all four mandatory gates.

Four wrong builds, each planted in a **scratch copy** of the tip tree, all four gates run unpiped
against each, each reverted and byte-compared back to the original. **None was ever planted in the
repository.**

| # | wrong build in `vitest.config.ts` | type-valid? | lint | typecheck | build | test | suite |
|---|---|---|---|---|---|---|---|
| 1 | `pool:` -> `poool:` (mistyped key) | no | **0** | **2** | **2** | **0** | 40 files, **1207 passed — FULLY GREEN** |
| 2 | `isolate: false` added | **yes** | **0** | **0** | **0** | **1** | 5 files failed, **9 tests failed** |
| 3 | `"**/glyph-mode.nfr.test.ts"` added to `exclude` | **yes** | **0** | **0** | **0** | **0** | **39 files, 1204 passed — GREEN** |
| 4 | `".claude/**"` -> `".cluade/**"` (typo'd glob) | **yes** | **0** | **0** | **0** | **0** | **40 files, 1207 passed — GREEN, counts IDENTICAL** |

## `A2` is MET, and the tool that caught it is named

**Probe 1 reproduces the engineer's result exactly.** `npm run typecheck` exits **2** with
`vitest.config.ts(73,5): error TS2769: No overload matches this call` — and it is `vitest.config.ts`
by name, which is the point: before this ticket `tsc` never opened the file. `npm run build` is the
same `tsc --noEmit` and exits 2. **`npm run lint` exits 0 and does not catch it**, and never will —
Biome is not a type checker. The defect silently discards `pool: "threads"`, the suite stays
**fully green at 1207/1207**, and before `ABC-050` nothing in the repository would have said a word.
**The widening is not cosmetic.**

## The engineer's stated limit is REAL, and I can now say exactly how real — this is `A2`'s NAMED RESIDUAL, not a failure

`A2` asks for one wrong build that is caught. It got one. Nothing in `A2` promises that every defect
in this file is visible, and the engineer said so plainly rather than letting the green imply it.
**Confirmed, and sharpened:**

- **Probe 2 (`isolate: false`) — better than claimed.** Neither static tool sees it, but `npm test`
  **does**: 9 failures across 5 files. The lever `vitest.config.ts`'s own header warns about is
  **not** a silent-green defect on today's suite. That is a point in the delivery's favour and the
  engineer under-claimed it.
- **Probe 3 — the one that matters, and it is worse than "not caught".** A single type-valid
  `exclude` entry **deletes `ABC-050`'s own guard from the lane**, and `lint`, `typecheck`, `build`
  and `test` **all exit 0**. The only trace is the counts moving `40 -> 39` files and `1207 -> 1204`
  tests, and **no gate compares those counts to anything**. `A3` compares them by hand at one hop;
  nothing compares them tomorrow.
- **Probe 4 — completely invisible.** A one-character typo in an existing `exclude` glob passes all
  four gates **with the counts unchanged**. It is undetectable by any instrument this repository
  owns. Today it is harmless only because the 37 agent worktrees were deleted in `d127ae3`; the same
  typo before that commit would have re-admitted **1191 extra test files** into the lane.

**Named residual, recorded rather than glossed: after `ABC-050` the lane config is guarded against
mistyped and mistyped-key defects by `typecheck`/`build`, and against `isolate: false` by the suite,
but a type-valid `exclude` glob can silently change or remove what the lane collects with every
mandatory gate green.** The instrument that would close it is a lane-inventory assertion (the
collected test-file set, or its count, asserted against a recorded expectation) — which is a new
ticket, is out of `ABC-050`'s scope by its own `## Out of scope` fence, and is **not** grounds to
hold this delivery.
