---
id: 20260812T083700Z-qe-e2e-observation-twelve-kills-lost-not-one-9a3f6b21
kind: observation
by: qe-e2e
at: 2026-08-12T08:37:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ABC-019
  - ABC-017
  - ADR-0002
  - ADR-0011
  - NFR-002
  - RISK-ABC017-04
  - src/history-pane.nfr.test.ts
  - src/zobrist.ts
  - src/gameend.ts
  - src/perft.ts
supersedes:
---

# `WOFFFRAME-DYN` is NOT the only kill lost. **TWELVE** are lost, across **THREE** modules and **FOUR** syntactic forms — and one of them is a real breach of the property clause 3 claims

> **`kind: observation`, not `finding`** — no `§14-gate` verdict record under this task,
> `human_admission` `off`. Every cell below is a real vitest run at this hop.

**The Engineer named one lost kill and said so plainly, which is why this was findable. The class
they described is correct — *"the non-static form in an unlicensed, off-frame-path module"*. What is
wrong is the COUNT, and `ADR-0011` states it as a count: *"LOST — exactly one"*.**

## 1. First, mechanically: which modules lost probe coverage?

Computed by real module-graph load in a child (the same `registerHooks` technique the probe uses),
on both trees:

| | roots | closure |
|---|---|---|
| **delivered** probe, `base16` | 14 | **14** — every production module except `history.ts` and `perft-bench.ts` |
| **ruled** probe, `base16` | 5 | **11** — `apply` `fen` `frame` `glyph-mode` `history-pane` `legal` `moves` `position` `render` `san` `status-panel` |

**MODULES THAT LOST PROBE COVERAGE ON THIS TREE: `gameend.ts`, `perft.ts`, `zobrist.ts` — THREE, not
one.** (`base17` additionally drops `history.ts` and `turn-loop.ts`; those two are the intended
false-positive removals and I am not counting them as losses.)

`zobrist.ts` is the only one of the three the record ever names.

## 2. The regex catches ONE of the five forms `D27` enumerates — so it does not backstop the other three modules

The delivered regex is `/^import\s+(?!type\b)[^;]*from\s+"\.\/history\.ts";/m`. Checked against 15
constructed inputs, because the docblock at `:346-351` makes reach claims and QE checks claims:

| form | docblock says | measured |
|---|---|---|
| static single-line | match | **MATCH** |
| multi-line `import { … }` block | match | **MATCH** |
| `import * as ns` | match | **MATCH** |
| `import type { … }` | must miss | **miss** ✔ |
| bare `import "./history.ts";` | miss | **miss** |
| `void import("./history.ts")` | miss | **miss** |
| **`export { newGame } from "./history.ts";`** | **NOT DISCUSSED** | **miss** |
| **`export * from "./history.ts";`** | **NOT DISCUSSED** | **miss** |

**The docblock's three positive claims all hold.** What it does not do is enumerate its own misses
completely: it names two (`void import`, bare import) and is silent on **re-export**, which is
`WREEXPORT` — a form the ticket's own `## Test notes` 3 lists. That silence was harmless while the
probe covered all five forms over 14 modules. It is load-bearing now.

*(Also miss, and recorded for completeness rather than as risks: single-quoted specifier, missing
semicolon, indented import. All three are `biome check` violations and `lint` is a mandatory gate, so
they cannot reach `main` — the lint gate is the containment, and I am naming it rather than counting
them.)*

## 3. THE MEASUREMENT — 15 builds, every one run, ruled instrument vs delivered instrument

Three sites × five forms, `base16`, one line prepended per build:

