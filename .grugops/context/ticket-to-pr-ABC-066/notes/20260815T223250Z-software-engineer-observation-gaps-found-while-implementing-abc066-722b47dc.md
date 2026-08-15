---
id: 20260815T223250Z-software-engineer-observation-gaps-found-while-implementing-abc066-722b47dc
kind: observation
by: software-engineer
at: 2026-08-15T22:32:50Z
verified_by: 
confidence: high
refs:
  - ABC-066
  - ABC-065
  - plans/tickets/ABC-066-usage-line-is-not-a-runnable-command.md
  - .grugops/context/pull-abc065-066-2026-08-16/notes/20260815T221745Z-orchestrator-decision-ready-for-dev-exit-re-read-for-abc065-and-abc066-7c41ae90.md
supersedes: 
---

# `ABC-066` — gaps found while implementing, each with severity and owner

Continuing the parent note's numbering (`G1`–`G3` are the Orchestrator's, recorded at the
`Ready for Dev` exit; they are referenced, not restated). **None of these blocked delivery. None was
repaired here** — three of the four are somebody else's pen, and the fourth is a schedule fact, not
a document.

## `G4` — **the parallel schedule is file-disjoint but CHECKOUT-shared.** Severity: **MEDIUM.** Owner: **Orchestrator**

The parent note's ruling schedules `ticket-to-pr-ABC-065-scribe` and `ticket-to-pr-ABC-066` in
parallel because *"file sets are genuinely disjoint, so `G2` cannot bite between these two."* The
file sets are indeed disjoint. **The working tree is not.** When this hop started, the Scribe had
already run `git checkout -b grugops/ticket-to-pr-ABC-065-scribe` in the one working directory this
project has; checking out this hop's branch there would have moved the Scribe's `HEAD` and its
uncommitted `AGENTS.md` edits out from under a live agent.

Handled here rather than escalated: this hop worked in a **linked git worktree** (`git worktree
add`), one checkout per branch, and touched the Scribe's tree only to take the queue claim. **Two
smaller hazards were observed and are worth writing down because they are generic to any future
parallel schedule on this repo:**

1. **The git INDEX is per-worktree, but the shared tree has exactly one.** This hop's `git mv` of
   its own subtask file staged a change into the index the Scribe was about to commit from. It was
   unstaged immediately, and the Scribe's commit `717e51d` was verified afterwards to carry **only
   its own path** — no leakage occurred. A hop that committed with `git commit -a` or `git add -A`
   at the wrong moment would have swallowed another hop's work into its ticket's commit.
2. **The queue lives in the shared tree, the delivery lives on a branch.** The claim was taken in
   the shared tree (that is where the live coordination substrate is, and where the next agent looks
   for it) and mirrored into the worktree so the delivered branch carries the pending→claimed
   transition. Both are on disk and consistent; nobody has to reconcile them by hand.

**What is actually owed to the Orchestrator: a rule for how two hops share one checkout** — a
worktree per parallel hop, or a serial schedule. **G2 was the file-level version of this and it was
caught; this is the tree-level version and it was not.** `queue.claim_cap` is `2`, so this schedule
is legal today and will recur.

## `G5` — **the subtask file's `base:` was stale on arrival.** Severity: **LOW.** Owner: **Orchestrator**

`.grugops/queue/pending/ticket-to-pr-ABC-066.md` front matter reads `base: main @ 3fb6ebd`. The
board move `4e9ed1d` committed **after** the subtask file was written, so `3fb6ebd` does not contain
the subtask file itself. Branched from `4e9ed1d` instead, which is what carries this hop's own brief
into its tree. The `ABC-065` Scribe hit and recorded the identical thing in its `claim.md`, so this
is **two for two on the same enqueue** — a front-matter field written before the commit it names.

## `G6` — **`ABC-066` test note 3 is unfollowable as written, and is now discharged.** Severity: **LOW.** Owner: **BA/PM**

Confirmed at implementation, not re-derived: `ABC-062` has not merged, so its extraction helper does
not exist and the note's *"use it"* had no referent. **The parent note's `G3` already homed this**;
this hop only confirms it from the code side and reports that the helper now exists (see the
`artifact-ref` note). **The ticket page still carries the unfollowable sentence** — repairing that
prose is BA/PM's pen, and a later reader of `ABC-066` will be sent looking for a merged `ABC-062`
that is not there.

## `G7` — **`ABC-062`'s block does not exist yet, so its half of the two-way fence is unenforced.** Severity: **LOW.** Owner: **BA/PM**

`ABC-066` § Dependencies fences `ABC-062` and `ABC-066` in both directions — *"whichever merges
second reuses the existing stderr-to-usage-line helper."* This hop is now the FIRST, so the fence's
whole weight has moved onto the **two** tickets that come after it (`ABC-065`'s guard hop and
`ABC-062`), and neither page has been updated to say the helper now exists and where. **The helper's
name and location are published in this task's `artifact-ref` note**, which is the mechanism that
makes the fence enforceable; a page that still says "if `ABC-062` has merged" does not point at it.

## Not gaps, recorded so nobody re-opens them

- **`A6`'s "2 paths" against a 7-path branch diff** is not a defect: `ABC-060`'s ruling, which `A6`
  cites by name, makes everything under `.grugops/` a process artifact. It is why the delivery and
  the process artifacts are two commits on this branch. Working as designed.
- **The guard proves what the line advertises RESOLVES, not that `npm` forwards it.** That is the
  ticket's own stated limit, belongs to the UAT pack, and is not a gap in this implementation. The
  six hand runs through `npm` cover it as evidence, not as a guard.
- **The `A1` row at `src/cli.test.ts` asserting `` toContain("- Dev / run: `npm run chess`") ``**
  is `ABC-065`'s to reckon with as it edits that `AGENTS.md` line. Untouched here; flagged so the
  next hop is not surprised by it.
