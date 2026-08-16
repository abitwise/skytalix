---
id: 20260816T043000Z-ba-pm-decision-dedupe-verdict-on-s1-s2-q3-q4-2a7c91f4
kind: decision
by: ba-pm
at: 2026-08-16T04:30:00Z
verified_by: 
confidence: high
refs:
  - ABC-058
  - ABC-060
  - ABC-072
  - ABC-073
  - .grugops/context/security-nfr-ABC-066/notes/
  - .grugops/context/quality-gate-ABC-066-qe/notes/
supersedes: 
---

# Dedupe first, cut second — **2 of the 4 survived**, and `ABC-058` is NOT their home

Hand-authored per `AGENTS.md` § Role / workflow files. **No `kind: finding`, no `§14-gate#<id>`
stamp** — `scripts/context-io.ts` and `mcp__grugops__propose_note` are absent here and
`context.human_admission` is `off`. QE's `Q5` records the same limitation; referenced, not restated.

| item | source | verdict | where it went |
|---|---|---|---|
| **`S1`** — `ABC-066` § Security answers a DELTA against a STATE clause | Security/NFR, MEDIUM | **SURVIVES** | **`ABC-072`** (shape) + **`ABC-073`** (the copies) |
| **`S2`** — clause (b)'s instrument covers 1 of 3 limbs; its prediction is falsified | Security/NFR, LOW | **SURVIVES**, folded into `S1`'s ticket | **`ABC-072`** `A3`/`A4` |
| **`Q3`** — the guard cannot see an option advertised twice | QE, LOW | **FOLDS — accepted, no ticket** | recorded in the `Q3`/`Q4` decision note |
| **`Q4`** — cosmetic whitespace in the usage line passes | QE, LOW | **FOLDS — accepted, no ticket** | same |

**Two new tickets, both inside `ABC-072`…`ABC-074`. `ABC-074` is unused and stays unused** — there
was no third subject, and cutting one to fill the range would be manufacturing work.

## Why `S1`/`S2` do NOT belong on `ABC-058` — the check the subtask asked for, answered on evidence

The subtask named `ABC-058` as the likely home: *"three security-bar instruments cannot observe their
own clauses"*, already carrying `S1`/`Q5`, `S4`, `S5`. **Three reasons it is the wrong page, in
descending strength:**

1. **`ABC-058`'s `A8` forbids it.** That criterion reads *"`git diff --name-only <delivered
   commit>~1 <delivered commit>` shows **exactly** `src/cli.test.ts` — **one path**"*. `S1`/`S2` are
   repaired in **markdown**, in a decision artifact and on ticket pages. **Folding them in breaks the
   ticket's own acceptance row**, and its `Lane cost` section (*"Zero, and zero new children"*) and
   `A7` (`spawned` pinned at 10) are built on that same single-file shape.
2. **Different clause family, despite the identical label.** `ABC-058`'s `S1`/`S4`/`S5` are
   Security/NFR's findings about **`ABC-042`'s four ASVS bars**, instrumented as assertions inside
   `src/cli.test.ts`. This task's `S1`/`S2` are about **`ABC-041`'s four firing-threshold clauses** —
   ticket prose that decides whether the gate runs at all. `ABC-058`'s own Test note 5 already warns
   about exactly this label collision (it names the Scribe's `S4`/`S5`); **this is a third collision
   and it is named on both new pages.**
3. **`ABC-058` is at `DoR 9/10` with one ⚠️ and a named reviewer.** Adding a subject with a different
   owner (Architect/Design rules `S2`'s threshold shape) and a different done-condition would take it
   off Ready and force a re-review. **That is the textbook definition of scope creep on a nearly-ready
   ticket.**

**What I did NOT do as a result:** `plans/tickets/ABC-058-*.md` is **not edited** — the subtask
permits writing it in the fold case only, and this is not the fold case. Its stale dependency block
is reported as a gap instead.

## Why `S1`/`S2` do NOT fold into `ABC-060` either

`ABC-060` is *"four `EPIC-006` tickets copy `A12`'s diff-scoping clause without naming the diff"* —
same **shape** (a copied clause defect propagating across pages), different **object** (`ABC-042`
`A12` diff scoping) and a **disjoint page set** (`ABC-043`–`ABC-046`). Measured: **none of those four
restates `ABC-041` clause (b)** (`grep -rln 'non-\`.test.ts\` file under' plans/tickets/` returns
`ABC-041`, `053`, `054`, `055`, `057`, `058`, `059`, `061`, `065` — and not `043`–`046`). `ABC-060` is
also the one `EPIC-006` follow-up at `DoR 10/10`; widening it would cost that. **Recommendation
instead: schedule `ABC-073` and `ABC-060` to the same hop — same pen, same file type, no shared
criteria.**

## Why `S1` and `S2` became TWO tickets rather than one

They share an object (`ABC-041` clause (b)) but not a decider or a done-condition:

- **`ABC-072`** needs a ruling that is **Architect/Design's** — is (b) a state test or a delta test —
  and cannot be closed by BA/PM's pen. Board precedent for holding a ticket on exactly that: `ABC-053`
  and `ABC-054`.
- **`ABC-073`** is seven page edits that **cannot start** until that ruling lands, and would be
  actively harmful if started first (a guess propagated to seven pages).

One ticket would have mixed two roles' pens and hidden a hard ordering inside a single criteria list.
**Rejected alternative — a third ticket for the `ABC-065` skip question:** it is one sentence in
`ABC-072` `A5` and belongs to the Orchestrator, not to a ticket of its own. `ABC-074` therefore stays
unused.
