---
task: wave-2026-09-25
subtask: qe-ABC-145
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-145-the-book-compiler-stamps-its-source-commit-and-never-checks-the-source-bytes.md
ref: .grugops/context/qe-ABC-145/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/ABC-145-book-source-sha256 (tip 62a5f8ea; code 7be28bf9; base 3537fe48)
---

# Subtask: QE on `ABC-145`, the book compiler's source sha256 check

Verify A1–A6 independently, from your own readings; the build notes are under `.grugops/context/ticket-to-pr-ABC-145/notes/` on the branch.
- **A1/A2:** re-plant the one-byte alteration yourself; also show A1 red on a no-check variant. **A3:** your own mutants on a scratch copy (one hex char; a swap of two rows).
- **A4 is a delivery RUN — re-run it yourself:** fetch the five files at `SOURCE_COMMIT` from the raw URLs in `ATTRIBUTION.md` into a dir OUTSIDE the repo, compile, `cmp` `book.json` against `git show main:data/opening-book/book.json`, plus the one-byte negative run. If the fetch fails, record A4 as NOT RUN by QE, never PASS.
- **A5** on joined text. **A6 Orchestrator ruling:** the path/new-file fence is read on the CODE range `3537fe48..7be28bf9`; the tip's extra paths (notes, trace row, § Delivery) are the subtask's own required record and do not fail A6. Confirm the tip adds only those record paths.
- **The "9 existing `it` blocks" wording:** the Engineer reads 10 at base (9 `it` + one `it.each`). Count it yourself and confirm none of them changed; name the page wording as a gap for BA/PM, do not edit it.
Break the check on purpose: hash computed on decoded text instead of raw bytes, a check that runs after `writeBook`, a refusal that leaves a partial file, an extra or missing source file in the dir, a `SOURCE_SHA256` key that no file has. Say which the tests catch.
Measure the UAT-waiver reading yourself (and note that `tools/` code changed: say whether the zero-`src/` waiver honestly applies).

## Fences
Do not touch `src/`, `tools/`, `data/` or `plans/board.md`; revert every plant. Work in your OWN worktree on a QE branch `grugops/qe-ABC-145` off the
tip — NEVER `update-ref` the Engineer's branch. No `--force`, `-D`, `reset --hard`. Take no timing readings (other hops run in parallel). Never
merge or push. `diff` is a git wrapper here; use `/usr/bin/diff` or `cmp`. Publish notes per Workflow 16 with a PASS / PASS_WITH_GAPS / FAIL verdict,
a trace row at the END of `plans/traceability.md`, and a § QE section on the ticket. Move the queue file pending → claimed → done by hand; leave the
done file uncommitted. End commits with a `Co-Authored-By:` trailer naming the model you are. Report the branch tip, verdict, each criterion with your reading, and gaps.
