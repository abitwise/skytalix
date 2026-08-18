---
id: ABC-108
title: The default test lane sits at or over `NFR-008`'s 13 s CPU clause and it did so BEFORE `ABC-078` arrived — re-measure on a quiet machine and rule
status: backlog
column: Backlog
size: M
priority: P1
epic: —
feature: —
---

# ABC-108 — `N8-LANE` cannot honestly be granted to any ticket until `NFR-008`'s CPU clause is re-measured and ruled

> **Cut 2026-08-18 by BA/PM** (task `cut-lane-budget-2026-08-18`, Workflow 07) from **`OQ-1`**,
> the open question Security/NFR filed at `ABC-078`'s gate.
> **Every measurement on this page is Security/NFR's, copied and not re-derived.**
> `.grugops/context/security-nfr-ABC-078-2026-08-18/notes/` and the `N8-LANE` section appended to
> `plans/nfr-catalog.md` at `423a5d1`.
> **This page cuts the PROBLEM. The remedy is Architect/Design's and the owner's — see
> `## The remedy is NOT decided here`.**

## Problem

*User*: every role that grants, measures or reads an `N8-LANE` number — BA/PM at a cut,
Security/NFR at a gate, Architect/Design as the owner of `NFR-008` and its accounts — and, behind
them, the owner, whose `3 s wall / 13 s CPU` level this is.

*Pain*: `N8-LANE` is defined as **5% of `NFR-008`'s lane total**. Security/NFR re-measured the lane
under the row's own protocol at `ABC-078`'s gate, and **the condition that removes `ABC-078`
entirely — the lane exactly as it stood before that ticket — medians 13.400 s CPU against
`NFR-008`'s 13 s clause.** The engineer, from a very different machine state, read **12.2–13.1 s**
for the same thing.

**This is `NFR-008`'s own forecast, arriving on schedule with nobody watching.** The ratified
2026-08-13 reading measured 9.545 s CPU at 28 files post-`threads` and published the consequence in
its own words — *"USE ~7 AS THE PLANNING NUMBER AND ~16 AS THE CEILING"* at ~341 ms all-in per
file, calling the position *"tight, not comfortable"*. **The lane now carries 35–36 files. Seven to
eight files have landed since — the whole planning number.** The row did not fail to see this
coming; nobody re-read it at a cut.

*Value*, and it is the sentence that makes this urgent rather than tidy: **until this is ruled,
`N8-LANE` cannot honestly be granted to any ticket — a 5% slice of a total that is already spent is
not a slice of anything.** Every ticket now in flight and every ticket in `Backlog` carries an
`N8-LANE ≤ 650 ms` line. That line is arithmetic over a budget this reading says no longer exists.
This ticket does not make the lane faster. **It makes the number mean something again, in either
direction** — the restated figure either confirms the clause is breached, or shows it is not.

## The reading this ticket inherits — copied, not re-derived

Three **out-of-tree** copies of the delivered tree (no sibling worktree inside any measured tree,
no `.claude/worktrees/` in any of them), CPU (user + sys), one fresh OS process per run, condition
order rotated every round, 9 rounds with round 0 discarded, **n = 8**, every run asserting its own
test-file and test counts (27 usable runs, 0 harness errors).

```
condition medians, n = 8            CPU (user+sys)      WALL
A  delivered,        36 files          14.635 s        2.935 s
B  without the file, 35 files          13.400 s        2.805 s     <- the lane BEFORE ABC-078
C  identity twin,    36 files          14.540 s        2.960 s

identity null control  -0.66% CPU, sign 2/8 positive  ->  inside the row's <= 1.5% clause
                                                          THE READING IS ADMISSIBLE
```

**The honesty clause, and it is why this is an open question and NOT an `NFR-008` BREACHED
verdict.** All-in cost in that reading is 13.400/35 = **383 ms per file**, against the ratified
post-`threads` figure of **341 ms**. Deflating the base by that 12% puts it near **11.9 s — under
the clause**. **A fraction of those absolute totals is load inflation Security/NFR could not
separate from content.** The **paired deltas** are the robust part — which is exactly why the row
is written on paired deltas — and **the absolute totals are indicative and discharge nothing.**
**This ticket must not be built, gated or read as though the breach were established.** It is
`ABC-078`'s gate saying, precisely: two independent readings from two different machine states both
land at or over the clause, and the question is now due.

