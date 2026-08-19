---
id: 20260820T111000Z-software-engineer-artifact-ref-what-this-hop-touched-and-what-it-refused-f5a6b7c8
kind: artifact-ref
by: software-engineer
at: 2026-08-20T11:10:00Z
verified_by:
confidence: high
refs:
  - ABC-043
  - ADR-0015
  - NFR-008
supersedes:
---

# What this hop touched, and the list of things it deliberately did not

## Touched

- **`src/cli.test.ts`** — the only file in the delivered diff. `+259 / −36`.
  - `withoutStringText` and `windowOf` added beside `executableCodeOf`, under one comment block that
    states the rule they exist to hold.
  - `describe("this file's own instruments")` → one row,
    `the instruments themselves are not blind — every derived view is WATCHED losing its evidence`.
  - the substitution rig's `THE LIMITS THIS FILE HONOURS` block rewritten to state `ADR-0015`
    (S)/(C) and BA/PM's (N1)–(N3) as the rule, and to record that `./command-input.ts` is refused.
  - `CHILDREN.parserBug` (which substituted `./command-input.ts`) **deleted**;
    `CHILDREN.inputSeamThrows` (which substitutes `./line-input.ts`) added.
  - `A8` — the blanker replaced by `withoutStringText`; the transcribed expectation unchanged.
  - `A1` — the slice replaced by `windowOf`, plus a non-vacuity clause.
  - `G6` — a fourth clause, over the same window.
  - `A3` — the prompt witness removed (it would be the double's output), the two exit codes pinned by
    value.
  - `A4` — its `crashed` child renamed to the new one.
- **`.grugops/queue/claimed/abc043-repair/`** — the claim, taken by a bare `mkdir`. Its `claim.md`
  records that the `mkdir` was run **after** the work, not before.
- **`.grugops/queue/pending/abc043-repair.md` → `.grugops/queue/done/`**.
- **These notes.**

## NOT touched, and each was a live temptation

- **`src/cli.ts`** — byte-identical to `main`'s. Exports **0**, as `ADR-0011` clause 4 requires.
  `git diff --name-only main HEAD` filtered to production `src/` files returns **0 lines**.
- **The seven merged modules** — byte-identical.
- **`plans/board.md`**, the DoR table, `plans/traceability.md`, `plans/tickets/ABC-043-*.md` — the
  ticket's own `## The (N) limit` section is BA/PM's and I did not write into it.
- **`ADR-0015`** — not amended, not widened. Neither clause 2 nor the (S)/(C) test was reached for.
- **`ABC-033` / `035` / `037` / `078`** — not re-opened. `./command-input.ts` is `ABC-035`'s and
  nothing here questions what it shipped; only whether a test may rewrite it.
- **`vitest.config.ts`** — the `isolate: false` lever is still not taken.

## Refused, or handed back rather than absorbed

- **`G-06`** — no criterion runs the real engine end to end. Declared, out of brief, BA/PM's to cut
  as an opt-in lane. **I built nothing for it.**
- **`ABC-019` `[D31]`'s parser-bug narrative now having no criterion.** Named by BA/PM as a new
  ticket. `ADR-0015` records the same cost. **I did not build around it and I did not cut it.**
- **`NFR-008` / `N8-LANE`.** `ADR-0014` rules the clause breached. My cost is in the `claim` note.
  **I did not grade it.**
- **A live-stdin child in the suite.** It would cost a spawn against `N8-SPAWN`'s pin of 17, and —
  measured at this hop — the delivered build sits on a held-open FIFO too, correctly, so *"it hangs"*
  is not a discriminator. Reasoning and the numbers are in the `observation` note.
- **A second double in any criterion.** (N3). Not added anywhere.

## Commands run, exactly as they ran

```
npm install                                                   # contained lane, own node_modules
npm test                                                      # 1189 -> 1190 passed / 39 files
npx vitest run src/cli.test.ts                                # 50 -> 51 passed
npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'   # 0
node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0
npm run lint ; npm run typecheck ; npm run build              # all exit 0
PERFT_DEEP=1 npx vitest run src/perft.test.ts                 # 32 passed / 32
node src/cli.ts --colour purple </dev/null ; echo $?          # 1
node src/cli.ts </dev/null ; echo $?                          # 0
```

Six mutants were applied to `src/cli.ts` and reverted; their diffs and results are in the
`observation` note. `src/cli.ts` is byte-identical to `main`'s at the end of this hop —
`git status` is clean.

## Branch

`grugops/abc043-repair`, off `main` @ `586f3bd`. **Not merged.** Commits on the branch only; nothing
was committed to `main`.
