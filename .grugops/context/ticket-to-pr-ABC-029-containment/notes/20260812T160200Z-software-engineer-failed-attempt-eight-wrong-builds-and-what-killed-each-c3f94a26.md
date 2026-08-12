---
id: 20260812T160200Z-software-engineer-failed-attempt-eight-wrong-builds-and-what-killed-each-c3f94a26
kind: failed-attempt
by: software-engineer
at: 2026-08-12T16:02:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ADR-0011
  - plans/tickets/ABC-029-production-module-scope-and-load-probe.md
  - src/history-pane.nfr.test.ts
supersedes:
---

# EIGHT wrong builds written and run — `Whalfguard` is the one that would have shipped, and the row that kills it is the only thing standing between it and a green gate

> **`kind: failed-attempt`** — this is the record of builds that were constructed, run and rejected,
> so no later hop retries one. Soft kind, no stamp required, and none is claimed. Every verdict was
> RUN on the rig described in the sibling `observation`.

## The matrix — every row measured, none derived

`✓` = the build satisfies that row. `✗` = the row kills it.

| wrong build | BASE 16 | BASE 17 | `A6.1` bare | `A6.1` star | `A6.1` `WLAUNDER` 16 | `A6.1` `WLAUNDER` 17 | `A6.2` type/zobrist | `A6.2` type/panel | `A6.2` `WPERFT-DYN` | `A5.6` `WSWAP` | **killed by** |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **`Wnothing`** (delivered) | ✓ | ✓ | **✗** green | **✗** green | **✗** green | **✗** green | ✓ | ✓ | ✓ | ✓ | **`A6.1`, all four verdicts** |
| **`Whalfguard`** | ✓ | ✓ | ✓ RED | ✓ RED | ✓ RED | ✓ RED | **✗ RED** | **✗ RED** | ✓ | ✓ | **`A6.2`'s two type-only rows, AND NOTHING ELSE** |
| **`Wbareonly`** | — | — | ✓ RED | **✗** green | **✗** green | — | ✓ | ✓ | ✓ | — | **`A6.1`'s `WREEXPORT-STAR` and `WLAUNDER`** |
| **`Wexportonly`** | — | — | **✗** green | ✓ RED | ✓ RED | — | ✓ | ✓ | ✓ | — | **`A6.1`'s `WOFFFRAME-BARE`** |
| **`Wdyn`** | — | — | — | — | ✓ RED | — | — | — | **✗ RED both trees** | — | **`A6.2`'s `WPERFT-DYN`, and `A3`** |
| **`Wsubstring`** | **✗ RED** | **✗ RED** | — | — | ✓ RED | **✗ RED** | — | **✗ RED** | — | **`A5.1`/`A5.2` FIRST, then all of `A6.2`** |
| **`Wnoscan`** | — | — | — | — | ✓ RED | — | — | — | ✓ green | — | **`A5.4`** (`WPERFT-STATIC` green), **`A1`**, **`A3`** |
| **`Wunanchored`** (`L2`) | ✓ | ✓ | — | — | ✓ RED | — | ✓ | — | ✓ | — | **NOTHING ON THE PAGE — this is `L2`, and it is real** |

## `Whalfguard` — the one that matters, and it matters more after measuring it than before

**Form:** `/^(?:import\s+(?!type\b)|export\s+)(?:[^;]*from\s+)?"\.\/history\.ts";/m` — the negative
lookahead on the `import` branch only. It is the shape you get by widening the delivered expression in
the obvious way, and **it is not obviously wrong by reading.**

**Measured, and every cell is a run:**

- **BASE green on BOTH trees, 8/8** — so `A5.1` and `A5.2` pass and the gate is green.
- **All three `A6.1` rows RED, on both trees for `WLAUNDER`, with the SAME two messages as the correct
  build** — so `A6.1` passes completely, including the row `ADR-0011` calls the containment's whole
  purpose.
- **`A5.6`'s `WSWAP` RED, `A5.3`, `A5.4`, `A5.5` unchanged, `WPERFT-DYN` green** — so `A5` passes
  entirely and `A3` is not breached.
- **It dies ONLY here:** `WTYPEREEXPORT` → `expected [ 'zobrist.ts' ] to deeply equal []`, and
  `WTYPEREEXPORT-PANEL` → `expected [ 'status-panel.ts' ] to deeply equal []`. **Both are builds that
  are CORRECT** — a type-only re-export is erased at runtime and is not a runtime importer — **and the
  guard turns them red.**

**Why BASE cannot witness it, confirmed at source rather than cited:** no production module holds
`export type … from "./history.ts"` today. `grep` across `src/*.ts` outside the test files returns
exactly two references to `history.ts`, both `import type` (`history-pane.ts:61`,
`status-panel.ts:42`), and neither is a re-export. **So this tree is structurally incapable of
producing the failing witness, and only a constructed build finds it — which is `A6.2`'s entire
reason to exist and is now measured rather than argued.**

**The cost of shipping it, stated plainly: a green gate, a green suite on both trees, every criterion
row on the page satisfied except two — and the first correct `export type … from "./history.ts"`
anyone writes turns red for no reason.** That is the false-positive class this project has paid for
before, arriving through the one door nobody watched.

## `Wunanchored` — the honest one: NOTHING on the page kills it

The ruled expression with `^` and `/m` dropped. Measured on the landed tree: **BASE green on both
trees, `WLAUNDER` RED, `WTYPEREEXPORT` green, `WPERFT-DYN` green.** **BA/PM's `L2` derivation
reproduces exactly and no row falsifies it.**

**It was not shipped, and the reason is not that it fails anything** — it is that `ADR-0011`'s ruled
expression is anchored and the brief required verbatim landing, which closes `L2` by construction.
`L2` stays a live limit with BA/PM as owner: **its trigger is the next hop that changes this
expression's anchoring, or the first production module that quotes `"./history.ts"` inside a comment
or a string.** **Nothing here overrules it and nothing here discharges it for future hops.**

## `Wsubstring` — one correction to the record's ordering, minor and worth having

The ticket says `Wsubstring` is killed by *"`A6.2` and `A5.1`/`A5.2`"*. Measured: **`A5.1` and `A5.2`
kill it first and on their own** — BASE is RED on both trees before any mutant is applied
(`expected [ Array(2) ] to deeply equal []` on 16;
`expected [ 'history-pane.ts', …(2) ] to deeply equal [ 'turn-loop.ts' ]` on 17), because the two
`import type` lines are substrings. **`A6.2` also kills it**, which reproduces — but a reader should
know the build never reaches a mutant. **Not a defect in the ticket; a sharpening of it.**
