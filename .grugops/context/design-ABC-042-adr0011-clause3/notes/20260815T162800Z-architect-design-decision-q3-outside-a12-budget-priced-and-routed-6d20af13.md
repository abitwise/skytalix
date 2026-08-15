---
id: 20260815T162800Z-architect-design-decision-q3-outside-a12-budget-priced-and-routed-6d20af13
kind: decision
by: architect-design
at: 2026-08-15T16:28:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - Q3
  - R5
  - A12
  - ADR-0011
  - ABC-029
  - ABC-054
  - src/history-pane.nfr.test.ts
supersedes: 
---

# `Q3` RULED — the repair CANNOT be made inside `A12`'s budget, and it is not `ABC-042`'s to make either. Priced, owner named, routed as a NEW-TICKET row

> **Hand-authored `decision`.** Said plainly, as the subtask asked: **this cannot be repaired inside
> `A12`'s budget.** That is the answer, not a blocker and not a failure.

## The gap, restated only as far as the ruling needs

`src/history-pane.nfr.test.ts:335` is the guard's comparator:

```
expect(runtimeImporters).toEqual(production.filter((file) => LICENSED_DRIVERS.includes(file)));
```

Nothing asserts it stays an equality. QE's `M15` weakens it to a containment and **survives the whole
suite**. Verified at this hop by reading, not re-measured: `:335` is the only occurrence of that
comparison in the file, and the only tripwire present (`:441-442`) pins the **regex literal**, not the
comparator. Either direction of weakening loses a real kill — superset-of-licence loses the **unlicensed
importer** (the guard's primary kill, `WLAUNDER` / `WPERFT-STATIC`), subset loses **`WSTALELICENCE`**.

## Ruling 1 — it is outside `A12`'s budget, and `A12` is RIGHT to bar it

`A12` at base `59ea767`: *"`LICENSED_DRIVERS` (`:213`) gains exactly one element … plus **its citation as
Architect/Design supplied it** … **and nothing else in that file**."* An added assertion is "something
else in that file". **The bar is unambiguous and I am not reading around it.**

QE said adding it here *"would breach `A12` to protect `A12`"*; the fix-hop engineer agreed; BA/PM
declined to widen the bound. **I agree with all three and my reason is independent of theirs:**

1. **The defect is PRE-EXISTING and `ABC-042` neither caused nor worsened it in kind.** The comparator
   has been an unwitnessed `toEqual` since `ABC-029`. `ABC-042`'s diff on that file changes the **array**,
   not the **operator**. A ticket is not obliged to repair a defect it did not cause and that its own
   criteria bound.
2. **`A12`'s bound is doing the job it was written for.** It exists to hold a held, gated ticket's blast
   radius at six paths. Widening it to carry unrelated hardening is the trade BA/PM already refused at
   `G8` for **two lines of measurement**; it should not be granted for four lines of assertion because
   the file happens to be open in the diff. *"The ticket is held anyway, so there is room"* is how a held
   ticket stops shipping.

## Ruling 2 — the routed change is a NEW-TICKET ROW, not a widening of `A12`

**`ADR-0011`'s own established route for exactly this species**, from the priced rejection under
`## Consequences`: *"If a future hop ever wants the other six, it is **a new row on a new ticket, not a
change to this one**: BA/PM writes the row, the Engineer builds it."* `Q3` is that species — a guard
that could be stronger, on an instrument the current ticket is bounded away from.

> **ROUTED: BA/PM cuts a ticket carrying TWO sites in ONE file, both in
> `src/history-pane.nfr.test.ts`, both zero production lines: (a) the comparator tripwire (`Q3` /
> `R5`); (b) the licence docblock at `:196-199`, which restates the sentence this hop STRUCK from
> `ADR-0011` clause 3. They should be cut together — same file, same block, one review.**

**Owner of the residual: Architect/Design** (clause 3's mechanism is mine, and it is registered as
`ADR-0011` `R5` at this hop). **Owner of the criterion: BA/PM. Owner of the instrument: the Engineer.**
I am naming the change and routing it; I am not writing it.

## The price, so BA/PM can size the row without rediscovering anything

| | |
|---|---|
| **instrument** | one `expect(instrument).toContain(<the comparator's literal text>)` |
| **site** | the `it("runs the guard's OWN expression — a drift tripwire…")` block at `:437-443`, which **already reads the file into `instrument`** |
| **cost** | ~4 lines with its comment. **Zero production lines. Zero spawns. No new `readFileSync`.** Lane delta is a `String.includes` on an already-resident string — not a lane reading and must not be quoted as one |
| **size** | `XS`, and it is the whole ticket unless (b) is folded in, which makes it `XS` still |
| **risk** | none to any existing verdict: it asserts text that is present today |

**The trap the row must state, in the file's own words:** a witness that is a **copy** is worse than no
witness. The existing tripwire is what stops the guard and its witnesses diverging; a comparator
tripwire must pin the **literal text at the guard's site** and sit beside it, or it becomes a second
thing to keep in sync.

**Interaction with `ABC-054`, checked so the row's author does not trip over it:** `ABC-054` may repair
the shared **regex**, which the existing tripwire pins and will red by design (*"a hop that widens the
guard reds this test and is told, at the site, to re-run the witnesses"*). A comparator tripwire pins a
**different line** and is orthogonal — `ABC-054` does not red it and it does not constrain `ABC-054`.

## What this instrument is worth, stated honestly rather than sold

**It is the only in-suite instrument available.** An assertion's operator cannot be observed
behaviourally without a mutation harness, and this repository has none — so a textual tripwire is not
the cheap option among several, it is the option. Alternatives considered and rejected: extracting the
comparison into a shared helper (changes the guard's own site, which `ABC-029` bars and coding rule 10
forbids); a constructed stale-licence build (proves the guard's behaviour, says nothing about which
operator the site uses); a mutation framework (out of all proportion to a four-line gap).

**And it is not tamper-proof.** A hop can change the comparator and the tripwire together. Its value is
that the weakening becomes **deliberate and visible in the diff** instead of silent — which is exactly
what the file already claims for its sibling, and I claim no more for this one.
