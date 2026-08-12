---
id: 20260812T125500Z-ba-pm-decision-the-six-gaps-ruled-and-one-routes-to-the-engineer-f06397c7
kind: decision
by: ba-pm
at: 2026-08-12T12:55:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A1
  - ABC-028-A2
  - ABC-028-A4
  - ABC-028-A5
  - RISK-ABC017-01
  - RISK-ABC028-01
  - RISK-ABC028-02
  - RISK-ABC028-03
  - ABC-029
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
supersedes:
---

# THE RULING: six gaps, five are text, ONE MUST BE BUILT — plus a seventh that is this ticket's own fence

> **Hand-authored `decision`, deliberately NOT a `finding`.** `context.human_admission` is `off`, there
> is no `§14-gate` verdict record under this task, and no named human has granted a `human:<name>`
> stamp. **No stamp was invented.**

## `G1` — UPHELD AND ESCALATED. A fifth criterion `A5` is added and it is the ENGINEER's.

**QE proposed one sentence and explicitly did not recommend re-opening the build. I am overruling
that.** The reword is **necessary** — and it is **two** sentences, not one (`:118-120` **and**
`:106-108`; QE named the first). It is **not sufficient**.

**The reasoning, and it is this ticket's own `## Test notes` 1 turned on itself:** rewording the three
sites makes the RECORD honest. It does not make the TREE safe. After the reword, the project's only
guard against the next cache in the family is still **an accidental `toSan` call count in another
file** — the same file, the same mechanism, the same accident that `RISK-ABC017-01` was cut to remove.
**`A1` replaced the accident for ONE witness and left the accident load-bearing for the next.** Ruling
*"reword only"* would do to `A1` exactly what four hops did to `A9`: describe the hole per witness and
guarantee the next repair.

**`A5` is written over the AXIS, not over the witness** — `A1` and `A5` are two points on one axis
(*a length-preserving edit whose cache key does not move*), and the class is *any cache keyed on a
proper subset of the move list*. **`A5` is specified as a TABLE of edit shapes, minimum one row.
Closing a future member is a NEW ROW, never a new criterion.** The row is the unit of extension — that
is the whole design, and it is the only form that does not guarantee an `A6`.

**`A5` does NOT certify the class closed, and saying so is the lesson of this page.** `WCACHE-LAST2`
(keyed on the last **two** identities) survives `A5`. It is named as **`RISK-ABC028-03`**, accepted on
the grounds that it is contrived where its predecessors were natural, and marked `UNKNOWN - verify`
because **I did not measure it.**

