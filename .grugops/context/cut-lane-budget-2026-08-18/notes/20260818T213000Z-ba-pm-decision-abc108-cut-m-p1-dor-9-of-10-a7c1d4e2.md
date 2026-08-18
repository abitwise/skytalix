---
id: 20260818T213000Z-ba-pm-decision-abc108-cut-m-p1-dor-9-of-10-a7c1d4e2
kind: decision
by: ba-pm
at: 2026-08-18T21:30:00Z
verified_by:
confidence: high
refs:
  - ABC-108
  - OQ-1
  - NFR-008
  - N8-LANE
  - N8-SPAWN
  - ABC-078
  - AR-N8LANE-078
  - ADR-0008
  - plans/tickets/ABC-108-the-default-test-lanes-own-budget-is-spent.md
supersedes:
---

# `ABC-108` CUT — `M`, `P1`, **DoR 9/10 ⚠️x1**. One ticket for `OQ-1`, and it cuts the PROBLEM: the lane's own budget was spent before `ABC-078` arrived

**This is not a stamp.** `context.human_admission` is `off` and no `finding` is admissible on this
install, so this is a hand-authored `decision` per `agent-factory/contracts/context-note.md`.

`plans/tickets/ABC-108-the-default-test-lanes-own-budget-is-spent.md`, **257 lines** — inside this
project's 300-line ticket-prose budget (`AGENTS.md` process rule 2), with the measurement narration
left in Security/NFR's notes where it already lives rather than restated.

## What was cut, and what was deliberately NOT

**Cut: the question.** Re-measure the default lane under `N8-LANE`'s own protocol on a quiet
machine, restate the reading anchored to a commit, and **rule on `NFR-008`'s CPU clause either
way**. **Owner: Architect/Design**, named by Security/NFR.

**Not cut: the remedy.** `## Out of scope` fences it out and `## The remedy is NOT decided here`
names the four options only so the follow-up is not written from scratch — including the one that
must not be rediscovered: **`isolate: false` saves 30–36% and is UNAVAILABLE**, because `ADR-0008`
records that it disarms three `*.nfr.test.ts` guards. **Moving the 13 s level is the owner's
alone.** BA/PM recommends none of them and rules nothing.

## The honesty clause is CARRIED, not dropped — this is the sentence I most wanted on the page

Security/NFR's all-in cost read **383 ms per file against the ratified 341 ms**. Deflating the base
by that 12% puts it near **11.9 s — under the clause**. **Part of the absolute totals is load
inflation that could not be sized**, which is exactly why Security/NFR filed an **open question**
and **not** an `NFR-008` BREACHED verdict.

The ticket carries this in three places so it cannot be read past: in `## The reading this ticket
inherits` ("**this ticket must not be built, gated or read as though the breach were
established**"), in `A4`, which makes restating per-file all-in cost against **341 ms** and
**383 ms** an acceptance criterion rather than a courtesy, and in `A5`, which requires the ruling to
be written **either way**. The paired deltas (+1 000 ms gross, null control −0.66% at 2/8 sign) are
the robust part and are recorded as such; the absolutes are recorded as indicative.

## Why `M` and why `P1`

**`M` (3).** A harness rebuilt out-of-tree, 27 usable full-lane runs, a restated per-file
derivation, and a ruling that has to survive being read in a month. **Not `S`** — the ruling is the
expensive part. **Not `L`** — no code, no remedy, and the protocol already exists in full.
**Re-size trigger: the size does NOT grow if the answer is "over"** — the remedy is a separate cut.

**`P1`. Not `P0`**, and the argument is on the page rather than hidden here: nothing is stopped
today. The lane runs, the gate runs, tickets build and merge. What is damaged is the **meaning** of
a number, not the operation of anything, and putting this ahead of `ABC-079`/`ABC-080`/`ABC-081` on
`EPIC-004`'s critical path would be priority used to express alarm.

**Not `P2`**, on three measured grounds: every page cut or gated before the ruling inherits an
`N8-LANE` line that is arithmetic over a budget under open question; the measurement gets harder
with every merge, since those same three tickets each add content to the lane being measured; and
the **wall** clause reads 2.935 s against 3 s on the delivered tree — with the same load-inflation
caveat, so **stated and explicitly not used as proof**.

**Promotion trigger named in advance:** if a quiet-machine reading comes back over 13 s CPU, the
follow-up remedy ticket is `P0`, and the page says so before anyone has to argue it.

## The one ⚠️ — item 10, and it is environmental rather than a decision

`A1` requires a machine at **1-minute load ≤ 1.0 on 8 cores**, recorded at the start and end of
every round. The inherited reading started at **2.92** and its author said plainly that his machine
*"is not"* a quiet one. **No agent can conjure a quiet machine.** It is the same species of blocker
as `ABC-074`'s non-M3 hardware and smaller, since quiet is a *measurable state* rather than a
device — it may well be reachable simply by running with no sibling agents live.

**It is not smoothed to ✅.** A page that scored 10/10 here would be promising a reading it may not
be able to take, and the failure mode that costs something is **publishing a number taken under
load as a quiet one**. `A1` is written so that outcome fails the criterion instead of passing
quietly, and `## Dependencies` says what happens then: the ticket goes to `Blocked` with the
measured load recorded.

## The detail I am most pleased with, and the one most likely to be "fixed" by a later reader

**This page deliberately carries NO `N8-LANE ≤ 650 ms` line**, and the omission is the argument. A
ticket that exists because a 5% slice of a spent total is not a slice cannot honestly quote that
slice for itself. What it carries instead is falsifiable and stronger — **0 new test files, 0 new
tests, 0 new spawns, 0 lines under `src/`** (`A8`), so its own charge against the lane is **0 ms by
construction**. **Do not "complete" the triggers section by adding the missing line.**
