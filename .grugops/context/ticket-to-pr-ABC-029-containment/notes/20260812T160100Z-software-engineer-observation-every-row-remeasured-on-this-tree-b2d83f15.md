---
id: 20260812T160100Z-software-engineer-observation-every-row-remeasured-on-this-tree-b2d83f15
kind: observation
by: software-engineer
at: 2026-08-12T16:01:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ABC-019
  - ADR-0011
  - D27
  - plans/tickets/ABC-029-production-module-scope-and-load-probe.md
  - src/history-pane.nfr.test.ts
supersedes:
---

# Every row I rely on was RE-MEASURED on this tree — `A6.1`, `A6.2` and `A5.6` are MET; two of BA/PM's inherited numbers did NOT reproduce and both are named

> **`kind: observation`, not `finding`, and that is forced** — no `§14-gate` verdict record exists
> under this task and `human_admission` is **`off`**. `confidence: high` because **every cell below
> was RUN at this hop**: real `src/history-pane.nfr.test.ts` under real vitest against throwaway
> out-of-tree copies, verdict read per `it` from vitest's JSON reporter. **No guard was
> re-implemented and nothing below is inherited.** `## Test notes` 12 recorded that BA/PM re-measured
> no today-value; **this note is that debt paid.**

## 0. The rig, and what was never opened

Everything ran in the session scratchpad on throwaway copies. **No repository worktree was written by
any measurement and NO other worktree was entered** — `../cli-chess-ABC-019` was never opened, and the
Architect/Design hop live on `ADR-0011` was not touched.

- **`base16`** — this branch verbatim, **16** non-test `.ts`, instrument md5
  **`796918f370e26d2cbc6055953edf06ae`** — **reproduced**, the brief's baseline confirmed.
- **`base17`** — `base16` + `src/turn-loop.ts` via `git show grugops/ABC-019-turn-loop-skeleton:…`,
  md5 **`bd793612476c9d0eac28b75e1e3297cc`** — **reproduced**; `## Test notes` 8's stop condition was
  checked rather than assumed, so it did not fire.
- **`landed16` / `landed17`** — the same two trees carrying **the file exactly as I landed it**, with
  the rig performing **no swap at all**. Every required row below was taken on these, so the evidence
  is the build itself and not a reconstruction of it.
- **`rebase19`** — `landed16` + `ABC-019`'s three `src/` files from the object database. See the
  sibling note on the honest question.

**59 vitest runs at this hop**: 40 instrument runs across the matrix, 12 determinism runs, 4
full-suite runs, 1 control-falsifiability run, 2 gate suites; plus 36 full-lane runs for `N8-LANE`.

## 1. `A6.1` — MET. Three rows, four verdicts, all RED, all on the landed build

| # | build | tree | required | **measured on the landed build** |
|---|---|---|---|---|
| `A6.1` | `WOFFFRAME-BARE` — bare `import "./history.ts";` in `zobrist.ts` | 16 | regex RED | **RED** — `expected [ 'zobrist.ts' ] to deeply equal []` |
| `A6.1` | `WREEXPORT-STAR` — `export * from "./history.ts";` in `zobrist.ts` | 16 | regex RED | **RED** — same message |
| `A6.1` | **`WLAUNDER`** — `zobrist.ts` re-exports `repetitionCounts`, `perft.ts` consumes it | **16** | regex RED | **RED** — `expected [ 'zobrist.ts' ] to deeply equal []` |
| `A6.1` | **`WLAUNDER`** | **17** | regex RED | **RED** — `expected [ 'turn-loop.ts', 'zobrist.ts' ] to deeply equal [ 'turn-loop.ts' ]` |

**Both expected messages reproduce verbatim**, including the two-element form on the 17-file tree.

**RED-FIRST, and it is a measurement rather than a claim.** Before the change, the same four builds
were run against the **delivered** expression on the same rig: **all four GREEN, 8/8.** So `A6.1` was
genuinely unmet on this tree and the change is what closes it.

