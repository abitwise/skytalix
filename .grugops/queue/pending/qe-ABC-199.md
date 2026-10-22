---
subtask: qe-ABC-199
role: qe-e2e
ticket: plans/tickets/ABC-199-two-coverage-heavy-rows-time-out-at-vitests-5-s-default-under-load-lighten-them-and-keep-the-timeout.md
ref: .grugops/context/qe-ABC-199/
branch: grugops/ABC-199 (tip 8c0c5c81; code 3d6856db; base 08d42d01); worktree ../wt-ABC-199 (read only)
width: 3 (beside security-nfr-ABC-199 and arch-design-ABC-200, both records only)
---

# QE gate for ABC-199 (A7): re-read A1–A6 on your own runs

## Do
- Create your own worktree `../wt-qe-ABC-199` on `grugops/qe-ABC-199` from the tip. Merge the current `main` into it first (a merge, not a rebase) and report the sha. Install its own `node_modules` with `npm ci --ignore-scripts`. Never use main's `node_modules`.
- Re-read A1–A6 with your own runs **before** opening the SE's notes (`…c662ec3c`, `…925c7566`, `…71bb85ca`). That covers the node census at base and tip, K1–K4 planted on your own scratch copies at base and tip, the A5 diff scope and test-name equality, and the gates.
- The SE planted K1 one particular way: it keeps the best move and score of the cut-off search and leaves the reported depth alone. That plant is green at base. Plant it your own way and let your base reading decide.
- Gates at your merge: lint, typecheck, build; `npm test` plus `last-run.json` success; skip-count capture → `test-skip-integrity.js`; `ENGINE_DEEP`, `UCI_DEEP`. Heap 128 multi-file, 400 one-file. The UAT waiver form must print nothing.
- **No timing claims and no NFR-008 readings.** Each `A` row is a pass/fail reading, not a time.
- Verdict: PASS, PASS_WITH_GAPS or FAIL, with a gap register (`QE-199-x`).

## Fences
- Work only in `../wt-qe-ABC-199` and `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/qe199/`. Commit typed notes plus a `## QE` section on the ABC-199 page in your worktree. No edits to `src/` on the tip, `package*.json`, `AGENTS.md`, `plans/board.md`, `plans/traceability.md` or other pages. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `qe-ABC-199`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief in **main's** `.grugops/queue/`, then move it to `done/`.
