---
id: ABC-109
title: "`AGENTS.md` is inside three edits of a 32,768-byte cap that truncates SILENTLY from the tail — restructure it under budget without losing a directive"
status: backlog
column: Backlog
size: M
priority: P1
epic: —
feature: —
---

# ABC-109 — the one file every role reads first is about to start being read short, and nothing will say so

> **Cut 2026-08-19 by BA/PM** (task `cut-agents-md-cap-2026-08-19`, Workflow 07) from the
> `AGENTS.md` Scribe's observation at `grugops/agents-md-input-deep`
> (`.grugops/context/agents-md-input-deep-2026-08-19/notes/`), which recorded the size and
> **deliberately declined to act on it inside a correction hop**. That judgement is why this is a
> ticket and not a patch.
> **Owner: the `AGENTS.md` Scribe.** It owns that file's voice and its 12 coding rules, and **the
> shape of the remedy — compaction, extraction, or a different structure — is the Scribe's call,
> not BA/PM's.** This page cuts the PROBLEM and fences the remedy out.
> **Every byte figure below was measured by BA/PM at this hop with `git cat-file -s` / `wc -c` and
> is reproducible from the shas named. The 32,768 cap itself is INHERITED — see
> `## What is measured here and what is inherited`.**

## Problem

*User*: every role on this project, without exception. `CLAUDE.md` sends every agent to `AGENTS.md`
**first**, and the role adapters do too. It is the one document read before any work happens.

*Pain*: **`AGENTS.md` is approaching a 32,768-byte reader cap, and past it the file is truncated
SILENTLY — no error, no warning — from the TAIL.** The tail is where `## When uncertain`, the
Definition-of-Ready pointer and the Definition-of-Done pointer live. **The gate instructions are the
first thing to fall off the end, and the reader that loses them is told nothing.** A role does not
read a broken file; it reads a shorter file that looks complete.

*Value*: **this project has already been bitten twice by documents that were true and unread.**
`ABC-070` exists because a page named a drained claim as live. The Orchestrator's own 2026-08-16
disclosure records a precondition violated *"because I did not read this file at hop start."* Both
of those left evidence. **A file that silently stops being read is the same failure with the
evidence deleted** — the reader cannot tell, the writer cannot tell, and the diff that caused it
looks like a normal documentation commit. This ticket does not make `AGENTS.md` shorter for
tidiness. It buys back the margin that keeps the file's own gate instructions readable, and it does
it while the loss is still hypothetical rather than after a hop has run on a half-read rulebook.

## The measurement — taken at this hop, reproducible

Every size is `git cat-file -s <sha>:AGENTS.md`. The eight most recent states of the file, oldest
first — six that were on `main` when this hop started:

```
39122ec  docs(agents-md): the -- separator in Dev / run, ABC-065       21,638
a8edb11  docs(uat): owner acceptance of ABC-065 and ABC-066            22,771   +1,133
b584803  docs(agents-md): the standing UAT waiver, named an override   24,522   +1,751
9998a54  docs(governance): every ticket passes through QE              26,240   +1,718
a00c2a3  feat(search): ABC-077 recursion core                          26,902     +662
91d852e  feat(engine): ABC-078 deepen against the clock                27,690     +788   <- main @ 14c34bd
```

**Five measured deltas on `main`, +6,052 bytes, mean +1,210 per edit. Not one of them shrank the
file.**

Two further edits landed **while this ticket was being cut** — they were unmerged when the
measurement was taken and the Orchestrator merged both mid-hop (`3032622`, `c5dc3d2`). **Re-measured
after the merges, not assumed:**

```
8347c6d  docs(agents): the ABC-037 INPUT_DEEP lane                          28,873   +1,183
8466bef  docs(agents-md): the Scribe's heapUsed amendment                   29,749     +876
                                                     <- main @ c5dc3d2, VERIFIED 2026-08-19
```

**All seven measured deltas: +8,111 bytes, mean +1,159 bytes per edit — the rate this page sizes
headroom against.**

| | bytes | headroom | headroom in edits at +1,159 |
|---|---|---|---|
| the cap (inherited) | **32,768** | — | — |
| `main` @ `14c34bd` (when this hop started) | **27,690** | 5,078 (15.5%) | **4.4** |
| **`main` @ `c5dc3d2` — LIVE, both merges landed** | **29,749** | **3,019 (9.2%)** | **2.6** |

