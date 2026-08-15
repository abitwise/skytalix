---
id: 20260816T023100Z-software-engineer-observation-the-gate-and-the-four-mutants-with-vacuity-shown-red-first-9f3e88d1
kind: observation
by: software-engineer
at: 2026-08-16T02:31:00Z
verified_by: 
confidence: high
refs:
  - ABC-065
  - src/cli.test.ts
  - AGENTS.md
  - plans/tickets/ABC-065-agents-md-dev-run-omits-the-separator-and-its-option-list-is-unchecked.md
supersedes: 
---

# `ABC-065` half 2 — the gate, and the mutant campaign, in the order it was actually run

Machine: **Apple M3, Darwin 25.5.0, Node v24.12.0, npm 11.7.0.** Branch
`grugops/ticket-to-pr-ABC-065-scribe` (CONTINUED, not re-branched), in a **linked `git worktree`**
at `…/scratchpad/wt-abc065-guard`. The shared checkout holds `main` @ `4e196a3` and **was not
moved**. `node_modules` was **SYMLINKED to the shared tree's** rather than reinstalled — `npm
install` was NOT run, so no manifest and no lockfile could be touched by this hop
(`ls -L node_modules | wc -l` = **94**, the same 94 the shared tree has).

## The merge that had to happen first

`main` @ `4e196a3` merged into the branch at **`9490740`**, to pick up `ABC-066`'s four helpers
(merged to `main` at `aec9911`). **One conflict, and it was pure process substrate:** a
rename/rename on `.grugops/queue/…/ticket-to-pr-ABC-065-scribe.md` — my branch still had the Scribe's
subtask under `claimed/`, `main` had drained it to `done/`. **Resolved in `main`'s favour** (the
Orchestrator's drain is authoritative); `git diff main -- .grugops/queue/` after the resolution is
**empty**. **`src/cli.test.ts` and `src/cli.ts` merged cleanly with no conflict** and landed at
`main`'s blobs exactly.

## The order matters, so it is recorded as an order

The subtask's stop condition reads: *"Your guard passes on the current `AGENTS.md` before you have
seen it red on a mutant → stop."* So:

1. guard written;
2. **`npm run typecheck` only** (exit **0**) — run deliberately INSTEAD of the suite, so that a red
   in step 3 could not be a compile error wearing an assertion's clothes;
3. **mutants — all RED**;
4. only then the suite green.

**At no point was this guard seen green before it was seen red.**

## The mutants — four, every one RED, each naming which row caught it

Method: mutate `AGENTS.md` only, `npx vitest run src/cli.test.ts`, `git checkout -- AGENTS.md`.
**Every mutant was reverted and the file verified pristine afterwards.**

| # | mutant | result | which assertion redded |
|---|---|---|---|
| **`V`** | **the separator STRIPPED — `AGENTS.md` exactly as `ABC-065` found it** | **RED** 1 failed / 31 | `expect(slot).toContain(SEPARATOR_FORM)` — **the vacuity precondition, `Q2`'s row** |
| **`A4`-1** | **`--difficulty` ADDED to the slot's option list** | **RED** 1 failed / 31 | the both-ways set equality: `['--ascii','--colour',…(2)]` vs `['--ascii','--colour','--unicode']` |
| **`A4`-2** | **`--unicode` DELETED from the slot** | **RED** 1 failed / 31 | the **count floor**: `documented options ["--colour","--ascii"]: expected 2 to be greater than or equal to 3` |
| `C` | `--unicode` **swapped for** `--difficulty` — **count held at 3** | **RED** 1 failed / 31 | the set equality alone — **proves the equality is live independently of the floor**, and that `A4`-2's red is not the floor masking a dead comparison |

**`A4` is MET in both directions.** Mutant `C` is mine, not the criterion's: `A4`-2 redded on the
floor, which would have left open the question of whether the equality row does any work on its own.
It does.

**Every mutant was re-run AFTER `biome --write` reflowed two assertions**, because the first campaign
predated the format fix and a formatting change is still a change to the file under test. **All four
red again, on the same assertions.** Recorded rather than assumed.

## The vacuity proof, in full, because it is the thing that was asked for

Mutant `V` is not a synthetic mutation — it is the **restoration of the defect**, and this is the
failure message:

```
AssertionError: the separator form in the `Dev / run` slot:
  expected '- Dev / run: `npm run chess` <!-- verified 2026-08-14 at ABC-042: …'
  to contain 'npm run chess -- '
 ❯ src/cli.test.ts:917:64
```

Without that one line the block would have gone **green** on it: `advertisedTextOf` would have
returned a corrupted stem silently, and `resolveOptions` of what it yielded is `ok: true`. **The
guard is red on the defect it exists to catch. It is not vacuous.**

## Terminal gate: **GREEN**. `self_fix_attempts` used: **1 of 2**

| step | command | result |
|---|---|---|
| lint | `npm run lint` (`biome check .`) | **exit 0**, 54 files, 52 ms, **no fixes applied** |
| typecheck | `npm run typecheck` (`tsc --noEmit`) | **exit 0**, no diagnostics |
| unit | `npm test` (`vitest run`) | **exit 0 — 859 passed (859) on 30 files (30 passed)**, 1.49 s |
| build | `npm run build` (`tsc --noEmit`) | **exit 0** |
| skip count | `npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | **0** |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **`No findings.`**, exit **0** |
| auto-UAT oracles | `node scripts/check-uat-oracles.js` | **`UNKNOWN - verify`** — the script does not exist in this repository |
| e2e | `AGENTS.md` § E2E slot | **`UNKNOWN - verify`** as the slot itself records; no UI surface |

**857 → 859: exactly the two rows this hop added.** The two `UNKNOWN - verify` rows are non-blocking
by Workflow 05's own words and neither is in `quality.mandatory_gates`; **neither is recorded as a
pass.**

**The one self-fix:** the first `npm run lint` exited **1** on **formatting only** — biome wanted two
of my assertions reflowed across lines. `npx biome check --write src/cli.test.ts` fixed 1 file
(`lint.autofix` is `true` in `.grugops/factory.config.json`); re-lint exit **0**. **No lint rule was
disabled, no assertion changed meaning, and `git status --porcelain` after the autofix showed exactly
one path.** That is the whole of the budget spent.

## `A6`'s protected substance, measured on the delivered commit

- **0 paths under `src/` other than `src/cli.test.ts`; 0 production lines; 0 new files.**
- **`spawned` still 10** — `expect(spawned).toBe(10)` at `:836` passed in the green suite, and
  `CHILDREN` has exactly **10** entries. This hop's guard reads `AGENTS.md` with `readFileSync` and
  spawns nothing. **10 → 10.**
- suite **green**, skip **0**.

## The documented command, RUN rather than trusted

`AGENTS.md` § Commands forbids recording a command nobody ran, and the Scribe recorded this one at
`4e9ed1d`. Re-run here at the merge tip because the merge moved the tree under it:

```
$ npm run chess -- --colour black
> node src/cli.ts --colour black          <- the flag REACHED the program
1 .R:N.B:K.Q:B.N:R                        <- rank 1 on top: black-bottom, as documented
exit 0
```

**Evidence, not a guard** — the ticket puts the end-to-end run in the UAT pack, and no test row of
mine asserts it.
