---
task: wave-2026-09-25
subtask: qe-ABC-153
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-153-the-book-sha256-test-alters-only-the-first-source-file.md
ref: .grugops/context/qe-ABC-153/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/ABC-153-book-sha256-every-file (tip fe6add38; code 917df052; base 21980135)
---

# Subtask: QE on `ABC-153`, the book sha256 test now alters each of the five source files

Verify A1–A4 independently, from your own readings; the build notes are under `.grugops/context/ticket-to-pr-ABC-153/notes/` on the branch.
- **A3 — re-plant the mutants yourself** (Test note 2: in scratch copies OUTSIDE the repo, e.g. `git archive`): `M05`, `M-SWAP`, `M06`, unmutated, each against the BASE test (`main` @ 21980135) and the HEAD test. Record your own eight readings.
- **Break the head test on purpose with mutants the ticket does not name:** a check that covers only the LAST file; one that skips a middle file (`c.tsv`); one that compares hashes case-insensitively or by prefix; a refusal that writes a partial output before throwing; a refusal message missing the actual hash. Say which the head test catches.
- **Test-quality reads:** the per-file alteration really changes the bytes (each altered hash differs from expected), the restore leaves the next iteration's fixture well-formed and independent (would a failed restore mask a later file?), the size-5 assertion would fail if two rows collided, and the loop cannot pass vacuously (e.g. empty `SOURCE_FILES`).
- **A4:** path fence on the CODE range `21980135..917df052` (the tip's notes/§ Delivery/trace row are the subtask's record); `cmp` windows yourself; `compile.ts` and `book.json` `cmp` 0; 0 spawn matches; `npm test` file/test counts equal base, skips 0.
- Measure the UAT-waiver reading yourself.

## Fences
Do not touch `src/`, `tools/`, `data/` or `plans/board.md`; revert every plant. Work in your OWN worktree on a QE branch `grugops/qe-ABC-153` off the tip — NEVER `update-ref` the Engineer's branch. No `--force`, `-D`, `reset --hard`. Take no timing readings (another hop runs in parallel). Never merge or push. `diff` is a git wrapper here; use `/usr/bin/diff` or `cmp`. Publish notes per Workflow 16 with a PASS / PASS_WITH_GAPS / FAIL verdict, a trace row at the END of `plans/traceability.md`, and a § QE section on the ticket. Queue: `mkdir .grugops/queue/claimed/qe-ABC-153`, then at the end write FLAT files `.grugops/queue/done/qe-ABC-153.md` and `.grugops/queue/done/qe-ABC-153.claim.md` (not a directory); leave both uncommitted. End commits with a `Co-Authored-By:` trailer naming the model you are. Report the branch tip, verdict, each criterion with your reading, and gaps.