| site | form | **ruled** regex / probe | **delivered** regex / probe | |
|---|---|---|---|---|
| `zobrist.ts` | STAT | **RED** / green | RED / RED | kill kept |
| `zobrist.ts` | **BARE** | green / green | green / **RED** | **LOST** |
| `zobrist.ts` | **DYN** (`WOFFFRAME-DYN`) | green / green | green / **RED** | **LOST — the one named** |
| `zobrist.ts` | **QUERY** | green / green | green / **RED** | **LOST** |
| `zobrist.ts` | **REEXPORT** | green / green | green / **RED** | **LOST** |
| `gameend.ts` | STAT | **RED** / green | RED / RED | kill kept |
| `gameend.ts` | **BARE / DYN / QUERY / REEXPORT** | green / green | green / **RED** | **LOST ×4** |
| `perft.ts` | STAT | **RED** / green | RED / RED | kill kept |
| `perft.ts` | **BARE / DYN / QUERY / REEXPORT** | green / green | green / **RED** | **LOST ×4** |

**The delivered probe killed all 15. The ruled build kills 3 — the static ones, on the regex.
TWELVE named builds are RED before and green/green after, and each would pass 750/750 in silence.**

`WOFFFRAME-DYN` is exactly one of those twelve. `ADR-0011`'s *"exactly one"* is a true count **of the
15 builds that hop ran**; it is not the count of lost kills, and the ADR's Consequences section reads
as though it is.

## 4. `WLAUNDER` — the one lost build that is NOT a removed false positive

The other eleven are, like `WOFFFRAME-DYN`, defensible as removed false positives: an off-frame,
unlicensed module evaluating `history.ts` breaches neither `NFR-002`'s premise nor `ADR-0002`
clause 4. **This one is different**, and I built it specifically to test that defence.

**`WLAUNDER`** — two lines, no new file:

```ts
// src/zobrist.ts  (unlicensed, off the frame path)
export { repetitionCounts } from "./history.ts";

// src/perft.ts    (unlicensed, off the frame path)
import { repetitionCounts } from "./zobrist.ts";
import { gameStatus } from "./gameend.ts";
```

| instrument | `base16` | `base17` |
|---|---|---|
| **delivered** | regex green / probe **RED** | regex **RED** / probe **RED** |
| **ruled (as built)** | **green / green**, 8/8 | **green / green**, 8/8 |

**`src/zobrist.ts` is now a runtime importer of `src/history.ts` and is not in the declared licence
set.** `ADR-0011` clause 3 says in its own words that *"the set of runtime importers of
`src/history.ts` **equals the declared licence set**"*, and the guard written to assert exactly that
equality reports **green**. The re-export re-publishes `history.ts`'s API from an unlicensed module,
so a third module can reach the repetition machinery without ever naming `history.ts`.

**I am not claiming this is an `ADR-0002` clause-4 breach and I checked before writing it down** —
the map is still constructed by `repetitionCounts`, which is the history module, so clause 4's
single-supplier sentence is intact. **What is breached is clause 3 of `ADR-0011` as literally
worded**, which is the property the regex is now the sole holder of over these three modules.

## 5. The honest shape of the gap, stated once

`D27` defined *"runtime importer"* over **five** forms. After this ticket:

- the **probe** sees all five forms, over **11** modules (was 14);
- the **regex** sees **one** form, over **all 17**;
- the union leaves **3 modules × 4 forms** with no instrument at all.

Before this ticket the two instruments' union covered every form over every module, which is why the
regex's syntactic narrowness never mattered. **The ruling did not create the regex's blind spot; it
removed the thing that was covering it.**

## 6. Is the hole LIVE or LATENT? — swept, and it is LATENT

Swept exhaustively across every production module in `src/`:

- `grep '^import "\./'` — **zero** bare imports anywhere in production `src/`;
- `grep '^export .* from "\./'` — **zero** re-exports of any local module anywhere in production `src/`;
- the only references to `history.ts` in production `src/` are **two `import type` lines**
  (`history-pane.ts:61`, `status-panel.ts:42`) and four comments.

**Nothing in the tree is within one edit of this hole today, and the count of production runtime
importers is still ZERO on this tree and ONE (`turn-loop.ts`, licensed) on the tip.** By this
project's own latent/live test — the one `ABC-029`'s priority was derived from twice — this is
**latent**. That is why my verdict is not a merge hold; see the `claim` note.
