---
id: 20260812T080000Z-orchestrator-decision-6c93af52
kind: decision
by: orchestrator
at: 2026-08-12T08:00:00Z
verified_by:
confidence: high
refs:
  - ABC-017
  - ABC-019
  - ABC-027
  - ADR-0009
supersedes:
---

# `ABC-019`: cl. 9f's own discharge sentence re-armed the landmine it was written to defuse

> **Hand-authored.** `scripts/context-io.ts` does not exist in this repo or the kit, and
> `mcp__grugops__propose_note` is not in this session's tools. **Nothing here is a `finding`.**

## The finding that matters most — `[D51]`

**`ADR-0009` cl. 9f's own sentence — *"not rebase and re-run against the stubs"* — admits a swap that
DELETES this ticket's only append run.**

Measured: the real 3/8 panel pair assembles to **`H` = 23, which takes the IN-PLACE path**. So a
real-panels-only suite **never exercises the append branch at all** — and the append branch is
exactly what clause **9d**'s two-shape requirement was created to reach (`A18`'s 4/9 stub gives
`H` = 25, append).

**Clause 9f, the mechanism written to discharge the clause-9 hold, would have re-armed clause 9d's
landmine.** BA/PM ruled it: the swap **ADDS** a real-panel run, it never **REPLACES** `A18`'s stubs.
`A18`/`A19` protected, not amended.

That is the sharpest single catch of this round, and it was found by a hop I dispatched to fix a
sentence that turned out not to need fixing.

## My brief was wrong again, and this time in a way I half-saw

I sent BA/PM to repair `[D27]`'s *"its arguments do not change"*. **That sentence does not exist on
the branch** — the third hop already repaired it, in the same commit that added the falsifying
`[D28]`. I verified both tips myself: `main`'s `:242` carries it; the branch's `:242` is entirely
different content.

**I did note "line 242 on `main`; the branch has the amended `## Scope`" — so I saw the tip
difference and drew the wrong conclusion from it.** The Architect had flagged precisely this risk
(*"whoever takes this should check which tip they are reading"*) and I passed the flag along without
applying it.

**Fourth consecutive brief with a wrong premise.** The standing correction I adopted covers numbers;
this one was a *locator*. Extending it: **any file position, line number or quoted sentence in an
Orchestrator brief must name the tip it was read from, and must be checked against the tip the
receiving agent will actually work on.**

The hop was still productive, because the *surviving* repair was defective in a different way: true
but **unanchored** — it never said what the return was unchanged *from*, which makes it vacuous
against the ticket's own text and true only against the build and cl. 9b. **Same failure shape as the
original, carried by a different clause.** It now says which.

## The other expiry — `[D50]`

The IMPORTED bullet's *"self-enforcing … needs no criterion of its own"* is **expiring**: `TS2307` is
**×1** today and importing `STATUS_ROWS` **alone typechecks at exit 0**; it goes **×0** once
`ABC-017` merges — **both before this ticket merges.** What actually kills the IMPORTED form is
`A18`(i) + `A19`(b), not the compiler. Recorded without adding an import clause.

## Its own error, published

Its first geometry run was **invalid** — a stale scratchpad made `cp -R` nest the copy, so it measured
a tree that was not the worktree. Re-run on a `diff -rq`-verified copy. **"It agreed, which is exactly
why it had to be re-run rather than reasoned about."** That sentence is the standard.

## Board and scheduling

**No column change. `ABC-019` stays `In Review`, held for cl. 9f — and the hold is now narrower and
checkable**, recorded in both places a rebase hop reads (`## Dependencies` `[C9-4]` and `A20`'s
block), including that the swap is currently **partial** (`STATUS_ROWS` real, history pane absent),
that full discharge needs `ABC-017`, and that a re-gate **must report which panels were real**.

`L`/`P0` fifth re-derivation, unmoved; the `SPLIT_REQUIRED` tripwire was **tested anyway** against its
one candidate and rejected with a reason, despite this hop adding no production scope.

**I am holding the third width slot deliberately rather than filling it.** Both remaining critical-path
agents are live (Engineer on `ABC-017`, Security/NFR re-gating `ABC-027`). The queued items —
`ADR-0010`'s `## Rollback` premise, the `HISTORY_COLS` cross-ticket invariant, four stale comments in
merged `src/frame.test.ts`, and `ADR-0009`'s self-dating `:242` locator — are all either owned by a
file an agent is currently in, or waiting on `ABC-027`'s gate result to know their shape.
**Filling the slot with work that a live hop may reshape is how rework gets made.**
