---
id: 20261018T124600Z-qe-e2e-observation-abc169-acceptance-readings-9b0bf9ae
kind: observation
by: qe-e2e
task: qe-ABC-169
at: 2026-10-18T12:46:00Z
verified_by:
confidence: high
refs:
  - ABC-169
  - ABC-042
  - EPIC-007
  - plans/tickets/ABC-169-declare-the-engine-private.md
  - .grugops/queue/done/ticket-to-pr-ABC-169-redo.md
  - .grugops/queue/done/qe-ABC-169.md
supersedes:
---

# ABC-169 readings at `344a4128` (base `849d7f92`): A1-A6 hold, unit 1830/1830 at tip x2 and at base, the pin is armed

Hand-authored and unsealed (`AGENTS.md`: no `finding` is admissible on this install). No timing was read
(`secnfr-ABC-169` and `qe-ABC-170` ran beside this hop). Every reading was taken by this hop in a scratch worktree
`../wt-qe-ABC-169` (detached at `344a4128`, now removed), after `npm ci` exit 0. npm 11.20.0, node v26.11.1.

- **A1.** `npm pkg get private license` printed `{ "private": true, "license": "UNLICENSED" }`, exit 0, with an empty
  stderr. The `package.json` diff is one `+` line, `+  "license": "UNLICENSED",`, and has no `-` line. The
  `package-lock.json` diff is empty.
- **A2.** The block runs from `/**` at line 1 to ` */` at line 21, and `import {` is at line 23 (`} from "./position.ts";` is
  at line 36). In lines 1-21, each of `Michniewski`, `Simplified Evaluation Function`,
  `https://www.chessprogramming.org/Simplified_Evaluation_Function`, `CC BY-SA 3.0` and `The values are unchanged`
  appears exactly once. The credit at `:16-20`, with whitespace collapsed, equals ADR-0044 D13's blockquote (at the tip and at
  `main` `a326c5b8`) and the ticket's Scope 2 quote.
- **A3.** See `…fc56e5fd`.
- **A4.** `git ls-files 'LICENSE*' 'NOTICE*' 'COPYING*'` printed 0 lines.
- **A5.** `--name-only`: `package.json`, `src/cli.test.ts`, `src/evaluate.ts`. `--numstat`: `1 0`, `1 0`, `6 0`. The test
  line is `+      "license",`, inside `AT_HEAD`, after `"private",`. `git diff -- tools package-lock.json` is 0 bytes.
- **A6.** lint, typecheck and build exit 0. `npm test` at the tip, run 1 and run 2: exit 0, 58 files, 1830/1830,
  `last-run.json` `success:true`, pending 0, todo 0. At base `849d7f92` (this hop's own run): exit 0, 1830/1830, so the
  count is the same. No run hit the 60 s bound. No file added. `test-skip-integrity.js --skip-count 0`: `No findings.`
- **Armed.** With only the `license` line deleted (`0 1 package.json`), `npm test` exited 1, with 1 failed out of 1830. The
  only non-passed row was `ABC-042 … A10 — package.json gains exactly one scripts key and nothing else`. The file was
  restored, and its md5 matched the tip.
- **Waiver grep.** `git diff --name-only 849d7f92...344a4128 | grep -v '\.test\.ts$' | grep '^src/'` printed only
  `src/evaluate.ts`, which A3 covers.
- **npm warnings.** npm's normaliser (`@npmcli/package-json` `normalizeData`) reports `No license field.` at base and
  not at the tip. The `npm ci` audit and install-scripts warnings come from the unchanged lock file.
- `git merge-tree --write-tree main 344a4128` exit 0 (main `a326c5b8`).
