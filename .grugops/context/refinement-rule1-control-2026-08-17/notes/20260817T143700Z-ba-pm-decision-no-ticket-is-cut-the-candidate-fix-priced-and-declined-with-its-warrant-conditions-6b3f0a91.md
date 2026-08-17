---
id: 20260817T143700Z-ba-pm-decision-no-ticket-is-cut-the-candidate-fix-priced-and-declined-with-its-warrant-conditions-6b3f0a91
kind: decision
by: ba-pm
at: 2026-08-17T14:37:00Z
verified_by:
confidence: high
refs:
  - 20260817T143430Z-ba-pm-observation-rule-1s-control-computed-the-three-series-and-the-arm-that-has-no-observations-8c2d6f14
  - 20260817T143212Z-ba-pm-decision-the-three-counting-rules-i-adopted-before-counting-anything-4a1c9e70
  - .grugops/context/ticket-to-pr-ABC-063-2026-08-17/notes/20260817T160900Z-orchestrator-observation-abc063-witness-reproduced-in-four-conditions-and-the-vacuous-a3-that-nearly-shipped-3f5a91c7.md
  - .grugops/context/ticket-to-pr-ABC-064-2026-08-17/notes/20260817T162000Z-orchestrator-observation-abc064-three-mutants-reproduced-the-a3-measurement-re-run-and-the-inverted-trap-8b2d40e1.md
  - .grugops/context/ticket-to-pr-ABC-062-2026-08-17/notes/20260817T133000Z-orchestrator-observation-criteria-review-at-ready-for-dev-exit-4b1e77a2.md
supersedes:
---

# **NO TICKET IS CUT.** The candidate fix covers 2 of its 4 named classes, misses the largest, and has already been run once voluntarily and skipped once voluntarily by the same hand.

Step 2 was conditional on step 1. Step 1 returned **INDETERMINATE** on a control that **cannot be
computed**, and one arm of which has no observations for five consecutive tickets. **A process ticket
cut on that evidence would ship with an acceptance nobody can evaluate** — which is `ABC-063` `A3`'s
defect, committed at the process level, on the very hop convened to discuss `ABC-063` `A3`.

## The candidate, restated so it is declined on its merits and not on a caricature

> A `Ready for Dev` exit step that **RUNS** each criterion's named mutation, rather than reading the
> criterion and judging it well formed.

## 1. Coverage — measured against what the record says actually found each class

| class | seen on | would running the named mutation at the exit have caught it? |
|---|---|---|
| **stale** — criteria no longer match the tree | `ABC-063`/`064` anchors, `061` `G-A`, `068` `G-A`, `062` `G-5` | **NO.** Anchor drift is a reading defect; no mutation exposes a wrong `:NNN`. The *current* reading review catches this class reliably, and it is **the plurality of every exit gap on record** |
| **already-satisfied** | `ABC-061` `A4`, `ABC-062` `A3`/`A4`/`A5` | **YES — demonstrated.** `ABC-062`'s exit review ran both mutants in a throwaway worktree and caught `A4` and `A5` as vacuous before the pull |
| **unfalsifiable** | `ABC-063` `A3` | **YES.** The named mutation (`"--resign"` appended to `ACCEPTED_ARGUMENTS`) ships green where the criterion promises red |
| **impossible-as-written** | `ABC-064` `A1` | **NO.** Its named mutation — an extra trailing newline at `src/frame.ts:244` — **reds correctly and reveals nothing.** The defect was found by the engineer *writing the obvious assertion* (`endsWith("\n\n") === false`) and watching it red on a **correct** build. That is building the ticket, not mutating it |

**Two of four, and not the one with the volume.** The candidate is presented as answering all four;
on the record it answers half, and `ABC-064`'s is the class its own note calls *"worse"*.

## 2. The record does not show a missing step. It shows a variance in applying an existing one.

**The candidate has already been performed, unmandated, and it worked.** `ABC-062`'s exit review
states it outright: *"I RAN both mutants this page names, in a throwaway git worktree at
`/tmp/abc062-probe`, outside the repository, removed afterwards."* Two vacuous criteria caught,
before the pull, at the exit.

**And the very next exit review, by the same role, two hours later, did not do it** — `ABC-063`/`064`
checked already-satisfied by measurement, stopped there, and missed `ABC-063` `A3`. Its own note
says so: *"It never asked whether a criterion, once written, could actually FAIL."*

So the sequence is **run it → it worked → skip it next hop**. Nothing prevented the mutation run on
`ABC-063`; rule 1 does not forbid it and no fence blocked it. **Writing down a step that was already
voluntarily performed and then voluntarily skipped one hop later is a bet that the constraint was
ignorance of the step.** The record is equally consistent with it being attention under load, and a
line in `AGENTS.md` does not fix that. **n=1 for, n=1 against, from the same hand, on consecutive
hops. That is not a warrant.**

## 3. The price, measured at my own hand this hop — and the number you must NOT quote from it

| what | measured |
|---|---|
| `git worktree add --detach` | **0.24 s** real |
| `npx vitest run src/cli.test.ts` in that worktree (`node_modules` symlinked) | **1.53 s** real / 2.46 s CPU, 42/42 |
| `npm test`, whole suite | **2.43 s** real / **10.69 s** CPU, **869/869 on 30 files** |
| cold `npm install` in a bare worktree | **1.5 s**, exit 0 — QE's own figure at the `ABC-042` re-gate |

