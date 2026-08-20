---
id: 20260820T180000Z-orchestrator-decision-abc044-pulled-the-blocker-is-discharged-by-measurement-not-by-a-column-a7f31d05
kind: decision
by: orchestrator
role: orchestrator
task: ticket-to-pr-ABC-044-2026-08-20
at: 2026-08-20T18:00:00Z
verified_by:
confidence: high
refs:
  - ABC-044
  - ABC-043
  - EPIC-006
  - ABC-112
supersedes:
---

# `ABC-044` is pulled. Its one ⚠️ is discharged by MEASUREMENT of `main`, not by `ABC-043` reaching a column

## The call BA/PM handed me, taken

BA/PM wrote it plainly on the board and on the page: *"whether `In Review`-with-code-merged counts as
landed is the Orchestrator's call at the pull, not BA/PM's at a cut."* **I rule that it counts, and I
rule it on the tree rather than on the column.**

`ABC-044`'s two recorded ⚠️ (DoR items **3** and **10**) are **ONE fact stated twice** — *"`ABC-043`
must land first"*. That fact is what I measured:

- `git merge-base --is-ancestor 6091212 HEAD` → **YES**. `ABC-043`'s delivery is an ancestor of `main`.
- `src/cli.ts` is **in the tree** on `main` @ `30482cd`, and it calls `runTurnLoop` at `:150` and
  assigns `process.exitCode = outcome.exitCode` at `:163`.
- Driven at this hop: `printf 'f3\ne5\ng4\nQh4\n' | node src/cli.ts` reaches `last: Qh4#`, prints
  **no result line**, exits **0**.

**The column `ABC-043`'s ticket sits in is `In Review`. That is a REVIEW state, not a code state.**
The ticket's fence — *"it must not merge ahead of it"* — cannot be violated by a ticket that merges
AFTER an already-merged ancestor. The fence is satisfied by construction, not waived.

**DoR: 10 of 10 in substance.** I am NOT re-scoring the page — the pen for that is BA/PM's and the
board says so. What I record is that the only input the score was missing now exists on disk.

## Criteria review at the `Ready for Dev` exit (project process rule 1), conducted, gaps recorded

Rule 1 asks a different question from DoR: **do the criteria still match what exists?** I re-read all
seven against the built tree. **Zero substantive gaps. Three line-number drifts, named so the engineer
does not chase them:**

| ticket says | tree says | verdict |
|---|---|---|
| `src/turn-loop.ts:285-287` (exit test) | **`:286-288`** | drift, fact holds |
| `src/turn-loop.ts:313` (`INPUT_ENDED_NOTICE`) | **`:312`** | drift, fact holds |
| `src/gameend.ts:41-48` (the reason set) | `EndReason` **`:40-45`**, `ClaimableDraw` **`:48`** | drift, fact holds |
| `src/history-pane.ts:70` `HISTORY_ROWS = 8` | **`:70`, exactly** | ✅ |
| `src/turn-loop.ts:81-83` resignation / engine-failure / engine-threw | **`:81-83`, exactly** | ✅ |

**The eight-reason set is CONFIRMED against the built tree, not re-decided:** `TerminalReason =
EndReason | ClaimableDraw | "resignation" | "engine-failure" | "engine-threw"` (`src/turn-loop.ts:78-83`)
— that is 5 + 2 + 1 = **eight game outcomes** plus the **two faults**. The count BA/PM settled on
2026-08-13 still reads off the code on 2026-08-20. Nothing to re-open.

**The wiring point exists and is exactly where the ticket said it would be.** `src/cli.ts:150` binds
`outcome`; `:163` consumes **only** its `exitCode`. `result` and `reason` are computed, returned, and
**dropped on the floor** — which is the ticket's `## Problem` sentence, now true at a line number.

## Scope of this pull, and the one thing beside it that I did NOT fold in

**One ticket, whole.** `A1`–`A7`, the module and its call site in the same diff, per the ticket's own
`## Why the wiring is in this ticket` rule. I did not split it and I did not pull part of it.

**`ABC-112` is NOT in this pull.** It is the other `EPIC-006` gap, cut at the previous hop, and it is
about `help` advertising a token nothing honours. It shares no file with this ticket and waits on an
Architect ruling that this ticket does not need. **Folding it in would have made a `S` into an `M` and
coupled a clean pull to an open design question.**

**The status-panel observation BA/PM named-but-did-not-cut** (`CHECK` shown on a mated position) is
**resolved by this ticket, not by an edit to `src/status-panel.ts`** — that file is on `ABC-044`'s
out-of-scope list and must stay byte-identical (`A7`).

## Tier, width and WIP — stated, not assumed

**Tier: REDUCED.** The `Agent` spawn tool is available to me, but this is a default main thread, not a
session started with `claude --agent grugops-orchestrator`. **The role allowlist is therefore NOT
runtime-enforced here — I hold it by instruction and I say so rather than claim an enforcement I lack.**

**Width used: 1 of `queue.wip_limit` 3.** Workflow 04 is a chain — Engineer, then QE, then
Security/NFR-if-triggered — and QE cannot read code that does not exist. Spawning a second agent now
would buy nothing and would burn a slot. **The next wave, not this one, is where width pays.**

**WIP checked before the pull:** `In Development` **0/3** → room. `In Review` 1/3 (`ABC-043`).
No limit approached, no written reason needed.

**Queue swept before scheduling:** `pending/` and `claimed/` were both **empty**. No stale claim, no
TTL reclaim, nothing orphaned.

## Board move I own, honestly labelled

`Backlog → In Development`. **The ticket did not pass through `Ready` or `Ready for Dev` — both are
empty (0/8, 0/6) and this project has never staged work in them.** I record the move as it actually
happened rather than inventing two transitions to look tidy. The `Ready for Dev` **exit** obligation —
process rule 1's criteria review — was **discharged above**, which is the part that matters.

## Stop conditions I am handing down with the work

1. **`src/gameend.ts`, `src/turn-loop.ts`, `src/history-pane.ts`, `src/frame.ts` byte-identical** —
   `A7`. If the implementation needs one of them changed, **STOP and come back**; that is a ticket
   boundary, not a judgement call.
2. **Do not add this module to `ADR-0011`'s declared probe root list.** The ticket states the
   consequence in both directions and this one is easy to get backwards.
3. **`A1` is a SET of size 8**, not eight `contains` checks; **`A2` is a NON-SUBSTRING property.**
   Both were written to fail a plausible-looking wrong build. Do not soften them.
4. **`A5` needs ≥ 40 plies AND a black-to-move `initialFen` anchor.** A 16-ply fixture cannot tell the
   full list from the pane's 8-row window — that is the whole point of the number.
5. **`A6` reuses `ABC-042`'s spawn harness.** Do not build a third one.
6. If the ticket turns out to be `XL` in the doing → `SPLIT_REQUIRED`, back to BA/PM. The split line
   is already named on the page: (a) the vocabulary `A1`–`A4`, (b) the move list `A5`.

## What is NOT verified here

This note is a `decision`, not a `finding`. **The repository has no `scripts/context-io.ts` and no
`scripts/claim.js`** — the sanctioned writer named by Workflows 16/17 is absent in this install, so
this note is hand-authored in the established repo convention and the queue claim is a directory
create rather than an atomic `claimTask`. **I am recording that degrade rather than implying a
mechanism I do not have.** No `§14-gate#<id>` stamp is claimed by me and none is forged; the gate
verdict for this ticket is the Software Engineer's and QE's to earn.
