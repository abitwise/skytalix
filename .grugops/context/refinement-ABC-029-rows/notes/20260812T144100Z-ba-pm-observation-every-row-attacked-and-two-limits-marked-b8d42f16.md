---
id: 20260812T144100Z-ba-pm-observation-every-row-attacked-and-two-limits-marked-b8d42f16
kind: observation
by: ba-pm
at: 2026-08-12T14:41:00Z
verified_by:
confidence: medium
refs:
  - ABC-029
  - ABC-019
  - ADR-0002
  - ADR-0011
  - D27
  - RISK-ABC028-01
  - plans/tickets/ABC-029-production-module-scope-and-load-probe.md
  - src/history-pane.nfr.test.ts
supersedes:
---

# Every row was attacked with the test that `A5` failed — SEVEN wrong builds named, FIVE killed by a row, TWO limits marked in the ticket

> **`kind: observation`, not `finding`, and that is forced** — no `§14-gate` verdict record under this
> task, `human_admission` **`off`**. **`confidence: medium` and the reason is stated rather than
> hidden: NO VERDICT BELOW WAS RUN AT THIS HOP.** Each cell is either (a) a verdict measured by QE at
> `quality-gate-ABC-029-qe` or by Architect/Design at `design-ABC-029-loss-record`, cited and
> attributed, or (b) a derivation over a regex and a set comparison, done by reading. **`src/` was not
> opened** — the brief forbade it and a concurrent Engineer hop is live on `ABC-028`. The derivations
> are cheap to falsify and the builds are specified precisely enough to rebuild in minutes; **whoever
> runs them should treat a disagreement as mine, not theirs.**

## The test, and why it was applied to the rows rather than to the code

`A5` was written to stop this ticket being smoothed and it reached **one token** from vacuous. So the
same test was run on every row written at this hop: **name the build that would pass the row while
being wrong, then show what kills it.** Where nothing kills it, the limit is written **into the
ticket** — the `RISK-ABC028-01`-inside-`A4` precedent — rather than left in a note where a later hop
will not meet it.

## `A6` — six wrong builds, all but one killed by a row on the page

| wrong build | passes | killed by | basis |
|---|---|---|---|
| **`Wnothing`** — ship the delivered expression | **all of `A6.2`, trivially** | **`A6.1`** — green on `WLAUNDER` on both trees | Architect, measured |
| **`Wbareonly`** — optional `from`, `import` keyword only | `A6.1`'s bare row; all of `A6.2` | **`A6.1`'s `WLAUNDER` + `WREEXPORT-STAR`** | derived |
| **`Wexportonly`** — both keywords, `from` mandatory | `A6.1`'s two re-export rows; all of `A6.2` | **`A6.1`'s `WOFFFRAME-BARE`** | derived |
| **`Wsubstring`** — `src.includes('"./history.ts"')` | **all of `A6.1`** | **`A6.2` and `A5.1`/`A5.2`** — reds both type-only rows, `WPERFT-DYN`, and BASE on both trees via the two `import type` lines | QE's sweep + derived |
| **`Whalfguard`** — `(?!type\b)` on the `import` branch only | **all of `A6.1` — and `A5.1`/`A5.2`, because BASE stays GREEN** | **`A6.2`'s two type-only rows, and NOTHING ELSE** | Architect measured the control; QE never ran it |
| **`Wdyn`** — widen to the dynamic literal | all of `A6.1` | **`A6.2`'s `WPERFT-DYN` row, and `A3`** | Architect, measured |
| **`Wnoscan`** — drop `perft-bench.ts` from the scanned set | all of `A6.2` | **`A1`, `A3` and `A5.4`** — three independent rows | ticket, measured |

**`Whalfguard` is the one that matters and it is why `A6.2` exists.** It passes every row on the page
except the two type-only rows, **including BASE on both trees** — because **no production module holds
`export type … from "./history.ts"` today** (QE swept: the only references to `history.ts` in
production `src/` are two `import type` lines and four comments). **BASE cannot witness it. Only a
constructed build can.** That is the same argument that forced `A5.2`–`A5.4` to be constructed builds,
arriving from a new direction.

