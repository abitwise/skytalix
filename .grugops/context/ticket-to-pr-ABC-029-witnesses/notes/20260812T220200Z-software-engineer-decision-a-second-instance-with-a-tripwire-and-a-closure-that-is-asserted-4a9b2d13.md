---
id: 20260812T220200Z-software-engineer-decision-a-second-instance-with-a-tripwire-and-a-closure-that-is-asserted-4a9b2d13
kind: decision
by: software-engineer
at: 2026-08-12T22:02:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ADR-0011
  - A6.2
  - A6.3
  - A6.4
  - L3
  - L4
  - src/history-pane.nfr.test.ts
supersedes:
---

# The witnesses hold a SECOND INSTANCE of the expression behind a drift tripwire — not the literal moved, and not a blind copy — and the grammar closure is ASSERTED rather than described

> **`kind: decision`** — the shape of the change, the two designs rejected, and what was deliberately
> left un-witnessed. Soft kind, no stamp required, none claimed. The measurements it rests on are in
> the sibling `observation` notes and every one is a run.

## The constraint that decided the design

`ABC-029` permits **zero characters** of the guard's expression to change and states that *"the
expression at the executable site is not touched"*. A witness must nevertheless run **the guard's
expression** — a witness that measures something else is worse than no witness. Three designs:

| design | why not / why |
|---|---|
| **Extract the literal to a shared `const` and have the guard reference it** | Best fidelity — one instance, no drift possible. **REJECTED:** it moves the literal out of the executable site, which is precisely what the ticket forbids, and it refactors a working guard for a test's convenience (`AGENTS.md` rule 10). |
| **Copy the literal into the witnesses and leave it at that** | Cheapest. **REJECTED as the worst option:** a hop that widens the guard leaves the witnesses green against a dead copy. That is the failure this ticket has paid for twice already — a claim that was true when written and was never re-run. |
| **A second instance + a mechanical drift tripwire** | **TAKEN.** The guard's site is byte-untouched; the witnesses hold their own instance; and one test asserts the guard's **executable** site still contains `/<source>/<flags>.test(`. `/m.test(` occurs exactly once in the file, so the tripwire pins the executable site and not the docblock's quotation of it at `:350`. |

**Measured, not argued:** widening the guard's site alone and leaving the witnesses untouched reds
**the tripwire and nothing else** — 1 failed of 11. So the two instances cannot silently diverge, and
the failure message points the next hop at the witnesses instead of leaving them stale.

## Why the closure is an ASSERTION and not a sentence

The Orchestrator's instruction was that `A6.3` rests on a grammar-closed set and *"that closure is
the point — build the witnesses so the closure is visible to the next reader, not just the four
cases"*.

Four more sampled spellings would be `Wenumerated`'s defect one level up. So the witnesses carry the
**3 clause shapes × 2 keywords grid** with its one hole DECLARED (`export type <Ident> from` is not a
form), and the first assertion of the `A6.3` test is the **accounting**: the witnessed cells equal
the grid minus the declared non-forms. A reader checks a closure; a later hop that adds a spelling
must land it in an existing cell or change the declaration. **There is no seventh cell.**

That is why the two `A6.2` brace spellings are in the table: without them the grid has holes and the
closure is not visible. **They are restated from the closure's side and are NOT a second obligation**
— the same shape as `A6.2`'s `WPERFT-DYN` row restating `A3`'s verdict from the guard's side, which
the ticket already sanctions. `A6.4`'s set is closed the same way at three ESM clause shapes.

## The controls, because a verdict without one is worth nothing here

- **`A6.3` carries an ARMING control.** Six greens prove nothing about an expression that matches
  nothing, so the same expression on the same base is asserted **RED** on a real importer, and the
  unmutated base is asserted green. This is the probe's own `?arming` argument applied to a regex.
- **`A6.4` carries a falsifiability control.** Three reds prove nothing about an expression that
  matches every line starting `export`, so its type-only counterpart is asserted **green**.

## What was deliberately NOT done

- **The guard expression was not edited, and the stop condition never fired.** The brief's *"if you
  find yourself editing the regex, stop and report"* did not come up: every row was already satisfied.
- **`L3` and `L4` were NOT closed and no attempt was made to close them.** `Wtypespace` and
  `Wtypeset` survive the witnesses, measured — as the ticket requires. Widening the lookahead to kill
  `Wtypespace` would demand a build `biome check` rejects. Both limits are named at the site as
  limits, with the ticket as their owner.
- **`Wenumplus` was NOT chased.** `A6.4` cannot forbid enumeration as a technique; the patched
  enumeration passes and is not wrong. The witness docblock says so in those words, so nobody reads a
  green `Wenumplus` as a gap.
- **The witnesses run the EXPRESSION, not the guard.** The scanned set, the declared licence and the
  `toEqual` equality remain `A1`'s and `A5`'s, and the docblock says so. In particular they do **not**
  witness `WTYPEREEXPORT-PANEL`'s file-identity half — that row is about the guard scanning
  `status-panel.ts`, which is the scan's property and not the expression's.
- **No production line, no new file, no new dependency, no change to any other test file.**
  `src/history-pane.test.ts` was **never opened** — a QE hop is gating `ABC-028` on it concurrently.

## One gain that is worth naming precisely, and one that is NOT claimed

QE recorded a residual against `A6.2`: *"nothing in the committed suite goes red if a later hop
regresses the expression to `Whalfguard` … not executable in CI and no criterion says so."*

**Measured at this hop: the `A6.3` witness is RED under `Whalfguard`.** The grammar closure includes
the `export type` cells, and `Whalfguard` turns those red. So a regression to `Whalfguard` now fails
**in the suite**, which was true of no row before.

**What is NOT claimed:** this does not discharge `A6.2` or make it droppable. `A6.2` carries
`WTYPEREEXPORT-PANEL` and the `WPERFT-DYN` restraint row, neither of which these witnesses touch, and
the ticket's *"neither row may be dropped for the other"* stands. **The residual QE named is narrowed,
not closed, and only for the spellings inside the closure.**
