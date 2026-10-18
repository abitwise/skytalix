---
subtask: qe-ABC-169
role: qe-e2e
ticket: ABC-169
page: plans/tickets/ABC-169-declare-the-engine-private.md (as amended, bapm-ABC-169-rescope)
done_at: 2026-10-18T12:50:00Z
branch: grugops/ABC-169 @ 344a4128 (base 849d7f92; read from scratch worktree ../wt-qe-ABC-169, now removed)
result: PASS_WITH_GAPS. A1-A6 hold at 344a4128, re-measured independently. A3 holds on both checks. The pin is armed. The credit matches ADR-0044 D13 word for word. The waiver grep names only src/evaluate.ts, so UAT is WAIVED by A3 ("WAIVED (waived is not accepted)"). Two LOW gaps and three INFO notes, none blocking. Nothing committed, pushed or merged.
---

# QE ABC-169: A1-A6, the comment-only claim, and the gaps

The SE hop record is `.grugops/queue/done/ticket-to-pr-ABC-169-redo.md`. Every reading below was taken again by this hop
in a scratch worktree of `344a4128`, after `npm ci` exited 0 (npm 11.20.0, node v26.11.1, TypeScript 5.9.3). No timing
readings were taken.

## Acceptance (base `849d7f92`, tip `344a4128`)

| AC | result | evidence (this hop) |
|---|---|---|
| A1 | **HOLDS** | `npm pkg get private license` printed `{ "private": true, "license": "UNLICENSED" }`, exit 0, with nothing on stderr. The `package.json` diff is one `+` line, `+  "license": "UNLICENSED",`, and no `-` line. The `package-lock.json` diff is empty |
| A2 | **HOLDS** | The block opens `/**` at line 1 and closes ` */` at line 21. `import {` is at line 23, and `} from "./position.ts";` is at line 36. In lines 1-21, each of `Michniewski`, `Simplified Evaluation Function`, `https://www.chessprogramming.org/Simplified_Evaluation_Function`, `CC BY-SA 3.0` and `The values are unchanged` appears exactly once |
| A3 | **HOLDS, both checks** | (i) `git diff -U0` has one hunk, `@@ -14,0 +15,6 @@`, which inserts before the base's closing ` */`. It has 0 `-` lines, and the filter for `+`/`-` lines that are not ` *` comment lines prints nothing. (ii) `ts.transpileModule(src, { compilerOptions: { removeComments: true } }).outputText` is 9014 bytes at base and at tip, both with sha256 `629c825d9165a07154d336694e8b4f5b9c07d2c6110ac2029edd36e4172c7705`, and `===` is `true`. Probe sanity: with comments kept, the two outputs differ (`true`). A planted `;` after the closing ` */` breaks identity (`identical? false`), so the probe does see a one-character escape |
| A4 | **HOLDS** | `git ls-files 'LICENSE*' 'NOTICE*' 'COPYING*'` printed 0 lines, and `ls` finds none in the tree |
| A5 | **HOLDS** | `--name-only`: `package.json`, `src/cli.test.ts`, `src/evaluate.ts`. `--numstat`: `1 0`, `1 0`, `6 0`. The `cli.test.ts` line is `+      "license",`, inside `const AT_HEAD = [` … `];` and after `"private",`. `git diff -- tools package-lock.json` is 0 bytes |
| A6 | **HOLDS** | lint, typecheck and build exit 0 (`Checked 113 files … No fixes applied.`). Unit at tip: 58 files and **1830/1830** on both runs. At base `849d7f92`, run by this hop: **1830/1830**, so the count is the same. No file added (`--diff-filter=A` is empty). ABC-042 A10 passes. **Armed:** see below |

### Unit runs (`npm test`, bounded at 60 s by `run-bounded.js`)

Neither run hit the 60 s bound, so no re-run was needed for that.

