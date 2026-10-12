---
task: wave-2026-09-25
subtask: qe-ABC-117
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-117-that-exit-one-is-an-unhandled-exception-not-the-usage-code.md
ref: .grugops/context/qe-ABC-117/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/ABC-117-exit-one-correction (tip d5afab3f; corrections 59000c87; base 3537fe48)
---

# Subtask: QE on `ABC-117`, the exit-one record correction (documentation-only)

Verify A1–A7 independently, from your own readings; the build notes are under `.grugops/context/ticket-to-pr-ABC-117/notes/` on the branch.
- **A1: re-run BOTH commands yourself** — the delivered build with a read-only fd as stdout, and the out-of-product reproduction — and record exit,
  usage-line count, `internal error` count, `CAUGHT:`. Then judge every corrected sentence against YOUR readings.
- **The Engineer's disagreement:** the page's `grep -c "Usage"` reads 0 on every path (the usage line is lower-case `usage:`), so it cannot tell a
  refused command line from the EBADF path; the Engineer substituted `grep -c '^usage: '`. Rule whether that substitution is sound and whether the
  page's instrument is a gap for BA/PM.
- **A5 is the trap:** confirm no CLAIM-A site is edited, ADR-0016 untouched, and the wording nowhere re-opens, re-scores, moves or calls into
  question `ABC-115` (now `Done`, owner-signed) or proposes a wider product arm.
- **A2(iii):** `cmp` the carried-forward acceptance text against the original yourself. **A3/A4:** notes unedited, board and ABC-115 page diffs are
  added lines only, `src/cli.test.ts` diff comment lines only.
- **S9 placement (Orchestrator ruling, for you to check, not re-decide):** the single board block after S6 corrects both S6 and S9; that is accepted
  as within the one-block fence. Check it names both clauses it corrects.
- **A6:** the NFR-row hash moved since the page was cut; grade base == head. **A7:** your own `--dir src` counts base vs head; `T2` not fired.
- Look for a CLAIM-B site the Engineer missed (search by content across `plans/`, `memory-bank/`, `.grugops/context/`, `src/`), and judge the two
  sites the Engineer left alone (`src/cli.test.ts:3251` and the stale `src/cli.ts:159` reference in the A10 comment).
Measure the UAT-waiver reading yourself.

## Fences
Do not touch `src/`, `plans/board.md` or the ABC-115 page; revert any plant. Work in your OWN worktree on a QE branch `grugops/qe-ABC-117` off the
tip — NEVER `update-ref` the Engineer's branch. No `--force`, `-D`, `reset --hard`. Take no timing readings (other hops run in parallel). Never
merge or push. `diff` is a git wrapper here; use `/usr/bin/diff` or `cmp`. Publish notes per Workflow 16 with a PASS / PASS_WITH_GAPS / FAIL verdict,
a trace row at the END of `plans/traceability.md`, and a § QE section on the ticket. Move the queue file pending → claimed → done by hand; leave the
done file uncommitted. End commits with a `Co-Authored-By:` trailer naming the model you are. Report the branch tip, verdict, each criterion with your reading, and gaps.
