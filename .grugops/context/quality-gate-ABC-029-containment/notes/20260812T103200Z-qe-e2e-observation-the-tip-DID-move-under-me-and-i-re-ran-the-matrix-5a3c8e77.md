---
id: 20260812T103200Z-qe-e2e-observation-the-tip-DID-move-under-me-and-i-re-ran-the-matrix-5a3c8e77
kind: observation
by: qe-e2e
at: 2026-08-12T10:32:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ABC-028
  - A6.1
  - A6.2
  - A5.6
  - src/history-pane.nfr.test.ts
supersedes: 20260812T102600Z-qe-e2e-observation-concurrency-claim-verified-not-accepted-1d7f4b53
---

# THE TIP DID MOVE UNDER ME. I said I would say so, so I am saying so — and I re-ran all fourteen verdicts against the moved file rather than arguing they could not move

> **`kind: observation`. Supersedes `…1d7f4b53`**, which recorded the concurrent branch as sitting on
> my exact commit. **That was true when it was written and is now stale — the exact failure mode the
> brief put on the record, caught here by re-taking the ref at the end instead of quoting the one
> taken at the start.** The earlier note stays in `notes/` as the audit trail; Workflow 16 appends and
> supersedes, it does not rewrite.
>
> **Written AFTER the queue claim was released into `done/`.** The queue CLAIM is work-ownership and
> the work is finished; this is a note, and correcting a note by appending a superseding one is the
> protocol. **The subtask was not re-claimed and no second agent was on it.**

## What moved, and what did not

| | at claim (10:04Z) | at close (10:29Z) |
|---|---|---|
| **my HEAD** | `313ec7450c48fc143b0cf7673ca51c5d760369cc` | **`313ec745…` — UNMOVED** |
| **the file I gated**, `src/history-pane.nfr.test.ts` on my tree | md5 `d51b02be9351c8ee8ed5b3436873db68` | **`d51b02be…` — UNMOVED** |
| `grugops/ABC-028-a5-comment` | `313ec745…` (my exact commit) | **`593ba7042968413f8471734c9122d33216248207` — MOVED** |

**Nothing I gated changed. What changed is the prospective merge partner:** the Engineer committed
`593ba70 test(history-pane): grug make comment tell truth, grug measure sharing still hold guard`
mid-hop.

## What that commit does to my subject file — measured, read-only, no worktree entered

- **The diff to `src/history-pane.nfr.test.ts` is COMMENT-ONLY.** Every changed line begins `//` —
  checked mechanically (`grep -vE '^[+-]//'` over the diff hunks returns **nothing**). The block at
  `:103-120` grew to `:103-123`.
- **New file: md5 `1d33bea667cc792e1fa1fd4030caa718`, 460 lines, still exactly 8 `it()`.**
- **The guard expression is byte-identical and has moved from `:314` to `:317`.**
- `git merge-tree --write-tree HEAD grugops/ABC-028-a5-comment` → exit `0`, tree
  `80e2124ccc151117520894d117f1c47d29ce5076`, **no conflict**. My branch never touched that file, so
  the merge takes the Engineer's version whole.
- The commit also adds five `ABC-028` context notes, two queue records, and edits
  `plans/traceability.md` — **none of which this gate reads.**

## I re-ran the matrix instead of resting on the argument

The superseded note argued the verdicts *could not* move, because
`productionModulesIn` filters `.test.ts` out and the file I gate is therefore never inside either
guard's scanned set. **That argument is correct and it is still the load-bearing reason. It is also
exactly the kind of reasoning that should be cheap to check, so I checked it:**

**All fourteen required verdicts re-run against `git show grugops/ABC-028-a5-comment:src/history-pane.nfr.test.ts`,
on both trees — `A6.1` ×4, `A6.2` ×4, `A5.1`, `A5.2`, `A5.3`, `A5.4` ×2, `A5.6`. Every one is
IDENTICAL, message for message**, including
`expected [ 'turn-loop.ts', 'zobrist.ts' ] to deeply equal [ 'turn-loop.ts' ]` and
`expected [ 'zobrist.ts' ] to deeply equal [ 'turn-loop.ts' ]`. Instrument count still **8/8** green
on BASE on both trees.

**So the verdict in the sibling notes now holds for BOTH digests — `d51b02be…` (the tree I gated) and
`1d33bea6…` (the tree after the concurrent comment lands).** No digest from this hop needs to be
quoted forward against an unverified file.

## The Orchestrator's claim, re-scored

**UPHELD, and now upheld against a real commit rather than against an empty diff.** The correction in
the superseded note stands and is strengthened: the disjointness rests on the `.test.ts` exclusion,
not on the line ranges. **What was wrong in the superseded note was only its factual premise** — that
there was nothing committed to be disjoint from. There is now, and it is disjoint.

## ONE new thing to route — the line numbers in the record just went stale AGAIN

The guard expression moved **`:314` → `:317`** and the probe docblock moved **`:345-367` → `:348-370`**.
Cited at `:314`/`:345-367` in `ADR-0011`'s containment section, in `ABC-029`'s `A6` clause and
`## Test notes` 11, and in the Engineer's `ticket-to-pr-ABC-029-containment` notes.

**This is the fourth instance on this stack of the same defect** — `A4`'s `:253-262` no longer
pointing at a docblock, `## Test notes` 11's two ranges being one block at two file states, `A11`'s
four stale-but-correct-at-the-time measurements, and now this. **It is stale, not wrong-at-the-time,
and nothing depends on it that a `grep` cannot re-find.** Recorded rather than fixed: I did not edit
any ticket, ADR or published note. **Owner: whoever next opens those sites. Trigger: the first hop
that cites `:314` and does not find the expression there.**