- Tip, run 1: exit 0, `Test Files 58 passed (58)`, `Tests 1830 passed (1830)`. `last-run.json`: `success:true`, total 1830, passed 1830, failed 0, pending 0, todo 0.
- Tip, run 2 (the last run, so `last-run.json` reflects the tip): exit 0, the same counts and the same JSON.
- Base `849d7f92`: exit 0, 58 files, 1830/1830, `success:true`, pending 0, todo 0.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`, exit 0.

### A6 armed reading (working tree only, restored)

With only `  "license": "UNLICENSED",` deleted (`numstat 0 1 package.json`) and the test file as at the tip, `npm test`
exited 1: `Test Files 1 failed | 57 passed (58)`, `Tests 1 failed | 1829 passed (1830)`. The only non-passed row in
`last-run.json` was `ABC-042 — the shape of what was delivered A10 — package.json gains exactly one scripts key and
nothing else`. Afterwards I ran `git checkout -- package.json`, the md5 matched the tip again, and `git status` was empty.

## Gap questions from the brief

1. **Does any test still assume `license` is absent? No.** `git grep -i 'licen[cs]e|UNLICENSED'` over tracked `*.ts`,
   `*.js` and `*.snap` finds no hit under `src/` or `tools/`. The hits it does find are old probes under
   `.grugops/context/` that are about `LICENSED_DRIVERS`, not the manifest. A10's reserved list (`bin`, `main`,
   `files`, `publishConfig`, `dependencies`) does not name `license`. The other `package.json` readers
   (`cli.test.ts:1115`, `:2389`, `line-input.test.ts:676`, `cli.real-engine.test.ts:84`) read `scripts` or
   `dependencies`, or copy the file byte for byte, and all pass. The full suite is green at the tip.
2. **Does npm warn? Not about this change.** npm's own normaliser (`@npmcli/package-json/lib/normalize-data.js`)
   reports `["No README data","No license field."]` for the base manifest and `["No README data"]` for the tip
   manifest. Its `license.js` accepts `UNLICENSED`. `npm pkg get` writes nothing to stderr, and `npm ls --depth=0`
   is clean. `npm pack --dry-run` prints only `gitignore-fallback` (no `.npmignore`), which has nothing to do with
   the licence. `npm ci` prints `3 vulnerabilities (1 moderate, 2 high)` and `install-scripts` warnings for `esbuild`
   and `fsevents`. Both come from `package-lock.json`, which is unchanged, so they predate this ticket (QE-169-e).
3. **Does the credit wording match ADR-0044 D13? Yes, word for word.** After joining lines and collapsing whitespace,
   `src/evaluate.ts:16-20` equals D13's blockquote (`### D13`, "The Michniewski tables stay as they are") in the ADR
   at the tip and at `main` `a326c5b8`. It also equals the ticket's Scope 2 quote. Neither carries `See NOTICE.`
4. **Does the waiver grep hold? Yes.** `git diff --name-only 849d7f92...344a4128 | grep -v '\.test\.ts$' | grep '^src/'`
   prints only `src/evaluate.ts`, and A3 covers that file. Per commit: `b3fecb1b` (`package.json`,
   `src/evaluate.ts`), `4a0a075f` (`src/evaluate.ts`), `2b91d401` (the merge, with no `src/` file against its first
   parent) and `344a4128` (only `src/cli.test.ts`, which the grep filters out). **UAT: WAIVED (waived is not
   accepted).**

Also checked: `git merge-tree --write-tree main 344a4128` exits 0 against `main` `a326c5b8`. Main has touched no
`package.json`, `src/`, `tools/` or lock file since the base. No `ABC-168` or `ABC-172` branch exists yet.

## Findings

- **QE-169-a, LOW (gap, residual).** No test pins the value of `license`. A10 checks key names only. Mutant
  `"license": "MIT"` passes the whole default lane (exit 0, 58 files, 1830/1830). Mutant `"license": ""` passes the
  ABC-042 rows. The key-spelling mutant (`"licence"`) and `"private": false` each turn one row red. So only this
  hop's reading checks A1's value, and later edits to it would go unnoticed. The ticket rules out a new test
  (Out of scope: *"including a new test for the `license` key"*), so this is not a delivery defect. BA/PM can cut a
  value pin, or the owner can accept the gap as a residual.
- **QE-169-b, LOW (observation, doc coherence).** The header now says the tables are Michniewski's values,
  "unchanged". Three comments in the same file still say the reverse: `:12` *"Every number below is HAND-TUNED and
  expected to move"*, `:58` *"Deliberately small and hand-written"* and `:145` *"Hand-tuned like everything
  above"*. Two test comments do too: `src/evaluate.pawns.test.ts:4` and `src/evaluate.king-mobility.test.ts:4`.
  The ticket fences `:12` by name (coding rule 9). A3 and A5 fence the other lines in effect, because only header
  lines may change. A reader now sees two claims that contradict each other. If BA/PM wants this fixed, it needs
  its own comment-only ticket.
- **QE-169-c, INFO.** A10's name and its first comment (*"package.json gains exactly one scripts key and nothing
  else"*) now describe history. `AT_HEAD` includes a key that ABC-042 did not add. The ticket fences the name and
  the comments (Scope 4). This is noted only so that ABC-168's rebase, which adds `"bin"` to the same array, does
  not read the name as a contract.
