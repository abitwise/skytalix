---
id: 20260812T131600Z-architect-design-observation-containment-remeasured-and-two-corrections-b83d15e9
kind: observation
by: architect-design
at: 2026-08-12T13:16:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ABC-019
  - ADR-0002
  - ADR-0011
  - NFR-002
  - NFR-008
  - src/history-pane.nfr.test.ts
  - src/zobrist.ts
  - src/perft.ts
  - src/perft-bench.ts
supersedes:
---

# The containment, RE-MEASURED rather than accepted on the pricing — 28 instrument runs, and it corrects the record in two places

> **`kind: observation`, not `finding`** — no `§14-gate` verdict record under this task,
> `human_admission` **`off`**. Every cell below is a real run of the **real**
> `src/history-pane.nfr.test.ts` under **real** vitest against a throwaway out-of-tree copy, with the
> verdict read per `it` out of vitest's JSON reporter. **No guard was re-implemented.**

## 0. The rig, and what was never opened

Two trees, built out of tree in a scratch directory from this worktree and the git object database.
**No repository worktree was written by any measurement, and no other worktree was entered** — the
concurrent `ABC-028` BA/PM hop's tree was not touched.

- **`base16`** — this branch verbatim, **16** non-test `.ts`. Instrument md5
  **`796918f370e26d2cbc6055953edf06ae`**, which is the figure QE recorded for git's own merged tree.
- **`base17`** — `base16` **+** `src/turn-loop.ts` from `grugops/ABC-019-turn-loop-skeleton`, md5
  **`bd793612476c9d0eac28b75e1e3297cc`** — **reproduced**, the stop condition in `## Test notes` 8
  checked rather than assumed. **17** non-test `.ts`.

**The candidate expression, stated once:**

```
delivered   /^import\s+(?!type\b)[^;]*from\s+"\.\/history\.ts";/m
widened     /^(?:import|export)\s+(?!type\b)(?:[^;]*from\s+)?"\.\/history\.ts";/m
```

Only the **executable** site was swapped; the docblock's quoted copy was left byte-intact, so the
swap is provably confined to the assertion.

## 1. The matrix — 24 runs across two trees and two instruments

| build | tree | delivered | **widened** | |
|---|---|---|---|---|
| **BASE** | 16 | green / green 8/8 | **green / green 8/8** | no false positive |
| **BASE** | 17 | green / green 8/8 | **green / green 8/8** | no false positive |
| **`WLAUNDER`** | 16 | green / green 8/8 | **regex RED** — `expected [ 'zobrist.ts' ] to deeply equal []` | **RECOVERED** |
| **`WLAUNDER`** | 17 | green / green 8/8 | **regex RED** — `expected [ 'turn-loop.ts', 'zobrist.ts' ] to deeply equal [ 'turn-loop.ts' ]` | **RECOVERED** |
| `WOFFFRAME-BARE` | 16 | green / green | **regex RED** | **RECOVERED** |
| `WREEXPORT-STAR` | 16 | green / green | **regex RED** | **RECOVERED** |
| `WPERFT-STATIC` | 16 · 17 | regex RED | **regex RED** | `A5.4` preserved |
| `WOFFFRAME-STAT` | 16 | regex RED | **regex RED** | `A5.4` preserved |
| `WSTALELICENCE` | 17 | regex RED | **regex RED** — `expected [] to deeply equal [ 'turn-loop.ts' ]` | `A5.3` preserved |
| **`WPERFT-DYN`** | 16 · 17 | green / green | **green / green** | **`A3` preserved — see §3** |
| `WOFFFRAME-DYN` · `WQUERY-OFFFRAME` | 16 | green / green | green / green | **not recovered, by ruling** |
| **`export type { … } from`** in `zobrist.ts` | 16 | green | **green** | **type-blind on BOTH keywords** |
| **`export type { … } from`** in `status-panel.ts` | 16 | green | **green** | second type-only site |

**Full suite under the widened expression: `750 passed (750)` on **26** files** — identical count to
delivered (750/750 on 26). Wall 1.42 s widened against 1.53 s delivered, single rounds, the delta in
the *helpful* direction and plainly inside noise. **No `N8-LANE` verdict is claimed and none is owed
here** — `MET`/`MISS` is Security/NFR's and `ABC-026` owns the lane total.

**QE's pricing reproduces exactly: 6 of 12 recovered, including `WLAUNDER`, at zero measured cost.**

## 2. TWO CONTROLS QE DID NOT RUN, and one of them is the reason a naive widening would have shipped a defect

- **`export type { … } from "./history.ts";` must stay GREEN.** A type-only re-export is erased at
  runtime and is not a runtime importer — the same reason `import type` is excluded. **Measured green
  under the widened expression at two sites.** The obvious widening
  (`/^(?:import|export)\s+[^;]*from\s+…/`) drops the `(?!type\b)` guard on the `export` branch and
  would go **RED** here, turning a correct build red. **The negative lookahead must apply to both
  keywords**, and that is now a property of the expression rather than a hope.
- **`WPERFT-DYN` must stay GREEN**, because `A3` requires it. Measured green on **both** trees.

## 3. TWO CORRECTIONS TO THE HANDED-ON RECORD

**(a) *"The other 6 are dynamic and unreachable by any pattern"* is not quite true, and the true
reason is stronger.** Measured at the pattern level: a rule matching the literal
`void import("./history.ts")` **would** reach it. What no pattern can reach is a **computed
specifier** — `import(someVar)`. So the reason to stop is not impossibility, it is that:

1. **`A3` forbids it.** A pattern reaching the dynamic literal turns **`WPERFT-DYN` RED**, and `A3`
   — written on `ADR-0011` and scored through `ABC-029`'s DoR — requires it to **pass**. Adopting it
   would break an accepted criterion in order to repair an accepted ADR. **This is binding.**
2. A rule that catches only the literal spelling buys **false confidence**, which is the same class
   of defect as the one being repaired.

**So 6 of 12 is not a compromise — it is the maximum a textual guard may recover without breaking a
criterion.** That is a ruling, and it is in the ADR.

**(b) The specifier is DEPTH-FIXED, which no note had noticed** — see the sibling `observation` on
clause 1. It changes the cost of the clause-1 fix and it is measured, not argued.

## 4. What routes where

**This is a change to `src/history-pane.nfr.test.ts` — two sites, one file, ZERO production lines —
and it routes to the Engineer.** The second site is the probe's docblock, which lists the regex's
misses as a completed set (*"sees neither `void import(…)` nor a bare `import "./history.ts";"*) and
**never mentions re-export at all**. That silence is what made `WLAUNDER` invisible, and correcting it
belongs in the same hop as the code. **I wrote no test line and no production line at this hop.**
