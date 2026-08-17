---
id: 20260816T170000Z-orchestrator-observation-gate-re-run-and-scope-re-measured-4b8ee1c2
kind: observation
by: orchestrator
at: 2026-08-16T17:00:00Z
verified_by: 
confidence: high
refs:
  - plans/tickets/ABC-068-shared-test-helpers-have-no-written-contracts.md
  - src/cli.test.ts
  - 30ea8f3e21c34996feba2f315a0f3b114d2285b1
supersedes: 
---

# `ABC-068` — the gate re-run BY ME, and the scope re-measured from git rather than from the report

The engineer is the party with an interest in the answer, so none of this is relayed. Branch tip
`35d6fe4`; delivered commit `30ea8f3`.

## The gate, on the branch tip

| gate | command | result |
|---|---|---|
| lint | `npm run lint` | `Checked 54 files in 123ms. No fixes applied.` exit 0 |
| typecheck | `npm run typecheck` | no output, exit 0 |
| build | `npm run build` | no output, exit 0 |
| unit | `npm test` | `Test Files 30 passed (30)`, `Tests 861 passed (861)`, exit 0 |
| skip count | `npx vitest run --reporter=json \| jq …` | **0** |
| test integrity | `node tools/grugops/test-skip-integrity.js … --skip-count 0` | `No findings.` exit 0 |

## `A5`'s two numbers, both measured by me

The criterion compares before and after, so I measured the before rather than quoting it — including
rather than quoting the `861` in my own earlier note, which would have made this a relay.

`main` @ `f566304` was checked out into a throwaway worktree and run: **861 passed (861), 30 files**.
Branch tip: **861 passed (861), 30 files**. **Equal.** Worktree removed.

**0 changed executable lines**, confirmed mechanically rather than by the suite staying green:
`git diff -U0 main..<tip> -- src/cli.test.ts | grep '^+[^+]' | grep -vE '^\+\s*(//|\*|/\*\*)'`
returns **nothing**. The three removed lines are all comment lines, printed and read.

## Scope, re-measured from git

- **`A7` — ONE path.** `git diff --name-only 30ea8f3~1 30ea8f3`, excluding `.grugops/`, is exactly
  `src/cli.test.ts`. **0** other files under `src/`. `spawned` still **10** by the live assertion at
  `:862`.
- **No merged criterion was touched.** Removed lines containing `expect(`: **0**. `it(`: **0**.
  `describe(`: **0**.
- **`A6` — 1.** The file-wide count of the separator literal is still **1**, read off the delivered
  blob. Over the ADDED lines only: `--ascii` 0, `--unicode` 0, `--colour` 0, `white` 0, `black` 0,
  `random` 0, bare `--` 0. The identifier `SEPARATOR_FORM` appears in prose; the literal does not.
- **`A4` — 0 disagreements.** The header line now names all four shared names and carries no count.
- **`A1` — 2 of 2** and **`A2` — 3 of 3**, read at all five sites. Call site 2 was correctly located
  at **`:948`** (as `:976` in the delivered blob after the added lines), never at the page's `:923`.
  The five-line explanation already at that site was NOT rewritten — the added line sits above it.
- **`A3` — MET**, in `advertisedTextOf`'s doc comment, naming `ABC-066`'s merged gated semantics as
  what forbids unifying. It is in the helper block, not appended to a merged guard's comment.

## One deviation in the letter of `## Test notes` 4, reported rather than glossed

`Test notes` 4 says do not re-flow the block. Replacing the header sentence forced **one merged line**
to be re-split: the clause *"`ABC-065`'s guard block lands in this file next and its"* now begins a
new line instead of continuing the old one. **Its bytes are unchanged and no other line of the merged
prose moved** — the three-line sentence `A5`'s guard is about is untouched.

I accept it. The rule's stated purpose is that an honest zero-behaviour-change diff stays readable,
and this diff is three removed comment lines and a readable block of added ones. **Recording it
because the engineer's own report did not name it as a deviation, and a hop that only reports the
deviations it was asked about is not reporting.**

## The engineer's judgement call, ratified

Replacing "THESE TWO HELPERS ARE THE SHARED ONES" orphaned the antecedent of a later merged sentence
("Neither spells any accepted argument…"). The engineer did NOT edit that merged sentence — it named
the antecedent inside its own added lines instead, and the merged sentence is byte-identical. **That
is the right call and it is ratified here.** Rewording the merged sentence is a separate decision and
was correctly not taken.

## What is NOT closed, and is nobody's to close quietly

`advertisedTextOf` still returns a meaningless value silently. **That is the instructed outcome**, not
an oversight — the ticket's `## Out of scope` forbids the fix and requires a hop to say so rather than
do it. The engineer said so. **It is not ticketed, and cutting that ticket is BA/PM's, not mine.**
The argument a future hop will need is in the engineer's `decision` note: both current callers assert
first, so a throw would today be unreachable from either — the value appears only once a third caller
exists, which is exactly when `ABC-061` or `ABC-062` lands.

## Verdict

**`A1`–`A7` all MET, every number verified independently. The gate is green on the branch tip.
NOT merged — the merge waits on the UAT question below, which is the owner's.**