- **QE-169-d, INFO, `UNKNOWN - verify`.** The credit says the values are unchanged. `PIECE_VALUE` (100, 320, 330,
  500, 900, with king 0 and not 20000) and all six tables, including the middle-game king table, match the
  Simplified Evaluation Function values as this QE recalls them. I did not fetch the primary page
  (chessprogramming.org), so this is a recollection, not a verified comparison. The transpile identity shows only
  that no value moved in this diff.
- **QE-169-e, INFO (pointer).** `npm ci` warns about `3 vulnerabilities (1 moderate, 2 high)` and unapproved
  `install-scripts` (`esbuild`, `fsevents`). Both come from the unchanged lock file, so they predate ABC-169. They
  belong to the Security/NFR lane (see `secnfr-ABC-169`) and are not a QE finding against this ticket.

**Verdict: PASS_WITH_GAPS.** A1-A6 hold, and the comment-only claim holds on both checks. QE-169-a and QE-169-b are
LOW and do not block. The rest is INFO.

## Commands run (in `../wt-qe-ABC-169`, detached at `344a4128` except the base run)

`git worktree add --detach ../wt-qe-ABC-169 344a4128`; `npm ci`; `git diff` (`--name-only`, `--numstat`, `-U0`,
`-- tools package-lock.json`) `849d7f92 HEAD`; `git ls-files 'LICENSE*' 'NOTICE*' 'COPYING*'`;
`npm pkg get private license`; `npm ls --depth=0`; `npm pack --dry-run --json`; npm's
`@npmcli/package-json` `normalizeData` on the base and tip manifests (script in session scratch);
`ts.transpileModule` on base and tip `src/evaluate.ts`, plus a sanity probe and a planted mutant (script in session
scratch, copied into the worktree only to resolve `typescript`, then deleted); `npm run -s lint|typecheck|build`;
`npm test` four times (tip run 1, armed, MIT mutant, tip run 2) and once at base via `git checkout --detach 849d7f92`;
`npx vitest run src/cli.test.ts -t 'ABC-042'` for each of four manifest mutants; `test-skip-integrity.js`;
`git merge-tree --write-tree main 344a4128`; `git worktree remove ../wt-qe-ABC-169`. After each mutant I restored
`package.json` and checked its md5.

## Notes not published

This repo has no `scripts/context-io.ts`, and no `propose_note` tool reached this agent. WF16 forbids hand-writing
`.grugops/context/`, so the payloads are listed here for a hop that has the writer to admit:

- `observation`: A1-A6 hold at `344a4128`. Unit 1830/1830 at the tip (two runs) and at the base. The pin is armed (A10 is the only red row). refs ABC-169, ABC-042 A10.
- `observation`: A3 transpile identity: sha256 `629c825d…7705`, 9014 bytes at both ends; a planted mutant breaks it. refs ABC-169 A3, owner Q4 `…5c8e2a17`.
- `observation`: QE-169-a (license value unpinned; the MIT mutant survives the default lane). refs ABC-169 A1, ABC-042 A10.
- `observation`: QE-169-b (HAND-TUNED and hand-written comments contradict the credit). refs ABC-169 Scope 2, Out of scope, ADR-0044 D13.
- `artifact-ref`: this file. refs ABC-169, EPIC-007.
- `decision`: verdict PASS_WITH_GAPS. refs ABC-169.

No `finding` note is proposed, because there is no §14-gate stamp.

## Trace row (for the Orchestrator to append; `plans/traceability.md` not touched)

| ABC-169 | EPIC-007 / ADR-0044 D13 | `grugops/ABC-169` @ `344a4128` | QE `qe-ABC-169`: no test added (by scope); A1-A6 re-measured and holding; A3 transpile-identical + `-U0` header-only; pin armed (A10 sole red); unit 1830/1830 tip x2 and base | **PASS_WITH_GAPS** (QE-169-a LOW license value unpinned; QE-169-b LOW hand-tuned/credit comment contradiction; c-e INFO) | UAT WAIVED by A3 (waived is not accepted) → In Security/NFR |

## Fences

I did not touch `plans/board.md`, `plans/traceability.md`, `wt-ABC-146`, `wt-ABC-169`, `wt-ABC-170`, `wt-qe-ABC-170`
or any process from another session. Nothing was committed to `grugops/ABC-169`, pushed, merged or force-pushed. The
scratch worktree has been removed. The board move (In Review → In Security/NFR) is recommended, not made: the board
belongs to the Orchestrator.