Machine: Apple M3 (Mac15,13) / 8 logical cores / Darwin 25.5.0 arm64 / Node v24.12.0 / vitest
3.2.7. **`UNKNOWN - verify` on any other hardware.**

## Scope

- **Re-measure the default lane's total under `N8-LANE`'s own protocol, on a quiet machine**, and
  restate the reading **anchored to a named commit** with the file and test counts of that commit.
- **Rule on `NFR-008`'s CPU clause** against the restated figure — over, or not over. **Both
  answers are useful; not asking is not.**
- **Restate the per-file all-in cost** against the ratified 341 ms, so the next reader can tell
  load inflation from content — the quantity this whole open question turns on.
- **Say, in writing, what `N8-LANE` grants mean from the ruling forward**: whether the 5% slice is
  grantable as written, and against what total.
- The ruling belongs in `plans/nfr-catalog.md` under the rows that own it.

## Out of scope

- **The remedy, whatever it is.** See below. If the ruling is "over", the fix is a separate ticket
  cut against the ruling.
- **Moving `NFR-008`'s `3 s` / `13 s` level.** That level is **Olger Oeselg's** and nothing in this
  ticket may move it, argue it obsolete, or re-baseline it by hand.
- **Moving `N8-LANE`'s 5%, its CPU instrument, its paired-median statistic, its identity null
  control, its 160 ms per-file floor, or `N8-SPAWN`'s balance.**
- **`AR-N8LANE-078`** — `ABC-078`'s own ~840 ms overspend. It is an accepted risk with a named
  owner, and its discharge is *an input to* this measurement, not a question this ticket re-opens.
- **Deleting, trimming or moving any test.** No `src/` file is edited by this ticket.

## The remedy is NOT decided here, and BA/PM does not pick one

**If the restated figure is over the clause, the options are Architect/Design's and the owner's.**
They are named only so the follow-up is not written from scratch, and **Security/NFR recommends
none of them**:

1. **`isolate: false` is UNAVAILABLE — do not rediscover this lever.** `ADR-0008` records that it
   saves 30–36% **and disarms three `*.nfr.test.ts` guards**.
2. **Moving the slowest content behind an existing opt-in lane** (the `PERFT_DEEP` / `SEARCH_DEEP`
   / `ENGINE_DEEP` shape) is available.
3. **Re-deriving the 5% against today's plan** is the row's own standing invitation and is **still
   unexercised**.
4. **Moving the 13 s level is the owner's alone.**

## Acceptance (Given/When/Then)

- **`A1` (the reading is taken on a demonstrably quiet machine, and quiet is measured not
  asserted).** **Given** the lane at a named commit, **when** the measurement runs, **then** the
  1-minute load average is **recorded at the start and at the end of every round** and the
  **maximum recorded value is ≤ 1.0 on 8 logical cores** — against the 2.92 the inherited reading
  started at. *(If that cannot be achieved, `A1` FAILS and the reading is not takeable — see
  `## Dependencies`. Reporting a number taken at load 2.9 as "quiet" is the one outcome this
  criterion exists to prevent.)*
