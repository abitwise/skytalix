---
id: 20260815T121500Z-orchestrator-decision-abc042-merged-board-closed-and-what-stays-the-owners-8f31c0d4
kind: decision
by: orchestrator
at: 2026-08-15T12:15:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - G1
  - N8-SPAWN
  - NFR-008
  - plans/board.md
  - plans/traceability.md
  - memory-bank/60-progress.md
supersedes: 
---

# Orchestrator Decision — `ABC-042` is MERGED and `Done`; what I closed, what I swept, and what stays the owner's

## What the owner asked for, and what was actually done

*"My decision: create a spawn account and merge"* — **both, in that order, and not as one act.**

The account was created **before** the merge and the merge was made **after** the bar it breached had
been amended by the only authority that could amend it and re-measured by the role that grades it.
**Merging first and accounting afterwards would have been the same act in a different order and it
would have been dishonest** — the ticket would have entered `main` against a bar it failed, with the
repair backdated.

| step | role | outcome |
|------|------|---------|
| integrate three unmerged tips | Orchestrator | `grugops/abc042-merge-key`, gates green |
| write `N8-SPAWN` | Architect/Design | `plans/nfr-catalog.md` § `NFR-008`, +103/−0 |
| re-grade `G1` | Security/NFR | **MET at 0.23×**, ASVS L1 `PASS_WITH_RISKS` stands |
| merge, close, sweep | Orchestrator | `main` @ `dbaf972`, `Ready for UAT` → `Done` |

**Neither specialist was told what to find.** The Architect's subtask said *if the owner's
instruction cannot be written honestly, stop and say so*; the Security subtask said *MET, NOT MET, and
"the account does not reach this ticket" are all honest outcomes* and deliberately carried no target.
Security/NFR did not reproduce its own earlier prediction — it returned a **larger** charge on a finer
instrument and **corrected its own gate figure as an under-reading of a coarse clock**. That is what
an un-steered re-grade looks like.

## The gates, both sides of the merge

Standing directive limit 2 — *run the gates on the branch tip before the merge and again on `main`
after it, and record both*. Done, at my own hand, on this machine (**Apple M3, Darwin 25.5.0 arm64,
Node v24.12.0, vitest 3.2.7**; `UNKNOWN - verify` elsewhere):

| | tip `407d625` | `main` `dbaf972` |
|---|---|---|
| lint / typecheck / build | 0 / 0 / 0 | 0 / 0 / 0 |
| `npm test` | 856/856 on 30 files | 856/856 on 30 files |
| skip count / integrity | 0 / `No findings.` 0 | 0 / `No findings.` 0 |

**And the thing a gate cannot tell you: `npm run chess` prints a board on `main` and exits 0.** I ran
it. This repository has never before been able to do that.

## The disclosure wire fired, and it is not buried

`N8-SPAWN`'s first-ever charge tripped its own disclosure wire — **1.90 slices against a one-slice
wire**. The account requires that this be *reported and carried into the merge decision, never
silently netted*. **It is in the merge commit message, in the board header, and in the traceability
row.** The cumulative wire missed by **64 ms**, so the account is open and **the next spawning ticket
closes it** — which Security/NFR notes is instrument-dependent, and the spread between defensible
instruments is larger than the remaining margin. That is the owner's and Architect/Design's to look
at, not mine to pre-empt.

## The queue sweep — seven orphaned claims, no record destroyed

The merge brought **seven `claimed/` directories for subtasks that are finished**, each holding only
its `claim.md` registry record while its subtask file already sat in `done/`. Left alone, the queue
would assert that seven agents are running when none are.

Workflow 17's sweep returns a stale subtask to `pending/` — **that is exactly the wrong outcome
here**, because it would re-queue completed work. So instead: **every `by`/`at` record was preserved
beside its own `done/` entry** under this project's existing `done/<task>.claim.md` convention (six of
them), and the seventh was removed only after `cmp` proved the identical record already existed in
`done/agents-md-ABC-042-dev-run/claim.md`. **Nothing was deleted that did not demonstrably exist
elsewhere byte-for-byte.** Queue: **0 pending, 0 claimed.**

## What I did NOT do

- **I did not open the ticket page** beyond its `status:` / `column:` frontmatter, which is the
  board↔ticket contract and mine. BA/PM refused three body edits after the gates passed; that
  refusal outlived the hold and outlives the merge.
- **I did not repair the four malformed traceability rows.** Security/NFR measured them directly:
  `ABC-009` at 12 cells, `ABC-011`/`ABC-015`/`ABC-019` at 11 — **which replaces the 14/13 figure an
  earlier board header carried, including mine.** It also found the stated cause is wrong in
  `ABC-009`'s own prose: a pipe inside a backtick span is not GFM-legal and needs `\|`. `ABC-052`'s
  subject; flagged under coding rule 12, routed, not touched.
- **I did not repair the two stale censuses** Architect/Design flagged (`NFR-008`'s table cell and
  `ADR-0008` Decision 6 both say the budget has two accounts; there are three). Writing inside a
  ratified row needs authority this hop does not have — and the owner's answer authorized an account,
  not an editing licence over the document.
- **I did not touch the floor account**, whose unbounded shape Architect/Design flagged as identical
  to the one the new account now fences.
- **I did not run UAT and did not claim it.** See below.
- **I did not deploy.** The owner wrote *merge*.

## UAT — named, not folded in

`memory-bank/60-progress.md` records that with the merge keystroke delegated **there is no human
checkpoint between an agent's work and `main`**, and names the revisit trigger precisely: *the first
moment `EPIC-006` produces something a human can actually exercise*. **`ABC-042` is that moment.**

28 `Done` tickets each recorded *UAT deferred → EPIC-006, explicitly NOT passed*, because there was
nothing to exercise. **That reason expired at `dbaf972`.** `ABC-042` is `Done` under the lean
definition (merged) and on the owner's explicit instruction to merge — **but "UAT deferred" is no
longer a fact about the product, it is now a choice.** It is the owner's, it is unmade, and it is
recorded here rather than quietly inherited by `ABC-043`.

## Next, in order

1. **BA/PM re-scores `ABC-057`/`ABC-058`/`ABC-059`.** Their DoR ⚠️ was *"ordered behind `ABC-042`'s
   merge — `src/cli.test.ts` does not exist on `main`"*. **It does now.** The re-score is BA/PM's; I
   did not move their scores.
2. **The owner's remaining items**, none of which this hop touched: `B2` (ticket prose budget), the
   Coach's on-demand trigger, the floor-account wire, and the unattributed 3 s wall clause that
   spawning is the first cost to load.
