---
task: wave-2026-09-25
subtask: qe2-ABC-101
role: qe-e2e
ticket: plans/tickets/ABC-101-difficulty-selection.md
ref: .grugops/context/qe2-ABC-101/
enqueued_by: orchestrator
enqueued_at: 2026-10-13T00:00:00Z
branch: grugops/qe2-ABC-101 (off ABC-101 tip 36378ccf; A11 commit d22a709f; merge of main 081c3715)
---

# Subtask: QE re-check of ABC-101 after `A11` (piece polarity). You are the ONLY hop running (width 1).

Your earlier verdict `qe-ABC-101` (PASS_WITH_GAPS on `98ea0a84`, note `…2fa04d14` on branch `grugops/qe-ABC-101`, tip `dee6562a`) stands for the difficulty work; this hop re-reads what changed since. Own worktree: `git worktree add ../wt-qe2-ABC-101 -b grugops/qe2-ABC-101 36378ccf`. The SE's branch is read-only to you. Contract: Frontend/UI `…1c687529`; criteria ABC-101 `A11a`–`A11g` and widened `A9` (main); the SE's notes under `.grugops/context/glyph-ABC-101/`.

1. **A11a–f, independently.** Check the `A11` commit `d22a709f` holds exactly three files; the `-U0` read of `081c3715..d22a709f`; exactly 8 re-pins (none deleted, skipped or loosened — compare each re-pinned assertion's strength before/after); `A11d` by parsing the `.snap` yourself (24 keys, only the 12 `unicode` bodies change, `ascii` bodies byte-identical); `A11e` tests unedited and green.
2. **Plants of your own** (scratch copies outside the repo, removed by exact path, counted before/after): swap only one pair back; swap the ASCII case too; a 2-unit glyph (e.g. a variation selector) in one cell; an escape byte on a piece; orientation flipped without the glyph swap. Report which row catches each, or "nothing".
3. **The merge `081c3715`** brought 0 `src/` lines (verify `git diff --stat 98ea0a84 081c3715 -- src` is empty); since `src/cli.ts` is unchanged since `98ea0a84`, `CLI_DEEP` need not be re-run — run it once anyway (expect 10/10, 0 `abc095-book-absent-*` before/after).
4. **N8-LANE:** the A11 commit adds ~3 tests to `src/render.test.ts`. Read one narrow set for `src/render.test.ts` (base `081c3715`, head `d22a709f`) under the same protocol as `qe-ABC-101` (pre-register on your branch BEFORE the first run; void clauses unchanged; power logged; wait budget 30 min, else NOT READ — never estimate).
5. **Full gate on your tip** (lint, typecheck, build, `npm test` 58 files / 1792, `last-run.json` success true, skip-integrity `--skip-count 0` with `.grugops/test-skips.md`).
6. **UAT waiver reading** on `3ea3e352...36378ccf` (non-empty expected). Verdict as a qe-e2e `decision` note with refs ABC-101; run `node tools/grugops/qe-hop-integrity.js --ticket ABC-101`.

## Fences
Edit only your notes and probe under `ref:`, the ticket page's § QE (append-only, dated), one trace row at the END of `plans/traceability.md`. Do not touch `src/`, `tools/`, tests, `AGENTS.md`, `plans/board.md`, ADRs. `node_modules` symlinked into the WORKTREE root only. Never kill or touch other sessions' processes. No `update-ref`, `--force`, `-D`, `--amend`, `reset --hard`, rebase. Never merge or push. End commits with a `Co-Authored-By:` trailer naming the model you are. Queue: `mkdir .grugops/queue/claimed/qe2-ABC-101` in the main checkout, then FLAT `.grugops/queue/done/qe2-ABC-101.md` and `.claim.md`, uncommitted; `rmdir` the claim dir. Report: QE tip; verdict; A11a–f readings; plants table; CLI_DEEP; N8-LANE with window log; gates; UAT-waiver reading; gaps with severity and owner.
