---
subtask: ticket-to-pr-ABC-169-redo
role: software-engineer
ticket: ABC-169
page: plans/tickets/ABC-169-declare-the-engine-private.md (as amended on main b40a2f77)
branch: grugops/ABC-169
worktree: ../wt-ABC-169
base: 849d7f92 (merge base after merging main)
tip: 344a4128
result: GREEN. A1-A6 hold against the merge base. The pin is armed (A10 is the only red row without the "license" line). UAT WAIVED by A3 ("WAIVED (waived is not accepted)"). Ready for review. Nothing pushed or merged.
---

# ABC-169 redo: the one-line AT_HEAD edit

## Commits added on `grugops/ABC-169` (over `4a0a075f`)

- `2b91d401` merge(main): `git merge --no-ff main` at `849d7f92`. No conflicts, so there was nothing to keep from both sides.
  The merge brings only docs and queue files; `358810ac..849d7f92` touches nothing under `src`, `tools`, `package.json` or `package-lock.json`.
- `344a4128` test(ABC-169): one line, `"license",`, added after `"private",` in `AT_HEAD` (`src/cli.test.ts:1770`, array `:1766-1776`). Nothing else.

## Acceptance (base `849d7f92`, tip `344a4128`)

| AC | result | evidence |
|---|---|---|
| A1 | **HOLDS** | `npm pkg get private license` prints `{ "private": true, "license": "UNLICENSED" }`. `git diff 849d7f92 HEAD -- package.json` has exactly one `+` line, `+  "license": "UNLICENSED",`, and no `-` line. `package-lock.json` diff is 0 bytes |
| A2 | **HOLDS** | The block opens `/**` at line 1 and closes ` */` at line 21. `import {` is at line 23 and ends `} from "./position.ts";` at line 36. In lines 1-21, each of `Michniewski`, `Simplified Evaluation Function`, `https://www.chessprogramming.org/Simplified_Evaluation_Function`, `CC BY-SA 3.0` and `The values are unchanged.` appears once |
| A3 | **HOLDS, both checks** | (i) `git diff -U0 849d7f92 HEAD -- src/evaluate.ts` is one hunk `@@ -14,0 +15,6 @@`, inside the header (before ` */` at 21). The filter for `+`/`-` lines not starting with ` *` after optional whitespace prints nothing. (ii) `ts.transpileModule(..., { removeComments: true }).outputText`, TypeScript 5.9.3: base 9014 bytes, sha256 `629c825d9165a07154d336694e8b4f5b9c07d2c6110ac2029edd36e4172c7705`; tip 9014 bytes, same sha256; `===` is `true` |
| A4 | **HOLDS** | `git ls-files 'LICENSE*' 'NOTICE*' 'COPYING*'` prints 0 lines |
| A5 | **HOLDS** | `git diff --name-only 849d7f92 HEAD` is `package.json`, `src/cli.test.ts`, `src/evaluate.ts`. `--numstat -- src/cli.test.ts` is `1 0`. The added line is `+      "license",`, which trims to `"license",` and sits between `const AT_HEAD = [` (1766) and `];` (1776). `git diff 849d7f92 HEAD -- tools package-lock.json` is 0 bytes |
| A6 | **HOLDS** | lint, typecheck, build and unit are green, at 1830 tests, the same count as the base (see below). No test file added; the only test edit is A5's line. ABC-042 A10 passes. **Armed:** see below |

## Gate output (tip `344a4128`, in `../wt-ABC-169`, after `npm ci` exit 0)

- `npm run -s lint`: `Checked 113 files in 120ms. No fixes applied.`, exit 0
- `npm run -s typecheck`: exit 0
- `npm run -s build`: exit 0
- `npm test`, run 1: exit 0, `Test Files 58 passed (58)`, `Tests 1830 passed (1830)`. `.test-results/last-run.json`:
  `{"success":true,"numTotalTests":1830,"numPassedTests":1830,"numFailedTests":0,"numPendingTests":0,"numTodoTests":0}`
