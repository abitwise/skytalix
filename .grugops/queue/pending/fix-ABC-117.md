---
task: wave-2026-09-25
subtask: fix-ABC-117
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-117-that-exit-one-is-an-unhandled-exception-not-the-usage-code.md
ref: .grugops/context/fix-ABC-117/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/ABC-117-exit-one-correction (tip d5afab3f) + grugops/qe-ABC-117 (tip 8e679aed, fast-forwards onto it)
---

# Subtask: widen `ABC-117` by QE-117-a's two missed sites, and fix QE-117-c, before merge (Orchestrator routing: repair, not a follow-up)

QE's verdict is PASS_WITH_GAPS (`.grugops/context/qe-ABC-117/notes/` on `grugops/qe-ABC-117`). A ticket whose job is to correct every
CLAIM-B site should not merge with two known CLAIM-B sites standing.
1. In your worktree on `grugops/ABC-117-exit-one-correction`, first `git merge --ff-only grugops/qe-ABC-117`.
2. **Site S10, `plans/traceability.md`'s `ABC-115` row** ("the non-`EPIPE` path still exits `1` (= `USAGE_EXIT_CODE`)"): the trace is append-only.
   NEVER edit that row. Append ONE correction row at the END of the file that names the row and the clause it corrects, written from A1's readings.
3. **Site S11, `.grugops/context/qe-ABC-115-repair-2026-08-21/notes/…-0391186e.md:69-70`:** notes are never edited. Add its id to the `refs` of a
   NEW `observation` note (empty `supersedes`) stating the true mechanism — or, if the Workflow 16 contract allows, a follow-on observation
   that cites both the S3–S5 note and this one. Do not edit the existing S3–S5 note.
4. **Correct the page's own false statement:** append a dated line under `## Out of scope` (or § Delivery) on the ABC-117 page saying the
   `ABC-115` trace row DID carry the CLAIM-B clause and is now corrected by S10. Do not delete the original sentence.
5. **QE-117-c:** in the rewritten A10 comment in `src/cli.test.ts`, make the referent unambiguous (`ABC-115`'s `## Residual ruling`). Comment
   lines only.
6. Search once more BY CONTENT across `plans/`, `memory-bank/`, `.grugops/context/`, `src/` for any further CLAIM-B site; report the search
   and its result. Do not touch CLAIM-A sites or the four lines QE-117-d ruled out.
All A1–A7 fences still hold (A4 append-only on board and ABC-115 page, A5 no CLAIM-A edit, A6 comment lines only under `src/`). Re-take A1 if your
wording depends on it. A short QE re-check follows you (a different agent).

## Fences
Never merge to main or push. Do not touch `plans/board.md` (no new board edit is owed). Own worktree, `node_modules` symlinked. No `update-ref`
on another branch, no `--force`, `-D`, `reset --hard`. Another SE hop (`fix-ABC-148`) runs in parallel and edits a DIFFERENT paragraph of
`src/cli.test.ts`: no timing readings. Gates before your last commit: lint, typecheck, build, `npm test` with `.test-results/last-run.json`
success:true. `diff` is a git wrapper; use `/usr/bin/diff` or `cmp`. Notes per Workflow 16, a delivery trace row at the END of `plans/traceability.md`.
Queue pending → claimed → done by hand; leave the done file uncommitted. `Co-Authored-By:` trailer with your real model. Report the tip,
gates, the two new corrections verbatim, and the search result.
