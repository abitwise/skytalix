---
task: wave-2026-09-25
subtask: bapm-owed-batch-2026-10-10
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/bapm-owed-batch-2026-10-10/
source_refs:
  - .grugops/context/wave-2026-09-25/notes/20261010T132239Z-orchestrator-observation-handoff-2-7d3e1b84.md (§ Owed routings → BA/PM)
  - .grugops/context/qe-ABC-053/notes/20261010T120534Z-qe-e2e-observation-abc053-gap-register-a4b293d2.md (QE-053-b/c/d)
  - .grugops/context/qe-ABC-054/notes/20261010T130030Z-qe-e2e-observation-abc054-gap-register-ee331683.md (QE-054-a/c)
  - .grugops/context/qe-ABC-057/notes/20261010T133223Z-qe-e2e-observation-abc057-gap-register-a331f012.md (QE-057-b)
  - branch grugops/ABC-087-difficulty-levels: .grugops/context/secnfr-ABC-087/notes/20261010T130030Z-security-nfr-decision-abc087-pass-with-risks-nfr004-ruled-per-move-played-ar-nfr004-a-reaccepted-clamp-pin-owed-3f1974f5.md (ABC-101 forward note)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T13:40:27Z
branch: grugops/bapm-owed-batch-2026-10-10
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: BA/PM batch — owed page repairs, gap dispositions and one re-score

For each item, read the source, then do one of three things: repair the page wording, cut a ticket (XS/S,
DoR scored), or record a no-ticket disposition with a reason. Re-verify each premise at the current wave
tip first. August/early-October premises have gone stale before.

1. **ABC-041 A8:** add the one-line note owed on the page.
2. **ABC-129 re-score:** its ⚠️3 is discharged. Re-score the DoR. Note that the owner has not yet ruled
   whether comment-only production diffs count as zero production lines. Record which way the ruling
   moves this ticket. Never build or score it in parallel with ABC-132 (they pair).
3. **QE-053-b/c/d:** wording on the ABC-053 page or follow-up.
4. **QE-054-a** (comments read as specifiers) **and QE-054-c** (two instrument rows, XS).
5. **QE-057-b:** the composer prose undercounts the uncounted static import spellings. QE found two more.
6. **ABC-101 forward note:** look up only its own integer keys. The source note is on the unmerged ABC-087 branch. Read it there with commit 97de9122a4cba86ccdc1195cc12ff0d77bf63c55
Author: Olger Oeselg <abitwise@gmail.com>
Date:   Sat Oct 10 16:36:48 2026 +0300

    docs(board,queue): grug record ABC-104 QE, close QE hop, enqueue docblock fix-forward
    
    Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>

diff --git a/.grugops/queue/done/qe-ABC-104.claim.md b/.grugops/queue/done/qe-ABC-104.claim.md
new file mode 100644
index 00000000..d28be18f
--- /dev/null
+++ b/.grugops/queue/done/qe-ABC-104.claim.md
@@ -0,0 +1,12 @@
+---
+subtask: qe-ABC-104
+role: qe-e2e
+claimed_by: qe-e2e (Claude Opus 5.5)
+claimed_at: 2026-10-10T13:30:26Z
+worktree: .claude/worktrees/qe-ABC-104
+branch: grugops/ABC-104-coordinate-move-docblock
+---
+done_at: 2026-10-10T13:35:42Z
+branch: grugops/ABC-104-coordinate-move-docblock
+tip: 227853a4 (QE commit; reviewed 76237852, code 7707f61f)
+verdict: PASS_WITH_GAPS (A1-A3 MET; LOW QE-104-a/b/c, INFO QE-104-d/e/f)
diff --git a/.grugops/queue/pending/qe-ABC-104.md b/.grugops/queue/done/qe-ABC-104.md
similarity index 100%
rename from .grugops/queue/pending/qe-ABC-104.md
rename to .grugops/queue/done/qe-ABC-104.md
diff --git a/.grugops/queue/pending/fix-ABC-104.md b/.grugops/queue/pending/fix-ABC-104.md
new file mode 100644
index 00000000..0db5985b
--- /dev/null
+++ b/.grugops/queue/pending/fix-ABC-104.md
@@ -0,0 +1,34 @@
+---
+task: wave-2026-09-25
+subtask: fix-ABC-104
+role: software-engineer
+workflow: agent-factory/workflows/04-ticket-to-pr.md (fix-forward before UAT)
+ticket: plans/tickets/ABC-104-coordinate-move-totality-claim.md
+ref: .grugops/context/fix-ABC-104/
+source_refs: .grugops/context/qe-ABC-104/notes/20261010T133349Z-qe-e2e-observation-abc104-gap-register-df369a19.md (QE-104-a/b/c)
+enqueued_by: orchestrator
+enqueued_at: 2026-10-10T13:36:48Z
+branch: grugops/ABC-104-coordinate-move-docblock (tip 227853a4)
+---
+
+# Subtask: fix-forward `ABC-104` — close QE-104-a/b/c in the same docblock before UAT
+
+The owner signs this exact docblock, so it must be exact. Close the three LOW gaps in QE's register (read
+it and the probe output; re-run the probe yourself after editing):
+- **a** — the `:25` caller-obligation count must agree with the obligations the docblock now states.
+- **b** — attribute to `ADR-0004` clause 2 only what clause 2 states; anything else is this file's own.
+- **c** — the "wrong type throws" sentence must not claim more than the behaviour (QE measured six
+  wrong-type calls that return); the two quoted throwing calls stay exact.
+
+A1–A3 must still hold (A3: comment-only, inside the header; stripped-compile output identical to base).
+
+## Fences
+Comment-only, `src/coordinate-move.ts` only. No tests. No ADR edits (QE-104-d is routed to the Architect).
+Never merge; never push. No `plans/board.md`, `AGENTS.md`. Own NEW worktree (old ones are removed);
+link `node_modules` into it only. Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC
+stamps. Trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
+
+## Publish
+Note per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § Delivery addendum. Queue
+pending → claimed → done (by hand, main checkout, uncommitted). Report: per-gap before→after text, A1–A3
+re-check, gates, numstat, sha.
diff --git a/plans/board.md b/plans/board.md
index df8ef6ca..85d20a33 100644
--- a/plans/board.md
+++ b/plans/board.md
@@ -1,4 +1,5 @@
 # Board
