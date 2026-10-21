---
subtask: qe-ABC-191
role: qe-e2e
ticket: plans/tickets/ABC-191-a-production-file-git-treats-as-binary-hides-every-changed-line-from-clause-b.md
ref: .grugops/context/qe-ABC-191/
branch: grugops/ABC-191 (tip 797a238b; harness 56d7215f, code 11245e3d, ADR+out 6b79aa51; base 01836fff); worktree ../wt-ABC-191 (read only)
width: 2 (beside ticket-to-pr-ABC-176)
---

# QE gate for ABC-191 (clause (b) diff call reads `--text --no-textconv`; harness rows BIN-NUL, BIN-ATTR; ADR-0036 § S1 block). Your read of A2–A7 closes `AR-188-BINARY`

## Do
- **Merge the current `main` into your QE branch first** (a merge, not a rebase); run everything at that merge; report the merge sha.
- Verify every criterion A1–A9 against the page with your own runs, before opening the Architect's notes (`…0c4ec0c5`, `…7eb389c5` on the branch).
- **Re-plant independently:** run `r2-mutants.sh` yourself against (i) the head instrument (12 of 12 as expected), (ii) base's instrument (fails on exactly `BIN-NUL` and `BIN-ATTR`), (iii) each one-flag copy (the page's A3: each falls short). Build your own binary-marking plants beyond the harness rows (e.g. a NUL elsewhere in a limb-1 holder, a `.gitattributes` `binary` macro, a textconv driver, and — in a scratch clone only — `.git/info/attributes` `-diff`); limb 1 must fire on each.
- Limbs 2/3 on the 10 existing rows byte-identical to `341da4c1` on the same plant; on the two new rows, equal to `341da4c1` on X1 with plant ids masked, as the page says.
- One diff call, still `execFileSync` with an argv array and no shell.
- **`ADR-0036` § S1 block:** dated, consistent with the code, after the ABC-188 block, 0 lines edited; retires the `--numstat` stand-in only as far as the instrument now covers it.
- **Gates** on the code tip: lint, typecheck, build; `npm test` + `last-run.json` success (59 / 1987); skip-integrity `--skip-count 0`. No timing. UAT waiver in AGENTS.md's form; `git diff --numstat <base> <tip> -- src | awk '$1=="-"'` prints nothing.
- **Verdict:** PASS / PASS_WITH_GAPS / FAIL with a gap register; say plainly whether `AR-188-BINARY`'s close condition is met.

## Fences
- Work in your own worktree `../wt-qe-ABC-191` on a branch from the tip. Plants only in scratch clones (own `.git`) under a private `TMPDIR`; **never edit `.git/info/attributes` or git config of this repository or any worktree**.
- Commit typed notes, written inside your worktree, and a `## QE` section on the ABC-191 page there.
- No edits to the instrument, harness, ADR, `src/`, `AGENTS.md`, `plans/board.md`, `plans/traceability.md` or other ticket pages. Do not touch `../wt-ABC-176` or `grugops/ABC-176`.
- Never push, `--force` (including `git worktree remove --force`), `--amend` or rebase; never merge into `main`.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `qe-ABC-191`). **Pass your worktree as the context root explicitly.** Take every `at` from `date -u` (UTC). `artifact-ref` needs a §14 gate run, so record artifacts as `observation`.
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |` — exactly 10 cells. Put it in your done record (`.grugops/queue/done/qe-ABC-191.md` + `.claim.md`, main's tree, uncommitted); the Orchestrator appends it.
