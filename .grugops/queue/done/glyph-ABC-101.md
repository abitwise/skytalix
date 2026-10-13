---
task: wave-2026-09-25
subtask: glyph-ABC-101
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-101-difficulty-selection.md
ref: .grugops/context/glyph-ABC-101/
enqueued_by: orchestrator
enqueued_at: 2026-10-13T00:00:00Z
branch: grugops/ABC-101-difficulty-selection (tip 98ea0a84; worktree ../wt-ticket-to-pr-ABC-101)
base: main @ b5d4f47d (carries bapm-amend2-ABC-101)
---

# Subtask: build ABC-101's `A11` (piece polarity) on the ABC-101 branch. You are the ONLY hop running (width 1).

Owner word: the swap is permanent, no flag (`…owner-word-abc101-swap-permanent-no-flag-*`). Contract: Frontend/UI `.grugops/context/design-ABC-101-glyphs/notes/…1c687529`. Criteria: ABC-101 `A11a`–`A11g`, widened `A9`, and Test note 6 — all on main at `b5d4f47d`. Follow BA/PM's SE steps in decision note `.grugops/context/bapm-amend2-ABC-101/notes/…493e3ec3`:

1. In `../wt-ticket-to-pr-ABC-101`, `git merge --no-ff main` (no rebase). Expected conflicts, pre-ruled: `plans/traceability.md` (keep both sides' rows) and the ABC-101 ticket page's end hunk (keep BOTH whole, in date order: the branch's 2026-10-12 material first, then main's 2026-10-13 amendment). 0 markers before `git commit --no-edit`. Any `src/` conflict or any other conflict: stop and report.
2. Write the `A11a`–`A11c` tests first; see `A11a`/`A11b` fail on the old table.
3. Swap the six pairs at `src/render.ts:77-82`; update the comment at `:74-75`.
4. Re-pin exactly the 8 named tests (`:316-323` literal, the six snapshot tests' Unicode entries, the oracle table `:411-422` — re-locate at your base). Delete, skip or loosen none.
5. Regenerate the snapshot LAST, for `src/render.test.ts` only (`npx vitest run src/render.test.ts -u`); check `A11d`: only the 12 Unicode bodies change, the 24 keys stay.
6. Commit `A11` ALONE (exactly three files: `src/render.ts`, `src/render.test.ts`, the `.snap`). Read `A9` with `git diff -U0 <parent> <A11 commit>`.
7. Full gate on the new tip: lint, typecheck, build, `npm test` (expect 0 failures), `.test-results/last-run.json` success true, skip-integrity `--skip-count 0` with `.grugops/test-skips.md`; `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts` only if the merge touched `src/cli.ts` (say). Render one frame per orientation from the real CLI under a pty and paste it into your notes (this is the A11g pre-view for the owner, not a substitute).
8. Records commit: notes, a dated § Delivery addendum on the ABC-101 page, one trace row at the END of `plans/traceability.md`.

## Fences
Never merge to main or push. Do not touch `plans/board.md`, `AGENTS.md` (24,576 B on the branch, at budget), `src/glyph-mode.ts`, `src/frame.ts`, the ASCII table, engine modules, `src/book*.ts`, `data/`, other tickets' pages. `node_modules` symlinked into the WORKTREE root only — never `ln -s` in the main checkout. No `update-ref`, `--force`, `-D`, `--amend`, `reset --hard`, rebase. `diff` is a git wrapper; use `/usr/bin/diff` or `cmp`. No timing readings. End each commit with a `Co-Authored-By:` trailer naming the model you actually are. Queue: `mkdir .grugops/queue/claimed/glyph-ABC-101` in the main checkout, then FLAT `.grugops/queue/done/glyph-ABC-101.md` and `.claim.md`, uncommitted; `rmdir` the claim dir. Report: branch tip, the A11 commit, gates (counts), A11a–f readings, the `-U0` reading, the two pty frames, files changed.
