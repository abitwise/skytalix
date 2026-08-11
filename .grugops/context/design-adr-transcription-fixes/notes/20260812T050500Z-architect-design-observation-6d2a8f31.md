---
id: 20260812T050500Z-architect-design-observation-6d2a8f31
kind: observation
by: architect-design
at: 2026-08-12T05:05:00Z
verified_by:
confidence: high
refs:
  - ADR-0010
  - ABC-027
  - src/frame.ts
  - src/frame.test.ts
supersedes:
---

# The count in `ADR-0010` was wrong in BOTH directions — and so is the count in the note that corrected it. Measured, not transcribed.

> **Hand-authored**; `scripts/context-io.ts` absent, `mcp__grugops__propose_note` unavailable. **No
> `finding`.** Everything below was RUN against merged `src/` on an out-of-tree copy in the session
> scratchpad. `git status --porcelain src/` = **0 lines** in this repository, before and after.
> Machine: **darwin/arm64, Node via the repo's own `node_modules`** — `UNKNOWN - verify` elsewhere.

## Why this was measured at all instead of copied from the brief

The subtask handed me the figure *"five sites across four tests"*. The two source notes at
`refinement-ABC-027-cut` **disagree with each other**: the `decision` note's heading says *"five
assertion sites across four tests"* while its own `observation` note tabulates **four** assertion
sites. **Writing an unmeasured count into a correction whose entire purpose is to fix an unmeasured
count would have reproduced the defect it repairs**, so I ran it.

## Method

Copied merged `src/` out of tree, applied `ADR-0010` clause 1 in **both** emission forms, ran
`npx vitest run src/frame.test.ts`. Baseline on the untouched copy: **27/27 green**.

## Result — four assertion sites, three tests, plus the screen model

| | measured |
|---|---|
| clause 1 applied, **screen model UNPATCHED** | **5 tests fail** (every test that drives `createScreen` on the in-place path) |
| clause 1 applied, **screen model taught `\x1b[K`** | **3 tests fail** |
| assertion sites needing repair | **4** — `:374`, `:376`, `:419`, `:768` |
| tests carrying those 4 sites | **3** — `:357` (holds `:374` **and** `:376`), `:406` (holds `:419`), `:735` (holds `:768`) |

So **five sites in all** — four assertions plus the screen model — and the honest test counts are
**three** (assertion-bearing) and **five** (throwing without the model change). *"Four tests"* matches
neither. `ADR-0010`'s *"three test changes"* undercounts the sites and, separately, names only
`:376`; `:374` and `:419` are unnamed by it.

**The masking is confirmed directly.** With the screen model taught `\x1b[K`, the failing stack frames
are `:384`, `:429`, `:778` in the patched copy — which is exactly `:374`, `:419`, `:768` in merged
numbering, because the model patch inserted 10 lines above them. **`:376` never appears in a failure
at all: `:374` fails first and masks it**, precisely as BA/PM said.

## Both emission forms, at `H` = 23 — the Security/NFR FAIL made arithmetic

| emission | `\x1b` | `\x1b[K` | `\x1b[0J` | cost vs merged |
|---|---|---|---|---|
| merged (today) | 2 | 0 | 1 | — |
| right margin — `CURSOR_HOME + rows.join(EL + "\n") + ED` | **24** = `2 + (H − 1)` | 22 = `H − 1` | 1 | **+66** = `(H − 1) × 3` |
| **column 0 — `CURSOR_HOME + EL + rows.join("\n" + EL) + ED`** | **25** = `2 + H` | 23 = `H` | 1 | **+69** = `H × 3` |

Two consequences, both now written into `ADR-0010`'s `## Consequences`:

- **`:376`'s replacement value is `2 + H` = 25, not 24.** The ADR's 24 is the number for the emission
  form the Security/NFR gate **rejected**.
- **Clause 1's own *"+66 characters"* is the right-margin figure**; the delivered cost is **+69**.
  Clause 1's text was **not edited** — see the `decision` note for why — and `NFR-002` does not move.

**The set of broken assertion sites is IDENTICAL under both forms** — run, not assumed. Only `:376`'s
value differs. That matters for routing: whoever repairs the sites does the same work either way, and
only the two counted numbers depend on the placement.

## The pre-existing narrowing fixture, verified at source rather than inherited

`src/frame.test.ts:735-771` on `main` today, line range **exact**:
`expect(widthOf(wide)).toBe(24)` at `:755`, `expect(widthOf(narrow)).toBe(18)` at `:756`, and
`expect(stale).toEqual([...])` at `:768`. Its title is
*"CHARACTERIZES: `W` is recomputed per frame, so a narrowing frame leaves the wider one's tail"* and
its comment routes the decision to *"BA/PM + `ABC-016`/`ABC-017`"*. **It is a tripwire doing its job,
and `ADR-0010` is the day it fires** — not a bad test, and it is `ABC-027` `A6`'s to replace rather
than delete.

## One instrument caveat, stated because this project keeps catching them

My byte totals for a synthetic 23×18 frame (443 / 509 / 512) are **not** BA/PM's 425 → 491, because
the row content differs. **The DELTAS are what the ADR claims and those match exactly** (+66 and +69),
as do all escape counts. No conclusion here rests on an absolute character total.
