---
id: 20260812T080100Z-software-engineer-observation-a5-row-by-row-and-the-loss-0e00fdb1
kind: observation
by: software-engineer
at: 2026-08-12T08:01:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ABC-019
  - ADR-0002
  - ADR-0011
  - NFR-002
  - RISK-ABC017-04
  - src/history-pane.nfr.test.ts
  - src/turn-loop.ts
  - src/perft-bench.ts
  - src/zobrist.ts
supersedes:
---

# `A5` row by row on two trees, the full kill matrix, and the ONE kill given up

> **`kind: observation`, not `finding`, deliberately** — no `§14-gate` verdict record exists under
> this task and `human_admission` is `off`. Every verdict below is a command run at this hop.

## 0. The instrument, and what was never opened

**`ABC-019`'s tip was reconstructed OUT OF TREE from the git object database**
(`git show grugops/ABC-019-turn-loop-skeleton:src/<file>`). **`../cli-chess-ABC-019` was never
opened**, nor were `../cli-chess-ABC-028`, `../cli-chess-ABC-029` or `../cli-chess-abc028-a2`. Every
mutation ran on a throwaway copy in the scratch directory; **no file in any repository worktree was
written by any measurement.**

**Verified before anything was judged on it** (`## Test notes` 8's stop condition, checked rather than
assumed): the replica carries **17** non-test `.ts`, this branch carries **16**, `src/turn-loop.ts`
md5 is **`bd793612476c9d0eac28b75e1e3297cc`** — reproduced exactly — and the **16 shared non-test
files are `cmp`-identical**, so the trees differ by **exactly one file**.

**This is not a re-implementation of the guards.** Each cell below is the **real
`src/history-pane.nfr.test.ts` run under real vitest** against a reconstructed tree
(`node_modules` symlinked, `package.json` / `tsconfig.json` copied), with the verdict read out of
vitest's JSON reporter per `it`. The rig was validated against the record **before** it was used to
judge anything:

| control | required by the record | measured |
|---|---|---|
| delivered instrument, BASE, 16-file tree | green / green | **green / green** |
| delivered instrument, BASE, 17-file tip | RED / RED | **RED / RED**, with the recorded messages verbatim — `expected [ 'turn-loop.ts' ] to deeply equal []` and `history.ts was evaluated in a production closure` |

## 1. `A5` — every row, each a named build on a named tree

| # | build | tree | required | **measured** | |
|---|---|---|---|---|---|
| **A5.1** | BASE, 16 non-test `.ts`, no `turn-loop.ts` | this branch | regex green, probe green | **regex green, probe green** | **MET** |
| **A5.2** | BASE, 17 non-test `.ts`, `turn-loop.ts` `bd793612…` | `ABC-019` tip | regex green, probe green | **regex green, probe green** | **MET** |
| **A5.3** | `WSTALELICENCE` — driver EXISTS and stops importing `history.ts` | tip | regex RED | **regex RED**, probe green | **MET** |
| **A5.4** | `WPERFT-STATIC` — unlicensed static pull in the harness | both | regex RED | **regex RED** on both, probe green | **MET** |
| **A5.4** | `WOFFFRAME-STAT` — unlicensed static pull in `zobrist.ts` | both | regex RED | **regex RED** on both, probe green | **MET** |
| **A5.5** | `WLOOPINFRAME` — a declared frame producer imports the loop | tip | probe RED | **probe RED**, regex green | **MET** |

`WSTALELICENCE` was built by replacing `turn-loop.ts:52`'s
`import { type GameHistory, gameStatusOf, playMove, takeBack } from "./history.ts";` with a
**type-only** import — the licence holder still present, no longer importing. `WLOOPINFRAME` was
built by prepending `import "./turn-loop.ts";` to `src/render.ts`, a declared frame producer.

## 2. The full kill matrix under the ruled build — 15 builds, both trees, every one run

