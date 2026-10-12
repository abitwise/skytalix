---
task: wave-2026-09-25
subtask: secnfr-ABC-095-s3
role: security-nfr
ticket: plans/tickets/ABC-095-short-circuit-the-engines-move-choice-with-the-book-and-fall-through-cleanly.md
ref: .grugops/context/secnfr-ABC-095-s3/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/secnfr-ABC-095-s3 (off QE tip e1444f23; SE code 09740ea4; SE tip 2307fc11; base main 0974102f)
---

# Subtask: run ABC-095's `In Security/NFR` gate, S3. You are the ONLY hop running (width 1).

Run the S3 checklist exactly as you wrote it in `.grugops/context/secnfr-ABC-095-placement/notes/…a096cf43` § S3 (all items), against the delivered pair `0974102f..2307fc11` (code) and the QE tip `e1444f23`. Cite that note and `ADR-0036` § S1; do not restate them.
- **Clause (b):** `.grugops/context/design-F-072-1/probe/clause-b.mjs`, limbs 1–3, plus Ruling 2 by hand (`AR-095-L1UNIT`: take the limb-1 holders from the base, then `git diff --name-only --no-renames 0974102f 2307fc11 -- <holders>`). Report the holder set at the tip (expected exactly 4) and every edge that fires or must not fire.
- **QE gaps routed to you** (QE verdict `.grugops/context/qe-ABC-095/notes/…ee8775a2` on the QE branch):
  - **QE-095-a** (S3 item 2): no test pins how `readBookFile` resolves its path — QE plant P6b (a cwd-relative path) passed every lane. The delivered code is correct. Rule its severity under S3 and whether it blocks the merge or is an accepted risk with a named fix (QE's: run A7's child from a neutral working directory).
  - **QE-095-e** (S3 item 7): the copy-rule wording against `src/__snapshots__`. Rule whether item 7's text needs a fix and write it if so (in your own note / the ADR block, not the ticket page).
- Confirm or dispute `AR-095-READ` and `AR-095-L1UNIT` at the tip; anything else reached in `ABC-041`'s clauses beyond (b).
- **Not yours:** N8-LANE (QE-095-N8, QE-095-h) — no timing readings in this hop.

## Fences
Own worktree: `git worktree add ../wt-secnfr-ABC-095-s3 -b grugops/secnfr-ABC-095-s3 e1444f23`; symlink `node_modules` into the WORKTREE root only if needed — never `ln -s` in the main checkout. Edit only `memory-bank/50-decisions/` (ADR blocks, dated, append-only), `plans/nfr-catalog.md` only if a security row moves, the ticket page's § Security/NFR (append-only), your notes under `ref:`, and one trace row at the END of `plans/traceability.md`. Do not touch `src/`, `tools/`, tests, `plans/board.md`, `AGENTS.md`. Plants only in scratch copies outside the repo; remove them by exact path and count before/after. No `update-ref`, `--force`, `-D`, `--amend`, `reset --hard`, rebase. Never merge or push. If you change any committed file other than notes, run the gates before your last commit (`npm run -s lint && npm run -s typecheck && npm run -s build && npm test`, `.test-results/last-run.json` success true, `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`). End commits with a `Co-Authored-By:` trailer naming the model you are. Queue: `mkdir .grugops/queue/claimed/secnfr-ABC-095-s3` in the main checkout, then write FLAT `.grugops/queue/done/secnfr-ABC-095-s3.md` and `.claim.md` there, uncommitted; `rmdir` the claim dir.

Report: branch tip; the result (PASS / PASS_WITH_RISKS / FAIL) with each S3 item's reading; rulings on QE-095-a and QE-095-e; any required fix (who, before merge or not); accepted risks; anything owed by BA/PM, the SE or the Orchestrator.
