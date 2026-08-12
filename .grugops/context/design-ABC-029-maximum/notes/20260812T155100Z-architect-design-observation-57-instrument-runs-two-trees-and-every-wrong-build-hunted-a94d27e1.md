---
id: 20260812T155100Z-architect-design-observation-57-instrument-runs-two-trees-and-every-wrong-build-hunted-a94d27e1
kind: observation
by: architect-design
at: 2026-08-12T15:51:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ADR-0011
  - ADR-0002
  - D27
  - NFR-002
  - EPIC-006
  - src/history-pane.nfr.test.ts
  - src/perft-bench.ts
  - src/gameend.ts
  - src/perft.ts
  - src/zobrist.ts
  - src/status-panel.ts
supersedes:
---

# The measurement — 57 runs of the REAL instrument under REAL vitest on TWO out-of-tree trees, plus two full-suite runs; every verdict below was RUN

> **`kind: observation`, not `finding`, and that is FORCED rather than chosen** — there is no
> `§14-gate` verdict record under task `design-ABC-029-max-2026-08-12` and `context.human_admission`
> is **`off`**. `confidence: high` because **every cell below is a run, not a derivation** — that is
> the difference from the parent hop's table, which was explicit that it derived by reading. **Nothing
> is self-stamped and no gate verdict is claimed.**
>
> **What the reader should do with a disagreement:** the harness is 200 lines and every build is
> specified by its exact appended text, so any row is reproducible in minutes. **Treat a disagreement
> as mine.**

## The replica, and how it was verified before anything was built on it

- **`tree16`** — the current merged tree's `src/`, 16 non-test `.ts` files, copied out of tree.
- **`tree17`** — the same, plus `turn-loop.ts` restored **from the git object database**
  (`git show grugops/ABC-019-turn-loop-skeleton:src/turn-loop.ts`), md5
  **`bd793612476c9d0eac28b75e1e3297cc`** — **reproducing the figure `ADR-0011` records.** **The
  `ABC-019` worktree was never opened**, and no other worktree was entered.
- **A precision the instrument's own docblock gets slightly wrong, checked because it is load-bearing
  for the two-tree method.** It says this tree and *"`ABC-019`'s tree with `turn-loop.ts` deleted"*
  are *"the same 16 files"*. Measured by `cmp` against the tip: **15 of 16 are byte-identical;
  `history-pane.ts` differs.** The difference is **one sentence inside a docblock** (`:30`,
  *"so `src/history.ts` keeps its zero runtime importers"* → *"IT ADDS NO RUNTIME IMPORTER OF
  `src/history.ts`"*); the `import type` line at `:61` is byte-identical. **No guard on either side
  can see it, so the method holds — but the docblock's word *"same"* is now false in the strict
  sense.** Flagged, **not fixed**: the file is the Engineer's this hop.
- **Nothing in any repository worktree was written by any measurement.** `git diff --stat -- src/` is
  empty on this branch, verified after the fact.

## The discriminator, re-measured rather than inherited

`ADR-0011` clause 4 — *an entry point is a production module that exports nothing.* Re-measured over
all 16 production modules this hop: **`perft-bench.ts` is the only module with ZERO `export`
tokens**; the other 15 have **1 to 23**. The boolean is identical under an anchored `/^export\b/m`
and an unanchored `/\bexport\b/`, so it does not turn on the spelling. **The discriminator is real
and it is filename-free.**

## The three expressions

```
delivered (shipped)   /^import\s+(?!type\b)[^;]*from\s+"\.\/history\.ts";/m
widened   (RULED)     /^(?:import|export)\s+(?!type\b)(?:[^;]*from\s+)?"\.\/history\.ts";/m
exports   (BA/PM's)   widened || ( /^export\b/m && /\bimport\(\s*"\.\/history\.ts(?:\?[^"]*)?"\s*\)/ )
dynall    (control)   widened || /\bimport\(\s*"\.\/history\.ts(?:\?[^"]*)?"\s*\)/     ← alternative 9 as stated
```

## Table A — the counterexample WORKS. 12 of 12, no criterion broken.

| build | tree | `widened` | **`exports`** | required by |
|---|---|---|---|---|
| **BASE** | 16 · 17 | green/green 8/8 | **green/green 8/8** | everything |
| **`WPERFT-DYN`** | 16 · 17 | green | **green both** | **`A3`, `A6.2`** |
| `WOFFFRAME-DYN` (`zobrist.ts`) | 16 | green | **regex RED** | — recovered |
| `WQUERY-OFFFRAME` (`zobrist.ts`) | 16 | green | **regex RED** | — recovered |
| `WGAMEEND-DYN` · `WGAMEEND-QUERY` | 16 | green | **regex RED** | — recovered |
| `WPERFTMOD-DYN` · `WPERFTMOD-QUERY` | 16 | green | **regex RED** | — recovered |
| `WLAUNDER` | 16 · 17 | regex RED | **regex RED both** | `A6.1` |
| `WOFFFRAME-BARE` · `WREEXPORT-STAR` | 16 | regex RED | **regex RED** | `A6.1` |
| `WTYPEREEXPORT` · `WTYPEREEXPORT-PANEL` | 16 | green | **green** | `A6.2` |
| `WPERFT-STATIC` · `WOFFFRAME-STAT` | 16 | regex RED | **regex RED** | ledger |
| `WSTALELICENCE` | 17 | regex RED | **regex RED** | `A5.3` |

**Full suite under `exports`, out of tree: 752 passed (752) on 26 files.**

**The control confirms the original reason was aimed correctly.** `dynall` — the same dynamic rule
applied uniformly, which is alternative 9 as `ADR-0011` states it — reds `WPERFT-DYN`:
`expected [ 'perft-bench.ts' ] to deeply equal []` on 16, and
`expected [ 'perft-bench.ts', 'turn-loop.ts' ] to deeply equal [ 'turn-loop.ts' ]` on 17.
**Alternative 9 is still correctly rejected. The sentence generalising from it was not.**

## Table B — the wrong builds hunted AGAINST the new rule, which is why it is declined

| wrong build | construction | `widened` | **`exports`** | comment-aware variant |
|---|---|---|---|---|
| **`WPERFT-DYN-EXPORTING`** | the ruled-not-a-breach `void import` in the harness **+ one unrelated `export const`** | **green** | **regex RED both trees** | **RED** |
| **`WENTRY-DYN`** | a NEW zero-export module (`probe-victim.ts`) holding `void import("./history.ts")` | green | **green — ESCAPES** (`dynall` reds it) | — |
| `WPERFT-EXPORTS-ONLY` | harness gains an export, no history import (control) | green | **green** — no spurious red | — |
| **`WCOMMENT-DYN`** | a **comment** quoting `void import("./history.ts")` in `zobrist.ts` | green | **regex RED (false positive)** | green |
| **`WSTRING-DYN`** | the literal inside an exported **template string** | green | **regex RED** | **RED** |
| **`WTRAILING-DYN`** | a **trailing comment** on a real code line | green | **regex RED** | **RED** |
| `WOFFFRAME-DYN-INDENTED` | `await import("./history.ts")` **indented inside a function** | green | regex RED | regex RED |
| **`WOFFFRAME-COMPUTED`** | `const spec = "./history" + ".ts"; void import(spec);` | green | **green** | — |

**Three things this table settles.**

1. **`WPERFT-DYN-EXPORTING` is the binding cost**, and it survives the comment-aware variant — so it
   is a property of the **discriminator**, not of the anchoring. The `A3` ruling's reasons (*not a
   caller*, *off the frame path*) are untouched by an export, so the rule reds a build this ADR calls
   correct.