**I considered and rejected the cheaper option (12 coding rules, #3).** Extend `A1` with a third leg
rather than add `A5`: rejected because `A1` and the new leg discriminate **different cache keys** —
two diagnoses, and `## Test notes` 2's rule is that one `it` must not report one verdict for two.

**I checked `A5` against `AGENTS.md` rules 5 and 8 before writing it.** *Unrequested feature?* No —
`## Problem`'s first named user is *the player who takes a move back* and the stated pain is *a cache
shows the player the move they just took back*. `WCACHE-LAST` **is** that pain, unclosed. *Impossible
scenario?* No — `takeBack` and identity-preserving `playMove` are live today (`src/history.ts:85-88`);
only the redo **stack** is `EPIC-006`'s, and I exercised the path through the public API without it.

**QE's counter-argument is recorded, not buried:** `WCACHE-LAST` needs a redo consumer that does not
exist, so a reader may reasonably call `G1` `LOW` and take the documentation fix. **I do not take that
view, for QE's own reason: the hazard is not the cache, it is the sentence, and a sentence outlives a
brief.**

## `G2` — UPHELD. `A4` clause 1 corrected. Text only.

Clause 1 and `RISK-ABC028-01`'s closing statement now read **"through a reference the instrument
WRAPPED"**, and the escape is recorded explicitly. **`A4` remains MET** — every obligation it actually
measures holds. **The instrument is NOT changed by this correction**; the closure is named under `01b`
with an owner instead of quietly mandated.

## `G3` — UPHELD AND WIDENED A SECOND TIME, then SPLIT. Text only.

`RISK-ABC028-01` becomes **`01a`** (digest escape — accepted, not closable, revert required) and
**`01b`** (write-trap escape — OPEN, closable, no revert needed). **Splitting them is the point:** the
closable hole was sheltering under the unclosable one's accepted status. The standing re-run obligation
now names six witnesses plus `WMOVESRAW` as a must-stay-dead.

## `G4` — UPHELD. `RISK-ABC028-02`'s bound restated. Text only.

Correct for `WCACHE-LEN`, false for the class. **Restated so it tracks the criteria rather than needing
a third correction:** bounded for every cache class with an owned guard in `src/history-pane.test.ts`,
unbounded for every class without one. **`A5` is what closes today's.** Also corrected: the hazard was
described as needing `A1` deleted. **It does not** — it is live with `A1` present and green.

## `G5` — UPHELD, AND I REMOVED MY OWN CLAUSE. Text only.

The *"none in the nfr file"* half of `A2`'s `Then` **cannot report** in either required configuration.
**And it is worse than unfalsifiable, which is the half QE did not state:** asserted over the
**delivered** tree — the one place it *could* report — **it is FALSE**, because `WCACHE-LEN` fails
`3 / 750` there and two of those kills are in the nfr file. **True only where it cannot report, false
everywhere it could.** Removed, publicly, under `AGENTS.md` rule 8. I added it one hop ago.

**Direction of travel, counted rather than asserted, because removal is the smoothing move I have
refused four times: ONE clause removed, against a whole new criterion (`A5`), a corrected `A4` clause
1, a risk split in two, a restated `RISK-ABC028-02`, a new `RISK-ABC028-03`, and a repaired
`## Out of scope` fence. NET ADDED.**

## `G6` — UPHELD, split by who can fix it.

**The line map is corrected at every LIVE site** (`## Scope`, `RISK-ABC028-02`, and the header's live
digest claim): line 102 is blank, the block is **`:103-120`**. **Dated historical blocks keep their
numbers** and are flagged, per the ticket's own policy. **The stale `744/744` is inside
`src/history-pane.nfr.test.ts`, which this hop must not edit**, so it routes with `A5`'s comment half —
with an explicit instruction to **re-measure rather than transcribe** (`## Test notes` 4), because both
`744` and QE's `749` are on the page and I ran neither cell.

## `G7` — FOUND AT THIS HOP, REPORTED BY NOBODY, AND IT IS THIS TICKET'S OWN FENCE

**`## Out of scope` bullet 1 pins `src/history-pane.ts` to md5 `54fd4346…`. `## Out of scope` bullet 3
hands `src/history-pane.ts:30`'s comment to `ABC-029`. `ABC-029` has landed. The two bullets are
MUTUALLY UNSATISFIABLE** and the pin is **violated on the tip this ticket will merge from, by a change
this ticket licensed.** A hop reading it literally would *"stop and report"* on work the ticket asked
for.

**That is a criterion that cannot be satisfied by any build, found in this ticket's own fences — the
same defect class as `A2`'s `Given`, in the section that exists to prevent it.**

**Repaired to the property it was reaching for:** *`ABC-028`'s own net diff on `src/history-pane.ts`
must be EMPTY*. Verified: the pane is `54fd4346…` at `09d4515`, `05217b7` and `8de988d` — **this
ticket changed zero bytes of it, and the fence HOLDS under the repair.** The diff is strictly stronger
than the digest: it survives rebasing and still catches a single added production line.

## WHAT ROUTES WHERE

| owner | item | when |
|---|---|---|
| **Engineer** | **`A5`'s TEST half** — `src/history-pane.test.ts` only | **NOW.** Touches no file `ABC-029` holds |
| **Engineer** | **`A5`'s COMMENT half** — `src/history-pane.nfr.test.ts:103-120`, three sentences | **BLOCKED** on `ABC-029` clearing that file |
| nobody | `G2`, `G3`, `G4`, `G5`, `G6`'s line map, `G7` | **written at this hop** |
| Orchestrator | scheduling the two halves; the stale-tree finding; the `54fd4346…` digest in the brief | — |
| Security/NFR | threshold *any production line, or any new file* — **`A5` fires NEITHER**; falls due again at the build gate | — |

**`A2`'s honest status is now MET IN PART — which is the verdict the Engineer returned and I overruled
one hop ago. The Engineer was right twice on this criterion and I was right once.**