**`Wnothing` is the honest embarrassment and it is written into the ticket rather than smoothed:
`A6.2` is a RESTRAINT row, and a restraint row is always satisfied by doing nothing.** Alone it has no
discriminating power. **The pair `A6.1` + `A6.2` is the criterion**, and the ticket says so at the row,
so a later hop cannot take one and leave the other.

## `A5.6` — two wrong builds, ONE killed, ONE not

- **`Wsubset`** (a subset check) is **RED on `WSWAP`**, so it passes `A5.6`. **`A5.3` kills it** —
  `WSTALELICENCE` is green under a subset check, measured. **So `A5.6` does not subsume `A5.3`.**
- **`Wcount+first`** — cardinality equality **plus** a comparison of element `[0]` — **passes every row
  on the page** and is strictly weaker than an equality. Derived, row by row: `A5.1` green
  (`undefined === undefined`), `A5.2` green, `A5.3` RED (0 ≠ 1), `A5.4` RED both, `A5.6` RED
  (`'zobrist.ts' !== 'turn-loop.ts'`), `A6.1` RED on both trees (2 ≠ 1 on the 17-file tree, 1 ≠ 0 on
  the 16-file tree). **I could not kill it. `L1`.**

## The two limits, marked in the ticket

**`L1` — `A5.6` cannot separate `Wcount+first` from a true equality on either of this ticket's trees.**
The separating build needs **equal cardinality, equal first element, and a difference later**, which
needs **two licence entries whose files exist**. There is one (`turn-loop.ts`) on the 17-file tree and
zero on the 16-file tree. **It is constructible only by mutating the licence DECLARATION to a second
real entry** — fully specified so the judgment can be overturned rather than merely disputed:

> `base17`; `LICENSED_DRIVERS` set to `["gameend.ts", "turn-loop.ts"]` (both files exist);
> `turn-loop.ts`'s import made **type-only**; a static `import … from "./history.ts";` prepended to
> **`gameend.ts`** (now a licensed importer) **and** to **`zobrist.ts`** (unlicensed). Runtime
> importers `['gameend.ts','zobrist.ts']`, licence `['gameend.ts','turn-loop.ts']` — cardinality 2 = 2,
> element `[0]` equal, members differ. **`toEqual` RED; `Wcount+first` GREEN.**

**Judged not worth a required verdict**: it is a four-part mutation that edits the declaration, aimed
at an assertion form nobody writes — `W4count` was **one token**, this one names a positional index.
**The judgment is written in the ticket so a reader can overrule it; the row is cheap to add.**
**Owner BA/PM. Trigger: the first licence entry added after `turn-loop.ts` — deliberately the SAME
trigger as `ADR-0011`'s `R2`, so one hop clears both.**

**`L2` — `A6` pins the expression's FORM SET, not its ANCHOR.** An unanchored variant (`^` and `/m`
dropped) passes every `A6` and `A5` row by derivation: green on both type-only forms (the `(?!type\b)`
lookahead still fails at the only `import`/`export` token on those lines), green on `WPERFT-DYN`
(`import(` has no whitespace after the keyword). It is not weaker — it would additionally catch an
indented import, which the anchored form misses and which QE showed the `lint` gate contains — but it
carries an **unmeasured false-positive risk** against a production comment or string quoting the
specifier. **`ADR-0011`'s ruled expression IS anchored, so an Engineer landing it verbatim satisfies
this by construction; the limit bites only if a different mechanism is chosen, which `A5` permits.**
**Not measurable here — `src/` was not opened. Owner BA/PM; trigger: the next hop that changes the
anchoring, or the first production module that quotes `"./history.ts"` in a comment or a string.**

## One thing checked and NOT claimed

**A semicolon-less `import`/`export` line could let `[^;]*` span down into a following type-only
re-export and produce a false positive.** It is **pre-existing in kind** (the delivered expression has
the same spanning property), it is bounded by the `lint` gate — QE's containment argument for the
single-quoted specifier, the missing semicolon and the indented import, all `biome check` violations
against a **mandatory** gate — and **I could not measure it without opening `src/`.**
**Not raised as a defect and not written into a row.** Recorded here so the next hop does not have to
rediscover that it was considered.