- **`A2` (the protocol is the row's, unchanged).** **Then** the reading is CPU (user + sys), one
  fresh OS process per run, condition order rotated every round, **9 rounds with round 0 discarded,
  n = 8**, each run asserting its own test-file count and test count, **and the identity null
  control is included and reads ≤ 1.5% with its sign at chance**. A reading whose null control is
  outside that clause is **INADMISSIBLE and is reported as such**, not published as a figure.
- **`A3` (the restated total is anchored and stated against the clause).** **Then** the record
  carries the **median CPU seconds and median wall seconds at n = 8**, the **commit sha**, the
  **test-file count and test count of that commit**, and the machine — and states each against
  `NFR-008`'s **13 s CPU** and **3 s wall** as a number, not as a word.
- **`A4` (load inflation is separated from content, or its residue is stated).** **Then** the
  record carries **all-in CPU per test file** (total ÷ file count) for the restated reading, set
  beside the ratified **341 ms** and the inherited **383 ms**, and states how much of any gap it
  can and cannot attribute. *(This is the quantity that decides whether the inherited 13.400 s was
  real. A ruling that does not state it has not answered the question.)*
- **`A5` (the clause is RULED, in writing, either way).** **Then** `plans/nfr-catalog.md` carries a
  dated ruling that says **either** the clause is breached at the restated figure **or** it is not,
  with the number it is ruled on, **and** the ruling names what happens next: a follow-up ticket id
  if over, or the explicit statement that no remedy is owed if not.
- **`A6` (`N8-LANE` grants are made honest again, explicitly).** **Then** the ruling states in one
  sentence **whether `N8-LANE`'s 5% slice may be granted to a ticket from that date and against
  what total**, so the next cut and the next gate inherit an answer instead of the sentence
  *"a 5% slice of a spent total is not a slice"*.
- **`A7` (no bar moved, and it is verified rather than promised).** **Then** the eight table rows
  `NFR-001`–`NFR-008` in `plans/nfr-catalog.md` are **byte-identical across this ticket's whole
  diff** — verified by hashing the matched row lines before and after, the same control the
  `ABC-029`, `ABC-026`, `N8-SPAWN` and `ABC-078` hops used (`sha256 63f66795…ca31`) — **unless the
  owner has spoken in the interval, in which case his words and their date are quoted verbatim.**
- **`A8` (nothing under `src/` changes).** **Then** `git diff --name-only <base> <tip> | grep '^src/'`
  comes back **empty**, and the default lane's test-file count and test count are **identical**
  before and after this ticket. *(A ticket about the lane's cost that changes the lane's contents
  has measured itself.)*

## Criterion re-score — **2026-08-19 by BA/PM** (task `cut-lane-remedy-2026-08-19`)

**Scored against Architect/Design's delivered ruling** (`ADR-0014`, `plans/nfr-catalog.md` §
*"`OQ-1` IS RULED"*, and `.grugops/context/design-oq1-lane-budget-2026-08-19/notes/`).
**No criterion is rewritten and none is deleted** — the precedent is `ABC-033` `A4`, whose falsified
criterion was neither marked met nor removed.

**`A1` — FAILED, and it is UNSATISFIABLE AS WRITTEN. It is not re-written to something that would
have passed.**

- **Measured:** the criterion requires a maximum recorded 1-min load average **≤ 1.0 on 8 cores**.
  The ruling hop recorded **min 1.72 / median 7.19 / max 10.24** at round boundaries under the
  protocol, and **min 1.44 / median 2.17 / max 2.77** immediately before each cooled run. **The
  lowest 1-min load observed anywhere in the hop was 1.44.** The threshold was never reached.
- **Why it is impossible IN PRINCIPLE for this lane, not merely hard:** the default lane runs
  `pool: "threads"` at `availableParallelism() − 1` = **7 workers**, consuming ~14.6 s of CPU in
  ~2.9 s of wall — **~5x parallelism**. A back-to-back interleaved harness therefore drives the
  1-min load average above 1.0 **by itself, inside a single round**, whatever else is running.
  **A load threshold sampled during a self-parallel harness measures the harness.** No amount of
  quieting the machine from inside it can satisfy this, and the machine's own floor was 1.44 with
  ~20 agent worktrees live.
- **What this criterion got RIGHT and is worth keeping legible:** it was written to prevent exactly
  one outcome — *"reporting a number taken at load 2.9 as quiet"* — and **that outcome did not
  happen.** `A1` failing is what forced the honest move. It was a well-intentioned criterion that
  turned out impossible; **it is recorded as failed, not quietly relaxed.**
