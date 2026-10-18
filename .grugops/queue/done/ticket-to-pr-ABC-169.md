---
subtask: ticket-to-pr-ABC-169
role: software-engineer
ticket: ABC-169
page: plans/tickets/ABC-169-declare-the-engine-private.md
branch: grugops/ABC-169
worktree: ../wt-ABC-169
base: a0c6db6c (brief) / branched from main 358810ac
tip: 4a0a075f
result: STOPPED — back to BA/PM. A1-A5 hold. A6 FAILS. One pre-existing test, ABC-042 A10 in src/cli.test.ts, pins the exact set of top-level package.json keys. Adding "license" (A1) breaks it, and the page forbids editing a test file (A5, A6, ADR-0036 clause (c)). Not ready for review. Nothing pushed or merged.
---

# ABC-169: implemented, but stopped on a scope conflict in the page

## Commits on `grugops/ABC-169` (parent `358810ac`)

- `b3fecb1b` feat(ABC-169): declare the engine private; credit Michniewski's tables
- `4a0a075f` docs(ABC-169): rewrap the credit so A2's five strings each sit on one line (comment only)

The credit uses ADR-0044 D13's private wording (ADR line 460), which matches the page's default word for word. It
has no "See NOTICE.". The rewrap in `4a0a075f` was needed because `"Simplified` / ` * Evaluation Function"` broke
across a comment line, so a literal read of the block found that string 0 times.

## The blocker

`src/cli.test.ts:1759`, *"ABC-042 A10 — package.json gains exactly one scripts key and nothing else"*. Its
`AT_HEAD` array (`:1766-1775`) lists name, version, private, type, description, engines, scripts and devDependencies,
and `:1788` asserts `Object.keys(packaged).sort()` equals that list. At the tip it gets 9 keys where it expects 8.
The page's DoR and Test notes ("No new test", "No test file is added or edited") did not see this pin.

The smallest fix is one line in a test file: add `"license"` to `AT_HEAD`. That fix would breach A5 (the file list
would grow to three), A6 ("No test file is added or edited"), and the page's claim that ADR-0036 (c) does not fire.
So this hop does not make it. BA/PM has to re-scope ABC-169 to allow that one-line pin amendment, or rule otherwise.

Sibling note: ABC-168 (`bin`, `build`) hits the same test. `bin` is in its reserved list (`:1789`), and `build` is
pinned in `SCRIPTS_AT_HEAD`. Its page does not mention this pin either.

## Acceptance

| AC | result | evidence at `4a0a075f` |
|---|---|---|
| A1 | **HOLDS** | `npm pkg get private license` prints `{ "private": true, "license": "UNLICENSED" }`. `git diff a0c6db6c 4a0a075f -- package.json` adds exactly `+  "license": "UNLICENSED",` and removes nothing. `package-lock.json` diff is 0 bytes |
| A2 | **HOLDS** | The first block is lines 1-21: it opens `/**` at line 1 and closes ` */` at line 21, and `import {` follows at line 23. Each string appears once in the block: `Michniewski`, `Simplified Evaluation Function`, `https://www.chessprogramming.org/Simplified_Evaluation_Function`, `CC BY-SA 3.0`, `The values are unchanged.` |
| A3 | **HOLDS, both checks** | (i) `git diff -U0 a0c6db6c 4a0a075f -- src/evaluate.ts` is one hunk `@@ -14,0 +15,6 @@`. That is 6 added lines and 0 removed, all inside the header block (lines 15-20, before the ` */` at 21). The filter for `+`/`-` lines not starting with ` *` after optional whitespace prints nothing. (ii) `ts.transpileModule(src, { compilerOptions: { removeComments: true } }).outputText` with TypeScript 5.9.3 gives base 9014 bytes, sha256 `629c825d9165a07154d336694e8b4f5b9c07d2c6110ac2029edd36e4172c7705`, and tip 9014 bytes with the same sha256. `===` is `true` |
| A4 | **HOLDS** | `git ls-files 'LICENSE*' 'NOTICE*' 'COPYING*'` prints nothing (0 lines) |
| A5 | **HOLDS** against the branch base | `git diff --name-only 358810ac 4a0a075f` gives `package.json` and `src/evaluate.ts`. Against `a0c6db6c` the list also has three Orchestrator files from `358810ac` (`.grugops/queue/pending/ticket-to-pr-ABC-169.md`, `…-ABC-170.md`, `plans/board.md`). `a0c6db6c..358810ac` touches no `src`, `package.json`, `package-lock.json` or `tools`. `git diff a0c6db6c 4a0a075f -- tools package-lock.json` is 0 bytes |
| A6 | **FAILS** | lint, typecheck and build are green. The unit gate is red: 1829 of 1830 pass, 1 fails (the pin above). The test count is the same as the base: base 1830/1830 passed in 58 files, tip 1830 total in 58 files. No test file was added or edited |

