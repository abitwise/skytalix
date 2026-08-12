---
id: 20260812T130000Z-ba-pm-decision-size-priority-and-the-board-move-i-am-not-requesting-ba9d9e71
kind: decision
by: ba-pm
at: 2026-08-12T13:00:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A5
  - ABC-019
  - ABC-026
  - ABC-029
  - NFR-008
  - plans/board.md
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
supersedes:
---

# `S` HOLDS on a changed premise, `P1`'s ORIGINAL basis is UN-DISCHARGED, and the board move I request is NONE

> **Hand-authored `decision`, not a `finding`.** No stamp exists to be had on this task and none was
> invented.

## Both previous re-derivations rested on a premise that is now false

`refinement-ABC-028-a4` and `refinement-ABC-028-a2` both concluded *"nothing further must be built."*
**`A5` is added and `A2`'s comment half is not discharged, so neither number is carried. Both are
re-derived from the new shape.**

## `S` (2) HOLDS

**The increment:** one `it` (a table, minimum one row), one fresh fixture from a builder that already
exists, and assertions — in `src/history-pane.test.ts`, **a file this ticket has already appended 365
lines to** — plus a comment-only repair in the second existing file. **Zero production lines, zero new
modules, zero new test files, zero new dependencies, file count stays 26.** Same shape as `A1`, which
was absorbed inside this `S` without argument. `ABC-024` (`S`) remains the calibration.

**The invention risk is ZERO and that decided the size — measured, not reasoned.** `A5`'s entire
mechanism was **run at this hop through the public API only**: `newGame`, `legalMoves`, `playMove`,
`takeBack`, a saved `Move`, two `renderHistory` calls, a row comparison. **No instrument, no in-tree
mutant, no `EPIC-006` code.** The discriminating assertion is the same `not.toEqual` shape `A1` already
carries. The Engineer transcribes a measured path rather than inventing one.

**The honest counterweight.** Had `A5` needed a **mutant landed in-tree** — the third closure refused
at `A2` — that is a mutation-testing harness this project has never adopted, with unpriced lane cost on
a total under dispute at `ABC-026`. **That is `M` at least.** It is not needed: `A5` asserts a property
of the **delivered pane's own output**, GREEN on the delivered pane and RED on `WCACHE-LAST`, **without
`WCACHE-LAST` ever entering the repository.** I established that by running it.

**`SPLIT_REQUIRED` does not fire** — it bites at `XL` (8); this is 2.

**`N8-LANE`: `A5`'s delta is `UNKNOWN - verify` and is OWED at the build hop.** This hop added no test,
no file and no line, so **its own delta is zero** and `ADR-0008`'s protocol was not run. Every bar is
unchanged and still binds: ≤ 650 ms content (~75 ms margin), ≤ 3 s wall, ≤ 13 s CPU, **file count
TWO**, and *whichever of `ABC-028` / `ABC-029` lands second re-measures the TOTAL*. **No bar re-derived;
`plans/nfr-catalog.md` not opened. `ABC-026` still owns the total.**

## `P1` HOLDS — and this time for its ORIGINAL reason

**One hop ago I recorded a falsifiable statement and asked for it to be disputed. I am disputing it,
and the disputant is its author.**

> *"if this ticket were ever returned to `Backlog` unbuilt, it should be re-cut at `P2`, not `P1` —
> because the dated trigger that earned the `P1` would have been discharged by `A2` on the way."*

**Its premise is FALSE.** The `P1` was earned by a live, signed, measured-sounding invitation to delete
the sole catcher for a wrong build. **Measured on this tip, that invitation is still live and still
wrong:** `:118-120` says the rebuild *"would no longer lose a guard"*, and the rebuild takes
`WCACHE-LAST` from `2 failed` to **`750 passed`**. **The trap was narrowed by one build. It was not
defused.** A ticket cut today for what remains is `P1`.

**And the trigger is nearer than at any prior hop.** At the cut it was *"whoever comes next"*; at
`refinement-ABC-028-a4` it was a named ticket in `Ready`; **today `ABC-029`'s build has LANDED
(`b7e1226`, `+146 / -43` in that very file) and its QE hop is in the file now.** The next reader is not
scheduled — the next reader is reading.

- **Not `P0`.** Nothing is broken. Re-checked here: **the delivered pane renders `37. Ne4 Nc6` —
  correct — on the exact redo path that breaks `WCACHE-LAST`**, and no consumer observes any of it.
- **The `P0` waiting behind this ticket is STILL not a reason, and it now costs me something to say
  so.** `ABC-019` is `P0` and waits on this ticket; **this hop ADDS work and pushes it further out.**
  That is precisely when the rule matters. *"Priority ranks the work; it does not rank the queue behind
  it"* — this ticket's own ruling, binding me in the direction that hurts.
- **Not `P2`.** `ABC-024` / `ABC-026` are passive gaps with no date. This one's trigger is live today,
  on a file that is open today.

## DoR items 3 and 4 re-checked; the 10-of-10 is NOT re-opened

**Item 4 `✅` HOLDS** — `A5` names an exact anchor, ply count, fixture rule, expected values witnessed
on this tip, a named discriminating build with verdicts in three configurations, the lane it must die
in, a render-digest identity check, **and what it does not close.** The other three moves all make the
acceptance section **more** falsifiable.

**Item 3 `⚠️` UNCHANGED, and honestly better and worse in different halves.** Better: `A5`'s test half
adds **no** shared-file coupling. Worse: `A2`'s comment obligation is re-opened while `ABC-029` holds
that file, so the coupling this `⚠️` stood for is **active rather than latent** for the first time.
Still the single item scored by judgment; flagged so it can be disputed; **does not block** — the
ticket is past the gate this item guards, and the remedy is the sequencing split written into `A5`.

## REQUESTED BOARD MOVE: **NONE — HOLD at `In Development`**

**That is the ruling, not an omission.** The Orchestrator's backward move `In Review → In Development`,
taken over QE's requested `In Security/NFR`, **is upheld and upheld more strongly than when it was
made:** the six gaps were not six wordings. One is a criterion that must be built.

**`ABC-028` advances on the Engineer's verdict, not mine.** `plans/board.md` was **NOT opened for
edit**. **Front matter NOT moved and already correct** — `in-development` / `In Development`, which
agrees with the board today.
