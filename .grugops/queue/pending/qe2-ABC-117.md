---
task: wave-2026-09-25
subtask: qe2-ABC-117
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-117-that-exit-one-is-an-unhandled-exception-not-the-usage-code.md
ref: .grugops/context/qe2-ABC-117/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/ABC-117-exit-one-correction (tip 86bf76b5; corrections 7bf4c61e; QE notes 8e679aed; base 3537fe48)
---

# Subtask: QE re-check of the `ABC-117` widening (QE-117-a S10/S11, page correction, QE-117-c)

Short re-check, not a full re-run. The repair notes are under `.grugops/context/fix-ABC-117/notes/` on the branch.
1. Re-take A1 yourself (read-only-fd run, out-of-product reproduction, `--bogus` control) and judge S10's and S11's wording against YOUR readings,
   including the line citations (`src/cli.ts:136-138`, `:141`, `:160`, `:169`, `:196`).
2. **S10:** appended at the END of `plans/traceability.md`; the `ABC-115` row byte-unchanged (`cmp` on that line, base vs tip); it names the row and
   the clause; it does not re-open the residual, ABC-115 or ADR-0016. **S11:** new observation, empty `supersedes`, refs `…0391186e` and `…92514474`;
   no existing note modified (`git diff --numstat 3537fe48..tip -- .grugops/context` shows only added files).
3. **Page:** the original `## Out of scope` bullet kept; the dated correction bullet true.
4. **QE-117-c:** the A10 comment's referent now unambiguous; the 3 re-wrapped lines are comment-only and say nothing new.
5. **Search:** repeat a content search of your OWN design (different wording from the Engineer's two passes) for a CLAIM-B site beyond S1–S11; judge
   the borderline `…8d7cad3b:80` line.
6. Fences against `3537fe48` (A4–A7: append-only board/ABC-115 page, no CLAIM-A edit, comment lines only under `src/`, NFR-row hash base == head,
   lane counts equal base, `T2` not fired). Gates at the tip. UAT-waiver reading measured yourself.

## Fences
Do not touch `src/`, `plans/board.md` or the ABC-115 page. Own worktree (sibling of the repo) on `grugops/qe2-ABC-117` off the tip — NEVER
`update-ref` the Engineer's branch. No `--force`, `-D`, `reset --hard`. Another QE hop runs in parallel: no timing readings. Never merge or push.
`diff` is a git wrapper; use `/usr/bin/diff` or `cmp`. Notes per Workflow 16 with a PASS / PASS_WITH_GAPS / FAIL verdict, a trace row at the END of
`plans/traceability.md`, a dated addendum to § QE on the ticket. Queue: move THIS FILE to `.grugops/queue/done/qe2-ABC-117.md` and write
`.grugops/queue/done/qe2-ABC-117.claim.md` (flat files, not a directory); leave them uncommitted. `Co-Authored-By:` trailer with your real
model. Remove your worktrees when done. Report tip, verdict, readings, gaps.
