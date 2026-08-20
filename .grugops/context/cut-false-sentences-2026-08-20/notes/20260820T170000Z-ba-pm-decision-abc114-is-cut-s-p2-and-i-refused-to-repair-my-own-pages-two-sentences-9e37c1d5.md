---
id: 20260820T170000Z-ba-pm-decision-abc114-is-cut-s-p2-and-i-refused-to-repair-my-own-pages-two-sentences-9e37c1d5
kind: decision
by: ba-pm
role: ba-pm
task: cut-false-sentences-2026-08-20
at: 2026-08-20T17:00:00Z
verified_by:
confidence: high
refs:
  - ABC-114
  - ABC-113
  - ABC-112
  - ABC-110
  - ABC-108
  - ABC-043
  - ABC-044
  - EPIC-006
  - NFR-008
  - plans/board.md
  - plans/traceability.md
  - agent-factory/checklists/definition-of-ready.md
  - agent-factory/workflows/16-context-read-write.md
supersedes:
---

# `ABC-114` cut to `Backlog` at `S`/`P2`, DoR **9/10 ⚠️x1** — and BA/PM ruled AGAINST repairing its own page at this hop

## The DoR score, item by item, so the ⚠️ is not a shrug

| # | check | verdict |
|---|---|---|
| 1 | problem clear | **MET** — four sentences, each quoted, each falsified by a named measurement, each located on `main` at the cut |
| 2 | scope and out-of-scope clear | **MET** — comment prose plus two page lines; `D4`'s close, `M15`'s exploitation, EPIPE, lane inventory, `G-06` and the nine off-shape trace rows all fenced OUT by name |
| 3 | INVEST | **MET** — independent (the `ABC-043` relation is a re-measure-if-second, not a block), small, and every criterion is testable |
| 4 | acceptance testable and measurable | **MET** — `A1`–`A4` are re-measurements with recorded numbers, `A5` and `A6` are git and lane readings, `A7` is an authorship check on the delivery note |
| 5 | dependencies known | **MET** — none blocking; `ABC-043` ordering named with a pre-registered cancellation of `A4` |
| 6 | security / NFR triggers with measurable targets | **MET** — `N8-LANE` deliberately NOT claimed with the reason on the page (`ABC-108` open, `NFR-008` breached on CPU and unruled on wall), `N8-SPAWN` 0 ms, and falsifiable zeroes in its place |
| 7 | test notes present | **MET** — lane command, plant-and-revert protocol, the control-against-`main` requirement, the stale lint caveat, and the human-owned skip registry |
| 8 | size assigned | **MET** — `S`, argued against a named comparable, with a re-size trigger |
| 9 | priority assigned | **MET** — `P2`, argued both ways, with promotion and demotion triggers |
| 10 | no major unresolved blocker | **⚠️** — see below |

**Score: 9/10, ⚠️x1. PULLABLE TODAY.**

## The ⚠️ (item 10), named rather than smoothed

**`A4`'s replacement wording depends on an outcome that is a RACE.** QE measured the `G-03` mutant's
symptom as reachable in two directions — the loop wins the single slot and the move is played, or the
orphaned pre-read wins it and the move is eaten — and separately established that **the FIFO harness
cannot terminate for any program on this platform**, so *"still running at 10 s therefore HUNG"* was never
evidence about a build. Which of `A4`'s two shapes ships (RE-MEASURE both outcomes, or STRIKE the
empirical clause) is genuinely undecided at the cut and belongs to the repair hop and its validator, not
to BA/PM.

**This is a CONSEQUENCE authorised on the page, not an open question that stalls the ticket** — the same
species as `ABC-112`'s ⚠️. `A4` admits STRIKE as a first-class outcome precisely so that a measurement
that will not stabilise cannot block delivery. It is scored as a ⚠️ anyway because a criterion whose
final wording is chosen mid-hop is not a criterion an engineer can read once and execute.

## Size: `S`, and the comparable is `ABC-113` (`XS`/`P2`)

`ABC-113` changed **two assertions** in the same two files and was `XS`. `ABC-114` changes **zero**
assertions and four comment blocks — a strictly smaller edit surface. It is sized **up** anyway, and the
delta is not the edit:

- `A1`–`A3` require **three wrong builds planted at the tip, each with a control run against
  `git show main:…`** — `ABC-113`'s `XS` covered three plants and no controls in its criteria (its QE hop
  ran seven plants voluntarily, which is not what the size priced).
