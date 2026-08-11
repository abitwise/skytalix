---
id: 20260812T010000Z-orchestrator-decision-d51a7f39
kind: decision
by: orchestrator
at: 2026-08-12T01:00:00Z
verified_by:
confidence: high
refs:
  - ABC-016
  - ABC-027
supersedes:
---

# `ABC-016`'s criteria are complete; → `In Security/NFR`, the last gate before it merges

> **Hand-authored.** `scripts/context-io.ts` does not exist in this repo or the kit, and
> `mcp__grugops__propose_note` is not in this session's tools. **Nothing here is a `finding`.**
> Written BEFORE the subtask that references it.

## Verified, not accepted

Commit is **notes + ticket only**; `src/` untouched; **711/711 on 24 files**, lint/typecheck 0,
skip 0, re-run by me after rebasing onto current `main`.

## The ruling, and the one it declined

BA/PM replaced `A13`'s scan clause with a **two-term sum, neither term growing with plies**: exactly
`64` for the material scan on every render, plus the anchor's occupied-square count **only on the
renders where `toSan` counts 1**. So the count is `64` on an empty history and `64 + occupied`
otherwise.

**It declined a depth-dependent form, and declined it with a measurement.** At depths 0–5 on two
anchors the value moves **exactly once, between 0 and 1, and never again**. The real split is *"there
is no last move to render"* vs *"there is one"* — the same `moves.length === 0` guard the criterion
already splits on twice. **Writing it as depth-dependence would have encoded a true statement with a
false cause.** That distinction is the whole quality of the ruling.

It also retired the phrase *"ply-independent"*: what that was buying is **depth-invariance** (intact,
and it is what kills the scan-twice build); what it wrongly implied is **regime-invariance**, which
was never true.

## Why folding beat adding a criterion

`## Security / NFR triggers` part 3 names *"the call counts of `A13`"*. Folding keeps that reference
complete **with zero NFR edit**; a new criterion would have put the only assertion catching the
empty-replay build **outside the named bar** — which is `D17`'s shape, and this ticket has been burned
by it twice. The decisive reason was the bar, not economy.

## The finding I most want kept

BA/PM found **a second instance of the same defect inside the same sentence** and **recorded it at its
true, smaller size: it costs no coverage** — a text contradiction, not a hole in the net. Reporting a
defect as smaller than it first looks is rarer here than reporting one as larger.

Then it named the pattern, and this is the part worth carrying beyond this ticket:

> **Both corrected rulings were the same defect — one quantifier written across an unexamined edge
> regime, and on this panel that regime is always the empty history. And both were in a REPAIR, not
> an original criterion. A repair arrives with the authority of having just fixed something, and gets
> read as a solution rather than as a new claim.**

That is a real process finding. Every hop in this round has been told to test rather than inherit;
none of them was told that **a repair is itself an untested claim.** It is now on the record.

One wrong turn was also published: its first `mEMPTY` mutant paid the cost unconditionally and
**flattered the criterion**; it rebuilt it narrow.

## Board

`ABC-016`: `In Review` → **`In Security/NFR`**. In Review 2/3 → 1/3 (`ABC-019`, held for the cl. 9f
re-gate), In Security/NFR 1/2 → **2/2 — at the limit, not over it**, so no override is owed, but the
column is now full and no third ticket can enter it until one leaves.

**This is the last gate before `ABC-016` merges**, and `ABC-016` merges first of four. Its `A14`
performance bar is the live trigger; every ticket in this project's history has taken this gate and
returned `PASS_WITH_RISKS`.

Zero engineer work was owed by the ruling: all five required assertions already exist in delivered
`src/status-panel.nfr.test.ts`. **Sixth derivation of `M`/`P1`, unmoved.**

## Carried, unowned, non-blocking

`D27`'s comment repair, with a named dissent that it should be fixed now — recorded in BA/PM's
`claim` note. Not blocking the gate.