+_Updated: 2026-10-10 by the Orchestrator (task `wave-2026-09-25`) — `ABC-104` QE PASS_WITH_GAPS; docblock fix-forward `fix-ABC-104` dispatched (stays `In Review`)._
 _Updated: 2026-10-10 by the Orchestrator (task `wave-2026-09-25`) — `ABC-057` → `Done` (UAT WAIVED; merged `f7f957ae`)._
 _Updated: 2026-10-10 by the Orchestrator (task `wave-2026-09-25`) — `ABC-059` → `In Review` (`4230d3ab`); QE `qe-ABC-059` dispatched. In Review now 3/3._
 _Updated: 2026-10-10 by the Orchestrator (task `wave-2026-09-25`) — `ABC-104` → `In Review` (`76237852`); QE `qe-ABC-104` dispatched._
@@ -618,7 +619,7 @@ _Updated: 2026-08-21 by QE/E2E (task `qe-ABC-115-repair-2026-08-21`, subtask `qe
 
 ## In Review (WIP 2/3)
 
-- [ABC-104] `coordinate-move.ts`'s docblock claims a totality it does not have  (BA/PM, XS, P3, epic: EPIC-003, since: 2026-08-17; **blocked on `ABC-031` merging — now unblocked**; docblock only, behaviour change fenced out as an `ADR-0004` question) **2026-10-10 re-score: DoR 10/10 → Ready; A3 vacuous clauses replaced. Touches a production file → owner UAT word needed.** **→ In Development 2026-10-10**, pulled by the Orchestrator (subtask `ticket-to-pr-ABC-104`, branch `grugops/ABC-104-coordinate-move-docblock`). **→ In Review 2026-10-10**: built on `grugops/ABC-104-coordinate-move-docblock` @ `76237852` (A1–A3 MET, gates green, 1583 tests; `src/` 8+/3− comment lines only). QE `qe-ABC-104` dispatched. UAT not waived (production file).
+- [ABC-104] `coordinate-move.ts`'s docblock claims a totality it does not have  (BA/PM, XS, P3, epic: EPIC-003, since: 2026-08-17; **blocked on `ABC-031` merging — now unblocked**; docblock only, behaviour change fenced out as an `ADR-0004` question) **2026-10-10 re-score: DoR 10/10 → Ready; A3 vacuous clauses replaced. Touches a production file → owner UAT word needed.** **→ In Development 2026-10-10**, pulled by the Orchestrator (subtask `ticket-to-pr-ABC-104`, branch `grugops/ABC-104-coordinate-move-docblock`). **→ In Review 2026-10-10**: built on `grugops/ABC-104-coordinate-move-docblock` @ `76237852` (A1–A3 MET, gates green, 1583 tests; `src/` 8+/3− comment lines only). QE `qe-ABC-104` dispatched. UAT not waived (production file). **2026-10-10 QE `qe-ABC-104` PASS_WITH_GAPS (`227853a4`; A1–A3 met; comment-only proved by stripped-compile identity).** Gaps QE-104-a/b/c (LOW, same docblock: `:25` 'ONE CALLER OBLIGATION' now wrong; ADR-0004 attribution over-reaches; 'a wrong type throws' unconditional) → engineer fix-forward `fix-ABC-104` before UAT. QE-104-d (ADR-0004 (2a) parseSan totality) → Architect.
 - [ABC-059] The `AGENTS.md` runnability guard pins a spelling, not the fact  (BA/PM, XS, P3, epic: EPIC-006, since: 2026-08-16, DoR 9/10 ⚠️ same ordering; `S6` — the mechanism that let `Q13` through a green gate) **2026-10-10 audit: same ordering met — `ABC-042` Done 2026-08-15.** **2026-10-10 re-score: DoR 10/10 → Ready; A1 re-worded (3 `Dev / run` occurrences now); P3→P2. After ABC-058.** **→ In Development 2026-10-10** (subtask `ticket-to-pr-ABC-059`, branch `grugops/ABC-059-runnability-guard`). **→ In Review 2026-10-10**: built on `grugops/ABC-059-runnability-guard` @ `4230d3ab` (A1–A6 MET, gates green, 1584 tests; `src/cli.test.ts` +76 only; AR-058-STRIP not fired; green on ABC-087's AGENTS.md). Cost reading INADMISSIBLE (twin control failed twice under load1 20–34) — QE re-reads. QE `qe-ABC-059` dispatched.
 
 .

## Fences
Docs only: ticket pages, new ticket pages, your notes. Do not edit `src/`, `plans/board.md`, ADRs or
`AGENTS.md`. Do not change any existing ticket's column. New tickets get `status: backlog` or
`ready`, as scored, and the Orchestrator places them on the board. Never merge; never push. Work in your own worktree.
Write the commit-message file in a PRIVATE scratchpad subdirectory. Use real UTC stamps. Trailer:
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Publish
Write notes per Workflow 16 and add a trace row at the END of `plans/traceability.md`. Move the queue file
pending → claimed → done (by hand, in the main checkout, left uncommitted). Report per item: the disposition, files touched, any new
tickets with DoR, size and priority, and owner questions; then the branch, sha and numstat.
