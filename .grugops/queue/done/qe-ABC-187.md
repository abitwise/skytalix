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

## Result

**PASS_WITH_GAPS** (QE-187-a LOW; QE-187-b, QE-187-c INFO; 0 blocking). Branch `grugops/qe-ABC-187` @ **`fe59772b`**
(worktree `../wt-qe-ABC-187`, from the tip `9578481f`).

- **Merge of `main`:** `8918b07a` merged at **`4890782a`**, with no conflict. `main` was still `8918b07a` at finish.
  Since `94c4b510`, `main` changed only `package.json` and `package-lock.json` (ABC-172, name only). `src/` and `AGENTS.md` are byte-equal to base.
- **Commit `fe59772b`:** 6 sealed notes and a `## QE` section on the ABC-187 page. No edits to `src/`, `AGENTS.md`, the board, the trace or other pages.
- **Notes** (sealed with `admitAndAppend`, task `qe-ABC-187`, worktree context root, `at` 2026-10-21T14:38:52Z from `date -u`):
  - observations: `…8efdc0d3` (A1/A4/A5/A6), `…b595ae1a` (A2 boundary), `…4d16fb97` (gates), `…b96bb622` (A4 pathspec and waiver), `…58dcc9ee` (ABC-168 regression risk);
  - decision: `…5689584d` (verdict and gap register).
  - No finding: there was no §14-gate run.

**Criteria** (QE's own runs at `4890782a`, before reading the SE's and Scribe's notes; their notes agree on every one):
- **A1 MET:** grep `2` → `0`; constant `0` → `1`; the `:2483` JSDoc names `ABC-187` and `…cba9c8eb`.
- **A2 MET:**
  - base @ 18,433 B: 1 passed.
  - head @ 18,433 B: 1 failed, with the exact page message.
  - head @ 18,432 B and with the real file: 1 passed.
  - Extra: a multibyte pad (18,433 B / 16,923 chars) reds, so the guard counts bytes.
- **A3 MET:** `npm test` 59 / 1987, `last-run.json` success true; skip-count 0 "No findings."; `wc -c AGENTS.md` 15,606.
- **A4:** the page's command prints `src/cli.test.ts`. The SE's pathspec claim is confirmed: `**/` without `:(glob)` needs a subdirectory.
  AGENTS.md's reference form prints nothing, so 0 production lines and the **UAT waiver applies**. A waiver is not a signature.
- **A5 MET:** the script prints 8, and an independent line count gives 8. The comment says 8.
- **A6 MET (folded-in clause):** only `src/cli.test.ts` (3/3 at `:2242`, `:2483`–`:2484`) and `AGENTS.md` (1/1 at `:7`) are listed. `wc -c` is unchanged at 15,606.
- **Gates:** lint, typecheck and build exit 0. No timing.

**Gaps**
- **QE-187-a LOW:** `grugops/ABC-168` (unmerged, `AGENTS.md` 16,090 B) has 9 closers after the slot. Its merge with this branch is clean, so `:2242`'s "8" goes stale with nothing red.
  Route: Orchestrator. Whichever of ABC-187 / ABC-168 merges second re-runs A5's script and fixes or drops the number.
- **QE-187-b INFO:** A4's pathspec on the page is defective as written. Route: BA/PM erratum. Use AGENTS.md's form (QE-159-f).
- **QE-187-c INFO:** the JSDoc's "cannot regrow unflagged" is true of the whole 8,970 B cut. Up to 2,826 B of regrowth is unflagged by design. No action.

**Trace row (for the Orchestrator to append; 10 cells):**
`| ABC-187 (QE) | QE gate on the 18,432 B guard: A1–A6 by own runs at merge of main; guard reds at 18,433 B on head, passes on base (scratch exports); A4 measured in AGENTS.md's form | — | — | QE-187-a (LOW), QE-187-b, QE-187-c (INFO) | grugops/qe-ABC-187 @ fe59772b (from 9578481f; merge of main 8918b07a = 4890782a)<br>ABC-187 page (## QE); .grugops/context/qe-ABC-187/ | A1 0/1; A2 base pass, head fail @18,433, pass @18,432; A5 8; lint, typecheck, build exit 0; npm test 59 files / 1987, last-run success; skip-count 0 "No findings." | waiver (0 production lines) | — | PASS_WITH_GAPS; In Review → next gate (Orchestrator's move) |`