- **THE CRITERION SHAPE THAT WORKED, and the one to reuse the next time this lane is measured:**
  **measure the load SENSITIVITY of the instrument and SIZE the contamination, rather than assert
  quiet.** Three independent estimates — **+1.63%** across a 3.2x load rise within one sample,
  **−1.90%** across a ~3x fall between samples, and the single quietest run of the hop (load 1.74)
  still reading **14.15 s = 8.8% over the clause** — bound the whole load effect at **~1.9% against
  a 10.2% breach, a ratio of 5.4x.** That bound is what let a ruling stand at `high` confidence on a
  machine that failed `A1`, **instead of a claim nobody could have made.**
- **Consequence for the `P0` trigger below, stated so it cannot be misread:** the trigger's words are
  *"over 13 s CPU **on a quiet machine**"*. **The machine was not quiet. The trigger is met on
  SUBSTANCE — 1.9% measured contamination against a 10.2% breach — and NOT because `A1` passed.**

**`A5` — its stated gap is now CLOSED. The follow-up ticket id is `ABC-110`.** `A5` required the
ruling to name what happens next including a follow-up ticket id; Architect/Design supplied the
requirement, the priority and the owner and **declined to invent an id**, because cutting tickets and
assigning ids are BA/PM's and an invented id would have fabricated a board state. **That was the
right refusal and it left a stated gap, not a silent one.** `ABC-110` was cut 2026-08-19 as **`P0`**,
and `A5` reads met from that date.

**`A2`, `A3`, `A4`, `A6`, `A7`, `A8` — MET**, on the ruling hop's own record: protocol at n = 8 with
an identity null control of **+0.10% at sign 5/8 (admissible)**; the restated median stated against
both clauses at `54cbb23` / 39 files / 1181 tests; per-file all-in at **371–378 ms** set beside the
ratified **341 ms** and inherited **383 ms** with its unattributable residue stated in both
directions; the `N8-LANE` sentence written as *rate limit, not grant*; the eight `NFR-001`–`NFR-008`
rows hashing **`63f66795…ca31`** before and after; and `git diff --name-only … -- src/` **empty**.

**`AR-N8LANE-078` is DISCHARGED, not charged, and `## Out of scope` above is confirmed rather than
amended.** `ABC-078` did not cause this breach: **`NFR-008`'s own restatement arithmetic —
`9.545 + 11 × 0.341 = 13.30 s` — was already over the clause on 2026-08-13's published numbers,
before `ABC-078` existed.** Its 190 ms overspend is **13% of the 1.480 s deficit** and removing it
entirely would not clear the clause. **This page's title says the lane sat at or over the clause
BEFORE `ABC-078` arrived, and the measurement confirms it. Nothing here reads as though that ticket
caused this, and nothing should be written that does.**

## Dependencies

- **A QUIET MACHINE is an environmental input no agent can conjure, and it is the reason this page
  is not 10/10.** The inherited reading was taken at load 2.92 on 8 cores with six sibling
  worktrees live in the shared checkout, and Security/NFR said plainly that its machine *"is not
  that"*. **This is the same species of blocker as `ABC-074`** (`Blocked` for want of a non-M3
  machine), and it is smaller: `A1` states quiet as a measurable threshold rather than a device, so
  it may well be reachable by running with no sibling agents live. **If it is not reachable, this
  ticket goes to `Blocked` with the measured load recorded — it does not publish a number taken
  under load.**
- **`ABC-078` is unmerged.** The restated reading should be anchored to a stated tree; **whether it
  is taken with or without `ABC-078`'s file is the measurer's call and must be stated**, since the
  inherited reading gives both (13.400 s at 35 files, 14.635 s at 36).
- **`ADR-0008` and the ratified 2026-08-13 `NFR-008` reading are the instruments this builds on**,
  and neither is re-opened.
- **Not blocked by any ticket in `EPIC-004`.** It is, however, **cheapest before `ABC-079`,
  `ABC-080` and `ABC-081` land** — each adds test content to the lane being measured.

## Security / NFR triggers

- **`NFR-008` (`≤ 3 s` wall / `≤ 13 s` CPU for the default lane) — this ticket IS the trigger.**
  Bar unchanged and not this ticket's to move; the target is the restated median at n = 8 stated
  against both clauses.