- `npm test`, run 2 (after the armed reading, so `last-run.json` reflects the tip): exit 0, same counts, same JSON with `success: true`.
  Neither run was cut short by the 60 s bound.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`, exit 0
- `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts`: `Tests 10 passed (10)`
- `PERFT_DEEP=1 npx vitest run src/perft.test.ts`: `Tests 32 passed (32)`
- Base count: not re-run at `849d7f92`. It was 1830/1830 at `358810ac` (first hop), and `358810ac..849d7f92` changes no file under
  `src`, `tools`, `package.json` or `package-lock.json`; `src/cli.test.ts` has the same blob (`b877dbca`) at both.

No timing readings were taken (brief).

## A6 armed reading ("still bites")

Working tree only: the line `  "license": "UNLICENSED",` was deleted from `package.json` (`git diff --numstat` showed `0 1 package.json`),
with `src/cli.test.ts` as at the tip. `npm test`: exit 1, `Test Files 1 failed | 57 passed (58)`, `Tests 1 failed | 1829 passed (1830)`.
`last-run.json`: `success:false`, 1830 total, 1829 passed, 1 failed. The only non-passed assertion in `last-run.json` is
`ABC-042 — the shape of what was delivered A10 — package.json gains exactly one scripts key and nothing else`
(`AssertionError: expected [ 'description', …(7) ] to deeply equal [ 'description', …(8) ]`).
Then `git checkout -- package.json`; `git status --short` was empty, and `npm pkg get private license` again printed both keys.
Nothing from this reading was committed.

## Zero-production-lines measurement (UAT waiver)

- `git diff --name-only 849d7f92...HEAD | grep -v '\.test\.ts$' | grep '^src/'` gives `src/evaluate.ts` only (`src/cli.test.ts` is filtered out).
- A3 holds on both checks, so under the owner's Q4 word (`…5c8e2a17`) the src change counts as zero production lines.
  **UAT: WAIVED (waived is not accepted).**

## Security trigger

ABC-041 clause (a) fires on the `package.json` touch; no `dependencies` or other key besides `license` was added. ADR-0036 (c): the test
edit is one string element in an array literal and adds no import, call or capability. This is not a Security/NFR verdict; that hop is still owed.

## Notes not published

There is still no `scripts/context-io.ts` in this repo and no `propose_note` tool reached this agent. WF16 forbids hand-writing
`.grugops/context/`, so these payloads are listed here for a writer-equipped hop to admit:

- `artifact-ref`: branch `grugops/ABC-169` @ `344a4128` (merge `2b91d401` of main `849d7f92`); files `package.json` (+1), `src/evaluate.ts` (+6 comment lines), `src/cli.test.ts` (+1 pin element). refs ABC-169, EPIC-007, ADR-0044 D13, ABC-042 A10.
- `decision`: `"license",` placed after `"private",` in `AT_HEAD`, as the page suggests. The assertion sorts both sides, so the position does not matter.
- `observation`: A1-A6 hold at the tip; unit 1830/1830, success true, on two runs; the pin is armed (A10 the only red row without the key).
- `observation`: ABC-168 adds `"bin"` to the same `AT_HEAD` array; whichever merges later rebases and keeps both elements (page Dependencies).

## Trace row (for the Orchestrator to append; `plans/traceability.md` not touched)

| ABC-169 | EPIC-007 / ADR-0044 D13 | branch `grugops/ABC-169` @ `344a4128` | `package.json` (+`"license": "UNLICENSED"`), `src/evaluate.ts` (+6 header comment lines, transpile-identical), `src/cli.test.ts` (+`"license",` in ABC-042 A10 `AT_HEAD`) | no test added; unit 1830/1830; pin armed | ready for review; UAT WAIVED by A3 |

## Fences

`plans/board.md`, `plans/traceability.md`, `tools/`, `package-lock.json`, `wt-ABC-146` and `wt-ABC-170` are untouched. No process this agent
did not start was touched. Nothing pushed, merged or force-pushed. Board move: none made here. In Development → In Review is the SE's
move per the role, but the board is the Orchestrator's file in this repo's flow, so it is recommended, not made.