2. **The false-positive surface is intrinsic, not sloppy.** `WOFFFRAME-DYN-INDENTED` shows the
   dynamic form's ordinary position is indented inside a function, so the pattern **cannot** be
   anchored the way the static halves are — and unanchored means comments and strings match. A
   comment-aware variant recovers `WCOMMENT-DYN` only; **`WSTRING-DYN` and `WTRAILING-DYN` stay
   RED.** **`lint` does not contain any of them** — QE's containment argument covers `biome check`
   violations, and a comment's contents are not one.
3. **`WOFFFRAME-COMPUTED` green under BOTH `exports` and `dynall` is the second ground, measured.**
   The containment's six are closed forms (ESM requires a literal specifier for `export … from` and a
   bare `import`); the extra six are **one spelling of an open form**. **The bound on the recovery's
   value is real and it is why the priced answer is no.**

## Cost — measured, and it is NOT the reason for the ruling

**+20 µs per full 16-file scan** — 77.7 µs (`exports`) against 57.4 µs (`widened`), regex work only,
files pre-read, 20,000 iterations after a 2,000-iteration warm-up. **Inside the noise of a single
vitest boot and irrelevant next to the probe's ~20 ms spawn.** **No `N8-LANE` verdict is claimed and
none is owed here** — `MET`/`MISS` is Security/NFR's and `ABC-026` owns the lane total.

## Baseline on this branch tip, re-verified at source rather than inherited

| gate | Orchestrator's baseline | measured here (before AND after the ADR edit) |
|---|---|---|
| `npm run lint` | 0 | **0 errors**, 2 pre-existing `biome migrate` infos, 46 files |
| `npm run typecheck` | 0 | **0** |
| `npx vitest run` | 752/752 on 26 files | **752 passed (752) on 26 files** |
| skip count | 0 | **0** |
| e2e | — | **`UNKNOWN - verify`** — `ui_e2e` is `ui-or-critical-path`, no runnable UI surface until `EPIC-006`. Not invented |

## What was checked and NOT claimed

- **Whether `WPERFT-DYN-EXPORTING` is *reachable*** — i.e. whether `EPIC-006` will actually give
  `perft-bench.ts` an export. **Unknown and deliberately not guessed.** The cost stands without it:
  a guard that reds a ruled-correct build is wrong whether or not that build ships.
- **Whether an AST-based rule would price better than a textual one.** **Not measured** — it is a
  different mechanism, `A5` permits the Engineer to choose one, and pricing it was not this hop's
  question. **`UNKNOWN - verify`.** Named so the next hop knows it was considered and skipped, not
  missed.
- **`plans/nfr-catalog.md` was NOT opened**, so nothing here is a statement about `NFR-002`'s
  `MET`/`MISS`, which stays Security/NFR's.