**Three more ordinary documentation edits and the file is over** — and two of
the seven measured edits were larger than 1,700 bytes on their own, so **two** is a live case, not a
pessimistic one. That is not a forecast on a trend line; it is arithmetic on seven consecutive
measured edits, none of which was unusual and none of which was resisted at the time.

*(Minor, recorded because it is a number on a page: the Scribe's own note reports its edit as
**+704**; measured tip-to-tip it is **+876**. The discrepancy does not change any conclusion here
and is not this ticket's to resolve.)*

## Why this is NOT a trim-the-fat exercise — and the page will not pretend otherwise

**The Scribe reports that every remaining paragraph is a pointer to an owner directive or to a
kit-override precedence note.** BA/PM measured where the bytes actually are, and the measurement
agrees with the Scribe rather than softening it:

| section | bytes | % of file |
|---|---|---|
| `## Test and UAT authority` | 4,678 | 16.9% |
| `## Deployment posture` | 3,228 | 11.7% |
| `### Test` | 2,463 | 8.9% |
| `## Branching model` | 2,263 | 8.2% |
| `## QE validation authority` | 1,717 | 6.2% |
| `## Process rules (this project)` | 1,700 | 6.1% |
| **those six** | **16,049** | **58.0%** |

**The mass IS the load-bearing part.** Those six sections carry the 2026-08-15 merge/test/UAT/deploy
grant, the 2026-08-16 signature ruling, the 2026-08-17 zero-production-lines UAT waiver, the
2026-08-17 QE-dispatch directive, all three kit overrides and both explicit *"this is NOT an
override"* rulings. **There is no slack pile to delete from.** The remaining 42% is command slots,
the 12 coding rules, and the tail this ticket exists to protect.

A second measured input, offered as raw material and **not** as a prescription: **16 HTML comment
blocks hold 4,657 bytes, 16.8% of the file** — verification receipts attached to command slots.
Four of them are 555–771 bytes each. What that means for the remedy is the Scribe's to decide.

**So: something load-bearing must move somewhere it is still read, or the file must be
restructured. A diff that shrinks this file by dropping a directive is the failure mode this page
exists to make impossible**, and `A2` below is written to catch exactly it.

## What is measured here and what is inherited

- **Measured at this hop by BA/PM:** every byte count, every delta, the per-section mass table, the
  HTML-comment total, and the live test couplings in `## Dependencies`.
- **Inherited, and named as inherited:** the **32,768-byte cap**, the fact that overflow is
  **silent**, and that truncation eats the **tail**. Source: the Scribe's observation note of
  2026-08-19 and the Orchestrator's brief at this hop. **BA/PM did not re-derive the reader's
  behaviour and this page must not be read as though it had.** Exact truncation semantics on any
  other reader: **`UNKNOWN - verify`.**
- **Why the ticket stands anyway, and this is the honest part:** the direction is monotone, so what
  an error in the cap moves is the deadline, not the sign. **A cap 15% larger (37,683) would leave
  today's file 7,934 bytes ≈ 6.8 edits of headroom instead of 2.6** — about four edits of
  postponement, at a rate of roughly one edit per hop that touches the file. **`A8` requires the
  provenance to be written down**, so the next reader inherits an inherited number as inherited.

## Scope

- **Bring `AGENTS.md` under a stated byte budget with headroom expressed in edits at the measured
  rate**, measured on `main` at or after `c5dc3d2` — the 29,749-byte tree (see `A1`).
- **Preserve every owner directive and every kit-override precedence note as a resolvable
  pointer**, enumerated before and after (`A2`).
- **Keep the tail's gate instructions** — `## When uncertain`, the DoR pointer, the DoD pointer
  (`A3`).
- **Keep the machine-checked couplings intact without editing the tests that check them** (`A4`).
- **Land the byte-count guard ruled owed below** (`A5`), in a test file that already exists.
- **Record the cap's provenance in the file itself** (`A8`).

## Out of scope

- **The 12 coding rules' content.** They are the Scribe's and this ticket does not re-open them.
- **Any change to what a directive SAYS.** This ticket moves and re-points text; it does not amend
  an owner directive, re-rule a kit override, or change the count of overrides (it is **three**).
- **Anything under `src/` that is not a `.test.ts` file.** Zero production lines (`A6`).
- **`CLAUDE.md`, the role adapters, and `agent-factory/`.** The kit is **read-only KIT** and can
  never be a destination for moved text (`A7`).
- **Re-deriving the reader cap or building a harness to prove silent truncation.** Inherited on
  purpose; see above.
- **The `plans/traceability.md` entry owed by the Scribe's amendment (`8466bef`).** The branch was
  merged mid-hop at `c5dc3d2` **and `plans/traceability.md` on `main` still carries no entry for
  it** — verified, not assumed. Recorded in this hop's context notes and on the trace header, owned
  by the integrator. **Not this ticket's**, and this ticket must not quietly absorb it.

## Acceptance (Given/When/Then)

- **`A1` (it fits, with headroom stated as a number AND as edits).** **Given** `AGENTS.md` at or
  after `main` @ `c5dc3d2` — the **29,749**-byte tree that already contains the `ABC-037`
  `INPUT_DEEP` slot and the Scribe's `heapUsed` amendment — **when** the restructure lands, **then**
  `wc -c AGENTS.md` reads **≤ 24,576 bytes** and the record states the exact figure, the headroom
  against 32,768, **and** that headroom divided by the measured **1,159 bytes/edit** (at 24,576 that
  is 8,192 bytes ≈ **7.1 edits**). *(The base must be re-measured at pull time rather than taken
  from this page: it moved by +2,059 bytes during the hop that cut the ticket.)*
- **`A2` (no owner directive and no kit-override precedence note loses its pointer — enumerated,
  not asserted).** **Then** the record carries a **before/after table with one row per item**,
  covering at minimum: the 2026-08-15 merge/test/UAT/deploy grant; the 2026-08-16 signature ruling
  **and its explicit "this is NOT a kit override"**; the 2026-08-17 zero-production-lines UAT waiver
  **and its "this IS the third override"**; the 2026-08-17 QE-dispatch directive **and its "NOT an
  override"**; the branching model override; the deployment posture override; `ADR-0007`;
  `ADR-0008`; the kit-vs-state precedence rule. **Every "after" cell names a file and a section that
  was OPENED and found to contain the text** — a pointer that resolves, not a path that looks right.
  **The count of kit overrides reads THREE before and THREE after**, and the sentence that tells a
  reader who counts four that they are wrong survives somewhere a reader of `AGENTS.md` reaches.
- **`A3` (the tail this ticket exists to protect is still there).** **Then** `AGENTS.md` still
  contains `## When uncertain`, the Definition-of-Ready pointer and the Definition-of-Done pointer,
  and the record states the byte offset at which each begins together with the file's total size —
  so a reader can see that all three sit inside the budget rather than take it on faith.
- **`A4` (the live machine-checked couplings hold, and are NOT relaxed to make room).** **Then**
  `npm test` is green, and specifically: `- Dev / run:` occurs **exactly once**; its HTML comment
  **closes before the next top-level list item**; the literal ``- Dev / run: `npm run chess` `` is
  present; and `UNKNOWN - verify` does **not** appear on that line. **And** `git diff` shows the
  four asserting sites in `src/cli.test.ts` (`:283`, `:1029`, `:1044`, `:1130`) **unmodified** —
  *(deleting the coupling instead of honouring it is the cheap way to make a file fit, and it is
  forbidden here)*.
- **`A5` (the guard exists, lives in a file that already exists, and has been watched go RED).**
  **Then** a byte-count assertion guards `AGENTS.md` against a named budget constant, **in a test
  file that already reads `AGENTS.md` from disk** — **no new test file** (see
  `## The guard is OWED, and it is one assertion`). Its rule is a **pure function of the byte count**
  so the failing path is exercised on an in-memory number rather than by writing the real file. The
  record carries **the actual failure message observed with the budget exceeded by one byte**.
  *(`AGENTS.md`'s own standing rule, landed 2026-08-19: never ship a guard you have not watched go
  RED. This one obeys the rule written in the file it guards.)*
- **`A6` (zero production lines, and the lane charge is measured not asserted).** **Then**
  `git diff --name-only <base> <tip> | grep -v '\.test\.ts$' | grep '^src/'` comes back **empty**;
  **0 new test files**; **0 new spawns**; the default lane's **test count grows by at most 2**; and
  the record states the measured wall-clock cost of the added assertion(s).
  *(Empty here also means the 2026-08-17 UAT waiver is AVAILABLE to this ticket — stated as a fact
  about the diff, not claimed in advance.)*
- **`A7` (nothing is moved into a file no role reads, and nothing is moved into the kit).** **Then**
  every destination that received moved text is **repo state** — `memory-bank/`, `plans/`, or a new
  repo document — and **not** `agent-factory/`, which is read-only KIT and cannot carry a project
  override. **And** for each destination the record names **which role reads it and when**, so
  "moved somewhere it is still read" is a checked claim rather than a hope.
- **`A8` (the cap is recorded as inherited, with its date and its source).** **Then** `AGENTS.md`
  carries, in one short line, the budget, the cap it is derived from, **and that the cap is
  inherited from the 2026-08-19 Scribe observation rather than measured in this repository** — so
  the next reader neither re-derives it by accident nor quotes it as a repo measurement.

## Dependencies

- **The ordering hazard this page was cut with is DISCHARGED BY MEASUREMENT, and the discharge is
  recorded rather than smoothed away.** When the ticket was written, two branches carried +2,059
  bytes of this file and both touched `### Test` — a restructure of that section beside a live
  amendment of a comment inside it is a conflict in the densest region of the file. **Both merged
  mid-hop** (`3032622`, `c5dc3d2`) and `main:AGENTS.md` was re-measured at **29,749** afterwards.
  **No unmerged edit to this file is outstanding at cut time.** The standing obligation that
  replaces it: **re-measure the base at pull time** — this file moved by 2,059 bytes in the hours it
  took to cut one ticket about its size.
- **`src/cli.test.ts` is a live consumer of this file's STRUCTURE, not just its text.** It reads
  `AGENTS.md` from the repository root at `:278`, `:1050`, `:1127` and `:1157` and asserts slot
  uniqueness, comment closure and the `Dev / run` command string. **A restructure that moves or
  re-labels the `- Dev / run:` slot or its HTML comment reds the suite** — which is the good case,
  since it fails loudly. `A4` pins it.
- **`agent-factory/` is read-only KIT.** It cannot receive moved text and it cannot carry a project
  override. Destinations are repo state only (`A7`).
- **The cap value is inherited** and no work here re-derives it (`A8`).
- **Not blocked by any ticket.** No `EPIC` dependency; nothing in `EPIC-004` interacts.

## The guard is OWED, and it is one assertion in a file that already exists

**Ruled here, because "consider a guard" is not an answer and this repo's habit is that an
unenforced number goes stale.** The ruling is **yes**, with the cost weighed against `ABC-108`
rather than waved past it:

- **What `ABC-108` makes unaffordable is a test FILE.** Its own reading prices the default lane at
  **341–383 ms all-in per test file**, against an `NFR-008` CPU clause that the same reading puts at
  or over its limit. **A new test file is exactly the purchase that budget cannot fund.**
- **What this guard needs is not a file.** `src/cli.test.ts` already opens `AGENTS.md` from the
  repository root in four places. A byte-length assertion against a named constant is **one more
  read of a ~28 KB file plus a comparison** — sub-millisecond, no spawn, no fixture, no new
  collection cost. `A6` requires that cost be measured and stated rather than assumed.
- **So: the guard is owed; a new test file is not.** Placement in `src/cli.test.ts` is the cheapest
  site identified by BA/PM and is offered as such; **the final placement is the implementer's**, on
  the one condition that the file already exists and already reads `AGENTS.md`.
- **What the guard must NOT be**: a hash of the file, a line count, or anything pinned to a
  rendering. `ABC-059` exists on this backlog because a guard pinned a spelling instead of a fact.
  **The fact here is a byte count against a budget**, and nothing else.
- **And it must be watched RED before it ships** (`A5`) — the rule `AGENTS.md` itself now carries.

**Without the guard, `A1` is a number that was true on the day it was written**, and the next six
edits put it back where it started with nobody watching. That is the failure this project has
already recorded twice.

## Security / NFR triggers

- **Security — no new surface.** No production code, no dependency, no network, no secret, no input
  parsing. **Firing threshold, falsifiable:** any file added under `src/` that is not a `.test.ts`,
  any change to `package.json`, or any change to `src/line-input.ts` / `src/cli.ts`.
- **`NFR-008` (≤ 3 s wall / ≤ 13 s CPU, default lane) — the trigger, and the target is "no
  measurable change".** The added assertion must not move the lane: **0 new test files, 0 new
  spawns, ≤ 2 new tests, one additional ~28 KB `readFileSync`.** The record states the measured
  before/after test counts and file counts.
- **`N8-LANE` — DELIBERATELY NOT QUOTED, for the same reason `ABC-108` does not quote it.** A 5%
  slice of a total under open question is not a slice. **What this page carries instead is
  falsifiable: 0 new test files, 0 new spawns, 0 production lines** (`A6`).
- **`N8-SPAWN` — 0 ms.** Nothing here spawns a process.

## Test notes

1. **Measure bytes, not characters, and measure from disk.** `wc -c` / `git cat-file -s`. Every
   figure on this page was taken that way and any restatement that disagrees should be assumed to be
   measuring something else.
2. **Re-measure the base at pull time; do not quote 29,749 from this page.** That figure is `main`
   @ `c5dc3d2` on 2026-08-19, and the file moved **+2,059 bytes during the hop that cut this
   ticket**. A shrink stated against a stale base is not a measurement.
3. **`src/cli.test.ts` reads `AGENTS.md` from the repository root**, which is why out-of-tree lane
   measurements on this project copy `AGENTS.md` alongside (`ABC-108` test note 2). Any restructure
   that splits content out of `AGENTS.md` into a second file **must not** add a second such
   dependency without saying so — a test that reads two docs is two files to copy.
4. **Exercise the guard's red path in memory.** Follow the `ABC-065` / `ABC-067` pattern already in
   `src/cli.test.ts`: a pure function over a string or a number, so no test writes `AGENTS.md` and no
   failure can leave the working tree dirty.
5. **The `A2` before/after table is the deliverable that matters most, and it is done by opening the
   destinations.** A path that looks right is not a pointer that resolves. Nine items minimum; more
   if the restructure moves more.
6. **Do not repair `src/cli.test.ts:1041`'s stale prose here.** Its comment says `AGENTS.md` *"carries
   13 further closers after this slot's own"*; the file carries **16 comment closers, 15 of them after
   that slot**. It is a comment, not an assertion — nothing reds — and it is **found and deliberately
   not cut** at this hop. Widening this ticket to chase it would be scope creep on a page about
   scope.

## Size and priority rationale

**Size `M` (3).** An editorial pass over 27.7–29.7 KB of unusually dense prose in which **58% of the
mass is load-bearing**; a decision per moved paragraph about where it will still be read; a
nine-row before/after preservation table built by opening each destination; a byte measurement; and
one guarded assertion watched red. **Not `S`:** this is not a trim — there is no slack, and the
preservation proof is most of the work. **Not `L`:** no code is designed, no production line is
written, the destinations (`memory-bank/`, `plans/`) already exist and are already read, and the
file is one page with a known consumer. **Re-size trigger, named:** if the Scribe concludes that the
budget cannot be met without amending what a directive SAYS, **stop and re-cut** — amending a
directive is the owner's and is fenced out of this page by `## Out of scope`.

**Priority `P1`.**

**NOT `P0`.** Nothing is truncated today: `main` sits at **29,749 with 3,019 bytes still under the
cap** and the file is whole. Putting this ahead of the `EPIC-004` chain would be
BA/PM using priority to express alarm, and the alarm is already in the first paragraph.

**NOT `P2`, and this is the half worth defending.** Three measured reasons. **(1) The margin is 2.6
edits at a mean of seven consecutive measured edits, and every one of the seven added bytes.** **(2) The
failure is silent and it is tail-first** — the cost of being late is not a broken build, it is a
role that read `AGENTS.md` without `## When uncertain`, the DoR pointer or the DoD pointer and had
no way to know. This project's two prior document failures both left evidence; this one does not.
**(3) Every hop between now and the ruling spends headroom nobody is measuring** — there is no guard
today, so the next documentation commit is as free to add 1,700 bytes as `b584803` was.

**Promotion trigger, named in advance:** if `AGENTS.md` is measured at **> 31,000 bytes** on any
branch, or if any role reports a read of it that is missing `## When uncertain`, this becomes
**`P0`**.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-19**. **Result: 10 of 10, 0 ⚠️ — READY.**

**Scored 9/10 first, with a ⚠️ on item 5, and re-scored inside the same hop when the fact it rested
on was DISCHARGED BY MEASUREMENT.** The ⚠️ was the two unmerged branches carrying +2,059 bytes of
this file into `### Test`; the Orchestrator merged both mid-hop (`3032622`, `c5dc3d2`) and
`main:AGENTS.md` was re-measured at 29,749 afterwards. **The first score and the reason it moved are
recorded here rather than overwritten** — a DoR that quietly becomes 10/10 teaches the next reader
nothing.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** the user is every role on the project, the pain is 3,019 bytes of headroom against a cap whose overflow is silent and tail-first, and the value is stated against two prior recorded failures of the same species |
| 2 | scope and out-of-scope clear | **✅** six in scope, six fenced out including the remedy's shape, the directives' content, the kit as a destination, and the Scribe's owed trace row |
| 3 | INVEST-shaped | **✅** independent of every ticket in flight; estimable because the remedy shape is the Scribe's and the preservation list is enumerated; small (0 production lines); **testable — every criterion is a byte count, a resolved pointer, an unmodified diff region, or an observed failure message** |
| 4 | acceptance testable and measurable | **✅** eight: **≤ 24,576 bytes** measured on the integrated tree with headroom stated in edits at **1,159 B/edit**; a **nine-row minimum** before/after pointer table verified by opening each destination; three tail anchors with byte offsets; four named assertion sites in `src/cli.test.ts` unmodified; a guard **watched RED** with its message recorded; `grep '^src/'` **empty** with **0** new test files and **≤ 2** new tests; every destination named with its reader; the cap recorded as inherited |
| 4 | acceptance testable and measurable | **✅** eight: **≤ 24,576 bytes** measured on the live tree with headroom stated in edits at **1,159 B/edit**; a **nine-row minimum** before/after pointer table verified by opening each destination; three tail anchors with byte offsets; four named assertion sites in `src/cli.test.ts` unmodified; a guard **watched RED** with its message recorded; `grep '^src/'` **empty** with **0** new test files and **≤ 2** new tests; every destination named with its reader; the cap recorded as inherited |
| 5 | dependencies known | **✅, and it was a ⚠️ until it was measured.** The ordering hazard — two unmerged branches carrying **+2,059 bytes** of this file into `### Test` — **is DISCHARGED: both merged mid-hop (`3032622`, `c5dc3d2`) and `main:AGENTS.md` re-measured at 29,749.** No unmerged edit to this file is outstanding. The standing obligation that replaces it is on the page: **re-measure the base at pull time.** The rest were known from the start — the `src/cli.test.ts` structural coupling with four line anchors, `agent-factory/` as read-only KIT and therefore never a destination, and the inherited cap |
| 7 | test notes present | **✅** six, including the integrated-tree measurement trap, the two-document copy hazard for out-of-tree lane readings, the in-memory red-path pattern, and one found-but-deliberately-not-cut item |
| 7 | test notes present | **✅** six, including the re-measure-at-pull-time trap (this file moved +2,059 bytes during the cutting hop), the two-document copy hazard for out-of-tree lane readings, the in-memory red-path pattern, and one found-but-deliberately-not-cut item |
| 9 | priority assigned | **✅** `P1`, with not-`P0` and not-`P2` both argued from measured numbers and a named promotion trigger at **31,000 bytes** |
| 10 | no major unresolved blocker | **✅** the owner is named, the remedy shape is explicitly the owner's to choose, the guard question is **RULED on this page** rather than left open, and no environmental precondition is needed — the work is one editorial pass and one assertion |

Column moves are the Orchestrator's.
