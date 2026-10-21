---
subtask: qe-ABC-183
role: qe-e2e
ticket: plans/tickets/ABC-183-a7-pins-that-the-decoy-is-written-before-the-booked-spawn.md
ref: .grugops/context/qe-ABC-183/
branch: grugops/ABC-183 (tip c4c6d36e; code 7bd2b54f; base 19abbdb1); SE worktree ../wt-ABC-183 (read only)
width: 3 (beside qe-ABC-181 and ticket-to-pr-ABC-182)
---

# QE gate for ABC-183 (test-only; the AR-180-VALIDATED close row)

## Do
- Verify A1–A5 against the page. **A4 is yours to re-plant independently** — it is the close condition for `AR-180-VALIDATED` part (ii):
  - Build TMO (test-file plant: the decoy's `mkdirSync` + `writeFileSync` move to directly after the `booked = spawnReal(` line; on the head test the capture line stays put) and P6f (`src/book-file.ts`, body as in your own `ABC-162` note `…567002e7`) yourself, in scratch copies outside the repo, private `TMPDIR` per run.
  - Run all four rows (none, P6f, TMO + P6f, TMO) against the base test and the head test under `CLI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400`. The close row is TMO + P6f: base 11/11 green, head 10/11 red `A7` at the new assertion, `AR-162-FALLBACK` in the failure output.
  - The SE's P6f has the same body as yours but different bytes (sha `afeab577…` vs `e4947664…`); record the sha of the plant you use. Byte identity with the SE is not required; the body is.
- **A2/A3:** read the new `expect` (`.toBe(true)`, message naming `AR-162-FALLBACK`) and the order comment above the decoy write yourself.
- **A5 fences:** exact file list; every `grep -c` count the page names, base and head; no line added or removed above `:440`; `CLI_DEEP` 11 tests, 6 children.
- **Independence.** Do your own plants and readings before opening the SE's (`.grugops/context/ticket-to-pr-ABC-183/` on the branch).
- **Gates** on the code tip:
  - lint, typecheck, build;
  - `npm test` + `last-run.json` success (1987);
  - skip-integrity `--skip-count 0`;
  - `CLI_DEEP` and `PERFT_DEEP`.
- **Heap rule:** 400 for one-file runs, 128 for whole-suite or multi-file runs, one at a time. Take no timing.
- **UAT waiver:** measure it in AGENTS.md's form. Do not filter out `.snap`.
- **Verdict:** PASS / PASS_WITH_GAPS / FAIL with a gap register.

## Fences
- Work in your own worktree `../wt-qe-ABC-183` on a branch from the tip.
- Commit typed notes, written inside your worktree, and a `## QE` section on the ABC-183 page there.
- No production files, `plans/board.md`, `AGENTS.md`, or other ticket pages. Plants only in scratch copies.
- Never merge, push, `--force`, `--amend` or rebase.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `qe-ABC-183`).
- Write `.grugops/queue/done/qe-ABC-183.md` (brief + `## Result` + trace row as one `| ABC-183 | … |` line) and `.claim.md`, uncommitted on main.