- **`A4` adds a FIFO harness that a QE hop has already shown cannot terminate**, against a mutant whose
  symptom is a documented race. That is the whole of the `XS`→`S` step.

**RE-SIZE TRIGGER, pre-registered:** `XS` if the repair hop takes `A4`'s STRIKE branch, or if `ABC-043`'s
UAT repairs S4 in place first. **NOT split today** — splitting on a decision nobody has taken produces two
half-tickets and an argument.

## Priority: `P2`

**NOT `P1`.** Nothing is blocked, no gate is wrong, no criterion is falsified, and every assertion beneath
every false sentence is sound and was watched RED before it shipped. The live `P1` comparable is
`ABC-112`, where the **product** tells the **player** it honours a command it does not — a user is misled
there; here a maintainer is.

**NOT `P3`.** Three independent QE hops found these; they are on `main` today; and each one mis-prices a
guard **in the direction that gets guards deleted or over-trusted** — S3 and S2 undersell (a reader
concludes a row buys nothing and deletes it), S1 and S4 oversell (a reader trusts a row that is blind).
This project has twice been bitten by documents that were true and unread; a document that is read and
false is the same failure with the evidence removed.

**`P1` PROMOTION TRIGGER:** any hop measured making a routing decision off one of these four sentences
(for instance a ticket cut to "close" something S2's silence implies is already closed), **or** a fifth
false sentence found in these two files. **`P3` DEMOTION TRIGGER:** S4 repaired in place by `ABC-043`'s
UAT or follow-up, leaving three sites and no harness work.

## RULING — the two sentences on `plans/tickets/ABC-113-…md` (lines 64 and 106)

The brief left this to me because QE explicitly declined to amend a BA/PM page. **Ruling: IN SCOPE of
`ABC-114` — `A2` covers line 64, `A3` covers line 106 — and NOT corrected at this hop.** Three reasons,
in order of weight:

1. **A same-hop correction would spend exactly the principle this ticket exists to protect.** BA/PM cut
   `ABC-113`, BA/PM wrote both sentences, and BA/PM is cutting the ticket that governs their repair. Fix
   them here and the author, the adjudicator and the ticket-writer are one agent with nothing validating
   the result — which is the `ABC-113` conflict with the roles renamed.
2. **Line 106's correct wording is only earnable by re-constructing `M15`**, which `A3` requires of the
   repair hop and which a refinement hop has no business doing. Rewriting it now would mean **copying a
   note** — the precise act `A3` declares a FAIL.
3. **`ABC-113` is `Done`.** Its page is an accepted record. Moving text on it changes what was accepted
   and deserves a named, reviewed hop, not a quiet edit folded inside a cut.

**The cost of the ruling, stated rather than smoothed: two false sentences remain on a `Done` page for as
long as `ABC-114` sits in `Backlog`.** The mitigation available to me without adjudicating is the one I
took — they are named as false on `ABC-114`'s page, on its board row, in its trace row and here, so the
record is not silent about them in the meantime. **If the Orchestrator would rather have line 64 and 106
corrected today than hold them, that is a defensible call and I say so plainly — it just is not mine to
take from inside the hop that wrote the ticket.**

## What I refused

- **Every edit under `src/`.** Not one comment. This hop cuts a ticket; it does not repair.
- **Re-planting `M9`, `D4`, `M15` or the FIFO harness.** Authoring the numbers here would hand the repair
  hop a note to copy, and `A3` exists to forbid exactly that.
- **Inventing a fourth false test-file sentence** to fill the *"closes `D3`"* slot the brief predicted.
  It is on the `ABC-113` page, not in `src/cli.test.ts`; recorded in the `observation` note.
- **Cutting the EPIPE regression, the lane-inventory gap or `G-06`.** One ticket only, as instructed.
  **None of the four sites belongs to any of them** — I checked: EPIPE is a live session-death defect in
  the product, the lane inventory is a `vitest` config question, `G-06` was confirmed out of `ABC-043`'s
  scope by its QE hop, and all four sites here are comment prose about instruments.
- **Moving `ABC-043`** (still `Ready for UAT`, awaiting the owner's word) **or re-opening `ABC-113` /
  `ABC-044`.**
- **Writing a row to `.grugops/test-skips.md`.** Human-owned, and it does not exist —
  `UNKNOWN - verify`, never read as a pass.
- **Merging, deploying, or committing on `main`.** Work is on `grugops/cut-false-sentences`; the merge is
  the Orchestrator's and the owner's.
