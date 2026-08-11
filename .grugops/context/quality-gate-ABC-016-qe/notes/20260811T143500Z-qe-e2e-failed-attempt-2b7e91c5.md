---
id: 20260811T143500Z-qe-e2e-failed-attempt-2b7e91c5
kind: failed-attempt
by: qe-e2e
at: 2026-08-11T14:35:00Z
verified_by:
confidence: high
refs:
  - ABC-016
supersedes:
---

# The first mutant harness reported 50/50 SURVIVORS, and every one of those zeros was a lie

Recorded per Workflow 16 so the next person does not rebuild this harness and re-earn the bug.

## What happened

The first run of the net printed `acc=0 snap=0 nfr=0` for **every** mutant — including
`m01-side-always-white`, a panel that renders `White to move` on a black-to-move position, which
`A1` asserts against directly. A net in which nothing dies is not a net with no defects; it is a net
that did not run. **The only reason it was caught is that I had a control and a known-kill in the
same run**, and a mutant that obviously must die reading green is a louder signal than a subtle one
reading green.

## The bug, exactly

The generator rewrote each probe copy's imports from `"./x.ts"` to `"../../src/x.ts"`, and redirected
the panel import to the mutant. In two passes, in the wrong order:

```js
text.replace(/\.\/status-panel\.ts/g, "./panel.ts")      // pass 1: point at the mutant
    .replace(/\.\/([a-z0-9.-]+\.ts)/g, "../../src/$1")   // pass 2: rebase the rest
```

Pass 2's pattern matches `./panel.ts` — pass 1's own output — and rewrote it to
`../../src/panel.ts`, which does not exist. Every probe file then failed to **collect**, not to
assert.

## Why the harness scored that as a pass

Vitest's JSON reporter reports a collection failure as a file-level error with an **empty**
`assertionResults` array. The scorer counted failed assertion names, found none, and concluded the
mutant survived. **A zero that means "nothing ran" is indistinguishable from a zero that means
"nothing failed" if you only count failures.**

## The fix, and the guard that now makes the failure loud

Panel redirection goes through a placeholder (`"@@PANEL@@"`) so the rebase pass cannot see it, and
the scorer now refuses to emit a verdict at all unless both probe files report the **delivered test
count** — 27 for the acceptance file, 5 for the NFR file — and neither reports a suite-level error.
Anything else is a `HARNESS ERROR` row, never a `SURVIVOR` row.

## The generalisable lesson, which is the reason this is written down

**Every survivor in a mutant report is a claim that a test RAN and did not fail.** Unless the
harness proves the test ran, a survivor list is a list of things you did not measure. Two cheap
controls make the difference and both are now in the harness:

- a **positive control** — the unmutated panel, which must be green on all three nets;
- a **negative control** — a mutant that must die at a named criterion, which must be red.

The `m00-control` / `m01` pair in the second run is what turned 50 false survivors into 31 kills, 8
snapshot-only kills and 11 real survivors.