- **`N8-LANE` — DELIBERATELY NOT CARRIED ON THIS PAGE, and the omission is the point.** This ticket
  cannot honestly quote a 5% slice of the total it exists to re-measure. **What it carries instead
  is falsifiable and stronger: 0 new test files, 0 new tests, 0 new spawns, 0 lines under `src/`**
  (`A8`). Its own charge against the lane is **0 ms** by construction.
- **`N8-SPAWN` — 0 ms**, unchanged. The measurement harness runs **outside** the repository; it
  adds no spawn to the default lane.
- **Security — no new surface.** No production code, no dependency, no network, no secret, no
  input. **Firing threshold, falsifiable:** any file added under `src/`, any change to
  `package.json`, or any harness committed into the repository rather than run from a scratchpad.

## Test notes

1. **The harness is throwaway and lives OUTSIDE the repository**, exactly as Security/NFR's did —
   out-of-tree copies plus a scratchpad script. Do not commit it; committing it would add lane
   content to the lane under measurement.
2. **Two disclosed deviations are inherited and must be disclosed again, not silently repeated:**
   `node_modules` symlinked into each out-of-tree copy (every prior lane reading on this project
   carries it), and `AGENTS.md` copied into each copy because `src/cli.test.ts` reads it — without
   it, 5 tests in that one file fail on `ENOENT`, which is an artifact of copying and not a defect.
3. **Record the null control before looking at the treatment.** The row makes admissibility a
   precondition, not a post-hoc comfort.
4. **`vitest.config.ts` declares no `exclude`**, so an in-repo agent worktree makes the default lane
   report another branch's tree as this one's — measured at 245 files / 6993 tests against a lane
   `NFR-008` sizes for ~1000. Out-of-tree copies avoid it; if any figure is taken in-repo, it needs
   `--exclude '**/.claude/**'` **and that must be stated, not hidden**.
5. **Report the wall clause too.** It is not the clause in question and it has almost no room left
   either — 2.805 s and 2.935 s against 3 s in the inherited reading.

## Size and priority rationale

**Size `M` (3).** One measurement harness rebuilt out-of-tree, 27 usable full-lane runs at ~15 s of
CPU each plus setup, a restated per-file derivation, and a written ruling in the catalog. **Not
`S`** — the ruling is the expensive part and it has to survive being read a month from now. **Not
`L`**: no code is written, no remedy is designed, and the protocol already exists in full.
**Re-size trigger, named: this does NOT grow if the answer is "over".** The remedy is a separate
cut, and anyone tempted to absorb it here should re-read `## Out of scope`.

**Priority `P1`.**

**NOT `P0` (`drop everything`), and I want the reason on the page rather than in a note.** Nothing
is stopped today. The lane runs, the gate runs, tickets build and merge; what is damaged is the
*meaning* of a number, not the *operation* of anything. Putting this ahead of `ABC-079`/`ABC-080`/
`ABC-081` on the `EPIC-004` critical path would be BA/PM using priority to express alarm, and the
alarm is already in this page's first paragraph.

**NOT `P2`, and this is the half I would defend hardest.** Three measured reasons: (1) **every
ticket cut or gated before this is ruled inherits an `N8-LANE` line that is arithmetic over a
budget under open question** — the cost of a late ruling grows one page at a time; (2) **the
measurement gets harder, not easier, with every merge** — `ABC-079`, `ABC-080` and `ABC-081` each
add test content to the very lane being measured, so ruling now measures a still target;
(3) the inherited reading puts the **wall** clause at 2.935 s against 3 s on the delivered tree,
which — with the same load-inflation caveat that applies to the CPU figure and therefore **not**
usable as proof — is not a margin anyone should discover by accident.