## Gate output (tip `4a0a075f`, run in `../wt-ABC-169` after `npm ci`, which exited 0)

- `npm run -s lint`: `Checked 113 files in 189ms. No fixes applied.`, exit 0
- `npm run -s typecheck`: exit 0
- `npm run -s build`: exit 0
- `npm test`: exit 1. `Test Files 1 failed | 57 passed (58)`, `Tests 1 failed | 1829 passed (1830)`. The failure is `src/cli.test.ts > ABC-042 — the shape of what was delivered > A10 — package.json gains exactly one scripts key and nothing else` (`AssertionError: expected [ 'description', …(8) ] to deeply equal [ 'description', …(7) ]`)
- `.test-results/last-run.json`: `{"success":false,"numTotalTests":1830,"numPassedTests":1829,"numFailedTests":1,"numPendingTests":0,"numTodoTests":0}`, so **not success**
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`, exit 0
- `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts`: `Tests 10 passed (10)`, exit 0
- `PERFT_DEEP=1 npx vitest run src/perft.test.ts`: `Tests 32 passed (32)`, exit 0
- Base reference, `npm test` at `358810ac` in the same worktree before any edit: `Test Files 58 passed (58)`, `Tests 1830 passed (1830)`, success true

No timing readings were taken (brief). ABC-169 has no timing criterion.

## Zero-production-lines measurement

- `git diff --name-only a0c6db6c...4a0a075f | grep -v '\.test\.ts$' | grep '^src/'` gives `src/evaluate.ts`, so the
  file-level grep is not empty.
- The comment-only check (A3) holds on both checks (above). Under the owner's Q4 word (`…5c8e2a17`), the src change
  counts as zero production lines. The UAT waiver would therefore apply ("WAIVED (waived is not accepted)"), but only
  once A6 is resolved.

## Security trigger

ABC-041 clause (a) fires on the `package.json` touch. No `dependencies` key or other key besides `license` was
added, so there is no finding. This is not a Security/NFR verdict; that hop is still owed.

## Notes not published

There is no `scripts/context-io.ts` on this install, and no `propose_note` tool reached this agent. WF16 forbids
hand-writing `.grugops/context/`, so these note payloads are recorded here for the Orchestrator or a writer-equipped
hop to admit:

- `artifact-ref`: branch `grugops/ABC-169` @ `4a0a075f`; files `package.json` (+1), `src/evaluate.ts` (+6 comment lines); refs ABC-169, EPIC-007, ADR-0044 D13.
- `decision`: the credit wording is ADR-0044 D13 (private), which is identical to the page default; it is rewrapped so the five A2 strings each sit on one line.
- `observation`: A3 holds on both checks (sha256 above); the A3 file-level grep names `src/evaluate.ts`.
- `observation` (blocker): ABC-042 A10's `AT_HEAD` pin in `src/cli.test.ts` conflicts with A1 against A5/A6; ABC-168 meets the same pin. Confidence: high (gate output).

## Trace row (for the Orchestrator to append; `plans/traceability.md` not touched)

| ABC-169 | EPIC-007 / ADR-0044 D13 | branch `grugops/ABC-169` @ `4a0a075f` | `package.json` (+`"license": "UNLICENSED"`), `src/evaluate.ts` (+6 header comment lines, transpile-identical) | no test added; unit 1829/1830, ABC-042 A10 pin red | STOPPED, back to BA/PM (A6 conflict); UAT WAIVED-by-A3 pending A6 |

## Fences

`plans/board.md`, `plans/traceability.md`, `tools/`, `package-lock.json` and `wt-ABC-146` are untouched. No
process this agent did not start was touched. Nothing pushed, merged or force-pushed. Board move: none. The ticket
stays In Development and is not moved to In Review, because a gate is red.
