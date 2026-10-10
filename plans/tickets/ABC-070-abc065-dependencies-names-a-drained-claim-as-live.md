---
id: ABC-070
title: `ABC-065` § Dependencies still says `AGENTS.md` "IS CLAIMED RIGHT NOW BY ANOTHER HOP" and that the ticket must not be pulled — it was pulled, built and merged, and the same page's DoR row 10 records the claim as drained
status: ready
column: Ready
size: XS
priority: P3
epic: —
feature: —
---

# ABC-070 — a merged ticket page contradicts itself, in the paragraph a reader consults to decide what to do

> **Cut 2026-08-16 by BA/PM** (task `refinement-abc065-wording`, Workflow 07) out of **`G12`** — the
> Scribe's `G1`, re-confirmed by the guard hop, re-confirmed a third time by QE at the `ABC-065` gate,
> and routed to BA/PM by the Orchestrator all three times with the same sentence: *"ticket prose is
> BA/PM's pen."* **Three confirmations have now been recorded as notes and the sentence is still on
> the page. This is the mechanism that survives a fourth hop; a note has already failed three times.**

## Problem

*User*: anyone opening `ABC-065`'s page to decide what may be done to it — the UAT hop that has it in
`Ready for UAT` now, and every later reader of a merged ticket.

*Pain*: the page states, as a live blocking condition, something that has been false for three hops.

```
## Dependencies
- **`AGENTS.md` IS CLAIMED RIGHT NOW BY ANOTHER HOP — this is the one open item.**
  … **This ticket must not be pulled while that claim is live** …
```

**The claim drained on 2026-08-16** — `.grugops/queue/done/agents-md-owner-grants.md` and
`agents-md-owner-grants.claim.md` both sit under `done/`, and nothing of that name is in
`.grugops/queue/pending/` or `.grugops/queue/claimed/` (re-verified at this cut, by listing the
directories, not on faith). **The same page already says so**: DoR row 10 was re-scored on 2026-08-16
and records the drain with its evidence. So the page carries **both** readings, one of which forbids
what the project then correctly did — the ticket was pulled, built in two halves, gated GREEN and
merged to `main` @ `460b9f5`.

*Value*: **small and entirely about trust in the record.** A merged page that still names a live
blocker teaches the next reader that a ticket's § Dependencies is decorative — and § Dependencies is
where the *next* genuine "do not pull this yet" will be written.

## Scope

- **`plans/tickets/ABC-065-…md`, § Dependencies, the first bullet only.** Rewrite it in the past
  tense: the claim existed at the cut, it drained on 2026-08-16, and the ticket was pulled after it
  drained. **The historical fact is preserved, not deleted** — what goes is the live instruction.
- **Nothing else on the page.**

## Out of scope

- **Every acceptance criterion, and the whole of `## Definition of Ready`.** `ABC-065` is merged and
  QE scored all six criteria `MET`. **A criterion edited after its gate means the gate ran against a
  page that no longer exists.**
- **`A2`'s line-range fence.** **Already repaired in place at this same refinement hop**, under the
  one narrow authority the subtask granted, and annotated on the page as re-worded after merge with
  the original wording preserved verbatim. **Not this ticket's, and it must not be re-done.**
- **`G6` / `A6`'s "exactly two paths" wording** — the same page, the same pen, the same class, and it
  was routed to BA/PM by the same ruling. **It is NOT folded in here because it was not in this
  refinement hop's assigned five, and quietly absorbing another lane's item is how an item gets done
  twice or not at all.** **Recommendation to the Orchestrator, stated rather than taken: add `G6` to
  this ticket before it is pulled** — one hop, one page, two sentences, instead of two visits.
- **The board↔ticket front-matter drift.** Measured at this hop across all 69 rows on
  `plans/board.md`: **4 pages disagree with the board** — `ABC-021` and `ABC-026` (both say `Backlog`,
  both are `Done`), `ABC-065` and `ABC-066` (both say `In Development`, both are `Ready for UAT`).
  **That is a class defect of the merge/move step, not this page's prose**, and repairing `ABC-065`'s
  cell alone would be the *refresh a number* trap `ABC-030` refuses. **Reported as a gap; owner
  Orchestrator; not cut from this hop's id range.**
- **`plans/traceability.md`.** `ABC-052`'s, and its `## Out of scope` already excludes ticket pages —
  so the two do not overlap and neither covers the other.

## Acceptance (Given/When/Then)

- **`A1` (no live blocker claimed).** **Given** `ABC-065` § Dependencies after the change, **then**
  it contains **0** statements in the present tense asserting a live claim on `AGENTS.md`, and **0**
  instructions forbidding the ticket from being pulled. *(Today: 2 — one of each, in one bullet.)*
- **`A2` (the history is kept).** **Given** the same bullet, **then** it still names the
  `agents-md-owner-grants` claim, the fact that it held the file at the cut, and the date it drained —
  **3 of 3 facts preserved.** *(A repair that deletes the record swaps one wrong page for another.)*
- **`A3` (the page agrees with itself).** **Given** § Dependencies and DoR row 10 read together,
  **then** they state the same thing about the claim: **0** contradictions. *(Today: 1.)*
- **`A4` (nothing else on the page moved).** **Given** `git diff plans/tickets/ABC-065-…md`, **then**
  the changed lines are inside § Dependencies' first bullet only: **0** changed lines in the front
  matter, **0** in any `A1`–`A6` criterion, **0** in `## Definition of Ready`, **0** in the
  `A2`-re-wording annotation this hop left there.
