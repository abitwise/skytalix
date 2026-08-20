---
id: 20260820T191500Z-software-engineer-observation-the-gate-verbatim-and-the-one-red-that-is-the-environment-not-the-diff-7be24f10
kind: observation
by: software-engineer
role: software-engineer
task: ticket-to-pr-ABC-044-2026-08-20
at: 2026-08-20T19:15:00Z
verified_by:
confidence: high
refs:
  - ABC-044
  - ABC-044/A7
  - NFR-008
  - N8-LANE
supersedes:
---

# The gate, run and transcribed — and the one RED, which is the working directory rather than this diff

**NO `finding` IS AUTHORED AND NO `§14-gate#<id>` STAMP IS CLAIMED.** `context.human_admission` is
`off`, `scripts/context-io.ts` and `mcp__grugops__propose_note` are absent from this install, so
there is no sanctioned writer and no stamp issuer. This is an `observation`: it records commands and
their exit codes. **The gate VERDICT is QE's to earn at the `qe-e2e` hop, not mine to declare.**

## What was run, verbatim, at the branch tip

| command | exit | output |
|---|---|---|
| `npm run typecheck` (`tsc --noEmit`) | **0** | (silent) |
| `npm run build` (`tsc --noEmit`) | **0** | (silent) |
| `npm test` (`vitest run`) | **0** | `Test Files 1231 passed (1231)` / `Tests 36460 passed (36460)`, 61.66 s |
| `npx vitest run --dir src` | **0** | `Test Files 40 passed (40)` / `Tests 1207 passed (1207)`, **2.69 s** |
| `npx vitest run --dir src --reporter=json \| jq '.numPendingTests + .numTodoTests'` | **0** | `0` |
| `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **0** | `No findings.` |
| `npx biome check src/` | **0** | `Checked 68 files in 74ms. No fixes applied.` |
| `npm run lint` (`biome check .`) | **1** | **RED — see below. Not this diff.** |

## The one RED, measured on `main` as well as on the branch

`npm run lint` is `biome check .` — **unscoped over the working directory**. This checkout carries
**32 live agent worktrees** under `.claude/worktrees/`, each a sub-checkout of this same repository
carrying its own `biome.json`. Biome 2.5.5 refuses each of them:

> `Found a nested root configuration, but there's already a root configuration.`

**It is pre-existing and it is not caused by this ticket.** Measured by stashing the whole diff and
running the same command against the clean tree: **exit 1, identically.** `.claude/worktrees/` is
`.gitignore`d ("agent worktrees — live sub-checkouts, never part of this repo"), so **nothing in the
delivered diff is in scope for that failure and no committed file can fix it.**

**The same pollution inflates `npm test`.** Vitest's root scan walks those 32 worktrees, which is why
the whole-repo run reports **1231 files / 36460 tests** where this tree has **40 / 1207**. Every one
of the 1231 passed, so nothing is hidden by it — but **the number to quote for this ticket is 40
files, 1,207 tests, 0 skipped, 2.69 s.**

**Recorded, not repaired.** Deleting another agent's live worktree is destructive and outside this
ticket's scope; adding a `files.includes` exclusion to `biome.json` would be a config change no
criterion asks for and would edit a file `A7` does not list. **It is escalated as an
environment/install matter**, the same class as the missing `scripts/context-io.ts`.

## `N8-LANE`, the ticket's own bar

Inherited by name: **≤ 650 ms CPU** for the lane this ticket adds. `src/result-screen.test.ts` is
**13 tests in 16 ms of test time** on its own run — pure functions over hand-built values plus two
41-ply replays. **Two orders of magnitude under the bar**, and the ticket's ≈160 ms estimate was
pessimistic. The whole `src/` lane is 2.69 s wall against `NFR-008`'s 13 s clause.

`src/cli.test.ts` gained **four rows and zero children.** `spawned` is still **17** and
`Object.keys(CHILDREN)` is still **17** — both pins are asserted in that file and both are green.

## `A7`, measured

```
$ git diff --numstat 30482cd -- src/
116     1       src/cli.test.ts
15      1       src/cli.ts
281     0       src/result-screen.test.ts
172     0       src/result-screen.ts

$ git diff --numstat 30482cd -- src/gameend.ts src/turn-loop.ts src/history-pane.ts src/frame.ts
(empty)
```

**The four named files are byte-identical.** The fourth entry, `src/cli.test.ts`, is the ticket's own
`## Lane cost`: *"`A6` and `A7` extend `ABC-042`'s existing entry-point file and add no file."*
Suite green, **skip 0**.

## Two red builds watched before the green one — the criteria are not vacuous

`quality.tdd` is `encouraged` and the double loop was run. Three constructed wrong builds, each
mutated in the delivered module and each watched going RED, then reverted:

| constructed build | rows that went red |
|---|---|
| `fivefold` → `"by repetition"`, `threefold` → `"by repetition (claimed)"` — the ticket's own named wrong build | `A1` naming, `A2` claimed/automatic |
| `pairs.slice(-8)` — the history pane's 8-row window applied to the full list | all four `A5` rows |
| move number from `pairs.length + 1` instead of `position.fullmoveNumber` | `A5`'s black-to-move anchor row |

The third is the one that matters: it is **green on every other row in the file**, including the
41-ply exact-token comparison, and only the black-to-move anchor sees it. **That is what the stop
condition about the anchor was protecting**, and it is now witnessed rather than asserted.
