---
id: 20260812T080200Z-software-engineer-observation-three-wrong-builds-4e84eeae
kind: observation
by: software-engineer
at: 2026-08-12T08:02:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ABC-019
  - ADR-0011
  - src/history-pane.nfr.test.ts
supersedes:
---

# The three wrong builds — written first, run, and each killed by exactly the row `A5` aimed at it

> **`kind: observation`, not `finding`** — no `§14-gate` verdict record under this task,
> `human_admission` `off`. Every verdict is a run.

`A5` names three builds that satisfy `A1`–`A4` as previously written and still leave `ABC-019` red.
**I wrote all three before writing the one I kept**, ran each on both trees against the rows that
discriminate them, and let the measurement pick. They differ from my delivered build by **one
assertion line** and nothing else — same declarations, same probe, same channel — so each row below
isolates the regex form and nothing but the regex form.

| # | form | the one line |
|---|---|---|
| **W1** | leave the regex as delivered | `expect(runtimeImporters).toEqual([]);` |
| **W2** | hard-code the licence, `ADR-0011` cl. 3 read literally | `expect(runtimeImporters).toEqual(["turn-loop.ts"]);` |
| **W3** | subset — "no UNLICENSED importer" | `expect(runtimeImporters.filter((f) => !LICENSED_DRIVERS.includes(f))).toEqual([]);` |
| **KEPT** | equality over the licence entries that EXIST | `expect(runtimeImporters).toEqual(production.filter((f) => LICENSED_DRIVERS.includes(f)));` |

## The measurement

| row | required | **W1 empty** | **W2 literal** | **W3 subset** | **KEPT** |
|---|---|---|---|---|---|
| **A5.1** BASE, 16-file tree (this ticket's own gate) | green | green | **RED** ← | green | **green** |
| **A5.2** BASE, 17-file tip | green | **RED** ← | green | green | **green** |
| **A5.3** `WSTALELICENCE`, tip | **RED** | **green** ← | RED | **green** ← | **RED** |
| **A5.4** `WPERFT-STATIC`, 16-file tree | RED | RED | RED | RED | **RED** |

## What killed each, named

- **W1 — killed by `A5.2`.** Green on this ticket's own tree, so `A1`–`A4` pass, the suite is
  750/750 and the blocking gate is green — **the regex half of this ticket has no failing witness on
  the tree it is built on**, which is exactly why `A5` is stated as constructed builds rather than as
  "the suite is green here". `ABC-019` rebases straight back onto
  `expected [ 'turn-loop.ts' ] to deeply equal []`. It is also **blind to `WSTALELICENCE`** (A5.3
  green), so it drops a claimed gain on top.
- **W2 — killed by `A5.1`, and this is the dangerous one.** *"Today the licence set is exactly
  `{ turn-loop.ts }`"* is true on the tip and **false here**, where `turn-loop.ts` does not exist.
  Measured **RED on this ticket's own blocking gate**: `ABC-029` never merges, and the `P0` behind it
  stays blocked **forever**. **This is the form that passes `ADR-0011`'s ledger and fails the actual
  build**, and it is the one a reader who follows clause 3 literally will write.
- **W3 — killed by `A5.3`.** Green on both trees and RED on `WPERFT-STATIC`, so it satisfies every
  loosely-worded reading of the criterion and looks correct from every angle except one: it is
  **green on `WSTALELICENCE`**, silently dropping one of the two gains `ADR-0011` claims. Nothing in
  `A1`–`A4` would have caught it. **`A5.3` is the only reason this build is not what shipped.**

## The honest note about how close W3 came

W3 is the build I would have written from `A1`–`A4` alone. It is simpler than the one I kept, it is
green on both trees, and it kills every unlicensed importer. **The single row that separates them is
`A5.3`**, and the difference between them in the source is one `filter`. That is worth recording
because the next person to "simplify" this assertion will be reaching for exactly W3.