| build | site | **16-file tree** regex / probe | **17-file tip** regex / probe |
|---|---|---|---|
| **BASE** | — | **green / green** | **green / green** |
| `WPERFT-STATIC` | `perft-bench.ts` static | **RED** / green | **RED** / green |
| `WPERFT-DYN` | `perft-bench.ts` `void import` | green / green | green / green |
| `WOFFFRAME-STAT` | `zobrist.ts` static | **RED** / green | **RED** / green |
| `WOFFFRAME-DYN` | `zobrist.ts` `void import` | green / green | green / green |
| `WSTDOUT` | `glyph-mode.ts` module-scope `console.log` | green / **green** | green / **green** |
| `WSTDERR` | `glyph-mode.ts` module-scope `console.error` | green / green | green / green |
| `WINDIRECT` | `glyph-mode.ts` bare import (a ROOT) | green / **RED** | green / **RED** |
| `WTRANSITIVE-SAN` | `san.ts` bare import (in the closure, NOT a root) | green / **RED** | green / **RED** |
| `WBAREIMP` | pane bare import | green / **RED** | green / **RED** |
| `WDYNIMP` | pane `void import` | green / **RED** | green / **RED** |
| `WQUERY` | pane `void import("./history.ts?v=2")` | green / **RED** | green / **RED** |
| `WREEXPORT` | pane `export { newGame } from "./history.ts"` | green / **RED** | green / **RED** |
| `WSTALELICENCE` | licence goes stale | n/a (no driver) | **RED** / green |
| `WLOOPINFRAME` | renderer imports the loop | n/a | green / **RED** |

**Every load-bearing row of `ADR-0011`'s ledger reproduces**, and `## Test notes` 3's correction is
confirmed independently: **`san.ts` is the transitive witness** (in the 11-module closure, not a
root, RED on both trees) and `glyph-mode.ts` is a **root**, so `WINDIRECT`'s pull is direct.

## 3. THE ONE KILL GIVEN UP — `WOFFFRAME-DYN`. THIS IS A LOSS.

**`WOFFFRAME-DYN` — `void import("./history.ts")` in `src/zobrist.ts` — was caught by the DELIVERED
probe and is caught by NOTHING under this build.** Measured on both trees: **green / green**.

I am stating it as a loss and not folding it into a summary. Three things are true at once and all
three belong in the record:

1. **It is not a breach of either property.** `zobrist.ts` is off the frame path, so `NFR-002`'s
   premise is intact; the pull constructs no `positionCounts` map, so it is not a caller under
   `ADR-0002` cl. 4. On the properties as ruled, it is a removed false positive.
2. **It is nevertheless a genuine narrowing of reach**, and a real regression of that exact shape
   would now pass 750/750 in silence. The delivered probe would have seen it.
3. **It was ruled and priced by `ADR-0011`, not by me**, and I did not get to trade it. What I can
   report is that I looked for a mechanism that keeps it without breaking a row of `A5`, and did not
   find one: keeping it means rooting the probe at modules that are not frame producers, which is
   the whole-tree proxy the ruling removed and which is what makes `turn-loop.ts` red.

**The STATIC form of the same pull (`WOFFFRAME-STAT`) is still caught, by the regex, on both trees** —
measured above. So the loss is bounded to the non-static form in an unlicensed, off-frame-path module.

## 4. Gains, confirmed by construction rather than cited

- **`WLOOPINFRAME` — probe RED on the tip.** This is `NFR-002`'s actual void-condition and it has
  never been guarded: under the delivered rule the probe is red on the **correct** build, so it could
  not discriminate the void-condition from the architecture. It can now.
- **`WSTALELICENCE` — regex RED on the tip.** The delivered `toEqual([])` is blind to it (measured:
  green), and so is a subset check (measured: green).

## 5. The regex has TWO sole-catcher builds, and the coverage is not nested in either direction

`WPERFT-STATIC` and `WOFFFRAME-STAT` are **regex RED / probe green on both trees**; six builds are
**probe RED / regex green on both trees**. **Neither instrument is a weaker version of the other, and
deleting either loses measured kills.** That is now stated at the probe's own site, which is what
`A4`'s corrected second half asked for.
