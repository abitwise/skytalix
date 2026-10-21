---
subtask: qe-ABC-176
role: qe-e2e
ticket: plans/tickets/ABC-176-a-refused-run-never-reads-as-a-clean-skip-count-or-a-quiet-result-file.md
ref: .grugops/context/qe-ABC-176/
branch: grugops/ABC-176 (tip 37b8debc; SE code ffd53f41, SE notes bfe1ff4a, Scribe AGENTS.md 522bffd1; base 01836fff); worktree ../wt-ABC-176 (read only)
width: 2 (beside qe-ABC-191)
---

# QE gate for ABC-176 (a heap-guard refusal is named on stdout and in `last-run.json`; two `AGENTS.md` comments). A1–A5

## Do
- **Merge the current `main` into your QE branch first** (a merge, not a rebase); run everything at that merge; report the merge sha.
- Verify every criterion A1–A5 against the page with your own runs, before opening the SE's and Scribe's notes on the branch.
- **Arms:** the refusal arm (prefix removed) and green arm (as spelled), for the SUITE and ONE-FILE shapes, and the exact old string (A2). Feed each stdout to the gate step as the page says.
- **A3/A4:** re-run all six `ABC-149` reporter rows plus the seventh `refused` row yourself, in a scratch copy **outside the repository** with a private `TMPDIR`; compare by content. Show the message is the thrown one, not a fixed string; show the "cannot look" throw is named.
- **The page's QE mutants** plus your own: a capture that exits 1 but prints `0`; a reporter writing a fixed refusal string; a reporter dropping the `run` arm; a guard writing its refusal only to stderr; a guard without the `catchError` hand-off. Also probe the SE's flagged ordering risk: is the guard's stdout line guaranteed to precede vitest's JSON report on the same stream (e.g. under the `run-bounded.js` wrapper and both shapes)? Say what you measured.
- **A5:** `AGENTS.md` ≤ 18,432 B (Scribe: 15,797); ABC-173 A3 still finds 17 commands; A4's refusal regex still matches; the skip-count command byte-identical to base; the `memory-bank/90-…` log row consistent.
- **Gates** on the tip: lint, typecheck, build; `npm test` + `last-run.json` success (59 / 1992); skip-integrity `--skip-count 0`. One-file runs heap 400, whole-suite 128. No timing. UAT waiver in AGENTS.md's form; `git diff --numstat <base> <tip> -- src | awk '$1=="-"'` prints nothing.
- **Verdict:** PASS / PASS_WITH_GAPS / FAIL with a gap register.

## Fences
- Work in your own worktree `../wt-qe-ABC-176` on a branch from the tip. Scratch copies only outside the repository.
- Commit typed notes, written inside your worktree, and a `## QE` section on the ABC-176 page there.
- No edits to `tools/`, `src/`, `AGENTS.md`, `memory-bank/`, `package.json`, `.grugops/test-skips.md`, `plans/board.md`, `plans/traceability.md` or other ticket pages. Do not touch `../wt-ABC-191`, `../wt-qe-ABC-191`.
- Never push, `--force` (including `git worktree remove --force`), `--amend` or rebase; never merge into `main`.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `qe-ABC-176`). **Pass your worktree as the context root explicitly.** Take every `at` from `date -u` (UTC). `artifact-ref` needs a §14 gate run, so record artifacts as `observation`. Notes are append-only: never delete one; a wrong note gets a superseding note.
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |` — exactly 10 cells. Put it in your done record (`.grugops/queue/done/qe-ABC-176.md` + `.claim.md`, main's tree, uncommitted); the Orchestrator appends it.
