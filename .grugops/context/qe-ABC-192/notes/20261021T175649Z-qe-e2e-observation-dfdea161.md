---
id: 20261021T175649Z-qe-e2e-observation-dfdea161
kind: observation
by: qe-e2e
at: 2026-10-21T17:56:49Z
verified_by: 
confidence: high (own runs at bfccd564 and on a scratch copy outside the repository; restored, cmp-checked)
refs:
  - ABC-192
  - grugops/ABC-192
  - grugops/qe-ABC-192
  - b5b8b0f9
  - 5d1fbaa7
  - 47a3c9a1
  - bfccd564
  - plans/tickets/ABC-192-nothing-pins-the-stream-setup-hands-the-guard-and-a-vitest-bump-re-runs-no-capture-arm.md
  - A1
  - A2
  - A3
  - A4
  - QE-176-a
  - QE-176-b
  - N8_SPAWN
  - ABC-173
  - AGENTS.md
  - src/cli.test.ts
supersedes: 
seal: sha256:7f115e970d35a0a7dea0f30fa54504d4f0baddbed1da356daef651c254407dd2
---

# ABC-192 QE criteria A1–A4 at merge `bfccd564` (tip `b5b8b0f9` + main `ec5c42d7`): all four MET by own runs, taken before the SE's notes were opened

All runs at `grugops/qe-ABC-192` `bfccd564` in `../wt-qe-ABC-192` (node_modules symlinked to the main checkout, the house worktree layout), or in a scratch copy OUTSIDE the repository (`git archive bfccd564` + a FULL real copy of `node_modules`, private `TMPDIR`). One-file runs at `--max-old-space-size=400`, whole-suite at 128 (`npm test`). No timing taken.

- **A1 MET (QE-176-a).** `npx vitest run src/cli.test.ts -t "ABC-192"`: exit 0, 2 passed / 93 skipped. The row finds one `export default function setup`, one `guard(…)` call in it, and requires exactly 3 arguments with the third a `process.stdout` property access. M4 (`process.stderr`) and M4b (`{ write() {} }`) each turn exactly the A1 row red, one-file (exit 1, 1 failed) AND under `npm test` (exit 1, 1993/1994, `last-run.json` success false, the only FAIL is `ABC-192 > A1`). The fault message names the arguments, e.g. `guard(…)'s arguments are [project, v8.getHeapStatistics(), process.stderr], not (…, …, process.stdout)`. Non-vacuity: the in-memory plants (real → no fault; `process.stderr`, `{ write() {} }`, comment-only, two calls → fault) are asserted as `[false, true, true, true, true]`. Three test-side weakenings each red that assertion: fault-function always `undefined` → `[false,false,false,true,true]`; the `stdout` name check dropped → `[false,false,true,true,true]`; `calls.length !== 1` loosened to `< 1` → `[false,true,true,true,false]`.
- **A2 MET (QE-176-b).** Installed `vitest` 4.1.11 → row passes. Scratch `node_modules/vitest/package.json` set to 4.1.12 → one-file exit 1 and `npm test` exit 1 (1993/1994, success false), the only FAIL is `ABC-192 > A2`. 4.2.0, 5.0.0, 4.1.11-beta.1 and 4.1.10 each red the row too. The failure message, compared by content against the page's list, carries all four items as one list in order: (1) the ABC-176 capture arm, prefix removed, SUITE and ONE-FILE, line 1 `heap-guard: refused.` then JSON, no integer, pipe non-zero, gate `Skip count was not provided` exit 1, green arm one integer; (2) the reporter header's seven rows (ABC-149's six + `refused`); (3) re-read RISK-ABC173-STATE (getPaths, catchError) and RISK-ABC143-01; (4) re-pin with reason and readings, never silently. The constant is one literal (`CAPTURE_ARM_READ_ON_VITEST = "4.1.11"`) with a comment above it saying when to change it. A missing or empty `version` reds the row on the `toMatch` guard (TypeError / `expected '' to match`), not with the list: a broken install, not a bump.
- **A3 MET.** The whole of `src/cli.test.ts` at 400: 95/95 passed, including `N8-LANE — this file spawns TWENTY-EIGHT children and no more` and `ABC-173 > C2`. The diff removes 0 lines; `N8_SPAWN = 17 + 7 + 1 + 2 + 1` is untouched. The added lines contain no `spawn`/`exec`/`fork`/`childOf`/`Worker`/`performance`/`Date.now`/`hrtime`/`setTimeout`: the new rows spawn nothing and take no timing.
- **A4 MET.** `git diff --name-only main...b5b8b0f9` and `main...HEAD` (at the QE merge) both list `src/cli.test.ts` plus the SE's three notes under `.grugops/context/ticket-to-pr-ABC-192/notes/` and nothing else. The waiver form prints nothing (see the gates note). lint / typecheck / build 0; `npm test` 0, 59 files, 1994 = 1992 + 2 passed, 0 failed; `last-run.json` success true; skip count 0 → `No findings.`. `AGENTS.md` byte-identical base `47a3c9a1` → tip `b5b8b0f9` (15,797 B both). At the QE merge it is 15,821 B: that is main's Scribe change (`4f81850c`, scribe-waiver-quotepath), not this ticket; it equals main's file.

The SE's notes (`…decision-8fd17c58`, `…observation-b5cf0eb3`, `…observation-d7675de0`), opened after the runs above, agree on every number.