**Promotion trigger, named so it is not a matter of taste:** if a restated reading is taken and
comes back over 13 s CPU on a quiet machine, the follow-up remedy ticket is **`P0`** and this page
says so in advance.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-18**. **Result: 9 of 10 — item 10 carries a ⚠️. NOT READY TO PULL until the quiet-machine
precondition is answered.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** the users are named, the pain is a measured 13.400 s against 13 s with an admissible null control, and the value is stated in both directions — the figure may come back *under* the clause and that is a useful answer |
| 2 | scope and out-of-scope clear | **✅** six fences, incl. the remedy, the owner's level, and every `N8-LANE` sub-clause; the four remedy options are named as **not** decided here |
| 3 | INVEST-shaped | **✅** independent of every ticket in flight; estimable **because the remedy is fenced out** and the protocol already exists in full; small (0 lines of code); testable — every criterion is a recorded number or a byte-comparison |
| 4 | acceptance testable and measurable | **✅** eight: load ≤ **1.0** measured per round, **n = 8** with a null control ≤ **1.5%**, median CPU/wall against **13 s**/**3 s**, per-file all-in against **341 ms** and **383 ms**, a written either-way ruling, an explicit statement on granting, eight rows hashed byte-identical, and `grep '^src/'` **empty** |
| 5 | dependencies known | **✅** the quiet machine, `ABC-078`'s unmerged state with the choice made explicit, `ADR-0008` and the ratified reading as instruments, and the *cheapest before `ABC-079`/`080`/`081`* ordering — stated as an ordering preference, not a blocker |
| 6 | security/NFR triggers with a measurable target | **✅** `NFR-008` is the trigger and its two clauses are the targets; **`N8-LANE` is deliberately NOT quoted** and is replaced by falsifiable zeroes (0 test files, 0 spawns, 0 `src/` lines); security firing threshold falsifiable |
| 7 | test notes present | **✅** five, including both disclosed deviations and the `vitest.config.ts` worktree trap |
| 8 | size assigned | **✅** `M`, with the not-`S`/not-`L` arguments and a re-size trigger that says the size does **not** grow if the answer is "over" |
| 9 | priority assigned | **✅** `P1`, with the not-`P0` and not-`P2` arguments both stated and a named promotion trigger for the follow-up |
| 10 | no major unresolved blocker | **⚠️ ONE, and it is environmental rather than a decision.** `A1` requires a machine at load **≤ 1.0**; the inherited reading was taken at **2.92** and its author said his machine was not a quiet one. **No agent can guarantee it** — same species as `ABC-074`'s non-M3 hardware, though smaller, since quiet is a measurable state rather than a device. **Not smoothed to ✅**: a page that scored 10/10 here would be promising a reading it may not be able to take, and the failure mode is publishing a loaded number as a quiet one |

**DoR RE-SCORE — 2026-08-19 by BA/PM (task `cut-lane-remedy-2026-08-19`), after delivery.**
**The score does NOT move: it stays 9/10, ⚠️x1, and the ⚠️ stays on item 10.** The reason changes and
that change is the point.

| # | item | 2026-08-18 | 2026-08-19 |
|---|---|---|---|
| 10 | no major unresolved blocker | **⚠️** the quiet machine `A1` requires may not be reachable; if it is not, the ticket goes to `Blocked` rather than publishing a loaded number | **⚠️ STILL — and it is now MEASURED rather than feared. The quiet machine was NOT reachable and is NOT reachable in principle** (7 workers at ~5x parallelism drive loadavg above 1.0 unaided; floor observed 1.44). **The ticket did NOT go to `Blocked` and did NOT publish a loaded number as a quiet one** — it sized the contamination at 1.9% against a 10.2% breach and ruled on the bound. **That is a better outcome than either branch this row anticipated, and the ⚠️ is kept anyway: `A1` as written is unmeetable, and a page scoring 10/10 here would be claiming otherwise** |

**Why this is NOT re-scored to 10/10, and the reasoning is the useful part.** The ⚠️ was a real
defect in this page's own criteria — `A1` asked for something no measurement of a self-parallel lane
can deliver — and **discharging it by pointing at a successful ruling would hide the criteria defect
inside a good result.** The ruling stands on a *replacement* instrument, not on `A1`. **Score
unchanged, reason replaced, criteria defect recorded above rather than smoothed away.**

Column moves are the Orchestrator's.