- **`A5` (nothing outside the page moved).** **Given** `git diff --name-only <delivered commit>~1
  <delivered commit>` — excluding `.grugops/` — **then** exactly one path under `plans/tickets/`;
  **0** files under `src/`; **0** child processes; suite green, skip **0**.

## Dependencies

- **None.** The page is merged and no gate is waiting on it; the evidence is on disk and was
  re-verified at the cut.
- **`ABC-065` sits in `Ready for UAT`.** Editing § Dependencies changes nothing UAT scores — UAT reads
  the acceptance criteria and the built tree. **Ordering courtesy, not a blocker**: if a UAT hop holds
  the page, let it finish.
- **The `A2` re-wording landed first**, at the refinement hop that cut this ticket. Re-read the page
  before editing so the annotation is not disturbed.

## Security / NFR triggers

- **`N8-LANE` NOT triggered** — **0 new test files, 0 files under `src/`, 0 child processes.**
- **`NFR-002` not triggered.** No production path.
- **Security: not triggered.** `ABC-041`'s four clauses are trivially quiet: **(a)** no manifest
  touch, **(b)** nothing under `src/` touched at all, **(c)** no network, no spawn, **(d)** blast
  radius is one bullet in one markdown file under `plans/`.

## Test notes

1. **Past tense, not deletion.** `A2` fails if the bullet is simply removed. The point of the page is
   that it records what was true when.
2. **Do not re-score the Definition of Ready.** Row 10 is already correct and already dated; touching
   it would be the second edit to a merged page's scored section for no reason.
3. **One `grep` is the whole of `A1`**: the page should contain no *"IS CLAIMED RIGHT NOW"* and no
   *"must not be pulled"*.
4. **This is the cheapest ticket on the board and it should be closed by the cheapest possible
   route.** If the Orchestrator grants the same narrow wording authority for § Dependencies that it
   granted for `A2`, a hop already inside the file repairs the sentence and **this page is closed
   unstarted** — that is the preferred outcome, and it is written here rather than assumed.

## Lane cost — how many test FILES this ticket implies

**Zero**, and zero files under `src/`.

## Size and priority rationale

**Size `XS` (1).** One bullet, in one file, with the replacement facts already measured and quoted on
the same page.

**Priority `P3`.** Nothing is blocked and nothing ever was — the three hops that found it all said so
explicitly. It is on the board rather than accepted because **three notes have already failed to
close it**, and because a "do not pull this" sentence that everyone learns to ignore is the one that
will be ignored when it is true. **Promote to `P2` if any hop opens this page for another reason** —
`G6` is the likely one — **and close this page as unnecessary if that hop repairs the sentence.**

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-16**. **Result: 10 of 10 — MET.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** the bullet quoted; the drain re-verified by listing `pending/`, `claimed/` and `done/`; the page's own DoR row 10 named as the contradiction |
| 2 | scope and out-of-scope clear | **✅** one bullet; six fences, including the criteria, the DoR, `G6` (recommended, not absorbed) and the 4-page front-matter class defect (reported, not cut) |
| 3 | INVEST-shaped | **✅** independent, small, testable by two greps and one diff |
| 4 | acceptance testable and measurable | **✅** **0** live-blocker statements (today 2), **3 of 3** historical facts kept, **0** contradictions (today 1), **0** changed lines outside one bullet |
| 5 | dependencies known | **✅** none; the `Ready for UAT` courtesy and the prior `A2` annotation both named |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` untriggered at **0** files / **0** spawns; four security clauses answered |
| 7 | test notes present | **✅** four, including "past tense, not deletion" and the cheapest-route instruction |
| 8 | size assigned | **✅** `XS` (1) |
| 9 | priority assigned | **✅** `P3`, with the promotion trigger and the close-unstarted condition both named |
| 10 | no major unresolved blocker | **✅** nothing open. The only decision anyone else holds — whether to fold `G6` in — is stated as a recommendation and does not block the bullet |

## Re-score — 2026-10-10 (BA/PM, subtask `bapm-rescore-backlog-r1-2026-10-10`, wave tip `39d87491`)

**Verdict: READY. DoR 10/10. `XS` and `P3` kept.** `column`/`status` are not moved here.

**Premise re-measured at `39d87491`, and it HOLDS.** `ABC-065`'s page, line **130**, still reads *"`AGENTS.md`
IS CLAIMED RIGHT NOW BY ANOTHER HOP"*, so `A1` is still at 2, not 0. `ABC-065` is now `Done`.

**Amendments:**
- The `## Dependencies` *"`ABC-065` sits in `Ready for UAT`"* courtesy is void: it is `Done`, so no UAT
  hop holds the page.
- The `G6` fold recommendation stands, and it is still the Orchestrator's to take or leave. `A6`'s
  *"**two paths**"* wording is at `ABC-065` `:124–125`. **Not re-derived here:** what `G6` found wrong
  with it is `UNKNOWN - verify` at this hop.
- The cheapest route (test note 4) still stands. If a hop already in the file repairs the bullet, close
  this one unstarted.

All ten DoR rows are unchanged from the cut and re-read true. Row 5 is lighter now that the `Ready for
UAT` courtesy is void.