## 2. `A6.2` — MET, and it is only meaningful as a PAIR with `A6.1`; the pair is what I report

| # | build | tree | required | **measured on the landed build** |
|---|---|---|---|---|
| `A6.2` | `WTYPEREEXPORT` — `export type { … } from` in `zobrist.ts` | 16 | regex GREEN | **green, 8/8** |
| `A6.2` | `WTYPEREEXPORT-PANEL` — the same in `status-panel.ts` | 16 | regex GREEN | **green, 8/8** |
| `A6.2` | **`WPERFT-DYN`** | **16** | regex GREEN **and the suite passes** | **green** — instrument 8/8, **full suite 752 passed (752) on 26 files** |
| `A6.2` | **`WPERFT-DYN`** | **17** | regex GREEN **and the suite passes** | **green** — instrument 8/8, **full suite 752 passed (752) on 26 files** |

**The brief's third instruction, honoured explicitly: `A6.2` alone has NO discriminating power and I
do not report it as met on its own.** All three of its rows are green under `Wnothing` (the delivered
expression), measured — doing nothing satisfies it. **What makes the pair meaningful is `Whalfguard`,
and I built it: it passes all of `A6.1`, passes `A5.6`, passes `WPERFT-DYN`, and leaves BASE GREEN on
BOTH trees — and dies on the two type-only rows and on nothing else.** The full matrix is in the
sibling `observation` on the wrong builds. **`A6.1` + `A6.2` are met together, by one expression that
was measured against the build that would have passed one of them while being wrong.**

## 3. `A5.6` — MET, and the honest form of that answer is "already met, and still met, and I proved the row is not vacuous"

| # | build | tree | required | **measured on the landed build** |
|---|---|---|---|---|
| `A5.6` | `WSWAP` — licence holder's import made type-only **and** `zobrist.ts` gains a static import | 17 | regex RED | **RED** — `expected [ 'zobrist.ts' ] to deeply equal [ 'turn-loop.ts' ]` |

**`A5.6` is a row about the ASSERTION, not about the expression, so the delivered `toEqual` already
satisfied it: `WSWAP` measured RED against the DELIVERED expression too.** I did not change the
assertion, so the row is met before and after and my change neither earns nor endangers it. **Saying
"met" without that sentence would be claiming credit for a row I did not move.**

**What I did add is the proof that the row has teeth on THIS build**, which is the thing `A5.6` exists
for: `W4count` (`toEqual` → `toHaveLength(….length)`, the one-token weakening) was built against the
landed expression and is **GREEN on `WSWAP`** where the landed build is **RED**. So `A5.6` genuinely
separates them here. `W4count` is also **RED on `WLAUNDER` on both trees** (2 ≠ 1 and 1 ≠ 0),
reproducing BA/PM's derivation.

## 4. Rows I did not own but could have broken — all PRESERVED, measured on the landed build

| row | build | tree | required | **measured** |
|---|---|---|---|---|
| `A5.1` | BASE | 16 | regex green, probe green | **green / green, 8/8** |
| `A5.2` | BASE | 17 | regex green, probe green | **green / green, 8/8** |
| `A5.3` | `WSTALELICENCE` | 17 | regex RED | **RED** — `expected [] to deeply equal [ 'turn-loop.ts' ]` |
| `A5.4` | `WPERFT-STATIC` | 16 · 17 | regex RED | **RED** on both — `[ 'perft-bench.ts' ]` / `[ 'perft-bench.ts', 'turn-loop.ts' ]` |
| `A5.4` | `WOFFFRAME-STAT` | 16 | regex RED | **RED** |
| `A5.5` | `WLOOPINFRAME` | 17 | probe RED | **probe RED** (regex RED too, unchanged from delivered) |
| `A3` / `R4` | `WOFFFRAME-DYN`, `WQUERY-OFFFRAME` | 16 | not recovered | **green / green — unchanged, by ruling** |

