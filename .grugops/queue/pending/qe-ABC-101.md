---
task: wave-2026-09-25
subtask: qe-ABC-101
role: qe-e2e
ticket: plans/tickets/ABC-101-difficulty-selection.md
ref: .grugops/context/qe-ABC-101/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/qe-ABC-101 (off ABC-101 tip 98ea0a84; code ac8deab1; merge of main e88a7832; base main 3ea3e352)
---

# Subtask: QE gate for ABC-101 (`--difficulty`). You are the ONLY hop running (width 1).

Own branch off the delivered tip: `git worktree add ../wt-qe-ABC-101 -b grugops/qe-ABC-101 98ea0a84`. The SE's branch (`grugops/ABC-101-difficulty-selection`, worktree `../wt-ticket-to-pr-ABC-101`) is read-only to you. Delivered pair for every diff reading: `3ea3e352..98ea0a84` (code `ac8deab1`). Read the page whole — § Acceptance (A4 struck, A8′, A10), § Amendment — 2026-10-12 (BA/PM, decision `…f4a8b6ee` on main), the SE's notes under `.grugops/context/ticket-to-pr-ABC-101/` and `.grugops/context/resume2-ABC-101/`, and the Scribe's `…3c7e1a90`.

1. **Each criterion re-read independently** (A1–A3 with the extension, A5, A6, A7 both halves per BA/PM ruling 3, A8′, A9 widened with its `-U0` reading of `src/engine.test.ts`, A10) and `ABC-086` `A5`(i′) all four assertions plus (ii)/(iii). Run `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts` (expect 10/10), with 0 `abc095-book-absent-*` copies before and after.
2. **Plants of your own**, each in a scratch copy outside the repo, removed by exact path (count before/after), at least: the seam ignores the level; `in` instead of `Object.hasOwn`; a `Number()` range check; the root passes a fixed level; `now` passed in the root's construction; `LEVELS[DEFAULT_LEVEL]` changed in a copy of `src/levels.ts` (the SE could not try (i′) check 3 — you may, in a copy); the book moved inside the level seam (book must stay outside, owner Q5); a seed that is constant. Report which row catches each, or "nothing".
3. **The 10 children doubled at `./book-engine.ts`** (ABC-095's re-targeting): confirm they still reach their doubles now the inner seam is a level; `src/cli.test.ts` run ≥ 10 times, the `mate` rows green every time.
4. **BA/PM's LOW** (ruling 6): `ABC-065` `A3`'s value check is near-vacuous for one-digit values (any digit in the slot satisfies it). Plant it (e.g. document `--difficulty 1|2|3|4` or `1|2|3|4|9` in a copy of `AGENTS.md`) and report whether anything reds. Grade it; do not fix it.
5. **N8-LANE** (≤ 650 ms CPU, ADR-0035 narrow-set protocol as amended A1–A3, B1–B4; the instrument and graders of `qe-n8-ABC-095` on main under `.grugops/context/qe-n8-ABC-095/probe/`): sets for the changed test files — `src/cli.test.ts`, `src/cli.real-engine.test.ts` default lane, `src/engine.test.ts` — base `3ea3e352`, head `ac8deab1` (or the tip; say which and why). **B1:** commit the pre-registration on your branch before the first run. Void clauses carried unchanged (any foreign vitest, any `oeselg-labs/platform` process); power source logged, not a void clause. Wait budget 45 min from your first gate sample; otherwise NOT READ with the void log — never pool or estimate.
6. **UAT waiver reading:** `git diff --name-only 3ea3e352...98ea0a84 | grep -v '\.test\.ts$' | grep '^src/'` (non-empty expected; the owner's UAT word is owed).
7. Write your verdict as a qe-e2e `decision` note whose refs name ABC-101; run `node tools/grugops/qe-hop-integrity.js --ticket ABC-101` and report its exit.

## Fences
Edit only your notes and probe under `ref:`, the ticket page's § QE (append-only, dated), and one trace row at the END of `plans/traceability.md`. Do not touch `src/`, `tools/`, tests, `AGENTS.md` (it is at exactly 24,576 B, the budget), `plans/board.md`, ADRs. `node_modules` symlinked into the WORKTREE root only — never `ln -s` in the main checkout. Never kill or touch other sessions' processes. No `update-ref`, `--force`, `-D`, `--amend`, `reset --hard`, rebase. Never merge or push. Gates on your tip before the last commit: `npm run -s lint && npm run -s typecheck && npm run -s build && npm test`, `.test-results/last-run.json` success true, `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`. End commits with a `Co-Authored-By:` trailer naming the model you are. Queue: `mkdir .grugops/queue/claimed/qe-ABC-101` in the main checkout, then FLAT `.grugops/queue/done/qe-ABC-101.md` and `.claim.md`, uncommitted; `rmdir` the claim dir.

Report: QE tip; verdict (PASS / PASS_WITH_GAPS / FAIL); each criterion with its reading; plants table; children reading; N8-LANE per set with window log; UAT-waiver reading; gaps with severity and owner.
