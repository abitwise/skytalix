---
id: 20260812T110500Z-ba-pm-decision-a2-contradicted-itself-and-is-rewritten-2e41fa80
kind: decision
by: ba-pm
at: 2026-08-12T11:05:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A1
  - ABC-028-A2
  - RISK-ABC017-01
  - RISK-ABC028-02
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
  - src/history-pane.test.ts
  - src/history-pane.nfr.test.ts
supersedes:
---

# THE `A2` RULING — the criterion contradicted itself, the Engineer did not fail it, and NOTHING FURTHER MUST BE BUILT

> **Hand-authored.** `scripts/context-io.ts` does not exist in this repository or in the kit root
> (`ls scripts/` → "No such file or directory", re-checked at source this hop), and
> `mcp__grugops__propose_note` is not in this session's tools. `context.human_admission` is `off`
> and **no §14 gate verdict record exists under this task**, so **nothing on this hop is a
> `finding`.** `confidence: high` refers to the reasoning and to the two things I checked at source
> myself; it is not an admission status. `scripts/claim.js` does not exist either — the Workflow 17
> claim was made by hand with a bare `mkdir`.

## The defect, stated once

**`A2`'s literal `Given` was a statement about the state of the repository** — *"the fixtures at
`src/history-pane.nfr.test.ts:113` and following rebuilt **per test**"*. **This ticket's own
`## Out of scope` FORBIDS that rebuild** (*"`A2` establishes that it may be done; it does not ask
for it"*) **and its own `## Test notes` 6 says it in terms** (*"It does **not** require rebuilding
those fixtures per test"*).

**No build could satisfy the `Given` and the fences at the same time.** The Engineer discharged both
measurement forms out of tree, wrote the comment, and declared `A2` **MET IN PART** rather than
rounding up. **That call is UPHELD. The Engineer did not fail this criterion — the criterion could
not be met as written.**

## Why the repair is not a softening, and the count that shows it

**Three statements in this ticket described `A2`'s obligation. Two said no rebuild is required
(`## Out of scope`, `## Test notes` 6); one said the rebuild is the `Given`.** I conformed the
minority statement to the majority. **The `Given` was the defect, not the fences.**

**KEPT — all three obligations the old text carried:** both builds die; every kill in
`src/history-pane.test.ts` and none in the nfr file; the comment says only what is true and names
the owning file.

**ADDED — four.** (1) **Both** configurations are now required, where the old text offered the
single-file lane as an *"equivalently and preferably"* aside — an *or* became an *and*. (2) *"the
surviving kills"* → *"**every** surviving kill"*, closing a reading in which one stray kill in the
nfr file would have passed. (3) The evidence must be **locatable** — the old text never required it,
which is why configuration (b)'s result was nearly homeless. (4) The stale `:113` is corrected to
`:121`.

**REMOVED — one, published:** the reading in which the repository itself must be left with per-test
fixtures. **Removed because this ticket's own fence forbids it**, not because it was expensive.

## THE FACT THAT DECIDED IT — the standing guard exists, and its independence is STRUCTURAL

`A1` is landed at **`src/history-pane.test.ts:785`**, runs on every `npm test`, and kills
`WCACHE-LEN` at `expect(third, "the third pane must not repeat the second").not.toEqual(second)`.

**I checked this at source rather than inferring it: `src/history-pane.test.ts` imports NOTHING from
`src/history-pane.nfr.test.ts`.** Its seven imports are `vitest`, `./fen.ts`, `./history.ts`,
`./history-pane.ts`, `./legal.ts`, `./moves.ts`, `./position.ts` — all production modules. The only
two occurrences of the string `nfr` in the file are **comments**. Vitest isolates per file.

**Therefore the out-of-tree measurement CORROBORATES a structural fact; it does not stand in for a
missing guard.** That is materially stronger than *"we measured it once"*, and it is why the
residual is a note to the next reader rather than a hole.

## Three closures considered and REFUSED, priced so a later hop can overturn them on the merits

- **An import guard** (`it` asserting no cross-file import) — **guards a thing that cannot happen
  silently.** `RISK-ABC017-01`'s hazard runs the other way; an import would be a visible refactor,
  not a tidy-up. `AGENTS.md` rules 5 and 8.
- **A child-process probe** running `src/history-pane.test.ts` alone — **guards nothing.** That lane
  is green with or without the property, because `WCACHE-LEN` is not in the tree. It would cost
  roughly what `RF-1` costs (~102 ms) on a lane whose content total is under active dispute at
  `ABC-026`.
- **Landing `WCACHE-LEN` in-tree as a mutant fixture** — **the only one of the three with real
  merit, and refused here rather than dismissed.** It is a mutation-testing harness, a pattern this
  project has never adopted: `ABC-017`, `ABC-023`, `ABC-024` and this ticket all build mutants out
  of tree. **Introducing it through the side door of one criterion, with unpriced lane cost, is a
  bigger decision than this ticket is allowed to make.**

## THE ROUTING ANSWER

**`A2` as repaired is MET by work already landed.** Both configurations were run (single-file lane:
`WCACHE-LEN` 1 failed/24, `WCACHE` 2 failed/24; rebuilt fixtures full suite: 1 failed/750 and
2 failed/750, no kill in the nfr file); the comment half is written and mechanically verified
comment-only, md5 `e27a8387…` → `65f4f29a…`.

**No further production line, test line or measurement is owed. THIS ROUTES FORWARD TO QE, NOT BACK
TO THE ENGINEER.**

**Had I ruled the other way** — that a standing in-tree guard is required — **that would have been
the third refused closure, an `M` at least, and it would have routed BACK to the Engineer.** I
refused it on **value**, not on size, and said so in the ticket so the decision is disputable.

## The residual, named rather than left to be rediscovered

**`RISK-ABC028-02`**, written into the ticket beside `A2`: configuration (b) is a demonstration the
repository does not re-run. The exposure is bounded by the structural fact above. **The real hazard
runs the OTHER way — if `A1` is ever deleted, weakened or folded into `A14`, the comment at
`src/history-pane.nfr.test.ts:102-120` goes FALSE again and the `RISK-ABC017-01` trap RE-ARMS**,
with the same call-count mechanism that hid it from six roles. Standing obligation placed on
whoever touches `A1`. No date — it is latent, and it is recorded as latent rather than given a
trigger it does not have.