## 5. WHICH OF BA/PM's INHERITED NUMBERS REPRODUCED, AND WHICH DID NOT

**Reproduced — every one of these was re-taken on this tree at this hop:**

- instrument md5 `796918f3…`; `src/history-pane.ts` md5 `c4653c4c…`; `turn-loop.ts` md5 `bd793612…`
- **16** non-test `.ts` on this tree, **17** on `ABC-019`'s tip
- lane baseline **752/752 on 26 files**, skip **0**, lint **0** errors + **2** pre-existing
  `biome migrate` infos, typecheck **0**, build **0**
- instrument test count **8**, before and after
- **all four `A6.1` verdicts, with both `WLAUNDER` messages verbatim**
- **all four `A6.2` verdicts**, including the full-suite pass under `WPERFT-DYN` on both trees
- **`A5.6`'s `WSWAP` verdict and message**; `A5.1`–`A5.5`; `WOFFFRAME-DYN` / `WQUERY-OFFFRAME` green
- **`Whalfguard`'s entire profile**, including BASE green on both trees — the row's whole premise
- `Wnothing`, `Wbareonly`, `Wexportonly`, `Wsubstring`, `Wdyn`, `Wnoscan`, `W4count`, `Wunanchored`
- **`L2`'s derivation**: the unanchored variant is green on BASE both trees, RED on `WLAUNDER`, green
  on `WTYPEREEXPORT` and green on `WPERFT-DYN` — **it does pass every row, exactly as derived**
- probe determinism **12/12**; the positive controls still falsifiable (`roots = []` → `expected [] to
  include 'history-pane.ts'`); the arming control still reports `history.ts` in every green run
- `ADR-0008`'s two ratified clauses: wall median **1.80 s** (≤ 3 s), CPU median **8.86 s** (≤ 13 s)

**DID NOT reproduce — two, both named rather than smoothed:**

1. **`## Test notes` 8's *"the 16 shared files are `cmp`-identical on both, so the trees differ by
   exactly one file"* is NO LONGER TRUE. They now differ by TWO.** Measured file by file with `cmp`:
   15 of the 16 are identical, and **`src/history-pane.ts` DIFFERS** — this tree
   `c4653c4c263c4c417ea34969164ccd86`, `ABC-019`'s tip `54fd4346dcc1a0060c4e66ae0149265d`. **The cause
   is benign and is this ticket's own work**: `A4` landed at `b7e1226` on this branch and rewrote
   `history-pane.ts:30` (*"keeps its zero runtime importers"* → *"IT ADDS NO RUNTIME IMPORTER OF"*),
   and `ABC-019`'s tip branched before it. **The whole delta is one line inside a docblock; it
   contains no `import` or `export` statement, so it cannot move either guard's verdict** — and
   `landed17`, which carries this tree's version, produces every verdict the record predicts.
   **The number is stale, not wrong-at-the-time — the same shape `A11` earned four times.**
2. **`## Test notes` 11's two line ranges are NOT two blocks and `A4`'s `:253-262` no longer points at
   a docblock at all** — at the current commit that range is inside the `toSan` test. Both ranges are
   the same block at two different file states; resolved at source in the sibling `decision` note.

**Neither changes a required verdict. Both are recorded because the next hop would otherwise
re-discover them, and because `## Test notes` 8 is a stop condition someone will check again.**

## 6. One thing I checked and did NOT claim

BA/PM recorded a semicolon-less `import`/`export` line as a possible false positive via `[^;]*`
spanning down into a following type-only re-export, and could not measure it without opening `src/`.
**I did not construct it either, and I am not claiming it.** It is **pre-existing in kind** — the
delivered expression has the same spanning property, which the docblock has always recorded — and the
widening does not change the `[^;]*` term. **Bounded, not measured, by the mandatory `lint` gate;
raised here so the next hop knows it was considered and left alone rather than missed.**