**Machine cost of one mutant cycle: ≈ 2–5 seconds. Do not price the change at that, and do not let
anyone else.** The machine is not what this costs.

**The real price is that the exit reviewer must work at engineer depth.** Authoring a mutant means
reading the criterion until you know *where* the mutation site is, applying it, running, reverting,
and verifying the tree restored byte-for-byte. On the one exit review that did it, that review is
the longest of the eight. **I have exactly one observation of the hop cost and I will not turn one
observation into a per-ticket number: `UNKNOWN - verify`, n=1.**

**And it does not apply to every criterion.** `ABC-064` `A3`/`A5` and `ABC-061` `A6` are process
criteria — one path, zero production lines, `spawned` still 10 — that name no mutation at all. A
step written as *"run each criterion's named mutation"* is silent on what to do with them, and a
step that is silent on a third of its inputs gets filled in under pressure.

## 4. The cost of doing nothing, measured — and it is the argument that decided this

**All four failure classes were caught before merge. Every time. Zero escaped.**

- `0` reached `main`
- `0` caused a backward move (series 3: **0 of 9** post-rule-1)
- `0` produced a defect in delivered code — every exit-review note says so explicitly
- `1` ticket was re-cut (`ABC-062`), and it was re-cut **at the exit by the review**, not downstream

Three of the four were caught by the **builder**, mid-build, and **disclosed unprompted every time**
— `ABC-061` `A4` by the engineer, `ABC-063` `A3` by the engineer, `ABC-064` `A1` by the engineer.
That is a system absorbing a defect at a place where it costs in-flight engineer attention and
nothing else.

**The four failure classes read as alarming when listed and benign when costed.** That gap between
the list and the cost is what four anecdotes look like.

---

## What would have to be true for the ticket to be warranted

All four. Any one of them missing and the ticket has no falsifier.

1. **The QE denominator exists again** — a `qe-e2e` hop runs on **≥ 5 consecutive tickets**, so
   `gaps found at QE` has observations. Until then, no acceptance for any rule-1 change can be
   evaluated, and *"gaps at QE fell"* is unfalsifiable as a criterion.
2. **The class recurs after the exit review is run as written** — **≥ 1** already-satisfied or
   unfalsifiable criterion per ticket over **≥ 5** tickets. Today: 4 instances over 4 tickets, but
   `ABC-062`'s two were caught **by an exit review that voluntarily ran mutants**, so the claim
   *"a reading review misses this class"* rests on **n=3**, and the fix would not have caught one of
   those three (`ABC-064`).
3. **The class costs something.** **≥ 1** instance escapes to `main`, **or** causes a backward move,
   **or** forces a re-cut after the pull. All three counts are **0** today.
4. **The price has a number** — measured across **≥ 3** exit reviews that ran mutations, so the
   per-ticket cost stops being `UNKNOWN - verify` at n=1.

## What to measure next time — cheap, and it is the actual blocker

**The obstruction is not that rule 1 is unproven. It is that rule 1 is unmeasurable as written.**
Three changes, each one line per hop, and none of them is a process change:

1. **Publish the exit-review count in a fixed unit.** Every exit-review note ends with three
   integers: `exit_gaps_classes`, `exit_gaps_items`, and a per-class tally
   (`stale` / `already-satisfied` / `unfalsifiable` / `impossible` / `other`). **The 5:1 unit
   instability between `ABC-061`'s note and `ABC-063`/`064`'s is the single largest obstacle to this
   control**, and it costs one line to remove.
2. **Record the QE arm explicitly, including its absence.** Every gate note states whether a
   `qe-e2e` hop ran and its `Q` count, or `UNKNOWN - verify` — **never a silent 0**. Today five
   consecutive blanks are indistinguishable from five consecutive perfect tickets.
3. **Record rework in both units.** Backward column moves **and** blocked-and-returned-to-builder
   events, separately. Post-rule-1 rework is routed as subtask hops inside a column and is currently
   invisible to `plans/metrics.md`'s `Rework rate` row.

## Rejected alternatives, so they are not re-derived

- **Cut the candidate anyway, sized `XS`, "it is cheap".** Rejected: cheap to write, and it commits
  every future pull gate to a step whose value cannot be measured because arm 2 has no instrument.
  A step nobody can evaluate is a step nobody can retire.
- **Cut a ticket to restore the QE hop.** Tempting, and out of scope for this hop by two fences: it
  is a routing decision (the Orchestrator's), and the record contains **no decision** to stop
  dispatching QE — so the first move is to ask whether the stop was intended, not to ticket a
  reversal of something that may have been deliberate. **Escalated in this note; not ticketed.**
- **Cut a ticket to fix rule 1's control wording.** The measurement genuinely supports it — the
  control is mis-specified, not merely un-run (see the sibling `observation`, "two disjoint
  populations"). It is still not cut **this hop**, because `AGENTS.md` is the Scribe's pen, the
  brief fences this hop out of enacting anything, and the right sequence is: get the three integers
  above onto the record for five tickets, *then* re-specify the control against data instead of
  against another argument. **This is the strongest candidate for a future ticket and it is NOT the
  candidate the brief proposed.**
- **Fill the five blank QE cells with the Orchestrator's gate notes.** Rejected in the definitions
  note: different instrument, different target, and splicing them manufactures a trend out of a
  change of method.
