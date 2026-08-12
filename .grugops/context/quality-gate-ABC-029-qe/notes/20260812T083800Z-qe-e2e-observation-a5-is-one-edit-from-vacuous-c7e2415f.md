---
id: 20260812T083800Z-qe-e2e-observation-a5-is-one-edit-from-vacuous-c7e2415f
kind: observation
by: qe-e2e
at: 2026-08-12T08:38:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ABC-019
  - ADR-0002
  - ADR-0011
  - src/history-pane.nfr.test.ts
supersedes:
---

# `A5.3` is **not** the sole discriminator — `A5`'s five rows admit a strictly weaker build, and the edit is `toEqual` → `toHaveLength`

> **`kind: observation`, not `finding`** — no `§14-gate` verdict record under this task,
> `human_admission` `off`. Every cell is a real vitest run.

The brief's second target: *"`A5.3` is the sole discriminator between the kept build and the subset
build ... A criterion with exactly one discriminator is one edit from vacuous. Attack it."*

**The attack lands, but not where it was aimed.** `A5.3` does separate `KEPT` from `W3subset`, and
that half of the record reproduces exactly. **What `A5.3` does not do is separate `KEPT` from a
CHEAPER simplification that passes every row of `A5` and loses a kill.**

## 1. Four regex forms × the five `A5` rows + one build no row names

`W4count` is one token different from the delivered assertion:

```ts
// KEPT     (delivered)
expect(runtimeImporters).toEqual(production.filter((file) => LICENSED_DRIVERS.includes(file)));
// W4count  (passes every A5 row)
expect(runtimeImporters).toHaveLength(production.filter((file) => LICENSED_DRIVERS.includes(file)).length);
```

`WSWAP` is a build **no `A5` row names**: the licence goes stale **and** an unlicensed module gains a
static import, in the same tree. `base17`, `turn-loop.ts`'s import made type-only **plus**
`import { newGame } from "./history.ts";` prepended to `zobrist.ts`.

| row | tree | required | **KEPT** | **W1empty** | **W3subset** | **W4count** |
|---|---|---|---|---|---|---|
| **A5.1** BASE | 16 | green | **green** | green | green | **green** ✔ |
| **A5.2** BASE | 17 | green | **green** | **RED** ✗ | green | **green** ✔ |
| **A5.3** `WSTALELICENCE` | 17 | **RED** | **RED** | green ✗ | **green ✗** | **RED** ✔ |
| **A5.4** `WPERFT-STATIC` | 16 | RED | **RED** | RED | RED | **RED** ✔ |
| **A5.4** `WOFFFRAME-STAT` | 16 | RED | **RED** | RED | RED | **RED** ✔ |
| **A5.5** `WLOOPINFRAME` | 17 | probe RED | **probe RED** | probe RED | probe RED | **probe RED** ✔ |
| **`WSWAP`** *(no row)* | 17 | — | **RED** | RED | RED | **green ← LOSES THE KILL** |

**`W4count` satisfies `A5.1`, `A5.2`, `A5.3`, `A5.4` (both builds) and `A5.5` — every row, including
the one the brief calls load-bearing — and is green on `WSWAP`, where the delivered build is RED.**

## 2. What that means, precisely

- **The Engineer's account of `W3subset` reproduces in full** — green at `A5.1`, `A5.2`, `A5.5`, RED
  at both `A5.4` builds, **green at `A5.3`**. `A5.3` is genuinely the only row that kills the subset
  form, exactly as recorded. Nothing in that account is overstated.
- **But `A5.3` is a row about the licence going stale ALONE.** A count-equality gets it right for the
  same reason the set-equality does — `0 ≠ 1`. The two forms only diverge when the runtime-importer
  set and the licence set have the **same cardinality and different members**, and **no row of `A5`
  constructs that**.
- **`A5` says in its own words *"the mechanism is the Engineer's choice; the rows are the
  criterion"*.** The rows do not pin the mechanism. A build satisfying every row can be strictly
  weaker than the one delivered.

**The missing row, named so it can be added rather than merely complained about:**

> **`A5.6` — the licence set and the runtime-importer set have the same size and different members.
> Given** a build in which the licensed driver stops importing `src/history.ts` **and** an unlicensed
> production module gains a static runtime import of it, **when** the suite runs, **then** the regex
> guard is **RED**. *(Measured today: `KEPT` **RED**, `W4count` **green**.)*

## 3. The delivered build is CORRECT on this — this is a criterion gap, not a code defect

**`KEPT` is RED on `WSWAP` on both trees.** Nothing needs to change in `src/`. What is one edit from
vacuous is `A5`, not the code: the next person to "simplify" this assertion has **two** cheaper forms
available, `A5` forbids one of them, and the file's own comment at `:320-324` warns about that one
only.

**Owner: BA/PM** — `ADR-0011`'s closing line says *"`ABC-029`'s acceptance criteria are BA/PM's"*, and
`A5` was written by BA/PM at `refinement-ABC-029-criteria`. **Trigger: the next hop that edits this
assertion, or the next re-scoring of `ABC-029`'s criteria — whichever is first.** **I did not amend
the criterion**; the brief reserved that and amending a criterion to match what shipped is the defect
this project keeps paying for.

## 4. One narrower thing I checked and it holds

`A5.4` names **`zobrist.ts`** as well as `perft-bench.ts`, and that choice is doing real work: it
means a build that widens `LICENSED_DRIVERS` to admit `zobrist.ts` is **RED at `A5.4`** (measured:
`expected [] to deeply equal [ 'zobrist.ts' ]`). Widening the licence to any **other** existing
module would not be caught by an `A5` row, but it would be caught by the equality itself the moment
that module does not import `history.ts` — which is the same measurement. **The licence cannot be
quietly widened to an existing file. It can be widened to a name with no file; that is measured
separately.**
