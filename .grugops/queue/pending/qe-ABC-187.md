---
subtask: qe-ABC-187
role: qe-e2e
ticket: plans/tickets/ABC-187-the-agents-md-byte-guard-still-allows-24576-b-so-abc-164s-cut-can-grow-back-unflagged.md
ref: .grugops/context/qe-ABC-187/
branch: grugops/ABC-187 (tip 9578481f; SE code 494f7862; Scribe code 65ee533d; base 94c4b510); worktree ../wt-ABC-187 (read only)
width: 2 (beside qe-ABC-185)
---

# QE gate for ABC-187 (byte guard 24,576 → 18,432; folded-in `AGENTS.md:7`)

## Do
- Verify `A1`–`A6` against the page, with your own runs, before opening the SE's and Scribe's notes. `A6` is read with its "only if folded in" clause: `AGENTS.md` is listed with exactly one changed line (`:7`, `24,576` → `18,432`), `wc -c` unchanged (15,606).
- **The guard has teeth:** in a scratch copy outside the repo (private `TMPDIR`), an `AGENTS.md` of 18,433 B passes the base guard and fails the head guard; 18,432 B passes head; the real file passes head.
- **`A4`:** the page's command (`git diff --name-only main...HEAD -- src/ ':!src/**/*.test.ts' ':!src/__snapshots__'`) prints `src/cli.test.ts` — the SE calls this a pathspec bug in the page (`**` without `:(glob)` magic does not match a top-level file). Confirm or refute, and measure the waiver in AGENTS.md's form, which is the reference (BA/PM ruling on QE-159-f).
- **The two rewritten comments** (`:2242` closer count 8; the JSDoc above the constant): true at head? Count the closers yourself.
- **Gates** on the tip: lint, typecheck, build; `npm test` + `last-run.json` success (59 / 1987); skip-integrity `--skip-count 0`. One-file vitest runs use heap 400. No timing.
- **Verdict:** PASS / PASS_WITH_GAPS / FAIL with a gap register.

## Fences
- Work in your own worktree `../wt-qe-ABC-187` on a branch from the tip.
- Commit typed notes, written inside your worktree, and a `## QE` section on the ABC-187 page there.
- No edits to `src/`, `AGENTS.md`, `plans/board.md`, `plans/traceability.md` or other ticket pages.
- Never merge, push, `--force`, `--amend` or rebase.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `qe-ABC-187`). **Pass your worktree as the context root explicitly.** Take every `at` from `date -u`.
- Write `.grugops/queue/done/qe-ABC-187.md` (brief + `## Result`) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order**; do NOT append it yourself:
  `| ABC-187 (QE) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`
